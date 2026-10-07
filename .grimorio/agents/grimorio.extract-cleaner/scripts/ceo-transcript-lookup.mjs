#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import readline from "readline";
import {
  ORIGIN_QUEUED_COMMAND,
  EXIT_NO_PRINCIPAL_TURN,
  isLabelledNonPrincipal,
  originOf,
  originVerdict,
  formatOriginTally,
  formatRefusal,
} from "./turn-origin.mjs";

// The seven synthetic-tag markers treated as noise. SECONDARY to the `turnOrigin` label (./turn-origin.mjs):
// reached for a record's own role only when that record carries no `turnOrigin` field at all.
const NOISE_TAGS = [
  "<local-command-caveat>",
  "<command-name>",
  "<local-command-stdout>",
  "<local-command-stderr>",
  "<ide_opened_file>",
  "<ide_selection>",
  "<task-notification>",
];


/**
 * Classify assistant lines — extract text and tool-use labels.
 */
function classifyAssistantLine(obj) {
  if (!obj.message || !obj.message.content) {
    return { kind: "skip", text: "" };
  }
  const content = obj.message.content;
  if (!Array.isArray(content)) {
    return { kind: "skip", text: "" };
  }
  const textBlocks = content.filter((block) => block.type === "text");
  let text = textBlocks.map((block) => block.text || "").join("\n\n");
  if (text === "") {
    text = toolUseLabel(content);
  }
  if (text === "") {
    return { kind: "skip", text: "" };
  }
  // Skip system/API error lines recorded as assistant turns (e.g. an OAuth
  // expiry mid-session) — they are not real agent output, and left in place they
  // wedge two real turns apart so mergeConsecutiveSameRole cannot collapse a
  // duplicated user turn around them, malforming the alternation.
  if (SYSTEM_ERROR_RE.test(text.trim())) {
    return { kind: "skip", text: "" };
  }
  return { kind: "assistant", text };
}

/** Assistant "turns" that are really transport/auth/system errors, never agent output. */
const SYSTEM_ERROR_RE =
  /^(Failed to authenticate|OAuth session expired|API Error|Request timed out|could not be refreshed|Prompt is too long)/i;

/**
 * Build the "[used tool: ...]" label from any tool_use blocks. Empty string
 * when there are none.
 */
function toolUseLabel(content) {
  const toolUseBlocks = content.filter((block) => block.type === "tool_use");
  if (toolUseBlocks.length === 0) {
    return "";
  }
  const toolNames = toolUseBlocks.map((block) => block.name).join(", ");
  return `[used tool: ${toolNames}]`;
}

/**
 * Compute facts about user content for noise filtering.
 */
function computeUserContentFacts(content) {
  if (typeof content === "string") {
    return { text: content, hasToolResult: false, isLaunchingSkill: false };
  }
  if (!Array.isArray(content)) {
    return { text: "", hasToolResult: false, isLaunchingSkill: false };
  }
  const hasToolResult = content.some((block) => block.type === "tool_result");
  const textBlocks = content.filter((block) => block.type === "text");
  const isLaunchingSkill = isLaunchingSkillArray(textBlocks, content.length);
  const text = filteredUserText(textBlocks);
  return { text, hasToolResult, isLaunchingSkill };
}

/**
 * True WHEN the array is made of ONLY text blocks AND their combined text
 * starts with a skill-launch marker.
 */
function isLaunchingSkillArray(textBlocks, totalBlockCount) {
  if (textBlocks.length === 0 || textBlocks.length !== totalBlockCount) {
    return false;
  }
  const combined = textBlocks.map((b) => (b.text || "").trim()).join("\n");
  return (
    combined.startsWith("Base directory for this skill:") ||
    combined.startsWith("Launching skill:")
  );
}

/**
 * Concatenate every text block's own text, EXCLUDING any block that is
 * itself one of the seven noise-tag markers.
 */
function filteredUserText(textBlocks) {
  return textBlocks
    .filter((block) => !isNoiseTag((block.text || "").trim()))
    .map((block) => block.text || "")
    .join("\n\n");
}

/** True WHEN text starts with one of the seven noise-tag markers. */
function isNoiseTag(text) {
  return NOISE_TAGS.some((tag) => text.startsWith(tag));
}

