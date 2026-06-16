# Installing Timekeeper (private DivergeIT marketplace)

Timekeeper ships from a **private** marketplace repo and works in **Claude.ai, Claude Cowork, and Claude Code** — the same marketplace entry powers all three.

- Marketplace: **`divergeit`** · Plugin: **`timekeeper`** (install handle `timekeeper@divergeit`)
- Repo: `https://github.com/patrickking67/claude-marketplace` (private)

## One-time setup per user (token method)

Because the repo is private, each user authenticates once. Two ways:

**A. GitHub CLI (simplest for people who have it)**
```bash
gh auth login        # once, pick HTTPS; Claude Code reuses this credential
```

**B. Personal access token (no GitHub UI needed beyond creating the token)**
1. An admin creates a **read-only** fine-grained PAT scoped to the `claude-marketplace` repo (Contents: Read).
2. The user adds it to their shell profile so background **auto-updates** work without prompts:
   ```bash
   echo 'export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx' >> ~/.zshrc   # or ~/.bashrc
   ```

## Add the marketplace and install

```bash
claude plugin marketplace add patrickking67/claude-marketplace
claude plugin install timekeeper@divergeit
```
Or inside a session: `/plugin marketplace add patrickking67/claude-marketplace` → `/plugin install timekeeper@divergeit`.

In **Cowork / Claude.ai**, add the same marketplace from the Plugins UI and enable **Timekeeper**.

## Updates

- Push changes to the repo, then bump `version` in `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json` (already wired). Users get the new version on `claude plugin marketplace update divergeit` → `claude plugin update`, or automatically at startup when `GITHUB_TOKEN` is set.
- Pin or branch with `@ref` if you later want stable vs. latest channels.

## Org-wide option (optional, later)

To push it to everyone without each person adding it, an admin can declare it in managed/`.claude/settings.json`:
```json
{ "extraKnownMarketplaces": { "divergeit": { "source": { "source": "github", "repo": "patrickking67/claude-marketplace" } } },
  "enabledPlugins": { "timekeeper@divergeit": true } }
```

## Troubleshooting

- **Auth fails:** `gh auth status`; confirm the PAT has Contents:Read on the repo and hasn't expired.
- **No updates appear:** the `version` string must change for users to get an update (or omit `version` to use commit SHA).
- **Validate before pushing:** `claude plugin validate .` from the repo root.
