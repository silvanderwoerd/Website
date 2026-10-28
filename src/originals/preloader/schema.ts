import type { OriginalSchema } from "../types.ts";

// Live: .preloader with IX2 "Page Starts / Finishes Loading" (every page).
export const schema = {
  name: "preloader",
  label: "Preloader",
  level: "block",
  purpose: "Covers the page while it loads: the logo fills up, then two panels slide away.",
  settings: {},
} satisfies OriginalSchema;
