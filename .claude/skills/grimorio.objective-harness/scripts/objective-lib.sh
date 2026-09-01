#!/usr/bin/env bash
# Shared parsing for the branch-and-objective methodology. Sourced by open-branch.sh,
# close-branch.sh and pre-commit.sh — the three places the objective is enforced.
#
# A branch's objective lives at objectives/<branch>.md. The path is derived from the branch name, so
# it cannot drift: there is no registry to keep in sync and no index to maintain.

# ORDER IS LOAD-BEARING, and only for obj_default_trunk: the FIRST of these that exists becomes the
# default base. It read "master main develop", so a branch opened with no explicit base was based on
# PRODUCTION. That is not a hypothetical -- on 2026-08-03 an --here open recorded master as its base
# and the close-out merged two weeks of develop work straight into production. Trunk here is develop;
# master is what is deployed. Do not "tidy" this back into alphabetical or historical order.
# obj_is_trunk below is a membership test and does not care about the order.
OBJ_TRUNK_BRANCHES="develop main master"

obj_repo_root() { git rev-parse --show-toplevel; }

obj_current_branch() { git rev-parse --abbrev-ref HEAD 2>/dev/null; }

obj_path_for() { echo "objectives/$1.md"; }

obj_is_trunk() {
  local b=$1 t
  for t in $OBJ_TRUNK_BRANCHES; do [ "$b" = "$t" ] && return 0; done
  return 1
}

obj_default_trunk() {
  local t
  for t in $OBJ_TRUNK_BRANCHES; do
    git rev-parse --verify --quiet "$t" >/dev/null && { echo "$t"; return 0; }
  done
  return 1
}

# A detached HEAD has no branch to attach an objective to (rebase, bisect, CI checkout).
obj_is_detached() { [ "$(obj_current_branch)" = "HEAD" ]; }

# The commit gate fires only where the methodology is actually PRESENT. Branches that predate it — the
# ~40 strays, and any live front until this merges into it — are left alone rather than blocked by a
# rule their own checkout has never heard of. Merging the methodology into a branch switches its gate
# on, which also makes the activation visible in history.
#
# HEAD is consulted, not only the working tree. Keying purely on the working tree made the gate its own
# kill switch: one commit deleting objectives/harness.md turned every objective gate off, and the
# out-of-scope gate could not defend the marker because the marker IS the gate. Deleting it is
# additionally refused outright by pre-commit, so the methodology cannot be removed as a side effect of
# unrelated work — only deliberately, on trunk or with --no-verify.
OBJ_MARKER="objectives/harness.md"
obj_methodology_present() {
  [ -f "$OBJ_MARKER" ] && return 0
  git cat-file -e "HEAD:$OBJ_MARKER" 2>/dev/null
}

obj_field() {
  # obj_field <file> <FieldName> -> the value after "**FieldName:**"
  sed -n "s/^\*\*$2:\*\*[[:space:]]*//p" "$1" | head -1 | sed 's/[[:space:]]*$//'
}

obj_open_checks()   { grep -c '^- \[ \] ' "$1" 2>/dev/null || true; }
obj_closed_checks() { grep -c '^- \[[xX]\] ' "$1" 2>/dev/null || true; }

