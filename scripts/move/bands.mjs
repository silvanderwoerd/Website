// The band → stripe logic shared by the project pages (projects.mjs) and the
// campaign pages (pages.mjs): each Webflow band becomes a stripe with its words
// and media; spacer bands become the next stripe's spaceBefore.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import TurndownService from "turndown";

const root = process.cwd();

// The saved live CSS, for the few contents only it holds (background photos).
const cssRows = readFileSync(join(root, "reference/live-site/_css.tsv"), "utf8").split("\n").map((l) => l.split("\t"));
const cssRule = (selector, media, prop) => cssRows.find((r) => r[1] === selector && (r[0] ?? "") === media && r[2] === prop)?.[3];

const td = new TurndownService({ headingStyle: "atx", emDelimiter: "*", bulletListMarker: "-" });
td.keep(["iframe"]);
// Keep Webflow's line breaks as <br>: two in a row make a blank line inside one paragraph.
td.addRule("br", { filter: "br", replacement: () => "<br>" });
// Empty paragraphs holding a zero-width joiner are Webflow's spacers: they stay.
const md = (el) => (el ? td.turndown(el.innerHTML).trim() : "");
const text = (el) => el?.text.replace(/\s+/g, " ").trim() ?? "";
const cls = (el) => el?.getAttribute("class") ?? "";
const has = (el, c) => cls(el).split(/\s+/).includes(c);
const src_ = (img) => img?.getAttribute("src") ?? "";

// "Our Partners &<br><strong>X</strong>" → "Our Partners &\n**X**"
const inline = (el) =>
  el.childNodes
    .map((n) => (n.nodeType === 3 ? n.text : n.tagName === "BR" ? "\n" : /^(STRONG|B)$/.test(n.tagName) ? `**${n.text.trim()}**` : n.text))
    .join("")
    .replace(/‍/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();

function film(wrapper) {
  if (!wrapper) return null;
  const iframe = wrapper.querySelector("iframe");
  const url = iframe?.getAttribute("src") ?? "";
  const yt = /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/.exec(url);
  const vimeo = /player\.vimeo\.com\/video\/(\d+)/.exec(url);
  return {
    provider: yt ? "youtube" : vimeo ? "vimeo" : "other",
    id: yt?.[1] ?? vimeo?.[1] ?? url,
    poster: wrapper.getAttribute("plyr-bg") ?? "",
    ratio: wrapper.getAttribute("plyr-aspect-ratio") ?? "16:9",
  };
}

const bgVideo = (el) => {
  if (!el) return null;
  const [mp4, webm] = (el.getAttribute("data-video-urls") ?? "").split(",");
  return { poster: el.getAttribute("data-poster-url"), mp4, webm };
};

const GALLERY_IMAGES = {
  "fl-flags-stills": "stills",
  "fl-nagadbb-bts-image": "bts",
  "fl-woolmark-campaign-image": "campaign",
  "fl-birthplace-stills-gallery": "wide",
  "fl-woolmark-campaign-visuals-image": "visuals",
  "fl-drifters-campaign-image": "drifters",
  "fl-project-story-image": "story",
  "fl-woolmark-in-the-media-image": "media",
};

// Settings copied from the live page are deliberate instance choices, not drift.
const LIVE = "as on the live site (phase 1)";
const withSettings = (stripe, overrides) => {
  const set = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined));
  if (!Object.keys(set).length) return stripe;
  return { ...stripe, overrides: set, overrideReasons: Object.fromEntries(Object.keys(set).map((k) => [k, LIVE])) };
};

// Posters: the live site built each layout separately; they become one setting.
function postersLayout(band) {
  const q = (s) => !!band.querySelector(s);
  if (q(".fl-exhibition-layout-haze")) return "exhibition";
  if (q(".fl-split-moneytrees-container")) return q(".fl-posters-layout-ed") ? "films-tight" : "films";
  if (q(".fl-poster-image-rud")) return "rud-poster";
  if (q(".fl-poster-still-image-rud")) return "rud-stills";
  if (q(".fl-poster-imagehaze")) return q(".fl-posters-layout-double") ? "poster-still-double" : "poster-still";
  return "poster";
}

