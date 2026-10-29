import type { OriginalSchema } from "../types.ts";

// Live: About's "what we stand for" (section.black-bg > .fl-about-what-we-believe-split
// + .fl-about-what-we-believe-video with the showreel).
export const schema = {
  name: "about-statement",
  label: "Mission statement",
  level: "stripe",
  purpose: "What the studio stands for: a large sentence, a paragraph, a link, and the showreel below.",
  settings: {},
  fields: ["eyebrow", "text", "body"],
  blocks: { link: "arrow-link" },
} satisfies OriginalSchema;
