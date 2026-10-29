import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-statement",
  label: "Cinematic statement",
  level: "stripe",
  purpose: "Phase 2 experiment: one sentence rising in word by word, with a quieter line below.",
  settings: {},
  fields: ["label", "text", "sub"],
} satisfies OriginalSchema;
