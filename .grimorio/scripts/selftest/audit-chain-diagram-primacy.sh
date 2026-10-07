#!/usr/bin/env bash
# Falsification test for `node .grimorio/scripts/audit-chain.mjs --diagram-primacy [filter]` (the
# diagram/table-over-prose gate). Every case is a sandbox built fresh in mktemp -d, with its OWN
# .claude/agents/ + .claude/skills/ -- this suite never reads the live .claude/ tree.
#
# MECHANICAL FACT, inherited from the sibling suite (audit-chain-portability.sh) and RE-VERIFIED live
# for this flag specifically, not assumed: audit-chain.mjs builds a BASENAMES index at module load,
# unconditionally, via `execFileSync("git", ["ls-files"], ...)` -- this runs for EVERY flag, including
# --diagram-primacy, and throws "fatal: not a git repository" if the CWD is not inside a git repo, even
# though diagramPrimacyShape() itself never touches git. A bare mktemp -d sandbox is NOT a git repo, so
# every sandbox below runs `git init -q` before invoking the script.
#
# DEFECT FOUND WHILE WRITING THIS SUITE, reported to the parent per standing QA charter, and since FIXED
# in a LATER, separate commit on this same branch (`f993f6cd`, plus a further REWORK-cycle fix on top of
# it): unlike --graph-first / --examples / --portability (each of which explicitly checks "did the filter
# match ANY file" and exits 2 with "this is NOT a clean pass" when it matched zero), --diagram-primacy
# ORIGINALLY had no such guard -- a filter matching zero files silently printed
# "--- 0 file(s), 0 passed, 0 failed, 0 exempt ---" and exited 0, a VACUOUS pass indistinguishable from a
# real clean run. THE GUARD NOW EXISTS -- re-verified live for this comment update, not assumed:
# `--diagram-primacy no-such-filter-xyz` now prints `filter "no-such-filter-xyz" matched ZERO files --
# nothing was scanned. This is NOT a clean pass; fix the filter.` and exits 2, the SAME guard shape
# --graph-first/--examples already carry. Every case below still narrows to exactly one relevant file via
# its OWN isolated sandbox directory (same technique the sibling suite uses), never via a substring
# filter -- kept that way because the per-case-sandbox design is correct regardless of the guard's state,
# not because the fix is still needed to protect this suite's own assertions.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
AUDIT="$ROOT/.grimorio/scripts/audit-chain.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

# write_skill_doc <dir> <relative-md-path-under-.claude/skills/> <content>
write_skill_doc() {
  local dir="$1" rel="$2" content="$3"
  mkdir -p "$dir/.claude/skills/$(dirname "$rel")"
  printf '%s\n' "$content" > "$dir/.claude/skills/$rel"
}

# new_sandbox <dir> -- fresh dir, made a real git repo (mechanical fact above), with an empty
# .claude/agents/ alongside .claude/skills/ so the tool's own base scan (roots = [".claude/agents",
# ".claude/skills"]) walks a structure shaped like the real one, not just the half under test.
new_sandbox() {
  rm -rf "$1"; mkdir -p "$1/.claude/agents"
  (cd "$1" && git init -q) >/dev/null 2>&1
}

