import type { OriginalSchema } from "../types.ts";

// Live: Contact's .contact-parallax-wrapper: the mountains behind a darkening
// overlay (IX2 "Contact BG Parallax"), the world map with four pulsing city pins
// (IX2 "Map Pin Hover", desktop), then the contact details and the form.
export const schema = {
  name: "contact-hero",
  label: "Contact",
  level: "stripe",
  purpose: "Where the studio is and how to reach it: a map with its cities, every e-mail address, and a short form.",
  settings: {},
  fields: ["eyebrow", "heading", "formEyebrow", "title", "text", "quickContact"],
} satisfies OriginalSchema;
