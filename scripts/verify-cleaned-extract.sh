#!/usr/bin/env bash
# verify-cleaned-extract.sh — thin CLI shim, no logic of its own. The real turn-BLOCK parsing and comparison
# now lives in the sibling `verify-cleaned-extract.mjs` (see that file's own header for the algorithm and
# why it replaced a prior hand-rolled bash implementation, CRITICAL finding, cycle-2 code-review,
# 2026-08-25). This shim exists SOLELY to preserve the exact call site
# grimorio.extract-cleaner's own governed Step 6 already uses — `scripts/verify-cleaned-extract.sh <input>
# <output> <independent-reference-file>`, invoked via Bash — a governed file this fix may not edit itself
# (`.claude/skills/grimorio.conduct/extract-cleaner-behavior.md`, grimorio-conduct rule 20). Never add
# comparison/parsing logic here; it belongs in the .mjs.
#
# USAGE: verify-cleaned-extract.sh <input-file> <output-file> <independent-reference-file>
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "$DIR/verify-cleaned-extract.mjs" "$@"
