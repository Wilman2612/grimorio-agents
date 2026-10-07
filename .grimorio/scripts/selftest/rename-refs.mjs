// The three rename-pass failures that actually shipped on this tool, each watched RED first through
// the RENAME_REFS_UNSAFE seam. The store/frozen/exclude guards live in rename-refs-stores.mjs.
import { rmSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  SKILL, RENAME, SIBLING_ARGS, fixture, siblingFixture, run, read, counters,
} from "../lib/rename-refs-fixture.mjs";

const { check, done } = counters("rename-refs");

// ---------------------------------------------------------------------------
// BUG 1 — an overlapping prefix replacement that corrupted a sibling's name.
// ---------------------------------------------------------------------------
{
  const root = fixture();
  run(root, RENAME, { RENAME_REFS_UNSAFE: "boundary" });
  const skill = read(root, `${SKILL}/SKILL.md`) || "";
  check(
    "bug1 RED: with the boundary guard disabled, the sibling's name IS corrupted",
    skill.includes("grimorio.demo/vision-pointers.md"),
    `the seam did not reproduce the failure, so the green assertion below proves nothing:\n${skill}`,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, RENAME);
  const skill = read(root, `${SKILL}/SKILL.md`) || "";
  check("bug1 GREEN: the rename exits 0", r.code === 0, `exit ${r.code}\n${r.out}`);
  check(
    "bug1 GREEN: the sibling project.vision-pointers.md keeps its name",
    skill.includes("ref:skill/grimorio.demo/project.vision-pointers.md"),
    skill,
  );
  check("bug1 GREEN: the sibling file itself was not moved", read(root, `${SKILL}/project.vision-pointers.md`) !== null, "sibling file is gone");
  check("bug1 GREEN: the skill-store form was rewritten", skill.includes("import:skill/grimorio.demo/vision.md#the-core-idea"), skill);
  check("bug1 GREEN: the repo-path form was rewritten", skill.includes("ref:repo/.claude/skills/grimorio.demo/vision.md"), skill);
  check("bug1 GREEN: the file was moved", read(root, `${SKILL}/vision.md`) !== null && read(root, `${SKILL}/project.vision.md`) === null, "move did not happen");
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// BUG 2 — a truncated anchor travelling with a rewritten path.
// ---------------------------------------------------------------------------
{
  const root = fixture();
  const r = run(root, RENAME, { RENAME_REFS_UNSAFE: "anchor" });
  check(
    "bug2 RED: with the anchor guard tripped, the run REFUSES instead of writing a truncated anchor",
    r.code === 3 && /changed an anchor/.test(r.out),
    `exit ${r.code}\n${r.out}`,
  );
  check(
    "bug2 RED: the refusal left the referrer untouched",
    (read(root, `${SKILL}/SKILL.md`) || "").includes("project.vision.md#the-core-idea"),
    "the file was written despite the refusal",
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  run(root, RENAME);
  const skill = read(root, `${SKILL}/SKILL.md`) || "";
  check("bug2 GREEN: the anchor survives byte for byte", skill.includes("/vision.md#the-core-idea "), skill);
  check("bug2 GREEN: no truncated anchor was emitted", !/#the-c[^o]/.test(skill), skill);
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// BUG 3 — a referrer not yet in git, silently missed.
// ---------------------------------------------------------------------------
{
  const root = fixture();
  run(root, RENAME, { RENAME_REFS_UNSAFE: "untracked" });
  check(
    "bug3 RED: enumerating tracked files only DOES miss the untracked referrer",
    (read(root, `${SKILL}/untracked-referrer.md`) || "").includes("project.vision.md"),
    "the seam did not reproduce the failure",
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  run(root, RENAME);
  const untracked = read(root, `${SKILL}/untracked-referrer.md`) || "";
  check("bug3 GREEN: the untracked referrer was rewritten", untracked.includes("ref:skill/grimorio.demo/vision.md#the-core-idea"), untracked);
  check("bug3 GREEN: its anchor survived too", !untracked.includes("project.vision.md"), untracked);
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// BUG 4 — a sentence-ending "." directly after the reference reads as a path
// continuation, so boundaryOk rejects the match and the reference goes dead.
// ---------------------------------------------------------------------------
{
  const root = fixture();
  run(root, RENAME, { RENAME_REFS_UNSAFE: "trailing-dot" });
  const referrer = read(root, `${SKILL}/trailing-dot-referrer.md`) || "";
  check(
    "bug4 RED: with the trailing-dot exception disabled, the sentence-ending reference is left dead",
    referrer.includes("project.vision.md"),
    `the seam did not reproduce the failure, so the green assertion below proves nothing:\n${referrer}`,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  run(root, RENAME);
  const referrer = read(root, `${SKILL}/trailing-dot-referrer.md`) || "";
  check(
    "bug4 GREEN: the sentence-ending reference is rewritten, period intact",
    referrer === "See ref:skill/grimorio.demo/vision.md.\n",
    referrer,
  );
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// The surrounding contract: reach beyond .md, dry-run, reversibility, refusals.
// ---------------------------------------------------------------------------
{
  const root = fixture();
  const r = run(root, [`${SKILL}/project.vision.md`, `${SKILL}/vision.md`, "--no-verify"]);
  check("non-markdown referrers are rewritten", (read(root, "scripts/reader.mjs") || "").includes("grimorio.demo/vision.md"), read(root, "scripts/reader.mjs"));
  check("and are NAMED as outside what audit-chain can verify", /NOT COVERED BY VERIFICATION[\s\S]*scripts\/reader\.mjs/.test(r.out), r.out);
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const r = run(root, [...RENAME, "--dry-run"]);
  check("dry-run writes nothing", (read(root, `${SKILL}/SKILL.md`) || "").includes("project.vision.md#the-core-idea") && read(root, `${SKILL}/project.vision.md`) !== null, r.out);
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  const mapFile = path.join(root, "map.tsv");
  writeFileSync(mapFile, `# a comment\n${SKILL}/project.vision.md\t${SKILL}/vision.md\n`);
  const before = read(root, `${SKILL}/SKILL.md`);
  run(root, ["--map", mapFile, "--no-verify", "--quiet"]);
  const r = run(root, ["--map", mapFile, "--revert", "--no-verify", "--quiet"]);
  check("--revert restores the referrer byte for byte", read(root, `${SKILL}/SKILL.md`) === before, `exit ${r.code}\n${r.out}`);
  check("--revert restores the file name", read(root, `${SKILL}/project.vision.md`) !== null && read(root, `${SKILL}/vision.md`) === null, "file not restored");
  rmSync(root, { recursive: true, force: true });
}
{
  const root = fixture();
  check("refuses a missing source", run(root, [`${SKILL}/nope.md`, `${SKILL}/x.md`, "--no-verify"]).code === 2, "did not refuse");
  check("refuses an existing target", run(root, [`${SKILL}/project.vision.md`, `${SKILL}/project.vision-pointers.md`, "--no-verify"]).code === 2, "did not refuse");
  check("refuses a directory as source", run(root, [SKILL, `${SKILL}2`, "--no-verify"]).code === 2, "did not refuse");
  const noBaseline = run(root, [`${SKILL}/project.vision.md`, `${SKILL}/vision.md`]);
  check("refuses to rewrite when no audit-chain BASELINE can be read", noBaseline.code === 2 && /baseline/.test(noBaseline.out), `exit ${noBaseline.code}\n${noBaseline.out}`);
  rmSync(root, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// --prefix — the cross-root corpus move. Its one guard gets the same RED-then-GREEN pair every other
// guard in this file gets, because a guard never seen red is not a guard.
// ---------------------------------------------------------------------------

// A referrer naming the root three ways at once: as a DIRECTORY (which the per-file mode can never
// reach), as a full repo path, and in the root-stripped `ref:skill/...` form that MUST NOT change.
const PREFIX_REFERRER = [
  "# Prefix referrer",
  "",
  "- the directory: `.claude/skills/grimorio.demo/`",
  "- the repo path: ref:repo/.claude/skills/grimorio.demo/project.vision.md#the-core-idea",
  "- the root-stripped form, which must survive UNTOUCHED: ref:skill/grimorio.demo/project.vision.md",
  "- a mid-token lookalike the left boundary must refuse: vendor.claude/skills/grimorio.demo/x.md",
  "",
].join("\n") + "\n";

function prefixFixture() {
  const root = fixture();
  writeFileSync(path.join(root, `${SKILL}/prefix-referrer.md`), PREFIX_REFERRER);
  return root;
}

const PREFIX_ARGS = ["--prefix", ".claude/skills", ".grimorio/skills", "--no-verify", "--quiet"];
// A FOLDER-level move: the shape the real corpus move used, and the only shape where a SIBLING directory
// name can collide with the source's own.

{
  const root = prefixFixture();
  const r = run(root, PREFIX_ARGS);
  check("--prefix moves the whole tree to the new root", read(root, ".grimorio/skills/grimorio.demo/project.vision.md") !== null, `exit ${r.code}\n${r.out}`);
  check("--prefix leaves nothing behind at the old root", read(root, `${SKILL}/project.vision.md`) === null, "old path still present");
  const ref = read(root, ".grimorio/skills/grimorio.demo/prefix-referrer.md") || "";
  check("--prefix rewrites a DIRECTORY reference the per-file mode can never reach", ref.includes("`.grimorio/skills/grimorio.demo/`"), ref);
  check("--prefix rewrites a full repo-path reference", ref.includes("ref:repo/.grimorio/skills/grimorio.demo/project.vision.md#the-core-idea"), ref);
  check("--prefix leaves the root-stripped ref:skill form UNTOUCHED", ref.includes("ref:skill/grimorio.demo/project.vision.md"), ref);
  check("--prefix rewrites a literal path inside a script", (read(root, "scripts/reader.mjs") || "").includes(".grimorio/skills/grimorio.demo/project.vision.md"), read(root, "scripts/reader.mjs"));
  rmSync(root, { recursive: true, force: true });
}

// BUG-SHAPED GUARD: the left boundary. RED with the seam off, GREEN with it live.
{
  const root = prefixFixture();
  run(root, PREFIX_ARGS, { RENAME_REFS_UNSAFE: "prefix-boundary" });
  const ref = read(root, ".grimorio/skills/grimorio.demo/prefix-referrer.md") || "";
  check("RED: with the left-boundary guard disabled, a mid-token lookalike IS corrupted", ref.includes("vendor.grimorio/skills/grimorio.demo/x.md"), ref);
  rmSync(root, { recursive: true, force: true });
}
{
  const root = prefixFixture();
  run(root, PREFIX_ARGS);
  const ref = read(root, ".grimorio/skills/grimorio.demo/prefix-referrer.md") || "";
  check("GREEN: with the guard live, the mid-token lookalike is left alone", ref.includes("vendor.claude/skills/grimorio.demo/x.md"), ref);
  rmSync(root, { recursive: true, force: true });
}

{
  const root = prefixFixture();
  const before = read(root, `${SKILL}/prefix-referrer.md`);
  run(root, PREFIX_ARGS);
  const r = run(root, ["--prefix", ".claude/skills", ".grimorio/skills", "--revert", "--no-verify", "--quiet"]);
  check("--prefix --revert restores the referrer byte for byte", read(root, `${SKILL}/prefix-referrer.md`) === before, `exit ${r.code}\n${r.out}`);
  check("--prefix --revert restores the tree", read(root, ".grimorio/skills/grimorio.demo/project.vision.md") === null, "new root still present");
  rmSync(root, { recursive: true, force: true });
}

{
  const root = prefixFixture();
  check("--prefix refuses a missing source", run(root, ["--prefix", ".claude/nope", ".grimorio/nope", "--no-verify"]).code === 2, "did not refuse");
  check("--prefix refuses a FILE as source", run(root, ["--prefix", `${SKILL}/project.vision.md`, ".grimorio/x", "--no-verify"]).code === 2, "did not refuse");
  check("--prefix refuses an existing target", run(root, ["--prefix", ".claude/skills", ".claude/skills", "--no-verify"]).code === 2, "did not refuse");
  check("--prefix refuses a target nested inside its own source", run(root, ["--prefix", ".claude/skills", ".claude/skills/inner", "--no-verify"]).code === 2, "did not refuse");
  rmSync(root, { recursive: true, force: true });
}

// A SIBLING whose directory name has the move source's own name as a stem prefix. A prefix rewrite has no
// right boundary by construction, so this is the one shape that can corrupt a path the move never named.

{
  const root = siblingFixture();
  const r = run(root, SIBLING_ARGS, { RENAME_REFS_UNSAFE: "sibling-prefix" });
  const ref = read(root, ".grimorio/skills/grimorio.demo/sibling-referrer.md") || "";
  check(
    "RED: with the sibling-prefix guard disabled, an unrelated SIBLING's path IS corrupted",
    ref.includes(".grimorio/skills/grimorio.demo2/SKILL.md") && read(root, ".claude/skills/grimorio.demo2/SKILL.md") !== null,
    `exit ${r.code}\n${ref}`,
  );
  rmSync(root, { recursive: true, force: true });
}
{
  const root = siblingFixture();
  const r = run(root, SIBLING_ARGS);
  check("GREEN: with the guard live, the move is REFUSED outright", r.code === 2 && /string-prefix of 1 sibling/.test(r.out), `exit ${r.code}\n${r.out}`);
  check("GREEN: and nothing was moved or rewritten", read(root, ".claude/skills/grimorio.demo/sibling-referrer.md") !== null, "the tree was touched anyway");
  rmSync(root, { recursive: true, force: true });
}

done();
