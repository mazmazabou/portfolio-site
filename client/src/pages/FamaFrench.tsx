import { Link } from "wouter";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FamaFrench() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Back Link */}
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-sm text-primary mb-2">ECON 577 — Financial Econometrics, USC</p>
              <h1 className="text-3xl md:text-5xl font-serif text-white">Fama-French Factor Analysis</h1>
            </div>
            <div className="shrink-0 flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1E293B] text-white/80 border border-white/10 rounded">Jupyter Notebook</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#1E293B] text-white/80 border border-white/10 rounded">Python</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {['Python', 'Econometrics', 'Finance', 'Jupyter', 'OLS', 'Factor Models'].map(tag => (
              <span key={tag} className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-16">
          <p className="text-lg text-white/90">
            The Fama-French three-factor model is one of the foundational frameworks in empirical asset pricing. This notebook implements it end-to-end: raw data ingestion, factor construction (market excess return, SMB, HML), OLS regression across a portfolio of equities, and interpretation of the results.
          </p>
          <p>
            The part that matters most isn't the code — it's what comes after. Each regression output is accompanied by written cells explaining what the alpha means (is there unexplained return after controlling for systematic risk?), why the factor loadings matter (is this portfolio tilted toward small-caps or value stocks?), and what the robustness checks are testing. The notebook is organized to be read as an argument, not just executed as a script.
          </p>
          <p>
            Built in Python using pandas, statsmodels, and matplotlib. Data pipeline runs from source to analysis without manual steps.
          </p>
        </div>

        {/* Code Cells Area */}
        <div className="space-y-8 mb-16">
          {[
            { id: 1, name: "Data Loading", lines: 5 },
            { id: 2, name: "Factor Construction", lines: 8 },
            { id: 3, name: "OLS Regression", lines: 4 },
            { id: 4, name: "Interpretation", lines: 3 }
          ].map((cell) => (
            <div key={cell.id} className="rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
              <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-muted-foreground flex justify-between items-center border-b border-[#334155]">
                <span>Code Cell {cell.id}: {cell.name}</span>
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/50"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/50"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/50"></span>
                </span>
              </div>
              <div className="p-4 font-mono text-sm overflow-x-auto text-[#E2E8F0] relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#1E293B]/30 border-r border-[#334155]/50 pointer-events-none flex flex-col items-center pt-4 text-xs text-[#64748B]">
                  {Array.from({length: cell.lines}).map((_, i) => (
                    <span key={i} className="leading-6 h-6">{i + 1}</span>
                  ))}
                </div>
                <div className="pl-8 leading-6 text-[#94A3B8] italic"># [Code placeholder - to be pasted later]</div>
                {Array.from({length: cell.lines - 1}).map((_, i) => (
                  <div key={i} className="pl-8 leading-6 h-6"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
          <Button variant="outline" className="font-mono text-xs h-10 px-4">
            <Download className="mr-2 h-3.5 w-3.5" /> Download .ipynb
          </Button>
          <Button variant="outline" className="font-mono text-xs h-10 px-4">
            <Download className="mr-2 h-3.5 w-3.5" /> Download PDF Export
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          Attribution: Individual — 100%.
        </div>
      </div>
    </div>
  );
}
