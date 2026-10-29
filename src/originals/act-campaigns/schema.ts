import type { OriginalSchema } from "../types.ts";

// Live: Act's "Act With Us" section: six campaign cards (.fl-active-project-link-wrapper).
// Each card's "Click to Act" line is the card's own arrow-link block (as a div:
// the whole card is the link).
export const schema = {
  name: "act-campaigns",
  label: "Act campaigns",
  level: "stripe",
  purpose: "The campaigns you can act on now: a card each with its photo, logo, a line about it and where to act.",
  settings: {},
  fields: ["eyebrow", "heading"],
  blocks: { cards: "arrow-link" },
} satisfies OriginalSchema;
