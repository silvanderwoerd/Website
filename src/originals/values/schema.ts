import type { OriginalSchema } from "../types.ts";

// Live: Act's "Our Values & Ethics": three numbered rows that open on click
// (IX2 "Open Faq 2" / "Close Faq 2").
export const schema = {
  name: "values",
  label: "Values",
  level: "stripe",
  purpose: "What the studio stands for: numbered values, each opening to its explanation.",
  settings: {},
  fields: ["eyebrow", "heading"],
} satisfies OriginalSchema;
