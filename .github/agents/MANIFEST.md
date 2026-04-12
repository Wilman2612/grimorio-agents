# Agent I/O Manifest

> **Single source of truth** for the Grimorio multi-agent pipeline.
> Lists every agent, what it reads, what it produces, and who depends on it.
>
> **Rule**: Before modifying any agent's output format, find it in the "Produces" column.
> Every agent listed under "Consumed By" must be updated to reflect the change.
> No silent format changes — update MANIFEST.md and all impacted agent files simultaneously.

---

## Data Flow Table

| Agent | Reads | Produces | Consumed By |
|-------|-------|----------|-------------|
| `grimorio.po` | User request, `po-memory` skill | `po-brief.md` | `grimorio.ux`, `grimorio.architect` |
| `grimorio.ux` | `po-brief.md`, existing UI (codebase) | `ux-spec.md` | `grimorio.architect`, `grimorio.js-developer`, `grimorio.manual-verifier` |
| `grimorio.architect` | `po-brief.md`, `ux-spec.md`, codebase, `security-report.md` (on `FAIL-ARCH` rework — required read) | `arch-decision.md` | `grimorio.js-developer`, `grimorio.qa`, `grimorio.security` (on rework) |
| `grimorio.js-developer` | `arch-decision.md`, `ux-spec.md`, `po-brief.md` (edge case context), codebase | code changes + `dev-notes.md` | `grimorio.qa`, `grimorio.security`, `grimorio.manual-verifier` |
| `grimorio.qa` | `po-brief.md`, `ux-spec.md`, `arch-decision.md`, `dev-notes.md`, `security-report.md` (if exists) | `qa-report.md` + test files | `grimorio.mutation-reviewer` |
| `grimorio.mutation-reviewer` | `qa-report.md`, test files, `arch-decision.md`, `dev-notes.md`, source files | `mutation-report.md` + counter-test files | `grimorio.feature-orchestrator`, `grimorio.js-developer` (if `FAIL`) |
| `grimorio.security` | code, `arch-decision.md`, `dev-notes.md`, `po-brief.md`, running app (optional) | `security-report.md` | `grimorio.architect` (if `FAIL-ARCH`), `grimorio.js-developer` (if `FAIL`), `grimorio.feature-orchestrator` |
| `grimorio.manual-verifier` | all `*-report.md` files, `ux-spec.md`, `po-brief.md`, running app | `verification-report.md` + screenshots | `grimorio.feature-orchestrator` |
| `grimorio.feature-orchestrator` | all `*-report.md`, `orchestrator-log.md` | routing decisions + `orchestrator-log.md` | user |
| `grimorio.system-keeper` | `{agent}-memory/SKILL.md`, codebase (read), agent files | updated skill files + `system-keeper-report.md` | — (meta-agent, not in feature pipeline) |

---

## Artifact Format Contracts

Each artifact has a **required structure**. If you add a section, update the contract here.

### `po-brief.md`
Produced by: `po`
```
## User Stories
  [Gherkin: Given/When/Then]

## Acceptance Criteria
  [numbered list — each criterion = testable assertion]

## Out of Scope
  [explicit exclusions]

## Success Metrics
  [how to measure done]
```

### `ux-spec.md`
Produced by: `ux`
```
## Screens
  [per screen: name, layout, elements]

## States
  [named states: Estado 1, Estado 2... — each with visual description and trigger]

## Navigation Flow
  [screen transitions]

## i18n Keys Required
  [key: description]

## Interaction States
  [loading, empty, error — per screen]

## Accessibility
  [aria-labels, focus order, keyboard nav]
```
> **Key rule**: named states (Estado N) are test targets — `qa` and `manual-verifier` write tests per state.

### `arch-decision.md`
Produced by: `architect`
```
## ADRs
  [per decision: Context | Decision | Alternatives Rejected | Consequences]

## Implementation Blueprint
  [per file: purpose | TypeScript interface | constraints | DO NOTs]
  [Data Flow: prose description A → B → C]
  [Mermaid diagram: flowchart or sequenceDiagram — real codebase names, max 8 nodes]

## API Contracts
  [per endpoint: method | path | request type | response type | auth | error codes]

## Existing Abstractions to Reuse
  [item: why it covers the requirement]

## Security Constraints
  [implementation-level, testable — not platitudes]

## Trade-off Matrix
  [option A vs B vs C: criteria comparison]

## Security Rework Updates  ← present only after security FAIL-ARCH
  [CODE FIX vs ARCH ISSUE classification | updated blueprint sections]
```

### `dev-notes.md`
Produced by: `js-developer`
```
## Files Changed
  [file path: what was done]

## Blueprint Deviations  ← present only when arch-decision.md couldn't be followed exactly
  [what deviated | why | how it was resolved]

## Blueprint Gaps  ← present only when arch-decision.md was incomplete
  [what was missing | what assumption was made]

## Edge Cases Found
  [anything discovered during implementation]

## Status: DONE | DONE_WITH_DEVIATIONS
```

