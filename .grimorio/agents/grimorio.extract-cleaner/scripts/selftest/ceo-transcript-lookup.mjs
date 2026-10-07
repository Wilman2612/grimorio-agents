#!/usr/bin/env node
// Native classifier and window-selection coverage for the transcript lookup.

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyLine, extractTurns, extractTurnsByUserCount, formatTranscript } from "../ceo-transcript-lookup.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const tool = path.resolve(here, "../ceo-transcript-lookup.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "ceo-transcript-lookup-"));
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) console.log(`PASS: ${label}`);
  else { failures += 1; console.log(`FAIL: ${label}${detail ? ` -- ${detail}` : ""}`); }
}

function user(text, extra = {}) { return { type: "user", message: { role: "user", content: text }, ...extra }; }
function assistant(text, extra = {}) { return { type: "assistant", message: { role: "assistant", content: [{ type: "text", text }] }, ...extra }; }
function run(home, ...args) {
  return spawnSync(process.execPath, [tool, ...args], { encoding: "utf8", env: { ...process.env, HOME: home, USERPROFILE: home } });
}

try {
  check("real user content is admitted verbatim", classifyLine(user("hello there")).text === "hello there");
  check("sidechain records are ignored", classifyLine(user("hidden", { isSidechain: true })).kind === "skip");
  check("skill launch chatter is ignored", classifyLine({ type: "user", message: { content: [{ type: "text", text: "Launching skill: grimorio" }] } }).kind === "skip");
  check("tag-only user records are ignored", classifyLine(user("<command-name>Read</command-name>")).kind === "skip");
  check("tool-result carrying user records are ignored", classifyLine({ type: "user", message: { content: [{ type: "tool_result", content: "noise" }] } }).kind === "skip");
  check("task notifications are ignored", classifyLine(user("<task-notification>background</task-notification>")).kind === "skip");
  check("compaction summaries are ignored", classifyLine(user("summary", { isCompactSummary: true })).kind === "skip");
  check("tool-only assistant records receive a label", classifyLine({ type: "assistant", message: { content: [{ type: "tool_use", name: "Read" }] } }).text === "[used tool: Read]");
  check("assistant thinking blocks are ignored", classifyLine({ type: "assistant", message: { content: [{ type: "thinking", thinking: "internal" }, { type: "text", text: "external" }] } }).text === "external");
  check("transport errors are ignored", classifyLine(assistant("OAuth session expired")).kind === "skip");
  check("a queued command is a real user turn", classifyLine({ type: "attachment", attachment: { type: "queued_command", prompt: [{ type: "text", text: "do the next thing" }] } }).text === "do the next thing");
  check("non-queued attachments stay ignored", classifyLine({ type: "attachment", attachment: { type: "other", prompt: [{ type: "text", text: "hook chatter" }] } }).kind === "skip");

  const turns = [user("one"), assistant("answer one"), user("two"), assistant("answer two"), user("three"), assistant("answer three")];
  const lastFour = extractTurns(turns, 4);
  check("total-turn selection retains the requested tail", lastFour.length === 4 && lastFour[0].text === "two" && lastFour.at(-1).text === "answer three");
  const userWindow = extractTurnsByUserCount(turns, 2);
  check("user-count selection retains interleaved agent turns", userWindow.length === 4 && userWindow[0].text === "two" && userWindow[1].text === "answer two");
  const merged = extractTurns([user("one"), user("two"), assistant("answer")], 3);
  check("consecutive same-role records merge", merged.length === 2 && merged[0].text === "one\n\ntwo");
  check("formatted transcript uses agent labels", formatTranscript(lastFour).includes("agent: answer two"));

  const home = path.join(tmp, "home");
  const session = "lookup-integration";
  const transcript = path.join(home, ".claude", "projects", "fixture", `${session}.jsonl`);
  mkdirSync(path.dirname(transcript), { recursive: true });
  writeFileSync(transcript, turns.map(JSON.stringify).join("\n"), "utf8");
  const output = path.join(tmp, "nested", "output.txt");
  const fileRun = run(home, session, "--user-count", "2", "--out", output);
  check("lookup writes a requested output path", fileRun.status === 0 && fileRun.stdout.includes("Wrote") && readFileSync(output, "utf8").includes("user: two"));
  const clamped = run(home, session, "--count", "100");
  check("lookup clamps count at twenty", clamped.status === 0 && clamped.stderr.includes("clamped to the 20 hard cap"));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures === 0) console.log("ALL CASES PASSED");
process.exit(failures ? 1 : 0);
