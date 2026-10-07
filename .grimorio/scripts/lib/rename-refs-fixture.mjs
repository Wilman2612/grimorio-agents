// @keep-comment -- the shared fixture + runner for every .grimorio/scripts/rename-refs.mjs selftest. It lives
// in scripts/lib/, NOT under scripts/selftest/, because run-all.sh discovers `*/selftest/*.mjs` and would
// otherwise RUN this module as a test and count it as a pass -- a non-test inflating the suite total. The RULE
// those selftests hold: each guard gets a PAIR of assertions -- once with the guard DISABLED via the
// RENAME_REFS_UNSAFE seam, where the failure must reproduce, and once with it live, where it must not.
// A guard whose assertion has never been seen red is not a guard.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SCRIPT = path.resolve(HERE, "../rename-refs.mjs");

// Each selftest file keeps its OWN counters and its own exit code, so one file's failure can never be
// absorbed into another file's total.
export function counters(label) {
  let pass = 0;
  let fail = 0;
  const check = (name, cond, detail) => {
    if (cond) { pass++; console.log(`  ok   ${name}`); }
    else { fail++; console.log(`  FAIL ${name}\n         ${detail}`); }
  };
  const done = () => {
    console.log(`\n${label}: ${pass} passed, ${fail} failed`);
    process.exit(fail === 0 ? 0 : 1);
  };
  return { check, done };
}

export const SKILL = ".claude/skills/grimorio.demo";

// A tree shaped like the real corpus: a target file, a SIBLING whose name has the target's name as a
// stem prefix, a committed referrer naming both, and an UNCOMMITTED referrer.
export function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "rename-refs-"));
  const w = (rel, body) => {
    mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    writeFileSync(path.join(root, rel), body);
  };
  w(`${SKILL}/project.vision.md`, "# Vision\n\n## The core idea\n\nbody\n");
  w(`${SKILL}/project.vision-pointers.md`, "# Pointers\n\npoints at the vision\n");
  w(
    `${SKILL}/SKILL.md`,
    [
      "# Demo",
      "",
      "- import:skill/grimorio.demo/project.vision.md#the-core-idea — the vision",
      "- ref:skill/grimorio.demo/project.vision-pointers.md — the pointers, a DIFFERENT file",
      "- ref:repo/.claude/skills/grimorio.demo/project.vision.md — the same vision by repo path",
      "",
    ].join("\n") + "\n",
  );
  w("scripts/reader.mjs", `const p = ".claude/skills/grimorio.demo/project.vision.md";\n`);
  w(`${SKILL}/trailing-dot-referrer.md`, "See ref:skill/grimorio.demo/project.vision.md.\n");
  // A FROZEN referrer: grimorio-conduct rule 5c reserves CLAUDE.md to the CEO, so a reference in it
  // must survive every rewrite this tool performs, and must be REPORTED rather than silently skipped.
  w("CLAUDE.md", "The product: ref:skill/grimorio.demo/project.vision.md\n");
  const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "ignore" });
  git("init", "-q");
  git("config", "user.email", "selftest@example.invalid");
  git("config", "user.name", "selftest");
  git("add", "-A");
  git("commit", "-qm", "fixture");
  w(`${SKILL}/untracked-referrer.md`, "- ref:skill/grimorio.demo/project.vision.md#the-core-idea\n");
  return root;
}

export function run(root, args, env = {}) {
  try {
    const stdout = execFileSync("node", [SCRIPT, ...args], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, ...env },
      maxBuffer: 32 * 1024 * 1024,
    });
    return { code: 0, out: stdout };
  } catch (e) {
    return { code: e.status === undefined ? -1 : e.status, out: String(e.stdout || "") + String(e.stderr || "") };
  }
}

export const read = (root, rel) => (existsSync(path.join(root, rel)) ? readFileSync(path.join(root, rel), "utf8") : null);
export const RENAME = [`${SKILL}/project.vision.md`, `${SKILL}/vision.md`, "--no-verify", "--quiet"];

export function siblingFixture() {
  const root = fixture();
  mkdirSync(path.join(root, ".claude/skills/grimorio.demo2"), { recursive: true });
  writeFileSync(path.join(root, ".claude/skills/grimorio.demo2/SKILL.md"), "# Demo2\n");
  writeFileSync(
    path.join(root, ".claude/skills/grimorio.demo/sibling-referrer.md"),
    // BOTH textual forms of the sibling: the repo PATH form (what --prefix would corrupt) and the STORE
    // TOKEN form (what --store would corrupt). The two guards fail in different forms, so one fixture line
    // each is what lets both RED halves actually reproduce instead of looking clean by omission.
    "points at the SIBLING: ref:repo/.claude/skills/grimorio.demo2/SKILL.md\n" +
      "and by store token: ref:skill/grimorio.demo2/SKILL.md\n",
  );
  return root;
}
export const SIBLING_ARGS = ["--prefix", ".claude/skills/grimorio.demo", ".grimorio/skills/grimorio.demo", "--no-verify", "--quiet"];
