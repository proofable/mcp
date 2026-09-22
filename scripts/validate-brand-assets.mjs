#!/usr/bin/env node
// Guard against shipping a stale or divergent plugin logo.
//
// The finalized Proofable mark is the "annulus + right crescent" construction
// (see public/images/proofable-brand-pack/manifest.json in the app repo):
// a two-path SVG with zero <circle> elements. The retired pre-final mark was a
// particle-orbit drawing (hundreds of <circle> elements on a 1024 artboard).
// This validator pins the plugin assets to the finalized geometry so an
// out-of-date copy fails CI instead of rendering in host marketplaces.
//
// Run: node scripts/validate-brand-assets.mjs (wired into `npm run validate`).
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import path from "node:path";
import process from "node:process";

const pluginAssetsDir = path.join(process.cwd(), "plugins", "proofable-mcp", "assets");
const errors = [];

// Finalized geometry fingerprints (from the generated master mark, 512 artboard).
const FINGERPRINTS = [
  ["ring outer path", "M 400 256 A 184 184 0 1 1 32 256"],
  ["crescent cut arc", "A 213 213 0 0 0"],
  ["artboard", 'viewBox="0 0 512 512"'],
];

const iconSvg = readFileSync(path.join(pluginAssetsDir, "icon.svg"), "utf8");

for (const [label, marker] of FINGERPRINTS) {
  if (!iconSvg.includes(marker)) {
    errors.push(`icon.svg: missing finalized ${label} marker (${marker})`);
  }
}
// The retired particle-orbit mark was built from <circle> elements; the
// finalized mark is exactly two <path> elements.
const circleCount = (iconSvg.match(/<circle/g) || []).length;
if (circleCount !== 0) {
  errors.push(`icon.svg: contains ${circleCount} <circle> element(s) — pre-final particle-orbit geometry detected`);
}

// Raster tier must be the 512 web mark, not an arbitrary export.
const iconPng = readFileSync(path.join(pluginAssetsDir, "icon.png"));
const ihdrWidth = iconPng.readUInt32BE(16);
const ihdrHeight = iconPng.readUInt32BE(20);
if (iconPng.subarray(1, 4).toString("ascii") !== "PNG") {
  errors.push("icon.png: not a PNG file");
}
if (ihdrWidth !== 512 || ihdrHeight !== 512) {
  errors.push(`icon.png: expected 512x512, found ${ihdrWidth}x${ihdrHeight}`);
}

// Corners must be fully transparent: the mark drops onto any host surface, so
// a baked tile (graphite, paper, or any ground color) fails here instead of
// rendering as a dark square in marketplaces.
try {
  const pngCorners = decodePngCorners(iconPng);
  for (const [label, rgba] of Object.entries(pngCorners)) {
    if (rgba[3] !== 0) {
      errors.push(`icon.png: ${label} is rgba(${rgba.join(", ")}) — the mark must be transparent, never a baked tile`);
    }
  }
} catch (error) {
  errors.push(`icon.png: could not read pixel alpha (${error.message})`);
}

/** Corner rgba of a truecolor (RGBA) PNG: corners [0,0], [w-1,0], [0,h-1], [w-1,h-1]. */
function decodePngCorners(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG signature");
  let off = 8, idat = [], w = 0, h = 0, ct = 0;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.toString("ascii", off + 4, off + 8);
    if (type === "IHDR") { w = buf.readUInt32BE(off + 8); h = buf.readUInt32BE(off + 12); ct = buf[off + 17]; }
    if (type === "IDAT") idat.push(buf.subarray(off + 8, off + 8 + len));
    off += 12 + len;
    if (type === "IEND") break;
  }
  if (ct !== 6) throw new Error(`expected RGBA color type 6, found ${ct}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * 4 + 1;
  const corners = {};
  const px = (x, y) => {
    // Reconstruct rows 0..y through the PNG filter pipeline.
    let pos = 0;
    const prev = Buffer.alloc(w * 4);
    let row = null;
    for (let yy = 0; yy <= y; yy++) {
      const f = raw[pos];
      row = Buffer.from(raw.subarray(pos + 1, pos + stride));
      for (let i = 0; i < w * 4; i++) {
        const a = i >= 4 ? row[i - 4] : 0;
        const b = prev[i];
        const c = i >= 4 ? prev[i - 4] : 0;
        let v = row[i];
        if (f === 1) v += a;
        else if (f === 2) v += b;
        else if (f === 3) v += (a + b) >> 1;
        else if (f === 4) {
          const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        }
        row[i] = v & 255;
      }
      if (yy < y) prev.set(row);
      pos += stride;
    }
    return [row[x * 4], row[x * 4 + 1], row[x * 4 + 2], row[x * 4 + 3]];
  };
  corners["top-left corner"] = px(0, 0);
  corners["top-right corner"] = px(w - 1, 0);
  corners["bottom-left corner"] = px(0, h - 1);
  corners["bottom-right corner"] = px(w - 1, h - 1);
  return corners;
}

if (errors.length > 0) {
  console.error("Plugin brand asset validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Plugin brand assets match the finalized Proofable mark (annulus + crescent, 512px, transparent).");