import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-home-contact (/, /work, /about, /act, /contact).
export const schema = {
  name: "closing-cta",
  label: "Closing call to action",
  level: "stripe",
  purpose: "\"We're here to tell stories that change the world. You in?\" with the Work With Us button.",
  settings: {},
  fields: ["heading"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
