# Phase Splitting — Reference: LOOP-OWNER TURN DISCIPLINE, the standing turn-boundary any task-owner executes under

## Who this binds — bucket 2 of a split CLAUDE.md-level correction

**This file binds any agent that OWNS a task or a loop across its own multi-phase chain and may spawn
children or run long commands to get there — the LOOP-OWNER.** It never binds the CALLER that raised that
loop-owner in the first place: watching a child, redirecting it against a saved objective, and rescuing a
parked one are a DIFFERENT agent's job, covered in full at ref:skill/grimorio.fan-out#part-2--stay-reachable-report-back-without-parking
and ref:skill/grimorio.flow-delegation#part-2--the-guardian-protocol-how-you-watch-and-redirect — unchanged by
this file, never restated here.

This is deliberately the OTHER HALF of a split `CLAUDE.md`-level correction. Bucket 1 — raise a child, then
guard it without parking your own turn on it — stays exactly where it already lives, in `grimorio.fan-out` and
`grimorio.flow-delegation`'s own guardian protocol. **This file is bucket 2: own your own task until it
closes, as the loop-owner itself, never as the party watching one.** The two buckets are companions, not
duplicates — a chain can, and often does, act as the guardian of a child in one moment and the loop-owner of
its own dispatch in the next; each role's own discipline lives at its own home, cited from the other, never
copied into it.

## Extraction and reference-depth

Extracted as its own companion file inside ref:skill/grimorio.phase-splitting, general level, per this skill's
own reference-depth discipline
(ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files)
— the same move `./correction-mode.md` and `./fingerprint-gate.md` already made for their own
extracted decisions. The GENERIC substance below already existed, fully worked, as
`grimorio.flow-delegation`'s own delegate-phases Core Rule 1 ("never park your turn") and Core Rule 2
("foreground stays your safe default") — proven on one loop-owner, `grimorio.delegate`. This file is that
same substance, generalized so a SECOND loop-owner, `grimorio.system-keeper`, can execute under it too,
without either chain duplicating the other's prose. -> ref:skill/grimorio.flow-delegation/delegate-phases/phase-3-execute.md
for the worked instance this file was extracted from.

## Rule 1 — NEVER end your turn believing a blocker will be resolved for you while you wait

**NEVER end your own turn believing a blocker will be resolved for you while you wait.** **WHEN you hit a
question, a blocker, or a finding your caller must see NOW, AND you have a channel to your caller (a notes
folder your caller is watching, per fan-out's own Part 2 above) ⟶ write it there, state the DEFAULT you will
take if nobody answers, and KEEP WORKING on everything that does not depend on the answer.** **WHEN you have no
such channel (no notes folder was set up for you) ⟶ state the blocker LOUDLY inside your own phase's own
deliverable/output instead of silently stopping, and still keep working on what you can.** Waiting is never a
state you end a turn in.

## Rule 2 — the mechanical fact this rests on: nothing can wake a parked subagent by itself

**The mechanical fact Rule 1 rests on, stated plainly so it is never assumed away:** a subagent has no socket
of its own that a background result can wake — `CLAUDE_CODE_MESSAGING_SOCKET` is absent on this deployment
(ref:repo/.grimorio/GRIMORIO-CHAIN.md#3d-environment-dependencies--what-grimorio-requires-from-claude-code-itself).
Ending your OWN turn to "wait for the monitor's notification," or any other background result, does not pause
your run — it ENDS it. The only possible rescue is the TOP-LEVEL SESSION's own ARMED watch
(`scripts/parked-watch.mjs`, per ref:skill/grimorio.conduct#spawning-an-agent rule 8) noticing you went silent
and re-messaging you — something you cannot invoke, arm, or rely on for yourself, and which may not be armed
at all. **WHEN you must wait on something before continuing ⟶ apply
ref:skill/grimorio.conduct#spawning-an-agent rules 9b-9c's own foreground techniques instead: run it in the
foreground, or poll it with a BOUNDED foreground loop — never end your turn on it.** This closes the exact
failure measured twice, live, in `grimorio.system-keeper`'s own dispatches: a run that said "I'll pause here
and wait for the monitor's notification" and ended for good, and a second that said "I'll pause here rather
than poll further" — both had done correct work up to that point; both simply stopped, and neither was resumed
by anything they themselves did.

## Rule 3 — foreground is your safe default; backgrounding your own children is a considered trade, never a silent one

**ALWAYS treat foreground as your safe default for your own long work** — finish your own turn's work inside
it and wait on children you spawn synchronously by default. **WHEN real parallelism is worth the parking risk
⟶ you MAY background your own children instead** (ref:skill/grimorio.conduct#spawning-an-agent rule 8), naming
that choice explicitly in your own report. This never licenses ending YOUR OWN turn on a dependency you
yourself are waiting on — that case is Rule 2 above, not this one.

## Rule 4 — drive through a blocker; never stop-and-report at the first obstacle

**NEVER stop-and-report at the first obstacle.** You own your task until it closes. A blocker is something to
route around, default past, or escalate loudly WHILE continuing on everything else — never a reason to hand
the whole task back half-finished because one piece of it got hard.

## Rule 5 — close VERIFIED or COULD NOT (never restated here)

**ALWAYS close VERIFIED, naming the evidence, or COULD NOT, naming what blocked it and what is left** — this
is already every grimorio agent's own standing obligation regardless of this file:
ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
This file adds nothing to that contract; it only makes sure a loop-owner actually REACHES that close instead
of parking somewhere short of it.

## The named exclusion — this file NEVER states or implies a worktree-timing rule

**NEVER read this file as stating, or implying, any rule about WHEN to open a worktree.** The CEO's own words,
when this file's scope was set — Spanish governs, translation given for reading only: *"Ajá... excepto por el
worktree"* ("Right... except for the worktree") — name the worktree as the one deliberate exception that must
NOT generalize into this shared file. **WHEN a governed file is among your own targets ⟶ whether and when to
open a worktree is decided entirely by YOUR OWN agent's own existing doctrine**, never by this file — e.g.
`grimorio.system-keeper`'s own "Worktree isolation is for SELF-MODIFICATION"
(ref:skill/grimorio.agent-writing/system-keeper-phases/phase-b-placement-authoring.md)
or `grimorio.delegate`'s own Phase 1 worktree hard-stop
(ref:skill/grimorio.flow-delegation/delegate-phases/phase-1-intake-and-objective.md#steps, its own step 4) —
conditional on each agent's own six-governed-class or isolation situation, never a general rule this shared
file could state, because generalizing it would make every loop-owner open a worktree for a one-line change.

## How a loop-owner reaches this file

**ALWAYS `import:` this file once, at your own Phase 0 / chain entry point, as a MANDATORY load for the WHOLE
dispatch — never scoped to one phase.** **WHEN a phase actually spawns a child or runs a long-running command
⟶ ALWAYS ALSO carry a SHORT one-line restatement in that phase's own file, pointing back to this file as the
PRIMARY HOME** — the SAME shape this corpus's own `grimorio.system-keeper` chain already uses for its own Core
Rule 8 ("the one boundary every phase restates, root instance here" at Phase 0, then "Core Rule 8, restated —
the standing boundary, every phase" verbatim at every subsequent phase). **NEVER re-derive or re-state this
file's own content in full at the restatement point** — point back to it, exactly as Core Rule 8's own
restatement pattern already does for its own root, never invent a new shape for the same job.
