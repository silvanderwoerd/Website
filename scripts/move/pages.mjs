// Moves the remaining main pages from the saved live site into content/pages/:
// Work, About, Act, Contact and the two campaign pages. Words and media only;
// the look lives in the originals. Re-runnable; overwrites.
//   node scripts/move/pages.mjs            (all)
//   node scripts/move/pages.mjs work act   (some)

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import { bandsOf, stripesOf, stripeFor, detailsStripe, has, withSettings } from "./bands.mjs";

const root = process.cwd();
const td = new TurndownService({ headingStyle: "atx", emDelimiter: "*" });
// Keep Webflow's line breaks as <br>: two in a row make a blank line inside one paragraph.
td.addRule("br", { filter: "br", replacement: () => "<br>" });
const md = (el) => (el ? td.turndown(el.innerHTML).trim() : "");
const load = (file) => parse(readFileSync(join(root, "reference/live-site", file), "utf8"));
const write = (slug, data) => writeFileSync(join(root, "content/pages", `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
const text = (el) => el?.text.replace(/\s+/g, " ").trim() ?? "";
// Inline markup kept in content: **bold** and line breaks (\n). Nothing else.
// A break inside a bold run stays a break, with the bold on each side of it.
const boldRun = (n) =>
  n.childNodes
    .map((c) => (c.tagName === "BR" ? "\n" : c.text))
    .join("")
    .split("\n")
    .map((part) => (part.trim() ? `**${part.trim()}**` : ""))
    .join("\n");
const inline = (el) =>
  el.childNodes
    .map((n) => (n.nodeType === 3 ? n.text : n.tagName === "BR" ? "\n" : /^(STRONG|B)$/.test(n.tagName) || /font-weight-black|font-700/.test(n.getAttribute("class") ?? "") ? boldRun(n) : n.text))
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

// A campaign page's own bands; the rest go through the project bands.
function campaignBand(band, n) {
  const id = (type) => `${type}-${n}`;
  const button = (a) => (a ? { label: text(a.querySelector(".button-text")), href: a.getAttribute("href"), ...(a.getAttribute("target") === "_blank" ? { newTab: true } : {}) } : undefined);
  const fact = band.querySelector(".fl-earthdefender-fact, .fl-earthdefender-fact-small");
  if (fact) {
    const small = has(fact, "fl-earthdefender-fact-small");
    const eyebrow = band.querySelector(".fl-eyebrow-ed");
    const btn = button(band.querySelector("a.button-ed"));
    return withSettings(
      {
        id: id("fact"),
        type: "campaign-fact",
        content: {
          ...(eyebrow ? { eyebrow: text(eyebrow) } : {}),
          ...(band.querySelector(".fl-spacing-6em") ? { spaceAbove: true } : {}),
          text: inline(band.querySelector(".fl-about-what-we-believe-large-text-ed")),
          ...(btn ? { button: btn } : {}),
        },
      },
      { size: small ? "small" : undefined },
    );
  }
  if (has(band, "fl-section-act-statement")) {
    const image = band.querySelector(".fl-act-statement-bg");
    const btn = button(band.querySelector(".fl-section-act-lemukih a"));
    return {
      id: id("statement"),
      type: "act-statement",
      content: { ...(image ? { image: img(image) } : {}), text: text(band.querySelector(".fl-act-statement")), ...(btn ? { button: btn } : {}) },
    };
  }
  if (has(band, "fl-section-project-details")) return { ...detailsStripe(band), id: id("details") };
  // Earth Defender's partner logos (the project pages' empty section-4 bands hold nothing).
  if (has(band, "section-4") && band.querySelector("img")) {
    const logos = band.querySelectorAll(".container-11 img").map((i) => ({ ...img(i), ...(i.parentNode.tagName === "A" ? { href: i.parentNode.getAttribute("href") } : {}), first: /w-node/.test(i.getAttribute("id") ?? "") }));
    // The live grid pins one logo to the first cell: in content they go in the order they show.
    logos.sort((a, b) => b.first - a.first);
    return { id: id("logos"), type: "logo-row", content: { logos: logos.map(({ first, ...l }) => l) } };
  }
  // The COP29 band: a gallery nested in a gallery band, a quote inside its slider box.
  if (has(band, "fl-section-gallery") && band.querySelector(".fl-section-gallery")) {
    const inner = band.querySelector(".fl-section-gallery");
    const s = stripeFor(inner, n);
    const q = inner.querySelector(".fl-quote-section");
    s.content = { ...s.content, strayArrows: true, ...(q ? { quote: { quote: inline(q.querySelector(".fl-project-quote")), cite: inline(q.querySelector(".fl-quote-cite")), padTop: "4-5", padBottom: "4-5" } } : {}) };
    return s;
  }
  if (has(band, "fl-section-next-project")) return { id: "more-work", type: "more-work", content: { button: { label: text(band.querySelector(".button-text")), href: band.querySelector("a").getAttribute("href") } } };
  if (has(band, "section-3")) {
    const box = band.querySelector(".fl-cta-lemukih-content");
    return {
      id: id("intro"),
      type: "campaign-intro",
      content: {
        background: /url\("?([^")]+)"?\)/.exec(readFileSync(join(root, "reference/live-site/_css.tsv"), "utf8").split("\n").map((l) => l.split("\t")).find((r) => !r[0] && r[1] === ".section-3" && r[2] === "background-image")?.[3] ?? "")?.[1] ?? "",
        heading: inline(band.querySelector("h1")),
        boxHeading: text(box.querySelector("h2")),
        text: text(box.querySelector("p")),
        button: button(box.querySelector("a")),
      },
    };
  }
  return null;
}

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
  act() {
    const doc = load("act.html");
    const hero = doc.querySelector(".fl-act-hero-section");
    const campaigns = doc.querySelector(".fl-act-container-copy");
    const sustain = doc.querySelector(".fl-act-sustainability-container");
    const statement = doc.querySelector(".fl-section-act-statement");
    const values = doc.querySelector(".fl-act-questions-container");
    // The live counters count to these (the page's countUp script), not to the numbers in its HTML.
    const counts = [...readFileSync(join(root, "reference/live-site/act.html"), "utf8").matchAll(/new countUp\.CountUp\('countup-(\d)', ([\d.]+)(?:, \{ decimalPlaces: (\d))?/g)].map((m) => ({ value: Number(m[2]), decimals: Number(m[3] ?? 0) }));
    return {
      slug: "act",
      ...meta(doc),
      family: "fluid",
      background: "black",
      stripes: [
        {
          id: "hero",
          type: "act-hero",
          content: {
            eyebrow: text(hero.querySelector(".fl-project-eyebrow")),
            heading: inline(hero.querySelector("h1")),
            columns: hero.querySelectorAll(".fl-act-hero-bg-column").map((col) => col.querySelectorAll("img").map(img)),
          },
        },
        {
          id: "campaigns",
          type: "act-campaigns",
          content: {
            eyebrow: text(campaigns.querySelector(".fl-project-eyebrow")),
            heading: inline(campaigns.querySelector("h2")),
            cards: campaigns.querySelectorAll(".fl-active-project-link-wrapper").map((a) => ({
              href: a.getAttribute("href"),
              ...(a.getAttribute("target") ? { newTab: true } : {}),
              image: img(a.querySelector(".cover-image")),
              logo: img(a.querySelector(".fl-active-project-logo")),
              text: text(a.querySelector("p")),
              title: text(a.querySelector("h3")),
              label: text(a.querySelector(".button-link-content-act > div")),
            })),
          },
        },
        {
          id: "sustainability",
          type: "sustainability",
          pageTone: "gradient",
          content: {
            eyebrow: text(sustain.querySelector(".fl-project-eyebrow")),
            heading: inline(sustain.querySelector("h2")),
            text: text(sustain.querySelector(".fl-project-paragraph")),
            stats: sustain.querySelectorAll(".fl-sustainability-card").map((card, i) => ({
              ...counts[i],
              label: text(card.querySelector("p.fl-sustainability-card-text")),
              more: md(card.querySelector(".w-richtext")),
            })),
            readMore: text(sustain.querySelector(".fl-sustainability-card_read-more")),
            readLess: text(sustain.querySelector(".fl-sustainability-card_read-less")),
          },
        },
        {
          id: "statement",
          type: "act-statement",
          pageTone: "gradient",
          content: { image: img(statement.querySelector(".fl-act-statement-bg")), text: text(statement.querySelector(".fl-act-statement")) },
        },
        {
          id: "values",
          type: "values",
          pageTone: "gradient",
          content: {
            eyebrow: text(values.querySelector(".subtitle")),
            heading: text(values.querySelector("h2")),
            items: values.querySelectorAll(".faq-content-wrapper").map((w) => ({ title: text(w.querySelector("h3")), text: inline(w.querySelector("p")) })),
          },
        },
        closing(doc),
      ],
    };
  },
  contact() {
    const doc = load("contact.html");
    const hero = doc.querySelector(".contact-hero");
    const form = doc.querySelector(".fl-container-contact-form");
    const [details, block] = form.querySelectorAll(".fl-contact-form-layout > div");
    return {
      slug: "contact",
      ...meta(doc),
      family: "fluid",
      footerBand: "black",
      stripes: [
        {
          id: "contact",
          type: "contact-hero",
          content: {
            background: img(doc.querySelector(".contact-bg-image")),
            map: img(hero.querySelector(".contact-hero-bg")),
            // Each pin's place on the map is in the original's CSS, by its id.
            pins: hero.querySelectorAll(".map-pin-wrapper").map((w) => ({
              id: w.getAttribute("class").match(/cc-([\w-]+)/)[1],
              label: inline(w.querySelector(".map-pin-label")),
            })),
            eyebrow: text(hero.querySelector(".fl-awards-eyebrow")),
            heading: inline(hero.querySelector("h1")),
            formEyebrow: text(details.querySelector(".fl-project-eyebrow")),
            title: text(details.querySelector("h2")),
            text: inline(details.querySelector(".fl-cta-small-paragraph")),
            mailIcon: img(details.querySelector(".contact-details-icon-wrapper img")),
            contacts: details.querySelectorAll(".contact-detail-item").map((item) => ({
              email: text(item.querySelector(".fl-cta-small-paragraph-contact")),
              href: item.querySelector(".contact-details-content-wrapper a").getAttribute("href"),
              label: text(item.querySelector(".fl-contact-detail-small-text")),
            })),
            quickContact: text(block.querySelector(".fl-project-eyebrow")),
            fields: { name: block.querySelector("#Name-2").getAttribute("placeholder"), email: block.querySelector("#Email-2").getAttribute("placeholder"), message: block.querySelector("textarea").getAttribute("placeholder") },
            send: block.querySelector("input[type=submit]").getAttribute("value"),
            sending: block.querySelector("input[type=submit]").getAttribute("data-wait"),
            success: text(block.querySelector(".w-form-done")),
            failure: text(block.querySelector(".w-form-fail")),
          },
        },
        { ...closing(doc), pageTone: undefined },
      ],
    };
  },
  // The campaign pages are project bands (scripts/move/bands.mjs) plus their own.
  earthdefender() {
    const doc = load("earthdefender.html");
    const unknown = [];
    const stripes = stripesOf(bandsOf(doc), { extra: campaignBand, onUnknown: (u) => unknown.push(u) });
    if (unknown.length) console.log("earthdefender: bands not recognised:", unknown.join(", "));
    return { slug: "earthdefender", ...meta(doc), family: "fluid", background: "black", stripes };
  },
  empowerchildren() {
    const doc = load("empowerchildren.html");
    const unknown = [];
    // The bands inside .background-trigger turn the page gradient on.
    const bands = bandsOf(doc).flatMap((b) =>
      has(b, "background-trigger") ? b.childNodes.filter((x) => x.nodeType === 1 && x.tagName !== "FOOTER").map((x) => Object.assign(x, { tone: "gradient" })) : [b],
    );
    const stripes = stripesOf(bands, { extra: campaignBand, onUnknown: (u) => unknown.push(u) });
    if (unknown.length) console.log("empowerchildren: bands not recognised:", unknown.join(", "));
    return { slug: "empowerchildren", ...meta(doc), family: "fluid", background: "black", stripes };
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
