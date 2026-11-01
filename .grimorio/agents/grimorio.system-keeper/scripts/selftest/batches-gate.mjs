#!/usr/bin/env node
// @subject: .grimorio/agents/grimorio.system-keeper/phases/chain.json
// The keeper cannot leave placement (Phase B) until its deliverable names its BATCHES and its REVIEW plan: this
// walks the real chain through the phase engine and tries to leave Phase B without each field.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const engine = join(root, ".grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs");
const box = mkdtempSync(join(tmpdir(), "keeper-batches-"));
let failed = 0;
const t = (name, cond, got) => { console.log(`  ${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : `\n    got: ${got}`}`); if (!cond) failed++; };
const eng = (...args) => spawnSync(process.execPath, [engine, ...args], { cwd: root, encoding: "utf8" });
const file = (name, text) => { const p = join(box, name); writeFileSync(p, text); return p; };

const started = eng("start", "--chain", "grimorio.system-keeper");
const run = (/RUN ([a-z0-9]{4}-[a-z0-9]{4})/.exec(started.stdout) || [])[1];
t("the keeper's chain starts", Boolean(run), started.stdout + started.stderr);
eng("record", "--run", run, "diagnosis-complete", file("diag.md", "diagnosis"));
t("Phase A hands over to Phase B", /PHASE B/.test(eng("next", "--run", run, "--on", "diagnosis-complete").stdout), "");
eng("record", "--run", run, "placement-authored", file("auth.md", "authored"));

let r = eng("next", "--run", run, "--on", "authored");
t("Phase B with no deliverable is refused", r.status !== 0 && !/PHASE C/.test(r.stdout), r.stdout + r.stderr);

eng("record", "--run", run, "deliverable", file("d1.md", "BATCHES: one writer node with all three edits, sonnet\n"));
r = eng("next", "--run", run, "--on", "authored");
t("Phase B with BATCHES but no REVIEW is refused", r.status !== 0 && /REVIEW/.test(r.stdout + r.stderr), r.stdout + r.stderr);

eng("record", "--run", run, "deliverable", file("d2.md", "BATCHES: one writer node with all three edits, sonnet\nREVIEW: one code review at the end, over the whole diff\n"));
r = eng("next", "--run", run, "--on", "authored");
t("Phase B with both BATCHES and REVIEW moves to Phase C", r.status === 0 && /PHASE C/.test(r.stdout), r.stdout + r.stderr);

rmSync(box, { recursive: true, force: true });
console.log(failed ? `batches-gate selftest: ${failed} FAILED` : "batches-gate selftest: all cases passed");
process.exit(failed ? 1 : 0);
