// Copies the 4 Lato 2 weights the live site uses (decisions #6) off Webflow's
// servers and converts them TTF → WOFF2 into public/fonts/. Run once:
//   node scripts/fonts.mjs
// The font URLs come from the saved live CSS, so nothing is guessed.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compress } from "wawoff2";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "reference/live-site/_assets");
const cssFile = readdirSync(assets).find((f) => f.endsWith(".css"));
const css = readFileSync(join(assets, cssFile), "utf8");

const wanted = new Set(["300", "400", "700", "900"]);
const faces = [...css.matchAll(/@font-face\s*\{[^}]*font-family:\s*"Lato 2";[^}]*?src:\s*url\("([^"]+)"[^}]*?font-weight:\s*(\d+)/g)]
  .map((m) => ({ url: m[1], weight: m[2] }))
  .filter((f) => wanted.has(f.weight));

if (faces.length !== wanted.size) throw new Error(`expected 4 Lato 2 faces, found ${faces.length}`);

mkdirSync(join(root, "public/fonts"), { recursive: true });
for (const { url, weight } of faces) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const ttf = new Uint8Array(await res.arrayBuffer());
  const woff2 = await compress(ttf);
  const out = join(root, `public/fonts/lato-${weight}.woff2`);
  writeFileSync(out, woff2);
  console.log(`lato ${weight}: ${(ttf.length / 1024).toFixed(0)} KB ttf → ${(woff2.length / 1024).toFixed(0)} KB woff2`);
}
