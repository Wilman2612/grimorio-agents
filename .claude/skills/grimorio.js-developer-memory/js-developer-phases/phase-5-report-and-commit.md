# Backend TS Developer — Phase 5: REPORT & COMMIT (terminal)

**NEVER close this task, or report anything to your caller, until THIS phase's own `dev-notes.md` is actually
written (Pipeline mode) and its `## Close` line is set.** There is no Phase 6 to defer an unfinished field to,
and this chain carries no loop-back into any earlier phase — this is always the terminal state.

## The question this phase answers

What does the caller / next-layer developer (ui-developer) / QA need to know, and how do I hand this off — commit
myself, or leave it for Gate B? This phase is where this agent's own base requirements (the shared `## OUTPUT`
contract, the commit-discipline branch, REWORK-mode shape, the security-routing note) attach — it is the only
phase that writes the artifact the rest of the pipeline reads.

## Steps

**GIVEN this phase receives OBJECTIVE, EXIT CONDITION, MODE, WIRE/DAL CONTRACT SHAPES, REWORK/BUG-REPORT
DETECTED, SECURITY-SENSITIVE FLAG, SURVEY NOTES, BUG-FIX-FIRST-TEST, MODULE(S)/FILE(S) BUILT, DIFF SUMMARY, FULL
SUITE RESULT, TYPECHECK RESULT, DOD CHECKLIST CONFIRMATION, and INVARIANT CONFIRMATION from Phase 4's own now-
cumulative hand-off ⟶ this phase does not re-derive any of them.** OBJECTIVE feeds the `## Objective / Exit
Condition` section below; MODE decides Pipeline-vs-Standalone dev-note writing at step 2; WIRE/DAL CONTRACT
SHAPES feeds `## Contracts`; REWORK/BUG-REPORT DETECTED gates step 3 below; SECURITY-SENSITIVE FLAG gates step 4
below; SURVEY NOTES feeds `## Abstractions Reused`; MODULE(S)/FILE(S) BUILT and DIFF SUMMARY feed `## Changes
Made` and `## Abstractions Created`; the four Phase-4-produced fields, plus BUG-FIX-FIRST-TEST, are this phase's
own `## Close: VERIFIED` evidence, per step 8 below.

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal — write
   `dev-notes.md`, decide the commit action, close — and nothing else; no spawn anywhere in this phase.**
2. **IN PIPELINE MODE (per the carried-forward MODE field) ⟶ ALWAYS write `dev-notes.md`** per the shared `##
   OUTPUT` template below, populating: Changes Made, Abstractions Reused/Created, Contracts (for
   agent:grimorio.ui-developer), Test Scenarios for QA, Known Limitations. **IN STANDALONE MODE ⟶ no dev-note is
   owed** — report the result directly per this same `## OUTPUT` shape, inline.
3. **WHEN the carried-forward REWORK/BUG-REPORT DETECTED field names a REWORK invocation ⟶ append a `### REWORK
   Cycle {N}` section**, per ref:skill/grimorio.developer-memory/project.build-protocol.md#rework-mode,
   re-verifying the full completion checklist below rather than only the previously-failed item.
4. **WHEN the carried-forward SECURITY-SENSITIVE FLAG is YES ⟶ ALWAYS include a routing note in `dev-notes.md`**
   stating that this change touches auth/session/BOLA and must be reviewed by security + `code-reviewer` before
   merge, per ref:skill/grimorio.agent-selection#as-needed-escalation-pull-agents-in-when-the-situation-demands
   — never silently omit the note because the flag was raised three phases earlier.
5. **WHEN the contract was ambiguous, or `arch-decision.md` did not cover a case that arose while implementing
   ⟶ write it as `BLOCKED` in `dev-notes.md` and stop — never guess.**
