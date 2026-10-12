# Prompt Writer — Phase 2: UNDERSTAND, VERIFY & PLAN

**IN:** Phase 1's deliverable. **OUT:** the plan Phase 3 drafts against — the deliverable below.

## Steps

1. **ALWAYS state the OBJECTIVE, verbatim from the brief, and the EXIT CONDITION** — the checkable state that means
   it landed.
2. **WHEN the spec bundles independent requirements ⟶ decompose it:** PARTS / DISSOLVED / CONFLICTS /
   PROVING-ORDER / OPEN.
3. **ALWAYS name the EXPECTED RESULT:** one concrete instance of correct output from the artifact once it runs — a
   filled deliverable, a bad-to-good pair, a decision it gets right.
4. **ALWAYS verify — never choose — the handed level** with ref:skill/grimorio.agent-writing#how-to-decide-where-something-goes.
   **WHEN it fails ⟶ write MISMATCH in LEVEL; WHEN the content cannot be written at the handed level either ⟶
   write REFUSED in CORE RULE CHECK.**
5. **ALWAYS run the steps-vs-phases test** — for a rewrite, against the rewritten scope.
6. **ALWAYS pick, from the technique catalog, one technique for each judgement and each trap the artifact carries,
   and choose FORM per section:** an algorithm where a literal reading is wanted, prose where latitude is.
7. **ALWAYS list what the artifact will DELEGATE** to a script, a tool or the phase engine instead of describing.
8. **WHEN authoring a new agent ⟶ name its birth-harness:** a deterministic selftest when its job reduces to a
   checkable fact, otherwise a probe whose cue does not name the thing tested
   (ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof).
9. **WHEN authoring a new agent or splitting one ⟶ derive its Vision** in the six fields of
   ref:skill/grimorio.agent-writing/agent-vision.md, from founding material the brief carries, after reading any
   neighbour's Vision in its `design/` folder. Its OBJECTIVE passes the user-goal test: something the actor could
   stop for lunch on once done, never a step on the way to something else.
10. **WHEN the verdict is PHASES, the pass creates a chain or changes its phase count or boundaries, and the brief
    carries no reviewed plan for this scope ⟶ write the PLAN-FOR-REVIEW:** the chain's phases, nodes and expected
    outputs, and what it leaves out.
11. **WHEN the change you are writing into another agent's process applies to your own chain too ⟶ write it in
    SELF-AWARE FLAG** — the keeper decides whether it lands here.

## Deliverable

```
OBJECTIVE:               <verbatim from the brief>
EXIT CONDITION:          <checkable state>
LEVEL:                   <handed level> — <VERIFIED | MISMATCH: <why>>
DECOMPOSITION:           <PARTS / DISSOLVED / CONFLICTS / PROVING-ORDER / OPEN | "single atomic ask">
EXPECTED RESULT:         <the concrete instance, or a pointer to it>
STEPS-VS-PHASES VERDICT: <STEPS | PHASES> — <reason>; for a rewrite: <same shape | changes phase count/boundaries>
TECHNIQUES PICKED:       <one line per judgement or trap: what it is ⟶ technique id>
FORM:                    <per section: algorithm | prose, and why>
DELEGATED:               <what goes to a script, tool or the engine | "None">
BIRTH-HARNESS:           <SELFTEST: <check> | PROBE: <decoy cue> | "N/A — not a new agent">
VISION:                  <six fields + neighbour read | "N/A — neither new agent nor split">
PLAN-FOR-REVIEW:         <the plan | "N/A">
SELF-AWARE FLAG:         <the change, for the keeper | "N/A">
CORE RULE CHECK:         <REFUSED: <why> | proceeding>
```

Example:

```
OBJECTIVE:               "Add a rule: the reviewer must quote the line it flags."
EXIT CONDITION:          ux phase 3 carries the rule in its review step; check-prompt-shape exits 0 on the file
LEVEL:                   behavior file — VERIFIED
DECOMPOSITION:           single atomic ask
EXPECTED RESULT:         a ux finding reading: L42 "color: #999 on #fff" — contrast 2.8:1, below 4.5:1
STEPS-VS-PHASES VERDICT: PHASES — rewrite, same shape (one step added inside phase 3)
TECHNIQUES PICKED:       finding without evidence ⟶ K7 quote-then-judge; vague severity ⟶ K2 exact cases
FORM:                    the new step: algorithm (literal reading wanted)
DELEGATED:               contrast ratio ⟶ the existing contrast script
BIRTH-HARNESS:           N/A — not a new agent
VISION:                  N/A — neither new agent nor split
PLAN-FOR-REVIEW:         N/A
SELF-AWARE FLAG:         N/A
CORE RULE CHECK:         proceeding
```

## Hand-off

**WHEN CORE RULE CHECK reads REFUSED ⟶ `--on refused`; WHEN PLAN-FOR-REVIEW holds a plan ⟶ `--on plan-for-review`;
otherwise `--on continue`.**
