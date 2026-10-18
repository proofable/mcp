#!/usr/bin/env node
/**
 * Build the ChatGPT plugin bundle from the one canonical plugin.
 *
 * `plugins/proofable-mcp/` is the single owner of manifests, skills, and assets.
 * The ChatGPT plugin differs in exactly one byte-level fact: its `.mcp.json`
 * points at `https://mcp.proofable.me/mcp/openai`, the server path that
 * registers the plugin-guideline tool subset (no catalog, verify, or secret
 * tools). Deriving the bundle here keeps one source and no second copy to drift.
 *
 * Run:  node scripts/build-openai-bundle.mjs
 * Writes `dist/proofable-mcp-openai/` AND `dist/proofable-mcp-openai.zip` (with
 * POSIX forward-slash member paths so OpenAI's validator never rejects Windows
 * backslashes).
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const source = path.join(repoRoot, 'plugins', 'proofable-mcp');
const outDir = path.join(repoRoot, 'dist', 'proofable-mcp-openai');
const zipPath = path.join(repoRoot, 'dist', 'proofable-mcp-openai.zip');
const OPENAI_MCP_URL = 'https://mcp.proofable.me/mcp/openai';

rmSync(outDir, { recursive: true, force: true });
rmSync(zipPath, { force: true });
mkdirSync(path.dirname(outDir), { recursive: true });
cpSync(source, outDir, { recursive: true });
writeFileSync(
  path.join(outDir, '.mcp.json'),
  `${JSON.stringify({ mcpServers: { proofable: { type: 'http', url: OPENAI_MCP_URL } } }, null, 2)}\n`,
  'utf8',
);
const pyZipScript = [
  'import os, sys, zipfile',
  'src, dst = sys.argv[1], sys.argv[2]',
  'with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:',
  '    for root, _, files in os.walk(src):',
  '        for f in sorted(files):',
  '            full = os.path.join(root, f)',
  '            arc = os.path.relpath(full, src).replace("\\\\", "/")',
  '            z.write(full, arc)',
].join('\n');
const zip = spawnSync('python', ['-c', pyZipScript, outDir, zipPath], { stdio: 'pipe', encoding: 'utf8' });
if (zip.status !== 0) {
  console.error(`openai-bundle: zip failed: ${zip.stderr || zip.stdout}`);
  process.exit(1);
}
console.log(`openai-bundle: wrote ${path.relative(repoRoot, outDir)} and ${path.relative(repoRoot, zipPath)} (.mcp.json -> ${OPENAI_MCP_URL})`);
