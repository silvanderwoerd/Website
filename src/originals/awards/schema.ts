import type { OriginalSchema } from "../types.ts";

// Live: About's section.fl-awards-section: background photo (IX2 "Awards
// Parallax"), the text on the right, the full list in a pop-up, and an endless
// column of award logos (desktop only).
export const schema = {
  name: "awards",
  label: "Awards",
  level: "stripe",
  purpose: "The studio's recognition: a heading and short text, every award in a pop-up, and a moving column of award logos.",
  settings: {},
  fields: ["eyebrow", "heading", "text"],
  blocks: { link: "arrow-link" },
} satisfies OriginalSchema;
