import type { OriginalSchema } from "../types.ts";

// Live: .fl-section-project-details (30 project pages): about text, short
// credits, and two modals (full credits, media features).
export const schema = {
  name: "project-details",
  label: "Project details",
  level: "stripe",
  purpose: "About the project: the story on the left, key credits on the right, full credits and press in pop-ups.",
  settings: {},
  fields: ["eyebrow"],
} satisfies OriginalSchema;
