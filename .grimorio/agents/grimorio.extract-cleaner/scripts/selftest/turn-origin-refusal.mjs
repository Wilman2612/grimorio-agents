#!/usr/bin/env node
// @keep-comment
// ANSWERS: does the transcript lookup classify a turn by the harness's OWN `turnOrigin` label rather than by
// what the turn's text starts with, and does it REFUSE to produce a window that holds none of the principal's
// own turns instead of handing back a well-formed extract that is empty of him?
//
// WHY THIS EXISTS. A cleaned extract was produced that was correct in every structural respect — right turn
// count, strict alternation, byte-faithful `user:` blocks — and contained nothing the principal had ever
// said: every `user:` turn in it was a subagent hand-back or a background notification admitted because its
// text matched no entry in a hand-maintained tag list. Nothing reported it. Briefs were then written from it.
// The two halves below are the two halves of that defect: the LABEL is now what decides a turn's role
// (Case B/C/F), and a window with zero principal turns is now a REFUSAL rather than an artifact (Case D).
//
// WHEN: after touching ceo-transcript-lookup.mjs or session-window.mjs.
//
// Drives the real CLI via subprocess with fixture transcripts on disk — never tests internals in isolation —
// per this directory's own convention (see selftest/ceo-transcript-lookup.mjs's own integration half).
// @keep-comment

