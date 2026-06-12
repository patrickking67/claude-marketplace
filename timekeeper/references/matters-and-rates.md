# Matters and rates

This file carries the firm's **rate model and billing methodology** — the stable knowledge. The **current matter list** (names, sub-matters, open/closed) is **not** frozen here: load it from the firm's Clio matters export at run time, or accrue confirmations in `learned-mappings.md`. **Clio is the firm's system of record** — treat everything here as a strong prior and confirm anything uncertain.

Firm: **FedReceiver, Inc.** — Steve Donell is responsible/originating attorney (and receiver) on essentially every matter; most share the asset-manager address, 12121 Wilshire Blvd., Ste. 710, Los Angeles, CA 90025.

## How rates resolve

Rates are **per timekeeper**, not per matter — the same matter shows multiple rates because different people worked it. The rate on an entry is set by *who* did the work, so identify the timekeeper before setting `price`. Match the M365 actor to the rate card below by **email**.

### Timekeeper rate card (authoritative — FedReceiver Clio user list)

| Timekeeper | Email | Type | Default rate |
|---|---|---|---|
| Steve Donell | steve.donell@jalmar.com | Attorney | $495.00 |
| Sarah Bates | sarah.bates@fedreceiver.com | Attorney | $395.00 |
| Todd Donell | todd.donell@fedreceiver.com | Non-attorney | $395.00 |
| James Donell | james.donell@fedreceiver.com | Non-attorney | $395.00 |
| Lisa Qin | lisa.qin@fedreceiver.com | Non-attorney | $275.00 |
| Laura Urbano | laura.urbano@fedreceiver.com | Non-attorney | $195.00 |
| Kari Wilson | kari.wilson@fedreceiver.com | Non-attorney | $165.00 |
| Surya Santhanam | surya.santhanam@jalmar.com | Non-attorney | $125.00 |
| Dora Orgill | dora.orgill@fedreceiver.com | Non-attorney | — (does not bill time) |
| General Administrative | lisa.qin@jalmar.com | — | $148.50 |

These are **firm default rates**. The actual rate resolves **user → matter → firm**, so a matter-specific override wins — see the per-matter base/alternate rates below. Rates also vary **per user per matter**: e.g., Steve Donell bills $495 on Laguna but ~$450 on Beloit (per the May productivity report). When a specific user×matter rate isn't certain, **flag** rather than guess. Capture confirmed corrections in `learned-mappings.md` (it overrides this card).

**Rate rules & gotchas:**
- **FTC matters run at standard × 0.90** (court-supervised). On `FTC v. American Tax Service, et al.`: Sarah $395 → $355.50, the $275 tier → $247.50. Apply and **flag for confirmation**.
- **Two email domains** — `@jalmar.com` (Steve, Surya) and `@fedreceiver.com` (Sarah, Todd, James, Lisa, Laura, Kari, Dora). Match on the full address, not the first name.
- **Lisa Qin has two identities:** the person `lisa.qin@fedreceiver.com` bills at **$275**; the **"General Administrative"** billing alias `lisa.qin@jalmar.com` bills at **$148.50**. Don't conflate them — pick by the address on the activity, and flag if ambiguous.
- **"General Administrative"** is a billing catch-all, not a person — use only when the firm explicitly bills general admin; never auto-assign personal work to it.
- **Dora Orgill** has a Billing role but **no rate** — she doesn't bill time. If her activity surfaces, treat as non-billing and flag rather than inventing a rate.

### Alternate (task-based) rates — same matter, two rates

Four matters carry a **base** rate (financial/admin/bookkeeping work) **and** a higher **alternate** rate (receiver- or legal-level work — tenant, eviction, lease, strategy, court, receiver decisions). The rate follows the **nature of the task**, not just the person — the firm's working file hardcodes the alternate. Match an entry's rate to comparable tasks on that matter and **flag** when unsure.

| Matter | Base | Alternate (higher-level work) |
|---|---|---|
| Laguna Beach Receivership Estate | 275 | **395** |
| Beloit Receivership Estate | 235 | **365** |
| Nature's Growers Receivership Estate | 235 | **365** |
| FTC v. American Tax Service ("ATS") | 247.50 | **355.50** (both already ×0.90, court-supervised) |

