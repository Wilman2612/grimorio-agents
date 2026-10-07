#!/usr/bin/env bash
# Falsification test for `node .grimorio/scripts/audit-chain.mjs --portability` (the PROJECT-MARKER proxy gate).
# Every case is a sandbox built fresh in mktemp -d, with its OWN .claude/agents/ -- this suite never
# reads the live .claude/agents/; that integration coverage is the objective's own live re-run of
# `node .grimorio/scripts/audit-chain.mjs --portability` from the real worktree root, done separately, not here.
#
# MECHANICAL FACT #1: audit-chain.mjs's roots (`const roots = [".claude/agents", ".claude/skills"];`)
# are relative to the CWD the script is invoked FROM -- there is no root-override flag or env var. So
# each case `cd`s into its own sandbox and invokes the REAL script by its ABSOLUTE path from there.
#
# MECHANICAL FACT #2, found empirically while writing this suite (not assumed): audit-chain.mjs builds
# a BASENAMES index at module load, unconditionally, via `execFileSync("git", ["ls-files"], ...)` --
# this runs for EVERY flag, including --portability, and throws "fatal: not a git repository" if the
# CWD is not inside a git repo. A bare mktemp -d sandbox is NOT a git repo, so every sandbox below runs
# `git init -q` before invoking the script. Verified live: without it, all three cases below fail with
# a git error, not with the assertion each is meant to test -- that would have been a vacuously-passing
# (or vacuously-failing-for-the-wrong-reason) suite, exactly what this file exists to avoid.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
AUDIT="$ROOT/.grimorio/scripts/audit-chain.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

# write_agent <dir> <filename> <content> -- unlike the sibling suite's write_agent (fixed frontmatter +
# fixed body), the marker under test can live in the description OR the body, so the whole file content
# is caller-supplied.
write_agent() {
  local dir="$1" name="$2" content="$3"
  mkdir -p "$dir/.claude/agents"
  printf '%s\n' "$content" > "$dir/.claude/agents/$name"
}

# new_sandbox <dir> -- fresh dir, made a real git repo (mechanical fact #2 above), nothing committed
# (git ls-files on an uncommitted repo just returns empty, which is fine -- audit-chain.mjs's own
# BASENAMES index is unrelated to the --portability scan itself).
new_sandbox() {
  rm -rf "$1"; mkdir -p "$1"
  (cd "$1" && git init -q) >/dev/null 2>&1
  # MECHANICAL FACT #3: the marker list is the ADOPTER'S DECLARATION now, read from the sandbox's OWN repo
  # root -- it used to be hardcoded inside audit-chain.mjs. A sandbox that does not seed it runs a detector
  # with NO patterns, which passes everything: that is how this suite first reported its own RED case clean.
  mkdir -p "$1/scripts/export"
  # COPY the real declaration, never a hand-written twin: a duplicate drifts (this seed first carried
  # three patterns while case 5 exercises a fourth) and writing JSON backslashes through printf produced
  # a literal BACKSPACE, the same silent-zero this corpus has now paid for three times.
  cp "$ROOT/scripts/export/project.export-markers.json" "$1/scripts/export/project.export-markers.json"
}

