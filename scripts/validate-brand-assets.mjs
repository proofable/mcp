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

if (errors.length > 0) {
  console.error("Plugin brand asset validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Plugin brand assets match the finalized Proofable mark (annulus + crescent, 512px).");