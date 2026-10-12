#!/usr/bin/env node
// Plan-graph validator and renderer for graph-cases.md: the deterministic rules only.
//   validate <plan.json>  exit 0 clean · 1 a rule refused · 2 unreadable plan
//   render   <plan.json>  prints a mermaid flowchart
import { readFileSync } from "node:fs";

const KINDS = new Set(["plan", "work", "probe", "verify", "review", "merge", "synthesize", "finding", "route", "gate"]);
const MODELS = new Set(["haiku", "sonnet", "opus", "fable"]);
const SHAPES = new Set(["do-it-yourself", "fan-out-with-limit", "relaunch-fresh"]);
const CASES = new Set(["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"]);
const VERIFIERS = new Set(["probe", "verify", "review"]);
const PLANNERS = new Set(["plan", "route", "synthesize"]);

const [cmd, file] = process.argv.slice(2);
if (!cmd || !file || !["validate", "render"].includes(cmd)) {
  console.error("usage: plan-graph.mjs validate|render <plan.json>");
  process.exit(2);
}
let plan;
try {
  plan = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`unreadable plan: ${e.message}`);
  process.exit(2);
}
const nodes = plan.nodes || [];
const items = plan.items || [];
const loops = plan.loops || [];
const stages = plan.stages || [];
const byId = new Map(nodes.map((n) => [n.id, n]));

function validate() {
  const out = [];
  const fail = (rule, detail) => out.push(`${rule}  ${detail}`);

  for (const i of items) if (!i.pass || !String(i.pass).trim()) fail("R1 pass condition", `item ${i.id} has no pass`);

  const proves = (l) => (l.body || []).some((id) => ["probe", "verify"].includes(byId.get(id)?.kind));
  for (const l of loops) {
    if (l.type === "while" && !l.exit) fail("R2 loop exit", `while loop ${l.id} has no exit`);
    if (proves(l) && !(Number.isInteger(l.retries) && l.retries > 0)) fail("R2 loop exit", `loop ${l.id} proves items but has no retries`);
    for (const id of l.body || []) {
      const n = byId.get(id);
      if (!n) fail("R8 hand-offs", `loop ${l.id} names unknown node ${id}`);
      else if (n.kind === "review") fail("R3 review placement", `review ${id} is inside loop ${l.id}; move it to the loop's "then"`);
    }
    if (l.parallel && !(Number.isInteger(l.limit) && l.limit > 0)) fail("R4 fan-out limit", `parallel loop ${l.id} has no limit`);
  }
  if (loops.some(proves) && !nodes.some((n) => n.kind === "finding")) fail("R2 loop exit", "no finding node receives retry exhaustion");
  for (const l of loops) {
    const ids = [...(l.body || []), ...(l.then || [])].map((id) => byId.get(id)).filter(Boolean);
    const haikuWork = (l.body || []).some((id) => byId.get(id)?.kind === "work" && byId.get(id)?.model === "haiku");
    const checked = ids.some((n) => ["probe", "verify"].includes(n.kind) && n.model !== "haiku");
    if (haikuWork && !checked) fail("R11 executor checked", `loop ${l.id} runs a Haiku work node that nothing on another model checks`);
  }

  for (const n of nodes) {
    if (!KINDS.has(n.kind)) fail("R8 hand-offs", `node ${n.id} has unknown kind ${n.kind}`);
    if (!MODELS.has(n.model)) fail("R5 verifier tier", `node ${n.id} has unknown model ${n.model}`);
    if (VERIFIERS.has(n.kind) && n.model === "haiku") fail("R5 verifier tier", `${n.kind} ${n.id} runs on haiku`);
    if (VERIFIERS.has(n.kind) && (n.model === "opus" || n.model === "fable") && !n.tierReason) {
      fail("R5 verifier tier", `${n.kind} ${n.id} runs on ${n.model} without tierReason`);
    }
    if (PLANNERS.has(n.kind) && n.model === "haiku") fail("R6 planner tier", `${n.kind} ${n.id} runs on haiku`);
    if (!n.in || !n.out) fail("R8 hand-offs", `node ${n.id} lacks ${!n.in ? "in" : "out"}`);
  }

  const spawned = nodes.filter((n) => n.agent && n.agent !== "self");
  for (const i of items) {
    const n = i.atomic && i.by ? byId.get(i.by) : null;
    if (n && n.agent !== "self") fail("R7 atomic item", `atomic item ${i.id} is handed to ${n.agent}`);
  }

  if (!SHAPES.has(plan.shape)) fail("R9 shape", `shape is ${plan.shape ?? "missing"}`);
  if (plan.shape === "do-it-yourself" && spawned.length) fail("R9 shape", `do-it-yourself plan spawns ${spawned.map((n) => n.id).join(", ")}`);

  if (!stages.length) fail("R10 case", "no stages");
  for (const s of stages) if (!CASES.has(s.case)) fail("R10 case", `stage ${s.id} names no case from graph-cases.md`);
  return out;
}

function render() {
  const L = ["flowchart TD"];
  const inLoop = new Set(loops.flatMap((l) => l.body || []));
  for (const n of nodes) if (!inLoop.has(n.id)) L.push(`  ${n.id}["${n.kind}: ${n.agent} (${n.model})"]`);
  for (const l of loops) {
    L.push(`  subgraph ${l.id}["${l.type}${l.parallel ? " ∥" : ""} over ${l.over || "items"} · retries ${l.retries ?? "?"}${l.limit ? ` · limit ${l.limit}` : ""}"]`);
    for (const id of l.body || []) {
      const n = byId.get(id);
      if (n) L.push(`    ${n.id}["${n.kind}: ${n.agent} (${n.model})"]`);
    }
    const body = l.body || [];
    for (let i = 0; i + 1 < body.length; i++) L.push(`    ${body[i]} --> ${body[i + 1]}`);
    L.push("  end");
    const then = l.then || [];
    if (then.length) L.push(`  ${l.id} --> ${then[0]}`);
    for (let i = 0; i + 1 < then.length; i++) L.push(`  ${then[i]} --> ${then[i + 1]}`);
  }
  const finding = nodes.find((n) => n.kind === "finding");
  if (finding) for (const l of loops) L.push(`  ${l.id} -. retries spent .-> ${finding.id}`);
  console.log(L.join("\n"));
}

if (cmd === "validate") {
  const findings = validate();
  for (const f of findings) console.log(`FAIL ${f}`);
  console.log(findings.length ? `${findings.length} rule(s) refused` : "PLAN VALID — the deterministic rules hold; the judgment column is still yours");
  process.exit(findings.length ? 1 : 0);
} else {
  render();
}
