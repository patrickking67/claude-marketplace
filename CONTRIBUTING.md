# Contributing

Thanks for the interest. This marketplace is maintained by Patrick King for **DivergeIT** clients (currently Jalmar Properties, Inc.). External contributions are welcome but scope is narrow.

## Scope

- **In scope:** bug fixes, M365 connector improvements, billing-format tweaks, new optional connectors (Zoom / Webex / Calendly / etc.), documentation fixes.
- **Out of scope:** anything that writes to a system of record (Clio, SharePoint, etc.) without human review, telemetry, or model-training plumbing.

## Ground rules

- Every billable entry must remain human-reviewed before it's billed. Don't add code paths that bypass review.
- Plugin files are read-only after install. Persistent learned state belongs in the user's working folder (`Timekeeper.xlsx` — Mappings / Rates / Skips tabs), not in this repo.
- No bundled MCP servers. Timekeeper relies on Claude's native connectors (Microsoft 365 required; Zoom / Webex / Calendly optional). No SharePoint write — outputs land in a working folder the user chooses.
- No AI-attribution footers, `Co-Authored-By` trailers, generated-by notices, or bot accounts in commits, PRs, CODEOWNERS, AUTHORS, or package metadata.

## Working on a change

1. **Fork** and branch from `main`. Use a descriptive branch name (`fix/calendar-utc`, `feat/webex-signal`).
2. **Edit** the relevant skill / agent / reference. Match the existing voice — direct, concise, no preamble.
3. **Smoke-test** in Claude Code by installing the local checkout as a marketplace:
   ```
   /plugin marketplace add /path/to/claude-marketplace
   /plugin install timekeeper@DivergeIT
   ```
   Run `timekeeper-setup`, then exercise whatever you changed.
4. **Version bump** in both `.claude-plugin/marketplace.json` and `timekeeper/.claude-plugin/plugin.json` (semver: patch for fixes, minor for new connectors / skills, major for breaking format changes).
5. **Commit** in small, focused units with a clear `why`. Conventional-commit prefixes are welcome but not required.
6. **Open a PR** against `main` describing the change, the surface(s) tested (Claude Code / Cowork / Claude.ai), and any new connector requirements.

## Skills and agents

- Skills go in `timekeeper/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`). The `description` is what the router matches on — make it specific.
- Agents go in `timekeeper/agents/<name>.md`. Pick the model deliberately: Haiku for routing, Sonnet for drafting/QA, Opus for hard judgment (discovery, mining).
- References (`timekeeper/references/`) are progressive-disclosure context loaded by skills as needed.

## Connectors

If you're adding a new connector:
- Default to **optional**. Microsoft 365 stays the only required source.
- Add a row to `timekeeper/CONNECTORS.md` (Surfaces table + Optional list).
- Note it in `timekeeper-setup` so the first-run check can mention it.
- Don't hardcode the MCP tool names — agents should ask for capabilities (e.g. "list recent meetings") so they work across connector implementations.

## Reviews

PRs get a single-reviewer pass from the maintainer. Expect direct feedback. Squash-merge is the default.

## License

By contributing, you agree your contribution is MIT-licensed under the existing license.
