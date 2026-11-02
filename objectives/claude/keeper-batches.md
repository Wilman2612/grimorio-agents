# Objective — The keeper groups its targets into batches worth a child and plans one review at the end of its loop, and its phase engine refuses to leave placement without both written down.

**Branch:** claude/keeper-batches
**Base:** master
**Opened:** 2026-11-01
**Kind:** feature
**Feature section:** SHIPPED — process & tooling

## The objective — one sentence, what is TRUE when this is done

> The keeper groups its targets into batches worth a child and plans one review at the end of its loop, and its phase engine refuses to leave placement without both written down.

## Checks — none of these unchecked, nothing merges

Each check is a claim that is FALSE today and TRUE when this branch is done. Give each one a VERIFY
command that a stranger can run; a check nothing can run is a wish. See the gate fail before you
trust it — a probe that has only ever been green is not a probe.

The parser only accepts one shape: bare `VERIFY:` immediately followed by a backtick-quoted command.
A parenthetical between the word VERIFY and its own colon breaks it — put any caveat AFTER the command
instead. And a bare, unwrapped `grep` — any flags, or none — fails a PASSING check whose right answer
is zero matches, because grep exits 1 on no match — wrap it: `test -z "$(grep -rl PATTERN path)" && echo PASS`.
Full rules: .grimorio/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check

- [x] C1 Phase B tells the keeper to batch its targets and to plan one review at the end — VERIFY: `test -n "$(grep -l "ALWAYS group the targets into BATCHES" .grimorio/agents/grimorio.system-keeper/phases/phase-b-placement-authoring.md)" && test -n "$(grep -l "NEVER plan a review per node, per target or per chunk" .grimorio/agents/grimorio.system-keeper/phases/phase-b-placement-authoring.md)" && echo PASS`
- [x] C2 the phase engine refuses to leave Phase B without BATCHES and REVIEW — VERIFY: `node .grimorio/agents/grimorio.system-keeper/scripts/selftest/batches-gate.mjs`
- [x] C3 Phase C reviews once over the assembled diff and no longer hands review placement to another skill — VERIFY: `test -z "$(grep -l "is the plan author's" .grimorio/agents/grimorio.system-keeper/phases/phase-c-verification-review.md)" && test -n "$(grep -l "ALWAYS review once, after every node of Phase B has returned" .grimorio/agents/grimorio.system-keeper/phases/phase-c-verification-review.md)" && echo PASS`
- [x] C4 the keeper's chain still walks — VERIFY: `node .grimorio/skills/grimorio.phase-splitting/scripts/check-chain.mjs --manifest .grimorio/agents/grimorio.system-keeper/phases/chain.json --walk`

## Out of scope — paths this branch MUST NOT touch (enforced at commit)

Everything this branch is NOT. The commit gate refuses staged files matching these — additions,
modifications, DELETIONS and renames alike — which is what keeps a branch from becoming a bucket for
unrelated work. A pattern with no glob character covers the path and everything under it.

```paths
CLAUDE.md
.claude/settings.json
.grimorio/design
```

## Feature line — the capability this leaves behind

Agents own their files in their own folders, the synthesizer's prepare and finalize share one folder, and the keeper batches its work and reviews once at the end.

## Merge summary

Three things land together. Everything one agent owns (behavior, phases, scripts, memory) now lives in its own folder under .grimorio/agents/, and the authoring guide no longer contradicts that. The synthesizer's prepare and finalize share one default folder, so a real run no longer stops at PREPARE_NOT_RUN. The keeper groups its targets into batches worth a child (at most three nodes) and plans one review at the end of its loop, and its phase engine refuses to leave placement until BATCHES and REVIEW are written. The gates run through bash when installed by hand, and pre-push guards .grimorio/. Installing the gates automatically was pulled out and waits as issue #6.

## Log
