# Prompt Writer — Phase 2: UNDERSTAND, VERIFY & PLAN

**NEVER read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-3-rule-syntax.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** Phase 3 writes individual rules against a FORM and a LEVEL
this phase decides — reading ahead without deciding either first is drafting rules with nothing to draft them
against.

## The question this phase answers

Given what Phase 1 found, what exactly am I building, and how? This phase turns Phase 1's gathered facts into a
genuine plan before a line of rule-text is written — distinct from gathering (Phase 1) and from writing to the
plan (Phases 3-5).

## Core Rule 2, restated — the standing boundary that can fire here

**NEVER finish over being RIGHT.** WHEN the level agent:grimorio.system-keeper handed you does not survive this
phase's own verification step below ⟶ flag the mismatch in this phase's own DELIVERABLE rather than silently
proceeding on a level you believe is wrong. This is the SECOND of the four phases this boundary can fire from.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — state the objective
   and exit condition, verify the level, choose FORM — and nothing else; this agent never invokes another
   agent, in any phase, ever.**
2. **BEFORE anything else in this phase ⟶ state your OBJECTIVE (what you were handed to author, verbatim from
   agent:grimorio.system-keeper) and your EXIT CONDITION (what "landed correctly" means for this artifact —
   every pointer resolves, split integrity holds, the self-check gate passes).** Full rule:
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11 —
   not restated here.
2a. **WHEN the spec agent:grimorio.system-keeper handed you bundles more than one independent
   requirement — a genuinely tangled, multi-part ask, not a single atomic edit ⟶ ALWAYS instantiate
   reasoning-principles' own PARTS/DISSOLVED/CONFLICTS/PROVING-ORDER/OPEN decomposition as this phase's own
   DELIVERABLE field, before choosing FORM below.** WHEN the spec is a single atomic ask (one file, one
   coherent change) ⟶ this step is satisfied by stating that plainly — never a forced decomposition of
   something that was never tangled.
