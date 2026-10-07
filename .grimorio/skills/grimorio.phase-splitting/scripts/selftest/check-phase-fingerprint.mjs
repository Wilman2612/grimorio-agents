#!/usr/bin/env node
// Proves the D8 fingerprint gate (../check-phase-fingerprint.mjs) both PASSes genuine content and FAILs a
// placeholder or missing field, across two real phase chains plus the log-line extension — see each
// numbered console.log section below for what each case covers.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cachePath } from "../../../../../scripts/refobl/cache-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../../../../');
process.chdir(REPO_ROOT);

const SCRIPT = '.grimorio/skills/grimorio.phase-splitting/scripts/check-phase-fingerprint.mjs';
const FIXDIR = 'tmp/qa-fingerprint-gate';
// Re-created fresh every run and deliberately left on disk afterward (never cleaned up here) so a human
// can inspect exactly what was fed to the gate on its last run.
mkdirSync(FIXDIR, { recursive: true });

let FAIL = 0;
let LAST_OUT = '';

function runNode(args) {
  const result = spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8' });
  LAST_OUT = (result.stdout || '') + (result.stderr || '');
  return result.status === null ? 1 : result.status;
}

function assertExit(label, expected, args) {
  const actual = runNode(args);
  if (actual === expected) {
    console.log(`PASS: ${label} (exit ${actual} as expected)`);
  } else {
    console.log(`FAIL: ${label} (expected exit ${expected}, got ${actual})`);
    console.log('  --- output ---');
    console.log(LAST_OUT.split('\n').map((l) => `  ${l}`).join('\n'));
    FAIL = 1;
  }
}

function assertContains(haystack, needle, label) {
  if (haystack.includes(needle)) {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label} — expected to find: ${needle}`);
    console.log('  --- actual output ---');
    console.log(haystack.split('\n').map((l) => `  ${l}`).join('\n'));
    FAIL = 1;
  }
}

function assertNotContains(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label} — output should NOT contain: ${needle}`);
    console.log('  --- actual output ---');
    console.log(haystack.split('\n').map((l) => `  ${l}`).join('\n'));
    FAIL = 1;
  }
}

console.log(`=== Writing self-contained fixtures to ${FIXDIR} (re-created fresh every run) ===`);

// Single-fingerprint fixture — one bullet copied verbatim from phase-d-close-out.md (real field name:
// LEDGER CURRENT), closed with a trailing "##" heading matching every real phase file's own shape, so
// cases 1-3 below exercise the ordinary heading-terminated path, not the end-of-file fallback.
writeFileSync(
  `${FIXDIR}/fixture-phase-single-field.md`,
  `# Fixture phase — single-fingerprint (LOAD bullet copied verbatim from phase-d-close-out.md)

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.objective-harness — the branch-objective methodology: \`open-branch.sh\`/\`close-branch.sh\`, the
  hard invariants, and the two VERIFY-syntax pitfalls that make \`close-branch.sh\` reject a correct check.
  Load it here, not earlier in the chain, because this is the one phase that actually brings a branch's own
  objective current and may run the close-out itself (step 2 above).
  FINGERPRINT: LEDGER CURRENT field below (a genuinely up-to-date checks/log/feature-line cannot be produced
  without applying this discipline).

## PHASE X DELIVERABLE (fixture terminator only, not read by the script)
`,
);

// Second fixture — a LOAD section that runs to true end-of-file, no trailing "##" heading, no letter "Z"
// anywhere after it (nothing requires a heading to follow a phase file's own LOAD section). Assertion 9
// proves the gate still finds and genuinely evaluates this section rather than missing it.
writeFileSync(
  `${FIXDIR}/fixture-phase-eof-no-heading.md`,
  `# Fixture phase — LOAD section runs to true EOF, no following heading, no letter "Z" anywhere after it

## LOAD (JIT)

- import:skill/grimorio.reasoning-principles — the objective/exit-condition contract.
  FINGERPRINT: OBJECTIVE field below (cannot be produced without this discipline).
`,
);

writeFileSync(
  `${FIXDIR}/deliverable-eof-pass.txt`,
  'OBJECTIVE: Prove the LOAD-section extraction correctly reaches true end-of-file with no trailing heading.\n',
);

writeFileSync(`${FIXDIR}/deliverable-eof-fail-placeholder.txt`, 'OBJECTIVE: <...>\n');

