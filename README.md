# Proofable MCP

[![npm](https://img.shields.io/npm/v/%40proofable%2Fmcp?label=%40proofable%2Fmcp&color=98C0EF)](https://www.npmjs.com/package/@proofable/mcp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

Give AI agents real access without giving up control.

Connect Proofable once so agents can use your current profile, proofs, permissions, and protected tools across Cursor, Claude, Codex, VS Code, ChatGPT, and other MCP clients.

## Start

Open **[Set up Proofable](https://docs.proofable.me/mcp/setup)**, choose your client, and finish sign-in. Then ask:

```text
Show my Proofable profile and the proofs I can reuse.
```

For a specific requirement:

```text
Check whether I already have the proof needed for this task. Reuse it if it qualifies; otherwise show me the next step.
```

## Connect

Add the hosted endpoint to any MCP client:

```text
https://mcp.proofable.me/mcp
```

Or use a standard MCP configuration:

```json
{
  "mcpServers": {
    "proofable": {
      "type": "http",
      "url": "https://mcp.proofable.me/mcp"
    }
  }
}
```

The optional installer writes the same connection for supported clients:

```bash
npx -y @proofable/sdk setup
```

Claude Code can install the server and workflow skills together:

```text
/plugin marketplace add proofable/mcp
/plugin install proofable-mcp@proofable
```

Install one Proofable connection per client. A marketplace plugin and a manual entry together create a duplicate connection.

## What agents can do

| Outcome | Tools |
|---|---|
| Load the signed-in profile and current context | `proofable_context` |
| Find supported checks and their required inputs | `proofable_verifiers_catalog` |
| Check whether a qualifying proof already exists | `proofable_proofs_check` |
| Reuse a current proof or get the next verification step | `proofable_verify_or_guide` |
| Create or refresh a proof | `proofable_verify` |
| Find and read proofs | `proofable_proofs_get` |
| Update proof metadata or add feedback | `proofable_proofs_update` |
| Check, create, and load agent permissions | `proofable_agent_link`, `proofable_agent_create`, `proofable_agent_mount` |
| Save, list, and revoke encrypted secrets | `proofable_secret_create`, `proofable_secret_list`, `proofable_secret_revoke` |

Call `proofable_context` once after connecting. Proofable then reuses current proofs before starting another verification and returns **Passed**, **Action needed**, or **Blocked**.

See the [MCP tool reference](https://docs.proofable.me/mcp/tools) for inputs and result shapes.

## Servers and automation

Create an access key under [Account → Access keys](https://proofable.me/profile?tab=account), store it as `PROOFABLE_ACCESS_KEY`, and send it as a Bearer token. Keep access keys out of source code, browser bundles, and chat.

```json
{
  "mcpServers": {
    "proofable": {
      "type": "http",
      "url": "https://mcp.proofable.me/mcp",
      "headers": {
        "Authorization": "Bearer ${PROOFABLE_ACCESS_KEY}"
      }
    }
  }
}
```

## Build with Proofable

Use the [Proofable SDK](https://github.com/proofable/sdk) for application code, verification gates, and the CLI. `@proofable/mcp` publishes the MCP registry manifest and public workflow skills; the hosted server runs at `mcp.proofable.me`.

## Support

- [Documentation](https://docs.proofable.me/mcp/overview)
- [Issues](https://github.com/proofable/mcp/issues)
- [Security](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)

Apache-2.0. Proofable is published by NEUS Network, Inc.
