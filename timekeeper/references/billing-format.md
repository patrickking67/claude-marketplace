# Billing format

The firm's time entries import into Clio from a flat CSV. Match this schema exactly — a draft that doesn't import clean is a draft that wastes the reviewer's time.

## CSV schema

Header row, in this order:

```
matter,date,activity_description,note,price,quantity,type,activity_user,non_billable
```

| Column | Meaning | Notes |
|---|---|---|
| `matter` | Exact matter display name | Must match Clio **exactly** (see `matters-and-rates.md`). For matters with sub-matters (Tomko, S. Brower, Infiniti Health), use `Matter Name - Sub-matter`; confirm the sub-matter if not obvious. Quote any value with a comma. |
| `date` | Date the work was performed | `M/D/YYYY` (e.g. `3/5/2026`). One entry sits on one date. |
| `activity_description` | Saved activity template | **Leave blank** — this Clio field is for activity-category templates, not narrative. The human-readable text goes in `note`. |
| `note` | The billable description | The text the client sees on the invoice. See voice rules below. |
| `price` | Hourly rate | The **timekeeper's** rate for that matter, e.g. `275`. Not a line total. |
| `quantity` | Hours, decimal | Tenths of an hour: `0.1`, `0.4`, `1.25`. Minimum `0.1`. |
| `type` | Entry type | **Leave blank** = TimeEntry. Use `ExpenseEntry` only for costs/flat fees. |
| `activity_user` | Who logged it | The timekeeper's **full name** (e.g. `Sarah Bates`) — drives the default rate. |
| `non_billable` | Billable flag | Blank/`false` = billable. `true` = recorded but not charged. |

`TimeEntry.total` is computed downstream as `price × quantity` — never write a total.

## CSV encoding & quoting (prevents column drift on import)

Partial quoting and missing encoding markers make Clio's importer misalign columns. Generate every CSV this way:

- **Quote every field** (QUOTE_ALL), matching Clio's own export — so a comma inside a matter name (`"FTC v. American Tax Service, et al."`) or a note never reads as a column break.
- **Write a UTF-8 byte-order mark** (`utf-8-sig`) so Excel opens it as UTF-8.
- **Plain ASCII punctuation only** — convert em dashes (`—` → ` - `), curly quotes, and other multi-byte characters.
- **Verify before delivering:** every row has exactly **9 columns**, and columns **C (`activity_description`) and G (`type`) are blank**.

## How the CSV maps to Clio's New Time Entry form

When entries are typed or imported into Clio, they land in the **New Time Entry** form. Mapping so drafts line up with what a reviewer sees:

| Clio field | CSV column | Notes |
|---|---|---|
| Duration | `quantity` | Clio accepts `1h 12m` or `1.2`; we emit decimal hours. |
| Matter | `matter` | Exact match required. |
| Activity category | `activity_description` | Clio's saved categories/rates. Usually blank in this firm's CSV — confirm whether they want categories applied. |
| Date | `date` | |
| Description | `note` | The bill-visible text. |
| Firm user | `activity_user` | The timekeeper; drives the default rate. |
| Rate | `price` | "Default rate" follows the Firm user unless a custom matter rate applies. |
| Non-billable | `non_billable` | |
| Show this entry on the bill | — | Clio UI flag; not in the import. Billable entries show by default. |

This firm currently leaves `activity_description` blank. If categories are later adopted, Clio's configured **activity categories** are: Accounting/Tax, Consumer/Investor Communication, Discussion, Document Review/Analysis, Execute Documents, In-person meeting, Inspection, Monthly Financial Report, Obtain Legal Advice, Online Meeting, Review/respond to emails.

## Description voice

Entries are short, specific, **present-tense**, and client-readable. Study these real-shaped examples:

- `Respond to email from Steve Donell re unfunded security deposits pertaining to PSA`
- `Review AR Report; email to Jasmine Tran re David Judaken's unauthorized use of accounting software and request removal of entries`
- `Prepare and send funding request to EB&T`
- `Circulate Feb 2026 financial report to service list`

Rules that make entries defensible:
- **Lead with a present-tense billing verb:** Review, Respond, Prepare, Draft, Revise, Email, Correspond, Research, Discuss, Confer, Circulate, Process, Analyze, Coordinate, Finalize, Attend, Confirm, Request.
- **Name the thing and the person/entity** — "re unfunded security deposits," "to Xochitl Cortez." Specificity is what survives a fee-objection.
- **Use names, not roles** — never "counsel," "opposing counsel," "the broker," or "the bank representative" when a name is available. Use full names where the source gives them.
- **Chain related steps in one entry with `;`** when they're one unit of work on one date — but a description that bundles **different topics** (watch for "; and") must split into separate entries.
- **No filler** — never "briefly," "quickly," "just," "worked on," "attention to." No first person.
- **Don't disclose privileged substance** — describe the *work*, not confidential strategy.

## Quantity discipline

- **Round up to the next tenth — always up, never down:** 1–6 min = 0.1, 7–12 = 0.2, 13–18 = 0.3, … Minimum 0.1 (6 min). Email review/short replies trend 0.1–0.3; substantive drafting 0.4–1.5; meetings/calls/hearings use the **actual** calendar duration.
- **Estimate honestly** from what the task entails — never pad to hit a daily target (e.g. 8 hrs), never trim below what the work took, never infer hours from email volume alone. Totals fall where honest per-task estimates land.
- **One discrete task = one entry.** This firm does not block-bill; a day often has many 0.1–0.4 entries across several matters.
- If you can't justify a duration from the source, pick a conservative number and **flag it** for review rather than inventing precision.
