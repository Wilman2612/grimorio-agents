#!/usr/bin/env node

// @keep-comment assemble-cleaned-extract.mjs — the DETERMINISTIC replacement for grimorio.extract-cleaner's
// own Step 2 (BOUNDARY-CLASSIFY) and Step 5 (ASSEMBLE & WRITE) writes. Both steps used to ask an LLM to
// free-generate (re-type, via the Write tool) previously-read `user:` turn text into an output file -- a real
// production run exhausted its own 2-retry self-verification cap citing byte-identity mismatches on long
// turns (tmp/keeper-batch-notes/keeper.md's own CHECK-3 OBSERVATION). This tool closes that by construction:
// `slice` cuts the classified working window by literal line-range substring slicing of the ORIGINAL file
// text; `splice` builds the final cleaned extract by copying every user: turn block byte-for-byte and
// substituting every agent: turn block with a pre-written abstract -- no text reaches either output through
// free-generation anywhere in this path. Judged by exit code, never by an LLM's own self-report, the same
// HARNESS tier verify-cleaned-extract.mjs and ceo-transcript-lookup.mjs already occupy in this file family.
// @keep-comment
//
// USAGE:
//   node .grimorio/agents/grimorio.extract-cleaner/scripts/assemble-cleaned-extract.mjs slice <raw-fetch-file> --keep-last-user <K> --out <path>
//   node .grimorio/agents/grimorio.extract-cleaner/scripts/assemble-cleaned-extract.mjs splice <window-file> <abstracts-file> --out <path>
//
// Exit 0 success, 1 data/content FAIL, 2 USAGE error (malformed invocation) -- mirrors
// check-phase-fingerprint.mjs's own usageError-vs-FAIL convention.
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { parseTurnBlocks, checkAlternation, splitLines } from "./verify-cleaned-extract.mjs";
import { writeProvenance } from "./splice-provenance.mjs";

const USAGE =
  "usage: assemble-cleaned-extract.mjs slice <raw-fetch-file> --keep-last-user <K> --out <path>\n" +
  "       assemble-cleaned-extract.mjs splice <window-file> <abstracts-file> --out <path>\n" +
  "       assemble-cleaned-extract.mjs user-view <raw-fetch-file> --out <path>";

function usageError() {
  console.error(USAGE);
  process.exit(2);
}

function fail(message) {
  console.log(`FAIL: ${message}`);
  process.exit(1);
}

function readFileOrFail(filePath, label) {
  if (!existsSync(filePath)) fail(`${label} file not found: ${filePath}`);
  return readFileSync(filePath, "utf8");
}

// Parse `--flag value` pairs plus positionals from an already-sub-command-stripped argv slice.
function parseFlagsAndPositionals(argv, flagNames) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (flagNames.includes(arg)) {
      const value = argv[i + 1];
      if (value === undefined) usageError();
      flags[arg] = value;
      i++;
    } else {
      positionals.push(arg);
    }
  }
  return { flags, positionals };
}

function parseSliceArgs(argv) {
  const { flags, positionals } = parseFlagsAndPositionals(argv, ["--keep-last-user", "--out"]);
  const rawFetchFile = positionals[0];
  const out = flags["--out"];
  const rawKeep = flags["--keep-last-user"];
  if (!rawFetchFile || !out || rawKeep === undefined) usageError();
  const keepLastUser = Number(rawKeep);
  if (!Number.isInteger(keepLastUser)) usageError();
  return { rawFetchFile, keepLastUser, out };
}

function validateSliceInputs(userTurns, keepLastUser, rawFetchFile) {
  if (userTurns.length === 0) {
    fail(`${rawFetchFile} carries no user: turns to slice against`);
  }
  if (keepLastUser < 1) {
    fail(`--keep-last-user must be >= 1, got ${keepLastUser}`);
  }
}

// @keep-comment `caseLabel` reuses the exact `keepLastUser >= userTurnCount` comparison runSlice itself
// branches on to pick which of these two functions to call -- never a second, independently-invented
// comparison -- so the printed case letter can never drift from which function actually ran.
function writeFullPassthrough(text, keepLastUser, userTurnCount, out) {
  const totalBlocks = parseTurnBlocks(text);
  const alternation = checkAlternation(totalBlocks);
  if (!alternation.ok) fail(`the window about to be written to ${out} fails alternation: ${alternation.message}`);
  writeFileSync(out, text, "utf8");
  console.log(
    `Wrote the full window unchanged (K=${keepLastUser} >= ${userTurnCount} user: turn(s) present) to ${out}.`,
  );
  const caseLabel = keepLastUser >= userTurnCount ? "B" : "A";
  console.log(
    `user-turn-floor: R=${userTurnCount} K=${keepLastUser} case=${caseLabel} alternation=OK total-turns=${totalBlocks.length}`,
  );
  process.exit(0);
}