function gallery(el) {
  const imgs = el.querySelectorAll(".swiper-slide img");
  const first = cls(imgs[0]).split(/\s+/)[0];
  return { image: GALLERY_IMAGES[first] ?? first, images: imgs.map((i) => ({ src: src_(i), alt: i.getAttribute("alt") ?? "" })) };
}

// Heading + rich text pair used by text, text-on-image and campaign bands.
function textBlock(el) {
  const heading = el.querySelector(".fl-project_text-large, .fl-project-page_title, h2");
  const body = el.querySelector(".fl-split-small-rich-text, .fl-split-small-rich-text-dark-bg, .w-richtext");
  const link = el.querySelector(".fl-button-link-act");
  return {
    heading: heading ? inline(heading) : "",
    body: md(body),
    ...(link ? { link: { label: text(link.querySelector(".button-link-content-act")), href: link.getAttribute("href") } } : {}),
  };
}

function button(el) {
  const a = el.querySelector("a.button-2, a.button-2-cta, a.button-ed, a.button-2-lemukih");
  if (!a) return undefined;
  const variant = has(a, "button-ed") ? "earth-defender" : has(a, "button-2-lemukih") ? "empower-children" : has(a, "button-2-cta") ? "cta" : undefined;
  return { label: text(a.querySelector(".button-text")) || text(a), href: a.getAttribute("href"), ...(variant ? { overrides: { variant }, overrideReasons: { variant: LIVE } } : {}) };
}

function pressLinks(el) {
  return el?.querySelectorAll("a").map((a) => ({ label: text(a), href: a.getAttribute("href") })) ?? [];
}

