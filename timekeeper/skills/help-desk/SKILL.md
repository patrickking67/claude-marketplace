---
name: help-desk
description: Print the DivergeIT Help Desk contact card. Use whenever someone asks for IT help, says my password / MFA / account is locked / something's broken / who do I contact / I need access / open a ticket / Keeper / VPN / new laptop / printer issue. Output is a single clean card with phone, email, and portal — never improvise security steps, never collect credentials.
---

# Help desk

When the user needs IT help, print the **DivergeIT Help Desk** card. That's it. Don't try to fix the issue yourself, don't collect credentials, don't reset anything.

## Output

Render a single card (in Cowork) or a clean Markdown block (everywhere else). Exactly this content:

```
DivergeIT Help Desk

Phone:  310-765-7205
Email:  help@divergeit.com
Portal: https://portal.divergeit.com
```

Add one line under it: "Tell them your name, the affected app or account, what you expected, and what happened."

## Guardrails

- Never ask for, display, log, or store a password, MFA code, recovery code, or API key. If the user pastes one, tell them to rotate it via the help desk and stop.
- Don't walk a user through MFA resets, account unlocks, or permission grants — that's the help desk's verified process.
- The firm's password manager is **Keeper**. Access to a vault or shared folder is requested through the help desk.
- For data-handling and privilege questions (not IT), point to `billing-best-practices`, not the help desk.
