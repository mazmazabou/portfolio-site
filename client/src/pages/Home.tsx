import { Link } from "wouter";
import { ArrowRight, ArrowDown, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight text-white tracking-tight">
          MAZEN ABOUELELA
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light max-w-2xl leading-relaxed">
          I build products, analyze markets, and write about both.
        </p>
        <p className="text-sm md:text-base font-mono text-primary/80 mb-12 flex flex-wrap gap-2 items-center">
          <span>USC · Fall 2022 – Spring 2026</span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span>7 pieces</span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span>2 live products</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/ride-ops">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base rounded-none font-medium w-full sm:w-auto">
              See RideOps <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={scrollToProjects}
            className="border-border text-foreground hover:bg-white/5 h-12 px-8 text-base rounded-none w-full sm:w-auto"
          >
            View Full Portfolio <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-serif">Live Products</h2>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: RideOps */}
          <Link href="/ride-ops" className="block group">
            <div className="glass-card h-full p-8 md:p-10 flex flex-col relative overflow-hidden group-hover:border-primary/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="mb-6 flex flex-wrap gap-2">
                {['SaaS', 'Full-Stack', 'Product', 'PostgreSQL', 'React', 'Multi-Tenant'].map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white/5 text-muted-foreground border border-white/10 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-primary transition-colors">RideOps — Campus Transportation Ops Platform</h3>

              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                A white-labeled, multi-tenant SaaS platform for university accessibility transportation. Live in production with 4 campuses demo-ready.
              </p>

              <div className="mt-auto">
                <div className="bg-black/40 border border-white/5 p-4 mb-6 font-mono text-xs text-secondary/90 leading-relaxed">
                  29 analytics widgets · 21 notification types · 4 campuses · 6-state ride lifecycle
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-xs font-bold tracking-widest text-primary uppercase">Live Product</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-rotate-45 transition-all" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: MENA Rising */}
          <Link href="/mena-rising" className="block group">
            <div className="glass-card h-full p-8 md:p-10 flex flex-col relative overflow-hidden group-hover:border-secondary/50 transition-all duration-500 pattern-zellige">
              <div className="absolute inset-0 bg-[#0A0F1C]/90 -z-10"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="mb-6 flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Python Pipeline', 'AI/LLM', 'MENA', 'Data Viz'].map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white/5 text-muted-foreground border border-white/10 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-secondary transition-colors">MENA Rising — Weekly Economic Intelligence</h3>

              <p className="text-muted-foreground leading-relaxed mb-8 flex-1 font-editorial text-lg">
                A Claude-powered MENA economic briefing app with an Ottoman design system. Live with automated weekly pipeline.
              </p>

              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-xs font-bold tracking-widest text-primary uppercase">Live Product</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:-rotate-45 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Coursework Section */}
      <section className="py-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-serif">Selected Coursework</h2>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fama-French */}
          <Link href="/fama-french" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">ECON 577</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">Jupyter Notebook</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Fama-French Factor Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">Three-factor model, full data pipeline, and the interpretation that actually matters.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['Python', 'Econometrics', 'Finance'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Al-Ard */}
          <Link href="/al-ard" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">MDES 401</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 text-white/80 border border-white/20 rounded">Long-form Essay · 8 pages</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Al-Ard — Film Review</h3>
              <p className="text-sm text-muted-foreground font-editorial mb-4">Close reading of Chahine's 1969 Egyptian film.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['Cultural Criticism', 'Film Studies', 'MENA'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Microsoft Tax */}
          <Link href="/microsoft-tax" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">WRIT 340</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 text-white/80 border border-white/20 rounded">Business Memo</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Microsoft Ireland Tax Memo</h3>
              <p className="text-sm text-muted-foreground mb-4"><span className="text-primary font-medium">$858M</span> in Microsoft tax savings — calculated from real S&P Capital IQ data.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['Business Writing', 'Tax Policy', 'Financial Analysis'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* DSCI 351 */}
          <Link href="/dsci-351" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">DSCI 351</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 text-white/80 border border-white/20 rounded">Technical Report · 12 pages</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Dual-Database Inventory System</h3>
              <p className="text-sm text-muted-foreground mb-4">Redis + MongoDB dual-database architecture with aggregate pipelines and GUI.</p>
              <div className="mt-auto flex flex-wrap justify-between items-end gap-2">
                <div className="flex flex-wrap gap-1">
                  {['MongoDB', 'Redis', 'Python', 'Systems Design'].map(tag => (
                    <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground italic">with Dev Kapashi</span>
              </div>
            </div>
          </Link>

          {/* MENA Slides */}
          <Link href="/mena-slides" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">ECON 305</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/10 text-white/80 border border-white/20 rounded">Presentation · 18 slides</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Growth Challenges in MENA</h3>
              <p className="text-sm text-muted-foreground mb-4">Structural growth barriers across the MENA region.</p>
              <div className="mt-auto flex flex-wrap justify-between items-end gap-2">
                <div className="flex flex-wrap gap-1">
                  {['MENA', 'Development Economics', 'Policy'].map(tag => (
                    <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground italic">with Dev Kapashi</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* MENA Throughline Callout */}
      <section className="py-8">
        <div className="bg-secondary/5 border-l-2 border-secondary p-6 md:p-8">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
            "Three pieces in this portfolio engage the MENA region from different angles — economic intelligence (MENA Rising), development policy (ECON 305), and cultural criticism (Al-Ard). This is a sustained, multi-year intellectual thread, not a coincidence."
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-serif text-white/80">Certifications</h2>
          <div className="h-px bg-border flex-1"></div>
        </div>
        <a href="/pdfs/data-analyst-cert.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 glass-card px-5 py-3 hover:border-primary/30 transition-colors group">
          <Award size={18} className="text-primary" />
          <div>
            <p className="text-sm text-white/90 group-hover:text-white transition-colors">DataCamp Data Analyst Associate</p>
            <p className="text-[11px] text-muted-foreground">View certificate</p>
          </div>
        </a>
      </section>
    </div>
  );
}
