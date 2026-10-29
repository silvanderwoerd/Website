import type { OriginalSchema } from "../types.ts";

// Live: Earth Defender's section.section-4: the partners' logos in one row
// (.container-11, six columns; three on phones).
export const schema = {
  name: "logo-row",
  label: "Logo row",
  level: "stripe",
  purpose: "A row of partner logos, each linking to its partner.",
  settings: {},
} satisfies OriginalSchema;
