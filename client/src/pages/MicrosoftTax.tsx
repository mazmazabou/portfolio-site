import { Link } from "wouter";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MicrosoftTax() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="mb-6">
            <p className="font-mono text-sm text-muted-foreground mb-2">WRIT 340 — Professional Writing, USC</p>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-6">Microsoft Ireland Tax Analysis</h1>
            <div className="flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 text-white/80 border border-white/10 rounded flex items-center w-fit">
                <FileText size={12} className="mr-1.5" /> Business Memo
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-12">
            {['Business Writing', 'Tax Policy', 'Financial Analysis', 'Memo Format'].map(tag => (
              <span key={tag} className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">#{tag}</span>
            ))}
          </div>

          <div className="bg-primary/10 border border-primary/20 p-8 rounded-lg mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
            <div className="text-6xl font-serif text-primary font-bold tracking-tighter">
              $858M
            </div>
            <div className="h-px w-12 md:w-px md:h-12 bg-primary/30 hidden md:block"></div>
            <div className="text-primary/80 font-mono text-sm uppercase tracking-wider max-w-xs leading-relaxed">
              Estimated single-year tax savings from one jurisdiction
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-12">
          <p>
            This is a professional business memo analyzing Microsoft's use of Ireland as a tax-efficient jurisdiction — written from the perspective of a financial analyst briefing an executive on the strategic implications.
          </p>
          <p>
            The core finding: Microsoft's Irish subsidiary accounts for 33% of the company's global revenue but only 4% of its global net income. That disparity is structural, not incidental. Using Microsoft's actual 2023 financials from S&P Capital IQ, the memo calculates that Microsoft paid $652 million in Irish taxes versus the $1.51 billion it would have owed at the U.S. rate of 29% — a saving of approximately $858 million from a single jurisdiction in a single year.
          </p>
          <p>
            The memo also analyzes Section 7874 of the Internal Revenue Code — the main U.S. legislative mechanism against corporate inversions — and explains why it has not prevented Microsoft and others from maintaining these structures.
          </p>
        </div>

        {/* PDF Viewer */}
        <iframe src="/pdfs/microsoft-tax-memo.pdf" className="w-full h-[80vh] rounded-lg border border-white/10 mb-8" title="Microsoft Ireland Tax Memo PDF" />

        <div className="mb-8">
          <a href="/pdfs/microsoft-tax-memo.pdf" download>
            <Button variant="outline" className="border-border hover:bg-white/5">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </a>
        </div>

      </div>
    </div>
  );
}
