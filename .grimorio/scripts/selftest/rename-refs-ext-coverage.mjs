// @keep-comment -- a cross-file contract note: this file is what keeps TEXT_EXT in
// .grimorio/scripts/refobl/rename-forms.mjs honest. It proves that constant REACHES every tracked file carrying a
// reference. A mechanism, not a wider list: `html`, `css` and `go` were missing on 2026-10-03 and five
// real references survived a completed store move while every verification reported +0, because the
// rewriter could not see those files and audit-chain.mjs walks only `.md`.
import { execFileSync } from "node:child_process";
import { TEXT_EXT } from "../refobl/rename-forms.mjs";

const REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();

let pass = 0;
let fail = 0;
const check = (name, cond, detail) => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}\n         ${detail}`); }
};

// A file CARRIES a reference when it writes a prefixed reference token, or spells out a path under one of
// the corpus containers. Both are forms rename-refs rewrites, so both define the reach it needs.
const CARRIER = "(import|ref|cite):(skill|repo|tmp|ext|memory|agent)/|\\.(grimorio|claude)/(skills|skills-store|memory|agents)/";

function carriers() {
  try {
    return execFileSync("git", ["grep", "-lE", CARRIER], { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
      .split("\n").map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    // git grep exits 1 on no match; anything else is a real failure and must not read as "all clear".
    if (e.status === 1) return [];
    throw e;
  }
}

const all = carriers();
check("the corpus has carrier files at all (a zero here would make every assertion below vacuous)", all.length > 50, `only ${all.length} carrier file(s) found`);

// `.claude/hooks/**` is frozen to every agent by grimorio-conduct rule 5c, so the rewriter is not
// supposed to reach it: its references are kept resolving by skill-roots.json's own legacy maps instead.
const uncovered = all.filter((f) => !f.startsWith(".claude/hooks/") && !TEXT_EXT.test(f));
check(
  "every tracked carrier file's extension is inside TEXT_EXT",
  uncovered.length === 0,
  `${uncovered.length} carrier file(s) the rewriter cannot see -- widen TEXT_EXT in .grimorio/scripts/refobl/rename-forms.mjs:\n         ` +
    uncovered.slice(0, 20).join("\n         "),
);

// THE CONTROL. The predicate above must be able to SEE a gap, or its green means nothing. A synthetic
// path with an extension nobody uses must read as uncovered, and a `.md` path must read as covered.
check("CONTROL: the predicate reports an extension outside the list as UNCOVERED", !TEXT_EXT.test("a/b/c.sql"), "TEXT_EXT matched .sql, so this checker cannot see a gap");
check("CONTROL: and reports one inside the list as COVERED", TEXT_EXT.test("a/b/c.md"), "TEXT_EXT missed .md, so this checker rejects everything");

console.log(`\nrename-refs-ext-coverage: ${pass} passed, ${fail} failed  (${all.length} carrier file(s) scanned)`);
process.exit(fail === 0 ? 0 : 1);
