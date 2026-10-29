import type { OriginalSchema } from "../types.ts";

// Live: the Post template's last section ("More News"): the newest posts but
// the one shown, with a heading, a line and an "All posts" button.
export const schema = {
  name: "related-posts",
  label: "More news",
  level: "stripe",
  purpose: "The newest posts (not the one you're reading) under a heading, with a button to all posts.",
  settings: {},
  fields: ["heading", "text"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
