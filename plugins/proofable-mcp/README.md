# Proofable MCP plugin

Add `https://mcp.proofable.me/mcp`, click **Connect**, and reuse your profile, agents, and proofs.

This plugin registers that endpoint for the hosts that read a plugin-bundled MCP config:

- **Cursor** reads `mcp.json`.
- **Claude Code** reads `.mcp.json`.
- **Codex** loads the skills only. Register its server with `npx -y @proofable/sdk setup --client codex`, then `codex mcp login proofable`.

If the host already installed the plugin from a marketplace or registry, do not also add a second `proofable` entry in the host MCP config.

### Why the three manifests differ

Each host reads its own manifest, and their schemas are not interchangeable. Do not collapse them:

- `.cursor-plugin/plugin.json` declares `logo`, because the Cursor plugin schema defines it and renders it. Claude Code's manifest has no icon field in its schema, so `logo` lives here only.
- `.claude-plugin/plugin.json` declares `privacyPolicyUrl`, because the plugin directory reads it for the listing even though Claude Code ignores the field at load time.
- `.codex-plugin/plugin.json` carries the same policy URLs under `interface`, matching Codex's manifest shape.

Skills in this bundle: `proofable-setup`, `proofable-trust-workflow`, `proofable-integrate`.

## From a terminal

Optional. Writes the same endpoint and installs the public workflow skill when the plugin is not already present:

```bash
npx -y @proofable/sdk setup
```

Docs: [docs.proofable.me/mcp/setup](https://docs.proofable.me/mcp/setup)
