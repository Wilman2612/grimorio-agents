# Security Auditor — Phase 3: OWASP-STATIC-RECON

## The question this phase answers

Does the code, statically, match any OWASP Top 10 vulnerability pattern? Nothing else. This phase does not
write or run a single payload, and does not test auth bypass — it only walks the checklist against what Phase 2
mapped.

## Steps

2. **ALWAYS apply the full OWASP Top 10 checklist and static-signal table held in
   import:agent/grimorio.security/memory#owasp-top-10-audit-checklist against every changed file Phase 2's map
   named, finishing each category (A01-A10) before the next** — never re-derive the checklist here; the memory
   skill is the single source.
3. **ALWAYS apply the systemic-finding rule: WHEN the same pattern repeats across multiple files ⟶ write ONE
   finding referencing every file, never inflate severity with per-file duplicates.**

## PHASE 3 DELIVERABLE

```
STATIC-ANALYSIS TABLE:     <filled PASS/FAIL per A01-A10 + details, walked against every file Phase 2's map
                          named>
FLAGGED SURFACES:          <the surfaces this pass flags for Phase 4/5 to prove/sweep>
SYSTEMIC FINDINGS:         <one finding per repeated pattern, referencing every file it appears in, or "None">
```
