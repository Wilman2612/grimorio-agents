#!/usr/bin/env node
// @size-exempt: one shared `workdir` and fixtures deliberately reused ACROSS cases (Case 8 reuses Case 6's;
// Cases 10-12 share in10/ref10), so a split would either duplicate every fixture or need a third
// shared-fixture module whose only purpose is to undo the split -- the same reason the sibling bash suite
// scripts/selftest/spawn-verbatim-origin-gate.mjs carries its own exemption. 16 lines over, at the margin.
// @keep-comment verify-cleaned-extract.qa.mjs — INDEPENDENT regression suite (grimorio.qa authored, per
// this project's TEST-VOLUME independence doctrine: a test proving a CODE-VOLUME fix against acceptance
// criteria/regression must never be authored by the same developer who authored the fix). Proves
// scripts/verify-cleaned-extract.mjs / .sh — see that file's own header for the bug this suite guards
// against.
//
// AUTHORED INDEPENDENTLY of grimorio.js-developer's own TDD reproduction (which stays with the developer)
// and of scripts/selftest/verify-cleaned-extract.sh (the developer's own bash selftest, Cases A-L): own
// fixtures below, own wording, no text copied from either.
//
// CLI contract:
// the checker receives a third required argument
// (`<input> <output> <independent-reference-file>`) when the COMPLETENESS and COMPRESSION gates were added
// to scripts/verify-cleaned-extract.mjs/.sh. Every pre-existing case (1a-5) now passes its own small,
// purpose-built reference fixture through runChecker's third argument, so those cases keep testing exactly what
// they always tested (byte-fidelity / alternation / the ReDoS bound) uncontaminated by the two new gates:
// where a case's OWN earlier check already fails (1b, 2a, 3a, 4), the reference content never gets read for
// its meaning, so a small generic placeholder is reused; where a case expects PASS (1a, 2b, 3b, 5), the
// reference is built so its own first user: turn matches that case's own output's last user: turn, and the
// output's agent: text is trimmed short enough to also clear the new COMPRESSION gate. Cases 6-9 below are
// this suite's own independent COMPLETENESS/COMPRESSION coverage, mirroring (never copying) the shape of the
// developer's own Cases I/J/K/L in scripts/selftest/verify-cleaned-extract.sh: own domain, own wording, own
// fixtures.
//
// FRAMEWORK: plain Node `assert` + `child_process` — this repo has no vitest/jest wired for bare
// scripts/*.mjs utilities (root package.json's `test*` scripts all route into apps/web). Matches the
// existing scripts/selftest/*.sh convention (run directly, exit 0 = all pass), translated to .mjs.
//
// USAGE: node scripts/selftest/verify-cleaned-extract.qa.mjs
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, appendFileSync } from "node:fs";
import { writeProvenance, provenancePathFor } from "../splice-provenance.mjs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// The REAL CLI contract every caller uses (grimorio.extract-cleaner's own governed Step 6 included):
// `scripts/verify-cleaned-extract.mjs <input> <output> <independent-reference-file>`, invoked via Node.
// The parser suite invokes the Node entry point directly.
const CHECKER = join(__dirname, "..", "verify-cleaned-extract.mjs");

const workdir = mkdtempSync(join(tmpdir(), "qa-verify-cleaned-extract-"));
let failures = 0;
let passed = 0;

function write(name, content) {
  const p = join(workdir, name);
  writeFileSync(p, content, "utf8");
  return p;
}

// @keep-comment
// EVERY case below hand-writes its own OUTPUT fixture, which the checker's own PROVENANCE gate refuses
// outright -- correctly, since that gate exists precisely to refuse an extract no splice produced. A
// hand-written fixture therefore has to be STAMPED to stand in for a spliced one, or no case could ever
// reach the byte-fidelity/alternation/completeness/compression checks it was written to test.
// The stamp is taken from the REAL producer function (`writeProvenance`), never recomputed here: a suite that
// hand-rolled its own digest would keep passing if the producer's own formula ever changed.
// `stampProvenance: false` is the opt-out the provenance cases themselves use -- the only cases that want
// the gate to fire.
// @keep-comment
function runChecker(inputPath, outputPath, referencePath, { stampProvenance = true } = {}) {
  if (stampProvenance) writeProvenance(outputPath, "verify-cleaned-extract.qa.mjs fixture (stands in for splice)");
  const result = spawnSync(process.execPath, [CHECKER, inputPath, outputPath, referencePath], { encoding: "utf8" });
  return { status: result.status ?? 1, stdout: `${result.stdout || ""}${result.stderr || ""}` };
}

