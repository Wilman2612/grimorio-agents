# code-harness — push and history-rewrite discipline (rebase, squash, merge commits)

Three git operations each silently invalidate a different class of tooling this repo already relies on: a
rebase rewrites commit hashes, a squash collapses commit counts and ranges, a merge commit changes what `HEAD`
means mid-operation. Each is named below by name — what it breaks, and what to do instead — grounded in a
confirmed incident, a confirmed live exposure, and the safe pattern already shipped in this repo, never
invented for this file.

## Merge commits — the confirmed incident

**NEVER treat `git diff --cached --name-only`, or a bare `git diff HEAD --name-only`, run while inside a merge
(`MERGE_HEAD` present) or immediately after committing one, as "what this step just changed."** Both read an
IMPLICIT, currently-moving reference point — whatever `HEAD`/the index happen to be RIGHT NOW — so the exact
result depends on exactly when the read happens relative to everything else touching `HEAD` or the index in the
same session: mid-merge it can still equal the pre-merge state; once a later commit has landed, or the index
has since been used for something else (a broad `git add -A` sweep of an unrelated cleanup batch, for
instance), it can just as easily report EMPTY — telling you nothing about a merge that already happened. An
EXPLICIT diff against a NAMED, FIXED rev, or a two-dot range between two named endpoints, has no such
ambiguity — it names exactly what is being compared, which is why `git-history-safety.mjs`'s own
`safe-changed-files <rev>` and `merges-in-range` exist: to let a caller name the fixed reference explicitly
instead of trusting whatever `--cached`/`HEAD` happen to mean at the moment of the read.

This repo's own confirmed incident, below, is consistent with that instability — though the exact script/command
that actually produced it was never committed to the repo and cannot be independently re-derived from git
history alone; stated as a limit, never as a proven mechanism.

Measured founding incident: commit `84a40b6e` ("merge(design/workflow-asis): workflow AS-IS renders, left
uncommitted for five days") used `cite:repo/objectives/harness.md` in a merge that listed the whole staged set,
sweeping that file up with ~100 transitory objective files it was never one of — it is a standing marker, not a
per-branch throwaway. With the marker gone, `obj_methodology_present()` returned false and both
the branch-has-an-objective gate and the out-of-scope gate stopped firing, silently, for two days, until commit
`6b7daaaf` ("fix: restore objectives/harness.md -- the switch my merge turned off two days ago") restored it.
From that commit's own message, verbatim:

> *"84a40b6e swept this file up with ~100 transitory objective files because the loop used
> objectives/harness.md in a merge, which lists the whole staged set. With the marker gone,
> obj_methodology_present() returned false and both the branch-has-an-objective gate and the out-of-scope gate
> stopped firing, silently, for two days."*

**WHEN a diff must span a range that might contain a merge commit ⟶ ALWAYS compute it as a two-dot range diff
between two FIXED endpoints — `git diff --name-only A..B` — never `--cached` and never a bare `HEAD` diff.** A
range diff between two fixed commits diffs two trees directly, so it stays correct however many merge commits
sit inside that range — immune to the merge-blindness bug by construction, not merely by convention.
`cite:repo/scripts/pre-push.sh@7057b0e72c440a324103ac6932ef24512230c4a4:48` is the live, already-correct
exemplar: `git diff --name-only "$remote_sha..$local_sha"`, a range between the remote tip and the local tip,
never `--cached` or bare `HEAD`.

**A live, currently-unfixed instance of the SAME blind pattern exists in this repo — reported here, never
fixed here (out of scope for this file):**
`cite:repo/scripts/check-comment-blocks.mjs@7057b0e72c440a324103ac6932ef24512230c4a4:13` computes `git diff
--cached --name-only --diff-filter=ACM` unconditionally, every time the `pre-commit` hook fires — including on
a merge commit (a non-fast-forward `git merge` invokes `pre-commit` unless `--no-verify`). On such a commit
this line returns the same over-broad "union of both branches" file list, scanning far more files for oversized
comment blocks than the tool's own stated intent (a staged diff that ADDS a comment block — new/changed
content, never everything the merge happens to bring in).

## Rebase — not yet incident-measured, but the mechanism is deducible

