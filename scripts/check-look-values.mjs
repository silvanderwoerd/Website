// Rule 2 (CLAUDE.md): no look values outside tokens and originals' token use.
// Refuses px / rem / em / vw sizes, hex / rgb / hsl colours, font names and
// breakpoints in content files, pages and stylesheets. A real exception is
// written `one-off: <reason>` on the same or previous line.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

const root = process.cwd();
const walk = (dir) =>
  !existsSync(dir) ? [] : readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const SIZE = /(?<![\w-])-?\d*\.?\d+(px|rem|em|vw|vh|svh|dvh)\b/;
const FONT = /font-family\s*:(?!\s*var\()|["'](Lato|Montserrat|Arial|Helvetica)/;
const isComment = (t) => t.startsWith("//") || t.startsWith("/*") || t.startsWith("*");
const MEDIA = /@media/;

const problems = [];
const report = (file, line, text, what) => problems.push(`${relative(root, file)}:${line}  ${what}: ${text.trim().slice(0, 100)}`);
const exempt = (lines, i) => /one-off:/.test(lines[i]) || (i > 0 && /one-off:/.test(lines[i - 1]));

// Content and pages: no look values at all, not even breakpoints.
const strict = [
  ...walk(join(root, "content")).filter((f) => [".json", ".md"].includes(extname(f))),
  ...walk(join(root, "src/app")).filter((f) => [".ts", ".tsx"].includes(extname(f))),
  ...walk(join(root, "src/stripes")).filter((f) => [".ts", ".tsx"].includes(extname(f))),
];
for (const file of strict) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((text, i) => {
    if (exempt(lines, i) || isComment(text.trim())) return;
    if (COLOUR.test(text)) report(file, i + 1, text, "colour");
    else if (SIZE.test(text)) report(file, i + 1, text, "size");
    else if (FONT.test(text)) report(file, i + 1, text, "font");
    else if (MEDIA.test(text)) report(file, i + 1, text, "breakpoint");
  });
}

// Stylesheets (originals, globals): originals carry the look, so their own
// sizes and breakpoints are allowed (CLAUDE.md rule 2: "outside originals and
// tokens"), but colours only as tokens and fonts only through text styles, so
// the palette and type can't drift.
const sheets = walk(join(root, "src")).filter((f) => f.endsWith(".css") && !f.endsWith(join("design", "tokens.css")));
// Component code: no colours or sizes in inline styles. The Inspector is a dev tool and has its own look.
const code = walk(join(root, "src/originals")).filter((f) => [".ts", ".tsx"].includes(extname(f)));
for (const file of [...sheets, ...code]) {
  const lines = readFileSync(file, "utf8").split("\n");
  let inComment = false;
  lines.forEach((text, i) => {
    const t = text.trim();
    if (t.startsWith("/*")) inComment = true;
    const skip = inComment || t.startsWith("//") || t.startsWith("*");
    if (t.includes("*/")) inComment = false;
    if (skip || exempt(lines, i) || MEDIA.test(text) || t.startsWith("@import")) return;
    if (COLOUR.test(text)) report(file, i + 1, text, "colour");
    else if (FONT.test(text)) report(file, i + 1, text, "font");
  });
}

if (problems.length) {
  console.error(`check-look-values: ${problems.length} look value(s) outside tokens (CLAUDE.md rule 2):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-look-values: ok (${strict.length + sheets.length + code.length} files)`);
