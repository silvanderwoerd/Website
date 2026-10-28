// Marks and setting attributes: how a rendered element says what it is made of.
// Pure functions, used by server and client alike.

import type { OriginalSchema, Settings, SettingValue } from "./types";

type Marks = Record<`data-${string}`, string>;

// data-original / data-instance on an original's root element (CLAUDE.md "marks").
export function marks(original: string, instance: string): Marks {
  return { "data-original": original, "data-instance": instance };
}

// data-field on text that can be edited in place.
export function field(name: string): Marks {
  return { "data-field": name };
}

const TOKEN_VAR: Record<string, (v: string) => string> = {
  colorToken: (v) => `var(--color-${v})`,
  spaceStep: (v) => `var(--space-${v})`,
};

// Settings → data-s-* attributes (choices, toggles) and --s-* variables (tokens).
// Per-device values get -tablet / -phone suffixes; originals' CSS reads them.
export function settingAttrs(schema: OriginalSchema, settings: Settings) {
  const attrs: Record<string, string> = {};
  const style: Record<string, string> = {};
  for (const [name, def] of Object.entries(schema.settings)) {
    const value = settings[name];
    const perDevice = def.perDevice && typeof value === "object" ? value : { desktop: value as SettingValue };
    for (const [device, v] of Object.entries(perDevice)) {
      if (v === undefined) continue;
      const suffix = device === "desktop" ? "" : `-${device}`;
      if (def.kind === "colorToken" || def.kind === "spaceStep") style[`--s-${name}${suffix}`] = TOKEN_VAR[def.kind](String(v));
      else if (def.kind !== "textStyle") attrs[`data-s-${name}${suffix}`] = String(v);
    }
  }
  return { attrs, style };
}

// Text styles are applied as classes: .ts-<name> (src/design/tokens.css).
export function textStyle(name: SettingValue | undefined) {
  return typeof name === "string" ? `ts-${name}` : "";
}
