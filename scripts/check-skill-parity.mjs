#!/usr/bin/env node
/**
 * The plugin bundle ships the same skill bytes as this package. Nothing generates them,
 * so they drift silently and two clients end up reading different rules.
 *
 *   node scripts/check-skill-parity.mjs
 *
 * `skills/` is canonical. `plugins/proofable-mcp/skills/` is a mirror and is never
 * edited on its own. Absent mirror: skipped, like the sibling-repo checks.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = path.join(root, 'skills');
const mirror = path.join(root, 'plugins', 'proofable-mcp', 'skills');

function listFiles(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, base, out);
    else if (entry.isFile()) out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

const read = (file) => readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const digest = (text) => createHash('sha256').update(text).digest('hex');

if (!existsSync(mirror)) {
  console.log('skill parity: skipped (no plugin skill tree)');
  process.exit(0);
}

const files = listFiles(canonical);
const drift = [];
for (const relative of files) {
  const parts = relative.split('/');
  const target = path.join(mirror, ...parts);
  if (!existsSync(target)) drift.push(`missing ${relative}`);
  else if (digest(read(path.join(canonical, ...parts))) !== digest(read(target))) drift.push(`stale ${relative}`);
}

if (drift.length) {
  console.error('skill parity: plugins/proofable-mcp/skills is out of sync with skills/; copy the canonical file over it:');
  for (const line of drift) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(`skill parity: ${files.length} files match between skills/ and the plugin bundle.`);
