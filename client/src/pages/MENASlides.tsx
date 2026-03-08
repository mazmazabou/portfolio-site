import { Link } from "wouter";
import { ArrowLeft, MonitorPlay } from "lucide-react";

export default function MENASlides() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="mb-6">
            <p className="font-mono text-sm text-muted-foreground mb-2">ECON 305 — Development Economics, USC</p>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-6">Growth Challenges in MENA</h1>
            <div className="flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 text-white/80 border border-white/10 rounded flex items-center w-fit">
                <MonitorPlay size={12} className="mr-1.5" /> Presentation · 18 slides
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['MENA', 'Development Economics', 'Policy', 'Data Visualization', 'Presentation'].map(tag => (
              <span key={tag} className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="max-w-3xl prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-16">
          <p className="text-xl font-serif italic text-white/90">
            Academic context for MENA Rising. The same region, approached from a development economics angle rather than a data journalism one.
          </p>
          <p>
            This 18-slide policy deck — co-authored with Dev Kapashi — diagnoses four interlocking structural barriers to growth across the MENA region: weak institutional quality, overreliance on oil revenue, a youth unemployment crisis, and persistent gender gaps in labor force participation. The analysis draws on World Bank and IMF data throughout, and the policy recommendations are sequenced deliberately — institutional reform precedes liberalization in the proposed framework.
          </p>
          <p>
            The work here connects directly to MENA Rising: the same regional expertise, formalized into academic argument.
          </p>
        </div>

        {/* Slides Gallery Placeholder */}
        <div className="space-y-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[16/9] bg-[#1E293B] border border-border flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5"></div>
                <MonitorPlay className="text-white/10 group-hover:text-white/20 transition-colors w-12 h-12" />
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground/50">Slide Placeholder {i}</div>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-muted-foreground text-center uppercase tracking-wider">
            Selected Slides — co-authored with Dev Kapashi <br/>
            <span className="opacity-50 lowercase tracking-normal text-[10px]">(Screenshots only — reflects partial contribution scope)</span>
          </p>
        </div>

        <div className="text-sm text-muted-foreground pt-8 border-t border-border">
          Attribution: Co-authored with Dev Kapashi — joint project.
        </div>
      </div>
    </div>
  );
}
