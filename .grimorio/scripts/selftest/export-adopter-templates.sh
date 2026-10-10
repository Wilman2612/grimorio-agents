#!/usr/bin/env bash
# @subject: .grimorio/scripts/export/adopter-templates.mjs
# The CLAIM: no travelling prompt is left with an eager load on a `project.` companion that the export
# seeds nothing for. The seed set is DERIVED from the citation graph, so the proof is a comparison against
# that graph -- never against a count, which would pass while the one slot that mattered went unseeded.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
cd "$R" || exit 1
fail=0
t() { if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi; }

echo "=== THE CLAIM: every eagerly-imported project. companion has a slot"
OUT="$(node - <<'JS'
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const u = (f) => pathToFileURL(root + "/.grimorio/scripts/export/" + f).href;
const { classifyMemory } = await import(u("memory-split.mjs"));
const { collectAdopterSlots } = await import(u("adopter-templates.mjs"));
const slots = new Set(collectAdopterSlots(root, classifyMemory).keys());
const all = execFileSync("git", ["-C", root, "ls-files", ".grimorio"], { encoding: "utf8" }).trim().split(String.fromCharCode(10));
const travels = new Set(classifyMemory(all).travels);
const senders = all.filter((f) => f.endsWith(".md"))
  .filter((f) => !f.startsWith(".grimorio/memory/") || travels.has(f))
  .filter((f) => !f.split("/").some((s) => s.startsWith("project.")));
const unseeded = new Set();
for (const f of senders) {
  let txt = ""; try { txt = readFileSync(root + "/" + f, "utf8"); } catch { continue; }
  for (const m of txt.matchAll(/import:(memory|skill)\/([A-Za-z0-9.\/_#-]+)/g)) {
    const rel = m[2].replace(/[.,;:]+$/, "").split("#")[0];
    if (!rel.endsWith(".md")) continue;
    const parts = rel.split("/");
    // Only a `project.` companion INSIDE a grimorio container: a `project.` CONTAINER is the adopter's own
    // invention and this corpus has no shape to offer for it.
    if (!parts[0].startsWith("grimorio.") || !parts.slice(1).some((s) => s.startsWith("project."))) continue;
    const key = (m[1] === "memory" ? ".grimorio/memory/" : ".grimorio/skills/") + rel;
    if (!slots.has(key)) unseeded.add(f + " -> " + key);
  }
}
for (const x of unseeded) console.log("UNSEEDED " + x);
console.log("COUNT " + slots.size);
JS
)"; NODE_RC=$?
if [ "$NODE_RC" != "0" ]; then
  echo "  FAIL  the checker did not run (node exit $NODE_RC) -- an empty result is not a clean result"
  echo "$OUT" | tail -5 | sed 's/^/        /'; fail=1
else
  echo "$OUT" | grep '^UNSEEDED' | sed 's/^/  /'
  t "no eagerly-imported companion is left unseeded" "$(echo "$OUT" | grep -c '^UNSEEDED')" "0"
  t "the graph yielded slots at all -- zero would make the line above vacuous" \
    "$(echo "$OUT" | grep '^COUNT' | awk '{print ($2 > 0) ? "yes" : "no"}')" "yes"
fi

echo "=== THE TEMPLATE SAYS WHAT IS WANTED, and leaks no authoring-project heading"
S="$(node .grimorio/scripts/export/adopter-templates.mjs --sample 2>/dev/null)"
t "it names the prompts that import it" "$(echo "$S" | grep -c 'Imported by')" "1"
t "it says the file is the adopter's and EXPECTED" "$(echo "$S" | grep -c 'is YOURS, and it is EXPECTED')" "1"
# The anchor TEXT must never ship: one of this project's own anchors names a milestone.
ALL="$(node - <<'JS2'
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const u = (f) => pathToFileURL(root + "/.grimorio/scripts/export/" + f).href;
const { classifyMemory } = await import(u("memory-split.mjs"));
const { collectAdopterSlots, renderTemplate } = await import(u("adopter-templates.mjs"));
const slots = collectAdopterSlots(root, classifyMemory);
let out = "";
for (const [k, v] of slots) out += renderTemplate(k, v);
console.log(out);
JS2
)"
t "no rendered template carries an authoring anchor slug" "$(echo "$ALL" | grep -c 'current-milestone')" "0"
# AT LEAST ONE, not exactly one: several slots carry anchored imports and the count moves with the corpus.
t "but a template WITH anchored imports tells the adopter how to find them"   "$(echo "$ALL" | awk '/address a heading in this file BY NAME/{n++} END{print (n>0)?"yes":"no"}')" "yes"
t "and every one of those hands them a runnable grep rather than a name"   "$(echo "$ALL" | awk '/address a heading in this file BY NAME/{a++} /grep -rn/{g++} END{print (a>0 && a==g)?"yes":"no"}')" "yes"

echo "=== A SEEDED SLOT IS NEVER WRITTEN OVER -- the one loss an export must not cause"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
G="$T/target"; mkdir -p "$G/.grimorio/memory/grimorio.developer-memory"
echo "THEIR OWN CONVENTIONS, hand-written" > "$G/.grimorio/memory/grimorio.developer-memory/project.md"
( cd "$G" && git init -q && git add -A . && git -c user.name=t -c user.email=t@localhost commit -q -m f ) >/dev/null 2>&1
OUT2="$(node .grimorio/scripts/export/publish.mjs --target "$G" --apply 2>&1)"; CODE=$?
t "the export completes" "$CODE" "0"
t "their file is untouched" "$(grep -c 'THEIR OWN CONVENTIONS' "$G/.grimorio/memory/grimorio.developer-memory/project.md")" "1"
# The RELATION, not the two numbers: the slot count moves with the corpus, and this assertion already
# went red once for that reason alone. What it claims is that EXACTLY ONE was left alone -- theirs.
t "and it is reported as already written, not seeded" "$(echo "$OUT2" | awk '/adopter slots/{for(i=1;i<=NF;i++) if($i=="already") print $(i-1)}')" "1"

echo ""
if [ "$fail" = "0" ]; then echo "export-adopter-templates selftest: all cases passed"; else echo "export-adopter-templates selftest: FAILED"; fi
exit "$fail"
