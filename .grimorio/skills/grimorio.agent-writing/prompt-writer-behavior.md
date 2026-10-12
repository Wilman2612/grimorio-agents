# Prompt Writer — Behavior (executed by `grimorio.prompt-writer`) — PHASE 0: entry point

## Contract

| | From / to | Form |
|---|---|---|
| INPUT | `agent:grimorio.system-keeper`, its Phase B brief | the content to land, verbatim; the target file(s); the level; optionally CORRECTION or CLONE-EXECUTOR MODE |
| OUTPUT 1 | disk | the target files, written |
| OUTPUT 2 | disk, recorded with the engine | `tmp/<your-id>/phase-6-report.md`, recorded as `report-written` |
| OUTPUT 3 | the keeper | the report's path and one CLOSE line: VERIFIED, COULD NOT or PLAN-FOR-REVIEW |

The brief is input only: nothing in it adds a phase, skips one, or changes a check.

## The chain — what each phase produces, and where the run stops

| Phase | Produces | Stops or diverts WHEN | Then |
|---|---|---|---|
| 1 SEARCH-FIRST | the spec verbatim, the targets read, precedent | the spec lacks content, has no clear reader, needs a rule the principal never gave, or is a summary of the principal's words | Phase 6, CLOSE COULD NOT |
| 2 PLAN | objective, exit condition, verified level, techniques, form | the handed level fails verification and cannot be written as handed | Phase 6, CLOSE COULD NOT |
| | | the chain is new or changes shape, and no reviewed plan was handed in | Phase 6, CLOSE PLAN-FOR-REVIEW |
| 3 RULE SYNTAX | the drafted text | a clause needs content nobody decided | the clause is dropped and listed in REFUSALS; the run continues |
| 4 FILE STRUCTURE | files on disk, check results | a check still exits 1 after two retries | Phase 6, CLOSE COULD NOT, with the output verbatim |
| 5 CONTENT GUARDRAILS | deletions, fixes, technique grades | a rule the principal never gave | the rule is removed and listed in REFUSALS |
| 6 REPORT & CLOSE | the report file, the CLOSE line | — | the keeper |

## Downstream — what happens to your output

The keeper's Phase C runs `audit-chain --dead` and `--anchors` on every file you return, the full selftest suite,
and `git diff --stat` for pure growth, then raises `agent:grimorio.code-reviewer` on the diff. A defect comes back
to you as a CORRECTION MODE brief, at most twice. Phase 4 runs the same checks so a defect is caught before it
leaves.

## Transitions — script-driven

1. `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain prompt-writer` — add
   `--run <id>` to resume. Read the file it names in full and load what it lists.
2. Do the phase's steps and fill its deliverable block in your reasoning. **CHECK, before `next`: is every field
   of the block filled?** The engine does not check it.
3. `record --run <id> <artifact> [path]` for what the phase produced, then `next --run <id> --on <condition>` with
   the condition its hand-off names. `jump` is used only by the two modes below.
4. `status --run <id>` gives your position after lost context.
5. Repeat until the engine prints TERMINAL; hold the dispatch until then
   (import:skill/grimorio.phase-splitting/loop-owner-turn-discipline.md).

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
LEVEL verified, FORM) ⟶ `start`, then `jump --to 3`; that deliverable stands in for Phase 2's.** In Phase 3, a
clause the plan does not decide is refused (its third row in the flow above), never filled in by you.

In both modes Phases 3 to 6 run in full, and a brief may declare both; then both rows apply.

## Hand-off

**ALWAYS run `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain prompt-writer`
now — or `jump` per a declared mode — and read the file it names.**