writeFileSync(
  `${FIXDIR}/deliverable-single-pass.txt`,
  'LEDGER CURRENT: checks ticked for D8, close-branch.sh log updated 2026-08-26T00:00Z, feature line filled\n  for "phase-fingerprint gate selftest" in features-status.md.\n',
);

writeFileSync(`${FIXDIR}/deliverable-single-fail-placeholder.txt`, 'LEDGER CURRENT: <...>\n');

writeFileSync(
  `${FIXDIR}/deliverable-single-fail-missing.txt`,
  'NOTES: this deliverable never declares a LEDGER CURRENT field at all — only this unrelated one.\n',
);

// Superset fixture — carries every field any phase's own FINGERPRINT currently asks for. A narrower phase
// (cases 4/8a) simply never looks up the extra fields; keep this in sync with whichever phase's own
// declaration asks for the most fields, or a newly-added field there goes untested here.
writeFileSync(
  `${FIXDIR}/deliverable-two-pass.txt`,
  `OBJECTIVE: Build and independently prove the D8 LOAD-list <-> deliverable-fingerprint gate for phase
  deliverables, per the brief handed down by grimorio.system-keeper.
EXIT CONDITION: scripts/selftest/check-phase-fingerprint.sh exists, covers the required cases, and running
  it end to end prints ALL ASSERTIONS PASSED with exit 0.
DECOMPOSITION (TANGLED SPECS ONLY): N/A — this deliverable's own spec (build + prove one selftest script)
  is a single atomic ask, not a tangled one; the escape clause applies, not a blank.
GOAL-LEVEL CHECK (GOAL-SHAPED ONLY): N/A — artifact is not goal-shaped
BIRTH-HARNESS SHAPE (NEW AGENT ONLY): N/A — not authoring a new agent this pass
VISION DERIVED (NEW AGENT OR SPLIT ONLY): N/A — neither a brand-new agent nor a split this pass
STEPS-VS-PHASES VERDICT: STEPS — this deliverable's own ask (build one selftest script and prove it) is a
  REWRITE of an existing linear protocol, not a new agent; the judgment test finds no second DELIVERABLE or
  KNOWLEDGE boundary, so no phase split is warranted.
`,
);

writeFileSync(
  `${FIXDIR}/deliverable-two-fail-one-placeholder.txt`,
  `OBJECTIVE: Build and independently prove the D8 LOAD-list <-> deliverable-fingerprint gate for phase
  deliverables, per the brief handed down by grimorio.system-keeper.
EXIT CONDITION: <...>
`,
);

// --- Fifth fixture: a LOAD bullet whose first line only DISCUSSES the `import:` relation inside backticked
//     prose, with no real `skill/` or `repo/` path following it — the exact shape of the D8 false-positive bug
//     fixed upstream. Used by assertion 10, a REGRESSION GUARD for that fix.
writeFileSync(
  `${FIXDIR}/fixture-phase-false-positive-only.md`,
  `# Fixture phase — D8 false-positive-only (bullet DISCUSSES \`import:\` in prose, no real skill/ or repo/ path)

## LOAD (JIT)

- D8 note: this phase carries no mandatory \`import:\` target — every LOAD line here is \`ref:\` (lazy).

## PHASE X DELIVERABLE (fixture terminator only, not read by the script)
`,
);

// --- Sixth fixture: the SAME false-positive-shaped bullet above, PLUS a genuine `import:skill/...` bullet
//     carrying a real FINGERPRINT annotation — the companion POSITIVE control assertion 10 also proves.
writeFileSync(
  `${FIXDIR}/fixture-phase-false-positive-plus-real.md`,
  `# Fixture phase — D8 false-positive bullet alongside a genuine import:skill/ bullet (companion positive control)

## LOAD (JIT)

- D8 note: this phase carries no mandatory \`import:\` target — every LOAD line here is \`ref:\` (lazy).
- import:skill/grimorio.reasoning-principles — the objective/exit-condition contract.
  FINGERPRINT: OBJECTIVE field below (cannot be produced without this discipline).

## PHASE X DELIVERABLE (fixture terminator only, not read by the script)
`,
);