function writeSlicedWindow(lines, text, boundaryBlock, keepLastUser, userTurnCount, out) {
  const sliced = lines.slice(boundaryBlock.lineNo - 1).join("\n") + (text.endsWith("\n") ? "\n" : "");
  const slicedBlocks = parseTurnBlocks(sliced);
  const alternation = checkAlternation(slicedBlocks);
  if (!alternation.ok) fail(`the window about to be written to ${out} fails alternation: ${alternation.message}`);
  writeFileSync(out, sliced, "utf8");
  console.log(
    `Wrote ${keepLastUser} most-recent user: turn(s) and everything after (from line ${boundaryBlock.lineNo}) to ${out}.`,
  );
  const caseLabel = keepLastUser >= userTurnCount ? "B" : "A";
  console.log(
    `user-turn-floor: R=${userTurnCount} K=${keepLastUser} case=${caseLabel} alternation=OK total-turns=${slicedBlocks.length}`,
  );
  process.exit(0);
}

function runSlice(argv) {
  const { rawFetchFile, keepLastUser, out } = parseSliceArgs(argv);
  const text = readFileOrFail(rawFetchFile, "input");
  const lines = splitLines(text);
  const blocks = parseTurnBlocks(text);
  const userTurns = blocks.filter((b) => b.role === "user");
  validateSliceInputs(userTurns, keepLastUser, rawFetchFile);
  if (keepLastUser >= userTurns.length) {
    writeFullPassthrough(text, keepLastUser, userTurns.length, out);
  }
  const boundaryBlock = userTurns[userTurns.length - keepLastUser];
  writeSlicedWindow(lines, text, boundaryBlock, keepLastUser, userTurns.length, out);
}

function parseSpliceArgs(argv) {
  const { flags, positionals } = parseFlagsAndPositionals(argv, ["--out"]);
  const windowFile = positionals[0];
  const abstractsFile = positionals[1];
  const out = flags["--out"];
  if (!windowFile || !abstractsFile || !out) usageError();
  return { windowFile, abstractsFile, out };
}

const HEADER =
  'Convention: "user:" is the principal\'s own words, verbatim, byte-copied from the raw fetch. "agent:" is a ' +
  'cleaned, proposal-voiced abstract of the assistant\'s own turn, never a restriction on its own authority ' +
  "unless a later user: turn confirms it.";

function loadSpliceInputs(windowFile, abstractsFile) {
  const windowText = readFileOrFail(windowFile, "window");
  const abstractsText = readFileOrFail(abstractsFile, "abstracts");
  const windowBlocks = parseTurnBlocks(windowText);
  const alternation = checkAlternation(windowBlocks);
  if (!alternation.ok) fail(`${alternation.message} in ${windowFile}`);
  const abstractsBlocks = parseTurnBlocks(abstractsText);
  abstractsBlocks.forEach((b, i) => {
    if (b.role !== "agent") {
      fail(
        `${abstractsFile} carries a non-agent: block (turn ${i + 1}, starts: "${b.text.slice(0, 60)}") -- this ` +
          "file must contain ONLY agent: abstracts, in order",
      );
    }
  });
  return { windowBlocks, abstractsBlocks };
}

function checkCompressionInputMatch(windowBlocks, abstractsBlocks, windowFile, abstractsFile) {
  const windowAgentCount = windowBlocks.filter((b) => b.role === "agent").length;
  if (windowAgentCount !== abstractsBlocks.length) {
    fail(
      `COMPRESSION-INPUT MISMATCH: ${windowFile} carries ${windowAgentCount} agent: turn(s) but ${abstractsFile} ` +
        `carries ${abstractsBlocks.length} abstract(s) -- Step 4 must produce exactly one abstract per agent: ` +
        "turn, in order, never drop or duplicate one",
    );
  }
}

