// Moves the project pages from the saved live site into content/projects/<slug>.json.
// Each Webflow band becomes a stripe with its words and media; the look stays in
// the originals. Webflow's spacer bands become the next stripe's spaceBefore.
// Rich text becomes Markdown. Re-runnable; overwrites. Prints any band it
// doesn't recognise, so nothing is dropped silently.
//   node scripts/move/projects.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";
import { bandsOf, stripesOf, detailsStripe, text, src_ } from "./bands.mjs";

const root = process.cwd();
const src = join(root, "reference/live-site/work");
const out = join(root, "content/projects");
mkdirSync(out, { recursive: true });

// Saved addresses that are redirects to another project page.
const REDIRECTS = new Set(["moneytrees", "change-drivers-season-2"]);
// Pages under /work that the Work grid doesn't show.
const NOT_IN_GRID = new Set(["jungleheroes-howdoesitwork"]);


const unknown = {};
let count = 0;
for (const file of readdirSync(src).filter((f) => f.endsWith(".html"))) {
  const slug = file.slice(0, -5);
  if (REDIRECTS.has(slug)) continue;
  const doc = parse(readFileSync(join(src, file), "utf8"));
  const bands = bandsOf(doc);

  const hero = doc.querySelector(".fl-project-hero");
  const details = doc.querySelector(".fl-section-project-details");

  const stripes = stripesOf(bands, { onUnknown: (u) => (unknown[u] = [...(unknown[u] ?? []), slug]) });

  // A project is a page whose first stripes are its hero and its details.
  const head = [
    {
      id: "hero",
      type: "hero",
      content: {
        eyebrow: text(hero?.querySelector(".fl-project-eyebrow")),
        client: text(hero?.querySelector(".fl-project-hero_client")),
        title: text(hero?.querySelector(".fl-project-page_title, h1")),
        image: { src: src_(hero?.querySelector(".cover-image")), alt: "" },
      },
    },
  ];
  if (details) head.push(detailsStripe(details));

  const project = {
    slug,
    title: text(doc.querySelector("title")).replace(/ \| Studio Birthplace$/, ""),
    description: doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    family: "fluid",
    // The live <body class="background-color-black">: a near-black page.
    ...(doc.querySelector("body.background-color-black") ? { background: "black" } : {}),
    client: text(hero?.querySelector(".fl-project-hero_client")),
    inGrid: !NOT_IN_GRID.has(slug),
    stripes: [...head, ...stripes, { id: "more-work", type: "more-work", content: { button: { label: "View More Work", href: "/work" } } }],
  };
  writeFileSync(join(out, `${slug}.json`), JSON.stringify(project, null, 2) + "\n");
  count++;
}
console.log(`projects: ${count} written to content/projects/`);
if (Object.keys(unknown).length) console.log("bands not recognised:\n" + Object.entries(unknown).map(([k, v]) => `  ${k}  (${v.length}: ${[...new Set(v)].slice(0, 4).join(", ")})`).join("\n"));