function check(label, fn) {
  try {
    fn();
    console.log(`PASS: ${label}`);
    passed++;
  } catch (err) {
    console.log(`FAIL: ${label} -- ${err.message}`);
    failures++;
  }
}

// A placeholder reference fixture for every case below whose OWN check (byte-fidelity or alternation) fails
// before the COMPLETENESS gate is ever reached — its content is never read for meaning in those cases, it
// only has to exist and carry a parseable user: turn so loadAndParse's own existsSync/read step succeeds.
const refUnreachable = write(
  "ref_unreachable.txt",
  "user: placeholder reference turn -- unreachable, this case fails before completeness is checked\n" +
    "agent: tail text, not checked\n",
);

// ---------------------------------------------------------------------------
// Case 1 — single-line user: turn. Genuine pair PASSes; a tampered turn FAILs.
// ---------------------------------------------------------------------------
const in1 = write(
  "in1.txt",
  "Convention: user:/agent:\n" +
    "user: What is the current status of the release?\n" +
    "agent: On track for Friday, all checks green.\n",
);
const out1Good = write(
  "out1_good.txt",
  "Convention: user:/agent:\n" +
    "user: What is the current status of the release?\n" +
    "agent: On track.\n",
);
const out1Bad = write(
  "out1_bad.txt",
  "Convention: user:/agent:\n" +
    "user: What is the current status of the release NEXT WEEK?\n" +
    "agent: On track.\n",
);
// Matches out1Good's own (single, last) user: turn byte-for-byte, so Case 1a's PASS also clears the new
// COMPLETENESS gate.
const ref1 = write(
  "ref1.txt",
  "user: What is the current status of the release?\n" + "agent: tail text, not checked\n",
);

check("Case 1a -- genuine single-line pair PASSes", () => {
  const r = runChecker(in1, out1Good, ref1);
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^PASS:/);
});

check("Case 1b -- tampered single-line user: turn FAILs", () => {
  const r = runChecker(in1, out1Bad, refUnreachable);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  // The FAIL: line is preceded by a printed byte-diff (printUserBlockDiff runs before fail()), so it is
  // not necessarily the first line of stdout -- match it at the start of ANY line, not the whole string.
  assert.match(r.stdout, /^FAIL:/m);
});

// ---------------------------------------------------------------------------
// Case 2 — MANDATORY multi-line user: turn regression proof: a turn with an embedded blank line (own
// fixture, not Case F/G's) vs a genuine turn-separator blank line — the ambiguity the fix's header names.
// ---------------------------------------------------------------------------
const in2 = write(
  "in2.txt",
  "Convention: user:/agent:\n" +
    "user: Please review the deployment checklist below.\n" +
    "\n" +
    "Also confirm the staging DB backup ran last night.\n" +
    "agent: Reviewed; checklist complete and backup confirmed.\n" +
    "user: One more thing -- bump the retry timeout to 30s.\n" +
    "agent: Done, updated to 30s.\n",
);
// agent: text trimmed to well under the input's own agent: length (below) so Case 2b's PASS also clears the
// new COMPRESSION gate -- the byte-fidelity/alternation checks this case exists to prove never look at
// agent: content, so shortening it here changes nothing about what the case tests.
const out2Good = write(
  "out2_good.txt",
  "Convention: user:/agent:\n" +
    "user: Please review the deployment checklist below.\n" +
    "\n" +
    "Also confirm the staging DB backup ran last night.\n" +
    "agent: Confirmed.\n" +
    "user: One more thing -- bump the retry timeout to 30s.\n" +
    "agent: Done.\n",
);
const out2Bad = write(
  "out2_bad.txt",
  "Convention: user:/agent:\n" +
    "user: Please review the deployment checklist below.\n" +
    "\n" +
    "Also confirm the staging DB backup ran TWO WEEKS AGO.\n" +
    "agent: Checklist confirmed; backup verified from last night.\n" +
    "user: One more thing -- bump the retry timeout to 30s.\n" +
    "agent: Retry timeout bumped to 30s.\n",
);
// Matches out2Good's own LAST user: turn byte-for-byte.
const ref2 = write(
  "ref2.txt",
  "user: One more thing -- bump the retry timeout to 30s.\n" + "agent: tail text, not checked\n",
);

