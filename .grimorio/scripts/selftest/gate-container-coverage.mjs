// @keep-comment -- a cross-file contract note. Every GATE that classifies a file by which container it
// sits in must see EVERY container, derived from .grimorio/scripts/refobl/skill-roots.json. This is the GENERAL form
// of a defect that recurred four times in one day: a hand-kept container list inside a gate does not go
// noisy when it falls behind the corpus -- it goes QUIET, and a quiet gate reads exactly like a passing
// one. refobl-store-coverage.mjs pins the scripts/refobl/ toolkit; this pins the commit-gate pipeline.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { CORPUS_ROOTS, SKILL_ROOTS } = require("../refobl/resolve.cjs");
const REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();

let pass = 0;
let fail = 0;
const check = (name, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}\n         ${detail}`); }
};

const run = (args) => {
  try { return { code: 0, out: execFileSync("node", args, { cwd: REPO, encoding: "utf8" }) }; }
  catch (e) { return { code: e.status ?? -1, out: String(e.stdout || "") + String(e.stderr || "") }; }
};

const SHAPE = ".grimorio/skills/grimorio.agent-writing/scripts/check-prompt-shape.mjs";
const PLACEMENT = ".grimorio/scripts/check-work-product-placement.mjs";

check("there is more than one container to be blind to", CORPUS_ROOTS.length > 1, `CORPUS_ROOTS=${JSON.stringify(CORPUS_ROOTS)}`);

// GATE 1 — the prompt SHAPE check must recognise a SKILL.md and a behavior file in every container.
for (const root of CORPUS_ROOTS) {
  for (const base of ["SKILL.md", "behavior.md"]) {
    const p = `${root}grimorio.probe/${base}`;
    const r = run([SHAPE, "--select", p]);
    check(`check-prompt-shape sees ${base} under ${root}`, r.out.includes(p), `--select printed nothing for ${p}`);
  }
}
// And must still NOT claim an ordinary record. `skills/` is deliberately shallow-and-curated, so ANY .md
// one level deep IS a prompt there — the discrimination only applies to the other containers.
for (const root of CORPUS_ROOTS.filter((r) => !SKILL_ROOTS.includes(r) || !r.endsWith("skills/"))) {
  const p = `${root}grimorio.probe/project.md`;
  const r = run([SHAPE, "--select", p]);
  check(`CONTROL: check-prompt-shape does NOT claim project.md under ${root}`, !r.out.includes(p), `--select claimed ${p} as a prompt`);
}

// GATE 2 — the rule-17b work-product gate must flag an artifact filename in every container.
for (const root of CORPUS_ROOTS) {
  const p = `${root}grimorio.probe/code-review.md`;
  const r = run([PLACEMENT, p]);
  check(`check-work-product-placement flags a work product under ${root}`, r.out.includes(p), `passed silently: ${p}`);
}
check("CONTROL: the work-product gate does NOT flag a path outside every container",
  !run([PLACEMENT, "apps/web/src/thing/code-review.md"]).out.includes("apps/web/src/thing/code-review.md"),
  "the gate flags everything, so its green means nothing");

// GATE 3 — pre-commit.sh must DELEGATE the prompt classifier, never re-derive it. Two copies of one
// classifier is how one of them falls behind: the bash copy read `skills`/`skills-store` only, so every
// SKILL.md and behavior file under `.grimorio/memory/` was never handed to the shape check at all.
const preCommit = execFileSync("node", ["-e", 'process.stdout.write(require("fs").readFileSync(".grimorio/scripts/pre-commit.sh","utf8"))'], { cwd: REPO, encoding: "utf8" });
check("pre-commit.sh delegates prompt selection to the one classifier",
  /--select/.test(preCommit) && /check-prompt-shape\.mjs/.test(preCommit),
  "pre-commit.sh does not call --select, so it is classifying prompts itself");
check("pre-commit.sh carries no second copy of the container pattern",
  !/skills-store\/\[\^\/\]\+\/\(SKILL/.test(preCommit),
  "pre-commit.sh still hand-derives the prompt-path regex in bash");

// BOTH DIRECTIONS, asserted together. Two fixes on this branch oscillated: the delegation crashed in a
// corpus-less fixture tree, so it was made to degrade; degrading was then too permissive, so it was made
// to throw selectively. Each fix proved the direction that had just broken and left the other free, so
// the pair must be pinned at once -- QUIET only where quiet is right, NOISY everywhere else.
check("pre-commit's quiet path is BOUNDED to a genuinely corpus-less tree",
  /\[ -f "\$shape_check" \]/.test(preCommit) && /\[ -f [.]grimorio\/scripts\/refobl\/resolve\.cjs \]/.test(preCommit),
  "the guard does not require BOTH the classifier and the declaration, so it can go quiet for other reasons");
check("pre-commit's noisy path still exists: a classifier that IS present and fails blocks the commit",
  /--select\)\s*\\?\s*\n?\s*\|\| fail/.test(preCommit) || /\|\| fail "the prompt classifier itself failed to run/.test(preCommit),
  "there is no `|| fail` on the classifier call, so a present-but-broken classifier passes silently");

// GATE 4 — a gate that cannot READ the declaration must DIE, never answer "nothing to see". Degrading to
// an empty container set is correct ONLY for a genuinely absent module (a corpus-less fixture tree); a
// corrupt or unparseable declaration is a different thing entirely, and swallowing it turns the gate off
// exactly when the thing it guards is most likely wrong. This is governance.cjs's own stated precedent.
{
  const tmp = mkdtempSync(join(tmpdir(), "gate-container-"));
  try {
    cpSync(join(REPO, ".grimorio/scripts"), join(tmp, ".grimorio/scripts"), { recursive: true });
    writeFileSync(join(tmp, ".grimorio/scripts/refobl/skill-roots.json"), '{ "roots": [ NOT VALID JSON');
    const r = run([join(tmp, ".grimorio/scripts/check-work-product-placement.mjs"), ".grimorio/memory/grimorio.probe/code-review.md"]);
    check("the rule-17b gate DIES on a corrupt declaration rather than passing silently", r.code !== 0, `exit ${r.code} -- it answered "nothing to see" on a declaration it could not read`);
    // The SIBLING gate, same corruption, same direction. Both gates reach the same declaration, and a
    // previous pass had them disagree -- one died, one went quiet -- in a single diff.
    const rs = run([join(tmp, ".grimorio/skills/grimorio.agent-writing/scripts/check-prompt-shape.mjs"), "--select", ".grimorio/memory/grimorio.probe/SKILL.md"]);
    check("the prompt-shape gate DIES on a corrupt declaration too", rs.code !== 0, `exit ${rs.code} -- the two gates disagree on the same unreadable declaration`);
    const missing = mkdtempSync(join(tmpdir(), "gate-nocorpus-"));
    try {
      cpSync(join(REPO, ".grimorio/scripts/check-work-product-placement.mjs"), join(missing, "check-work-product-placement.mjs"));
      const r2 = run([join(missing, "check-work-product-placement.mjs"), "tmp/anything/code-review.md"]);
      check("CONTROL: and still DEGRADES cleanly when the module is genuinely absent", r2.code === 0, `exit ${r2.code} -- a corpus-less tree must not be an error`);
    } finally { rmSync(missing, { recursive: true, force: true }); }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

console.log(`\ngate-container-coverage: ${pass} passed, ${fail} failed  (${CORPUS_ROOTS.length} container(s), 4 gate(s))`);
process.exit(fail === 0 ? 0 : 1);