**NEVER rebase a branch after it has been reviewed or approved by commit sha.** Rebase rewrites commit hashes.
Any verification anchored to a specific sha — a `grimorio.code-reviewer` APPROVED verdict recorded against a
sha, a merge-base computed before the rebase, a `.claude/.cache/review-approved` marker file keyed to a commit
(exactly this shape:
`cite:repo/scripts/pre-push.sh@7057b0e72c440a324103ac6932ef24512230c4a4:28,67-85` —
`MARKER=".claude/.cache/review-approved"` holds a commit sha, and the gate only passes when that marker's sha
equals the commit actually being pushed) — goes silently stale the instant the branch is rebased: the old sha
no longer exists on the branch, the marker no longer matches, and a marker that happens to still read some
OTHER valid-looking sha would not even fail loudly.

**WHEN a rebase is genuinely needed after a branch was already reviewed or approved ⟶ ALWAYS re-obtain that
approval against the new head, and recompute any merge-base that was computed before the rebase.** Never trust
a pre-rebase approval or a pre-rebase merge-base to still describe the post-rebase branch.

## Squash — not yet incident-measured, but the mechanism is deducible

**WHEN a squash collapses N commits into 1 ⟶ ALWAYS re-derive, against the new collapsed history, any check
that is range-based or commit-count-based and assumed the pre-squash shape — never trust it to still mean what
it meant before.** A commit-count-based staleness threshold (e.g. this repo's own ROT-item check for "above 50
commits of `BACKLOG.md` silence," `ref:repo/scripts/status.sh`) or a range `A..B` expected to find N original
commits (e.g. the `git log --all --diff-filter=A --name-only` patterns this repo's own design-archive files use
to verify a specific file was added in a specific commit) stops finding what it expects the moment those N
commits are replaced by one squashed commit that never existed in that shape before.

## THE TEST — why this is a script's job, not a re-derivation every time

Whether a given git ref IS a merge, whether a merge or rebase is CURRENTLY in progress, and whether a push would
NEED `--force` are each a fixed, mechanically checkable fact about state already on disk or in git — exactly
what
ref:skill/grimorio.agent-writing/symbiosis-doctrine.md#the-test--stated-once-applicable-without-asking-each-time
calls a script's job. "Is this branch worth rebasing" stays with the model — a judgment call two competent
reasoners could make differently, never checkable mechanically. Applying that test is what fixes the boundary
below: the script answers the first three questions; nothing in this file ever asks a model to re-derive them.

## The script — `git-history-safety.mjs`

Path: `ref:repo/.grimorio/skills/grimorio.code-harness/scripts/git-history-safety.mjs`, run with `node`.
Subcommands:

- `is-merge-commit <rev>` — exit 0/"yes" if `<rev>` has 2+ parents, exit 1/"no" otherwise.
- `is-merge-in-progress` — exit 0/"yes" if `MERGE_HEAD` exists.
- `is-rebase-in-progress` — exit 0/"yes" if `rebase-merge` or `rebase-apply` exists.
- `safe-changed-files [<rev>]` — mid-merge: diffs against `ORIG_HEAD` instead of `--cached`/`HEAD`; given a
  merge-commit rev: diffs against that commit's first parent only; otherwise: ordinary `--cached --name-only
  --diff-filter=d`.
- `would-need-force <local-ref> <remote-ref>` — exit 0/"safe" if `remote-ref` is an ancestor of `local-ref` via
  `git merge-base --is-ancestor`, exit 1/"UNSAFE" on genuine divergence — the rebase/squash/history-rewrite
  detector — and exit 2 on a ref it cannot resolve, never 1: a typo must not read as a rewritten history.
- `merges-in-range <range>` — lists the merge commits in that range via `git log --merges --oneline`, exit 2
  on an unresolvable range.

Selftest: `ref:repo/.grimorio/skills/grimorio.code-harness/scripts/selftest/git-history-safety.mjs`.

## Reach — why this doctrine reaches every agent

`grimorio.code-harness` is one of the 16 genuinely cross-cutting AMBIENT skills every agent's own Skill-tool
listing carries, per
ref:repo/.grimorio/GRIMORIO-CHAIN.md#6-skills--the-ambient-listing-vs-the-second-root — this doctrine is not a
narrow, opt-in add-on read only by whoever happens to touch git history; it is reachable from the same skill
every code-touching agent already loads, through this skill's own `SKILL.md` pointer.