// Real phase files already shipped in this repo, used exactly AS-IS — never modified for this selftest.
const PHASE_KEEPER_TWO_FIELD = '.grimorio/skills/grimorio.working-memory/adviser-phases/phase-1-search-first.md';
// Case 6 needs a REAL corpus file declaring zero FINGERPRINT fields — naming one outright would couple this
// test to content that can legitimately change, so it is discovered live and case 6 skips loudly when none
// remain (case 10 covers the same zero-field path against a fixture this test owns either way).
let PHASE_KEEPER_NO_IMPORT = '';
const skDir = '.grimorio/skills/grimorio.agent-writing/system-keeper-phases';
if (existsSync(skDir)) {
  for (const f of readdirSync(skDir).sort()) {
    if (!f.endsWith('.md')) continue;
    const p = `${skDir}/${f}`;
    const content = readFileSync(p, 'utf8');
    if (!content.includes('FINGERPRINT:') && content.includes('## LOAD')) {
      PHASE_KEEPER_NO_IMPORT = p;
      break;
    }
  }
}
const PHASE_CROSS_CHAIN_TWO_FIELD = '.grimorio/skills/grimorio.fan-out/entropy-phases/phase-1-frame.md';

console.log('');
console.log('=== 1. REAL PASS — single fingerprint field, genuine content ===');
assertExit('1a', 0, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-single-pass.txt`]);
assertContains(LAST_OUT, 'PASS —', '1b: output declares PASS');

console.log('');
console.log('=== 2. REAL FAIL — single fingerprint field, still the literal <...> placeholder ===');
assertExit('2a', 1, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-single-fail-placeholder.txt`]);
assertContains(LAST_OUT, 'LEDGER CURRENT', '2b: output names the failing field');
assertContains(LAST_OUT, 'UNFILLED TEMPLATE PLACEHOLDER', '2c: output says it is an unfilled placeholder');