/**
 * Classify user lines — apply noise filters and return text.
 */
function classifyUserLine(obj) {
  if (!obj.message || obj.message.content === undefined) {
    return { kind: "skip", text: "" };
  }
  // PRIMARY TEST, before any text is looked at: a labelled non-principal record is never a `user:` turn,
  // however ordinary its text reads. This is the clause that stops a subagent hand-back wearing his label.
  if (isLabelledNonPrincipal(obj)) {
    return { kind: "skip", text: "", origin: obj.turnOrigin };
  }
  const origin = originOf(obj);
  const facts = computeUserContentFacts(obj.message.content);
  if (facts.hasToolResult || facts.isLaunchingSkill) {
    return { kind: "skip", text: "", origin };
  }
  const trimmedText = facts.text.trim();
  if (isNoiseTag(trimmedText) || trimmedText === "") {
    return { kind: "skip", text: "", origin };
  }
  return { kind: "user", text: trimmedText, origin };
}

/**
 * @keep-comment
 * A queued command — the CEO typing while an agent is still working. Its own text lives in
 * `attachment.prompt`, an array of blocks shaped like a message's content, never in `message.content`.
 * Only `attachment.type === "queued_command"` qualifies: the same `attachment` entry type carries
 * other, genuinely synthetic things, and admitting those would put words in his mouth — the opposite
 * failure to the one this function exists to fix.
 */
function classifyQueuedCommand(obj) {
  const attachment = obj.attachment;
  if (!attachment || attachment.type !== "queued_command") {
    return { kind: "skip", text: "" };
  }
  const blocks = Array.isArray(attachment.prompt) ? attachment.prompt : [];
  const text = filteredUserText(blocks.filter((block) => block && block.type === "text")).trim();
  if (text === "" || isNoiseTag(text)) {
    return { kind: "skip", text: "", origin: ORIGIN_QUEUED_COMMAND };
  }
  return { kind: "user", text, origin: ORIGIN_QUEUED_COMMAND };
}

/**
 * Classify a single parsed JSONL line object.
 * Returns { kind: "user" | "assistant" | "skip", text: string }
 */
export function classifyLine(obj) {
  // @keep-comment
  // A QUEUED COMMAND is a real user turn, and dropping it was this tool's most damaging defect.
  // When the CEO types while an agent is still working, Claude Code does not record his words as a
  // `user` entry at all — it records a separate `attachment` entry whose own `attachment.type` is
  // "queued_command" and whose text sits in `attachment.prompt`. Every such entry failed the type
  // check below and was discarded in silence. Measured on this repo's own live session: real
  // instructions — a correction to a whole working pattern among them — never reached the extract,
  // while the extract still passed its byte-fidelity harness, because the harness compares against
  // the same filtered fetch. That is why the loss was invisible from inside.
  if (obj.type === "attachment") {
    return classifyQueuedCommand(obj);
  }
  if (obj.type !== "user" && obj.type !== "assistant") {
    return { kind: "skip", text: "" };
  }
  if (obj.isSidechain === true) {
    return { kind: "skip", text: "" };
  }
  // Skip session-compaction summaries (FINDING-01 fix) — a synthetic,
  // system-generated third-person essay, never the CEO's own words.
  if (obj.isCompactSummary === true) {
    return { kind: "skip", text: "" };
  }
  if (obj.type === "assistant") {
    return classifyAssistantLine(obj);
  }
  return classifyUserLine(obj);
}


/**
 * Merge consecutive lines with the same role (FINDING-02 fix).
 * Ensures alternating user/agent turns in the output.
 */
function mergeConsecutiveSameRole(turns) {
  const merged = [];
  for (const turn of turns) {
    const last = merged[merged.length - 1];
    if (last && last.role === turn.role) {
      last.text += "\n\n" + turn.text;
      // A merged turn carries EVERY source record's own origin, never just the first — two consecutive
      // records that merge into one turn can disagree (a queued command folded onto a labelled one), and
      // dropping either would under-report the census.
      if (turn.origin !== undefined && !last.origins.includes(turn.origin)) last.origins.push(turn.origin);
    } else {
      // `sourceIndex` is the index, in the scanned object list, of this turn's FIRST source record — the
      // only thing that lets `censusForWindow` reconstruct which span of the transcript a window was cut
      // from. Carried here because this merge is where the 1:1 record-to-turn correspondence is lost.
      merged.push({
        role: turn.role,
        text: turn.text,
        sourceIndex: turn.sourceIndex,
        origins: turn.origin === undefined ? [] : [turn.origin],
      });
    }
  }
  return merged;
}

