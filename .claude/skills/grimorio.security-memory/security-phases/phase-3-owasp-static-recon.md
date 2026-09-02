# Security Auditor — Phase 3: OWASP-STATIC-RECON

**NEVER read ref:skill/grimorio.security-memory/security-phases/phase-4-targeted-payload-proof.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** TARGETED-PAYLOAD-PROOF proves what this phase
flags; handing it an unfilled table leaves it nothing to prove.

## The question this phase answers

Does the code, statically, match any OWASP Top 10 vulnerability pattern? Nothing else. This phase does not
write or run a single payload, and does not test auth bypass — it only walks the checklist against what Phase 2
mapped.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk the OWASP
   checklist, apply the systemic-finding rule — and nothing else; this agent never invokes another agent, in
   any phase, ever.**
2. **ALWAYS apply the full OWASP Top 10 checklist and static-signal table held in
   import:skill/grimorio.security-memory#owasp-top-10-audit-checklist against every changed file Phase 2's map
   named, finishing each category (A01-A10) before the next** — never re-derive the checklist here; the memory
   skill is the single source.
3. **ALWAYS apply the systemic-finding rule: WHEN the same pattern repeats across multiple files ⟶ write ONE
   finding referencing every file, never inflate severity with per-file duplicates.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.security-memory#owasp-top-10-audit-checklist — ONLY.
  FINGERPRINT: STATIC-ANALYSIS TABLE field below (a genuinely filled A01-A10 table cannot be produced without
  applying the checklist).
- **NEVER load the payload format, the auth-bypass vectors, or the classification sections here** — each
  belongs to a later phase alone.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
STATIC-ANALYSIS TABLE:     <filled PASS/FAIL per A01-A10 + details, walked against every file Phase 2's map
                          named>
FLAGGED SURFACES:          <the surfaces this pass flags for Phase 4/5 to prove/sweep>
SYSTEMIC FINDINGS:         <one finding per repeated pattern, referencing every file it appears in, or "None">
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.security-memory/security-phases/phase-4-targeted-payload-proof.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.security-memory/security-phases/phase-3-owasp-static-recon.md`) and this
phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.security-memory#owasp-top-10-audit-checklist` carries a `FINGERPRINT:` annotation, so the
gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.security-memory/security-phases/phase-4-targeted-payload-proof.md next,
carrying forward the filled table and the flagged surfaces above.** Phase 4 proves against exactly what this
phase flagged — it does not re-derive it.
