# Objective — Each grimorio agent's memory lives in an optional memory/ folder inside its own agent folder, ARCHITECTURE.md says so, and the audit and export treat a missing agent memory as absent rather than dead.

**Branch:** claude/tender-cray-qw8chb
**Base:** master
**Opened:** 2026-10-10
**Kind:** feature
**Feature section:** SHIPPED — process & tooling

## The objective — one sentence, what is TRUE when this is done

> Each grimorio agent's memory lives in an optional memory/ folder inside its own agent folder, ARCHITECTURE.md says so, and the audit and export treat a missing agent memory as absent rather than dead.

## Checks — none of these unchecked, nothing merges

Each check is a claim that is FALSE today and TRUE when this branch is done. Give each one a VERIFY
command that a stranger can run; a check nothing can run is a wish. See the gate fail before you
trust it — a probe that has only ever been green is not a probe.

The parser only accepts one shape: bare `VERIFY:` immediately followed by a backtick-quoted command.
A parenthetical between the word VERIFY and its own colon breaks it — put any caveat AFTER the command
instead. And a bare, unwrapped `grep` — any flags, or none — fails a PASSING check whose right answer
is zero matches, because grep exits 1 on no match — wrap it: `test -z "$(grep -rl PATTERN path)" && echo PASS`.
Full rules: .grimorio/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check

- [x] C1 No per-agent memory store remains under .grimorio/memory/ — only the two deferred stores — VERIFY: `test "$(ls .grimorio/memory | tr '\n' ' ')" = "grimorio.board-memory grimorio.system-design-memory " && echo PASS`
- [x] C2 No generated empty placeholder sits in any agent's memory/ — VERIFY: `test -z "$(grep -rl 'This file is YOURS, and it is EXPECTED' .grimorio/agents/*/memory .grimorio/skills/grimorio.build-protocol)" && echo PASS`
- [x] C3 The export suites pass with memory inside the agent folder — VERIFY: `bash .grimorio/scripts/selftest/export-memory-split.sh && bash .grimorio/scripts/selftest/export-adopter-templates.sh && bash .grimorio/scripts/selftest/export-reconcile.sh`
- [x] C4 ARCHITECTURE.md specifies agent memory as optional, inside the agent folder — VERIFY: `test -n "$(grep -l 'MEMORY IS OPTIONAL' .grimorio/ARCHITECTURE.md)" && test -n "$(grep -l 'THE PROJECT AND CODE LEVELS, BESIDE THEIR AGENT' .grimorio/ARCHITECTURE.md)" && echo PASS`

## Out of scope — paths this branch MUST NOT touch (enforced at commit)

Everything this branch is NOT. The commit gate refuses staged files matching these — additions,
modifications, DELETIONS and renames alike — which is what keeps a branch from becoming a bucket for
unrelated work. A pattern with no glob character covers the path and everything under it.

```paths
.grimorio/memory/grimorio.board-memory
.grimorio/memory/grimorio.system-design-memory
.claude/hooks
CLAUDE.md
```

## Feature line — the capability this leaves behind

Agent memory lives, optional, in `.grimorio/agents/<agent>/memory/` (ARCHITECTURE.md section 6).

## Merge summary

Eleven agents' memory moved into their own folders; developer-memory became the shared skill
grimorio.build-protocol; the generated empty project.* placeholders are gone; the audit counts a reference
into an existing agent's memory/ as live and the export never seeds a template there.

## Log
