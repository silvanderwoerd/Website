// The content layer (CLAUDE.md): pages never read content files themselves.
// Today it reads files in content/; later it can read the Elio database.

import "server-only";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { PageContent } from "@/originals/types";
import { getAllPaths as allPaths, getRedirects as redirects } from "./paths.mjs";

const contentDir = join(process.cwd(), "content");
const readJson = <T,>(file: string): T => JSON.parse(readFileSync(file, "utf8"));

export function getPageSlugs(): string[] {
  const dir = join(contentDir, "pages");
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)) : [];
}

export function getPage(slug: string): PageContent | null {
  const file = join(contentDir, "pages", `${slug}.json`);
  return existsSync(file) ? readJson<PageContent>(file) : null;
}

// Dev-only pages (content/dev/): the Inspector test page. Never built for the live site.
export function getDevPage(slug: string): PageContent | null {
  const file = join(contentDir, "dev", `${slug}.json`);
  return existsSync(file) ? readJson<PageContent>(file) : null;
}

export const getAllPaths = (): string[] => allPaths(process.cwd());
export const getRedirects = (): { from: string; to: string }[] => redirects(process.cwd());
