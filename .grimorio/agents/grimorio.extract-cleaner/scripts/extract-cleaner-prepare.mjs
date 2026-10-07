#!/usr/bin/env node
// @keep-comment extract-cleaner-prepare.mjs -- pure orchestration glue for grimorio.extract-cleaner's own
// prep half: autonomous fetch, watermark-anchored delta computation, and boundary-classified bundle assembly
// (CEO's script-orchestrates-one-LLM-call shape). Introduces NO new parsing/compression logic -- every
// mechanical step below is a spawnSync call onto an already-existing script. Crucially: this file computes the
// exact delta (keepLastUser) ITSELF via watermark hash lookup, not delegating it to the agent. A turn crosses
// the watermark exactly once, ever (transcript is append-only); therefore the script mechanically locates
// the prior run's anchor hash in this run's raw fetch, counts user: turns after it, and passes that count
// directly to slice -- no agent judgment involved anywhere. CRITICAL: watermark hashes are computed with
// normalized text (trailing blank lines stripped) so the hash is stable whether a turn is the last block in a
// fetch or a middle block (blank-line separator before next marker included). The agent's job: compress kept
// agent: turns into abstracts. This script does everything else deterministically. @keep-comment
//
// USAGE: node .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-prepare.mjs [--work-dir <dir>] [--out <bundle-path>]
//   --work-dir <dir>   default: tmp/extract-cleaner/<resolved session id>/ (created if absent)
//   --out <path>       default: <work-dir>/bundle.txt
//
// Exit 0 on success. Exit 1: CLAUDE_CODE_SESSION_ID unset, or any of the four orchestrated steps below
// (extract-cleaner-cache.mjs read-watermark / session-window.mjs / assemble-cleaned-extract.mjs user-view /
// assemble-cleaned-extract.mjs slice) exits non-zero -- this script always names which step failed and relays
// that step's own stderr/stdout verbatim.

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseTurnBlocks } from "./verify-cleaned-extract.mjs";
import { readFileSync as __rfs } from "node:fs";
// @keep-comment -- the working-memory root lives in ONE place, scripts/refobl/skill-roots.json's `workRoot`.
const WORK_ROOT = JSON.parse(__rfs(new URL("../../../../scripts/refobl/skill-roots.json", import.meta.url), "utf8")).workRoot;

const here = path.dirname(fileURLToPath(import.meta.url));

function fail(message) {
  console.error(message);
  process.exit(1);
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
      if (value === undefined) fail(`${arg} is missing its value`);
      flags[arg] = value;
      i++;
    }
  }
  return flags;
}

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function runStep(label, command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    fail(
      `extract-cleaner-prepare: step "${label}" failed (${toPosix(command)} ${args.map(toPosix).join(" ")}).\n` +
        `stdout:\n${result.stdout || "(empty)"}\n` +
        `stderr:\n${result.stderr || "(empty)"}`,
    );
  }
  return result;
}

