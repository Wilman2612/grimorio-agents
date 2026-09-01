#!/usr/bin/env node
// @keep-comment verify-cleaned-extract.mjs — checks every `user:` TURN block (not just its first physical
// line) survives byte-for-byte, in order, from INPUT to OUTPUT of grimorio.extract-cleaner's cleaning pass,
// that OUTPUT keeps strict user:/agent: alternation, that OUTPUT's own LAST user: turn is byte-identical to
// an INDEPENDENTLY re-fetched reference of the CEO's true most-recent turn (COMPLETENESS — catches an
// upstream truncation a pure input<->output diff can never see, since input==output==truncated in that
// case), and that every OUTPUT agent: turn is genuinely SHORTER than its INPUT counterpart (COMPRESSION —
// catches an agent: turn left raw/unmodified). Exit 0 PASS / 1 FAIL, never a semantic judgment — the
// DETERMINISTIC harness tier. @keep-comment
//
// USAGE: verify-cleaned-extract.mjs <input-file> <output-file> <independent-reference-file> (or via the
// verify-cleaned-extract.sh shim). The independent-reference-file is a FRESH, separate re-fetch (via
// `ceo-transcript-lookup.mjs <session> --user-count 1 --out <path>`) of the CEO's single most-recent turn,
// produced by the CALLER immediately before running this gate — never derived from the same classified-window
// file <input-file> came from. This 3-arg CLI contract is relied on by the verify-cleaned-extract.sh shim AND
// by grimorio.extract-cleaner's own governed Step 6. @keep-comment
//
// CONTRACT this file must not regress (cycle-1/cycle-2 CRITICAL findings, code-review, 2026-08-25): the file
// format has no distinct turn-separator, so parsing MUST stay BLOCK-based (parseTurnBlocks below), never
// grep'd marker lines only — a prior grep-only .sh implementation missed corrupted/dropped continuation
// lines and reported false PASS. Stay a real .mjs, never a bash rewrite: this project's other
// deterministic-harness tools (ceo-transcript-lookup.mjs, replan-check.mjs, parked-watch.mjs) are .mjs for
// the same reason — bash's line-based tools (grep/case/while-read) keep failing on exactly this kind of
// multi-line, byte-exact parsing.
import { readFileSync, existsSync } from "node:fs";

// @keep-comment DESIGN INVARIANT — do not "simplify" this regex back to `(?:\s*>\s*)*` (leading AND
// trailing `\s*` on the repeated group): that shape lets V8 explore exponentially many ways to split a run
// of whitespace between iterations, and hangs on a line with several `>` that never resolves into
// `user:`/`agent:` (CRITICAL ReDoS finding, code-review, 2026-08-25 — 16 `>` groups hung the old pattern
// past 8s; this shape resolves the same line in <1ms, see verify-cleaned-extract.sh Case H). The fix: ONE
// leading `\s*` for indentation before the whole run, and each `(?:>\s*)*` iteration owns only its own
// trailing `\s*`.
const MARKER_RE = /^\s*(?:>\s*)*(user|agent): /;

function fail(message) {
  console.log(`FAIL: ${message}`);
  process.exit(1);
}

// Split file text into physical lines WITHOUT ever dropping an unterminated final line (the exact class of
// bug the cycle-1 CRITICAL finding was: a bare `while read` loop silently drops a file's last line when it
// has no trailing newline). A trailing "\n" produces one extra empty split entry that is not a real line —
// drop only that one, and only when the text genuinely ends with "\n".
export function splitLines(text) {
  const lines = text.split("\n");
  if (text.endsWith("\n")) {
    lines.pop();
  }
  return lines;
}

