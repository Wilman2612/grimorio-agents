# Backend TS Developer — Phase 3: IMPLEMENT

**NEVER read ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-4-verify.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 4 verifies the
diff THIS phase actually produces; reading ahead without it on disk is verifying nothing.

## The question this phase answers

How do I build/fix this correctly, inside this project's own architectural layers, reusing what already exists?
This phase does not read the contract again (Phase 2's own closed question) and does not run the full test
suite/typecheck (Phase 4's own closed question) — it only produces working TypeScript for the scoped file(s)/
module(s), plus any Haiku-children's merged file/module output, if the fan-out gate fires.

**This phase carries the conditional WRITE-FAILING-TEST-ON-A-BUG sub-step and the fan-out gate, BOTH threaded
INSIDE this same phase — never their own phase nodes.** Proving a bug (writing the failing test) and fixing it
draw on the IDENTICAL JS/TS testing+code knowledge domain — there is no JIT-knowledge boundary crossed between
the two, exactly the same reasoning `grimorio.go-developer`'s own shipped Phase 3 already applies to the
identical shared build-protocol section, for a sibling agent; splitting it out would be exactly the
over-fragmentation ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm
warns against. The fan-out gate is the CHILDREN-OFFLOAD mechanism this phase's own heavy load already has built
in (per ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check) — a
relief valve for this chain's single heaviest phase, never a reason to split it further.

## Standing awareness — grimorio.fan-out/tiering baseline, named once, here

-> ref:repo/.claude/GRIMORIO-INDEX.md's own "Fan-out / tiering" entry,
ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm,
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet for
the baseline itself — this phase does not restate it, only carries it forward as context, so step 4 below has
something real to check the decomposition against.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of TWO branches — a FIRST-PASS
   branch or a CHILD branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node (survey, WHEN a risky zone is touched consult the selected trap file(s),
     WHEN a bug is flagged write the failing test first, decompose into independent items, evaluate the FAN-OUT
     BRANCH gate, build) fanning out into N `agent:grimorio.js-developer` `haiku` children — one per
     file/module — foreground and synchronous, WHEN the gate holds.
   - **CHILD branch**: a SELF node alone — WHEN a risky zone is touched consult the selected trap file(s), then
     build ONLY the one file/module named in your own brief, nothing else — WHEN this invocation is itself a
     fanned-out child of THIS phase's own FAN-OUT BRANCH.

   This agent never invokes any OTHER agent type from this phase — the only agent this phase ever spawns is a
   same-type child of itself, and only from the FIRST-PASS branch's own FAN-OUT BRANCH. **This chain carries NO
   loop-back edge into this phase from Phase 4** — a straight P1→P2→P3→P4→P5 spine, this chain is loop-back-free
   at the FILE level, stated explicitly rather than assumed: a defect Phase 4 finds is fixed by iterating WITHIN
   Phase 4's own mini-loop (its own step 5 states this explicitly), never by re-entering this file.
1a. **CHILD branch ⟶ skip steps 2-4 below entirely — the survey, the bug-order check, and the FAN-OUT BRANCH
   gate never re-fire for a child — build only the one assigned file/module at step 5, then go straight to
   this phase's own DELIVERABLE.** A CHILD never decomposes a scope it was never handed and never re-evaluates
   the fan-out gate. **WHEN the parent's own brief for this child explicitly names the assigned item as
   carrying a flagged bug ⟶ step 3 below still fires for this child, scoped to its own one assigned item, BEFORE
   step 5** — the ONLY OTHER sub-step of the 2-4 family a CHILD ever re-runs besides step 2a below, because the
   parent cannot apply the mandatory order on the child's behalf across a spawn boundary. **WHEN the brief names
   no such flag ⟶ step 3 stays skipped.** **Step 2a (the reactive risky-zone trap consultation) ALWAYS re-fires
   for a CHILD too, scoped to its own one assigned item, immediately before step 5** — the same spawn-boundary
   reasoning as the bug-order carve-out above: only the CHILD itself is actually writing the code that could
   touch a risky zone, so only the CHILD can consult the trap file(s) against it.
2. **ALWAYS survey before writing, scoped to the file/module list Phase 2 scoped** — read the files you will
   change, search for an existing abstraction you should reuse or extend rather than duplicate, verify the
   layer, per
   import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step.
2a. **WHEN implementation touches a risky zone (Windows npm/pnpm orchestration, the runner boot sequence, a
   wire/transcript-format boundary, the money/DB/LLM-blind frontier) ⟶ consult whichever of
   this agent's own two trap logs Phase 1 selected (`TRAP FILE(S) SELECTED`,
   carried forward from Phase 2) for a known gotcha in that specific zone before writing the change to that
   item.** This is the REACTIVE half of this agent's own two-pass trap-file discipline — Phase 1's own
   PROACTIVE targeted search, run before the architecture contract is even read, is the other half. On the
   CHILD branch, this step re-fires per step 1a above, scoped to the one assigned item alone. **WHEN no risky
   zone is touched by the assigned file(s)/module(s) ⟶ this step is satisfied by stating that plainly** — not
   every change is in a risky zone, and a forced consultation invents a finding that is not there.
3. **WHEN Phase 2's own REWORK/BUG-REPORT DETECTED field names a bug ⟶ apply
   import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — write the
   test that proves the bug exists FIRST, run it, confirm it fails with the expected error, BEFORE touching
   production code.** This is a CONDITIONAL first mini-loop step inside THIS SAME phase — never its own phase
   node — carried forward from Phase 2's own detection, applied here where the fixing knowledge domain actually
   lives.
4. **ALWAYS decompose into independent items before you write or run anything — one file or module per item
   (your VOLUME UNIT) — and declare, in one line, either the items you will fan out to or why this particular
   task does not split.** **FAN-OUT BRANCH:**
   1. Open
      import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
      and run its step-1 GATE check against the decomposition above — the trigger: the work splits into TWO OR
      MORE independent file/module items with no cross-informing.
   2. **WHEN the gate holds ⟶ fan out to `haiku` children of your own type, one per file/module — do NOT
      implement the whole set solo.** ALWAYS give each child its own `tmp/<child-id>/work` and
      `tmp/<child-id>/notes`, never a shared folder (ref:skill/grimorio.working-memory#the-folder). **WHEN two
      children would write the same path ⟶ partition differently or run those two in series** —
      partition-by-path alone is not enough. **NEVER pass `model` when spawning a child.**
   3. **WHEN the gate does not hold ⟶ proceed solo, but DECLARE in one line WHY it failed**, before writing a
      single line of code. **NEVER skip the declaration** — silence is not solo-by-default.
5. **ALWAYS implement the assigned file(s)/module(s) inside this project's own architectural layers the
   contract names — business logic in handlers/services and persistence in repositories, NEVER in route
   handlers** (carried forward unchanged from this agent's own pre-split `## Rules` block) **— staying strictly
   inside the Scope Boundary while building.** The concrete layer names/folder globs this pattern maps to in
   THIS project live at this project's own developer memory,
   never restated here. On the CHILD branch, this step is scoped to the one assigned item alone. **WHEN the
   SECURITY-SENSITIVE FLAG carried forward from Phase 2 is YES ⟶ build this scope carrying that awareness — it
   still gets built here, but Phase 5 routes it for security + code-reviewer review before merge, per the
   standing rule in Phase 0's own Scope Boundary section, never restated here.**
6. **NEVER touch any scope but this agent's own — not the web app's UI/presentation layers, not another
   language's own backend service.** **WHEN a change is needed in another layer ⟶ write it as a note for the
   owning developer in `dev-notes.md`, never make it yourself.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.javascript — language rules (naming, async, 20-line limit, SOLID). Read FIRST, before
  either of the two skills below.
  FINGERPRINT: MODULE(S)/FILE(S) BUILT field below (TypeScript that actually follows this project's own naming/
  async/20-line/SOLID conventions cannot be produced without it).
- import:skill/grimorio.development-patterns — architectural rules (Repository, DI, Result, Route Guard, CQRS,
  typed errors, structural limits) — the layer-placement rule step 5 above applies directly.
  FINGERPRINT: MODULE(S)/FILE(S) BUILT field below, jointly with the `grimorio.javascript` bullet above (business
  logic placed outside a route handler, persistence placed in a repository, cannot be produced without this).
- import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step —
  step 2's own survey-before-writing step.
  FINGERPRINT: SURVEY NOTES field below (a real survey result, distinct from an unchecked "none," cannot be
  produced without applying this discipline first).
- this agent's own two trap logs (primary and runner-node) — whichever Phase 1 selected, step 2a's own
  REACTIVE consultation, scoped narrowly to whichever risky zone the assigned file(s)/module(s) actually touch
  (distinct from Phase 1's own PROACTIVE full-corpus search — this load is triggered and narrow, never a repeat
  of that pass).
  FINGERPRINT: RISKY-ZONE CONSULTED field below (a real reactive consultation result naming the zone and any
  gotcha found, distinct from an unchecked "N/A," cannot be produced without opening this index when a risky
  zone is actually touched).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — step 3's own
  bug-order step.
  FINGERPRINT: BUG-FIX-FIRST-TEST field below (a real failing-test-first sequence, distinct from an unchecked
  "N/A," cannot be produced without applying this mandatory order first).
- import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
  + import:skill/grimorio.working-memory#the-folder — step 4's own gate, tier, isolation, and per-child folder
  rules.
  FINGERPRINT: FAN-OUT DECISION field below (a real gate evaluation, spawn, or solo declaration cannot be
  produced without applying this ladder and folder convention).
- **NEVER load `arch-decision.md` (Phase 2's own closed question), the Definition-of-Done checklist (Phase 4's
  own closed question), or the OUTPUT template (Phase 5's own closed question) here.**

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
OBJECTIVE:                  <carried forward from Phase 2, unchanged>
EXIT CONDITION:               <carried forward from Phase 2, unchanged>
MODE:                          <carried forward from Phase 2, unchanged>
ROUTE:                          <FIRST-PASS or CHILD, per step 1>
SURVEY NOTES:                     <what was found reusable/extendable, per step 2 — or "N/A — CHILD, step 1a
                              skipped this">
RISKY-ZONE CONSULTED:              <the zone touched + gotcha found in the selected trap file(s), per step 2a —
                              or "N/A — no risky zone touched this pass" — a CHILD states this scoped to its own
                              one assigned item, per step 1a's own re-fire clause>
BUG-FIX-FIRST-TEST:                 <the failing test written + confirmed failing, per step 3 — or "N/A — no
                              bug flagged" / "N/A — CHILD, no bug flag in this child's own brief">
DECOMPOSE DECLARATION:                <items decomposed into, per step 4 — or "N/A — CHILD">
FAN-OUT DECISION:                       <GATE: HELD / DID NOT HOLD, per step 4's own FAN-OUT BRANCH — WHEN HELD:
                              N children spawned, tiers (haiku), tmp/<child-id>/{work,notes} paths, per-path
                              partitioning confirmed non-colliding — WHEN DID NOT HOLD: the one-line WHY — "N/A —
                              CHILD">
MODULE(S)/FILE(S) BUILT:                 <the actual TS files/modules written — the full set on FIRST-PASS
                              (converged from every child, WHEN fanned out), the single assigned item on CHILD>
DIFF SUMMARY:                              <files touched + lines changed, own + any merged children's, per this
                              phase's own hand-off>
WIRE/DAL CONTRACT SHAPES:                    <carried forward from Phase 2, unchanged>
REWORK/BUG-REPORT DETECTED:                   <carried forward from Phase 2, unchanged>
SECURITY-SENSITIVE FLAG:                       <carried forward from Phase 2, unchanged>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on EITHER route ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.js-developer-memory/js-developer-phases/phase-3-implement.md`) and this
phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — this
applies on the CHILD route too, even though it has no next-phase file to gate a read against: the gate runs
against the CLOSE itself there, reporting back to the parent's own `tmp/<child-id>/work`+`notes`.**

**WHEN the route above is FIRST-PASS ⟶ ALWAYS read
ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-4-verify.md next, carrying forward: OBJECTIVE,
EXIT CONDITION, MODE, WIRE/DAL CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED, SECURITY-SENSITIVE FLAG, SURVEY
NOTES, BUG-FIX-FIRST-TEST, MODULE(S)/FILE(S) BUILT, and DIFF SUMMARY, unconditionally — OBJECTIVE, EXIT
CONDITION, MODE, WIRE/DAL CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED, and SECURITY-SENSITIVE FLAG arrive from
Phase 2's own hand-off and are re-forwarded here unchanged because Phase 5 still needs every one of them; SURVEY
NOTES and BUG-FIX-FIRST-TEST join them because Phase 5's own `## Abstractions Reused` section and its own
Completion-criteria checklist need them too, and none of these nine is otherwise re-derivable once Phase 4 opens
this file alone.** Phase 4 consumes exactly what this phase produced, plus this carried-forward set — it does
not re-derive any of it. **WHEN the route above is CHILD ⟶ this chain ends here — report the built file/module
back to your own `tmp/<child-id>/work`+`notes` and close your turn, never reading Phase 4.**
