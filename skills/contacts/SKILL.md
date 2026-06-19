---
name: contacts
description: Look up and organize the firm's contacts — clients, opposing and co-counsel, vendors, and service-list members — from the firm's contact export and Microsoft 365. Use when someone asks who is this, find a contact, what's their email or phone, who's the counsel on a matter, who's on the service list, or needs to dedupe or reconcile contact info.
---

# Contacts

Answer "who is this" and keep the firm's people organized, working from the bundled contacts export at `${CLAUDE_PLUGIN_ROOT}/data/sample-contacts.csv` (clients, counsel, vendors, service-list members), any fresher export the user provides, and Microsoft 365 (Outlook contacts, message participants). No live Clio connection yet — use the data on hand.

## Use it to

- **Identify a person or company** — resolve a name, email, or company to a contact; return email, phone, address, and which matter(s) they're tied to.
- **Find the right people for a matter** — counsel, service-list members, property managers, banks. Receivership matters route through Steve Donell / FedReceiver (12121 Wilshire Blvd., Ste. 710, Los Angeles).
- **Dedupe / reconcile** — spot duplicate or near-duplicate contacts and inconsistent emails/addresses; propose the clean record. Don't merge anything without the user's confirmation.

## Rules

- Distinguish **clients/matters** from **non-client contacts** (outside counsel like Riley|Ersoff or Martinez & Schill, insurers like Mercury, vendors). Only clients map to billable matters.
- Treat contact details as sensitive PII — see `billing-rules` for handling. Don't export unredacted contact lists without a clear, authorized reason.
- When the export and M365 disagree, surface the conflict rather than silently picking one.
