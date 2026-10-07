#!/usr/bin/env node
// ANSWERS: does a staged .md file land a work product in the tracked repo instead of tmp/, per
// grimorio-conduct rule 17b (the twin of rule 17's memory->repo direction). Path-only, never reads
// file content. WHEN: wired into .grimorio/scripts/pre-commit.sh, staged *.md files only.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

// @keep-comment -- a cross-file contract note: the containers come from .grimorio/scripts/refobl/skill-roots.json,
// the ONE declaration, never a literal list here. A hand-copied container list in a GATE does not go
// noisy when it falls behind -- it goes QUIET. Measured 2026-10-04: a `memory` store held 13 real skills
// and this gate passed a work-product filename under it that it flagged one container away.
// @keep-comment -- WHEN the declaration is unreachable (a tree with no grimorio corpus at all, which is
// what this methodology's own fixture repos are) the container set is EMPTY and this signal does not
// fire -- correct, not a weakening: no containers means no file can land inside one. NEVER substitute a
// literal fallback list here; a second hand-kept copy of the containers is the defect this removed.
let CORPUS_ROOTS = [];
try {
  CORPUS_ROOTS = createRequire(import.meta.url)("./refobl/resolve.cjs").CORPUS_ROOTS;
} catch (e) {
  // @keep-comment -- ONLY a genuinely absent module degrades; a corrupt declaration RE-THROWS, so this
  // gate dies loudly rather than answering "nothing to see" on something it could not read. A blanket
  // catch here passed a real work product under `.grimorio/memory/` while the sibling gate crashed.
  // governance.cjs's own precedent: an importer that cannot reach the declaration must THROW.
  if (e && e.code === "MODULE_NOT_FOUND") CORPUS_ROOTS = [];
  else throw e;
}
const CONTAINER_SEGMENTS = new Set(CORPUS_ROOTS.map((r) => r.replace(/\/$/, "")));

// Two structural signals only -- the two shapes this session's own seven real files took (5 removed
// at a34b3011, 2 misplaced drafts). NEVER read a clean run as proof no work product was staged: a
// work product dropped into an EXISTING skill subfolder under an innocuous, already-used name is not
// caught here -- grimorio-conduct rule 17b is what still covers that case.
const ARTIFACT_NAMES = new Set([
  "po-brief.md", "arch-decision.md", "ui-dev-note.md", "dev-notes.md", "qa-report.md",
  "ux-review.md", "security-report.md", "code-review.md", "verification-report.md",
  "execution-log.md", "entropy-review.md",
]);
const CLOSEOUT_PREFIX = /^CLOSEOUT-/;

// Both skill-folder signals are DERIVED LIVE from what is already committed at HEAD -- never a
// hardcoded name list -- so a real, legitimate new corpus convention never needs a matching edit
// here. A brand-new skill's first SKILL.md/behavior.md/project.md still passes cleanly: those
// basenames already recur across every OTHER skill folder, so they are already "known" globally.
function knownSkillRootState() {
  try {
    execFileSync("git", ["rev-parse", "--verify", "HEAD"], { stdio: "ignore" });
  } catch {
    // No commits yet -- nothing is established, everything legitimately looks "new".
    return { basenames: new Set(), subfolders: new Set() };
  }

  const out = execFileSync(
    "git",
    ["ls-tree", "-r", "--name-only", "HEAD", "--",
     ...CONTAINER_SEGMENTS],
    { encoding: "utf8" }
  );
  const basenames = new Set();
  const subfolders = new Set();
  for (const f of out.split("\n")) {
    if (!f) continue;
    const parts = f.split("/");
    if (parts.length === 4) basenames.add(parts[3]);
    else if (parts.length >= 5) subfolders.add(parts[3]);
  }
  return { basenames, subfolders };
}