check("Case 2a -- multi-line user: turn, CONTINUATION line corrupted, FAILs (the regression proof)", () => {
  const r = runChecker(in2, out2Bad, refUnreachable);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL:/m);
});

check("Case 2b -- SAME multi-line turn, continuation preserved byte-for-byte, PASSes (positive control)", () => {
  const r = runChecker(in2, out2Good, ref2);
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^PASS:/);
});

// ---------------------------------------------------------------------------
// Case 3 — alternation. A broken output (two consecutive same-role turns) FAILs; correct alternation
// across a longer, independent 6-turn fixture PASSes.
// ---------------------------------------------------------------------------
const in3 = write(
  "in3.txt",
  "Convention: user:/agent:\n" +
    "user: Can we deploy today?\n" +
    "agent: Yes, all checks passed.\n" +
    "user: Great, please proceed.\n" +
    "agent: Deploying now.\n" +
    "user: Ping me when it's live.\n" +
    "agent: Will do.\n",
);
const out3Broken = write(
  "out3_broken.txt",
  "Convention: user:/agent:\n" +
    "user: Can we deploy today?\n" +
    "agent: Yes.\n" +
    "agent: Also, QA signed off yesterday.\n" + // stray extra agent: turn -- breaks alternation
    "user: Great, please proceed.\n" +
    "agent: Deploying now.\n" +
    "user: Ping me when it's live.\n" +
    "agent: Will do.\n",
);
// Every agent: turn trimmed strictly shorter than its in3 counterpart -- including turn 3, where in3's own
// "Will do." is already short, so this case's PASS also clears the new COMPRESSION gate without touching
// what the case tests (alternation, which never reads agent: content).
const out3Ok = write(
  "out3_ok.txt",
  "Convention: user:/agent:\n" +
    "user: Can we deploy today?\n" +
    "agent: Yes.\n" +
    "user: Great, please proceed.\n" +
    "agent: OK.\n" +
    "user: Ping me when it's live.\n" +
    "agent: Sure.\n",
);
// Matches out3Ok's own LAST user: turn byte-for-byte.
const ref3 = write("ref3.txt", "user: Ping me when it's live.\n" + "agent: tail text, not checked\n");

check("Case 3a -- broken output alternation (stray consecutive agent: turn) FAILs", () => {
  const r = runChecker(in3, out3Broken, refUnreachable);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /alternation broken/);
});

check("Case 3b -- correct alternation over a 6-turn output PASSes", () => {
  const r = runChecker(in3, out3Ok, ref3);
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^PASS:/);
});

// ---------------------------------------------------------------------------
// Case 4 — negative control distinct from Case 1/2: a single DROPPED CHARACTER in the SECOND user: turn
// (not an appended clause, not the first turn) — a different tamper kind at a different structural position.
// ---------------------------------------------------------------------------
const in4 = write(
  "in4.txt",
  "Convention: user:/agent:\n" +
    "user: Can we deploy today?\n" +
    "agent: Yes, all checks passed.\n" +
    "user: Great, please proceed.\n" +
    "agent: Deploying now.\n",
);
const out4 = write(
  "out4.txt",
  "Convention: user:/agent:\n" +
    "user: Can we deploy today?\n" +
    "agent: Yes.\n" +
    "user: Great please proceed.\n" + // comma dropped, second turn only -- structure untouched
    "agent: Deploying.\n",
);

check("Case 4 -- single dropped character in the SECOND user: turn FAILs (distinct tamper position/kind)", () => {
  const r = runChecker(in4, out4, refUnreachable);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL:/m);
});

