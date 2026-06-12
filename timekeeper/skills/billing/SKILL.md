---
name: billing
description: The firm's billing workflow — QA drafted time entries, reconcile against a monthly invoice, find unbilled work, run a month-end cycle across timekeepers, and save the reviewed deliverables to the working folder. Use when someone says review or QA my billing, check this before I import, reconcile against the invoice, what did I forget to bill, find unbilled time, close the month, or run billing for everyone. Never bills automatically — every output is reviewed by a human first.
---

# Billing

Everything between "drafted" and "billed." A bad import is painful to unwind and a misposted or duplicated entry becomes a client fee-objection, so this skill is the gate. Reference `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md` and `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`; honor `<working folder>/Timekeeper.xlsx` (Rates / Mappings / Skips tabs override defaults; the Entries tab is the cross-run ledger for dedup and unbilled-time gaps).

All outputs land in the **working folder** the user chose at setup. No SharePoint publishing.

## Modes (pick from the request)

**Review / QA** — run the `billing-auditor` agent over a draft CSV/workbook: exact matter names, rate correctness (incl. the FTC 90% cases), quantity sanity, duplicates / overlap, description quality, non-billable flags. Return findings as **Blockers / Warnings / Notes** with the fix and a one-line verdict.

**Reconcile against an invoice** — given a monthly invoice (PDF / xlsx), have `billing-auditor` match drafts to billed line items; report billed-but-not-drafted and drafted-but-not-billed.

**Find unbilled time** — read `Timekeeper.xlsx` (Entries tab) to get every drafted entry across runs; identify existing billed hours per day. Flag all days with < 5.0 existing billed hours as target days. Run `activity-miner` over those days; cross-check candidates against the Entries tab (and prior Claude sessions via `conversation_search`) to avoid duplicates. Lead with total recoverable dollars (`rate × hours`) — that's the headline. If the firm has a Clio activities export CSV, ingest it into the Entries tab first as billed-elsewhere rows.

**Month-end cycle** — orchestrate across timekeepers with approval gates: draft each (via `draft-time-entries`) → ⛔ review → audit the combined set (incl. cross-timekeeper duplicates) → reconcile / gap-check → ⛔ approve → save the deliverables to the working folder + a short memo with totals by matter and timekeeper. The gates are the feature; never collapse them.

**Save reviewed deliverables** — produce the deliverable set per `${CLAUDE_PLUGIN_ROOT}/references/output-style.md`:
- CSV for Clio bulk import (`Timekeeper-Entries_<TK>_<start>_<end>.csv`)
- `.xlsx` billing workbook (Summary / Detail / Flags tabs)
- `.pdf` period memo at month-end

All write to the working folder. **Never overwrite** an existing file — version with a `_vN` suffix and say so. Never modify the firm's source files.

## Output

Findings or a roll-up with totals, the file paths written, and clear next steps:
- **Open Clio** — link to `https://app.clio.com/nc/#/activities` for one-off entries.
- **Bulk import** — the CSV path.

Prefer a script for mechanical checks (matter-name validation, duplicate detection) — faster and repeatable. Always end with a human decision point, not an auto-action.
