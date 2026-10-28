import type { OriginalSchema } from "../types.ts";

// Live: .fl-featured-work-section (Home only: a one-off stripe).
export const schema = {
  name: "featured-work",
  label: "Featured work",
  level: "stripe",
  purpose: "Home's four big project tiles, one under the other.",
  settings: {},
  blocks: { projects: "project-tile" },
} satisfies OriginalSchema;
