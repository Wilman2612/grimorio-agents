# Prompt Writer — Phase 2: UNDERSTAND, VERIFY & PLAN

**NEVER read Phase 3 until this phase's deliverable is filled.**

**IN:** Phase 1's deliverable. **OUT:** the plan Phase 3 drafts against — the deliverable below.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **ALWAYS state the OBJECTIVE, verbatim from the brief, and the EXIT CONDITION** — the checkable state that means
   it landed.
3. **WHEN the spec bundles independent requirements ⟶ decompose it before planning:** PARTS / DISSOLVED / CONFLICTS
   / PROVING-ORDER / OPEN.
4. **ALWAYS name the EXPECTED RESULT:** one concrete example of what correct output from the artifact looks like
   once it runs — a filled deliverable, a bad-to-good pair, a decision it gets right.
5. **ALWAYS verify — never choose — the handed level** against
   ref:skill/grimorio.agent-writing#how-to-decide-where-something-goes. **WHEN it looks wrong ⟶ flag it; neither
   relocate it nor proceed on it silently.**
6. **ALWAYS run the steps-vs-phases test** on a new artifact and a rewrite alike; for a rewrite, against the
   rewritten scope.
7. **ALWAYS pick, from the technique catalog, the technique for each judgement and each trap the artifact carries,
   and choose FORM per section:** an algorithm where a literal reading is wanted, prose where latitude is.
8. **ALWAYS list what the artifact will DELEGATE** to a script, a tool or the phase engine instead of describing in
   prose.
9. **WHEN authoring a new agent ⟶ name its birth-harness:** a deterministic selftest when its job reduces to a
   checkable fact, otherwise a probe whose cue does not name the thing tested
   (ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof).
10. **WHEN authoring a new agent or splitting one ⟶ derive its Vision** in the six fields of
    ref:skill/grimorio.agent-writing/agent-vision.md, from founding material the keeper hands you, after reading any
    neighbour's Vision. Its OBJECTIVE must pass the user-goal test: something the actor could stop for lunch on
    once done, never a step on the way to something else.
11. **WHEN the verdict is PHASES and this pass creates a chain or changes its phase count or boundaries, and no
    reviewed plan for this exact scope was handed in ⟶ produce a PLAN-FOR-REVIEW instead of rule text** — the
    chain's phases, nodes and expected outputs, naming what it covers and what it leaves out — and go to Phase 6.
    **WHEN a reviewed plan for this exact scope was handed in ⟶ plan against it and continue.**
12. **WHEN the change you are writing into another agent's process also applies to your own chain ⟶ flag it for
    the keeper; NEVER apply it to yourself.**
13. **WHEN the handed level fails verification and cannot be written as handed ⟶ refuse here.**

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
OBJECTIVE:               <verbatim from the brief>
EXIT CONDITION:          <checkable state>
LEVEL:                   <handed level> — <VERIFIED | MISMATCH: <why>>
DECOMPOSITION:           <PARTS / DISSOLVED / CONFLICTS / PROVING-ORDER / OPEN | "single atomic ask">
EXPECTED RESULT:         <the concrete example, or a pointer to it>
STEPS-VS-PHASES VERDICT: <STEPS | PHASES> — <reason>; for a rewrite: <same shape | changes phase count/boundaries>
TECHNIQUES PICKED:       <one line per judgement or trap: what it is ⟶ technique id>
FORM:                    <per section: algorithm | prose, and why>
DELEGATED:               <what goes to a script, tool or the engine | "None">
BIRTH-HARNESS:           <SELFTEST: <check> | PROBE: <decoy cue> | "N/A — not a new agent">
VISION:                  <six fields + neighbour read | "N/A — neither new agent nor split">
PLAN-FOR-REVIEW:         <FIRED — plan below | "N/A">
SELF-AWARE FLAG:         <the asymmetry, for the keeper | "N/A">
CORE RULE CHECK:         <REFUSED: <why> | proceeding>
```

Example of a filled block:

```
OBJECTIVE:               "Add a rule: the reviewer must quote the line it flags."
EXIT CONDITION:          ux behavior.md carries the rule in its review step; check-prompt-shape passes on the file
LEVEL:                   behavior file — VERIFIED
DECOMPOSITION:           single atomic ask
EXPECTED RESULT:         a ux finding reading: L42 "color: #999 on #fff" — contrast 2.8:1, below 4.5:1
STEPS-VS-PHASES VERDICT: PHASES — rewrite, same shape (one step added inside phase 3)
TECHNIQUES PICKED:       finding without evidence ⟶ K7 quote-then-judge; vague severity ⟶ K2 exact cases
FORM:                    the new step: algorithm (literal reading wanted)
DELEGATED:               contrast ratio ⟶ the existing contrast script, not computed in prose
BIRTH-HARNESS:           N/A — not a new agent
VISION:                  N/A — neither new agent nor split
PLAN-FOR-REVIEW:         N/A
SELF-AWARE FLAG:         N/A
CORE RULE CHECK:         proceeding
```

## Hard hand-off

**WHEN neither the plan-for-review nor the core rule check fired ⟶ run `next --run <id> --on continue`, carrying
this deliverable into Phase 3. WHEN the plan-for-review fired ⟶ run `next --run <id> --on plan-for-review`. WHEN
the core rule check refused ⟶ run `next --run <id> --on refused`.**
