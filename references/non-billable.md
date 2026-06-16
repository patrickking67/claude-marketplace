# Non-billable & § 330 screening

What to exclude from billing, and the test for judgment calls. Applied by `activity-miner` during discovery and `billing-auditor` during QA. When uncertain, **flag for the human** — never silently include or drop.

## 11 U.S.C. § 330(a)(3)–(4) — the four-prong test

Courts disallow compensation for services that fail any prong; California courts apply the same to receiver fees. Test every entry:

1. **Benefit to the estate** — does it advance the estate's administration? Internal IT, website/marketing/SEO, personal correspondence, vendor pitches, and inquiries from non-estate parties generally do **not**.
2. **Necessary to administration** — tied to administering *this* estate (turnover, accounting, court-ordered tasks, property preservation, fee applications, hearings)?
3. **No unnecessary duplication** — when several team members are on one chain, the entry must reflect the biller's **distinct** contribution, not duplicative review of others' work.
4. **Time proportional to complexity** — a one-word reply ("Yes", "Thanks") rarely justifies an entry; substantive analysis/drafting warrants time defensible against the actual complexity.

Fail or doubt → flag with a § 330 note. Never silently include or exclude.

## Categorically non-billable (always exclude)

- Phish-alert reporting and security training
- Newsletters / promotional email
- AvidXchange invoice-approval **notification** emails (the notification itself; the underlying invoice review may bill only if substantive review shows in other source material)
- Quarantine notices and spam
- Generic vendor pitches via website "Get In Touch" forms
- Email referencing **Washington, Pico Rivera, or Houle**
- Automated security-guard reports (e.g. Citiguard daily activity)
- FedReceiver website system notifications (registrations, password changes, FAQ confirmations, similar automated site email)
- Automated Zillow daily listing reports
- Vendor pitches from staging companies, IT consultants, or similar unsolicited proposals
- Internal IT onboarding/setup email (e.g. AI-tool deployment instructions to staff)
- Authentication / access-code email (SafeSend, login links, one-time codes)
- Teams "missed activity" notification email
- Office-printer scan emails alone (billable only if the document reviewed ties to a specific matter task)
- EverCharge charging-session summaries (personal)
- Uber trip receipts (personal; not matter travel)
- Adobe Sign automated cancellation notices (no action taken)
- Anthropic billing/receipt email
- Claude.ai product-announcement email
- Clio marketing / newsletter email
- Teams messages that are pure social replies ("ok", "thanks", "LOL", "great!", single emoji)
- Internal cross-matter billing/Clio administration (circulating draft bills for approval, "billing audit" review, updating master case lists) — firm admin, not billable to any single estate

## Flag, don't assume (borderline)

- **Home Depot order confirmations** — may bill if for Troon property maintenance; otherwise personal.
- **Scanned-document emails** — bill only if the underlying document and its matter are identifiable.
- **Voicemail-notification emails** — bill only with enough context to identify the matter and a substantive action taken.
