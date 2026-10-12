#!/usr/bin/env node
// @subject: .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs
// END ends a run on one condition; a phase with fingerprints leaves only with a filled deliverable; check-chain
// refuses a broken manifest, an exitless phase and a phase file that still routes itself, and passes a sound one.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const S = join(root, ".grimorio/skills/grimorio.phase-splitting/scripts");
const rel = ".grimorio/tmp/selftest-end-fp/zz-phases";
const dir = join(root, rel);
rmSync(join(root, ".grimorio/tmp/selftest-end-fp"), { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "phase-1-a.md"), "# a\n");
writeFileSync(join(dir, "phase-2-b.md"), "# b\n");
const good = {
  agent: "zz", entry: "1",
  phases: [
    { id: "1", file: `${rel}/phase-1-a.md`, loads: ["skill/grimorio.fan-out"], fingerprints: { "skill/grimorio.fan-out": "PLAN" },
      produces: ["deliverable"], "produces-exempt": ["child"], next: { continue: "2", child: "END" } },
    { id: "2", file: `${rel}/phase-2-b.md`, next: { done: "END" } },
  ],
};
writeFileSync(join(dir, "chain.json"), JSON.stringify(good));
const m = `${rel}/chain.json`;
let failed = 0;
const sh = (script, args) => {
  try { return { code: 0, out: execFileSync("node", [join(S, script), ...args], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; }
  catch (e) { return { code: e.status, out: (e.stdout || "") + (e.stderr || "") }; }
};
const t = (name, cond, out) => { console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `\n${out}`}`); if (!cond) failed++; };
const runOf = (out) => out.split("\n")[0].replace("RUN ", "").trim();

let r = sh("check-chain.mjs", ["--manifest", m]);
t("check-chain passes a sound manifest", r.code === 0, r.out);
r = sh("check-chain.mjs", ["--manifest", m, "--walk"]);
t("check-chain --walk takes every condition through the engine", r.code === 0, r.out);

let s = sh("phase-engine.mjs", ["start", "--chain", "zz", "--manifest", m]);
r = sh("phase-engine.mjs", ["next", "--run", runOf(s.out), "--on", "child", "--manifest", m]);
t("END ends the run on its condition", r.code === 0 && r.out.includes("TERMINAL"), r.out);

s = sh("phase-engine.mjs", ["start", "--chain", "zz", "--manifest", m]);
const run = runOf(s.out);
r = sh("phase-engine.mjs", ["next", "--run", run, "--on", "continue", "--manifest", m]);
t("next refuses a fingerprinted phase with no deliverable", r.code === 1, r.out);
writeFileSync(join(dir, "d-empty.md"), "PLAN:   <the plan>\n");
sh("phase-engine.mjs", ["record", "--run", run, "deliverable", `${rel}/d-empty.md`, "--manifest", m]);
r = sh("phase-engine.mjs", ["next", "--run", run, "--on", "continue", "--manifest", m]);
t("next refuses a deliverable whose fingerprint field is a placeholder", r.code === 1, r.out);
writeFileSync(join(dir, "d-full.md"), "PLAN:   three items, fan-out limit 2\n");
sh("phase-engine.mjs", ["record", "--run", run, "deliverable", `${rel}/d-full.md`, "--manifest", m]);
r = sh("phase-engine.mjs", ["next", "--run", run, "--on", "continue", "--manifest", m]);
t("next passes a filled deliverable", r.code === 0 && r.out.includes("PHASE 2"), r.out);

writeFileSync(join(dir, "chain.json"), JSON.stringify({ ...good, phases: [{ ...good.phases[0], next: { continue: "9" }, loads: ["skill/grimorio.no-such"] }, good.phases[1]] }));
r = sh("check-chain.mjs", ["--manifest", m]);
t("check-chain refuses an unknown target, a dead load, a fingerprint outside its loads", r.code === 1 && /unknown phase 9/.test(r.out) && /does not resolve/.test(r.out) && /does not load/.test(r.out), r.out);

writeFileSync(join(dir, "chain.json"), JSON.stringify({ ...good, phases: [good.phases[0], { ...good.phases[1], next: {} }] }));
r = sh("check-chain.mjs", ["--manifest", m]);
t("check-chain refuses a phase with no exit", r.code === 1 && /phase 2: no exit/.test(r.out), r.out);

writeFileSync(join(dir, "chain.json"), JSON.stringify(good));
writeFileSync(join(dir, "phase-2-b.md"), "# b\n\n**NEVER read Phase 3 until this is filled.**\n\n## LOAD (JIT)\n\n## Hard hand-off\n");
r = sh("check-chain.mjs", ["--manifest", m]);
t("check-chain refuses a phase file that still routes itself in prose", r.code === 1 && /read-gate/.test(r.out) && /LOAD section/.test(r.out) && /prose hand-off/.test(r.out), r.out);

rmSync(join(root, ".grimorio/tmp/selftest-end-fp"), { recursive: true, force: true });
console.log(failed ? `engine-end-fingerprint selftest: ${failed} FAILED` : "engine-end-fingerprint selftest: all cases passed");
process.exit(failed ? 1 : 0);
