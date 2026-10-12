#!/usr/bin/env node
// @subject: .grimorio/skills/grimorio.loop-and-graph/scripts/plan-graph.mjs
// The plan in graph-cases.md must validate, and each rule must refuse a plan built to break it.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const script = join(root, ".grimorio/skills/grimorio.loop-and-graph/scripts/plan-graph.mjs");
const doc = readFileSync(join(root, ".grimorio/skills/grimorio.loop-and-graph/graph-cases.md"), "utf8");
const base = JSON.parse(doc.match(/```json\n([\s\S]*?)```/)[1]);
const dir = mkdtempSync(join(tmpdir(), "plan-graph-"));
let failed = 0;

function run(plan) {
  const f = join(dir, "plan.json");
  writeFileSync(f, JSON.stringify(plan));
  try {
    return { code: 0, out: execFileSync("node", [script, "validate", f], { encoding: "utf8" }) };
  } catch (e) {
    return { code: e.status, out: e.stdout };
  }
}
function check(name, mutate, wantCode, wantRule) {
  const plan = structuredClone(base);
  mutate(plan);
  const { code, out } = run(plan);
  const ok = code === wantCode && (!wantRule || out.includes(wantRule));
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  got exit ${code}: ${out.trim()}`}`);
  if (!ok) failed++;
}

check("the documented plan validates", () => {}, 0);
check("R1 an item without pass", (p) => { delete p.items[0].pass; }, 1, "R1");
check("R2 an item-proving loop without retries", (p) => { delete p.loops[0].retries; }, 1, "R2");
check("R2 no finding node", (p) => { p.nodes = p.nodes.filter((n) => n.kind !== "finding"); }, 1, "R2");
check("R3 a review inside the loop body", (p) => { p.loops[0].body.push("r"); p.loops[0].then = ["m"]; }, 1, "R3");
check("R4 a parallel loop without limit", (p) => { delete p.loops[0].limit; }, 1, "R4");
check("R5 a review on haiku", (p) => { p.nodes.find((n) => n.id === "r").model = "haiku"; }, 1, "R5");
check("R5 a review on opus without reason", (p) => { p.nodes.find((n) => n.id === "r").model = "opus"; }, 1, "R5");
check("R5 a review on opus with a reason", (p) => { Object.assign(p.nodes.find((n) => n.id === "r"), { model: "opus", tierReason: "subtle concurrency" }); }, 0);
check("R6 a synthesize node on haiku", (p) => { p.nodes.push({ id: "s", kind: "synthesize", agent: "self", model: "haiku", in: "x", out: "y" }); }, 1, "R6");
check("R7 an atomic item handed to an agent", (p) => { Object.assign(p.items[0], { atomic: true, by: "w" }); }, 1, "R7");
check("R7 an atomic item kept by self passes", (p) => { Object.assign(p.items[0], { atomic: true, by: "p" }); }, 0);
check("R2 a panel loop without retries passes", (p) => { p.nodes.push({ id: "q", kind: "work", agent: "grimorio.entropy", model: "sonnet", in: "x", out: "y" }); p.loops.push({ id: "L2", type: "foreach", parallel: true, limit: 3, body: ["q"] }); }, 0);
check("R11 a Haiku executor nothing checks", (p) => { p.nodes.find((n) => n.id === "w").model = "haiku"; p.nodes.find((n) => n.id === "p").model = "haiku"; }, 1, "R11");
check("R11 a Haiku executor the planner checks passes", (p) => { p.nodes.find((n) => n.id === "w").model = "haiku"; }, 0);
check("R8 a node without out", (p) => { delete p.nodes[0].out; }, 1, "R8");
check("R9 do-it-yourself that spawns", (p) => { p.shape = "do-it-yourself"; }, 1, "R9");
check("R10 a stage with no case", (p) => { p.stages[0].case = "C99"; }, 1, "R10");

console.log(failed ? `plan-graph selftest: ${failed} FAILED` : "plan-graph selftest: all cases passed");
process.exit(failed ? 1 : 0);
