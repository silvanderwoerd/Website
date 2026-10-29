import type { OriginalSchema } from "../types.ts";

// Live: the Post template's article.section: the post's rich text (.fl-blog-rich-text.w-richtext).
export const schema = {
  name: "post-body",
  label: "Post body",
  level: "stripe",
  purpose: "The post itself: its text, pictures and films.",
  settings: {},
} satisfies OriginalSchema;
