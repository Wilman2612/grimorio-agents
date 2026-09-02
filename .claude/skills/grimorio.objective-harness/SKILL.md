---
name: grimorio.objective-harness
description: "The branch-objective methodology: one `objectives/<branch>.md` file per live branch declaring what the branch is FOR and what it must NOT touch, opened by `open-branch.sh` and closed by `close-branch.sh`, with every commit gated against it in between. Covers the commit-on-close discipline, the hard invariants (gates, not preferences), the mandatory `verify-gen.sh` generator for every check's VERIFY command, the two VERIFY-syntax pitfalls that make close-branch reject a correct check, how the objective reaches a spawned agent, when the commit gate is live, the branch model (trunk vs feature branches, who works where), and how a milestone differs from a deliverable. Load before opening a branch, writing an objective's Checks, or closing one. GENERAL — portable to any project that adopts grimorio."
---

## What this is

One file per live branch, at `objectives/<branch>.md` — the path is *derived from the branch name*, so
there is no registry to keep in sync and nothing to maintain by hand. When the branch closes, the file is
deleted. `ls objectives/` therefore answers *"where are we, how are we doing, what is open?"* by
construction: what is on disk is what is live.

**This is not a map of the codebase.** An objective indexes WORK IN FLIGHT, never code, and it shrinks as
work closes — a discovery index of "what exists" has to be maintained by hand and drifts the moment nobody
keeps it in sync; this mechanism structurally cannot drift the same way, because a stale entry has nowhere
to hide (the folder either holds the file or it doesn't).

## The cycle

| | What happens | Enforced by |
|---|---|---|
| **Open** | The branch and its objective are created in one act | `.claude/skills/grimorio.objective-harness/scripts/open-branch.sh` |
| **Work** | Every commit checks the objective exists and the branch stays in its declared scope | `scripts/pre-commit.sh` (install: `scripts/install-hooks.sh`) |
| **Close** | Every check must be ticked and its VERIFY command run green; the objective is compressed into one line in the project's own features ledger; the file is deleted, the branch merged and pruned | `.claude/skills/grimorio.objective-harness/scripts/close-branch.sh` |

```
open-branch.sh ──> objectives/<branch>.md ──> pre-commit gates every commit against it
                                          │
                                          └──> close-branch.sh ──> the features ledger (the record
                                                                    of what EXISTS)
                                                              └──> objective deleted, branch pruned
```

## ALWAYS commit when a cycle closes

**ALWAYS commit the moment a closed thing is closed — a shipped feature, a landed fix, a passed gate —
without asking permission.** Permission is standing; asking again each time is the failure this rule
exists to close. **ALWAYS separate the commits by area, one per closed thing**, so any one of them can be
reviewed or reverted alone — **NEVER batch a stretch of work into one pile.**

Uncommitted work is unrecoverable work: a crash, a bad `git checkout`, or a worktree collision destroys
whatever was never committed, and no amount of care in the editing session buys that back. This is not
hypothetical — it is the exact failure this rule exists to close: on one project a signed design document
was lost permanently because it had never been tracked, and over a dozen more files were rescued from
deletion with hours to spare.

The only things held back are secrets and files the project's principal explicitly asked to review first.

## Hard invariants — these are GATES, not preferences

The numbering below is load-bearing: other files in this corpus cite these invariants BY NUMBER. Do not
renumber, merge, split, or reorder them when this section is next edited — add a new invariant at the end,
or rewrite one in place, never shift the ones after it.

1. **NEVER commit to a non-trunk branch with no objective file.** A practice adopted only in words — "we
   should open an objective for this" — decays the moment it costs a step nobody enforces; branches
   accumulate that nobody can account for unless the absence of a file is itself refused.
2. **ALWAYS have the objective declare what the branch must NOT touch, and ALWAYS have the commit gate
   enforce it.** This is the anti-bucket gate: without it, a branch drifts into a dumping ground for
   whatever else needed doing, because nothing ever compares a commit against what the branch was actually
   opened for.
3. **NEVER merge a branch with an open check.** Every check stays unticked until it is genuinely true —
   nothing merges while one still reads open.
4. **ALWAYS give every check a VERIFY command a stranger can run**, and **ALWAYS have the close-out run
   every one of them cold.** A check only a human can eyeball-confirm is exactly how a practice gets
   adopted in words and never actually used.
5. **ALWAYS see a gate FAIL at least once before trusting it.** A probe that has only ever been green has
   never proven it can catch anything — the methodology's own selftest suite exists to fail on the bad
   case and pass on the good one, not merely to pass.
6. **ALWAYS have the close-out itself write the feature line into the project's features ledger — NEVER
   treat "the ledger changed" as proof it did.** An unrelated edit the branch happened to make to the
   ledger file satisfies a weaker check without the close-out's own write ever having run — the close-out
   must refuse an objective whose feature line is missing or still the template placeholder, and after
   writing it, assert that the line is now actually present. There is no gate demanding a human edited the
   ledger by hand during the branch, and none is wanted.
7. **ALWAYS count how many ticked checks carry a runnable VERIFY, and refuse the close if that count is
   lower than the ticked-check count.** "At least one exists" would pass an objective of eight checks with
   one runnable command and seven bare-text placeholders — exactly the shape of a stalled front dressed up
   as a real objective.
8. **ALWAYS have the scope gate see deletions and renames, not only additions.** Deleting an out-of-scope
   file is still unrelated work, and a rename INTO a forbidden path would otherwise escape scope in one
   move — prune-what-dies makes delete-only commits routine, so this is the shape the gate can least
   afford to miss.
9. **ALWAYS treat a scope pattern with no glob character as covering the path and everything under it.**
   `services/api` and `services/api/` mean the same thing — reading the slashless form literally
   would leave a branch silently unscoped, a gate failing in the dangerous direction.
10. **ALWAYS require a merge base to be a LOCAL branch and an ANCESTOR of the branch closing.** A
    remote-tracking ref passes a bare existence check and then gets checked out detached, so the merge
    lands on a dangling commit and the real branch never moves; a base that has advanced past the fork
    means the checks ran against something other than what would actually land.
11. **NEVER let the gate be its own kill switch: refuse any commit that deletes the objective-harness
    marker file outright.** The marker IS the gate — a commit that deletes it turns every objective gate
    off in the same commit that does the unrelated work the gate existed to refuse. Retiring the
    methodology stays possible; it just has to be a deliberate, reviewed act, never a side effect.
12. **WHEN a branch carries no objective of its own ⟶ it INHERITS the nearest ancestor's objective, and the
    commit gate binds it to that ancestor's declared scope.** A branch created without ever running
    `open-branch.sh` on it directly (for example, one made purely to give an isolated worker its own
    working tree) still needs a scope binding it — inheritance is a fallback, never an amnesty: a branch
    descending from no objective-carrying branch at all is refused exactly as before. Opening a narrower
    objective directly on that branch overrides the inherited one.
13. **NEVER close a branch while the features ledger still carries an OPEN entry whose fix this same cycle
    just shipped.** Closing a cycle reviews the ledger and drops what no longer applies — stating that as
    prose alone let a fixed entry sit OPEN while the very cycle that fixed it closed past it ungated; the
    close-out's own drain check catches exactly that gap, without draining the standing backlog or
    replacing a periodic full-backlog review — both stay separate, still-needed work.

## Always generate an objective's VERIFY with verify-gen, never hand-write one

**ALWAYS generate every check's `VERIFY:` command with
`.claude/skills/grimorio.objective-harness/scripts/verify-gen.sh`.** **NEVER hand-write a VERIFY command.** The two
syntax pitfalls in the next section are exactly what a hand-written command has to get right on its own, every
time; the generator exists so nobody has to.

The generator takes a DECLARED check type — a file exists or is absent, a file contains or lacks a literal
string, a pattern has zero matches across one or more paths, a count is exactly N or at least N, a heading is
present, or a `raw` escape hatch for a genuinely irreducible case — and prints the one canonical, gotcha-safe
`` VERIFY: `cmd` `` fragment for it: bare `VERIFY:`, never a leading unwrapped `grep`, never a nested double
quote, and whitespace-tolerant against this same methodology's own block-slurp collapse (`objective-lib.sh`'s
own `obj_verify_commands`, which collapses a run of whitespace to one space when it extracts a check's command
out of the objective file).

