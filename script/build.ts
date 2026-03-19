import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

// ---- Per-route OG meta tags ----
// Each route gets its own index.html with unique title, description, and image.
// Vercel serves these via { "handle": "filesystem" } before the SPA catch-all.

const BASE_URL = "https://mazenabouelela.com";

interface RouteMeta {
  title: string;
  description: string;
  image?: string; // defaults to /og-image.png
}

const routeMeta: Record<string, RouteMeta> = {
  "ride-ops": {
    title: "RideOps — Campus Transportation Ops Platform",
    description:
      "A white-labeled, multi-tenant SaaS platform for university accessibility transportation. Live in production with 4 campuses demo-ready.",
    image: "/images/og/ride-ops.png",
  },
  "mena-rising": {
    title: "MENA Rising — Weekly Economic Intelligence",
    description:
      "An AI-powered emerging-markets intelligence app tracking MENA economic signals weekly. Built with an Ottoman design system and a fully automated data pipeline.",
    image: "/images/og/mena-rising.png",
  },
  "fama-french": {
    title: "Fama-French Factor Analysis",
    description:
      "Three-factor model implementation end-to-end: data ingestion, factor construction, OLS regression, and interpretation. ECON 577, USC.",
    image: "/images/og/fama-french.png",
  },
  "causal-forest": {
    title: "Causal Forest — Financial Aid & Retention",
    description:
      "Heterogeneous treatment effects on 1,000 universities using causal ML on College Scorecard data. ECON 460, USC.",
    image: "/images/og/causal-forest.png",
  },
  "pca-voting": {
    title: "Classification & PCA",
    description:
      "Spam logistic regression with ROC/AUC, plus PCA on congressional voting records. ECON 460, USC.",
    image: "/images/og/pca-voting.png",
  },
  "al-ard": {
    title: "Al-Ard — Film Review",
    description:
      "Close reading of Chahine's 1969 Egyptian film. MDES 401, USC.",
    image: "/images/og/al-ard.png",
  },
  "microsoft-tax": {
    title: "Microsoft Ireland Tax Memo",
    description:
      "$858M in Microsoft tax savings — calculated from real S&P Capital IQ data. WRIT 340, USC.",
    image: "/images/og/microsoft-tax.png",
  },
  "dsci-351": {
    title: "Dual-Database Inventory System",
    description:
      "Redis + MongoDB dual-database architecture with aggregate pipelines, CRUD operations, and Tkinter GUI. DSCI 351, USC.",
    image: "/images/og/dsci-351.png",
  },
  "mena-slides": {
    title: "Growth Challenges in MENA",
    description:
      "Structural growth barriers across the MENA region. ECON 305, USC.",
    image: "/images/og/mena-slides.png",
  },
  "connect-4": {
    title: "Connect 4 — Playable C++ Port",
    description:
      "Terminal-based Connect 4 ported to the browser. Play against an AI with delta-vector win detection and a three-priority rule system. CSCI 103, USC.",
    image: "/images/og/connect-4.png",
  },
  blackjack: {
    title: "Blackjack (Twenty-One) — Playable C++ Port",
    description:
      "Full Blackjack game with Fisher-Yates shuffle, soft/hard Ace logic, and dealer AI. Ported from a CSCI 103 C++ assignment at USC.",
    image: "/images/og/blackjack.png",
  },
};

async function generateRouteHtml(distPublic: string) {
  const indexHtml = await readFile(
    path.join(distPublic, "index.html"),
    "utf-8",
  );
  const defaultImage = `${BASE_URL}/og-image.png`;

  let count = 0;
  for (const [route, meta] of Object.entries(routeMeta)) {
    const fullTitle = `${meta.title} — Mazen Abouelela`;
    const ogImage = meta.image
      ? `${BASE_URL}${meta.image}`
      : defaultImage;
    const ogUrl = `${BASE_URL}/${route}`;

    let html = indexHtml;
    // Replace OG tags
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${fullTitle}" />`,
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${meta.description}" />`,
    );
    html = html.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${ogUrl}" />`,
    );
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${ogImage}" />`,
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${fullTitle}" />`,
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${meta.description}" />`,
    );
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${ogImage}" />`,
    );

    const routeDir = path.join(distPublic, route);
    await mkdir(routeDir, { recursive: true });
    await writeFile(path.join(routeDir, "index.html"), html);
    count++;
  }
  console.log(`generated OG meta for ${count} routes`);
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("generating per-route OG tags...");
  await generateRouteHtml(path.resolve("dist/public"));

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
