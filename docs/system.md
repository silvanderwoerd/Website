# Step 3 — The proposed system

Written 28 Oct 2026, built on [inventory.md](inventory.md) (what exists) and
[look.md](look.md) (the look). Variations were measured across every stripe use
on the live site (`reference/live-site/_stripes.tsv`, made by
`scripts/inventory/stripe-lists.ps1`). An original only offers a setting when
the live site actually uses more than one value for it.

**A proposal, not a change.** §8 lists what needs a yes.

## 0. In short

- **26 stripe originals**, down from about 30 live band types. Eight live types
  fold into existing originals (§2). **11 of the 26 are one-offs** that appear
  on a single page.
- **20 block originals** and **9 motion originals.**
- The live site varies surprisingly little, so most originals need **0–2
  settings**. Example: every stats stripe has exactly 4 numbers, and every
  gallery differs only in its number of slides.
- **Three kinds of content file:**
  - pages (a list of stripes)
  - projects (a fixed head + a free list of stripes)
  - posts (front matter + text)
- Plus small collections: team, awards, partners, testimonials, Act campaigns.

## 1. Settings every stripe has

These come from the stripe base, so no original repeats them.

| Setting | Kind | Values (live) | Why |
|---|---|---|---|
| `spaceBefore` | choice | none · `4.375u` · `4.5u` | Webflow used empty spacer bands (`fl-spacing-4-375em` ×5, `fl-spacing-4-5em` ×28). They become a setting, not stripes. The two values are 2px apart, so they stay separate under decision #3 (✱). |
| `pageTone` | choice | off · `gradient` | Home partners, Act sustainability and Empower Children shift the page background while in view (`background-trigger`). |
| `anchor` | text | — | an `id` for links like `/act#eni` |

Background, width and stacking on phones belong to each original, because the
live site never varies them within a stripe type.

## 2. Stripe originals

**Uses** = pages / total uses. **One-off** = appears on a single page.

### Shared

| Original | Uses | Content | Settings | Notes |
|---|---|---|---|---|
| `nav` | every page | logo, links, email, socials (from site settings) | — | full-screen menu, colour flips over light bands |
| `footer` | 245 | from site settings | — | newsletter, Tree-Nation, contacts |
| `closing-cta` | 5 / 5 | heading, text, button | — | "You in? Work With Us" |

### Heads

| Original | Uses | Content | Settings | Folds in |
|---|---|---|---|---|
| `hero` | 33 / 33 | eyebrow, title, subtitle, button, media | `media`: video · image. `titleWeight`: light · black (About uses black). | `hero-video` (Home, About) + `project-hero` (30 projects + Jungle Heroes sub-page, image with parallax) |
| `project-details` | 31 / 31 | about text, short credits, full credits, press list | — | credits and press open in modals |

### Project body

