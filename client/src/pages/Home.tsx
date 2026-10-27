import { Link, useLocation } from "wouter";
import { ArrowRight, ArrowUpRight, Award, Gamepad2, Instagram, Youtube } from "lucide-react";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Hero from "@/components/Hero";
import RideOpsArchive from "@/components/RideOpsArchive";
import { SOFTSAID_URL, SOFTSAID_APP_STORE_URL, SOFTSAID_INSTAGRAM_URL, SOFTSAID_YOUTUBE_URL } from "@/lib/site";

// Bio approved by Mazen (Oct 2026).
const BIO = [
  "I grew up in Egypt and moved to the U.S. with my family when I was 13. We started over in Southern California with very little but a lot of drive, and I'm a first-generation college student.",
  "Before any of the work on this site, there was the ocean. I spent six years as an ocean lifeguard and EMT on the beaches of Long Beach, a job where you read the water, act fast, and stay calm when nobody else is. I was a swimmer too, and captained the Long Beach City College team to the state finals. Both taught me the same thing: the preparation nobody sees is what holds up when it counts.",
  "From there I went to USC, where I finished an M.S. in Applied Economics and co-founded the Egyptian Student Association, a small piece of home on campus.",
  "Three pieces in this portfolio engage the MENA region from different angles: economic intelligence, development policy, and cultural criticism. That's not a coincidence. Where I come from shapes what I pay attention to.",
  "Today I'm in Atlanta doing Data & AI consulting at Aprio. On nights and weekends I build my own things. Right now that's Softsaid, an app that writes your morning affirmations from your own journal. Before it came RideOps, a transportation ops platform that started with a problem I saw at my campus job; it's shelved now.",
  "When I'm not at a keyboard, I'm usually outside: in the water, or on a trail somewhere in north Georgia.",
];

