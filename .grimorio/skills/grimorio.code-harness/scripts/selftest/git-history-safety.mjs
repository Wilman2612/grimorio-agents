// Every case builds a throwaway repository. Case 3 is load-bearing: it proves the naive pattern and the
// safe one DIVERGE -- a selftest where both print the same thing proves nothing.

import { execFileSync } from "child_process";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const SCRIPT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "git-history-safety.mjs");
let pass = 0;
let fail = 0;
const ok = (n) => { pass++; console.log(`  ok   ${n}`); };
const bad = (n, why) => { fail++; console.log(`  FAIL ${n}\n         ${why}`); };

function run(cwd, args) {
  try {
    return { code: 0, out: execFileSync(process.execPath, [SCRIPT, ...args], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(), err: "" };
  } catch (e) {
    return { code: e.status, out: String(e.stdout || "").trim(), err: String(e.stderr || "").trim() };
  }
}

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function tryGit(cwd, args) {
  try {
    return { ok: true, out: git(cwd, args) };
  } catch (e) {
    return { ok: false, out: String(e.stderr || "") };
  }
}

// A repo with one commit on master, ready for whatever each case needs.
function repo() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "ghs-"));
  git(dir, ["init", "-q", "-b", "master"]);
  git(dir, ["config", "user.email", "t@t"]);
  git(dir, ["config", "user.name", "t"]);
  writeFileSync(path.join(dir, "base.txt"), "base\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-qm", "base"]);
  return dir;
}

function commit(dir, file, body, msg) {
  writeFileSync(path.join(dir, file), body);
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-qm", msg]);
  return git(dir, ["rev-parse", "HEAD"]);
}

// A merge commit whose SECOND parent contributed b.txt, and a later unrelated commit after it.
function repoWithMerge() {
  const dir = repo();
  git(dir, ["checkout", "-qb", "side"]);
  commit(dir, "b.txt", "b\n", "side: b");
  git(dir, ["checkout", "-q", "master"]);
  commit(dir, "a.txt", "a\n", "master: a");
  git(dir, ["merge", "--no-ff", "-q", "-m", "merge side", "side"]);
  const mergeSha = git(dir, ["rev-parse", "HEAD"]);
  return { dir, mergeSha };
}

// 1-2. state detection on a clean repo
{
  const dir = repo();
  const m = run(dir, ["is-merge-in-progress"]);
  const r = run(dir, ["is-rebase-in-progress"]);
  if (m.code === 1 && m.out === "no" && r.code === 1 && r.out === "no") ok("clean repo: no merge, no rebase in progress");
  else bad("clean repo: no merge, no rebase in progress", `merge=${m.code}/${m.out} rebase=${r.code}/${r.out}`);
  const c = run(dir, ["is-merge-commit", "HEAD"]);
  if (c.code === 1 && c.out === "no") ok("is-merge-commit: a normal commit is not a merge");
  else bad("is-merge-commit: a normal commit is not a merge", `${c.code}/${c.out}`);
  rmSync(dir, { recursive: true, force: true });
}

// 3. THE POINT: once a later commit lands, the naive read goes empty while the safe one still answers.
{
  const { dir, mergeSha } = repoWithMerge();
  commit(dir, "c.txt", "c\n", "later: c");
  const naive = tryGit(dir, ["diff", "--cached", "--name-only"]).out;
  const safe = run(dir, ["safe-changed-files", mergeSha]).out;
  if (naive === "" && safe === "b.txt") ok("merge-diff divergence: naive reports nothing, safe reports the merge's own file");
  else bad("merge-diff divergence: naive reports nothing, safe reports the merge's own file", `naive="${naive}" safe="${safe}"`);
  rmSync(dir, { recursive: true, force: true });
}

// 4. a merge commit is recognised as one, and safe-changed-files picks the first-parent diff
{
  const { dir, mergeSha } = repoWithMerge();
  const c = run(dir, ["is-merge-commit", mergeSha]);
  const f = run(dir, ["safe-changed-files", mergeSha]);
  if (c.code === 0 && c.out === "yes" && f.code === 0 && f.out === "b.txt") ok("merge commit: detected, first-parent diff");
  else bad("merge commit: detected, first-parent diff", `${c.code}/${c.out} files="${f.out}"`);
  rmSync(dir, { recursive: true, force: true });
}

