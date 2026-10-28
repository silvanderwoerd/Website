import type { OriginalSchema } from "../types.ts";

// Live: .page-background (every fluid page) with the film-grain overlay and
// the gradient that fades in while a stripe with pageTone "gradient" is in view.
export const schema = {
  name: "page-background",
  label: "Page background",
  level: "block",
  purpose: "The fixed black page behind everything: film grain, and the blue-grey gradient some stripes call up.",
  settings: {},
} satisfies OriginalSchema;