// ---------------------------------------------------------------------------
// @keep-comment Case 5 — MANDATORY ReDoS regression: the reviewer's own explicit requirement (code-review
// requirement is that this exact reproduction class gets its own case in BOTH selftest suites,
// independently authored (not copied from grimorio.js-developer's own Case H). The old MARKER_RE
// `(?:\s*>\s*)*` let V8 explore exponentially many ways to partition a run of `>` groups separated by
// whitespace. This fixture differs from Case H in every dimension the reviewer left open: 17 groups (not
// 16) with a STRICTLY INCREASING whitespace run (1..17 spaces, not one fixed length repeated), placed as a
// MID-BLOCK CONTINUATION line rather than trailing standalone — proving MARKER_RE is safe on every
// physical line parseTurnBlocks visits, not only the last.
//
// Runs through the real CLI under two DELIBERATELY CALIBRATED bounds — do not loosen either without
// re-reading why: HARD_KILL_MS (6000) is only the kill backstop, so a bound-alone check would still pass a
// 5999ms run that IS the regression; PROMPT_BOUND_MS (2000) is the real assertion, calibrated against this
// suite's own measured baseline (seven prior cases average ~190ms/case, ~1.3s total) — wide margin for a
// slow CI runner, still orders of magnitude tighter than the >8s hang the old pattern produced.
// ---------------------------------------------------------------------------
const pathologicalContinuationLine = Array.from({ length: 17 }, (_, i) => ">" + " ".repeat(i + 1)).join("");
const in5 = write(
  "in5.txt",
  "Convention: user:/agent:\n" +
    "user: Please check the archive tag format below.\n" +
    pathologicalContinuationLine +
    "\n" +
    "Does that look right to you?\n" +
    "agent: Looks fine, matches the spec.\n",
);
// agent: text trimmed short (well under the input's own length) so Case 5's PASS also clears the new
// COMPRESSION gate -- the ReDoS timing assertion only ever looks at the pathological user: continuation
// line, never at agent: content.
const out5 = write(
  "out5.txt",
  "Convention: user:/agent:\n" +
    "user: Please check the archive tag format below.\n" +
    pathologicalContinuationLine +
    "\n" +
    "Does that look right to you?\n" +
    "agent: Confirmed.\n",
);
// The independent reference's own first user: turn must byte-match out5's own (multi-line, pathological)
// last user: turn exactly, continuation line included.
const ref5 = write(
  "ref5.txt",
  "user: Please check the archive tag format below.\n" +
    pathologicalContinuationLine +
    "\n" +
    "Does that look right to you?\n" +
    "agent: tail text, not checked\n",
);

check(
  "Case 5 -- mid-block pathological blockquote-marker line (17 groups, strictly increasing whitespace) " +
    "resolves PROMPTLY, not a ReDoS hang (independent reproduction of the reviewer's CRITICAL finding)",
  () => {
    const HARD_KILL_MS = 6000;
    const PROMPT_BOUND_MS = 2000;
    // Case 5 drives the checker directly rather than through runChecker, because only here does the
    // invocation need its own timeout -- so it must take runChecker's own provenance stamp explicitly.
    writeProvenance(out5, "verify-cleaned-extract.qa.mjs fixture (stands in for splice)");
    const start = Date.now();
    let result;
    let killedByTimeout = false;
    try {
      const stdout = execFileSync(process.execPath, [CHECKER, in5, out5, ref5], { encoding: "utf8", timeout: HARD_KILL_MS });
      result = { status: 0, stdout };
    } catch (err) {
      // execFileSync throws on BOTH a non-zero exit (status set, signal null) and a timeout kill (status
      // null, signal set to the kill signal, e.g. SIGTERM) -- distinguish the two so a genuine hang reports
      // its own root cause rather than a generic assertion failure.
      killedByTimeout = err.status === null && !!err.signal;
      result = { status: err.status, stdout: (err.stdout ?? "").toString() };
    }
    const elapsedMs = Date.now() - start;

    if (killedByTimeout) {
      throw new Error(
        `process was KILLED after ${elapsedMs}ms by the ${HARD_KILL_MS}ms hard bound -- ReDoS regression: ` +
          `MARKER_RE hung on the pathological continuation line instead of resolving`,
      );
    }
    assert.ok(
      elapsedMs < PROMPT_BOUND_MS,
      `expected the pathological line to resolve in under ${PROMPT_BOUND_MS}ms, took ${elapsedMs}ms -- ` +
        `not killed, but not genuinely PROMPT either (a partial-backtracking regression)`,
    );
    assert.equal(
      result.status,
      0,
      `expected exit 0 (user: block including the pathological continuation line is byte-identical between ` +
        `input and output; only the agent: text was reworded) -- got ${result.status}\n${result.stdout}`,
    );
    assert.match(result.stdout, /^PASS:/);
  },
);

