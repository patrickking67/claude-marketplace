# Timekeeper

**A Microsoft 365-native legal practice assistant.** Reconstruct billable time, review billing, look up matters and contacts, search across M365, parse documents, and get IT support — all human-reviewed, with no writes to any system of record.

> Built by **Patrick King** for **Jalmar Properties, Inc.** Runs in **Claude.ai, Claude Cowork, and Claude Code**. No Clio connection required.

---

## What it does

You tell Timekeeper *who* and *what dates*; it mines Outlook, Teams, and calendar, maps work to the firm's matters and rate card, drafts court-defensible entries in the firm's exact billing format, shows them for review, and produces an import-ready CSV plus a polished billing workbook (and a sign-off memo at month-end). Around that core it also handles matter and contact lookup, calendar review, enterprise search, document parsing, billing QA, and IT support. A human reviews everything before it's billed.

## Skills

| Skill | What it does |
|---|---|
| `draft-time-entries` | The main interactive workflow — interview, confirm, mine M365, review, export CSV + workbook |
| `billing` | QA drafts, reconcile against an invoice, find unbilled time, run month-end, publish |
| `matters` | Find and confirm the right matter from the current matter list + M365 signals |
| `contacts` | Look up and organize clients, counsel, and vendors |
| `search` | One-query enterprise search across Outlook, Teams, calendar, SharePoint + provided docs |
| `calendar` | Review and plan from the M365 calendar; surface deadlines and billable events |
| `documents` | Parse and produce xlsx, docx, pptx, pdf (invoices, workbooks, contracts, reports) |
| `timekeeper-setup` | First-run connector check + the `learned-mappings.md` overlay |
| `billing-best-practices` | Defensible-billing + § 330 + legal-AI ethics + company-data governance |
| `it-support` | IT support — access, accounts, and the Keeper password manager |

## Agents

| Agent | Model | Role |
|---|---|---|
| `timekeeper-router` | Haiku | Fast triage — pick the workflow, gather inputs |
| `activity-miner` | Opus | Deep M365 discovery → cited candidate entries |
| `entry-drafter` | Sonnet | Candidates → formatted entries in the firm's voice |
| `billing-auditor` | Sonnet | QA + invoice reconciliation → findings by severity |

Discovery runs on Opus (hardest judgment), routing on Haiku (cheap/frequent), the middle on Sonnet.

## Connectors

Microsoft 365 (required, read) and SharePoint/OneDrive (optional, write). No Clio or legal-research connectors — see [`CONNECTORS.md`](./CONNECTORS.md).

## Install

Skills + agents, plus a bundled read-only Microsoft 365 MCP server (`@softeria/ms-365-mcp-server`, started on demand via `npx` — requires Node 18+). No build step.

- **Cowork:** open `Timekeeper.plugin`, click **Save plugin**.
- **Claude Code:** `claude /plugin marketplace add <this folder>` then `claude /plugin install timekeeper@claude-marketplace`.
- **Claude.ai:** add the skills to your workspace.

Then connect Microsoft 365 (read) — the only requirement:

- **Claude Code:** the bundled `ms365` server runs locally; on first use it prompts a one-time device-code sign-in (run the `login` tool / `/mcp`). It's launched in `--org-mode --read-only`, so it never sends mail or changes anything in M365.
- **Cowork / Claude.ai:** connect the hosted Microsoft 365 connector instead — the skills are connector-agnostic and use whichever M365 source is present.

Reviewed output saves to the working folder or, with a write-capable Microsoft connector, publishes to the firm's SharePoint site (see [`CONNECTORS.md`](./CONNECTORS.md)).

## How it learns

Plugin files are read-only after install, so Timekeeper keeps `learned-mappings.md` in your working folder — confirmed contact→matter mappings, timekeeper rates, and skip rules accumulate there. `timekeeper-setup` creates it.

## Company data & support

Timekeeper follows the firm's data-handling rules (see `billing-best-practices`): high-sensitivity defaults, describe-the-work-not-the-content for privilege, no model training on firm data, and escalation paths. The firm's password manager is **Keeper** — request access through IT support (see `it-support`).

## License

MIT.
