import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-news",
  label: "Cinematic news",
  level: "stripe",
  purpose: "Phase 2 experiment: the newest posts as a list of headlines.",
  settings: {},
  fields: ["label"],
} satisfies OriginalSchema;
