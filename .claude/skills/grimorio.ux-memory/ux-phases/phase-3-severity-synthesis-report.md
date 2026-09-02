# UX Critic — Phase 3: SEVERITY SYNTHESIS & REPORT (terminal — no Phase 4)

**NEVER close this task, or report anything to the caller, until THIS phase's own `## OUTPUT` block, below, is
actually written to disk as `ux-review.md`.** This is the terminal phase; there is no Phase 4 to gate toward —
the gate here is the OUTPUT contract itself, not a future file.

## The question this phase answers

Given ALL findings across ALL states (or, on the Phase-1 early-exit path, the single BLOCKER/FAIL finding), how
severe is each relative to the others, and what is the overall shippability verdict?

## Core Rule — this agent's own standing rule, restated fresh here

**Suggest design DIRECTION, never implementation** — "not code."

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — severity-rank, decide
   Status, write `ux-review.md` — and nothing else; this agent never invokes another agent, in any phase, ever.
   Terminal.**
2. **ALWAYS severity-rank every finding across every state: 🔴 BLOCKER / 🟡 MAJOR / 🟠 MINOR / 🔵 NIT.**
3. **ALWAYS decide the overall Status per this exact rubric:**
   - `DONE` — no blockers or majors; the UI is shippable.
   - `DONE_WITH_WARNINGS` — only minors/nits.
   - `FAIL` — at least one BLOCKER or MAJOR.
4. **ALWAYS write `ux-review.md` to disk following the `## OUTPUT` contract below, unchanged in content from
   what this project has always shipped.**

## LOAD (JIT) — scoped to this phase only

**Deliberately N/A — this phase loads nothing further, by design.** The severity rubric and Status definitions
above are already fully specified inline in this phase's own steps; no design canon, no Nielsen heuristics are
needed here — synthesis is a comparative judgment over findings Phase 2 already grounded in a cited principle,
never a re-critique that would need the canon a second time.

## OUTPUT

```markdown
# UX Review (Adversarial): {title}

## States Reviewed
| Rendered State | Named State | Verdict |
|---|---|---|

## Findings
### Finding 1: {title}
- **Severity**: 🔴 BLOCKER / 🟡 MAJOR / 🟠 MINOR / 🔵 NIT
- **Rendered state / screenshot**: {ref}
- **Problem**: {what's wrong with the design — hierarchy, spacing, contrast, state, consistency, affordance}
- **Why it matters to the user**: {concrete}
- **Suggested fix**: {direction, not code}

## Status: DONE | DONE_WITH_WARNINGS | FAIL
```

Written to disk as `ux-review.md`, never reported in chat alone.

## PHASE 3 DELIVERABLE — this phase's own internal tracking, distinct from the `## OUTPUT` contract above

```
UX-REVIEW.MD PATH:       <the file path written this pass>
STATUS ASSIGNED:         <DONE / DONE_WITH_WARNINGS / FAIL>
FINDING COVERAGE:        <confirm every finding from Phase 2 (or the single Phase-1 finding, on the early-exit
                         path) was included, none dropped>
```

## Terminal — no hand-off

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh Phase 0
(ref:skill/grimorio.ux-memory/behavior.md), never resumed mid-chain from this file. Report `ux-review.md` and
its Status to the caller.