/** Classify every object once, keeping each surviving turn's own source index and harness origin. */
function classifiedTurns(objs) {
  const turns = [];
  objs.forEach((obj, index) => {
    const classified = classifyLine(obj);
    if (classified.kind === "skip") return;
    turns.push({ role: classified.kind, text: classified.text, origin: classified.origin, sourceIndex: index });
  });
  return turns;
}

/**
 * Extract the last N qualifying turns, oldest of the window first.
 */
export function extractTurns(objs, count) {
  const merged = mergeConsecutiveSameRole(classifiedTurns(objs));
  return merged.slice(Math.max(0, merged.length - count));
}

/**
 * @keep-comment
 * Select turns by USER-TURN count, not total-turn count: walk the merged,
 * alternating turn list backward from the end, counting only role==="user"
 * turns, and stop once `userCount` of them have been seen (or the start of
 * the list is reached). Returns the slice from that stopping index to the
 * end — every interleaved assistant turn in that span comes along for free,
 * so alternation is never broken by this selection. Oldest-of-the-selected-
 * window first, matching extractTurns's own existing ordering contract.
 */
export function extractTurnsByUserCount(objs, userCount) {
  const merged = mergeConsecutiveSameRole(classifiedTurns(objs));
  let seenUser = 0;
  let startIdx = merged.length;
  for (let i = merged.length - 1; i >= 0; i--) {
    startIdx = i;
    if (merged[i].role === "user") {
      seenUser++;
      if (seenUser >= userCount) break;
    }
  }
  return merged.slice(startIdx);
}

/**
 * Format the turns into a human-readable string.
 */
export function formatTranscript(turns) {
  if (turns.length === 0) {
    return "";
  }
  const lines = [];
  for (const turn of turns) {
    const label = turn.role === "assistant" ? "agent" : turn.role;
    lines.push(`${label}: ${turn.text}`);
    lines.push("");
  }
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return lines.join("\n");
}

/**
 * Resolve the transcript path for the given session_id.
 */
function resolveTranscriptPath(sessionId, homeDir) {
  const cwdSlug = process.cwd().replace(/[:\\\/]/g, "-");
  const tryPath = path.join(homeDir, cwdSlug, `${sessionId}.jsonl`);
  if (fs.existsSync(tryPath)) {
    return tryPath;
  }
  return scanForTranscript(sessionId, homeDir);
}

/**
 * FALLBACK: scan every directory under homeDir for <sessionId>.jsonl.
 */
function scanForTranscript(sessionId, homeDir) {
  try {
    const entries = fs.readdirSync(homeDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const candidatePath = path.join(homeDir, entry.name, `${sessionId}.jsonl`);
      if (fs.existsSync(candidatePath)) {
        return candidatePath;
      }
    }
  } catch {
    // Directory not readable, fall through to null.
  }
  return null;
}

/**
 * Parse CLI arguments.
 */
function parseArgs(argv) {
  const flagKeys = { "--count": "count", "--user-count": "userCount", "--home": "homeDir", "--out": "outFile" };
  const out = {
    sessionId: null,
    count: 5,
    userCount: null,
    homeDir: path.join(os.homedir(), ".claude", "projects"),
    outFile: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const key = flagKeys[argv[i]];
    if (key && i + 1 < argv.length) {
      out[key] = (key === "count" || key === "userCount") ? parseInt(argv[i + 1], 10) : argv[i + 1];
      i++;
    } else if (!argv[i].startsWith("--")) {
      out.sessionId = argv[i];
    }
  }
  // SELF-RESOLUTION (CEO ruling, 2026-09-07): a caller that must name the session on the command line is
  // leaking this tool's own internals into its interface. The session id is already in this process's own
  // environment, so the tool reads it itself and the invocation stays about WHAT is wanted, never about the
  // machinery. A positional id remains accepted, so every existing caller and selftest keeps working.
  if (!out.sessionId) out.sessionId = process.env.CLAUDE_CODE_SESSION_ID || null;
  return out;
}

