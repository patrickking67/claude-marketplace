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

## Step 4 — Pick a working folder

Ask the user where Timekeeper should keep its files. Use `AskUserQuestion` with two options:
- **Use an existing folder** — they paste a path.
- **Create a new one** — default suggestion: `~/Timekeeper/<Firm-Name>/`.

Save the resolved path as the **working folder**. Everything Timekeeper writes — CSVs for Clio, `.xlsx` workbooks, the `learned-mappings.md` overlay — lives there.

Create `learned-mappings.md` in the working folder if it doesn't exist, using this template:

```markdown
# Learned mappings (Timekeeper)
Confirmed knowledge that overrides plugin defaults. Edit freely.

## Timekeepers & rates
| Timekeeper | Default rate | Matter-specific rates / notes |
|---|---|---|
| <name> | <rate> | <matter>: <rate> (e.g., FTC matters × 0.90) |

## Contact / entity → matter
| Signal (email, domain, name, property) | Matter (exact) |
|---|---|
| <person@firm.com> | <exact matter name> |

## Skip rules (never bill)
- <recurring internal meeting / newsletter / sender>
```

## Step 5 — Print "what to do next"

A single short card. No further questions.

```
Timekeeper is ready.

To draft time:
  "Draft my time for last week"
  or: "<Name>, <period>"  — e.g. "Patrick King, May 2026" or "everyone, last month"

To get IT help:
  Say "I need IT help" — prints the DivergeIT Help Desk card.

To search M365:
  Just ask — e.g. "Find the Fikhman deposition notes."

Files save to: <working folder>
```

That's the whole setup.

## Guardrails

- Don't ask about SharePoint write, Webex, or Calendly unless the user mentions them.
- Don't print warnings like "no write-capable connector found" — none is needed.
- If M365 isn't connected, stop at step 2 — don't pretend the rest of setup is meaningful.
