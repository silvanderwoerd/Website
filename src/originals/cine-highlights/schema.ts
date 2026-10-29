import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-highlights",
  label: "Cinematic highlights",
  level: "stripe",
  purpose: "Phase 2 experiment: the chosen campaign's film full screen with its story large over it; pointing at another campaign in the index brings its film in.",
  settings: {},
  fields: ["label", "heading"],
} satisfies OriginalSchema;
