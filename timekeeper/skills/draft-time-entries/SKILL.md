---
name: draft-time-entries
description: The main Timekeeper workflow — reconstruct billable time from Microsoft 365 (and optional Zoom / Webex / Calendly) by asking only date range, the billable user (dropdown), and notes; then runs a full M365 sweep, shows review-ready cards, and writes a Clio-import CSV (plus an .xlsx workbook for week-scale runs) to the working folder. Use whenever someone says "log my time," "bill my week," "draft time entries," "reconstruct my hours," "find unbilled time," "what should I bill," "I forgot to track my time," or names a period for billing. Runs interactively — every entry is a draft for human review, never auto-billed.
---

# Draft time entries

Reconstruct billable time from Microsoft 365 and produce review-ready entries in the firm's exact format. **Two prompts, then research, then review.** Accuracy and defensibility beat speed — every entry has to survive a court fee-audit, so when in doubt, flag rather than guess.

Read these before drafting: `${CLAUDE_PLUGIN_ROOT}/references/m365-mining.md`, `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`, `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`, `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Then load `<working folder>/Timekeeper.xlsx` — its `Mappings`, `Rates`, and `Skips` tabs override plugin defaults; its `Entries` tab is the dedup source.

## Step 1 — Date range

Show a single card / `AskUserQuestion`:

> **What date range?**
> - Today
> - This week
> - Last week
> - Last month
> - Custom (text input)

Resolve to ISO start / end dates in **Pacific time** (the firm's local TZ — see Step 3). Read back one line: *"Sweeping March 2 → March 6, 2026 (last week, Pacific)."*

## Step 2 — Billable user + matters/notes

Auto-detect the current M365 user (the M365 connector exposes the signed-in user — pull email / display name). Match that email against the timekeeper card in `matters-and-rates.md`; that's the default billable user.

Then show one card / `AskUserQuestion` with three fields:

> **Whose time, and any notes?**
>
> - **Billable user** — dropdown of every timekeeper on the rate card. Default = auto-detected current user. (Used as the `activity_user` in Clio — change this when logging on behalf of someone else, e.g. the EVM Martin rule where the team bills as Steve Donell.)
> - **Default billable status** — Billable (default) / Non-billable. Per-entry overrides happen in review.
> - **Matters + notes** — free text. Examples: "all matters", "just FTC", "Laguna only, ignore standups", "everything except internal admin". Treat as authoritative hints; if a note conflicts with what you find, flag rather than silently override.

If the auto-detected email isn't on the rate card, the dropdown still shows the full list — pick "I'll set this" and tell the user.

## Step 3 — Big research (delegate to `activity-miner`)

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

## Step 4 — Zero-results fallback

If the full sweep returns **no candidates**, don't give up. Print:

> "I didn't find any activity in `<range>` for `<billable_user>`. A few possibilities — pick what fits:"
>
> 1. **Wrong range** — was it actually a different week? (Re-prompt date range.)
> 2. **Wrong account** — are you signed into the M365 account that has this work? (List the detected email; offer to switch.)
> 3. **Not working** — PTO / sick / holiday / weekend? (Confirm and stop cleanly.)
> 4. **Off-M365** — phone calls, in-person meetings, paper review? (Switch to **manual entry**: ask what happened, build entries from the description, flag every one for human duration confirmation.)

Don't return an empty CSV. Either widen the search, switch identity, manually capture, or stop with a clear "nothing to bill."

## Step 5 — Draft (delegate to `entry-drafter`)

Pass candidates + `{billable_user, default_billable, notes}` to **entry-drafter**. Apply, in this order:

1. **§ 330(a)(3)–(4) four-prong test** — benefit to estate, necessary to administration, no unnecessary duplication, time proportional to complexity. Fail or doubt → flag.
2. **Categorical non-billables** — see `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Always exclude (phish alerts, vendor pitches, automated reports, personal receipts, internal Clio admin, social-only Teams replies, etc.).
3. **No block billing** — each distinct issue or task gets its own line. "; and" or different topics in one entry → split.
4. **Per-case policy** — Fikhman conservative; Laguna bill everything; Beloit selective; EVM Martin bills as Steve Donell regardless of who did the work. See `matters-and-rates.md`.
5. **Billable user** — set `activity_user = <picked billable_user>` on every entry. The per-matter rate (`price`) follows that user × matter.
6. **Billable / non-billable** — default per Step 2's toggle. The drafter still flips entries to `non_billable = true` when they're administrative or fail § 330 (e.g. a tracked internal-IT email that surfaced).
7. **Honest time estimates** — never pad to hit a daily target, never trim below reality. Email volume alone doesn't drive duration. Total daily hours fall where honest per-task estimates land.
8. **Round UP to the next tenth** — 1–6 min = 0.1, 7–12 = 0.2, … Minimum 0.1.
9. **Description voice** — present-tense billing verb first (Review, Draft, Coordinate, Correspond, Prepare, Discuss, Attend, etc.); name people by full name; specific; no privileged substance; no filler ("briefly", "quickly", "worked on").
10. **Matter assignment** — confirmed mapping → property/entity/party reference → counterparty domain → thread continuity. **Rates file is authoritative — never invent a matter name.** Sender identity alone is never sufficient (Brian Landau, Ori Blumenfeld, Peggy Lennon span matters).

## Step 6 — Review surface (clean cards + big Clio Manage button)

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

## Step 7 — Write the CSV (to the working folder)

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
- `activity_user` — the billable user picked in Step 2 (e.g. `Sarah Bates`). Same on every row in the run (unless an entry was overridden in review).
- `non_billable` — `false` (or blank) for billable; `true` for recorded-but-not-charged.

### CSV encoding (prevents column drift on Clio import)

- **Quote every field** (QUOTE_ALL) — Clio's own export format.
- **UTF-8 BOM** (`utf-8-sig`) — so Excel opens it as UTF-8.
- **Plain ASCII punctuation** — convert em dashes (`—` → ` - `), curly quotes, multi-byte chars.
- **Verify before delivering:** every row has exactly **9 columns**, and columns C (`activity_description`) and G (`type`) are blank.

## Step 8 — Hand off

Print:
- One-line summary (entries · hours · $ · range · billable user).
- What's flagged and why (the `REVIEW FLAGGED` lines from the drafter).
- The **Open Clio Manage** button and the CSV path for bulk import.

Close with: *"Ready to review and import into Clio."*

## Step 9 — Update the log + knowledge store (the plugin learns)

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
- Never auto-bill. The review at Step 6 is the point.
- Don't quote privileged content in descriptions — describe the work, not the substance.
- Don't anchor totals to a daily target (e.g. 8 hours). Hours fall where honest per-task estimates land.
- Don't ask for the timekeeper's name — auto-detect, then show the dropdown.
- Never write to `Timekeeper.xlsx` something the user didn't confirm. The store is the firm's source of confirmed knowledge — speculative entries poison it.
