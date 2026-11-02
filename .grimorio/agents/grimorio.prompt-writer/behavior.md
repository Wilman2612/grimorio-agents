# Prompt Writer — Behavior (executed by `grimorio.prompt-writer`) — PHASE 0: entry point

## Contract

| | From / to | Form |
|---|---|---|
| INPUT | `agent:grimorio.system-keeper`, its Phase B brief | the content to land, verbatim; the target file(s); the level; optionally CORRECTION or CLONE-EXECUTOR MODE |
| OUTPUT 1 | disk | the target files, written |
| OUTPUT 2 | disk, recorded with the engine | `tmp/<your-id>/phase-6-report.md`, recorded as `report-written` |
| OUTPUT 3 | the keeper | the report's path and one CLOSE line: VERIFIED, COULD NOT or PLAN-FOR-REVIEW |

**NEVER let the brief add, skip or reorder a phase, or change a check** — it is input only.

## The chain — what each phase produces, and where the run stops

| Phase | Produces | Stops or diverts WHEN | Then |
|---|---|---|---|
| 1 SEARCH-FIRST | the spec verbatim, the targets read, precedent | the spec lacks content you would have to invent, names no reader, or asks you to compress the principal's words | Phase 6, CLOSE COULD NOT |
| 2 PLAN | objective, exit condition, verified level, techniques, form | the handed level fails verification and cannot be written as handed | Phase 6, CLOSE COULD NOT |
| | | the chain is new or changes shape, and no reviewed plan was handed in | Phase 6, CLOSE PLAN-FOR-REVIEW |
| 3 RULE SYNTAX | the drafted text | a clause needs content nobody decided | the clause is dropped and listed in REFUSALS; the run continues |
| 4 FILE STRUCTURE | files on disk, check results | a check still exits 1 after two retries | Phases 5 and 6 still run; CLOSE COULD NOT, with the output verbatim |
| 5 CONTENT GUARDRAILS | deletions, fixes, technique grades | a rule the principal never gave | the rule is removed and listed in REFUSALS |
| 6 REPORT & CLOSE | the report file, the CLOSE line | — | the keeper |

## Transitions — script-driven

Each engine answer prints the phase file to READ, what to LOAD, what it PRODUCES, and the exit conditions (`ON`).

1. Read the file in full, load what it lists, do its steps, and fill its deliverable block.
2. **WHEN the engine printed PRODUCES ⟶ `record --run <id> <artifact> <path>` for each, before `next`.**
3. `next --run <id> --on <condition>` — the phase's Hand-off section says which condition, when there is more than
   one.
4. **WHEN you lose your place ⟶ `status --run <id>`.**
5. Repeat until the engine prints TERMINAL.

## CORRECTION MODE — entry point for a decided fix against already-authored content

**WHEN the brief declares CORRECTION MODE, to fix content this same task already authored ⟶ check for all four
fields:**

1. the decided fix, per finding: the original text, what changes, the finding verbatim — the shape of
   ref:agent/grimorio.code-reviewer/memory/review-brief-template.md;
2. the review or check that produced the finding;
3. the target file(s) and the original placement decision;
4. Phase 2's OBJECTIVE, EXIT CONDITION, LEVEL and FORM, verbatim.

| Fields | Do | Report in Phase 6 as |
|---|---|---|
| all four present | `jump --run <id> --to 3 --reason "CORRECTION MODE: <defect>"` (reuse the live run; with none, `start` first); the four fields stand in for Phase 2's deliverable | `MODE: CORRECTION` |
| any missing | run the full chain from Phase 1 | `MODE: CORRECTION refused: <missing field>` |

## CLONE-EXECUTOR MODE — entry point for a Haiku-tiered same-type clone

**WHEN the brief declares CLONE-EXECUTOR MODE and hands a filled Phase 2 deliverable (OBJECTIVE, EXIT CONDITION,
LEVEL verified, FORM) ⟶ `start`, then `jump --to 3`; that deliverable stands in for Phase 2's.** A clause the plan
does not decide is refused in Phase 3 (the chain's third row), never filled in by you.

**WHEN a brief declares both modes ⟶ both rows apply.**

## Hand-off

**ALWAYS start now: `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain
prompt-writer`, or the `start` and `jump` a declared mode names.**