// @keep-comment parseTurnBlocks folds a blank line BETWEEN a block and the next marker into that block's
// own trailing lines, and formatTranscript (the real producer of every Step 1 window file) unconditionally
// emits one such blank line per turn -- so a real block.text already carries it. Strip it here so "\n\n"
// below is the ONLY source of inter-turn spacing (CRITICAL, code-review, 2026-08-30); a no-op on this
// file's own hand-authored fixtures, whose markers sit on adjacent lines with no trailing blank. @keep-comment
function stripTrailingBlankLines(text) {
  return text.replace(/\n+$/, "");
}

function buildSplicedPieces(windowBlocks, abstractsBlocks) {
  const pieces = [];
  let agentIdx = 0;
  let userCount = 0;
  for (const block of windowBlocks) {
    if (block.role === "user") {
      pieces.push(stripTrailingBlankLines(block.text));
      userCount++;
    } else {
      pieces.push(stripTrailingBlankLines(abstractsBlocks[agentIdx].text));
      agentIdx++;
    }
  }
  return { pieces, userCount };
}

function runSplice(argv) {
  const { windowFile, abstractsFile, out } = parseSpliceArgs(argv);
  const { windowBlocks, abstractsBlocks } = loadSpliceInputs(windowFile, abstractsFile);
  checkCompressionInputMatch(windowBlocks, abstractsBlocks, windowFile, abstractsFile);
  const { pieces, userCount } = buildSplicedPieces(windowBlocks, abstractsBlocks);
  const joined = pieces.join("\n\n");
  writeFileSync(out, HEADER + "\n\n" + joined + "\n", "utf8");
  // STAMP THE PROVENANCE SIDECAR. splice's byte-fidelity guarantee is a property of this tool, never of the
  // file it writes, and every downstream reader reads the file -> ./splice-provenance.mjs for the full
  // invariant and its honest bound.
  const provenance = writeProvenance(out, "assemble-cleaned-extract.mjs splice");
  console.log(
    `Wrote ${userCount} user: turn(s) (byte-copied) and ${abstractsBlocks.length} agent: abstract(s) ` +
      `(substituted) to ${out}.`,
  );
  console.log(`splice-provenance: sha256=${provenance.sha256} bytes=${provenance.bytes}`);
  process.exit(0);
}

function parseUserViewArgs(argv) {
  const { flags, positionals } = parseFlagsAndPositionals(argv, ["--out"]);
  const rawFetchFile = positionals[0];
  const out = flags["--out"];
  if (!rawFetchFile || !out) usageError();
  return { rawFetchFile, out };
}

// @keep-comment Each piece carries its own ordinal marker line ahead of the block's own UNCHANGED text -- never
// re-serialized, per this subcommand's own byte-fidelity contract (mirrors runSlice's own user: passthrough).
// Strip each block's own trailing blank line (the same parseTurnBlocks fold buildSplicedPieces already
// strips above) before joining with "\n\n" below -- otherwise a real formatTranscript-shaped fetch, where
// every block.text already ends in one blank line, doubles the spacing between every turn marker (MEDIUM,
// code-review CYCLE 1 HUNT, 2026-09-11). @keep-comment
function buildUserViewPieces(userTurns) {
  return userTurns.map(
    (block, i) => `[user turn ${i + 1} of ${userTurns.length}]\n${stripTrailingBlankLines(block.text)}`,
  );
}

function runUserView(argv) {
  const { rawFetchFile, out } = parseUserViewArgs(argv);
  const text = readFileOrFail(rawFetchFile, "input");
  const userTurns = parseTurnBlocks(text).filter((b) => b.role === "user");
  if (userTurns.length === 0) {
    fail(`${rawFetchFile} carries no user: turns to extract`);
  }
  writeFileSync(out, buildUserViewPieces(userTurns).join("\n\n"), "utf8");
  console.log(`Wrote ${userTurns.length} user: turn(s) (of ${userTurns.length} total) to ${out}.`);
  process.exit(0);
}

function main() {
  const [sub, ...rest] = process.argv.slice(2);
  if (sub === "slice") {
    runSlice(rest);
  } else if (sub === "splice") {
    runSplice(rest);
  } else if (sub === "user-view") {
    runUserView(rest);
  } else {
    usageError();
  }
}

const isSelf =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file:///${(process.argv[1] || "").replace(/\\/g, "/")}`;
if (isSelf) {
  main();
}
