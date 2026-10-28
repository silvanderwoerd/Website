"use client";

// The Inspector (CLAUDE.md): hold Alt and hover to outline what a thing is
// made of; Alt+click to open it. Change the original (every copy follows) or
// this instance only (an exception, marked, with a reset). Alt+click marked
// text to edit it in place. Dev only; its own look is a dev tool's, not the site's.

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Device, OriginalSchema, Settings } from "@/originals/types";
import { DEVICES } from "@/originals/types";

type Info = {
  original: string;
  schema: OriginalSchema;
  defaults: Settings;
  overrides: Settings;
  reasons: Record<string, string>;
  options: Record<string, string[]>;
  usedOn: { pages: string[]; instances: string[] };
};

type Box = { top: number; left: number; width: number; height: number; label: string; unmarked: boolean };

const UI = "data-inspector-ui";
const api = "/api/inspector";

async function post(body: object) {
  const res = await fetch(api, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "save failed");
}

const pick = (v: unknown, device: Device, perDevice?: boolean) =>
  perDevice && v && typeof v === "object" ? (v as Record<string, unknown>)[device] : v;

export default function Inspector() {
  const router = useRouter();
  const [alt, setAlt] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const [instance, setInstance] = useState<string | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"original" | "instance">("instance");
  const [device, setDevice] = useState<Device>("desktop");
  const [showPlaces, setShowPlaces] = useState(false);
  const [reason, setReason] = useState("");
  const editing = useRef<HTMLElement | null>(null);

  const load = useCallback(async (id: string) => {
    setError(null);
    const res = await fetch(`${api}?instance=${encodeURIComponent(id)}`);
    const json = await res.json();
    if (!res.ok) return setError(json.error);
    setInfo(json);
  }, []);

  const saved = useCallback(async () => {
    router.refresh();
    if (instance) await load(instance);
  }, [router, instance, load]);

  // Alt key on/off.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Alt") setAlt(true);
      if (e.key === "Escape" && !editing.current) setInstance(null);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setAlt(false);
        setBox(null);
      }
    };
    const blur = () => (setAlt(false), setBox(null));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // Hover outline: the nearest marked element, or a red "one-off" for unmarked ones.
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!e.altKey) return setBox(null);
      const el = e.target as HTMLElement;
      if (el.closest(`[${UI}]`)) return setBox(null);
      const marked = el.closest<HTMLElement>("[data-original]");
      const target = marked ?? (el.closest("main") ? el : null);
      if (!target) return setBox(null);
      const r = target.getBoundingClientRect();
      const fieldEl = el.closest<HTMLElement>("[data-field]");
      const label = marked
        ? `${marked.dataset.original}${fieldEl && marked.contains(fieldEl) ? ` · ${fieldEl.dataset.field} (click to edit text)` : ""}`
        : "one-off, ask Claude";
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height, label, unmarked: !marked });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Edit marked text in place; Enter saves to the content file, Esc cancels.
  const startEditing = useCallback((el: HTMLElement, id: string) => {
    const before = el.textContent ?? "";
    editing.current = el;
    el.contentEditable = "plaintext-only";
    el.style.outline = "2px dashed #f5a623";
    el.focus();
    const finish = async (keep: boolean) => {
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("keydown", onKey);
      el.contentEditable = "false";
      el.style.outline = "";
      editing.current = null;
      const text = el.textContent ?? "";
      if (!keep) return void (el.textContent = before);
      if (text === before) return;
      try {
        await post({ action: "setText", instance: id, field: el.dataset.field, text });
        router.refresh();
      } catch (err) {
        el.textContent = before;
        setError((err as Error).message);
      }
    };
    const onBlur = () => finish(true);
    const onKey = (k: KeyboardEvent) => {
      if (k.key === "Enter" && !k.shiftKey) (k.preventDefault(), el.blur());
      if (k.key === "Escape") finish(false);
    };
    el.addEventListener("blur", onBlur);
    el.addEventListener("keydown", onKey);
  }, [router]);

  // Alt+click: open the Inspector on that instance; on marked text, edit in place.
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!e.altKey) return;
      const el = e.target as HTMLElement;
      if (el.closest(`[${UI}]`)) return;
      e.preventDefault();
      e.stopPropagation();
      const marked = el.closest<HTMLElement>("[data-original]");
      if (!marked) return;
      const id = marked.dataset.instance!;
      setInstance(id);
      setShowPlaces(false);
      load(id);
      const fieldEl = el.closest<HTMLElement>("[data-field]");
      if (fieldEl && fieldEl.closest("[data-original]") === marked) startEditing(fieldEl, id);
    };
    window.addEventListener("click", click, true);
    return () => window.removeEventListener("click", click, true);
  }, [load, startEditing]);

  async function change(setting: string, value: string) {
    if (!info || !instance) return;
    const def = info.schema.settings[setting];
    const dev = def.perDevice ? device : undefined;
    try {
      if (mode === "original") {
        await post({ action: "setDefault", original: info.original, setting, value, device: dev });
      } else {
        await post({ action: "setOverride", instance, setting, value, device: dev, reason: reason.trim() || undefined });
        setReason("");
      }
      await saved();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function reset(setting: string) {
    if (!instance || !info) return;
    const def = info.schema.settings[setting];
    try {
      await post({ action: "resetOverride", instance, setting, device: def.perDevice ? device : undefined });
      await saved();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const anyPerDevice = info && Object.values(info.schema.settings).some((s) => s.perDevice);

  return (
    <div {...{ [UI]: "" }}>
      {alt && box && (
        <div
          style={{
            position: "fixed", zIndex: 2147483646, pointerEvents: "none",
            top: box.top, left: box.left, width: box.width, height: box.height,
            outline: `2px solid ${box.unmarked ? "#e5484d" : "#3e8ef7"}`, background: box.unmarked ? "#e5484d14" : "#3e8ef714",
          }}
        >
          <span style={{ position: "absolute", top: -22, left: -2, background: box.unmarked ? "#e5484d" : "#3e8ef7", color: "#fff", font: "600 11px/20px system-ui", padding: "0 6px", whiteSpace: "nowrap" }}>
            {box.label}
          </span>
        </div>
      )}

      {instance && (
        <aside
          style={{
            position: "fixed", zIndex: 2147483647, top: 12, right: 12, width: 340, maxHeight: "calc(100vh - 24px)", overflow: "auto",
            background: "#1d1f24", color: "#e8e8ea", font: "13px/1.45 system-ui", borderRadius: 10, boxShadow: "0 8px 30px #0008", padding: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ fontSize: 15 }}>{info?.schema.label ?? "…"}</strong>
            <button onClick={() => setInstance(null)} style={btn(false)} aria-label="Close">✕</button>
          </div>
          <div style={{ color: "#9a9ca3", fontSize: 12, wordBreak: "break-all" }}>{instance}</div>
          {error && <div style={{ color: "#ff8589", margin: "8px 0" }}>{error}</div>}

          {info && (
            <>
              <p style={{ margin: "8px 0", color: "#c6c7cc" }}>{info.schema.purpose}</p>
              <button onClick={() => setShowPlaces(!showPlaces)} style={{ ...btn(false), width: "100%", textAlign: "left" }}>
                Original “{info.original}” is used on {info.usedOn.pages.length} page{info.usedOn.pages.length === 1 ? "" : "s"} ({info.usedOn.instances.length} copies) {showPlaces ? "▴" : "▾"}
              </button>
              {showPlaces && (
                <ul style={{ margin: "6px 0", paddingLeft: 18, fontSize: 12, color: "#9a9ca3" }}>
                  {info.usedOn.instances.map((p) => <li key={p}>{p === instance ? <b style={{ color: "#e8e8ea" }}>{p} (this)</b> : p}</li>)}
                </ul>
              )}

              <div style={{ display: "flex", gap: 6, margin: "12px 0 6px" }}>
                <button style={btn(mode === "original")} onClick={() => setMode("original")}>Change the original</button>
                <button style={btn(mode === "instance")} onClick={() => setMode("instance")}>This copy only</button>
              </div>
              <div style={{ fontSize: 12, color: "#9a9ca3", marginBottom: 8 }}>
                {mode === "original"
                  ? `Every copy without its own exception follows (${info.usedOn.instances.length} copies).`
                  : "A deliberate exception: marked, with a reset button."}
              </div>
              {mode === "instance" && (
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why is this copy different? (saved with the exception)"
                  style={{ width: "100%", marginBottom: 10, background: "#2a2d34", color: "#e8e8ea", border: "1px solid #3a3e47", borderRadius: 6, padding: "5px 7px", font: "12px system-ui" }}
                />
              )}

              {anyPerDevice && (
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {DEVICES.map((d) => <button key={d} style={btn(device === d)} onClick={() => setDevice(d)}>{d}</button>)}
                </div>
              )}

              {Object.entries(info.schema.settings).map(([name, def]) => {
                const original = pick(info.defaults[name], device, def.perDevice);
                const own = pick(info.overrides[name], device, def.perDevice);
                const overridden = own !== undefined;
                const effective = overridden ? own : original;
                return (
                  <div key={name} style={{ padding: "8px 0", borderTop: "1px solid #2c2f36" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        {def.label}
                        {def.perDevice && <span style={{ color: "#9a9ca3" }}> · {device}</span>}
                      </span>
                      {overridden && <span style={{ color: "#f5a623", fontSize: 11, fontWeight: 600 }}>EXCEPTION</span>}
                    </div>
                    <select
                      value={String(mode === "original" ? original ?? "" : effective ?? "")}
                      onChange={(e) => change(name, e.target.value)}
                      style={{ width: "100%", marginTop: 4, background: "#2a2d34", color: "#e8e8ea", border: "1px solid #3a3e47", borderRadius: 6, padding: "4px 6px" }}
                    >
                      {(info.options[name] ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div style={{ fontSize: 11, color: "#9a9ca3", marginTop: 4 }}>
                      {kindLabel(def.kind)} → original: <b>{String(original ?? "—")}</b>
                      {overridden && <> → this copy: <b style={{ color: "#f5a623" }}>{String(own)}</b></>}
                    </div>
                    {overridden && (
                      <>
                        {info.reasons[name] && <div style={{ fontSize: 11, color: "#c6c7cc" }}>Why: {info.reasons[name]}</div>}
                        <button style={{ ...btn(false), marginTop: 4, fontSize: 11 }} onClick={() => reset(name)}>Reset to original</button>
                      </>
                    )}
                  </div>
                );
              })}
              {info.schema.fields?.length ? (
                <p style={{ fontSize: 11, color: "#9a9ca3", marginTop: 10 }}>
                  Text ({info.schema.fields.join(", ")}): Alt+click the text on the page to edit it. Enter saves, Esc cancels.
                </p>
              ) : null}
            </>
          )}
        </aside>
      )}
    </div>
  );
}

const kindLabel = (k: string) =>
  ({ colorToken: "colour token", spaceStep: "spacing token", textStyle: "text style", choice: "choice", toggle: "on/off" })[k] ?? k;

const btn = (active: boolean): React.CSSProperties => ({
  background: active ? "#3e8ef7" : "#2a2d34", color: active ? "#fff" : "#e8e8ea", border: "1px solid #3a3e47",
  borderRadius: 6, padding: "4px 8px", font: "12px system-ui", cursor: "pointer",
});
