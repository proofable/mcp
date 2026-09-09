# Proofable MCP

**The portable trust harness.**

One hosted connection carries agent identity, authority, selected context, connections, limits, and current proof into Cursor, Claude, Codex, and other supported MCP clients.

- Server: `https://mcp.proofable.me/mcp`
- Setup: `npx -y @proofable/sdk setup`
- Documentation: [docs.proofable.me/mcp/overview](https://docs.proofable.me/mcp/overview)
- Package: [`@proofable/mcp`](https://www.npmjs.com/package/@proofable/mcp)

`proofable_proofs_check` answers eligibility only. It is never a memory,
context, or content retrieval tool. Start with `proofable_context`; retrieve an
exact referenced record with `proofable_proofs_get` and `include: "content"`.

This package publishes discovery metadata for the hosted service. It does not start a local server. This repository also owns the public plugins, skills, examples, and installation guidance.
