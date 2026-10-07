// The STORE axis and the two refusals that came with it: FROZEN (policy, fixed) and --exclude (the
// caller's judgement). The three original rename-pass failures live in rename-refs.mjs.
import { rmSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  SKILL, RENAME, SIBLING_ARGS, fixture, siblingFixture, run, read, counters,
} from "../lib/rename-refs-fixture.mjs";

const { check, done } = counters("rename-refs-stores");

// ---------------------------------------------------------------------------
// --store — the STORE AXIS. A cross-root --prefix leaves `ref:skill/<name>` untouched BY DESIGN, which
// is right between two skill roots and WRONG between two stores. The RED half below is that gap.
// ---------------------------------------------------------------------------
const STORE_DEST = ".grimorio/memory/grimorio.demo";
{
  const root = fixture();
  const r = run(root, ["--prefix", SKILL, STORE_DEST, "--no-verify", "--quiet"]);
  const skill = read(root, `${STORE_DEST}/SKILL.md`) || "";
  check(
    "store RED: --prefix ALONE leaves the `ref:skill/` store token pointing at the old store",
    r.code === 0 && skill.includes("import:skill/grimorio.demo/project.vision.md"),
    `exit ${r.code}\n${skill}`,
  );
  check(
    "store RED: and the repo-path form WAS rewritten, so the gap is the store token alone",
    skill.includes(`ref:repo/${STORE_DEST}/project.vision.md`),
    skill,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, ["--prefix", SKILL, STORE_DEST, "--store", "skill", "memory", "grimorio.demo", "--no-verify", "--quiet"]);
  const skill = read(root, `${STORE_DEST}/SKILL.md`) || "";
  check("store GREEN: the combined move exits 0", r.code === 0, `exit ${r.code}\n${r.out}`);
  check(
    "store GREEN: the import: relation's store token is rewritten",
    skill.includes("import:memory/grimorio.demo/project.vision.md#the-core-idea"),
    skill,
  );
  check(
    "store GREEN: the ref: relation's store token is rewritten too",
    skill.includes("ref:memory/grimorio.demo/project.vision-pointers.md"),
    skill,
  );
  check("store GREEN: no `skill/` store token for this name survives anywhere in the file", !skill.includes(":skill/grimorio.demo"), skill);
  check(
    "store GREEN: the repo-path form still travels with the --prefix half",
    skill.includes(`ref:repo/${STORE_DEST}/project.vision.md`),
    skill,
  );
  check("store GREEN: the anchor survived the store rewrite", skill.includes("#the-core-idea"), skill);
  check("store GREEN: the files really moved", read(root, `${STORE_DEST}/project.vision.md`) !== null, "the tree did not move");
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, ["--store", "skill", "nosuchstore", "grimorio.demo", "--no-verify", "--quiet"]);
  check(
    "store GREEN: an unknown store token is REFUSED, never written as an unresolvable reference",
    r.code === 2 && /unknown target store/.test(r.out),
    `exit ${r.code}\n${r.out}`,
  );
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// FROZEN — rule 5c's CEO-reserved files: rewriting one breaches the rule, skipping one quietly hides
// the residue the resolver's own fallback maps then have to keep healing. Neither is acceptable.
// ---------------------------------------------------------------------------
{
  const root = fixture();
  run(root, ["--store", "skill", "memory", "grimorio.demo", "--no-verify", "--quiet"], { RENAME_REFS_UNSAFE: "frozen" });
  check(
    "frozen RED: with the frozen guard disabled, CLAUDE.md IS rewritten",
    (read(root, "CLAUDE.md") || "").includes("ref:memory/grimorio.demo"),
    `the seam did not reproduce the failure:\n${read(root, "CLAUDE.md")}`,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, ["--store", "skill", "memory", "grimorio.demo", "--no-verify"]);
  check("frozen GREEN: CLAUDE.md is left byte-identical", (read(root, "CLAUDE.md") || "").includes("ref:skill/grimorio.demo"), read(root, "CLAUDE.md"));
  check("frozen GREEN: and it is REPORTED by name, not silently skipped", /FROZEN -- NOT REWRITTEN/.test(r.out) && /CLAUDE\.md/.test(r.out), r.out);
  check("frozen GREEN: a frozen file is not counted as rewritten", !/\dx {2}CLAUDE\.md/.test(r.out.split("FROZEN")[0]), r.out);
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// --exclude — `63532675` running the OTHER way: a form the rewriter DOES generate, firing where the old
// form is the SUBJECT. Unmechanisable, so it is an argument, and it is reported rather than silent.
// ---------------------------------------------------------------------------
const EXCLUDE_TARGET = `${SKILL}/trailing-dot-referrer.md`;
{
  const root = fixture();
  run(root, ["--store", "skill", "memory", "grimorio.demo", "--no-verify", "--quiet"]);
  check(
    "exclude RED: with no --exclude, the subject file IS rewritten",
    (read(root, EXCLUDE_TARGET) || "").includes("ref:memory/grimorio.demo"),
    `the premise does not hold, so the green assertion below proves nothing:\n${read(root, EXCLUDE_TARGET)}`,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, ["--store", "skill", "memory", "grimorio.demo", "--exclude", EXCLUDE_TARGET, "--no-verify"]);
  check("exclude GREEN: the named file keeps the OLD form", (read(root, EXCLUDE_TARGET) || "").includes("ref:skill/grimorio.demo"), read(root, EXCLUDE_TARGET));
  check("exclude GREEN: and it is REPORTED with its hit count, never silently skipped", /EXCLUDED -- NOT REWRITTEN/.test(r.out) && /1x {2}.*trailing-dot-referrer\.md/.test(r.out), r.out);
  check("exclude GREEN: every OTHER file was still rewritten", (read(root, `${SKILL}/SKILL.md`) || "").includes("import:memory/grimorio.demo"), read(root, `${SKILL}/SKILL.md`));
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, ["--store", "skill", "memory", "grimorio.demo", "--exclude", "scripts/reader.mjs", "--no-verify"]);
  check(
    "exclude GREEN: an exclusion this pass would not have hit anyway is reported as WITHOUT EFFECT",
    /EXCLUDE WITHOUT EFFECT/.test(r.out) && /scripts\/reader\.mjs/.test(r.out),
    r.out,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, ["--store", "skill", "memory", "grimorio.demo", "--exclude", "no/such/file.md", "--no-verify", "--quiet"]);
  check(
    "exclude GREEN: a nonexistent --exclude path is REFUSED, never accepted as a silent no-op",
    r.code === 2 && /--exclude names a path that does not exist/.test(r.out),
    `exit ${r.code}\n${r.out}`,
  );
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// storeSiblingCheck — a store form has NO right boundary, so a name that is a string-prefix of a sibling
// under the same store would drag that sibling's references across too.
// ---------------------------------------------------------------------------
{
  const root = siblingFixture();
  const ARGS = ["--store", "skill", "memory", "grimorio.demo", "--no-verify", "--quiet"];
  const r = run(root, ARGS, { RENAME_REFS_UNSAFE: "sibling-prefix" });
  const ref = read(root, `${SKILL}/sibling-referrer.md`) || "";
  check(
    "store-sibling RED: with the guard disabled, the SIBLING's store token IS rewritten",
    r.code === 0 && ref.includes("ref:memory/grimorio.demo2/SKILL.md"),
    `exit ${r.code}\n${ref}`,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = siblingFixture();
  const r = run(root, ["--store", "skill", "memory", "grimorio.demo", "--no-verify", "--quiet"]);
  check(
    "store-sibling GREEN: with the guard live, the store move is REFUSED outright",
    r.code === 2 && /string-prefix of 1 sibling/.test(r.out),
    `exit ${r.code}\n${r.out}`,
  );
  check(
    "store-sibling GREEN: and nothing was rewritten",
    (read(root, `${SKILL}/sibling-referrer.md`) || "").includes("ref:skill/grimorio.demo2/SKILL.md"),
    "the tree was touched anyway",
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = siblingFixture();
  const r = run(root, ["--store", "skill", "memory", "grimorio.demo", "--store", "skill", "memory", "grimorio.demo2", "--no-verify", "--quiet"]);
  check(
    "store-sibling GREEN: naming BOTH in the same invocation is accepted, as the refusal instructs",
    r.code === 0,
    `exit ${r.code}\n${r.out}`,
  );
  const ref = read(root, `${SKILL}/sibling-referrer.md`) || "";
  const skill = read(root, `${SKILL}/SKILL.md`) || "";
  check(
    "store-sibling GREEN: and each name lands in the new store under its OWN form",
    ref.includes("ref:memory/grimorio.demo2/SKILL.md") && skill.includes("import:memory/grimorio.demo/project.vision.md"),
    `${ref}\n---\n${skill}`,
  );
  rmSync(root, { recursive: true, force: true });
}

done();
