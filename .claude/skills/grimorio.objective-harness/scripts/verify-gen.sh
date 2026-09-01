#!/usr/bin/env bash
# ANSWERS: given a DECLARED check intent (file exists/absent, a literal string present/absent, a pattern with
# zero matches across paths, a count equal-to/at-least N, a heading present, or a raw escape hatch), what is
# the ONE canonical, gotcha-safe `VERIFY: `cmd`` fragment to paste into an objective's Checks section. WHEN:
# ALWAYS, instead of hand-writing a VERIFY command — see
# .claude/skills/grimorio.objective-harness/SKILL.md#always-generate-an-objectives-verify-with-verify-gen-never-hand-write-one.
#
# WHY THIS EXISTS, not a restatement of the taught pitfalls (SKILL.md teaches those; this generator makes them
# unreachable by construction — bare hand-writing is never asked to remember them):
#   1. a bare zero-match `grep -c`/`grep -rl`/`grep` exits 1 -> fails a check whose right answer is zero matches.
#   2. a parenthetical between VERIFY and its colon -> the parser skips the check entirely.
#   3. nested double-quotes -> break when close-branch.sh runs the command via `bash -c`.
#   4. an exact multi-space match -> objective-lib.sh's own extraction collapses whitespace runs to one space
#      when it slurps a check block, so a literal requiring two-or-more consecutive spaces silently stops
#      matching once written into an objective file, even though the generator's own output was correct.
#
# Every emitted command is SELF-VERIFIED before being printed: this script writes it into a throwaway fixture
# objective and runs it through lint-objective.sh (this project's own gotcha detector) before emitting anything
# — a generator that could itself emit a flagged line would be exactly the failure it exists to close, so this
# is not optional for any type, not only `raw`.
#
# USAGE
#   verify-gen.sh file-exists <path> [--note TEXT]
#   verify-gen.sh file-absent <path> [--note TEXT]                  # single file, test ! -f
#   verify-gen.sh file-absent --tree <path>... [--note TEXT]        # a directory/tree, via `git ls-files`
#   verify-gen.sh contains <path> <literal> [--note TEXT]           # PASS = literal found
#   verify-gen.sh lacks <path> <literal> [--note TEXT]               # PASS = literal absent (zero-match safe)
#   verify-gen.sh zero-matches <literal> -- <path>... [--note TEXT]  # PASS = no file under any path matches
#   verify-gen.sh count-eq <n> <literal> [--files] -- <path>... [--note TEXT]
#   verify-gen.sh count-atleast <n> <literal> [--files] -- <path>... [--note TEXT]
#       # default: sums grep -c MATCHING-LINE counts across all given paths (grep -c counts lines that
#       # match, never raw occurrences -- three hits on one line still count as 1; put each occurrence on
#       # its own line if the check needs to count instances, not lines). --files: counts MATCHING FILES
#       # instead (grep -l | wc -l) — the shape a check like "N agent files mention X" actually needs.
#   verify-gen.sh heading <path> <heading-text> [--level N] [--note TEXT]
#   verify-gen.sh raw <cmd> [--note TEXT]   # escape hatch — still self-linted, never a silent bypass
#
# All PATTERN/literal arguments are LITERAL TEXT, never a regex the caller hand-writes — this script converts
# each one into a whitespace-tolerant, metacharacter-escaped ERE internally, so the caller never has to think
# about grep's own regex syntax or the whitespace-collapse gotcha above.
#
# Prints the finished `VERIFY: `cmd`` fragment on stdout and exits 0. Refuses (exit 1, message on stderr) when
# arguments are missing, or when the emitted command fails its own self-lint — never emits a line unchecked.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
. .claude/skills/grimorio.objective-harness/scripts/objective-lib.sh

die() { echo "" >&2; echo "verify-gen: $1" >&2; echo "" >&2; exit 1; }