console.log('');
console.log('=== 3. FAIL — required field MISSING entirely (not present at all, not just placeholder) ===');
assertExit('3a', 1, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-single-fail-missing.txt`]);
assertContains(LAST_OUT, 'MISSING FIELD', '3b: output says MISSING FIELD');
assertContains(LAST_OUT, 'LEDGER CURRENT', '3c: output names the missing field');

console.log('');
console.log('=== 4. PASS — TWO-field fingerprint (OBJECTIVE + EXIT CONDITION), both genuinely filled ===');
assertExit('4a', 0, [PHASE_KEEPER_TWO_FIELD, `${FIXDIR}/deliverable-two-pass.txt`]);
assertContains(LAST_OUT, 'PASS —', '4b: output declares PASS');

console.log('');
console.log('=== 5. FAIL — same two-field phase, only EXIT CONDITION is placeholder, OBJECTIVE is filled ===');
assertExit('5a', 1, [PHASE_KEEPER_TWO_FIELD, `${FIXDIR}/deliverable-two-fail-one-placeholder.txt`]);
assertContains(LAST_OUT, 'EXIT CONDITION', '5b: output names EXIT CONDITION as failing');
assertContains(LAST_OUT, '1 fingerprint check(s) failed', '5c: exactly ONE failure reported, not two');

console.log('');
console.log('=== 6. NEGATIVE CASE — a REAL shipped keeper phase file that declares zero FINGERPRINT fields ===');
if (PHASE_KEEPER_NO_IMPORT) {
  console.log(`===    (discovered: ${PHASE_KEEPER_NO_IMPORT})`);
  assertExit('6a', 0, [PHASE_KEEPER_NO_IMPORT, `${FIXDIR}/deliverable-single-pass.txt`]);
  assertContains(LAST_OUT, 'PASS — all 0 declared FINGERPRINT', '6b: zero fields to check, vacuous PASS, no crash');
} else {
  console.log('SKIP: 6 — every shipped keeper phase file now declares at least one FINGERPRINT, so there is no real');
  console.log('      corpus file left to run this negative case against. Case 10 proves the same zero-field path');
  console.log('      against a fixture this test owns, so the behaviour stays covered.');
}

console.log('');
console.log('=== 7. Usage-error cases ===');
assertExit('7a', 2, []);
assertExit('7b', 2, [`${FIXDIR}/does-not-exist-phase.md`, `${FIXDIR}/deliverable-single-pass.txt`]);

console.log('');
console.log('=== 8. Cross-chain — the SAME unmodified script gates a different real chain\'s phase file too — never prompt-writer\'s own, which stopped using this gate ===');
assertExit('8a', 0, [PHASE_CROSS_CHAIN_TWO_FIELD, `${FIXDIR}/deliverable-two-pass.txt`]);
assertContains(LAST_OUT, 'PASS —', '8b: PASS on the writer chain, real content');
assertExit('8c', 1, [PHASE_CROSS_CHAIN_TWO_FIELD, `${FIXDIR}/deliverable-two-fail-one-placeholder.txt`]);
assertContains(LAST_OUT, 'EXIT CONDITION', '8d: FAIL on a different real chain, same field named, same script');

console.log('');
console.log('=== 9. REGRESSION GUARD — a LOAD section with no trailing \'##\' heading (true EOF) ===');
assertExit('9a', 0, [`${FIXDIR}/fixture-phase-eof-no-heading.md`, `${FIXDIR}/deliverable-eof-pass.txt`]);
assertContains(LAST_OUT, 'PASS —', '9b: LOAD section with no trailing heading is found, real content PASSes');
assertExit('9c', 1, [`${FIXDIR}/fixture-phase-eof-no-heading.md`, `${FIXDIR}/deliverable-eof-fail-placeholder.txt`]);
assertContains(LAST_OUT, 'OBJECTIVE', '9d: same no-trailing-heading fixture, placeholder correctly FAILs and names the field');

console.log('');
console.log('=== 10. REGRESSION GUARD — a LOAD bullet that only DISCUSSES `import:` inside backticked prose ===');
assertExit('10a', 0, [`${FIXDIR}/fixture-phase-false-positive-only.md`, `${FIXDIR}/deliverable-single-pass.txt`]);
assertContains(LAST_OUT, 'PASS — all 0 declared FINGERPRINT', '10b: the false-positive-only bullet contributes ZERO fingerprint fields');
assertNotContains(LAST_OUT, 'NOTE:', '10c: the false-positive bullet is never flagged as a mandatory import missing its FINGERPRINT');
assertExit('10d', 0, [`${FIXDIR}/fixture-phase-false-positive-plus-real.md`, `${FIXDIR}/deliverable-eof-pass.txt`]);
assertContains(LAST_OUT, 'PASS — all 1 declared FINGERPRINT', '10e: the genuine import:skill/ bullet is still counted (exactly 1, not 0 and not 2)');
assertNotContains(LAST_OUT, 'NOTE:', '10f: the false-positive bullet still contributes no NOTE even alongside a real bullet');
assertExit('10g', 1, [`${FIXDIR}/fixture-phase-false-positive-plus-real.md`, `${FIXDIR}/deliverable-eof-fail-placeholder.txt`]);
assertContains(LAST_OUT, 'OBJECTIVE', '10h: the genuine import:skill/ bullet\'s FINGERPRINT is genuinely CHECKED, not just counted');

// Cases 11-13 assert only the DELTA this run produces (a before/after line count, the LAST line after) —
// never the log's full content, since this file may already carry entries from earlier runs.
const LOGFILE = cachePath('fingerprint-gate-log.jsonl');

function logLines() {
  if (!existsSync(LOGFILE)) return 0;
  const content = readFileSync(LOGFILE, 'utf8');
  if (content === '') return 0;
  return content.split('\n').filter((l) => l.length > 0).length;
}

// lastLogLineSummary — parses the LAST line of the log file as JSON and returns "OK|<phase>|<agent>|<verdict>|
// <deliverable>" when it is valid JSON carrying all five required keys, "MISSING:<keys>" when it parses but is
// missing one or more of them, or "PARSE_ERROR" when the line is not valid JSON at all — never a substring
// match, an actual parse.
function lastLogLineSummary() {
  if (!existsSync(LOGFILE)) return 'PARSE_ERROR';
  const lines = readFileSync(LOGFILE, 'utf8').split('\n').filter((l) => l.length > 0);
  const line = lines[lines.length - 1] || '';
  let obj;
  try {
    obj = JSON.parse(line);
  } catch (e) {
    return 'PARSE_ERROR';
  }
  const required = ['ts', 'phase', 'agent', 'verdict', 'deliverable'];
  const missing = required.filter((k) => !Object.prototype.hasOwnProperty.call(obj, k));
  if (missing.length) return `MISSING:${missing.join(',')}`;
  return ['OK', obj.phase, obj.agent, obj.verdict, obj.deliverable].join('|');
}

console.log('');
console.log('=== 11. BACKWARD-COMPAT — the existing 2-arg form (no 3rd \'agent\' CLI arg) still PASSes exactly as before ===');
let before11 = logLines();
assertExit('11a', 0, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-single-pass.txt`]);
assertContains(LAST_OUT, 'PASS —', '11b: 2-arg form (no agent) still PASSes exactly as before');
let after11 = logLines();
if (after11 - before11 === 1) {
  console.log('PASS: 11c (exit 0 as expected)');
} else {
  console.log(`FAIL: 11c (expected delta 1, got ${after11 - before11})`);
  FAIL = 1;
}
console.log(`  (11c line-count check: before=${before11} after=${after11}, delta must be exactly 1)`);
const summary11 = lastLogLineSummary();
assertContains(summary11, 'OK|', '11d: the log file\'s LAST line after this run is valid JSON carrying all five required keys');
assertContains(summary11, '|unknown|PASS|', '11e: agent reads the literal default "unknown", verdict reads "PASS"');

