# Proofable MCP

[![npm](https://img.shields.io/npm/v/%40proofable%2Fmcp?label=%40proofable%2Fmcp&color=98C0EF)](https://www.npmjs.com/package/@proofable/mcp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

The portable proof layer, in every MCP client.

Connect Proofable once, and your agents can use your profile, proofs, permissions, and protected tools in Cursor, Claude, Codex, VS Code, ChatGPT, and any other MCP client.

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

Add `https://mcp.proofable.me/mcp` to any MCP client, or use a standard MCP configuration:

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

The installer writes the same connection for supported clients:

```bash
npx -y @proofable/sdk setup
```

Claude Code installs the server and the workflow skills together:

```text
/plugin marketplace add proofable/mcp
/plugin install proofable-mcp@proofable
```

Keep one Proofable connection per client. A marketplace plugin plus a manual entry creates a duplicate.

## What agents can do

| Outcome | Tools |
|---|---|
| Load the signed-in profile and current context | `proofable_context` |
| Find supported checks and their required inputs | `proofable_verifiers_catalog` |
| Check whether a qualifying proof already exists | `proofable_proofs_check` |
| Reuse a current proof or get the next verification step | `proofable_verify_or_guide` |
| Create or refresh a proof | `proofable_verify` |
| Prepare and submit a check needing another signer | `proofable_verify_prepare`, `proofable_verify_submit` |
| Find and read proofs | `proofable_proofs_get` |
| Update proof metadata or add feedback | `proofable_proofs_update` |
| Check, create, and load agent permissions | `proofable_agent_link`, `proofable_agent_create`, `proofable_agent_mount` |

Call `proofable_context` once after connecting. Proofable reuses current proofs before starting another verification and returns **Passed**, **Action needed**, or **Blocked**.

The [MCP tool reference](https://docs.proofable.me/mcp/tools) lists every tool with its inputs and result shapes.

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

## Examples

- [Prompt injection test](./examples/injection-test): hides AgentDojo attacks in a note your agent reads, runs the task under a scoped and a broad permission, and grades every run from its signed receipt.
- [Guarded agent action](./examples/guarded-agent-action): makes one permission decision before host code runs a tool.

## Build with Proofable

Use the [Proofable SDK](https://github.com/proofable/sdk) for application code, verification gates, and the CLI. This package carries the MCP registry manifest, the host plugins, and the workflow skills; the server runs at `https://mcp.proofable.me/mcp`.

## Support

- [Documentation](https://docs.proofable.me/mcp/overview)
- [Issues](https://github.com/proofable/mcp/issues)
- [Security](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)

Apache-2.0. Proofable is published by NEUS Network, Inc.
