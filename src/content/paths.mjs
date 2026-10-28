// Which web addresses the content files produce. Shared by the content layer
// (static generation) and scripts/check-urls.mjs, so both always agree.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const list = (dir, ext) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)) : []);
const readJson = (file, fallback) => (existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback);

/** Page slug → address: "home" is "/", everything else "/<slug>". */
export const pageAddress = (slug) => (slug === "home" ? "/" : `/${slug}`);

/** @returns {string[]} every address the site serves, redirects excluded */
export function getAllPaths(root = process.cwd()) {
  const content = join(root, "content");
  return [
    ...list(join(content, "pages"), ".json").map(pageAddress),
    ...list(join(content, "projects"), ".json")
      .filter((slug) => !readJson(join(content, "projects", `${slug}.json`), {}).hidden)
      .map((slug) => `/work/${slug}`),
    ...list(join(content, "posts"), ".md").map((slug) => `/blog-posts/${slug}`),
    ...readJson(join(content, "categories.json"), []).map((c) => `/blog-categories/${c.slug}`),
  ];
}

/** @returns {{from: string, to: string}[]} */
export function getRedirects(root = process.cwd()) {
  return readJson(join(root, "content", "redirects.json"), []);
}