**NEVER look here for the full CLI syntax of every check type.** This section does not re-enumerate it, on
purpose: a second copy would drift from the script's own header comment the moment either one changed without
the other. Run `.claude/skills/grimorio.objective-harness/scripts/verify-gen.sh` with a missing or unknown argument and
its own usage prints on stderr — that is the source of truth for exact syntax, not this section.

Every command the generator emits is SELF-LINTED before it is printed: the script writes the candidate line
into a throwaway fixture objective and runs the real
`.claude/skills/grimorio.objective-harness/scripts/lint-objective.sh` against it, refusing rather than emitting anything
that fails. **NEVER read the `raw` escape hatch as a silent bypass of the gotcha rules** — `raw` goes through
the identical self-lint every other check type does, and is refused the same way when it fails.

`.claude/skills/grimorio.objective-harness/scripts/lint-objective.sh` still stays the backstop for whatever slips past
this — a command pasted in from outside the generator, or hand-edited after generation. The generator does not
remove that lint step; it exists so the lint step has less to catch in the first place.

## The two syntax pitfalls that make close-branch reject a correct check

The parser that decides which VERIFY commands close-branch actually runs accepts exactly one shape: the
literal text `VERIFY:` immediately followed by a backtick-quoted command. Nothing else satisfies it, and
once a command runs, the pass/fail signal close-branch reads is that command's own EXIT CODE — never its
printed output. A check that prints "PASS" to a human's terminal and exits non-zero still FAILS the gate.

