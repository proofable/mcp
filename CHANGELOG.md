# Changelog

All notable changes to the Proofable MCP package, plugins, and skills are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Product release notes: [docs.proofable.me/changelog](https://docs.proofable.me/changelog).

## [Unreleased]

(nothing yet)

## [0.1.0] - 2026-09-06

First Proofable MCP discovery package and public plugin release. The predecessor `@neus/mcp-server` 1.x releases remain on npm as immutable history.

### Added

- **Hosted connection.** One OAuth endpoint for identity, context, permissions, proofs, and guarded actions at `https://mcp.proofable.me/mcp`.
- **Public tools.** The twelve `proofable_*` MCP tools documented on [docs.proofable.me/mcp](https://docs.proofable.me/mcp/overview).
- **Plugins and skills.** Plugin manifests and skills for Claude Code, Codex, and Cursor, including the trust workflow skill.

### Changed

- **Package identity.** `@neus/mcp-server` is now `@proofable/mcp`. The package publishes discovery metadata only; the hosted server runs on Proofable infrastructure.
- **MCP config key.** The server key in client MCP config is `proofable` (was `neus`). Remove a stale `neus` key after upgrading.

### Upgrade

```bash
npm install @proofable/mcp
```

Then re-register the hosted endpoint and sign in once: [Migration guide](https://docs.proofable.me/migrate).

### Links

- [MCP overview](https://docs.proofable.me/mcp/overview)
- [Migrate from @neus](https://docs.proofable.me/migrate)
- [npm: @proofable/mcp](https://www.npmjs.com/package/@proofable/mcp)