---
name: grimorio.reasoning-principles
description: "The CEO's own method for WORKING and for THINKING, binding on everyone who reasons or claims here. STATE YOUR OBJECTIVE AND EXIT CONDITION, THEN CLOSE VERIFIED OR COULD NOT comes first — every task states what was asked and what done means before starting, and closes VERIFIED or COULD NOT, never a self-graded status. DECOMPOSE BEFORE YOU SOLVE and THEN SOLVE IN ORDER open the arc — split the problem, ask who fixed each constraint, prove each piece before the next. MEASURING IS NOT BUILDING and BUILD THE NOUN HE NAMED bound the acting between them. MAKE IT WORK is the separate debugging loop — state a claim, test it, and when it fails ask why the expected thing did not happen rather than what else to try. MEASURING IS NOT PROVING and A COUNT NEEDS ITS POPULATION close it — a check needs a falsifiable hypothesis, a number needs its population, and a mechanism is proven only inside the domain it was tested in. Load before deciding an approach, before debugging anything, before defending a constraint, before writing any check or gate, and before reporting a measurement as evidence."
---

# Reasoning Principles

**ALWAYS read all seven sections in order before acting on any of them.** They compose in one line:
stating the objective and exit condition before you start is what makes "done" checkable at all;
decomposition tells you whether the problem is real; the build order and the two bounds keep the building
honest; falsifiability and population tell you whether your answer is. Skipping the first produces a close
nobody can verify, because nothing said in advance what closing meant. Skipping the second produces hours of
work on a problem nobody had. Skipping a bound produces work that clears every check at the wrong grain.
Skipping the last produces a green that gets believed.

**This binds every party that reasons or claims here** — the main loop, the adviser, the architects, QA,
the reviewers, the security auditor, the experimenter, and any delegate that reports a finding.

---

## STATE YOUR OBJECTIVE AND EXIT CONDITION, THEN CLOSE VERIFIED OR COULD NOT (HARD RULE, CEO, 2026-08-11)

**STATUS: re-tested 2026-08-11 — proven only inside `agent:grimorio.scout`'s narrow closed-spec domain, when
the CALLER restates the requirement as explicit NUMBERED STEPS in its own invocation prompt; treat any other
agent, or any task with a real decision surface, as untested.** The measurement: a freshly-written
objective/exit-condition form, placed directly in the reader's own protocol steps, fired zero of two times.

**WHEN a caller is spawning `agent:grimorio.scout` on a narrow, closed-spec task and needs THIS rule (the objective/exit-condition pre-statement, and the VERIFIED/COULD NOT close) to reliably fire ⟶ restate the requirement as explicit NUMBERED STEPS in that child's own invocation prompt — never rely on the child's own behavior file to produce it unprompted. This is the ONLY domain the mechanism is proven in.**

**WHEN the caller is spawning any OTHER agent, or any task with a real decision surface ⟶ the same move is an UNTESTED HYPOTHESIS to try, never a proven fix — if it does not fire there, that is new information to record, not a rule violation.**
-> ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10 for the general mechanism
this instantiates.

**ALWAYS, before starting work on any task, state two things as part of your own reasoning — never as a
question back to your caller:**

1. **THE OBJECTIVE** — what was actually asked, taken from the brief you were given, never invented.
2. **THE EXIT CONDITION** — the checkable state that means the objective holds.

**NEVER interrogate your caller over this.** Derive both from whatever the brief already gives you. A
builder, a QA agent, a grunt never stops to ask its parent "what is my objective" or "what counts as done"
— it works this out from what it already has and proceeds. This is the one general habit every agent
applies to itself; refuting a handed-down diagnosis or conclusion is agent:grimorio.system-keeper's own
special character (its Core Rule 5), never a general licence to interrogate a caller.

**WHEN the brief states no explicit objective ⟶ derive the narrowest faithful objective from the task
actually described, state that you derived it, and proceed — never block on it.** Same method as the
declared-default-on-silence pattern every flow-brief already carries.
-> ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate (item 4).

