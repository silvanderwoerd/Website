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

// A YouTube/Vimeo film inside a .fl-project-video wrapper, as the project pages store it.
function film(wrapper) {
  const url = wrapper.querySelector("iframe")?.getAttribute("src") ?? "";
  const yt = /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/.exec(url);
  const vimeo = /player\.vimeo\.com\/video\/(\d+)/.exec(url);
  return {
    provider: yt ? "youtube" : vimeo ? "vimeo" : "other",
    id: yt?.[1] ?? vimeo?.[1] ?? url,
    poster: wrapper.getAttribute("plyr-bg") ?? "",
    ratio: wrapper.getAttribute("plyr-aspect-ratio") ?? "16:9",
  };
}
// Adjacent bold parts ("**We** **Do**" written as two spans) as one.
const bold = (s) => s.replace(/\*\*\s*\*\*/g, " ").replace(/\*\*(\S[^*]*?)\s+\*\*/g, "**$1** ").trim();
// An arrow link; its blue word (.text-color-blue) is marked **…**.
const arrowLink = (a) => ({
  label: a.querySelector(".button-link-content-act > div").childNodes.map((n) => (n.nodeType === 3 ? n.text : /text-color-blue/.test(n.getAttribute("class") ?? "") ? `**${n.text.trim()}**` : n.text)).join("").replace(/\s+/g, " ").trim(),
  href: a.getAttribute("href"),
});
const cssBackground = (cls) => {
  const css = readFileSync(join(root, "reference/live-site/_css.tsv"), "utf8").split("\n").map((l) => l.split("\t"));
  const rule = css.find((r) => !r[0] && r[1] === cls && r[2] === "background-image");
  return /url\("?([^")]+)"?\)/.exec(rule?.[3] ?? "")?.[1] ?? "";
};
// Webflow rich text → Markdown, kept simple: headings, bold, paragraphs.
const markdown = (el) =>
  el.childNodes
    .filter((n) => n.nodeType === 1)
    .map((n) => {
      const t = n.text.replace(/\s+/g, " ").trim().replace(/‍/g, "");
      if (n.tagName === "H3") return `### **${t}**`;
      if (n.tagName === "H4") return `#### ${t}`;
      return t ? t : "‍";
    })
    .join("\n\n");

const pages = {
  about() {
    const doc = load("about.html");
    const hero = doc.querySelector(".about-hero");
    const believe = doc.querySelector(".fl-about-what-we-believe-split").parentNode;
    const services = doc.querySelector(".services-section");
    const awards = doc.querySelector(".fl-awards-section");
    const team = doc.querySelector(".fl-collections").parentNode;
    // The team as a collection (later from Elio): core team, then the wider collective.
    const groups = team.querySelectorAll(".fl-core-team-collection-wrapper");
    const members = groups.flatMap((g, i) =>
      g.querySelectorAll(".fl-core-team-member-wrapper").map((m) => ({
        name: text(m.querySelector(".fl-core-team-member-name")),
        role: text(m.querySelector(".fl-core-team-member-job-title")),
        photo: img(m.querySelector(".fl-core-team-picture")),
        group: i === 0 ? "core" : "collective",
      })),
    );
    writeFileSync(join(root, "content/collections/team.json"), JSON.stringify(members, null, 2) + "\n");
    const [coreLabel, collectiveLabel] = team.querySelectorAll(".services-eyebrow").map(text);
    return {
      slug: "about",
      ...meta(doc),
      family: "fluid",
      background: "plain",
      stripes: [
        {
          id: "hero",
          type: "hero",
          overrides: { variant: "about" },
          overrideReasons: { variant: "as on the live site (phase 1): About's mission hero" },
          content: { eyebrow: text(hero.querySelector(".about-hero-eyebrow")), title: inline(hero.querySelector("h1")), video: video(hero) },
        },
        {
          id: "mission",
          type: "about-statement",
          content: {
            eyebrow: text(believe.querySelector(".fl-eyebrow")),
            text: inline(believe.querySelector(".fl-about-what-we-believe-large-text-test")),
            body: text(believe.querySelector(".paragraph")),
            link: arrowLink(believe.querySelector(".fl-button-link-act")),
            film: film(believe.querySelector(".fl-project-video")),
          },
        },
        {
          id: "services",
          type: "services",
          content: {
            eyebrow: text(services.querySelector(".services-eyebrow")),
            heading: bold(inline(services.querySelector(".services-heading"))),
            tabs: services.querySelectorAll(".services-tab-link").map((a, i) => ({
              label: text(a),
              text: text(services.querySelectorAll(".w-tab-pane")[i]),
              background: cssBackground(`.services-background._${i + 1}`),
            })),
            link: arrowLink(services.querySelector(".fl-button-link-act")),
          },
        },
        {
          id: "awards",
          type: "awards",
          content: {
            background: img(awards.querySelector(".awards-section-bg")),
            eyebrow: text(awards.querySelector(".fl-awards-eyebrow")),
            heading: inline(awards.querySelector(".fl-awards-heading")),
            link: { label: text(awards.querySelector(".fl-button-link-act")), href: "#" },
            listTitle: text(awards.querySelector(".modal-container h2")),
            list: markdown(awards.querySelector(".modal-container .w-richtext")),
            text: text(awards.querySelector(".fl-services-paragraph")),
            logos: awards.querySelectorAll(".fl-awards-logo").map(img),
          },
        },
        {
          id: "team",
          type: "team",
          content: { heading: inline(team.querySelector(".fl-awards-heading")), coreLabel, collectiveLabel },
        },
        {
          id: "life",
          type: "life-with",
          content: {
            heading: inline(doc.querySelector(".fl-life-text h2")),
            photos: doc.querySelectorAll(".section-life-with-image").map(img),
          },
        },
        { ...closing(doc), pageTone: undefined },
      ],
    };
  },
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
