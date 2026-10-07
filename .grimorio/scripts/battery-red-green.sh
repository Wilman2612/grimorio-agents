#!/usr/bin/env bash
# Proves each node-battery probe can FAIL, and fail for the RIGHT REASON.
# A probe that has only ever been green is not a probe (objectives/harness.md invariant 5).
# Run: bash .grimorio/scripts/battery-red-green.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNNER="$ROOT/services/runner-node"
BRIDGE="$RUNNER/src/workflow/graphBridge.ts"
CEO_FIXTURE="$ROOT/packages/shared/src/studio/fixtures/ceoCombinationGraphs.json"
BATTERY="$ROOT/NODE-BATTERY.md"
GEN_CEO="$ROOT/packages/shared/src/studio/fixtures/generate-ceoCombinationGraphs.ts"

BACKUP="$(mktemp -d)"
cp "$BRIDGE" "$BACKUP/graphBridge.ts"
cp "$CEO_FIXTURE" "$BACKUP/ceoCombinationGraphs.json"
cp "$BATTERY" "$BACKUP/NODE-BATTERY.md"

restore() {
  cp "$BACKUP/graphBridge.ts" "$BRIDGE"
  cp "$BACKUP/ceoCombinationGraphs.json" "$CEO_FIXTURE"
  cp "$BACKUP/NODE-BATTERY.md" "$BATTERY"
  rm -rf "$BACKUP"
}
trap restore EXIT

FAILURES=0
run_spec() { (cd "$RUNNER" && npx vitest run "tests/workflow/$1.test.ts" 2>&1); }

# $1 spec  $2 human label  $3 string the RED output must contain
probe() {
  local spec="$1" label="$2" expect="$3" out red_exit green_exit
  out="$(run_spec "$spec")"; red_exit=$?
  if [ "$red_exit" -eq 0 ]; then
    echo "  FAIL  $label — mutation did NOT turn it red (exit 0)"
    FAILURES=$((FAILURES + 1)); return
  fi
  if ! grep -qF "$expect" <<<"$out"; then
    echo "  FAIL  $label — went red (exit $red_exit) but NOT for the expected cause"
    echo "        expected to see: $expect"
    FAILURES=$((FAILURES + 1)); return
  fi
  restore_one "$spec"
  out="$(run_spec "$spec")"; green_exit=$?
  if [ "$green_exit" -ne 0 ]; then
    echo "  FAIL  $label — did not return to green after restore (exit $green_exit)"
    FAILURES=$((FAILURES + 1)); return
  fi
  echo "  OK    $label — RED exit $red_exit (right cause), GREEN exit $green_exit"
}

restore_one() {
  cp "$BACKUP/graphBridge.ts" "$BRIDGE"
  cp "$BACKUP/ceoCombinationGraphs.json" "$CEO_FIXTURE"
  cp "$BACKUP/NODE-BATTERY.md" "$BATTERY"
}

echo "== node battery: RED/GREEN ladder =="

# M1 — the bridge ACCEPTS-AND-DROPS instead of refusing. The defect that would run a smaller
# force than the player authored, and the one the refusal assertions exist to catch.
perl -0pi -e 's/(if \(!SUPPORTED_NODE_TYPES\.has\(type\)\) \{)/$1\n      continue;/' "$BRIDGE"
probe authoredCatalogGraphs "accept-and-drop is caught" "WorkflowGraphUnsupportedNodeError"

# M2 — a CEO combination carries a config its own schema rejects.
node -e '
const fs=require("fs");const p=process.argv[1];
const d=JSON.parse(fs.readFileSync(p,"utf8"));
d.cases[0].graph.nodes[0].config={predicate:"not-an-object",branches:42};
fs.writeFileSync(p,JSON.stringify(d,null,2)+"\n");' "$CEO_FIXTURE"
probe ceoCombinations "an invalid combination config is caught" "Expected array, received number"

# M3 — the committed artifact disagrees with the catalog and the bridge.
perl -0pi -e 's/can actually RUN/can actually WALK/' "$BATTERY"
probe nodeBattery "battery drift is caught" "the artifact on disk matches"

echo
if [ "$FAILURES" -eq 0 ]; then
  echo "ALL PROBES FALSIFIABLE — each was seen RED for its own cause, then GREEN again."
  exit 0
fi
echo "$FAILURES PROBE(S) NOT FALSIFIABLE — a green from them cannot be trusted."
exit 1
