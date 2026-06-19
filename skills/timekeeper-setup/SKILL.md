---
name: timekeeper-setup
description: First-run setup and health check for Timekeeper. Use when someone installs the plugin, says set up Timekeeper, check my connectors, is this configured, get started, or before the first run. Verifies the Microsoft 365 (and optional SharePoint write) connectors, confirms the working folder, and creates the learned-mappings.md overlay the plugin learns from.
---

# Timekeeper setup

Get a new install ready and confirm the pieces are in place before anyone trusts a draft. Friendly and quick — this is someone's first impression.

## Checklist

1. **Connectors** (see `${CLAUDE_PLUGIN_ROOT}/CONNECTORS.md`):
   - **Microsoft 365 (required, read):** confirm it's connected and can see mail/calendar/Teams. Smoke-test by listing a couple of recent calendar events and reporting what you see. If it's missing, walk them through connecting it — nothing works without it.
   - **SharePoint/OneDrive write (optional):** check for a write-capable Microsoft connector (`Files.ReadWrite`/`Sites.ReadWrite`) and the `automation` site's `Billing Drafts/` folder. With it, reviewed output (CSV + workbook + memo) auto-publishes there by period (see `CONNECTORS.md`); without it, drafts save locally until it's connected.
   - **No Clio or legal-research connectors** — Timekeeper hands off to Clio via the import CSV; nothing else is bundled.
2. **Working folder** — confirm where drafts and the learnings file should live (default: the active project folder).
3. **Create `learned-mappings.md`** in the working folder if it doesn't exist (template below). Plugin files are read-only after install, so confirmed knowledge accumulates here and is read first by the miner, drafter, and auditor.
4. **Surface** — Timekeeper runs in Claude.ai, Cowork, and Claude Code. Review renders as cards in Cowork and as a table elsewhere; everything else is identical.

## learned-mappings.md template

```markdown
# Learned mappings (Timekeeper)
Confirmed knowledge that overrides the bundled defaults. Edit freely.

## Timekeepers & rates
| Timekeeper | Default rate | Matter-specific rates / notes |
|---|---|---|
| <name> | <rate> | <matter>: <rate> (e.g., FTC matters × 0.90) |

## Contact / entity → matter
| Signal (email, domain, name, property) | Matter (exact) |
|---|---|
| <person@firm.com> | <exact matter name> |

## Skip rules (never bill)
- <recurring internal meeting / newsletter / sender>
```

## Output

A short status: each connector ✅/⚠️/❌ with what to do about any gap, the confirmed working folder, and confirmation that `learned-mappings.md` exists. For passwords, account access, or the Keeper password manager, point them to the firm's IT support provider. End by pointing them at `time-entry` ("say: draft my time for last week") for their first run.