**ALWAYS close in exactly one of two shapes:**

- **VERIFIED** — the objective holds. State the evidence and the state reached.
- **COULD NOT** — name what blocked it, what is left for the next iteration, and escalate the failure.

**WHEN the agent is an ADVERSARIAL/GATE agent (a critic, reviewer, QA, security auditor, agent:grimorio.entropy) ⟶ its existing signed verdict (APPROVED/REWORK/ESCALATE, or its domain equivalent) already IS its exit condition — do not additionally force VERIFIED/COULD NOT on top of it.** Same boundary as flow-delegation's existing carve-out, not a new one. -> ref:skill/grimorio.flow-delegation#when-flow-mode-applies.

**This is not flow-delegation's numbered completion checks, and does not replace them.** Those are the
CALLER'S, externally-verified, binding one delegate's full flow-brief
(ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate, item 3). THIS is the
AGENT'S OWN, universal, self-declared habit, owed on every task regardless of whether a flow-brief exists —
additive to flow-delegation's checks when both apply, never a substitute for them. It is also not
self-only correction (Huang et al., ICLR 2024, cited in ref:skill/grimorio.flow-delegation) in disguise: it stays subject to
whatever gate, reviewer, or guardian the task already has — it makes the claim explicit and checkable, it
does not replace checking it.

### A RULE IS NOT VERIFIED BY READING IT — the artifact class that needs an OBSERVATION (HARD RULE, CEO, 2026-08-12)

His own words, translated: *"That's supposed to be the keeper's job. Its job, and as a HARD RULE, is that it
cannot tell you it FINISHED something without having TESTED it. And you can't report it either — the keeper
telling you it's implemented but not tested. You can't go around blithely saying 'I already changed it' without
telling me you didn't finish it."* (CEO)

**ALWAYS verify an artifact whose PURPOSE is to CHANGE BEHAVIOUR — a rule, a prompt, a skill clause, an agent
instruction — by an OBSERVATION that it FIRED, never by reading it.** The text existing, a selftest passing, or
a reviewer's APPROVED verdict each prove the artifact is WRITTEN. None of the three prove it WORKS.

**WHEN that observation cannot be obtained in the same pass ⟶ close COULD NOT on that point, naming what would
obtain the observation — never VERIFIED with the testing silently deferred.**

This is NOT two things:

- **NOT a demand that every rule be behaviourally measured before it may land.** Most rules can only be observed
  when a real task happens to exercise them, and demanding proof up front would stop the corpus dead. What is
  demanded is that the DISTINCTION be reported — "written-and-unfired" is a legitimate state to ship, but it
  must be SAID, never folded into VERIFIED.
- **NOT a duplicate of MEASURING IS NOT PROVING** (the section later in this same file). That section governs
  the falsifiability of a check in general. This section is narrower: it names the one ARTIFACT CLASS whose
  verification instrument cannot be reading, and it binds specifically the CLOSE of a task under THIS section's
  own VERIFIED/COULD NOT contract — the section it lives inside.

This binds BOTH ends of the report chain, not only the agent that placed the artifact: the agent that closes
the task may not report VERIFIED on an unfired rule, AND the caller relaying that close may not report it as
done either — a claim of "written but unfired" does not become "done" by crossing one more hop.
-> ref:skill/grimorio.conduct/project.main-loop-only.md for the top-level session's own binding of this rule when
reporting to the CEO
-> ref:skill/grimorio.agent-writing/system-keeper-behavior.md for what grimorio.system-keeper owes on its own close when
it has just placed the rule

---

## DECOMPOSE BEFORE YOU SOLVE (HARD RULE, CEO, 2026-07-30)

**NEVER take a tangle and start solving it.** Split it into sub-problems each statable in ONE sentence
without reference to the others, and ask of each **"is this a REAL problem?"** — not "how do I solve
it". Most dissolve.

**The failure it closes is treating as FIXED what nobody fixed** — asking *"how do I achieve the
objective while keeping everything else intact?"* silently promotes every existing line of code, every
prior decision, and every constraint you invented yourself into an inviolable.

