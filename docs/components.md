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

- Content: `label` (editable in place), `href`, optional `lightbox: true` (opens a YouTube/Vimeo film in the lightbox), optional `current: true` (set by a containing original: the page it leads to is the one shown; `news` draws it lighter, live `.w--current`).
- Text: `ts-button` + `ts-button-label` (`ts-news-button` for `news`).
- On `outline`, the label drifts ±6px with the pointer (IX2 Button mouse over).

### `arrow-link`

Small text link with an arrow and a line that fills on hover. Files: `src/originals/arrow-link/`.

| Setting | Kind | Options | Default |
|---|---|---|---|
| `variant` | choice | `default` · `partners` (1.75em more space above: cc-partners) | `default` |

- Options from the containing original: `as: "div"` (the look without a link, inside a card that is the link) and `className` (placing it, never restyling).
- Content: `label` (its `**…**` is the blue word, live `.text-color-blue`: "Our Real World **Action**"), `href`. The containing original may leave the arrow out where the live page puts it beside the link (About's awards).

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

| Setting | Kind | Default |
|---|---|---|
| `variant` | choice: `project` · `home` · `about` | `project` (Home and About override it) |

- **`home`:** a background video with a 30% black overlay, the title (`**bold**` is weight 900), a button (`button` block) and socials. On scroll the content moves down and fades (IX2 Home Hero Hide Text).
- **`project`:** the project's still with parallax, an eyebrow, the client and the title rising in 1.3s after load (live `.fl-project-hero`).
- **`about`:** About's mission over a full-screen video: eyebrow, and the title rising in 1.3s after load.
- **Content:** home: `title`, `video`, `button`; project: `eyebrow`, `client`, `title`, `image`; about: `eyebrow`, `title`, `video`.

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

## Project stripes (the Project template, `content/projects/<slug>.json`)

Every project page is `hero` + `project-details` + its own bands + `more-work`.
The bands are the live page's, in its order. Where Webflow projects laid a band
out by hand, the difference is a setting, recorded as an override with the
reason "as on the live site (phase 1)".

Stripes also take `padTop` / `padBottom` (a space token): the live edge
spacers inside a band, placed as its first and last child.

### `project-details`

About the project (rich text) on the left, key credits on the right, the
client's logo, and two pop-ups: full credits and media features (`Modal`).
Live `.fl-section-project-details`. Content: `eyebrow`, `about`, `credits[]`
(`role`, `name`), `fullCredits`, `creditsNote`, `press[]`, `logo`, `creditsLabel`, `pressLabel`.

### `film`

A YouTube or Vimeo film (`FilmPlayer`) with its poster and the play circle that follows the pointer.

| Setting | Kind | Default |
|---|---|---|
| `size` | choice: `large` · `medium` · `split` | `large` |
| `visibility` | choice: `always` · `phone` (live `.section-8`: only on phones, where it replaces an episode's own film) | `always` |
| `phoneBox` | choice: `block` · `inline` (live `.section-7`: an inline block on phones, which adds line space) | `block` |

Content: `film` (`id`, `host`, `ratio`, `poster`).

### `text`

A heading rising in word by word (AnimatedText) with a short text beside it and an
optional arrow link (live `.fl-split-small-section`). Content: `heading`, `body` (rich text), `link`.

### `gallery`

A Swiper row of stills (`GallerySlider`): drag or arrows, slides shrink while
dragged, the row slides 0 → −30vw as you scroll past. Optional heading.

| Setting | Kind | Default |
|---|---|---|
| `image` | choice: `campaign` · `stills` · `bts` · `wide` · `visuals` · `media` · `drifters` · `story` (one per live image class) | `campaign` |
| `align` | choice: `top` · `center` (slides centred on the tallest) | `top` |

Content: `heading`, `images[]` (`src`, `alt`).

### `quote`

A quote in italics with a thin bar beside it and who said it (live `.fl-quote-section`). Content: `quote`, `cite`.

### `campaign`

A bold heading, a paragraph, a "View Media Features" pop-up and an optional
landing-page link (`arrow-link` blocks). Content: `heading`, `text`, `press[]`, `pressLabel`, `link`.

### `stats`

A title and four big numbers with labels, split by thin lines (live `.fl-section-numbers`). Content: `title`, `items[]` (`number`, `label`).

### `cta`

An image beside a heading, a short text and a button.

| Setting | Kind | Default |
|---|---|---|
| `size` | choice: `small` · `big` | `small` |

Content: `image`, `heading`, `text`, `button`.

### `text-on-image`

A half-height background image with parts on top: text, a film, or a heading and a gallery.

| Setting | Kind | Default |
|---|---|---|
| `panel` | choice: `plain` · `noise` · `campaign` | `plain` |

Content: `image`, `parts[]` (`kind`: `text` (with `dark`) · `film` · `gallery`).

### `posters`

Campaign posters, key visuals or two films side by side.

| Setting | Kind | Default |
|---|---|---|
| `layout` | choice: `poster` · `poster-still` · `poster-still-double` · `exhibition` · `rud-poster` · `rud-stills` · `films` · `films-tight` (each project's hand-made layout) | `poster` |

### `phones`

A row of phones with screenshots on a background photo; they move up 3em while you scroll past (`PhoneScroll`).

### `instafilter`

Total Pollution's Instagram filter as a looping video in a phone.

### `episode`

One episode: name and short text on the left, its film on the right (Webflow
float columns). On phones the film column hides; a `film` with
`visibility: phone` takes its place.

### `embed`

Another website inside the page (Team Forest's sign-up), passing the wheel on so the page keeps scrolling (`EmbedBridge`). Content: `url`.

### `more-work`

The "View More Work" button closing every project. Content: `button`.

## Main-page stripes (Work, About, Act, Contact, the campaign pages)

### `page-heading`

A page's big centred title (`page-title` style), rising in word by word 1.3s after load,
between an 8em and a 4.5em space (live `/work` heading). Content: `heading`.

### `work-grid`

Every project as a `work-tile`, two to a row (one from 767 down). Content: `tiles[]`.

### `work-tile` (block)

A project's still over its clip (`BackgroundVideo`); on hover the still fades away
(200ms). From tablet down the still is hidden: the clip with client and title shows.
Content: `href`, `client`, `title`, `image`, `video`.

### `about-statement` (one-off: About)

"What we stand for": eyebrow, a large sentence (`**bold**` is 900), a grey paragraph,
an `arrow-link` (partners spacing), and the showreel (`FilmPlayer`) below.
Content: `eyebrow`, `text`, `body`, `link`, `film`.

### `services` (one-off: About)

Eyebrow, heading, three Webflow tabs (`ServiceTabs`): a click shows that tab's text
(fade out 100ms, in 300ms) and cross-fades its background photo (500ms linear).
Content: `eyebrow`, `heading`, `tabs[]` (`label`, `text`, `background`), `link`.

### `awards` (one-off: About)

Background photo moving −20% → 0 while in view (`ParallaxImage`), eyebrow, heading,
"View all awards" opening the full list (`Modal`, Markdown in `list`), a paragraph,
and an endless column of award logos (`LogoColumn`, desktop only).
Content: `background`, `eyebrow`, `heading`, `link`, `listTitle`, `list`, `text`, `logos[]`.

### `team` (one-off: About)

Heading, then the core team and the wider collective from
`content/collections/team.json` (`group`: core · collective; later from Elio). On hover
a photo shrinks to 0.95, darkens, and its name turns white.
Content: `heading`, `coreLabel`, `collectiveLabel`.

### `life-with` (one-off: About)

Two live bands in one stripe: the "Life With **Studio Birthplace**" heading and a
three-column photo wall (two from 767 down), each photo rising in as it scrolls
into view (`RevealImage`). Content: `heading`, `photos[]`.

### `act-hero` (one-off: Act)

A sticky wall of four photo columns under a dark gradient; while the title's screen
scrolls through, odd columns move −5em → 0 and even ones 0 → −5em (IX2 "Act Hero").
Eyebrow and title (rising in after load) on top. Content: `eyebrow`, `heading`, `columns[][]`.

### `act-campaigns` (one-off: Act)

The campaigns to act on: a card each (photo, logo, a line, title, "Click to Act").
From 992 up the logo and line are hidden until hover, when the card shrinks to 0.95
(IX2 "Active Project Hover", desktop only). Each card is also its "Click to Act"
`arrow-link` block, drawn as a div because the card is the link.
Content: `eyebrow`, `heading`, `cards[]` (`href`, `newTab`, `image`, `logo`, `text`, `title`, `label`).

### `sustainability` (one-off: Act)

Eyebrow, heading, intro, and three cards (`StatCard`): a number counting up from 0
when in view (countUp.js copied: 2s easeOutExpo, again after scrolling back above
it; the final number is in the HTML), its label, and "Read more" opening its story.
Content: `eyebrow`, `heading`, `text`, `stats[]` (`value`, `decimals`, `label`, `more`), `readMore`, `readLess`.

### `act-statement`

One sentence (rising in) over a full-width photo moving −25% → 0 while in view.
Act and Earth Defender. Content: `image`, `text`.

### `values` (one-off: Act)

Eyebrow, heading and numbered rows that open on click (`ValueItem`: the answer rises,
grows and fades in; the plus turns into a grey minus). Content: `eyebrow`, `heading`, `items[]` (`title`, `text`).

### `contact-hero` (one-off: Contact)

The whole top of Contact: mountains behind an overlay that lightens as you scroll
(`ContactShade`: 0.87 → 0.8 → 0.24), the world map with four pulsing pins (on
desktop hover a line draws out to the city's name), the heading, then the contact
details (socials from site settings, four e-mail rows) and the Quick Contact form.
**The form sends nothing yet:** the live one posts to Webflow, and which service
replaces it is Sil's open call (`ContactForm`, marked one-off). Pin places are in
the CSS by pin `id`.
Content: `background`, `map`, `pins[]` (`id`, `label`), `eyebrow`, `heading`,
`formEyebrow`, `title`, `text`, `mailIcon`, `contacts[]` (`email`, `href`, `label`),
`quickContact`, `fields`, `send`, `sending`, `success`, `failure`.

Pages may set `footerBand: "black"` (Contact): the closing stripe and the footer on
solid black, as live's `.footer-background`.

## News stripes (News, the Post and Category templates)

The news pages use the fixed `news-*` text styles (decisions #4) and
`background: "plain"`: no page-background layer, the bare page colour, as live.
`/news` is `content/pages/news.json`; the two templates are
`content/templates/post.json` and `category.json`. Their route hands the
stripes a `context` (the post or category shown), so the texts in the
template ("More News", "All posts" …) stay editable in one place.

Every post card is `NewsCard` (`src/originals/news-list/NewsCard.tsx`, live
`.link-content-blog`): image (zooms to 1.1 and dims to 90% on hover, IX2 "Image
Scale - Hover"), category tag, date, title, summary, "Read now". Options: `light`
(More News' 300-weight titles), `wide` (the category pages' larger summary), `date`.

### `news-list`

Every post as a card, newest first, with no 100-post limit (decisions #1).

| Setting | Kind | Default |
|---|---|---|
| `layout` | choice: `sidebar` (`/news`: eyebrow, heading, sticky category buttons beside two columns of cards) · `category` (a category page: its name, the buttons in a row, its posts) | `sidebar` |

- **Content:** `eyebrow`, `heading` (sidebar only), `readNow`, `categoryButton` (a `button` block, `news` variant, shared by all six buttons; the shown category's is marked current).
- Webflow's hidden "all" buttons are left out.

### `post-header`

A post's title, category, date and 16:9 main image, from the post. No settings, no content of its own.

### `post-body`

The post's rich text with Webflow's figure rules. Figures' sizes come from the
content as data: `data-max-width` (an image's own width) and `data-ratio` (a
film's height as % of its width).

### `related-posts`

"More News": heading, line, an "All posts" button (`button`, `news` variant), and
the newest posts except the one shown. Cards show a post's `cardDate` where it
has one (decisions #20). Content: `heading`, `text`, `button`, `readNow`, `count`.

## Motion (src/motion/, used inside originals)

| Helper | What it does |
|---|---|
| `AnimatedText` | Words rise in, 1500ms easeOutExpo, 30ms apart, once fully in view (live `.tricks`). |
| `BackgroundVideo` | Muted loop, poster first, MP4 + WebM, plays only on screen, poster only with Reduce motion. |
| `useScrollInView` + `at()` | Webflow's "while scrolling in view" progress with keyframes. |
| `PointerEffects` | Sets `--fx` / `--fy` (−1…1) on any `[data-follow]` element under the pointer; its CSS decides what moves. |
| `Lightbox` | The film lightbox (YouTube/Vimeo), closes on ✕, outside click or Esc. |
| `FilmPlayer` | Poster + play circle; Plyr starts when the film is within 200px of the screen, so its control bar shows before play, as on live (decision #17). |
| `GallerySlider` | Swiper free mode, slides at their own width 24px apart, arrows, side scroll 0 → −30vw. |
| `Modal` | The pop-ups (credits, media features) with the live IX2 timings. |
| `PhoneScroll` | Moves its children 0 → −3em between 20% and 80% of the scroll through. |
| `EmbedBridge` | Lets an embedded page pass wheel scrolling back to ours. |
| `RevealImage` | Webflow's "Fade in" + "Slide in from bottom": 700ms after scrolling into view, rises 100px and fades in (1000ms outQuart). |
| `LogoColumn` | An endless Swiper row of logos (vertical from 991 up), autoplay with no pause, linear. |
| `ParallaxImage` | An image moved by keyframes while its band scrolls through the window. |

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
