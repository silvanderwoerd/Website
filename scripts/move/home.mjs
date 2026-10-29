// Moves Home's content from the saved live page into content files:
//   content/pages/home.json, content/site.json (nav + footer),
//   content/collections/partners.json, content/collections/testimonials.json
// Words and media only; the look lives in the originals. Re-runnable; overwrites.
//   node scripts/move/home.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

const root = process.cwd();
const doc = parse(readFileSync(join(root, "reference/live-site/index.html"), "utf8"));
const write = (file, data) => {
  mkdirSync(join(root, file, ".."), { recursive: true });
  writeFileSync(join(root, file), JSON.stringify(data, null, 2) + "\n");
};
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

// Site-wide: nav and footer.
const nav = doc.querySelector(".navbar");
const footer = doc.querySelector("footer");
const socials = [...nav.querySelectorAll(".social-link")].map((a) => ({ href: a.getAttribute("href"), icon: a.querySelector("img").getAttribute("src"), label: /instagram/.test(a.getAttribute("href")) ? "Instagram" : /linkedin/.test(a.getAttribute("href")) ? "LinkedIn" : "YouTube" }));
const footerColumns = [...footer.querySelectorAll(".footer-component-grid > .inner-container")].slice(1, 3).map((col) => {
  const groups = [];
  for (const el of col.childNodes.filter((n) => n.nodeType === 1)) {
    if (el.classList.contains("footer-title")) groups.push({ title: text(el), links: [] });
    else for (const a of el.querySelectorAll("a.footer-nav-link")) groups.at(-1).links.push({ label: text(a), href: a.getAttribute("href") });
  }
  return groups;
});
write("content/site.json", {
  logo: { src: nav.querySelector(".logo").getAttribute("src"), alt: "Studio Birthplace" },
  email: "hello@studiobirthplace.com",
  socials,
  nav: [...nav.querySelectorAll(".nav-column-content .nav-link")].slice(1).map((a) => ({ label: text(a.querySelector(".nav-text")), href: a.getAttribute("href") })),
  footer: {
    columns: footerColumns,
    newsletter: { title: text(footer.querySelector(".inner-container:last-child .footer-title")), emailOctopusForm: "8b155d74-d7e3-11ee-b2cd-d9a144c02e37" },
    treeNation: { code: footer.querySelector("[data-tree-nation-code]").getAttribute("data-tree-nation-code") },
    commitments: img(footer.querySelector(".image-4")),
    copyright: text(footer.querySelector(".footer-bottom .text-size-small")),
  },
  pageBackground: {
    grain: "https://cdn.prod.website-files.com/6465c08bc2eb8d26649eade8/6580ce8d8c6a36fef35b35a4_WebsiteGrain.1.webp",
    preloaderMask: "https://cdn.prod.website-files.com/6465c08bc2eb8d26649eade8/67843fc39d5a3853e1a4e755_mask-logo.avif",
  },
  icons: {
    arrow: doc.querySelector(".arrow-button").getAttribute("src"),
    play: doc.querySelector(".hover-link-homepage img").getAttribute("src"),
    calendar: doc.querySelector(".calendar-icon").getAttribute("src"),
    mail: nav.querySelector(".mail-icon").getAttribute("src"),
    plus: doc.querySelector(".fl-testimonial_icon").getAttribute("src"),
    arrowLeft: doc.querySelector(".swiper-arrow-left img").getAttribute("src"),
    arrowRight: doc.querySelector(".swiper-arrow-right img").getAttribute("src"),
  },
});

// Collections (later from Elio).
write("content/collections/partners.json", [...doc.querySelectorAll(".grid-4 img")].map((i) => ({ name: i.getAttribute("src").split("_").pop().replace(/\.logo\.\w+$/, ""), logo: i.getAttribute("src") })));
write("content/collections/testimonials.json", [...doc.querySelectorAll(".testimonial-card")].map((c) => {
  const [name, role] = c.querySelectorAll(".testimonial-cite .fl-testimonial-small, .testimonial-cite .fl-testimonial-job-title-small");
  return { quote: inline(c.querySelector("blockquote")), name: text(name), role: inline(role), logo: c.querySelector(".testimonial-logo")?.getAttribute("src") ?? null };
}));

// Home.
const hero = doc.querySelector(".section-hero-home");
const who = doc.querySelector(".fl-who-we-are-section");
const partners = doc.querySelector(".fl-our-partners-section");
const testimonials = doc.querySelector(".fl-testimonials-section");
const contact = doc.querySelector(".fl-section-home-contact");
const showreel = JSON.parse(hero.querySelector("script.w-json")?.text || "null") ?? JSON.parse(doc.querySelector(".w-lightbox script")?.text ?? "{}");
const arrow = (a) => ({ label: text(a.querySelector(".button-link-content-act")), href: a.getAttribute("href") });

write("content/pages/home.json", {
  slug: "home",
  title: text(doc.querySelector("title")),
  description: doc.querySelector('meta[name="description"]').getAttribute("content"),
  family: "fluid",
  stripes: [
    {
      id: "hero",
      type: "hero",
      overrides: { variant: "home" },
      overrideReasons: { variant: "Home's hero: video, showreel button, socials (live site)" },
      content: {
        title: inline(hero.querySelector("h1")),
        video: video(hero),
        button: { label: text(hero.querySelector(".button-text")), href: showreel.items?.[0]?.url ?? "#", lightbox: true },
      },
    },
    {
      id: "who-we-are",
      type: "statement",
      content: {
        text: inline(who.querySelector(".fl-who-we-are-large-v3")),
        sub: inline(who.querySelector(".text-block-2")),
        links: who.querySelectorAll(".fl-button-link-act").map(arrow),
        stamp: img(who.querySelector(".clean-creatives-stamp")),
      },
    },
    {
      id: "featured-work",
      type: "featured-work",
      content: {
        projects: doc.querySelectorAll(".fl-featured-work-section .project-link").map((a) => ({
          href: a.getAttribute("href"),
          client: text(a.querySelector(".fl-project-partner")),
          title: text(a.querySelector(".fl-project-title")),
          poster: a.querySelector(".project-link-poster").getAttribute("src"),
          video: video(a.querySelector(".project-link-background-video")),
        })),
      },
    },
    {
      id: "partners",
      type: "partners",
      pageTone: "gradient",
      content: { heading: inline(partners.querySelector(".fl-partners-large")), link: arrow(partners.querySelector(".fl-button-link-act")), collection: "partners" },
    },
    {
      id: "testimonials",
      type: "testimonials",
      pageTone: "gradient",
      content: { eyebrow: text(testimonials.querySelector(".fl-eyebrow")), heading: text(testimonials.querySelector(".fl-who-we-are-large")), collection: "testimonials", readMore: "Read more", readLess: "Read Less" },
    },
    {
      id: "latest-news",
      type: "latest-news",
      pageTone: "gradient",
      content: { eyebrow: "Latest News", readNow: "Read now", count: 5 },
    },
    {
      id: "closing",
      type: "closing-cta",
      pageTone: "gradient",
      content: {
        heading: inline(contact.querySelector("h2")),
        button: { label: text(contact.querySelector(".button-text")), href: contact.querySelector("a").getAttribute("href") },
      },
    },
  ],
});
console.log("home: content/pages/home.json, content/site.json, content/collections/{partners,testimonials}.json");
