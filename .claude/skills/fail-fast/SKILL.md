---
name: fail-fast
description: "The BUILD-FAST / FAIL-FAST doctrine, institutionalized: explicit permission to FAIL, and the matching DUTY to declare failures plainly. Prefer a fast, visible artifact that EXPOSES what's broken over a slow, polished one that hides it. Load before deciding how to deliver anything — a build, an experiment, a design, a report."
---

**The model (CEO ruling, SpaceX-style): BUILD FAST → FAIL FAST → improve on the next iteration.** We iterate on real artifacts you can look at and break, not on documents that describe an intention. A design doc nobody can run is not progress; a rough thing that reveals a defect is.

## Permission to fail — institutionalized

- **A failed iteration that is DECLARED is a success of the process.** There is no penalty for it. Budget, time and tokens spent on an attempt that revealed a defect were spent correctly.
- **The only real failure is a HIDDEN one.** A defect quietly worked around, a case silently dropped because it didn't pass, a weak result dressed up as a win, a "done" claimed on something unverified — those are the failures that cost us, because they spend the next iteration too.
- This lowers NO other bar: honesty, verifying what you DO claim, and never weakening a test to make it pass all still stand. Fail-fast is permission to be WRONG, never permission to be sloppy or misleading.

## The duty to DECLARE

State plainly, with the same prominence as the wins:
- what broke · what did not work · what you could NOT do · what you are unsure of · which numbers are still guesses.
- A negative result gets reported, not buried. "This case fails" is a deliverable.
- If you could not verify a claim, say so instead of asserting it.

## Build the thing that EXPOSES the failure

- A sandbox/lab that makes a defect VISIBLE beats a document that describes the design. (Worked case: the mechanics lab was explicitly required to make the broken spear-vs-cavalry counter *visible* — the lab's job is to show failures, not hide them.)
- Ship the first version that can be LOOKED AT and broken. Iterate from what looking reveals.
- Instrument for the failure you expect: show the numbers, the calculation, the state — so a defect announces itself instead of hiding behind a plausible render.

## The anti-patterns this forbids

- **Gold-plating before showing.** Polishing in private while the reviewer waits.
- **Presenting only the parts that worked.**
- **Declaring "can't / limitation" without evidence** (see the tileset rule: a limitation claim needs the reference cell that proves it).
- **Perfecting a sub-detail while the load-bearing question goes untested** — the tile-polish rabbit hole while "do units behave well on terrain?" stayed unanswered.
- Waiting for a full plan when a rough runnable slice would answer the question today.

## The trade it accepts

Speed over polish on the FIRST pass, on purpose — knowing the first pass is likely wrong, and that finding out fast is the point. Polish is earned by a thing that survived contact with the reviewer.

-> Companions: ref:skill/fan-out#part-2--stay-reachable-report-back-without-parking (Part 2 — surface a blocker mid-run instead of stalling), ref:skill/experiment-method (when the failure must be settled by a controlled run), ref:skill/report-design (how to present the result — including the negative one).