**The order, in his words:** *"desglosar todas las partes. Esto coincide bien con esta parte, pero choca
con estas otras. ¿Puedo modificar estas otras manteniendo el objetivo global? ¿Afecta partes críticas?
Entonces pregunto."*

1. **ALWAYS split it into parts** — each statable in one sentence without the others.
2. **ALWAYS name which parts CONFLICT** with the objective, rather than assuming the objective must bend around them.
3. **BEFORE deciding anything ⟶ for each conflicting part, ask WHO fixed it and WHY.** Three answers, three actions:
   - **Nobody did — it is mine, or it is just how the code happens to be** ⟶ change it. Code is not inviolable.
   - **He did** ⟶ it can still change; *"aún si fuera mi visión, deberías poder cuestionarme"*. Raise the contradiction as a QUESTION. He votes.
   - **A measurement did** ⟶ re-check the measurement before obeying it. Several "facts" that fixed decisions were greps matching comments.
4. **BEFORE deciding what changes ⟶ search for at least one concrete EXEMPLAR of a problem shaped like this one
   already solved, repo precedent first — a VETTED instance only, never a self-produced one** — a sourced claim
   inside a decomposition never checks whether the decomposition's own SHAPE has been checked against a real
   precedent, which is a different question than whether its claims are true. **WHEN none can be found ⟶ say so
   explicitly, beside the decomposition, rather than silently proceeding on reasoning alone.** Full doctrine, the
   citation-vs-exemplar distinction, the origin test, and the bound against turning this into a research phase:
   ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md.
5. **Only then decide** what changes, what you ask about, and what genuinely cannot move.

**WHEN you find yourself working hard to PRESERVE something ⟶ go back to step 3.** Effort spent
defending a constraint is the tell that you skipped this, never a reason to try harder.

