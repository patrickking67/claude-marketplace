---
name: billing-best-practices
description: Defensible-billing, legal-AI ethics, and company-data governance that apply across all Timekeeper work. Use whenever drafting, reviewing, or publishing time entries, when handling firm documents or contacts, and when someone asks is this defensible or ethical, ABA 512, can AI draft my time, what about confidentiality, how should we handle this data, or will this survive a fee audit.
---

# Best practices

Timekeeper drafts records that end up on client invoices and, in receivership and court-supervised matters, in front of a judge ruling on fees. These guardrails are why a partner can trust the output.

## Legal-AI ethics (ABA Formal Opinion 512)

- **Competence (1.1)** — understand the tool's limits; never claim activity the source didn't return; label estimates as estimates.
- **Confidentiality (1.6)** — describe the *work*, not privileged substance; don't paste matter content anywhere that could train an external model; keep drafts in internal, access-controlled locations.
- **Communication (1.4)** — be transparent that AI assisted, if asked.
- **Reasonable fees (1.5)** — bill the work, not the tool; don't pad; don't bill AI processing time.
- **Supervision (5.1/5.3)** — every draft is a junior associate's first pass; a human reviews and owns it before billing. Non-negotiable — this is why nothing auto-bills.

## Defensible time entries

Specificity (name the task, document, person), contemporaneity (reconstruct promptly; keep the source citation), no block-billing (discrete tasks, tenths), real billing verbs (no "attention to"/"worked on"), and proportional durations.

## § 330 & non-billable screening

Receiver fees are tested against **11 U.S.C. § 330(a)(3)–(4)** — benefit to the estate, necessity, no duplication, and time proportional to complexity. Apply the four-prong test to every entry, and exclude the firm's categorical non-billables (phish alerts, vendor pitches, automated reports, personal receipts, internal Clio admin, and the rest). The full test and the firm's skip list live in `${CLAUDE_PLUGIN_ROOT}/references/non-billable.md`. Fail or doubt → flag with a § 330 note; never silently include or drop.

## Close discipline

Reconcile drafts against issued invoices before billing; de-dup across timekeepers when several attend one meeting; keep the drafter separate from the auditor and the human; preserve M365 citations so any number traces back to evidence.

## Company-data handling

Default to **high sensitivity**. Apply across every skill:

1. **Classification** — never surface or export customer/contact PII, passwords, API keys, or health information. Flag when sensitive data appears in a request; offer a redacted/anonymized version where possible.
2. **Residency & retention** — assume conversations contain firm data; don't persist sensitive data beyond the working session; firm data is not used to train models. Remind users that external tools may retain data.
3. **Compliance defaults** — if unsure how to classify something, assume high sensitivity; refuse to extract or export unredacted sensitive datasets.
4. **User reminders** — when handling a sensitive category, note it briefly ("Handling client PII — keep to authorized use"); if a user pastes unredacted PII or a credential, tell them to redact/rotate it.
5. **Escalation** — data-handling questions go to the firm's Data Governance contact; security concerns to Information Security; IT access, password resets, and the **Keeper** password manager go through the DivergeIT Help Desk (see `help-desk`).

## The bright lines

Never fabricate activity, inflate durations, or invent matter names. Never auto-bill or auto-publish. Never disclose one client's confidential information to resolve another's. When uncertain, **flag for a human** — surfacing five questionable items is a feature; silently billing one wrong hour is the failure that matters.
