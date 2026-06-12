---
name: draft-time-entries
description: The main Timekeeper workflow — reconstruct billable time from Microsoft 365 through a guided interview. Use whenever someone says "log my time," "bill my week," "draft time entries," "reconstruct my hours," "what should I bill," "I forgot to track my time," "turn my email and calendar into time entries," or names a timekeeper and a date range for billing. Runs interactively — it asks who and what dates, confirms, mines Outlook/Teams/calendar, shows reviewable cards, and writes an import-ready CSV. Never auto-bills — every entry is a draft for human review.
---

# Draft time entries

Reconstruct a timekeeper's billable day from Microsoft 365 and produce review-ready entries in the firm's format. This is an **interactive** workflow: interview first, confirm, then work. Accuracy and defensibility beat speed — every entry has to survive a court fee-audit, so when in doubt, flag rather than guess.

Read these before drafting: `${CLAUDE_PLUGIN_ROOT}/references/m365-mining.md`, `${CLAUDE_PLUGIN_ROOT}/references/billing-format.md`, `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`. Apply the working folder's `learned-mappings.md` if it exists.

## Step 1 — Interview (don't skip)

Ask the user, using a single `AskUserQuestion` round where possible:

1. **Timekeeper** — whose time are we drafting? (default: the connected M365 user)
2. **Date range** — Yesterday / This week / Last week / Last 7 days / Custom. Resolve relative ranges to ISO dates using today's date and read them back.
3. **Matter scope** — all matters, or focus/exclude specific ones?
4. **Notes** (free text, optional) — meetings or people to exclude, a matter the whole day belongs to, a rate override, "ignore anything before 10am," etc. Treat these as authoritative hints; if a note conflicts with what you find, flag the conflict rather than silently overriding.
5. **Output** — CSV only, or CSV + publish to SharePoint.

If the user already gave a concrete range in their message, skip straight to confirmation.

## Step 2 — Confirm

Read back the resolved parameters in one line ("Drafting Sarah's time, 2026-03-02→03-06, all matters, excluding internal standups, CSV only — go?") and wait for a yes. This is the cheap moment to catch a wrong name or window.

## Step 3 — Discover (delegate to `activity-miner`, Opus)

Hand the timekeeper + range + scope to the **activity-miner** agent. It sweeps Outlook sent/received, Teams, calendar, and SharePoint and returns cited candidates with matter guesses, duration estimates, and confidence. Don't do this sweep inline — the agent is tuned for it and runs on Opus for the hard mapping calls.

## Step 4 — Draft (delegate to `entry-drafter`, Sonnet)

Pass the candidates to the **entry-drafter** agent to set matters + per-timekeeper rates, write descriptions in the firm voice, round to tenths, and emit rows in the exact CSV schema plus a flag list.

## Step 5 — Review (cards or table)

Show the drafted entries for review before anything leaves. **In Cowork**, render a clean card stack with `mcp__visualize__show_widget`; **in Claude.ai or Claude Code**, present the same content as a clean Markdown table — never block on a visualization tool that isn't there. Per entry, show: date, duration, matter, rate, the description (the billable `note`), the M365 citation, and any flag with its reason. Put flagged entries first, and offer **Copy all** plus the CSV. Keep it a calm review surface, not a dashboard.

Above the cards, give a one-line summary: `N entries · X.X billable hours · $Y · [range]`, and call out the flag count ("3 need your eye").

## Step 6 — Write the outputs

Write the entries to `timekeeper-entries-<start>_<end>.csv` in the working folder, header exactly:
`matter,date,activity_description,note,price,quantity,type,activity_user,non_billable`
Quote any field containing a comma, quote, or newline. This CSV is the file the firm imports into Clio.

For a week- or month-scale run, also produce the polished **billing workbook** (`.xlsx`) per `${CLAUDE_PLUGIN_ROOT}/references/output-style.md` (Summary / Detail / Flags) — the reviewer's record — and offer the month-end **memo** when closing a period.

## Step 7 — Hand off

Tell the user what's flagged and why (the `REVIEW FLAGGED` lines), then offer next steps:
- **Export the CSV + workbook** — the Step 6 `timekeeper-entries-<range>.csv` (the file the firm imports into Clio) plus the billing workbook for the reviewer.
- Adjust and re-render, run `billing-review` for a QA pass, or `publish` the CSV + workbook to the `automation` SharePoint site (`Billing Drafts/<year>/<month>/`, see `${CLAUDE_PLUGIN_ROOT}/references/output-style.md`).

Close with: ready to review and import into Clio.

## Guardrails

- Never invent activity, durations, or matter names. Missing signal → conservative estimate + flag.
- Never auto-publish or auto-bill. The human review at Step 5 is the point.
- Don't quote privileged content in descriptions — describe the work, not the substance.
