# Objective — Write the vision, pseudo-spec and quasi-software view of grimorio's task flow (mission, architecture, execution plan, steps, subtasks, evidence, report), derived from every one of the principal's messages, for his review.

**Branch:** claude/task-flow-design
**Base:** master
**Opened:** 2026-10-20
**Kind:** feature
**Feature section:** SHIPPED — process & tooling

## The objective — one sentence, what is TRUE when this is done

> Write the vision, pseudo-spec and quasi-software view of grimorio's task flow (mission, architecture, execution plan, steps, subtasks, evidence, report), derived from every one of the principal's messages, for his review.

## Checks — none of these unchecked, nothing merges

Each check is a claim that is FALSE today and TRUE when this branch is done. Give each one a VERIFY
command that a stranger can run; a check nothing can run is a wish. See the gate fail before you
trust it — a probe that has only ever been green is not a probe.

The parser only accepts one shape: bare `VERIFY:` immediately followed by a backtick-quoted command.
A parenthetical between the word VERIFY and its own colon breaks it — put any caveat AFTER the command
instead. And a bare, unwrapped `grep` — any flags, or none — fails a PASSING check whose right answer
is zero matches, because grep exits 1 on no match — wrap it: `test -z "$(grep -rl PATTERN path)" && echo PASS`.
Full rules: .grimorio/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check

- [ ] C1 every message of his about the flow is quoted in the pseudo-spec — VERIFY: `for u in U6 U7 U10 U14 U15 U26 U27 U28 U29 U30 U31 U32 U33 U34 U35 U36 U37 U38; do grep -qw "$u" .grimorio/design/task-flow/pseudo-spec.md || { echo "missing $u"; exit 1; }; done; echo PASS`
- [ ] C2 the vision has exactly the six fields of the vision format — VERIFY: `test "$(grep -cE '^## [1-6]\. (REQUIRES|OBJECTIVE|THE WIRING SHAPE|APPLICABILITY|BOUNDARIES|ACCEPTABLE RESULT)$' .grimorio/design/task-flow/vision.md)" = 6 && echo PASS`
- [ ] C3 the view draws the whole flow and the step loop — VERIFY: `test "$(grep -c '^.\{3\}mermaid$' .grimorio/design/task-flow/quasi-software-view.md)" -ge 2 && echo PASS`
- [ ] C4 every section of the view the pseudo-spec points to exists — VERIFY: `for n in $(grep -o '§[0-9]' .grimorio/design/task-flow/pseudo-spec.md | grep -o '[0-9]' | sort -u); do grep -q "^## $n\. " .grimorio/design/task-flow/quasi-software-view.md || { echo "missing $n"; exit 1; }; done; echo PASS`
- [ ] C5 each of his six decisions carries options and a recommendation — VERIFY: `test "$(grep -cE '^\| D[1-6] \|.*\|.*\|.*\*\*' .grimorio/design/task-flow/README.md)" = 6 && echo PASS`

## Out of scope — paths this branch MUST NOT touch (enforced at commit)

Everything this branch is NOT. The commit gate refuses staged files matching these — additions,
modifications, DELETIONS and renames alike — which is what keeps a branch from becoming a bucket for
unrelated work. A pattern with no glob character covers the path and everything under it.

```paths
.claude
CLAUDE.md
.grimorio/agents
.grimorio/skills
.grimorio/hooks
.grimorio/scripts
```

## Feature line — the capability this leaves behind

The task-flow design: vision, pseudo-spec and quasi-software view, in .grimorio/design/task-flow/.

## Merge summary

Design only. How a task travels from the principal's "execute" to a delivered, proven result: mission, architecture, execution plan, steps, subtasks, evidence captured by tools, and support documents he can read from the moment the plan exists. Built from all 39 of his messages in session ab161c11, with every ask quoted verbatim. Nothing is built; six decisions (README D1-D6) wait for him.

## Log
