import type { OriginalSchema } from "../types.ts";

// Live: About's section.fl-life-text (the heading) and .section-life-with (photos
// in three columns, each rising in as it scrolls into view).
export const schema = {
  name: "life-with",
  label: "Life with",
  level: "stripe",
  purpose: "A heading over a wall of photos from the studio's life, each rising in as you scroll.",
  settings: {},
  fields: ["heading"],
} satisfies OriginalSchema;
