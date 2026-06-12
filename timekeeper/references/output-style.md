# Output style

How Timekeeper turns reviewed entries into polished, firm-grade deliverables. The CSV is the machine format for Clio import; the **workbook** and **memo** are the human-facing artifacts. Use the host `xlsx`, `pdf`, and `docx` skills for the mechanics — this file defines the *layout, styling, and naming* so output is consistent and court-facing.

Everything writes to the **working folder** the user chose at setup. No SharePoint publishing.

## Artifacts per run

| Artifact | Format | Purpose | When |
|---|---|---|---|
| Time entries | `.csv` | Clio Manage bulk import — schema per `billing-format.md`. **Never styled.** | Every run |
| Billing workbook | `.xlsx` | The reviewer's surface and the firm's durable record | Multi-day runs (week+) or on request |
| Period memo | `.pdf` (or `.docx`) | Sign-off summary for Steve / Sarah | Month-end or on request |

A one-off single-entry run (e.g. "log this 0.3 for Laguna") only produces a card + Clio-button — no CSV/workbook needed.

## Review surface (the cards)

Before any file is written, show the entries for review:

- **In Cowork:** clean card stack. One card per entry: date · duration · matter · rate · description · M365 citation · flag (if any).
- **Elsewhere (Claude.ai / Claude Code):** the same content as a clean Markdown table — never block on a viz tool that isn't there.

Above the cards, a one-line summary: `N entries · X.X billable hours · $Y · [range]` and the flag count ("3 need your eye"). Flagged entries first.

Below the cards, two actions:
1. **Open Clio** — a button / link to `https://app.clio.com/nc/#/activities` for entering one or two entries by hand from the New Time Entry form.
2. **Bulk import** — the path to the CSV (`Timekeeper-Entries_<TK>_<start>_<end>.csv`) for Clio's bulk import.

For Claude.ai / Claude Code, render the button as a plain markdown link.

## Billing workbook (.xlsx)

Three tabs:

**1. Summary**
- Title block: firm name (+ logo when available), "Billing Draft — <Timekeeper(s)>", period, generated date, and "DRAFT — for review, not yet billed."
- **Totals by matter:** Matter · Entries · Hours · Amount — sorted by amount desc.
- **Totals by timekeeper:** Timekeeper · Hours · Amount.
- Grand-total row, bold with a top border: entries · hours · $.
- One-line flag count: "N entries need review — see Flags."

**2. Detail**
- Columns in order: Date · Matter · Timekeeper · Description · Hours · Rate · Amount · Billable · Flag.
- One entry per row (no block-billing). `Amount` = `Rate × Hours` as a formula.
- Number formats: Hours `0.0`, Rate/Amount `$#,##0.00`, Date `m/d/yyyy`.
- Freeze the header row; bold + filled header; banded rows; wrap Description; right-align numerics.
- Tint flagged rows amber so they're scannable.

**3. Flags**
- Only entries needing a decision: Date · Matter · Description · Issue · Suggested fix.
- Issues mirror the draft flags: unclear matter, multi-matter display name, FTC rate confirm, thin duration, possible duplicate, non-billable candidate.

**Styling** — firm palette when brand assets exist (see Branding); otherwise a clean neutral: dark header fill, white bold header text, thin gray gridlines, generous widths, fit-to-width on print. No clip art, no rainbow — restrained and legible.

## Period memo (.pdf / .docx)

One page:
- Letterhead (logo / firm block) or a clean header.
- "Billing Summary — <period>", timekeeper(s).
- Totals-by-matter table + grand total.
- Flags called out (count + the few that matter).
- Sign-off line: `Reviewed & approved: __________   Date: ______`.
- Footer: generated date, "Draft — entries import to Clio on approval."

Use `pdf` for a fixed sign-off PDF; `docx` if they want to edit before sending.

## Branding

- Drop a firm logo at `<working folder>/branding/`. The workbook title block and memo letterhead use it when present.
- **No Jalmar Properties mark yet** → default to the neutral professional style.

## File naming

All saved to the chosen working folder.

- `Timekeeper-Entries_<TK>_<start>_<end>.csv`
- `Billing-Workbook_<TK>_<period>.xlsx`
- `Billing-Memo_<period>.pdf`

`<TK>` = timekeeper short name or `AllTimekeepers`; `<period>` like `2026-03`.

- **Never overwrite** an existing file — version with a `_vN` suffix and tell the user.
- Never modify the firm's original / source files — produce new outputs.
