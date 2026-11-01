#!/usr/bin/env node
// @subject: .grimorio/hooks/ensure-git-hooks.mjs
// A grimorio clone with no git hooks gets both shims on SessionStart; a wired clone is left as is. A clone that is
// not grimorio's root, has gitGates off, its own core.hooksPath, or a hook of its own is never written to.
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const { ensureGitHooks, gitHooksNote, SHIM_MARK } = await import(pathToFileURL(join(root, ".grimorio/hooks/ensure-git-hooks.mjs")).href);
let failed = 0;
const t = (name, cond, got) => { console.log(`  ${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : ` (got ${got})`}`); if (!cond) failed++; };
const box = mkdtempSync(join(tmpdir(), "ensure-git-hooks-"));

// A throwaway grimorio clone: its installer and its committed config, nothing else.
function grimorioRepo(name, { installer = true, config = true } = {}) {
  const repo = join(box, name);
  execFileSync("git", ["init", "-q", repo]);
  mkdirSync(join(repo, ".grimorio/scripts"), { recursive: true });
  mkdirSync(join(repo, ".claude"), { recursive: true });
  if (installer) copyFileSync(join(root, ".grimorio/scripts/install-hooks.sh"), join(repo, ".grimorio/scripts/install-hooks.sh"));
  if (config) copyFileSync(join(root, ".claude/grimorio-config.json"), join(repo, ".claude/grimorio-config.json"));
  return repo;
}
const hookOf = (repo) => (n) => join(repo, ".git/hooks", n);

t("no installer -> skipped", ensureGitHooks(grimorioRepo("no-installer", { installer: false })) === "skipped", "");
t("grimorio not installed (no config) -> skipped", ensureGitHooks(grimorioRepo("no-config", { config: false })) === "skipped", "");

const repo = grimorioRepo("main");
const hook = hookOf(repo);
let r = ensureGitHooks(repo);
t("bare clone -> installed", r === "installed", r);
t("both shims carry the mark and point at the repo's own scripts",
  readFileSync(hook("pre-commit"), "utf8").includes(SHIM_MARK) && readFileSync(hook("pre-commit"), "utf8").includes(".grimorio/scripts/pre-commit.sh")
  && readFileSync(hook("pre-push"), "utf8").includes(".grimorio/scripts/pre-push.sh"), "missing shim");
r = ensureGitHooks(repo);
t("wired clone -> present", r === "present", r);

rmSync(hook("pre-push"));
r = ensureGitHooks(repo);
t("one shim missing -> installed again", r === "installed" && existsSync(hook("pre-push")), r);

writeFileSync(hook("pre-commit"), '#!/usr/bin/env bash\nexec bash "$(git rev-parse --show-toplevel)/.grimorio/scripts/pre-commit.sh" "$@"\n');
r = ensureGitHooks(repo);
t("older grimorio shim -> replaced by the current one", r === "installed" && readFileSync(hook("pre-commit"), "utf8").includes(SHIM_MARK), r);

chmodSync(hook("pre-commit"), 0o644);
r = ensureGitHooks(repo);
t("shim without the executable bit -> installed again, executable", r === "installed", r);

writeFileSync(hook("pre-commit"), "#!/bin/sh\necho MY-OWN-LINT\n");
r = ensureGitHooks(repo);
t("a hook of its own -> foreign-hook, left untouched", r === "foreign-hook" && readFileSync(hook("pre-commit"), "utf8").includes("MY-OWN-LINT"), r);
t("foreign-hook and failed each give the session one line; present gives none",
  gitHooksNote("foreign-hook") !== null && gitHooksNote("failed") !== null && gitHooksNote("present") === null, "");
const manual = spawnSync("bash", [join(repo, ".grimorio/scripts/install-hooks.sh")], { cwd: repo, encoding: "utf8" });
t("install-hooks.sh run by hand also leaves a foreign hook alone, and says so",
  manual.status !== 0 && readFileSync(hook("pre-commit"), "utf8").includes("MY-OWN-LINT") && /left alone/.test(manual.stderr), manual.stderr);

const off = grimorioRepo("off");
writeFileSync(join(off, ".claude/grimorio-config.local.json"), JSON.stringify({ gitGates: { enabled: false } }));
r = ensureGitHooks(off);
t("gitGates off in the local config -> disabled, nothing written", r === "disabled" && !existsSync(hookOf(off)("pre-commit")), r);

const parent = join(box, "parent");
execFileSync("git", ["init", "-q", parent]);
const nested = join(parent, "vendor", "grimorio");
mkdirSync(join(nested, ".grimorio/scripts"), { recursive: true });
mkdirSync(join(nested, ".claude"), { recursive: true });
copyFileSync(join(root, ".grimorio/scripts/install-hooks.sh"), join(nested, ".grimorio/scripts/install-hooks.sh"));
copyFileSync(join(root, ".claude/grimorio-config.json"), join(nested, ".claude/grimorio-config.json"));
r = ensureGitHooks(nested);
t("grimorio nested inside another repo -> skipped, the outer repo untouched", r === "skipped" && !existsSync(join(parent, ".git/hooks/pre-commit")), r);

const custom = grimorioRepo("custom");
execFileSync("git", ["config", "core.hooksPath", ".githooks"], { cwd: custom });
r = ensureGitHooks(custom);
t("own core.hooksPath -> left alone", r === "custom-hookspath" && !existsSync(hookOf(custom)("pre-commit")), r);

rmSync(box, { recursive: true, force: true });
console.log(failed ? `ensure-git-hooks selftest: ${failed} FAILED` : "ensure-git-hooks selftest: all cases passed");
process.exit(failed ? 1 : 0);