console.log('');
console.log('=== 12. EXPLICIT AGENT — the SAME 2-arg PASS case run again, now WITH an explicit 3rd CLI arg ===');
let before12 = logLines();
assertExit('12a', 0, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-single-pass.txt`, 'grimorio.qa-selftest']);
assertContains(LAST_OUT, 'PASS —', '12b: 3-arg form (explicit agent) also PASSes');
let after12 = logLines();
if (after12 - before12 === 1) {
  console.log('PASS: 12c (exit 0 as expected)');
} else {
  console.log(`FAIL: 12c (expected delta 1, got ${after12 - before12})`);
  FAIL = 1;
}
console.log(`  (12c line-count check: before=${before12} after=${after12}, delta must be exactly 1)`);
const summary12 = lastLogLineSummary();
assertContains(summary12, 'OK|', '12d: the log file\'s LAST line after this run is valid JSON carrying all five required keys');
assertContains(summary12, '|grimorio.qa-selftest|PASS|', '12e: agent reads the exact explicit string, verdict reads "PASS"');

console.log('');
console.log('=== 13. FAIL CASE + EXPLICIT AGENT — a FAIL case run WITH an explicit 3rd CLI arg still exits 1 ===');
let before13 = logLines();
assertExit('13a', 1, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-single-fail-placeholder.txt`, 'grimorio.qa-selftest']);
assertContains(LAST_OUT, 'LEDGER CURRENT', '13b: FAIL case still names the failing field exactly as before');
let after13 = logLines();
if (after13 - before13 === 1) {
  console.log('PASS: 13c (exit 0 as expected)');
} else {
  console.log(`FAIL: 13c (expected delta 1, got ${after13 - before13})`);
  FAIL = 1;
}
console.log(`  (13c line-count check: before=${before13} after=${after13}, delta must be exactly 1)`);
const summary13 = lastLogLineSummary();
assertContains(summary13, 'OK|', '13d: the log file\'s LAST line after this run is valid JSON carrying all five required keys');
assertContains(summary13, '|grimorio.qa-selftest|FAIL|', '13e: agent reads the same explicit string, verdict reads "FAIL"');

// --- Fixture for case 14: a deliverable with a MULTI-LINE placeholder spanning two lines — the original regex
//     /^<.*>$/ would fail to match this because . does not match newlines by default. The fixed regex
//     /^<[\s\S]*>$/ correctly matches any character including newlines.
writeFileSync(
  `${FIXDIR}/deliverable-multiline-fail-placeholder.txt`,
  'LEDGER CURRENT: <the checkable state that means the objective holds — a blank or\n                copy-pasted-brief value here is a D8 FAIL, never a pass>\n',
);

console.log('');
console.log('=== 14. REGRESSION GUARD — a placeholder value spanning MULTIPLE lines must be detected ===');
assertExit('14a', 1, [`${FIXDIR}/fixture-phase-single-field.md`, `${FIXDIR}/deliverable-multiline-fail-placeholder.txt`]);
assertContains(LAST_OUT, 'LEDGER CURRENT', '14b: output names the field with multi-line placeholder');
assertContains(LAST_OUT, 'UNFILLED TEMPLATE PLACEHOLDER', '14c: output correctly identifies it as an unfilled placeholder');

console.log('');
if (FAIL === 0) {
  console.log('ALL ASSERTIONS PASSED');
  process.exit(0);
} else {
  console.log('SOME ASSERTIONS FAILED');
  process.exit(1);
}
