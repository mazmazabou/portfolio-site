import { Link, useLocation } from "wouter";
import { Menu, X, Github, Linkedin, Instagram, ChevronDown, Gamepad2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL, EMAIL, SOFTSAID_URL } from "@/lib/site";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 300);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 glass-panel">
        <div className="max-w-[1100px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-medium tracking-tight">
            Mazen<span className="md:hidden lg:inline"> Abouelela</span><span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" ref={dropdownRef}>
            <Link href="/" className={`text-sm hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-foreground'}`}>
              Home
            </Link>

            <button
              onClick={() => {
                if (location === '/') {
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#about";
                }
              }}
              className="text-sm hover:text-primary transition-colors text-foreground"
            >
              About
            </button>

            {/* Projects Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleDropdownEnter('projects')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => toggleDropdown('projects')}
                className={`flex items-center gap-1 text-sm hover:text-primary transition-colors ${location === '/mena-rising' ? 'text-primary' : 'text-foreground'}`}
              >
                Projects <ChevronDown size={14} className={`opacity-50 transition-transform ${openDropdown === 'projects' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'projects' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-[0_18px_40px_-20px_rgba(29,26,22,0.35)] overflow-hidden py-1">
                  <a href={SOFTSAID_URL} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Softsaid ↗
                  </a>
                  <Link href="/mena-rising" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    MENA Rising
                  </Link>
                </div>
              )}
            </div>

            {/* Coursework Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleDropdownEnter('coursework')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => toggleDropdown('coursework')}
                className={`flex items-center gap-1 text-sm hover:text-primary transition-colors ${(location === '/fama-french' || location === '/al-ard' || location === '/microsoft-tax' || location === '/dsci-351' || location === '/mena-slides' || location === '/causal-forest' || location === '/pca-voting') ? 'text-primary' : 'text-foreground'}`}
              >
                Coursework <ChevronDown size={14} className={`opacity-50 transition-transform ${openDropdown === 'coursework' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'coursework' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-[0_18px_40px_-20px_rgba(29,26,22,0.35)] overflow-hidden py-1">
                  <Link href="/fama-french" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Fama-French
                  </Link>
                  <Link href="/al-ard" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Al-Ard
                  </Link>
                  <Link href="/microsoft-tax" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Microsoft Tax
                  </Link>
                  <Link href="/dsci-351" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    DSCI 351
                  </Link>
                  <Link href="/mena-slides" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    MENA Slides
                  </Link>
                  <Link href="/causal-forest" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Causal Forest
                  </Link>
                  <Link href="/pca-voting" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    PCA & Classification
                  </Link>
                </div>
              )}
            </div>

            {/* Games Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleDropdownEnter('games')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => toggleDropdown('games')}
                className={`flex items-center gap-1 text-sm hover:text-primary transition-colors ${(location === '/connect-4' || location === '/blackjack') ? 'text-primary' : 'text-foreground'}`}
              >
                <Gamepad2 size={14} className="opacity-70" /> Games <ChevronDown size={14} className={`opacity-50 transition-transform ${openDropdown === 'games' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'games' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-[0_18px_40px_-20px_rgba(29,26,22,0.35)] overflow-hidden py-1">
                  <Link href="/connect-4" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Connect 4
                  </Link>
                  <Link href="/blackjack" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors">
                    Blackjack
                  </Link>
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-border ml-2 mr-2"></div>

            <div className="flex items-center gap-4">
              <a href={GITHUB_URL} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
              </a>
              <a href={LINKEDIN_URL} aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
              </a>
              {INSTAGRAM_URL && (
                <a href={INSTAGRAM_URL} aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border absolute top-full left-0 w-full animate-in slide-in-from-top-2">
            <nav className="flex flex-col px-6 py-4 gap-4">
              <Link href="/" className="text-lg font-medium">Home</Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (location === '/') {
                    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#about";
                  }
                }}
                className="text-lg font-medium text-left"
              >
                About
              </button>

              <div className="py-2">
                <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Projects</div>
                <div className="flex flex-col gap-3 pl-4 border-l border-border">
                  <a href={SOFTSAID_URL} target="_blank" rel="noopener noreferrer" className="text-lg">Softsaid ↗</a>
                  <Link href="/mena-rising" className="text-lg">MENA Rising</Link>
                </div>
              </div>

              <div className="py-2">
                <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Coursework</div>
                <div className="flex flex-col gap-3 pl-4 border-l border-border">
                  <Link href="/fama-french" className="text-lg">Fama-French</Link>
                  <Link href="/al-ard" className="text-lg">Al-Ard</Link>
                  <Link href="/microsoft-tax" className="text-lg">Microsoft Tax</Link>
                  <Link href="/dsci-351" className="text-lg">DSCI 351</Link>
                  <Link href="/mena-slides" className="text-lg">MENA Slides</Link>
                  <Link href="/causal-forest" className="text-lg">Causal Forest</Link>
                  <Link href="/pca-voting" className="text-lg">PCA & Classification</Link>
                </div>
              </div>

              <div className="py-2">
                <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider flex items-center gap-1.5"><Gamepad2 size={12} /> Games</div>
                <div className="flex flex-col gap-3 pl-4 border-l border-border">
                  <Link href="/connect-4" className="text-lg">Connect 4</Link>
                  <Link href="/blackjack" className="text-lg">Blackjack</Link>
                </div>
              </div>

              <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                <a href={GITHUB_URL} className="text-foreground" target="_blank" rel="noopener noreferrer"><Github size={24} /></a>
                <a href={LINKEDIN_URL} aria-label="LinkedIn" className="text-foreground" target="_blank" rel="noopener noreferrer"><Linkedin size={24} /></a>
                {INSTAGRAM_URL && <a href={INSTAGRAM_URL} aria-label="Instagram" className="text-foreground" target="_blank" rel="noopener noreferrer"><Instagram size={24} /></a>}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <div className="max-w-[1100px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            Built by Mazen Abouelela · Atlanta, GA
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a href={`mailto:${EMAIL}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{EMAIL}</a>
            <a href="/pdfs/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
              Resume
            </a>
            <div className="flex gap-4">
              <a href={GITHUB_URL} aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Github size={18} />
              </a>
              <a href={LINKEDIN_URL} aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
              </a>
              {INSTAGRAM_URL && (
                <a href={INSTAGRAM_URL} aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
