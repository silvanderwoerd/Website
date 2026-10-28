import type { OriginalSchema } from "../types.ts";

// Live: button-2.white-outline (37 pages), button-2-cta (5), button.is-secondary
// (news, 209), button-ed (Earth Defender), button-2-lemukih (Empower Children).
export const schema = {
  name: "button",
  label: "Button",
  level: "block",
  purpose: "A link styled as a button: pill outline on most pages, flat on news pages.",
  settings: {
    variant: {
      label: "Variant",
      kind: "choice",
      options: ["outline", "cta", "news", "earth-defender", "empower-children"],
    },
  },
  fields: ["label"],
} satisfies OriginalSchema;
