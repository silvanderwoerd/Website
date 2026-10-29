import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-hero",
  label: "Cinematic hero",
  level: "stripe",
  purpose: "Phase 2 experiment: the showreel full-bleed behind opening letterbox bars, the promise rising in, a showreel button.",
  settings: {},
  fields: ["label", "title", "text"],
} satisfies OriginalSchema;
