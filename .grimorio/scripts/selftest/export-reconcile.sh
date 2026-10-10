#!/usr/bin/env bash
# @subject: .grimorio/scripts/export/publish.mjs
# Runs the REAL exporter, with --apply, against a fixture TARGET that holds an adopter's own work beside
# files grimorio published under an older layout. The claim is a pair and both halves need proving: what
# grimorio no longer publishes GOES, and what was never grimorio's STAYS. The first spelling of this step
# was `rm -rf` over whole folders, which proved the first half and destroyed the second.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
cd "$R" || exit 1
fail=0
t() { if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi; }
gone()  { if [ ! -e "$1" ]; then echo "  PASS  removed: $2"; else echo "  FAIL  still there: $2"; fail=1; fi; }
stays() { if [ -e "$1" ]; then echo "  PASS  kept: $2";     else echo "  FAIL  DELETED: $2"; fail=1; fi; }

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
G="$T/target"
mkdir -p "$G/.claude/agents" "$G/.claude/skills/their-skill" "$G/.claude/.cache" "$G/scripts/their-tools"

# THE ADOPTER'S OWN -- ARCHITECTURE.md section 2 names each of these as theirs.
echo "---"                      > "$G/.claude/agents/their-own-agent.md"
echo "their doctrine"           > "$G/.claude/skills/their-skill/SKILL.md"
echo "echo theirs"              > "$G/scripts/their-tools/build.sh"
echo '{"owner":"them"}'         > "$G/.claude/board-config.json"
# THE ADOPTER'S PROJECT MEMORY, which section 5 says lives inside grimorio's OWN container. The clear step
# used to wipe `.grimorio/` wholly on the claim that POSITION proved nothing of theirs was inside -- false,
# and it would have deleted an adopting project's entire project memory on every single export.
mkdir -p "$G/.grimorio/memory/grimorio.developer-memory" "$G/.grimorio/skills/grimorio.fan-out"
echo "their conventions"           > "$G/.grimorio/memory/grimorio.developer-memory/project.md"
echo "their traps"                 > "$G/.grimorio/memory/grimorio.developer-memory/project.traps.md"
echo "their independence test"     > "$G/.grimorio/skills/grimorio.fan-out/project.independence-test.md"
# and a file of GRIMORIO's under the same container that this export no longer publishes
mkdir -p "$G/.grimorio/skills/grimorio.retired"
echo "retired doctrine"            > "$G/.grimorio/skills/grimorio.retired/SKILL.md"
# WHAT GRIMORIO PUBLISHED UNDER AN OLDER LAYOUT and does not publish any more.
echo "obsolete doctrine"        > "$G/.claude/GRIMORIO-CHAIN.md"
echo '{"ts":"x"}'               > "$G/.claude/.cache/run-log.jsonl"
echo "---"                      > "$G/.claude/agents/grimorio.retired-agent.md"

( cd "$G" && git init -q && git add -A . \
  && git -c user.name=t -c user.email=t@localhost commit -q -m fixture ) >/dev/null 2>&1

OUT="$(node .grimorio/scripts/export/publish.mjs --target "$G" --apply 2>&1)"; CODE=$?
t "the export completes" "$CODE" "0"

echo "=== THE ADOPTER'S OWN WORK SURVIVES -- the half the folder wipe destroyed"
stays "$G/.claude/agents/their-own-agent.md"      "their unprefixed agent"
stays "$G/.claude/skills/their-skill/SKILL.md"    "their own skill folder"
stays "$G/scripts/their-tools/build.sh"           "their root script"
stays "$G/.claude/board-config.json"              "their board config"
stays "$G/.grimorio/memory/grimorio.developer-memory/project.md"       "their project memory, inside grimorio's own container"
stays "$G/.grimorio/memory/grimorio.developer-memory/project.traps.md" "their traps file"
stays "$G/.grimorio/skills/grimorio.fan-out/project.independence-test.md" "their companion inside a grimorio skill"

echo "=== WHAT GRIMORIO NO LONGER PUBLISHES IS REMOVED"
gone "$G/.claude/GRIMORIO-CHAIN.md"               "a doctrine document left at the surface root"
gone "$G/.claude/.cache/run-log.jsonl"            "a published run log"
gone "$G/.claude/agents/grimorio.retired-agent.md" "a retired grimorio agent stub"
gone "$G/.grimorio/skills/grimorio.retired/SKILL.md" "a retired grimorio skill, inside the same container their files sit in"

echo "=== AND IT SAYS SO -- a silent reconcile cannot be reviewed"
# EACH removal by name, never a total: the total changed the moment this suite gained a case, and a count
# is not the claim -- the claim is that a reader can see WHAT was removed.
for f in ".claude/GRIMORIO-CHAIN.md" ".claude/.cache/run-log.jsonl" ".claude/agents/grimorio.retired-agent.md" ".grimorio/skills/grimorio.retired/SKILL.md"; do
  t "the report names $f" "$(echo "$OUT" | grep -c "superseded: $f")" "1"
done
t "and it reports nothing of the adopter's as superseded" "$(echo "$OUT" | grep '^    superseded: ' | grep -c 'project\.')" "0"
t "the retired stub is named" "$(echo "$OUT" | grep -c 'superseded: .claude/agents/grimorio.retired-agent.md')" "1"

echo "=== PER FILE, NOT PER FOLDER: the proof is that one folder lost one file and kept the other"
t "their agent and the retired stub shared .claude/agents/" "$(ls "$G/.claude/agents" | grep -c 'their-own-agent.md')" "1"

echo ""
if [ "$fail" = "0" ]; then echo "export-reconcile selftest: all cases passed"; else echo "export-reconcile selftest: FAILED"; fi
exit "$fail"