2b. **ALWAYS identify the PURPOSE — the expected RESULT — of what is being authored, before drafting a single
   rule: state, as this phase's own `EXPECTED-RESULT ARTIFACT` DELIVERABLE field below, what correct, WORKING
   output from the agent/skill being authored would actually look like once it runs — never merely its
   rule-form.** Name a concrete worked example of correct output: a bad-input→good-output refactor pair for a
   code-writing agent; a filled quasi-software-view, per
   ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-quasi-software-view.md#the-five-layers-at-a-glance-and-where-each-is-drawn's
   own precedent, for an agent-authoring agent. Grounded in three real sources, cited by name, never re-derived: **Design by
   Contract** (Bertrand Meyer, Eiffel, 1986; https://www.eiffel.com/values/design-by-contract/) — the
   postcondition is specified before/alongside the routine's own form, so what the routine GUARANTEES is
   checkable independent of how it is implemented; **Specification by Example** (Gojko Adzic, Manning, 2011;
   https://gojko.net/books/specification-by-example/) — a team derives scope from concrete worked examples
   rather than abstract prose requirements; **few-shot/exemplar prompting** (Brown et al., "Language Models are
   Few-Shot Learners," NeurIPS 2020, arXiv:2005.14165, https://arxiv.org/abs/2005.14165) —
   showing a model worked input→output demonstrations sharply outperforms telling it what to do without showing
   it.
2c. **WHEN the artifact being authored is itself GOAL-SHAPED — a new agent's own charter/objective, a
   use-case-like scope statement, anything that names what an actor/agent is FOR ⟶ ALWAYS apply Cockburn's own
   user-goal test (the same "go to lunch" test
   ref:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types's own Type A
   row already applies) to verify the stated purpose is genuinely at goal-level, never an operation/subfunction
   dressed up as one.** One sourced statement of the test lives at that Type A row — never re-derived or
   re-quoted here a second time. **WHEN a named purpose FAILS the test — it reads as a step an actor performs
   on the way to something else, not something the actor could "go to lunch" on once it completes ⟶ name the
   REAL goal it actually serves as this phase's own DELIVERABLE field below, and flag the mismatch rather than
   silently drafting rules against the mislabeled purpose** — the subfunction is re-classified under its real
   goal, never deleted, mirroring the Type A row's own re-classification instruction. **WHEN the artifact being
   authored is NOT goal-shaped** (a mechanical edit, a syntax fix, a reference repair, a rule addition to an
   existing operational list) **⟶ this step is satisfied by stating "N/A — artifact is not goal-shaped"
   plainly.**
3. **NEVER decide WHERE something goes.** agent:grimorio.system-keeper hands you the level already chosen
   (shell / behavior file / general / project / code) and the target file. Apply
   ref:skill/grimorio.agent-writing#how-to-decide-where-something-goes's own placement ladder to VERIFY — never
   choose — that the handed level matches what you are actually about to write. **WHEN the level looks wrong
   ⟶ say so in this phase's own DELIVERABLE below — you do not silently relocate it, and you do not silently
   proceed on it either.**
4. **ALWAYS choose FORM before wording: does this rule need a LITERAL reading (algorithm — numbered steps,
   explicit IF-THEN) or LATITUDE (prose)?** ->
   ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated
   → "FORM IS THE LATITUDE INSTRUCTION". Name which you chose and why in this phase's own DELIVERABLE — Phase 3
   writes every rule to this decision, it does not re-decide FORM per rule.
5. **WHEN the design being authored is a genuinely NEW agent (a brand-new multi-phase state machine, not an
   edit to one that already exists) AND you do not yet fully grasp how it reaches its objective ⟶ do NOT
   proceed to Phase 3 — produce the REVIEWABLE PLAN artifact instead (the new agent's own quasi-software-view
   sketch: its phases, its nodes, its expected outputs, at the same fidelity as
   ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-quasi-software-view.md#the-five-layers-at-a-glance-and-where-each-is-drawn's
   own worked precedent)
   and hand it back to agent:grimorio.system-keeper for review BEFORE writing a single executable rule.** State
   this as TWO SEPARATE STEPS, never collapsed into one: (a) the reviewable plan of HOW the new agent works and
   reaches its objective, THEN, only once reviewed, (b) the actual prompt/loop rule-text. **WHEN this rule
   fires ⟶ this phase's own Hard hand-off below is superseded — go directly to
   ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-6-report-close.md, carrying the plan artifact as the
   report, NEVER to Phase 3.** Grounded in three real sources, cited by name, never re-derived: **Architecture
   Decision Records** (Michael Nygard, "Documenting Architecture Decisions," 2011; https://adr.github.io/) — a
   short, reviewable document recording an architectural decision, its context, and its consequences
   before/alongside implementation; **design docs at Google**
   (https://www.industrialempathy.com/posts/design-docs-at-google/) — an approved, peer-reviewed design
   document required before major work starts, a design-level review that happens before line-by-line code
   review even exists to do; the **IETF RFC process** (RFC 2026, "The Internet Standards Process";
   https://www.rfc-editor.org/rfc/rfc2026.html) — propose, circulate for comment, revise, THEN
   implement/standardize. **ALWAYS state plainly in this phase's own DELIVERABLE whether this pass's own task
   triggered this rule or not** —
   "N/A — not authoring a new agent this pass" is a legitimate, common answer.
5b. **WHEN step 5 fires and you are producing the REVIEWABLE PLAN artifact ⟶ ALWAYS apply
   ref:skill/grimorio.prompt-writing-quality#never-judge-by-appearance--demand-evidence-deduce-omissions-the-anti-plausibility-method
   explicitly, not merely by citation.** The plan's own phases, nodes, and expected outputs — already required by
   step 5 above — must themselves BE the durable evidence of what was considered: name what the design covers
   AND what it does not, against the complete scope, so agent:grimorio.system-keeper reviewing it can DEDUCE an
   omission from a gap, rather than approving the plan because it merely "looks" complete. A rule sitting only
   inside an imported skill, with no action named inside this task's own Steps, does not reliably fire —
   ref:skill/grimorio.prompt-writing-quality#an-opener-is-necessary-but-not-sufficient--a-rule-must-also-name-an-action-owed-inside-the-task-main-loop--grimoriosystem-keeper-2026-08-11
   is exactly why this is stated here, as its own step, rather than left for step 5's own citations to carry
   alone.
6. **ALWAYS state explicitly, in this phase's own DELIVERABLE, whether the SYSTEMIC process/machinery change
   you are being asked to author into another agent's doctrine this pass ALSO applies to your own phase chain —
   mirroring, never deciding, agent:grimorio.system-keeper's own SUBJECT-ZERO rule for the keeper's own
   doctrine** (ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md's own step 8). **NEVER decide
   to apply the flagged asymmetry to yourself — only agent:grimorio.system-keeper decides WHERE something
   goes, per this phase's own step 3 boundary, unchanged; this step is a FLAG, not an action**, exactly as this
   agent's own MECHANICAL-VOLUME finding (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-1-search-first.md's
   own step 6) is already a flagged recommendation, never a decision or action taken directly. "N/A — this
   pass's own change does not touch process/machinery doctrine" or "N/A — already applied to my own chain in
   this same dispatch" are both legitimate answers.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — specifically its objective/exit-condition contract,
  ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION + DECOMPOSITION (TANGLED SPECS ONLY) + GOAL-LEVEL CHECK (GOAL-SHAPED ONLY) fields below (a genuinely
  tangled spec left with a blank or missing decomposition, or an atomic one missing its own explicit "N/A"
  statement, is a D8 FAIL; a goal-shaped artifact left with a blank GOAL-LEVEL CHECK field, or an answer that
  fails Cockburn's test without naming the real goal it actually serves, is a D8 FAIL too — a non-goal-shaped
  artifact's explicit "N/A — artifact is not goal-shaped" satisfies it on its own). **This bullet is the ONLY
  place the GOAL-LEVEL CHECK D8 gate actually fires from** — step 2c's own `ref:` load below is conditional
  and therefore invisible to the checker's own import-only extraction loop, per
  cite:repo/scripts/check-phase-fingerprint.mjs@cfd53d22373af768cc886d06a39f52cb3ba117de, which only scans a
  bullet whose FIRST LINE matches `import:(skill|repo)/`; routing the field's enforcement here, onto this
  bullet's real `import:`, is what makes it actually gated.
- ref:skill/grimorio.agent-writing#how-to-decide-where-something-goes — the five-question placement ladder, this
  phase's own verification instrument.
- ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated —
  the algorithm-vs-prose decision.
- ref:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types —
  Cockburn's own user-goal ("go to lunch") test, this phase's own step 2c load. Loaded ONLY WHEN the artifact
  being authored is itself goal-shaped — never for a mechanical, non-goal-shaped edit. **NEVER attach a
  FINGERPRINT annotation to this bullet** — it is a `ref:`, never an `import:`, and
  cite:repo/scripts/check-phase-fingerprint.mjs@cfd53d22373af768cc886d06a39f52cb3ba117de never scans a bullet
  whose first line isn't `import:(skill|repo)/`, so a FINGERPRINT written here would sit dead. The GOAL-LEVEL
  CHECK field's real D8 gate lives on the `import:skill/grimorio.reasoning-principles` bullet above instead —
  go there, not here.
- **NEVER load rule-syntax specifics (the four openers, the extension vocabulary, the tier scale), file-
  structure specifics, or content-guardrail specifics here** — each is a later phase's own question, and
  pulling any of them in now front-loads a decision this phase does not make.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
OBJECTIVE:              <verbatim from agent:grimorio.system-keeper's own brief, never invented>
EXIT CONDITION:          <the checkable state that means the objective holds — a blank or copy-pasted-spec
                         value here is a D8 FAIL>
LEVEL HANDED:            <shell / behavior file / general / project / code, as given>
LEVEL VERIFIED:          <Y — matches the placement ladder / N — flagged mismatch, state it here,
                         never silently relocate and never silently proceed>
DECOMPOSITION (TANGLED SPECS ONLY): <PARTS / DISSOLVED / CONFLICTS / PROVING-ORDER / OPEN, per
                         reasoning-principles' own decompose-first discipline, WHEN the new step above fired
                         — or "N/A — spec is a single atomic ask" otherwise — a blank field here, on either
                         path, is a D8 FAIL, never a pass>
FORM CHOSEN:             <algorithm or prose, per rule and per section if it differs> + WHY
EXPECTED-RESULT ARTIFACT: <per step 2b — the concrete worked example of correct output named for this
                         artifact, or a pointer to it if it is long>
GOAL-LEVEL CHECK (GOAL-SHAPED ONLY): <per step 2c — WHEN goal-shaped: "PASSES" (genuine user goal, Cockburn's
                         lunch test) or the mismatch named plus the REAL goal it actually serves — WHEN not
                         goal-shaped: "N/A — artifact is not goal-shaped">
PLAN-BEFORE-IMPLEMENTING: <per step 5 (and step 5b's anti-plausibility duty WHEN it fires) — "N/A — not
                         authoring a new agent this pass" / "N/A — design already fully grasped" /
                         "FIRED — reviewable plan artifact produced below, Phase 3 not entered this pass,
                         evidence-of-consideration applied per step 5b">
SELF-AWARE FLAG:         <per step 6 — "N/A — this pass's own change does not touch process/machinery
                         doctrine" / "N/A — already applied to my own chain in this same dispatch" /
                         the asymmetry named, for grimorio.system-keeper to act on>
CORE RULE 2 CHECK:       <REFUSED here, naming why — or "level verified (or mismatch flagged), proceeding">
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, in EITHER direction below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md`) and this phase's own
filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — both routes below now
run on that gate's own PASS, never on the block merely existing in context.**

**WHEN step 5's PLAN-BEFORE-IMPLEMENTING did NOT fire ⟶ ALWAYS read
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-3-rule-syntax.md next, carrying forward: the objective and
exit condition, the verified level (or the flagged mismatch), and the FORM decision.** Phase 3 writes to this
plan — it does not re-derive any of it. **WHEN step 5's PLAN-BEFORE-IMPLEMENTING DID fire ⟶ read
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-6-report-close.md instead, carrying the reviewable plan
artifact as the report** — this chain ends here for this pass, exactly as step 5 above already states, never
proceeding to Phase 3 on a design that was not yet reviewed.
