// Settings guards (CLAUDE.md "Guards for it"):
// - every original has a schema, defaults for every setting, and is registered;
// - dead settings: every option a schema offers must change the page, i.e. the
//   original's CSS (or code, for text styles) reads it;
// - every override in a content file is a real setting with an allowed value;
// - lists exceptions with no reason recorded (a warning, not a failure).
// Schemas are TypeScript; Node 24 runs them directly (type stripping).

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const json = (f) => JSON.parse(readFileSync(f, "utf8"));
const names = (o) => Object.keys(o).filter((k) => !k.startsWith("$"));
const tokens = json(join(root, "design/tokens.json"));
const textStyles = json(join(root, "design/text-styles.json"));

const allowed = (def) =>
  def.kind === "choice" ? def.options
  : def.kind === "toggle" ? ["true", "false"]
  : def.kind === "colorToken" ? names(tokens.color)
  : def.kind === "spaceStep" ? names(tokens.space)
  : def.kind === "textStyle" ? names(textStyles)
  : [];

const errors = [];
const warnings = [];
const dir = join(root, "src/originals");
const schemas = {};

for (const name of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const folder = join(dir, name);
  const schemaFile = join(folder, "schema.ts");
  if (!existsSync(schemaFile)) { errors.push(`${name}: no schema.ts`); continue; }
  const { schema } = await import(pathToFileURL(schemaFile).href);
  schemas[schema.name] = schema;
  if (schema.name !== name) errors.push(`${name}: schema name "${schema.name}" doesn't match its folder`);

  const defaultsFile = join(root, "design/originals", `${schema.name}.json`);
  const defaults = existsSync(defaultsFile) ? json(defaultsFile) : null;
  if (!defaults) errors.push(`${schema.name}: no design/originals/${schema.name}.json`);

  const files = readdirSync(folder);
  const css = files.filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(folder, f), "utf8")).join("\n");
  const code = files.filter((f) => f.endsWith(".tsx")).map((f) => readFileSync(join(folder, f), "utf8")).join("\n");

  for (const [setting, def] of Object.entries(schema.settings)) {
    const ok = allowed(def);
    // Defaults present and allowed.
    const d = defaults?.[setting];
    if (defaults && d === undefined) errors.push(`${schema.name}.${setting}: no default`);
    else if (defaults) {
      const values = def.perDevice && typeof d === "object" ? Object.values(d) : [d];
      if (def.perDevice && typeof d === "object" && d.desktop === undefined) errors.push(`${schema.name}.${setting}: per-device default needs a desktop value`);
      for (const v of values) if (!ok.includes(String(v))) errors.push(`${schema.name}.${setting}: default "${v}" is not allowed`);
    }
    // Dead settings: does anything read this setting?
    if (def.kind === "choice" || def.kind === "toggle") {
      for (const opt of ok) {
        if (!css.includes(`data-s-${setting}="${opt}"`)) errors.push(`${schema.name}.${setting}: option "${opt}" changes nothing (no [data-s-${setting}="${opt}"] in its CSS)`);
      }
    } else if (def.kind === "colorToken" || def.kind === "spaceStep") {
      if (!css.includes(`var(--s-${setting}`)) errors.push(`${schema.name}.${setting}: changes nothing (its CSS never reads var(--s-${setting}))`);
      if (def.perDevice && !(css.includes(`--s-${setting}-tablet`) && css.includes(`--s-${setting}-phone`))) errors.push(`${schema.name}.${setting}: per-device, but its CSS doesn't read the tablet/phone values`);
    } else if (def.kind === "textStyle") {
      if (!code.includes(`settings.${setting}`)) errors.push(`${schema.name}.${setting}: changes nothing (its component never reads settings.${setting})`);
    }
  }
  for (const key of names(defaults ?? {})) if (!schema.settings[key]) errors.push(`${schema.name}: default "${key}" is not a setting`);
}

// Registered: every original in schemas.ts, every stripe original in the registry.
const schemasTs = readFileSync(join(dir, "schemas.ts"), "utf8");
const registryTs = readFileSync(join(root, "src/stripes/registry.ts"), "utf8");
for (const s of Object.values(schemas)) {
  if (!schemasTs.includes(`/${s.name}/schema"`)) errors.push(`${s.name}: not listed in src/originals/schemas.ts`);
  if (s.level === "stripe" && !new RegExp(`(^|[\\s{,])"?${s.name}"?\\s*:`, "m").test(registryTs)) errors.push(`${s.name}: stripe not in src/stripes/registry.ts`);
}

// Overrides in content files.
function checkOverrides(where, original, inst) {
  const schema = schemas[original];
  if (!schema) return errors.push(`${where}: unknown original "${original}"`);
  for (const [setting, value] of Object.entries(inst.overrides ?? {})) {
    const def = schema.settings[setting];
    if (!def) { errors.push(`${where}: override "${setting}" is not a setting of ${original}`); continue; }
    const values = def.perDevice && typeof value === "object" ? Object.values(value) : [value];
    for (const v of values) if (!allowed(def).includes(String(v))) errors.push(`${where}: override ${setting}="${v}" is not allowed`);
    if (!inst.overrideReasons?.[setting]) warnings.push(`${where}: exception "${setting}" has no reason recorded`);
  }
}
for (const collection of ["pages", "projects", "dev"]) {
  const cdir = join(root, "content", collection);
  if (!existsSync(cdir)) continue;
  for (const f of readdirSync(cdir).filter((f) => f.endsWith(".json"))) {
    const page = json(join(cdir, f));
    for (const s of page.stripes ?? []) {
      const where = `content/${collection}/${f}#${s.id}`;
      checkOverrides(where, s.type, s);
      for (const [key, block] of Object.entries(schemas[s.type]?.blocks ?? {})) {
        if (s.content?.[key]) checkOverrides(`${where}.${key}`, block, s.content[key]);
      }
    }
  }
}

if (warnings.length) console.warn(`check-settings: ${warnings.length} exception(s) without a reason:\n  ${warnings.join("\n  ")}`);
if (errors.length) {
  console.error(`check-settings: ${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-settings: ok (${Object.keys(schemas).length} originals)`);
