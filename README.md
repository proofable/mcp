# Proofable MCP

Carry identity, private context, permissions, and proof across AI tools with one hosted MCP connection. Proofable lets an owner keep agents and their approved stack intact when the model, editor, or runtime changes.

- Server: `https://mcp.proofable.me/mcp`
- Setup: `npx -y -p @proofable/sdk proofable setup`
- Documentation: [docs.proofable.me/mcp/overview](https://docs.proofable.me/mcp/overview)
- Package: [`@proofable/mcp-server`](https://www.npmjs.com/package/@proofable/mcp-server)

`proofable_proofs_check` answers eligibility only. It is never a memory,
context, or content retrieval tool. Start with `proofable_context`; retrieve an
exact referenced record with `proofable_proofs_get` and `include: "content"`.

This package publishes discovery metadata for the hosted service. It does not start a local server. This repository also owns the public plugins, skills, examples, and installation guidance.

