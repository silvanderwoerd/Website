// Runs on `npm install` (package.json "prepare"): points git at the project's own
// hooks (.githooks: checks before every commit and push). Where there is no git
// repository, as on Vercel's build machines, there is nothing to do.
//   node scripts/install-hooks.mjs

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

if (existsSync(".git")) {
  try {
    execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "ignore" });
  } catch {
    // git itself missing: the hooks are a local guard, the install goes on without them.
  }
}
