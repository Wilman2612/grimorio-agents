# QA Memory — Concurrency Testing (correction to SKILL.md's mutation-testing guidance)

> **Placement note.** This content is GENERAL (portable, not project-specific) and belongs conceptually inside
> `SKILL.md` near "THE BREAK-PROOF" and "Why mutation is the standard here, in one line" — but a skill's
> `SKILL.md` is governed content: ref:skill/grimorio-conduct#branches-commits-and-knowledge rule 20 reserves
> editing it to `grimorio.system-keeper` placing, or `grimorio.prompt-writer` authoring what it placed. Filed as a
> new topic file until it is folded in properly. Source: the now-deleted `.claude/grimorio-defects-narrative.md`
> (captured 2026-08-08) — this file is the only surviving copy of that capture.

## The correction, stated first

`SKILL.md`'s mutation-testing sections ("THE BREAK-PROOF", "Judging whether a test EARNS its place", "Why
mutation is the standard here") present mutation as the instrument that proves a check is real — true, but
incomplete without this boundary: **mutation testing falsifies the checks you wrote. It can never surface an
axis nobody wrote a check for.** A 100%-green, fully mutation-tested suite says nothing about a dimension the
suite never varied.

## The incident that forced this

Six numbered checks on a budget path, each verified by running it, each green, each with its own mutant seen
RED first — and a reviewer still reproduced a real money leak on the **first try, with no forcing**: two
concurrent calls against one budget both admit and both pay the provider. The checks were not weak — one
explicitly asserted the leaked amount stayed 0 "across the whole exercise", and it did. Every check drove its
calls SEQUENTIALLY, so concurrency was never in the matrix, and mutation had nothing to falsify on that axis
because nothing on that axis was ever asserted.

## Rule: a money / shared-resource path needs an EXPLICIT concurrency row

`SKILL.md`'s Coverage Planning step already lists "concurrent" among edge cases (`empty, zero, negative,
concurrent`) — but it reads as one bullet among four, easy to treat as optional. For anything touching a
shared balance, budget, counter, or lock: **declare concurrency as its own row in the Test Matrix**, not an
implicit hope that sequential coverage generalises to it.

## A concurrency probe must be shown to FAIL before it is believed

`SKILL.md`'s THE BREAK-PROOF rule ("a test whose failure nobody has observed is a claim, not a probe") applies
here with extra force, because a concurrency probe is unusually easy to satisfy by accident. Two failed probes
from the same incident, both worth more than the eventual fix:

- **A bare `Promise.all` race proves nothing by default.** A `Promise.all` race written for a `close()`
  staleness bug stayed GREEN under its own mutant — firing two calls concurrently does not reliably produce
  the interleaving under test. If the probe will not reliably go RED under the mutant, the interleaving needs
  FORCING (a barrier, an injected delay, a deterministic scheduler hook) — a `Promise.all` that has only ever
  passed is not evidence about the interleaving it is named after.
- **Never reimplement the guarded logic inside the test body.** A replacement probe wrote the compare-and-swap
  being tested *inside the test itself*, and stayed green having never called the production code it claimed
  to cover. This is a new sibling to `SKILL.md`'s "hand-written EXPECTED OBJECT" / doubled-collaborator family:
  that entry covers hand-writing the expected DATA; this is hand-writing the guarded LOGIC. Both produce a
  test that agrees with itself and proves nothing about production. Always assert through a call into the real
  production lock/CAS/guard, never a parallel copy of its logic.

Both of those would have shipped as "covered" without the break-proof step catching them.

-> Universal testing principles this corrects/extends: `./SKILL.md`
-> This agent's behavior: `./behavior.md`
