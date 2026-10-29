// Moves the 202 news posts from the saved live pages into content/posts/<slug>.md
// (decisions #8): front matter (title, date, category, image, summary) + the
// body converted from Webflow rich text to Markdown. Figures and embeds stay as
// HTML blocks so their layout classes survive. Re-runnable; overwrites.
//   node scripts/move/posts.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

const root = process.cwd();
const src = join(root, "reference/live-site/blog-posts");
const out = join(root, "content/posts");
mkdirSync(out, { recursive: true });

const CATEGORIES = [
  { slug: "new-releases", name: "New Releases" },
  { slug: "screenings", name: "Screenings" },
  { slug: "talks", name: "Talks" },
  { slug: "in-the-media", name: "In The Media" },
  { slug: "features", name: "Features" },
  { slug: "awards", name: "Awards" },
];
// Each category page's meta description, as Webflow serves it (today a date: a stale field, copied in phase 1).
for (const c of CATEGORIES) {
  const page = readFileSync(join(root, "reference/live-site/blog-categories", `${c.slug}.html`), "utf8");
  c.description = parse(page).querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
}
writeFileSync(join(root, "content/categories.json"), JSON.stringify(CATEGORIES, null, 2) + "\n");
const categorySlug = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.slug]));

const td = new TurndownService({ headingStyle: "atx", emDelimiter: "*", bulletListMarker: "-" });
td.keep(["figure", "iframe"]);
// Keep Webflow's line breaks as <br>: two in a row make a blank line inside one paragraph.
td.addRule("br", { filter: "br", replacement: () => "<br>" });

const decode = (s) => parse(`<p>${s}</p>`).text;

// Webflow's order for posts on the same date isn't alphabetical: keep each
// post's position in the live /news list (its first 100) as the tie-breaker,
// and for older posts their position in their category page (1000 + index).
const linksIn = (file) => [...readFileSync(join(root, "reference/live-site", file), "utf8").matchAll(/href="\/blog-posts\/([^"]+)"/g)].map((m) => m[1]);
const newsOrder = linksIn("news.html");
const categoryOrder = CATEGORIES.map((c) => linksIn(`blog-categories/${c.slug}.html`));
const rank = (slug) => {
  const i = newsOrder.indexOf(slug);
  if (i >= 0) return i;
  for (const list of categoryOrder) if (list.includes(slug)) return 1000 + list.indexOf(slug);
  return 9999;
};

// The live "More News" cards show a different, older date field than the post
// itself (a Webflow content glitch, copied in phase 1): keep it as cardDate.
const cardDates = new Map();
for (const file of readdirSync(src).filter((f) => f.endsWith(".html"))) {
  for (const card of parse(readFileSync(join(src, file), "utf8")).querySelectorAll(".blog-component-grid .link-content-blog")) {
    const text = card.querySelector(".text-size-small")?.text.trim();
    if (text) cardDates.set(card.getAttribute("href").split("/").pop(), new Date(`${text} 12:00 UTC`).toISOString().slice(0, 10));
  }
}
const yaml = (s) => JSON.stringify(s ?? ""); // a JSON string is valid YAML

let n = 0;
const missing = [];
for (const file of readdirSync(src).filter((f) => f.endsWith(".html"))) {
  const slug = file.slice(0, -5);
  const html = readFileSync(join(src, file), "utf8");
  const doc = parse(html);
  const header = doc.querySelector("header.section");
  const title = header?.querySelector("h1")?.text.trim();
  const dateText = header?.querySelector(".text-size-small")?.text.trim();
  const category = header?.querySelector(".category-tag")?.text.trim();
  const image = header?.querySelector(".cover-image")?.getAttribute("src") ?? doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
  const summary = decode(doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "");
  const body = doc.querySelector("article .fl-blog-rich-text");
  const date = dateText ? new Date(`${dateText} 12:00 UTC`).toISOString().slice(0, 10) : "";
  if (!title || !date) missing.push(slug);

  const front = [
    "---",
    `title: ${yaml(title)}`,
    `date: ${date}`,
    `category: ${category ? categorySlug[category] ?? yaml(category) : '""'}`,
    `image: ${yaml(image)}`,
    `summary: ${yaml(summary)}`,
    `order: ${rank(slug)}`,
    ...(cardDates.has(slug) && cardDates.get(slug) !== date ? [`cardDate: ${cardDates.get(slug)}`] : []),
    "---",
    "",
  ].join("\n");
  // Webflow writes style="max-width:2048pxpx" on figures: invalid CSS that browsers
  // ignore, so dropping it changes nothing on screen and keeps look values out of content.
  // A valid max-width is the image's own size: kept as data, the Post template
  // turns data-max-width back into that width (step 6).
  for (const el of body?.querySelectorAll("figure[style]") ?? []) {
    const m = /max-width:\s*(\d+)px(?!px)/.exec(el.getAttribute("style"));
    // Video figures get their height from padding-bottom (the film's ratio, in %).
    const ratio = /padding-bottom:\s*([\d.]+)%/.exec(el.getAttribute("style"));
    el.removeAttribute("style");
    if (m) el.setAttribute("data-max-width", m[1]);
    if (ratio) el.setAttribute("data-ratio", ratio[1]);
  }
  writeFileSync(join(out, `${slug}.md`), front + (body ? td.turndown(body.innerHTML) : "") + "\n");
  n++;
}
console.log(`posts: ${n} written to content/posts/${missing.length ? `; missing title/date: ${missing.join(", ")}` : ""}`);
