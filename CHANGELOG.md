# Changelog

All notable changes to the Proofable MCP package, plugins, and skills are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Product release notes: [docs.proofable.me/changelog](https://docs.proofable.me/changelog).

## [Unreleased]

### Added

- **Prompt injection test for your own agent.** `examples/injection-test` hides the five AgentDojo attack templates in a note your agent reads, runs the same task under a permission scoped to the task and under a broad one, and grades every run from its signed receipt: whether the model tried the attacker's goal, and whether the permission check refused the call before it ran. The records check offline, and you can plant your own attack text.

### Changed

- **The ChatGPT plugin connects to its own server path.** OpenAI's plugin review rejects tools that pick an operation by ID with a catalog-defined input (the verifier catalog and the three verify tools) and tools that collect credentials (the secret tools). The ChatGPT bundle now points at `https://mcp.proofable.me/mcp/openai`, which serves the remaining eight tools with the same OAuth sign-in; `proofable_verify_or_guide` returns the hosted link whenever a verification step is needed. Cursor, Claude Code, Codex, and every other client keep the full tool list on `/mcp`.

## [0.1.7] - 2026-10-10

### Changed

- Replaced platform-specific marketplace copy with the shared line “Context and control for any AI,” followed by concrete identity, access, tools, and proof details across OpenAI, MCP Registry, npm, Claude, Cursor, and Codex metadata.

## [0.1.6] - 2026-10-08

### Changed

- **One OpenAI plugin listing.** The ChatGPT and Codex plugin had three different short descriptions and three different long descriptions, hand-copied into each listing. They now come from one source, so every listing reads the same: Identity, access, and proof for AI agents.
- **Every listing field stays in step.** A listing change now updates all of them together, so the plugin cannot show different copy in two places.

## [0.1.5] - 2026-10-07

### Changed

- Simplified the README, setup skill, and marketplace copy around one path: connect Proofable, sign in, and ask for a useful result.
- Aligned the package, registry, Claude, Cursor, and Codex metadata on the buyer-facing release description.

### Fixed

- Clarified tool descriptions for profile context, verifier discovery, proof creation, guided verification, and encrypted secret storage.
- Marked proof visibility changes as destructive because making a shared proof private revokes public access.

## [0.1.4] - 2026-10-05

### Fixed

- **Interactive installs start sign-in from the one endpoint.** The endpoint answered an unauthenticated handshake with `200` and the anonymous tool tier, and never sent a sign-in challenge, so Cursor connected anonymously, showed four tools, and never offered a login. An uncredentialed request now returns `401` with a sign-in challenge, so interactive installs (Cursor, VS Code, Claude Code, Codex) start sign-in from the same URL that serves server-key access. `https://mcp.proofable.me/mcp` is the one endpoint; `https://mcp.proofable.me/mcp/oauth` is a retired alias that stays mounted and behaves identically for any config still naming it. The plugin config, the SDK host configs, and the skill copy all register the one endpoint.

## [0.1.3] - 2026-09-28

### Added

- **One description and version everywhere.** The plugin manifests, the marketplace listings and the package all carry the same description and version as the server card.
- **`privacyPolicyUrl` on the Claude plugin manifest**, which the plugin directory reads for the listing. Claude Code itself ignores the field at load time; the plugin README records why the three manifests differ, so they stay separate on purpose.

### Fixed

- **The Cursor plugin no longer registers the server twice.** The plugin shipped both `mcp.json` (Cursor-native) and `.mcp.json` (spec), each declaring the server name `proofable`. Cursor loads both files, so the plugin produced two connections under one name; the duplicate inherited the first one's sign-in state and every call failed with `Unauthorized`, only on Cursor and only after the 0.1.2 to 0.1.3 update. The plugin now ships one file, `.mcp.json`, matching the other marketplace plugins, so the server registers once.
- **The plugin card matches the published description.** The server card carried a stale description for `proofable_proofs_update`; it now reads the same as everywhere else, so the registry, the MCP repo, and the mirror agree.
- **The Claude Code plugin now registers the hosted server.** Claude Code reads MCP servers only from `.mcp.json`; the plugin shipped the Cursor-native `mcp.json`, so installing it added the skills but no server, and "install the plugin, then click Connect" silently needed a second manual registration. The plugin now ships the spec `.mcp.json`, so one install carries the endpoint on both hosts. The two files stay separate on purpose: Cursor's `mcp.json` rejects `type`, Claude's `.mcp.json` requires it.
- **The spec config ships with the plugin.** One plugin install carries the hosted endpoint on both hosts, so a Claude Code install no longer needs a second manual registration.
- **The discovery check no longer reports drift on a Windows checkout.** The sync compared raw bytes, so a clone that checks out these CRLF files with `core.autocrlf` set saw false drift and rewrote four files on every sync, while the same files passed elsewhere. It now compares line-ending-normalized content: same files, no false drift, and no whole-file rewrite when only line endings differ.

## [0.1.2] - 2026-09-24

### Changed

- **Delegated runtime mounts grant nothing without an explicit action list.** The plugin and skill copy describe agent authority as `allowedActions` minus `deniedActions`, with spend bounded by `allowedPaymentTypes` and `maxSpend` and app origins bounded by `allowedOrigins`. The legacy `scope` and `permissions` fields no longer appear in tool descriptions or examples.
- **All public skills live in one place.** `proofable-setup` moved from the plugin bundle into `skills/`, so the plugin bundle and `@proofable/sdk` ship the same skill content.
- **The skill copies cannot silently drift apart.** A mismatch between the plugin bundle and the SDK package is reported as a defect to fix, not carried into a release.
- **The three marketplace listings stay identical.** The Claude, Codex and Cursor listings read one `marketplace.json`, so a listing change reaches every marketplace.
- **README install paths deduplicated.** One Claude Code plugin-install block; the one-click installer and `npx -y @proofable/sdk setup` remain the single entry for every other client.

### Upgrade

```bash
npm install @proofable/mcp@0.1.2
npx -y @proofable/sdk setup
```

## [0.1.1] - 2026-09-13

### Added

- **One description for the package and every registry.** Package, npm, Official MCP Registry, Smithery, and the host plugin manifests share one description: Give AI agents identity, scoped access, trusted context, and verifiable actions through MCP.
- **README opens with the GitHub line.** Give AI agents verified identity, scoped permissions, and reusable proof through one MCP.

### Changed

- **Twelve public tools, documented.** Every `proofable_*` tool carries safety annotations, and `tools/list` returns one stable order.
- **One endpoint serves two MCP protocol dates.** Hosted MCP runs the MCP TypeScript SDK v2 packages and answers both `2026-07-28` and `2025-11-25` clients.
- **Proofable no longer holds agent private keys.** Dedicated agent accounts are created in your wallet or runtime; only the public address reaches Proofable.
- **Registry publishing is reproducible.** Every release is published the same way, so a published artifact can be rebuilt and checked.
- **The integrate skill teaches inline gates.** `defineGate` with subject `gateCheck` gates a page without a published listing. MCP connect stays OAuth; API calls stay x402.

### Upgrade

```bash
npm install @proofable/mcp@0.1.1
npx -y @proofable/sdk setup
```

## [0.1.0] - 2026-09-06

First Proofable MCP discovery package and public plugin release. The predecessor `@neus/mcp-server` 1.x releases remain on npm as history.

### Added

- **Hosted connection.** One OAuth endpoint at `https://mcp.proofable.me/mcp`.
- **Public tools.** The twelve `proofable_*` MCP tools documented on [docs.proofable.me/mcp](https://docs.proofable.me/mcp/overview).
- **Plugins and skills.** Plugin manifests and skills for Claude Code, Codex, and Cursor, including the trust workflow skill.

### Changed

- **Package identity.** `@neus/mcp-server` is now `@proofable/mcp`. The package publishes discovery metadata only; the hosted server runs on Proofable.
- **MCP config key.** The server key in client MCP config is `proofable` (was `neus`). Remove a stale `neus` key after upgrading.

### Upgrade

```bash
npx -y @proofable/sdk setup
```

Then re-register the hosted endpoint and sign in once: [Migration guide](https://docs.proofable.me/migrate).

<!-- Historical archive: the predecessor @neus/mcp-server package this release replaces. -->
<!-- Full release-by-release notes: https://github.com/proofable/network/blob/neus-final/CHANGELOG.md -->
<!-- npm: https://www.npmjs.com/package/@neus/mcp-server -->

## History: @neus/mcp-server

The `@proofable/mcp` package continues the line published as `@neus/mcp-server`. The notes below are the user-facing highlights of each predecessor release. The complete record stays with the predecessor package on npm and in the archived source at [proofable/network](https://github.com/proofable/network) under the `neus-final` tag.

| Release | Date | What it changed for someone connecting a client |
| --- | --- | --- |
| [1.3.9](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.9) | 2026-08-13 | Removed the OAuth browser command-injection sink: authorization URLs open through fixed executables, never a shell. Registry scanning scoped to the MCP package so published metadata includes the Apache-2.0 license. Retired the `neus import` / `neus export` / `neus revoke` alias paths. Restored `neus-trust-workflow` in the `neus-mcp` plugin bundle. |
| [1.3.8](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.8) | 2026-07-30 | Added RFC 9207 issuer validation to `neus setup` and `neus auth`, closing an authorization-code interception path. Removed the retired `neus-trust` plugin fallback. |
| [1.3.7](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.7) | 2026-07-30 | Restored one-click plugin install in Cursor, and normalized the RFC 8707 `resource` parameter so canonicalizing clients stop failing with `invalid_target`. |
| [1.3.6](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.6) | 2026-07-30 | The `neus-mcp` plugin became the MCP registration owner in Cursor while the CLI defers to it, ending duplicate `neus` entries. The trust-workflow skill moved into the package as its single home. |
| [1.3.5](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.5) | 2026-07-21 | Aligned the optional ZKPassport dependency with the hosted verifier runtime patch (0.16.1). |
| [1.3.4](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.4) | 2026-07-21 | Added offline portable-proof verification (EIP-191, Ed25519, provider-backed EIP-1271) with strict canonical JSON, and a CAIP-380 interoperability fixture. |
| [1.3.3](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.3) | 2026-07-16 | ZKPassport 0.16 alignment. `neus setup` warns when both the plugin and a manual `neus` entry are present. `neus doctor --live` reports handle, wallet, proof count, and mounted agent. Tag pushes now publish matching GitHub Releases. |
| [1.3.2](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.2) | 2026-07-09 | Restored one-click Cursor marketplace install (the plugin again ships the required MCP config). Sharpened the trust-workflow skill and aligned docs and examples with the live assistant guidance. |
| [1.3.1](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.1) | 2026-07-08 | `neus mount` and `@neus/sdk/runtime-mount` became the supported path for loading a Trusted Agent into a project. |
| [1.3.0](https://www.npmjs.com/package/@neus/mcp-server/v/1.3.0) | 2026-07-08 | Added `llms.txt` and `pricing.txt` for AI search, opened docs to AI crawlers, published the Codex plugin metadata, and tightened the public SDK surface. |
| [1.2.5](https://www.npmjs.com/package/@neus/mcp-server/v/1.2.5) | 2026-07-03 | One plugin install path for every tool, with a refreshed marketplace mark. |
| [1.2.4](https://www.npmjs.com/package/@neus/mcp-server/v/1.2.4) | 2026-06-23 | SDK, MCP server, plugin, and trust-workflow skill report one version: 1.2.4. |
| [1.2.3](https://www.npmjs.com/package/@neus/mcp-server/v/1.2.3) | 2026-06-21 | VS Code joined `neus setup` and the install docs. `neus doctor --live` works with browser OAuth sessions, and a sign-in challenge counts as reachable, not down. |
| [1.2.2](https://www.npmjs.com/package/@neus/mcp-server/v/1.2.2) | 2026-06-21 | OAuth docs now match the real editor sign-in flow, and Cursor setup stopped warning about a stale local token format. |
| [1.2.1](https://www.npmjs.com/package/@neus/mcp-server/v/1.2.1) | 2026-06-18 | Clean installs include the CLI and agent-context modules, and Node-only adapters left the main entry point for browser builds. |
| [1.2.0](https://www.npmjs.com/package/@neus/mcp-server/v/1.2.0) | 2026-06-18 | Added agent context mount: `neus mount <agentId>` writes project context for Cursor, Claude Code, or Codex, `neus_agent_mount` loads it in-session, and `neus doctor --live` reports readiness. |
| [1.1.7](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.7) | 2026-06-16 | Fixed gate checkout paths and proof revocation response parsing. |
| [1.1.6](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.6) | 2026-06-12 | Fixed a Node ESM crash in `neus auth` browser sign-in. `neus setup --oauth` forces browser sign-in even when an access key is present. |
| [1.1.5](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.5) | 2026-06-07 | One install path across README, install, MCP, plugin, and SDK, leading with portable proofs. Removed the redundant per-host install files. |
| [1.1.3](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.3) | 2026-06-05 | Install docs start from hosted MCP setup with platform cards, and the Claude Code plugin loads the trust workflow skill correctly. |
| [1.1.2](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.2) | 2026-06-04 | Added `@neus/sdk/mcp-hosts` helpers for MCP install URLs, setup commands, and editor deep links. `neus import --from auto` prefers Claude Code, Cursor, and Claude Desktop. |
| [1.1.1](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.1) | 2026-05-28 | `neus_context` returns the current profile when connected, and `neus setup` writes the correct config path for each editor. |
| [1.1.0](https://www.npmjs.com/package/@neus/mcp-server/v/1.1.0) | 2026-05-26 | First public MCP release: OAuth-first setup (`neus setup`, `neus auth`, `neus doctor --live`), the `@neus/mcp-server` npm package, public tools including encrypted Vault secrets, and the Claude Code marketplace plugin with the trust workflow skill. |
| [1.0.12](https://www.npmjs.com/package/@neus/mcp-server/v/1.0.12) | 2026-05-26 | First `@neus/sdk` release with the hosted MCP CLI and OAuth browser flow. |

[Unreleased]: https://github.com/proofable/mcp/compare/v0.1.7...HEAD
[0.1.7]: https://github.com/proofable/mcp/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/proofable/mcp/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/proofable/mcp/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/proofable/mcp/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/proofable/mcp/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/proofable/mcp/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/proofable/mcp/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/proofable/mcp/releases/tag/v0.1.0
