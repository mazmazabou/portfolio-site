import { Link } from "wouter";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Econ500() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">ECON 500</h1>
              <p className="text-xl text-muted-foreground">Graduate Econometrics Final Exam</p>
            </div>
            <div className="shrink-0 flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 text-white/80 border border-white/10 rounded flex items-center">
                <FileText size={12} className="mr-1.5" /> LaTeX PDF · 17 pages
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Econometrics', 'LaTeX', 'IV', 'DiD', 'Panel Data', 'MLE', 'Graduate-Level'].map(tag => (
              <span key={tag} className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-12">
          <p className="text-xl font-serif text-white/90 italic">
            Seven questions. Seventeen pages of LaTeX. Graduate econometrics.
          </p>
          <p>
            This exam covers the full causal inference toolkit — OLS identification assumptions, instrumental variables, difference-in-differences, panel data with fixed effects, regression discontinuity design, and maximum likelihood estimation. All seven questions are answered in full, with derivations typeset cleanly in LaTeX throughout.
          </p>
          <p>
            The sections that go beyond mechanics are the most interesting. The IV and DiD questions require stating and defending the identifying assumptions, not just applying a formula. The econometrics are a means to an end — the end is an argument about causality.
          </p>
        </div>

        {/* PDF Viewer */}
        <iframe src="/pdfs/econ-500-final.pdf" className="w-full h-[80vh] rounded-lg border border-white/10 mb-8" title="ECON 500 Final Exam PDF" />

        <div className="mb-8">
          <a href="/pdfs/econ-500-final.pdf" download>
            <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </a>
        </div>

        <div className="text-sm text-muted-foreground">
          Attribution: Individual — 100%.
        </div>
      </div>
    </div>
  );
}