# run <sandbox-dir> -- cd into it and invoke the REAL script by absolute path, no filter (the sandbox
# directory itself is the narrowing -- see the DEFECT note above for why a filter is avoided here).
# Prints combined stdout+stderr followed by a trailing EXIT:<code> line, same convention as the sibling
# suite.
run() {
  local out code
  out="$(cd "$1" && node "$AUDIT" --diagram-primacy 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

# 1. PROSE-DOMINANT -- zero mermaid, zero table, several real prose paragraphs -> exit 1, a FAIL line
#    naming the fixture.
new_sandbox "$T/case1"
write_skill_doc "$T/case1" "probe/prose-heavy.md" '# Prose Heavy Notes

This file only contains paragraphs of narrative text explaining a process in long form.

There are no diagrams here to break up the explanation, and no tables summarizing the steps either.

Every important detail is described in flowing sentences instead of a compact visual, which is exactly
the shape this gate exists to catch.'
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "PROSE-DOMINANT fixture -> exit 1" "1" "$EXIT1"
FAILLINE1="$(echo "$OUT1" | grep -q '^FAIL.*prose-heavy\.md' && echo yes || echo no)"
a "PROSE-DOMINANT fixture -> stdout has a FAIL line naming it" "yes" "$FAILLINE1"

# 2. DIAGRAM-PRIMARY -- one real mermaid block + a small table + exactly one line of prose rationale ->
#    exit 0, a PASS line naming the fixture.
new_sandbox "$T/case2"
write_skill_doc "$T/case2" "probe/diagram-primary.md" '# Diagram-Primary Doc

```mermaid
flowchart TB
    Start --> Finish
```

| Step | Description |
| --- | --- |
| 1 | Kickoff |
| 2 | Wrap up |

This diagram shows the two-step handoff between Start and Finish.'
OUT2="$(run "$T/case2")"
EXIT2="$(echo "$OUT2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "DIAGRAM-PRIMARY fixture -> exit 0" "0" "$EXIT2"
PASSLINE2="$(echo "$OUT2" | grep -q '^PASS.*diagram-primary\.md' && echo yes || echo no)"
a "DIAGRAM-PRIMARY fixture -> stdout has a PASS line naming it" "yes" "$PASSLINE2"

# 3. TEXT-ONLY COMPANION, basename convention -- literally named boundaries.md, first heading deliberately
#    NOT one of the exempt-heading phrases (proves the basename branch alone drives this, independent of
#    heading content), several prose paragraphs, zero diagram, zero table -> exit 0 (this file ALONE must
#    never cause a non-zero exit), an EXEMPT line naming it, and NEVER a FAIL line for it.
new_sandbox "$T/case3"
write_skill_doc "$T/case3" "probe/boundaries.md" '# Reference Notes

This file exists to describe what this skill deliberately does NOT cover, in long prose form.

It intentionally has no diagrams or tables because it is a text-only companion document.

Even though it is prose-heavy, it must never be gated as a failure by the diagram-primacy check.'
OUT3="$(run "$T/case3")"
EXIT3="$(echo "$OUT3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "TEXT-ONLY COMPANION (basename) fixture -> exit 0" "0" "$EXIT3"
EXEMPTLINE3="$(echo "$OUT3" | grep -q '^EXEMPT.*boundaries\.md' && echo yes || echo no)"
a "TEXT-ONLY COMPANION (basename) fixture -> stdout has an EXEMPT line naming it" "yes" "$EXEMPTLINE3"
NOFAIL3="$(echo "$OUT3" | grep -q '^FAIL' && echo yes || echo no)"
a "TEXT-ONLY COMPANION (basename) fixture -> NEVER a FAIL line" "no" "$NOFAIL3"

# 4. TEXT-ONLY COMPANION, first-heading convention -- an ordinary filename, first heading reads
#    "## Negative Scope" (proves the heading branch alone drives this, independent of filename), several
#    prose paragraphs, zero diagram, zero table -> exit 0, an EXEMPT line naming it, and NEVER a FAIL line.
new_sandbox "$T/case4"
write_skill_doc "$T/case4" "probe/scope-notes.md" '## Negative Scope

This file describes what is explicitly out of scope, in long prose form.

No diagrams or tables appear anywhere in this companion document.

It must be classified EXEMPT purely because of its first heading, not its filename.'
OUT4="$(run "$T/case4")"
EXIT4="$(echo "$OUT4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "TEXT-ONLY COMPANION (heading) fixture -> exit 0" "0" "$EXIT4"
EXEMPTLINE4="$(echo "$OUT4" | grep -q '^EXEMPT.*scope-notes\.md' && echo yes || echo no)"
a "TEXT-ONLY COMPANION (heading) fixture -> stdout has an EXEMPT line naming it" "yes" "$EXEMPTLINE4"
NOFAIL4="$(echo "$OUT4" | grep -q '^FAIL' && echo yes || echo no)"
a "TEXT-ONLY COMPANION (heading) fixture -> NEVER a FAIL line" "no" "$NOFAIL4"

# 5. RATIO-EXCEEDS, ISOLATED -- a REAL mermaid diagram (nonzero mermaidBlocks, so the "zero diagram, zero
#    table" condition CANNOT fire) plus enough genuine prose that the prose still numerically exceeds the
#    diagram's own line count, no table -> exit 1, a FAIL line naming the fixture whose OWN reason text
#    contains "exceeds" -- proving the ratio-exceeds condition tripped alone, never the zero-diagram one.
#    Counts locked in by running the real CLI against this exact fixture before writing this assertion:
#    diagram 1 block/5 line, table 0, prose 8 -- 8 > 5.
new_sandbox "$T/case5"
write_skill_doc "$T/case5" "probe/ratio-exceeds.md" '# Ratio Exceeds Doc

```mermaid
flowchart TB
    Start --> Middle
    Middle --> Finish
```

This diagram shows a short chain but the file also carries far more explanation than the diagram itself.
The prose below intentionally repeats itself across many lines so it numerically outweighs the diagram.
Each paragraph line here counts as one line of narrative prose under the primacy shape counter.
The gate is supposed to fail when this happens, even though a real diagram is present in the file.
This line adds more prose to make sure the count clearly exceeds the diagram-plus-table total.
Another line of prose here, still narrative, still counting toward the same running total.
One more line for good measure, so the numbers are not a coincidence of a boundary value.
A final line closes out the prose section, comfortably past the diagram'"'"'s own line count.'
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "RATIO-EXCEEDS, ISOLATED fixture -> exit 1" "1" "$EXIT5"
FAILLINE5="$(echo "$OUT5" | grep -q '^FAIL.*ratio-exceeds\.md' && echo yes || echo no)"
a "RATIO-EXCEEDS, ISOLATED fixture -> stdout has a FAIL line naming it" "yes" "$FAILLINE5"
REASON5="$(echo "$OUT5" | grep '^FAIL.*ratio-exceeds\.md' | grep -q 'exceeds' && echo yes || echo no)"
a "RATIO-EXCEEDS, ISOLATED fixture -> FAIL line's own reason text contains 'exceeds'" "yes" "$REASON5"

# 6. EXEMPT SUB-SECTION, ISOLATED -- a NON-exempt file overall (ordinary filename, ordinary first heading
#    -- neither boundaries.md nor a first-heading match) carrying an internal "## Negative Scope"
#    sub-heading partway through, with several prose lines INSIDE that sub-section and a few OUTSIDE it,
#    alongside one real table sized so the file would FAIL if the sub-section's own prose were wrongly
#    counted against it, but correctly PASSES once that sub-section's prose is excluded -> exit 0, a PASS
#    line naming the fixture -- proving the exemption actually EXCLUDES that sub-section's content rather
#    than merely existing in the code unused. Counts locked in by running the real CLI against this exact
#    fixture before writing this assertion: table 4 line, prose 8 line total (2 outside the sub-section +
#    6 inside it) -- nonExemptProse is 8-6=2, which does NOT exceed diagram+table (0+4=4), so it PASSES;
#    without the exemption excluding the 6 inside lines, nonExemptProse would be the full 8, which DOES
#    exceed 4, and it would FAIL -- the PASS genuinely depends on the exclusion, not on being light on
#    prose overall.
new_sandbox "$T/case6"
write_skill_doc "$T/case6" "probe/process-notes.md" '# Ordinary Notes

This document explains an ordinary process step by step.

It is not a boundaries or coverage file by its name or its heading.

| Step | Description |
| --- | --- |
| 1 | Kickoff |
| 2 | Wrap up |

## Negative Scope

This sub-section intentionally holds a lot of prose that should be excluded from the primacy count.

It describes what this document does NOT cover, at length, across several separate lines.

Each of these lines is real narrative prose sitting inside the exempt sub-section boundary.

If this prose were wrongly counted against the file, the ratio check would fail outright.

The exemption logic exists precisely to keep this kind of internal aside from being penalized.

This is the last line of the exempt sub-section before the file ends.'
OUT6="$(run "$T/case6")"
EXIT6="$(echo "$OUT6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "EXEMPT SUB-SECTION, ISOLATED fixture -> exit 0" "0" "$EXIT6"
PASSLINE6="$(echo "$OUT6" | grep -q '^PASS.*process-notes\.md' && echo yes || echo no)"
a "EXEMPT SUB-SECTION, ISOLATED fixture -> stdout has a PASS line naming it" "yes" "$PASSLINE6"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
