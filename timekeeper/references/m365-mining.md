# Mining Microsoft 365 for billable work

This is the discovery contract the `activity-miner` agent follows. Goal: surface everything plausibly billable for one timekeeper over one date range, with a citation for each item, and let the human cut — not silently drop work.

## Date boundaries — Pacific time (critical, recurring error)

The firm works in **Pacific time**. Every "day" search must cover a full **Pacific day**, not a UTC day. A UTC-midnight window drops evening work (~5 PM on, which rolls into the next UTC day) and silently omits billable items — this is the single most common cause of "missing" time. Do not repeat it.

- **Preferred — local boundaries:** `afterDateTime: "<Month Day Year> 12:00am"`, `beforeDateTime: "<Month Day Year> 11:59pm"`. These resolve in local time and handle daylight saving automatically.
- **Manual UTC:** PDT (≈Mar–Nov, UTC−7) → target day `07:00Z` to next day `07:00Z`; PST (≈Nov–Mar, UTC−8) → `08:00Z` to `08:00Z`.

## Sources — all required (don't assume one covers another)

| # | Source | Pull | How |
|---|---|---|---|
| 1 | Outlook **Sent Items** | What the timekeeper sent | `folderName: "Sent Items"` + date filter, `order: oldest` |
| 2 | Outlook **Inbox** | Threads they acted on (replied/forwarded/acted) | `folderName: "Inbox"` + date filter, `order: oldest` |
| 3 | Outlook **Deleted Items** | Acted-on mail later deleted (exclude deleted *drafts*) | `folderName: "Deleted Items"` + date filter |
| 4 | **Calendar** | Meetings, calls, hearings with attendees | `query: "*"` + afterDateTime/beforeDateTime; use the **actual** duration |
| 5 | **Teams** | Substantive client/matter discussion, meeting chats, transcripts | `query: "*"` + date filters (**wildcard required** — see gotchas) |
| 6 | **SharePoint/OneDrive** | Docs created/edited/reviewed in range | matter keyword + date; confirm the modified date is in range |
| 7 | **Claude history** | Days already billed in prior sessions | `recent_chats()` / `conversation_search()` — to **dedup**, not re-bill |

Read enough content to write a defensible description — subjects alone are too thin — but never quote privileged substance in output.

## Search gotchas (these silently fail)

- **Teams requires `query: "*"`** with date filters. Keyword queries ("Fikhman OR CCOA") return zero even when messages exist. If `nextOffset` appears, paginate it back as `offset` until results stop; search each thin day separately.
- **Email API won't combine all filters:** `folderName` + date works; `folderName` + `query` + date is **not** supported (drop the `query` and filter manually); `sender` + `folderName` not supported. Pagination: `offset` for folder+date searches, `cursor` for free-text `query`.
- **SharePoint author filter is unreliable** — use date + matter keywords, then confirm the modified date falls in range. Before adding a SharePoint entry, check it isn't already captured by an email entry (avoid double-billing).

## Grouping (one billable event = one entry)

- Thread a back-and-forth into **one** entry; note participant and message counts as context.
- Fold a document edited the same day as the email about it into **one** entry when it's the same unit of work.
- Keep distinct calendar events separate unless they clearly roll up.
- Splitting one task into an "email entry" + a "document entry" inflates the bill and confuses an auditor — don't.

## Teams — what's billable

Teams often holds work invisible in email: task assignments from Steve Donell, case-specific back-and-forth with Lisa Qin / Laura Urbano / Kari Wilson, Sarah's substantive analysis, cross-matter audit direction. **Billable:** the timekeeper's substantive messages, and messages directed to them needing a substantive response/action. **Not:** social replies, automated notifications, bare acknowledgments. A short thread ≈ 0.1; a substantive back-and-forth 0.2–0.3.

## Exclude (not billable)

Apply the firm's categorical skip list and the § 330 four-prong test in `references/non-billable.md`. In short: automated notifications, newsletters, calendar holds/OOO with no attendees, purely personal mail, internal admin with no matter nexus. When in doubt, **include and flag** — the reviewer would rather decline five than miss one.

## Output contract

For each candidate, return: date, a one-line description of the work, the **matter** (or "unknown"), a **duration estimate**, a **confidence** (high/med/low), and a **citation** (email subject + date, meeting title, file name). Anything below high confidence — ambiguous matter, uncertain duration, possible non-billable — comes back flagged with a one-line reason. Confidence and citations are what let a partner trust the draft enough to sign it.
