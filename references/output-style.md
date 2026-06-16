# Output style & publishing

How Timekeeper turns reviewed entries into polished, firm-grade deliverables, and where they land. The CSV is the machine format for Clio import; the **workbook** and **memo** are the human-facing artifacts. Use the host `xlsx`, `pdf`, and `docx` skills for the mechanics — this file defines the *layout, styling, and naming* so output is consistent and court-facing.

## Artifacts per run

| Artifact | Format | Purpose |
|---|---|---|
| Time entries | `.csv` | Clio Manage import — the firm imports it manually. Schema per `billing-format.md`. **Never styled.** |
| Billing workbook | `.xlsx` | The reviewer's surface and the firm's durable record. |
| Period memo | `.pdf` (or `.docx`) | Sign-off summary for Steve / Sarah. |

Always produce the CSV. Produce the workbook for any week- or month-scale run (default). Produce the memo at month-end or on request.

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

- Drop a firm logo at `<working folder>/branding/` (or the plugin's `assets/` if bundled). The workbook title block and memo letterhead use it when present.
- **No Jalmar Properties mark yet** → default to the neutral professional style. The Claude/Anthropic assets in the project `Resources/Branding` are for internal decks, **not** client deliverables.

## File naming

- `Timekeeper-Entries_<TK>_<start>_<end>.csv`
- `Billing-Workbook_<TK>_<period>.xlsx`
- `Billing-Memo_<period>.pdf`

`<TK>` = timekeeper short name or `AllTimekeepers`; `<period>` like `2026-03`.

## Publishing to SharePoint

Reviewed deliverables publish to the firm's `automation` site (a **write-capable Microsoft connector** is required — see `CONNECTORS.md`):

```
automation/Billing Drafts/<YYYY>/<MM - Month>/   ← CSV + workbook + memo
automation/Reports/                              ← reconciliations, gap analyses
```

- Locate the target folder via the read connector, then write via the write connector.
- **Never overwrite** an existing file — version with a `_vN` suffix and say so.
- Publishing is reviewed-only: never publish un-approved drafts. If no write connector is present, save locally and report the path.
