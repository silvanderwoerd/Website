import type { OriginalSchema } from "../types.ts";

// Live: .fl-quote-section (29 uses).
export const schema = {
  name: "quote",
  label: "Quote",
  level: "stripe",
  purpose: "A quote in italics with a thin bar beside it and who said it.",
  settings: {},
  fields: ["quote", "cite"],
} satisfies OriginalSchema;
