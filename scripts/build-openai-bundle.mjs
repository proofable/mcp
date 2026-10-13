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
 * Then zip the printed directory (its contents, not the folder) and upload it in
 * the OpenAI plugin portal.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const source = path.join(repoRoot, 'plugins', 'proofable-mcp');
const outDir = path.join(repoRoot, 'dist', 'proofable-mcp-openai');
const OPENAI_MCP_URL = 'https://mcp.proofable.me/mcp/openai';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(path.dirname(outDir), { recursive: true });
cpSync(source, outDir, { recursive: true });
writeFileSync(
  path.join(outDir, '.mcp.json'),
  `${JSON.stringify({ mcpServers: { proofable: { type: 'http', url: OPENAI_MCP_URL } } }, null, 2)}\n`,
  'utf8',
);
console.log(`openai-bundle: wrote ${path.relative(repoRoot, outDir)} (.mcp.json -> ${OPENAI_MCP_URL})`);
