#!/usr/bin/env bash
# Falsification test for resolve.cjs's `grimorio.`-prefix self-heal fallback (the corpus-restructure
# transition mechanism: a `grimorio.`-prefixed token whose target still sits at its OLD unprefixed path
# must still resolve, but the heal must be LOGGED so nobody loses track of a still-old-form reference).
#
# Every case runs inside a fresh `mktemp -d` sandbox with its OWN `.claude/skills/` tree — this suite
# never reads or writes the live corpus. resolve.cjs resolves every path RELATIVE TO CWD (see its own
# `SKILLS = ".claude/skills/"` constant), so each case `cd`s into its sandbox and `require`s the REAL
# resolver by its ABSOLUTE path from there — same technique proven by the sibling suite,
# .grimorio/scripts/selftest/resolve-family.sh.
set -uo pipefail
# @keep-comment -- the cache root comes from .grimorio/scripts/refobl/skill-roots.json's `cacheRoot`, the SAME
# declaration the hooks read. A literal here is how all seven of these selftests broke at once when
# the root moved: the fixture wrote to one path and the code under test read the other.
CACHE_REL="$(node -p "require('$(git rev-parse --show-toplevel)/.grimorio/scripts/refobl/cache-paths.cjs').cacheRoot()")"
ROOT="$(git rev-parse --show-toplevel)" || exit 1
RESOLVER="$ROOT/.grimorio/scripts/refobl/resolve.cjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

# run <sandbox-dir> <node-expr> -- cd into the sandbox and evaluate a node one-liner that requires the
# REAL resolver by absolute path; prints stdout.
run() { (cd "$1" && node -e "$2"); }

# ---------------------------------------------------------------------------
# CASE 1 -- a `grimorio.`-prefixed token whose target only exists at the UNPREFIXED path: resolves via
# the fallback, returns the healed path exactly as if it had resolved directly, and appends a
# correctly-shaped log line.
# ---------------------------------------------------------------------------
S1="$T/case1"
# FIXTURE BUG, found and fixed 2026-08-28 (grimorio.system-keeper, Stage-2 acceptance-bar review): this
# used to `mkdir` the PREFIXED path here, which resolve.cjs's own `toPath()` finds DIRECTLY on its first
# `fs.statSync` -- never reaching the self-heal branch below at all. Every toPath()/exists() assertion
# still passed, by coincidence (they check the returned VALUE, which happens to be identical either way),
# masking the bug until the LOG-verification assertions -- which can only pass if a heal genuinely
# happened -- caught it. The target must live at the UNPREFIXED path; only the TOKEN carries the prefix.
mkdir -p "$S1/.claude/skills/developer-memory"
printf '# Developer Memory\n\nUnprefixed target the healed token must resolve to.\n' > "$S1/.claude/skills/developer-memory/SKILL.md"

TOPATH1="$(run "$S1" "console.log(require('$RESOLVER').toPath('import:skill/grimorio.developer-memory'))")"
a "healed toPath -> unprefixed directory" ".claude/skills/developer-memory" "$TOPATH1"

EXISTS1="$(run "$S1" "console.log(require('$RESOLVER').exists('import:skill/grimorio.developer-memory'))")"
a "healed exists() -> true (failure never surfaced to the caller)" "true" "$EXISTS1"

LOG1="$S1/${CACHE_REL}/resolver-self-heal.log"
LOG1_EXISTS="$([ -f "$LOG1" ] && echo yes || echo no)"
a "self-heal log file created" "yes" "$LOG1_EXISTS"

LOG1_LINES="$(wc -l < "$LOG1" | tr -d ' ')"
a "self-heal log has exactly one line (one heal happened above via exists(), toPath() re-ran the same heal)" "2" "$LOG1_LINES"

LOG1_SHAPE="$(run "$S1" "
const fs = require('fs');
const lines = fs.readFileSync(require('$ROOT/.grimorio/scripts/refobl/cache-paths.cjs').cacheRelative('resolver-self-heal.log'), 'utf8').trim().split(/\n/);
const row = JSON.parse(lines[lines.length - 1]);
const okShape = typeof row.ts === 'string' && !Number.isNaN(Date.parse(row.ts))
  && row.originalToken === 'import:skill/grimorio.developer-memory'
  && row.healedTarget === '.claude/skills/developer-memory';
console.log(okShape);
")"
a "self-heal log row shape (ts ISO + originalToken + healedTarget)" "true" "$LOG1_SHAPE"

# A file inside the skill, not just the bare directory -- the fallback strips the prefix from the FIRST
# path segment only, never from a file name that happens to also start with a dot-joined word.
printf 'a known trap\n' > "$S1/.claude/skills/developer-memory/project.traps.md"
TOPATH1F="$(run "$S1" "console.log(require('$RESOLVER').toPath('ref:skill/grimorio.developer-memory/project.traps.md'))")"
a "healed toPath for a FILE inside the skill (prefix stripped from segment 1 only)" ".claude/skills/developer-memory/project.traps.md" "$TOPATH1F"

# ---------------------------------------------------------------------------
# CASE 2 -- a `grimorio.`-prefixed token with NO unprefixed form either: still reports dead, UNCHANGED
# from pre-fallback behaviour, and never writes a log line for it.
# ---------------------------------------------------------------------------
S2="$T/case2"
mkdir -p "$S2/.claude/skills"
# Neither <canonical-root>/grimorio.nonexistent-thing nor <canonical-root>/nonexistent-thing exists.
# The expected path is DERIVED from SKILL_ROOTS[0] rather than written out, so a re-root of the corpus
# (.claude/skills -> .grimorio/skills) cannot make this assertion fail for the wrong reason.

TOPATH2="$(run "$S2" "console.log(require('$RESOLVER').toPath('import:skill/grimorio.nonexistent-thing'))")"
CANON="$(run "$S2" "console.log(require('$RESOLVER').SKILL_ROOTS[0])")"
a "still-dead toPath -> the direct (grimorio.-prefixed) path under the CANONICAL root, same as pre-fallback behaviour" "${CANON}grimorio.nonexistent-thing" "$TOPATH2"

EXISTS2="$(run "$S2" "console.log(require('$RESOLVER').exists('import:skill/grimorio.nonexistent-thing'))")"
a "still-dead exists() -> false (a genuinely broken reference is still reported dead)" "false" "$EXISTS2"

LOG2="$S2/${CACHE_REL}/resolver-self-heal.log"
LOG2_EXISTS="$([ -f "$LOG2" ] && echo yes || echo no)"
a "no log file written when nothing healed" "no" "$LOG2_EXISTS"

# ---------------------------------------------------------------------------
# CASE 3 -- an ORDINARY unprefixed skill token, never touched by this fallback at all, still resolves
# exactly as before and writes NO log line -- the fallback only ever WIDENS what resolves.
# ---------------------------------------------------------------------------
S3="$T/case3"
mkdir -p "$S3/.claude/skills/plain-skill"
printf '# Plain\n' > "$S3/.claude/skills/plain-skill/SKILL.md"
TOPATH3="$(run "$S3" "console.log(require('$RESOLVER').toPath('import:skill/plain-skill'))")"
a "ordinary unprefixed token -> resolves directly, untouched by the fallback" ".claude/skills/plain-skill" "$TOPATH3"
LOG3="$S3/${CACHE_REL}/resolver-self-heal.log"
LOG3_EXISTS="$([ -f "$LOG3" ] && echo yes || echo no)"
a "no log file written for an already-resolving reference" "no" "$LOG3_EXISTS"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
