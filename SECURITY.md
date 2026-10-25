# Security

## Report a vulnerability

Email [dev@proofable.me](mailto:dev@proofable.me) instead of opening a public issue. Leave keys, tokens, and private proof content out of the report.

## What this package contains

`@proofable/mcp` publishes the registry manifest (`server.json`), the host plugins, and the public skills. Its `proofable-mcp` command forwards MCP requests to the hosted server and stores nothing. Proofable operates the hosted server at `https://mcp.proofable.me/mcp`; [docs.proofable.me/security](https://docs.proofable.me/security) describes its security posture.

## Authentication model

- **Interactive clients** sign in with hosted OAuth (PKCE, silent refresh). Client config and chat never hold a key.
- **Servers, CI, and headless agents** send a server key (`npk_...`) from `PROOFABLE_ACCESS_KEY` as a Bearer token. Rotate keys under [Access keys](https://proofable.me/profile?tab=account).
- Keep keys out of repositories, screenshots, chat, issue threads, and skill prompts.

## Privacy defaults

The server returns the verification result and the proof record, never the private data used to complete a check. Proofs are private by default; publishing one takes an explicit visibility choice.

## Signing and key custody

You generate and hold your private keys; Proofable never does. Dedicated agent accounts are created in your wallet or secure runtime, and only the public address reaches Proofable. A proof signature is bound to the request it signs and does not work as a bearer token.

## Related

- Wrong tool description: open an [issue](https://github.com/proofable/mcp/issues). The tool fields in `server.json` mirror the hosted server.
- SDK signing and privacy defaults: [proofable/sdk SECURITY.md](https://github.com/proofable/sdk/blob/main/SECURITY.md).
