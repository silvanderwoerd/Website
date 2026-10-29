import type { OriginalSchema } from "../types.ts";

// Live: .fl-split-small-section (85 uses): a heading on the left, rich text on the right.
export const schema = {
  name: "text",
  label: "Text",
  level: "stripe",
  purpose: "A heading that rises in word by word, with a short text beside it and an optional link.",
  settings: {},
  fields: ["heading"],
  blocks: { link: "arrow-link" },
} satisfies OriginalSchema;
