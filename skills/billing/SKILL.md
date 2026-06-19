---
name: billing
description: The firm's billing workflow — QA drafted time entries, reconcile against a monthly invoice, find unbilled work, run a month-end cycle across timekeepers, and publish the reviewed file. Use when someone says review or QA my billing, check this before I import, reconcile against the invoice, what did I forget to bill, find unbilled time, close the month, run billing for everyone, or publish/save the drafts. Never bills automatically — every output is reviewed by a human first.
---

# Billing

Everything between "drafted" and "billed." A bad import is painful to unwind and a misposted or duplicated entry becomes a client fee-objection, so this skill is the gate. Reference `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md` and `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`; honor `learned-mappings.md`. The Clio reports that feed QA and reconciliation (billing history, AR aging, client productivity) are mapped in `${CLAUDE_PLUGIN_ROOT}/references/clio-exports.md`.

## Modes (pick from the request)

**Review / QA** — run the `billing-auditor` agent over a draft CSV/workbook: exact matter names, rate correctness (incl. the FTC 90% cases), quantity sanity, duplicates/overlap, description quality, non-billable flags. Return findings as **Blockers / Warnings / Notes** with the fix and a one-line verdict.

**Reconcile against an invoice** — given a monthly invoice (PDF/xlsx), have `billing-auditor` match drafts to billed line items; report billed-but-not-drafted and drafted-but-not-billed.

**Find unbilled time** — run `activity-miner` over the period, diff against a billed export or prior draft, and report the gaps with confidence and a `rate × hours` dollar estimate. Lead with total recoverable dollars — that's the headline. Without a baseline you can only list activity, not find gaps, so ask for one.

**Month-end cycle** — orchestrate across timekeepers with approval gates: draft each (via `time-entry`) → ⛔ review → audit the combined set (incl. cross-timekeeper duplicates) → reconcile/gap-check → ⛔ approve → publish + a short memo with totals by matter and timekeeper. The gates are the feature; never collapse them.

**Publish** — only publish reviewed entries. Produce the deliverable set per `${CLAUDE_PLUGIN_ROOT}/references/output-style.md` — CSV (import) + the **billing workbook** (`.xlsx`), plus a period **memo** at month-end — and publish to the `automation` SharePoint site at `Billing Drafts/<YYYY>/<MM - Month>/` (reconciliations and gap analyses go to `Reports/`) via a write-capable Microsoft connector, or save locally and report the path if none is connected. Never overwrite source data, the firm's originals, or an existing draft (version with `_vN`).

## Output

Findings or a roll-up with totals, the file location if published, and clear next steps. Prefer a script for mechanical checks (matter-name validation, duplicate detection) — faster and repeatable. Always end with a human decision point, not an auto-action.
