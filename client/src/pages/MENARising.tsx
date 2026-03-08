import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MENARising() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Back Link */}
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl md:text-6xl font-serif mb-4 text-white">MENA Rising</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-editorial italic">Weekly Economic Intelligence</p>
        
        <div className="mb-12">
          <a href="https://mena-rising.com" target="_blank" rel="noopener noreferrer">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 rounded-none text-base">
              Visit mena-rising.com <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Hero Image */}
        <img
          src="/images/mena-rising-hero.png"
          alt="MENA Rising — full-page screenshot at 1440px"
          className="w-full rounded-lg border border-white/10 shadow-2xl mb-16"
        />
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-foreground font-editorial prose-p:text-lg mb-20">
        <p>
          Most MENA economic coverage is either paywalled institutional research or surface-level news aggregation. Neither is particularly useful if you want a fast weekly read on macro signals, trade flows, and labor trends across nine countries simultaneously.
        </p>
        <p className="text-2xl text-white font-serif my-8 italic">
          MENA Rising is my attempt to build what I actually wanted to read.
        </p>
        <p>
          Every week, a Python pipeline wakes up via GitHub Actions, pulls raw data from the World Bank, FRED, Finnhub, News API, and GDELT, and sends it to Claude's API to generate a structured briefing JSON. That JSON feeds a React app with a newspaper/editorial aesthetic — scrolling ticker masthead, macro pulse cards with animated sparklines, trade and capital flow visualizations, labor signal panels (youth unemployment, AI adoption, tech job growth), and a risk radar with severity levels across all nine countries.
        </p>
        <p>
          The design is deliberate. The visual language draws on Ottoman and Islamic geometric traditions — zellige tile patterns, muqarnas strip ornaments, decorative dividers — implemented as CSS classes alongside three font families: Cormorant Garamond for display headings, Crimson Pro for editorial body text, and JetBrains Mono for data. Dark theme with navy, gold/amber, and teal. The goal was a publication that felt like it belonged to the region it covers.
        </p>
        <p>
          Subscribers receive a formatted HTML email after each pipeline run via a Resend-powered endpoint on Vercel.
        </p>
      </section>

      {/* Architecture & Tech */}
      <section className="max-w-4xl mx-auto mb-16 space-y-12">
        {/* Architecture Diagram Area */}
        <div className="bg-white/5 border border-white/10 p-8">
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">Data Pipeline Flow</h3>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-mono overflow-x-auto pb-4">
            <div className="bg-[#0A0F1C] px-4 py-3 border border-border whitespace-nowrap">Data Sources<br/><span className="text-[10px] text-muted-foreground">World Bank, FRED, News API</span></div>
            <ArrowLeft className="rotate-90 md:rotate-180 text-secondary" size={20} />
            <div className="bg-[#0A0F1C] px-4 py-3 border border-secondary/50 text-secondary whitespace-nowrap">Python Pipeline</div>
            <ArrowLeft className="rotate-90 md:rotate-180 text-secondary" size={20} />
            <div className="bg-[#0A0F1C] px-4 py-3 border border-border whitespace-nowrap">Claude API</div>
            <ArrowLeft className="rotate-90 md:rotate-180 text-secondary" size={20} />
            <div className="bg-[#0A0F1C] px-4 py-3 border border-primary/50 text-primary whitespace-nowrap">React App</div>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {['Vite', 'React 18', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Python', 'Claude API', 'GitHub Actions', 'Resend', 'Vercel'].map(tech => (
              <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-foreground/80">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Countries Covered</h3>
          <p className="text-secondary/90 font-serif text-lg tracking-wide flex flex-wrap gap-x-4 gap-y-2">
            <span>Saudi Arabia</span><span className="opacity-30">·</span>
            <span>UAE</span><span className="opacity-30">·</span>
            <span>Egypt</span><span className="opacity-30">·</span>
            <span>Qatar</span><span className="opacity-30">·</span>
            <span>Morocco</span><span className="opacity-30">·</span>
            <span>Jordan</span><span className="opacity-30">·</span>
            <span>Bahrain</span><span className="opacity-30">·</span>
            <span>Oman</span><span className="opacity-30">·</span>
            <span>Turkey</span>
          </p>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-foreground/80 flex items-center gap-2">
            <span className="font-mono text-muted-foreground uppercase tracking-wider">Attribution:</span> Sole developer and designer — 100%.
          </p>
        </div>
      </section>
    </div>
  );
}
