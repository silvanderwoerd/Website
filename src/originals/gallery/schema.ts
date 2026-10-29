import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-gallery (78 uses). Each project sized its images with its
// own Webflow class; they become one setting (see docs/components.md).
export const schema = {
  name: "gallery",
  label: "Gallery",
  level: "stripe",
  purpose: "A row of stills you can drag or step through, sliding sideways as you scroll past.",
  settings: {
    image: { label: "Image size", kind: "choice", options: ["campaign", "stills", "bts", "wide", "visuals", "media", "drifters", "story"] },
    align: { label: "Slides", kind: "choice", options: ["top", "center"] },
  },
  fields: ["heading"],
} satisfies OriginalSchema;
