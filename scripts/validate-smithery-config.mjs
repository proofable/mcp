#!/usr/bin/env node
// Validates smithery.config.json — the Smithery release metadata for the hosted
// Proofable MCP (URL-published). This is marketplace gateway metadata, distinct
// from the standards server card (server.json) and the MCP registry manifests.
//
// Smithery contract (https://smithery.ai/docs/build/session-config):
//   - JSON Schema with `x-from` header/query extension
//   - `authorization`, `cookie`, `cf-*`, `smithery-*` are reserved as x-from sources
//   - optional fields must not be listed in `required`
//   - schema limited to 20 fields and 1KB total size
//
// The one field is an OPTIONAL Profile access key forwarded as
// `x-proofable-access-key`, which the hosted MCP edge normalizes into the same
// existing Bearer principal (see protocol src/mcp/hosted-server.js). With no
// key configured, Smithery traffic receives the standard 401 + WWW-Authenticate
// OAuth challenge and the user clicks Connect.
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const configPath = path.join(process.cwd(), "smithery.config.json");
const errors = [];

function addError(message) {
  errors.push(message);
}

const raw = await fs.readFile(configPath, "utf8").catch(() => null);
if (!raw) {
  console.error(`Smithery config missing: ${configPath}`);
  process.exit(1);
}

let config;
try {
  config = JSON.parse(raw);
} catch (error) {
  console.error(`smithery.config.json: invalid JSON — ${error.message}`);
  process.exit(1);
}

const MAX_BYTES = 1024;
const MAX_FIELDS = 20;
const RESERVED_X_FROM = ["authorization", "cookie"];
const RESERVED_PREFIXES = ["cf-", "smithery-"];

if (config.type !== "object") {
  addError('smithery.config.json: top-level "type" must be "object".');
}

const properties = config.properties;
if (!properties || typeof properties !== "object" || Array.isArray(properties)) {
  addError('smithery.config.json: "properties" must be a flat object.');
} else {
  const fieldNames = Object.keys(properties);
  if (fieldNames.length === 0) {
    addError('smithery.config.json: "properties" must not be empty.');
  }
  if (fieldNames.length > MAX_FIELDS) {
    addError(`smithery.config.json: exceeds Smithery's ${MAX_FIELDS}-field limit.`);
  }

  for (const [name, field] of Object.entries(properties)) {
    if (field.type === "object" || field.type === "array") {
      addError(`smithery.config.json: field "${name}" must be a simple type (string/number/boolean).`);
    }
    const xFrom = field["x-from"];
    if (!xFrom || typeof xFrom.header !== "string") {
      addError(`smithery.config.json: field "${name}" must declare "x-from": { "header": "..." } — secrets travel as headers, not query parameters.`);
      continue;
    }
    const header = xFrom.header.toLowerCase();
    if (RESERVED_X_FROM.includes(header)) {
      addError(`smithery.config.json: field "${name}" x-from header "${header}" is reserved by Smithery (its own OAuth).`);
    }
    if (RESERVED_PREFIXES.some((prefix) => header.startsWith(prefix))) {
      addError(`smithery.config.json: field "${name}" x-from header "${header}" uses a reserved Smithery prefix.`);
    }
  }
}

// The access key must stay optional: with no config, the gateway gets the
// standard OAuth 401 challenge and the user clicks Connect.
const required = Array.isArray(config.required) ? config.required : [];
for (const name of required) {
  addError(`smithery.config.json: field "${name}" is required. Proofable Connect (OAuth) needs no configuration; keep every field optional.`);
}
if (required.length === 0 && config.title && config.title.includes("required")) {
  addError('smithery.config.json: title claims a required credential.');
}

const keyField = properties?.profileAccessKey;
if (!keyField) {
  addError('smithery.config.json: missing "profileAccessKey" — the optional headless credential field.');
} else if (keyField["x-from"]?.header !== "x-proofable-access-key") {
  addError('smithery.config.json: "profileAccessKey" must forward as header "x-proofable-access-key" (the hosted MCP transport alias).');
}

const byteLength = Buffer.byteLength(raw, "utf8");
if (byteLength > MAX_BYTES) {
  addError(`smithery.config.json: ${byteLength} bytes exceeds Smithery's 1KB limit.`);
}

if (errors.length > 0) {
  console.error("Smithery config validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Smithery config validation passed.");