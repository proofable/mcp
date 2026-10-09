#!/usr/bin/env node
/**
 * Generate the OpenAI-facing interface block from one canonical source.
 *
 * The ChatGPT/Codex plugin listing is reviewer-facing copy. It was hand-copied
 * into three places (the Codex plugin manifest and each submission bundle) and
 * the copies diverged — three short descriptions and three long descriptions
 * for the same plugin, with nothing comparing them. OpenAI requires a new
 * version for any listing change, so every divergence also forced a hand bump.
 *
 * `openai/interface.json` is now the single owner of the shared reviewer-facing
 * fields. This script writes them into the Codex plugin manifest and fails on
 * drift, so the manifest and any submission bundle carry one description.
 *
 * Host-only fields stay per host: `capabilities`, `brandColor`, `composerIcon`,
 * `logo`, and `screenshots` are preserved from the target, never overwritten.
 *
 * Run:  node scripts/sync-openai-interface.mjs
 * Check: node scripts/sync-openai-interface.mjs --check
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const CANONICAL = path.join(repoRoot, 'openai', 'interface.json');
const CODEX_MANIFEST = path.join(repoRoot, 'plugins', 'proofable-mcp', '.codex-plugin', 'plugin.json');
const CHECK_ONLY = process.argv.includes('--check');

/** Fields the canonical file owns; every target interface must match them. */
const CANONICAL_FIELDS = [
  'displayName',
  'shortDescription',
  'longDescription',
  'developerName',
  'websiteURL',
  'supportURL',
  'privacyPolicyURL',
  'termsOfServiceURL',
  'defaultPrompt',
];

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

if (!existsSync(CANONICAL)) {
  console.error(`openai-interface: missing canonical source ${path.relative(repoRoot, CANONICAL)}`);
  process.exit(1);
}

const canonical = readJson(CANONICAL);
const errors = [];
for (const field of CANONICAL_FIELDS) {
  if (canonical[field] === undefined) {
    errors.push(`${path.relative(repoRoot, CANONICAL)}: missing canonical field "${field}"`);
  }
}
if (errors.length) {
  console.error('openai-interface: canonical source is incomplete:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

function mergeInterface(target) {
  // Canonical fields first for readability, then any host-only extras.
  const merged = {};
  for (const field of CANONICAL_FIELDS) merged[field] = canonical[field];
  for (const [key, value] of Object.entries(target || {})) {
    if (!CANONICAL_FIELDS.includes(key)) merged[key] = value;
  }
  return merged;
}

const mismatches = [];

// Codex plugin manifest — what the Codex plugin detail pane renders.
{
  const manifest = readJson(CODEX_MANIFEST);
  const expectedInterface = mergeInterface(manifest.interface);
  const expected = `${JSON.stringify({ ...manifest, interface: expectedInterface }, null, 2)}\n`;
  const actual = readFileSync(CODEX_MANIFEST, 'utf8');
  if (actual !== expected) {
    if (CHECK_ONLY) {
      mismatches.push(path.relative(repoRoot, CODEX_MANIFEST));
    } else {
      writeJson(CODEX_MANIFEST, { ...manifest, interface: expectedInterface });
      console.log(`openai-interface: synced ${path.relative(repoRoot, CODEX_MANIFEST)}`);
    }
  }
}

if (CHECK_ONLY) {
  if (mismatches.length) {
    console.error('openai-interface: OUT OF SYNC; run `node scripts/sync-openai-interface.mjs` to fix:');
    for (const m of mismatches) console.error(`  - ${m}`);
    process.exit(1);
  }
  console.log('openai-interface: canonical OpenAI copy in sync with the Codex plugin manifest.');
}
