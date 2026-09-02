#!/usr/bin/env bash
# Falsification test for `node scripts/audit-chain.mjs --as-is-voice [filter]` (the build-relative-framing-
# in-an-AS-IS gate, defect (b) mechanism). Every case is a sandbox built fresh in mktemp -d, with its OWN
# .claude/agents/ + .claude/skills/. Same BASENAMES-index-needs-a-git-repo mechanical fact as the sibling
# suites (audit-chain-diagram-primacy.sh, audit-chain-no-scaffolding-leak.sh) -- every sandbox runs
# `git init -q` first.
#
# BAD-CASE FIRST (case 1 below): the mechanism is proven by reproducing the real incident shape (a literal
# "## Reused UNCHANGED" heading found in designs/platform/spend-api/01-context-and-scope.md) inside a family
# ALSO carrying the AS-IS-ONLY marker, and observing FAIL, before trusting this check catches anything.
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

# run <sandbox-dir> -- no filter, so the whole sandbox (== one family, one directory) is scanned together.
run() {
  local out code
  out="$(cd "$1" && node "$AUDIT" --as-is-voice 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

MARKER='AS-IS-ONLY — dependencies-as-they-are voice; reuse/build framing FORBIDDEN.'

# 1. BAD-CASE FIRST -- two files in the SAME family: 00-index.md carries the AS-IS-ONLY marker, 01-context.md
#    carries the real incident's own "## Reused UNCHANGED" heading -> exit 1, a FAIL line naming
#    01-context.md specifically; 00-index.md itself PASSES (it carries the marker, not the forbidden
#    vocabulary).
new_sandbox "$T/case1"
write_skill_doc "$T/case1" "probe/00-index.md" "# Spend API — AS-IS Design

${MARKER}"
write_skill_doc "$T/case1" "probe/01-context.md" '# Context & Scope

## Reused UNCHANGED (named, not re-described here)

| Reused component | Role |
| --- | --- |
| withScopedAuth | the auth wrapper stack |'
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "BAD-CASE (real incident shape) -> exit 1" "1" "$EXIT1"
FAILLINE1="$(echo "$OUT1" | grep -q '^FAIL.*01-context\.md' && echo yes || echo no)"
a "BAD-CASE fixture -> FAIL line names 01-context.md" "yes" "$FAILLINE1"
PASSLINE1="$(echo "$OUT1" | grep -q '^PASS.*00-index\.md' && echo yes || echo no)"
a "BAD-CASE fixture -> 00-index.md (the marker-carrier) itself PASSES" "yes" "$PASSLINE1"

# 2. NO MARKER, VOCABULARY PRESENT ANYWAY -- a family with "## Reused UNCHANGED" text but NO AS-IS-ONLY
#    marker anywhere -> exit 0, PASS (proves the check is marker-GATED, never a blanket ban).
new_sandbox "$T/case2"
write_skill_doc "$T/case2" "probe/01-context.md" '# Context & Scope

## Reused UNCHANGED (named, not re-described here)

Some component is reused unchanged here.'
OUT2="$(run "$T/case2")"
EXIT2="$(echo "$OUT2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "NO-MARKER fixture -> exit 0 (check is marker-gated)" "0" "$EXIT2"
PASSLINE2="$(echo "$OUT2" | grep -q '^PASS.*01-context\.md' && echo yes || echo no)"
a "NO-MARKER fixture -> PASS line naming it" "yes" "$PASSLINE2"

# 3. MARKER PRESENT, CLEAN VOCABULARY -- marker present, no forbidden vocabulary anywhere else -> exit 0,
#    PASS for every file.
new_sandbox "$T/case3"
write_skill_doc "$T/case3" "probe/00-index.md" "# AS-IS Design

${MARKER}"
write_skill_doc "$T/case3" "probe/01-context.md" '# Context & Scope

This surface depends on the wallet repository and reads its balance.'
OUT3="$(run "$T/case3")"
EXIT3="$(echo "$OUT3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "MARKER + CLEAN vocabulary fixture -> exit 0" "0" "$EXIT3"
NOFAIL3="$(echo "$OUT3" | grep -q '^FAIL' && echo yes || echo no)"
a "MARKER + CLEAN vocabulary fixture -> NEVER a FAIL line" "no" "$NOFAIL3"

# 4. PROVENANCE-EXEMPT under a marker -- marker present in one file, and provenance.md ALSO carrying "reuse
#    vs new" text -> exit 0, EXEMPT for provenance.md, never FAIL for it.
new_sandbox "$T/case4"
write_skill_doc "$T/case4" "probe/00-index.md" "# AS-IS Design

${MARKER}"
write_skill_doc "$T/case4" "probe/provenance.md" '# Provenance

Working note: reuse vs new was considered but this surface is AS-IS-only.'
OUT4="$(run "$T/case4")"
EXIT4="$(echo "$OUT4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "PROVENANCE-EXEMPT under a marker -> exit 0" "0" "$EXIT4"
EXEMPTLINE4="$(echo "$OUT4" | grep -q '^EXEMPT.*provenance\.md' && echo yes || echo no)"
a "PROVENANCE-EXEMPT under a marker -> EXEMPT line naming it" "yes" "$EXEMPTLINE4"
NOFAIL4="$(echo "$OUT4" | grep -q '^FAIL' && echo yes || echo no)"
a "PROVENANCE-EXEMPT under a marker -> NEVER a FAIL line" "no" "$NOFAIL4"

# 5. THIRD FORBIDDEN PHRASE COVERAGE (grimorio.code-reviewer FINDING-01, cycle 1) -- phase-2's own step 4
#    forbids THREE phrases together ("Reused UNCHANGED", "reused vs new", "newly designed"); the ORIGINAL
#    vocabulary list only caught the first two. This case reproduces the exact gap: a family carrying the
#    marker, with the THIRD phrase alone (no "reused"/"reuse" text anywhere) -> exit 1, a FAIL line naming the
#    fixture and quoting "newly designed" as the matched marker.
new_sandbox "$T/case5"
write_skill_doc "$T/case5" "probe/00-index.md" "# AS-IS Design

${MARKER}"
write_skill_doc "$T/case5" "probe/01-context.md" '# Context & Scope

## Newly Designed Components

This surface adds a newly designed range composer, distinct from anything already shipped.'
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "THIRD-PHRASE COVERAGE (real incident shape) -> exit 1" "1" "$EXIT5"
FAILLINE5="$(echo "$OUT5" | grep -q '^FAIL.*01-context\.md' && echo yes || echo no)"
a "THIRD-PHRASE COVERAGE fixture -> FAIL line names 01-context.md" "yes" "$FAILLINE5"
MARKER5="$(echo "$OUT5" | grep '^FAIL.*01-context\.md' | grep -q '"newly designed"' && echo yes || echo no)"
a "THIRD-PHRASE COVERAGE fixture -> FAIL line quotes 'newly designed' as the matched marker" "yes" "$MARKER5"

# 6. NEW VOCABULARY COVERAGE (Finding-01 broadening) -- a family carrying the marker in one file (00-index.md),
#    with a SEPARATE file carrying the newly added forbidden vocabulary "retired in favor of" -> exit 1, a FAIL
#    line naming the vocabulary-carrying file and quoting one of the two new markers ("newly built" or "retired
#    in favor of").
new_sandbox "$T/case6"
write_skill_doc "$T/case6" "probe/00-index.md" "# AS-IS Design

${MARKER}"
write_skill_doc "$T/case6" "probe/01-context.md" '# Context & Scope

## Implementation Strategy

This component will be newly built and the legacy path retired in favor of the new implementation.'
OUT6="$(run "$T/case6")"
EXIT6="$(echo "$OUT6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "NEW VOCABULARY COVERAGE (build-framing paraphrase) -> exit 1" "1" "$EXIT6"
FAILLINE6="$(echo "$OUT6" | grep -q '^FAIL.*01-context\.md' && echo yes || echo no)"
a "NEW VOCABULARY COVERAGE fixture -> FAIL line names the vocabulary-carrying file" "yes" "$FAILLINE6"
MARKER6="$(echo "$OUT6" | grep '^FAIL.*01-context\.md' | grep -q '"newly built"\|"retired in favor of"' && echo yes || echo no)"
a "NEW VOCABULARY COVERAGE fixture -> FAIL line quotes one of the two new markers" "yes" "$MARKER6"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
