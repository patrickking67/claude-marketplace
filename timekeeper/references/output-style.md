# Output style

How Timekeeper turns reviewed entries into clean, firm-grade output. The **CSV** is the machine format for Clio import; the **workbook** is a heavier artifact used only by the `billing` skill at month-end. The default `draft-time-entries` run is one questionnaire card → one sweep → review cards + Clio-button + the CSV — that's it.

Everything writes to the **working folder** the user chose at setup. No SharePoint publishing.

## The questionnaire card (the one prompt)

The single intake at the top of a `draft-time-entries` run. Five fields + an optional upload + one submit button. **Defaults visible and editable** — the user can submit without changing anything.

```
┌──────────────────────────────────────────────────────┐
│  [firm-logo 24px]  Draft time entries                │
│                                                      │
│  1. Date range                                       │
│     ◉ Last week   ○ Today   ○ This week              │
│     ○ Last month  ○ Custom: [______________]         │
│                                                      │
│  2. Billable to       [ <auto-user>         ▼ ]      │
│  3. Matters           ◉ All   ○ Specific: [____]     │
│  4. Billable          ◉ Billable  ○ Non-billable     │
│  5. Notes (opt)       [____________________________] │
│                                                      │
│  📎 Attach (opt) — Clio export, ICS, invoice, etc.   │
│                                                      │
│           ┌──────────────────────┐                   │
│           │  Run sweep   →       │                   │
│           └──────────────────────┘                   │
└──────────────────────────────────────────────────────┘
```

Header logo from `${CLAUDE_PLUGIN_ROOT}/assets/firm-logo.png`, 24px, left-aligned. Title in normal weight, no all-caps.

- **Width:** card-width, single column.
- **Submit button:** Clio-blue-adjacent or firm-neutral primary color — but smaller than the post-review *Open Clio Manage* button (that one is the visual climax of the run, this is just the kickoff).
- **No "Cancel"** — closing the card cancels.
- **Outside Cowork:** render as a single defaults-filled prompt; accept "go" to use defaults, or parsed overrides in one reply. Don't drip-ask.

## Default run output

| Surface | Artifact |
|---|---|
| Conversation | Clean entry cards (or Markdown table) + a prominent **Open Clio Manage** button + the CSV path |
| Working folder | `Timekeeper-Entries_<billable_user>_<start>_<end>.csv` (only) |

No `.xlsx`, no memo on a default run. Those only ship from the `billing` skill (month-end workbook / sign-off memo).

## Review surface — the cards

**Goal:** dense, calm, scannable. Four lines per card, max. The reviewer should know in two seconds whether to approve, edit, or drop it.

### Card layout

```
┌────────────────────────────────────────────────────────────┐
│  Mar 3, 2026 · 0.4h · FTC v. American Tax Service · $355.50│   ← header line
│                                                            │
│  Review and respond to correspondence from Matt Pham re    │   ← description (the `note`)
│  discovery requests; draft detailed response.              │
│                                                            │
│  ↳  Outlook · "Discovery Production Status" · 11:32 AM PST │   ← citation footnote
└────────────────────────────────────────────────────────────┘
```

- **Header line:** `<date> · <duration>h · <matter> · $<rate>`. Matter shown by exact Clio display name.
- **Description:** the `note` text exactly as it will appear on the bill — present tense, billing-verb-first, ≤ ~140 chars (wrap if longer).
- **Citation footnote:** source · subject/title · time. Compact `↳` glyph.
- **Optional footer chips (only when needed):**
  - 🟡 **Flag** — short reason ("Unclear matter", "FTC rate confirm", "Thin duration").
  - **Billable user chip** — only if overridden from the run default.
  - **Non-billable chip** — only if this row is non-billable.

### Above the cards

One line, plain text:

```
N entries · X.X billable hours · $Y · <range> · billable to <user>
3 need your eye — shown first.
```

Flagged entries come first, then chronological.

### Below the cards — the Clio button

Compact, branded, single action. Sized to feel like a real Clio "Open in Clio" affordance — not a hero banner.

```
                ┌────────────────────────────┐
                │ [Clio mark]  Open Clio  →  │     ← ≈ 240px wide, Clio brand
                └────────────────────────────┘       background, white text
Bulk import: <working-folder>/Timekeeper-Entries_<user>_<start>_<end>.csv
```

