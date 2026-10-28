# Migration notes — studiobirthplace.com

Rebuilt on 28 Oct 2026 from Sil's handoff note (28 Oct 2026), because Sil's own
Website folder (with the original MIGRATION-NOTES.md and the 3 Oct page copy)
was not on this computer. If Sil's version turns up, theirs wins; merge anything
below that it lacks.

## What we know about the current site (from Sil's handoff)

| | |
|---|---|
| Built on | Webflow. Domain at one.com, email on Google: moving the site doesn't touch email. |
| Size | 253 addresses, about 12–15 layouts. 2 addresses are broken today (`/work/flags`, `/work/sleepless`). |
| Content | 202 news posts, 34 projects, 6 categories. |
| Fonts | Lato and Montserrat (Google Fonts). |
| Motion | Webflow interactions on most pages: these become the AnimatedText, Stat and reveal originals. |
| Background videos | MP4 + WebM files on Webflow's own servers (highlight reel, Team Forest, Oilympics, Earth Defender, Wear Wool Not Waste). |
| Films | On Vimeo and YouTube, so nothing to move. |
| Services | Contact form (Webflow), newsletter (EmailOctopus), Tree-Nation widget, Google Analytics. |

**Copy the media first.** The images and background videos live on Webflow's
servers and disappear when the Webflow plan ends.

## The plan (from the handoff's first message)

1. Find the framework → `docs/inventory.md`
2. Find the look → proposal for `src/design/tokens.css` and text styles
3. Propose the system (originals, settings, content-file shapes, content layer)
4. Base, Inspector and guards before any page
5. Build Home, match the live site at 390 / 820 / 1440
6. Templates one at a time (Project, News + Post + Category, the rest)
7. Media copy, forms, newsletter, Tree-Nation, SEO, sitemap, redirects

Stop after each step for Jorik's (and Sil's) yes. Don't design anything new, add
features, or connect or sign up for any service without asking.

## Notes added during the migration

- The live `/news` page shows only 100 posts (Webflow's per-list limit); the full
  202 come from the sitemap and the category pages.
- Tools on Jorik's computer (28 Oct): Node.js 24.22 LTS, npm 11.19, Git 2.56
  (installed with winget). Playwright's Chromium is installed for `npm run looks`.
- Step 4 (28 Oct): Next.js 16.4, React 19.3, Tailwind 4.3, motion 14.7,
  TypeScript pinned to 5.9 (Next's build tooling expects 5's API).
