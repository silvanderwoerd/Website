import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-cta-small (12) and .fl-section-cta-big (8): image + call to action.
export const schema = {
  name: "cta",
  label: "Call to action",
  level: "stripe",
  purpose: "An image beside a heading, a short text and a button: small or big.",
  settings: {
    size: { label: "Size", kind: "choice", options: ["small", "big"] },
  },
  fields: ["heading", "text"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
