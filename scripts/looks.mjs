// npm run looks (CLAUDE.md rule 7, "Show, don't claim"):
// screenshots of the key pages at 390 / 820 / 1440, compared with the approved
// baseline (looks/baseline/). Any unapproved difference fails, and so does any
// element on a page that isn't part of a marked original.
//
//   npm run looks                 compare with the baseline (the pre-push hook)
//   npm run looks -- --live       also shoot the live site, side by side (phase 1)
//   npm run looks -- --accept     make this run the new baseline (Sil's or Jorik's call)
//   npm run looks -- --dev        also include the Inspector test page
//
// Results: looks/runs/<time>/report.html

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const root = process.cwd();
const args = process.argv.slice(2);
const LIVE = "https://www.studiobirthplace.com";
const WIDTHS = [390, 820, 1440];
const PAGES = [
  ["home", "/"],
  ["work", "/work"],
  ["project", "/work/team-forest"],
  ["news", "/news"],
  ["post", "/blog-posts/new-release---team-forest"],
  ["about", "/about"],
  ["contact", "/contact"],
  ...(args.includes("--dev") ? [["inspector-test", "/dev/inspector-test"]] : []),
].filter(([name]) => {
  // --pages=home,about : only these pages
  const only = args.find((a) => a.startsWith("--pages="))?.slice(8).split(",");
  return !only || only.includes(name);
});
const MAX_DIFF = 0.001; // share of pixels that may differ (anti-aliasing noise)

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const runDir = join(root, "looks/runs", stamp);
const baseDir = join(root, "looks/baseline");
mkdirSync(runDir, { recursive: true });

// A local server: the one already running, or our own dev server on 3100.
async function reachable(url) {
  try { return (await fetch(url, { redirect: "manual" })).status < 500; } catch { return false; }
}
let base = process.env.LOOKS_URL ?? "http://localhost:3000";
let server;
if (!(await reachable(base))) {
  base = "http://localhost:3100";
  server = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "dev", "-p", "3100"], { cwd: root, stdio: "ignore" });
  for (let i = 0; i < 90 && !(await reachable(base)); i++) await new Promise((r) => setTimeout(r, 1000));
}

// Scroll through so scroll-triggered reveals have run, then shoot the whole page.
async function shoot(page, url, file) {
  const res = await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch(() => null);
  if (!res || res.status() >= 400) return res?.status() ?? "error";
  // Video-heavy pages may never go fully quiet; wait a while, not forever.
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  // The film grain moves on a fixed layer that full-page shots stretch: stop it
  // on both sites so screenshots compare like with like.
  await page.addStyleTag({ content: "*::after { animation: none !important; }" }).catch(() => {});
  await page.screenshot({ path: file, fullPage: true });
  return 200;
}

// Elements inside <main> that aren't part of a marked original.
const unmarked = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((el) => !el.closest("[data-original]"))
      .slice(0, 10)
      .map((el) => `<${el.tagName.toLowerCase()} class="${el.getAttribute("class") ?? ""}">`),
  );

function compare(a, b, diffFile) {
  const A = PNG.sync.read(readFileSync(a));
  const B = PNG.sync.read(readFileSync(b));
  if (A.width !== B.width || A.height !== B.height) return { ratio: 1, note: `size ${A.width}×${A.height} vs ${B.width}×${B.height}` };
  const diff = new PNG({ width: A.width, height: A.height });
  const n = pixelmatch(A.data, B.data, diff.data, A.width, A.height, { threshold: 0.1 });
  if (n) writeFileSync(diffFile, PNG.sync.write(diff));
  return { ratio: n / (A.width * A.height) };
}

const browser = await chromium.launch();
const rows = [];
let failed = false;
try {
  for (const width of WIDTHS) {
    const local = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const live = args.includes("--live") ? await browser.newPage({ viewport: { width, height: 900 } }) : null;
    for (const [name, path] of PAGES) {
      const shot = `${name}@${width}`;
      const row = { shot, path };
      row.local = await shoot(local, base + path, join(runDir, `${shot}.png`));
      if (row.local === 200) {
        row.unmarked = await unmarked(local);
        if (row.unmarked.length) failed = true;
        const baseline = join(baseDir, `${shot}.png`);
        if (existsSync(baseline)) {
          row.diff = compare(join(runDir, `${shot}.png`), baseline, join(runDir, `${shot}.diff.png`));
          if (row.diff.ratio > MAX_DIFF) failed = true;
        }
      }
      if (live) row.live = await shoot(live, LIVE + path, join(runDir, `${shot}.live.png`));
      rows.push(row);
      console.log(`${shot.padEnd(22)} local ${row.local === 200 ? "ok" : `not built (${row.local})`}${row.diff ? `, ${(row.diff.ratio * 100).toFixed(3)}% differs from baseline${row.diff.note ? ` (${row.diff.note})` : ""}` : ""}${row.unmarked?.length ? `, ${row.unmarked.length}+ unmarked elements` : ""}${live ? `, live ${row.live === 200 ? "ok" : row.live}` : ""}`);
    }
    await local.close();
    await live?.close();
  }
} finally {
  await browser.close();
  server?.kill();
}

// Side-by-side report.
const img = (f) => (existsSync(join(runDir, f)) ? `<img src="${f}" loading="lazy">` : "<span>—</span>");
writeFileSync(
  join(runDir, "report.html"),
  `<!doctype html><meta charset="utf-8"><title>looks ${stamp}</title><style>body{font:14px system-ui;background:#111;color:#ddd;margin:16px}section{margin:0 0 32px}h2{font-size:15px}.row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;align-items:start}img{width:100%;border:1px solid #333}.bad{color:#ff7b7b}</style>
<h1>looks ${stamp}</h1><p>Columns: this build · live site · difference from baseline.</p>
${rows.map((r) => `<section><h2>${r.shot} <small>${r.path}</small> ${r.diff && r.diff.ratio > MAX_DIFF ? `<span class="bad">differs ${(r.diff.ratio * 100).toFixed(2)}%</span>` : ""} ${r.unmarked?.length ? `<span class="bad">unmarked: ${r.unmarked.join(" ").replace(/</g, "&lt;")}</span>` : ""}</h2><div class="row">${img(`${r.shot}.png`)}${img(`${r.shot}.live.png`)}${img(`${r.shot}.diff.png`)}</div></section>`).join("\n")}`,
);

if (args.includes("--accept")) {
  mkdirSync(baseDir, { recursive: true });
  for (const f of readdirSync(runDir).filter((f) => /@\d+\.png$/.test(f))) copyFileSync(join(runDir, f), join(baseDir, f));
  console.log(`looks: baseline updated from this run (${baseDir})`);
  process.exit(0);
}
console.log(`looks: report → ${join(runDir, "report.html")}`);
if (failed) {
  console.error("looks: differences from the approved baseline, or unmarked elements. See the report.");
  process.exit(1);
}
