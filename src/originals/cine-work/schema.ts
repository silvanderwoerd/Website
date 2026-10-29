import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-work",
  label: "Cinematic work",
  level: "stripe",
  purpose: "Phase 2 experiment: four films, the first as wide as a cinema screen, each waking into its clip on hover.",
  settings: {},
  fields: ["label", "heading"],
} satisfies OriginalSchema;
