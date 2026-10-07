#!/usr/bin/env node
// @keep-comment DOES THE PUBLISHED CORPUS STAND ON ITS OWN? Export it, commit it, CLONE it, and run
// grimorio's own suite inside the clone. Nothing else answers this: every check in the authoring repo
// runs beside files the export deliberately leaves behind -- the whole memory tree, the adopter's own
// scripts -- so a suite that is green HERE says nothing about the thing an adopter receives.
//
//   node .grimorio/scripts/export/verify-clone.mjs [--keep]
//
// Exits 0 when the clone's suite has no FAILURES. Skips are expected and printed.

import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const keep = process.argv.includes("--keep");
const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const base = mkdtempSync(path.join(tmpdir(), "grimorio-verify-"));
const target = path.join(base, "export");
const clone = path.join(base, "clone");
const cleanup = () => { if (!keep) { try { rmSync(base, { recursive: true, force: true }); } catch { /* best effort */ } } };

// @keep-comment EVERY step prints before it runs and its failure is FATAL. A step that fails quietly
// leaves the suite running against the wrong tree, which is how this corpus once ran 11 test cases
// against its own live repo: an empty path made `git -C ""` operate on the current directory.
function step(label, cmd, args, cwd) {
  process.stdout.write(`== ${label}\n`);
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", shell: false });
  if (r.error) { console.error(`   FATAL ${label}: ${r.error.message}`); cleanup(); process.exit(2); }
  return r;
}
function must(label, cmd, args, cwd) {
  const r = step(label, cmd, args, cwd);
  if (r.status !== 0) {
    console.error(`   FATAL ${label} exited ${r.status}`);
    console.error((r.stdout || "").split("\n").slice(-8).join("\n"));
    console.error((r.stderr || "").split("\n").slice(-8).join("\n"));
    cleanup();
    process.exit(2);
  }
  return r;
}

// The target must already be a repo: `publish.mjs` refuses a path that does not exist, and the point of
// committing before the export is that the clone below then carries the export as its own first content.
must("prepare the target repo", "git", ["init", "-q", "-b", "main", target], base);

const pub = must("export the corpus", process.execPath,
  [".grimorio/scripts/export/publish.mjs", "--target", target, "--apply"], root);
const wrote = (pub.stdout.match(/WROTE: (\d+) file/) || [])[1];
console.log(`   ${wrote} file(s) written`);

// A clone proves more than the export directory does: anything the export's own .gitignore excludes, or
// that was never added, is absent from a clone and present in the directory it was written into.
must("stage it", "git", ["add", "-A", "."], target);
must("commit it", "git", ["-c", "user.name=verify", "-c", "user.email=verify@localhost",
  "commit", "-q", "-m", "export under test"], target);
must("clone it", "git", ["clone", "-q", target, clone], base);
if (!existsSync(path.join(clone, ".grimorio/scripts/selftest/run-all.sh"))) {
  console.error("   FATAL the clone carries no suite to run -- run-all.sh did not travel");
  cleanup();
  process.exit(2);
}

// The suite's own exit code is 1 on any failure; a skip never reaches it. Read the tally line either way,
// because "0 failed" and "the suite never ran" look identical in an exit code alone.
const suite = step("run the suite INSIDE the clone", "bash", [".grimorio/scripts/selftest/run-all.sh"], clone);
const out = (suite.stdout || "") + (suite.stderr || "");
const tally = (out.match(/^SUITE: .*$/m) || [])[0];
if (!tally) {
  console.error("   FATAL the suite printed no tally line -- it did not finish");
  console.error(out.split("\n").slice(-12).join("\n"));
  cleanup();
  process.exit(2);
}
console.log(`\n${tally}`);
for (const line of out.split("\n").filter((l) => /^  (FAIL|skip)/.test(l))) console.log(line);
const failed = Number((tally.match(/(\d+) failed/) || [0, "0"])[1]);
if (keep) console.log(`\nkept: ${clone}`);
cleanup();
if (failed !== 0) { console.error(`\nFAIL: the published corpus cannot run its own suite -- ${failed} failure(s) in a fresh clone.`); process.exit(1); }
console.log("\nPASS: a fresh clone of the published corpus runs its own suite with no failures.");