Real example (Laguna, from the firm's own import): accounting / journal-entry / bookkeeping → 275; tenant, eviction, lease, strategy, receiver decisions → 395.

### Per-case billing policies (confirmed by Sarah Bates)

Each case bills differently — apply the case's policy, never a uniform rule:

| Matter | Policy |
|---|---|
| **Fikhman Receivership** | **Conservative** — heavily scrutinized. Descriptions must be very detailed; bill **less** time than actually incurred and **omit** some tasks entirely as a courtesy. When in doubt, trim and flag. |
| **Laguna Beach Receivership Estate** | **Bill everything** — all time actually spent. |
| **Beloit Receivership Estate** | **Only certain task types are billable** — don't bill the whole day; include only what the firm bills here and flag the rest. |
| **EVM Martin** (= `Martin Apartments, LLC`) | **Steve Donell is the sole biller.** The team performs the work and bills **on Steve's behalf** — set `activity_user = Steve Donell` regardless of who did it. |

When a case isn't listed, bill honestly per the § 330 test and the no-block rule. Record new per-case policies in `learned-mappings.md` as they're confirmed.

### Matter names — working shorthand vs. Clio display name

The firm's working spreadsheet uses **shorthand** ("Beloit", "ATS", "Nature", "Laguna"); Clio's display names are longer ("Beloit Receivership Estate", "FTC v. American Tax Service, et al.", "Nature's Growers Receivership Estate", "Laguna Beach Receivership Estate"). Always resolve shorthand to the **exact Clio display name** — it must match Clio exactly for the CSV to import cleanly. The authoritative rate source is the firm's **Billing Rates** tab; this card is the working prior.

## Rates by matter (prior — confirm against the firm's rate report)

| Matter (exact) | Rates seen |
|---|---|
| Beloit Receivership Estate | 365, 235 |
| Birdies Receivership Estate | 165 |
| Eprazel Receivership Estate | 235 |
| Estate of Nina Ruth Chomsky | 275 |
| Fikhman Receivership | 275 |
| Foreside Receivership Estate | 275 |
| FTC v. American Tax Service, et al. | 247.50, 355.50 |
| FTC v. Ascend Capventures, et al. | 235 |
| Gledhill Referee Estate | 275 |
| Infiniti Health Receivership | 185 |
| Laguna Beach Receivership Estate | 395, 275 |
| Leighton Ave Receivership Estate | 185 |
| Maie Avenue Receivership | 275 |
| Nature's Growers Receivership Estate | 235, 365 |
| Pine Hollow Receivership Estate | 275 |
| S. Brower Living Trust | 275 |
| Sea Star Estates HOA | 275 |
| Spalding HOA Receivership Estate | 185 |
| Stout Receivership | 275 |
| Zola Hospice Receivership Estate | 185 |

## Matter list — load at run time (not frozen here)

The authoritative, current matter list — exact display names, sub-matters, and open/closed status — comes from the firm's **Clio matters export** (provided when running) or live Clio later. Don't rely on a baked-in list; it drifts as matters open and close. Stable methodology that always applies:

- **Use exact Clio display names** in the `matter` column — a near-miss misposts or fails import. Watch for stray near-duplicates ("Pine Hallow" vs "Pine Hollow Receivership Estate").
- **Sub-matters:** some clients have several matters under one display name (e.g. `Infiniti Health Receivership`, `S. Brower Living Trust`, `Tomko Receivership Estate`). The matter **number** disambiguates — flag for confirmation, never guess which one.
- **Never bill a closed matter** — check status on the current export; flag if unsure.
- **Never invent a matter** — if activity points to something not on the current list, flag **UNCLEAR**.

## Mapping activity → matter

Signals, strongest first:
1. **Confirmed mapping** in `learned-mappings.md`.
2. **Property / entity / party name** in the subject, body, or attendees — matters are named for properties, estates, or cases (FTC v. …, Youssif v. …).
3. **Counterparty email domain** or recurring contact.
4. **Thread continuity** — a reply belongs to its parent's matter.

When two matters are plausible, pick the higher-confidence one and **flag** the alternative. Never split one task across matters to inflate entries. Non-client contacts in Clio (outside counsel such as Riley|Ersoff, Martinez & Schill; Mercury Insurance; etc.) are **not** matters — never bill to them. Watch for near-duplicate names (e.g., a stray "Pine Hallow" vs "Pine Hollow Receivership Estate") and use the clean one.

### Confirmed mappings (assign without re-confirming — per Sarah Bates)

| Reference in the source | Matter |
|---|---|
| Troon Drive (property address, Henderson, NV) | FTC v. American Tax Service, et al. |
| Legacy Estates | FTC v. American Tax Service, et al. |
| eMinutes entity enrollment / good-standing for ATS-related entities | FTC v. American Tax Service, et al. |
| 891 Laguna Canyon / Laguna Art District / Laguna Canyon General folder | Laguna Beach Receivership Estate |
| George Fikhman / CBT account / asset tracing / 1031 exchange analysis | Fikhman Receivership |
| Don Trojan / Trojan and Company (when Brower referenced) | S. Brower Living Trust — sub-matter per content |
| Stout / Julie Wilson / Andrew Stout / Schwab | Stout Receivership |
| Recurring monthly "Team Meeting" / "Previous Month Billing Due on the 7th" | FTC v. American Tax Service, et al. — bill **0.3 hrs** |

### Sender identity is never enough to assign a matter

A sender's name alone never assigns a matter — the matter must be referenced in the subject, body, or thread. This bites hardest on contacts who span matters:
- **Brian Landau** (CPA/accountant) — multiple matters
- **Ori Blumenfeld** (attorney) — multiple matters
- **Peggy Lennon** (attorney, Deka Law) — appears in S. Brower Living Trust

No explicit matter reference in the message → flag **UNCLEAR**, don't guess from the sender.