**NEVER write `VERIFY (anything):` on a check.** A parenthetical sitting between the word `VERIFY` and its
own colon breaks the literal-substring match the parser looks for — `VERIFY (note):` never contains the
bare text `VERIFY:`, so the check parses as carrying no runnable command at all, and the close-out refuses
it as unrunnable. **ALWAYS put a caveat AFTER the backtick-quoted command instead**, in plain parentheses:
`` VERIFY: `cmd` (note: what this checks and why) ``.

**WHEN a check's PASSING case is zero matches ⟶ NEVER use a bare, unwrapped `grep` invocation — any flags,
or none — as the WHOLE VERIFY command.** `grep` exits 1 on zero matches, and that exit code is exactly what
close-branch reads as the check's verdict: ANY leading `grep` not already wrapped in `test`/`[`/`[[` fails
a correct, passing check the identical way, whatever flags it carries or lacks. `` `grep -c` ``,
`` `grep -rl` ``, and `` `grep -rn` `` (and their `-E` variants) are ILLUSTRATIVE examples of this shape —
not the exhaustive list: a plain `grep PATTERN path` with no flags, `grep -q PATTERN path`, and
`grep -nr PATTERN path` (flags reversed from the taught `-rn`) all fail for the identical reason and are
caught just the same.

**ALWAYS wrap the grep in `test` instead, so the wrapper's own exit code carries the verdict, never
grep's:** `test "$(grep -c PATTERN path)" -eq 0 && echo PASS` for a count that must read zero, or
`test -z "$(grep -rl PATTERN path)" && echo PASS` for a file list that must come back empty. A single
test-wrapped command that exits 0 on pass is the one form close-branch can always read correctly, whatever
the grep underneath it finds.

