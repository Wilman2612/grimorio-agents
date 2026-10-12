# Security Auditor — Phase 6: CLASSIFY-AND-REPORT

**NEVER close this task, or report anything to your caller, until THIS phase's own `security-report.md` is
actually written and its `## Status` line is set.**

## The question this phase answers

How severe is each proven finding, `[CODE FIX]` or `[ARCH ISSUE]`, and what is the audit's final status?

## Steps

2. **ALWAYS classify every finding from Phases 3/4/5 per
   import:agent/grimorio.security/memory#code-fix-vs-architectural-issue** — route `[ARCH ISSUE]`s to the
   architect first, never the developer. **WHEN any finding is `[ARCH ISSUE]` ⟶ set status to `FAIL-ARCH`.**
3. **ALWAYS grade every finding's severity per import:agent/grimorio.security/memory#finding-quality--severity**
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
   ref:agent/grimorio.security/memory/project.md#gate-methodology--earned-rules-do-not-re-learn-these-the-hard-way:
   `closed-as-ENFORCED` vs `closed-as-declared-only` turns on whether a RULE or the VOCABULARY moved; a GATE
   with no caller is the same finding as a RULE with no reader.
7. **BEFORE reporting ⟶ restate, as a final self-check, the six standing Rules from Phase 0** (not QA / be
   specific / prove it / no false alarms / respect scope / never introduce vulnerabilities) **plus a seventh
   confirmation — that no invoker framing narrowed this pass's own audit scope**, per Phase 0's own "The one
   boundary restated once" section — confirm every finding above actually honors all seven, never assumed.

## Conditional loads

- ref:agent/grimorio.security/memory/project.md#gate-methodology--earned-rules-do-not-re-learn-these-the-hard-way —
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
