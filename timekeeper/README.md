# Timekeeper

**A Microsoft 365-native legal practice assistant.** Reconstruct billable time, review billing, look up matters and contacts, search across M365, parse documents, and reach the help desk — all human-reviewed, with no writes to any system of record.

> Built by **Patrick King** for **Jalmar Properties, Inc.** Runs in **Claude.ai, Claude Cowork, and Claude Code**. No Clio connection required.

---

## What it does

You tell Timekeeper *who* and *what dates*; it mines Outlook (Inbox / Sent / Deleted), calendar, Teams (chat / calls / transcripts), SharePoint / OneDrive, and any connected Zoom / Webex / Calendly. It maps work to the firm's matters and rate card, applies § 330 + no-block-billing + the firm's per-case policies, drafts entries in the firm's voice, and shows them as cards for review. Approved entries write to your working folder as a Clio-import CSV and (for week-scale runs) a polished `.xlsx` workbook. From the review surface you can hop straight to Clio's New Time Entry page for one-off entries, or bulk-import the CSV. A human reviews everything before it's billed.

## Skills

| Skill | What it does |
|---|---|
| `draft-time-entries` | The main workflow — interview, confirm, mine M365, review cards, export CSV + workbook to the working folder, Clio button |
| `billing` | QA drafts, reconcile against an invoice, find unbilled time, run month-end |
| `matters` | Find and confirm the right matter from the rates file + M365 signals |
| `contacts` | Look up and organize clients, counsel, and vendors |
| `search` | One-query enterprise search across Outlook, Teams, calendar, SharePoint + provided docs |
| `calendar` | Review and plan from the M365 calendar; surface deadlines and billable events |
| `documents` | Parse and validate xlsx, csv, docx, pptx, pdf — and produce them |
| `timekeeper-setup` | Five-minute first-run: confirm install, M365 check, optional Zoom, pick a folder, done |
| `billing-best-practices` | Defensible-billing + § 330 + legal-AI ethics (ABA 512) + company-data governance |
| `help-desk` | Prints the DivergeIT Help Desk card (phone / email / portal) for any IT request |

## Agents

| Agent | Model | Role |
|---|---|---|
| `timekeeper-router` | Haiku | Fast triage — pick the workflow, gather inputs |
| `activity-miner` | Opus | Deep M365 discovery (all 7 sources, Pacific-time boundaries) → cited candidate entries |
| `entry-drafter` | Sonnet | Candidates → formatted entries in the firm's voice + Clio-compliant CSV |
| `billing-auditor` | Sonnet | QA + invoice reconciliation → findings by severity |

Discovery runs on Opus (hardest judgment), routing on Haiku (cheap / frequent), the middle on Sonnet.

## Connectors

**Required:** Microsoft 365 (Claude's native connector, read).
**Optional:** Zoom, Webex, Calendly (Claude built-ins) for extra meeting / scheduling signal.

No Clio, SharePoint-write, or legal-research connectors. See [`CONNECTORS.md`](./CONNECTORS.md).

## Install

Skills + agents only. No bundled MCP, no Node dependency, no build step.

- **Claude Code:** `claude /plugin marketplace add patrickking67/claude-marketplace` then `claude /plugin install timekeeper@DivergeIT`.
- **Cowork:** open `Timekeeper.plugin`, click **Save plugin**.
- **Claude.ai:** add the skills to your workspace.

Then enable Claude's **Microsoft 365** connector (read) — the only requirement. Optionally add **Zoom**, **Webex**, or **Calendly** if your firm uses them. Timekeeper reads whichever sources are connected and ignores the rest.

## Output

Everything writes to a **working folder** you pick during `timekeeper-setup` (existing or new):

- `Timekeeper-Entries_<TK>_<start>_<end>.csv` — Clio bulk import.
- `Billing-Workbook_<TK>_<period>.xlsx` — reviewer's workbook (Summary / Detail / Flags tabs).
- `Billing-Memo_<period>.pdf` — month-end sign-off summary (on request).
- `Timekeeper.xlsx` — your persistent log + knowledge store (Entries / Mappings / Rates / Skips tabs); created at setup and appended to on every run.

From the review surface, click **Open Clio** (`https://app.clio.com/nc/#/activities`) for one-off entries, or bulk-import the CSV.

## How it learns

Plugin files are read-only after install, so Timekeeper keeps `Timekeeper.xlsx` in your working folder — every drafted entry, plus confirmed contact→matter mappings, per-user rates, and skip rules accumulate across its tabs. `timekeeper-setup` creates it; every run reads it first and appends to it.

## Company data & support

Timekeeper follows the firm's data-handling rules (see `billing-best-practices`): high-sensitivity defaults, describe-the-work-not-the-content for privilege, no model training on firm data, and escalation paths. For any IT issue — password reset, MFA, Keeper access, account locked — invoke `help-desk`.

## License

MIT.
