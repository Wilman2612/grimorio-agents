---
name: grimorio.governance-audit
description: "Load when auditing whether a hand-maintained inventory still matches the live system: extract claims, run the check, classify."
---

# Governance Audit — the claim/live-check/classify method

**Portable, general knowledge — this file names no project-specific file, tool, or count.** The project-specific
population this project's own auditor sweeps lives at
ref:skill/grimorio.governance-audit/project.md, never here.

## The problem this method answers

A hand-maintained document that describes "what exists" — a roster, an index, a tool inventory, a hook table —
is correct the moment it is written and decays the moment anything it describes changes. The document itself
usually cannot tell you it has decayed; only checking it against the live system can. **The failure this method
exists to prevent is not "the document is wrong" — it is "nobody ever re-checks it," which is the SAME blind
spot whether the document is a README, a design doc, or a piece of this corpus's own governance.**

## The method — four steps, applied per document

1. **EXTRACT** — read the document and pull out every CHECKABLE claim: a count, a named list, an inventory, a
   state assertion ("X is true as of now"). A claim is checkable when SOME live command or observation could, in
   principle, confirm or contradict it. Prose that states no checkable fact (an opinion, a design rationale, a
   warning with no number attached) is not in scope — this method audits FACTS, not judgment.
2. **MAP** — for each extracted claim, name the SPECIFIC live command, tool, or observation that verifies it.
   **Prefer an existing, already-built tool over a hand-rolled command whenever one exists** — duplicating a
   check that already exists elsewhere in the system is its own kind of drift risk (two answers to the same
   question, liable to disagree). WHEN no live check exists for a claim, that is itself a finding — UNVERIFIABLE
   — never a reason to skip the claim silently.
3. **VERIFY** — run the mapped command LIVE, this pass, and record its exact invocation and raw output. A
   remembered, assumed, or "probably still true" answer is not verification — it is exactly the failure mode
   this method exists to close.
4. **CLASSIFY** — resolve each checked claim to exactly one of:
   - **PASS** — live matches claimed.
   - **DRIFT** — live contradicts claimed; report both values, never just the verdict word.
   - **STALE** — the claim's own referent no longer exists to check at all (the thing it describes is gone).
   - **UNVERIFIABLE** — no live check exists; name why, never guess a number to fill the gap.

## Reading a self-aware document correctly

Some documents already know they drift and say so in their own text — a stated snapshot date, an explicit "this
is a floor, not an exact count," a disclaimer that a section "drifts fast." **Classify against what the document
ACTUALLY asserts, including its own hedge — never against a stricter reading it explicitly disclaims.** A
document that says "at least N" is not DRIFT merely because live shows more than N; it is DRIFT only if live
falls at or below N, or if the document's own snapshot framing has itself gone stale in a way worth naming
separately.

## What this method deliberately does NOT do

**It never proposes or applies a fix.** Finding drift and correcting it are two different skills with two
different failure modes if fused: a checker under pressure to "just fix it" stops checking thoroughly and starts
patching plausibly. This method's own output is always a REPORT — a claim, a live check, a classification, cited
evidence — handed to whoever owns the document for the actual correction. Whether that separation is enforced by
a rule external to this method (a governance boundary, an approval gate) is a project-level concern, not this
file's own.

## Report shape this method produces

Per document: every claim extracted, its live check, its classification, and its evidence — never a bare
verdict with no cited command. An overall verdict per document, and one overall verdict for the whole pass,
severity-ranked (DRIFT/STALE before UNVERIFIABLE, most consequential first) so a reader triages without reading
every row.
