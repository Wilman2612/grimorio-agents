# QA Memory — Gated Test Batteries (a proof-of-done gate outside the default run)

> **Placement note.** Same situation as `./concurrency-testing.md`: this lesson is general/portable and belongs
> conceptually in `SKILL.md`, filed here because `SKILL.md` is governance-locked to this agent. This project's
> specific instance (the game-sim `-tags scenario` battery, its command, and its confirmed status) is recorded in
> `./project.md` → "Test frameworks", not duplicated here, so the fact lives in exactly one place.
> Source: `.claude/grimorio-defects-narrative.md`, captured 2026-08-08.
>
> **Scope note.** Only the TEST-STRATEGY half of that finding is captured here. The game-economy half — WHY the
> underlying scenario's food loop starves — is `grimorio.game-architect`'s territory, not QA's, and is
> deliberately not diagnosed anywhere in this skill.

## The lesson

A test battery gated behind a build tag / explicit flag / separate job — one that the project's OWN harness or
documentation NAMES as the proof a mechanic is done — is invisible to anyone who only runs the default suite
(`go test ./...`, `pnpm test`, etc.). If it goes red, it can stay red indefinitely with nobody noticing: the
gate has decayed to zero enforcement while still being cited as proof-of-done. A permanently-red battery trains
readers to skip it.

## Enforcement rule

Whenever a suite's "proof of done" for some class of change lives behind a non-default flag/tag/job:
1. Wire it into a job that actually runs by default or on a schedule, so trunk cannot stay red unnoticed — OR
2. If it genuinely cannot be default (too slow/expensive to run every time), the document that CITES it as
   proof-of-done must also name WHO runs it and HOW OFTEN — an uncited cadence makes the citation decorative.

## Verified instance in this repo

`services/game-sim`'s `-tags scenario` integration battery is exactly this shape — see `./project.md` → "Test
frameworks" for the command, the specific test, and its confirmed status.

-> Universal testing principles this extends: `./SKILL.md`
-> This agent's behavior: `./behavior.md`
