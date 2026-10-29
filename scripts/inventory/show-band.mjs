// Prints one extracted band compactly (after band.mjs): markup with srcsets,
// long Webflow transforms and repeated slides/items collapsed, then its CSS
// one rule per line, Webflow's own w-* rules left out.
//   node scripts/inventory/show-band.mjs work_team-forest 09 [html|css] [maxChars]

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const [slug, prefix, part = "both", max = "6000"] = process.argv.slice(2);
const dir = join(process.cwd(), "reference/live-site/_bands", slug);
const base = readdirSync(dir).find((f) => f.startsWith(`${prefix}-`) && f.endsWith(".html")).slice(0, -5);

if (part !== "css") {
  let h = readFileSync(join(dir, `${base}.html`), "utf8")
    .replace(/\s(srcset|sizes)="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*transform[^"]*"/g, ' style="(ix)"')
    .replace(/https:\/\/cdn\.prod\.website-files\.com\/[0-9a-f]+\//g, "CDN/")
    .replace(/\sloading="lazy"|\salt=""/g, "")
    .replace(/\sid="w-node-[^"]*"/g, "")
    .replace(/\n/g, "");
  // Collapse runs of identical-looking slides / list items to the first one.
  h = h.replace(/(<div class="(swiper-slide[^"]*|w-dyn-item)"[^>]*>(?:(?!<div class="\2).)*?)((?:<div class="\2"[^>]*>(?:(?!<div class="\2).)*?)+)(?=<\/div><\/div>|$)/g, (all, first) => `${first}<!-- …more… -->`);
  console.log(`== ${base}.html (${h.length} chars)\n${h.replace(/></g, ">\n<").slice(0, Number(max))}`);
}
if (part !== "html") {
  const css = readFileSync(join(dir, `${base}.css`), "utf8")
    .replace(/\{\s*\n\s*/g, "{ ")
    .replace(/;\s*\n\s*(?!\})/g, "; ")
    .replace(/;\s*\n\}/g, " }")
    .split("\n")
    .filter((l) => l.trim() && !/^\.w-/.test(l))
    .map((l) => (l.length > 260 ? l.slice(0, 260) + "…" : l))
    .join("\n");
  console.log(`== ${base}.css\n${css}`);
}
