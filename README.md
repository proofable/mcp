# Proofable MCP

[![npm](https://img.shields.io/npm/v/%40proofable%2Fmcp?label=%40proofable%2Fmcp&color=98C0EF)](https://www.npmjs.com/package/@proofable/mcp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Decide what people, organizations, agents, and associations can access or change.

Every decision leaves proof you can inspect and reuse.

Connect Proofable to your AI client. Sign in with OAuth, then check what a person or agent may do before they act.

## Connect

Two paths, one endpoint, one profile:

- **Connect (OAuth):** add the hosted server, click **Connect**, sign in in the browser. Best for interactive clients.
- **Access key:** best for servers, CI, and headless agents. Send a Profile access key as a Bearer token.

Any MCP client:

```json
{
  "mcpServers": {
    "proofable": { "type": "http", "url": "https://mcp.proofable.me/mcp" }
  }
}
```

Servers and automation:

```json
{
  "mcpServers": {
    "proofable": {
      "type": "http",
      "url": "https://mcp.proofable.me/mcp",
      "headers": { "Authorization": "Bearer ${PROOFABLE_ACCESS_KEY}" }
    }
  }
}
```

Create a key at [Access keys](https://proofable.me/profile?tab=account), then `export PROOFABLE_ACCESS_KEY=npk_...` in that environment.

Or let the installer write the same entry for Cursor, Claude Code, Codex, or VS Code:

```bash
npx -y @proofable/sdk setup
```

Then ask: "Load my existing Proofable agents into this project. If I do not have one yet, create or import an agent and set its context and limits."

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

Two paths, one session model: interactive clients Connect with OAuth (PKCE, silent refresh); servers and CI send a Profile access key (`npk_...`) as a Bearer token from `PROOFABLE_ACCESS_KEY`. Same endpoint, same Proofable profile, same tools and policy. Never put a key in client config or chat when Connect works. See [Auth](https://docs.proofable.me/mcp/auth).

## This package

`@proofable/mcp` publishes the registry manifest (`server.json`) and the public skills. It does not run a local server.

```js
import { serverManifest } from '@proofable/mcp';
```

The standards server card (`server.json`, `/.well-known/mcp/server-card.json`) stays OAuth-first.

## Support

- Docs: [docs.proofable.me/mcp/overview](https://docs.proofable.me/mcp/overview)
- Issues: [github.com/proofable/mcp/issues](https://github.com/proofable/mcp/issues)
- Security: [SECURITY.md](./SECURITY.md)

Apache-2.0. Proofable is published by NEUS Network, Inc.
