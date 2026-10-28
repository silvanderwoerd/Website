import type { OriginalSchema } from "../types.ts";

// Live: header.section-hero-home (Home). About's hero and the 30 project heroes
// join this original in steps 6+, each adding only the settings they vary.
export const schema = {
  name: "hero",
  label: "Hero",
  level: "stripe",
  purpose: "The full-screen opening band: background video, title, button and socials.",
  settings: {},
  fields: ["title"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