// @keep-comment
// THE ESCAPE THIS GATE'S OWN MESSAGE ALREADY PROMISES. It tells the author "if this is a deliberate new
// corpus convention, say so in the commit message" -- and nothing read the message, so the sentence named
// a door that did not exist. A novel skill-root basename was therefore unlandable at all, which is how
// `agent.md` blocked the very commit that CREATES the folder-per-agent convention the architecture spec
// defines (.grimorio/ARCHITECTURE.md section 3): the first thirty are new by construction, so there is no
// earlier commit for the basename to already appear in.
//
// The declaration must NAME THE BASENAME, so a vague sentence cannot satisfy it: the phrase alone does
// nothing. Both the phrase and the filename must be present, which keeps this an explicit statement about
// one file rather than a blanket opt-out.
function declaredConvention(base) {
  // @keep-comment -- a HARNESS INVARIANT: git's hook ORDER is what forces this, not a preference.
  // The declaration arrives as an ENV VAR, never from the commit message, and that is forced by git's own
  // ordering: `pre-commit` runs BEFORE the message exists (`prepare-commit-msg` and `.git/COMMIT_EDITMSG`
  // come after it), so this gate CANNOT read it. Its old text said "say so in the commit message", which
  // promised a door that could not be built at this stage -- and that made a novel skill-root basename
  // unlandable at all. It is still read as a file when a caller sets GIT_COMMIT_MSG_FILE, which is what the
  // selftest does and what a commit-msg-stage caller could pass.
  const named = (process.env.CORPUS_CONVENTION || "").split(/[\s,]+/).filter(Boolean);
  if (named.includes(base)) return true;
  for (const f of [process.env.GIT_COMMIT_MSG_FILE].filter(Boolean)) {
    let msg;
    try { msg = readFileSync(f, "utf8"); } catch { continue; }
    if (/deliberate new corpus convention/i.test(msg) && msg.includes(base)) return true;
  }
  return false;
}

// A rename's destination is not "introduced" -- its content was already tracked under the old
// name. --name-only on a pure R-filtered diff prints only the new path, which is exactly the set to
// exempt from the two "not used anywhere else" checks below.
function renamedTargets() {
  try {
    const out = execFileSync(
      "git",
      ["diff", "--cached", "--diff-filter=R", "-M", "--name-only"],
      { encoding: "utf8" }
    );
    return new Set(out.split("\n").filter(Boolean));
  } catch {
    return new Set();
  }
}

function check(files) {
  const { basenames, subfolders } = knownSkillRootState();
  const renamed = renamedTargets();
  const violations = [];
  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const parts = f.split("/");

    if (parts.length === 1) {
      const base = parts[0];
      if (ARTIFACT_NAMES.has(base) || CLOSEOUT_PREFIX.test(base)) {
        violations.push(
          `${f} -- a work-product artifact name at the repo root. ` +
          `Belongs in tmp/features/{slug}/ (grimorio.feature-workflow's own Artifact Directory ` +
          `Structure) or tmp/<task-slug>/, never here.`
        );
      }
      continue;
    }

    // `.grimorio` as well as `.claude`: the corpus moved, and a gate that still named only the old
    // root would keep passing while covering nothing.
    if (CONTAINER_SEGMENTS.has(`${parts[0]}/${parts[1]}`) && parts[2] && !renamed.has(f)) {
      if (parts.length === 4) {
        const base = parts[3];
        if (!basenames.has(base) && !declaredConvention(base)) {
          violations.push(
            `${f} -- introduces "${base}", a skill-root filename not used anywhere else in the ` +
            `tracked corpus. If this is a work-product draft, it belongs in tmp/, never directly ` +
            `inside a skill folder. If it IS a deliberate new corpus convention, name it: ` +
            `CORPUS_CONVENTION="${base}" git commit ... -- an env var because pre-commit runs BEFORE the ` +
            `commit message exists, so this gate cannot read one.`
          );
        }
      } else if (parts.length >= 5) {
        const subfolder = parts[3];
        if (!subfolders.has(subfolder)) {
          violations.push(
            `${f} -- introduces "${subfolder}/", a skill-subfolder name not used anywhere else in ` +
            `the tracked corpus. If this is a deliberate new convention, say so in the commit ` +
            `message; if it is a work-product draft, it belongs in tmp/.`
          );
        }
      }
    }
  }
  return violations;
}

const files = process.argv.slice(2);
const violations = files.length ? check(files) : [];
if (violations.length > 0) {
  console.error("");
  for (const v of violations) console.error("  " + v);
  console.error("");
  process.exit(1);
}
process.exit(0);
