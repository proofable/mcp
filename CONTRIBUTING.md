# Contributing

**If you are connecting Proofable to an AI client**, use **[docs.proofable.me/mcp/setup](https://docs.proofable.me/mcp/setup)** and the live product first. The table below is for people proposing changes here.

| Need | Where |
| --- | --- |
| Product documentation | [docs.proofable.me](https://docs.proofable.me) |
| Possible bugs | [Issues](https://github.com/proofable/mcp/issues) |
| Ideas and questions | [Discussions](https://github.com/proofable/mcp/discussions) |
| Security reports | [dev@proofable.me](mailto:dev@proofable.me) (do not post publicly) |
| Release notes | [CHANGELOG.md](./CHANGELOG.md) |

## What lives here

Public discovery metadata for the hosted MCP server at `https://mcp.proofable.me/mcp`, plus the host plugins, skills, and runnable examples. The server itself is hosted; this repository publishes how clients find and connect to it.

`server.json` and the tool list are generated from the hosted server. Report a wrong tool description as an issue rather than editing the generated fields by hand.

## What helps

- Bug reports with clear steps to reproduce, the client you used, and no secrets in the thread.
- Host plugin or skill changes that a supported client can install and run today.
- Examples that work against the hosted endpoint without local setup.

To propose a new check, open a PR in [proofable/docs](https://github.com/proofable/docs). For client and CLI changes, use [proofable/sdk](https://github.com/proofable/sdk).

**Do not** share keys, tokens, bearer secrets, or private proof content in public issues or change descriptions.

## Do not commit

These paths are local-only or generated elsewhere (see `.gitignore`):

- `.env`, `.npmrc`, secrets, and key material
- Access keys or OAuth tokens in example configuration

## Describing your change

Explain **what a person connecting an AI client will experience differently** (for example a new host, a renamed tool, or a changed setup step). Keep the README and the setup docs aligned with what the hosted server actually returns.
