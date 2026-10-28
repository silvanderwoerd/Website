import type { OriginalSchema } from "../types.ts";

// Live: .fl-button-link-act (36 pages), with cc-partners (6 pages: more space above).
export const schema = {
  name: "arrow-link",
  label: "Arrow link",
  level: "block",
  purpose: "A small text link with an arrow and a line under it that fills on hover.",
  settings: {
    variant: { label: "Variant", kind: "choice", options: ["default", "partners"] },
  },
  fields: ["label"],
} satisfies OriginalSchema;