// A TURN BLOCK runs from a marker line (`user: `/`agent: `, optionally blockquoted) up to, but not
// including, the next marker or EOF — blank lines included. Lines before the first marker are ignored.
export function parseTurnBlocks(text) {
  const lines = splitLines(text);
  const blocks = [];
  let current = null;
  lines.forEach((line, i) => {
    const m = line.match(MARKER_RE);
    if (m) {
      current = { role: m[1], lines: [line], lineNo: i + 1 };
      blocks.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  });
  return blocks.map((b) => ({ role: b.role, lineNo: b.lineNo, text: b.lines.join("\n") }));
}

function userBlocks(blocks) {
  return blocks.filter((b) => b.role === "user");
}

function agentBlocks(blocks) {
  return blocks.filter((b) => b.role === "agent");
}

// Compare the FULL ordered sequence of user:-role turn BLOCKS between input and output — every character of
// every continuation line must match, not merely the first line.
function compareUserBlocks(inBlocks, outBlocks) {
  if (inBlocks.length !== outBlocks.length) return false;
  return inBlocks.every((b, i) => b.text === outBlocks[i].text);
}

function firstLinePrefix(text) {
  return text.split("\n", 1)[0].slice(0, 60);
}

function printUserBlockDiff(inBlocks, outBlocks) {
  const max = Math.max(inBlocks.length, outBlocks.length);
  for (let i = 0; i < max; i++) {
    const a = inBlocks[i];
    const b = outBlocks[i];
    if (!a) {
      console.log(`+++ output user turn ${i + 1} (output line ${b.lineNo}, not present in input):\n${b.text}`);
    } else if (!b) {
      console.log(`--- input user turn ${i + 1} (input line ${a.lineNo}, missing from output):\n${a.text}`);
    } else if (a.text !== b.text) {
      console.log(
        `user turn ${i + 1} (input line ${a.lineNo}, output line ${b.lineNo}) differs:\n` +
          `--- input\n${a.text}\n+++ output\n${b.text}`,
      );
    }
  }
}

// COMPLETENESS diff printer — mirrors printUserBlockDiff's own "--- / +++" shape for the single-block
// comparison between output's own last user: turn and the independent reference's own first user: turn.
function printCompletenessDiff(refBlock, outBlock) {
  console.log(
    `completeness check (independent reference line ${refBlock.lineNo}, output line ${outBlock.lineNo}) differs:\n` +
      `--- independent reference (freshly re-fetched most-recent CEO turn)\n${refBlock.text}\n` +
      `+++ output (output's own last user: turn)\n${outBlock.text}`,
  );
}

// Re-validate alternation over the BLOCK sequence of the OUTPUT file (not the physical-line sequence) — no
// two adjacent blocks share a role.
export function checkAlternation(blocks) {
  let prevRole = null;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.role === prevRole) {
      return {
        ok: false,
        message:
          `alternation broken at turn ${i + 1} (line ${b.lineNo}, starts: ${firstLinePrefix(b.text)}) -- ` +
          `two consecutive ${b.role}: turns`,
      };
    }
    prevRole = b.role;
  }
  return { ok: true };
}

function readFileOrFail(filePath, label) {
  if (!existsSync(filePath)) fail(`${label} file not found: ${filePath}`);
  return readFileSync(filePath, "utf8");
}

function parseArgs(argv) {
  const [input, output, reference] = argv;
  if (!input || !output || !reference) {
    // Name BOTH entry points -- this is reachable either directly (`node verify-cleaned-extract.mjs`) or via
    // the `verify-cleaned-extract.sh` shim (a plain `exec node ... "$@"`, so this same message is what a
    // shim caller sees too); naming only one lies to whichever caller used the other.
    fail(
      "usage: verify-cleaned-extract.sh|verify-cleaned-extract.mjs <input-file> <output-file> <independent-reference-file>",
    );
  }
  return { input, output, reference };
}

// Check 1 (existing) -- byte-fidelity of every user: turn, input to output.
function checkByteFidelity(inUser, outUser) {
  if (compareUserBlocks(inUser, outUser)) return;
  printUserBlockDiff(inUser, outUser);
  fail("user: turns are not byte-identical between input and output (comparing full multi-line blocks)");
}

