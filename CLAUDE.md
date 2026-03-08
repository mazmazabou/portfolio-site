# CLAUDE.md — Mazen Abouelela Portfolio Site

## Project Overview

Personal portfolio site for Mazen Abouelela (USC, Fall 2022 – Spring 2026). 10-page React SPA showcasing 2 live products, 6 academic pieces, and 1 personal project. The site is built and visually complete — remaining work is compiling real assets (PDFs, code, screenshots, links) into the existing scaffold.

**Repo:** https://github.com/mazmazabou/portfolio-site
**Local path:** /Users/mazenabouelela/Documents/Projects/Portfolio-Site

## Tech Stack

- React 19.2 + TypeScript 5.6, Vite 7.1.9, Wouter 3.3.5 (routing)
- Tailwind CSS 4.1.14, shadcn/ui (56 Radix components, "New York" style)
- Framer Motion 12.23, Lucide React icons, Recharts 2.15
- Express 5.0.1 backend (serves static files only — no API endpoints used)
- Drizzle ORM + Passport auth are scaffolded but UNUSED — ignore them

## Design System (DO NOT BREAK)

- **Background:** #0A0F1C (dark navy)
- **Primary accent:** #D4A853 (gold/amber)
- **Secondary accent:** #2DD4BF (teal)
- **Text:** #F5F5F5 (white), #94A3B8 (muted slate for secondary)
- **Cards:** Glassmorphism effect with subtle borders
- **Patterns:** Ottoman zellige tile overlays
- **Fonts:** Cormorant Garamond (headings), Inter (body), JetBrains Mono (code/data), Crimson Pro (editorial prose)
- **Theme:** ALL DARK. The 404 page has a bug (bg-gray-50) — fix it to match.

## File Structure

```
client/src/pages/       ← All 10 page components live here
client/src/components/  ← Layout.tsx (nav/footer) + 56 shadcn/ui components
client/public/          ← Static assets (favicon, OG image)
server/                 ← Express server (only serves static files)
```

## Route Map

| Route | Page Component | Status |
|-------|---------------|--------|
| `/` | Home.tsx | DONE |
| `/ride-ops` | RideOps.tsx | DONE (links stubbed) |
| `/mena-rising` | MENARising.tsx | PARTIAL (needs hero screenshot) |
| `/fama-french` | FamaFrench.tsx | PARTIAL (4 code cells are placeholders) |
| `/econ-500` | Econ500.tsx | PARTIAL (PDF viewer not wired) |
| `/al-ard` | AlArd.tsx | PARTIAL (PDF viewer not wired) |
| `/microsoft-tax` | MicrosoftTax.tsx | PARTIAL (PDF viewer not wired) |
| `/dsci-351` | DSCI351.tsx | PARTIAL (PDF viewer not wired) |
| `/mena-slides` | MENASlides.tsx | PARTIAL (6 slide placeholders) |
| `/valentine` | Valentine.tsx | DONE (link stubbed) |

---

## REMAINING WORK — TASK BY TASK

### Task 1: PDF Viewer Implementation

**Pages affected:** `/econ-500`, `/al-ard`, `/microsoft-tax`, `/dsci-351`

Each of these pages has a placeholder that says "PDF Viewer — to be embedded after conversion to App Mode" with a FileText icon. Replace each placeholder with a working inline PDF viewer.

**Approach:** Use `<iframe>` or `<embed>` pointing to a PDF file in `client/public/pdfs/`. Do NOT add heavy libraries like react-pdf unless Mazen requests it. A simple `<iframe src="/pdfs/filename.pdf" class="w-full h-[80vh] rounded-lg border border-white/10" />` is sufficient and keeps the bundle small.

**Steps when Mazen provides PDFs:**
1. Create `client/public/pdfs/` directory
2. Copy PDF files there with clean names: `econ-500-final.pdf`, `al-ard-review.pdf`, `microsoft-tax-memo.pdf`, `dsci-351-report.pdf`
3. Replace the placeholder div in each page component with the iframe viewer
4. Wire the "Download PDF" button to use `<a href="/pdfs/filename.pdf" download>`
5. Style the iframe to match dark theme (dark border, rounded corners, good height)

### Task 2: Fama-French Code Cells

**Page:** `/fama-french` (FamaFrench.tsx)

4 placeholder code blocks exist with `# [Code placeholder - to be pasted later]`. When Mazen provides the real Python code from his Jupyter notebook:

