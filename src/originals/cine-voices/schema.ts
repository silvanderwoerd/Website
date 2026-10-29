import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-voices",
  label: "Cinematic voices",
  level: "stripe",
  purpose: "Phase 2 experiment: a partner's words, large, over a drifting row of partner logos.",
  settings: {},
  fields: ["label", "quote", "name", "role"],
} satisfies OriginalSchema;
