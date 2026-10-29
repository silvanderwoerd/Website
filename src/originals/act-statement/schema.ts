import type { OriginalSchema } from "../types.ts";

// Live: section.fl-section-act-statement (Act, Earth Defender): a photo moving
// −25% → 0 while in view (IX2 "Act Statement Section"), a sentence rising in over it.
export const schema = {
  name: "act-statement",
  label: "Act statement",
  level: "stripe",
  purpose: "One big sentence over a full-width photo that drifts as you scroll.",
  settings: {},
  fields: ["text"],
} satisfies OriginalSchema;
