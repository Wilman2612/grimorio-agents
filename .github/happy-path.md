# Grimorio — Happy Path: Full Feature Run

> Example feature: "add a daily summary screen for the user"  
> Pipeline selected by orchestrator: PO → UX → Architect → Developer → QA → Security → Manual Verifier

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  INPUT:  user request                                                ║
╚══════════════════════════════════════════════════════════════════════╝
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.feature-orchestrator                                      │
│                                                                     │
│  READS:   agent.md (routing rules, pipeline protocol)              │
│  DECIDES: feature with UI → full pipeline                           │
│           not a small change → no bypass                            │
│  WRITES:  orchestrator-log.md (start)                               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.po                                                        │
│                                                                     │
│  READS:   agent.md, feature-workflow skill, user request            │
│  DECIDES: scope, user stories, acceptance criteria, out-of-scope    │
│  WRITES:  po-brief.md                                               │
│    → User stories (Gherkin)                                         │
│    → Acceptance criteria (testable)                                 │
│    → Out of scope (explicit)                                        │
│    → Success metrics                                                │
└─────────────────────────────────────────────────────────────────────┘
                              │ po-brief.md
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.ux                                                        │
│                                                                     │
│  READS:   agent.md, feature-workflow skill, po-brief.md,           │
│           existing UI (codebase scan)                               │
│  DECIDES: screens, named states, navigation flow, i18n keys         │
│  WRITES:  ux-spec.md                                                │
│    → Screens + layouts                                              │
│    → Named states: empty / loading / with-data / error             │
│    → Navigation flow                                                │
│    → Required i18n keys                                             │
└─────────────────────────────────────────────────────────────────────┘
                              │ po-brief.md + ux-spec.md
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.architect                                                 │
│                                                                     │
│  READS:   agent.md, feature-workflow, development-patterns,        │
│           javascript skills, po-brief.md, ux-spec.md,              │
│           codebase (deep exploration)                               │
│  DECIDES: files to touch, patterns to apply, abstractions to reuse  │
│  WRITES:  arch-decision.md                                          │
│    → ADRs (what and why)                                            │
│    → Implementation blueprint (TS interfaces, file map)            │
│    → API contracts                                                  │
│    → Security constraints (implementable, testable)                 │
│    → Trade-off matrix                                               │
└─────────────────────────────────────────────────────────────────────┘
                              │ po-brief + ux-spec + arch-decision
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.js-developer                                              │
│                                                                     │
│  READS:   agent.md, javascript, development-patterns,              │
│           feature-workflow skills, arch-decision.md,               │
│           ux-spec.md, codebase (searches for duplication first)     │
│  DECIDES: how to implement following the blueprint exactly          │
│  WRITES:  code changes + dev-notes.md                               │
│    → Created/modified files                                         │
│    → Deviations from blueprint (if any, with justification)        │
│    → Edge cases discovered during implementation                    │
└─────────────────────────────────────────────────────────────────────┘
                              │ all upstream artifacts
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.qa                                                        │
│                                                                     │
│  READS:   agent.md, feature-workflow, development-patterns,        │
│           javascript skills, po-brief + ux-spec + arch-decision     │
│           + dev-notes, existing test files                          │
│  DECIDES: what to test per layer, per acceptance criterion,        │
│           per named UX state                                        │
│  WRITES:  qa-report.md + test files                                 │
│    → Coverage summary by source (po-brief / ux-spec / arch)        │
│    → Tests per named state                                          │
│    → Regression check                                               │
└─────────────────────────────────────────────────────────────────────┘
                              │ all artifacts
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.security                                                  │
│                                                                     │
│  READS:   agent.md, feature-workflow, development-patterns         │
│           skills, code + arch-decision + dev-notes + po-brief      │
│  DECIDES: adversarial audit — tries to BREAK the implementation    │
│           OWASP Top 10, real payloads, no assumptions              │
│  WRITES:  security-report.md                                        │
│    → Findings with payload used                                     │
│    → [CODE FIX] or [ARCH ISSUE] per finding                        │
│    → Security tests written                                         │
│    → Status: CLEAR / FAIL / FAIL-ARCH                               │
│                                                                     │
│  IF FAIL-ARCH → orchestrator routes back to grimorio.architect     │
│                 (reads security-report.md, revises blueprint)       │
└─────────────────────────────────────────────────────────────────────┘
                              │ all *-report.md + ux-spec + po-brief
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.manual-verifier                                           │
│                                                                     │
│  READS:   agent.md, feature-workflow skill, ux-spec.md,            │
│           po-brief.md, all *-report.md, running app (real browser) │
│  DECIDES: visual acceptance — is the UI actually correct?           │
│           acts as the user, not as a tester                         │
│  WRITES:  verification-report.md + screenshots                      │
│    → Each AC from po-brief: PASS/FAIL + screenshot                 │
│    → Each named state from ux-spec: PASS/FAIL + screenshot         │
│    → Observations outside spec                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │ verification-report.md
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  grimorio.feature-orchestrator  (post-review)                       │
│                                                                     │
│  READS:   all *-report.md                                           │
│  DECIDES: SHIP / REWORK / ESCALATE                                  │
│  UPDATES: orchestrator-log.md                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         ✅ SHIP
```

---

## REWORK Rules

- Each agent has its own cycle counter (max 2).
- Counters are **independent** — if QA triggers 2 REWORK cycles, Security still gets its own 2-cycle budget.
- After 2 REWORK cycles: orchestrator **ESCALATES** to the user with full context.

## Alternative Entry Points

| Request Type | First Agent | Pipeline |
|---|---|---|
| Feature | `grimorio.po` | Full pipeline above |
| Bug | `grimorio.security` (triage) | security → architect → js-developer → [ux if UI] → js-developer → qa → manual-verifier |
| Refactor | `grimorio.architect` | architect → js-developer → qa |
| Security Review | `grimorio.security` | solo |
| Test Gap | `grimorio.qa` | solo |
| Small Change (rename/typo/literal) | `grimorio.js-developer` | solo — no PO, no UX, no Architect |

## Artifact Flow Summary

```
po-brief.md          → ux, architect, js-developer, qa, security, manual-verifier
ux-spec.md           → architect, js-developer, qa, manual-verifier
arch-decision.md     → js-developer, qa, security
dev-notes.md         → qa, security, manual-verifier
qa-report.md         → feature-orchestrator
security-report.md   → architect (if FAIL-ARCH), js-developer (if FAIL), feature-orchestrator
verification-report.md → feature-orchestrator
```
