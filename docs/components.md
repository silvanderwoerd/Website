# Originals

Every original: what it's for, its settings, where its files are. **Read this
before building anything new** (CLAUDE.md rule 1). `npm run check` fails if an
original in `src/originals/` is missing here.

The full planned list is in [system.md](system.md) §2–§4. This file lists only
what exists.

## How an original is made

| Part | Where | Holds |
|---|---|---|
| Component | `src/originals/<name>/<Name>.tsx` | markup; calls `marks("<name>", instance)` on its root and `field("<field>")` on editable text |
| Look | `src/originals/<name>/<name>.module.css` | tokens only (`var(--…)`); reads choices as `[data-s-<setting>="<value>"]` and token settings as `var(--s-<setting>)` |
| Schema | `src/originals/<name>/schema.ts` | settings the Inspector offers (kind, options, per device), text fields, blocks inside |
| Defaults | `design/originals/<name>.json` | the original's current settings: what "Change the original" edits |
| Registration | `src/originals/schemas.ts` (+ `src/stripes/registry.ts` for stripes) | so pages and the Inspector find it |

Instances live in content files (`content/pages/<slug>.json`, …). Each stripe
has a stable `id`, its `content`, and optional `overrides` + `overrideReasons`.
Blocks inside a stripe are objects in its `content` with the same two keys.

Instance addresses:
- a stripe: `pages/about#hero`
- a block: `pages/about#hero.button`
- a block in a list: `pages/home#featured-work.projects.2`
- site-wide originals: `site#nav`

Every stripe also takes the stripe-base settings (`src/stripes/base.ts`):
- `spaceBefore`: a space token
- `pageTone: "gradient"`: the page background turns blue-grey while the stripe is in view
- `anchor`: an id for in-page links

A containing original can choose a block's setting for it (`base`, e.g. Home's
statement gives its links `variant: partners`). The block's own overrides
still win.

Content text may carry `**bold**` and line breaks (`\n`), nothing else
(`src/lib/inline.tsx`).

## Site-wide (on every page, from `content/site.json`)

None of these has settings yet: the live site doesn't vary them.

| Original | Live | What it is |
|---|---|---|
| `nav` | `.navbar` | Fixed top bar: logo (follows the pointer ±1vw), hamburger. Full-screen menu opens and closes with Webflow's timings (IX2 Open/Close Menu); link texts slide to a copy on hover. |
| `footer` | `footer` | Logo, socials, Tree-Nation counter, commitments badges, link columns (underline grows on hover), EmailOctopus newsletter (styled as the live page styles it), © line. Logo is "current" on Home. |
| `preloader` | `.preloader` | Logo-shaped fill bar, then two panels slide away (IX2 Page Finishes Loading). Off with Reduce motion or without scripts. |
| `page-background` | `.page-background` | Fixed black page, moving film grain, and the gradient that fades in while a `pageTone: gradient` stripe is on screen. |

The shell that places them is `src/layout/SiteShell.tsx`.

## Blocks

### `button`

A link styled as a button. Files: `src/originals/button/`.

| Setting | Kind | Options | Default |
|---|---|---|---|
| `variant` | choice | `outline` (button-2.white-outline, 37 live pages) · `cta` (button-2-cta: wider at ≥1920) · `news` (button.is-secondary, news pages) · `earth-defender` (black fill) · `empower-children` (blue fill) | `outline` |

- Content: `label` (editable in place), `href`, optional `lightbox: true` (opens a YouTube/Vimeo film in the lightbox).
- Text: `ts-button` + `ts-button-label` (`ts-news-button` for `news`).
- On `outline`, the label drifts ±6px with the pointer (IX2 Button mouse over).

### `arrow-link`

Small text link with an arrow and a line that fills on hover. Files: `src/originals/arrow-link/`.

| Setting | Kind | Options | Default |
|---|---|---|---|
| `variant` | choice | `default` · `partners` (1.75em more space above: cc-partners) | `default` |

- Content: `label`, `href`.

### `project-tile`

A project as a big card. Files: `src/originals/project-tile/`.

- **Scroll in:** a black cover wipes away, and the poster sharpens from 1.3× and blurred.
- **Clip:** plays while the tile is in view or hovered.
- **Hover:** a play circle opens and follows the pointer.
- **Settings:** none yet. The Work grid's tiles join in step 6 with what they vary.
- **Content:** `href`, `client`, `title`, `poster`, `video` (`poster`, `mp4`, `webm`).

## Stripes

### `hero`

Full-screen opening band. Files: `src/originals/hero/`.

- **What it shows:** a background video with a 30% black overlay, the title (`**bold**` is weight 900), a button (`button` block) and socials.
- **On scroll:** the content moves down and fades (IX2 Home Hero Hide Text).
- **Settings:** none yet. About's hero and the project heroes join in step 6.
- **Content:** `title`, `video`, `button`.

### `statement`

A big sentence rising in word by word (AnimatedText), a smaller line, arrow
links (`partners` spacing) and an optional stamp image. Files: `src/originals/statement/`.

- Content: `text`, `sub`, `links[]`, `stamp`.

### `featured-work` (one-off: Home)

Home's four project tiles. Content: `projects[]` (each a `project-tile`).

### `partners` (one-off: Home)

Heading (AnimatedText, `**bold**` is 700) with an arrow link, and the logo
wall from `content/collections/partners.json`. Content: `heading`, `link`.

### `testimonials` (one-off: Home)

Eyebrow, heading (AnimatedText), and a Swiper row of quote cards from
`content/collections/testimonials.json`.

- **Slider:** free mode, 1.2 / 2.3 / 3.3 cards per view.
- **Read more:** the quote opens from 6.5em to its full height.
- **Content:** `eyebrow`, `heading`, `readMore`, `readLess`.

### `latest-news` (one-off: Home)

The newest post large (left) and the next four (right), from the content layer
(`getLatestPosts`). Image zooms on hover. Content: `eyebrow`, `readNow`, `count`.

### `closing-cta`

"We're here to tell stories that / **change the world. You in?**" with a `cta`
button. The content's second line is the big one. Content: `heading`, `button`.

## Motion (src/motion/, used inside originals)

| Helper | What it does |
|---|---|
| `AnimatedText` | Words rise in, 1500ms easeOutExpo, 30ms apart, once fully in view (live `.tricks`). |
| `BackgroundVideo` | Muted loop, poster first, MP4 + WebM, plays only on screen, poster only with Reduce motion. |
| `useScrollInView` + `at()` | Webflow's "while scrolling in view" progress with keyframes. |
| `PointerEffects` | Sets `--fx` / `--fy` (−1…1) on any `[data-follow]` element under the pointer; its CSS decides what moves. |
| `Lightbox` | The film lightbox (YouTube/Vimeo), closes on ✕, outside click or Esc. |

## Stripes (dev)

### `test-stripe` (dev only)

Proves the Inspector. It's only on `/dev/inspector-test` under `npm run dev`,
never on the live site. Files: `src/originals/test-stripe/`.

| Setting | Kind | Default |
|---|---|---|
| `background` | colour token | `page` |
| `spacing` | spacing token, per device | desktop `5` · tablet `4` · phone `3` |
| `align` | choice: `center` · `left` | `center` |
| `titleStyle` | text style | `display` |

- Content: `eyebrow`, `title`, `text` (all editable in place), and `button` (a `button` block).
