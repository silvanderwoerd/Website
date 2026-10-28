import type { OriginalSchema } from "../types.ts";

// Live: .navbar (every page): logo, hamburger, full-screen menu (IX2 Open / Close Menu).
export const schema = {
  name: "nav",
  label: "Navigation",
  level: "block",
  purpose: "The fixed top bar: logo in the middle, menu button on the right, and the full-screen menu it opens.",
  settings: {},
} satisfies OriginalSchema;
