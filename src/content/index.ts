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

// Projects (content/projects/): a page whose first stripes are its hero and details.
export type Project = PageContent & { client: string; inGrid: boolean; hidden?: boolean };

export function getProjectSlugs({ includeHidden = false } = {}): string[] {
  const dir = join(contentDir, "projects");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .filter((slug) => includeHidden || !readJson<Project>(join(dir, `${slug}.json`)).hidden);
}

export function getProject(slug: string): Project | null {
  const file = join(contentDir, "projects", `${slug}.json`);
  if (!existsSync(file)) return null;
  const project = readJson<Project>(file);
  return project.hidden ? null : project;
}

// Dev-only pages (content/dev/): the Inspector test page. Never built for the live site.
export function getDevPage(slug: string): PageContent | null {
  const file = join(contentDir, "dev", `${slug}.json`);
  return existsSync(file) ? readJson<PageContent>(file) : null;
}

// Site-wide content: nav, footer, socials, icons.
export type Link = { label: string; href: string };
export type Site = {
  logo: { src: string; alt: string };
  email: string;
  socials: { href: string; icon: string; label: string }[];
  nav: Link[];
  footer: {
    columns: { title: string; links: Link[] }[][];
    newsletter: { title: string; emailOctopusForm: string };
    treeNation: { code: string };
    commitments: { src: string; alt: string };
    copyright: string;
  };
  pageBackground: { grain: string; preloaderMask: string };
  icons: Record<"arrow" | "play" | "calendar" | "mail" | "plus" | "arrowLeft" | "arrowRight", string>;
};
export const getSite = (): Site => readJson<Site>(join(contentDir, "site.json"));

// Collections (later from Elio).
export type Partner = { name: string; logo: string };
export type Testimonial = { quote: string; name: string; role: string; logo: string | null };
type Collections = { partners: Partner[]; testimonials: Testimonial[] };
export function getCollection<K extends keyof Collections>(name: K): Collections[K] {
  return readJson<Collections[K]>(join(contentDir, "collections", `${name}.json`));
}

// Posts: content/posts/<slug>.md, front matter (JSON-style values) + Markdown body.
export type PostSummary = { slug: string; title: string; date: string; category: string; image: string; summary: string; order: number };
export type Category = { slug: string; name: string };

function frontMatter(file: string) {
  const text = readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const data: Record<string, string> = {};
  for (const line of m?.[1].split("\n") ?? []) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const raw = line.slice(i + 1).trim();
    data[line.slice(0, i).trim()] = raw.startsWith('"') ? JSON.parse(raw) : raw;
  }
  return { data, body: m ? text.slice(m[0].length) : text };
}

let postCache: PostSummary[] | null = null;
export function getPosts({ category, limit }: { category?: string; limit?: number } = {}): PostSummary[] {
  if (!postCache || process.env.NODE_ENV === "development") {
    const dir = join(contentDir, "posts");
    postCache = (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : [])
      .map((f) => {
        const { data } = frontMatter(join(dir, f));
        return { slug: f.slice(0, -3), title: data.title, date: data.date, category: data.category, image: data.image, summary: data.summary, order: Number(data.order ?? 9999) };
      })
      // Newest first; same date in the live site's order.
      .sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);
  }
  const list = category ? postCache.filter((p) => p.category === category) : postCache;
  return limit ? list.slice(0, limit) : list;
}

export const getLatestPosts = (n: number) => getPosts({ limit: n });
export const getCategories = (): Category[] => readJson<Category[]>(join(contentDir, "categories.json"));
export const categoryName = (slug: string) => getCategories().find((c) => c.slug === slug)?.name ?? "";

export const getAllPaths = (): string[] => allPaths(process.cwd());
export const getRedirects = (): { from: string; to: string }[] => redirects(process.cwd());
