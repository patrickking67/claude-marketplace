---
name: documents
description: Read and produce documents — parse xlsx, docx, pptx, and pdf to extract data, and generate polished workbooks, memos, reports, and PDFs. Use when someone uploads or references a spreadsheet, Word document, slide deck, or PDF (invoices, billing workbooks, contracts, court filings, financial reports), or asks to read, extract, summarize, convert, or produce one.
---

# Documents

The firm lives in spreadsheets, PDFs, and Word docs — invoices, the monthly billing workbook, contracts, court filings, financial reports. This skill reads them for data and produces clean ones back.

## Reading / extracting

- **xlsx** — the billing workbook, rate sheets, financial reports, contact/matter exports. Pull the rows you need and keep structure.
- **pdf** — invoices (for billing reconciliation), court orders, recorded documents, financial statements. Extract figures and line items; OCR scanned pages when needed.
- **docx** — engagement letters, motions, memos, receiver reports.
- **pptx** — decks and exhibits.

When the host environment provides dedicated `xlsx` / `docx` / `pptx` / `pdf` skills, use them for the mechanics — this skill is about *why and what*: which numbers to pull, how they feed billing, what to summarize.

## Formats & token-optimized parsing

Read and create **pdf, docx, xlsx, csv** (and pptx).
- **Token-optimized reading:** convert documents to compact Markdown/text first — **markitdown** for pdf/docx/pptx, `openpyxl`/`csv` for spreadsheets — and pull only the rows/sections you need. Never load a whole workbook or a 25k-row export into context: filter or aggregate a large CSV (e.g. the activities export) with a small script and read the *result*, not the raw file.
- **OCR** scanned invoices/orders only when plain text extraction comes back empty.
- **Creating:** emit the Clio import **csv** (per `billing-format.md` — every field quoted, UTF-8 BOM), the billing **xlsx** workbook, and **pdf/docx** memos (per `output-style.md`).

## Producing

Generate the billing CSV, the polished **billing workbook** (`.xlsx`), a month-end **memo** (`.pdf`/`.docx`), a reconciliation report, or a summary — to the layout and styling in `${CLAUDE_PLUGIN_ROOT}/references/output-style.md` and the schema in `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`. Use the host `xlsx`, `pdf`, and `docx` skills for the mechanics; this skill decides *what* goes in. Keep every deliverable firm-grade: restrained, legible, court-facing — never a raw dump.

## Care

- Treat document contents as sensitive — many are privileged or contain PII (see `billing-rules`). Describe and extract what's needed; don't surface privileged substance unnecessarily.
- Never modify the firm's original/source files — produce new outputs.
- This works the same in Claude.ai, Cowork, and Claude Code.
