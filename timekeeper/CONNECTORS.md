# Connectors

Timekeeper reads Microsoft 365 and any optional sources you've connected, then writes outputs to a folder you choose at setup. No system-of-record is ever written to.

## Required

### Microsoft 365 — Claude's native connector
The activity source for time reconstruction, search, calendar, and contacts:
- **Outlook** mail (sent + received + deleted), **Calendar**, **Teams** (chats / calls / meeting transcripts), **SharePoint / OneDrive** search.

Enable Claude's built-in **Microsoft 365** connector (Claude.ai → Connectors, or Claude Code → Settings → Connectors). Read-only is sufficient. Timekeeper never sends mail or modifies anything in M365.

## Optional — extra meeting / scheduling signal

All optional. Connect what your firm uses; Timekeeper picks up whichever sources are present and silently ignores the rest.

| Connector | Why |
|---|---|
| **Zoom** (Claude built-in) | Meeting attendance, duration, recordings, transcripts |
| **Webex** (Claude built-in) | Same as Zoom, for firms standardized on Webex |
| **Calendly** (Claude built-in) | Scheduled consults that don't land cleanly in the Outlook calendar |

## Output destination

You pick a **working folder** at setup (existing or new). Everything Timekeeper produces — CSV for Clio, polished `.xlsx` workbook, the `learned-mappings.md` overlay — lives there. No SharePoint publishing, no auto-uploads.

## Surfaces

Timekeeper runs in **Claude.ai, Claude Cowork, and Claude Code**. The only difference is presentation: where a visualization surface exists (Cowork), review output renders as cards; elsewhere it falls back to a clean Markdown table. Everything else is identical.

| Category | Connector | Status |
|---|---|---|
| Email / calendar / chat / files | Microsoft 365 (Claude native) | Required (read) |
| Meetings | Zoom (Claude native) | Optional |
| Meetings | Webex (Claude native) | Optional |
| Scheduling | Calendly (Claude native) | Optional |
