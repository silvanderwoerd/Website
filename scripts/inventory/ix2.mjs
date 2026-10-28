// Extracts Webflow's interactions (IX2) from the saved Webflow script into
// reference/live-site/_ix2.json, and prints the animations whose title matches
// an argument: what moves, from what to what, how long, with which easing.
//   node scripts/inventory/ix2.mjs "Page Starts Loading" "Hero"
// The data is a plain object literal from our own saved site file.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const assets = join(root, "reference/live-site/_assets");
const file = readdirSync(assets).map((f) => join(assets, f)).find((f) => f.endsWith(".js") && readFileSync(f, "utf8").includes('ix2").init('));
const js = readFileSync(file, "utf8");
const start = js.indexOf('ix2").init(') + 'ix2").init('.length;

// Find the matching closing brace of the init argument (strings respected).
let depth = 0, i = start, inStr = null;
for (; i < js.length; i++) {
  const c = js[i];
  if (inStr) { if (c === "\\") i++; else if (c === inStr) inStr = null; continue; }
  if (c === '"' || c === "'") inStr = c;
  else if (c === "{") depth++;
  else if (c === "}" && --depth === 0) break;
}
const data = new Function(`return (${js.slice(start, i + 1)})`)();
writeFileSync(join(root, "reference/live-site/_ix2.json"), JSON.stringify(data, null, 1));

const fmt = (it) => {
  const c = it.config ?? {};
  const target = c.target?.selector ?? c.target?.id ?? (c.target?.useEventTarget ? `self(${c.target.useEventTarget})` : JSON.stringify(c.target ?? ""));
  const vals = ["xValue", "yValue", "zValue", "value", "widthValue", "heightValue", "rValue", "gValue", "bValue", "aValue", "filters"]
    .filter((k) => c[k] !== undefined).map((k) => `${k}=${typeof c[k] === "object" ? JSON.stringify(c[k]) : c[k]}${c[k.replace("Value", "Unit")] ?? c.xUnit ?? ""}`);
  return `${it.actionTypeId.padEnd(22)} ${String(target).padEnd(48)} ${c.duration ?? 0}ms delay ${c.delay ?? 0} ${c.easing || "linear"} ${vals.join(" ")}${c.value === "none" || c.value === "flex" ? "" : ""}`;
};

// --page /about : every event that fires on that saved page, with its action list.
const pageArg = process.argv.indexOf("--page");
if (pageArg > -1) {
  const address = process.argv[pageArg + 1];
  const html = readFileSync(join(root, "reference/live-site", address === "/" ? "index.html" : `${address.replace(/^\//, "")}.html`), "utf8");
  const pageId = /data-wf-page="([^"]+)"/.exec(html)[1];
  const wIds = new Set([...html.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]));
  const classes = new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
  const hits = Object.values(data.events).filter((e) => {
    const t = e.target ?? {};
    if (t.id) { const [p, el] = t.id.split("|"); return p === pageId && (!el || wIds.has(el)); }
    if (t.selector) return t.selector.split(/[\s>]+/).every((part) => part.split(".").filter(Boolean).every((c) => classes.has(c)));
    return false;
  });
  const byList = new Map();
  for (const e of hits) {
    const list = data.actionLists[e.action?.config?.actionListId];
    const key = list?.title ?? e.action?.actionTypeId;
    if (!byList.has(key)) byList.set(key, new Set());
    byList.get(key).add(`${e.eventTypeId}${e.target?.selector ? ` on ${e.target.selector}` : e.target?.id?.includes("|") ? ` on [data-w-id=${e.target.id.split("|")[1].slice(0, 8)}…]` : " (page)"}`);
  }
  for (const [title, triggers] of byList) console.log(`${title.padEnd(40)} ${[...triggers].join("; ")}`);
  process.exit(0);
}

const titles = process.argv.slice(2);
for (const list of Object.values(data.actionLists)) {
  if (titles.length && !titles.some((t) => list.title?.toLowerCase().includes(t.toLowerCase()))) continue;
  const triggers = Object.values(data.events).filter((e) => e.action?.config?.actionListId === list.id).map((e) => `${e.eventTypeId} on ${e.target?.selector ?? e.target?.id ?? JSON.stringify(e.target?.appliesTo ?? "")}`);
  console.log(`\n== ${list.title} (${list.id})  triggers: ${[...new Set(triggers)].join("; ") || "-"}`);
  (list.actionItemGroups ?? []).forEach((g, n) => g.actionItems.forEach((it) => console.log(`  [${n}] ${fmt(it)}`)));
  (list.continuousParameterGroups ?? []).forEach((p) => p.continuousActionGroups.forEach((g) => g.actionItems.forEach((it) => console.log(`  @${g.keyframe}% ${fmt(it)}`))));
}
