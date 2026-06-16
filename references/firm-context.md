# Firm context — FedReceiver, Inc. / Jalmar Properties, Inc.

Fiduciary-services firm. Principals act as court-appointed **receiver**, **partition referee**, **probate administrator**, **provisional director**, and **trustee**. Office: 12121 Wilshire Blvd., Ste. 710, Los Angeles, CA 90025. **Steve Donell** is responsible/originating attorney and receiver on essentially every matter; **Sarah Bates** is Receiver Administrator / VP.

## Operating facts that drive billing

- **Time zone is Pacific.** Every M365 search must cover a full **Pacific-time day** (local boundaries, or 07:00→07:00Z in PDT / 08:00→08:00Z in PST). UTC-midnight windows drop evening work — the #1 cause of missing time. See `m365-mining.md`.
- **Billing cadence:** monthly. Recurring "Previous Month Billing Due on the 7th" / "Team Meeting" → bill **0.3 hrs** to FTC v. American Tax Service, et al.
- **System of record:** Clio Manage. Time is handed off today via an **import CSV** (see `billing-format.md`); a remote Clio Manage connector is planned to replace it.
- **AR reality (context only, do not bill on it):** most invoices run Past Due with large balances; collections is a live concern but never affects what is billed.

## Active matters (exact Clio display names — reload from the live Clio matters export each run)

1427 15th Street Receivership · 8619-8621 Wilshire Referee Estate · Beloit Receivership Estate · Bergazin Referee Estate · Birdies Receivership Estate · CCOA Receivership · Crenshaw Blvd. Referee Estate · East Valley Referee Estate · Eprazel Receivership Estate · Estate of Nina Ruth Chomsky · FTC v. American Tax Service, et al. · FTC v. Ascend Capventures, et al. · Fikhman Receivership · Foreside Receivership Estate · Gledhill Referee Estate · Harris Avenue Referee Estate · Infiniti Health Receivership · Laguna Beach Receivership Estate · Leighton Ave Receivership Estate · Long Beach Eucl. Apts., LLC · Long Beach Vers. Apts., LLC · Maie Avenue Receivership · Malibu Receivership Estate · Martin Apartments, LLC · Mason Turk Receivership · Nature's Growers Receivership Estate · O'Farrell Referee Estate · Pacific Avenue Referee Estate · Parachute Technology, Inc. · Pine Hollow Receivership Estate · S. Brower Living Trust · SF Eagle Bar Receivership · Sea Star Estates HOA · South Hobart Referee Estate · Spalding HOA Receivership Estate · Stout Receivership · Tomko Receivership Estate · Waid Receivership Estate · Youssif v. Youssif, et al. · Zola Hospice Receivership Estate

**Sub-matters** (disambiguate by matter number; surface options, never guess): `S. Brower Living Trust` (Rivo Alto – Long Beach, 165 W 91 St – NY, Canyons Resort – UT, Oak Knoll – Pasadena, 93 Shore Rd – ME, 18 Crest Ave – ME), `Tomko Receivership Estate` (Fountain Valley, Walnut, June Lake, General Receivership), `Infiniti Health Receivership` (General, Nurchure Staffing). Historical/closed matters (Butler, Serenity, Griffin Resources, McEntyre, Bui Bankruptcy, Bellhouse) appear in `rate-card.csv` for rate history but **don't bill a closed matter**.

## People (rate-bearing timekeepers)

Steve Donell · Sarah Bates · Lisa Qin · Laura Urbano · Todd Donell · James Donell · Kari Wilson · Surya Santhanam. Exact `user × matter` rates: `${CLAUDE_PLUGIN_ROOT}/references/rate-card.csv`.

## Clio import hand-off (where every time-entry run ends)

The firm imports the CSV into **Clio Manage → Settings → Import** (`https://app.clio.com/nc/#/settings?path=imports`). Critical: choose the **Activities / Time Entries** import type — **not** "Tasks from CSV" (Tasks can't map the rate/hours/type columns). Matters must already exist in Clio, spelled exactly. See `billing-format.md` for the CSV contract and the end of `draft-time-entries` for the hand-off script.