# run <sandbox-dir> -- cd into it and invoke the REAL script by absolute path; prints combined
# stdout+stderr followed by a trailing EXIT:<code> line, same convention as the sibling suite.
run() {
  local out code
  out="$(cd "$1" && node "$AUDIT" --portability 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

# 1. RED -- a fixture shell with an arena marker (FastAPI in the description, apps/web in the body) ->
#    exit 1, output names the fixture file.
new_sandbox "$T/case1"
write_agent "$T/case1" "some-developer.md" '---
name: some-developer
description: "Builds features on a FastAPI-based backend service."
model: sonnet
---

Wires the frontend under apps/web to that backend.'
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "RED fixture (FastAPI+apps/web) -> exit 1" "1" "$EXIT1"
NAMES1="$(echo "$OUT1" | grep -q "some-developer.md" && echo yes || echo no)"
a "RED fixture -> output names the file" "yes" "$NAMES1"
MARKS1="$(echo "$OUT1" | grep -q 'project-marker in a portable file' && echo yes || echo no)"
a "RED fixture -> output names the violation row" "yes" "$MARKS1"

# 2. GREEN -- a fixture shell with clean, fully generic prose, no arena marker anywhere -> exit 0, zero
#    violation rows (only the two summary lines).
new_sandbox "$T/case2"
write_agent "$T/case2" "clean-developer.md" '---
name: clean-developer
description: "Builds features for a generic web application using standard engineering practices."
model: sonnet
---

This shell writes ordinary application code, follows clean architecture, and reviews its own diffs
before handing them back. Nothing here names a specific product, stack, or framework.'
OUT2="$(run "$T/case2")"
EXIT2="$(echo "$OUT2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "GREEN fixture -> exit 0" "0" "$EXIT2"
ROWS2="$(echo "$OUT2" | grep -c 'project-marker in a portable file')"
a "GREEN fixture -> zero violation rows" "0" "$ROWS2"

# 3. EXEMPTION -- a file literally named project.*.md carrying a project marker -> exit 0 (project.*
#    shells are explicitly exempt -- the 6 renamed critics are project-specific by nature, CEO ruling).
new_sandbox "$T/case3"
write_agent "$T/case3" "project.some-critic.md" '---
name: project.some-critic
description: "Critiques apps/web changes for this project specifically."
model: opus
---

Mentions apps/web again here, on purpose -- this file is exempt, not clean.'
OUT3="$(run "$T/case3")"
EXIT3="$(echo "$OUT3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "EXEMPTION fixture (project.*.md) -> exit 0" "0" "$EXIT3"
ROWS3="$(echo "$OUT3" | grep -c 'project-marker in a portable file')"
a "EXEMPTION fixture -> zero violation rows (scanned count also drops to 0)" "0" "$ROWS3"

# 4. ANTI-VACUOUS-GREEN -- the same case-1 assertions (exit code, filename in output), run against a
#    sandbox whose .claude/agents/ exists but is EMPTY (the RED fixture never got written -- simulates
#    the fixture-authoring step silently failing). If this reported the SAME PASS case 1 reports, case
#    1's own assertions would be decorative -- unable to tell a real marker match from nothing at all.
#    This is the live falsification the objective asked for: run it, watch it actually differ from
#    case 1, not just assert that it would.
new_sandbox "$T/case4"
mkdir -p "$T/case4/.claude/agents"   # empty -- no fixture file written, on purpose
OUT4="$(run "$T/case4")"
EXIT4="$(echo "$OUT4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "empty .claude/agents/ -> exit 0 (never the RED case's exit 1)" "0" "$EXIT4"
NAMES4="$(echo "$OUT4" | grep -q "some-developer.md" && echo yes || echo no)"
a "empty .claude/agents/ -> output does NOT name case 1's fixture" "no" "$NAMES4"
ROWS4="$(echo "$OUT4" | grep -c 'project-marker in a portable file')"
a "empty .claude/agents/ -> zero violation rows" "0" "$ROWS4"

# write_skill_file <dir> <relpath-under-.claude/skills/> <content> -- for the WIDENED population (2026-09-01):
# behavior.md/SKILL.md/phase-N-*.md files, never the thin agent shell.
write_skill_file() {
  local dir="$1" relpath="$2" content="$3"
  mkdir -p "$dir/.claude/skills/$(dirname "$relpath")"
  printf '%s\n' "$content" > "$dir/.claude/skills/$relpath"
}

# 5. WIDENED-RED -- a behavior.md fixture (never an agent shell) carrying a marker INSIDE an UNLABELED
#    fence -- the exact shape the js-developer-memory incident that motivated this widening actually had
#    (an ASCII "ALLOWED/FORBIDDEN" scope-boundary block). Before the widening, this population was never
#    scanned at all; before the unlabeled-fence fix, this exact shape was invisible even once scanned.
new_sandbox "$T/case5"
write_skill_file "$T/case5" "grimorio.some-memory/behavior.md" '# Some Developer -- Behavior

## Scope Boundary

```
ALLOWED: application/** and infrastructure/** inside this project'"'"'s web app.
```
'
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "WIDENED-RED behavior.md, marker in an UNLABELED fence -> exit 1" "1" "$EXIT5"
NAMES5="$(echo "$OUT5" | grep -q "grimorio.some-memory/behavior.md" && echo yes || echo no)"
a "WIDENED-RED -> output names the behavior.md file (not an agent shell)" "yes" "$NAMES5"

# 6. WIDENED-GREEN-TAGGED-FENCE -- the SAME marker, but inside a LANGUAGE-TAGGED fence (```ts) -- a
#    genuine code example, still skipped exactly like the pre-existing mermaid-only exemption, now
#    generalized to every tagged language.
new_sandbox "$T/case6"
write_skill_file "$T/case6" "grimorio.some-memory/behavior.md" '# Some Developer -- Behavior

## Worked example

```ts
// application/** lives here in a real project, for illustration only.
```
'
OUT6="$(run "$T/case6")"
EXIT6="$(echo "$OUT6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "WIDENED-GREEN tagged fence (\`\`\`ts) -> exit 0" "0" "$EXIT6"

# 7. WIDENED-EXCLUDED-DOCS -- the SAME marker, in an UNLABELED fence, but nested under docs/ with a
#    basename that happens to end "-behavior.md" -- a research-archive file, deliberately OUTSIDE this
#    population (grimorio.documentation-memory's own domain), proving the population filter is DEPTH-aware
#    (direct child of the skill root, or one level inside a *-phases/ folder), never a basename-only match.
new_sandbox "$T/case7"
write_skill_file "$T/case7" "grimorio.some-memory/docs/rescued-design-unit-behavior.md" '# Rescued research note

```
application/** was the concrete decision, kept here for the historical record only.
```
'
OUT7="$(run "$T/case7")"
EXIT7="$(echo "$OUT7" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "WIDENED-EXCLUDED docs/*-behavior.md (nested, research archive) -> exit 0" "0" "$EXIT7"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
