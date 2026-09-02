# Python Developer — Phase 5: REPORT (terminal)

**NEVER close this task, or report anything to your caller, until THIS phase's own `dev-notes.md` is actually
written (Pipeline mode) and its `## Close` line is set.** There is no Phase 6 to defer an unfinished field to,
and this chain's only re-entry (Phase 4's own chain-level loop-back into Phase 3) never routes through here
unfinished — this is always the terminal state once reached.

## The question this phase answers

What does the caller / next-layer developer / QA need to know, and how do I hand this off — commit myself, or
leave it for Gate B? This phase is where this agent's own base requirements (the shared `## OUTPUT` contract,
the commit-discipline branch, REWORK-mode shape) attach — it is the only phase that writes the artifact the
rest of the pipeline reads.

## Steps

**GIVEN this phase receives MODE, CONTRACT READ, WIRE-CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED,
BUG-FIX-FIRST-TEST, SURVEY NOTES, MODULE(S) BUILT, DIFF SUMMARY, FULL SUITE RESULT, and INVARIANT CONFIRMATION
from Phase 4's own now-cumulative hand-off ⟶ this phase does not re-derive any of them.** MODE gates step 2
below (Pipeline mode ALWAYS writes `dev-notes.md`; Standalone mode owes no dev-note).
`grimorio.go-developer`'s own equivalent chain HAD this exact drop — MODE silently missing even though its own
Phase 5 branches on MODE by name — independently found during this redesign's own diagnosis, since closed in
go-developer's own cycle-2 REWORK; MODE is present here, by name, precisely so that branch is grounded in a
real carried field, never assumed.
CONTRACT READ is this phase's own cited evidence for the Completion criteria checklist's first bullet ("the
architecture contract was actually read this invocation"); WIRE-CONTRACT SHAPES feeds `## Contracts`;
REWORK/BUG-REPORT DETECTED gates step 3 below; BUG-FIX-FIRST-TEST is this phase's own cited evidence for the
Completion criteria checklist's second bullet ("WHEN the task was a bug report, the failing test actually ran
and actually failed BEFORE any production code changed") — the actual carried test-and-command-and-error text,
never a bare pointer to "Phase 2 handled it"; SURVEY NOTES feeds `## Abstractions Reused`; MODULE(S) BUILT and
DIFF SUMMARY feed `## Changes Made` and `## Abstractions Created`; FULL SUITE RESULT and INVARIANT CONFIRMATION
are this phase's own `## Close: VERIFIED` evidence, per step 6 below.

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal — write
   `dev-notes.md`, decide the commit action, close — and nothing else; no spawn anywhere in this phase.**
2. **IN PIPELINE MODE ⟶ ALWAYS write `dev-notes.md`** per the shared `## OUTPUT` template below, populating:
   Changes Made, Abstractions Reused/Created, Contracts (for other developers), Test Scenarios for QA, Known
   Limitations. **IN STANDALONE MODE ⟶ no dev-note is owed** — report the result directly per this same `##
   OUTPUT` shape, inline.
3. **WHEN REWORK/BUG-REPORT DETECTED above named a REWORK invocation (distinct from an ordinary bug-report
   route — this task itself was a re-invocation against a prior failure report) ⟶ append a `### REWORK Cycle
   {N}` section**, per ref:skill/grimorio.developer-memory/project.build-protocol.md#rework-mode, re-verifying
   the full completion checklist below rather than only the previously-failed item.
4. **WHEN the contract was ambiguous, or `arch-decision.md` did not cover a case that arose while implementing
   ⟶ write it as `BLOCKED` in `dev-notes.md` and stop — never guess.** This is the current agent's own
   pre-split "ambiguous-contract BLOCKED" rule, restated here at the exact point this phase's own step 2
   (writing the artifact) would otherwise proceed past an unresolved ambiguity.
5. **Commit discipline, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#who-commits-depends-on-whether-you-are-worktree-isolated:**
   **WHEN spawned WITHOUT `isolation:"worktree"` ⟶ commit nothing; hand back for `code-reviewer` Gate B.**
   **WHEN spawned WITH `isolation:"worktree"` ⟶ confirm commits were already made at every coherent step** —
   this step CONFIRMS, it does not defer committing to here.
6. **WHEN, at any point in this chain, you captured a non-obvious gotcha future-you would want ⟶ confirm it
   actually reached this project's own developer trap log or
   this agent's own trap log** — the harness-mode knowledge-partner duty Phase 0 already
   states as standing, fires-from-any-phase; this step only CONFIRMS the capture happened before the chain
   closes, it does not restate the rule a second time.
7. **ALWAYS check every item under `## Completion criteria` below holds SIMULTANEOUSLY; close per `## OUTPUT`'s
   own `## Close` field — `VERIFIED` (naming which evidence) or `COULD NOT` (naming what blocked you) — never a
   self-graded status.**

## Completion criteria (this phase's own EXIT CONDITION, and Phase 1's own stated one)

- The architecture contract was actually read this invocation (Phase 1), not assumed from a prior pass, cited
  via the carried CONTRACT READ field — never a bare "Phase 1 handled it" with nothing behind it.
- WHEN the task was a bug report, the failing test actually ran and actually failed BEFORE any production code
  changed (Phase 2), cited via the carried BUG-FIX-FIRST-TEST field — the actual test/command/error, never a
  phase-name pointer.
- The full pytest suite actually ran, in the foreground, and passed (Phase 4).
- WHEN the task was a bug report, the specific reproduction test now passes, not merely the aggregate suite
  (Phase 4).
- None of this project's backend-service hard invariants were weakened anywhere in the diff (Phase 4).
- The contract was mirrored field-for-field as Pydantic models, never an invented shape (Phase 1/Phase 3).
- `dev-notes.md` was actually written, not merely described (Pipeline mode, this phase).

## OUTPUT

**BEFORE you start writing ⟶ your OBJECTIVE and EXIT CONDITION were already implicit in Phase 1's own MODE and
CONTRACT READ determination; this section carries the work to its close, never re-derives them.**

In Pipeline mode, write the dev-note artifact in this exact shape — reusing the shared build-protocol.md
template, never a new one:

```markdown
# Development Notes: {title}

## Objective / Exit Condition
{Objective: the task this invocation was actually asked to do, taken from the brief/arch-decision. Exit
condition: the Completion-criteria checklist above, all applicable items holding.}

## Changes Made
| File | Lines Changed | Description |
|---|---|---|
| `path` | +N / -N | {what changed} |

## Abstractions Reused
- {existing code integrated}

## Abstractions Created
- {new code created, with justification}

## Contracts
- {wire/Pydantic-model shapes another developer must satisfy — "None" if this task's own wire shape is
  unchanged}

## Test Scenarios for QA
- {what should be true — QA writes the acceptance tests, not you}

## Known Limitations
- {what QA should focus on}

## Status: DONE
## Close: VERIFIED (every completion check holds — evidence above) | COULD NOT (name what blocked you, what
is left, and escalate)
```

**WHEN REWORK/BUG-REPORT DETECTED above named a REWORK invocation ⟶ append `### REWORK Cycle {N}`**, per
ref:skill/grimorio.developer-memory/project.build-protocol.md#rework-mode.

A worked example of what THIS agent's own Phase 5 specifically populates, on an invented domain unrelated to
this project's own service (a receipt-line-item categorizer, never a passage lifted from a real file/symbol in
this repo):

