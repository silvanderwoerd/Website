# studiobirthplace.com — how this site is built

Read this before every change. It carries what we learned building the Elio app
(the studio's platform): a modular system where one change reaches every page.

## What this is

- Studio Birthplace's public website, moving off Webflow (see MIGRATION-NOTES.md).
- **The site is a framework, not 253 pages.** The 253 addresses come from about
  11 distinct layouts (Home, Work, Project, News, Post, Category, About, Act,
  Contact, the campaign pages …; see `docs/inventory.md`). The rest is content:
  202 posts, 34 projects.
  Build the layouts and their stripes once, then pour the content in. Never
  rebuild a page by hand.
- **Phase 1: an exact copy.** Same look, same web addresses, same behaviour on
  phone, tablet and desktop. The live site and `reference/live-site/` (a saved copy
  of all 253 pages, 3 Oct 2026) are the truth. No improvements in phase 1.
- **Phase 2: improve.** Each improvement is named, shown on a preview link and
  approved by Sil or Jorik before it goes live.
- No logins, no database. Later, projects, press, awards and team may come from
  the Elio app. So content is always read through one content layer (below), never
  imported straight into a page.

## Stack (chosen once; don't mix in alternatives)

- Next.js (App Router, TypeScript), every page generated ahead of time, hosted on
  Vercel. It's React, like Elio, so parts can be shared later.
- Styling: design tokens as CSS variables in `src/design/tokens.css`. Tailwind's
  theme points at those variables and nothing else.
- Motion: one library, `motion` (Framer Motion), used only inside the motion
  originals.
- Phase-1 exceptions (decisions #9): Swiper only inside `gallery` and the
  carousels/marquee, and Plyr only inside `FilmPlayer`.
- npm only; commit `package-lock.json`.

## The model: page → stripes → blocks

- A **page is data**: an ordered list of stripes in a content file, e.g.
  `content/pages/home.json` →
  `{ "stripes": [{ "id": "hero", "type": "hero", … }, { "id": "stats", "type": "stats", … }] }`.
  JSON, so the Inspector can write it back safely (decisions #10).
- A **stripe** is a full-width band. It owns its background (colour, image or
  video), its width (full or contained), its spacing (from the scale) and how it
  stacks on smaller screens. `src/stripes/registry.ts` maps each `type` to its
  component.
- A **block** sits inside a stripe: heading, text, button, stat, image, video,
  quote, logo row, project tile, news card, form.
- **Originals carry the look; instances only carry content and settings.** A stripe
  or block is built once. Pages pass text, media and options, never colours, sizes
  or fonts. Change the original and every page follows.
- **Templates:** one Project layout feeds all 34 project pages; one News layout
  feeds all 202 posts and the 6 category pages. Webflow's project pages were each
  built by hand. Their differences become stripes in each project's content file,
  not separate layouts.
- **Content layer:** `src/content/` exposes `getPage(slug)`, `getProjects()`,
  `getProject(slug)`, `getPosts()`, and so on. Today they read files in `content/`.
  Later they can read the Elio database without touching a single page.

## Design tokens and text by meaning

- Tokens, one place: colours, the spacing scale, radii, breakpoints, durations and
  easings, z-layers.
- Text styles by meaning, never by look: `display`, `h1`, `h2`, `h3`, `eyebrow`,
  `body`, `body-large`, `caption`, `button`, `stat-number`, `stat-label`, `nav`.
  Each style sets its font (Lato or Montserrat, as on the live site), size per
  breakpoint, weight, line height and letter spacing. A block picks a meaning;
  only the text style knows the numbers.
- Two type families in phase 1 (decisions #4): the fluid styles above for main
  and project pages, and `news-*` styles (fixed rem) for the news pages. See
  `docs/look.md`.
- Font: Lato only ("Lato 2" on Webflow), self-hosted WOFF2 in weights 300, 400,
  700, 900. No Google Fonts, no Montserrat (decisions #6).
- Breakpoints: the live site's own 7 ranges, so phase 1 matches exactly:
  <480 phone, 480–767 phone landscape, 768–991 tablet, 992–1279 desktop,
  ≥1280, ≥1440, ≥1920 (decisions #5). Only originals use them; pages never add
  breakpoints.
- The fluid unit `--u` sizes everything on the main and project pages:
  1.081081vw from 768 up, ×2 for phone landscape, ×3 for phone. Sizes there are
  `calc(N * var(--u))`, never px.

## The Inspector (the heart of the system)

Like Elio's: pick any element on the site, see what it's made of, and edit it.
Either change **the original**, and every page follows, or change **this instance
only**, a deliberate exception that stays visible as one.

- **Design lives in files, never in components.** In `design/`:
  - `tokens.json`: colours, spacing scale, radii, breakpoints, durations, easings.
  - `text-styles.json`: the text styles by meaning.
  - `originals/<name>.json`: each original's default settings, e.g. the hero
    video's overlay strength, height and text style, or a button's family.
  - Content files hold the instances: each stripe and block has a stable `id`,
    its content, and an `overrides` object for any setting it changes from its
    original. Overrides live next to their instance, so deleting a stripe takes
    its overrides with it. Elio's separate override table left orphans behind.
- **Every original declares its settings** in a schema: name, type (colour
  token, text style, spacing step, on/off, choice, media) and, where it matters,
  separate values for desktop, tablet and phone. The Inspector draws its controls
  from that schema; there is no hand-built settings panel per original. Only
  tokens can be picked, never a free hex or px value, so the site cannot drift.
  Only the settings Sil or Jorik ask for, not every CSS property.
- **Every rendered element carries marks:** `data-original="hero"`,
  `data-instance="pages/home#hero"` (a block inside it:
  `pages/home#hero.button`), and on editable text `data-field="title"`. Use
  `marks()` and `field()` from `src/originals/marks.ts`. The picker reads only these. An element without marks
  is unfinished work (drawn by hand); the picker says "one-off, ask Claude".
- **The picker:** hold a key (Alt) and hover to outline elements; click one and
  the Inspector opens on that instance. It shows:
  - the chain token → original → instance, with a button to open the original;
  - the instance's own settings, each override marked, with "reset to original";
  - "used on N pages", so you know what an original change will touch;
  - a device switch (desktop / tablet / phone) for settings that differ per size.
- **Edit text in place:** click a marked text and type; it saves to that
  instance's content file.
- **Panels besides the picker:** Tokens, Text styles, Originals (each with a live
  preview and every place it's used), Pages (a page's stripe list: reorder, add
  from the originals, remove).
- **Saving:** the Inspector exists only on your own computer (`npm run dev`); it is
  never in the live site's code. It saves by writing the JSON and content files
  through a local-only route, and the page updates at once. So every edit is a
  normal change in git: commit → Vercel preview link → approve → live. No
  database, no login, nothing to break into.
- **Guards for it:** `npm run check` also lists settings that change nothing on
  the page (Elio: every setting must prove it changes the page), instances that
  differ from their original with no reason recorded, and elements without
  marks.
- **Later:** when the site reads projects, press and team from Elio, text edits
  on those go to Elio; the look stays here.

## Originals to build first (all on the live site today)

- **BackgroundVideo** (hero and stripe backgrounds):
  - `<video muted autoplay loop playsinline preload="metadata">` with a poster
    image, so the first paint is never black.
  - `object-fit: cover`, filling its stripe at every size with no layout shift;
    the stripe sets the height (`100svh` hero, or an aspect ratio).
  - Optional dark overlay from a token, so text on top stays readable.
  - Sources MP4 + WebM (as Webflow serves them now), plus a smaller file for
    phones.
  - Pauses when scrolled out of view (IntersectionObserver) and plays when back.
  - With the system's Reduce motion setting on, it shows the poster only.
  - Copy every video file from Webflow's servers into our own storage first: they
    disappear when Webflow ends.
- **AnimatedText:** reveal by line or word on scroll, once. Timings come from the
  tokens; Reduce motion shows the text at once.
- **Stat:** a number that counts up when it comes into view, with its label. The
  final number is in the HTML (search engines, no-JS).
- **Video player:** Vimeo and YouTube films open in a player or lightbox.
- Then: Nav (with its mobile menu), Footer, Button, ProjectTile + grid, NewsCard
  + list, Quote, LogoRow, ImageBlock, Newsletter (EmailOctopus), Contact form,
  Tree-Nation widget.
- Keep `docs/components.md` up to date: every original, what it's for and its
  options. Read it before building anything new.

## Rules (each one cost us time in Elio)

1. **Build from what exists.** Check `docs/components.md` first; use, extend or
   repurpose an original. A new original only when nothing fits, and say so.
2. **No look values outside originals and tokens.** No px, hex/rgb colours,
   fonts or breakpoints in page files, content files or stripe configs. A real
   exception is marked `one-off: <reason>` in the code and named in the report.
3. **No hand-drawn elements.** No own `<div>` with its own styling where an
   original exists.
4. **Phase 1 changes no look.** If the copy differs from the live site, the copy
   is wrong. An improvement is a separate, named change.
5. **Make alike by removing.** When two things differ, take the extra away rather
   than adding it to both.
6. **Decisions register.** `docs/decisions.md`: every deliberate choice with who
   made it, the date and their words. Read it before changing a file; never "fix"
   a registered exception.
7. **Show, don't claim.** Before saying "done": screenshots at 390, 820 and 1440 px
   wide, side by side with the live site (phase 1) or the previous version
   (phase 2). Hover and click every new element. Check nothing is cut off.
8. **Speed is part of the look.** Hero poster and fonts preloaded, images through
   `next/image`, videos lazy below the fold, no layout shift. Lighthouse on every
   template, phone first.

## Guards (automated, not remembered)

- `npm run check` = type check + lint + `scripts/check-look-values.mjs` (refuses
  px/colours/fonts in pages and content) + `scripts/check-urls.mjs` (every
  address in `reference/live-site/_pages.txt` exists or redirects).
- `npm run looks` = Playwright screenshots of key pages (Home, Work, one project,
  News, one post, About, Contact) at 3 widths, compared with a saved baseline.
  An unapproved difference refuses the push. Accepting a new baseline is Sil's or
  Jorik's call.
- A pre-commit hook runs `npm run check`; never bypass it (`--no-verify`).
- Every branch gets a Vercel preview link; `main` is what's live.

## Working together

- One Claude Code session builds at a time. Parallel sessions on one folder broke
  each other's checks in Elio.
- Branch per change → preview link → approval → merge.
- Never do outside steps without a yes for that step: domain/DNS at one.com, Vercel
  settings, Webflow, EmailOctopus, analytics. The DNS switch is the very last step,
  and Sil does it.
- Plain language in reports: what changed, where to look, what's still open.
