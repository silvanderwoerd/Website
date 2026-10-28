import type { OriginalSchema } from "../types.ts";

// Dev only: proves the Inspector (step 4). One setting of each kind.
export const schema = {
  name: "test-stripe",
  label: "Test stripe",
  level: "stripe",
  purpose: "Proves the Inspector: original vs instance, per-device settings, text editing.",
  devOnly: true,
  settings: {
    background: { label: "Background", kind: "colorToken" },
    spacing: { label: "Spacing", kind: "spaceStep", perDevice: true },
    align: { label: "Alignment", kind: "choice", options: ["center", "left"] },
    titleStyle: { label: "Title style", kind: "textStyle" },
  },
  fields: ["eyebrow", "title", "text"],
  blocks: { button: "button" },
} satisfies OriginalSchema;
