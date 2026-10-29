import type { OriginalSchema } from "../types.ts";

// Live: .fl-campaign-section (13 project pages).
export const schema = {
  name: "campaign",
  label: "Campaign",
  level: "stripe",
  purpose: "The campaign: a bold heading, a paragraph, and its media features in a pop-up.",
  settings: {},
  fields: ["heading", "text"],
  blocks: { link: "arrow-link" },
} satisfies OriginalSchema;
