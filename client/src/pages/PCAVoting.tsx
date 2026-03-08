import { Link } from "wouter";
import { ArrowLeft, Download, Play, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

type CellState = "idle" | "running" | "done";

const notebookCells = [
  {
    id: 1,
    name: "Spam Logit — Full Data",
    code: `set.seed(0)
library(pROC)

spam <- read.csv("spam.csv")

# Fit binary logit on full dataset
logit_full <- glm(spam ~ ., data = spam, family = binomial(link = "logit"))

# Predicted probabilities + 0.5-threshold class predictions
pred_prob_in <- predict(logit_full, type = "response")
pred_class_in <- ifelse(pred_prob_in >= 0.5, 1, 0)

# In-sample classification results
table(True = spam$spam, Predicted = pred_class_in)
mean(pred_class_in != spam$spam)`,
    outputType: "text" as const,
    output: `> table(True = spam$spam, Predicted = pred_class_in)
         Predicted
True        0    1
   0     2669  119
   1      167 1646

> mean(pred_class_in != spam$spam)
[1] 0.0622

In-sample AUC: 0.9825`,
  },
  {
    id: 2,
    name: "In-Sample ROC Curve",
    code: `# In-sample ROC curve
roc_in <- roc(response = spam$spam, predictor = pred_prob_in,
              plot = TRUE, legacy.axes = TRUE, print.auc = TRUE)
title("In-sample ROC (Logit)")`,
    outputType: "image" as const,
    output: "/images/r-roc-insample.png",
  },
  {
    id: 3,
    name: "Out-of-Sample Evaluation",
    code: `# 80/20 train/test split
n <- nrow(spam)
train_idx <- sample(seq_len(n), size = floor(0.8 * n))
train <- spam[train_idx, ]
test  <- spam[-train_idx, ]

# Same logit specification, fit on 4/5
logit_train <- glm(spam ~ ., data = train, family = binomial(link = "logit"))

# Predict on held-out 1/5
pred_prob_oos <- predict(logit_train, newdata = test, type = "response")
pred_class_oos <- ifelse(pred_prob_oos >= 0.5, 1, 0)

table(True = test$spam, Predicted = pred_class_oos)
mean(pred_class_oos != test$spam)

# Out-of-sample ROC curve
roc_oos <- roc(response = test$spam, predictor = pred_prob_oos,
               plot = TRUE, legacy.axes = TRUE, print.auc = TRUE)
title("Out-of-sample ROC (Test set)")`,
    outputType: "image" as const,
    output: "/images/r-roc-oos.png",
  },
  {
    id: 4,
    name: "AUC Comparison",
    code: `auc_in  <- auc(roc_in)
auc_oos <- auc(roc_oos)

cat("AUC (in-sample):     ", round(as.numeric(auc_in), 4), "\\n")
cat("AUC (out-of-sample): ", round(as.numeric(auc_oos), 4), "\\n")`,
    outputType: "text" as const,
    output: `AUC (in-sample):      0.9825
AUC (out-of-sample):  0.9764

The in-sample AUC is slightly higher than out-of-sample, which is expected: the model fits best on training data but generalizes almost as well. The small gap (0.006) is consistent with a model that's powerful but not severely overfit.

AUC summarizes performance across all thresholds — useful for ranking ability, but it doesn't account for the specific costs of false positives vs false negatives. Two models with similar AUCs can behave very differently at the threshold that matters for deployment.`,
  },
  {
    id: 5,
    name: "PCA on Congressional Votes",
    code: `votes <- read.csv("rollcall-votes.csv")
members <- read.csv("rollcall-members.csv")

# 445 members x 1647 votes
dim(votes)
table(members$party)

# Run PCA with centering (no scaling — votes are already {-1, 0, +1})
vote_mat <- as.matrix(votes)
pca <- prcomp(vote_mat, center = TRUE, scale. = FALSE)

# Proportion of variance explained
pve <- (pca$sdev^2) / sum(pca$sdev^2)

# Scree plot for first K = 10 components
plot(pve[1:10], type = "b",
     xlab = "Principal Component",
     ylab = "Proportion of Variance Explained",
     main = "Scree Plot (PVE) — First 10 PCs")

cat("PC1:", round(100 * pve[1], 2), "%\\n")
cat("PC2:", round(100 * pve[2], 2), "%\\n")`,
    outputType: "image" as const,
    output: "/images/r-scree-plot.png",
  },
  {
    id: 6,
    name: "Party Biplot",
    code: `library(ggplot2)

scores <- predict(pca)[, 1:2]
pc_df <- data.frame(
  PC1 = scores[, 1],
  PC2 = scores[, 2],
  party = factor(members$party),
  member = members$member,
  state = members$state
)

ggplot(pc_df, aes(x = PC1, y = PC2, color = party)) +
  geom_point(alpha = 0.85) +
  theme_minimal() +
  labs(title = "111th Congress: PCA of Roll-Call Votes",
       x = "PC1", y = "PC2", color = "Party") +
  scale_color_manual(
    values = c("D" = "blue", "R" = "red", "DR" = "purple")
  )

# 5 most extreme on each end of PC1
pc_sorted <- pc_df[order(pc_df$PC1), ]
head(pc_sorted[, c("member", "state", "party", "PC1")], 5)
tail(pc_sorted[, c("member", "state", "party", "PC1")], 5)`,
    outputType: "image" as const,
    output: "/images/r-pca-biplot.png",
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
        </div>
      )}
    </div>
  );
}

