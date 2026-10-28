// Marks guard (CLAUDE.md): every original's component puts data-original /
// data-instance on its root (via marks()), every original is described in
// docs/components.md, and text fields a schema declares are marked with field().
// `npm run looks` also finds unmarked elements on the rendered pages.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dir = join(root, "src/originals");
const docs = existsSync(join(root, "docs/components.md")) ? readFileSync(join(root, "docs/components.md"), "utf8") : "";
const errors = [];

for (const name of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const folder = join(dir, name);
  const components = readdirSync(folder).filter((f) => f.endsWith(".tsx"));
  if (!components.length) errors.push(`${name}: no component`);
  const code = components.map((f) => readFileSync(join(folder, f), "utf8")).join("\n");
  if (!/\bmarks\(\s*"/.test(code)) errors.push(`${name}: its component never calls marks("${name}", …) on its root`);
  if (!code.includes(`marks("${name}"`)) errors.push(`${name}: marks() doesn't name "${name}"`);
  const { schema } = await import(pathToFileURL(join(folder, "schema.ts")).href);
  // field("x") on plain elements, or field="x" on AnimatedText (which marks it).
  for (const f of schema.fields ?? []) if (!code.includes(`field("${f}")`) && !code.includes(`field="${f}"`)) errors.push(`${name}: text field "${f}" isn't marked with field("${f}")`);
  if (!docs.includes(`\`${name}\``)) errors.push(`${name}: not described in docs/components.md`);
}

if (errors.length) {
  console.error(`check-marks: ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("check-marks: ok");
