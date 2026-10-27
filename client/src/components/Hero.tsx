import { ArrowUpRight, ArrowDown } from "lucide-react";
import { SOFTSAID_URL } from "@/lib/site";
import type { CSSProperties } from "react";

// Photos shown in the hero stack. Swap files/captions here at preview review.
const HERO_PHOTOS = [
  {
    src: "/images/about-graduation.jpg",
    alt: "Mazen in a USC cap and gown under a campus archway",
    caption: "USC commencement · May 2026",
  },
  {
    src: "/images/about-dicks-creek.jpg",
    alt: "Mazen standing on the rocks at Dicks Creek Falls",
    caption: "Dicks Creek Falls, GA · Oct 2026",
  },
];

const WORK_TICKER = [
  "Softsaid",
  "MENA Rising",
  "Fama-French factor model",
  "Causal forests on 1,000 universities",
  "PCA on congressional votes",
  "Redis + MongoDB inventory system",
  "Microsoft Ireland tax memo",
  "Al-Ard film review",
  "Connect 4 in C",
  "Blackjack",
];

const LIFE_TICKER = [
  "Grew up in Egypt",
  "Moved to the U.S. at 13",
  "Six years as an ocean lifeguard & EMT",
  "Captained LBCC swim to state finals",
  "M.S. Applied Economics, USC",
  "Co-founded USC's Egyptian Student Association",
  "Data & AI consulting at Aprio",
  "Building Softsaid",
];

type Segment = { text: string; accent?: boolean };

// Every hero element is fully visible in its resting state. The entrance motion lives in
// index.css under prefers-reduced-motion: no-preference, so with motion reduced or animations
// disabled the hero renders complete instead of leaving hidden text under the name.
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

function RevealWords({ segments, start = 0, step = 0.05 }: { segments: Segment[]; start?: number; step?: number }) {
  const words = segments.flatMap((seg) => seg.text.split(" ").map((w) => ({ w, accent: seg.accent })));
  return (
    <>
      {words.map(({ w, accent }, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <span
            className={`inline-block hero-word ${accent ? "italic text-primary" : ""}`}
            style={delay(start + i * step)}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </>
  );
}

function Ticker({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const row = [...items, ...items];
  return (
    <div
      className="overflow-hidden py-3"
      style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className={`flex w-max gap-10 ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {row.map((item, i) => (
          <span key={i} aria-hidden={i >= items.length} className="flex items-center gap-10 whitespace-nowrap font-serif text-xl md:text-2xl text-foreground/70">
            {item}
            <span className="text-primary text-base" aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ onViewPortfolio }: { onViewPortfolio: () => void }) {
  return (
    <section className="relative pt-16 md:pt-24">
      <div className="absolute inset-x-0 top-0 h-[520px] paper-grain -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="grid md:grid-cols-[1.35fr_1fr] gap-12 md:gap-8 items-center">
        {/* Text */}
        <div>
          <div
            className="hero-rise inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-8"
            style={delay(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            Now: Data &amp; AI consulting at Aprio · Atlanta
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-normal leading-[0.95] tracking-[-0.03em] mb-8">
            <RevealWords segments={[{ text: "Mazen" }]} start={0.1} />
            <br />
            <RevealWords segments={[{ text: "Abouelela" }]} start={0.2} />
          </h1>

          <p className="text-2xl md:text-[1.75rem] font-serif text-foreground/85 leading-snug max-w-xl mb-6">
            <RevealWords
              start={0.5}
              step={0.035}
              segments={[
                { text: "I find" },
                { text: "problems worth solving", accent: true },
                { text: "and build everything it takes to prove the solution." },
              ]}
            />
          </p>

          <p
            className="hero-fade text-sm text-muted-foreground mb-10 flex flex-wrap gap-x-3 gap-y-1 items-center"
            style={delay(1.2)}
          >
            <span>USC · Fall 2022 – Spring 2026</span>
            <span className="text-border" aria-hidden>|</span>
            <span>11 pieces</span>
            <span className="text-border" aria-hidden>|</span>
            <span>2 live products</span>
            <span className="text-border" aria-hidden>|</span>
            <span>3 runnable notebooks</span>
            <span className="text-border" aria-hidden>|</span>
            <span>2 playable games</span>
          </p>

          <div className="hero-rise flex flex-col sm:flex-row gap-3" style={delay(1.35)}>
            <a
              href={SOFTSAID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background h-12 px-7 text-[15px] font-medium transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(29,26,22,0.6)]"
            >
              See Softsaid <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              onClick={onViewPortfolio}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card h-12 px-7 text-[15px] font-medium transition-colors hover:border-foreground/40"
            >
              View Full Portfolio <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Photo stack */}
        <div className="relative h-[290px] sm:h-[440px] md:h-[520px]">
          {HERO_PHOTOS.map((photo, i) => (
            <figure
              key={photo.src}
              className={`absolute w-[46%] md:w-[54%] ${i === 0 ? "left-[2%] top-0 -rotate-[5deg]" : "right-[3%] top-[18%] md:top-[22%] rotate-[4deg]"}`}
              style={{ zIndex: i + 1 }}
            >
              <div className="hero-rise" style={delay(0.4 + i * 0.25)}>
                <div className={i === 0 ? "hero-float" : "hero-float-alt"}>
                  <div className="bg-card p-2.5 pb-3 rounded-sm border border-border shadow-[0_24px_50px_-24px_rgba(29,26,22,0.55)] transition-transform duration-500 hover:scale-[1.03]">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full aspect-[4/5] object-cover"
                      loading="eager"
                    />
                    <figcaption className="mt-2 text-[10px] md:text-[11px] leading-tight text-muted-foreground font-serif italic text-center">
                      {photo.caption}
                    </figcaption>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* Tickers */}
      <div className="hero-fade mt-14 md:mt-16 border-y border-border" style={delay(1.6)}>
        <Ticker items={WORK_TICKER} direction="left" />
        <div className="h-px bg-border" />
        <Ticker items={LIFE_TICKER} direction="right" />
      </div>
    </section>
  );
}
