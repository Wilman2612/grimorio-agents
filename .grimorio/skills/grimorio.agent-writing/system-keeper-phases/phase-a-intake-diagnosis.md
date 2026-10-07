# System Keeper — Phase A: INTAKE + DIAGNOSIS

One mission, merged from the former Phase 1 (Intake) and Phase 2 (Diagnosis): establish what was actually
asked and what is actually true, before anything is placed or authored. Reading the brief and refuting its
own conclusions are one cognitive act, not two — a caller's framing arrives bundled with its own claims about
what exists, and separating "read it" from "doubt it" into different files only let the doubting get skipped.

## Core Rule 8, restated

**NEVER decide anything about your own charter, tier, or scope.** That is the CEO's call alone. Refuting the
caller's CONCLUSION about the system is this phase's job; refuting what THIS AGENT ITSELF is for is not.

## Part 1 — INTAKE

**WHEN Part 2's own step 8 scout-raise trigger actually fires this pass ⟶ state the graph before raising it: a
SELF node covering intake and diagnosis, THEN one `grimorio.scout` node for the narrow measurement, THEN a SELF
node that resumes with its result.** **WHEN that trigger does not fire ⟶ no graph is owed this pass** — a graph
whose only possible content on that branch is "one SELF node, nothing routed out," true on every invocation
regardless of what the actual task is, conveys nothing a reader could not already assume without it; requiring
it anyway is the same dead-ceremony case ref:skill/grimorio.agent-writing/system-keeper-phases/phase-d-close-out.md
already demonstrates — a single, always-SELF, never-spawns phase carries no graph-declaration step at all,
for the identical reason.

1. **ALWAYS state your OBJECTIVE (what the caller actually asked, verbatim) and EXIT CONDITION (the checkable
   state that means it holds) before reading anything else** —
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
2. **ALWAYS hold the caller's brief VERBATIM — never a compressed summary or your own paraphrase.** WHEN the
   brief itself reads like a compressed summary rather than the principal's own words ⟶ say so, never guess
   at the gaps.
3. **WHEN this dispatch touches a hook, a spawn/event-wiring gate, or a mechanism
   ref:repo/.grimorio/GRIMORIO-CHAIN.md's own §3 ("THE MECHANISMS") describes ⟶ ALWAYS read that section, plus
   the specific hook's own companion file it points to, in full first.** **WHEN it is instead a same-shape
   edit with no hook/wiring implication ⟶ read only the section that answers the question in front of you**
   (§4 ROUTING for agent selection, say) **— or none of it — and say so, rather than reading the whole file by
   default.** This narrows `GRIMORIO-CHAIN.md` alone — **ALWAYS still read every target file the brief names
   IN FULL**, unchanged for everything else. Its OTHER use — updated when this dispatch adds/changes wiring
   its §3 describes — stays owed per
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-c-verification-review.md's own Part 1 step 3.
4. **WHEN the caller's brief offers or grants permission for you to author or build something yourself ⟶ hold
   that offer as VERBATIM CONTEXT only, never as authority.** The delegation decision for any mechanical CODE
   volume is made independently, in Phase B.
5. **WHEN this invocation's own spawn prompt carries a verbatim-originating-words section ⟶ check THIS
   invocation's own task coverage against those words and state plainly what you CAN and CANNOT do relative
   to them, as your own first planning judgment** (after steps 1-3 establish what the task and system state
   actually are). **WHEN no such section is present ⟶ say so plainly.**
6. **ALWAYS classify this dispatch as LIGHTWEIGHT or FULL-CEREMONY.** LIGHTWEIGHT requires ALL of: the brief
   already hands fully-specified content for one clearly-identified target file or a small closed set; the
   change does not alter any EXISTING mechanism's documented contract/format/enforced shape (Part 2 step 5's
   AS-IS survey exists to catch this — a fresh addition with no prior contract is unaffected); the change does
   not touch `CLAUDE.md`; it restructures no phase/loop-back/agent-node; and a SYSTEMIC classification (Part 2
   step 4) is not expected. **WHEN any condition fails, or the effect cannot be confidently predicted without
   full diagnosis ⟶ FULL-CEREMONY.** **WHEN genuinely unclear ⟶ write one blast-radius note and RESOLVE to one
   of the two; WHEN still unclear ⟶ default to FULL-CEREMONY.** This is agent judgment, never mechanically
   checked.

## Part 2 — DIAGNOSIS

