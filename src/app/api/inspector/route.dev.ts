// The Inspector's local-only route. A *.dev.ts file: it exists only under
// `npm run dev` (next.config.ts), never in the live site's code. It also
// refuses any request that doesn't come from this computer.

import { NextResponse, type NextRequest } from "next/server";
import { schemas } from "@/originals/schemas";
import { getDefaults } from "@/originals/resolve";
import type { Device } from "@/originals/types";
import { allowedValues, findInstance, resetOverride, setDefault, setOverride, setText, usedOn } from "@/inspector/server";

export const dynamic = "force-dynamic";

const LOCAL = new Set(["localhost", "127.0.0.1", "[::1]"]);

function refuse(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "not found" }, { status: 404 });
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "");
  if (!LOCAL.has(host)) return NextResponse.json({ error: "local only" }, { status: 403 });
  return null;
}

// What the panel shows for one picked element.
export function GET(req: NextRequest) {
  const refused = refuse(req);
  if (refused) return refused;
  const id = req.nextUrl.searchParams.get("instance") ?? "";
  try {
    const { original, target } = findInstance(id);
    const schema = schemas[original];
    const options = Object.fromEntries(Object.entries(schema.settings).map(([k, def]) => [k, allowedValues(def)]));
    return NextResponse.json({
      original,
      schema,
      defaults: getDefaults(original),
      overrides: target.overrides ?? {},
      reasons: target.overrideReasons ?? {},
      options,
      usedOn: usedOn(original),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

type Body =
  | { action: "setDefault"; original: string; setting: string; value: string | boolean; device?: Device }
  | { action: "setOverride"; instance: string; setting: string; value: string | boolean; device?: Device; reason?: string }
  | { action: "resetOverride"; instance: string; setting: string; device?: Device }
  | { action: "setText"; instance: string; field: string; text: string };

export async function POST(req: NextRequest) {
  const refused = refuse(req);
  if (refused) return refused;
  const body = (await req.json()) as Body;
  try {
    if (body.action === "setDefault") setDefault(body.original, body.setting, body.value, body.device);
    else if (body.action === "setOverride") setOverride(body.instance, body.setting, body.value, body.device, body.reason);
    else if (body.action === "resetOverride") resetOverride(body.instance, body.setting, body.device);
    else if (body.action === "setText") setText(body.instance, body.field, body.text);
    else throw new Error("unknown action");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
