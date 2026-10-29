// Step 7: every Webflow media address the site uses, with where it's used.
//   node scripts/media/collect.mjs  → prints JSON { url: [places] }

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const RE = /https:\/\/cdn\.prod\.website-files\.com\/[^\s"'<>]+/g;

// A URL inside Markdown can swallow the link's closing bracket: keep brackets balanced.
const clean = (u) => {
  let s = u.replace(/[.,;]+$/, "");
  while (s.endsWith(")") && (s.match(/\(/g) ?? []).length < (s.match(/\)/g) ?? []).length) s = s.slice(0, -1);
  return s;
};

const found = new Map();
const add = (u, where) => {
  const url = clean(u);
  if (!found.has(url)) found.set(url, new Set());
  found.get(url).add(where);
};

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

for (const file of [...walk(join(root, "content")), ...walk(join(root, "src")), ...walk(join(root, "design"))]) {
  if (!/\.(json|md|tsx?|css)$/.test(file)) continue;
  const where = relative(root, file).split(sep).join("/");
  for (const m of readFileSync(file, "utf8").matchAll(RE)) add(m[0], where);
}

process.stdout.write(JSON.stringify(Object.fromEntries([...found].map(([u, w]) => [u, [...w]])), null, 1));
