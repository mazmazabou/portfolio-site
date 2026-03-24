import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowDown, Award, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import HeroParticles from "@/components/HeroParticles";

export default function Home() {
  const [, navigate] = useLocation();
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("portfolio-game-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowGameModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGameChoice = (path: string) => {
    localStorage.setItem("portfolio-game-dismissed", "true");
    setShowGameModal(false);
    navigate(path);
  };

  const handleDismiss = () => {
    localStorage.setItem("portfolio-game-dismissed", "true");
    setShowGameModal(false);
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Welcome Game Modal */}
      <Dialog open={showGameModal} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <DialogContent className="bg-[#0A0F1C] border-border sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-7 h-7 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-serif text-white">Wanna play a game?</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-1">
              Before you explore — try one of my CSCI 103 projects, ported from C++ to the browser.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => handleGameChoice("/connect-4")}
              className="group glass-card p-4 text-left hover:border-primary/40 transition-all"
            >
              <div className="text-2xl mb-2">🔴</div>
              <h3 className="font-serif text-white group-hover:text-primary transition-colors text-sm font-medium">Connect 4</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Play against an AI opponent</p>
            </button>

            <button
              onClick={() => handleGameChoice("/blackjack")}
              className="group glass-card p-4 text-left hover:border-primary/40 transition-all"
            >
              <div className="text-2xl mb-2">🃏</div>
              <h3 className="font-serif text-white group-hover:text-primary transition-colors text-sm font-medium">Blackjack</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Hit, stand, or bust</p>
            </button>
          </div>

          <button
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-white/70 transition-colors mt-1 text-center"
          >
            No thanks, show me the portfolio
          </button>
        </DialogContent>
      </Dialog>
      {/* Hero Section */}
      <div className="relative">
        <HeroParticles />
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight text-white tracking-tight">
          MAZEN ABOUELELA
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light max-w-2xl leading-relaxed">
          I find problems worth solving and build everything it takes to prove the solution.
        </p>
        <p className="text-sm md:text-base font-mono text-primary/80 mb-12 flex flex-wrap gap-2 items-center">
          <span>USC · Fall 2022 – Spring 2026</span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span>11 pieces</span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span>2 live products</span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span>3 runnable notebooks</span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span>2 playable games</span>
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
      </div>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-serif">About</h2>
          </div>
          <div className="h-px bg-border flex-1"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <img
            src="/images/headshot.png"
            alt="Mazen Abouelela"
            className="w-full md:w-[280px] shrink-0 rounded-lg border border-border shadow-lg object-cover"
          />
          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              I grew up in Egypt and moved to the U.S. with my family when I was 13 — starting over in Southern California with very little but a lot of drive. I'm a first-generation college student finishing my M.S. in Applied Economics at USC while working in tech consulting at Aprio.
            </p>
            <p>
              Before any of that, I spent six years as an ocean lifeguard and EMT on Long Beach beaches. That work taught me how to stay calm under pressure, lead a team, and act when it counts — instincts I now bring to building software and advising clients.
            </p>
            <p>
              Three pieces in this portfolio engage the MENA region from different angles — economic intelligence, development policy, and cultural criticism. That's not a coincidence. Where I come from shapes what I pay attention to.
            </p>
            <p>
              Outside of work, I co-founded USC's Egyptian Student Association, captained the LBCC swim team to a state finals appearance, and I'm currently building RideOps — a SaaS platform I conceived from a real problem I saw during my campus transportation job.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-serif">Live Products</h2>
          </div>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: RideOps */}
          <Link href="/ride-ops" className="block group">
            <div className="glass-card h-full flex flex-col relative overflow-hidden group-hover:border-primary/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Dashboard wireframe visual */}
              <div className="relative h-[160px] overflow-hidden border-b border-white/5"
                style={{
                  backgroundImage: `linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}>
                <div className="absolute inset-0 flex flex-col justify-center gap-3 px-8">
                  <div className="relative h-2.5 rounded-full bg-primary/12 origin-left" style={{ width: '75%', animation: 'bar-grow 1.5s ease-out forwards' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/30" style={{ animation: 'dot-pulse 3s ease-in-out infinite' }} />
                  </div>
                  <div className="relative h-2.5 rounded-full bg-primary/10 origin-left" style={{ width: '52%', animation: 'bar-grow 1.5s ease-out 0.2s forwards' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/25" style={{ animation: 'dot-pulse 3s ease-in-out 0.5s infinite' }} />
                  </div>
                  <div className="relative h-2.5 rounded-full bg-primary/8 origin-left" style={{ width: '88%', animation: 'bar-grow 1.5s ease-out 0.4s forwards' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/20" style={{ animation: 'dot-pulse 3s ease-in-out 1s infinite' }} />
                  </div>
                  <div className="relative h-2.5 rounded-full bg-primary/6 origin-left" style={{ width: '40%', animation: 'bar-grow 1.5s ease-out 0.6s forwards' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/15" style={{ animation: 'dot-pulse 3s ease-in-out 1.5s infinite' }} />
                  </div>
                </div>
                {/* Faint metric labels */}
                <div className="absolute top-4 right-4 flex gap-4">
                  <div className="h-1.5 w-12 rounded bg-primary/6"></div>
                  <div className="h-1.5 w-8 rounded bg-primary/4"></div>
                </div>
                <div className="absolute bottom-4 left-8 flex gap-6">
                  <div className="h-1 w-10 rounded bg-white/4"></div>
                  <div className="h-1 w-14 rounded bg-white/4"></div>
                  <div className="h-1 w-8 rounded bg-white/4"></div>
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-1">
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
            </div>
          </Link>

          {/* Card 2: MENA Rising */}
          <Link href="/mena-rising" className="block group">
            <div className="glass-card h-full flex flex-col relative overflow-hidden group-hover:border-secondary/50 transition-all duration-500 pattern-zellige">
              <div className="absolute inset-0 bg-[#0A0F1C]/90 -z-10"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Network graph visual */}
              <div className="relative h-[160px] overflow-hidden border-b border-white/5 z-10">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
                  {/* Connection lines */}
                  <line x1="80" y1="50" x2="180" y2="80" stroke="#2DD4BF" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="180" y1="80" x2="300" y2="45" stroke="#2DD4BF" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="180" y1="80" x2="250" y2="120" stroke="#2DD4BF" strokeOpacity="0.06" strokeWidth="1" />
                  <line x1="300" y1="45" x2="350" y2="100" stroke="#2DD4BF" strokeOpacity="0.06" strokeWidth="1" />
                  <line x1="80" y1="50" x2="120" y2="120" stroke="#2DD4BF" strokeOpacity="0.06" strokeWidth="1" />
                  <line x1="120" y1="120" x2="250" y2="120" stroke="#2DD4BF" strokeOpacity="0.05" strokeWidth="1" />
                  <line x1="50" y1="100" x2="80" y2="50" stroke="#2DD4BF" strokeOpacity="0.05" strokeWidth="1" />
                  <line x1="50" y1="100" x2="120" y2="120" stroke="#2DD4BF" strokeOpacity="0.04" strokeWidth="1" />
                  {/* Nodes */}
                  <circle cx="80" cy="50" r="4" fill="#2DD4BF" fillOpacity="0.12" style={{ animation: 'node-pulse 4s ease-in-out infinite' }} />
                  <circle cx="180" cy="80" r="5" fill="#2DD4BF" fillOpacity="0.15" style={{ animation: 'node-pulse 4s ease-in-out 0.5s infinite' }} />
                  <circle cx="300" cy="45" r="3.5" fill="#2DD4BF" fillOpacity="0.1" style={{ animation: 'node-pulse 4s ease-in-out 1s infinite' }} />
                  <circle cx="250" cy="120" r="4" fill="#2DD4BF" fillOpacity="0.12" style={{ animation: 'node-pulse 4s ease-in-out 1.5s infinite' }} />
                  <circle cx="350" cy="100" r="3" fill="#2DD4BF" fillOpacity="0.08" style={{ animation: 'node-pulse 4s ease-in-out 2s infinite' }} />
                  <circle cx="120" cy="120" r="3.5" fill="#2DD4BF" fillOpacity="0.1" style={{ animation: 'node-pulse 4s ease-in-out 2.5s infinite' }} />
                  <circle cx="50" cy="100" r="3" fill="#2DD4BF" fillOpacity="0.08" style={{ animation: 'node-pulse 4s ease-in-out 3s infinite' }} />
                </svg>
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-1">
              <div className="mb-6 flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Python Pipeline', 'AI/LLM', 'MENA', 'Data Viz'].map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white/5 text-muted-foreground border border-white/10 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-secondary transition-colors">MENA Rising — Weekly Economic Intelligence</h3>

              <p className="text-muted-foreground leading-relaxed mb-8 flex-1 font-editorial text-lg">
                An AI-powered emerging-markets intelligence app tracking MENA economic signals weekly. Built with an Ottoman design system and a fully automated data pipeline.
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
            </div>
          </Link>
        </div>
      </section>

      {/* Coursework Section */}
      <section className="py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-6 bg-primary rounded-full"></div>
            <h2 className="text-2xl font-serif">Selected Coursework</h2>
          </div>
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

          {/* Causal Forest */}
          <Link href="/causal-forest" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">ECON 460</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">R Markdown</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Causal Forest — Financial Aid & Retention</h3>
              <p className="text-sm text-muted-foreground mb-4">Heterogeneous treatment effects on 1,000 universities using causal ML on College Scorecard data.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['R', 'Causal ML', 'grf'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* PCA & Classification */}
          <Link href="/pca-voting" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">ECON 460</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">R Markdown</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Classification & PCA</h3>
              <p className="text-sm text-muted-foreground mb-4">Spam logistic regression with ROC/AUC, plus PCA on congressional voting records.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['R', 'PCA', 'Logistic Regression'].map(tag => (
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

          {/* Connect 4 */}
          <Link href="/connect-4" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">CSCI 103</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">C++ · Playable</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Connect 4</h3>
              <p className="text-sm text-muted-foreground mb-4">Terminal-based game ported to the browser. Play against an AI that blocks, attacks, then falls back to positional play.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['C++', 'Game AI', 'Dynamic Memory', 'Win Detection'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Blackjack */}
          <Link href="/blackjack" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">CSCI 103</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">C++ · Playable</span>
              </div>
              <h3 className="text-lg font-serif mb-2 group-hover:text-white transition-colors">Blackjack (Twenty-One)</h3>
              <p className="text-sm text-muted-foreground mb-4">Full game loop with Fisher-Yates shuffle, soft/hard Ace logic, and dealer AI that hits to 17.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['C++', 'Fisher-Yates', 'Game Logic', 'Card Rendering'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-[2px] h-4 bg-primary rounded-full"></div>
            <h2 className="text-lg font-serif text-white/80">Certifications</h2>
          </div>
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