6. **Commit discipline, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#who-commits-depends-on-whether-you-are-worktree-isolated:**
   **WHEN spawned WITHOUT `isolation:"worktree"` ⟶ commit nothing; hand back for `code-reviewer` Gate B.**
   **WHEN spawned WITH `isolation:"worktree"` ⟶ confirm commits were already made at every coherent step** —
   this step CONFIRMS, it does not defer committing to here.
7. **WHEN, at any point in this chain, you captured a non-obvious gotcha future-you would want ⟶ confirm it
   actually reached this project's own developer trap log or the correct one of
   this agent's own two trap logs (primary or runner-node)** — the harness-mode knowledge-partner duty
   Phase 0 already states as standing, fires-from-any-phase; this step only CONFIRMS the capture happened before
   the chain closes, it does not restate the rule a second time.
8. **ALWAYS check every item under `## Completion criteria` below holds SIMULTANEOUSLY; close per `## OUTPUT`'s
   own `## Close` field — `VERIFIED` (naming which evidence) or `COULD NOT` (naming what blocked you) — never a
   self-graded status.**

## Completion criteria (this phase's own EXIT CONDITION, and Phase 1's own stated one)

- The architecture contract was actually read this invocation (Phase 2), not assumed from a prior pass —
  UNLESS Standalone mode, where no contract is owed.
- The Scope Boundary check actually ran (Phase 2) and this task is genuinely this agent's own scope.
- WHEN the task was a bug report, the failing test actually ran and actually failed BEFORE any production code
  changed (Phase 3), and still passes now (Phase 4).
- The full test suite AND typecheck actually ran, in the foreground, and passed (Phase 4).
- Every Definition-of-Done item holds (Phase 4).
- None of this project's backend-service hard invariants were weakened anywhere in the diff (Phase 4).
- WHEN the SECURITY-SENSITIVE FLAG was raised, the routing note is present in `dev-notes.md` (this phase).
- `dev-notes.md` was actually written, not merely described (Pipeline mode, this phase).

## OUTPUT

**BEFORE you start writing ⟶ your OBJECTIVE and EXIT CONDITION were already stated in Phase 1; this section
carries them to their close, never re-derives them.**

In Pipeline mode, write the dev-note artifact in this exact shape — reusing the shared build-protocol.md
template, never a new one:

```markdown
# Development Notes: {title}

## Objective / Exit Condition
{Objective: the task Phase 1 stated. Exit condition: the Completion-criteria checklist above, all holding.}

## Changes Made
| File | Lines Changed | Description |
|---|---|---|
| `path` | +N / -N | {what changed} |

## Abstractions Reused
- {existing code integrated}

## Abstractions Created
- {new code created, with justification}

## Contracts (js-developer: for ui-developer)
- {DAL interfaces or API shapes the ui-developer's Real adapter must satisfy — "None" if this task's own wire
  shape is unchanged}

## Test Scenarios for QA
- {what should be true — QA writes the tests, not you}

## Known Limitations
- {what QA should focus on}

## Status: DONE
## Close: VERIFIED (every completion check holds — evidence above) | COULD NOT (name what blocked you, what
is left, and escalate)
```

**WHEN Phase 2 detected REWORK ⟶ append `### REWORK Cycle {N}`**, per
ref:skill/grimorio.developer-memory/project.build-protocol.md#rework-mode. **WHEN the SECURITY-SENSITIVE FLAG
was raised ⟶ append the routing note per step 4 above, inside `## Known Limitations` or its own short section —
never omitted.**

A worked example of what THIS agent's own Phase 5 specifically populates, on an invented domain unrelated to
this project's own features (a coupon-application service, never a passage lifted from a real file/symbol in
this repo):

