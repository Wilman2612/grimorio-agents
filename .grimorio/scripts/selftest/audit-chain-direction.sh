#!/usr/bin/env bash
# Falsification test for `node .grimorio/scripts/audit-chain.mjs --direction` (the DEPENDENCY-DIRECTION hard rule:
# a `grimorio.`-prefixed file must never cite `project.`-level content; the reverse is always fine).
# agent-writing/SKILL.md's own new section, "The general/project boundary is also legible in NAMES", Part
# 3, states the rule this flag mechanizes.
#
# BUG-FIRST: before `--direction` existed, this exact RED fixture (case 1 below) had NO way to be caught
# -- `node .grimorio/scripts/audit-chain.mjs --direction` against the OLD script (no such flag registered) falls
# through to the unconditional summary printer and exits 0 regardless of the fixture's content, so a real
# public->private citation shipped invisibly. Verified live while writing this suite: `git stash` the
# `--direction` addition to .grimorio/scripts/audit-chain.mjs, re-run case 1 below unmodified, watch it print the
# summary block (no violation line, exit 0) instead of the expected exit-1 violation report; `git stash
# pop` restores the flag and the same fixture goes green against the assertions below. That manual
# before/after run is the RED-then-GREEN proof; this file asserts only the AFTER (current) behaviour, same
# as every other flag-selftest in this suite -- there is no "old script" left to assert against once the
# flag has shipped for good.
#
# Every case runs inside a fresh `mktemp -d` sandbox with its OWN `.claude/skills/` tree -- this suite
# never reads the live corpus. Same mktemp-sandbox technique as the closest existing precedent,
# .grimorio/scripts/selftest/audit-chain-portability.sh (read there for the two MECHANICAL FACTS about
# audit-chain.mjs's CWD-relative roots and its unconditional `git ls-files` BASENAMES index, both apply
# here unchanged and are not restated).
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
AUDIT="$ROOT/.grimorio/scripts/audit-chain.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

# write_skill_file <dir> <skill-folder> <filename> <content>
write_skill_file() {
  local dir="$1" skill="$2" name="$3" content="$4"
  mkdir -p "$dir/.claude/skills/$skill"
  printf '%s\n' "$content" > "$dir/.claude/skills/$skill/$name"
}

# new_sandbox <dir> -- fresh dir, made a real git repo (audit-chain.mjs's BASENAMES index runs
# unconditionally at module load and throws outside a git repo -- same fact case 2 of the sibling
# portability suite documents).
new_sandbox() {
  rm -rf "$1"; mkdir -p "$1"
  (cd "$1" && git init -q) >/dev/null 2>&1
}

