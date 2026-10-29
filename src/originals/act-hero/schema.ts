import type { OriginalSchema } from "../types.ts";

// Live: Act's section.fl-act-hero-section: a sticky wall of four photo columns
// that drift against each other (IX2 "Act Hero"), under the title.
export const schema = {
  name: "act-hero",
  label: "Act hero",
  level: "stripe",
  purpose: "Act's opening: a wall of project stills drifting as you scroll, under the question that guides every project.",
  settings: {},
  fields: ["eyebrow", "heading"],
} satisfies OriginalSchema;