- **Size:** ≈ 240–280px wide × 40–44px tall. Centered. Smaller than the questionnaire's Run-sweep button, smaller than the entry cards.
- **Background:** Clio brand blue. Use `#3A6FD8` as the working hex (their current marketing blue trends to that range); the rendering layer can swap to whatever Clio is using if it has the asset.
- **Text:** "Open Clio" or "Open Clio Manage" → white, semibold, ~14–15px.
- **Logo:** the Clio "C" mark, left of the text. Reference Clio's public mark at `https://www.clio.com/favicon.ico` (24×24) or, if the surface has Clio's brand SVG, prefer that. Don't bundle Clio assets in the plugin.
- **Link target:** `https://app.clio.com/nc/#/activities`.
- **Below the button:** small monospace line — `Bulk import: <csv-path>`.

In Claude.ai / Claude Code (no rich buttons), render as a single emphasized link line — no oversized formatting:

```
[![Clio](https://www.clio.com/favicon.ico)  Open Clio →](https://app.clio.com/nc/#/activities)

Bulk import: <csv-path>
```

## Firm branding

The firm logo is bundled at `${CLAUDE_PLUGIN_ROOT}/assets/firm-logo.png` (square, 512×512 PNG). Use it for:

- **Questionnaire card header** — 24–28px in the top-left of the questionnaire, left of "Draft time entries".
- **Review surface header** — same size, left of the run summary line ("Sarah Bates · Mar 2 – Mar 6, 2026 · 12 entries · 8.4 hr · $3,320").
- **Workbook / memo letterhead** (`billing` skill only) — 64–80px, centered or top-left of the title block.

Keep it small and quiet — accent, not headline. Never frame, never add a drop shadow, never colorize.

If the working folder contains `branding/firm-logo.png`, prefer it over the bundled one. That's how a future firm overrides without forking the plugin.

### Per-entry inline edits

Editable in place (no separate form):
- Billable user (dropdown from rate card)
- Billable / non-billable (toggle)
- Description (free text)
- Duration (decimal hours)

Matter and rate are inferred from the work + rate card — if the user wants to change them, they pick from the matter dropdown and the rate auto-updates.

## CSV (Clio bulk import)

Schema, encoding, and verification rules live in `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`. Filename:

```
Timekeeper-Entries_<billable_user>_<start>_<end>.csv
```

`<billable_user>` = the picked user's short name (e.g. `Sarah-Bates`).

- **Never overwrite** an existing file — version with `_vN` and tell the user.
- Never modify the firm's source files.

## The master log + knowledge store — `Timekeeper.xlsx`

Created by `timekeeper-setup` in the working folder. **One xlsx, four tabs, append-only.** Every run reads it first (defaults overridden) and appends to it (entries + confirmed learnings). It's the firm's durable record outside Clio.

### Tabs

**`Entries`** — append-only ledger of every drafted entry.
Columns: `RunID` · `Drafted` · `Date` · `BillableUser` · `Matter` · `Description` · `Hours` · `Rate` · `Amount` · `Billable` · `Citation` · `Flag` · `Status` (`drafted` / `reviewed` / `exported` / `billed`).
Formula `Amount = Rate × Hours`. Hours `0.0`, money `$#,##0.00`, date `m/d/yyyy`. Frozen header, banded rows, wrap Description, right-align numerics. Amber-tint flagged rows.

**`Mappings`** — confirmed contact / entity / property → matter overrides.
Columns: `Signal` · `Matter` · `ConfirmedDate` · `ConfirmedBy` · `Notes`.

**`Rates`** — confirmed user × matter rates. Overrides the plugin's default rate card.
Columns: `BillableUser` · `Matter` · `Rate` · `EffectiveDate` · `Notes`.
Setup pre-fills this from the plugin's `matters-and-rates.md` so the user can see / edit defaults.

**`Skips`** — confirmed recurring senders / patterns to never bill.
Columns: `Pattern` · `Reason` · `ConfirmedDate`.

### Rules

- **Never overwrite** — append rows; preserve the user's manual edits.
- **Never write speculative knowledge** — only what the user confirmed in the current run.
- **Read first, write last** — every skill reads the workbook before drafting; writes happen after user approval.

### Optional sub-products (only on explicit request from the `billing` skill)

- **Summary view** — a temporary sheet `Summary_<period>` summarizing totals by matter / by user for a period; users export to PDF for sign-off.
- **Period memo** — `Billing-Memo_<period>.pdf` for month-end (letterhead, totals, flags, sign-off line).

Default `draft-time-entries` runs only append to `Entries` (plus any confirmed Mappings / Rates / Skips). No new files, no summary sheet, no memo unless asked.