# Every check's VERIFY command, one per line. Only a backtick-quoted command counts: bare prose after
# "VERIFY:" is a placeholder, and close-branch compares this count against the number of checks so a
# check cannot quietly carry nothing.
#
# The file is SLURPED rather than read line by line, because a VERIFY command long enough to wrap was
# invisible to a line-based match: the count then came up short and close-branch refused a close that
# was perfectly legitimate. That is a gate failing in the direction that punishes the careful author,
# who wrapped the line precisely because the command was substantial. A backticked span cannot itself
# contain a backtick, so joining the lines cannot bleed one check's command into the next. Embedded
# newlines become spaces, which is what a shell would do with the wrapped command anyway.
#
# `VERIFY:[ ]*` (zero-or-more, not the single literal space this used to require), because the SAME
# wrap that motivated the slurp above can also land the break between "VERIFY:" and its backtick —
# indentation on the continuation line plus the substituted newline then leaves TWO OR MORE spaces
# there, which the old single-space literal silently failed to match. Found 2026-08-05: a real,
# correctly-authored objective (this file's own reference-obligation example, C2) already wrote
# "VERIFY:" at the end of one physical line and the backtick command at the start of the next — the
# documented style, not a mistake — and it went uncounted under the stricter match.
#
# BLOCK-SCOPED, not file-wide, since 2026-08-20 -- found live, by an agent actually running this
# project's own workflow end to end, not by reading the code: this function used to `tr` the WHOLE
# FILE to one line and regex the result, so any PROSE anywhere in the file that happens to contain
# the literal text `` `VERIFY:` `` (a backtick-quoted mention of the keyword itself -- exactly what
# this branch's own teaching text in .claude/skills/grimorio.objective-harness/scripts/open-branch.sh's Checks-heredoc now writes into every new
# objective) matched the SAME regex as a real check's own command, and everything up to the NEXT
# backtick anywhere later in the file was captured as a phantom "command" that close-branch.sh gate 8
# then tried to execute and fail on -- breaking EVERY freshly-opened objective before a single real
# check was even filled in. Scoped now to the SAME per-check-block boundary obj_checks_with_verify
# already uses below (one implementation of "what counts as a block", not two that could drift):
# text before the first `- [ ]`/`- [x]` marker -- an intro paragraph, this branch's own teaching
# prose, anything -- can never again be read as a check's own command. KNOWN, UNCHANGED characteristic
# this does not attempt to fix: the LAST block still runs to EOF, so "Out of scope"/"Feature
# line"/"## Log" text after the final check is still technically inside that check's own search
# space, exactly as obj_checks_with_verify already behaves -- empirically not a live problem for any
# objective checked so far, and narrower in scope than the preamble bug this fix closes.
obj_verify_commands() {
  awk '
    function flush() { if (block != "") print block }
    /^- \[[ xX]\] / { flush(); block=$0; next }
    block != "" { block = block " " $0 }
    END { flush() }
  ' "$1" 2>/dev/null \
    | grep -oE 'VERIFY:[ ]*`[^`]*`' \
    | sed -E 's/^VERIFY:[ ]*`//; s/`$//; s/  */ /g; s/ $//'
}

