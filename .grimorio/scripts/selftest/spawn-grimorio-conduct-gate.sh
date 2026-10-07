#!/usr/bin/env bash
# selftest/spawn-grimorio-conduct-gate.sh — ANSWERS: does .claude/hooks/spawn-grimorio-conduct-gate.cjs (H9)
# correctly ALLOW a bare (no compelling grimorio.conduct instruction) spawn of a FOREIGN agent type — one
# whose subagent_type is neither `grimorio.`-prefixed nor `project.`-prefixed, including a type omitted
# entirely — WITHOUT requiring the corpus's own conduct-load instruction, which such an agent has no way to
# act on; correctly DENY a bare spawn of a `grimorio.`- or `project.`-prefixed type not in EXEMPT_TYPES,
# naming the missing instruction; correctly ALLOW that same prefixed type once the prompt carries the
# compelling instruction (Pattern A or Pattern B); correctly ALLOW a bare spawn of each of the two remaining
# EXEMPT_TYPES members (`grimorio.experimenter`, `grimorio.extract-cleaner` — both `grimorio.`-prefixed but
# carrying no Skill tool, so gating them would only ever deny, never compel) with NO exemption-list case left
# untested; and correctly preserve the pre-existing baseline (fail-open on malformed JSON, no-op on a
# non-Agent tool_name, exit 0 on every path). WHEN: after touching spawn-grimorio-conduct-gate.cjs.
#
# Drives the real CLI via subprocess with fixture JSON on stdin — never tests internals in isolation — per
# this directory's own established convention (see selftest/spawn-verbatim-origin-gate.mjs, this file's own
# direct sibling and shape precedent).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes
HOOK=".claude/hooks/spawn-grimorio-conduct-gate.cjs"

FAIL=0
assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected to find: $needle"
    echo "  --- actual output ---"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}
