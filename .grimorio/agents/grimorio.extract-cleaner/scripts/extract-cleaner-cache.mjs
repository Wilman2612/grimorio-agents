#!/usr/bin/env node
// @keep-comment extract-cleaner-cache.mjs — mirrors scripts/assemble-cleaned-extract.mjs's own multi-
// subcommand shape (a small, deterministic Node script the Haiku-tier grimorio.extract-cleaner invokes via
// Bash, doing mechanical work the model should never do inline). The watermark mechanism persists a single
// anchor — the SHA-256 hash of the last turn ever handed out in a given session — so each run can mechanically
// compute its own delta against a prior run, without the agent judging semantic boundaries. The transcript is
// append-only: a turn's raw text never changes once written, so a past turn's hash is a stable, permanent key.
// CRITICAL: block text is normalized (trailing blank lines stripped) before hashing, because a turn's own .text
// differs depending on whether it is the last block in a fetch (no trailing blank) or a middle block (blank-line
// separator before next marker included) — only the content up to the last non-blank line is invariant.
// A watermark is read at the start of prepare and written at the end of finalize; a read always succeeds
// (absence is a normal cold-start state, never an error); a write always updates the stored hash to reflect
// the session's newest turn, so subsequent runs correctly anchor against the latest boundary. @keep-comment
//
// USAGE:
//   node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-cache.mjs read-watermark --cache-dir <dir>
//   node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-cache.mjs write-watermark --cache-dir <dir> --raw-fetch <path>
//   node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-cache.mjs sweep-expired [--max-age-days <N>] [--root <path>]
//
// Exit 0 on every NORMAL outcome of read-watermark/write-watermark/sweep-expired (found or not found on read,
// successful write or nothing-to-sweep are all normal, never errors) -- only a genuine I/O or parse failure
// exits non-zero. Exit 2 is a USAGE error (malformed invocation, or sweep-expired's own --root safety refusal
// below), mirroring assemble-cleaned-extract.mjs's own usageError-vs-FAIL convention.
// @keep-comment

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { parseTurnBlocks } from "./verify-cleaned-extract.mjs";
import { readFileSync as __rfs } from "node:fs";
// @keep-comment -- the working-memory root lives in ONE place, scripts/refobl/skill-roots.json's
// `workRoot`. Read, never copied: it was the literal "tmp/" in 8 sites, which is the hand-kept-copy
// shape that file's own comment warns about.
const WORK_ROOT = JSON.parse(__rfs(new URL("../../../../scripts/refobl/skill-roots.json", import.meta.url), "utf8")).workRoot;

// @keep-comment The retention window is a single named constant so a future pass can change it without
// reading the rest of this file. WHY 7: the CEO left the exact number open (7 or 15, "I don't know,
// something like that" -- translated) because this does not run often enough to matter much. 7 is chosen as
// the lower, more-conservative end of his own offered range because this cache/output data has near-zero
// value across a SESSION boundary by design -- the cache is keyed to one specific session id and is useless
// the moment that session ends, scratch by definition, never archival -- so a shorter default errs toward
// hygiene while still leaving a full week for anyone to inspect a recent run's own artifacts before they
// vanish. @keep-comment
export const EXTRACT_CLEANER_RETENTION_DAYS = 7;

const DEFAULT_SWEEP_ROOT = WORK_ROOT + "extract-cleaner";

const USAGE =
  "usage: node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-cache.mjs read-watermark --cache-dir <dir>\n" +
  "       node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-cache.mjs write-watermark --cache-dir <dir> --raw-fetch <path>\n" +
  "       node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-cache.mjs sweep-expired [--max-age-days <N>] [--root <path>]";

function usageError(message) {
  if (message) console.error(message);
  console.error(USAGE);
  process.exit(2);
}

