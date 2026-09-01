#!/usr/bin/env node
// @keep-comment Two independent behaviors on every `Skill` call, both writes-only, never blocks:
//
// 1. Always-on debug log (new) — appends one JSONL line per Skill call, TRACKED or not, to
//    .claude/.cache/skill-load-debug.log. This is the mechanical, non-introspective instrument for
//    telling whether a skill actually loaded, independent of whether an agent's behavior afterward
//    shows a matching footprint — those are different questions, and measurements this session
//    (objectives/grimorio-loop-graph-findings.md F17/F19/F20) had no mechanical way to tell them apart.
//    Always-on by design, not flag-gated: one fewer thing to remember when a measurement matters later,
//    at disk-only cost — the same precedent log-agent-invocation.cjs already sets in this repo.
// 2. TRACKED markers (unchanged) — records that a TRACKED skill loaded THIS session, in a marker file
//    a gate could consult. Session-scoped on purpose — being in context NOW is what matters, not that
//    it was ever read. As of this file's own GRIMORIO-CHAIN.md §3 entry, no gate consumes these markers
//    today; kept because deleting wired machinery is a separate call from adding to it.

const fs = require("fs");
const path = require("path");

const NA = "-";

// TRACKED: skill name -> marker file. A new gate needing "was skill X loaded" adds one line here.
const TRACKED = {
  "grimorio.agent-selection": "agent-selection-loaded",
  "grimorio.prompt-writing-quality": "prompt-quality-loaded",
};

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  if (input.tool_name !== "Skill") process.exit(0);

  const skill = String((input.tool_input && input.tool_input.skill) || "");
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const dir = path.join(root, ".claude/.cache");
  fs.mkdirSync(dir, { recursive: true });

  // 1. Always-on debug log — fires for every Skill call, tracked or not.
  try {
    const line = {
      ts: new Date().toISOString(),
      skill: skill || NA,
      session_id: input.session_id || NA,
      agent_type: input.agent_type || NA,
      cwd: input.cwd || NA,
    };
    fs.appendFileSync(path.join(dir, "skill-load-debug.log"), JSON.stringify(line) + "\n", "utf8");
  } catch (_) {
    /* never let the debug log break the marker write below */
  }

  // 2. TRACKED marker — unchanged behavior, only for skills in the TRACKED map.
  const marker = TRACKED[skill];
  if (!marker) process.exit(0);
  fs.writeFileSync(path.join(dir, marker), String(input.session_id || ""), "utf8");
} catch (_) {
  /* never break a tool call */
}
