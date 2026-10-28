# Step 2 — The look of studiobirthplace.com

Written 28 Oct 2026 from the live site's CSS (`reference/live-site/_assets/
studio-birthplace.webflow.shared.a0c967062.css`, 272 KB), the 12 page-level
style blocks and the Webflow interaction file. `scripts/inventory/css.ps1`
splits the CSS into 7,478 single declarations and marks which ones the saved
pages actually use: **3,672**. The rest is left over from the Webflow template
the site started from ("Portrait"). Everything below counts used rules only.

**A proposal, not a change.** Nothing is built or fixed yet. Section 9 lists what
needs a yes.

## 1. Five things that shape everything else

1. **Text on 42 pages scales with the window width.** A page-level style on every
   main and project page sets `body { font-size: 1.081081vw }` (1em = 16px at a
   1480px-wide window), and almost every size there is in `em`. So the whole page
   zooms with the window. On smaller screens the page wrapper multiplies it:
   `.fl-page-wrapper-projects` is `2em` at ≤991px and `3em` at ≤767px.
   (Corrected 28 Oct in step 5: this first said 767 / 479.)
   → One **fluid unit** token that changes per breakpoint carries all of it.
2. **There are two type systems.** Main and project pages use the fluid `fl-*`
   classes (`em`). The 208 news pages (posts, categories, `/news`) use a fixed
   class library (`heading-large`, `text-size-small`, `page-padding`,
   `padding-xxhuge` …) in `rem`, on a fixed 14px body. Phase 1 must copy both.
   Merging them is a natural phase-2 change (rule 5: make alike by removing).
3. **There are 7 width ranges, not 4.** Besides Webflow's 991/767/479, the CSS
   has rules at **≥1280, ≥1440 and ≥1920**. The ≥1920 range alone has 445 used
   declarations. CLAUDE.md names only the 4 Webflow ones, so CLAUDE.md needs
   updating (§9).
4. **The font is one family, "Lato 2", self-hosted on Webflow**: 5 TTF files
   (Thin 100, Light 300, Regular 400, Bold 700, Black 900). **Montserrat is used
   nowhere.** Its one rule targets a class no page has. Google's copy of Lato is
   used once (`.paragraph`). Yet every page downloads Montserrat and Lato in all
   36 weights from Google Fonts. Thin (100) is never used either. Weights 500
   and 600 are asked for (menu links, buttons, footer titles), but there's no
   Lato 2 file for them, so browsers show 400 and 700 instead. The copy keeps
   that by loading the same 4 files. Correction to Sil's notes: the site is Lato
   only.
5. **About 75 colour values become ~16 tokens.** Most of the spread is
   near-duplicates (e.g. `#111`, `#111113`, `#0d0d11`, `#141414`) and Webflow's
   built-in defaults that are always overridden.

## 2. Breakpoints

| Token | Range | Used declarations | Notes |
|---|---|---|---|
| `phone` | < 480 | 158 | fluid unit ×3 |
| `phone-landscape` | 480–767 | 168 | fluid unit ×2 |
| `tablet` | 768–991 | 236 | fluid unit ×1 |
| `desktop` | 992–1279 | 2,643 (base) | the default |
| `desktop-l` | ≥ 1280 | 10 | a few container widths |
| `desktop-xl` | ≥ 1440 | 12 | a few text sizes |
| `desktop-xxl` | ≥ 1920 | 445 | a large set: bigger news text, paddings, hero text |

Webflow writes the lower three as `max-width` and the upper three as
`min-width`. The copy keeps those exact edges.

## 3. The fluid unit

```
--u: 1.081081vw      desktop (≥ 992)
--u: 2.162162vw      tablet (768–991)            = wrapper 2em
--u: 3.243243vw      phones (≤ 767)              = wrapper 3em
```

Every `em` size on the 42 fluid pages becomes `calc(N * var(--u))`. What 1em
works out to:

| Window | 1em |
|---|---|
| 390 (phone) | 12.6px |
| 600 (phone-landscape) | 19.5px |
| 820 (tablet) | 17.7px |
| 1440 (desktop) | 15.6px |
| 1920 | 20.8px |

Some rules on fluid pages are in `rem`/`px` and so don't scale: the 11px
buttons, the menu links (4.5rem), the footer (1.2rem / .975rem). Copy them as
they are.

## 4. Colours

Grouped by meaning. Near-duplicates are merged into the **winner** (the
most-used value). ✱ = merging them is visible, so phase 1 keeps it separate
until you say otherwise.