**NEVER read this as coverage of every zero-match-sensitive command shape.** The unwrapped-grep check looks
only at the command's own LEADING token — a `grep` masked behind a pipe, e.g.
`grep PATTERN path | xargs -r test -f`, is NOT flagged, because bash (without `pipefail`, which
close-branch's own execution of the command does not set) reports the LAST command's exit status in a
pipeline, never grep's. A VERIFY command should still avoid depending on grep's own exit code either way —
a piped grep whose exit status is masked by a later stage is a separate, harder case this mechanical check
does not chase, not a gap in the check's own logic.

A correct, gotcha-safe check, in the checklist's own style:

```
- [ ] C1 no file under `services/legacy/` still exists — VERIFY: `test -z "$(git ls-files services/legacy/)" && echo PASS`
```

Both pitfalls above are drawn from real incidents, not hypotheticals invented for this section: both
shipped in the same project's own objectives on the same day, on the objective for one feature branch —
the parenthetical-VERIFY form on one of its checks, the bare-grep-exit-code form on four more of them, both
fixed the same day. The agent that wrote both had already read this methodology's own VERIFY *principle*
(invariant 4 above — "every check carries a VERIFY command a stranger can run"); the principle was never in
doubt. The SYNTAX was, and until this section existed as an eagerly-imported skill, nothing taught it at
the point of use — not a loose doc only ever `ref:`'d lazily, and not the template every check-writer's
objective is born from (`open-branch.sh`'s own Checks heredoc, which now points here instead of restating
the rules in full).

## Before a feature branch merges

The review happens **once, at the END, on the whole branch — not per commit.** A code review and a
security look are both required before a merge; refactoring belongs at the end too, on finished code, never
mid-flight.

Merging also moves the codebase's own map: **ALWAYS update the `harness.md` of every subtree the branch
touched** before the merge lands, so the next reader's upward lookup (see import:skill/grimorio.code-harness) still
describes what is actually there.

## Where the objective reaches — the injection

The commit gate binds the party *least* likely to drift. The objective therefore also travels, resolved
from the branch name with nobody having to paste it:

| Reached by | Mechanism | Form |
|---|---|---|
| **A delegate-type agent's own spawns** (worktree-isolated included) | self-read at task start | the FULL objective: both the project's own current-focus file and its own `objectives/<branch>.md` |
| **Every other spawnable agent type** | none | nothing reaches it at spawn time — an open gap, not a solved one |
| **Loops and recurring prompts** | none, unless a project wires its own injection hook | nothing reaches it by default — this path needs a project-level mechanism to close |
| **The commit** | `scripts/pre-commit.sh` | refusal |

**A hook that tries to hand a spawned child its objective BEFORE that child's context exists cannot work.**
A `PreToolUse: Agent`-style hook runs in the CALLER's own turn, before the spawned child's own context is
assembled — so anything it injects never reaches the child at all; it only ever informs the caller, who
already had a direct way to read the same file. The mechanism that actually works is the opposite
direction: the CHILD reads its own tracked files after it exists, rather than a hook trying to hand it
something before it exists. Build the self-read into whichever agent type owns a task end to end, not a
pre-spawn injection hook.

**Which objective governs a branch must be decided in exactly ONE place** — one resolver function, reached
by every hook and every script that needs the answer through the same call path. A second implementation
in a different language will drift on its first edit, and that drift has the worst possible failure mode: a
worker told it is working inside one scope while the gate measures it against another.

**ALWAYS have the injection degrade to nothing rather than block.** No objective, no git, no bash, a broken
resolver — all of these should degrade to injecting nothing, letting the spawn or turn proceed. A
methodology that can break a session over a missing file is a methodology that gets switched off.

## When the gate is live

The commit gate fires on a branch that has the objective-harness marker file in its working tree **or in
HEAD**. Merging the methodology into a branch is what switches its gate on — which also makes the
activation visible in history. Branches that predate the methodology are left alone rather than blocked by
a rule their own checkout has never heard of.

HEAD is consulted and not only the working tree because a working-tree-only version is an escape hatch: one
commit deleting the marker would turn every objective gate off, in the same commit that does the unrelated
work the gate existed to refuse.

**NEVER gate trunk, a detached HEAD, or a merge commit.**

## THE BRANCH MODEL — CEO ruling, 2026-07-30

The CEO's own ruling, translated, not quoted:

*In theory, work happens on the INTEGRATION branch (commonly `develop`), and the RELEASE branch (commonly
`main`/`master`) is only for releasing to production. The integration and release branches are obviously
PROTECTED; everything else is a feature branch.*

And on why an isolated delegate gets a branch AND a worktree, in the CEO's own words, translated: it
receives a copy of the repo **including the integration branch's own focus plus its own narrower
objective**, so it understands what the branch's main objective is, knows that is not its own specific
objective, but has the context — so it knows what to focus on without losing the wider context it serves.
Pairing a project-wide current-focus file with a branch-local objective file is INTENTIONAL, not
incidental.

**What this resolves.** A gate that never fires on the integration branch means the close-out never runs
for work that lands there directly — objectives sitting open forever, a features ledger going stale, a
backlog claiming work is unbuilt that actually merged days earlier. The fix is NOT to gate the integration
branch. Under this model it is exactly where feature branches land: they carry the objective and the gate,
and they merge INTO it. **The defect is work landing DIRECTLY on the integration branch**, which bypasses
the whole cycle by construction.

-> A project's own `status.sh`-equivalent can report the drift this causes at any time; a
`close-landed.sh`-equivalent can consolidate work that already landed on trunk, which is the case
`close-branch.sh` structurally cannot cover on its own.

## WHO WORKS WHERE — CEO ruling, 2026-07-31

The CEO's own ruling, translated, not quoted, splits into three DIFFERENT rules, not one — treating "never
work directly on the integration or release branch" as binding everyone identically is wrong in both
directions:

1. **NEVER let a delegate-type agent work on the integration branch.**

   **Running the scripted close is not "working."** "Works" above bounds EDITING, COMMITTING, and CHECKING
   OUT the integration branch, never running `close-branch.sh`. **WHEN a delegate's own checks hold ⟶ it
   MAY run `close-branch.sh` itself.** The CEO's own words on this, translated: *"Not being able to work
   there doesn't mean it can't merge — and even if it can't, it can stack, and the caller merges."*

   The close-out first looks up whether the integration branch is checked out in ANOTHER worktree. Because
   rule 2 below keeps that branch held by the main session's own checkout at all times, that lookup finds
   it there and merges into it directly — so, given rule 2 holding, the delegate's own tree never runs a
   checkout and never holds the integration branch itself. A fallback checkout exists for when no worktree
   holds the base at all; that branch fires only if rule 2 has already been broken, which is exactly what
   keeps it from firing here.

   **WHEN closing is genuinely barred ⟶ the delegate STACKS and its caller merges the stack.** It opens its
   next branch on top of its own instead of stopping. Both paths close the same gap: a loop ends at CLOSED,
   never at "my checks are green."

2. **The MAIN SESSION may work directly on the integration branch** — it is the one party that invokes the
   agents — but **ALWAYS commit when it finishes a thing**, so a delegate's worktree never collides with
   uncommitted work. Minimum bar: everything committed BEFORE any delegate worktree is launched.
3. **NEVER create a worktree checked out ON the integration branch.** The main session works there directly;
   a worktree that checks out the same branch LOCKS it, because a version-control system refuses two
   checkouts of one branch at once.

Rule 3 is not hypothetical: on the day this ruling was given, a delegate's worktree ended up holding the
integration branch after its own branch was closed and deleted, and the main session then could not check
it back out to repair a misrouted merge — the checkout failed outright, naming the stray worktree that still
held it.

## Milestones are not a separate kind of thing

A milestone is a branch with an objective. A `**Milestone:**` field on the objective adds a RED-status gate
(a green spec alone can prove the wrong surface) and an `**Exit spec:**` field adds a cold run of that spec.
Both are now data ON the objective, read by the close-out, instead of a hard-coded branch table a script
would otherwise need to maintain.

**A DELIVERABLE is a different, coarser concept — not another name for the milestone above.** This
section's `milestone` gates ONE branch's own process — an objective, a RED-status gate, an exit spec. A
DELIVERABLE is a vertical, principal-visible, shippable increment that a TRACK of related work decomposes
into, independent of how many branches or milestones it happens to touch. -> A project adopting this skill
defines DELIVERABLE and TRACK in its own planning methodology; this file only distinguishes the two
concepts so they are never confused with each other.

## Fields the scripts actually read

`**Branch:**` · `**Base:**` (what it merges into) · `**Feature section:**` (the heading in the ledger the
feature line lands under) · `**Milestone:**` and `**Exit spec:**` (optional) · `- [ ]`/`- [x]` checks with
`` VERIFY: `cmd` `` · the ```` ```paths ```` fence under *Out of scope* · the *Feature line* section.
Everything else in the objective file is for humans.
