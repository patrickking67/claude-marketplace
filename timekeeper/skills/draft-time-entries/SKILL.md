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

Hand `{billable_user, range, scope, notes, default_billable, attachments}` to **activity-miner**. It runs the full sweep across every connected source in parallel per the contract in `${CLAUDE_PLUGIN_ROOT}/references/m365-mining.md` — Pacific-time boundaries, all 7 sources required (Sent / Inbox / Deleted / Calendar / Teams / SharePoint / Claude history), Teams wildcard, email-API constraints. Don't do the sweep inline.

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

Pass candidates + `{billable_user, default_billable, notes}` to **entry-drafter**. The drafter follows `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md` (CSV schema, voice, rounding), `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md` (per-user × per-matter rates, per-case policies, matter assignment), and `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md` (§ 330 four-prong test + categorical exclusions).

Run-specific overrides from Step 1:
- `activity_user` = the picked billable user on every row (the per-matter rate follows from that user × matter).
- Default `non_billable` per the questionnaire toggle; the drafter still flips entries that fail § 330 to non-billable regardless of the default.
- Notes can narrow scope ("just FTC") or pre-exclude ("skip standups") — treat as authoritative; flag conflicts rather than silently overriding.

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

The end output is **just the CSV**, written to the working folder as:

```
Timekeeper-Entries_<billable_user>_<start>_<end>.csv
```

Schema, quoting, encoding, and the 9-column verification are defined in `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md` — follow that file exactly. A one-off single-entry run writes nothing (the card + Clio button are enough). No `.xlsx`, no memo here — those live in the `billing` skill for month-end.

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
