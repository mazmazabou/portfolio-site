import { Link } from "wouter";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DSCI351() {
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
            <p className="font-mono text-sm text-muted-foreground mb-2">DSCI 351 — Data Systems, USC</p>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-6">Dual-Database Inventory Management System</h1>
            <div className="flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 text-white/80 border border-white/10 rounded flex items-center w-fit">
                <FileText size={12} className="mr-1.5" /> Technical Report · 12 pages
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['MongoDB', 'Redis', 'Python', 'Systems Design', 'Technical Writing', 'CRUD', 'GUI'].map(tag => (
              <span key={tag} className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-12">
          <p>
            A trader buys products from suppliers and sells them to retailers. The entire lifecycle — purchase, inventory, order, fulfillment — needs to be tracked in one place. This system does that, using two databases chosen for different access patterns: Redis for the buy-side (fast key-value reads on products and supplier data) and MongoDB for the sell-side (flexible document storage for orders, inventory, and retailer records).
          </p>
          <p>
            The report documents the full build: ER diagram with five entity relationships, five Python backend modules, three complex MongoDB aggregate pipeline queries, and a Tkinter GUI with CRUD operations across all entities.
          </p>
        </div>

        {/* PDF Viewer */}
        <iframe src="/pdfs/dsci-351-report.pdf" className="w-full h-[80vh] rounded-lg border border-white/10 mb-8" title="DSCI 351 Report PDF" />

        <div className="mb-8">
          <a href="/pdfs/dsci-351-report.pdf" download>
            <Button variant="outline" className="border-border hover:bg-white/5">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </a>
        </div>

        <div className="text-sm text-muted-foreground pt-8 border-t border-border">
          With Dev Kapashi
        </div>
      </div>
    </div>
  );
}
