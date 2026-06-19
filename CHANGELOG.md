# Changelog

## 2.1.0 — 2026-06-19

**Connectors — native only**
- Dropped the bundled `@softeria/ms-365-mcp-server`; `.mcp.json` ships empty. Timekeeper now uses Claude's **native** Microsoft 365 connector for all M365 data, with **Zoom for Claude** optional and a **native Clio** connector planned (CSV import until then). Rewrote `CONNECTORS.md`; removed `connectors/mcp-servers.example.json`.

**Skills — friendlier names**
- `draft-time-entries` → **`time-entry`**, with a **fast inline path for short ranges** (a day or two skips the Opus sweep) and the full multi-agent path for weeks / months / all-timekeepers.
- `billing-best-practices` → **`billing-rules`**.
- Removed the **`it-support`** skill — IT / access / password requests route to the firm's IT support provider.
- `timekeeper-setup` kept as-is.

**Clio reference data**
- Added `references/matters.csv` (matters export), `data/sample-contacts.csv` (contacts export), and `data/sample-clio-import.csv` (a real time-entry import), plus `references/clio-exports.md` mapping each Clio export/report to the skill that reads it. Wired into `matters`, `contacts`, `billing`, and `firm-context.md`.

**Access control**
- Added an **in-plugin allowlist gate** (`hooks/hooks.json` + `hooks/allowlist-gate.mjs` + `hooks/allowed-users.txt`): a SessionStart hook that restricts Timekeeper to allowlisted Microsoft 365 users (Steve Donell, Sarah Bates, plus a test admin) and declines for anyone else. Advisory — pair with private-repo access / managed-settings scoping. `INSTALL.md` documents org-wide deployment + the gate.

**Meta**
- `author` → **Patrick King** (marketplace owner stays DivergeIT).
- `INSTALL.md`: added **Restricting to certain users** (private-repo access control).
- Plugin + marketplace version → 2.1.0.

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
