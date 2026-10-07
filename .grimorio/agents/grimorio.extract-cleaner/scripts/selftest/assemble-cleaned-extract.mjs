#!/usr/bin/env node
// Native coverage for every public assemble-cleaned-extract subcommand.

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const tool = path.join(root, ".grimorio", "agents", "grimorio.extract-cleaner", "scripts", "assemble-cleaned-extract.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "assemble-cleaned-extract-"));
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) console.log(`PASS: ${label}`);
  else { failures += 1; console.log(`FAIL: ${label}${detail ? ` -- ${detail}` : ""}`); }
}

function run(...args) {
  return spawnSync(process.execPath, [tool, ...args], { encoding: "utf8" });
}

function write(name, text) {
  const target = path.join(tmp, name);
  writeFileSync(target, text, "utf8");
  return target;
}

try {
  const raw = write("raw.txt", "user: first\nlong first user text\nagent: original first\nuser: second\nlong second user text\nagent: original second\nuser: third\nlong third user text\nagent: original third\n");
  const sliced = path.join(tmp, "sliced.txt");
  const caseA = run("slice", raw, "--keep-last-user", "2", "--out", sliced);
  const caseAText = readFileSync(sliced, "utf8");
  check("slice keeps the requested most-recent user window", caseA.status === 0 && !caseAText.includes("first user") && caseAText.includes("second user") && caseAText.includes("third user"));
  check("slice reports its user-turn floor", caseA.stdout.includes("user-turn-floor: R=3 K=2 case=A alternation=OK total-turns=4"));

  const full = path.join(tmp, "full.txt");
  const caseB = run("slice", raw, "--keep-last-user", "9", "--out", full);
  check("full slice is byte-identical", caseB.status === 0 && readFileSync(full, "utf8") === readFileSync(raw, "utf8"));
  check("full slice reports case B", caseB.stdout.includes("user-turn-floor: R=3 K=9 case=B alternation=OK total-turns=6"));
  check("slice rejects zero retention", run("slice", raw, "--keep-last-user", "0", "--out", sliced).status === 1);

  const longUser = "x".repeat(12000);
  const longRaw = write("long.txt", `user: discard\nagent: discard\nuser: ${longUser}\nagent: source\n`);
  const longOut = path.join(tmp, "long-out.txt");
  run("slice", longRaw, "--keep-last-user", "1", "--out", longOut);
  check("slice preserves a long user turn exactly", readFileSync(longOut, "utf8").includes(longUser));

  const abstracts = write("abstracts.txt", "agent: concise second\nagent: concise third\n");
  const final = path.join(tmp, "final.txt");
  const splice = run("splice", sliced, abstracts, "--out", final);
  const finalText = readFileSync(final, "utf8");
  check("splice interleaves copied users with abstracts", splice.status === 0 && finalText.includes("long second user text") && finalText.includes("agent: concise second") && !finalText.includes("original second"));
  check("splice rejects an abstract count mismatch", run("splice", sliced, write("one.txt", "agent: only one\n"), "--out", final).status === 1);
  check("splice rejects a broken window alternation", run("splice", write("broken.txt", "user: one\nagent: a\nagent: b\n"), write("two.txt", "agent: x\nagent: y\n"), "--out", final).status === 1);
  check("splice rejects non-agent abstract blocks", run("splice", sliced, write("bad-abstracts.txt", "user: not an abstract\nagent: later\n"), "--out", final).status === 1);

  const endToEndWindow = path.join(tmp, "end-window.txt");
  const endToEnd = path.join(tmp, "end-final.txt");
  run("slice", raw, "--keep-last-user", "1", "--out", endToEndWindow);
  run("splice", endToEndWindow, write("end-abstract.txt", "agent: compact final\n"), "--out", endToEnd);
  const e2e = readFileSync(endToEnd, "utf8");
  check("slice then splice discards old turns and preserves the final user", !e2e.includes("first user") && e2e.includes("third user") && e2e.includes("compact final"));

  check("missing inputs fail descriptively", run("slice", path.join(tmp, "missing.txt"), "--keep-last-user", "1", "--out", sliced).status === 1);
  check("unknown subcommands are usage errors", run("unknown").status === 2 && run("unknown").stderr.includes("slice"));

  const userView = path.join(tmp, "user-view.txt");
  const userViewRun = run("user-view", raw, "--out", userView);
  const userViewText = readFileSync(userView, "utf8");
  check("user-view returns every user block only", userViewRun.status === 0 && userViewText.includes("[user turn 1 of 3]") && !userViewText.includes("original first"));
  check("user-view preserves a real multiline user block", userViewText.includes("long second user text"));
  check("user-view rejects an input without user turns", run("user-view", write("agents-only.txt", "agent: alone\n"), "--out", userView).status === 1);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures === 0) console.log("ALL CASES PASSED");
process.exit(failures ? 1 : 0);
