---
name: draft-time-entries
description: The main Timekeeper workflow — reconstruct billable time from Microsoft 365 (and optional Zoom / Webex / Calendly). One mini-questionnaire card (date range, billable user, matters, billable-or-not, notes, optional file upload), then a full M365 sweep, review-ready cards with a big Open-Clio-Manage button, and a per-run Clio-import CSV written to the working folder. Use whenever someone says "log my time," "bill my week," "draft time entries," "reconstruct my hours," "find unbilled time," "what should I bill," "I forgot to track my time," or names a period for billing. Every entry is a draft for human review — never auto-billed.
---

# Draft time entries

Reconstruct billable time from Microsoft 365 and produce review-ready entries in the firm's exact format. **Two prompts, then research, then review.** Accuracy and defensibility beat speed — every entry has to survive a court fee-audit, so when in doubt, flag rather than guess.

Read these before drafting: `${CLAUDE_PLUGIN_ROOT}/references/m365-mining.md`, `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`, `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`, `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Then load `<working folder>/Timekeeper.xlsx` — its `Mappings`, `Rates`, and `Skips` tabs override plugin defaults; its `Entries` tab is the dedup source.

## Step 1 — The questionnaire (one card, five fields)

Before any prompting, auto-detect the current M365 user (the connector exposes the signed-in user — pull email / display name). Match that email against the timekeeper card in `matters-and-rates.md`; load `<working folder>/Timekeeper.xlsx` Rates tab for any per-user overrides. That's the default billable user.

Then show **one card** with five fields and a single submit button. The user fills what they want and accepts the defaults for the rest.

```
┌──────────────────────────────────────────────────────┐
│  Draft time entries                                  │
│                                                      │
│  1. Date range                                       │
│     ◉ Last week     ○ Today      ○ This week         │
│     ○ Last month    ○ Custom: [_______________]      │
│                                                      │
│  2. Billable to                                      │
│     [ <auto-detected user>                  ▼ ]      │
│       (dropdown: all timekeepers on the rate card)   │
│                                                      │
│  3. Matters                                          │
│     ◉ All matters                                    │
│     ○ Specific: [_____________________________]      │
│                                                      │
│  4. Billable                                         │
│     ◉ Billable    ○ Non-billable                     │
│                                                      │
│  5. Notes (optional)                                 │
│     [ Anything to skip, focus on, or override —   ]  │
│     [ e.g. "ignore standups", "thread on Fikhman" ]  │
│                                                      │
│  📎 Attach (optional)                                │
│     Clio activities export, ICS calendar, an         │
│     invoice you're reconciling against, anything.    │
│                                                      │
│           ┌──────────────────────┐                   │
│           │  Run sweep   →       │                   │
│           └──────────────────────┘                   │
└──────────────────────────────────────────────────────┘
```

**In Cowork:** render exactly as a five-field card with the submit button. Editable inline, single submit.

**In Claude.ai / Claude Code:** the surface doesn't render rich forms, so present the questionnaire as one prompt with the defaults filled in:

> Draft time entries — defaults below. Reply with overrides or just "go".
>
> 1. Date range: **last week** (`<start>` → `<end>`, Pacific)
> 2. Billable to: **`<auto-detected user>`**
> 3. Matters: **all**
> 4. Billable / non-billable: **billable**
> 5. Notes: (none)
> 📎 Attach anything? (paste a file or skip)

If the user replies "go" or similar, use the defaults. If they reply with overrides ("last week, just FTC, skip standups"), parse and merge into the defaults. Don't ask follow-up questions — one shot.

Resolve the date range to ISO start / end in **Pacific time** (see Step 2). If "Custom" was picked without a value, that's the only thing worth following up on.

## Step 2 — Big research (delegate to `activity-miner`)

Hand `{billable_user, range, scope, notes, default_billable}` to **activity-miner**. It runs the full sweep across every connected source in parallel — don't do it inline.

### Mandatory: Pacific-time day boundaries

The firm works in **Pacific time**. Every "day" search covers a full **Pacific day**. A UTC-midnight window drops evening work and silently omits billable items — the #1 cause of "missing" time.

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

## Step 3 — Zero-results fallback

If the full sweep returns **no candidates**, don't give up. Print:

> "I didn't find any activity in `<range>` for `<billable_user>`. A few possibilities — pick what fits:"
>
> 1. **Wrong range** — was it actually a different week? (Re-prompt date range.)
> 2. **Wrong account** — are you signed into the M365 account that has this work? (List the detected email; offer to switch.)
> 3. **Not working** — PTO / sick / holiday / weekend? (Confirm and stop cleanly.)
> 4. **Off-M365** — phone calls, in-person meetings, paper review? (Switch to **manual entry**: ask what happened, build entries from the description, flag every one for human duration confirmation.)

Don't return an empty CSV. Either widen the search, switch identity, manually capture, or stop with a clear "nothing to bill."

## Step 4 — Draft (delegate to `entry-drafter`)

Pass candidates + `{billable_user, default_billable, notes}` to **entry-drafter**. Apply, in this order:

1. **§ 330(a)(3)–(4) four-prong test** — benefit to estate, necessary to administration, no unnecessary duplication, time proportional to complexity. Fail or doubt → flag.
2. **Categorical non-billables** — see `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Always exclude (phish alerts, vendor pitches, automated reports, personal receipts, internal Clio admin, social-only Teams replies, etc.).
3. **No block billing** — each distinct issue or task gets its own line. "; and" or different topics in one entry → split.
4. **Per-case policy** — Fikhman conservative; Laguna bill everything; Beloit selective; EVM Martin bills as Steve Donell regardless of who did the work. See `matters-and-rates.md`.
5. **Billable user** — set `activity_user = <picked billable_user>` on every entry. The per-matter rate (`price`) follows that user × matter.
6. **Billable / non-billable** — default per the Step 1 questionnaire's toggle. The drafter still flips entries to `non_billable = true` when they're administrative or fail § 330 (e.g. a tracked internal-IT email that surfaced).
7. **Honest time estimates** — never pad to hit a daily target, never trim below reality. Email volume alone doesn't drive duration. Total daily hours fall where honest per-task estimates land.
8. **Round UP to the next tenth** — 1–6 min = 0.1, 7–12 = 0.2, … Minimum 0.1.
9. **Description voice** — present-tense billing verb first (Review, Draft, Coordinate, Correspond, Prepare, Discuss, Attend, etc.); name people by full name; specific; no privileged substance; no filler ("briefly", "quickly", "worked on").
10. **Matter assignment** — confirmed mapping → property/entity/party reference → counterparty domain → thread continuity. **Rates file is authoritative — never invent a matter name.** Sender identity alone is never sufficient (Brian Landau, Ori Blumenfeld, Peggy Lennon span matters).