// One Webflow band → one stripe (or null for spacers handled by the caller).
export function stripeFor(band, n) {
  const c = cls(band);
  const id = (type) => `${type}-${n}`;

  if (has(band, "fl-project-hero")) return null; // the head, read separately
  if (has(band, "fl-section-project-details")) return null;
  if (has(band, "fl-section-next-project")) return null; // the template adds it

  if (has(band, "fl-section-numbers")) {
    return {
      id: id("stats"), type: "stats",
      content: {
        title: text(band.querySelector(".fl-project-page_title")),
        items: band.querySelectorAll(".fl-numbers-number-wrapper").map((w) => ({ number: text(w.querySelector(".fl-numbers-number-big")), label: inline(w.querySelector(".fl-numbers-number-paragraph-description")) })),
      },
    };
  }
  if (has(band, "fl-split-small-section")) return { id: id("text"), type: "text", content: textBlock(band) };
  if (has(band, "fl-section-gallery")) {
    const { image, images } = gallery(band);
    const heading = band.querySelector("h2");
    const centred = !!band.querySelector(".swiper-wrapper.u--items-center");
    return withSettings(
      {
        id: id("gallery"),
        type: "gallery",
        content: {
          ...(heading ? { heading: inline(heading) } : {}),
          // Some heading boxes also have the 2.875em space above the heading.
          ...(heading && /fl-spacing/.test(cls(heading.parentNode.childNodes.find((x) => x.nodeType === 1))) ? { spaceAboveHeading: true } : {}),
          images,
        },
      },
      { image: image !== "campaign" ? image : undefined, align: centred ? "center" : undefined },
    );
  }
  if (has(band, "fl-quote-section")) {
    return { id: id("quote"), type: "quote", content: { quote: inline(band.querySelector(".fl-project-quote")), cite: inline(band.querySelector(".fl-quote-cite")) } };
  }
  if (has(band, "fl-campaign-section")) {
    const modal = band.querySelector(".modal-container .w-richtext");
    const images = band.querySelectorAll("img").filter((i) => !has(i, "arrow-button")).map((i) => ({ src: src_(i), alt: i.getAttribute("alt") ?? "" }));
    return {
      id: id("campaign"), type: "campaign",
      content: {
        heading: text(band.querySelector(".fl-project-page_title")),
        text: inline(band.querySelector(".fl-cta-small-paragraph") ?? band),
        ...(modal ? { press: pressLinks(modal), pressLabel: text(band.querySelector(".fl-button-link-act .button-link-content-act")) } : {}),
        // The client's landing page, under the media features link.
        ...(() => {
          const a = band.querySelectorAll("a.fl-button-link-act").find((x) => x.getAttribute("href") !== "#");
          return a ? { link: { label: text(a.querySelector(".button-link-content-act")), href: a.getAttribute("href") } } : {};
        })(),
        ...(images.length ? { images } : {}),
      },
    };
  }
  if (has(band, "fl-section-cta-big") || has(band, "fl-section-cta-small")) {
    return withSettings({
      id: id("cta"), type: "cta",
      content: {
        image: { src: src_(band.querySelector(".cover-image")), alt: "" },
        heading: inline(band.querySelector(".fl-project_text-large, h2")),
        text: inline(band.querySelector("[class*=fl-cta-small-paragraph]")),
        button: button(band),
      },
    }, { size: has(band, "fl-section-cta-big") ? "big" : undefined });
  }
  if (/fl-section-(keyvisuals|poster-haze2?|moneytrees-poster)/.test(c)) {
    const films = band.querySelectorAll("[plyr-wrapper]").map(film);
    return withSettings(
      {
        id: id("posters"), type: "posters",
        content: films.length
          ? { films }
          : { images: band.querySelectorAll("img").map((i) => ({ src: src_(i), alt: i.getAttribute("alt") ?? "" })) },
      },
      { layout: postersLayout(band), spacing: has(band, "fl-section-moneytrees-poster") ? "tight" : undefined },
    );
  }
  if (has(band, "fl-projects-phones-section")) {
    // A combo class (cc-*) sets a background photo in the live CSS only: read it from there.
    const combo = cls(band).split(/\s+/).find((x) => x.startsWith("cc-"));
    const bgUrl = (media) => (combo ? /url\("([^"]+)"\)/.exec(cssRule(`.fl-projects-phones-section.${combo}`, media, "background-image") ?? "")?.[1] : undefined);
    const background = bgUrl("") ? { src: bgUrl(""), srcXXL: bgUrl("@media screen and (min-width: 1920px)") } : undefined;
    return {
      id: id("phones"), type: "phones",
      content: {
        screens: band.querySelectorAll(".fl-phone-screenshot").map((i) => ({ src: src_(i), alt: "" })),
        frame: src_(band.querySelector(".fl-phone-frame")),
        ...(background ? { background } : {}),
      },
    };
  }
  if (has(band, "fl-section-project-instafilter")) {
    return { id: id("instafilter"), type: "instafilter", content: { video: bgVideo(band.querySelector("[data-video-urls]")) } };
  }
  if (has(band, "columns")) {
    return { id: id("episode"), type: "episode", content: { ...textBlock(band.querySelector(".column")), heading: text(band.querySelector(".heading-3")), film: film(band.querySelector("[plyr-wrapper]")) } };
  }
  if (band.querySelector("iframe#externalFrame, .responsive-iframe")) {
    return { id: id("embed"), type: "embed", content: { url: band.querySelector("iframe").getAttribute("src") } };
  }
  if (has(band, "fl-section-no-spacing") && band.querySelector(".fl-half-bg")) {
    const bg = band.querySelector(".fl-half-bg");
    const panel = has(bg, "noise-overlay") ? "noise" : band.querySelector(".fl-campaign-container") ? "campaign" : "plain";
    const parts = [];
    for (const child of band.childNodes.filter((x) => x.nodeType === 1 && !has(x, "fl-half-bg") && !/fl-spacing/.test(cls(x)))) {
      if (child.querySelector("[plyr-wrapper]") || has(child, "fl-project-video")) parts.push({ kind: "film", film: film(child.querySelector("[plyr-wrapper]") ?? child) });
      else if (child.querySelector(".swiper-slide")) parts.push({ kind: "gallery", ...gallery(child) });
      else parts.push({ kind: "text", ...textBlock(child), ...(child.querySelector(".fl-split-small-rich-text-dark-bg") ? { dark: true } : {}) });
    }
    return withSettings({ id: id("text-on-image"), type: "text-on-image", content: { image: { src: src_(bg.querySelector("img")), alt: "" }, parts } }, { panel: panel !== "plain" ? panel : undefined });
  }
  const wrapper = band.querySelector("[plyr-wrapper]");
  if (wrapper) {
    const size = band.querySelector(".fl-project-video-medium-container") ? "medium" : band.querySelector(".fl-split-medium-container") ? "split" : "large";
    // .section-8 (Change Drivers): display none except on phones, where it stands in
    // for the episode's own film column, which phones hide.
    const phoneOnly = has(band, "section-8");
    // .section-7 (Team Forest, Oilympics, Hutan) becomes an inline block on phones.
    const inline = has(band, "section-7");
    return withSettings(
      { id: id("film"), type: "film", content: { film: film(wrapper) } },
      { size: size !== "large" ? size : undefined, visibility: phoneOnly ? "phone" : undefined, phoneBox: inline ? "inline" : undefined },
    );
  }
  if (has(band, "section-4") && !text(band)) return { skip: "empty band" };
  return { unknown: `${band.tagName.toLowerCase()}.${c.replace(/\s+/g, ".")}` };
}

