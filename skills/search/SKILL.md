---
name: search
description: One-query enterprise search across the firm's Microsoft 365 (Outlook, Teams, calendar, SharePoint/OneDrive) and any documents you provide, returning a synthesized, cited answer. Use when someone says find that email or doc, what did we decide about, where's the file on, who said what about, or search my M365 for a topic, person, or matter.
---

# Search

Turn one natural-language question into parallel searches across every available source, then synthesize a single cited answer — not a raw result dump.

## Workflow

1. **Decompose** the question — keywords, entities (people, matters, properties), time window, and any source hint or filter (from/in/after/before).
2. **Search in parallel** across what's connected: Outlook mail, Teams, calendar, SharePoint/OneDrive, plus any files the user uploaded. Never search sources one at a time.
3. **Rank** by relevance, freshness, and authority (an executed doc or email beats a mid-thread chat message for "what was decided").
4. **Deduplicate** — the same fact across sources becomes one item citing all of them.
5. **Synthesize** — lead with the answer, then a short **Sources** list (source · location · date · author). Flag confidence when results are thin, stale, or conflicting, and surface conflicts rather than silently picking one.

## Notes

- Read-only. Describe what you find; for privileged material, describe the *work*, not the substance (see `billing-best-practices`).
- If a source is unavailable, note the gap and answer from the rest — don't let one failure block the search.
- If nothing matches, suggest broader terms or a wider date range rather than returning empty.
- This complements `draft-time-entries` (which mines for billable activity) — `search` answers a question; drafting reconstructs a billable day.
