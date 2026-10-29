import type { OriginalSchema } from "../types.ts";

// Live: header.section-hero-home (Home: video, button, socials) and
// .fl-project-hero (31 /work pages: still image, client, title, parallax).
export const schema = {
  name: "hero",
  label: "Hero",
  level: "stripe",
  purpose: "The full-screen opening band: Home's video with its showreel button, or a project's still with client and title.",
  settings: {
    variant: { label: "Variant", kind: "choice", options: ["project", "home"] },
  },
  fields: ["title", "client", "eyebrow"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
