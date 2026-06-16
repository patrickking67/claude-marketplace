# Connectors

Timekeeper is deliberately light on connectors — it reads Microsoft 365 and works with files you provide. No practice-management or legal-research connector is required or bundled.

## Required

### Microsoft 365 — read
The activity source for time reconstruction, search, calendar, and contacts:
- **Outlook** mail (sent + received), **Calendar**, **Teams**, **SharePoint/OneDrive** search.

Read-only. Timekeeper never sends mail or changes anything in M365.

## Surfaces

Timekeeper runs in **Claude.ai, Claude Cowork, and Claude Code**. The only difference is presentation: where a visualization surface exists (Cowork), review output renders as cards; elsewhere it falls back to a clean Markdown table. Everything else is identical.

| Category | Connector | Status |
|---|---|---|
| Email / calendar / chat / files | Microsoft 365 | Required (read) |
