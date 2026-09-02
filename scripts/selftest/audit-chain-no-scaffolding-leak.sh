#!/usr/bin/env bash
# Falsification test for `node scripts/audit-chain.mjs --no-scaffolding-leak [filter]` (the
# scaffolding-in-the-reader's-path gate, defect (a) mechanism). Every case is a sandbox built fresh in
# mktemp -d, with its OWN .claude/agents/ + .claude/skills/ -- this suite never reads the live .claude/ tree.
#
# MECHANICAL FACT, inherited from the sibling suite (audit-chain-diagram-primacy.sh) and RE-VERIFIED live for
# this flag specifically: audit-chain.mjs builds a BASENAMES index at module load, unconditionally, via
# `execFileSync("git", ["ls-files"], ...)` -- this runs for EVERY flag, and throws "fatal: not a git
# repository" if the CWD is not inside a git repo. A bare mktemp -d sandbox is NOT a git repo, so every
# sandbox below runs `git init -q` before invoking the script.
#
# BAD-CASE FIRST (case 1 below): the mechanism is proven by first running it against a fixture that
# REPRODUCES the real incident shape (the literal "## Artifact types considered and SCOPED OUT" heading found
# in designs/platform/spend-api/00-index.md) and observing FAIL, before trusting this check catches anything.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
AUDIT="$ROOT/scripts/audit-chain.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

write_skill_doc() {
  local dir="$1" rel="$2" content="$3"
  mkdir -p "$dir/.claude/skills/$(dirname "$rel")"
  printf '%s\n' "$content" > "$dir/.claude/skills/$rel"
}

new_sandbox() {
  rm -rf "$1"; mkdir -p "$1/.claude/agents"
  (cd "$1" && git init -q) >/dev/null 2>&1
}

