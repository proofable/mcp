#!/usr/bin/env node
/**
 * Sync all SDK skills into the proofable-mcp plugin bundle.
 *
 * Public skills live at skills/<name>/ and are canonical in this repository. The plugin copies at
 * plugins/proofable-mcp/skills/<name>/ are what marketplace installers (Cursor, Claude
 * Code, Codex) deliver so skills are present without requiring a CLI run.
 *
 * Skills with a .proofable-internal marker file are excluded from the plugin bundle
 * (they are org-internal packs distributed via `npm run skills:install`, not via
 * the public marketplace plugin).
 *
 * Run after editing any skill:  node scripts/sync-plugin-skills.mjs
 * CI check (no writes):         node scripts/sync-plugin-skills.mjs --check
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const canonicalSkillsDir = path.join(repoRoot, 'skills');
const pluginSkillsDir = path.join(repoRoot, 'plugins', 'proofable-mcp', 'skills');
const sdkSkillsDir = process.env.PROOFABLE_SDK_SKILLS_ROOT
  ? path.resolve(process.env.PROOFABLE_SDK_SKILLS_ROOT)
  : path.resolve(repoRoot, '../proofable-sdk/skills');
const checkMode = process.argv.includes('--check');

function directoryDigest(dir) {
  const entries = [];
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        entries.push(
          `${path.relative(dir, fullPath).replaceAll(path.sep, '/')}\0${readFileSync(fullPath, 'utf8')}`
        );
      }
    }
  };
  visit(dir);
  entries.sort();
  return createHash('sha256').update(entries.join('\0')).digest('hex');
}

function listCanonicalSkills() {
  if (!existsSync(canonicalSkillsDir)) return [];
  return readdirSync(canonicalSkillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => existsSync(path.join(canonicalSkillsDir, entry.name, 'SKILL.md')))
    .map(entry => entry.name);
}

const skillNames = listCanonicalSkills();
if (skillNames.length === 0) {
  console.error('No canonical skills found in skills/');
  process.exit(1);
}

const mismatches = [];
let synced = 0;

const targets = [
  { label: 'plugin', root: pluginSkillsDir },
  ...(existsSync(path.dirname(sdkSkillsDir)) ? [{ label: 'SDK', root: sdkSkillsDir }] : []),
];

for (const name of skillNames) {
  const sourceDir = path.join(canonicalSkillsDir, name);
  const sourceDigest = directoryDigest(sourceDir);
  for (const target of targets) {
    const targetDir = path.join(target.root, name);
    const targetDigest = existsSync(targetDir) ? directoryDigest(targetDir) : null;

    if (sourceDigest === targetDigest) continue;

    if (checkMode) {
      mismatches.push(`${target.label}: ${name}`);
      continue;
    }

    mkdirSync(path.dirname(targetDir), { recursive: true });
    rmSync(targetDir, { recursive: true, force: true });
    cpSync(sourceDir, targetDir, { recursive: true });
    console.log(
      `skill sync: copied ${path.relative(repoRoot, sourceDir)} → ${path.relative(repoRoot, targetDir)}`,
    );
    synced++;
  }
}

if (checkMode) {
  if (mismatches.length > 0) {
    console.error('plugin skill sync: OUT OF SYNC; run `node scripts/sync-plugin-skills.mjs` to fix.');
    for (const name of mismatches) {
      console.error(`  ${name}`);
    }
    process.exit(1);
  }
  console.log(`skill sync: all ${skillNames.length} skills in sync across ${targets.length} target(s).`);
  process.exit(0);
}

if (synced === 0) {
  console.log(`skill sync: all ${skillNames.length} skills already in sync.`);
} else {
  console.log(`plugin skill sync: ${synced} skill${synced === 1 ? '' : 's'} synced, ${skillNames.length} total.`);
}