```markdown
## Changes Made
| File | Lines Changed | Description |
|---|---|---|
| `app/domain/categorize.py` | +41 / -6 | Replaced a keyword-match categorizer with a rule-table lookup |

## Abstractions Reused
- `app/engine/CategoryRegistry` — the existing category-name port, no new taxonomy source introduced.

## Contracts
- `POST /categorize` now returns `{ "category": str, "confidence": float, "matched_rule": str | None }` —
  mirrors the shared `CategoryResult` wire schema field-for-field.

## Test Scenarios for QA
- A line item matching two rules at equal confidence resolves to the rule with the narrower scope, never the
  first-registered one.

## Known Limitations
- Multi-currency line items are out of scope for this slice.

## Status: DONE
## Close: VERIFIED (pytest passed; the bug-report's own reproduction test now green; no hard invariant
weakened)
```

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its `## OUTPUT` template, "Who
  commits" section, and "REWORK mode" section) — steps 2, 3, 5 above apply these directly.
  FINGERPRINT: DEV-NOTES PATH + COMMIT ACTION TAKEN + REWORK CYCLE APPENDED fields below (a dev-note in the
  shared shape, a correct commit call, and a correctly-appended REWORK section cannot be produced without these
  sections).
- this project's own developer trap log and this agent's own trap log —
  step 6's own confirmation load; the CAPTURE rule itself is Phase 0's own standing statement, not restated
  here, only confirmed.
- import:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11
  — the CLOSE contract, step 7's own load.
  FINGERPRINT: CLOSE field below (a real VERIFIED-naming-evidence or COULD-NOT-naming-the-blocker close, never
  a self-graded status, cannot be produced without this contract).
- **NEVER load `grimorio.python`, `grimorio.development-patterns`, or the fan-out ladder here** — this phase
  only reports what earlier phases already produced.

## PHASE 5 DELIVERABLE

```
DEV-NOTES PATH:              <path, confirmed written — or "N/A — Standalone mode, no dev-note owed">
BLOCKED CHECK:                 <ambiguity found and written as BLOCKED, per step 4 — or "None">
COMMIT ACTION TAKEN:            <committed at every coherent step (worktree-isolated) / committed nothing,
                              handed back for Gate B (shared tree), per step 5>
TRAP CAPTURE CONFIRMED:          <the capture confirmed reaching this agent's own trap log, per step 6 — or "N/A — nothing
                              non-obvious surfaced this invocation">
REWORK CYCLE APPENDED:            <the appended section, per step 3 — or "N/A — not a REWORK invocation">
COMPLETION CRITERIA CHECKED:       <one line per item under ## Completion criteria above, each explicitly
                              holding or not>
CLOSE:                              <VERIFIED, naming the completion-criteria evidence — or COULD NOT, naming
                              what blocked you and what is left>
```

## Terminal — no further phase, one possible re-entry only via Phase 4's own loop-back

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.py-developer-memory/py-developer-phases/phase-5-report.md`) and this phase's
own filled PHASE 5 DELIVERABLE block, written to disk first per that gate's own algorithm — this phase has no
next-phase file to gate a read against, so the gate runs against the CLOSE itself.**

**This chain ends here, always, once reached.** `dev-notes.md` is written (Pipeline mode), `## Status` and `##
Close` are emitted, and this phase closes VERIFIED or COULD NOT to the caller. The chain's ONLY re-entry path is
Phase 4's own chain-level loop-back into Phase 3, which never routes through this file — this phase itself never
loops back and never hands off anywhere but the caller. A subsequent, SEPARATE invocation starts fresh at Phase
0 (ref:skill/grimorio.py-developer-memory/behavior.md), never resumed mid-chain from this file.