function SectionHeading({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <h2 className="text-4xl md:text-5xl font-serif font-normal tracking-[-0.02em] flex items-center gap-3">{title}</h2>
      {children}
      <div className="h-px bg-border flex-1"></div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [showGameModal, setShowGameModal] = useState(false);
  const projectsEndRef = useRef<HTMLDivElement>(null);

  // Offer the games once the visitor has scrolled through Live Products, not mid-first-scroll.
  useEffect(() => {
    if (localStorage.getItem("portfolio-game-dismissed")) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      const marker = projectsEndRef.current;
      if (!marker || marker.getBoundingClientRect().top > window.innerHeight) return;
      window.removeEventListener("scroll", check);
      timer = setTimeout(() => setShowGameModal(true), 700);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      if (timer) clearTimeout(timer);
    };
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

  // The bio is a draft pending Mazen's approval; the badge never renders on the production domain.
  const showDraftBadge = typeof window !== "undefined" && !window.location.hostname.endsWith("mazenabouelela.com");

  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Welcome Game Modal */}
      <Dialog open={showGameModal} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-7 h-7 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-serif text-foreground">Wanna play a game?</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-1">
              Take a break with one of my CSCI 103 projects, ported from the terminal to the browser.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => handleGameChoice("/connect-4")}
              className="group glass-card p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="text-2xl mb-2">🔴</div>
              <h3 className="font-serif text-foreground group-hover:text-primary transition-colors text-base font-medium">Connect 4</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Play against an AI opponent</p>
            </button>

            <button
              onClick={() => handleGameChoice("/blackjack")}
              className="group glass-card p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="text-2xl mb-2">🃏</div>
              <h3 className="font-serif text-foreground group-hover:text-primary transition-colors text-base font-medium">Blackjack</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Hit, stand, or bust</p>
            </button>
          </div>

          <button
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 text-center"
          >
            No thanks, show me the portfolio
          </button>
        </DialogContent>
      </Dialog>

      <Hero onViewPortfolio={scrollToProjects} />

      {/* About Section */}
      <section id="about" className="py-24 scroll-mt-24">
        <SectionHeading title="About">
          {showDraftBadge && (
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-primary text-primary-foreground">
              Draft · pending approval
            </span>
          )}
        </SectionHeading>
        <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">
          <motion.img
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            src="/images/headshot.png"
            alt="Mazen Abouelela"
            className="w-full max-w-[320px] md:max-w-none rounded-sm border border-border bg-card p-2 shadow-[0_24px_50px_-28px_rgba(29,26,22,0.5)] object-cover md:sticky md:top-28"
          />
          <div className="font-serif text-[1.2rem] md:text-[1.3rem] leading-[1.65] text-foreground/85 space-y-6 max-w-[38rem]">
            {BIO.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={i === 0 ? "first-letter:float-left first-letter:font-serif first-letter:text-[4.2rem] first-letter:leading-[0.85] first-letter:mr-2 first-letter:mt-1 first-letter:text-primary" : ""}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 scroll-mt-24">
        <SectionHeading title="Live Products" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Softsaid (external product, no internal page) */}
          <div className="group glass-card h-full flex flex-col relative overflow-hidden hover:border-primary/50 transition-all duration-500">
            {/* Real in-app screens (same renders as softsaid.app) */}
            <div className="relative h-[220px] overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_50%_0%,rgba(168,67,42,0.14),transparent_70%)]">
              <div className="absolute inset-x-0 top-6 flex justify-center gap-3 md:gap-4 px-6">
                {[
                  { src: "screen-viewer.jpg", alt: "Softsaid affirmation viewer" },
                  { src: "screen-why.jpg", alt: "Softsaid \"Why this affirmation?\" sheet" },
                  { src: "screen-checkin.jpg", alt: "Softsaid morning check-in" },
                ].map((shot, i) => (
                  <img
                    key={shot.src}
                    src={`/images/softsaid/${shot.src}`}
                    alt={shot.alt}
                    loading="lazy"
                    className={`w-[28%] max-w-[130px] rounded-[14px] border border-border shadow-[0_18px_30px_-18px_rgba(29,26,22,0.5)] transition-transform duration-500 group-hover:-translate-y-1 ${i === 1 ? "mt-0" : "mt-5"}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col flex-1">
              <div className="mb-6 flex flex-wrap gap-2">
                {['iPhone App', 'Web App', 'Next.js', 'Journaling', 'Voice'].map(tag => (
                  <span key={tag} className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-1 bg-muted text-muted-foreground border border-border rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-normal mb-4">Softsaid — Affirmations From Your Own Journal</h3>

              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                Softsaid reads your morning check-in and what you journaled, writes that day's affirmations for you, and lets you record them in your own voice. Free on the web and iPhone, with home screen widgets and a Premium tier in the app.
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-xs font-bold tracking-widest text-primary uppercase">Live Product</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { href: SOFTSAID_APP_STORE_URL, label: "App Store", primary: true },
                    { href: SOFTSAID_URL, label: "softsaid.app" },
                    { href: SOFTSAID_INSTAGRAM_URL, label: "Instagram", icon: Instagram },
                    { href: SOFTSAID_YOUTUBE_URL, label: "YouTube", icon: Youtube },
                  ].map(({ href, label, primary, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={primary
                        ? "inline-flex items-center gap-1.5 rounded-full bg-foreground text-background h-9 px-4 text-xs font-medium transition-transform hover:-translate-y-0.5"
                        : "inline-flex items-center gap-1.5 rounded-full border border-border bg-card h-9 px-4 text-xs font-medium transition-colors hover:border-foreground/40"}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: MENA Rising */}
          <Link href="/mena-rising" className="block group">
            <div className="glass-card h-full flex flex-col relative overflow-hidden group-hover:border-secondary/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Network graph visual */}
              <div className="relative h-[160px] overflow-hidden border-b border-border z-10">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
                  {/* Connection lines */}
                  <line x1="80" y1="50" x2="180" y2="80" stroke="#2F5D50" strokeOpacity="0.8" strokeWidth="1" />
                  <line x1="180" y1="80" x2="300" y2="45" stroke="#2F5D50" strokeOpacity="0.8" strokeWidth="1" />
                  <line x1="180" y1="80" x2="250" y2="120" stroke="#2F5D50" strokeOpacity="0.6" strokeWidth="1" />
                  <line x1="300" y1="45" x2="350" y2="100" stroke="#2F5D50" strokeOpacity="0.6" strokeWidth="1" />
                  <line x1="80" y1="50" x2="120" y2="120" stroke="#2F5D50" strokeOpacity="0.6" strokeWidth="1" />
                  <line x1="120" y1="120" x2="250" y2="120" stroke="#2F5D50" strokeOpacity="0.5" strokeWidth="1" />
                  <line x1="50" y1="100" x2="80" y2="50" stroke="#2F5D50" strokeOpacity="0.5" strokeWidth="1" />
                  <line x1="50" y1="100" x2="120" y2="120" stroke="#2F5D50" strokeOpacity="0.4" strokeWidth="1" />
                  {/* Nodes */}
                  <circle cx="80" cy="50" r="4" fill="#2F5D50" fillOpacity="0.12" style={{ animation: 'node-pulse 4s ease-in-out infinite' }} />
                  <circle cx="180" cy="80" r="5" fill="#2F5D50" fillOpacity="0.15" style={{ animation: 'node-pulse 4s ease-in-out 0.5s infinite' }} />
                  <circle cx="300" cy="45" r="3.5" fill="#2F5D50" fillOpacity="0.1" style={{ animation: 'node-pulse 4s ease-in-out 1s infinite' }} />
                  <circle cx="250" cy="120" r="4" fill="#2F5D50" fillOpacity="0.12" style={{ animation: 'node-pulse 4s ease-in-out 1.5s infinite' }} />
                  <circle cx="350" cy="100" r="3" fill="#2F5D50" fillOpacity="0.08" style={{ animation: 'node-pulse 4s ease-in-out 2s infinite' }} />
                  <circle cx="120" cy="120" r="3.5" fill="#2F5D50" fillOpacity="0.1" style={{ animation: 'node-pulse 4s ease-in-out 2.5s infinite' }} />
                  <circle cx="50" cy="100" r="3" fill="#2F5D50" fillOpacity="0.08" style={{ animation: 'node-pulse 4s ease-in-out 3s infinite' }} />
                </svg>
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-1">
              <div className="mb-6 flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Python Pipeline', 'AI/LLM', 'MENA', 'Data Viz'].map(tag => (
                  <span key={tag} className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-1 bg-muted text-muted-foreground border border-border rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-normal mb-4 group-hover:text-secondary transition-colors">MENA Rising — Weekly Economic Intelligence</h3>

              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
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

        {/* Softsaid App Store panels */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Softsaid on the App Store</h3>
            <a href={SOFTSAID_APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
              View listing <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-3 snap-x">
            {[
              { src: "panel-01-written-for-you.jpg", alt: "Written for you, not for everyone." },
              { src: "panel-02-from-your-journal.jpg", alt: "Made from your own journal." },
              { src: "panel-03-your-own-voice.jpg", alt: "Hear it in your own voice." },
              { src: "panel-04-home-screen-widgets.jpg", alt: "Today's words, on your home screen." },
              { src: "panel-05-themes.jpg", alt: "Make it feel like yours." },
              { src: "panel-06-daily-check-in.jpg", alt: "Start with how you feel." },
            ].map((panel) => (
              <img
                key={panel.src}
                src={`/images/softsaid/${panel.src}`}
                alt={`Softsaid App Store panel: ${panel.alt}`}
                loading="lazy"
                className="snap-start shrink-0 w-[42%] sm:w-[30%] md:w-[calc((100%-5*1rem)/6)] rounded-xl border border-border"
              />
            ))}
          </div>
        </div>

        {/* Archive */}
        <div className="mt-12">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Archive</h3>
          <RideOpsArchive />
        </div>
        <div ref={projectsEndRef} aria-hidden />
      </section>

      {/* Coursework Section */}
      <section className="py-16">
        <SectionHeading title="Selected Coursework" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fama-French */}
          <Link href="/fama-french" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">ECON 577</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">Jupyter Notebook</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Fama-French Factor Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">Three-factor model, full data pipeline, and the interpretation that actually matters.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['Python', 'Econometrics', 'Finance'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Causal Forest */}
          <Link href="/causal-forest" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">ECON 460</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">R Markdown</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Causal Forest — Financial Aid & Retention</h3>
              <p className="text-sm text-muted-foreground mb-4">Heterogeneous treatment effects on 1,000 universities using causal ML on College Scorecard data.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['R', 'Causal ML', 'grf'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* PCA & Classification */}
          <Link href="/pca-voting" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">ECON 460</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">R Markdown</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Classification & PCA</h3>
              <p className="text-sm text-muted-foreground mb-4">Spam logistic regression with ROC/AUC, plus PCA on congressional voting records.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['R', 'PCA', 'Logistic Regression'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Al-Ard */}
          <Link href="/al-ard" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">MDES 401</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted text-foreground/75 border border-border rounded">Long-form Essay · 8 pages</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Al-Ard — Film Review</h3>
              <p className="text-sm text-muted-foreground italic font-serif text-base mb-4">Close reading of Chahine's 1969 Egyptian film.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['Cultural Criticism', 'Film Studies', 'MENA'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Microsoft Tax */}
          <Link href="/microsoft-tax" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">WRIT 340</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted text-foreground/75 border border-border rounded">Business Memo</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Microsoft Ireland Tax Memo</h3>
              <p className="text-sm text-muted-foreground mb-4"><span className="text-primary font-medium">$858M</span> in Microsoft tax savings — calculated from real S&P Capital IQ data.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['Business Writing', 'Tax Policy', 'Financial Analysis'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* DSCI 351 */}
          <Link href="/dsci-351" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">DSCI 351</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted text-foreground/75 border border-border rounded">Technical Report · 12 pages</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Dual-Database Inventory System</h3>
              <p className="text-sm text-muted-foreground mb-4">Redis + MongoDB dual-database architecture with aggregate pipelines and GUI.</p>
              <div className="mt-auto flex flex-wrap justify-between items-end gap-2">
                <div className="flex flex-wrap gap-1">
                  {['MongoDB', 'Redis', 'Python', 'Systems Design'].map(tag => (
                    <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground italic">with Dev Kapashi</span>
              </div>
            </div>
          </Link>

          {/* MENA Slides — centered in last row */}
          <div className="lg:col-start-2">
            <Link href="/mena-slides" className="block group">
              <div className="glass-card p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-sans font-medium text-muted-foreground">ECON 305</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-muted text-foreground/75 border border-border rounded">Presentation · 18 slides</span>
                </div>
                <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Growth Challenges in MENA</h3>
                <p className="text-sm text-muted-foreground mb-4">Structural growth barriers across the MENA region.</p>
                <div className="mt-auto flex flex-wrap justify-between items-end gap-2">
                  <div className="flex flex-wrap gap-1">
                    {['MENA', 'Development Economics', 'Policy'].map(tag => (
                      <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground italic">with Dev Kapashi</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16">
        <SectionHeading title={<><Gamepad2 size={28} className="text-primary" /> Playable Games</>} />

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Connect 4 */}
          <Link href="/connect-4" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">CSCI 103</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">C · Playable</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Connect 4</h3>
              <p className="text-sm text-muted-foreground mb-4">Terminal-based game ported to the browser. Play against an AI that blocks, attacks, then falls back to positional play.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['C', 'Game AI', 'Dynamic Memory', 'Win Detection'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>

          {/* Blackjack */}
          <Link href="/blackjack" className="block group">
            <div className="glass-card p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-sans font-medium text-muted-foreground">CSCI 103</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">C++ · Playable</span>
              </div>
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">Blackjack (Twenty-One)</h3>
              <p className="text-sm text-muted-foreground mb-4">Full game loop with Fisher-Yates shuffle, soft/hard Ace logic, and dealer AI that hits to 17.</p>
              <div className="mt-auto flex flex-wrap gap-1">
                {['C++', 'Fisher-Yates', 'Game Logic', 'Card Rendering'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-serif font-normal text-foreground/80">Certifications</h2>
          <div className="h-px bg-border flex-1"></div>
        </div>
        <a href="/pdfs/data-analyst-cert.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 glass-card px-5 py-3 hover:border-primary/30 transition-colors group">
          <Award size={18} className="text-primary" />
          <div>
            <p className="text-sm text-foreground/90 group-hover:text-primary transition-colors">DataCamp Data Analyst Associate</p>
            <p className="text-[11px] text-muted-foreground">View certificate</p>
          </div>
        </a>
      </section>
    </div>
  );
}