**NEVER encode a disagreement as a constraint in code.** If you think his direction is wrong, SAY SO as
an objection — he has explicitly invited that (this project's own product-decisions record decision 36). A private
disagreement that reaches the codebase as a guard, a cap or a check nobody asked for is the worst
available form of it: it looks like engineering and it cannot be argued with.

> **Presenting** a decomposition is a different craft with its own rules.
> -> ref:skill/grimorio.report-design → "BEFORE you present: DECOMPOSE".

### OUTPUT — what a decomposition looks like when you produce one

**ALWAYS write the decomposition down before acting on it**, in these five fields and no more. It is
short by construction: a decomposition you cannot fit on a screen has not been decomposed.

**NEVER let writing it become a phase.** It is minutes, from what you already know — the same bound
BUILD THE NOUN HE NAMED puts on its own check. **WHEN you find yourself researching in order to fill a
field ⟶ write what you have, put the gap in OPEN, and start building.** A decomposition used as a
reason to not build yet is the failure MEASURING IS NOT BUILDING names, wearing this section's costume.

1. **THE PARTS** — one line each, each statable without the others.
2. **DISSOLVED** — the parts that failed *"is this a REAL problem?"*, with the one-line reason. **WHEN
   nothing dissolved ⟶ say so**; a decomposition where every part survives usually means the split
   followed the existing code's shape rather than the problem's.
3. **CONFLICTS** — which surviving parts fight the objective, and per part WHO fixed the thing they
   fight: nobody / he / a measurement. That answer is the action, per step 3 above.
4. **PROVING ORDER** — which part is proven before which, and what proof each takes, so the gate between
   pieces exists before the pieces do. The next section is the rule this field serves.
5. **OPEN** — what you could not decide and what you assumed instead, so a reader can attack the
   assumption rather than the result; also carries step 4's own exemplar-search result — found (name it) or
   not-found (say so) — for BOTH outcomes, never only when the search ran over its own bound.

**WHEN you can spawn ⟶ this output is the INPUT to your loop graph, never a second artifact.** Fields 1
and 4 become the graph's nodes and edges; the graph then adds who executes each and at what tier.
-> import:skill/grimorio.fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08

**A worked one, real** — *"I cannot tell a fan-out from a sequence in the spawn log"*, 2026-08-09:

```
PARTS      1 do I know who invoked whom   2 do I know WHEN each spawn was dispatched
           3 can I tell parallel from sequential   4 does the hook link parent to child
DISSOLVED  3 — not a part. It is the consequence of 2: given a dispatch instant it falls out.
CONFLICTS  2 — the log wrote on PostToolUse, which is COMPLETION. Who fixed that? Nobody;
             it is how the hook was written. So it changes.
ORDER      2 first — without a dispatch instant, 1 and 4 are worthless. Proof: two agents
           spawned in ONE message must share a dispatch window.
OPEN       whether SubagentStart carries the parent. Assumed yes.
```

**BEFORE theorising ⟶ close the OPEN, because it can reshape the theory instead of breaking it.** It
did: the platform exposes no parent relation at all, but the PreToolUse event runs in the parent's
context — so dispatch time and caller identity turned out to be one move, not two.

**ALWAYS state the refutation condition before the number exists.** Here: *two agents from one message
landing more than ~2s apart would mean PreToolUse is not dispatch either.* Measured 1.96s — a pass by
40ms, reported as the uncomfortable margin it was, against the 100s it replaced.

**And a second theory did NOT survive, which is what makes this a worked example rather than a story:**
the hook's own `git` call was blamed for the residue. Timed at 197ms per run — two runs are a fifth of
the gap, and the rest is still unexplained. **WHEN your explanation covers a fraction of the effect ⟶
say which fraction.** The surviving output was a number nobody had: the same-message window is 2–3s,
from two pairs, which is too few to fix a threshold on and is recorded as too few.

**NEVER let the parts be the code's existing modules.** Above, the code's shape said "the hook, the
log, the audit script"; the problem's shape said "who, when, and does it link". Splitting along the
first is how a decomposition ends up with nothing dissolved and every part conflicting.

-> The machine you run once decomposition is done — the loop, the graph, the retry/FINDING exit, the
   probe: ref:skill/grimorio.loop-and-graph.

---

## THEN SOLVE IN ORDER (HARD RULE, CEO, 2026-08-09)

The section above ends at "decide what changes" and never said how to BUILD. His words, translated:
*"divide a problem, then solve part by part, building a theory and PROVING it works before the next
requirement. It's ordinary programming — I go from the most general, I split the problem like someone
writing dumb methods, you solve what you can until you've filled every necessary part, and you
integrate the solution."*

1. **ALWAYS start from the most GENERAL statement of the problem**, never from the first part you know how to build.
2. **ALWAYS split it into pieces small enough to be dumb** — a piece you must be clever to state is still a tangle.
3. **BEFORE moving to the next requirement ⟶ prove the current piece works.** The proof is the gate between pieces, never a phase at the end.
4. **ALWAYS integrate as the final act**, and treat the integration as its own piece with its own proof.

**NEVER carry an unproven piece forward.** Assume one is sound, build three on it, and the assumption
fails under a question that was free to ask at step 3.

**WHEN you are running unattended ⟶ build an adversarial pass into step 3.** What is missing from an
unattended run is not rules — it is that nothing REFUSES you at the moment a conclusion forms. A rule
you have already proven you can read and not apply does not close that.

---

## MEASURING IS NOT BUILDING — the bound on the two sections below (HARD RULE, CEO, 2026-07-30)

Falsifiability is a discipline for the claims you make. It is not a licence to measure instead of
building, and turning it into one is the most expensive failure recorded in this project.

- **A build instruction means BUILD.** Verify what the specific claim needs and no more. **WHEN you find
  yourself measuring a third thing before touching code ⟶ you have already failed this.** Measure on a
  real doubt, or on request.
- **BEFORE commissioning any gate ⟶ declare the bar**, in the principal's stated requirements, never the
  auditor's standard. An adversarial auditor will ALWAYS return another finding — that is a property of
  the process, not a signal about the code, and rounds without a declared bar cannot converge.
  **Two rework cycles, then decide** (ref:skill/grimorio.feature-workflow#rework-cycle).
- **ALWAYS triage a finding into real+blocking / real+debt / not-our-problem, by WHO PAYS.** The product pays
  ⟶ blocker. The abuser pays ⟶ not a blocker. Nobody pays ⟶ judge by whether it is reachable today.
  The auditor evaluates independently; the verdict belongs to the caller. **NEVER forward an unfiltered
  audit as a work list.**
- **A port must satisfy the requirement and NOT BE WORSE than what it replaces.** It does not have to be
  the first correct version of that layer. **NEVER call a pre-existing defect a port blocker** — it is
  tracked debt on trunk.
- **ALWAYS keep responsibilities orthogonal.** WHEN layer A must read layer B's SHAPE to do its job,
  that is the defect — never the accuracy with which it reads it.
- **Fixing the process takes priority ONLY when it BLOCKS the objective.** A process fix while delivery
  is stalled is the same avoidance as a measurement, in a more respectable costume.

---

## BUILD THE NOUN HE NAMED, NOT THE NEAREST PRIMITIVE (HARD RULE, CEO, 2026-08-06)

**NEVER answer a request for an entity or an exercise he named by reaching for the nearest primitive
your current code or process shape already has lying around.** He names a NOUN because the noun is the
thing he wants to exist. Building the nearest available shape instead — an argument, a flag, a
checklist — passes every check written at the level of the instance while the thing he asked for is
never built.

**BEFORE you commit to a parameter name, a table column or a checklist item ⟶ say the noun you are
building out loud and compare it to his.** A per-call cap threaded through a dispatch path is not a
budget. A checklist of ticked boxes is not a run that spends real money. **WHEN the two nouns differ ⟶
stop before you write the line.**

**This check is ONE SENTENCE at the moment of choosing what to write, never a phase.** It is not licence
to stop and research or re-architect: MEASURING IS NOT BUILDING still governs.

**WHEN the system-shaped noun is genuinely unclear or too large to build in the moment ⟶ build the
narrower thing anyway and raise the gap as an OBJECTION** — never a silent narrow-build, never a silent
stall.

---

## MEASURING IS NOT PROVING — a check needs a FALSIFIABLE hypothesis (HARD RULE, CEO, 2026-07-30)

*"El simple acto de medir no es una prueba en sí mismo… si nunca tienes una hipótesis falseable, las
mediciones que hagas solo van a repetir tu sesgo de confirmación."*

**BEFORE writing any check, or believing any measurement ⟶ state what result would prove the claim
FALSE.** WHEN no result can, the check is theatre with numbers attached, and it is worse than no check:
it produces a green that gets believed.

**The test:** *"in the case this is supposed to catch, what does it return?"* **WHEN the answer is the
same thing it returns when everything is fine ⟶ throw it away and write a different one.**

### The falsifiable forms

- **A test ⟶ MUTATE the code it guards and watch it go red.** Green-only is not evidence.
  (ref:skill/grimorio.qa-memory#the-break-proof--a-test-you-have-not-seen-fail-is-not-evidence)
- **A guard ⟶ plant the violation and watch it refuse.**
- **A verdict gate ⟶ read the VERDICT, not the artifact.** Grep the decision string and fail on
  `REWORK`/`FAIL`/`ESCALATE`. Presence of a report is not a passing report.
- **A parity claim ⟶ break one side and watch the other complain.** Two languages agreeing proves
  nothing until disagreement has been shown to be detectable.
- **A compliance/instruction-following clause ⟶ probe it with REAL in-domain work in both directions**
  (a task that genuinely needs the rule, and one that genuinely does not), **never a neutral,
  out-of-domain task.** Measured (2026-08-11, main loop / grimorio.system-keeper): re-running the
  IDENTICAL neutral, out-of-domain probe (a morning-routine question) reproduced the identical zero, with
  the agent explaining why unprompted both times ("this isn't a coding task" / "outside this project's
  context") — proving a neutral task measures whether the agent judges the corpus in-domain, not whether
  the clause itself fires. **This does not mean every prior zero was a domain artifact:** one clause,
  re-tested with genuine in-domain work whose natural execution did not already pull the clause's own
  footprint, still failed (0/2, then 0/1 after a real fix attempt) — a genuine non-firer, not a probe
  confound. A DIFFERENT clause, re-tested the same way, came back firing cleanly (2/2, both tiers) — its
  earlier zero HAD been a domain artifact. **An in-domain retest is what separates a genuine non-firing
  clause from a probe-design confound — never assume either outcome without running one.**

### A mechanism's effect is a FLOW, never a stock

**NEVER measure whether a mechanism changed anything by counting how many instances exist in the tree
today.** A count taken once is a STOCK. Only a RATE, taken before the mechanism shipped and after, is
evidence it did anything.

**WHEN a gate ships with an escape hatch ⟶ measure the hatch's uptake ALONGSIDE the violation rate and
compute the effect on the two TOGETHER.** A gate whose hatch absorbs what it used to block has not
reduced the behaviour, it has relabelled it, and a stock count reads that relabelling as a win.

**BEFORE computing a per-commit rate over git history ⟶ exclude merge commits.** Walking history WITH
merges double-counts every merged branch and re-dates it to the merge timestamp.

**NEVER let a flow measurement be read as an ATTRIBUTION measurement.** That a rate moved says nothing
about who produced it, and in this repo authorship by agent type is not reconstructable from the record.

### MAKE IT WORK — the claim / test / why-not loop (HARD RULE, CEO, 2026-08-10)

**This is NOT the decomposition method.** DECOMPOSE BEFORE YOU SOLVE splits a problem; this drives one
piece until it works. Do not merge them.

1. **ALWAYS state a CLAIM about the cause**, not a list of things to try.
2. **ALWAYS test it directly.**
3. **WHEN it did not do what you expected ⟶ ask why the expected thing did not happen.** **NEVER ask
   what else to try.** The answer to that question IS the next claim, and the loop restarts from 1.
4. **WHEN the thing fires but changes nothing ⟶ that is not "it does not work", it is a NEW claim to
   make:** why was it ignored. Chase that, never the strength of the wording.
5. **WHEN it is ignored twice ⟶ compare against the case you KNOW is not ignored, and name the
   difference.** That difference is the lever; a third variation of the same design is not.
6. **WHEN it finally holds ⟶ re-test under OTHER conditions before believing it.**
7. **ALWAYS finish by naming both scopes: the one it is proven in, and the one you do not know yet.**
   The second is remaining work, never failure — you advanced.

**A worked run, 2026-08-09, the CEO driving.** *Claim: I ignored the standard because the hook was
deleted.* Restored in principle — and it would not have helped: it checked whether a skill was LOADED,
not what was written. *Why did the expected thing not happen? Because it verified a flag.* → *Claim: it
must deliver the standard, not check a marker.* Built; it fired on every write; a file about how rules
bind was written with no rules in it. *It fired and changed nothing — so why was it ignored?* Because it
named a CATEGORY ("this is a prompt"), and a category does not intercept a sentence. *Difference against
the case never ignored — the CEO naming the defect of the file in front of me.* → *Claim: a demand to
COMPLY cannot be observed; a demand to PRODUCE can, and an assertion must be disproved by looking.* →
The hook now asserts the file probably breaks the standard. That one held.

### A corroborated mechanism is corroborated only INSIDE the domain you tested

**NEVER read "it worked" as "it works".** A mechanism that passes its test passes it in the domain the
test covered; the boundary nobody stated is where it fails next, and it fails silently, because a
mechanism that does not fire looks exactly like one with nothing to report.

**ALWAYS state the domain a mechanism was proven in, beside the proof.** **WHEN you cannot name the
domain ⟶ you have not finished testing it.**

**The worked case, 2026-08-09** — the run in the section above, one step further. The mechanism it
arrived at held under every condition it was tested in, and was refuted the same day at a boundary
nobody had stated: seven agent shells were rewritten through a script run from a shell, and not one
check fired, because every hook here watches `Write|Edit|MultiEdit`. **The mechanism was never wrong.
Its domain was never stated, and the first work to leave that domain left silently.**

### The abuse this closes

**Count of checks is NEVER a proxy for confidence** — the only proxy is whether each check has been seen
to fail for the right reason. And the harder half: **a measurement chosen AFTER the conclusion is
decoration**, which is why the refutation condition is stated before the number, never after it.

**WHEN you read a number you did not produce ⟶ ask what result would have refuted it.** A child's
measurement inherits none of your confidence because it arrived in a report; without a stated refutation
condition it is a claim, not evidence.

> Settling a design question by controlled EXPERIMENT is the full-scale version of this half.
> -> ref:skill/grimorio.experiment-method.

---

## A COUNT NEEDS ITS POPULATION — the affirmative half (HARD RULE, grimorio.system-keeper, 2026-08-08)

**Read this as the affirmative half of the section above, never as a third prohibition.** The other two
rules about measuring are BOUNDS: one says when not to measure, the other what a check may not claim.
Neither teaches the act, and a reader holding only bounds has exactly one legal move — measure more.

- **NEVER report a count without the population it ranges over.** A count is a number PLUS its
  population; report both or you have reported neither.
- **BEFORE counting anything a tool already consumes ⟶ open that tool and read its own scope
  definition.** The CONSUMER of a number fixes its population; the measurer never does. A count can be
  reproducible and falsifiable and still answer a different question, because falsifiability never asked
  WHICH population the refutation condition ranges over.
- **ALWAYS report the COMMAND that produced a number, beside the number.** The refutation condition of a
  count is "run this and get something else". A number without its command is a claim.
- **NEVER hand-maintain a derived count.** **WHEN a count will be read again ⟶ it is a SCRIPT, never a
  figure typed into prose.** **WHEN it is genuinely one-shot ⟶ label it with its date and command.** The
  artifact that gets reused is the command; a scope survives reuse, a number rots as the tree changes.
- **WHEN a question is not measurable yet ⟶ say so, name what would make it measurable, and proceed.**
  Neither measuring a proxy nor stalling on the real question is the answer.
- **BEFORE trusting your own probe ⟶ read this project's recorded ways of measuring wrong**, rather than
  re-deriving the catalogue: a grep matching comments instead of imports, `head -N` truncating the file,
  a regex taking only the first match, ANSI escapes corrupting a pass/fail scrape, `$?` reading a pipe's
  tail, a two-dot diff misread as branch-only changes, a regex whose backslash the shell ate before it
  ran, measuring a governance-file edit inside the SAME session that made it without forcing a re-read (a
  file read once at session start answers from the pre-edit snapshot, producing a false "the fix changed
  nothing"), reading a behavioral FOOTPRINT as a proxy for whether a skill LOADED instead of reading the
  mechanical load-record itself (a competent model produces part of a skill's footprint without ever
  having loaded it), and probing a notation construct in a form the corpus does not actually write (one
  probe tagged a real, openable path with `cold:` to test whether it is honoured, when every real `cold:`
  use in this corpus is a handle with no openable target — the resulting "cold: does not hold" measurement
  was retracted in full).
- **NEVER predict a number and hand the prediction to someone else as the expected result.** A predicted
  number in a brief is an anchor a weaker agent adopts instead of measuring — the same defect as a
  leading question put to an adversarial agent.
- **WHEN you assert that something does not exist anywhere ⟶ remember the hooks are a search surface.**
  Text a hook injects reaches its reader exactly as a skill's text does, and `scripts/audit-chain.mjs`
  walks only `.md`, so a `.cjs` under `.claude/hooks` is invisible to it by construction.
- **WHEN no consumer fixes the population ⟶ you are CHOOSING it: name the population you CLAIM about,
  name the one you MEASURED, and say why the second stands for the first.** WHEN you cannot say why, you
  have a measurement of something else.
