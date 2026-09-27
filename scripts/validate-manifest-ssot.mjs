#!/usr/bin/env node
// One description and one version across every host discovery surface.
//
// protocol/mcp/server.json is canonical, and protocol's `npm run mcp:sync` writes
// mcp/server.json plus the registry mirrors from it. The plugin manifests and the
// three marketplace copies are hand-maintained, and nothing compared them back to
// the canonical pair. That blind spot is how the Claude plugin shipped without an
// .mcp.json while three docs pages promised it registered the server.
//
// This guard closes the identity half of that gap: the description and the version
// a host renders — marketplace card, plugin detail pane, npm page — must be the one
// canonical pair. Package- and registry-specific fields stay owned by
// `npm run validate:package`; this script owns only the shared identity values.
//
// Run: node scripts/validate-manifest-ssot.mjs (wired into `npm run validate`).
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const CANONICAL = "server.json";
const errors = [];

async function readJson(relative) {
  try {
    return JSON.parse(await fs.readFile(path.join(repoRoot, relative), "utf8"));
  } catch (error) {
    errors.push(`${relative}: cannot read (${error.message})`);
    return null;
  }
}

function expectEqual(relative, label, actual, expected) {
  if (actual === undefined || actual === null || actual === "") {
    errors.push(`${relative}: ${label} is missing; expected "${expected}".`);
    return;
  }
  if (actual !== expected) {
    errors.push(`${relative}: ${label} is "${actual}"; expected "${expected}" (from ${CANONICAL}).`);
  }
}

const canonical = await readJson(CANONICAL);
if (!canonical) {
  console.error("Manifest SSOT validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const expectedDescription = String(canonical.description || "");
const expectedVersion = String(canonical.version || "");
if (!expectedDescription) errors.push(`${CANONICAL}: description is empty; it is the SSOT value.`);
if (!expectedVersion) errors.push(`${CANONICAL}: version is empty; it is the SSOT value.`);

// Plugin manifests — what a host shows in the plugin detail pane.
const PLUGIN_MANIFESTS = [
  "plugins/proofable-mcp/.claude-plugin/plugin.json",
  "plugins/proofable-mcp/.cursor-plugin/plugin.json",
  "plugins/proofable-mcp/.codex-plugin/plugin.json",
];
for (const relative of PLUGIN_MANIFESTS) {
  const manifest = await readJson(relative);
  if (!manifest) continue;
  expectEqual(relative, "description", manifest.description, expectedDescription);
  expectEqual(relative, "version", manifest.version, expectedVersion);
}

// Marketplace copies — the byte-identical trio a host reads to list the plugin.
const MARKETPLACES = [
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
];
for (const relative of MARKETPLACES) {
  const marketplace = await readJson(relative);
  if (!marketplace) continue;
  expectEqual(relative, "metadata.description", marketplace.metadata?.description, expectedDescription);
  expectEqual(relative, "metadata.version", marketplace.metadata?.version, expectedVersion);
  for (const [index, entry] of (marketplace.plugins || []).entries()) {
    expectEqual(`${relative} plugins[${index}]`, "description", entry?.description, expectedDescription);
  }
}

// The npm package carries the same identity pair; validate:package owns the rest.
const pkg = await readJson("package.json");
if (pkg) {
  expectEqual("package.json", "description", pkg.description, expectedDescription);
  expectEqual("package.json", "version", pkg.version, expectedVersion);
}

if (errors.length > 0) {
  console.error("Manifest SSOT validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(
  `Manifest SSOT: one description and version across ${PLUGIN_MANIFESTS.length} plugin manifests, ${MARKETPLACES.length} marketplaces, and package.json.`,
);