assert_empty() {
  local haystack="$1" label="$2"
  if [[ -z "$haystack" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected NO output, got:"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}
assert_exit0() {
  local code="$1" label="$2"
  if [[ "$code" -eq 0 ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected exit 0, got $code"
    FAIL=1
  fi
}

run_hook() { # run_hook <json-file>
  node "$HOOK" < "$1"
}

json_payload() { # json_payload <prompt> <subagent_type-or-empty>
  node -e '
    const [prompt, subagentType] = [process.argv[1], process.argv[2]];
    const toolInput = {prompt};
    if (subagentType) toolInput.subagent_type = subagentType;
    process.stdout.write(JSON.stringify({tool_name:"Agent", tool_input: toolInput}));
  ' "$1" "$2"
}

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

COMPELLING="BEFORE you act on anything in this brief, call Skill(grimorio.conduct) and read it in full."

# === Case A — foreign agent type (Explore), bare prompt, no compelling instruction -> ALLOW, empty stdout ===
# This is the exact case the CEO named: a stranger's own agent, unrelated to grimorio, must not be told to
# load doctrine it has no way to act on.
json_payload "do the thing" "Explore" > "$WORK/a.json"
set +e; OUT_A="$(run_hook "$WORK/a.json")"; EXIT_A=$?; set -e
assert_exit0 "$EXIT_A" "Case A — foreign type (Explore), bare prompt, exit 0"
assert_empty "$OUT_A" "Case A — foreign type ALLOWED, empty stdout (no deny envelope)"

# === Case B — foreign agent type (general-purpose), bare prompt -> ALLOW =====================================
json_payload "do the thing" "general-purpose" > "$WORK/b.json"
set +e; OUT_B="$(run_hook "$WORK/b.json")"; EXIT_B=$?; set -e
assert_exit0 "$EXIT_B" "Case B — foreign type (general-purpose), bare prompt, exit 0"
assert_empty "$OUT_B" "Case B — foreign type ALLOWED, empty stdout"

# === Case C — no subagent_type at all (a spawn with the type omitted entirely) -> ALLOW ======================
json_payload "do the thing" "" > "$WORK/c.json"
set +e; OUT_C="$(run_hook "$WORK/c.json")"; EXIT_C=$?; set -e
assert_exit0 "$EXIT_C" "Case C — no subagent_type at all, exit 0"
assert_empty "$OUT_C" "Case C — omitted type ALLOWED, empty stdout"

# === Case D — a grimorio.*-prefixed type NOT in EXEMPT_TYPES, bare prompt -> DENY, naming the missing =========
# instruction — the gate must still bind grimorio's own agents exactly as before.
json_payload "do the thing" "grimorio.scout" > "$WORK/d.json"
set +e; OUT_D="$(run_hook "$WORK/d.json")"; EXIT_D=$?; set -e
assert_exit0 "$EXIT_D" "Case D — grimorio.scout, bare prompt, hook itself always exits 0 (deny via envelope)"
assert_contains "$OUT_D" '"permissionDecision":"deny"' "Case D — grimorio.scout bare spawn DENIED"
assert_contains "$OUT_D" "grimorio.conduct" "Case D — deny message names the missing grimorio.conduct instruction"

# === Case E — the SAME grimorio.*-prefixed type, WITH the compelling instruction -> ALLOW ====================
json_payload "$COMPELLING Now do the thing." "grimorio.scout" > "$WORK/e.json"
set +e; OUT_E="$(run_hook "$WORK/e.json")"; EXIT_E=$?; set -e
assert_exit0 "$EXIT_E" "Case E — grimorio.scout with compelling instruction, exit 0"
assert_empty "$OUT_E" "Case E — grimorio.scout ALLOWED, empty stdout"

# === Case F — a project.*-prefixed type NOT in EXEMPT_TYPES, bare prompt -> DENY =============================
json_payload "do the thing" "project.map-cartographer" > "$WORK/f.json"
set +e; OUT_F="$(run_hook "$WORK/f.json")"; EXIT_F=$?; set -e
assert_exit0 "$EXIT_F" "Case F — project.map-cartographer, bare prompt, hook itself always exits 0"
assert_contains "$OUT_F" '"permissionDecision":"deny"' "Case F — project.map-cartographer bare spawn DENIED"

# === Case G — the SAME project.*-prefixed type, WITH the compelling instruction -> ALLOW =====================
json_payload "$COMPELLING Now do the thing." "project.map-cartographer" > "$WORK/g.json"
set +e; OUT_G="$(run_hook "$WORK/g.json")"; EXIT_G=$?; set -e
assert_exit0 "$EXIT_G" "Case G — project.map-cartographer with compelling instruction, exit 0"
assert_empty "$OUT_G" "Case G — project.map-cartographer ALLOWED, empty stdout"

# === Case H — EXEMPT_TYPES member grimorio.experimenter, bare prompt -> ALLOW ================================
json_payload "do the thing" "grimorio.experimenter" > "$WORK/h.json"
set +e; OUT_H="$(run_hook "$WORK/h.json")"; EXIT_H=$?; set -e
assert_exit0 "$EXIT_H" "Case H — grimorio.experimenter (EXEMPT_TYPES), bare prompt, exit 0"
assert_empty "$OUT_H" "Case H — grimorio.experimenter ALLOWED, empty stdout"

# === Case I — EXEMPT_TYPES member grimorio.extract-cleaner, bare prompt -> ALLOW =============================
json_payload "do the thing" "grimorio.extract-cleaner" > "$WORK/i.json"
set +e; OUT_I="$(run_hook "$WORK/i.json")"; EXIT_I=$?; set -e
assert_exit0 "$EXIT_I" "Case I — grimorio.extract-cleaner (EXEMPT_TYPES), bare prompt, exit 0"
assert_empty "$OUT_I" "Case I — grimorio.extract-cleaner ALLOWED, empty stdout"

# === Case J — a foreign type spelled to LOOK similar but not actually prefixed (e.g. "grimoriox.scout", no ===
# dot after "grimorio") must NOT be misread as grimorio-owned — still ALLOWED as foreign (proves startsWith
# is checked against the literal "grimorio." / "project." prefix, not a loose substring match).
json_payload "do the thing" "grimoriox.scout" > "$WORK/j.json"
set +e; OUT_J="$(run_hook "$WORK/j.json")"; EXIT_J=$?; set -e
assert_exit0 "$EXIT_J" "Case J — near-miss prefix (grimoriox.scout), exit 0"
assert_empty "$OUT_J" "Case J — near-miss prefix treated as foreign, ALLOWED, empty stdout"

# === Case K — malformed JSON on stdin -> ALLOW (fail-open) ===================================================
echo 'not json at all' > "$WORK/k.json"
set +e; OUT_K="$(run_hook "$WORK/k.json")"; EXIT_K=$?; set -e
assert_exit0 "$EXIT_K" "Case K — malformed JSON, fail-open, exit 0"
assert_empty "$OUT_K" "Case K — malformed JSON, empty stdout"

# === Case L — non-Agent tool_name -> ALLOW (no-op) ============================================================
echo '{"tool_name":"Bash","tool_input":{}}' > "$WORK/l.json"
set +e; OUT_L="$(run_hook "$WORK/l.json")"; EXIT_L=$?; set -e
assert_exit0 "$EXIT_L" "Case L — non-Agent tool, exit 0"
assert_empty "$OUT_L" "Case L — non-Agent tool, empty stdout (no-op)"

# === Case M — EXEMPT_TYPES member grimorio.board-writer (added this pass, FINDING-02), bare four-field-only ===
# spawn -> ALLOW. grimorio.board-writer carries no Skill tool (tools: Read, Write, Bash — grimorio.board-writer.md
# frontmatter), matching the exact criterion this Set exists for — same precedent as Case H/I above
# (grimorio.experimenter/grimorio.extract-cleaner).
json_payload "ask, state, blocker, actor" "grimorio.board-writer" > "$WORK/m.json"
set +e; OUT_M="$(run_hook "$WORK/m.json")"; EXIT_M=$?; set -e
assert_exit0 "$EXIT_M" "Case M — grimorio.board-writer (EXEMPT_TYPES), bare prompt, exit 0"
assert_empty "$OUT_M" "Case M — grimorio.board-writer ALLOWED, empty stdout"

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
