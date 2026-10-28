# Proofable MCP plugin

The portable proof layer, in every MCP client.

This plugin adds the hosted Proofable MCP server and three workflow skills: `proofable-setup`, `proofable-trust-workflow`, and `proofable-integrate`. Install it, finish sign-in in your client, then ask:

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

Hermes Agent loads the skills from this package. Add the hosted server, then sign in:

```bash
hermes mcp add proofable --url https://mcp.proofable.me/mcp --auth oauth
hermes mcp login proofable
```

Any client that reads Agent Plugins packages can use this folder as is: `plugin.json` declares the package and `skills/` holds the skills. Register `https://mcp.proofable.me/mcp` as a Streamable HTTP MCP server with OAuth.

Keep one Proofable connection per client. Skip the manual `proofable` entry when the plugin or the client's MCP catalog already registered one.

[Set up Proofable](https://docs.proofable.me/mcp/setup) covers every supported client.
