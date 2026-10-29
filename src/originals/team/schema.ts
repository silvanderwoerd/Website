import type { OriginalSchema } from "../types.ts";

// Live: About's "Our Collective" section: the core team, then the wider
// collective, from content/collections/team.json (later from Elio).
export const schema = {
  name: "team",
  label: "Team",
  level: "stripe",
  purpose: "The people: the core team and the wider collective, a photo each with name and role.",
  settings: {},
  fields: ["heading", "coreLabel", "collectiveLabel"],
} satisfies OriginalSchema;
