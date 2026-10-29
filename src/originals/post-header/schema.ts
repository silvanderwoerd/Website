import type { OriginalSchema } from "../types.ts";

// Live: the Post template's header.section (title, category, date, main image).
// Everything comes from the post; the template passes which one.
export const schema = {
  name: "post-header",
  label: "Post header",
  level: "stripe",
  purpose: "A post's title, its category and date, and its main image.",
  settings: {},
} satisfies OriginalSchema;