// 5. mid-merge, MERGE_HEAD is seen and the staged set is read against ORIG_HEAD
{
  const dir = repo();
  git(dir, ["checkout", "-qb", "side"]);
  commit(dir, "b.txt", "b\n", "side: b");
  git(dir, ["checkout", "-q", "master"]);
  commit(dir, "a.txt", "a\n", "master: a");
  tryGit(dir, ["merge", "--no-commit", "--no-ff", "side"]);
  const m = run(dir, ["is-merge-in-progress"]);
  const f = run(dir, ["safe-changed-files"]);
  if (m.code === 0 && m.out === "yes" && f.out.includes("b.txt")) ok("mid-merge: MERGE_HEAD seen, files read against ORIG_HEAD");
  else bad("mid-merge: MERGE_HEAD seen, files read against ORIG_HEAD", `merge=${m.code}/${m.out} files="${f.out}"`);
  rmSync(dir, { recursive: true, force: true });
}

// 6. would-need-force: fast-forward is safe, a rewritten history is not, and each exits its own code
{
  const dir = repo();
  git(dir, ["branch", "remote-ish"]);
  commit(dir, "d.txt", "d\n", "ahead");
  const ff = run(dir, ["would-need-force", "master", "remote-ish"]);
  if (ff.code === 0 && /fast-forward/.test(ff.out)) ok("would-need-force: fast-forward is safe");
  else bad("would-need-force: fast-forward is safe", `${ff.code} ${ff.out} ${ff.err}`);

  git(dir, ["checkout", "-q", "remote-ish"]);
  commit(dir, "e.txt", "e\n", "divergent");
  const div = run(dir, ["would-need-force", "master", "remote-ish"]);
  if (div.code === 1 && /UNSAFE/.test(div.err) && /rebased, amended, or squashed/.test(div.err)) ok("would-need-force: divergence names rebase/amend/squash");
  else bad("would-need-force: divergence names rebase/amend/squash", `${div.code} ${div.err}`);
  rmSync(dir, { recursive: true, force: true });
}

// 7. a bad ref is its own exit code, never confused with a real divergence
{
  const dir = repo();
  const r = run(dir, ["would-need-force", "master", "no-such-ref"]);
  if (r.code === 2 && /could not resolve/.test(r.err) && !/UNSAFE/.test(r.err)) ok("would-need-force: a bad ref exits 2, never 1");
  else bad("would-need-force: a bad ref exits 2, never 1", `${r.code} ${r.err}`);
  const s = run(dir, ["safe-changed-files", "no-such-rev"]);
  const m = run(dir, ["merges-in-range", "no-such..range"]);
  if (s.code === 2 && m.code === 2) ok("bad input exits 2, never a silent 0");
  else bad("bad input exits 2, never a silent 0", `safe=${s.code} merges=${m.code}`);
  rmSync(dir, { recursive: true, force: true });
}

// 8. merges-in-range lists the merge and nothing else
{
  const { dir } = repoWithMerge();
  const r = run(dir, ["merges-in-range", `${git(dir, ["rev-parse", "HEAD^1^1"])}..HEAD`]);
  if (r.code === 0 && /merge side/.test(r.out) && r.out.split("\n").filter(Boolean).length === 1) ok("merges-in-range: the merge, and only the merge");
  else bad("merges-in-range: the merge, and only the merge", `${r.code} "${r.out}"`);
  rmSync(dir, { recursive: true, force: true });
}

// 9. a rebase in flight is seen
{
  const dir = repo();
  commit(dir, "f1.txt", "1\n", "one");
  commit(dir, "f2.txt", "2\n", "two");
  git(dir, ["checkout", "-qb", "topic", "HEAD~1"]);
  writeFileSync(path.join(dir, "f2.txt"), "conflicting\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-qm", "topic: conflicting f2"]);
  tryGit(dir, ["rebase", "master"]);
  const r = run(dir, ["is-rebase-in-progress"]);
  if (r.code === 0 && r.out === "yes") ok("rebase in flight is detected");
  else bad("rebase in flight is detected", `${r.code}/${r.out}`);
  tryGit(dir, ["rebase", "--abort"]);
  rmSync(dir, { recursive: true, force: true });
}

// 10. no subcommand, and an unknown one, both exit 2 with usage
{
  const dir = repo();
  const none = run(dir, []);
  const unknown = run(dir, ["not-a-subcommand"]);
  if (none.code === 2 && unknown.code === 2 && /usage:/.test(unknown.err)) ok("no subcommand and an unknown one both exit 2");
  else bad("no subcommand and an unknown one both exit 2", `none=${none.code} unknown=${unknown.code}`);
  rmSync(dir, { recursive: true, force: true });
}

console.log(`\nSELFTEST: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
