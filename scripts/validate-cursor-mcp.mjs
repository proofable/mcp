#!/usr/bin/env node
// Validates that plugin mcp.json files use the Cursor-native shape.
// Cursor's mcp.json schema expects { "mcpServers": { "name": { "url": "...", "headers?": {...} } } }
// and rejects the spec { type: "http", authorization: {...} } shape that other hosts use.
//
// It also fails when one plugin declares the same server name in both `mcp.json`
// and `.mcp.json`. Cursor reads the two files independently, so a shared name
// registers that server twice under a single plugin identifier; the second client
// inherits the first one's OAuth state and every call fails with "Unauthorized".
// Ship one file per server name.
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const errors = [];

function addError(message) {
  errors.push(message);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function isValidHttpsUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

async function validatePluginMcp(pluginDir, { requireFile = false } = {}) {
  // Cursor reads `mcp.json` (native shape) and `.mcp.json` (spec shape) as two
  // independent sources. Collect server names from both so a duplicate across
  // the pair is a hard error, not a silent double registration.
  const serverNames = new Map(); // server name -> file that first declared it
  const nativePath = path.join(pluginDir, "mcp.json");
  const hasNative = await pathExists(nativePath);
  const hasSpec = await pathExists(path.join(pluginDir, ".mcp.json"));

  if (hasNative) {
    const relative = path.relative(repoRoot, nativePath);
    let mcp;
    try {
      mcp = await readJsonFile(nativePath);
    } catch (error) {
      addError(`${relative}: invalid JSON — ${error.message}`);
      mcp = null;
    }

    if (mcp) {
      if (!mcp.mcpServers || typeof mcp.mcpServers !== "object" || Array.isArray(mcp.mcpServers)) {
        addError(`${relative}: mcpServers must be an object keyed by server name.`);
      } else {
        const allowedServerKeys = new Set(["url", "headers"]);
        for (const [name, server] of Object.entries(mcp.mcpServers)) {
          if (!server || typeof server !== "object" || Array.isArray(server)) {
            addError(`${relative}.mcpServers.${name}: must be an object.`);
            continue;
          }

          serverNames.set(name, "mcp.json");

          const extraKeys = Object.keys(server).filter((key) => !allowedServerKeys.has(key));
          if (extraKeys.length > 0) {
            addError(
              `${relative}.mcpServers.${name}: Cursor mcp.json does not support ${extraKeys.map((k) => `"${k}"`).join(", ")}. Use only "url" and "headers".`
            );
          }

          if (!isValidHttpsUrl(server.url)) {
            addError(`${relative}.mcpServers.${name}: "url" must be a valid https:// URL.`);
          }

          if (server.headers && typeof server.headers !== "object") {
            addError(`${relative}.mcpServers.${name}: "headers" must be an object.`);
          }
        }
      }
    }
  }

  if (hasSpec) {
    const relative = path.relative(repoRoot, path.join(pluginDir, ".mcp.json"));
    let spec;
    try {
      spec = await readJsonFile(path.join(pluginDir, ".mcp.json"));
    } catch (error) {
      addError(`${relative}: invalid JSON — ${error.message}`);
      spec = null;
    }

    if (spec && spec.mcpServers && typeof spec.mcpServers === "object" && !Array.isArray(spec.mcpServers)) {
      for (const name of Object.keys(spec.mcpServers)) {
        if (serverNames.has(name)) {
          addError(
            `${relative}: server "${name}" is also declared in ${serverNames.get(name)}. ` +
              `A plugin registers each server name once; Cursor loads the duplicate as a second client under one ` +
              `identifier and the server then fails every call with "Unauthorized".`
          );
        } else {
          serverNames.set(name, ".mcp.json");
        }
      }
    }
  }

  if (!hasNative && !hasSpec && requireFile) {
    addError(
      `${path.relative(repoRoot, pluginDir)}: missing an MCP config (mcp.json or .mcp.json) for a plugin that ships hosted MCP.`
    );
  }
}

async function main() {
  const pluginsDir = path.join(repoRoot, "plugins");
  if (!(await pathExists(pluginsDir))) {
    addError(`plugins directory not found: ${pluginsDir}`);
    summarizeAndExit();
    return;
  }

  const entries = await fs.readdir(pluginsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pluginDir = path.join(pluginsDir, entry.name);
    await validatePluginMcp(pluginDir, { requireFile: entry.name === "proofable-mcp" });
  }

  summarizeAndExit();
}

function summarizeAndExit() {
  if (errors.length > 0) {
    console.error("Cursor mcp.json validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Cursor mcp.json validation passed.");
}

await main();
