import type { OriginalSchema } from "../types.ts";

// Live: .fl-who-we-are-section (Home). About's "what we believe" and Earth
// Defender's facts join in step 6, adding the size / background settings they vary.
export const schema = {
  name: "statement",
  label: "Statement",
  level: "stripe",
  purpose: "A big sentence that rises in word by word, a smaller line under it, links, and an optional stamp.",
  settings: {},
  fields: ["text", "sub"],
  blocks: { links: "arrow-link" },
} satisfies OriginalSchema;
