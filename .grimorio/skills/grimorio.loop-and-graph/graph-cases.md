# Graph Cases — the shapes a plan takes, and what a script can check of each

**IN:** a task you must plan — one that decomposes into items, loops or children. **OUT:** a plan file in your plan
tree (ref:skill/grimorio.loop-and-graph#2c-the-plan-is-an-artifact-every-level-expands), in the format below, built from one case per stage, validated by the script.

A phase that executes a fixed step of a chain plans nothing and never uses this file.

## How to use it

1. **ALWAYS pick one case per stage of the work from the table below, by its WHEN column.** A stage that matches
   none is planned as DO-IT-YOURSELF until you can name why it is not.
2. **ALWAYS write the plan file before the first spawn or edit**, then run the validator,
   ref:skill/grimorio.loop-and-graph/scripts/plan-graph.mjs, as `validate <plan-file>`.
3. **WHEN it exits 1 ⟶ fix the plan, never the finding, and re-run.** It exits 0 only on the deterministic rules
   below; the JUDGMENT column of each case is still yours.
4. Run it as `render <plan-file>` and put the mermaid it prints in the plan tree, for whoever reviews the plan.

## The cases

| Case | WHEN | Shape | Review | Source |
|---|---|---|---|---|
| **C1 DO-IT-YOURSELF** | one small domain, or an item already atomic: a two-line fix, one lookup | `self` | none of its own; the caller's loop reviews | grimorio (§3b) |
| **C2 CHAIN** | stages that need different knowledge, always in the same order | `stage → gate → stage …` on the phase engine | at the gate the chain declares | Anthropic: prompt chaining; grimorio phase-splitting |
| **C3 SECTIONED FAN-OUT** | several independent items, each provable alone | `FOREACH ∥ (work → probe)` then `review` then `merge` | once, after the loop | Anthropic: parallelization (sectioning); grimorio §2 |
| **C4 FIND-THEN-VERIFY** | children report claims (findings, gaps, defects) that may be wrong | `FOREACH ∥ find` → `FOREACH ∥ verify-each-claim` → `synthesize` | the verify step is per claim; no review of the synthesis unless it ships | Claude Code: review pipeline (find, then verify each finding adversarially) |
| **C5 PANEL** | one question where several independent perspectives beat one | `FOREACH ∥ perspective (same input)` → `synthesize` | none; the synthesis names disagreements | Anthropic: parallelization (voting); grimorio entropy panel |
| **C6 ORCHESTRATOR-WORKERS** | the items are not known up front; working reveals them | `WHILE items remain: plan → FOREACH (work → probe)`; a blocked item inserts its prerequisite (§2b) | once, after the WHILE exits | Anthropic: orchestrator-workers; grimorio §2, §2b |
| **C7 EVALUATE-AND-REVISE** | one artifact improved against a stated criterion | `WHILE criterion fails and tries < N: revise → evaluate` → FINDING at N | the evaluator is the loop's own check; a review after it only if the artifact merges | Anthropic: evaluator-optimizer |
| **C8 VOLUME CLONES** | one fully decided change repeated over many files | `gate → FOREACH ∥ (Haiku clone)` → `review-before-done` | once, on all clones' output | grimorio fan-out volume ladder |
| **C9 RELAUNCH-FRESH** | your context is already heavy when the writing stage arrives | `fresh child (writing)` handed the decided plan | the caller's | grimorio (§3b) |
| **C10 ROUTE** | an input must go to exactly one specialist | `classify → one of N paths` | the chosen path's | Anthropic: routing; grimorio agent-selection |

Exact cases for the hardest boundaries:

| Situation | Case |
|---|---|
| Fix 12 dead references, each in a different file, each checkable with `audit-chain --dead` | C3 |
| Fix 12 dead references with the same rename | C8 |
| Audit 30 agents and report defects | C4 — the audit claims are verified before anyone acts on them |
| "Is this design sound?" | C5 |
| Make a selftest pass when you do not yet know what blocks it | C6 |
| Rewrite one skill until the prompt-shape check and the deletion test pass | C7 |
| Rename one constant | C1 |

## The deterministic rules — what the validator refuses

| Rule | Refused when |
|---|---|
| R1 pass condition | an item has no `pass` |
| R2 loop exit | a `while` loop has no `exit`, or any loop has no `retries`, or the plan has no `finding` node to receive retry exhaustion |
| R3 review placement | a `review` node sits inside a loop body |
| R4 fan-out limit | a parallel loop has no `limit` |
| R5 verifier tier | a `probe`, `verify` or `review` node runs on Opus or Fable without a `tierReason`, or on Haiku |
| R6 planner tier | a `plan`, `route` or `synthesize` node runs on Haiku |
| R7 atomic item | an item marked `atomic` is handed to any agent but `self` |
| R8 hand-offs | a node has no `in` or no `out` |
| R9 shape | `shape` is missing, or is `do-it-yourself` while a node names an agent other than `self` |
| R10 case | a stage names no case from the table |

## What the script cannot decide — the JUDGMENT column

- Whether the items are really independent (C3) or only look it.
- Whether a `pass` condition is honest — green for the right reason.
- Whether the decomposition is complete; the script sees only the items written.
- Whether a stage matched the right case.
- Whether a FINDING was earned or the retries were wasted on one approach.

## The plan format

```json
{
  "objective": "every dead reference in the corpus resolves",
  "shape": "fan-out-with-limit",
  "stages": [{ "id": "s1", "case": "C3", "loop": "L1" }],
  "items": [
    { "id": "i1", "pass": "audit-chain --dead fan-out exits 0", "atomic": false },
    { "id": "i2", "pass": "audit-chain --dead board exits 0", "atomic": false }
  ],
  "nodes": [
    { "id": "w", "kind": "work", "agent": "grimorio.delegate", "model": "sonnet", "in": "item + pass", "out": "branch" },
    { "id": "p", "kind": "probe", "agent": "self", "model": "sonnet", "in": "branch", "out": "exit code" },
    { "id": "r", "kind": "review", "agent": "grimorio.code-reviewer", "model": "sonnet", "in": "combined diff", "out": "verdict" },
    { "id": "m", "kind": "merge", "agent": "self", "model": "sonnet", "in": "verdict", "out": "merged branches" },
    { "id": "f", "kind": "finding", "agent": "self", "model": "sonnet", "in": "failed item + attempts", "out": "finding" }
  ],
  "loops": [
    { "id": "L1", "type": "foreach", "over": "items", "parallel": true, "limit": 4, "retries": 3,
      "body": ["w", "p"], "then": ["r", "m"] }
  ]
}
```

`kind` is one of `plan`, `work`, `probe`, `verify`, `review`, `merge`, `synthesize`, `finding`, `route`, `gate`;
`model` one of `haiku`, `sonnet`, `opus`, `fable`; `shape` one of `do-it-yourself`, `fan-out-with-limit`,
`relaunch-fresh` (§3b).
