// Settings = the original's defaults (design/originals/<name>.json) with the
// instance's overrides on top. Server only: reads the design files on every
// render, so an Inspector save shows on the next refresh.

import "server-only";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { schemas } from "./schemas";
import { settingAttrs } from "./marks";
import type { Overridable, Settings } from "./types";

export function getDefaults(original: string): Settings {
  const file = join(process.cwd(), "design/originals", `${original}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
}

export function resolveSettings(original: string, overrides: Settings = {}): Settings {
  const schema = schemas[original];
  const defaults = getDefaults(original);
  const out: Settings = { ...defaults };
  for (const [name, value] of Object.entries(overrides)) {
    const def = schema?.settings[name];
    const base = defaults[name];
    out[name] = def?.perDevice && typeof base === "object" && typeof value === "object" ? { ...base, ...value } : value;
  }
  return out;
}

// Everything an original's root element needs: settings, attributes, style.
export function resolveOriginal(original: string, instance: Overridable) {
  const schema = schemas[original];
  if (!schema) throw new Error(`unknown original "${original}"`);
  const settings = resolveSettings(original, instance.overrides);
  const { attrs, style } = settingAttrs(schema, settings);
  return { settings, attrs, style };
}
