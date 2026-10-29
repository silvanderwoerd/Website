import type { OriginalSchema } from "../types.ts";

// Live: /work's .fl-work-wrapper: the still over the clip; on hover the still
// fades away (200ms). From tablet down the clip and its titles always show.
export const schema = {
  name: "work-tile",
  label: "Work tile",
  level: "block",
  purpose: "A project in the Work grid: its still, and on hover its clip with client and title.",
  settings: {},
  fields: ["client", "title"],
} satisfies OriginalSchema;
