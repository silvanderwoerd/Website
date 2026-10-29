import type { OriginalSchema } from "../types.ts";

// Live: Change Drivers' episode rows (Webflow .columns.w-row, 11 uses on one page).
export const schema = {
  name: "episode",
  label: "Episode",
  level: "stripe",
  purpose: "One episode: a name and short text on the left, its film on the right.",
  settings: {},
  fields: ["heading"],
} satisfies OriginalSchema;
