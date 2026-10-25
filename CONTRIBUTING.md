# Contributing

By participating you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md). To connect Proofable to an AI client, start at [docs.proofable.me/mcp/setup](https://docs.proofable.me/mcp/setup).

| Need | Where |
| --- | --- |
| Product documentation | [docs.proofable.me](https://docs.proofable.me) |
| Possible bugs | [Issues](https://github.com/proofable/mcp/issues) |
| Ideas and questions | [Discussions](https://github.com/proofable/mcp/discussions) |
| Security reports | [dev@proofable.me](mailto:dev@proofable.me) (do not post publicly) |
| Release notes | [CHANGELOG.md](./CHANGELOG.md) |

## What lives here

The registry manifest for the hosted MCP server at `https://mcp.proofable.me/mcp`, the host plugins, the workflow skills, and runnable examples. The tool fields in `server.json` mirror the hosted server, so report a wrong tool description as an issue instead of editing them.

Propose a new check in [proofable/docs](https://github.com/proofable/docs). Client and CLI changes belong in [proofable/sdk](https://github.com/proofable/sdk).

## What helps

- Bug reports with steps to reproduce and the client you used.
- Plugin or skill changes that a supported client can install and run today.
- Examples that run against the hosted endpoint without local setup.

Keep access keys, OAuth tokens, `.env` and `.npmrc` files, and private proof content out of issues, pull requests, commits, and example configuration.

## Changelog

Add a note under `## [Unreleased]` in [CHANGELOG.md](./CHANGELOG.md), grouped as Added, Changed, Deprecated, Removed, Fixed, or Security. Describe what a person connecting an AI client will notice, such as a new host, a renamed tool, or a changed setup step. Leave out ticket IDs and process notes. Keep the README and setup docs matching what the hosted server returns.
