# Security

## Report a vulnerability

Email [dev@proofable.me](mailto:dev@proofable.me). Do not file security reports as public issues, and do not include keys, tokens, bearer secrets, or private proof content in the report thread.

## What this package is

`@proofable/mcp` publishes discovery metadata (`server.json`), the host plugins, and the public skills. It does not run a server, hold credentials, or process proof bodies. The hosted MCP server at `https://mcp.proofable.me/mcp` is operated by Proofable; its security posture is documented at [docs.proofable.me/security](https://docs.proofable.me/security).

## Authentication model

- **Interactive clients** sign in with hosted OAuth (PKCE, silent refresh). No key is stored in client config or chat.
- **Servers, CI, and headless agents** send a Profile access key (`npk_...`) as a Bearer token from `PROOFABLE_ACCESS_KEY`. Keep access keys out of repositories, screenshots, and public threads; rotate from [Access keys](https://proofable.me/profile?tab=account).
- Never paste keys into chat, issue threads, or skill prompts.

## Privacy defaults

The server returns the verification result and the proof record. It does not return the private data used to complete a check. Proofs are private by default; publication requires an explicit visibility choice.

## Signing and key custody

Proofable does not generate or hold private keys. Dedicated agent accounts are created in your wallet or secure runtime; only the public address is passed to Proofable. Proof signatures are request-bound, not bearer tokens.

## Scope of this repository

- `server.json` and the tool list are generated from the hosted server. Report a wrong tool description as an issue rather than editing the generated fields.
- SDK signing and privacy defaults: [proofable/sdk SECURITY.md](https://github.com/proofable/sdk/blob/main/SECURITY.md).
- Docs security and privacy material: [proofable/docs](https://github.com/proofable/docs).