1. Replace each placeholder with the actual code
2. Keep the existing dark background styling (#1E293B)
3. Use JetBrains Mono font
4. Add line numbers on the left side if not already present
5. The 4 cells should be: Data Loading, Factor Construction, OLS Regression, Interpretation
6. Also wire the .ipynb download button to `client/public/notebooks/fama-french.ipynb`

### Task 3: MENA Rising Screenshot

**Page:** `/mena-rising` (MENARising.tsx)

There's a placeholder that says "Full-page screenshot of the app at 1440px — to be added". When Mazen provides the screenshot:

1. Save to `client/public/images/mena-rising-hero.png`
2. Replace the placeholder with `<img>` — full width, rounded corners, subtle border
3. Consider adding a subtle shadow or glow effect matching the gold/teal accent palette

### Task 4: MENA Slides Gallery

**Page:** `/mena-slides` (MENASlides.tsx)

6 placeholder boxes labeled "Slide Placeholder {1-6}". When Mazen provides slide screenshots:

1. Save to `client/public/images/slides/slide-1.png` through `slide-6.png` (or however many)
2. Replace placeholders with real images in a responsive grid (3 columns desktop, 2 tablet, 1 mobile)
3. Keep the caption: "Selected slides — co-authored with Dev Kapashi"
4. Maintain 16:9 aspect ratio on each image

### Task 5: External Links — Replace All href="#"

**Files affected:** Layout.tsx (nav/footer) + RideOps.tsx, MENARising.tsx, Valentine.tsx

Replace these stubbed links with real URLs:

| Link | Real URL | Location |
|------|----------|----------|
| GitHub profile | https://github.com/mazmazabou | Layout.tsx (header + footer) |
| LinkedIn profile | ASK MAZEN | Layout.tsx (header + footer) |
| Resume download | /pdfs/resume.pdf (when provided) | Layout.tsx footer |
| Email | ASK MAZEN | Layout.tsx footer (currently placeholder@example.com) |
| RideOps marketing site | https://ride-ops.com | RideOps.tsx |
| RideOps app demo | https://app.ride-ops.com | RideOps.tsx |
| MENA Rising | https://mena-rising.com | MENARising.tsx |
| Valentine project | ASK MAZEN | Valentine.tsx |

**All external links must have:** `target="_blank" rel="noopener noreferrer"`

### Task 6: Cleanup

- **404 page:** Fix `bg-gray-50` in not-found.tsx to use dark theme colors (#0A0F1C background, white/slate text)
- **Server dead code:** The Express backend has unused Passport auth, Drizzle ORM, and an empty routes.ts. Either strip it all out (preferred — this is a static SPA) or leave it but don't let it cause confusion. If stripping, keep the Express server only for static file serving + Vite dev middleware.
- **Replit artifacts:** Remove `.replit` config file and `attached_assets/` directory if present. Clean up any Replit-specific devDependencies from package.json that aren't needed for local/Vercel/Netlify deployment.
- **Build test:** After any changes, run `npm run build` to verify no TypeScript or build errors.

---

## ASSET CHECKLIST (what Mazen still needs to provide)

- [ ] PDF: ECON 500 final exam (LaTeX, 17 pages)
- [ ] PDF: Al-Ard film review essay (8 pages)
- [ ] PDF: Microsoft Ireland tax memo (3 pages + works cited)
- [ ] PDF: DSCI 351 inventory system report (12 pages)
- [ ] PDF: Resume
- [ ] Notebook: Fama-French .ipynb file (or 4 key code cells as text)
- [ ] Screenshot: MENA Rising full-page capture at 1440px
- [ ] Screenshots: 5-7 slides from ECON 305 MENA deck
- [ ] URL: Valentine project live link
- [ ] URL: LinkedIn profile
- [ ] Email: Real contact email
- [ ] Optional: Al-Ard film still image (verify public domain / fair use)

---

## ATTRIBUTION RULES

- **RideOps:** Sole founder and developer — 100%. No caveats.
- **MENA Rising:** Sole developer and designer — 100%. No caveats.
- **Fama-French:** Individual — 100%.
- **ECON 500:** Individual — 100%.
- **Al-Ard:** Individual — 100%.
- **Microsoft Tax:** Individual — 100%.
- **DSCI 351:** Co-authored with Dev Kapashi. Mazen's contributions: architecture, database design, all NoSQL query work. ALWAYS label.
- **MENA Slides:** Co-authored with Dev Kapashi. Joint project. Screenshots only (no full deck link). ALWAYS label.
- **Valentine:** 100% personal project.

## VOICE & TONE

First-person, direct, no academic hedging. The portfolio sounds like Mazen talking, not a CV. Every page answers "why did you build this" before "what did you build." The valentine page is warmer and more personal than the rest — that tonal shift is intentional.

## DEPLOYMENT NOTES

The site is a client-side SPA. It can deploy to:
- **Vercel** (recommended): `npm run build` → deploy `dist/public/` with SPA fallback
- **Netlify:** Same build, add `_redirects` file with `/* /index.html 200`
- **GitHub Pages:** Needs a base path config in vite.config.ts

The Express server is only needed for local dev. In production, this is static files + client-side routing.