// Check 2 (existing) -- strict user:/agent: alternation in the output.
function checkAlternationOrFail(outBlocks, output) {
  const alternation = checkAlternation(outBlocks);
  if (!alternation.ok) fail(`${alternation.message} in ${output}`);
}

// Check 3 (new) -- COMPLETENESS: output's own LAST user: turn must be byte-identical to the independent
// reference's own FIRST user: turn (the CEO's true most-recent turn, per --user-count 1's own ordering). A
// pure input<->output diff can never catch an upstream truncation (input==output==truncated in that case) --
// only an independently, freshly re-fetched reference can.
function checkCompleteness(refBlocks, outUser, reference, output) {
  const refUser = userBlocks(refBlocks);
  if (refUser.length === 0) {
    fail(`independent reference file ${reference} carries no user: turn to verify completeness against`);
  }
  if (outUser.length === 0) {
    fail(`output file ${output} carries no user: turn to verify completeness against`);
  }
  const refFirstUser = refUser[0];
  const outLastUser = outUser[outUser.length - 1];
  if (refFirstUser.text === outLastUser.text) return;
  printCompletenessDiff(refFirstUser, outLastUser);
  fail(
    "COMPLETENESS: output's own last user: turn is not byte-identical to the independent reference's own " +
      `first user: turn (possible upstream truncation) -- reference: ${reference}, output: ${output}`,
  );
}

// Check 4 (new) -- COMPRESSION: every output agent: turn must be genuinely shorter than its input
// counterpart (same order, same count -- turns are never reordered/dropped). Compares FULL block length, not
// a marker-stripped body: the `agent: ` prefix is small and present identically on both sides, so stripping
// it first would add a second regex pass for no behavioral benefit at these block sizes.
function checkCompression(inAgent, outAgent) {
  if (inAgent.length !== outAgent.length) {
    fail(
      `COMPRESSION: agent: turn count differs between input (${inAgent.length}) and output (${outAgent.length}) ` +
        "-- Step 4 must never drop or duplicate an agent: turn",
    );
  }
  for (let i = 0; i < inAgent.length; i++) {
    const a = inAgent[i];
    const b = outAgent[i];
    if (b.text.length < a.text.length) continue;
    fail(
      `COMPRESSION: agent: turn ${i + 1} (input line ${a.lineNo}, output line ${b.lineNo}) is not shorter ` +
        `in the output -- input length ${a.text.length}, output length ${b.text.length}`,
    );
  }
}

// Read and parse all three files' blocks once, up front -- every check reuses these, never re-parses.
function loadAndParse(input, output, reference) {
  const inText = readFileOrFail(input, "input");
  const outText = readFileOrFail(output, "output");
  const refText = readFileOrFail(reference, "independent reference");
  return {
    inBlocks: parseTurnBlocks(inText),
    outBlocks: parseTurnBlocks(outText),
    refBlocks: parseTurnBlocks(refText),
  };
}

function printPassAndExit(input, output, reference, inUser, inAgent) {
  console.log(
    `PASS: all ${inUser.length} user: turn(s) in ${input} are byte-present, in order, in ${output}; ` +
      `output alternation OK; completeness OK (matches ${reference}); compression OK (${inAgent.length} agent: turn(s))`,
  );
  process.exit(0);
}

function main() {
  const { input, output, reference } = parseArgs(process.argv.slice(2));
  const { inBlocks, outBlocks, refBlocks } = loadAndParse(input, output, reference);
  const inUser = userBlocks(inBlocks);
  const outUser = userBlocks(outBlocks);
  const inAgent = agentBlocks(inBlocks);
  const outAgent = agentBlocks(outBlocks);

  checkByteFidelity(inUser, outUser);
  checkAlternationOrFail(outBlocks, output);
  checkCompleteness(refBlocks, outUser, reference, output);
  checkCompression(inAgent, outAgent);

  printPassAndExit(input, output, reference, inUser, inAgent);
}

const isSelf =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file:///${(process.argv[1] || "").replace(/\\/g, "/")}`;
if (isSelf) {
  main();
}
