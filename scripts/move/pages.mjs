// Moves the remaining main pages from the saved live site into content/pages/:
// Work, About, Act, Contact and the two campaign pages. Words and media only;
// the look lives in the originals. Re-runnable; overwrites.
//   node scripts/move/pages.mjs            (all)
//   node scripts/move/pages.mjs work act   (some)

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const root = process.cwd();
const load = (file) => parse(readFileSync(join(root, "reference/live-site", file), "utf8"));
const write = (slug, data) => writeFileSync(join(root, "content/pages", `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
const text = (el) => el?.text.replace(/\s+/g, " ").trim() ?? "";
// Inline markup kept in content: **bold** and line breaks (\n). Nothing else.
const inline = (el) =>
  el.childNodes
    .map((n) => (n.nodeType === 3 ? n.text : n.tagName === "BR" ? "\n" : /^(STRONG|B)$/.test(n.tagName) || /font-weight-black|font-700/.test(n.getAttribute("class") ?? "") ? `**${n.text.trim()}**` : n.text))
    .join("")
    .replace(/‍/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
const video = (el) => {
  const [mp4, webm] = el.getAttribute("data-video-urls").split(",");
  return { poster: el.getAttribute("data-poster-url"), mp4, webm };
};
const img = (el) => ({ src: el.getAttribute("src"), alt: el.getAttribute("alt") ?? "" });
const meta = (doc) => ({
  title: text(doc.querySelector("title")),
  description: doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
});

// "We're here to tell stories that / change the world. You in?" (in the footer band).
const closing = (doc) => {
  const contact = doc.querySelector(".fl-section-home-contact");
  return {
    id: "closing",
    type: "closing-cta",
    pageTone: "gradient",
    content: {
      heading: inline(contact.querySelector("h2")),
      button: { label: text(contact.querySelector(".button-text")), href: contact.querySelector("a").getAttribute("href") },
    },
  };
};

const pages = {
  work() {
    const doc = load("work.html");
    return {
      slug: "work",
      ...meta(doc),
      family: "fluid",
      background: "black",
      stripes: [
        { id: "heading", type: "page-heading", content: { heading: text(doc.querySelector(".fl-work-hero-heading")) } },
        {
          id: "projects",
          type: "work-grid",
          content: {
            tiles: doc.querySelectorAll(".fl-work-wrapper").map((a) => ({
              href: a.getAttribute("href"),
              client: text(a.querySelector(".fl-font-size-1-5em")),
              title: text(a.querySelector("h2")),
              image: img(a.querySelector(".fl-work-image-cover img")),
              video: video(a.querySelector(".fl-work-background-video")),
            })),
          },
        },
        closing(doc),
      ],
    };
  },
};

const only = process.argv.slice(2);
for (const [slug, build] of Object.entries(pages)) {
  if (only.length && !only.includes(slug)) continue;
  write(slug, build());
  console.log(`pages: content/pages/${slug}.json`);
}
