import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-partners",
  label: "Cinematic partners",
  level: "stripe",
  purpose: "Phase 2 experiment: the partners' logos, loose, drifting in and out of focus one after another; pointing at one brings it sharp.",
  settings: {},
  fields: ["label", "heading", "link"],
} satisfies OriginalSchema;
