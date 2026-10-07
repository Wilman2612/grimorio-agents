#!/usr/bin/env node
// @keep-comment extract-cleaner-finalize.mjs -- pure orchestration glue for grimorio.extract-cleaner's own
// SYNTHESIZE-onward half (CEO's script-orchestrates-one-LLM-call shape). Introduces NO new
// parsing/compression/harness logic --
// every mechanical step below is a spawnSync call onto an already-existing, unchanged script
// (assemble-cleaned-extract.mjs, extract-cleaner-cache.mjs, session-window.mjs, verify-cleaned-extract.mjs). The
// keepLastUser value is now determined mechanically at prepare time via the watermark, never left to agent
// judgment here. Retries on a harness FAIL are OWNED BY THE CALLING AGENT, never this script -- this script
// never loops back to splice itself.
//
// USAGE:
//   node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-finalize.mjs
//     [--abstract <one-line abstract>]... [--keep-last-user <K>] [--abstracts <path>] [--work-dir <dir>] [--out <path>]
//   --work-dir <dir>   default: tmp/extract-cleaner/<resolved session id>/ -- MUST be the SAME directory
//                      extract-cleaner-prepare.mjs already populated (raw-fetch.txt must already exist there).
//   --out <path>       default: <work-dir>/cleaned-extract.txt
//
// The direct --abstract API is the agent-facing path. --abstracts remains only for legacy deterministic tests.
// Exit 0 only when the harness (step f) PASSes.
// Exit 1 on: CLAUDE_CODE_SESSION_ID unset; raw-fetch.txt missing under --work-dir ("prepare was never run
// against this work-dir"); prepared.json missing under --work-dir (same message) or not valid JSON; a
// STALE-FETCH mismatch between prepared.json's own recorded raw-fetch.txt mtime and its current mtime (a
// re-fetch happened between Step 1 and Step 6 -- see the FRESHNESS/BINDING FOOTPRINT CHECK below); OUT-OF-BOUNDS
// --out refusal (before (a)); slice (a) failing; alternation=BROKEN sanity assertion (b); splice (d) failing;
// the independent refetch (e) failing; or the harness (f) failing. write-watermark (c) failing is NON-FATAL
// (relayed as a named finding, execution continues to (d)).

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, renameSync, unlinkSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseTurnBlocks } from "./verify-cleaned-extract.mjs";
import { readFileSync as __rfs } from "node:fs";
// @keep-comment -- the working-memory root lives in ONE place, .grimorio/scripts/refobl/skill-roots.json's
// `workRoot`. Read, never copied: it was the literal "tmp/" in 8 sites, which is the hand-kept-copy
// shape that file's own comment warns about.
const WORK_ROOT = JSON.parse(__rfs(new URL("../../../../.grimorio/scripts/refobl/skill-roots.json", import.meta.url), "utf8")).workRoot;

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SWEEP_ROOT = WORK_ROOT + "extract-cleaner";

function error(code, detail) {
  console.error(`Error [${code}]: ${detail}`);
  process.exit(1);
}

function retry(code, detail) {
  console.log(`Retry [${code}]: ${detail}`);
  process.exit(2);
}

function replaceAbstractsAtomically(abstractsPath, abstracts) {
  const stagedPath = `${abstractsPath}.next-${process.pid}`;
  try {
    writeFileSync(stagedPath, `${abstracts.map((abstract) => `agent: ${abstract}`).join("\n\n")}\n`, "utf8");
    renameSync(stagedPath, abstractsPath);
  } finally {
    if (existsSync(stagedPath)) unlinkSync(stagedPath);
  }
}

// Renders a path with forward slashes regardless of platform, for any string reaching stdout/stderr --
// Node's own fs/path calls accept either separator internally, but a backslash-containing path pasted into a
// Bash command by the calling agent is silently mishandled by Git Bash (wrong file, wrong directory, no
// error) -- this is exactly how a stray tmpextract-cleaner...abstracts.txt file appeared in a repo root once.
function toPosix(p) {
  return String(p).split(path.sep).join("/");
}

function parseFlags(argv, flagNames) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (flagNames.includes(arg)) {
      const value = argv[i + 1];
      if (value === undefined) error("MISSING_FLAG_VALUE", `${arg} is missing its value`);
      if (arg === "--abstract") {
        (flags[arg] ??= []).push(value);
      } else {
        flags[arg] = value;
      }
      i++;
    }
  }
  return flags;
}

function run(command, args) {
  return spawnSync(command, args, { encoding: "utf8" });
}

