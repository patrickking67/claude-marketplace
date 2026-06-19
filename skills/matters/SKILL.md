---
name: matters
description: Find and confirm the right matter for a piece of work from the firm's matter list and Microsoft 365 signals. Use when someone asks which matter does this belong to, look up a matter, list our matters, is this Laguna Beach or Pine Hollow, what's the matter for this client, or needs to map an email or meeting to a matter before billing.
---

# Matters

Get the matter right — a misposted matter is a misbilled client. The **rate model and mapping rules** live in `${CLAUDE_PLUGIN_ROOT}/references/matters-and-rates.md`; the **current matter list** is bundled at `${CLAUDE_PLUGIN_ROOT}/references/matters.csv` (a Clio matters export — number, name, caption, status, dates, responsible attorney, case no., property). Prefer a fresher export if the firm provides one at run time, and apply the working folder's `learned-mappings.md` overrides first. See `${CLAUDE_PLUGIN_ROOT}/references/clio-exports.md` for the full export map.

## Use it to

- **Resolve a matter from activity** — given an email, meeting, or description, name the matter using the signal hierarchy (confirmed mapping → property/entity/party name → counterparty domain → thread continuity). Return the exact display name.
- **Look up / list matters** — answer "what matters do we have," "is X still open," from the current matters export. Never bill a **closed** matter; flag if status is uncertain.
- **Disambiguate** — some clients have several matters under one display name (`Infiniti Health` ×3, `S. Brower Living Trust` ×7, `Tomko` ×4). The matter *number* tells them apart; don't guess which one — surface the options and ask.

## Rules

- Use **exact display names** — a near-miss can mispost or fail import. Watch for stray near-duplicates (e.g., "Pine Hallow" vs "Pine Hollow Receivership Estate").
- **Never invent a matter.** If activity points to something not on the current matter list, say so and ask — then record the confirmed mapping in `learned-mappings.md`.
- Non-client contacts (outside counsel, insurers, vendors) are **not** matters — never bill to them.
- When two matters are plausible, pick the higher-confidence one and **flag** the alternative.

The matter list isn't frozen in the plugin — it's loaded from the current export and is a strong prior, not gospel; confirm anything uncertain with the user.
