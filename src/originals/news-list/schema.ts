import type { OriginalSchema } from "../types.ts";

// Live: /news (section > .latest-posts-wrapper: sticky category sidebar + cards)
// and the 6 /blog-categories/* pages (category name, a row of category buttons, cards).
// Posts come from the content layer, newest first, every one (decisions #1).
export const schema = {
  name: "news-list",
  label: "News list",
  level: "stripe",
  purpose: "Every post as a card, with the categories beside them (News) or above them (a category page).",
  settings: {
    layout: { label: "Layout", kind: "choice", options: ["sidebar", "category"] },
  },
  fields: ["eyebrow", "heading"],
  blocks: { categoryButton: "button" },
} satisfies OriginalSchema;