| Original | Uses | Content | Settings | Folds in |
|---|---|---|---|---|
| `text` | 31 / 85 | heading, rich text, link? | — | the optional link is the arrow link (5 uses) |
| `film` | 31 / 78 | film (YouTube/Vimeo), poster, text? | `size`: large · medium · split. `ratio`: 16:9 · 2.39:1 (Team Forest). | `video(large)`, `video(medium)`, `video(split)`, Change Drivers' 11 episode rows (✱ check in step 6 that the rows match `split`) |
| `gallery` | 31 / 78 | 3–13 images | — | Swiper, slight scroll movement, black arrows: identical in all 78 |
| `quote` | 22 / 29 | quote, name | — | |
| `text-on-image` | 11 / 14 | background image, heading, text, gallery? | `panel`: plain · noise · campaign | 6 uses carry a small gallery |
| `campaign` | 13 / 13 | eyebrow, heading, text, 2 images | — | |
| `stats` | 10 / 10 | 4 × (number, label) | — | always 4 |
| `cta` | 17 / 22 | image, heading, text, button | `size`: small · big · statement. `buttonTone`: outline · earth-defender · empower-children. | `cta-small`, `cta-big`, `act-statement`, Empower Children's top band |
| `posters` | 7 / 15 | 1–3 × (poster, film?) | `shape`: poster · still (✱ check the Haze / RUD / Wasteminster layouts in step 6) | 4 Webflow classes |
| `phones` | 3 / 3 | 8–9 phone screens | — | sideways scroll |
| `statement` | 3 / 5 | eyebrow?, big text, links? | `size`: display · h2. `background`: page · black. | Home "who we are", About "what we believe", Earth Defender facts (letter animation) |
| `more-work` | 32 / 32 | — | — | "View More Work" → `/work` (renamed from "next project": there's no next-project link) |

### Main pages

| Original | Uses | Content | Settings | Notes |
|---|---|---|---|---|
| `page-heading` | 2 / 2 | heading | — | `/work` heading + About's "Life With" (folds in `heading`) |
| `featured-work` | 1 | 4 projects | — | **one-off** (Home): tall tiles, hover video |
| `partners` | 1 | heading, button, logos (collection) | — | **one-off** (Home) |
| `testimonials` | 1 | testimonials (collection) | — | **one-off** (Home) |
| `latest-news` | 1 | n latest posts | — | **one-off** (Home) |
| `work-grid` | 1 | all visible projects | — | **one-off** (Work): grid/list switch, cursor label |
| `act-hero` | 1 | heading, 3 image columns | — | **one-off** (Act): sticky collage |
| `act-campaigns` | 1 | Act campaigns (collection) | — | **one-off** (Act) |
| `sustainability` | 1 | 3 stats with read more, Tree-Nation, 3 values | — | **one-off** (Act) |
| `services` | 1 | 3 tabs | — | **one-off** (About) |
| `awards` | 1 | marquee + modal (collection) | — | **one-off** (About) |
| `team` | 1 | core team + collective (collection) | — | **one-off** (About) |
| `image-marquee` | 1 | photos | — | **one-off** (About) |
| `contact-hero` | 1 | heading, form, 4 map pins | — | **one-off** (Contact) |

### News

| Original | Uses | Content | Settings | Notes |
|---|---|---|---|---|
| `news-list` | 7 | posts, category filter | — | `/news` + 6 categories. **No 100-post limit** (decision #1). |
| `post-header`, `post-body`, `related-posts` | 202 each | from the post | — | parts of the Post template, not chosen per page |

### Embeds

| Original | Uses | Content | Settings | Notes |
|---|---|---|---|---|
| `embed` | 2 | URL, height per size | `kind`: iframe · instagram | Team Forest sign-up site (+ its sign-up message bridge), one Instagram post |
| `instafilter` | 1 | 2 phone videos | — | **one-off** (Total Pollution) |

**Dropped:** Earth Defender's empty band (`section-4`) holds nothing, so it
isn't copied.

## 3. Block originals

| Block | Settings (live variations only) | Used in |
|---|---|---|
| `Heading` | `textStyle` (any heading style from `text-styles.json`) | everywhere |
| `RichText` | `textStyle`: body · body-large · news-rich-text | text, details, posts |
| `Eyebrow` | `variant`: section · project | heads, statements |
| `Button` | `variant`: outline (37 pages) · cta (5) · news (209) · earth-defender · empower-children | everywhere |
| `ArrowLink` | `variant`: default · partners | statements, text |
| `ReadMore` | — | testimonials, sustainability |
| `Image` | `ratio`, `fit` (`next/image`) | everywhere |
| `BackgroundVideo` | `overlay`: overlay steps from look.md | hero, tiles (CLAUDE.md spec) |
| `FilmPlayer` | `ratio` · `mode`: inline · lightbox (Home showreel) | film, posters, hero |
| `Stat` | `decimals`, `countUp` on/off | stats, sustainability |
| `Quote` | — | quote |
| `LogoWall` | — | partners |
| `ProjectTile` | `variant`: featured (tall) · grid | featured-work, work-grid |
| `NewsCard` | `variant`: list · related · home | news-list, related-posts, latest-news |
| `TestimonialCard` | — | testimonials |
| `TeamCard` | `variant`: core (bio + socials on hover) · collective | team |
| `Modal` | — | credits, press, awards, showreel |
| `Tabs` | — | services |
| `ContactForm` | — | contact-hero (form service: ask before choosing) |
| `Newsletter` | — | footer (EmailOctopus form `8b155d74…`) |

`TreeNation` and `MapPin` stay inside their one stripe (`footer` /
`sustainability`, `contact-hero`). They're not reused, so they don't get their
own originals.

## 4. Motion originals

All built with `motion`. Timings come from the motion tokens in look.md §8, and
Reduce motion turns each one off.

| Original | Replaces | Does |
|---|---|---|
| `Preloader` | IX2 page start/finish | full-screen cover that fades out |
| `Reveal` | IX2 scroll-into-view (19) | fade + rise, once |
| `AnimatedText` | `.tricks` + anime.js | letters rise in, 30ms stagger, 1500ms outExpo |
| `Parallax` | IX2 while-scrolling (49) | scroll-linked move or scale, smoothing 50 |
| `Marquee` | Swiper autoplay + IX2 loops | endless row (awards, logos, photos, footer row) |
| `CountUp` | countUp.js | inside `Stat`, final number in the HTML |
| `CursorLabel` | IX2 mouse-move (133) | "View project" label follows the cursor, smoothing 90 |
| `PageTone` | IX2 background gradient | the `pageTone` stripe setting |
| `Grain` | page-level CSS | the film-grain overlay on every page (2s, 2 steps) |

Hover effects (306 IX2 triggers) become plain CSS transitions inside `Button`,
`ArrowLink`, `ProjectTile`, `LogoWall` and `NewsCard`, so they need no motion
original.

## 5. Content files

### 5a. A page — `content/pages/<slug>.ts`

Covers Home, Work, About, Act, Contact, `/earthdefender`, `/empowerchildren`,
`/news` and the Jungle Heroes sub-page.

```ts
export default definePage({
  slug: "about",
  seo: { title: "About", description: "…", image: "/media/…/about-share.jpg" },
  stripes: [
    { id: "hero", type: "hero",
      content: { eyebrow: "Our Mission", title: "…", media: { video: "about-mission" } },
      overrides: { titleWeight: "black" } },
    { id: "believe", type: "statement",
      content: { eyebrow: "What we stand for", text: "…" },
      overrides: { size: "h2", background: "black" } },
    { id: "services", type: "services", content: { tabs: [/* … */] } },
    { id: "awards", type: "awards", content: { collection: "awards" } },
    { id: "team", type: "team", content: { collection: "team" } },
    { id: "life", type: "page-heading", content: { heading: "Life With Studio Birthplace" } },
    { id: "photos", type: "image-marquee", content: { images: [/* … */] } },
    { id: "closing", type: "closing-cta", content: {} },
  ],
});
```

- `id` is stable. It forms the Inspector mark `data-instance="pages/about/believe"`.
- `content` holds words and media only. Look values are refused by `npm run check`.
- `overrides` holds only settings that differ from the original's defaults
  (`design/originals/<type>.json`), and each override needs a `reason` unless
  it's a plain choice the schema offers.

### 5b. A project — `content/projects/<slug>.ts`

```ts
export default defineProject({
  slug: "team-forest",             // address /work/team-forest
  client: "WWF",
  title: "Team Forest",
  summary: "…",                    // hero one-liner
  order: 1,                        // position in the Work grid
  hidden: false,                   // decision #2: Journey of Hope returns by flipping this
  tile: { poster: "…", video: "team-forest-work" },        // Work grid / Home feature
  hero: { image: "…" },
  details: { about: "…", credits: [/* {role, names} */], fullCredits: [/* by department */], press: [/* {outlet, title, url} */] },
  film: { provider: "youtube", id: "…", poster: "…", ratio: "2.39:1" },
  stripes: [                       // the free part, in order
    { id: "s1", type: "stats", content: { items: [/* 4 */] } },
    { id: "s2", type: "text", content: { heading: "Shared Homeground", body: "…" } },
    { id: "s3", type: "gallery", content: { images: [/* … */] }, spaceBefore: "4.5u" },
    // …
  ],
  seo: { title: "…", description: "…", image: "…" },
});
```

- The Project template always draws `hero` → `project-details` → `film` from
  the fields above, then `stripes`, then `more-work`.
- 29 of the 30 project pages fit this exactly. Change Drivers has no film before
  its stats, so its `film` is empty and its films sit in `stripes`.
- `/earthdefender` and `/empowerchildren` are pages (§5a), not projects. They
  appear in the Work grid only through their tile, if at all (Earth Defender
  does, linked as `/earthdefender`).

### 5c. A post — `content/posts/<slug>.md`

```md
---
title: "New Release - Team Forest"
date: 2026-06-09
category: new-releases
image: /media/posts/team-forest.jpg
summary: "…"
---
Body text in Markdown. Embeds (YouTube, Vimeo, Instagram) stay as HTML blocks.
```

Markdown keeps 202 posts readable and editable, and the move script in step 6
converts Webflow's rich text to it. The risk is that a formatting detail might
not survive the conversion, so step 6 compares a post sample at 3 widths.

### 5d. Collections and site settings

| File | Content | Fed by today | Later |
|---|---|---|---|
| `content/site.ts` | nav links, email, socials, contacts, footer, newsletter ID, analytics ID | — | — |
| `content/collections/team.ts` | name, role, photo, bio?, links?, `group`: core · collective | `/about` | Elio |
| `content/collections/awards.ts` | year, award, festival, project | `/about` modal | Elio |
| `content/collections/partners.ts` | name, logo | `/` | Elio |
| `content/collections/testimonials.ts` | quote, name, role, logo | `/` | Elio |
| `content/collections/act-campaigns.ts` | title, text, image, button label, URL | `/act` | — |
| `content/categories.ts` | the 6 categories | — | — |
| `content/redirects.ts` | the 4 live redirects + `/work/sleepless` | — | — |

## 6. The content layer — `src/content/`

Pages never import content files. They call these functions, which can read
from Elio later.

```ts
getSite(): Site
getPage(slug): Page                                  // pages
getProjects({ includeHidden? }): ProjectSummary[]    // Work grid order
getProject(slug): Project
getFeaturedProjects(): ProjectSummary[]              // Home, 4
getPosts({ category?, limit? }): PostSummary[]       // newest first, no limit by default
getPost(slug): Post
getRelatedPosts(slug, n = 3): PostSummary[]          // live: same category, newest
getLatestPosts(n): PostSummary[]                     // Home
getCategories(): Category[]
getCategory(slug): Category
getCollection<"team" | "awards" | "partners" | "testimonials" | "act-campaigns">(name)
getRedirects(): Redirect[]
getAllPaths(): string[]                              // static generation + URL parity check
```

`usedOn(original)` and `usedOn(instance)` are for the Inspector's "used on N
pages". They run locally only.

## 7. Settings schema (how the Inspector draws its controls)

Each original declares its settings next to its component, in
`src/originals/<name>/schema.ts`:

```ts
export const schema = defineSchema("film", {
  size:  { kind: "choice", options: ["large", "medium", "split"], default: "large" },
  ratio: { kind: "choice", options: ["16:9", "2.39:1"], default: "16:9" },
});
```

- Defaults are mirrored in `design/originals/film.json` (what an "original"
  change edits).
- Allowed kinds: `colorToken`, `textStyle`, `spaceStep`, `choice`, `toggle`,
  `media`, plus `perDevice` where the value differs by width. **No free values.**
- The "dead settings" guard renders each setting's options and fails if two
  options draw the same page.

## 8. Needs a yes before step 4

1. **The merges in §2**:
   - `hero` (home/about/project)
   - `cta` (small/big/statement)
   - `film` (3 sizes + Change Drivers rows)
   - `statement` (3 big-text bands)
   - `page-heading`
   - the spacer bands becoming `spaceBefore`
   - Each one still draws exactly what the live site shows. Where I'm not sure,
     it's marked ✱ and step 6 checks it.
2. **Posts as Markdown** (5c), rather than keeping Webflow's HTML.
3. **Swiper and Plyr in phase 1?**
   - **Swiper** draws the galleries, testimonials and the awards marquee.
     Keeping it inside the `gallery` original copies the drag feel exactly.
   - **Plyr** draws the film controls. Keeping it inside `FilmPlayer` (loaded
     only on click) copies the controls exactly.
   - Rebuilding either is a phase-2 candidate.
   - CLAUDE.md allows only `motion` for animation, and neither of these is an
     animation library. Recommendation: keep both in phase 1 and record it.
4. **The contact form service** (Webflow forms ends with Webflow). Options are
   Formspree, Netlify Forms or Vercel + Resend. Ask Sil? Nothing gets signed up
   without a yes.
5. **Tools for step 4:**
   - Node.js 22 LTS and Git. Neither is on this computer yet.
   - Installing them needs your yes, or you can install them yourself:
     [nodejs.org](https://nodejs.org) and [git-scm.com](https://git-scm.com).
6. **Open from before:** The Journey of Hope's content (unhide it in Webflow, or
   send it) and its address (`/work/flags`?).
