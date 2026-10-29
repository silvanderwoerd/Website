import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-testimonials",
  label: "Cinematic testimonials",
  level: "stripe",
  purpose: "Phase 2 experiment: the partners' words quietly: one signed line from each quote between hairlines; pointing at one brings it forward.",
  settings: {},
  fields: ["label", "heading"],
} satisfies OriginalSchema;