// @keep-comment fail() prints to STDOUT with a "FAIL: " prefix and exits 1 -- this mirrors the ACTUAL,
// verified-live behavior of scripts/assemble-cleaned-extract.mjs's and scripts/verify-cleaned-extract.mjs's
// own fail() (both console.log, not console.error), the two files this tool's own authoring brief named as
// "this directory's own established script convention" while describing it (imprecisely) as a stderr
// message. Mirroring the named exemplars' REAL behavior, not the paraphrase, is the deliberate choice here --
// recorded once, here, rather than silently diverging from what the brief actually pointed at. @keep-comment
function fail(message) {
  console.log(`FAIL: ${message}`);
  process.exit(1);
}

function readFileOrFail(filePath, label) {
  if (!existsSync(filePath)) fail(`${label} file not found: ${filePath}`);
  return readFileSync(filePath, "utf8");
}

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

// Parse `--flag value` pairs from argv. Every flag here is named, never positional.
function parseFlags(argv, flagNames) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (flagNames.includes(arg)) {
      const value = argv[i + 1];
      if (value === undefined) usageError(`${arg} is missing its value`);
      flags[arg] = value;
      i++;
    }
  }
  return flags;
}

// ---------------------------------------------------------------------------------------------------------
// read-watermark
// ---------------------------------------------------------------------------------------------------------

function parseReadWatermarkArgs(argv) {
  const flags = parseFlags(argv, ["--cache-dir"]);
  const cacheDir = flags["--cache-dir"];
  if (!cacheDir) usageError();
  return { cacheDir };
}

function runReadWatermark(argv) {
  const { cacheDir } = parseReadWatermarkArgs(argv);
  const watermarkPath = path.join(cacheDir, "watermark.json");
  if (!existsSync(watermarkPath)) {
    console.log(JSON.stringify({ found: false }));
    process.exit(0);
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(watermarkPath, "utf8"));
  } catch (err) {
    fail(`${watermarkPath} is not valid JSON: ${err.message}`);
  }
  if (!parsed || typeof parsed.lastTurnHash !== "string" || (parsed.lastTurnRole !== "user" && parsed.lastTurnRole !== "agent")) {
    fail(`${watermarkPath} does not carry the expected {lastTurnHash, lastTurnRole, writtenAt} shape`);
  }
  console.log(JSON.stringify({ found: true, lastTurnHash: parsed.lastTurnHash, lastTurnRole: parsed.lastTurnRole }));
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------------------
// write-watermark
// ---------------------------------------------------------------------------------------------------------

function parseWriteWatermarkArgs(argv) {
  const flags = parseFlags(argv, ["--cache-dir", "--raw-fetch"]);
  const cacheDir = flags["--cache-dir"];
  const rawFetch = flags["--raw-fetch"];
  if (!cacheDir || !rawFetch) usageError();
  return { cacheDir, rawFetch };
}

function runWriteWatermark(argv) {
  const { cacheDir, rawFetch } = parseWriteWatermarkArgs(argv);
  const rawText = readFileOrFail(rawFetch, "raw-fetch");
  const blocks = parseTurnBlocks(rawText);
  if (blocks.length === 0) {
    fail(`${rawFetch} contains no turn blocks -- nothing to anchor on`);
  }
  // Anchor on the last USER block, never the last block: a user turn is immutable once fetched, while the
  // trailing agent turn is the main loop's own in-progress turn and keeps growing after this hash is taken.
  const lastBlock = [...blocks].reverse().find((b) => b.role === "user") || blocks[blocks.length - 1];
  const lastTurnHash = sha256(lastBlock.text.replace(/\n+$/, ""));
  mkdirSync(cacheDir, { recursive: true });
  const watermarkPath = path.join(cacheDir, "watermark.json");
  writeFileSync(
    watermarkPath,
    JSON.stringify({ lastTurnHash, lastTurnRole: lastBlock.role, writtenAt: new Date().toISOString() }, null, 2),
    "utf8",
  );
  console.log(`Wrote watermark to ${watermarkPath} (lastTurnRole=${lastBlock.role}, hash ${lastTurnHash.slice(0, 12)}...).`);
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------------------
// sweep-expired
// ---------------------------------------------------------------------------------------------------------

function parseSweepArgs(argv) {
  const flags = parseFlags(argv, ["--max-age-days", "--root"]);
  const maxAgeDays = flags["--max-age-days"] !== undefined ? Number(flags["--max-age-days"]) : EXTRACT_CLEANER_RETENTION_DAYS;
  if (!Number.isFinite(maxAgeDays) || maxAgeDays < 0) usageError(`--max-age-days must be a non-negative number, got ${flags["--max-age-days"]}`);
  const root = flags["--root"] !== undefined ? flags["--root"] : DEFAULT_SWEEP_ROOT;
  return { maxAgeDays, root };
}

// Recursively find the newest mtime among every FILE under dirPath (never a directory's own mtime, which a
// file write inside it does not always bump on every platform) -- falls back to the directory's own mtime
// only when it holds no files at all (an empty session directory).
function newestMtimeUnder(dirPath) {
  let newest = null;
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const sub = newestMtimeUnder(full);
      if (sub !== null && (newest === null || sub > newest)) newest = sub;
    } else {
      const mtime = statSync(full).mtimeMs;
      if (newest === null || mtime > newest) newest = mtime;
    }
  }
  return newest === null ? statSync(dirPath).mtimeMs : newest;
}

