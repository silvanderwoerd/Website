import type { OriginalSchema } from "../types.ts";

// Live: project film bands: large (.fl-project-video-container, 45 uses),
// medium (.fl-project-video-medium-container, 13), split (.fl-split-medium-container, 9).
export const schema = {
  name: "film",
  label: "Film",
  level: "stripe",
  purpose: "A YouTube or Vimeo film with its poster and play circle, at one of three widths.",
  settings: {
    size: { label: "Size", kind: "choice", options: ["large", "medium", "split"] },
    visibility: { label: "Shown on", kind: "choice", options: ["always", "phone"] },
    phoneBox: { label: "On phones", kind: "choice", options: ["block", "inline"] },
  },
} satisfies OriginalSchema;
