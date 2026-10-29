import type { OriginalSchema } from "../types.ts";

// Live: /work's opening section (h1.fl-work-hero-heading between 8em and 4.5em spacers).
export const schema = {
  name: "page-heading",
  label: "Page heading",
  level: "stripe",
  purpose: "A page's big centred title, rising in word by word after the page loads.",
  settings: {},
  fields: ["heading"],
} satisfies OriginalSchema;