function main() {
  const argv = process.argv.slice(2);
  const flags = parseFlags(argv, ["--work-dir", "--out"]);

  if (!process.env.CLAUDE_CODE_SESSION_ID) {
    fail(
      "extract-cleaner-prepare: CLAUDE_CODE_SESSION_ID is not set in this environment, so there is no session to read.\n" +
        "This is an environment defect, never something to work around by naming a session by hand.",
    );
  }
  const sessionId = process.env.CLAUDE_CODE_SESSION_ID;

  // Anchor on CLAUDE_PROJECT_DIR, not a bare process.cwd() -- mirrors extract-cleaner-cache.mjs's own
  // runSweepExpired (same rationale: process.cwd() alone is silently wrong the moment this tool is invoked
  // from anywhere other than the repo root, e.g. a worktree subshell).
  const workDir = flags["--work-dir"] || path.join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), WORK_ROOT, "extract-cleaner", sessionId);
  mkdirSync(workDir, { recursive: true });
  const outPath = flags["--out"] || path.join(workDir, "bundle.txt");

  const rawFetchPath = path.join(workDir, "raw-fetch.txt");
  const userTurnsPath = path.join(workDir, "user-turns.txt");
  const classifiedWindowPath = path.join(workDir, "classified-window.txt");

  // Step 1: Read watermark to determine if this is a cold start or a delta run
  const watermarkResult = runStep("extract-cleaner-cache.mjs read-watermark", process.execPath, [
    path.join(here, "extract-cleaner-cache.mjs"),
    "read-watermark",
    "--cache-dir", workDir,
  ]);

  let watermarkData;
  try {
    watermarkData = JSON.parse(watermarkResult.stdout);
  } catch (err) {
    fail(`extract-cleaner-prepare: read-watermark produced non-JSON stdout: ${err.message}\n${watermarkResult.stdout}`);
  }

  const watermarkFound = watermarkData.found;
  const userCount = watermarkFound ? 60 : 20;

  // Step 2: Fetch raw window with conditional --user-count
  runStep("session-window.mjs (raw fetch)", process.execPath, [
    path.join(here, "session-window.mjs"),
    "--user-count", String(userCount),
    "--out", rawFetchPath,
  ]);

  // Step 3: Extract user-view
  runStep("assemble-cleaned-extract.mjs user-view", process.execPath, [
    path.join(here, "assemble-cleaned-extract.mjs"),
    "user-view",
    rawFetchPath,
    "--out", userTurnsPath,
  ]);

  // Step 4: Parse raw fetch and compute keepLastUser
  const rawText = readFileSync(rawFetchPath, "utf8");
  const blocks = parseTurnBlocks(rawText);
  const allUserBlocks = blocks.filter((b) => b.role === "user");
  const R = allUserBlocks.length;

  let keepLastUser = R; // Default: keep all user turns (cold or watermark not found in raw fetch)
  let runType = "COLD";

  if (watermarkFound) {
    const lastTurnHash = watermarkData.lastTurnHash;
    // Find the block matching the watermark. Normalize text (strip trailing blank lines) before hashing
    // so the comparison works whether the block is last in the fetch (no trailing blank) or middle (blank separator included).
    const matchIdx = blocks.findIndex((b) => sha256(b.text.replace(/\n+$/, "")) === lastTurnHash);
    if (matchIdx !== -1) {
      // Watermark found in this fetch -- compute delta
      const userTurnsAfter = blocks.slice(matchIdx + 1).filter((b) => b.role === "user").length;
      if (userTurnsAfter > 0) {
        keepLastUser = userTurnsAfter;
        runType = "DELTA";
      } else {
        keepLastUser = 0;
        runType = "NOTHING-NEW";
      }
    }
    // If matchIdx === -1, watermark has scrolled out -- keep full window (keepLastUser = R)
  }

  // Step 5 & 6: Call slice and build bundle -- only if there is something new
  if (runType !== "NOTHING-NEW") {
    // Step 5: Call slice to produce classified-window
    const sliceResult = runStep("assemble-cleaned-extract.mjs slice", process.execPath, [
      path.join(here, "assemble-cleaned-extract.mjs"),
      "slice",
      rawFetchPath,
      "--keep-last-user", String(keepLastUser),
      "--out", classifiedWindowPath,
    ]);

    // Step 6: Build consolidated bundle from sliced window
    const classifiedText = readFileSync(classifiedWindowPath, "utf8");
    const classifiedBlocks = parseTurnBlocks(classifiedText);

    const userTurnsText = readFileSync(userTurnsPath, "utf8");
    const pieces = [userTurnsText.replace(/\n+$/, "")];

    let agentTurnCount = 0;
    for (const block of classifiedBlocks) {
      if (block.role === "agent") {
        // Always use raw text for agent turns, no HIT/MISS distinction
        pieces.push(`[agent turn ${agentTurnCount}]\n${block.text}`);
        agentTurnCount++;
      }
    }

    writeFileSync(outPath, pieces.join("\n\n") + "\n", "utf8");
  }

  // The manifest is the hand-off contract between the two deterministic scripts. The
  // agent receives only the bundle pointer; it never carries paths or output configuration into finalize.
  const preparedAt = new Date().toISOString();
  const rawFetchMtimeMs = statSync(rawFetchPath).mtimeMs;
  const abstractsPath = path.join(workDir, "abstracts.txt");
  const finalOutPath = path.join(workDir, "cleaned-extract.txt");
  writeFileSync(
    path.join(workDir, "prepared.json"),
    JSON.stringify({
      preparedAt,
      rawFetchMtimeMs,
      keepLastUser,
      abstractsPath,
      finalOutPath,
    }, null, 2),
    "utf8",
  );

  console.log(`RUN-TYPE=${runType}`);
  if (runType !== "NOTHING-NEW") {
    console.log(`BUNDLE=${toPosix(outPath)}`);
  }
  process.exit(0);
}

main();
