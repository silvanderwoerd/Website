import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-next-project (every project page): "View More Work" to /work.
export const schema = {
  name: "more-work",
  label: "More work",
  level: "stripe",
  purpose: "The View More Work button at the end of a project.",
  settings: {},
  blocks: { button: "button" },
} satisfies OriginalSchema;
