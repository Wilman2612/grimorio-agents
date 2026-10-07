#!/usr/bin/env node
// agent-audit.mjs — what the agents did, for one day. READ-ONLY; instruments nothing.
// Sources, all pre-existing: the three agent/phase logs under the runtime cache root (see
// transcript at ~/.claude/projects/<proj>/<session-uuid>/subagents/agent-<id>.jsonl, whose first
// substantial user message IS the prompt it was launched with. Column indexes: see the commit message.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { cacheDir } from "./refobl/cache-paths.mjs";

const CACHE = cacheDir();
const args = process.argv.slice(2);
const DAY = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || new Date().toISOString().slice(0, 10);
const WANT = args.find((a) => a.startsWith("--objective="))?.slice(12) || null;
const SHOW_REPORTS = args.includes("--reports");
const SHOW_INSTR = args.includes("--instructions");

const readLines = (p) => (existsSync(p) ? readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean) : []);

// The session comes from the invocations log itself (column 1) — this tool is pointed at a DAY, not a
// session, so it DISCOVERS which session wrote that day rather than being told. The log stores a SHORT id
// while the transcript directory is named with the full uuid, so the directory is resolved by prefix.
// @keep-comment
const SESSION_SHORT = (() => {
  const rows = readLines(`${CACHE}/agent-invocations.log`);
  for (let i = rows.length - 1; i >= 0; i--) {
    const f = rows[i].split("	");
    if (f[0] && f[0].startsWith(DAY) && f[1]) return f[1];
  }
  return null;
})();

const HOME = process.env.USERPROFILE || process.env.HOME || "";
const PROJ_DIR = `${HOME}/.claude/projects/e--Proyect-arena`;
const SUBAGENTS = (() => {
  if (!SESSION_SHORT) return null;
  let names = [];
  try { names = readdirSync(PROJ_DIR); } catch { return null; }
  const dir = names.find((n) => n.startsWith(SESSION_SHORT) && existsSync(`${PROJ_DIR}/${n}/subagents`));
  return dir ? `${PROJ_DIR}/${dir}/subagents` : null;
})();

// The prompt an agent was GIVEN: the first substantial user-text record in its OWN transcript.
// Returns null when the transcript is absent — never a guess, never a reconstruction. @keep-comment
function instructionsOf(agentId) {
  if (!SUBAGENTS) return null;
  const p = `${SUBAGENTS}/agent-${agentId}.jsonl`;
  if (!existsSync(p)) return null;
  for (const l of readLines(p)) {
    let r; try { r = JSON.parse(l); } catch { continue; }
    if (r.type !== "user") continue;
    const c = r.message?.content;
    const t = typeof c === "string" ? c
      : Array.isArray(c) ? c.filter((b) => b?.type === "text").map((b) => b.text).join("") : "";
    if (t && t.length > 300) return t;
  }
  return null;
}

// ---- spawn attempts -------------------------------------------------------------------------------
const pre = new Map();
const post = new Map();
for (const l of readLines(`${CACHE}/agent-invocations.log`)) {
  const f = l.split("\t");
  const [ts, , calleeType, , , chars, objective, branch, , , , callerType, phase, callerId, tuid, calleeId, status] = f;
  if (!ts || !ts.startsWith(DAY)) continue;
  const row = { ts, calleeType, chars: Number(chars) || 0, objective: (objective || "").replace(/^"|"$/g, ""), branch, callerType: callerType === "-" ? "MAIN LOOP" : callerType, callerId, tuid, calleeId, status };
  if (phase === "pre") pre.set(tuid, row);
  else if (phase === "post") post.set(tuid, row);
}

// ---- reports --------------------------------------------------------------------------------------
const reportOf = new Map();
for (const l of readLines(`${CACHE}/agent-completions.log`)) {
  const f = l.split("\t");
  if (!f[0]?.startsWith(DAY)) continue;
  if (f[2]) reportOf.set(f[2], (f[4] || "").replace(/\n/g, "\n"));
}

