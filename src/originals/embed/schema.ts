import type { OriginalSchema } from "../types.ts";

// Live: Team Forest's embedded sign-up site (teamforest.panda.org).
export const schema = {
  name: "embed",
  label: "Embedded site",
  level: "stripe",
  purpose: "Another website shown inside the page (the Team Forest sign-up), scrolling with the page.",
  settings: {},
} satisfies OriginalSchema;
