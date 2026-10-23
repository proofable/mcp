/**
 * @proofable/mcp: discovery metadata only.
 * The hosted Proofable MCP server runs at https://mcp.proofable.me/mcp (the single
 * canonical endpoint: OAuth from its 401 challenge, or a server key as Bearer),
 * not inside this npm package.
 *
 * @see https://mcp.proofable.me/mcp
 * @see https://docs.proofable.me/mcp/setup
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @returns {Record<string, unknown>} Parsed MCP registry / installer manifest (`server.json`). */
export function loadServerManifest() {
  const raw = readFileSync(join(__dirname, 'server.json'), 'utf8');
  return JSON.parse(raw);
}

export const serverManifest = loadServerManifest();

const REMOTE_MCP_URL =
  process.env.PROOFABLE_MCP_URL ||
  serverManifest?.remotes?.[0]?.url ||
  'https://mcp.proofable.me/mcp';

function buildFallbackTools() {
  const list = Array.isArray(serverManifest?.tools) ? serverManifest.tools : [];
  return list.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema || { type: 'object', properties: {} },
  }));
}

async function forwardJsonRpc(message) {
  const key = String(
    process.env.PROOFABLE_ACCESS_KEY || process.env.PROFILE_ACCESS_KEY || '',
  ).trim();
  const headers = {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    ...(key ? { authorization: `Bearer ${key}`, 'x-proofable-access-key': key } : {}),
  };
  const res = await fetch(REMOTE_MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(15_000),
  });
  const raw = await res.text();
  const payload =
    raw.startsWith('event:') || raw.includes('\ndata:')
      ? raw
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .join('')
      : raw;
  return JSON.parse(payload);
}

async function handleStdioMessage(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }
  if (!msg || typeof msg !== 'object') return;
  if (msg.id === undefined || msg.id === null) return;

  const { id, method, params } = msg;
  const write = (obj) => process.stdout.write(`${JSON.stringify(obj)}\n`);

  if (method === 'ping') {
    write({ jsonrpc: '2.0', id, result: {} });
    return;
  }
  if (method === 'resources/list') {
    write({ jsonrpc: '2.0', id, result: { resources: [] } });
    return;
  }
  if (method === 'resources/templates/list') {
    write({ jsonrpc: '2.0', id, result: { resourceTemplates: [] } });
    return;
  }
  if (method === 'prompts/list') {
    write({ jsonrpc: '2.0', id, result: { prompts: [] } });
    return;
  }

  try {
    const remote = await forwardJsonRpc(msg);
    if (remote && typeof remote === 'object' && ('result' in remote || 'error' in remote)) {
      if (method === 'tools/list' && Array.isArray(remote?.result?.tools)) {
        const byName = new Map(remote.result.tools.map((t) => [t.name, t]));
        for (const fallback of buildFallbackTools()) {
          if (!byName.has(fallback.name)) byName.set(fallback.name, fallback);
        }
        write({
          jsonrpc: '2.0',
          id,
          result: { ...remote.result, tools: [...byName.values()] },
        });
        return;
      }
      write({
        jsonrpc: '2.0',
        id,
        ...(remote.result !== undefined ? { result: remote.result } : { error: remote.error }),
      });
      return;
    }
  } catch {
    // Offline or sandboxed container inspection falls back to server.json metadata.
  }

  if (method === 'initialize') {
    write({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: params?.protocolVersion || '2025-03-26',
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: String(serverManifest?.name || 'io.github.proofable/mcp'),
          version: String(serverManifest?.version || '0.1.7'),
        },
      },
    });
    return;
  }

  if (method === 'tools/list') {
    write({
      jsonrpc: '2.0',
      id,
      result: { tools: buildFallbackTools() },
    });
    return;
  }

  write({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not available offline: ${String(method)}` },
  });
}

const invokedArg = String(process.argv[1] || '').replace(/\\/g, '/');
const isDirectEntry =
  invokedArg.endsWith('/index.mjs') ||
  invokedArg === 'index.mjs' ||
  invokedArg === './index.mjs' ||
  invokedArg.endsWith('/proofable-mcp') ||
  (invokedArg ? import.meta.url === pathToFileURL(resolve(process.argv[1])).href : false);

if (isDirectEntry) {
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  let queue = Promise.resolve();
  rl.on('line', (line) => {
    queue = queue.then(() => handleStdioMessage(line)).catch(() => {});
  });
}
