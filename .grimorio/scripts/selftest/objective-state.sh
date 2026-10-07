#!/usr/bin/env bash
# Deliberately carries NO @subject tag, so run-all.sh --changed ALWAYS runs it.
#
# Its sibling, .grimorio/skills/grimorio.objective-harness/scripts/selftest-objective.sh, DOES carry one
# (the harness scripts), because its c1-c8 cases build a throwaway repo in $TMPDIR specifically so this
# working tree cannot influence their verdict -- so that verdict cannot change unless those scripts change.
# Skipping it on an unrelated branch loses nothing: measured at ~107s for an answer fixed when the subject
# was last edited.
#
# But that file is MIXED: c9/c10/c12/c15 assert facts about THIS repo (objectives present and well-formed,
# per-feature harnesses carrying invariants, what was skipped recorded rather than asserted), and ANY commit
# can break those. Letting the whole file be skipped would take the run-time half down with the design half.
# This wrapper is that half, discovered as a selftest in its own right, untagged and therefore unskippable.
# Measured: ~12s.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 2
exec bash .grimorio/skills/grimorio.objective-harness/scripts/selftest-objective.sh state
