// Prints the live CSS rules for the given classes, grouped by breakpoint, one
// rule per line (used and unused rules alike: the saved pages may not show
// every state, e.g. script-built markup).
//   node scripts/inventory/css-for.mjs .fl-phone .fl-section-keyvisuals

import { readFileSync } from "node:fs";
import { join } from "node:path";

const want = process.argv.slice(2);
const rows = readFileSync(join(process.cwd(), "reference/live-site/_css.tsv"), "utf8")
  .split("\n")
  .slice(1)
  .map((l) => l.split("\t"))
  .filter((r) => r[1]);

const matches = (part) => want.some((w) => part === w || part.startsWith(`${w} `) || part.startsWith(`${w}.`) || part.startsWith(`${w}:`) || part.startsWith(`${w}[`));
const groups = new Map();
for (const [media, selector, prop, value] of rows) {
  if (!selector.split(",").some((p) => matches(p.trim()))) continue;
  const key = `${(media || "base").replace("@media screen and ", "")}  ${selector}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(`${prop}: ${value}`);
}
for (const [key, decls] of groups) console.log(`${key.slice(0, 95).padEnd(64)} ${decls.join("; ").slice(0, 280)}`);
