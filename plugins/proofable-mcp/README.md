# Proofable MCP plugin

Identity, scoped access, and proof for AI agents.

This plugin adds the hosted Proofable MCP server and three workflow skills. Install it, finish sign-in in your client, then ask:

```text
Show my Proofable profile and the proofs I can reuse.
```

## Install

Claude Code:

```text
/plugin marketplace add proofable/mcp
/plugin install proofable-mcp@proofable
```

Cursor reads the bundled `.mcp.json`. Codex loads the skills; register the server with:

```bash
npx -y @proofable/sdk setup --client codex
codex mcp login proofable
```

Keep one Proofable connection per client. Do not add a manual `proofable` entry when the plugin already registered one.

Included skills:

- `proofable-setup`
- `proofable-trust-workflow`
- `proofable-integrate`

See [Set up Proofable](https://docs.proofable.me/mcp/setup) for every supported client.
