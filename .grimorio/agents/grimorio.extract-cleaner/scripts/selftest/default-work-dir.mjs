#!/usr/bin/env node
// @subject: .grimorio/agents/grimorio.extract-cleaner/scripts/work-dir.mjs
// The agent runs prepare and finalize WITHOUT --work-dir. This runs both that way against a fake session and
// requires finalize to finish in the folder prepare filled; a last case forbids a per-script copy of that default.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const scripts = join(here, "..");
const workRoot = JSON.parse(readFileSync(join(here, "../../../../scripts/refobl/skill-roots.json"), "utf8")).workRoot;
let failed = 0;
const t = (name, cond, got) => { console.log(`  ${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : `\n${got}`}`); if (!cond) failed++; };

const box = mkdtempSync(join(tmpdir(), "cleaner-default-dir-"));
const home = join(box, "home");
const project = join(box, "project");
const sid = "selftest-session";
mkdirSync(join(home, ".claude", "projects", "p"), { recursive: true });
mkdirSync(project, { recursive: true });
const say = (role, text) => JSON.stringify(role === "user"
  ? { type: "user", message: { role: "user", content: text } }
  : { type: "assistant", message: { role: "assistant", content: [{ type: "text", text }] } });
writeFileSync(join(home, ".claude", "projects", "p", `${sid}.jsonl`), [
  say("user", "Arregla el título de la página"),
  say("assistant", "Listo, cambié el título de la página principal por el que pediste y revisé que se vea bien en el móvil."),
  say("user", "Ahora el pie de página"),
  say("assistant", "Voy con el pie de página: primero reviso qué enlaces tiene hoy y después te propongo el cambio."),
].join("\n") + "\n");

const env = { ...process.env, HOME: home, CLAUDE_PROJECT_DIR: project, CLAUDE_CODE_SESSION_ID: sid };
const run = (script, args = []) => spawnSync(process.execPath, [join(scripts, script), ...args], { cwd: project, encoding: "utf8", env });
// Where the default must land, computed from skill-roots.json itself, never from the module under test.
const expected = join(project, workRoot, "extract-cleaner", sid);

const prep = run("extract-cleaner-prepare.mjs");
t("prepare, with no --work-dir, fills <workRoot>extract-cleaner/<session>",
  prep.status === 0 && existsSync(join(expected, "prepared.json")), `exit ${prep.status}\n${prep.stdout}${prep.stderr}`);

const fin = run("extract-cleaner-finalize.mjs", ["--abstract", "Proposes: title changed.", "--abstract", "Proposes: footer next."]);
const written = /Success: cleaned extract written to (\S+)/.exec(fin.stdout);
t("finalize, with no --work-dir, finishes in the folder prepare filled",
  fin.status === 0 && written !== null && written[1] === join(expected, "cleaned-extract.txt").split("\\").join("/"),
  `exit ${fin.status}\nexpected ${join(expected, "cleaned-extract.txt")}\n${fin.stdout}${fin.stderr}`);

const ownCopy = readdirSync(scripts).filter((f) => f.endsWith(".mjs") && f !== "work-dir.mjs")
  .filter((f) => /["']extract-cleaner["']|process\.cwd\(\), "tmp"/.test(readFileSync(join(scripts, f), "utf8")));
t("no cleaner script builds its own default folder; work-dir.mjs is the one place", ownCopy.length === 0, ownCopy.join(", "));

rmSync(box, { recursive: true, force: true });
console.log(failed ? `default-work-dir selftest: ${failed} FAILED` : "default-work-dir selftest: all cases passed");
process.exit(failed ? 1 : 0);
