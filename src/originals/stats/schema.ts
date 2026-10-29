import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-numbers (10 project pages): a title and four numbers.
export const schema = {
  name: "stats",
  label: "Stats",
  level: "stripe",
  purpose: "A title and four big numbers with their labels, split by thin lines.",
  settings: {},
  fields: ["title"],
} satisfies OriginalSchema;
