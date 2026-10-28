// Step 5+: for one saved live page, writes each band's markup and exactly the
// live CSS rules that apply to it, so an original can be copied faithfully.
//   node scripts/inventory/band.mjs /            → reference/live-site/_bands/home/
//   node scripts/inventory/band.mjs /work/hutan  → reference/live-site/_bands/work_hutan/
// Each band: <n>-<class>.html (scripts removed) and <n>-<class>.css (used rules
// whose selectors mention one of its classes, grouped by media query).

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const root = process.cwd();
const site = join(root, "reference/live-site");
const address = process.argv[2] ?? "/";
const slug = address === "/" ? "home" : address.replace(/^\//, "").replace(/\//g, "_");
const file = join(site, address === "/" ? "index.html" : `${address.replace(/^\//, "")}.html`);
const out = join(site, "_bands", slug);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const doc = parse(readFileSync(file, "utf8"), { comment: false, blockTextElements: { script: false, style: true, noscript: false } });
let bands = doc.querySelector("body").childNodes.filter((n) => n.nodeType === 1);
// Open Webflow's page wrappers in place, as scripts/inventory/sections.ps1 does.
const wrapper = (n) => n.tagName === "MAIN" || /(^|\s)(fl-page-wrapper[\w-]*|page-wrapper|main-wrapper)(\s|$)/.test(n.getAttribute("class") ?? "");
while (bands.some(wrapper)) bands = bands.flatMap((n) => (wrapper(n) ? n.childNodes.filter((c) => c.nodeType === 1) : [n]));

// Used CSS rules: media \t selector \t property \t value \t used
const rules = readFileSync(join(site, "_css.tsv"), "utf8").split("\n").slice(1).filter(Boolean).map((l) => l.split("\t")).filter((r) => r[4]?.trim() === "True");

bands.forEach((band, i) => {
  const classes = new Set([band, ...band.querySelectorAll("*")].flatMap((n) => (n.getAttribute?.("class") ?? "").split(/\s+/)).filter(Boolean));
  const ids = new Set([band, ...band.querySelectorAll("*")].map((n) => n.getAttribute?.("id")).filter(Boolean));
  const name = `${String(i).padStart(2, "0")}-${(band.getAttribute("class") ?? band.tagName.toLowerCase()).split(/\s+/)[0]}`;
  writeFileSync(join(out, `${name}.html`), band.toString().replace(/></g, ">\n<"));
  const byMedia = new Map();
  for (const [media, selector, prop, value] of rules) {
    const sel = selector.split(",").filter((part) => {
      const id = /#([\w-]+)/.exec(part)?.[1];
      if (id) return ids.has(id); // Webflow grid placement (#w-node-…)
      const cls = [...part.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]);
      return cls.length && cls.every((c) => classes.has(c)) && cls.some((c) => !c.startsWith("w-"));
    });
    if (!sel.length) continue;
    const key = media || "(base)";
    if (!byMedia.has(key)) byMedia.set(key, new Map());
    const m = byMedia.get(key);
    const s = sel.join(", ").trim();
    if (!m.has(s)) m.set(s, []);
    m.get(s).push(`  ${prop}: ${value};`);
  }
  const css = [...byMedia].map(([media, m]) => `/* ${media} */\n` + [...m].map(([s, d]) => `${s} {\n${d.join("\n")}\n}`).join("\n")).join("\n\n");
  writeFileSync(join(out, `${name}.css`), css + "\n");
  console.log(`${name}: ${classes.size} classes, ${css.split("\n").length} css lines, ${band.toString().length} chars`);
});