function runSweepExpired(argv) {
  const { maxAgeDays, root } = parseSweepArgs(argv);

  // @keep-comment Anchor on CLAUDE_PROJECT_DIR, not a bare process.cwd() -- matching the sibling hook's own
  // convention (spawn-verbatim-origin-gate.cjs's own hasElementThree: `process.env.CLAUDE_PROJECT_DIR ||
  // "."`), code-review FINDING-04. process.cwd() alone is silently wrong the moment this tool is invoked
  // from anywhere other than the repo root (a worktree subshell, a differently-cwd'd caller): it would
  // target (or refuse) the WRONG tmp/extract-cleaner rather than the repo's own real one. CLAUDE_PROJECT_DIR
  // is set by the harness to the actual project root regardless of the invoking shell's own cwd;
  // process.cwd() is kept only as the fallback for a bare `node` invocation outside that harness (e.g. this
  // file's own selftest), where no such env var exists. @keep-comment
  const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();

  // NEVER touch anything outside tmp/extract-cleaner/ -- structurally impossible by construction, not merely
  // discouraged: refuse (usage error, exit 2) WHEN the resolved --root sits outside the one boundary this
  // tool is ever allowed to sweep, even though the default is the only value any caller in this repo ever
  // passes.
  const boundary = path.resolve(projectRoot, DEFAULT_SWEEP_ROOT);
  const resolvedRoot = path.resolve(projectRoot, root);
  if (resolvedRoot !== boundary && !resolvedRoot.startsWith(boundary + path.sep)) {
    usageError(`--root (${resolvedRoot}) resolves outside the only allowed boundary (${boundary}) -- refusing`);
  }

  if (!existsSync(resolvedRoot)) {
    process.exit(0); // Nothing to sweep -- silent, per this tool's own "nothing to delete" convention.
  }

  const ageMsFloor = maxAgeDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const entries = readdirSync(resolvedRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue; // Only per-session subdirectories are this tool's own concern.
    const sessionDir = path.join(resolvedRoot, entry.name);
    const newest = newestMtimeUnder(sessionDir);
    const ageDays = (now - newest) / (24 * 60 * 60 * 1000);
    if (now - newest > ageMsFloor) {
      rmSync(sessionDir, { recursive: true, force: true });
      console.log(`Deleted ${sessionDir} (age: ${ageDays.toFixed(1)} days)`);
    }
  }
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------------------

function main() {
  const [sub, ...rest] = process.argv.slice(2);
  if (sub === "read-watermark") {
    runReadWatermark(rest);
  } else if (sub === "write-watermark") {
    runWriteWatermark(rest);
  } else if (sub === "sweep-expired") {
    try {
      runSweepExpired(rest);
    } catch (err) {
      fail(`sweep-expired internal error: ${err.message}`);
    }
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
