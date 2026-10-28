import type { OriginalSchema } from "../types.ts";

// Live: .fl-testimonials-section (Home only: a one-off stripe). Quotes from the testimonials collection.
export const schema = {
  name: "testimonials",
  label: "Testimonials",
  level: "stripe",
  purpose: "Client quotes in a sliding row of cards, each with read more / read less.",
  settings: {},
  fields: ["eyebrow", "heading"],
} satisfies OriginalSchema;
