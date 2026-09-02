#!/usr/bin/env bash
# Falsification test for `node scripts/audit-chain.mjs --diagram-classes [filter]` (the deterministic diagram-
# TYPE inventory tool, defect (c) mechanism -- feeds scope-completeness-method.md's own Gate 7's agent-based
# sufficiency judgment; NEVER gates on its own, so this suite asserts on the PRINTED inventory line, not exit
# code, except for the zero-match filter guard). Same BASENAMES-index-needs-a-git-repo mechanical fact as the
# sibling suites -- every sandbox runs `git init -q` first.
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
  out="$(cd "$1" && node "$AUDIT" --diagram-classes 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

# 1. MULTIPLE TYPES, ONE FILE -- a flowchart block AND a separate sequenceDiagram block -> the file's own
#    inventory line names BOTH types.
new_sandbox "$T/case1"
write_skill_doc "$T/case1" "probe/multi-type.md" '# Multi-Type Doc

```mermaid
flowchart TB
    Start --> Finish
```

```mermaid
sequenceDiagram
    Alice->>Bob: Hello
```'
OUT1="$(run "$T/case1")"
LINE1="$(echo "$OUT1" | grep 'multi-type\.md')"
HASFLOW1="$(echo "$LINE1" | grep -q 'flowchart' && echo yes || echo no)"
HASSEQ1="$(echo "$LINE1" | grep -q 'sequenceDiagram' && echo yes || echo no)"
a "MULTIPLE TYPES fixture -> inventory line names flowchart" "yes" "$HASFLOW1"
a "MULTIPLE TYPES fixture -> inventory line names sequenceDiagram" "yes" "$HASSEQ1"

# 2. ZERO MERMAID -- prose/tables only, no mermaid fence -> inventory line reads "types: (none)".
new_sandbox "$T/case2"
write_skill_doc "$T/case2" "probe/no-diagram.md" '# No Diagram Doc

Just prose here, and a table:

| A | B |
| --- | --- |
| 1 | 2 |'
OUT2="$(run "$T/case2")"
NONE2="$(echo "$OUT2" | grep 'no-diagram\.md' | grep -q 'types: (none)' && echo yes || echo no)"
a "ZERO-MERMAID fixture -> inventory line reads types: (none)" "yes" "$NONE2"

# 3. MATRIX TABLE DETECTED -- a heading matching /matrix|decision|credential|auth/i immediately followed by a
#    markdown table -> inventory line reads "matrix-table: yes".
new_sandbox "$T/case3"
write_skill_doc "$T/case3" "probe/matrix.md" '# Authorization

## Credential × Route Matrix

| Credential | Route | Allowed |
| --- | --- | --- |
| session | balance | yes |'
OUT3="$(run "$T/case3")"
YES3="$(echo "$OUT3" | grep 'matrix\.md' | grep -q 'matrix-table: yes' && echo yes || echo no)"
a "MATRIX-HEADING fixture -> inventory line reads matrix-table: yes" "yes" "$YES3"

# 4. NON-MATRIX TABLE NOT FLAGGED -- an ordinary heading ("## Stakeholders") followed by a table -> inventory
#    line reads "matrix-table: no" (proves the heading-keyword gate is real, not a blanket "any table" match).
new_sandbox "$T/case4"
write_skill_doc "$T/case4" "probe/plain-table.md" '# Context

## Stakeholders

| Stakeholder | Concern |
| --- | --- |
| CEO | money boundary |'
OUT4="$(run "$T/case4")"
NO4="$(echo "$OUT4" | grep 'plain-table\.md' | grep -q 'matrix-table: no' && echo yes || echo no)"
a "NON-MATRIX-HEADING fixture -> inventory line reads matrix-table: no" "yes" "$NO4"

# 5. ZERO-MATCH FILTER GUARD -- a filter matching zero files -> exit 2, the same guard shape the sibling
#    flags already carry.
new_sandbox "$T/case5"
write_skill_doc "$T/case5" "probe/clean.md" '# Clean

No diagrams.'
OUT5="$(cd "$T/case5" && node "$AUDIT" --diagram-classes no-such-filter-xyz 2>&1; echo "EXIT:$?")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "ZERO-MATCH FILTER GUARD -> exit 2" "2" "$EXIT5"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