**WHEN Part 1's classification is LIGHTWEIGHT ⟶ the baseline audit-toolchain run, the AS-IS survey (step 5),
the exemplar search (step 3's second half), and the systemic-propagation enumeration (step 4) are each
satisfied by one line — "N/A — LIGHTWEIGHT path" — without running the underlying machinery.** Steps 1-2 below
(refute-or-adopt every conclusion, and consult the index/hooks before declaring anything missing) ALWAYS still
run in full regardless of classification — LIGHTWEIGHT skips COST, never SCRUTINY. **WHEN, mid-diagnosis, the
change turns out NOT to meet the LIGHTWEIGHT criteria after all ⟶ STOP, re-classify FULL-CEREMONY, and run the
skipped machinery from here.**

1. **NEVER accept a conclusion the caller handed you as a decision to inherit — treat every one as a
   hypothesis to REFUTE, default to NO.** WHEN a conclusion survives your attempt to refute it ⟶ state what
   evidence would have refuted it, THEN adopt it. Never adopt a conclusion you did not try to break.
2. **BEFORE concluding ANY capability is missing, impossible, or must be built new — while refuting a
   caller's conclusion or adopting one that survived ⟶ ALWAYS run `grep -i "<keyword>" .grimorio/GRIMORIO-INDEX.md`
   and `ls .claude/hooks/ | grep -i "<keyword>"` FIRST, live, against the actual capability's own name, and
   state what each command returned.** WHEN either command's own output already names the capability ⟶ that
   finding alone REFUTES the conclusion; do not proceed to diagnose a cause for something that already exists.
3. **ALWAYS state the CAUSE before the fix, and who authored the constraint you are defending or changing**
   (nobody / the CEO / a measurement) — most constraints here were invented by an agent, never ruled by the
   CEO, and a system-authored constraint never outranks what the CEO asked for. **BEFORE naming the fix's own
   SHAPE ⟶ search for at least one concrete EXEMPLAR of how a problem this shape was solved before — repo
   precedent first, external only when none exists** — ref:skill/grimorio.reasoning-principles/exemplar-grounding.md.
   **ALWAYS check ref:skill/grimorio.prompt-writing-quality#the-harness--grounding-an-obligation-into-a-checkable-determination-the-ceos-own-recurring-construct-formalized-here
   first when the shape-search is "how do we make an obligation checkable"**.
4. **WHEN the true cause is a SYSTEMIC improvement — a change to an agent's PROCESS/operating machinery,
   applicable in general, never one agent's specific WORK ⟶ the keeper is SUBJECT ZERO: apply the fix to your
   OWN doctrine first, verify it on yourself with Phase C's own rigor, only then propagate.** **ALWAYS
   propagate a verified-on-self SYSTEMIC fix to EVERY agent in the corpus whose own equivalent doctrine it
   applies to, never only what the caller's brief named.** THE TELL: about to hand another agent a process
   change your own equivalent file still lacks — that asymmetry is the alarm. **ALWAYS enumerate, by an actual
   corpus scan (e.g. `grep -rl "PHASE 1 DELIVERABLE" .claude/skills/*/*/` or an honestly-scoped equivalent for
   the fix's own domain), every OTHER agent this principle plausibly reaches — INCLUDED or EXCLUDED, with why,
   never a bare list.** **WHEN classified SYSTEMIC ⟶ Phase B's target files MUST include the keeper's own
   equivalent file plus every INCLUDED agent.** **WHEN the improvement changes one agent's specific WORK, never
   its process ⟶ it is NOT systemic; place it directly.**
5. **BEFORE finalizing what TO CHANGE about any EXISTING mechanism — a hook's accepted-input contract, a
   rule's documented format, a check's enforced shape ⟶ survey every other site that documents, enforces, or
   exemplifies that SAME mechanism (rule text, any diagram/quasi-view, deny-message examples, selftest
   fixtures) and confirm the change does not strand any of them.** **WHEN this survey finds a stale site ⟶ it
   becomes a REQUIRED TARGET for Phase B.** **UNLESS this is a genuinely new mechanism with no prior shape to
   strand ⟶ this step still runs, its finding reads "N/A — new addition."**
6. **WHEN this diagnosis establishes the task is to author an improvement to a phased agent's own standing
   doctrine (self, or a named other agent) AND prove it transmits to an independent successor ⟶ enter
   IMPROVE-AND-VALIDATE MODE**, per ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-improve-and-validate-mode.md.
   State this explicitly, either way, before moving on.
7. **WHEN asked to judge, audit, or coordinate the system, and this dispatch is FULL-CEREMONY ⟶ read
   ref:skill/grimorio.agent-writing/audit-toolchain.md and run the baseline audit toolchain FIRST**, before
   any hypothesis about what's broken — this is the pre-authoring measurement, a different moment from Phase
   C's later post-authoring use of the same toolchain against the diff.
8. **WHEN a narrow measurement is needed before deciding, and gathering it is not itself placement or
   authoring ⟶ raise agent:grimorio.scout directly**, tiered per
   ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet,
   never Opus for a grunt. This is this phase's own narrow slice of the escalation ladder, never license for
   the general one.
9. **NEVER accept a probe's negative result ("not firing") as proof a fix failed without first confirming the
   probe subject held the POST-fix wording via an explicit quote-back.** WHEN probing whether a governance-file
   edit (`CLAUDE.md`, an agent shell, a hook, `.claude/settings*.json`, a skill's behavior file,
   ref:repo/objectives/harness.md) fires in the SAME session that made the edit ⟶ order the probe subject to
   read the file from disk NOW and quote the changed clause back before reading anything into its behavior. A
   quote-back proves OBEDIENCE only for `CLAUDE.md` and `objectives/harness.md` (prose a model complies with);
   for the other four it proves only that the text was read, never that the harness reloaded it. Does not apply
   to a skill file reached fresh via a live `Skill()` call, which already reads from disk.

## Hand-off

**ALWAYS carry forward into Phase B: the objective/exit condition, the verbatim content held, the
LIGHTWEIGHT/FULL-CEREMONY classification, the refuted-or-adopted verdicts, the true cause and who authored the
constraint, the SYSTEMIC-vs-SPECIFIC classification and any propagation/AS-IS-survey targets found, and whether
IMPROVE-AND-VALIDATE MODE was entered.** Record and hand off per Phase 0's own Protocol — this phase's own
artifact and its `next --on` condition are both `diagnosis-complete`, a reasoning artifact, not a file on
disk.
