# Proofable MCP plugin

The trust harness for AI. Identity and governance for the agents you run, in every MCP client.

This plugin adds the hosted Proofable MCP server and the `proofable-setup`, `proofable-trust-workflow`, and `proofable-integrate` workflow skills. Install it, finish sign-in in your client, then ask:

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

Any client that reads Agent Plugins packages can use this folder as is. `plugin.json` declares the package and `skills/` holds the skills. Register `https://mcp.proofable.me/mcp` as a Streamable HTTP MCP server with OAuth.

Keep one Proofable connection per client. Skip the manual `proofable` entry when the plugin or the client's MCP catalog already registered one.

[Set up Proofable](https://docs.proofable.me/mcp/setup) covers every supported client.

## What it connects to

The plugin runs no local code. Its only network endpoint is the hosted Proofable MCP server, signed in with OAuth:

- Claude Code and Cowork: `https://mcp.proofable.me/mcp/claude`, the Claude directory tool set (profile, proofs, verification, agents, jobs, receipts).
- Cursor and other clients: `https://mcp.proofable.me/mcp`.

The skills are Markdown instructions. Tool calls send only the arguments you see to `mcp.proofable.me`; keys and passwords are never requested in chat.

## Privacy

[Privacy policy](https://proofable.me/privacy) · [Terms](https://proofable.me/terms) · [Support](https://proofable.me/contact)
