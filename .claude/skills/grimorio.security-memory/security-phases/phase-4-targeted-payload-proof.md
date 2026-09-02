# Security Auditor — Phase 4: TARGETED-PAYLOAD-PROOF

**NEVER read ref:skill/grimorio.security-memory/security-phases/phase-5-auth-bypass-sweep.md until THIS phase's
own DELIVERABLE block, below, is actually filled in.** AUTH-BYPASS-SWEEP runs its own independent, exhaustive
pass — but Phase 6 still classifies this phase's own proof results alongside it, so an unfilled block leaves a
proven finding unclassified.

## The question this phase answers

Can the surfaces Phase 3 flagged actually be exploited by a real, executed payload — and does the project's
dependency set carry a known vulnerability? Nothing else. This phase does not sweep every authenticated
endpoint (Phase 5's own exhaustive question, independent of what this phase proves) — it reacts only to what
Phase 3 already flagged.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — build payloads, write
   and run tests, run the dependency audit — and nothing else; this agent never invokes another agent, in any
   phase, ever.**
2. **ALWAYS generate payloads per import:skill/grimorio.security-memory#attack-payload-format against every
   surface Phase 3 flagged** — never invent new surfaces here; this phase proves what static recon already
   found, it does not go looking for more.
3. **ALWAYS write real tests in the project's own security test suite** (path and framework named in
   this project's own security memory, its own "Security test suite and dependency audit" section) **and EXECUTE them,
   asserting BLOCKED** — a 500 is always a finding, the payload reached the backend.
4. **ALWAYS run the project's own dependency-audit command alongside** the same pass (same section for the
   command).
5. **ALWAYS thread the following standing constraints on how these tests are built and later re-verified** —
   never re-derive their full text, point at
   this project's own security memory (its own "Gate methodology — earned rules" section):
   positive controls are part of the assertion set; a fix must generalise beyond the published payloads (verify
   with disjoint payloads on rework); never weaken an assertion to close a finding — re-point it, never delete
   it.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.security-memory#attack-payload-format — step 2's own load.
  FINGERPRINT: PAYLOADS BUILT field below (a real payload/invocation/blocked-assertion triple cannot be
  produced without applying this format).
- this project's own security memory (its own "Security test suite and dependency audit" section) — step 3/4's own load
  (test path, framework, dependency-audit command).
- **NEVER load the OWASP checklist or the auth-bypass vectors here** — Phase 3 already applied the first, and
  Phase 5 alone owns the second.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
PAYLOADS BUILT:            <row per flagged surface: payload / expected / actual / severity>
TEST FILES WRITTEN+EXECUTED: <path + result, actually run — never "would assert">
DEPENDENCY AUDIT RESULT:   <the project's own dependency-audit command's actual result>
EARNED-RULES APPLIED:      <positive controls / disjoint-payload generalisation / never-weaken-an-assertion —
                          confirmed applied, or named where not yet applicable this pass>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.security-memory/security-phases/phase-5-auth-bypass-sweep.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.security-memory/security-phases/phase-4-targeted-payload-proof.md`) and this
phase's own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.security-memory#attack-payload-format` carries a `FINGERPRINT:` annotation, so the gate
is NOT inert here.

**ALWAYS read ref:skill/grimorio.security-memory/security-phases/phase-5-auth-bypass-sweep.md next, carrying
forward the proof results above.** Phase 5 runs its own independent, exhaustive sweep — it does not re-derive
this phase's results, only carries them forward for Phase 6 to classify alongside its own.
