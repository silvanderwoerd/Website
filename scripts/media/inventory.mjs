// Step 7: the media inventory. For every Webflow file the site uses
// (scripts/media/collect.mjs), asks Webflow's CDN for its type and size and reads
// only its first bytes for pixel dimensions; then sorts it:
//   webflow-video   a video Webflow re-encoded (we only ever get Webflow's copy)
//   webflow-poster  the still frame Webflow cut from a video
//   upload          an image as it was uploaded (the best Webflow has)
//   upload-reduced  an upload whose name says it was made smaller before upload
//   upload-check    a WebP/AVIF upload: may be Webflow's own conversion
// Writes docs/media-inventory.csv. Read-only towards Webflow: no file is saved.
//   node scripts/media/inventory.mjs

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const places = JSON.parse(execFileSync(process.execPath, [join(root, "scripts/media/collect.mjs")], { maxBuffer: 64 * 1024 * 1024 }).toString());
const urls = Object.keys(places).sort();

// --- pixel sizes from the first bytes -------------------------------------
const u16 = (b, i, le = false) => (le ? b[i] | (b[i + 1] << 8) : (b[i] << 8) | b[i + 1]);
const u32 = (b, i) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
const u24le = (b, i) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);

function jpegSize(b) {
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    const len = u16(b, i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [u16(b, i + 7), u16(b, i + 5)];
    i += 2 + len;
  }
  return null;
}
function webpSize(b) {
  const kind = String.fromCharCode(...b.slice(12, 16));
  if (kind === "VP8X") return [u24le(b, 24) + 1, u24le(b, 27) + 1];
  if (kind === "VP8 ") return [u16(b, 26, true) & 0x3fff, u16(b, 28, true) & 0x3fff];
  if (kind === "VP8L") {
    const v = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1];
  }
  return null;
}
// AVIF / MP4: find a box by name and read its size fields.
const find = (b, name) => {
  const n = [...name].map((c) => c.charCodeAt(0));
  for (let i = 4; i < b.length - 4; i++) if (b[i] === n[0] && b[i + 1] === n[1] && b[i + 2] === n[2] && b[i + 3] === n[3]) return i;
  return -1;
};
function avifSize(b) {
  const i = find(b, "ispe");
  return i < 0 ? null : [u32(b, i + 8), u32(b, i + 12)];
}
function mp4Size(b) {
  // tkhd: width and height are 16.16 fixed point, the last 8 bytes of the box; take the video track's.
  let from = 0;
  while (true) {
    const i = find(b.subarray(from), "tkhd");
    if (i < 0) return null;
    const at = from + i - 4;
    const size = u32(b, at);
    const w = u32(b, at + size - 8) >>> 16;
    const h = u32(b, at + size - 4) >>> 16;
    if (w && h) return [w, h];
    from = at + size;
  }
}
function webmSize(b) {
  // EBML: PixelWidth 0xB0, PixelHeight 0xBA, inside the video track entry.
  for (let i = 0; i < b.length - 4; i++) {
    if (b[i] === 0xe0) {
      const read = (id) => {
        for (let j = i; j < Math.min(b.length - 4, i + 64); j++) {
          if (b[j] === id) {
            const len = b[j + 1] & 0x7f;
            let v = 0;
            for (let k = 0; k < len; k++) v = v * 256 + b[j + 2 + k];
            return v;
          }
        }
        return 0;
      };
      const w = read(0xb0);
      const h = read(0xba);
      if (w && h) return [w, h];
    }
  }
  return null;
}
function svgSize(text) {
  const vb = /viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/.exec(text);
  return vb ? [Math.round(Number(vb[1])), Math.round(Number(vb[2]))] : null;
}
function sizeOf(type, b) {
  if (/jpeg/.test(type)) return jpegSize(b);
  if (/png/.test(type)) return [u32(b, 16), u32(b, 20)];
  if (/gif/.test(type)) return [u16(b, 6, true), u16(b, 8, true)];
  if (/webp/.test(type)) return webpSize(b);
  if (/avif/.test(type)) return avifSize(b);
  if (/mp4/.test(type)) return mp4Size(b);
  if (/webm/.test(type)) return webmSize(b);
  if (/svg/.test(type)) return svgSize(Buffer.from(b).toString("utf8"));
  return null;
}

async function look(url) {
  const video = /\.(mp4|webm)$/i.test(url);
  const res = await fetch(url, { headers: { Range: `bytes=0-${video ? 2 * 1024 * 1024 - 1 : 512 * 1024 - 1}` } });
  const type = res.headers.get("content-type") ?? "";
  const total = Number(res.headers.get("content-range")?.split("/")[1] ?? res.headers.get("content-length") ?? 0);
  const bytes = new Uint8Array(await res.arrayBuffer());
  let size = null;
  try {
    size = sizeOf(type, bytes);
  } catch {}
  return { status: res.status, type, bytes: total, size };
}

function kind(url, type) {
  const name = decodeURIComponent(url.split("/").pop());
  if (/\.(mp4|webm)$/i.test(name)) return "webflow-video";
  if (/(-poster-0000\d|_poster\.0000000)\.(jpg|png)$/i.test(name)) return "webflow-poster";
  if (/optimi[sz]ed|resized|compressed|-small|thumb|webcover|-web\b/i.test(name)) return "upload-reduced";
  if (/webp|avif/.test(type) || /\.(webp|avif)$/i.test(name)) return "upload-check";
  return "upload";
}

const rows = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    let r;
    for (let tries = 0; tries < 3; tries++) {
      try {
        r = await look(url);
        break;
      } catch (e) {
        r = { status: "error", type: "", bytes: 0, size: null, error: String(e) };
      }
    }
    rows.push({ url, ...r, kind: kind(url, r.type), used: places[url] });
    if (rows.length % 100 === 0) process.stderr.write(`${rows.length}/${urls.length}\n`);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
rows.sort((a, b) => a.kind.localeCompare(b.kind) || b.bytes - a.bytes);

const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const lines = [
  ["kind", "file", "type", "width", "height", "bytes", "used on", "status", "address"].map(csv).join(","),
  ...rows.map((r) =>
    [
      r.kind,
      decodeURIComponent(r.url.split("/").pop()),
      r.type,
      r.size?.[0] ?? "",
      r.size?.[1] ?? "",
      r.bytes,
      r.used.map((p) => p.replace(/^content\//, "").replace(/\.(json|md)$/, "")).join(" "),
      r.status,
      r.url,
    ]
      .map(csv)
      .join(","),
  ),
];
writeFileSync(join(root, "docs/media-inventory.csv"), lines.join("\n") + "\n");

const by = {};
for (const r of rows) {
  by[r.kind] ??= { files: 0, bytes: 0 };
  by[r.kind].files++;
  by[r.kind].bytes += r.bytes;
}
console.log(JSON.stringify({ files: rows.length, failed: rows.filter((r) => r.status !== 206 && r.status !== 200).length, noSize: rows.filter((r) => !r.size).length, by }, null, 1));
