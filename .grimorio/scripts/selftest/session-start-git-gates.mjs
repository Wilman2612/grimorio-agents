#!/usr/bin/env node
// @subject: .claude/hooks/session-start-identity.cjs
// Drives the SessionStart hook in a throwaway grimorio clone: it must install the git gate shims, keep the session's
// identity even when the installer cannot load, and tell the session when it finds a foreign hook.
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const hookUnderTest = process.env.SESSION_START_HOOK_UNDER_TEST || join(root, ".claude/hooks/session-start-identity.cjs");
let failed = 0;
const t = (name, cond, got) => { console.log(`  ${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : `\n    got: ${got}`}`); if (!cond) failed++; };
const box = mkdtempSync(join(tmpdir(), "session-start-gates-"));
const FILES = [".grimorio/hooks/session-start-identity.mjs", ".grimorio/hooks/ensure-git-hooks.mjs",
  ".grimorio/hooks/installation-config.mjs", ".grimorio/scripts/install-hooks.sh", ".claude/grimorio-config.json"];

function clone(name) {
  const repo = join(box, name);
  execFileSync("git", ["init", "-q", repo]);
  for (const f of FILES) { mkdirSync(dirname(join(repo, f)), { recursive: true }); copyFileSync(join(root, f), join(repo, f)); }
  mkdirSync(join(repo, ".claude/hooks"), { recursive: true });
  copyFileSync(hookUnderTest, join(repo, ".claude/hooks/session-start-identity.cjs"));
  return repo;
}
const start = (repo) => spawnSync(process.execPath, [join(repo, ".claude/hooks/session-start-identity.cjs")], {
  cwd: repo, encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: repo },
  input: JSON.stringify({ hook_event_name: "SessionStart", session_source: "startup" }),
}).stdout;

const fresh = clone("fresh");
let out = start(fresh);
t("a fresh clone gets its identity", out.includes("TOP-LEVEL SESSION"), out.slice(0, 120));
t("a fresh clone gets both gate shims", existsSync(join(fresh, ".git/hooks/pre-commit")) && existsSync(join(fresh, ".git/hooks/pre-push")), "no shims");
t("a clean install adds no line about the gates", !out.includes("grimorio git gates"), out.slice(0, 200));

const broken = clone("broken");
writeFileSync(join(broken, ".grimorio/hooks/ensure-git-hooks.mjs"), "export function ensureGitHooks( {\n");
out = start(broken);
t("an installer that cannot load still leaves the identity", out.includes("TOP-LEVEL SESSION"), out.slice(0, 120) || "(no output)");
t("an installer that cannot load says so in one line", out.includes("grimorio git gates"), out.slice(0, 200) || "(no output)");

const foreign = clone("foreign");
mkdirSync(join(foreign, ".git/hooks"), { recursive: true });
writeFileSync(join(foreign, ".git/hooks/pre-commit"), "#!/bin/sh\necho MY-OWN-LINT\n");
out = start(foreign);
t("a foreign hook is kept, and the session is told", readFileSync(join(foreign, ".git/hooks/pre-commit"), "utf8").includes("MY-OWN-LINT")
  && out.includes("grimorio git gates") && out.includes("TOP-LEVEL SESSION"), out.slice(0, 200));

rmSync(box, { recursive: true, force: true });
console.log(failed ? `session-start-git-gates selftest: ${failed} FAILED` : "session-start-git-gates selftest: all cases passed");
process.exit(failed ? 1 : 0);