# --- shell-safe single-quoting -------------------------------------------------------------------------
# NEVER double-quote a caller-controlled literal: a search string that itself contains a double quote breaks
# under nested double-quoting (gotcha 3). Single-quoting a string is safe for EVERY character except a single
# quote itself, which needs the standard '\'' escape (close the quote, an escaped literal quote, reopen it).
sq() {
  local s=$1
  printf "'%s'" "$(printf '%s' "$s" | sed "s/'/'\\\\''/g")"
}

# --- literal text -> a whitespace-tolerant, metacharacter-safe ERE --------------------------------------
# 1. Escape every ERE metacharacter so the literal matches itself, not as a pattern.
# 2. THEN collapse any run of whitespace into `[[:space:]]+` — gotcha 4: objective-lib.sh's own block-slurp
#    collapses runs of 2+ spaces to one when it extracts a VERIFY command from the objective file, so a literal
#    that needed an EXACT two-or-more-space match would silently stop matching once written into a real
#    objective, even though this script emitted it correctly. Matching "one or more spaces" instead of an exact
#    count survives that collapse either way — nothing about the search TARGET's own file needs to change.
to_ere_ws_tolerant() {
  # A raw embedded newline survives this function untouched: the whitespace-collapse substitution below runs
  # PER LINE (sed's own unit of work), so it can never fold a literal newline into the `[[:space:]]+` class the
  # way it folds a run of spaces or tabs -- the newline would land verbatim in the emitted command, breaking
  # the objective file's own one-VERIFY-per-line convention. Refused here, at the one function every literal
  # funnels through, rather than re-guarded at each call site.
  case "$1" in
    *$'\n'*) die "a literal argument may not contain a newline -- a VERIFY command must stay on one physical line. Got: $1" ;;
  esac
  # A literal backtick is refused for a DIFFERENT, more fundamental reason than the ERE-escaping this
  # function otherwise does: the VERIFY line itself is delimited by backticks in the objective file
  # (`` VERIFY: `cmd` ``), and objective-lib.sh's REAL extraction (obj_verify_commands, the tolerant
  # `grep -oE 'VERIFY:[ ]*`[^`]*`'`) stops at the FIRST backtick after the opening one -- an embedded
  # backtick is read as that closing delimiter and TRUNCATES the extracted command mid-string, no matter how
  # correctly this function escapes it as an ERE metacharacter. Escaping cannot fix this (the character
  # that's unsafe is the markdown delimiter, not the regex), so it is refused outright, same as the newline
  # above -- found live, code-reviewer cycle 2 (agent aa1c914881a6b190f), reproduced independently against
  # the real extraction pipeline (not a hand-rolled regex) before this fix landed.
  case "$1" in
    *'`'*) die "a literal argument may not contain a backtick -- the objective file's own VERIFY delimiter is a backtick, and an embedded one truncates the command when it is later extracted, however correctly this function escapes it as a regex character. Got: $1" ;;
  esac
  # Bracket-class member order is load-bearing: `]` must lead (else it closes the class early), and `[`
  # must never sit immediately before `.` (else GNU sed reads `[.` as the opener of a POSIX collating-symbol
  # construct `[. .]` and reports a bogus "unterminated `s' command" instead of matching a literal `[` `.`
  # pair) -- verified live: `[][.^$*+?(){}|\\]` breaks, `[][{}()+*?.^$|\\]` does not.
  printf '%s' "$1" \
    | sed -E 's/[][{}()+*?.^$|\\]/\\&/g' \
    | sed -E 's/[[:space:]]+/[[:space:]]+/g'
}

