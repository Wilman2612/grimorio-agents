# Delegate — Phase 3: EXECUTE

**NEVER read ref:skill/grimorio.flow-delegation/delegate-phases/phase-4-gate-and-verify.md until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.**

## The question this phase answers

Is the actual work done — every item Phase 2's own plan named, either by you directly or by a child you spawned
and converged with? Distinct from Phase 2's planning question and from Phase 4's verification question: this
phase ACTS, it does not decide what to do or check whether it held.

## Core Rule 1 — NEVER park your turn (full statement; primary home)

**NEVER park your turn.** If you hit a question, a blocker, or a finding the caller must see NOW, write it to
your notes folder, **state the default you will take if nobody answers**, and KEEP WORKING on everything that
does not depend on the answer. Waiting is not a state you are allowed to end a turn in. This is the SAME rule
threaded, briefly, through Phase 1 (a blocker while reading your brief) and Phase 2 (a blocker while planning)
— this is its full statement and its primary home, because a blocker is most likely to surface here, mid-work.

## Core Rule 2 — foreground stays your safe default (full statement; primary home)

**Foreground stays your SAFE DEFAULT — finish long work inside your own turn and wait on your children
synchronously.** **WHEN real parallelism is worth the parking risk ⟶ you MAY background your own children
instead** (ref:skill/grimorio.conduct#spawning-an-agent rule 8) — a parked child is rescued by the TOP-LEVEL
SESSION's dispatch/completion watch, never by you waking yourself, but ONLY if the top-level session has armed
that watch this session (ref:skill/grimorio.conduct/project.main-loop-only.md) — you are trusting a standing
obligation on your caller's caller, not a guarantee that always holds, so say in your own report which choice
you made. -> the full mechanism and the optional faster child-self-report path:
ref:skill/grimorio.flow-delegation/project.nested-background-trade.md.

## LOOP + RELATIONSHIPS threaded here — to your CHILDREN, spawn-and-converge (dimension b)

Phase 2 declared the fan-out graph; this phase is where any node NOT already dispatched as mechanical volume
actually spawns. `grimorio.delegate` is NOT hard-locked non-recursive — it may spawn any agent type other than
itself — so this relationship is real here, not assertion.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: SELF, converging with every independent
   child node Phase 2's own fan-out graph named for THIS phase (never mechanical-volume children, already
   dispatched and converged in Phase 2).**
2. **ALWAYS spawn your OWN independent children foreground, in ONE message, and converge in the same turn.**
   The "only the main loop raises several delegates in parallel" rule in your own shell restricts OTHER callers
   raising delegates, never how you spawn your own children.
3. Do the work per Core Rules 1-2 above: NEVER park your turn — write any question or blocker to your notes
   folder, state the default you will take, and keep working on everything that does not depend on the answer;
   foreground stays your safe default, with backgrounding your own children a considered trade per Core Rule 2,
   never a silent default.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.code-harness — before you inspect **or** modify code, do the upward `harness.md` lookup
  and obey what you find. Inspection counts; the hook only fires on writes.
- import:skill/grimorio.working-memory — the `tmp/` staging convention. Note the standing rule: `tmp/` is
  scratch and is NOT a citable source of record. If something you produce must survive, it goes to a
  repo-tracked file.
- ref:skill/grimorio.fan-out#part-2--stay-reachable-report-back-without-parking — your operating plumbing: your
  id, your workspace (`tmp/<your-id>/`), the notes-folder protocol that lets you raise a question without
  stopping, carried forward from Phase 2's own load of this skill.
- **NEVER load `report-design`, `objective-harness`'s close mechanics, or `reasoning-principles`'s
  VERIFIED/COULD-NOT contract here** — each is Phase 4 or Phase 5's own question.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
CHILDREN SPAWNED THIS PHASE: <one line per node: agent type -> foreground/background (with the Core Rule 2
                             trade named if backgrounded) -> converged Y/N — "None — every item this task
                             needed was worked directly" is a legitimate entry>
BLOCKERS RAISED:            <any question/blocker written to your notes folder this phase, the default you
                             stated, and what you kept working on — "None" if nothing fired>
WORK DONE:                  <what was actually produced/changed this phase, per the plan Phase 2 handed you —
                             never a claim that a check "should" pass; that is Phase 4's own question>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.flow-delegation/delegate-phases/phase-4-gate-and-verify.md next, carrying
forward: what was actually done this phase, by you or by any converged child.** Phase 4 verifies this work — it
does not re-derive or re-perform it.
