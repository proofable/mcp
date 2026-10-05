# Proofable MCP plugin

Add `https://mcp.proofable.me/mcp` and reuse your profile, agents, and proofs.

`https://mcp.proofable.me/mcp` is the endpoint: it answers the MCP handshake with a `401` challenge, so Cursor, VS Code, Claude Code, and Codex start their own OAuth (DCR + PKCE). The same URL serves server-key Bearer access, so there is one endpoint for every caller.

This plugin registers that endpoint for the hosts that read a plugin-bundled MCP config:

- **Cursor** reads `.mcp.json`, the spec-compliant form.
- **Claude Code** reads `.mcp.json` too.
- **Codex** loads the skills only. Register its server with `npx -y @proofable/sdk setup --client codex`, then `codex mcp login proofable`.

One server name, one file. The plugin ships a single `.mcp.json`; do not add a Cursor-native `mcp.json` beside it. Cursor reads both files independently, so declaring `proofable` in each registers the server twice under one plugin identifier and the duplicate fails every call with `Unauthorized` — the failure that blocked Cursor after the 0.1.2 → 0.1.3 update. `scripts/validate-cursor-mcp.mjs` fails the build if the two files share a server name.

If the host already installed the plugin from a marketplace or registry, do not also add a second `proofable` entry in the host MCP config.

### Manifest fields: keep them

The three manifests are deliberately different. Do not "fix" them:

- `logo` stays in `.claude-plugin/plugin.json` even though `claude plugin validate` reports it as an unknown key. Claude Code ignores it at load time; the plugin directory reads the same file and renders that logo for the listing. Remove it and the listing shows a letter tile instead of the mark.
- `privacyPolicyUrl` stays in `.claude-plugin/plugin.json` for the same reason: the directory reads it for the listing.

Skills in this bundle: `proofable-setup`, `proofable-trust-workflow`, `proofable-integrate`.

## From a terminal

Optional. Writes the same endpoint and installs the public workflow skill when the plugin is not already present:

```bash
npx -y @proofable/sdk setup
```

Docs: [docs.proofable.me/mcp/setup](https://docs.proofable.me/mcp/setup)