# --- self-verification: never emit a line this project's own linter would flag -----------------------
# Writes the candidate VERIFY line into a throwaway fixture objective (the same shape lint-objective.sh
# already reads) and runs the real lint-objective.sh CLI against it — never re-implements its detection logic.
selflint() {
  local cmd=$1 tmpdir fixture rc
  tmpdir=$(mktemp -d) || die "could not create a scratch dir to self-lint the generated command."
  # NOT `trap ... RETURN`: a RETURN trap set inside one function stays armed for every LATER function
  # return in this same shell, not just this one's — it fired a second time when the caller (emit) itself
  # returned, by which point $tmpdir had already gone out of scope, aborting under `set -u` with
  # "tmpdir: unbound variable" even on a fully successful run. Cleaned up explicitly on every exit path
  # below instead.
  fixture="$tmpdir/selflint.md"
  {
    echo "# Objective — verify-gen self-lint fixture"
    echo ""
    echo "**Branch:** fixture"
    echo "**Base:** develop"
    echo ""
    echo "## Checks"
    echo ""
    printf -- "- [ ] C1 generated check — VERIFY: \`%s\`\n" "$cmd"
    echo ""
    echo "## Out of scope"
    echo ""
    echo '```paths'
    echo '```'
    echo ""
    echo "## Feature line"
    echo ""
    echo "placeholder"
  } > "$fixture"
  bash .claude/skills/grimorio.objective-harness/scripts/lint-objective.sh "$fixture" >"$tmpdir/lint-out.txt" 2>&1
  rc=$?
  if [ "$rc" -ne 0 ]; then
    echo "verify-gen: REFUSED — the command this call would have emitted fails this project's own lint-objective.sh:" >&2
    cat "$tmpdir/lint-out.txt" >&2
    rm -rf "$tmpdir"
    return 1
  fi
  rm -rf "$tmpdir"
  return 0
}

# --- emit: self-lint, then print the canonical fragment -------------------------------------------------
emit() {
  local cmd=$1 note=${2:-}
  # A FINAL, universal backstop against an embedded backtick or newline, applied to the fully-assembled
  # command rather than only to an individual literal argument -- this is the one choke point every type
  # funnels through, INCLUDING `raw`, which never passes through to_ere_ws_tolerant()'s own guard at all
  # (found live, code-reviewer cycle 2, aa1c914881a6b190f: raw was completely unguarded against both
  # characters). Either one corrupts objective-lib.sh's own backtick-delimited extraction of the VERIFY
  # line -- a backtick by truncating the command mid-string at the first embedded backtick, a newline by
  # splitting one VERIFY onto two physical lines -- no escaping fixes either, since the character that's
  # unsafe belongs to the markdown delimiter, not to any regex this script controls.
  case "$cmd" in
    *'`'*) die "the assembled command contains a backtick, which would truncate this VERIFY line's own extraction from the objective file. Command was: $cmd" ;;
    *$'\n'*) die "the assembled command contains a newline, which would split this VERIFY line across more than one physical line. Command was: $cmd" ;;
  esac
  selflint "$cmd" || exit 1
  if [ -n "$note" ]; then
    printf 'VERIFY: `%s` (note: %s)\n' "$cmd" "$note"
  else
    printf 'VERIFY: `%s`\n' "$cmd"
  fi
}

[ $# -ge 1 ] || die "no check type given. Types: file-exists file-absent contains lacks zero-matches count-eq count-atleast heading raw."
type=$1; shift

note=""
# Pull a trailing --note out of the remaining args wherever it sits, leaving positional args in order.
args=()
while [ $# -gt 0 ]; do
  case "$1" in
    --note) note=${2:-}; shift 2 ;;
    *) args+=("$1"); shift ;;
  esac
done
set -- "${args[@]}"  # requires bash >= 4.4: an empty array expands to ZERO words here, not one empty
                      # word, under `set -u` — matches this project's own bash (verified: 4.4.23)

