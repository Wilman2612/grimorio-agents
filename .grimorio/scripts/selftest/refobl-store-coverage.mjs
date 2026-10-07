// @keep-comment -- a cross-file contract note: every tool in .grimorio/scripts/refobl/ must see EVERY container the
// corpus lives in, not only the `skill` store's own roots. Declaring a store in skill-roots.json and
// leaving a sibling tool blind to it is this toolkit's own worst failure mode, because a blind tool does
// not go noisy -- it goes QUIET. Measured 2026-10-03: moving 13 memory skills to `.grimorio/memory/`
// silently dropped their SKILL.md and every `*behavior*.md` out of the rule-20 governance set.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { CORPUS_ROOTS, SKILL_ROOTS, STORES, STORE_NAMES } = require("../refobl/resolve.cjs");
const { isGovernance } = require("../refobl/governance.cjs");

let pass = 0;
let fail = 0;
const check = (name, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}\n         ${detail}`); }
};

check("skill-roots.json declares at least one store beyond the skill roots", STORE_NAMES.length > 0, "no stores declared, so every assertion below is vacuous");
check("CORPUS_ROOTS covers every skill root AND every store root",
  SKILL_ROOTS.every((r) => CORPUS_ROOTS.includes(r)) && Object.values(STORES).every((r) => CORPUS_ROOTS.includes(r)),
  `CORPUS_ROOTS=${JSON.stringify(CORPUS_ROOTS)} vs roots=${JSON.stringify(SKILL_ROOTS)} stores=${JSON.stringify(STORES)}`);

// GOVERNANCE is the one with teeth: a container missing here makes a rule-20 file WRITABLE.
for (const root of CORPUS_ROOTS) {
  check(`governance recognises SKILL.md under ${root}`, isGovernance(`${root}grimorio.probe/SKILL.md`), `${root}grimorio.probe/SKILL.md read as ungoverned`);
  check(`governance recognises a behavior file under ${root}`, isGovernance(`${root}grimorio.probe/behavior.md`), `${root}grimorio.probe/behavior.md read as ungoverned`);
}
// THE CONTROL. If the predicate said yes to everything it would prove nothing.
check("CONTROL: governance does NOT claim an ordinary companion file", !isGovernance(".grimorio/memory/grimorio.probe/project.md"), "isGovernance() is true for everything, so its green means nothing");
check("CONTROL: governance does NOT claim a path outside every container", !isGovernance("apps/web/src/thing/SKILL.md"), "isGovernance() matched a path under no corpus root");

// Every sibling tool must read the SHARED declaration, never its own copy. A hand-kept second copy of
// this array has already silently dropped a root once, which is why skill-roots.json is a FILE.
const SIBLINGS = ["prefix.cjs", "pin-cites.cjs", "anchorwork.cjs", "governance.cjs"];
const src = (f) => execFileSync("node", ["-e", `process.stdout.write(require("fs").readFileSync(".grimorio/scripts/refobl/${f}","utf8"))`], { encoding: "utf8" });
for (const f of SIBLINGS) {
  const text = src(f);
  check(`${f} walks the corpus, not just the skill roots`,
    !/SKILL_ROOTS\.flatMap\(\(r\) => \{ try \{ return walk\(/.test(text),
    `${f} still builds its file population from SKILL_ROOTS alone, so every store's files are invisible to it`);
}
// A hardcoded store alternation is the other half of the same blindness: the tool parses references, so a
// store missing from its own regex is a reference it silently does not see.
for (const f of ["anchorwork.cjs"]) {
  const text = src(f);
  check(`${f} splices the store axis from the shared declaration`,
    !/\(\?:skill\|repo\|tmp\|ext\)/.test(text),
    `${f} hardcodes the four original stores in its reference regex`);
}

console.log(`\nrefobl-store-coverage: ${pass} passed, ${fail} failed  (${CORPUS_ROOTS.length} container(s), ${SIBLINGS.length} sibling tool(s))`);
process.exit(fail === 0 ? 0 : 1);