// The project-details band (about, credits, full credits and press pop-ups, logo).
export function detailsStripe(details) {
  const modals = details.querySelectorAll(".modal-container");
  const creditsModal = modals.find((m) => m.querySelector(".credits-rich-text"));
  const pressModal = modals.find((m) => !m.querySelector(".credits-rich-text"));
  const short = details.querySelectorAll(".fl-section-project-details_credits-title").map((t) => ({ role: text(t), name: text(t.nextElementSibling) }));
  const logo = details.querySelector("img.fl-project_waterbear-logo");
  return {
    id: "details",
    type: "project-details",
    content: {
      eyebrow: text(details.querySelector(".fl-project-eyebrow")),
      about: md(details.querySelector(".fl-project-details-rich-text")),
      credits: short,
      ...(creditsModal ? { fullCredits: md(creditsModal.querySelector(".credits-rich-text")), creditsNote: text(creditsModal.querySelector("p.text-align-center")) } : {}),
      ...(pressModal ? { press: pressLinks(pressModal.querySelector(".w-richtext")) } : {}),
      ...(logo ? { logo: { src: src_(logo), alt: "", href: logo.parentNode.getAttribute?.("href") ?? null } } : {}),
      creditsLabel: text(details.querySelectorAll(".fl-button-link-act")[0]?.querySelector(".button-link-content-act")),
      pressLabel: text(details.querySelectorAll(".fl-button-link-act")[1]?.querySelector(".button-link-content-act")),
    },
  };
}

// A page's bands: the children of Webflow's page wrappers, without the site-wide
// parts (preloader, nav, background, footer) and scripts.
export function bandsOf(doc) {
  let bands = doc.querySelector("body").childNodes.filter((n) => n.nodeType === 1);
  const wrapper = (n) => n.tagName === "MAIN" || /(^|\s)(fl-page-wrapper[\w-]*|page-wrapper|main-wrapper)(\s|$)/.test(cls(n));
  while (bands.some(wrapper)) bands = bands.flatMap((n) => (wrapper(n) ? n.childNodes.filter((x) => x.nodeType === 1) : [n]));
  return bands.filter((b) => !/^(SCRIPT|STYLE)$/.test(b.tagName) && !/(preloader|navbar|page-background|custom-code|w-embed)/.test(cls(b)) && b.tagName !== "FOOTER");
}

// Bands → stripes. `extra(band, n)` may claim a band first (a page's own bands);
// unrecognised bands go to `onUnknown`.
export function stripesOf(bands, { extra, onUnknown } = {}) {
  const stripes = [];
  let pendingSpace;
  bands.forEach((band, n) => {
    const spacer = /fl-spacing-(4-5|4-375)em/.exec(cls(band));
    if (spacer) return void (pendingSpace = spacer[1]);
    const s = extra?.(band, n) ?? stripeFor(band, n);
    if (!s || s.skip) return;
    if (s.unknown) return void onUnknown?.(s.unknown);
    // Spacers at a band's own top and bottom edge vary per band on the live site.
    const kids = band.childNodes.filter((x) => x.nodeType === 1);
    const edge = (el) => /fl-spacing-(4-5|4-375)em/.exec(cls(el))?.[1];
    if (edge(kids[0])) s.padTop = edge(kids[0]);
    if (kids.length > 1 && edge(kids.at(-1))) s.padBottom = edge(kids.at(-1));
    if (pendingSpace) s.spaceBefore = pendingSpace;
    pendingSpace = undefined;
    // Bands inside Webflow's .background-trigger (set by the caller) turn the page gradient on.
    if (band.tone) s.pageTone = band.tone;
    stripes.push(s);
  });
  return stripes;
}

export { cls, has, text, md, inline, film, src_, pressLinks, button, textBlock, withSettings, LIVE };
