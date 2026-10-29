import type { OriginalSchema } from "../types.ts";

// Phase 2 experiment (/landing-alt, decision #32): not on the live site.
export const schema = {
  name: "cine-impact",
  label: "Cinematic impact",
  level: "stripe",
  purpose: "Phase 2 experiment: numbers that count up and two stories of what the films changed.",
  settings: {},
  fields: ["label", "heading"],
} satisfies OriginalSchema;