// ---- phase runs -----------------------------------------------------------------------------------
const chainStarts = new Map();
let freshRuns = 0, resumedRuns = 0;
const seenRuns = new Set();
for (const l of readLines(`${CACHE}/phase-server-log.jsonl`)) {
  let r; try { r = JSON.parse(l); } catch { continue; }
  if (r.cmd !== "start") continue;
  const ts = r.ts || r.timestamp || "";
  if (!ts.startsWith(DAY)) continue;
  const chain = r.chain || r.flags?.chain || "?";
  if (/fixture/.test(chain)) continue;        // selftest fixtures, never real work
  chainStarts.set(chain, (chainStarts.get(chain) || 0) + 1);
  const run = r.run || r.flags?.run;
  if (run && seenRuns.has(run)) resumedRuns++; else { freshRuns++; if (run) seenRuns.add(run); }
}

// ---- report ---------------------------------------------------------------------------------------
const mins = (a, b) => Math.round((new Date(b) - new Date(a)) / 60000);
const ran = [...pre.values()].filter((r) => post.has(r.tuid));
const blocked = [...pre.values()].filter((r) => !post.has(r.tuid));

// A blocked attempt is a RETRY when a LATER attempt carries the same objective. Stated, not assumed:
// the remainder is "abandoned or still in flight" and is reported as such rather than counted as waste.
const retried = blocked.filter((b) => ran.some((r) => r.objective === b.objective && r.ts > b.ts));

console.log(`AGENT AUDIT — ${DAY}\n`);
console.log(`  spawn attempts        ${pre.size}`);
console.log(`  ran                   ${ran.length}`);
console.log(`  blocked, then retried ${retried.length}`);
console.log(`  blocked, no retry     ${blocked.length - retried.length}   (abandoned, or still in flight)`);
console.log(`  phase-chain starts    ${freshRuns} fresh / ${resumedRuns} resumed`);
if (chainStarts.size) {
  console.log(`    ${[...chainStarts].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join("  ")}`);
}

console.log(`\n  WHO RAISED WHOM, AND TO DO WHAT\n`);
const shown = ran.filter((r) => !WANT || r.objective.toLowerCase().includes(WANT.toLowerCase()));
for (const r of shown.sort((a, b) => (a.ts < b.ts ? -1 : 1))) {
  const p = post.get(r.tuid);
  const dur = p ? mins(r.ts, p.ts) : null;
  console.log(`  ${r.ts.slice(11, 16)}  ${r.callerType.replace(/^grimorio\./, "")} -> ${r.calleeType.replace(/^grimorio\./, "")}`);
  console.log(`          ${r.objective}`);
  console.log(`          ${dur === null ? "?" : dur + "m"}${p?.status ? " · " + p.status : ""}${r.branch && r.branch !== "-" ? " · " + r.branch : ""}`);
  if (SHOW_INSTR && p?.calleeId) {
    const instr = instructionsOf(p.calleeId);
    if (instr === null) console.log(`          [no transcript for ${p.calleeId}]`);
    else {
      console.log(`          WAS TOLD (${instr.length} chars):`);
      console.log(instr.split(String.fromCharCode(10)).filter(Boolean).slice(0, 8).map((x) => "            | " + x.slice(0, 110)).join(String.fromCharCode(10)));
    }
  }
  if (SHOW_REPORTS && p?.calleeAgentId) {
    const rep = reportOf.get(p.calleeAgentId);
    if (rep) console.log(rep.split("\n").slice(0, 6).map((x) => "            | " + x).join("\n"));
  }
}

if (blocked.length) {
  console.log(`\n  ATTEMPTS THAT NEVER RAN — the objective was written and thrown away\n`);
  for (const b of blocked.sort((a, b) => (a.ts < b.ts ? -1 : 1))) {
    const isRetry = retried.includes(b);
    console.log(`  ${b.ts.slice(11, 16)}  ${b.callerType.replace(/^grimorio\./, "")} -> ${b.calleeType.replace(/^grimorio\./, "")}  ${isRetry ? "[retried later]" : "[no retry found]"}`);
    console.log(`          ${b.objective}`);
  }
}

console.log(`\nSources read: agent-invocations.log, agent-completions.log, phase-server-log.jsonl`);
console.log(`  --instructions   print the prompt each agent was actually GIVEN, from its own transcript`);
console.log(`  --reports        print what each agent reported back`);
console.log("");
console.log("Still not available: the DENIAL REASON per blocked attempt. The gates print it to the caller and");
console.log(`no hook writes it to disk, so this tool shows THAT an attempt died, never WHY.`);
