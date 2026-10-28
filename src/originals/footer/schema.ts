import type { OriginalSchema } from "../types.ts";

// Live: footer (245 pages): logo, socials, Tree-Nation counter, link columns,
// EmailOctopus newsletter, © line.
export const schema = {
  name: "footer",
  label: "Footer",
  level: "block",
  purpose: "The site footer: logo and socials, the link columns, the newsletter sign-up and the © line.",
  settings: {},
} satisfies OriginalSchema;