// ---------------------------------------------------------------------------
// @keep-comment Case 6 — COMPLETENESS PASS (positive control), own domain/wording, independent of the developer's own
// Case I. The independent reference's own first user: turn matches the output's own (single) last user:
// turn byte-for-byte, and the agent: turn is genuinely shorter than the input's, so this exercises the
// completeness gate specifically (not incidentally, the way Cases 1a/2b/3b/5 above satisfy it as a
// side-effect of proving something else).
// ---------------------------------------------------------------------------
const in6 = write(
  "in6.txt",
  "Convention: user:/agent:\n" +
    "user: Can you summarize the billing dispute for account 4471?\n" +
    "agent: The customer was charged twice for the same invoice because of a duplicate webhook delivery, " +
    "and a refund for the duplicate charge needs to go out before end of day.\n",
);
const out6 = write(
  "out6.txt",
  "Convention: user:/agent:\n" +
    "user: Can you summarize the billing dispute for account 4471?\n" +
    "agent: Duplicate charge, refund needed today.\n",
);
const ref6 = write(
  "ref6.txt",
  "user: Can you summarize the billing dispute for account 4471?\n" + "agent: tail text, not checked\n",
);

check("Case 6 -- COMPLETENESS PASS (independent reference matches output's own last user: turn)", () => {
  const r = runChecker(in6, out6, ref6);
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^PASS:/);
});

// ---------------------------------------------------------------------------
// @keep-comment Case 7 — COMPLETENESS FAIL (negative control), own domain/wording, independent of the developer's own
// Case J. Deliberately shapes the SAME failure class the completeness gate exists for: input and output
// share the identical (older, already-truncated-upstream) user: turn, so byte-fidelity, alternation and
// compression all PASS on their own -- only the independently, freshly re-fetched reference exposes that a
// newer user: turn exists and never made it into the classified window at all.
// ---------------------------------------------------------------------------
const in7 = write(
  "in7.txt",
  "Convention: user:/agent:\n" +
    "user: What was the resolution for the account 4471 dispute yesterday?\n" +
    "agent: We issued a partial refund and traced the root cause to a duplicate webhook delivery from the " +
    "payment processor's own retry logic.\n",
);
const out7 = write(
  "out7.txt",
  "Convention: user:/agent:\n" +
    "user: What was the resolution for the account 4471 dispute yesterday?\n" +
    "agent: Partial refund issued, root cause documented.\n",
);
// The TRUE most-recent turn, never present in in7/out7 at all -- simulating an upstream truncation the
// input<->output diff alone can never see.
const ref7 = write(
  "ref7.txt",
  "user: Also, has today's escalation on account 5502 been triaged yet?\n" + "agent: tail text, not checked\n",
);

check("Case 7 -- COMPLETENESS FAILs on a window truncated upstream (negative control)", () => {
  const r = runChecker(in7, out7, ref7);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL: COMPLETENESS/m);
});