| Token | Value | Used for | Merges in |
|---|---|---|---|
| `page` | `#181818` | body background, gallery arrows, Life With heading band | — |
| `black` | `#000` | `--black`, section backgrounds | `#040404` (`--black-2`, invisible) |
| `surface` | `#111` | `--black-3`, small CTA, modal, menu panel | `#111113`, `#0d0d11` (menu), `#141414` (modal): all within 1–2% |
| `ink` | `#090b19` | outline/solid button text and fill | `#101118` (contact form text) |
| `white` | `#fff` | headings, button text | `white`, `--white-11`; ✱ `#f0f2f5` (footer titles), `#eef4fa` (FAQ numbers): faint blue tints, 4–6% off |
| `text-muted` | `#9c9c9c` | `--dark-grey`: body text, paragraphs, quotes | — |
| `text-subtle` | `#7c7c7c` | `--grey`: video player controls | `#7f7f7f` (`.paragraph`) |
| `line` | `#81818b` | links (90%), form borders, dividers | its alpha steps: 10 / 15 / 20 / 25 / 30 / 50 / 90% |
| `button-hover` | `#e2e7f1` | button hover fill | — |
| `link` | `#5786dd` | `--blue`: text links | ✱ `#4f8cd5` (Empower Children button) |
| `accent-teal` | `#126983` | `.text-color-blue` | — |
| `menu-line` | `#211f54` | hamburger lines | — |
| `campaign-panel` | `#4e4f4f` @ 79% | Empower Children panels | — |
| `gradient-start` / `-end` | `#304047` → `#121b22` | page background gradient | — |
| `focus` | `#6f00ff` | keyboard focus ring on the menu button | — |
| `error-bg` | `#ffdede` | contact form error message | — |

**Overlays:** black at 10 / 30 / 42 / 50 / 75 / 76 / 80 / 87% and white at
10 / 20 / 25 / 50 / 75 / 90%. Proposal: `overlay-10 … overlay-90` steps, with
42→**50**, 76→**75** and 87→**90** merged (✱ check on screen).

**Probably never seen:** `#b27575` is set as text colour on `.section` and
`.section-hero-home`, but every text inside sets its own colour. Step 5 will
confirm. The Webflow defaults (`#333`, `#3898ec`, `#ddd`, `#c8c8c8`, `#222`,
`#999`, `#eee`, `#ff0`) are all overridden and get no tokens.

## 5. Text styles by meaning

Sizes for the fluid pages are in `u` (the fluid unit), with px at a 1440 window
in brackets. Tablet/phone columns show only where the live site changes the
size, otherwise the unit does the scaling. LH = line height, LS = letter
spacing.

### 5a. Fluid pages (main + projects)

| Style | Size | Weight | LH | LS / case | Tablet | Phone-l | Phone | From (live classes) |
|---|---|---|---|---|---|---|---|---|
| `display` | 3.5625u (55.5) | 300 | 1.3 | | 3u | | | about-hero, services, work-hero (900) + near-dupes ↓ |
| `display-strong` | 3.64375u (56.7) | 900 | 1 | | | | | project-page title, Act sustainability numbers |
| `h1` | 3.125u (48.6) | 700 | 1 | | | | | project-hero title |
| `statement` | 2.6875u (41.8) | 300 | 1.4 | | 2u | | | Act statement; ✱ home "You in?" 2.625u |
| `h2` | 2.34375u (36.5) | 300 | 1.28 | | | | | large project text, details h2; what-we-believe 2.3u (−0.7px) |
| `h3` | 2.1875u (34.1) | 300 | — | | | | | project partner; ✱ hero client 2.08125u (−1.6px) |
| `h4` | 1.6875u (26.3) | 900 | — | | | | | Act campaign titles (1920: 1.9u) |
| `h5` | 1.5u (23.4) | 300 | — | | | | | team names, services tabs (tablet 1.2u) |
| `body-large` | 1.34375u (20.9) | 300 | 1.33 | −.025em | | | | project paragraph; details p 1.3u (−0.7px) |
| `stat-number` | 2.75u (42.8) | 900 | — | | | | | project numbers |
| `stat-label` | 1.21875u (19.0) | 300 | 1.2 | −.025em | | | | number descriptions |
| `body` | 0.9375u (14.6) | 300 | 1.44 | .00625em | | 1.2u | | 7 classes: split text, CTA text, quote cite, contact |
| `quote` | 0.9375u | 300 | — | .021875em | | | | project quote (= body with a little more spacing; merge? ✱) |
| `testimonial` | 1u | 300 | 1.7em | 0 | | | | testimonial text |
| `caption` | 0.875u (13.6) | 300 | 1.6 | .025em | | | | credits text; contact small text (LH 1.44) |
| `label` | 0.875u | 700 | 1.6 | .03125rem, UPPER | | | | credits titles |
| `eyebrow` | 0.6875u (10.7) | 400 | 1 | .04375em, UPPER | | | | `fl-eyebrow` ×2; ✱ 0.8u (+1.8px) on About/Awards/Services eyebrows |
| `eyebrow-project` | 0.75u (11.7) | 700 | 1 | .075em, UPPER | | | | project hero eyebrow |
| `button` | **11px fixed** | — | — | 3px, UPPER | | | | 6 button classes (button-2, -cta, -ed, -lemukih, hover-link, homepage) |
| `link-label` | 1.2u | — | — | 0, Capitalize | | | | button text links (1920: 1.6u) |
| `link-small` | 0.875u | 400 | — | .1em | | | | "Our Mission" / "Act With Us" links |
| `read-more` | 0.625u | 400 | 1 | UPPER | | | | read more / less |
| `nav` | **4.5rem fixed** | 500 | .9 | | 4.2rem | 3rem | 3.25rem | full-screen menu links (phone bigger than phone-l, as live) |
| `footer-title` | 1.2rem fixed | 500 | 1.2 | | | | | footer column titles |
| `footer-link` | .975rem fixed | 400 | — | | | | | footer links |

