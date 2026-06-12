---
name: timekeeper-setup
description: First-run setup for Timekeeper. Use when someone installs the plugin, says set up Timekeeper, check my connectors, is this configured, get started, or before the first run. Confirms the install, checks the Microsoft 365 connector with a smoke test, asks about optional Zoom, has the user pick a working folder, and prints a one-screen "what to do next" card.
---

# Timekeeper setup

A five-minute first run. The flow is: confirm install → check M365 → ask about Zoom → pick a folder → print "what to do next." Keep it warm and short — this is the first impression.

## Step 1 — Confirm install

One line: "Timekeeper v<version> is installed in <surface>." Pull the version from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`. No checklist, no fanfare.

## Step 2 — Check Microsoft 365

Smoke-test the connector by listing the next two or three calendar events for the signed-in user.

- **Works** → "✅ Microsoft 365 connected — I can see <event 1>, <event 2>."
- **Doesn't** → "⚠️ Microsoft 365 isn't connected. Enable it in <Claude.ai Connectors / Claude Code Settings → Connectors> and re-run setup." Stop here until it's connected — nothing else works without it.

## Step 3 — Ask about Zoom (optional)

One question: "Do you use Zoom for client meetings?"
- **Yes, connected** → "✅ Zoom will add meeting attendance to time-entry runs."
- **Yes, not connected** → "Enable the Zoom connector when you have a minute; I'll pick it up next run." Don't block.
- **No** → skip silently.

Mention Webex and Calendly only if the user brings them up.

## Step 4 — Pick a working folder + create the log

Ask the user where Timekeeper should keep its files. Use `AskUserQuestion` with two options:
- **Use an existing folder** — they paste a path.
- **Create a new one** — default suggestion: `~/Timekeeper/<Firm-Name>/`.

Save the resolved path as the **working folder**. Everything Timekeeper writes — per-run CSVs for Clio, plus the master log — lives there.

Then **create `Timekeeper.xlsx`** in the working folder (the persistent log + knowledge store) with four tabs. Pre-fill what we know; the rest fills in as the user works.

| Tab | Purpose | Columns |
|---|---|---|
| **Entries** | Append-only ledger of every drafted entry — dedup, audit, find-unbilled-time | `RunID`, `Drafted`, `Date`, `BillableUser`, `Matter`, `Description`, `Hours`, `Rate`, `Amount`, `Billable`, `Citation`, `Flag`, `Status` (drafted / reviewed / exported / billed) |
| **Mappings** | Confirmed contact / entity / property → matter overrides | `Signal` (email / domain / name / property), `Matter`, `ConfirmedDate`, `ConfirmedBy`, `Notes` |
| **Rates** | Confirmed user × matter rates (overrides the plugin defaults) | `BillableUser`, `Matter`, `Rate`, `EffectiveDate`, `Notes`. Pre-fill the default rate card from the plugin's `matters-and-rates.md`. |
| **Skips** | Confirmed skip rules — recurring senders / patterns to never bill | `Pattern` (email / domain / subject phrase), `Reason`, `ConfirmedDate` |

`Timekeeper.xlsx` is the **source of truth for the firm's confirmed knowledge**. The plugin reads it first on every run; per-run CSVs are for Clio import only.

## Step 5 — Print "what to do next"

A single short card. No further questions.

```
Timekeeper is ready.

To draft time:
  "Draft my time for last week"
  "Log my time today"
  Then pick a date range and (if needed) confirm the billable user.

To search M365:
  Just ask — e.g. "Find the Fikhman deposition notes."

Working folder: <path>
   ↳ Timekeeper.xlsx       — your log + knowledge store (entries, mappings, rates, skips)
   ↳ Timekeeper-Entries_*.csv — one per run, for Clio import
```

That's the whole setup.

## Guardrails

- Don't ask about SharePoint write, Webex, or Calendly unless the user mentions them.
- Don't print warnings like "no write-capable connector found" — none is needed.
- If M365 isn't connected, stop at step 2 — don't pretend the rest of setup is meaningful.
