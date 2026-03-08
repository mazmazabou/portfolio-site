import { Link } from "wouter";
import { ArrowLeft, Download, Play, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

type CellState = "idle" | "running" | "done";

const notebookCells = [
  {
    id: 1,
    name: "Data Cleaning",
    code: `# Load raw data
df <- read.csv("./College_Scorecard_Raw_Data/MERGED2023_24_PP.csv")

# Keep 4-year institutions, non-missing retention, and UGDS >= 100
df_clean <- df[
  df$ICLEVEL == 1 &
    !is.na(df$RET_FT4) &
    df$UGDS >= 100,
]

# Construct low-income net price using public vs private columns
df_clean$low_income_np <- ifelse(
  df_clean$CONTROL == 1,
  df_clean$NPT41_PUB,
  df_clean$NPT41_PRIV
)
df_clean <- df_clean[!is.na(df_clean$low_income_np), ]

# Treatment: high aid = low net price (bottom half)
median_np <- median(df_clean$low_income_np, na.rm = TRUE)
df_clean$high_aid <- as.integer(df_clean$low_income_np <= median_np)

# Keep complete cases on core variables
vars_core <- c("RET_FT4", "high_aid", "CONTROL", "ADM_RATE", "SAT_AVG", "UGDS")
df_clean <- df_clean[complete.cases(df_clean[, vars_core]), ]

table(df_clean$high_aid)
nrow(df_clean)`,
    outputType: "text" as const,
    output: `> table(df_clean$high_aid)
  0   1
490 556

> nrow(df_clean)
[1] 1046`,
  },
  {
    id: 2,
    name: "Define Controls",
    code: `# Choose a rich set of candidate controls
covariate_candidates <- c(
  "CONTROL",    # institution control type (public/private/for-profit)
  "PREDDEG",    # highest degree primarily offered
  "REGION",     # geographic region
  "LOCALE",     # campus setting (city/suburb/town/rural)
  "ADM_RATE",   # admission rate
  "SAT_AVG",    # average SAT score
  "UGDS",       # total undergrad enrollment
  "UGDS_BLACK", # share of undergrads who are Black
  "UGDS_HISP",  # share Hispanic/Latino
  "UGDS_ASIAN", # share Asian
  "UGDS_MEN",   # share male
  "UG25ABV",    # share age 25+
  "PPTUG_EF",   # share attending part-time
  "PCTPELL",    # share receiving Pell Grants
  "PCTFLOAN",   # share receiving federal loans
  "COSTT4_A",   # average annual cost of attendance
  "INEXPFTE",   # instructional expenses per FTE
  "PFTFAC",     # share of faculty who are full-time
  "AVGFACSAL"   # average faculty salary
)

# Keep only variables that exist and are not all NA
nonempty_controls <- covariate_candidates[
  colSums(!is.na(df_clean[, covariate_candidates])) > 0
]
length(nonempty_controls)`,
    outputType: "text" as const,
    output: `> length(nonempty_controls)
[1] 19

CONTROL, PREDDEG, REGION, LOCALE, ADM_RATE, SAT_AVG, UGDS, UGDS_BLACK, UGDS_HISP, UGDS_ASIAN, UGDS_MEN, UG25ABV, PPTUG_EF, PCTPELL, PCTFLOAN, COSTT4_A, INEXPFTE, PFTFAC, AVGFACSAL`,
  },
  {
    id: 3,
    name: "OLS Baseline",
    code: `# Build formula: RET_FT4 ~ high_aid + controls...
ols_formula <- as.formula(paste(
  "RET_FT4 ~ high_aid +",
  paste(nonempty_controls, collapse = " + ")
))

ols <- lm(ols_formula, data = df_clean)
summary(ols)`,
    outputType: "table" as const,
    output: null,
    tableData: {
      headers: ["", "Estimate", "Std. Error", "t value", "Pr(>|t|)"],
      rows: [
        ["high_aid", "0.008163", "0.005459", "1.495", "0.1352"],
        ["ADM_RATE", "-0.0466", "0.0154", "-3.028", "0.0025"],
        ["SAT_AVG", "0.000215", "0.0000249", "8.639", "< 2e-16"],
        ["PCTPELL", "-0.1256", "0.0254", "-4.943", "9.3e-07"],
        ["INEXPFTE", "1.03e-06", "1.78e-07", "5.803", "8.7e-09"],
        ["", "", "", "", ""],
        ["R\u00B2", "0.6496", "Adj R\u00B2", "0.6428", "n = 1,046"],
      ],
    },
  },
  {
    id: 4,
    name: "Causal Forest (grf)",
    code: `library(grf)

Y <- df_clean$RET_FT4
W <- df_clean$high_aid
X <- as.matrix(df_clean[, nonempty_controls, drop = FALSE])

keep_grf <- complete.cases(cbind(Y, W, X))
Y_grf <- Y[keep_grf]
W_grf <- W[keep_grf]
X_grf <- X[keep_grf, , drop = FALSE]

set.seed(0)
cf <- causal_forest(X_grf, Y_grf, W_grf)

# Overall ATE
average_treatment_effect(cf)

# ATT (treated institutions only)
average_treatment_effect(cf, target.sample = "treated")`,
    outputType: "table" as const,
    output: null,
    tableData: {
      headers: ["Estimand", "Estimate", "Std. Error", "95% CI"],
      rows: [
        ["ATE", "0.01858", "0.00453", "[0.0097, 0.0275]"],
        ["ATT", "0.01843", "0.00658", "[0.0055, 0.0313]"],
      ],
    },
  },
  {
    id: 5,
    name: "Propensity Score Trimming",
    code: `# Trim to 0.175–0.9 for overlap
p_hat <- cf$W.hat
keep_trim2 <- p_hat >= 0.175 & p_hat <= 0.9

Y_trim2 <- Y_grf[keep_trim2]
W_trim2 <- W_grf[keep_trim2]
X_trim2 <- X_grf[keep_trim2, , drop = FALSE]

set.seed(0)
cf_trim2 <- causal_forest(X_trim2, Y_trim2, W_trim2)

tau_all2     <- average_treatment_effect(cf_trim2)
tau_treated2 <- average_treatment_effect(cf_trim2, target.sample = "treated")`,
    outputType: "text" as const,
    output: `Before trimming: 1,040 observations
After trimming (0.175–0.9): 811 observations

Trimmed ATE: 0.01804, SE: 0.00501, 95% CI: [0.0082, 0.0279]
Trimmed ATT: 0.01779, SE: 0.00694, 95% CI: [0.0042, 0.0314]

Both estimates remain positive and statistically significant. The ATE is stable across trimming thresholds, suggesting the result is not driven by extreme-propensity units.`,
  },
  {
    id: 6,
    name: "Propensity Score Diagnostics",
    code: `# Side-by-side histograms: before vs after trimming
par(mfrow = c(1, 2))

hist(p_hat, breaks = 20,
     main = "Propensity scores (full sample)",
     xlab = "Estimated P(high_aid | X)", xlim = c(0, 1))

hist(p_hat[keep_trim2], breaks = 20,
     main = "Propensity scores (trimmed 0.175-0.9)",
     xlab = "Estimated P(high_aid | X)", xlim = c(0, 1))

par(mfrow = c(1, 1))`,
    outputType: "image" as const,
    output: "/images/r-propensity-scores.png",
  },
  {
    id: 7,
    name: "CATE Distribution",
    code: `# Histogram of institution-level treatment effects
cate_trim2 <- predict(cf_trim2)$predictions

hist(cate_trim2, breaks = 30,
     main = "Estimated Treatment Effects (CATEs)",
     xlab = "Effect of high aid on retention",
     ylab = "Number of institutions")`,
    outputType: "image" as const,
    output: "/images/r-cate-histogram.png",
  },
  {
    id: 8,
    name: "Variable Importance",
    code: `# Which covariates drive heterogeneity in the treatment effect?
vi <- variable_importance(cf_trim2)
names(vi) <- nonempty_controls
vi_sorted <- sort(vi, decreasing = TRUE)

barplot(vi_sorted, horiz = TRUE, names.arg = names(vi_sorted),
        las = 1, cex.names = 0.7,
        main = "Variable Importance (Causal Forest)",
        xlab = "Relative importance")`,
    outputType: "image" as const,
    output: "/images/r-variable-importance.png",
  },
  {
    id: 9,
    name: "Heterogeneity Analysis",
    code: `# CATE vs SAT: does aid help more at high- or low-SAT schools?
plot(df_trim2$SAT_AVG, cate_trim2,
     xlab = "Average SAT score",
     ylab = "Estimated treatment effect",
     main = "CATE vs SAT_AVG")
lines(lowess(df_trim2$SAT_AVG, cate_trim2), lwd = 2)

# Also: CATE vs Pell share, CATE vs low-income net price`,
    outputType: "image" as const,
    output: "/images/r-heterogeneity-sat.png",
  },
  {
    id: 10,
    name: "Geographic Distribution",
    code: `library(ggplot2)
library(maps)

us_map <- map_data("state")

ggplot() +
  geom_polygon(data = us_map,
    aes(x = long, y = lat, group = group),
    fill = "gray95", color = "white") +
  geom_point(data = df_clean,
    aes(x = LONGITUDE, y = LATITUDE, color = factor(REGION)),
    alpha = 0.6, size = 1.5) +
  coord_fixed(1.3) +
  theme_minimal() +
  labs(title = "4-Year Institutions in College Scorecard (2023-24)",
       color = "Region")`,
    outputType: "image" as const,
    output: "/images/r-institution-map.png",
  },
];

function NotebookCell({
  cell,
  cellIndex,
  state,
  onRun,
}: {
  cell: (typeof notebookCells)[number];
  cellIndex: number;
  state: CellState;
  onRun: () => void;
}) {
  const lines = cell.code.split("\n");

  return (
    <div className="rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
      {/* Cell Header */}
      <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-muted-foreground flex justify-between items-center border-b border-[#334155]">
        <span>
          {state === "done" ? (
            <span className="text-[#64748B]">In [{cellIndex + 1}]: </span>
          ) : (
            <span className="text-[#64748B]">In [ ]: </span>
          )}
          {cell.name}
        </span>
        <button
          onClick={onRun}
          disabled={state !== "idle"}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
            state === "idle"
              ? "bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/30 cursor-pointer"
              : state === "running"
                ? "bg-[#EAB308]/20 text-[#EAB308] cursor-wait"
                : "bg-[#22C55E]/10 text-[#22C55E]/60 cursor-default"
          }`}
        >
          {state === "idle" && (
            <>
              <Play size={10} fill="currentColor" /> Run
            </>
          )}
          {state === "running" && (
            <>
              <Loader2 size={10} className="animate-spin" /> Running...
            </>
          )}
          {state === "done" && (
            <>
              <Check size={10} /> Ran
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 font-mono text-sm overflow-x-auto text-[#E2E8F0] relative">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#1E293B]/30 border-r border-[#334155]/50 pointer-events-none flex flex-col items-center pt-4 text-xs text-[#64748B]">
          {lines.map((_: string, i: number) => (
            <span key={i} className="leading-6 h-6">
              {i + 1}
            </span>
          ))}
        </div>
        {lines.map((line: string, i: number) => (
          <div key={i} className="pl-8 leading-6 whitespace-pre">
            {line || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Output Area */}
      {state === "running" && (
        <div className="border-t border-[#334155] bg-[#0F172A] px-4 py-3">
          <span className="text-[#64748B] text-xs font-mono">
            <span className="animate-pulse">{"\u2588"}</span>
          </span>
        </div>
      )}

      {state === "done" && (
        <div className="border-t border-[#334155] bg-[#0F172A] px-4 py-4 animate-in fade-in duration-500">
          <div className="text-xs text-[#64748B] font-mono mb-2">
            Out [{cellIndex + 1}]:
          </div>

          {cell.outputType === "text" && (
            <pre className="font-mono text-sm text-[#CBD5E1] whitespace-pre-wrap leading-relaxed">
              {cell.output}
            </pre>
          )}

          {cell.outputType === "image" && (
            <img
              src={cell.output as string}
              alt="R plot output"
              className="max-w-full rounded border border-[#334155]"
            />
          )}

          {cell.outputType === "table" && cell.tableData && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-[#334155]">
                    {cell.tableData.headers.map((h: string) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 text-[#94A3B8] font-medium text-xs"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cell.tableData.rows.map((row: string[], ri: number) => (
                    <tr
                      key={ri}
                      className="border-b border-[#334155]/50 hover:bg-white/5"
                    >
                      {row.map((val: string, ci: number) => (
                        <td
                          key={ci}
                          className={`px-3 py-1.5 ${ci === 0 ? "text-[#94A3B8]" : "text-[#E2E8F0]"}`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CausalForest() {
  const [cellStates, setCellStates] = useState<CellState[]>(
    notebookCells.map(() => "idle")
  );

  const runCell = useCallback(
    (index: number): Promise<void> => {
      return new Promise((resolve) => {
        setCellStates((prev) => {
          const next = [...prev];
          next[index] = "running";
          return next;
        });

        setTimeout(() => {
          setCellStates((prev) => {
            const next = [...prev];
            next[index] = "done";
            return next;
          });
          resolve();
        }, 1500);
      });
    },
    []
  );

  const runAll = useCallback(async () => {
    for (let i = 0; i < notebookCells.length; i++) {
      if (cellStates[i] === "idle") {
        await runCell(i);
      }
    }
  }, [cellStates, runCell]);

  const allDone = cellStates.every((s) => s === "done");
  const anyRunning = cellStates.some((s) => s === "running");

  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Back Link */}
      <div className="pt-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-sm text-primary mb-2">
                ECON 460 — Econometrics & Machine Learning, USC
              </p>
              <h1 className="text-3xl md:text-5xl font-serif text-white">
                Causal Forest — Effect of Financial Aid on Retention
              </h1>
            </div>
            <div className="shrink-0 flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1E293B] text-white/80 border border-white/10 rounded">
                R Markdown
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1E293B] text-white/80 border border-white/10 rounded">
                R
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "R",
              "Causal Inference",
              "Machine Learning",
              "grf",
              "ggplot2",
              "College Scorecard",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-16">
          <p className="text-lg text-white/90">
            This project uses causal forests (Athey & Imbens, 2018) to estimate
            heterogeneous treatment effects of high financial aid on student
            retention across ~1,000 U.S. universities. Built on College
            Scorecard federal microdata with 19 institutional covariates.
          </p>
          <p>
            The pipeline runs from raw data cleaning through OLS benchmarking,
            propensity score trimming for overlap, and full causal forest
            estimation — then digs into what drives the heterogeneity: variable
            importance, CATE distributions, and how the treatment effect varies
            with SAT scores, Pell share, and net price.
          </p>
          <p>
            Built in R using grf (generalized random forests), ggplot2, and base
            R. Causal identification relies on the unconfoundedness assumption
            supported by a rich covariate set.
          </p>
        </div>

        {/* Run All Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={runAll}
            disabled={allDone || anyRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
              allDone
                ? "bg-[#22C55E]/10 text-[#22C55E]/50 cursor-default"
                : anyRunning
                  ? "bg-[#EAB308]/10 text-[#EAB308]/50 cursor-wait"
                  : "bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/30 cursor-pointer"
            }`}
          >
            {allDone ? (
              <>
                <Check size={14} /> All cells executed
              </>
            ) : anyRunning ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Executing...
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" /> Run All
              </>
            )}
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {cellStates.filter((s) => s === "done").length}/
            {notebookCells.length} cells
          </span>
        </div>

        {/* Notebook Cells */}
        <div className="space-y-6 mb-16">
          {notebookCells.map((cell, i) => (
            <NotebookCell
              key={cell.id}
              cell={cell}
              cellIndex={i}
              state={cellStates[i]}
              onRun={() => {
                if (cellStates[i] === "idle") runCell(i);
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
          <a href="/pdfs/ProjectDraft.pdf" download>
            <Button variant="outline" className="font-mono text-xs h-10 px-4">
              <Download className="mr-2 h-3.5 w-3.5" /> Download PDF Export
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
