#!/usr/bin/env bash
# The missing enforcement named in grimorio-defects.md: resolve-family.sh tests resolve.cjs's exported
# functions in isolation, so it stayed green while apply-anchors.cjs carried its own copy of the same
# resolution and condemned real anchors as FABRICATED. This runs the CLI end to end on a bare `skill/x`
# decision — the exact shape that broke — and asserts nothing was rejected.
#
# See it FAIL before trusting it: make apply-anchors.cjs resolve with its own targetOf() again, or point
# the fixture's anchor at a heading that does not exist; both must go red.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

# Repo-relative, not mktemp -d: under Git Bash mktemp hands back a POSIX path that node resolves against
# the drive root instead of the Windows temp dir, so the fixture was written where nothing could read it.
work="tmp/selftest-apply-anchors"
mkdir -p "$work"
trap 'rm -rf "$work"' EXIT
fixture="$work/decisions.json"
probe=".grimorio/skills/grimorio.working-memory/zz-apply-anchors-probe.md"

# A REAL heading in a REAL bare-skill target, read live so the fixture cannot rot against the corpus.
heading=$(node -e '
const R = require("./.grimorio/scripts/refobl/resolve.cjs");
const h = R.headingsOf("ref:skill/grimorio.agent-writing") || [];
if (h.length < 2) { console.error("no headings in agent-writing/SKILL.md"); process.exit(1); }
process.stdout.write(h[1]);
') || { echo "apply-anchors-cli: FAIL — could not read a heading from the bare-skill target"; exit 1; }

printf '%s\n' "# Probe" "" "A bare-skill reference with no anchor: ref:skill/grimorio.agent-writing" > "$probe"
node -e '
const fs = require("fs");
// With `node -e`, argv[1] is the FIRST passed argument — there is no script path to skip.
const [, out, line, anchor] = process.argv;
fs.writeFileSync(out, JSON.stringify({ result: { chosen: [
  { from: ".grimorio/skills/grimorio.working-memory/zz-apply-anchors-probe.md", line: Number(line),
    ref: "ref:skill/grimorio.agent-writing", anchor }
] } }));
' "$fixture" 3 "$heading"

report=$(node .grimorio/scripts/refobl/apply-anchors.cjs "$fixture" --apply 2>&1)
written=$(grep -c '#' "$probe" || true)
rm -f "$probe"

echo "$report" | sed 's/^/  /'
fail=0
echo "$report" | grep -qE "SKIPPED anchor FABRICATED +0" || { echo "  FAIL  a real heading in a bare-skill target was reported FABRICATED"; fail=1; }
echo "$report" | grep -qE "APPLIED: 1 anchors" || { echo "  FAIL  the CLI did not write the one decision it was given"; fail=1; }
[ "$written" -ge 1 ] || { echo "  FAIL  the anchor never reached the file"; fail=1; }

[ "$fail" -eq 0 ] || { echo "apply-anchors-cli: FAILED"; exit 1; }
echo "apply-anchors-cli: OK — the CLI resolves a bare skill/x through resolve.cjs and writes the anchor."
