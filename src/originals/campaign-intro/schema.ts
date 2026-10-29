import type { OriginalSchema } from "../types.ts";

// Live: Empower Children's section.section-3: a photo band with the campaign's
// name beside a grey box (heading, text, donate button).
export const schema = {
  name: "campaign-intro",
  label: "Campaign intro",
  level: "stripe",
  purpose: "A campaign page's opening: its name over a photo, beside a box asking you to act.",
  settings: {},
  fields: ["heading", "boxHeading", "text"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