### `qa-report.md`
Produced by: `qa`
```
## Coverage Summary
  [tests per artifact source: po-brief / ux-spec / arch-decision / dev-notes / security-report]

## Test Results
  [test name | layer | PASS/FAIL | failure details if any]

## Regression Check
  [existing tests: PASS/FAIL]

## Status: DONE | DONE_WITH_WARNINGS | FAIL
  [if FAIL: what the developer must fix]
```

### `mutation-report.md`
Produced by: `grimorio.mutation-reviewer`
```
## Summary
  [tests reviewed | weak tests found | counter-tests added | bugs found]

## Surviving Mutants
  [per mutant: test file | mutation applied | why it survives | counter-test added | counter-test result]

## Bugs Found During Review  ← only if counter-tests failed against real code
  [[BUG FOUND] description | file | counter-test path]

## Verdict
  [per arch-decision.md invariant: COVERED | WEAK | UNCOVERED]

## Status: DONE | DONE_WITH_WARNINGS | FAIL
  [FAIL: critical logic has weak/missing coverage — developer must strengthen before shipping]
```

### `security-report.md`
Produced by: `security`
```
## Findings
  [per finding: OWASP category | severity | description | payload used | [CODE FIX] or [ARCH ISSUE]]

## Tests Written
  [file path: what it proves]

## Status: CLEAR | FAIL | FAIL-ARCH
  [if FAIL: developer fixes | if FAIL-ARCH: architect must update blueprint first]
```

### `verification-report.md`
Produced by: `manual-verifier`
```
## Acceptance Criteria Verification
  [per criterion from po-brief: PASS/FAIL | screenshot reference]

## UX State Verification
  [per named state from ux-spec: PASS/FAIL | screenshot reference]

## Observations
  [anything outside the spec that was observed]

## Status: DONE | DONE_WITH_WARNINGS | BLOCKED
  [BLOCKED only valid for hardware features: mic, camera, file picker, push notifications]
```

### `orchestrator-log.md`
Produced by: `feature-orchestrator`
```
## Request Classification
  [type: feature/bug/refactor | pipeline selected]

## Routing Log
  [timestamp-style: agent → status → next action]

## REWORK Cycles
  [per agent: cycle count / max 2]

## Final Decision
  [SHIP | ESCALATE | reason]
```

---

## Status Codes

| Code | Meaning | Orchestrator Action |
|------|---------|---------------------|
| `DONE` | Agent completed successfully | Continue pipeline |
| `DONE_WITH_WARNINGS` | Completed with non-blocking observations | Continue pipeline, log warnings |
| `FAIL` | Blocking issues found (code-level) | REWORK cycle → js-developer |
| `FAIL-ARCH` | Structural/architectural issue (security only) | Route to architect first (must read `security-report.md`), then js-developer |
| `CLEAR` | No vulnerabilities found (security only) | Continue pipeline |
| `BLOCKED` | Cannot proceed — missing human decision | Pause pipeline, report to user with exact question |
| `ESCALATE` | Max REWORK cycles reached or beyond agent capability | Pause pipeline, report to user |

> Note: `REWORK` is not an agent status code — it is an orchestrator process triggered when an agent returns `FAIL`. Agents never output `REWORK`.
>
> **REWORK cycles are independent per agent**: Each agent has its own counter (max 2). If `grimorio.qa` triggers two REWORK cycles and then `grimorio.security` also fails, security gets its own 2-cycle budget. Counts are not shared.

---

## Pipeline by Request Type

| Type | Pipeline |
|------|---------|
| Feature | `grimorio.po → grimorio.ux → grimorio.architect → grimorio.js-developer → grimorio.qa → grimorio.mutation-reviewer → grimorio.security → (grimorio.architect if FAIL-ARCH) → grimorio.js-developer (rework) → grimorio.manual-verifier` |
| Bug | `grimorio.security (triage) → grimorio.architect → grimorio.js-developer (diagnose) → grimorio.manual-verifier (confirm bug) → [grimorio.ux **only if fix touches .tsx or any user-visible state**] → grimorio.js-developer (fix) → grimorio.qa → grimorio.manual-verifier (confirm fix)` |
| Refactor | `grimorio.architect → grimorio.js-developer → grimorio.qa → grimorio.manual-verifier (if any component touched)` |
| Security Review | `grimorio.security` solo |
| Test Gap | `grimorio.qa` solo |
| UX Review | `grimorio.ux` solo |
| Small Change (rename/literal/typo) | `grimorio.js-developer` solo — no PO, no UX, no Architect |
| Memory Scan / Capture Learning / System Audit | `grimorio.system-keeper` solo — invoked on demand, never from feature pipeline |

**Post-SHIP (all pipelines)**: After `SHIP`, the orchestrator emits a learning trigger. `grimorio.system-keeper` may be invoked to capture new traps or decisions discovered during the run into the relevant memory skills.
