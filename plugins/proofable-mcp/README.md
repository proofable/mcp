# proofable-mcp

Add `https://mcp.proofable.me/mcp`, click **Connect**, and reuse your profile, agents, and proofs.

This plugin registers that URL. If the host already installed the plugin from a marketplace or registry, do not also add a second `proofable` entry in the host MCP config.

Skills in this bundle: `proofable-setup`, `proofable-trust-workflow`, `proofable-integrate`.

## From a terminal

Optional. Writes the same endpoint and installs the public workflow skill when the plugin is not already present:

```bash
npx -y -p @proofable/sdk proofable setup
```

Docs: [docs.proofable.me/mcp/setup](https://docs.proofable.me/mcp/setup)
