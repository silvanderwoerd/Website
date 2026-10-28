import type { OriginalSchema } from "../types.ts";

// Live: .fl-our-partners-section (Home only: a one-off stripe). Logos from the partners collection.
export const schema = {
  name: "partners",
  label: "Partners",
  level: "stripe",
  purpose: "Our partners: a heading with a link on the left, the logo wall on the right.",
  settings: {},
  fields: ["heading"],
  blocks: { link: "arrow-link" },
} satisfies OriginalSchema;
