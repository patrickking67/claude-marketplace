#!/usr/bin/env node
// Timekeeper access gate (advisory). On session start, injects an instruction that restricts
// Timekeeper work to the Microsoft 365 accounts in allowed-users.txt. This is a guardrail, not a
// hard security boundary — real enforcement is who the plugin is deployed/enabled for and who can
// read the private marketplace repo (see INSTALL.md). Runs on Node, which Claude Code already requires.
import { readFileSync } from "node:fs";

// Fallback mirrors allowed-users.txt so a missing/unreadable file never locks out authorized users.
const FALLBACK = [
  "steve.donell@fedreceiver.com",
  "sarah.bates@fedreceiver.com",
  "ditadmin@jalmar.com",
];

function loadAllow() {
  try {
    const txt = readFileSync(new URL("./allowed-users.txt", import.meta.url), "utf8");
    const list = txt
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"))
      .map((s) => s.toLowerCase());
    return list.length ? list : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

const allow = loadAllow();
const envUser = (process.env.TIMEKEEPER_USER || "").trim().toLowerCase();
const preAuthorized = Boolean(envUser) && allow.includes(envUser);

const context = [
  "TIMEKEEPER ACCESS GATE (advisory).",
  `Timekeeper is restricted to these Microsoft 365 accounts: ${allow.join(", ")}.`,
  "Before doing ANY Timekeeper work — the time-entry, billing, billing-rules, matters, contacts, search, calendar, documents, or timekeeper-setup skills, or the timekeeper-* agents — confirm the operator's identity.",
  preAuthorized
    ? `The environment variable TIMEKEEPER_USER confirms the operator is ${envUser}, who is on the allowlist, so you may proceed without a separate check.`
    : "Verify the signed-in Microsoft 365 user via the connector (e.g. the M365 get-current-user / get-my-profile tool) and read their primary email / UPN.",
  "If that address is on the allowlist, proceed normally. If it is NOT on the allowlist, or no Microsoft 365 account is connected, DECLINE all Timekeeper work and reply exactly: \"Timekeeper is restricted to authorized users (Steve Donell and Sarah Bates). Contact the firm's IT support provider for access.\"",
  "Do not reconstruct time, read mail, or run any Timekeeper skill or agent for an unauthorized operator, and do not help bypass this gate. This restriction applies only to Timekeeper; other work in the session is unaffected.",
].join(" ");

process.stdout.write(
  JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  })
);
