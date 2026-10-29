import type { OriginalSchema } from "../types.ts";

// Live: About's section.services-section: three Webflow tabs, each with its own
// background photo (IX2 "Services Tab 1-3").
export const schema = {
  name: "services",
  label: "Services",
  level: "stripe",
  purpose: "What the studio does, in three tabs: each tab its own text and background photo.",
  settings: {},
  fields: ["eyebrow", "heading"],
  blocks: { link: "arrow-link" },
} satisfies OriginalSchema;
