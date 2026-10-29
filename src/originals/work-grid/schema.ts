import type { OriginalSchema } from "../types.ts";

// Live: /work's section > .fl-100--container > .fl-work-layout (31 tiles).
export const schema = {
  name: "work-grid",
  label: "Work grid",
  level: "stripe",
  purpose: "Every project as a tile, two to a row (one on phones).",
  settings: {},
  blocks: { tiles: "work-tile" },
} satisfies OriginalSchema;
