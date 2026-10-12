# Security Auditor — Phase 4: TARGETED-PAYLOAD-PROOF

## The question this phase answers

Can the surfaces Phase 3 flagged actually be exploited by a real, executed payload — and does the project's
dependency set carry a known vulnerability? Nothing else. This phase does not sweep every authenticated
endpoint (Phase 5's own exhaustive question, independent of what this phase proves) — it reacts only to what
Phase 3 already flagged.

## Steps

2. **ALWAYS generate payloads per import:agent/grimorio.security/memory#attack-payload-format against every
   surface Phase 3 flagged** — never invent new surfaces here; this phase proves what static recon already
   found, it does not go looking for more.
3. **ALWAYS write real tests in the project's own security test suite** (path and framework named in
   ref:agent/grimorio.security/memory/project.md#security-test-suite-and-dependency-audit) **and EXECUTE them,
   asserting BLOCKED** — a 500 is always a finding, the payload reached the backend.
4. **ALWAYS run the project's own dependency-audit command alongside** the same pass (same section for the
   command).
5. **ALWAYS thread the following standing constraints on how these tests are built and later re-verified** —
   never re-derive their full text, point at
   ref:agent/grimorio.security/memory/project.md#gate-methodology--earned-rules-do-not-re-learn-these-the-hard-way:
   positive controls are part of the assertion set; a fix must generalise beyond the published payloads (verify
   with disjoint payloads on rework); never weaken an assertion to close a finding — re-point it, never delete
   it.

## Conditional loads

- ref:agent/grimorio.security/memory/project.md#security-test-suite-and-dependency-audit — step 3/4's own load
  (test path, framework, dependency-audit command).

## PHASE 4 DELIVERABLE

```
PAYLOADS BUILT:            <row per flagged surface: payload / expected / actual / severity>
TEST FILES WRITTEN+EXECUTED: <path + result, actually run — never "would assert">
DEPENDENCY AUDIT RESULT:   <the project's own dependency-audit command's actual result>
EARNED-RULES APPLIED:      <positive controls / disjoint-payload generalisation / never-weaken-an-assertion —
                          confirmed applied, or named where not yet applicable this pass>
```
