# Connectors

Timekeeper is deliberately light on connectors — it reads Microsoft 365 and works with files you provide. No practice-management or legal-research connector is required or bundled.

## Required

### Microsoft 365 — read
The activity source for time reconstruction, search, calendar, and contacts:
- **Outlook** mail (sent + received), **Calendar**, **Teams**, **SharePoint/OneDrive** search.

Read-only. Timekeeper never sends mail or changes anything in M365.

## Optional

### SharePoint / OneDrive — write
`billing` / `draft-time-entries` (publish step) drop the reviewed deliverables — CSV + workbook + memo — into the firm's **`automation`** SharePoint site. Requires a **write-capable Microsoft Graph connector** (`Files.ReadWrite.All` + `Sites.ReadWrite.All`); the read-only M365 search connector can *locate* folders but can't write. Without a write connector, Timekeeper saves locally and tells you where. It never overwrites source data or an existing draft (versions with `_vN`).

**Site:** `https://jalmarproperties.sharepoint.com/sites/automation`

**Folder structure** (create once on the site, then publish targets it automatically):

```
automation/
├── Billing Drafts/   reviewed drafts → CSV + workbook + memo, by period
│   └── <YYYY>/<MM - Month>/
├── Reports/          reconciliations, unbilled-time & gap analyses, roll-ups
├── Reference/        rate card, matter list, activity codes (inputs Timekeeper reads)
└── Archive/          superseded drafts & closed periods
```

## Out of scope (for now)

- **Clio Manage** — Timekeeper hands off via a CSV that a person imports into Clio Manage; it does not write to Clio.
- **Legal research tools** — CoCounsel Legal, Legal Data Hunter, LegalZoom, Midpage all require their own paid accounts/authentication, so none are wired in. If the firm later licenses one and exposes an MCP, it can be added without changing the skills. For now, the `documents` and `search` skills work on material you provide.

## Surfaces

Timekeeper runs in **Claude.ai, Claude Cowork, and Claude Code**. The only difference is presentation: where a visualization surface exists (Cowork), review output renders as cards; elsewhere it falls back to a clean Markdown table. Everything else is identical.

| Category | Connector | Status |
|---|---|---|
| Email / calendar / chat / files | Microsoft 365 | Required (read) |
| Document storage (write) | SharePoint / OneDrive | Optional |
| Practice management | Clio Manage | Out of scope (CSV hand-off) |
| Legal research | CoCounsel / Midpage / etc. | Out of scope (own account/auth) |