function main() {
  const argv = process.argv.slice(2);
  const flags = parseFlags(argv, ["--keep-last-user", "--abstracts", "--abstract", "--work-dir", "--out"]);
  if (flags["--abstract"] && flags["--abstracts"]) {
    error("MUTUALLY_EXCLUSIVE_INPUTS", "use either repeated --abstract values or legacy --abstracts <path>, never both");
  }

  if (!process.env.CLAUDE_CODE_SESSION_ID) {
    error(
      "MISSING_SESSION_ID",
      "CLAUDE_CODE_SESSION_ID is not set in this environment, so there is no session to read.\n" +
        "This is an environment defect, never something to work around by naming a session by hand.",
    );
  }
  const sessionId = process.env.CLAUDE_CODE_SESSION_ID;

  // Anchor on CLAUDE_PROJECT_DIR, not a bare process.cwd() -- mirrors extract-cleaner-cache.mjs's own
  // runSweepExpired (same rationale: process.cwd() alone is silently wrong the moment this tool is invoked
  // from anywhere other than the repo root, e.g. a worktree subshell).
  const workDir = flags["--work-dir"] || path.join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), "tmp", "extract-cleaner", sessionId);
  const rawFetchPath = path.join(workDir, "raw-fetch.txt");
  if (!existsSync(rawFetchPath)) {
    error(
      "PREPARE_NOT_RUN",
      `${toPosix(rawFetchPath)} does not exist -- prepare was never run against this work-dir (${toPosix(workDir)}).`,
    );
  }

  // Refuse a finalization whose prepared input was replaced after prepare ran.
  const preparedJsonPath = path.join(workDir, "prepared.json");
  if (!existsSync(preparedJsonPath)) {
    error(
      "PREPARE_NOT_RUN",
      `${toPosix(preparedJsonPath)} does not exist -- prepare was never run against this work-dir (${toPosix(workDir)}).`,
    );
  }
  let prepared;
  try {
    prepared = JSON.parse(readFileSync(preparedJsonPath, "utf8"));
  } catch (err) {
    error("INVALID_PREPARED_MANIFEST", `${toPosix(preparedJsonPath)} is not valid JSON: ${err.message}`);
  }
  const keepLastUserRaw = flags["--keep-last-user"] ?? prepared.keepLastUser;
  const abstractsPath = flags["--abstracts"] ?? prepared.abstractsPath ?? path.join(workDir, "abstracts.txt");
  if (keepLastUserRaw === undefined) {
    error("MISSING_KEEP_LAST_USER", "prepare did not provide keepLastUser and no --keep-last-user was supplied");
  }
  const keepLastUser = Number(keepLastUserRaw);
  if (!Number.isInteger(keepLastUser)) {
    error("INVALID_KEEP_LAST_USER", `--keep-last-user must be an integer, got ${keepLastUserRaw}`);
  }
  const currentRawFetchMtimeMs = statSync(rawFetchPath).mtimeMs;
  if (currentRawFetchMtimeMs !== prepared.rawFetchMtimeMs) {
    error(
      "STALE_FETCH",
      `raw-fetch.txt's own mtime no longer matches what prepare.mjs ` +
        `recorded at ${prepared.preparedAt} -- a re-fetch happened between prepare and finalization.`,
    );
  }

  const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const finalOutPath = flags["--out"] || prepared.finalOutPath || path.join(workDir, "cleaned-extract.txt");

  // OUT-OF-BOUNDS --out refusal: NEVER write anything outside tmp/extract-cleaner/ -- structurally
  // impossible by construction, not merely discouraged: refuse WHEN the resolved --out sits outside the one
  // boundary this script is ever allowed to write to.
  const boundary = path.resolve(projectRoot, DEFAULT_SWEEP_ROOT);
  const resolvedOutPath = path.resolve(projectRoot, finalOutPath);
  if (resolvedOutPath !== boundary && !resolvedOutPath.startsWith(boundary + path.sep)) {
    error("OUT_OF_BOUNDS_OUTPUT", `resolved path (${toPosix(resolvedOutPath)}) is outside the allowed boundary (${toPosix(boundary)})`);
  }

  const classifiedWindowPath = path.join(workDir, "classified-window.txt");
  const referencePath = path.join(workDir, "reference.txt");

  // ---------------------------------------------------------------------------------------------------
  // (a) slice
  // ---------------------------------------------------------------------------------------------------
  const sliceResult = run(process.execPath, [
    path.join(here, "assemble-cleaned-extract.mjs"),
    "slice",
    rawFetchPath,
    "--keep-last-user", String(keepLastUser),
    "--out", classifiedWindowPath,
  ]);
  if (sliceResult.status !== 0) {
    error(
      "SLICE_FAILED",
      `step "slice" failed.\nstdout:\n${sliceResult.stdout || "(empty)"}\n` +
        `stderr:\n${sliceResult.stderr || "(empty)"}`,
    );
  }
  const floorMatch = (sliceResult.stdout || "").match(
    /user-turn-floor: R=(\d+) K=(\d+) case=([AB]) alternation=(OK|BROKEN) total-turns=(\d+)/,
  );
  if (!floorMatch) {
    error("SLICE_OUTPUT_MALFORMED", `could not find the "user-turn-floor:" line in slice's own stdout:\n${sliceResult.stdout}`);
  }
  const R = Number(floorMatch[1]);
  const K = Number(floorMatch[2]);
  const caseLabel = floorMatch[3];
  const alternation = floorMatch[4];
  const totalTurns = Number(floorMatch[5]);

  // ---------------------------------------------------------------------------------------------------
  // (b) Structural sanity check
  // ---------------------------------------------------------------------------------------------------
  if (alternation === "BROKEN") {
    error(
      "BROKEN_ALTERNATION",
      `alternation=BROKEN reported by slice (R=${R} K=${K} case=${caseLabel} total-turns=${totalTurns}) -- ` +
        "this should be structurally unreachable since slice itself refuses to write a window it knows is broken; " +
        "a defect in the tool chain, never something to silently repair here.",
    );
  }

  // The API validates a whole replacement before changing the durable abstracts artifact.
  if (flags["--abstract"]) {
    const abstracts = flags["--abstract"];
    const expectedCount = parseTurnBlocks(readFileSync(classifiedWindowPath, "utf8"))
      .filter((block) => block.role === "agent").length;
    if (abstracts.length !== expectedCount) {
      retry("ABSTRACT_COUNT_MISMATCH", `expected ${expectedCount} abstracts, received ${abstracts.length}. Resubmit the complete set.`);
    }
    for (const [index, abstract] of abstracts.entries()) {
      if (!abstract.trim() || /[\r\n]/.test(abstract) || /^\s*(agent:|user:)/i.test(abstract)) {
        retry("INVALID_ABSTRACT", `abstract ${index + 1} must be non-empty, single-line, and have no role prefix. Resubmit the complete set.`);
      }
    }
    replaceAbstractsAtomically(abstractsPath, abstracts);
  }

  // ---------------------------------------------------------------------------------------------------
  // (c) write-watermark -- NON-FATAL
  // ---------------------------------------------------------------------------------------------------
  const writeWatermarkResult = run(process.execPath, [
    path.join(here, "extract-cleaner-cache.mjs"),
    "write-watermark",
    "--cache-dir", workDir,
    "--raw-fetch", rawFetchPath,
  ]);
  let writeWatermarkFinding = null;
  if (writeWatermarkResult.status !== 0) {
    writeWatermarkFinding =
      `write-watermark failed (non-fatal, continuing): stdout:\n${writeWatermarkResult.stdout || "(empty)"}\n` +
      `stderr:\n${writeWatermarkResult.stderr || "(empty)"}`;
  }

  // ---------------------------------------------------------------------------------------------------
  // (d) splice
  // ---------------------------------------------------------------------------------------------------
  const spliceResult = run(process.execPath, [
    path.join(here, "assemble-cleaned-extract.mjs"),
    "splice",
    classifiedWindowPath,
    abstractsPath,
    "--out", finalOutPath,
  ]);
  if (spliceResult.status !== 0) {
    error(
      "SPLICE_FAILED",
      `step "splice" failed.\nstdout:\n${spliceResult.stdout || "(empty)"}\n` +
        `stderr:\n${spliceResult.stderr || "(empty)"}`,
    );
  }

  // ---------------------------------------------------------------------------------------------------
  // (e) INDEPENDENT-REFETCH
  // ---------------------------------------------------------------------------------------------------
  const refetchResult = run(process.execPath, [
    path.join(here, "session-window.mjs"),
    "--user-count", "1",
    "--out", referencePath,
  ]);
  if (refetchResult.status !== 0) {
    error(
      "INDEPENDENT_REFETCH_FAILED",
      `step "INDEPENDENT-REFETCH" (session-window.mjs) failed.\n` +
        `stdout:\n${refetchResult.stdout || "(empty)"}\nstderr:\n${refetchResult.stderr || "(empty)"}`,
    );
  }

  // ---------------------------------------------------------------------------------------------------
  // (f) harness
  // ---------------------------------------------------------------------------------------------------
  const harnessResult = run(process.execPath, [
    path.join(here, "verify-cleaned-extract.mjs"),
    classifiedWindowPath,
    finalOutPath,
    referencePath,
  ]);
  const harnessPassed = harnessResult.status === 0;
  if (!harnessPassed) {
    retry(
      "CLEANED_EXTRACT_HARNESS",
      `the cleaned-extract check rejected the submitted abstracts.\n${harnessResult.stdout || "(empty)"}\n${harnessResult.stderr || "(empty)"}`,
    );
  }

  // ---------------------------------------------------------------------------------------------------
  // Consolidated report
  // ---------------------------------------------------------------------------------------------------
  if (writeWatermarkFinding) console.error(`NON-GATING: ${writeWatermarkFinding}`);
  console.log(`Success: cleaned extract written to ${toPosix(finalOutPath)}`);
  process.exit(0);
}

main();
