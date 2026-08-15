#!/usr/bin/env node
// Appends one line per Agent spawn to .claude/.cache/agent-invocations.log
// Read it with: bash scripts/agent-stats.sh
//
// The question this log exists to answer is NOT "what was raised" (fields 1-7, the original
// version) but "why was that raised INSTEAD OF executing the plan" — so fields 8-11 record the
// PLAN CONTEXT the spawn happened in, at the moment it happens. A deviation that is only visible
// thirty-two hours later has already cost the day it was going to cost.
//
// Fields 14-17 close the parent-child gap for a background spawn: 14 is the caller, 15 joins a
// dispatch row to its resolution row, 16 is the child's id (post rows only), 17 is dispatch status.
// A future watcher (not this hook) reads them to find a parked child's parent.
//
// Never throws. A logger that can break a spawn is a logger that gets switched off.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const NA = "-";

function quiet(fn, fallback) {
  try {
    const v = fn();
    return v === undefined || v === null || v === "" ? fallback : v;
  } catch (_) {
    return fallback;
  }
}

function gitBranch(root) {
  return quiet(
    () =>
      execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim(),
    NA,
  );
}

// Field 10 — retired 2026-08-09 with the gate that demanded it; always empty.

// Field 11 — the churn signal, and it is the one the CEO named: the main loop round-robining
// workers on the same thing. A repeat is the same session + same agent type + same first four
// words of the description. R1 is the first repeat, R2 the second, and so on.
function repeatCount(logPath, session, type, description) {
  const stem = description.toLowerCase().split(/\s+/).slice(0, 4).join(" ");
  return quiet(() => {
    const prior = fs
      .readFileSync(logPath, "utf8")
      .split("\n")
      .filter((line) => {
        const f = line.split("\t");
        if (f[1] !== session || f[2] !== type || !f[6]) return false;
        return quiet(() => JSON.parse(f[6]), "").toLowerCase().split(/\s+/).slice(0, 4).join(" ") === stem;
      }).length;
    return prior ? `R${prior}` : NA;
  }, NA);
}

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  if (input.tool_name !== "Agent") process.exit(0);

  const t = input.tool_input || {};
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const dir = path.join(root, ".claude/.cache");
  const logPath = path.join(dir, "agent-invocations.log");
  fs.mkdirSync(dir, { recursive: true });

  const session = String(input.session_id || "").slice(0, 8);
  const type = t.subagent_type || "(default)";
  const prompt = String(t.prompt || "");
  const description = String(t.description || "");
  const branch = gitBranch(root);

  // @keep-comment Field 12 records `input.agent_type`, the caller's own type — this is now a SETTLED
  // reading, not an experiment. Verified against `.claude/settings.json`: this hook is wired on
  // `PreToolUse: Agent` (see field 13 below for why that event matters), and `agent_type` is populated
  // there, so a completed spawn is attributable to the caller that raised it. Absent `agent_type` means
  // the top-level main loop, not missing data — noted here so a log reader does not mistake NA for
  // missing data.
  fs.appendFileSync(
    logPath,
    [
      new Date().toISOString(),
      session,
      type,
      t.model || NA, // 4  — an override; prohibition 11 says this should be rare and NAMED
      t.isolation || NA, // 5
      prompt.length, // 6
      JSON.stringify(description), // 7
      branch, // 8  — which branch the spawn was raised from
      quiet(() => (fs.existsSync(path.join(root, "objectives", `${branch}.md`)) ? "yes" : "no"), NA), // 9
      "", // 10 — retired with require-agent-selection.cjs
      repeatCount(logPath, session, type, description), // 11 — R<n> is the churn
      input.agent_type || NA, // 12 — the caller's own type; see the @keep-comment block above
      // 13 — WHICH EVENT wrote this row, because the two mean opposite things and the file holds both.
      // `pre` is DISPATCH: rows sharing a second were spawned in one message, which is what makes a
      // fan-out identifiable at all. `post` is COMPLETION, the semantics of every row before 2026-08-09,
      // under which two agents launched together landed 100s apart and read as sequential.
      input.hook_event_name === "PreToolUse" ? "pre" : "post",
      input.agent_id || NA, // 14 — caller_agent_id: the CALLER's own id, present on both pre and post rows
      input.tool_use_id || NA, // 15 — the JOIN KEY: identical on a dispatch row and its own resolution row
      (input.tool_response && input.tool_response.agentId) || NA, // 16 — child_agent_id: only ever present
      // on a post row (the child does not exist yet at PreToolUse time) — this is the whole point of the
      // extension: the only place the parent-child link is ever recorded.
      (input.tool_response && input.tool_response.status) || NA, // 17 — dispatch_status: "completed" for a
      // foreground spawn, "async_launched" for a background one at dispatch (not at finish); NA on a pre row.
    ].join("\t") + "\n",
    "utf8",
  );
} catch (_) {
  /* never break a spawn */
}
