# Connectors

Timekeeper is deliberately light on connectors — it reads Microsoft 365 (and any optional sources you've connected) and works with files you provide. No practice-management or legal-research connector is required or bundled.

## Required

### Microsoft 365 — Claude's native connector
The activity source for time reconstruction, search, calendar, and contacts:
- **Outlook** mail (sent + received), **Calendar**, **Teams**, **SharePoint/OneDrive** search.

Use Claude's built-in **Microsoft 365** connector (Claude.ai → Connectors, or Claude Code → Settings → Connectors). Read-only is sufficient. Timekeeper never sends mail or changes anything in M365.

## Optional — extra activity signal

All optional. Connect what your firm uses; Timekeeper picks up whichever sources are present and ignores the rest.

| Connector | Why |
|---|---|
| **Zoom** (Claude built-in) | Meeting attendance, duration, recordings for billable hearings/depositions/client calls |
| **Webex** (Claude built-in) | Same as Zoom, for firms standardized on Webex |
| **Calendly** (Claude built-in) | Scheduled events and consults that don't land cleanly in the Outlook calendar |
| **SharePoint / OneDrive write** | Auto-publish reviewed CSV + workbook + memo to the firm's `Billing Drafts/` folder |

## Surfaces

Timekeeper runs in **Claude.ai, Claude Cowork, and Claude Code**. The only difference is presentation: where a visualization surface exists (Cowork), review output renders as cards; elsewhere it falls back to a clean Markdown table. Everything else is identical.

| Category | Connector | Status |
|---|---|---|
| Email / calendar / chat / files | Microsoft 365 (Claude native) | Required (read) |
| Meetings | Zoom (Claude native) | Optional |
| Meetings | Webex (Claude native) | Optional |
| Scheduling | Calendly (Claude native) | Optional |
| Publishing | SharePoint / OneDrive write | Optional |
