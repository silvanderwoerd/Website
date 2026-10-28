import type { OriginalSchema } from "../types.ts";

// Live: Home's "Latest News" (header.section with blog-header-component.blog-three).
// Posts come from the content layer (newest first), not from the page.
export const schema = {
  name: "latest-news",
  label: "Latest news",
  level: "stripe",
  purpose: "The newest post large on the left, the next four in a grid on the right.",
  settings: {},
  fields: ["eyebrow"],
} satisfies OriginalSchema;
