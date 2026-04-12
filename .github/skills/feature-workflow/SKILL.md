# Skill: feature-workflow

**Use when**: Any agent in the multi-agent pipeline needs to read or write artifacts. This skill defines the shared communication protocol, file formats, status codes, and escalation rules that ALL agents follow.

---

## Architecture Overview

This project uses an **Orchestrator-Workers** pattern (per [Anthropic's "Building Effective Agents"](https://www.anthropic.com/engineering/building-effective-agents)):

- A **feature-orchestrator** agent receives the user's request, classifies it, and delegates to specialized worker agents sequentially.
- Each worker reads upstream artifacts, does its job, writes its own artifact, and exits.
- Workers are **stateless** — they receive context exclusively via files on disk and the orchestrator's prompt.
- Communication between agents happens **only** via the artifact directory. No implicit context sharing.
- Workers **NEVER use `vscode_askQuestions`** or any interactive question tool. They are stateless — no one will answer. Unresolved decisions → write them as `BLOCKED` in the output artifact and exit. The orchestrator handles escalation to the user.

### Agents in the Pipeline

| Agent | Role | Input Artifacts | Output Artifact |
|---|---|---|---|
| `grimorio.feature-orchestrator` | Router + coordinator | User request | `orchestrator-log.md` |
| `grimorio.po` | Product Owner | User request | `po-brief.md` |
| `grimorio.ux` | UX Designer | `po-brief.md` + existing UI | `ux-spec.md` |
| `grimorio.architect` | Software Architect | `po-brief.md` + `ux-spec.md` + codebase (+ `security-report.md` if rework) | `arch-decision.md` (ADR + Blueprint + Contracts + Security Constraints) |
| `grimorio.js-developer` | Developer | `arch-decision.md` + `ux-spec.md` | `dev-notes.md` + code changes |
| `grimorio.qa` | QA Engineer | `po-brief.md` + `ux-spec.md` + `arch-decision.md` + `dev-notes.md` + code | `qa-report.md` + test files |
| `grimorio.mutation-reviewer` | Test Quality Auditor | `qa-report.md` + test files + `arch-decision.md` + source files | `mutation-report.md` + counter-test files |
| `grimorio.security` | Evil Genius | `arch-decision.md` + `dev-notes.md` + code | `security-report.md` + security tests → feeds back to `grimorio.architect` if structural issues found |
| `grimorio.manual-verifier` | Visual Acceptance Tester | `po-brief.md` + `ux-spec.md` + `dev-notes.md` + running app | `verification-report.md` |

---

## Artifact Directory Structure

All artifacts live under:

```
tmp/features/{slug}/
  po-brief.md
  ux-spec.md
  arch-decision.md
  dev-notes.md
  qa-report.md
  security-report.md
  verification-report.md
  orchestrator-log.md
```

- `{slug}` = kebab-case feature name derived from user's description (e.g., `add-dark-mode`, `fix-login-crash`).
- If the directory already exists, the orchestrator appends a numeric suffix: `add-dark-mode-2`.
- Agents MUST use absolute paths when reading/writing artifacts.

---

## Routing Rules (Orchestrator)

The orchestrator classifies the user's request and selects a **starting point**. The pipeline is non-linear — the orchestrator reads each agent's output and decides dynamically what comes next.

| Request Type | Starting Point | Default Flow |
|---|---|---|
| **Feature** | `grimorio.po` | `grimorio.po → grimorio.ux → grimorio.architect → grimorio.js-developer → grimorio.qa → grimorio.mutation-reviewer → grimorio.security → (grimorio.architect if structural issues) → grimorio.js-developer (rework if needed) → grimorio.manual-verifier` |
| **Bug** | `grimorio.security` (triage, text-only) | `grimorio.security → grimorio.architect → grimorio.js-developer → grimorio.manual-verifier (diagnose) → grimorio.ux (if UI touched) → grimorio.js-developer (fix) → grimorio.qa → grimorio.manual-verifier` |
| **Refactor** | `grimorio.architect` | `grimorio.architect → grimorio.js-developer → grimorio.qa` |
| **Security Review** | `grimorio.security` solo | `grimorio.security` |
| **Test Gap** | `grimorio.qa` solo | `grimorio.qa` |
| **UX Review** | `grimorio.ux` solo | `grimorio.ux` |

### Bug Triage: Progressive Escalation

Steps 1-2 are **text-only** (no browser, no commands). Cheap. Short-circuit everything if they find something critical.

| Step | Agent | Task | Skip if |
|---|---|---|---|
| 1 | `grimorio.security` | ¿Amenaza integridad / OWASP? | — always run |
| 2 | `grimorio.architect` | ¿Viola arquitectura? ¿cross-service? ¿DB schema? | security returned CRITICAL → escalate first |
| 3 | `grimorio.js-developer` | Diagnose: ¿fácil o difícil? ¿qué toca? | — always run |
| 3b | `grimorio.architect` | Validate approach (solo si step 3 dice "difícil" o "multi-layer") | js-developer dice fácil/contained |
| 4 | `grimorio.manual-verifier` | Confirm bug is real (diagnosis mode, no po-brief) | — always run |
| 4b | `grimorio.ux` | Define WHAT to implement and WHERE (si el fix toca UI) | Skip if fix is backend-only / no `.tsx` files touched |
| 5 | `grimorio.js-developer` | Implement fix | — always run |
| 6 | `grimorio.qa` | Regression check | — always run |
| 7 | `grimorio.manual-verifier` | Confirm fix visually | — always run |

**Rule for step 4b — When to invoke `ux` in a bug pipeline:**
Invoke `ux` if the diagnosis (steps 3/3b) identifies that ANY of these are touched:
- A `.tsx` component is modified (layout, states, navigation)
- A new visible element is added (button, indicator, badge, label)
- A CSS/Tailwind class controlling width, positioning, or visibility changes
- The fix involves a data state (loading/empty/error) that wasn't previously handled

Skip `ux` if the fix is: API-only, DB migration, cron logic, hook state machine with no JSX output, or a pure logic fix inside a service.

### Dynamic Routing Triggers

After any agent, the orchestrator may insert an unplanned agent:

| Condition | Insert |
|---|---|
| Fix touches cross-service boundary or DB schema | `grimorio.architect` validates before grimorio.js-developer implements |
| Fix touches any `.tsx` file or visible UI element | `grimorio.ux` before grimorio.js-developer implements |
| Security/QA finds a product-level tradeoff | `grimorio.po` to define scope, or ESCALATE to user |
| Manual-verifier finds broken UX not in the PO brief | `grimorio.ux` to define correction, then grimorio.js-developer |
| Any agent BLOCKED on a tech or product decision | ESCALATE to user with the exact question |

---

## Status Codes

Each agent's report MUST end with a status line in this exact format:

```
## Status: {CODE}
```

Valid codes:

| Code | Meaning | Orchestrator Action |
|---|---|---|
| `DONE` | Work completed successfully, no issues found | Proceed to next agent |
| `DONE_WITH_WARNINGS` | Completed but with non-blocking concerns | Proceed, log warnings |
| `BLOCKED` | Cannot proceed without human decision | ESCALATE to user |
| `FAIL` | Found actionable code-level problems | Route to REWORK cycle (developer) |
| `FAIL-ARCH` | Found structural/architectural problems (`[ARCH ISSUE]` from security) | Route to `grimorio.architect` first, then `grimorio.js-developer` for rework |
| `CLEAR` | No vulnerabilities found (security only) | Proceed to next agent |

---

## REWORK Cycle

When `qa`, `mutation-reviewer`, `security`, or `manual-verifier` report `FAIL`:

1. The orchestrator sends the failure report back to `js-developer` with instructions to fix.
2. After the fix, the failing agent re-runs its checks.
3. **Maximum 2 REWORK cycles** per feature. After 2 failures:
   - The orchestrator writes a summary of all unresolved issues.
   - Status changes to `ESCALATE` — user must intervene.

### REWORK Prompt Template

When sending a REWORK to js-developer:

```
## REWORK Required — Cycle {N}/2

### Original Architect Decision
[paste arch-decision.md path]

### Failure Report
[paste qa-report.md or security-report.md path]

### Instructions
Fix ONLY the issues listed in the failure report. Do not refactor unrelated code.
After fixing, update dev-notes.md with what you changed and why.
```

---

## Artifact Formats

### po-brief.md

```markdown
# Feature Brief: {title}

## Problem Statement
{Why this feature is needed. Business context.}

## User Stories
- As a {actor}, I want {goal}, so that {benefit}.
  - **Given** {precondition}
  - **When** {action}
  - **Then** {expected result}

## Acceptance Criteria
- [ ] {Measurable, testable criterion}

## Out of Scope
- {What this feature explicitly does NOT cover}

## Blockers (Human Decision Required)
- {Any external dependency or business decision needed}

## Success Metrics
- {How to measure if this feature succeeded}

## Status: DONE | BLOCKED
```

### ux-spec.md

```markdown
# UX Spec: {feature title}

## Scope
{Which screens this spec covers. If no UI screens: "No UI screens in scope" → Status: DONE}

## Existing Patterns Observed
- Navigation: {how existing screens handle back/exit}
- Colors: {primary text, secondary text, accent, borders}
- Page max-width: {what similar pages use}
- Button styles: {primary and secondary}

## Screens

### Screen: {path}
**Title**: {h1 text using t("namespace.key")}
**Purpose**: {one sentence}

#### Layout
{Top-to-bottom description of what appears}

#### Navigation
- Back: `← {t("namespace.back")}` → `{target path}`

#### States
| State | What to show |
|---|---|
| Loading | `{t("namespace.loading")}` |
| Empty | `{t("namespace.empty")}` |
| Error | `{t("namespace.error")}` |
| Populated | {description} |

#### Interactive Elements
| Element | Label | Action |
|---|---|---|
| Button | `t("namespace.key")` | {what happens} |

#### i18n Keys Required
| Namespace | Key | ES | EN |
|---|---|---|---|
| {ns} | {key} | {es value} | {en value} |

#### Mobile Notes
{Adjustments for 375px, or "Standard layout — no adjustments needed"}

---

## UX Heuristics Checklist
| Heuristic | Status | Notes |
|---|---|---|
| All screens have exit/back | ✅ / ❌ | |
| All 4 data states covered | ✅ / ❌ | |
| No hardcoded strings | ✅ / ❌ | |
| Mobile layout valid | ✅ / ❌ | |
| Consistent with existing patterns | ✅ / ❌ | |
| Accessible labels | ✅ / ❌ | |
| Destructive actions have confirmation | ✅ / ❌ | |

## Status: DONE | BLOCKED
```

### arch-decision.md

```markdown
# Architecture Decision: {title}

## Summary
{One-paragraph technical approach}

## Files to Modify
| File | Action | Layer |
|---|---|---|
| `path/to/file.ts` | CREATE / MODIFY / DELETE | domain / application / infrastructure / presentation |

## Existing Abstractions to Reuse
- `{path}` — {what it does and why to reuse it}

## New Abstractions (if any)
- `{path}` — {what it does and why it's needed}

## Patterns Applied
- {Pattern from development-patterns skill and why}

## Data Model Changes
{SQL migration if needed, or "None"}

## API Contract Changes
{New/modified endpoints, or "None"}

## Security Considerations
- {OWASP-relevant notes}

## Trade-offs
| Option | Pros | Cons | Selected |
|---|---|---|---|
| A | ... | ... | ✓ / ✗ |

## Status: DONE | BLOCKED
```

### dev-notes.md

```markdown
# Development Notes: {title}

## Changes Made
| File | Lines Changed | Description |
|---|---|---|
| `path` | +N / -N | {what changed} |

## Abstractions Reused
- {existing code that was integrated}

## Abstractions Created
- {new code that was created, with justification}

## Commands Executed
- {build/generate/migrate commands run and their results}

## Known Limitations
- {anything the developer is aware of that QA should focus on}

## Status: DONE
```

### qa-report.md

```markdown
# QA Report: {title}

## Test Summary
| Layer | Tests Written | Passed | Failed |
|---|---|---|---|
| Unit | N | N | N |
| Integration | N | N | N |
| E2E | N | N | N |

## Tests Created
- `path/to/test.ts` — {what it validates}

## Failures
### Failure 1: {test name}
- **File**: `path/to/test.ts`
- **Expected**: {expected behavior}
- **Actual**: {actual behavior}
- **Root Cause**: {analysis}
- **Suggested Fix**: {what the developer should do}

## Coverage Gaps
- {code paths not covered and why}

## Regression Risk
- {areas that might break due to this change}

## Status: DONE | FAIL
```

### security-report.md

```markdown
# Security Report: {title}

## Static Analysis
| Check | Result | Details |
|---|---|---|
| SQL Injection | PASS/FAIL | {details} |
| XSS | PASS/FAIL | {details} |
| Auth Bypass | PASS/FAIL | {details} |
| Path Traversal | PASS/FAIL | {details} |
| SSRF | PASS/FAIL | {details} |
| Secrets in Code | PASS/FAIL | {details} |
| Insecure Dependencies | PASS/FAIL | {details} |

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

### verification-report.md

```markdown
# Visual Verification Report: {title}

## Environment
- URL: http://localhost:3000
- Browser: VS Code integrated browser
- Viewport: {width}x{height}
- Auth: {authenticated as test user / unauthenticated / BLOCKED}

## Scenarios Tested

### Scenario 1: {description from acceptance criterion}
- **Criterion**: {exact text from po-brief.md}
- **Steps**: {what you did — clicked X, navigated to Y, typed Z}
- **Expected**: {what should appear}
- **Actual**: {what you saw — describe concretely}
- **Result**: PASS / FAIL

## Summary
| Scenario | Result |
|---|---|
| 1. {name} | PASS / FAIL |

## Issues Found
### Issue 1: {title}
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Description**: {what's wrong}
- **Expected vs Actual**: {contrast}
- **Suggested Fix**: {what the developer should look at}

## Status: DONE | DONE_WITH_WARNINGS | FAIL
```

### orchestrator-log.md

```markdown
# Orchestrator Log: {title}

## Request Classification
- **Type**: Feature | Bug | Refactor | Security Review | Test Gap
- **Pipeline**: {agents in order}

## Execution Log
| Step | Agent | Status | Duration | Notes |
|---|---|---|---|---|
| 1 | po | DONE | — | — |
| 2 | architect | DONE | — | — |
| 3 | js-developer | DONE | — | — |
| 4 | qa | FAIL | — | 2 test failures |
| 5 | js-developer (REWORK 1) | DONE | — | Fixed auth check |
| 6 | qa (REWORK 1) | DONE | — | All tests pass |
| 7 | security | CLEAR | — | No vulnerabilities |
| 8 | manual-verifier | DONE | — | All visual checks pass |

## Final Decision: SHIP | REWORK | ESCALATE
{Justification}
```

---

## Escalation Rules

The orchestrator MUST escalate to the user (stop execution) when:

1. **REWORK cycles exhausted** — 2 failures on the same issue.
2. **PO reports BLOCKED** — External dependency (subscription, API key, business decision).
3. **Architect reports BLOCKED** — Ambiguous requirement that could go multiple ways with significant trade-offs.
4. **Security reports CRITICAL** — A vulnerability that cannot be auto-fixed (e.g., fundamental design flaw).
5. **Destructive DB operation** — DROP, ALTER COLUMN type change, migrate reset (per existing Prisma rules).

---

## Integration with Existing Tools

| Need | Tool/Agent |
|---|---|
| Spec writing (complex features) | `speckit.specify` → `speckit.plan` |
| Domain analysis | `domain-discovery` skill |
| Code implementation | `js-developer` agent (with `javascript` + `development-patterns` skills) |
| DB schema changes | `prisma-operations` skill |
| Environment variables | `env-cli-ops` skill |
| Package.json changes | `npm-package-json-cli` skill |
| Chat data backup before destructive ops | `chat-backup-reset` skill |

Agents CAN invoke these tools internally when their task requires it. The orchestrator does NOT enforce which internal tools an agent uses — only the artifact output matters.

---

## Memory Consolidation (Post-SHIP)

When the orchestrator decides **SHIP**, before closing the pipeline it triggers a memory consolidation step.
This is NOT a new agent invocation — it's instructions embedded in the SHIP decision for each agent that participated.

### What the orchestrator writes in `orchestrator-log.md` at SHIP:

```markdown
## Memory Consolidation

After shipping, each relevant agent must update their semantic memory file if they discovered
something new during this feature — including bugs found and fixed during REWORK cycles.

### Architect → `.github/skills/architect-memory/SKILL.md` (or detail file)
Did you discover a tech trap, interaction conflict, or architectural fact that wasn't documented?
- If yes: append ≤2 lines to the relevant memory file (SKILL.md macro or the detail .md for that area)
- If no: skip

### PO → `.github/skills/po-memory/features-status.md`
Did this feature change the status of any flag or add a new feature?
- If yes: update the relevant row in features-status.md
- If no: skip

### Developer → `.github/skills/developer-memory/SKILL.md`
Did a REWORK cycle reveal a codebase-specific trap (not covered by general patterns)?
- If yes: append ≤2 lines to developer-memory/SKILL.md
- If no: skip
```

### Rules for memory consolidation

1. **Include REWORK findings**: bugs fixed in REWORK cycles are the most valuable entries — they represent real traps. The architect documents the root architectural fact; the developer documents the code-level trap.
2. **≤2 lines per feature**: If an area needs more, create a detail file (e.g., `architect-memory/billing.md`) and reference it from the macro SKILL.md.
3. **Level 2 only** (concept + env var, not file paths): "Auth gate checks ALLOWED_EMAIL before admin — admin must bypass it" is good. "`clerk-auth-provider.ts:52` checks email before admin" is too specific and will break on refactors.
4. **No consolidation if nothing was discovered**: Do not add entries for the sake of it. An empty update is correct.
5. **Timing**: Consolidation happens once, at SHIP. Not during REWORK cycles. Not after each agent step.

---

## Anti-Patterns

1. **Fat orchestrator**: The orchestrator must NOT write code, tests, or architecture decisions. It only routes and evaluates status codes.
2. **Cross-agent context bleeding**: Agents must NOT assume knowledge from other agents beyond what's in the artifact files. Each invocation is stateless.
3. **Infinite loops**: Hard cap at 2 REWORK cycles. No exceptions.
4. **Skipping agents**: The orchestrator must NOT skip agents in the pipeline unless the request type explicitly excludes them (see routing table).
5. **Mixing concerns**: QA must NOT fix code. Security must NOT write feature code. Developer must NOT write their own tests (QA does that). Manual Verifier must NOT modify code or write automated tests. PO must NOT make architecture decisions.
6. **Over-documenting memory**: Memory files must stay at concept level. Do not add file paths, line numbers, or implementation details. Those break on every refactor.
