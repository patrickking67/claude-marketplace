# Clio exports — reference data map

Timekeeper has no live Clio connection yet (see [`../CONNECTORS.md`](../CONNECTORS.md)), so it works from **Clio exports the firm drops in** plus the bundled snapshots below. Clio Manage exports matters, contacts, activities, and reports as CSV, and the firm imports time back via CSV. This file says what each export is and which skill reads it.

## Bundled snapshots (reference data)

| File | What it is | Read by |
|---|---|---|
| `references/matters.csv` | Trimmed Clio **matters** export — number, name, caption, status, dates, responsible attorney, case no., property. The authoritative matter list. | `matters`, `time-entry`, `billing` |
| `references/rate-card.csv` | `user × matter → rate`, built from 23k+ billed entries. | `time-entry`, `billing`, agents |
| `data/sample-contacts.csv` | Trimmed Clio **contacts** export — clients, counsel, vendors, service-list members. | `contacts` |
| `data/sample-activities.csv` | Real billed **activities** (time entries) for tone-matching. | `time-entry`, `entry-drafter` |
| `data/sample-clio-import.csv` | A real **time-entry import** CSV (the firm's March run) — the exact import shape. | `time-entry`, `billing`, `documents` |

These are **snapshots**. When the firm provides a fresher export at run time, prefer it — the matter list especially changes as cases open and close. Confirmed overrides go in the working folder's `learned-mappings.md`.

## Exports the firm drops in at run time

Clio Manage produces these; hand whichever is relevant to the matching skill:

| Clio export / report | Use | Skill |
|---|---|---|
| **Matters** export | Current matter list, exact display names, status, sub-matters (by matter number) | `matters` |
| **Contacts** export | People & companies, client vs. non-client, emails/phones | `contacts` |
| **Activities** export | Already-billed time — the baseline for "find unbilled time" and for tone | `time-entry`, `billing` |
| **Billing history / Billing report** | What was actually billed per matter/bill — for reconciliation | `billing` |
| **Accounts receivable (aging) report** | Outstanding balances per matter (context only — never bill on AR) | `billing` |
| **Client productivity report** | Billed/billable hours & value by matter for a period | `billing` |
| **Calendar events report** | Court-rule dates and matter-linked events | `calendar` |

## Import (time back into Clio)

Every time-entry run ends with a CSV matching [`billing-format.md`](./billing-format.md), imported via **Clio Manage → Settings → Import → Activities / Time Entries** (not Tasks). `data/sample-clio-import.csv` is a real example. Matters must already exist in Clio, spelled exactly — see [`matters-and-rates.md`](./matters-and-rates.md) for the shorthand → display-name map.
