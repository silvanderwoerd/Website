// Helps tune a page against the live site (step 5+), using a `looks --live` run:
//   node scripts/looks-compare.mjs <run dir> <shot> drift
//     → rows where our page and the live page start to drift apart (layout offset)
//   node scripts/looks-compare.mjs <run dir> <shot> crop <y> <height> [x] [width]
//     → <shot>.crop.png: live (left) and ours (right) side by side at full size
// <shot> is e.g. home@1440.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";

const [dir, shot, mode, ...rest] = process.argv.slice(2);
const live = PNG.sync.read(readFileSync(join(dir, `${shot}.live.png`)));
const ours = PNG.sync.read(readFileSync(join(dir, `${shot}.png`)));

// Average brightness of each row: a cheap fingerprint of the layout.
const profile = (img) => {
  const rows = new Float64Array(img.height);
  for (let y = 0; y < img.height; y++) {
    let sum = 0;
    for (let x = 0; x < img.width; x += 4) {
      const i = (y * img.width + x) * 4;
      sum += img.data[i] + img.data[i + 1] + img.data[i + 2];
    }
    rows[y] = sum / (img.width / 4) / 3;
  }
  return rows;
};

if (mode === "drift") {
  const a = profile(live);
  const b = profile(ours);
  // For each band of 100 rows, the vertical shift (−40…40px) that matches best.
  const out = [];
  for (let y = 0; y + 100 < Math.min(a.length, b.length) - 40; y += 100) {
    let best = 0, bestErr = Infinity;
    for (let s = -40; s <= 40; s++) {
      let err = 0;
      for (let k = 0; k < 100; k++) {
        const yb = y + k + s;
        if (yb < 0 || yb >= b.length) { err = Infinity; break; }
        err += Math.abs(a[y + k] - b[yb]);
      }
      if (err < bestErr) [best, bestErr] = [s, err];
    }
    out.push(`${String(y).padStart(5)}  shift ${String(best).padStart(3)}px  match ${(bestErr / 100).toFixed(1)}`);
  }
  console.log(`live ${live.width}×${live.height}, ours ${ours.width}×${ours.height}\n` + out.join("\n"));
}

if (mode === "crop") {
  const [y, h, x = 0, w = live.width] = rest.map(Number);
  const outImg = new PNG({ width: w * 2 + 10, height: h });
  outImg.data.fill(255);
  const copy = (src, dx) => {
    for (let r = 0; r < h; r++) {
      if (y + r >= src.height) break;
      for (let c = 0; c < w; c++) {
        const si = ((y + r) * src.width + x + c) * 4;
        const di = (r * outImg.width + dx + c) * 4;
        src.data.copy(outImg.data, di, si, si + 4);
      }
    }
  };
  copy(live, 0);
  copy(ours, w + 10);
  const file = join(dir, `${shot}.crop.png`);
  writeFileSync(file, PNG.sync.write(outImg));
  console.log(file);
}
