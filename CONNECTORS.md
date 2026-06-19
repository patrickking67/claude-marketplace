# Connectors

Timekeeper runs entirely on **Claude's native connectors** — nothing is bundled or run locally. Enable each from Claude's connector directory; the skills are connector-agnostic and use whatever's present. `.mcp.json` ships empty by design.

## Required

### Microsoft 365 — native connector (read)
The activity source for time reconstruction, search, calendar, and contacts:
- **Outlook** mail (sent + received), **Calendar**, **Teams**, **SharePoint/OneDrive** search.

Read-only. Timekeeper never sends mail or changes anything in M365. Each user authenticates their own Microsoft 365, so they only ever see their own mailbox and the sites they already have access to.

## Optional

### SharePoint / OneDrive — write
A write-capable Microsoft connector (`Files.ReadWrite` / `Sites.ReadWrite`) lets reviewed output (CSV + workbook + memo) publish to the firm's `automation` SharePoint site (see `references/output-style.md`). Without it, drafts save to the working folder.

### Zoom for Claude — meeting time
Enable **Zoom for Claude** from the connector directory to pull meetings, recordings, and transcripts as billable meeting time. Optional — the M365 calendar already captures most meeting time; Zoom adds recordings and transcripts.

## Planned

### Clio — native connector
There is **no native Clio connector or Clio MCP yet.** Until one exists, Timekeeper hands off to Clio Manage via the **import CSV** (`references/billing-format.md`): every time-entry run ends with a ready-to-import CSV plus the exact Clio steps (`Settings → Import → Activities`, not Tasks). When a native Clio connector ships, the hand-off will post activities directly instead of a manual import.

## Reference data

The firm's Clio exports (matters, contacts, activities, and billing/AR reports) seed the bundled reference data. See [`references/clio-exports.md`](./references/clio-exports.md) for what each export is and which skill reads it.

## Surfaces

Timekeeper runs in **Claude.ai, Claude Cowork, and Claude Code**. The only difference is presentation: where a visualization surface exists (Cowork), review output renders as cards; elsewhere it falls back to a clean Markdown table. Everything else is identical.

| Category | Connector | Status |
|---|---|---|
| Email / calendar / chat / files | Microsoft 365 (native) | **Required** (read) |
| Publish to SharePoint | Microsoft 365 (write scope) | Optional (write) |
| Meetings / recordings / transcripts | Zoom for Claude | Optional |
| Practice management | Clio | Planned (CSV import today) |
