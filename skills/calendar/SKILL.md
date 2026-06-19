---
name: calendar
description: Review and plan from the firm's Microsoft 365 calendar — what's coming up, what needs prep, deadlines and court dates, and which events were billable. Use when someone says what's on my calendar, prep me for this week, any hearings or court dates, what meetings did I have, or block time for something.
---

# Calendar

Read the M365 calendar and turn it into something useful — a look-ahead, prep, or a feed into time entry. Read-only.

## Use it to

- **Look ahead** — what's on today / this week, who's attending, where, and what needs preparation (hearings, deal calls, client meetings).
- **Surface deadlines** — court dates, filing deadlines, and recurring obligations; flag anything close.
- **Feed billing** — past meetings, calls, and hearings are billable events with a real duration. When the user is reconstructing time, hand these to `time-entry` / `activity-miner` so meeting time is captured accurately and mapped to the right matter.

## Notes

- Use the event's actual duration for billable time — don't estimate when the calendar knows.
- Map events to matters with the same signal hierarchy as everything else (`${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`).
- This skill reads and plans; it doesn't create or change calendar events.
