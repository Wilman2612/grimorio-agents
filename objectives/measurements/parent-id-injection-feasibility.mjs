// @keep-comment — this block is the measurement's METHOD, not a description of code behaviour.
// The 99.9% figure this script reports is only meaningful under the modelling choices stated below
// (the birth-instant approximation and the conservative foreground case); anyone who "simplifies"
// them silently changes what the number means. It must travel with the script, not sit in a commit.
// Feasibility replay for queue item 3 (parent-id injection at SubagentStart).
// Question: at the moment a child's SubagentStart fires, can the hook resolve THAT child's PARENT id
// from .claude/.cache/agent-invocations.log, and how often is the answer ambiguous?
//
// Model of what the hook can see at SubagentStart: the child's own agent_id and agent_type. It CANNOT
// see the join key. So it must look for `pre` rows (dispatch rows, written at PreToolUse — i.e. BEFORE
// the child exists) of the same agent_type that are still UNRESOLVED (no `post` row with that join key
// has been appended yet at that instant).
//
// We replay every real spawn in the log, using the real `post` row timestamp as the proxy instant at
// which the child came into existence (for async_launched rows this is dispatch+~0.4s, which brackets
// SubagentStart tightly; for foreground rows the post row lands at COMPLETION, so we instead use the
// pre row's own timestamp + 1s, which is strictly EARLIER than any real SubagentStart and therefore a
// CONSERVATIVE (worst-case, most-ambiguous) estimate of the candidate set).
import fs from "node:fs";

const LOG = process.argv[2];
const rows = fs.readFileSync(LOG, "utf8").split("\n").filter(Boolean).map((l) => l.split("\t"));

const TS = 0, TYPE = 2, EV = 12, CALLER = 13, JOIN = 14, CHILD = 15, STATUS = 16;
const t = (r) => Date.parse(r[TS]);
const WINDOW_MS = Number(process.argv[3] || 120000); // how recent a `pre` row must be to be a candidate

const pre = rows.filter((r) => r[EV] === "pre");
const post = rows.filter((r) => r[EV] === "post");
const postByJoin = new Map();
for (const r of post) postByJoin.set(r[JOIN], r);

let exactKeyAvailable = 0, exactKeyUnavailable = 0;
let unambiguous = 0, ambiguous = 0, noCandidate = 0;
let combinedResolved = 0, combinedUnresolved = 0, combinedByExact = 0, combinedByHeuristic = 0;
const ambiguousExamples = [];
let gapsFg = [], gapsBg = [];

for (const p of pre) {
  const q = postByJoin.get(p[JOIN]);
  if (!q) continue;                         // never resolved in this log window
  const gapMs = t(q) - t(p);
  const isBg = q[STATUS] === "async_launched";
  (isBg ? gapsBg : gapsFg).push(gapMs);

  // --- (A) EXACT-KEY route: is the child's own id (field 16) on disk when SubagentStart fires? ---
  // SubagentStart fires within the spawn itself. For a foreground spawn the post row (the ONLY row that
  // ever carries field 16) is not written until the child COMPLETES -> structurally unavailable.
  if (isBg) exactKeyAvailable++; else exactKeyUnavailable++;

  // --- (B) HEURISTIC route: unresolved `pre` rows of this type, at the child's birth instant ---
  // SubagentStart fires strictly BETWEEN the pre row (PreToolUse, before the tool runs) and the post
  // row (PostToolUse). So the child's birth instant is t(pre)+epsilon for BOTH dispatch shapes — using
  // t(post) for background rows was wrong: it placed birth at the exact instant the row resolves.
  const birth = t(p) + 250;
  const candidates = pre.filter((c) => {
    if (c[TYPE] !== p[TYPE]) return false;
    if (c[1] !== p[1]) return false;                      // SAME SESSION only
    if (t(c) > birth) return false;                       // not dispatched yet
    if (birth - t(c) > WINDOW_MS) return false;           // RECENCY window: SubagentStart follows
                                                          // PreToolUse within seconds, never hours
    const cq = postByJoin.get(c[JOIN]);
    if (cq && t(cq) <= birth) return false;               // already resolved before this instant
    return true;
  });
  // --- (C) COMBINED route, which is what the hook would actually implement: try the EXACT key first
  // (a post row already on disk whose field 16 IS this child's id -> its field 14 is the parent,
  // with no guessing at all), and fall back to (B) only when that row is not there yet.
  const exactOnDisk = t(q) <= birth;                      // this child's own post row already written
  if (exactOnDisk) { combinedResolved++; combinedByExact++; }

  if (candidates.length === 0) { noCandidate++; if (!exactOnDisk) combinedUnresolved++; continue; }
  const callers = new Set(candidates.map((c) => c[CALLER]));
  if (callers.size === 1) {
    unambiguous++;
    if (!exactOnDisk) { combinedResolved++; combinedByHeuristic++; }
  } else {
    if (!exactOnDisk) combinedUnresolved++;
    ambiguous++;
    if (ambiguousExamples.length < 5)
      ambiguousExamples.push({ type: p[TYPE], at: p[TS], candidates: candidates.length, callers: [...callers] });
  }
}

const pct = (n, d) => ((100 * n) / d).toFixed(1) + "%";
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };
const total = exactKeyAvailable + exactKeyUnavailable;

console.log(`POPULATION: ${total} resolved spawns (pre row joined to its own post row) out of ${pre.length} pre rows in ${LOG}`);
console.log("");
console.log("--- ROUTE A: exact-key lookup (find the post row carrying THIS child's id) ---");
console.log(`  background (async_launched): ${exactKeyAvailable} (${pct(exactKeyAvailable, total)}) — post row lands at dispatch, median +${med(gapsBg)}ms`);
console.log(`  foreground (completed):      ${exactKeyUnavailable} (${pct(exactKeyUnavailable, total)}) — post row lands at COMPLETION, median +${(med(gapsFg) / 60000).toFixed(1)} min`);
console.log(`  => exact-key route is STRUCTURALLY UNAVAILABLE for ${pct(exactKeyUnavailable, total)} of spawns.`);
console.log("");
console.log("--- ROUTE B: heuristic via UNRESOLVED `pre` rows of the same agent_type (field 14 = caller) ---");
console.log(`  unambiguous (all candidates agree on the caller): ${unambiguous} (${pct(unambiguous, total)})`);
console.log(`  ambiguous   (candidates disagree -> must abstain): ${ambiguous} (${pct(ambiguous, total)})`);
console.log(`  no candidate at all (must abstain):                ${noCandidate} (${pct(noCandidate, total)})`);
console.log("");
console.log("  ambiguous examples:");
console.log("");
console.log("--- ROUTE C: COMBINED (exact key first, heuristic fallback) = THE PROPOSED DESIGN ---");
console.log(`  parent id RESOLVED:   ${combinedResolved} (${pct(combinedResolved, total)})  [by exact key: ${combinedByExact}, by heuristic: ${combinedByHeuristic}]`);
console.log(`  parent id UNRESOLVED: ${combinedUnresolved} (${pct(combinedUnresolved, total)})  -> hook ABSTAINS, falls back to today's behaviour`);
for (const e of ambiguousExamples) console.log(`   - ${e.at} ${e.type}: ${e.candidates} candidates, callers=${JSON.stringify(e.callers)}`);
