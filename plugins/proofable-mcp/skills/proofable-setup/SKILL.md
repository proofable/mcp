---
name: proofable-setup
description: Install Proofable on this host, sign in, and reuse profile, proofs, listings, and agents.
license: Apache-2.0
compatibility: Requires an MCP-capable client that can register a remote HTTP server.
---

# Connect Proofable

Proofable MCP is the hosted connection for any chat, IDE, or job runtime. Same profile, proofs, listings, permissions, and private context.

Install Proofable, then click **Connect**:

`https://mcp.proofable.me/mcp`

If this host already has the Proofable plugin, install that and click **Connect**. Do not also write a second `proofable` entry.

Have the CLI?

```bash
proofable setup
```

After Connect, call `proofable_context`. Reuse proofs before a new check. Summarize as Passed, Action needed, or Blocked.

Create or import an agent with `proofable_agent_create` when needed. Default is the signed-in profile. Use `generate` only for a dedicated spend key. Open **Connections** on proofable.me to link apps.

To sell: set payouts at https://proofable.me/profile?tab=treasury, then create a listing at https://proofable.me/profile/portals/new (type, checks, price, Listed). Job placeholders become buyer inputs. Buyers connect apps at checkout.

Full page: https://docs.proofable.me/mcp/setup

Optional project mount (`cursor`, `claude`, or `codex`):

```bash
proofable mount <agentId> --apply cursor
```