import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const tool = path.resolve(here, "../ceo-transcript-lookup.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "turn-origin-"));
let failures = 0;

// The refusal's own documented exit code. Asserted as a LITERAL here on purpose: importing the constant
// would make this test agree with the tool by construction even if the tool changed the code it exits with.
const EXIT_NO_PRINCIPAL_TURN = 3;

function check(label, condition, detail = "") {
  if (condition) console.log(`PASS: ${label}`);
  else {
    failures += 1;
    console.log(`FAIL: ${label}${detail ? ` -- ${detail}` : ""}`);
  }
}

/** A `type:"user"` record. `origin` omitted ⟶ the record carries NO `turnOrigin` at all (the pre-2026-09-26 shape). */
function userRec(text, origin) {
  const rec = { type: "user", timestamp: "2026-10-02T00:00:00.000Z", message: { role: "user", content: text } };
  if (origin !== undefined) rec.turnOrigin = origin;
  return rec;
}

function assistantRec(text) {
  return { type: "assistant", timestamp: "2026-10-02T00:00:00.000Z", message: { role: "assistant", content: [{ type: "text", text }] } };
}

function queuedRec(text) {
  return { type: "attachment", attachment: { type: "queued_command", prompt: [{ type: "text", text }] } };
}

/** Write a fixture transcript under a throwaway HOME and run the real CLI against it. */
function runAgainst(name, records, ...args) {
  const home = path.join(tmp, name);
  const transcript = path.join(home, ".claude", "projects", "fixture", `${name}.jsonl`);
  mkdirSync(path.dirname(transcript), { recursive: true });
  writeFileSync(transcript, records.map((r) => JSON.stringify(r)).join("\n"), "utf8");
  const out = path.join(home, "window.txt");
  const res = spawnSync(process.execPath, [tool, name, ...args, "--out", out], {
    encoding: "utf8",
    env: { ...process.env, HOME: home, USERPROFILE: home },
  });
  return { ...res, outPath: out, outText: existsSync(out) ? readFileSync(out, "utf8") : null };
}

try {
  // -------------------------------------------------------------------------------------------------------
  // Case A — a window holding the principal's own labelled turns is produced, and the census is REPORTED.
  // The report is owed on the SUCCESS path too, not only on a refusal.
  const caseA = runAgainst(
    "case-a",
    [userRec("my own first instruction, labelled human", "human"), assistantRec("understood"), userRec("my own second instruction", "human"), assistantRec("done")],
    "--user-count",
    "2",
  );
  check("Case A — a window with the principal's own turns exits 0", caseA.status === 0, `status ${caseA.status}: ${caseA.stderr}`);
  check("Case A — the census is reported, naming each origin and the principal total", /turn-origin census: human=2 .*principal turns=2 \(verdict OK\)/.test(caseA.stderr), caseA.stderr);
  check("Case A — his own turns reach the output", caseA.outText !== null && caseA.outText.includes("my own second instruction"), String(caseA.outText));

  // -------------------------------------------------------------------------------------------------------
  // Case B — THE CORE DEFECT. A `peer` record whose text matches NO tag marker is never a `user:` turn.
  // This is the shape that put 50 subagent hand-backs into windows wearing his label.
  const caseB = runAgainst(
    "case-b",
    [userRec("my own real instruction here", "human"), assistantRec("ok"), userRec("This session is being continued from a previous conversation that ran out of context.", "peer"), assistantRec("continuing")],
    "--count",
    "20",
  );
  check("Case B — a labelled peer record with unremarkable text exits 0", caseB.status === 0, `status ${caseB.status}: ${caseB.stderr}`);
  check("Case B — the peer record is NOT emitted as a user: turn", caseB.outText !== null && !caseB.outText.includes("ran out of context"), String(caseB.outText));
  check("Case B — the census still COUNTS the excluded peer record", /peer=1/.test(caseB.stderr), caseB.stderr);

  // -------------------------------------------------------------------------------------------------------
  // Case C — the same for a `task_notification` record whose text carries no `<task-notification>` wrapper.
  const caseC = runAgainst(
    "case-c",
    [userRec("my own real instruction here", "human"), assistantRec("ok"), userRec("Background command finished with exit code 0.", "task_notification"), assistantRec("noted")],
    "--count",
    "20",
  );
  check("Case C — an unwrapped task_notification is NOT emitted as a user: turn", caseC.status === 0 && caseC.outText !== null && !caseC.outText.includes("Background command finished"), `status ${caseC.status}: ${String(caseC.outText)}`);

  // -------------------------------------------------------------------------------------------------------
  // Case D — THE REFUSAL. A window whose only labelled turns are peer/task_notification produces NOTHING.
  const caseD = runAgainst(
    "case-d",
    [assistantRec("working"), userRec("Another session reports: the task is done.", "peer"), assistantRec("acknowledged"), userRec("A background job completed.", "task_notification"), assistantRec("noted")],
    "--count",
    "20",
  );
  check("Case D — a window with zero principal turns REFUSES with its own distinct exit code", caseD.status === EXIT_NO_PRINCIPAL_TURN, `status ${caseD.status}: ${caseD.stderr}`);
  check("Case D — the refusal SAYS what it refused and why", /REFUSED: this window carries \d+ harness-labelled turn\(s\) and NOT ONE of them is the/.test(caseD.stderr), caseD.stderr);
  check("Case D — the census is reported on the refusal path too", /turn-origin census: .*principal turns=0 \(verdict NO_PRINCIPAL_TURN\)/.test(caseD.stderr), caseD.stderr);
  check("Case D — NO output file is written when the window is refused", caseD.outText === null, `a file was written: ${String(caseD.outText).slice(0, 120)}`);

  // -------------------------------------------------------------------------------------------------------
  // Case E — THE BOUND ON THE REFUSAL. A transcript predating `turnOrigin` entirely must still be produced:
  // absence of the label is UNVERIFIABLE origin, never evidence that a turn is not his. 7048 of his own
  // records carry no label, so a refusal here would break every older transcript this tool must read.
  const caseE = runAgainst("case-e", [userRec("an unlabelled turn from before the field existed"), assistantRec("ok"), userRec("another unlabelled turn"), assistantRec("done")], "--count", "20");
  check("Case E — an entirely unlabelled window is PRODUCED, never refused", caseE.status === 0, `status ${caseE.status}: ${caseE.stderr}`);
  check("Case E — and it SAYS the origin could not be verified", /verdict UNVERIFIABLE/.test(caseE.stderr), caseE.stderr);
  check("Case E — the unlabelled turns reach the output", caseE.outText !== null && caseE.outText.includes("another unlabelled turn"), String(caseE.outText));

  // -------------------------------------------------------------------------------------------------------
  // Case F — A QUEUED COMMAND IS HIM, and it never carries a label in either era (142 measured, 0 labelled).
  // A window of nothing but queued commands must NOT be refused.
  const caseF = runAgainst("case-f", [assistantRec("working"), queuedRec("stop and do this instead"), assistantRec("ok"), userRec("Another session reports progress.", "peer"), assistantRec("noted")], "--count", "20");
  check("Case F — a window carrying only a queued command is NOT refused", caseF.status === 0, `status ${caseF.status}: ${caseF.stderr}`);
  check("Case F — the queued command counts as a principal turn in the census", /queued_command=1 /.test(caseF.stderr) && /principal turns=1/.test(caseF.stderr), caseF.stderr);
  check("Case F — his queued words reach the output", caseF.outText !== null && caseF.outText.includes("stop and do this instead"), String(caseF.outText));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures === 0) console.log("ALL CASES PASSED");
process.exit(failures ? 1 : 0);
