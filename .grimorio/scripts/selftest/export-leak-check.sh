#!/usr/bin/env bash
# @subject: .grimorio/scripts/export/leak-check.mjs
# Proves the leak gate FAILS on each thing it claims to catch. A gate that has only ever been green is not
# a gate: the two RED cases below are what make its PASS mean anything.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
cd "$R" || exit 1
fail=0
t() { if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi; }

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
# A fixture repo with the same SHAPE: an export set, an excluded memory tree, and the declaration.
mk() {
  # the fixture mirrors the real split: the TOOL under .grimorio/, the adopter's DECLARATION at the root
  rm -rf "$T/r"; mkdir -p "$T/r/.grimorio/skills/s" "$T/r/.grimorio/memory/m" \
    "$T/r/.grimorio/scripts/export" "$T/r/scripts/export"
  echo "general doctrine, names nobody" > "$T/r/.grimorio/skills/s/SKILL.md"
  echo "the product is acmeproduct and this is the adopter's own note" > "$T/r/.grimorio/memory/m/project.note.md"
  cat > "$T/r/scripts/export/project.export-markers.json" <<'J'
{ "markers": ["acmeproduct"], "reviewed": {},
  "secretPatterns": ["sk-test-[a-f0-9]{8,}"],
  "personalPatterns": ["someone@example[.]com"],
  "credentialFileShapes": ["[.]env$"] }
J
  # COPY the real tool AND the declaration module it imports -- a hand-written twin of either drifts,
  # which this suite has already paid for once: a printf-written JSON turned a regex word boundary
  # into a literal backspace byte and the fixture quietly tested nothing.
  # EVERY module in the export toolchain, by GLOB rather than by name. A hand-listed copy fell behind
  # twice -- once when the allowlist was extracted and once when the memory split was -- and each time the
  # sandbox ran a tool whose import was missing, so the whole suite went red for a reason unrelated to
  # anything it tests. A list of what a tool imports is a list that goes quiet when it falls behind.
  cp "$R"/.grimorio/scripts/export/*.mjs "$T/r/.grimorio/scripts/export/"
}

echo "=== GREEN: a clean export set passes, and the adopter's own tree is excluded"
mk
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "clean set exits 0" "$CODE" "0"
t "clean set reports PASS" "$(echo "$OUT" | grep -c '^PASS')" "1"
# assert WHAT IT MEANS, never a file count: the count changed the moment the fixture gained a file, and a
# total is not the claim -- the claim is that the adopter's memory tree is excluded.
t "the memory tree is NOT in the export set" "$(echo "$OUT" | grep -c 'excluded: 1 ')" "1"

echo "=== RED 1: an UNREVIEWED adopter marker inside the export set must FAIL"
mk
echo "this one mentions acmeproduct and nobody reviewed it" >> "$T/r/.grimorio/skills/s/SKILL.md"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "unreviewed marker exits 1" "$CODE" "1"
t "unreviewed marker is named as a LEAK" "$(echo "$OUT" | grep -c '^LEAK')" "1"

echo "=== RED 2: a review that no longer matches anything must FAIL as STALE, never pass silently"
mk
python - "$T/r/scripts/export/project.export-markers.json" <<'PY'
import json,sys
p=sys.argv[1]; d=json.load(open(p))
d["reviewed"]={".grimorio/skills/gone/SKILL.md":"GENERALIZE - a file that is not there any more"}
json.dump(d,open(p,"w"))
PY
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "stale review exits 1" "$CODE" "1"
t "stale review is named as STALE-REVIEW" "$(echo "$OUT" | grep -c '^STALE-REVIEW')" "1"

echo "=== RED 3: a marker inside a project.-prefixed FOLDER is excluded, so it must NOT fail"
mk
mkdir -p "$T/r/.grimorio/skills/project.theirs"
echo "acmeproduct all over this one" > "$T/r/.grimorio/skills/project.theirs/SKILL.md"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "a project.-prefixed FOLDER is excluded by the prefix, not by its path" "$CODE" "0"

echo "=== RED 4: .claude/ is an ALLOWLIST -- an adopter's own UNPREFIXED agent must be held back"
mk
mkdir -p "$T/r/.claude/agents" "$T/r/.claude/skills/grimorio.x"
echo "---" > "$T/r/.claude/agents/grimorio.real.md"
echo "---" > "$T/r/.claude/agents/their-own-agent.md"
echo "---" > "$T/r/.claude/agents/project.theirs.md"
echo "---" > "$T/r/.claude/skills/grimorio.x/SKILL.md"
# The TWO configs sitting side by side, which is the case that decides the rule: one is grimorio's
# committed DEFAULTS (every hook reads it, and the loader THROWS without it), the other names the adopter,
# their project and their repo. Extension and folder are identical, so only ownership separates them.
echo '{"language":"en"}' > "$T/r/.claude/grimorio-config.json"
echo '{"owner":"someone","repo":"theirs"}' > "$T/r/.claude/board-config.json"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"
t "the grimorio adapter, the stub and the DEFAULTS config export" "$(echo "$OUT" | grep -c '3 publication-surface')" "1"
t "an adopter's UNPREFIXED agent is held -- the prefix rule can never catch it" "$(echo "$OUT" | grep -c 'held: .claude/agents/their-own-agent.md')" "1"
t "the adopter's prefixed agent is held too" "$(echo "$OUT" | grep -c 'held: .claude/agents/project.theirs.md')" "1"
# The ADOPTER's board config is held although it carries no prefix and sits in the same folder with the
# same extension as the defaults that travel: the two are separated by what they CONTAIN, nothing else.
t "the adopter's board config is held beside the defaults that travel" "$(echo "$OUT" | grep -c '3 held back')" "1"

echo "=== RED 5: a BYTE-IDENTICAL settings.json in the target must FAIL -- it has to be adapted, not copied"
mk
mkdir -p "$T/r/.claude" "$T/target/.claude"
printf '{"hooks":{}}' > "$T/r/.claude/settings.json"
printf '{"hooks":{}}' > "$T/target/.claude/settings.json"
OUT="$(cd "$T/r" && EXPORT_TARGET="$T/target" node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "a copied settings.json exits 1" "$CODE" "1"
t "a copied settings.json is named as a LEAK" "$(echo "$OUT" | grep -c 'settings.json is BYTE-IDENTICAL')" "1"

echo "=== RED 6: a CREDENTIAL in the export set must FAIL and name the pattern"
mk
echo "the key is sk-test-deadbeef99" >> "$T/r/.grimorio/skills/s/SKILL.md"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "a credential in the export set exits 1" "$CODE" "1"
t "it is named as SECRET, with its pattern" "$(echo "$OUT" | grep -c '^SECRET.*sk-test')" "1"

echo "=== RED 7: a PERSONAL datum in the export set must FAIL"
mk
echo "written by someone@example.com" >> "$T/r/.grimorio/skills/s/SKILL.md"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "a personal datum exits 1" "$CODE" "1"
t "it is named as SECRET" "$(echo "$OUT" | grep -c '^SECRET.*example')" "1"

echo "=== RED 8: a credential-bearing FILE SHAPE in the export set must FAIL on its NAME alone"
mk
echo "nothing secret inside at all" > "$T/r/.grimorio/skills/s/.env"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"; CODE=$?
t "a .env in the export set exits 1 on its name, whatever it contains" "$CODE" "1"
t "it is named as a credential-bearing shape" "$(echo "$OUT" | grep -c 'credential-bearing file shape')" "1"

echo "=== RED 9: a pattern that CANNOT go red is reported UNPROVEN -- a zero from it proves nothing"
mk
python - "$T/r/scripts/export/project.export-markers.json" <<'PY2'
import json,sys
p=sys.argv[1]; d=json.load(open(p))
d["secretPatterns"]=["THIS-SHAPE-EXISTS-NOWHERE-[0-9]{6}"]
json.dump(d,open(p,"w"))
PY2
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"
# assert the SPECIFIC pattern, not a count: the fixture's personal pattern is unproven there too, and an
# assertion on the total would have to be rewritten every time the fixture gains a declaration.
t "the pattern matching nothing anywhere is reported UNPROVEN, by name" "$(echo "$OUT" | grep -c 'UNPROVEN.*THIS-SHAPE-EXISTS-NOWHERE')" "1"
t "but UNPROVEN alone does not fail the gate -- it is a warning about the proof, not a leak" "$(echo "$OUT" | grep -c '^PASS')" "1"

echo "=== RED 10: a hook LIBRARY must travel with its dispatcher -- the allowlist read module format, not ownership"
mk
mkdir -p "$T/r/.claude/hooks"
echo "// the dispatcher settings.json wires" > "$T/r/.claude/hooks/dispatch.cjs"
echo "// the module the dispatcher imports"  > "$T/r/.claude/hooks/dispatch-lib.mjs"
echo "notes nobody runs"                     > "$T/r/.claude/hooks/readme.txt"
OUT="$(cd "$T/r" && node .grimorio/scripts/export/leak-check.mjs 2>&1)"
# BOTH halves, because either alone is satisfied by the bug this closes: the count alone read 1 while the
# allowlist admitted .cjs only, and "not held" alone is also true of a file the walk never reached at all.
t "the dispatcher AND the library it imports both export" "$(echo "$OUT" | grep -c '2 publication-surface')" "1"
t "the .mjs library is not among the held-back files" "$(echo "$OUT" | grep -c 'held: .claude/hooks/dispatch-lib.mjs')" "0"
t "a non-executable file in the same folder IS held back" "$(echo "$OUT" | grep -c 'held: .claude/hooks/readme.txt')" "1"

echo ""
if [ "$fail" = "0" ]; then echo "export-leak-check selftest: all cases passed"; else echo "export-leak-check selftest: FAILED"; fi
exit "$fail"