```markdown
## Changes Made
| File | Lines Changed | Description |
|---|---|---|
| `coupons/applyCoupon.ts` (use-case layer) | +42 / -6 | Replaced ad hoc discount math with a single `applyCoupon` use case validating expiry + minimum spend |

## Abstractions Reused
- `coupons/CouponRepository` (persistence/adapter layer) — existing repository, no new persistence layer
  introduced.

## Abstractions Created
- `coupons/CouponPolicy.ts` (domain/business-logic layer) — pure validation rules (expiry, minimum spend,
  single-use) extracted out of the route handler.

## Contracts (js-developer: for ui-developer)
- `POST /api/coupons/apply` now returns `{ applied: boolean; discountCents: number; reason?: string }` — the
  ui-developer's Real adapter must consume this shape.

## Test Scenarios for QA
- Expired coupon returns `applied:false, reason:"expired"`.
- Coupon below minimum spend returns `applied:false, reason:"below-minimum"`.
- Valid coupon applies the discount once and marks itself redeemed.

## Known Limitations
- Stacking multiple coupons in one order is not yet supported; flag for a follow-up.

## Status: DONE
## Close: VERIFIED (pnpm test passed; pnpm typecheck 0 errors; every DoD item held; no hard invariant weakened)
```

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its `## OUTPUT` template, "Who
  commits" section, and "REWORK mode" section) — steps 2, 3, 6 above apply these directly.
  FINGERPRINT: DEV-NOTES PATH + COMMIT ACTION TAKEN + REWORK CYCLE APPENDED fields below (a dev-note in the
  shared shape, a correct commit call, and a correctly-appended REWORK section cannot be produced without these
  sections).
- this project's own developer trap log,
  and this agent's own two trap logs (primary and runner-node) — step 7's own confirmation load; the CAPTURE rule
  itself is Phase 0's own standing statement, not restated here, only confirmed.
- ref:skill/grimorio.agent-selection#as-needed-escalation-pull-agents-in-when-the-situation-demands — step 4's
  own security-routing-note load, WHEN the SECURITY-SENSITIVE FLAG is YES.
- import:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11
  — the CLOSE contract, step 8's own load.
  FINGERPRINT: CLOSE field below (a real VERIFIED-naming-evidence or COULD-NOT-naming-the-blocker close, never a
  self-graded status, cannot be produced without this contract).
- **NEVER load `javascript`, `development-patterns`, or the fan-out ladder here** — this phase only reports what
  earlier phases already produced.

## PHASE 5 DELIVERABLE

```
DEV-NOTES PATH:              <path, confirmed written — or "N/A — Standalone mode, no dev-note owed">
BLOCKED CHECK:                 <ambiguity found and written as BLOCKED, per step 5 — or "None">
SECURITY ROUTING NOTE:           <the note as written into dev-notes.md, per step 4 — or "N/A — SECURITY-
                              SENSITIVE FLAG was NO">
COMMIT ACTION TAKEN:              <committed at every coherent step (worktree-isolated) / committed nothing,
                              handed back for Gate B (shared tree), per step 6>
TRAP CAPTURE CONFIRMED:             <the capture confirmed reaching the correct trap file, per step 7 — or
                              "N/A — nothing non-obvious surfaced this invocation">
REWORK CYCLE APPENDED:                <the appended section, per step 3 — or "N/A — not a REWORK invocation">
COMPLETION CRITERIA CHECKED:            <one line per item under ## Completion criteria above, each explicitly
                              holding or not>
CLOSE:                                    <VERIFIED, naming the completion-criteria evidence — or COULD NOT,
                              naming what blocked you and what is left>
```

## Terminal — no further phase, no loop-back

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.js-developer-memory/js-developer-phases/phase-5-report-and-commit.md`) and
this phase's own filled PHASE 5 DELIVERABLE block, written to disk first per that gate's own algorithm — this
phase has no next-phase file to gate a read against, so the gate runs against the CLOSE itself.**

**This chain ends here, always.** `dev-notes.md` is written (Pipeline mode), `## Status` and `## Close` are
emitted, and this phase closes VERIFIED or COULD NOT to the caller. A subsequent invocation starts fresh at
Phase 0 (ref:skill/grimorio.js-developer-memory/behavior.md), never resumed mid-chain from this file.