# Ticked checks that carry a runnable VERIFY of their OWN — counted PER CHECK BLOCK, never file-wide
# (a file-wide total lets one check carrying three commands cover two checks carrying none, which is
# exactly the shape a stalled front takes). A block runs from one `- [ ]`/`- [x]` marker line to the
# line before the next one (or EOF); a block is counted only if it is CLOSED (`[x]`/`[X]`) and its own
# joined text contains a `VERIFY:` backtick command — the same tolerant match as obj_verify_commands
# above, for the same reason (a wrap can land between "VERIFY:" and its backtick).
#
# Found 2026-08-05 alongside the fix above: close-branch.sh's own per-check gate used a STRICTER,
# single-physical-line regex (`^- \[[xX]\] .*VERIFY: \``) that requires the check marker and the
# VERIFY backtick command on the exact same source line — failing on every multi-line check
# description, including this project's own documented style. Verified against a real, already-open
# objective (reference-obligation.md): the old regex reported 0 runnable of 4 closed checks on a file
# that was never wrong.
obj_checks_with_verify() {
  awk '
    function flush() { if (open) n += (block ~ /VERIFY:[ ]*`[^`]*`/) }
    /^- \[[ xX]\] / { flush(); block=$0; open=($0 ~ /^- \[[xX]\] /); next }
    { block = block " " $0 }
    END { flush(); print n+0 }
  ' "$1" 2>/dev/null
}

# obj_verify_cmd_is_unwrapped_grep <cmd> -- true when a VERIFY command's own LEADING token is a bare `grep`
# invocation whose own exit code is what a caller reads: NOT already wrapped in `test`/`[`/`[[`, whose own
# exit code would carry the verdict instead. grep exits 1 on zero matches, so an unwrapped grep fails a
# PASSING check whose right answer is zero matches -- a property of EVERY grep invocation, any flags or
# none, never just `-c`/`-rl`/`-rn` and their `-E` variants. Both close-branch.sh (gate 8's hint) and
# lint-objective.sh (pitfall 2) call this ONE function rather than each hand-copying a flag-shape list --
# a hand-copied enumeration under-covers the real mechanism and can silently let a genuinely broken check
# pass the lint: a plain `grep PATTERN path`, `grep -q PATTERN path`, and a reversed flag order (`grep -nr`
# vs the taught `-rn`) all trip the identical failure a 3-shape list never named, and the two copies can
# drift out of sync with each other besides.
#
# Anchored to the LEADING token deliberately, not a substring search anywhere in the command: a substring
# search on the literal text "test " both false-positives on `[ ... ]`/`[[ ... ]]` (which carry their own
# exit code exactly like `test` does) and false-negatives when the grep PATTERN itself happens to contain
# the four letters t-e-s-t followed by a space (e.g. searching for "latest version") -- author-controlled
# search text must never influence this judgment.
#
# KNOWN LIMIT, stated rather than silently missed: this does not trace exit-status semantics through a pipe
# or command list beyond the leading token -- `grep PATTERN path | xargs -r test -f` is not flagged,
# because bash (without `pipefail`, which close-branch.sh's own `bash -c "$cmd"` does not set) reports the
# LAST command's exit status, not grep's. A VERIFY command should still avoid depending on grep's own exit
# code either way; this heuristic does not chase it through a pipeline.
obj_verify_cmd_is_unwrapped_grep() {
  set -- $1  # word-split deliberately, to read the leading token only
  # An all-whitespace command (e.g. a lone tab -- reachable because obj_verify_commands' own sed
  # pipeline only collapses/trims literal SPACE runs, never tabs) word-splits to ZERO words here,
  # leaving $1 unset. Both callers (close-branch.sh gate 8, lint-objective.sh pitfall 2) run under
  # `set -uo pipefail`, so referencing "$1" unguarded then aborts the WHOLE SCRIPT with a raw
  # interpreter error instead of a clean verdict. Not flagged: an empty command has no leading
  # `grep` token to flag in the first place.
  [ $# -eq 0 ] && return 1
  case "$1" in
    test|\[|\[\[) return 1 ;;   # already wrapped -- its OWN exit code carries the verdict
    grep) return 0 ;;           # a bare, unwrapped grep leads the command
    *) return 1 ;;
  esac
}

# The glob list inside the ```paths fence under "## Out of scope".
obj_out_of_scope_globs() {
  awk '/^```paths[[:space:]]*$/{inblock=1; next} /^```[[:space:]]*$/{inblock=0} inblock' "$1" 2>/dev/null \
    | sed 's/[[:space:]]*$//' | sed 's/[[:space:]]*#.*$//' | grep -v '^[[:space:]]*$' || true
}

# Pattern forms, and why the slashless one is not taken literally: an author writes "services/game-sim"
# at least as often as "services/game-sim/", and matching only a file of that exact name would leave the
# branch silently unscoped — a gate failing in the dangerous direction. A pattern with no glob
# metacharacter is therefore treated as BOTH the path itself and everything under it.
obj_path_violates() {
  local file=$1 pat=$2
  case "$pat" in
    */) [[ $file == "$pat"* ]] && return 0 ;;
    *[*?[]*) [[ $file == $pat ]] && return 0 ;;
    *)  [[ $file == "$pat" || $file == "$pat"/* ]] && return 0 ;;
  esac
  return 1
}

obj_feature_line() {
  # Everything under "## Feature line", trimmed of blank lines.
  awk '/^## Feature line/{inblock=1; next} /^## /{inblock=0} inblock' "$1" 2>/dev/null \
    | grep -v '^[[:space:]]*$' || true
}

# The objective's one-sentence statement: the blockquote under "## The objective".
obj_statement() {
  awk '/^## The objective/{inblock=1; next} /^## /{inblock=0} inblock && /^>/' "$1" 2>/dev/null \
    | sed 's/^>[[:space:]]*//' | grep -v '^[[:space:]]*$' || true
}

# ---------------------------------------------------------------------------------------------
# INHERITANCE — which objective governs a branch that has none of its own.
#
# The commit gate used to be the only place the objective was enforced, which bound the main loop and
# nobody else. Injecting it into delegates forced this question: a delegate spawned with
# isolation:"worktree" is on its OWN branch, created by the harness, and that branch has no objective
# file. Leaving that silent is the worst of the options — the delegate is then the one party doing the
# work under no declared scope at all.
#
# The ruling, applied identically by the hook that INJECTS and the gate that REFUSES: a branch with no
# objective of its own INHERITS the objective of the nearest branch it descends from that has one, and
# is bound by that objective's out-of-scope paths. A delegate is doing a piece of its parent's work, so
# the parent's scope is exactly the right fence. Writing its own with `open-branch.sh --here` overrides.
#
# "Nearest" = among the objective-carrying branches that are ancestors of HEAD, the one with the most
# recent tip. Ties break on branch name so two callers never resolve differently.
# ---------------------------------------------------------------------------------------------

obj_objective_branches() {
  [ -d objectives ] || return 0
  find objectives -type f -name '*.md' 2>/dev/null \
    | sed 's|^objectives/||; s|\.md$||' \
    | grep -vx 'harness' || true
}

obj_inherited_branch_for() {
  local self=$1 b best="" bestts=0 ts
  while IFS= read -r b; do
    [ -z "$b" ] && continue
    [ "$b" = "$self" ] && continue
    obj_is_local_branch "$b" || continue
    git merge-base --is-ancestor "$b" HEAD 2>/dev/null || continue
    ts=$(git log -1 --format=%ct "$b" 2>/dev/null) || continue
    if [ "${ts:-0}" -gt "$bestts" ]; then
      best=$b; bestts=$ts
    elif [ "${ts:-0}" -eq "$bestts" ] && [ -n "$best" ] && [ "$b" \< "$best" ]; then
      best=$b
    fi
  done <<< "$(obj_objective_branches)"
  [ -n "$best" ] && echo "$best"
}

# Echoes "<origin>\t<file>" for the objective governing <branch>: origin is "own", or the branch the
# objective was inherited from. Returns 1 when nothing governs the branch.
#
# BOTH values come back down the SAME channel deliberately. The first version set the origin in a global
# and echoed only the path; every caller reads it through `$(...)`, which runs the function in a
# SUBSHELL, so the global never reached the caller and an own objective reported itself as "INHERITED
# from ''". A global that cannot survive a command substitution is a trap for the next reader.
obj_resolve() {
  local branch=$1 f p
  f=$(obj_path_for "$branch")
  if [ -f "$f" ]; then printf 'own\t%s\n' "$f"; return 0; fi
  p=$(obj_inherited_branch_for "$branch")
  [ -z "$p" ] && return 1
  f=$(obj_path_for "$p")
  [ -f "$f" ] || return 1
  printf '%s\t%s\n' "$p" "$f"
  return 0
}

# A base must be a LOCAL branch. A remote-tracking ref passes `rev-parse --verify` and then gets
# checked out DETACHED, so the close-out merges into a dangling commit, leaves the operator on a
# detached HEAD and never moves the local branch — with the objective file already deleted.
obj_is_local_branch() { git show-ref --verify --quiet "refs/heads/$1"; }

obj_die() { echo "" >&2; echo "$1" >&2; echo "" >&2; exit 1; }
