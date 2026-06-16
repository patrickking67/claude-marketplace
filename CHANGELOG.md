# Changelog

## 2.0.0 — 2026-06-15

**Branding & distribution**
- Marketplace now publishes under **DivergeIT** (`divergeit`); plugin id `timekeeper` with display name **Timekeeper**.
- Added `INSTALL.md` — private-repo, per-user token install + auto-update; multi-surface (Claude.ai / Cowork / Code).

**Rates (custom billable rates)**
- New `references/rate-card.csv` — authoritative `user × matter → rate`, built from 23,000+ real billed entries (e.g. Steve: Laguna 495, Spalding 425, CCOA 500, Long Beach 350, FTC ATS 445.50; Sarah: S. Brower 395, FTC ATS 355.50).
- `matters-and-rates.md` rewritten around a deterministic lookup (learned-mappings → rate-card.csv → alternate rate → flag), with alternate task-based rates, per-case policy, and the shorthand→Clio-name map.

**Context / history**
- New `references/firm-context.md` (firm, roles, people, active matter list, sub-matters, Pacific-time + cadence, Clio import hand-off).
- New `references/billing-style.md` (present-tense voice, § 330, no-block, increments) with real examples.
- New `data/sample-activities.csv` — real billed entries for tone-matching.
- Working-folder `learned-mappings.md` seeded with matters, confirmed mappings, rate rules, skip rules.

**Workflow**
- `draft-time-entries` is **adaptive** — one timekeeper, several, or all — and ends by handing over the import CSV with a **direct Clio import hand-off** (Settings → Import → Activities, not Tasks).
- `entry-drafter` now looks up the exact rate from `rate-card.csv` (no guessing) and writes **present-tense** descriptions.
- `documents` skill: token-optimized parsing (markitdown) and creation of pdf/docx/xlsx/csv.

**Connectors**
- `connectors/mcp-servers.example.json` — optional Zoom, Webex, Calendly, and the planned remote **Clio Manage** connector (with logo hook). M365 remains the required read connector.

**Templates**
- `templates/clio-timeentry-template.csv` — firm-accurate Clio import model.