/** Print the one-line usage message to stderr. */
function printUsage() {
  console.error(
    "Usage: node .grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs <session_id> [--count N] [--user-count N] [--home <dir>] [--out <file>]"
  );
}

/**
 * Validate and clamp count to max 20 (FINDING-05 fix). Exits 1 on a
 * non-integer value instead of silently falling through to NaN.
 */
function clampCount(rawCount) {
  if (!Number.isInteger(rawCount)) {
    printUsage();
    process.exit(1);
  }
  if (rawCount > 20) {
    console.error(`Requested ${rawCount} turns, clamped to the 20 hard cap.`);
    return 20;
  }
  return rawCount;
}

/**
 * Validate and clamp userCount to max 20. Exits 1 on a non-integer value
 * instead of silently falling through to NaN.
 */
function clampUserCount(rawUserCount) {
  if (!Number.isInteger(rawUserCount)) {
    printUsage();
    process.exit(1);
  }
  if (rawUserCount > 20) {
    console.error(`Requested ${rawUserCount} user turns, clamped to the 20 hard cap.`);
    return 20;
  }
  return rawUserCount;
}

/**
 * Stream-parse the transcript file.
 */
async function streamParse(transcriptPath) {
  return new Promise((resolve, reject) => {
    const objs = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(transcriptPath),
    });
    rl.on("line", (line) => {
      try {
        objs.push(JSON.parse(line));
      } catch {
        // Silently skip unparseable lines.
      }
    });
    rl.on("close", () => resolve(objs));
    rl.on("error", reject);
  });
}

/**
 * Write output to file or stdout.
 */
function writeOutput(formatted, turnCount, outFile) {
  if (outFile) {
    // A fresh `git worktree add` has no tmp/ of its own — it is gitignored, so it is never checked out —
    // and an agent doing its first fetch there died on ENOENT before this line existed. Measured, not
    // hypothetical: it happened on develop's own worktree while landing this same change.
    fs.mkdirSync(path.dirname(path.resolve(outFile)), { recursive: true });
    fs.writeFileSync(outFile, formatted, "utf8");
    console.log(`Wrote ${turnCount} turns (~${formatted.length} chars) to ${outFile}`);
  } else {
    console.log(formatted);
  }
}

/**
 * Main entry point.
 */
async function main() {
  const { sessionId, count: rawCount, userCount: rawUserCount, homeDir, outFile } = parseArgs(process.argv.slice(2));
  if (!sessionId) {
    printUsage();
    process.exit(1);
  }
  const transcriptPath = resolveTranscriptPath(sessionId, homeDir);
  if (!transcriptPath) {
    console.error(`No transcript found for session ${sessionId} under ${homeDir}`);
    process.exit(1);
  }
  const objs = await streamParse(transcriptPath);
  let turns;
  if (rawUserCount !== null) {
    const clampedUserCount = clampUserCount(rawUserCount);
    turns = extractTurnsByUserCount(objs, clampedUserCount);
  } else {
    const count = clampCount(rawCount);
    turns = extractTurns(objs, count);
    if (turns.length < count) {
      console.error(`Only ${turns.length} turns available in the transcript.`);
    }
  }
  // ALWAYS report the census, on BOTH paths — a produced window and a refused one. The report is owed
  // whichever way the verdict falls: "it held 16 of his turns" and "it held none of his" are the same
  // obligation, and only printing it on success would hide exactly the case worth printing.
  const verdict = originVerdict(objs, turns, classifyLine);
  console.error(formatOriginTally(verdict));
  if (verdict.refuse) {
    console.error(formatRefusal(verdict));
    process.exit(EXIT_NO_PRINCIPAL_TURN);
  }
  writeOutput(formatTranscript(turns), turns.length, outFile);
  process.exit(0);
}

// Guard main so importing this file's exports never also runs it. Windows'
// own path separators mean the plain `file://${process.argv[1]}` form does
// not always match, so both forms are checked.
const isSelf =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file:///${(process.argv[1] || "").replace(/\\/g, "/")}`;
if (isSelf) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
