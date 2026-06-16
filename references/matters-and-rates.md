# Matters and rates

Firm: **FedReceiver, Inc. / Jalmar Properties, Inc.** — fiduciary services (court-appointed **receiver**, **partition referee**, **probate administrator**, **trustee**). Steve Donell is responsible/originating attorney on essentially every matter; most share 12121 Wilshire Blvd., Ste. 710, Los Angeles, CA 90025.

**Clio Manage is the system of record.** Everything here is a strong prior — confirm against live data and capture confirmations in the working folder's `learned-mappings.md` (it overrides this file).

---

## Rate resolution — deterministic, in this order

Set `price` by looking up the **timekeeper × matter**, not by a flat per-person default. Rates vary enormously by matter (Steve bills 325–500 depending on the matter).

1. **`learned-mappings.md`** override for this `user × matter`, if present. Use it.
2. **`${CLAUDE_PLUGIN_ROOT}/references/rate-card.csv`** — the authoritative card, built from 23,000+ real billed entries. Look up the row where `user` = the timekeeper and `matter` = the exact Clio matter. Use `primary_rate`.
   - `other_rates_seen` lists rates that also appear for that pair (with counts) — usually the **alternate/task-based** rate or a historical rate. If the task is higher-level work (see Alternate rates), prefer the higher rate and **flag**.
3. **Alternate (task-based) rate** — see table below.
4. **FTC × 0.90** — already baked into `rate-card.csv` primary rates for the two FTC matters; don't reduce twice.
5. **No confirmed rate found → FLAG, never guess a number.**

> Prefer reading `rate-card.csv` with a script (grep/csv) over eyeballing — it's exact and fast. The drafter and auditor both load it.

### Sample confirmed rates (from `rate-card.csv` — illustrative, not exhaustive)

| Matter | Steve Donell | Sarah Bates | Lisa Qin |
|---|---|---|---|
| Laguna Beach Receivership Estate | 495 | 395 | 275 |
| Spalding HOA Receivership Estate | 425 | 295 | 185 |
| FTC v. American Tax Service, et al. | 445.50 | 355.50 | 247.50 |
| FTC v. Ascend Capventures, et al. | 450 | 365 | 235 |
| Beloit Receivership Estate | 450 | 365 | 235 |
| Tomko Receivership Estate | 385 | 275 | 165 |
| CCOA Receivership | 500 | 395 | — |
| Estate of Nina Ruth Chomsky | 325 | 295 | — |
| Long Beach Eucl./Vers. Apts., LLC | 350 | — | — |
| Martin Apartments, LLC ("EVM Martin") | 350 | — | — |

### Alternate (task-based) rates — higher rate for receiver/legal/strategy/court/tenant/lease work

| Matter (shorthand) | Base | Alternate |
|---|---|---|
| Beloit | 235 | **365** |
| Laguna | 275 | **395** |
| Nature('s Growers) | 235 | **365** |
| ATS (FTC v. American Tax Service) | 247.50 | **355.50** (both already ×0.90) |

Base = financial/admin/bookkeeping/journal entries; alternate = tenant, eviction, lease, strategy, court, receiver decisions. Match the entry's task type and **flag** if unsure.

### Per-case billing policy (confirmed by Sarah Bates) — apply the case's policy, never a uniform rule

| Matter | Policy |
|---|---|
| **Fikhman Receivership** | **Conservative** — heavily scrutinized. Very detailed descriptions; bill **less** than incurred and **omit** some tasks. When in doubt, trim and flag. |
| **Laguna Beach Receivership Estate** | **Bill everything** actually spent. |
| **Beloit Receivership Estate** | **Only certain task types billable** — don't bill the whole day; flag the rest. |
| **Martin Apartments, LLC ("EVM Martin")** | **Steve Donell is the sole biller** — set `activity_user = Steve Donell` regardless of who did the work. |

### Timekeepers (active billers, from the activities export)

Steve Donell · Sarah Bates · Lisa Qin · Laura Urbano · Todd Donell · James Donell · Kari Wilson · Surya Santhanam · (Dora Orgill — minimal; "General Administrative" — billing alias, not a person). Match the M365 actor to the timekeeper by **full email**; two domains exist (`@jalmar.com` and `@fedreceiver.com`).

---

## Matter names — shorthand vs. Clio display name

Working sheets use shorthand ("Beloit", "ATS", "Nature", "Laguna"); Clio needs the **exact display name** or the import misposts/fails:

| Shorthand | Clio display name |
|---|---|
| Beloit | Beloit Receivership Estate |
| ATS | FTC v. American Tax Service, et al. |
| Ascend | FTC v. Ascend Capventures, et al. |
| Nature | Nature's Growers Receivership Estate |
| Laguna | Laguna Beach Receivership Estate |
| EVM Martin | Martin Apartments, LLC |

The current matter list lives in `${CLAUDE_PLUGIN_ROOT}/references/firm-context.md` (and reload from the live Clio matters export). **Never bill a closed matter; never invent a matter** — flag **UNCLEAR**. **Sub-matters** exist for `S. Brower Living Trust`, `Infiniti Health Receivership`, and `Tomko Receivership Estate`; the matter **number** disambiguates — surface options, don't guess.

## Mapping activity → matter (signals, strongest first)

1. **Confirmed mapping** in `learned-mappings.md`.
2. **Property / entity / party name** in subject, body, or attendees (matters are named for properties, estates, or cases — *FTC v. …*, *Youssif v. …*).
3. **Counterparty email domain** or recurring contact.
4. **Thread continuity** — a reply belongs to its parent's matter.

**Sender identity alone never assigns a matter** — the matter must appear in the subject, body, or thread. Watch contacts who span matters (Brian Landau, CPA; Ori Blumenfeld, atty; Peggy Lennon, atty → often S. Brower). Two plausible matters → pick higher-confidence, flag the alternative. Outside counsel/insurers/vendors are **not** matters.

### Confirmed mappings (assign without re-confirming — per Sarah Bates)

| Reference | Matter |
|---|---|
| Troon Drive (Henderson, NV) · Legacy Estates · eMinutes good-standing for ATS entities | FTC v. American Tax Service, et al. |
| 891 Laguna Canyon / Laguna Art District / Laguna Canyon General folder | Laguna Beach Receivership Estate |
| George Fikhman / CBT account / asset tracing / 1031 exchange | Fikhman Receivership |
| Don Trojan / Trojan and Company (when Brower referenced) | S. Brower Living Trust (sub-matter per content) |
| Stout / Julie Wilson / Andrew Stout / Schwab | Stout Receivership |
| Recurring "Team Meeting" / "Previous Month Billing Due on the 7th" | FTC v. American Tax Service, et al. — **0.3 hrs** |
