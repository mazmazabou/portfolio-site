/**
 * Generates per-route OG screenshots using Playwright.
 *
 * Spins up a local static server from dist/public/, navigates to each route
 * at 1200×630 (standard OG image size), waits for content to render,
 * and screenshots the page. Output goes to client/public/images/og/.
 */

import { chromium } from "playwright";
import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST = path.resolve(__dirname, "../dist/public");
const OUT = path.resolve(__dirname, "../client/public/images/og");
const PORT = 4729;
const WIDTH = 1200;
const HEIGHT = 630;

// Each route and what to screenshot
interface RouteConfig {
  route: string;
  /** CSS selector for the element to focus on, or null for full viewport */
  selector: string | null;
  /** Extra wait time in ms for animations to settle */
  waitMs?: number;
}

const routes: RouteConfig[] = [
  { route: "/", selector: null },
  { route: "/ride-ops", selector: null },
  { route: "/mena-rising", selector: null },
  { route: "/fama-french", selector: null },
  { route: "/causal-forest", selector: null },
  { route: "/pca-voting", selector: null },
  { route: "/al-ard", selector: null },
  { route: "/microsoft-tax", selector: null },
  { route: "/dsci-351", selector: null },
  { route: "/mena-slides", selector: null },
  { route: "/connect-4", selector: null, waitMs: 500 },
  { route: "/blackjack", selector: null, waitMs: 500 },
];

function slugFromRoute(route: string): string {
  if (route === "/") return "home";
  return route.replace(/^\//, "");
}

// Simple static file server
function startServer(): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url || "/", `http://localhost:${PORT}`);
      let filePath = path.join(DIST, url.pathname);

      try {
        const s = await stat(filePath);
        if (s.isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
      } catch {
        // SPA fallback
        filePath = path.join(DIST, "index.html");
      }

      try {
        const data = await readFile(filePath);
        const ext = path.extname(filePath).slice(1);
        const mime =
          {
            html: "text/html",
            js: "application/javascript",
            css: "text/css",
            png: "image/png",
            jpg: "image/jpeg",
            svg: "image/svg+xml",
            json: "application/json",
            woff2: "font/woff2",
            woff: "font/woff",
            ttf: "font/ttf",
            ico: "image/x-icon",
            pdf: "application/pdf",
          }[ext] || "application/octet-stream";

        res.writeHead(200, { "Content-Type": mime });
        res.end(data);
      } catch {
        // Final fallback to root index.html for SPA routes
        try {
          const data = await readFile(path.join(DIST, "index.html"));
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end("Not found");
        }
      }
    });

    server.listen(PORT, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

async function main() {
  console.log("starting local server...");
  const server = await startServer();
  console.log(`serving dist/public on http://127.0.0.1:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2, // retina for crisp OG images
  });

  let count = 0;
  for (const { route, selector, waitMs } of routes) {
    const slug = slugFromRoute(route);
    const page = await context.newPage();

    try {
      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: "networkidle",
        timeout: 15000,
      });

      // Wait for React hydration + any animations
      await page.waitForTimeout(waitMs ?? 300);

      const outPath = path.join(OUT, `${slug}.png`);

      if (selector) {
        const el = await page.$(selector);
        if (el) {
          await el.screenshot({ path: outPath });
        } else {
          console.warn(`  selector "${selector}" not found on ${route}, using full page`);
          await page.screenshot({ path: outPath });
        }
      } else {
        await page.screenshot({ path: outPath });
      }

      console.log(`  ${slug}.png`);
      count++;
    } catch (err) {
      console.error(`  FAILED ${route}: ${err}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`\ndone — ${count} screenshots saved to client/public/images/og/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
