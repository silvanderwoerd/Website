import type { OriginalSchema } from "../types.ts";

// Live: Act's "Planet Positive" section: three counting numbers, each with a
// "Read more" that opens its story.
export const schema = {
  name: "sustainability",
  label: "Sustainability",
  level: "stripe",
  purpose: "How the studio cleans up after itself: three numbers that count up, each with its story behind a Read more.",
  settings: {},
  fields: ["eyebrow", "heading", "text"],
} satisfies OriginalSchema;
