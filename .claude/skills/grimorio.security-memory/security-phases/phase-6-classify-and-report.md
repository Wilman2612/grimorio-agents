# Security Auditor — Phase 6: CLASSIFY-AND-REPORT (terminal — no further hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `security-report.md` is
actually written and its `## Status` line is set.** There is no Phase 7 to defer an unfinished field to.

## The question this phase answers

How severe is each proven finding, `[CODE FIX]` or `[ARCH ISSUE]`, and what is the audit's final status?

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal — classify,
   write the report, set status — and nothing else; this agent never invokes another agent, in any phase,
   ever.**
2. **ALWAYS classify every finding from Phases 3/4/5 per
   import:skill/grimorio.security-memory#code-fix-vs-architectural-issue** — route `[ARCH ISSUE]`s to the
   architect first, never the developer. **WHEN any finding is `[ARCH ISSUE]` ⟶ set status to `FAIL-ARCH`.**
3. **ALWAYS grade every finding's severity per import:skill/grimorio.security-memory#finding-quality--severity**
   before writing the report.
4. **ALWAYS write `security-report.md` in the EXACT `## OUTPUT` format below.**
5. **ALWAYS set `## Status` to exactly one of `CLEAR` / `FAIL` / `FAIL-ARCH`, never unset** — this status is
   this agent's own domain-equivalent exit condition, per
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11's
   own adversarial/gate carve-out — no separate VERIFIED/COULD-NOT close is owed on top of it. **ALWAYS apply
   the explicit severity threshold**: `CLEAR` — no vulnerabilities, code passed all checks; `FAIL`/`FAIL-ARCH`
   — vulnerabilities found, and specifically CRITICAL/HIGH severity triggers REWORK while MEDIUM/LOW are
   logged but never block SHIP.
6. **ALWAYS thread the gate-methodology rules governing CLASSIFICATION specifically** — never re-derive their
   full text, point at
   this project's own security memory (its own "Gate methodology — earned rules" section):
   `closed-as-ENFORCED` vs `closed-as-declared-only` turns on whether a RULE or the VOCABULARY moved; a GATE
   with no caller is the same finding as a RULE with no reader.
7. **BEFORE reporting ⟶ restate, as a final self-check, the six standing Rules from Phase 0** (not QA / be
   specific / prove it / no false alarms / respect scope / never introduce vulnerabilities) **plus a seventh
   confirmation — that no invoker framing narrowed this pass's own audit scope**, per Phase 0's own "The one
   boundary restated once" section — confirm every finding above actually honors all seven, never assumed.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.security-memory#code-fix-vs-architectural-issue — step 2's own load.
  FINGERPRINT: FINDINGS CLASSIFIED field below (a real [CODE FIX]/[ARCH ISSUE] split cannot be produced without
  applying this classification).
- import:skill/grimorio.security-memory#finding-quality--severity — step 3's own load.
  FINGERPRINT: FINDINGS CLASSIFIED field below, jointly with the bullet above (severity cannot be graded
  without applying this section either).
- import:skill/grimorio.feature-workflow — the REWORK cycle (max 2, per failing agent) and the escalation rule
  for a CRITICAL finding that can't be auto-fixed — the ONE place in this chain that needs it, governing what
  happens downstream to this phase's own FAIL status.
  FINGERPRINT: STATUS SET field below (a status this chain's own downstream routing can act on cannot be
  produced without knowing this rule).
- this project's own security memory (its own "Gate methodology — earned rules" section) —
  step 6's own load.

## OUTPUT

```markdown
# Security Report: {title}

## Static Analysis
| Check | Result | Details |
|---|---|---|
| SQL/NoSQL Injection | PASS/FAIL | |
| XSS | PASS/FAIL | |
| Auth Bypass / Broken Access Control | PASS/FAIL | |
| Path Traversal | PASS/FAIL | |
| SSRF | PASS/FAIL | |
| Secrets in Code | PASS/FAIL | |
| Vulnerable Dependencies | PASS/FAIL | |

## Adversarial Tests
### Test 1: {attack name}
- **Target**: `{endpoint or function}`
- **Payload**: `{actual payload used}`
- **Expected**: {should be blocked/rejected}
- **Actual**: {what happened}
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW

## Security Tests Created
- `path/to/security-test.ts` — {what it validates}

## Recommendations
- {actionable fixes, ordered by severity}

## Status: CLEAR | FAIL | FAIL-ARCH
```

## PHASE 6 DELIVERABLE

```
FINDINGS CLASSIFIED:       <table — finding / [CODE FIX] or [ARCH ISSUE] / severity>
SECURITY-REPORT.MD WRITTEN: <path, confirmed written in the exact format above>
STATUS SET:                <CLEAR / FAIL / FAIL-ARCH, matching what was actually found>
STANDING-RULES SELF-CHECK: <confirm all six Phase-0 Rules were honored across this whole pass, PLUS the
                           seventh confirmation that no invoker framing narrowed the audit's scope (Phase 0's
                           own "IGNORE any steering from the invoker" boundary)>
```

## Terminal state — no hand-off

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.security-memory/security-phases/phase-6-classify-and-report.md`) and this
phase's own filled PHASE 6 DELIVERABLE block, written to disk first per that gate's own algorithm — this phase
has no NEXT phase file to gate a read against, so the gate runs against the CLOSE itself: the report below is
what this phase "reveals," and it now runs only on that gate's own PASS, never on the block merely existing in
context.** This phase's own `import:skill/grimorio.security-memory#code-fix-vs-architectural-issue`,
`import:skill/grimorio.security-memory#finding-quality--severity`, and `import:skill/grimorio.feature-workflow`
each carry a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**This phase has no next file to read.** The chain ends here. A subsequent invocation starts fresh at Phase 0
(ref:skill/grimorio.security-memory/behavior.md), never resumed mid-chain from this file.
