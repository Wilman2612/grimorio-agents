// @keep-comment Pins dead `ref:repo/...` and `cite:repo/...` references to the commit where the file last
// stood. `import:` is excluded on purpose: a dependency you cannot load is BROKEN, and pinning it to history
// would dress a broken load as a satisfied one.
// A cite is a claim of PROOF; the grammar already gives it @rev. Every pin is verified with
// `git cat-file -e` before it is written, and the file is left untouched if verification fails.
// Run with --apply to write. Default is a dry run.
// `--selftest` holds one probe per tokenizer defect this script shipped with; it exits non-zero if any
// regresses. Each was found by READING THE DIFF while every counter was GREEN.
const fs = require("fs");
const { execFileSync } = require("child_process");
const { isGovernance, posix } = require("./governance.cjs");

const APPLY = process.argv.includes("--apply");
const SELFTEST = process.argv.includes("--selftest");
// Greedy, then strip sentence punctuation. A lazy match with `.` in the lookahead ate the file
// EXTENSION off every path -- economy.go became economy, and every one read as unrecoverable.
const CITE = /\b(ref|cite):repo\/([A-Za-z0-9._\/-]+)(@[0-9a-f]{7,40})?/g;
const PLACEHOLDER = new Set(["path", "name", "file", "handle"]);

const exists = (p) => { try { fs.statSync(p); return true; } catch { return false; } };
const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const resolvesAt = (rev, p) => {
  try { execFileSync("git", ["cat-file", "-e", `${rev}:${p}`], { stdio: "ignore" }); return true; }
  catch { return false; }
};

const lastStood = new Map();
const findRev = (p) => {
  if (lastStood.has(p)) return lastStood.get(p);
  let rev = null;
  try {
    const del = git(["log", "--all", "--format=%H", "--diff-filter=D", "-1", "--", p]);
    if (del) {
      const parent = git(["rev-parse", `${del}^`]);
      if (resolvesAt(parent, p)) rev = parent;
    }
  } catch { rev = null; }
  lastStood.set(p, rev);
  return rev;
};

const tally = { pinned: 0, alreadyPinned: 0, live: 0, unrecoverable: 0, glob: 0, dir: 0, placeholder: 0 };
const unrec = new Map();

// The whole repair. Returns the replacement text for one `cite:repo/...` match, or `whole` to leave it be.
// `after` is the character that FOLLOWS the match in the source line -- defect 1 is invisible without it.
const pinOne = (whole, rel, p, rev, after) => {
  // TAIL: the regex is greedy over `.`, so a sentence's full stop lands inside the captured path. Strip it
  // to resolve, then PUT IT BACK. The old code stripped it and never re-emitted it, deleting the period.
  const tail = (p.match(/[.,;:]+$/) || [""])[0];
  const clean = p.slice(0, p.length - tail.length);
  if (PLACEHOLDER.has(clean)) { tally.placeholder++; return whole; }   // the syntax being TAUGHT
  // GLOB: `*` is not in the path class, so `.../runner/**` matches only `.../runner/` and the `**` is left
  // dangling after it. Appending @sha there writes the sha INTO the glob. A glob is not a pinnable path.
  if (after === "*") { tally.glob++; return whole; }
  // A trailing `/` makes the pinned token `path/@sha`, which is not the grammar. A directory WITHOUT the
  // slash pins fine -- `git cat-file -e rev:dir` verifies a tree -- so this refusal is syntax, not kind.
  if (clean.endsWith("/")) { tally.dir++; return whole; }
  if (rev) { tally.alreadyPinned++; return whole; }
  if (exists(clean)) { tally.live++; return whole; }
  const at = findRev(clean);
  if (!at) { tally.unrecoverable++; unrec.set(clean, (unrec.get(clean) || 0) + 1); return whole; }
  tally.pinned++;
  return `${rel}:repo/${clean}@${at}${tail}`;
};

const rewrite = (line) =>
  line.replace(CITE, (whole, rel, p, rev, offset, src) => pinOne(whole, rel, p, rev, src[offset + whole.length]));

if (SELFTEST) {
  // Each probe is one of the three defects, asserted to be CLOSED. C7: a gate you rely on, broken on purpose.
  const cases = [
    ["cite:repo/services/runner/** is the tree", "glob must be left alone"],
    ["see cite:repo/experiments/map-text-projection/.", "trailing slash + full stop must be left alone"],
    ["cite:repo/path is the syntax", "placeholder must be left alone"],
    ["import:repo/services/runner/app/main.py loads it", "a dead import must NOT be pinned"],
  ];
  let bad = 0;
  for (const [line, what] of cases) {
    const out = rewrite(line);
    const ok = out === line;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"}  ${what}\n        ${line}\n     -> ${out}`);
  }
  // A suite of only LEAVE-IT-ALONE probes is green when the tokenizer matches NOTHING -- which is exactly
  // what happened when a stray 0x08 byte landed in the regex. One probe must therefore demand a real pin.
  const live = "cite:repo/services/runner/app/matchrunner.py is the proof.";
  const got = rewrite(live);
  const pinnedOk = /@[0-9a-f]{40}\b/.test(got) && got.endsWith(".");
  if (!pinnedOk) bad++;
  console.log(`${pinnedOk ? "ok  " : "FAIL"}  a known-dead path MUST pin, and keep its full stop\n        ${live}\n     -> ${got}`);
  console.log(`\nglob ${tally.glob}  dir ${tally.dir}  placeholder ${tally.placeholder}`);
  process.exit(bad ? 1 : 0);
}

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d)) {
    if (e === "node_modules" || e === "worktrees" || e === ".git") continue;
    const p = d + "/" + e;
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
};

const files = [...walk(".claude/skills"), ...walk(".claude/agents"), "CLAUDE.md"].filter(exists);
const sample = [];
let heldSkipped = 0;

for (const f of files) {
  if (isGovernance(f)) { heldSkipped++; continue; }        // defect 3 -- never write a HELD file
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  let touched = 0;
  lines.forEach((line, i) => {
    const out = rewrite(line);
    if (out !== line) {
      sample.push({ file: posix(f), line: i + 1, before: line.trim(), after: out.trim() });
      lines[i] = out;
      touched++;
    }
  });
  if (touched && APPLY) fs.writeFileSync(f, lines.join("\n"));
}

console.log((APPLY ? "APPLIED" : "DRY RUN") + `: ${tally.pinned} cites pinned`);
console.log(`  already pinned          ${tally.alreadyPinned}`);
console.log(`  target still live       ${tally.live}`);
console.log(`  SKIPPED glob            ${tally.glob}   (defect 1 -- a glob is not a pinnable path)`);
console.log(`  SKIPPED trailing slash  ${tally.dir}   (\`path/@sha\` is not the grammar)`);
console.log(`  SKIPPED placeholder     ${tally.placeholder}`);
console.log(`  SKIPPED governance file ${heldSkipped}   (defect 3 -- hand to grimorio.system-keeper)`);
console.log(`  UNRECOVERABLE           ${tally.unrecoverable}   (never committed -- these de-reference, never pin)`);
for (const [p, n] of [...unrec].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`      ${n}x  ${p}`);
fs.writeFileSync("tmp/refobl-finish/pin-sample.json", JSON.stringify(sample, null, 1));
console.log(`\nsample rows written  ${sample.length}  -> tmp/refobl-finish/pin-sample.json   READ IT BEFORE --apply`);