export default function PCAVoting() {
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
                Classification & PCA — Spam Detection and Congressional Voting
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
              "Classification",
              "PCA",
              "Logistic Regression",
              "ROC/AUC",
              "ggplot2",
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
            Two applied analyses from different ends of the
            supervised/unsupervised spectrum. The first fits a binary logistic
            regression on email spam data, evaluates in-sample vs out-of-sample
            performance with ROC curves and AUC, and discusses the overfitting
            gap.
          </p>
          <p>
            The second applies PCA to 111th Congress roll-call votes — reducing
            1,647 vote dimensions down to two principal components that cleanly
            separate Democrats from Republicans. The biplot is one of those
            results that makes dimensionality reduction click.
          </p>
          <p>
            Built in R using pROC for classification diagnostics and ggplot2 for
            the congressional biplot.
          </p>
        </div>

        {/* Interpretation panels */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-5">
            <h3 className="text-sm font-mono text-primary mb-2">PC1 explains 63.54% of variance</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The first principal component captures the main partisan divide — Republicans cluster negative, Democrats cluster positive. PC2 (3.65%) mostly reflects within-party variation.
            </p>
          </div>
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-5">
            <h3 className="text-sm font-mono text-secondary mb-2">AUC gap: 0.9825 → 0.9764</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The spam classifier shows minimal overfitting — the out-of-sample AUC is only 0.006 below in-sample, indicating strong generalization from logistic regression.
            </p>
          </div>
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

        {/* Extreme Members Table */}
        <div className="mb-16">
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
            Most Extreme Members on PC1
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#334155] rounded-lg overflow-hidden">
              <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-[#EF4444]">
                Most Republican (negative PC1)
              </div>
              <table className="w-full text-sm font-mono">
                <tbody>
                  {[
                    ["Lamborn", "CO", "R", "-33.36"],
                    ["Hensarling", "TX", "R", "-33.20"],
                    ["Foxx", "NC", "R", "-33.12"],
                    ["Franks", "AZ", "R", "-32.97"],
                    ["Broun", "GA", "R", "-32.70"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[#334155]/50">
                      <td className="px-4 py-1.5 text-[#E2E8F0]">{row[0]}</td>
                      <td className="px-2 py-1.5 text-[#94A3B8]">{row[1]}</td>
                      <td className="px-2 py-1.5 text-[#EF4444]">{row[2]}</td>
                      <td className="px-2 py-1.5 text-[#94A3B8] text-right">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-[#334155] rounded-lg overflow-hidden">
              <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-[#3B82F6]">
                Most Democrat (positive PC1)
              </div>
              <table className="w-full text-sm font-mono">
                <tbody>
                  {[
                    ["Matsui", "CA", "D", "+23.29"],
                    ["Price", "NC", "D", "+23.28"],
                    ["Edwards", "MD", "D", "+23.11"],
                    ["Schakowsky", "IL", "D", "+23.09"],
                    ["Hirono", "HI", "D", "+23.05"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[#334155]/50">
                      <td className="px-4 py-1.5 text-[#E2E8F0]">{row[0]}</td>
                      <td className="px-2 py-1.5 text-[#94A3B8]">{row[1]}</td>
                      <td className="px-2 py-1.5 text-[#3B82F6]">{row[2]}</td>
                      <td className="px-2 py-1.5 text-[#94A3B8] text-right">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
          <a href="/pdfs/rmd_for_1and4.pdf" download>
            <Button variant="outline" className="font-mono text-xs h-10 px-4">
              <Download className="mr-2 h-3.5 w-3.5" /> Download PDF Export
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