**The display group is the biggest near-duplicate set.** Five sizes sit within
3px of each other at 1440:

| Size | px @1440 | Where |
|---|---|---|
| 3.5u | 54.5 | Awards |
| 3.5625u | 55.5 | About hero, Services, Work hero |
| 3.6u | 56.0 | Home hero |
| 3.64375u | 56.7 | Act hero |
| 3.6875u | 57.4 | Who-we-are, Partners |

Proposed winner: **3.5625u**. Their line heights also differ (1.2, 1.3, 1.6em).
That makes a visible difference, so the line heights stay as they are until you
decide.

### 5b. News pages (fixed rem system)

| Style | Size | Weight | LH | LS / case | ≥1920 | Phone-l | Phone | From |
|---|---|---|---|---|---|---|---|---|
| `news-h1` | 4.5rem | 700 | 1 | | 6rem | 3.5rem | 2.8rem | heading-large |
| `news-h2` | 4rem | 300 | 1.2 | | | 3rem (tablet 3.5) | 2.3rem | heading-medium |
| `news-h3` | 2.5rem | 400 | 1.4 | | 3.25rem | 1.9rem | 1.6rem | heading-small |
| `news-h4` | 1.4rem | 400 | 1.4 | | | | 1.2rem | heading-xsmall |
| `news-body-large` | 1.25rem | 300 | 1.5 | | | | | text-size-regular, `li` (400 / 1.6) |
| `news-body` | 1rem | 300 | 1.5 | | | .925rem (tablet) | | text-size-small |
| `news-rich-text` | 1em (14px) | 300 | 1.44 | .00625em | 1.3em | | | post body |
| `news-small` | .875rem | 400 | — | | | | | text-size-tiny |
| `news-eyebrow` | .875rem | 400 | 1 | 2px, UPPER | | | .785rem | subtitle (category, date) |
| `news-button` | .75rem | 500 | — | 2px | | 16px (tablet) | | button |
| `huge-404` | 12rem | — | 1 | | | 10rem | 8rem | 404 title |

## 6. Spacing

**Fluid pages** (multiples of `u`): 51% of all fluid spacing uses just 4 values.

- Scale: `0.5 · 1 · 1.5 · 2 · 3 · 3.5 · 4 · 5 · 7 · 8 · 9 · 15`
- Counts: 1u ×50, 2u ×49, 4u ×21, 3u ×17, 3.5u ×17, 1.5u ×12, 5u ×12, 8u ×12, 7u ×10, 9u ×7, 0.5u ×8, 15u ×4.
- Outliers to fold in (✱ each is a visible shift):

| Outlier | Nearest step |
|---|---|
| 2.9 | 3 |
| 3.75 | 3.5 or 4 |
| 4.625 | 4.5? |
| 5.375 | 5.5 |
| 8.375 | 8.5 |
| 8.5625 | 8.5 |
| 10.9375 | 11 |
| 17.875 | 18 |

These 8 outliers are used 20 times in all.

