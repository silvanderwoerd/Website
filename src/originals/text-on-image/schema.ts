import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-no-spacing with .fl-half-bg (13 uses). Two arrangements:
// text then a film (plain or noise panel), or a heading then a gallery (campaign).
export const schema = {
  name: "text-on-image",
  label: "Text on image",
  level: "stripe",
  purpose: "A half-height background image with text and a film, or a heading and a gallery, on top.",
  settings: {
    panel: { label: "Panel", kind: "choice", options: ["plain", "noise", "campaign"] },
  },
  fields: ["heading"],
} satisfies OriginalSchema;
