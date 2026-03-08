import { Link } from "wouter";
import { ArrowLeft, Download, Play, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

type CellState = "idle" | "running" | "done";

const notebookCells = [
  {
    id: 1,
    name: "Data Loading",
    code: `import pandas as pd
import numpy as np

FamaFrench_df = pd.read_csv('./Fama French Factors.csv', low_memory=False)
CRSP_Universe_df = pd.read_csv('./CRSP Mutual Fund Universe.csv', low_memory=False)
CRSP_Returns_df = pd.read_csv('./CRSP Mutual Fund Returns.csv', low_memory=False)

print(f"Original: {CRSP_Universe_df.shape}")`,
    outputType: "text" as const,
    output: `Original: (156152, 73)`,
  },
  {
    id: 2,
    name: "Fund Screening Pipeline",
    code: `# Filter by CRSP objective code
CRSP_Universe_df = CRSP_Universe_df[
    CRSP_Universe_df['crsp_obj_cd'].isin(['EDCM', 'EDCS', 'EDYG', 'EDYB', 'EDYI'])
]

# Remove target date funds
tdf_flag = (CRSP_Universe_df['lipper_class_name'].str.contains('Target') |
            CRSP_Universe_df['lipper_class_name'].str.contains('Trgt'))
CRSP_Universe_df = CRSP_Universe_df[np.logical_not(tdf_flag)]

# Screen: end-of-2023, retail, active, non-index, non-ETF
CRSP_Universe_df = CRSP_Universe_df[
    (CRSP_Universe_df['caldt'] == '2023-12-29') &
    (CRSP_Universe_df['sales_restrict'] == 'N') &
    (CRSP_Universe_df['retail_fund'] == 'Y') &
    (CRSP_Universe_df['dead_flag'] == 'N') &
    (CRSP_Universe_df['index_fund_flag'].isna()) &
    (CRSP_Universe_df['et_flag'].isna())
]

# Extract largest fund from each family
fam_aum_max = CRSP_Universe_df.groupby(['crsp_portno']).agg({'tna_latest': 'max'})
fam_aum_max.columns = ['tna_max']
CRSP_Universe_df = CRSP_Universe_df.merge(
    fam_aum_max.reset_index(), on='crsp_portno', how='inner'
)
CRSP_Universe_df = CRSP_Universe_df.loc[
    CRSP_Universe_df['tna_latest'] == CRSP_Universe_df['tna_max']
]
print(f"Final shape: {CRSP_Universe_df.shape}")`,
    outputType: "text" as const,
    output: `After obj_cd filter: (55785, 73)
After target date fund removal: (40335, 73)
After additional criteria: (2296, 73)
Final shape: (1298, 74)`,
  },
  {
    id: 3,
    name: "Decile Construction",
    code: `# Merge returns, compute annualized geometric returns, assign deciles
manager_returns_df = CRSP_Returns_df.merge(CRSP_Universe_df, on='crsp_fundno', how='inner')
manager_returns_df['mret'] = pd.to_numeric(manager_returns_df['mret'], errors='coerce')

def annualized_geometric_return(returns):
    cumulative_return = np.prod(1 + returns) - 1
    num_years = len(returns)
    return (1 + cumulative_return) ** (12 / num_years) - 1

filtered = manager_returns_df.groupby('crsp_fundno').filter(
    lambda x: (len(x) == 69) and x['mret'].notnull().all()
)

annualized_returns = filtered.groupby('crsp_fundno')['mret'].apply(annualized_geometric_return)
annualized_df = annualized_returns.reset_index()
annualized_df.columns = ['crsp_fundno', 'annualized_return']
annualized_df['decile'] = pd.qcut(annualized_df['annualized_return'], 10, labels=False)

decile_avg_mret = filtered.merge(
    annualized_df[['crsp_fundno', 'decile']], on='crsp_fundno'
).groupby('decile')['mret'].mean()
print(decile_avg_mret)`,
    outputType: "table" as const,
    output: null,
    tableData: {
      headers: ["Decile", "Avg Monthly Return"],
      rows: [
        ["0", "0.008335"],
        ["1", "0.010273"],
        ["2", "0.010995"],
        ["3", "0.011366"],
        ["4", "0.012025"],
        ["5", "0.012510"],
        ["6", "0.013286"],
        ["7", "0.014104"],
        ["8", "0.015126"],
        ["9", "0.016915"],
      ],
    },
  },
  {
    id: 4,
    name: "OLS Regressions (CAPM + FF5)",
    code: `import statsmodels.api as sm

# CAPM regression per decile
capm_results = {}
for d in decile_ts['decile'].unique():
    sub = merged[merged['decile'] == d].copy().reset_index(drop=True)
    X = sm.add_constant(sub[['Mkt-RF']])
    y = sub['excess_return']
    capm_results[d] = sm.OLS(y, X).fit()

# Five-Factor regression per decile
five_factor_results = {}
for d in decile_ts['decile'].unique():
    sub = merged[merged['decile'] == d].copy()
    X_ff5 = sm.add_constant(sub[['Mkt-RF', 'SMB', 'HML', 'RMW', 'MOM']])
    y = sub['excess_return']
    five_factor_results[d] = sm.OLS(y, X_ff5).fit()

# Extract CAPM table
capm_table = extract_stats(capm_results, ['Mkt-RF'])
print("CAPM Regression Table")
print(capm_table)`,
    outputType: "table" as const,
    output: null,
    tableData: {
      headers: ["Decile", "R\u00B2", "Alpha", "Mkt-RF \u03B2", "Alpha t", "Mkt-RF t"],
      rows: [
        ["0", "0.714", "-0.0056", "0.960", "-15.43", "142.46"],
        ["1", "0.765", "-0.0047", "1.041", "-13.54", "162.26"],
        ["2", "0.768", "-0.0040", "1.041", "-11.59", "164.26"],
        ["3", "0.790", "-0.0029", "0.989", "-9.59", "174.50"],
        ["4", "0.794", "-0.0025", "1.007", "-8.14", "177.12"],
        ["5", "0.828", "-0.0018", "0.990", "-6.65", "197.10"],
        ["6", "0.842", "-0.0013", "1.013", "-4.95", "207.19"],
        ["7", "0.872", "-0.0004", "1.005", "-1.71", "235.38"],
        ["8", "0.856", "0.0005", "1.016", "2.01", "219.09"],
        ["9", "0.835", "0.0019", "1.050", "6.69", "203.19"],
      ],
    },
  },
  {
    id: 5,
    name: "Factor Performance Chart",
    code: `import matplotlib.pyplot as plt

ff5_cols = ['Mkt-RF', 'SMB', 'HML', 'RMW', 'MOM']
ff5_cum = (FamaFrench_df[ff5_cols] + 1).cumprod()

plt.figure(figsize=(10, 6))
ff5_cum.plot()
plt.title("Cumulative Performance of FF5 Factors")
plt.xlabel("Time (monthly periods)")
plt.ylabel("Cumulative Return")
plt.legend(ff5_cols)
plt.grid()
plt.show()`,
    outputType: "image" as const,
    output: "/images/ff-factors-chart.png",
  },
  {
    id: 6,
    name: "Interpretation",
    code: `# Factor loadings across deciles:
# SMB and HML trend from positive (worst decile) to negative (best).
# Market beta rises with decile. RMW and MOM remain small.
#
# R² values: 0.71–0.84 (CAPM), 0.77–0.86 (FF5)
# → Most return variation is factor-driven.
# But alphas persist even after FF5 adjustment.

print("Skill vs. Luck Assessment")
print("Best decile (9): alpha = +0.0019, t = 6.69 → significant positive alpha")
print("Worst decile (0): alpha = -0.0056, t = -15.43 → significant negative alpha")
print("Interpretation: evidence of skill, not just factor exposure.")`,
    outputType: "text" as const,
    output: `Skill vs. Luck Assessment

Best decile (9): alpha = +0.0019, t-stat = 6.69 → significant positive alpha even after FF5 adjustment.
Worst decile (0): alpha = -0.0056, t-stat = -15.43 → significant negative alpha.

SMB and HML load positive for worst performers, negative for best — the worst decile is tilted toward small-cap value, the best toward large-cap growth.

Momentum (MOM) dominates long-run cumulative returns. Market factor (Mkt-RF) trends strongly upward. Value (HML) and size (SMB) are flat to down.

The magnitudes and t-stats make a pure-luck explanation unlikely. The best managers show evidence of skill or exposure to factors not captured by FF5, while the worst reflect poor selection or mistimed exposures.`,
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
            <span className="animate-pulse">█</span>
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
              alt="Matplotlib chart output"
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

export default function FamaFrench() {
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
                ECON 577 — Financial Econometrics, USC
              </p>
              <h1 className="text-3xl md:text-5xl font-serif text-white">
                Fama-French Factor Analysis
              </h1>
            </div>
            <div className="shrink-0 flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1E293B] text-white/80 border border-white/10 rounded">
                Jupyter Notebook
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1E293B] text-white/80 border border-white/10 rounded">
                Python
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "Python",
              "Econometrics",
              "Finance",
              "Jupyter",
              "OLS",
              "Factor Models",
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
            The Fama-French three-factor model is one of the foundational
            frameworks in empirical asset pricing. This notebook implements it
            end-to-end: raw data ingestion, factor construction (market excess
            return, SMB, HML), OLS regression across a portfolio of equities,
            and interpretation of the results.
          </p>
          <p>
            The part that matters most isn't the code — it's what comes after.
            Each regression output is accompanied by written cells explaining
            what the alpha means (is there unexplained return after controlling
            for systematic risk?), why the factor loadings matter (is this
            portfolio tilted toward small-caps or value stocks?), and what the
            robustness checks are testing. The notebook is organized to be read
            as an argument, not just executed as a script.
          </p>
          <p>
            Built in Python using pandas, statsmodels, and matplotlib. Data
            pipeline runs from source to analysis without manual steps.
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
          <a href="/notebooks/fama-french.ipynb" download>
            <Button variant="outline" className="font-mono text-xs h-10 px-4">
              <Download className="mr-2 h-3.5 w-3.5" /> Download .ipynb
            </Button>
          </a>
          <Button variant="outline" className="font-mono text-xs h-10 px-4">
            <Download className="mr-2 h-3.5 w-3.5" /> Download PDF Export
          </Button>
        </div>
      </div>
    </div>
  );
}