## Step 5 — Review surface (clean cards + big Clio Manage button)

Show the drafted entries for review before anything leaves. Keep the cards calm and dense — see `${CLAUDE_PLUGIN_ROOT}/references/output-style.md` for the exact layout.

**Card content (compact, four lines max):**
- Header: `<date> · <duration>h · <matter> · $<rate>`
- Description: the `note` text (the bill-visible line).
- Citation footnote: source + subject + time.
- Footer (only if needed): flag badge, or a small `billable user · billable/non-billable` chip when overridden from the run default.

**Above the cards** — one-line summary: `N entries · X.X billable hours · $Y · <range>` and the flag count ("3 need your eye"). Flagged entries first.

**Below the cards — one prominent action:**

```
┌─────────────────────────────────────────────┐
│              Open Clio Manage  →            │   ← Clio blue (#2A4FB9), white text
└─────────────────────────────────────────────┘

Bulk import: <csv-path>
```

In Cowork: render as a card-button, full-width, Clio brand blue background, white text. In Claude.ai / Claude Code: render as an emphasized markdown link styled to stand out (`**[Open Clio Manage →](https://app.clio.com/nc/#/activities)**`) above the smaller CSV-path line. The button always links to `https://app.clio.com/nc/#/activities`.

Per-entry edits (billable user / billable-or-not) happen inline on the card — don't open separate forms.