# run <sandbox-dir> -- cd into it and invoke the REAL script by absolute path; prints combined
# stdout+stderr followed by a trailing EXIT:<code> line, same convention as the sibling suite.
run() {
  local out code
  out="$(cd "$1" && node "$AUDIT" --direction 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

# 1. RED -- a `grimorio.`-prefixed skill's SKILL.md cites a project.-prefixed path (not the bare
#    self-reference form) outside a fenced block -> exit 1, output names the fixture file and the token.
new_sandbox "$T/case1"
write_skill_file "$T/case1" "grimorio.developer-memory" "SKILL.md" '# Developer Memory

For this specific codebase'"'"'s traps, read project.traps.md directly instead of the general pattern.'
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "RED fixture (project.traps.md token) -> exit 1" "1" "$EXIT1"
NAMES1="$(echo "$OUT1" | grep -q "grimorio.developer-memory/SKILL.md" && echo yes || echo no)"
a "RED fixture -> output names the file" "yes" "$NAMES1"
TOKEN1="$(echo "$OUT1" | grep -q "project.traps.md" && echo yes || echo no)"
a "RED fixture -> output names the offending token" "yes" "$TOKEN1"

# 2. GREEN -- a `grimorio.`-prefixed skill's SKILL.md carries clean, fully general prose, no project.
#    token anywhere (not even the word "project." as an ordinary English sentence-ender) -> exit 0, zero
#    violation rows.
new_sandbox "$T/case2"
write_skill_file "$T/case2" "grimorio.javascript" "SKILL.md" '# JavaScript

Language-level standards for any project. Naming, async, structure limits -- nothing here is tied to
one specific codebase or one specific project.'
OUT2="$(run "$T/case2")"
EXIT2="$(echo "$OUT2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "GREEN fixture -> exit 0" "0" "$EXIT2"
ROWS2="$(echo "$OUT2" | grep -c 'cites project.-level content')"
a "GREEN fixture -> zero violation rows (ordinary sentence-ending \"project.\" never matches)" "0" "$ROWS2"

# 3. EXEMPTION -- the same skill's SKILL.md points to its OWN sibling project.md as a BARE filename ->
#    NOT a violation, exit 0. A second file in the SAME sandbox, a project.-level companion file that
#    itself lives inside the grimorio.-prefixed folder, pointing INTO a DIFFERENT skill folder's
#    project.md by a qualified path -> IS a violation (case 3b), proving the exemption is narrow (bare
#    filename only), not "any project.md mention anywhere".
new_sandbox "$T/case3"
write_skill_file "$T/case3" "grimorio.developer-memory" "SKILL.md" '# Developer Memory

For this project'"'"'s own known traps, read project.md — the skill'"'"'s own project index.'
OUT3="$(run "$T/case3")"
EXIT3="$(echo "$OUT3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "EXEMPTION fixture (bare project.md self-reference) -> exit 0" "0" "$EXIT3"
ROWS3="$(echo "$OUT3" | grep -c 'cites project.-level content')"
a "EXEMPTION fixture -> zero violation rows" "0" "$ROWS3"

new_sandbox "$T/case3b"
write_skill_file "$T/case3b" "grimorio.developer-memory" "SKILL.md" '# Developer Memory

See grimorio.javascript/project.md for that language'"'"'s own project notes instead.'
OUT3B="$(run "$T/case3b")"
EXIT3B="$(echo "$OUT3B" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "project.md reference INTO a different skill folder (qualified path) -> exit 1, not exempt" "1" "$EXIT3B"
ROWS3B="$(echo "$OUT3B" | grep -c 'cites project.-level content')"
a "cross-folder project.md reference -> exactly one violation row" "1" "$ROWS3B"

# 4. FENCED CODE is never scanned -- the same RED token, but inside a fenced block, is not a violation.
new_sandbox "$T/case4"
write_skill_file "$T/case4" "grimorio.javascript" "SKILL.md" '# JavaScript

```
// example only, not a real citation: project.traps.md
```'
OUT4="$(run "$T/case4")"
EXIT4="$(echo "$OUT4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "RED token inside a fenced code block -> exit 0 (never scanned)" "0" "$EXIT4"

# 5. A project.*.md companion file itself, living inside the SAME grimorio.-prefixed skill folder, is
#    STILL in scope (its own path's first segment is the grimorio.-prefixed FOLDER, per this flag's own
#    documented scope) -- confirms scope is folder-first-segment, not the file's own basename.
new_sandbox "$T/case5"
write_skill_file "$T/case5" "grimorio.developer-memory" "project.traps.md" 'A trap. See grimorio.python/project.traps.md for the equivalent in that language.'
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "a project.*.md companion file inside a grimorio.-prefixed folder is still in scope -> exit 1" "1" "$EXIT5"

# 6. WELL-FORMED REFERENCE EXEMPTION (added 2026-08-28, same-day fix to the exemption boundary the
#    corpus restructure surfaced -- the original exemption only ever covered the bare literal
#    "project.md", never any OTHER project.<x> companion file reached through a real ref:/import:/
#    agent:/cite:/relative pointer, which the restructure made the dominant shape overnight: 917 of
#    917 real-corpus hits were this shape, none a genuine inlined fact). Four sub-cases, each isolating
#    ONE recognized reference form -- proves the fix is the reference form, not merely "any project.
#    mention that also happens to look like a path".
new_sandbox "$T/case6"
write_skill_file "$T/case6" "grimorio.developer-memory" "SKILL.md" '# Developer Memory

For this codebase'"'"'s traps: ref:skill/grimorio.developer-memory/project.traps.md
Or via import: import:skill/grimorio.developer-memory/project.traps.md
The critic to raise for this is agent:project.brush-critic.
Deeper, in the same skill: -> deeper: ./project.traps.md'
OUT6="$(run "$T/case6")"
EXIT6="$(echo "$OUT6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "WELL-FORMED ref:/import:/agent:/relative pointers to project.<x> -> exit 0, none flagged" "0" "$EXIT6"
ROWS6="$(echo "$OUT6" | grep -c 'cites project.-level content')"
a "WELL-FORMED pointers -> zero violation rows" "0" "$ROWS6"

# 6b. The SAME token, same file, but with NO reference prefix at all -- a bare inlined mention sitting
#     in ordinary prose -- is still flagged. Proves the widened exemption did not silently swallow a
#     real leak: only the REFERENCE FORM is exempt, never "any project.<x> token that also resolves".
new_sandbox "$T/case6b"
write_skill_file "$T/case6b" "grimorio.developer-memory" "SKILL.md" '# Developer Memory

For this codebase'"'"'s traps, the retry cap is documented in project.traps.md directly.'
OUT6B="$(run "$T/case6b")"
EXIT6B="$(echo "$OUT6B" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "bare project.<x> mention with NO reference prefix -> still exit 1 (exemption did not over-widen)" "1" "$EXIT6B"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