run() {
  local out code
  out="$(cd "$1" && node "$AUDIT" --no-scaffolding-leak 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

# 1. BAD-CASE FIRST -- reproduces the real incident: a "SCOPED OUT" heading, exactly the shape found live in
#    designs/platform/spend-api/00-index.md before this mechanism existed -> exit 1, a FAIL line naming the
#    fixture and quoting "scoped out" as the matched marker.
new_sandbox "$T/case1"
write_skill_doc "$T/case1" "probe/00-index.md" '# Some Design — AS-IS

## Artifact types considered and SCOPED OUT (the completeness gate'"'"'s hidden demands, dispositioned here)

| Type | Disposition | Reason |
| --- | --- | --- |
| Kruchten 4+1 | N/A | single web-layer read surface |'
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "BAD-CASE (real incident shape) -> exit 1" "1" "$EXIT1"
FAILLINE1="$(echo "$OUT1" | grep -q '^FAIL.*00-index\.md' && echo yes || echo no)"
a "BAD-CASE fixture -> stdout has a FAIL line naming it" "yes" "$FAILLINE1"
MARKER1="$(echo "$OUT1" | grep '^FAIL.*00-index\.md' | grep -q '"scoped out"' && echo yes || echo no)"
a "BAD-CASE fixture -> FAIL line quotes the matched marker" "yes" "$MARKER1"

# 2. CLEAN fixture -- an ordinary file with no scaffolding vocabulary anywhere -> exit 0, a PASS line.
new_sandbox "$T/case2"
write_skill_doc "$T/case2" "probe/01-context.md" '# Context & Scope

This surface depends on the wallet repository and reads its balance.'
OUT2="$(run "$T/case2")"
EXIT2="$(echo "$OUT2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "CLEAN fixture -> exit 0" "0" "$EXIT2"
PASSLINE2="$(echo "$OUT2" | grep -q '^PASS.*01-context\.md' && echo yes || echo no)"
a "CLEAN fixture -> stdout has a PASS line naming it" "yes" "$PASSLINE2"

# 3. PROVENANCE-EXEMPT, basename -- a file named provenance.md carrying the SAME "SCOPED OUT" heading as
#    case 1 -> exit 0, an EXEMPT line naming it, NEVER a FAIL line for it.
new_sandbox "$T/case3"
write_skill_doc "$T/case3" "probe/provenance.md" '# Provenance

## Artifact types considered and SCOPED OUT (the completeness gate'"'"'s hidden demands, dispositioned here)

| Type | Disposition | Reason |
| --- | --- | --- |
| Kruchten 4+1 | N/A | single web-layer read surface |'
OUT3="$(run "$T/case3")"
EXIT3="$(echo "$OUT3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "PROVENANCE-EXEMPT (basename) fixture -> exit 0" "0" "$EXIT3"
EXEMPTLINE3="$(echo "$OUT3" | grep -q '^EXEMPT.*provenance\.md' && echo yes || echo no)"
a "PROVENANCE-EXEMPT (basename) fixture -> stdout has an EXEMPT line naming it" "yes" "$EXEMPTLINE3"
NOFAIL3="$(echo "$OUT3" | grep -q '^FAIL' && echo yes || echo no)"
a "PROVENANCE-EXEMPT (basename) fixture -> NEVER a FAIL line" "no" "$NOFAIL3"

# 4. PROVENANCE-EXEMPT, first-heading -- an ordinary filename whose FIRST heading reads "# Provenance",
#    carrying scaffolding vocabulary in its body -> exit 0, EXEMPT line, never FAIL.
new_sandbox "$T/case4"
write_skill_doc "$T/case4" "probe/notes.md" '# Provenance

This file records the completeness gate'"'"'s own hidden demands: DDD aggregate coverage was scoped out.'
OUT4="$(run "$T/case4")"
EXIT4="$(echo "$OUT4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "PROVENANCE-EXEMPT (first-heading) fixture -> exit 0" "0" "$EXIT4"
EXEMPTLINE4="$(echo "$OUT4" | grep -q '^EXEMPT.*notes\.md' && echo yes || echo no)"
a "PROVENANCE-EXEMPT (first-heading) fixture -> stdout has an EXEMPT line naming it" "yes" "$EXEMPTLINE4"
NOFAIL4="$(echo "$OUT4" | grep -q '^FAIL' && echo yes || echo no)"
a "PROVENANCE-EXEMPT (first-heading) fixture -> NEVER a FAIL line" "no" "$NOFAIL4"

# 5. MULTIPLE MARKERS, ONE FILE -- a file containing BOTH "Kruchten 4+1" and "DDD aggregate" text -> exit 1,
#    a FAIL line whose own detail lists BOTH markers, never only the first one found.
new_sandbox "$T/case5"
write_skill_doc "$T/case5" "probe/multi.md" '# Multi-Marker Doc

The Kruchten 4+1 views were not produced. No DDD aggregate exists for this surface.'
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "MULTIPLE MARKERS fixture -> exit 1" "1" "$EXIT5"
BOTH5="$(echo "$OUT5" | grep '^FAIL.*multi\.md' | grep -q 'kruchten 4+1' && echo "$OUT5" | grep '^FAIL.*multi\.md' | grep -q 'ddd aggregate' && echo yes || echo no)"
a "MULTIPLE MARKERS fixture -> FAIL line lists BOTH markers" "yes" "$BOTH5"

# 6. ZERO-MATCH FILTER GUARD -- a filter matching zero files -> exit 2, the same guard shape the sibling
#    flags (--diagram-primacy, --graph-first, --examples) already carry.
new_sandbox "$T/case6"
write_skill_doc "$T/case6" "probe/clean.md" '# Clean

Nothing scaffolding-shaped here.'
OUT6="$(cd "$T/case6" && node "$AUDIT" --no-scaffolding-leak no-such-filter-xyz 2>&1; echo "EXIT:$?")"
EXIT6="$(echo "$OUT6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "ZERO-MATCH FILTER GUARD -> exit 2" "2" "$EXIT6"

# 7. NEW MARKER COVERAGE (Finding-01 broadening) -- a file containing the newly added marker "OMIT-WITH-REASON"
#    as part of a paraphrased scaffolding disposition -> exit 1, a FAIL line naming the fixture and quoting
#    one of the three new markers ("omit-with-reason", "against the catalog", or "phase 4 disposition").
new_sandbox "$T/case7"
write_skill_doc "$T/case7" "probe/02-design.md" '# Design & Components

## Artifact selection: this concern was OMIT-with-reason against the catalog, per Phase 4 disposition

The following concerns were ruled out in the design charter.'
OUT7="$(run "$T/case7")"
EXIT7="$(echo "$OUT7" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "NEW MARKER COVERAGE (paraphrased scaffolding) -> exit 1" "1" "$EXIT7"
FAILLINE7="$(echo "$OUT7" | grep -q '^FAIL.*02-design\.md' && echo yes || echo no)"
a "NEW MARKER COVERAGE fixture -> stdout has a FAIL line naming it" "yes" "$FAILLINE7"
MARKER7="$(echo "$OUT7" | grep '^FAIL.*02-design\.md' | grep -q '"omit-with-reason"\|"against the catalog"\|"phase 4 disposition"' && echo yes || echo no)"
a "NEW MARKER COVERAGE fixture -> FAIL line quotes one of the three new markers" "yes" "$MARKER7"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
