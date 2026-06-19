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

## Restricting to certain users

Two layers control who can actually use Timekeeper:

- **In-plugin allowlist (the gate).** Even where the plugin is enabled, Timekeeper only runs for the Microsoft 365 accounts in [`hooks/allowed-users.txt`](./hooks/allowed-users.txt) — currently **Steve Donell**, **Sarah Bates**, and `ditadmin@jalmar.com` (testing). A SessionStart hook ([`hooks/allowlist-gate.mjs`](./hooks/allowlist-gate.mjs)) checks the signed-in M365 user and declines Timekeeper work for anyone else. To change who's allowed: edit that file, bump the plugin `version`, and push. *Advisory* — it's a guardrail, not a hard boundary (a local user could disable the plugin), so pair it with repo access below.
- **Private-repo access (outer boundary).** The marketplace is a private GitHub repo, so only read-collaborators (or a GitHub **team**) on `patrickking67/claude-marketplace` can add it or install/update. Remove the collaborator/team to revoke. Each user authenticates once with `gh auth login` or a fine-grained PAT (Contents: Read) — see the token method above.
- **Per-user data isolation (automatic).** Timekeeper reads each user's *own* native Microsoft 365 connector, so even with the plugin installed a user only ever sees their own mailbox, calendar, and the SharePoint sites they already have access to.

For a hard "only these devices get it" control instead of the advisory gate, scope the managed-settings `enabledPlugins` block (below) to just those machines via MDM.

## Updates

- Push changes to the repo, then bump `version` in `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json` (already wired). Users get the new version on `claude plugin marketplace update divergeit` → `claude plugin update`, or automatically at startup when `GITHUB_TOKEN` is set.
- Pin or branch with `@ref` if you later want stable vs. latest channels.

## Org-wide deployment (managed settings)

To make Timekeeper an **org plugin** — known and enabled on every managed device without each person adding it — deploy a `managed-settings.json` via your MDM (Intune / Jamf):

| OS | Managed-settings path |
|---|---|
| macOS | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| Linux | `/etc/claude-code/managed-settings.json` |
| Windows | `C:\ProgramData\ClaudeCode\managed-settings.json` |

```json
{
  "extraKnownMarketplaces": {
    "divergeit": { "source": { "source": "github", "repo": "patrickking67/claude-marketplace" } }
  },
  "enabledPlugins": { "timekeeper@divergeit": true }
}
```

This enables Timekeeper for everyone the managed settings reach; the **in-plugin allowlist** (above) then restricts actual *use* to Steve and Sarah. Background auto-updates need `GITHUB_TOKEN` / `GH_TOKEN` in the environment (the repo is private).

- **Lock down sources (optional):** add `"strictKnownMarketplaces"` to the same file to allow only this marketplace and block users from adding others.
- **Scope to specific devices instead:** deploy this file (or just the `enabledPlugins` line) to only Steve's and Sarah's machines via an MDM group for a hard per-device control.

## Troubleshooting

- **Auth fails:** `gh auth status`; confirm the PAT has Contents:Read on the repo and hasn't expired.
- **No updates appear:** the `version` string must change for users to get an update (or omit `version` to use commit SHA).
- **Validate before pushing:** `claude plugin validate .` from the repo root.
