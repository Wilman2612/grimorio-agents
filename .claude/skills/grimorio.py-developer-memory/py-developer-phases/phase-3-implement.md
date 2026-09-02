# Python Developer — Phase 3: IMPLEMENT

**NEVER read ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-4-verify.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 4 verifies the
diff THIS phase actually produces; reading ahead without it on disk is verifying nothing.

## The question this phase answers

How do I build/fix this correctly, inside the service's own layout, keeping the functional core pure? This
phase does not read the contract again (Phase 1's own closed question), does not write the bug-reproduction
test (Phase 2's own closed question on the bug-report route), and does not run the full invariant-verification
suite (Phase 4's own closed question) — it only produces working code for the scoped module(s), against the
checklist or the now-confirmed-red test, plus any Haiku-children's merged file/module output, if the fan-out
gate fires.

**This phase carries the internal fan-out gate threaded INSIDE it, never its own phase node — the same
CHILDREN-OFFLOAD relief valve `grimorio.go-developer`'s own IMPLEMENT phase already uses.** Unlike the
WRITE-FAILING-TEST sub-step (which this agent gives its own conditional phase node, per Phase 2's own opening
section), the fan-out gate stays threaded here because it answers the SAME question this phase already asks —
"how do I build this" — merely delegated per-file rather than done solo; it is not a distinct question with its
own gating deliverable the way "does the bug reproduce" is.

## Standing awareness — grimorio.fan-out/tiering baseline, named once, here

-> ref:repo/.claude/GRIMORIO-INDEX.md's own "Fan-out / tiering" entry,
ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm,
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet for
the baseline itself — this phase does not restate it, only carries it forward as context, so step 4 below has
something real to check the decomposition against.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of TWO branches — a FIRST-PASS
   branch or a CHILD branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node (survey, build against the checklist or the confirmed-red test,
     decompose into independent items, evaluate the FAN-OUT BRANCH gate, build) fanning out into N
     `agent:grimorio.py-developer` `haiku` children — one per file/module — foreground and synchronous, WHEN the
     gate holds.
   - **CHILD branch**: a SELF node alone — build ONLY the one file/module named in your own brief, nothing else
     — WHEN this invocation is itself a fanned-out child of THIS phase's own FAN-OUT BRANCH.

   This agent never invokes any OTHER agent type from this phase — the only agent this phase ever spawns is a
   same-type child of itself, and only from the FIRST-PASS branch's own FAN-OUT BRANCH. **The chain-level
   REWORK loop-back into THIS phase arrives from Phase 4, on a route Phase 4's own mini-loop genuinely cannot
   resolve alone** — Phase 4's own file states the boundary between its own mini-loop iteration and this
   chain-level loop-back explicitly; this phase's own re-entry via that edge starts a FRESH FIRST-PASS pass
   against Phase 4's own carried failure report as new input, never a special third branch of its own.
1a. **CHILD branch ⟶ skip steps 2-4 below entirely — the survey and the FAN-OUT BRANCH gate never re-fire for a
   child — build only the one assigned file/module at step 5, then go straight to this phase's own
   DELIVERABLE.** A CHILD never decomposes a scope it was never handed and never re-evaluates the fan-out gate.
2. **ALWAYS survey before writing, scoped to the module/file list Phase 1 scoped** — read the files you will
   change, search for an existing abstraction you should reuse or extend rather than duplicate, verify the
   layer, per
   import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step.
3. **WHEN this is a bug-report route (REWORK/BUG-REPORT DETECTED above is YES) ⟶ build against Phase 2's own
   confirmed-red BUG-FIX-FIRST-TEST, per
   import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order's own step 2
   (fix the code, only after the test fails — already satisfied by the time this phase runs, since Phase 2 is
   this chain's own gate for exactly that).** **WHEN this is NOT a bug-report route ⟶ build against Phase 1's
   own SCOPED IMPLEMENTATION CHECKLIST directly.**
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
5. **ALWAYS implement the assigned module(s) inside the service layout the contract names, keeping the
   functional core (domain rules, resolution logic) pure and pushing I/O (HTTP, an LLM SDK, files) to the
   imperative shell at the edges.** Define seams as `typing.Protocol` classes. On the CHILD branch, this step is
   scoped to the one assigned item alone.
6. **NEVER touch any scope but the Python backend service this project names in project memory** — not the web
   app, not the shared TS contracts, not another language's backend service. **WHEN a change is needed in
   another layer ⟶ write it as a note for the owning developer in `dev-notes.md`, never make it yourself.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.python — Ports & Adapters via Protocol, the functional-core/imperative-shell split,
  async conventions, the error-handling hierarchy. Read FIRST, before either of the two skills below.
  FINGERPRINT: MODULE(S) BUILT field below (Python code that actually follows this project's own Protocol-seam/
  functional-core conventions cannot be produced without it).
- import:skill/grimorio.development-patterns — mandatory patterns, structural limits, and the sparse-comments
  rule.
  FINGERPRINT: MODULE(S) BUILT field below, jointly with the bullet above.
- import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step —
  step 2's own survey-before-writing step.
  FINGERPRINT: SURVEY NOTES field below (a real survey result, distinct from an unchecked "none," cannot be
  produced without applying this discipline first).
- import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
  + import:skill/grimorio.working-memory#the-folder — step 4's own gate, tier, isolation, and per-child folder
  rules.
  FINGERPRINT: FAN-OUT DECISION + DECOMPOSE DECLARATION fields below (a real gate evaluation, spawn, or solo
  declaration, and the independent-item decomposition it is evaluated against, cannot be produced without
  applying this ladder and folder convention).
- **NEVER load `arch-decision.md` again (Phase 1's own closed question), the pytest testing conventions used to
  WRITE the reproduction test (Phase 2's own closed question), the invariant-verification checklist (Phase 4's
  own closed question), or the OUTPUT template (Phase 5's own closed question) here.**

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
ROUTE:                     <FIRST-PASS or CHILD, per step 1>
SURVEY NOTES:                <what was found reusable/extendable, per step 2 — or "N/A — CHILD, step 1a skipped
                            this">
BUILT-AGAINST:                <"the confirmed-red BUG-FIX-FIRST-TEST" (bug-report route) or "the SCOPED
                            IMPLEMENTATION CHECKLIST" (ordinary route), per step 3>
DECOMPOSE DECLARATION:        <items decomposed into, per step 4 — or "N/A — CHILD">
FAN-OUT DECISION:              <GATE: HELD / DID NOT HOLD, per step 4's own FAN-OUT BRANCH — WHEN HELD: N
                            children spawned, tiers (haiku), tmp/<child-id>/{work,notes} paths, per-path
                            partitioning confirmed non-colliding — WHEN DID NOT HOLD: the one-line WHY — "N/A —
                            CHILD">
MODULE(S) BUILT:               <the actual Python files/modules written — the full set on FIRST-PASS (converged
                            from every child, WHEN fanned out), the single assigned item on CHILD>
DIFF SUMMARY:                   <files touched + lines changed, own + any merged children's, per this phase's
                            own hand-off>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on EITHER route ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md`) and this
phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — this
applies on the CHILD route too, even though it has no next-phase file to gate a read against: the gate runs
against the CLOSE itself there, reporting back to the parent's own `tmp/<child-id>/work`+`notes`.**

**WHEN the route above is FIRST-PASS ⟶ ALWAYS read
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-4-verify.md next, carrying forward: MODE,
CONTRACT READ, WIRE-CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED, BUG-FIX-FIRST-TEST (Phase 2's own field WHEN
this was a bug-report route, else "N/A — no bug flagged"), SURVEY NOTES, MODULE(S) BUILT, and DIFF SUMMARY,
unconditionally.** MODE, CONTRACT READ, and BUG-FIX-FIRST-TEST are carried here even though THIS phase's own
primary business is building code, not consuming any of the three — per
ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment's own
"restate, inside a later phase's own file, any fact that phase depends on" rule. `grimorio.go-developer`'s own
chain HAD this exact pair of drops at an equivalent hop — MODE dropped at its own Phase 3→4 hand-off, and
BUG-FIX-FIRST-TEST never carried past its own producing phase at all — independently found during this
redesign's own diagnosis, since closed in go-developer's own cycle-2 REWORK; neither gap is repeated here.
**WHEN the route above is
CHILD ⟶ this chain ends here — report the built file/module back to your own `tmp/<child-id>/work`+`notes` and
close your turn, never reading Phase 4.**