// ---------------------------------------------------------------------------
// @keep-comment Case 8 — COMPRESSION PASS: every output agent: block is genuinely shorter than its input counterpart.
// Reuses Case 6's own fixtures -- Case 6's own PASS already depends on this holding, so this case names
// that dependency explicitly rather than leaving it implicit inside Case 6's overall verdict (same move the
// developer's own Case K made off Case A, applied here independently to this suite's own Case 6).
// ---------------------------------------------------------------------------
check("Case 8 -- COMPRESSION PASS (agent: turn genuinely shorter, reusing Case 6's fixtures)", () => {
  const r = runChecker(in6, out6, ref6);
  assert.equal(r.status, 0, `expected exit 0, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^PASS:/);
});

// ---------------------------------------------------------------------------
// @keep-comment Case 9 — COMPRESSION FAIL (negative control), own domain/wording, independent of the developer's own
// Case L. user: turns are preserved byte-for-byte (so byte-fidelity, alternation and completeness all PASS
// on their own) but BOTH agent: turns are left completely raw/unmodified, copied verbatim from input to
// output -- the shape the compression gate exists to catch (a Step 4 pass that silently skipped an
// agent: turn).
// ---------------------------------------------------------------------------
const in9 = write(
  "in9.txt",
  "Convention: user:/agent:\n" +
    "user: Please hand off the on-call rotation notes for tonight.\n" +
    "agent: Current incident queue is clear, no open pages, next check-in at midnight UTC.\n" +
    "user: Any known risky deploys going out overnight?\n" +
    "agent: One canary deploy to the payments-gateway service is scheduled for 02:00 UTC, rollback plan is " +
    "documented in the runbook.\n",
);
const out9 = write(
  "out9.txt",
  "Convention: user:/agent:\n" +
    "user: Please hand off the on-call rotation notes for tonight.\n" +
    "agent: Current incident queue is clear, no open pages, next check-in at midnight UTC.\n" +
    "user: Any known risky deploys going out overnight?\n" +
    "agent: One canary deploy to the payments-gateway service is scheduled for 02:00 UTC, rollback plan is " +
    "documented in the runbook.\n",
);
// Matches out9's own LAST user: turn byte-for-byte, so completeness clears and the failure isolates to
// compression specifically.
const ref9 = write(
  "ref9.txt",
  "user: Any known risky deploys going out overnight?\n" + "agent: tail text, not checked\n",
);

check("Case 9 -- COMPRESSION FAILs on unmodified agent: turns (negative control)", () => {
  const r = runChecker(in9, out9, ref9);
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL: COMPRESSION/m);
  assert.match(r.stdout, /turn 1/);
});

// @keep-comment Cases 10-12 — PROVENANCE, this suite's own coverage of the gate that asks whether the
// extract was produced by `splice` AT ALL. Independent of Cases 1-9 by design: those all compare the output
// against OTHER FILES and every one of them passes on a hand-written extract, which is exactly the hole this
// gate closes. These three are the ONLY cases that opt out of runChecker's own stamp, because they are the
// only ones that want the gate to fire. Each asserts its own DISTINCT code: collapsing "you never spliced
// this" and "you edited this afterwards" into one message sends a reader to the wrong place.
const in10 = write("in10.txt", "user: Ship the migration tonight please.\nagent: A long original agent turn, unabbreviated, awaiting compression.\n");
const out10 = write("out10.txt", "Convention: user:/agent:\nuser: Ship the migration tonight please.\nagent: Confirmed.\n");
const ref10 = write("ref10.txt", "user: Ship the migration tonight please.\nagent: tail text, not checked\n");

check("Case 10 -- PROVENANCE FAILs on an extract no splice ever produced (NOT_SPLICED)", () => {
  const r = runChecker(in10, out10, ref10, { stampProvenance: false });
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL: PROVENANCE \[NOT_SPLICED\]/m);
  assert.match(r.stdout, /never produced by/);
});

check("Case 11 -- PROVENANCE FAILs on a stamped extract EDITED afterwards (DIGEST_MISMATCH)", () => {
  writeProvenance(out10, "verify-cleaned-extract.qa.mjs fixture (stands in for splice)");
  appendFileSync(out10, "user: a line added by hand after the stamp\n", "utf8");
  const r = runChecker(in10, out10, ref10, { stampProvenance: false });
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL: PROVENANCE \[DIGEST_MISMATCH\]/m);
});

// @keep-comment Case 13 exists because the module's own comment claims four codes and says "NEVER collapse
// these into one message" — a claim that is only true if each one is actually REACHABLE. MISSING_EXTRACT is
// the one that could plausibly be shadowed: it is returned before any sidecar is looked for, so if any
// earlier check in verify-cleaned-extract.mjs's own main() read the output file first, this code could never
// surface and the fourth message would be dead. Raised by grimorio.code-reviewer as FINDING-02.
check("Case 13 -- PROVENANCE FAILs when the output file itself was never written (MISSING_EXTRACT)", () => {
  const r = runChecker(in10, join(workdir, "never-written.txt"), ref10, { stampProvenance: false });
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL: PROVENANCE \[MISSING_EXTRACT\]/m);
  assert.match(r.stdout, /does not exist/);
});

check("Case 12 -- PROVENANCE FAILs on a sidecar that is not valid JSON (UNREADABLE)", () => {
  const out12 = write("out12.txt", "Convention: user:/agent:\nuser: Ship the migration tonight please.\nagent: Confirmed.\n");
  writeFileSync(provenancePathFor(out12), "{ not json", "utf8");
  const r = runChecker(in10, out12, ref10, { stampProvenance: false });
  assert.equal(r.status, 1, `expected exit 1, got ${r.status}\n${r.stdout}`);
  assert.match(r.stdout, /^FAIL: PROVENANCE \[UNREADABLE\]/m);
});

// ---------------------------------------------------------------------------
rmSync(workdir, { recursive: true, force: true });

console.log("");
console.log(`${passed} passed, ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
