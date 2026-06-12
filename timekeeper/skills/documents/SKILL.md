---
name: documents
description: Read, validate, and produce documents — parse xlsx, csv, docx, pptx, and pdf to extract data, and generate polished workbooks, memos, reports, and PDFs. Use when someone uploads or references a spreadsheet, CSV, Word document, slide deck, or PDF (invoices, billing workbooks, contracts, court filings, financial reports, activity exports), or asks to read, validate, extract, summarize, convert, or produce one.
---

# Documents

The firm lives in spreadsheets, PDFs, CSVs, and Word docs — invoices, the monthly billing workbook, Clio activity exports, contracts, court filings, financial reports. This skill reads them for data, validates them against the firm's schemas, and produces clean ones back.

## Reading / extracting

- **xlsx** — the billing workbook, rate sheets, financial reports, contact / matter exports. Pull the rows you need and keep structure.
- **csv** — Clio activity exports, matter exports, rate exports. Validate against `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md` (header, 9 columns, blank C and G, quoting, UTF-8 BOM, ASCII punctuation) before treating as authoritative.
- **pdf** — invoices (for billing reconciliation), court orders, recorded documents, financial statements. Extract figures and line items; OCR scanned pages when needed.
- **docx** — engagement letters, motions, memos, receiver reports.
- **pptx** — decks and exhibits.

When the host environment provides dedicated `xlsx` / `docx` / `pptx` / `pdf` skills, use them for the mechanics — this skill is about *why and what*: which numbers to pull, how they feed billing, what to summarize.

## Producing

Generate the billing CSV, the polished **billing workbook** (`.xlsx`), a month-end **memo** (`.pdf`/`.docx`), a reconciliation report, or a summary — to the layout and styling in `${CLAUDE_PLUGIN_ROOT}/references/output-style.md` and the schema in `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`. Use the host `xlsx`, `pdf`, and `docx` skills for the mechanics; this skill decides *what* goes in. Keep every deliverable firm-grade: restrained, legible, court-facing — never a raw dump.

## Care

- Treat document contents as sensitive — many are privileged or contain PII (see `billing-best-practices`). Describe and extract what's needed; don't surface privileged substance unnecessarily.
- Never modify the firm's original/source files — produce new outputs.
- This works the same in Claude.ai, Cowork, and Claude Code.
