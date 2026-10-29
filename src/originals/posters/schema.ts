import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-keyvisuals / -poster-haze / -poster-haze2 / -moneytrees-poster
// (15 uses). Each project laid its posters out by hand; the layouts become one setting.
export const schema = {
  name: "posters",
  label: "Posters",
  level: "stripe",
  purpose: "Campaign posters, key visuals or two films side by side, in one of the live layouts.",
  settings: {
    layout: {
      label: "Layout",
      kind: "choice",
      options: ["poster", "poster-still", "poster-still-double", "exhibition", "rud-poster", "rud-stills", "films", "films-tight"],
    },
    // tight: no space on phones, none below from 1920 up (live .fl-section-moneytrees-poster)
    spacing: { label: "Spacing", kind: "choice", options: ["default", "tight"] },
  },
} satisfies OriginalSchema;
