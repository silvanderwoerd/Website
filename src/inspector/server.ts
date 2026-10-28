// The Inspector's file work: find an instance in its content file, count where
// an original is used, and write design and content files. Dev only.

import "server-only";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { schemas } from "@/originals/schemas";
import { getDefaults } from "@/originals/resolve";
import type { Device, OriginalSchema, PageContent, SettingDef, Settings, StripeInstance } from "@/originals/types";

const root = process.cwd();
const COLLECTIONS = ["pages", "projects", "dev"];

const readJson = <T,>(file: string): T => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (file: string, data: unknown) => writeFileSync(file, JSON.stringify(data, null, 2) + "\n");

// "pages/about#hero" (a stripe) or "pages/about#hero.button" (a block in it)
// → the content file and the object. Slugs may contain "/", ids never "#" or ".".
export function findInstance(id: string) {
  const [source, rest] = id.split("#");
  const [stripeId, blockKey] = (rest ?? "").split(".");
  const collection = source.split("/")[0];
  if (!COLLECTIONS.includes(collection) || !stripeId) throw new Error(`bad instance id "${id}"`);
  const file = join(root, "content", `${source}.json`);
  if (!existsSync(file)) throw new Error(`no content file for "${id}"`);
  const page = readJson<PageContent>(file);
  const stripe = page.stripes.find((s) => s.id === stripeId);
  if (!stripe) throw new Error(`no stripe "${stripeId}" in ${relative(root, file)}`);
  const original = blockKey ? schemas[stripe.type]?.blocks?.[blockKey] : stripe.type;
  if (!original) throw new Error(`"${id}" is not an original`);
  const target = (blockKey ? stripe.content[blockKey] : stripe) as StripeInstance | Record<string, unknown>;
  if (!target || typeof target !== "object") throw new Error(`no block "${blockKey}" in stripe "${stripeId}"`);
  return { file, page, stripe, blockKey, original, target: target as { overrides?: Settings; overrideReasons?: Record<string, string> } & Record<string, unknown> };
}

// Every content file, and every use of `original` in it (stripes and their blocks).
export function usedOn(original: string) {
  const places: string[] = [];
  for (const collection of COLLECTIONS) {
    const dir = join(root, "content", collection);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      const page = readJson<PageContent>(join(dir, f));
      const source = `${collection}/${f.slice(0, -5)}`;
      for (const s of page.stripes ?? []) {
        if (s.type === original) places.push(`${source}#${s.id}`);
        for (const [key, block] of Object.entries(schemas[s.type]?.blocks ?? {})) {
          if (block === original && s.content[key]) places.push(`${source}#${s.id}.${key}`);
        }
      }
    }
  }
  const pages = new Set(places.map((p) => p.split("#")[0]));
  return { pages: [...pages], instances: places };
}

// The tokens a setting may pick from: only these, never a free value.
export function allowedValues(def: SettingDef): string[] {
  if (def.kind === "choice") return [...(def.options ?? [])];
  if (def.kind === "toggle") return ["true", "false"];
  const tokens = readJson<Record<string, Record<string, unknown>>>(join(root, "design/tokens.json"));
  const names = (group: Record<string, unknown>) => Object.keys(group).filter((k) => !k.startsWith("$"));
  if (def.kind === "colorToken") return names(tokens.color);
  if (def.kind === "spaceStep") return names(tokens.space);
  if (def.kind === "textStyle") return names(readJson(join(root, "design/text-styles.json")));
  return [];
}

function check(schema: OriginalSchema, setting: string, value: string | boolean) {
  const def = schema.settings[setting];
  if (!def) throw new Error(`${schema.name} has no setting "${setting}"`);
  if (!allowedValues(def).includes(String(value))) throw new Error(`"${value}" is not allowed for ${schema.name}.${setting}`);
  return def;
}

const parse = (def: SettingDef, value: string | boolean) => (def.kind === "toggle" ? value === true || value === "true" : String(value));

// Change the original: every instance without an override follows.
export function setDefault(original: string, setting: string, value: string | boolean, device?: Device) {
  const schema = schemas[original];
  const def = check(schema, setting, value);
  const defaults = getDefaults(original);
  if (def.perDevice) {
    const current = typeof defaults[setting] === "object" ? (defaults[setting] as object) : {};
    defaults[setting] = { ...current, [device ?? "desktop"]: parse(def, value) };
  } else defaults[setting] = parse(def, value);
  writeJson(join(root, "design/originals", `${original}.json`), defaults);
}

// Change this instance only: an override, kept next to the instance with its reason.
export function setOverride(id: string, setting: string, value: string | boolean, device?: Device, reason?: string) {
  const { file, page, original, target } = findInstance(id);
  const def = check(schemas[original], setting, value);
  target.overrides ??= {};
  if (def.perDevice) {
    const current = typeof target.overrides[setting] === "object" ? (target.overrides[setting] as object) : {};
    target.overrides[setting] = { ...current, [device ?? "desktop"]: parse(def, value) };
  } else target.overrides[setting] = parse(def, value);
  if (reason) (target.overrideReasons ??= {})[setting] = reason;
  writeJson(file, page);
}

export function resetOverride(id: string, setting: string, device?: Device) {
  const { file, page, original, target } = findInstance(id);
  const def = schemas[original].settings[setting];
  if (!target.overrides || !(setting in target.overrides)) return;
  const current = target.overrides[setting];
  if (def?.perDevice && device && typeof current === "object") {
    delete (current as Record<string, unknown>)[device];
    if (Object.keys(current).length > 0) return writeJson(file, page);
  }
  delete target.overrides[setting];
  if (target.overrideReasons) delete target.overrideReasons[setting];
  if (Object.keys(target.overrides).length === 0) delete target.overrides;
  if (target.overrideReasons && Object.keys(target.overrideReasons).length === 0) delete target.overrideReasons;
  writeJson(file, page);
}

// Edit text in place: saves to the instance's content.
export function setText(id: string, fieldName: string, text: string) {
  const { file, page, original, blockKey, target } = findInstance(id);
  if (!schemas[original].fields?.includes(fieldName)) throw new Error(`${original} has no text field "${fieldName}"`);
  if (blockKey) target[fieldName] = text;
  else (target as StripeInstance).content[fieldName] = text;
  writeJson(file, page);
}
