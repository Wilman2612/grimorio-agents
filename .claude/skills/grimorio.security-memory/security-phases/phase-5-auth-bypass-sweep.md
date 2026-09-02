# Security Auditor — Phase 5: AUTH-BYPASS-SWEEP

**NEVER read ref:skill/grimorio.security-memory/security-phases/phase-6-classify-and-report.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** CLASSIFY-AND-REPORT classifies every finding
from Phases 3-5; handing it an incomplete sweep leaves a real vulnerability unclassified.

## The question this phase answers

Does EVERY authenticated endpoint correctly reject each of the four auth-bypass vectors, exhaustively —
independent of whatever Phase 3 flagged? Auth bypass is this agent's own stated highest priority: "each
endpoint has its own access-control config", never inferred from having checked one. Nothing else — this phase
does not build a targeted payload (Phase 4's own question) and does not classify anything (Phase 6's own
question).

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — attempt all four
   vectors against every authenticated endpoint — and nothing else; this agent never invokes another agent, in
   any phase, ever.**
2. **ALWAYS attempt, on EVERY authenticated endpoint Phase 2's map named — not only Phase-3-flagged ones — the
   four vectors held in
   import:skill/grimorio.security-memory#auth-bypass-testing--four-vectors-test-each-endpoint-individually**:
   no token → 401; expired token → 401; valid token but wrong user's resource ID → 403; manipulated JWT payload
   → 401 or 403.
3. **NEVER assume one check covers every endpoint — test each individually**, per that section's own
   anti-pattern note: "I checked auth once so all endpoints are fine" is exactly the failure this step exists
   to prevent.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.security-memory#auth-bypass-testing--four-vectors-test-each-endpoint-individually —
  ONLY, never the OWASP checklist or payload-format sections again.
  FINGERPRINT: SWEEP TABLE field below (a genuine per-endpoint, per-vector table cannot be produced without
  applying this section).

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
SWEEP TABLE:               <one row per authenticated endpoint x 4 vectors — no token / expired token / wrong
                          user ID / manipulated JWT, expected vs actual per cell>
ENDPOINTS COVERED:         <confirm every endpoint Phase 2 named was tested, never a subset — name any endpoint
                          Phase 2 mapped that this sweep could not reach, and why>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.security-memory/security-phases/phase-6-classify-and-report.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.security-memory/security-phases/phase-5-auth-bypass-sweep.md`) and this
phase's own filled PHASE 5 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.security-memory#auth-bypass-testing--four-vectors-test-each-endpoint-individually`
carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.security-memory/security-phases/phase-6-classify-and-report.md next, carrying
forward every proof result from Phase 4 plus this phase's own sweep table.** Phase 6 classifies all of it — it
does not re-derive or re-run any of it.
