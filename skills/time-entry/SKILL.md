---
name: time-entry
description: The main Timekeeper workflow — reconstruct billable time from Microsoft 365. Use whenever someone says "log my time," "bill my week," "draft time entries," "reconstruct my hours," "what should I bill," "I forgot to track my time," "turn my email and calendar into time entries," or names a timekeeper and a date range for billing. A short window (a day or two) takes a fast inline path; a week, a month, or several/all timekeepers take the full multi-agent sweep. Runs interactively — confirms who and what dates, mines Outlook/Teams/calendar, shows reviewable cards, and writes an import-ready CSV. Never auto-bills — every entry is a draft for human review.
---

# Time entry

Reconstruct a timekeeper's billable time from Microsoft 365 and produce review-ready entries in the firm's format. This is an **interactive** workflow: confirm first, then work. Accuracy and defensibility beat speed — every entry has to survive a court fee-audit, so when in doubt, flag rather than guess.

Read these before drafting: `${CLAUDE_PLUGIN_ROOT}/references/m365-mining.md`, `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`, `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`. Apply the working folder's `learned-mappings.md` if it exists.

## Pick the path — a short window goes fast

Size the range before anything else:

- **Fast path** — a single day or two ("yesterday," "today," one date). Skip the full interview and the Opus sweep: default the timekeeper to the connected M365 user (confirm in one line), mine that Pacific-day's Outlook sent/received, Teams, and calendar **inline**, draft **inline**, and go straight to review. A day is small enough that spinning up the heavy multi-source agent isn't worth the latency.
- **Full path** — a week, a month, or several/all timekeepers. Run the full workflow below: interview → confirm → delegate discovery to `activity-miner` (Opus) → draft via `entry-drafter` (Sonnet).

Either way, **Steps 5–7 (review → CSV → Clio hand-off) and every guardrail are identical.** Speed never skips the human review.

## Step 1 — Interview (don't skip)

Ask the user, using a single `AskUserQuestion` round where possible:

1. **Timekeeper(s)** — adaptive: **one** person, **several** (name a few), or **all** active timekeepers for a firm-wide run (default: the connected M365 user). For *several/all*, draft each timekeeper separately, then combine — and de-dup shared meetings so one event isn't billed twice. Resolve each name to the rate card in `${CLAUDE_PLUGIN_ROOT}/references/rate-card.csv`.
2. **Date range** — Yesterday / This week / Last week / Last 7 days / Custom. Resolve relative ranges to ISO dates using today's date and read them back.
3. **Matter scope** — all matters, or focus/exclude specific ones?
4. **Notes** (free text, optional) — meetings or people to exclude, a matter the whole day belongs to, a rate override, "ignore anything before 10am," etc. Treat these as authoritative hints; if a note conflicts with what you find, flag the conflict rather than silently overriding.
5. **Output** — CSV only, or CSV + publish to SharePoint.

If the user already gave a concrete range in their message, skip straight to confirmation.

## Step 2 — Confirm

Read back the resolved parameters in one line ("Drafting Sarah's time, 2026-03-02→03-06, all matters, excluding internal standups, CSV only — go?") and wait for a yes. This is the cheap moment to catch a wrong name or window.

## Step 3 — Discover

**Full path** — hand the timekeeper + range + scope to the **activity-miner** agent (Opus). It sweeps Outlook sent/received, Teams, calendar, and SharePoint and returns cited candidates with matter guesses, duration estimates, and confidence. Don't do this sweep inline — the agent is tuned for it and runs on Opus for the hard mapping calls.

**Fast path** (a day or two) — skip the agent and mine inline: read that Pacific-day's sent/received mail, Teams messages, and calendar yourself and form the same cited candidates. Same sources, same citation discipline — just no hand-off.

## Step 4 — Draft

**Full path** — pass the candidates to the **entry-drafter** agent (Sonnet) to set the exact matter and the exact `user × matter` rate from `${CLAUDE_PLUGIN_ROOT}/references/rate-card.csv` (never a guessed number), write **present-tense** descriptions in the firm voice (`${CLAUDE_PLUGIN_ROOT}/references/billing-style.md`), round up to tenths, and emit rows in the exact CSV schema plus a flag list.

**Fast path** — draft inline using the same rate lookup, voice rules, and tenths rounding. The output and flags are identical; you're just not delegating.

## Step 5 — Review (cards or table)

Show the drafted entries for review before anything leaves. **In Cowork**, render a clean card stack with `mcp__visualize__show_widget`; **in Claude.ai or Claude Code**, present the same content as a clean Markdown table — never block on a visualization tool that isn't there. Per entry, show: date, duration, matter, rate, the description (the billable `note`), the M365 citation, and any flag with its reason. Put flagged entries first, and offer **Copy all** plus the CSV. Keep it a calm review surface, not a dashboard.

Above the cards, give a one-line summary: `N entries · X.X billable hours · $Y · [range]`, and call out the flag count ("3 need your eye").

## Step 6 — Write the outputs

Write the entries to `timekeeper-entries-<TK>_<start>_<end>.csv` in the working folder (`<TK>` = the timekeeper's short name, or `AllTimekeepers` for a firm-wide run), header exactly:
`matter,date,activity_description,note,price,quantity,type,activity_user,non_billable`
Quote any field containing a comma, quote, or newline. This CSV is the file the firm imports into Clio.

For a week- or month-scale run, also produce the polished **billing workbook** (`.xlsx`) per `${CLAUDE_PLUGIN_ROOT}/references/output-style.md` (Summary / Detail / Flags) — the reviewer's record — and offer the month-end **memo** when closing a period.

## Step 7 — Hand off to Clio (end every run here)

End by putting the import file in their hands **and** pointing them straight at the Clio import:

1. **Give them the CSV right here.** Surface `timekeeper-entries-<TK>_<start>_<end>.csv` for download/copy (in Cowork, present the file; elsewhere offer **Copy all** + the path), with a one-line roll-up: `N entries · X.X hrs · $Y · F flagged`, flagged items first with reasons.
2. **Redirect to the Clio import** with exact steps:
   - Open **Clio Manage → Settings → Import** — `https://app.clio.com/nc/#/settings?path=imports`
   - Import type: **Activities / Time Entries** — **not** "Tasks from CSV" (Tasks can't map rate/hours/type and fail on the `type` column).
   - **User:** the timekeeper (or leave blank if `activity_user` is filled per row). **File:** the CSV above → **Upload** → review Clio's preview → import. Matters must already exist in Clio, spelled exactly.
3. Then offer: adjust & re-render, run `billing` for a QA/reconcile pass, produce the **workbook/memo**, or `publish` to SharePoint (`Billing Drafts/<year>/<month>/`, see `${CLAUDE_PLUGIN_ROOT}/references/output-style.md`).

Close with **ready to import into Clio**, the CSV, and the import link. When the native **Clio** connector is live, this step posts the activities directly instead of a manual import.

## Guardrails

- Never invent activity, durations, or matter names. Missing signal → conservative estimate + flag.
- Never auto-publish or auto-bill. The human review at Step 5 is the point.
- Don't quote privileged content in descriptions — describe the work, not the substance.