case "$type" in

  file-exists)
    [ $# -eq 1 ] || die "file-exists takes exactly one <path>."
    emit "test -f $(sq "$1") && echo PASS" "$note"
    ;;

  file-absent)
    if [ "${1:-}" = "--tree" ]; then
      shift
      [ $# -ge 1 ] || die "file-absent --tree needs one or more <path> arguments."
      paths=""
      for p in "$@"; do paths="$paths $(sq "$p")"; done
      emit "test -z \"\$(git ls-files --$paths)\" && echo PASS" "$note"
    else
      [ $# -eq 1 ] || die "file-absent takes exactly one <path> (or --tree <path>... for a directory)."
      emit "test ! -f $(sq "$1") && echo PASS" "$note"
    fi
    ;;

  contains)
    [ $# -eq 2 ] || die "contains takes <path> <literal>."
    pat=$(to_ere_ws_tolerant "$2") || exit 1
    emit "test -n \"\$(grep -E -- $(sq "$pat") $(sq "$1"))\" && echo PASS" "$note"
    ;;

  lacks)
    [ $# -eq 2 ] || die "lacks takes <path> <literal>."
    pat=$(to_ere_ws_tolerant "$2") || exit 1
    emit "test -z \"\$(grep -E -- $(sq "$pat") $(sq "$1"))\" && echo PASS" "$note"
    ;;

  zero-matches)
    [ $# -ge 1 ] || die "zero-matches takes <literal> -- <path>..."
    lit=$1; shift
    [ "${1:-}" = "--" ] && shift
    [ $# -ge 1 ] || die "zero-matches needs one or more <path> arguments after --."
    pat=$(to_ere_ws_tolerant "$lit") || exit 1
    paths=""
    for p in "$@"; do paths="$paths $(sq "$p")"; done
    emit "test -z \"\$(grep -rlE -- $(sq "$pat")$paths)\" && echo PASS" "$note"
    ;;

  count-eq|count-atleast)
    op="-eq"; [ "$type" = "count-atleast" ] && op="-ge"
    [ $# -ge 2 ] || die "$type takes <n> <literal> [--files] -- <path>..."
    n=$1; shift
    case "$n" in ''|*[!0-9]*) die "$type's <n> must be a non-negative integer, got: $n" ;; esac
    lit=$1; shift
    files_mode=0
    [ "${1:-}" = "--files" ] && { files_mode=1; shift; }
    [ "${1:-}" = "--" ] && shift
    [ $# -ge 1 ] || die "$type needs one or more <path> arguments after --."
    pat=$(to_ere_ws_tolerant "$lit") || exit 1
    paths=""
    for p in "$@"; do paths="$paths $(sq "$p")"; done
    if [ "$files_mode" -eq 1 ]; then
      emit "test \"\$(grep -lE -- $(sq "$pat")$paths | wc -l)\" $op $n && echo PASS" "$note"
    else
      # Occurrence count SUMMED across every path: `grep -c` given several file operands prints one count
      # PER FILE, never a total, so the paths are concatenated on stdin first and counted once.
      emit "test \"\$(cat --$paths | grep -cE -- $(sq "$pat"))\" $op $n && echo PASS" "$note"
    fi
    ;;

  heading)
    [ $# -ge 2 ] || die "heading takes <path> <heading-text> [--level N]."
    path=$1; heading_text=$2; shift 2
    level=""
    if [ "${1:-}" = "--level" ]; then
      level=${2:-}
      case "$level" in ''|*[!0-9]*) die "--level must be a positive integer, got: $level" ;; esac
      shift 2
    fi
    pat=$(to_ere_ws_tolerant "$heading_text") || exit 1
    if [ -n "$level" ]; then
      hashes="^#{$level}[[:space:]]+$pat"
    else
      hashes="^#+[[:space:]]+$pat"
    fi
    emit "test -n \"\$(grep -E -- $(sq "$hashes") $(sq "$path"))\" && echo PASS" "$note"
    ;;

  raw)
    [ $# -ge 1 ] || die "raw takes <cmd> as one argument (quote it as one shell word when calling this script)."
    emit "$1" "$note"
    ;;

  *)
    die "unknown check type: $type. Types: file-exists file-absent contains lacks zero-matches count-eq count-atleast heading raw."
    ;;
esac