**News pages** (rem, the class library's named sizes):

| Name | rem |
|---|---|
| tiny | .5 |
| small | 1 |
| medium | 1.25 / 1.5 |
| large | 2 |
| xlarge | 2.5 / 3 |
| xxlarge | 4 |
| huge | 5 / 6 |
| xxhuge | 8 / 10 / 12 |

**Fixed px:** 10px ×61 and 16px ×36 are mostly Webflow's built-in gaps on forms,
menus and sliders. They stay inside those originals (Form, Nav, Gallery) and
don't need tokens. 20 / 25 / 30 / 40 / 50px are the slider gaps and the
contact-page map pins.

**Container widths:** 100em ×5, 69em ×4, 85em ×3, 55 / 70 / 70.375 / 71.125 /
75 / 78.625 em ×2 each, 80rem and 940px (news).

Proposal for the em widths:

| Token | Width | Folds in |
|---|---|---|
| `container-narrow` | 55u | — |
| `container` | 70u | 69 / 70.375 / 71.125 (✱) |
| `container-wide` | 78.625u | 75 (✱) |
| `container-xl` | 85u | — |
| `container-full` | 100u | — |

The news pages keep `80rem` and `940px` as they are.

## 7. Radii, layers, shadows

- **Radius:** `round` = 100px / 100% / 200px (pill buttons, circles, map pins).
  `card` = 20px (×3), plus 3.1em once (the map pin ring) as a one-off.
- **Layers (z-index):** −100 · 0 · 1 · 2 · 5 · 10 · 25 · 90 · 99 · 100 · 1000 ·
  10000 · 99999. Proposal: `below` −100, `base` 1, `raised` 2, `sticky` 10,
  `nav` 100 (90/99 inside), `modal` 1000, `preloader` 10000, `top` 99999 (the
  noise grain).
- **Shadows:** none in the CSS. One in the contact-map pin code.

## 8. Motion

| Token | Value | Where |
|---|---|---|
| `duration-fast` | 200ms | colour, opacity, link hovers (CSS ×9, IX2 ×10) |
| `duration-base` | 300ms | transforms (CSS ×4, IX2 ×18) |
| `duration-medium` | 400ms | buttons, backgrounds (CSS ×7, IX2 ×15) |
| `duration-default` | **500ms** | the Webflow interaction default (IX2 ×373) |
| `duration-slow` | 600 / 700ms | reveals (IX2 ×52) |
| `duration-intro` | 1250–1600ms | page load, preloader, hero text |
| `letter-duration` | 1500ms | `.tricks` letter animation |
| `letter-stagger` | 30ms per letter, starting at 300ms | `.tricks` |
| `ease-standard` | `cubic-bezier(.25,.46,.45,.94)` | CSS hovers = Webflow's outQuad (IX2 ×30) |
| `ease-out-strong` | outQuint / outExpo | reveals, letters (`easeOutExpo`) |
| `ease-in-out` | inOutExpo, inOutQuad | menu, modals |
| `ease-back` | inOutBack, swingTo | bouncy hover arrows (×20) |
| `linear` | — | all scroll-linked motion (×995) |
| `scroll-smoothing` | 50 (×266), 90 (×32) | Webflow scroll smoothing: 50 for parallax, 90 for cursor-follow |
| `marquee-speed` | 6000ms per loop, linear | awards / logo marquee (Swiper) |
| `grain` | 2s, 2 steps, endless | the film-grain noise overlay on every page |
| `pin-pulse` | 1.25s `cubic-bezier(.215,.61,.355,1)` | contact map pins |
| count-up | countUp.js default (2s), starts when in view | Act stats |

`motion` (Framer Motion) can reproduce all of these. Webflow's "smoothing" maps
to a spring or lerp on scroll values.

## 9. Needs a yes before step 3

1. **Near-duplicate rule for phase 1.**
   - My proposal: merge any near-duplicate that's **≤ 1px at a 1440 window, or
     ≤ 2% in colour**, because nobody can see it and the screenshot comparison
     will tolerate it.
   - Keep everything marked ✱ as it is, and list the ✱ merges as phase-2
     candidates.
2. **Two type systems.** Keep both in phase 1 (fluid `u` styles + `news-*`
   styles), and unify them in phase 2?
3. **CLAUDE.md breakpoints.**
   - Update the Breakpoints line to the 7 ranges in §2.
   - Add the fluid unit (`--u`, ×1 / ×2 / ×3) as the way the 42 fluid pages size
     everything.
4. **Fonts.**
   - Copy the 4 used Lato 2 files (300, 400, 700, 900) off Webflow, convert TTF
     → WOFF2 (same letters, about a third of the size) and self-host them.
   - Drop Google Fonts, Montserrat and Thin.
   - This changes nothing you can see, and it's a big speed win (rule 8).
5. **Not checked yet:** whether `#b27575` and the 1280 / 1440 rules show
   anywhere. Step 5's screenshots at 1440 will settle that.
