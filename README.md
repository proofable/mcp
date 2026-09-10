# Proofable MCP

[![npm](https://img.shields.io/npm/v/%40proofable%2Fmcp?label=%40proofable%2Fmcp&color=98C0EF)](https://www.npmjs.com/package/@proofable/mcp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Hosted MCP server for AI agent identity, permissions, verification, and reusable proof. Connect an AI client, sign in with OAuth, and check what an agent may do before it acts.

## Connect

Add the hosted server to your MCP client, then click **Connect** and sign in:

```json
{
  "mcpServers": {
    "proofable": { "url": "https://mcp.proofable.me/mcp" }
  }
}
```

Or let the installer write the same entry for Cursor, Claude Code, Codex, or VS Code:

```bash
npx -y @proofable/sdk setup
```

Then ask: "Show my Proofable profile and current proofs."

This repository is also a plugin marketplace. In Claude Code:

```text
/plugin marketplace add proofable/mcp
/plugin install proofable-mcp@proofable
```

The plugin registers the server and ships the skills in [`plugins/proofable-mcp`](./plugins/proofable-mcp). Use either the plugin or a manual entry, not both.

## What it does

| Job | Tools |
|---|---|
| Load the signed-in profile and workflow | `proofable_context` (call first) |
| Check, reuse, or create proof | `proofable_proofs_check`, `proofable_verify_or_guide`, `proofable_verify`, `proofable_proofs_get`, `proofable_verifiers_catalog` |
| Give agents an owner and permissions | `proofable_agent_link`, `proofable_agent_create`, `proofable_agent_mount` |
| Store secrets without exposing them | `proofable_secret_create`, `proofable_secret_list`, `proofable_secret_revoke` |

Full reference: [docs.proofable.me/mcp/tools](https://docs.proofable.me/mcp/tools).

## Authentication

Interactive clients sign in with OAuth. Servers and CI use a profile access key in `PROOFABLE_ACCESS_KEY`. Never put a key in client config or chat. See [OAuth](https://docs.proofable.me/mcp/oauth).

## This package

`@proofable/mcp` publishes the registry manifest (`server.json`) and the public skills. It does not run a local server.

```js
import { serverManifest } from '@proofable/mcp';
```

## Support

- Docs: [docs.proofable.me/mcp/overview](https://docs.proofable.me/mcp/overview)
- Issues: [github.com/proofable/mcp/issues](https://github.com/proofable/mcp/issues)
- Security: [SECURITY.md](./SECURITY.md)

Apache-2.0. Proofable is published by NEUS Network, Inc.
