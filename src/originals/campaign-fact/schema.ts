import type { OriginalSchema } from "../types.ts";

// Live: Earth Defender's black "fact" bands (.fl-earthdefender-fact and
// .fl-earthdefender-fact-small): a large centred sentence, sometimes an eyebrow
// above or a button below.
export const schema = {
  name: "campaign-fact",
  label: "Campaign fact",
  level: "stripe",
  purpose: "One hard fact in large white type on black, optionally with a button to act.",
  settings: {
    size: { label: "Space", kind: "choice", options: ["large", "small"] },
  },
  fields: ["eyebrow", "text"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
