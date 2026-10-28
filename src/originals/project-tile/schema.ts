import type { OriginalSchema } from "../types.ts";

// Live: .project-link (Home featured work; the Work grid's tiles join in step 6).
export const schema = {
  name: "project-tile",
  label: "Project tile",
  level: "block",
  purpose: "A project as a tall card: poster that sharpens into view, its clip playing, client and title, a play circle on hover.",
  settings: {},
  fields: ["client", "title"],
} satisfies OriginalSchema;
