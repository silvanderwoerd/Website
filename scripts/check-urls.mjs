// URL parity (CLAUDE.md): every address of the live site
// (reference/live-site/_pages.txt) must exist or redirect.
// While the copy is being built, addresses not built yet are listed in
// scripts/url-parity-pending.txt. That list may only shrink: a missing address
// that isn't on it fails, and so does one on it that now exists (remove it with
// `node scripts/check-urls.mjs --update`).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getAllPaths, getRedirects } from "../src/content/paths.mjs";

const root = process.cwd();
const lines = (file) => (existsSync(file) ? readFileSync(file, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#")) : []);

const live = lines(join(root, "reference/live-site/_pages.txt"));
const pendingFile = join(root, "scripts/url-parity-pending.txt");
const pending = new Set(lines(pendingFile));
const served = new Set(getAllPaths(root));
const redirected = new Set(getRedirects(root).map((r) => r.from));

const missing = live.filter((a) => !served.has(a) && !redirected.has(a));
const unexpected = missing.filter((a) => !pending.has(a));
const nowPresent = [...pending].filter((a) => !missing.includes(a));
const extra = [...served].filter((a) => !live.includes(a));

if (process.argv.includes("--update")) {
  writeFileSync(pendingFile, `# Live addresses not built yet. Shrinks as templates land (step 5-7).\n${missing.join("\n")}\n`);
  console.log(`check-urls: pending list rewritten (${missing.length} addresses)`);
  process.exit(0);
}

let failed = false;
if (unexpected.length) {
  failed = true;
  console.error(`check-urls: ${unexpected.length} live address(es) no longer exist or redirect:\n  ${unexpected.join("\n  ")}`);
}
if (nowPresent.length) {
  failed = true;
  console.error(`check-urls: ${nowPresent.length} pending address(es) now exist. Run \`node scripts/check-urls.mjs --update\` to shrink the list:\n  ${nowPresent.slice(0, 20).join("\n  ")}`);
}
if (failed) process.exit(1);
console.log(`check-urls: ok. ${live.length - missing.length}/${live.length} live addresses built or redirected, ${missing.length} pending${extra.length ? `, ${extra.length} new: ${extra.join(", ")}` : ""}`);