## Step 6 — Write the CSV (to the working folder)

The end output is **just the CSV**. To the user's chosen working folder, write:

```
Timekeeper-Entries_<billable_user>_<start>_<end>.csv
```

That's it. No `.xlsx` workbook, no memo. (Those live in the `billing` skill for month-end workbook reviews — not in the default time-entry flow.)

A one-off single-entry run writes nothing — the card + Clio button are enough.

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
- `activity_user` — the billable user picked in Step 1 (e.g. `Sarah Bates`). Same on every row in the run (unless an entry was overridden in review).
- `non_billable` — `false` (or blank) for billable; `true` for recorded-but-not-charged.

### CSV encoding (prevents column drift on Clio import)

- **Quote every field** (QUOTE_ALL) — Clio's own export format.
- **UTF-8 BOM** (`utf-8-sig`) — so Excel opens it as UTF-8.
- **Plain ASCII punctuation** — convert em dashes (`—` → ` - `), curly quotes, multi-byte chars.
- **Verify before delivering:** every row has exactly **9 columns**, and columns C (`activity_description`) and G (`type`) are blank.

## Step 7 — Hand off

Print:
- One-line summary (entries · hours · $ · range · billable user).
- What's flagged and why (the `REVIEW FLAGGED` lines from the drafter).
- The **Open Clio Manage** button and the CSV path for bulk import.

Close with: *"Ready to review and import into Clio."*

## Step 8 — Update the log + knowledge store (the plugin learns)

After the user approves and the CSV is written, **append to `<working folder>/Timekeeper.xlsx`** — the single store created at setup. The plugin's knowledge improves run over run from confirmed corrections; never silently, always from explicit user confirmation.

**Always append to `Entries` tab** — every approved entry from this run, one row each:
`RunID` (timestamp-based), `Drafted` (now), `Date`, `BillableUser`, `Matter`, `Description`, `Hours`, `Rate`, `Amount`, `Billable`, `Citation`, `Flag`, `Status = "exported"`.

This is the durable ledger — used by `billing` to find unbilled time, dedup across runs, and reconcile against invoices.

**Conditionally append to the other tabs** — only what was **confirmed during this run**:

- **Mappings tab** — when the user resolved an UNCLEAR flag to a specific matter, write a row: signal (email / domain / property / entity), matter, today, billable user, optional note.
- **Rates tab** — when the user changed a `price` during review, write: billable user, matter, new rate, today, optional note.
- **Skips tab** — when the user marked a recurring sender / pattern as non-billable ("ignore weekly Citiguard reports"), write: pattern, reason, today.

Read the workbook, append rows (don't rewrite or reorder the user's hand edits), and tell the user one line:
*"Logged 8 entries to Timekeeper.xlsx · 2 new mappings, 1 new skip rule."*

The miner, drafter, and auditor all load `Timekeeper.xlsx` first on the next run — confirmed knowledge overrides plugin defaults. This is the plugin's memory.

## Guardrails

- Never invent activity, durations, or matter names. Missing signal → conservative estimate + flag.
- Never auto-bill. The review at Step 5 is the point.
- Don't quote privileged content in descriptions — describe the work, not the substance.
- Don't anchor totals to a daily target (e.g. 8 hours). Hours fall where honest per-task estimates land.
- Don't ask for the timekeeper's name — auto-detect, then show the dropdown.
- Never write to `Timekeeper.xlsx` something the user didn't confirm. The store is the firm's source of confirmed knowledge — speculative entries poison it.
