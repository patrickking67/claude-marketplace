---
name: draft-time-entries
description: The main Timekeeper workflow — reconstruct billable time from Microsoft 365 (and optional Zoom / Webex / Calendly) through a guided interview, produce review-ready cards, and write a Clio-import CSV (plus an .xlsx workbook for week-scale runs) to the working folder. Use whenever someone says "log my time," "bill my week," "draft time entries," "reconstruct my hours," "find unbilled time," "what should I bill," "I forgot to track my time," or names a timekeeper and a date range for billing. Runs interactively — every entry is a draft for human review, never auto-billed.
---

# Draft time entries

Reconstruct a timekeeper's billable day from Microsoft 365 and produce review-ready entries in the firm's exact format. This is an **interactive** workflow: small card up front, big research underneath, clean review surface at the end. Accuracy and defensibility beat speed — every entry has to survive a court fee-audit, so when in doubt, flag rather than guess.

Read these before drafting: `${CLAUDE_PLUGIN_ROOT}/references/m365-mining.md`, `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`, `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`, `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Apply the working folder's `learned-mappings.md` if it exists.

## Step 1 — The entry card

Show a single card asking: **"Which timekeeper(s) and period?"** — placeholder: `e.g. Patrick King, May 2026 — or "everyone, last month"`.

In Cowork render as a card; in Claude.ai / Claude Code use `AskUserQuestion` (single text input). If the user already named a timekeeper and a range in their message, skip the card and confirm.

Resolve relative ranges to ISO dates against today's date.

## Step 2 — Quick confirm

Read back one line and wait for a yes: *"Drafting Sarah's time, 2026-03-02 → 03-06, all matters — go?"*. If the user replied to the entry card with everything (timekeeper + range + scope), this is the only confirmation needed.

## Step 3 — The big research (delegate to `activity-miner`)

Hand timekeeper + range + scope to the **activity-miner** agent. It runs the full sweep across every connected source in parallel — don't do it inline.

### Mandatory: Pacific-time day boundaries

The firm works in **Pacific time**. Every "day" search must cover a full **Pacific day**. A UTC-midnight window drops evening work and silently omits billable items — the #1 cause of "missing" time.

- **Preferred — local boundaries:** `afterDateTime: "<Month Day Year> 12:00am"` / `beforeDateTime: "<Month Day Year> 11:59pm"`. Natural-language local handles DST automatically.
- **Manual UTC:** PDT (≈Mar–Nov, UTC−7) → target day `07:00Z` to next day `07:00Z`; PST (≈Nov–Mar, UTC−8) → `08:00Z` to `08:00Z`.

### Mandatory: all sources searched

For every billing date range, search **all** of the following — don't skip any, don't assume one covers another:

1. **Outlook Sent Items** — `folderName: "Sent Items"` + date filter + `order: oldest`
2. **Outlook Inbox** — `folderName: "Inbox"` + date filter + `order: oldest`
3. **Outlook Deleted Items** — `folderName: "Deleted Items"` + date filter (exclude deleted drafts)
4. **Outlook Calendar** — `query: "*"` + afterDateTime / beforeDateTime; use real meeting duration
5. **Microsoft Teams** — `query: "*"` + date filters. **Wildcard is required** — keyword queries return zero. Paginate `nextOffset` → `offset` until exhausted; search thin days individually.
6. **SharePoint / OneDrive** — matter keyword + date; confirm the modified date falls in range. Don't double-bill if already captured by an email entry.
7. **Claude history** — `recent_chats()` / `conversation_search()` to detect days already billed in prior sessions (dedup, never re-bill).
8. **Optional, if connected** — Zoom, Webex, Calendly meeting durations / transcripts.

### Email API constraints (these silently fail)

- `folderName` + date filters: works.
- `folderName` + `query` + date: **not supported** — drop the query, filter results manually.
- `sender` + `folderName`: **not supported**.
- Pagination: `offset` for folder+date; `cursor` for free-text `query`.

## Step 4 — Draft (delegate to `entry-drafter`)

Pass candidates to **entry-drafter**. Apply, in this order:

1. **§ 330(a)(3)–(4) four-prong test** — benefit to estate, necessary to administration, no unnecessary duplication, time proportional to complexity. Fail or doubt → flag.
2. **Categorical non-billables** — see `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Always exclude (phish alerts, vendor pitches, automated reports, personal receipts, internal Clio admin, social-only Teams replies, etc.).
3. **No block billing** — each distinct issue or task gets its own line. "; and" or different topics in one entry → split.
4. **Per-case policy** — Fikhman conservative; Laguna bill everything; Beloit selective; EVM Martin bills as Steve Donell. See `matters-and-rates.md`.
5. **Honest time estimates** — never pad to hit a daily target, never trim below reality. Email volume alone doesn't drive duration. Total daily hours fall where honest per-task estimates land.
6. **Round UP to the next tenth** — 1–6 min = 0.1, 7–12 = 0.2, … Minimum 0.1.
7. **Description voice** — present-tense billing verb first (Review, Draft, Coordinate, Correspond, Prepare, Discuss, Attend, etc.); name people by full name; specific; no privileged substance; no filler ("briefly", "quickly", "worked on").
8. **Matter assignment** — confirmed mapping → property/entity/party reference → counterparty domain → thread continuity. **Rates file is authoritative — never invent a matter name.** Sender identity alone is never sufficient (Brian Landau, Ori Blumenfeld, Peggy Lennon span matters).

