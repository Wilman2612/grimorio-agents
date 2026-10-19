#!/usr/bin/env node
// @subject: .grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-finalize.mjs
// The agent runs prepare and finalize WITHOUT --work-dir, so both must default to the same folder. Every other
// selftest passes --work-dir and so never ran that path.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const scripts = join(here, "..");
const workRoot = JSON.parse(readFileSync(join(here, "../../../../scripts/refobl/skill-roots.json"), "utf8")).workRoot;
let failed = 0;
const t = (name, cond, got) => { console.log(`  ${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : `\n${got}`}`); if (!cond) failed++; };

const project = mkdtempSync(join(tmpdir(), "cleaner-default-dir-"));
const sid = "selftest-session";
mkdirSync(join(project, workRoot, "extract-cleaner", sid), { recursive: true });
writeFileSync(join(project, workRoot, "extract-cleaner", sid, "raw-fetch.txt"), "user: hola\n");
const r = spawnSync(process.execPath, [join(scripts, "extract-cleaner-finalize.mjs")], {
  cwd: project, encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: project, CLAUDE_CODE_SESSION_ID: sid },
});
// Prepare's default folder: <project>/<workRoot>extract-cleaner/<session>. Finalize must name that same folder.
const expected = join(project, workRoot, "extract-cleaner", sid);
const out = r.stdout + r.stderr;
const named = /work-dir \(([^)]+)\)/.exec(out);
t("finalize resolves the folder prepare writes to by default", !named || named[1] === expected, `expected ${expected}\n${out}`);

const hardcoded = readdirSync(scripts).filter((f) => f.endsWith(".mjs"))
  .filter((f) => /process\.cwd\(\), "tmp"/.test(readFileSync(join(scripts, f), "utf8")));
t("no cleaner script hardcodes tmp/ as its work root", hardcoded.length === 0, hardcoded.join(", "));

rmSync(project, { recursive: true, force: true });
console.log(failed ? `default-work-dir selftest: ${failed} FAILED` : "default-work-dir selftest: all cases passed");
process.exit(failed ? 1 : 0);
