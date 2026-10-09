#!/usr/bin/env bash
# @subject: .grimorio/scripts/export/memory-split.mjs
# The CLAIM is not "15 files travel" -- it is that every EAGER load the published corpus declares into an
# unprefixed memory path can be satisfied by what travels. A count would pass while the one file that
# matters stayed behind.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
cd "$R" || exit 1
fail=0
t() { if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi; }

echo "=== THE CLAIM: no travelling PROMPT eagerly imports an unprefixed memory FILE that stays behind"
# Narrowed deliberately, twice. Only `.md` PROMPTS are read: a script's string literal is fixture text, not
# a load instruction -- `rename-refs-stores.mjs` names `import:memory/grimorio.demo`, which is invented.
# And only NAMED FILE targets count: a bare `import:memory/grimorio.x-memory` is a DIRECTORY load that
# resolves to whatever the installation holds, and for a store that is entirely project-level -- po-memory
# is `project.vision`, `project.features-status` -- the adopter is the one who creates it.
UNMET_LIST="$(node - <<'JS'
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const { classifyMemory } = await import("./.grimorio/scripts/export/memory-split.mjs");
const all = execFileSync("git", ["ls-files", ".grimorio"], { encoding: "utf8" }).trim().split(String.fromCharCode(10));
const travels = new Set(classifyMemory(all).travels);
const senders = all.filter((f) => f.endsWith(".md"))
  .filter((f) => !f.startsWith(".grimorio/memory/") || travels.has(f))
  .filter((f) => !f.split("/").some((s) => s.startsWith("project.")));
const unmet = new Set();
for (const f of senders) {
  let txt = ""; try { txt = readFileSync(f, "utf8"); } catch { continue; }
  for (const m of txt.matchAll(/import:memory\/([A-Za-z0-9.\/_-]+)/g)) {
    const target = m[1].replace(/[.,;:]+$/, "");
    const parts = target.split("/");
    if (parts.length < 2 || !target.endsWith(".md")) continue;
    if (parts.some((s) => s.startsWith("project."))) continue;
    if (!travels.has(".grimorio/memory/" + target)) unmet.add(f + " -> import:memory/" + target);
  }
}
for (const u of unmet) console.log(u);
JS
)"; NODE_RC=$?
# A CRASHED checker printed NOTHING and the assertion below read that as zero unmet -- a green that proved
# the opposite of what it claimed. The exit status is checked FIRST, and a non-zero one fails outright.
if [ "$NODE_RC" != "0" ]; then
  echo "  FAIL  the checker did not run (node exit $NODE_RC) -- an empty result is not a clean result"
  echo "$UNMET_LIST" | tail -5 | sed 's/^/        /'
  fail=1
else
  echo "$UNMET_LIST" | grep -v '^$' | sed 's/^/  UNMET /'
  t "no travelling prompt is left with an unsatisfiable eager FILE import" "$(echo "$UNMET_LIST" | grep -cv '^$')" "0"
fi

echo "=== THE THREE STRUCTURAL CLAUSES, each asserted on a file that proves it"
L="$(node .grimorio/scripts/export/memory-split.mjs --list)"
t "build-protocol.md travels -- the most-cited file in the corpus" "$(echo "$L" | grep -c 'developer-memory/build-protocol.md')" "1"
t "a store's own SKILL.md travels -- what a bare store import resolves to" "$(echo "$L" | grep -c 'grimorio.qa-memory/SKILL.md')" "1"
t "a SUBFOLDER file does NOT travel" "$(echo "$L" | grep -cE '/(designs|design-archive|docs|features)/')" "0"
t "a project.-prefixed root file does NOT travel" "$(echo "$L" | grep -c 'project\.')" "0"
t "the BOARD's store travels nothing -- the board itself is the declaration of truth" "$(echo "$L" | grep -c 'board-memory')" "0"

echo ""
if [ "$fail" = "0" ]; then echo "export-memory-split selftest: all cases passed"; else echo "export-memory-split selftest: FAILED"; fi
exit "$fail"