## Step 5 — Review surface (cards + Clio button)

Show the drafted entries for review before anything leaves.

- **Cowork:** clean card stack — one card per entry: date · duration · matter · rate · description · M365 citation · flag (if any).
- **Claude.ai / Claude Code:** the same content as a clean Markdown table.

Above the cards, a one-line summary: `N entries · X.X billable hours · $Y · [range]` and the flag count ("3 need your eye"). Flagged entries first.

Below the cards, two actions:
1. **Open Clio** — link / button to `https://app.clio.com/nc/#/activities`. For a single quick entry, the user clicks through and enters Duration + Matter + Description from the card directly in Clio's New Time Entry form.
2. **Bulk import** — show the path to the CSV (Step 6). For more than two or three entries, this is the right path.

Keep it a calm review surface, not a dashboard.

## Step 6 — Write the outputs (to the working folder)

To the user's chosen working folder, write:

1. **CSV** — `Timekeeper-Entries_<TK>_<start>_<end>.csv` (always).
2. **Workbook** — `Billing-Workbook_<TK>_<period>.xlsx` for any week- or month-scale run (Summary / Detail / Flags tabs per `${CLAUDE_PLUGIN_ROOT}/references/output-style.md`).
3. **Memo** — `Billing-Memo_<period>.pdf` at month-end or on request.

A one-off single-entry run only writes nothing — the card + Clio button are enough.

### CSV schema (exact, 9 columns)

Header row, in this order:

```
matter,date,activity_description,note,price,quantity,type,activity_user,non_billable
```

- `matter` — exact Clio display name. Sub-matters: `Matter Name - Sub-matter`. Confirm with user if not obvious.
- `date` — `M/D/YYYY`.
- `activity_description` — **blank** (reserved for Clio activity-category templates).
- `note` — the billing description (what the client sees on the invoice).
- `price` — hourly rate (no `$`).
- `quantity` — decimal hours (e.g. `0.3`).
- `type` — **blank** (= TimeEntry).
- `activity_user` — timekeeper's full name (e.g. `Sarah Bates`).
- `non_billable` — `false` (or blank); `true` only for recorded-but-not-charged.

### CSV encoding (prevents column drift on Clio import)

- **Quote every field** (QUOTE_ALL) — Clio's own export format.
- **UTF-8 BOM** (`utf-8-sig`) — so Excel opens it as UTF-8.
- **Plain ASCII punctuation** — convert em dashes (`—` → ` - `), curly quotes, multi-byte chars.
- **Verify before delivering:** every row has exactly **9 columns**, and columns C (`activity_description`) and G (`type`) are blank.

## Step 7 — Hand off

Print:
- One-line summary (entries · hours · $ · range).
- What's flagged and why (the `REVIEW FLAGGED` lines from the drafter).
- The **Open Clio** button and the CSV path for bulk import.
- The workbook path if produced.

Close with: *"Ready to review and import into Clio."*

## Guardrails

- Never invent activity, durations, or matter names. Missing signal → conservative estimate + flag.
- Never auto-bill. The review at Step 5 is the point.
- Don't quote privileged content in descriptions — describe the work, not the substance.
- Don't anchor totals to a daily target (e.g. 8 hours). Hours fall where honest per-task estimates land.
