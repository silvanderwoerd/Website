import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-cta",
  label: "Cinematic closing",
  level: "stripe",
  purpose: "Phase 2 experiment: one closing line and a way in.",
  settings: {},
  fields: ["heading"],
} satisfies OriginalSchema;
