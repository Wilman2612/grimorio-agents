#!/usr/bin/env node
// @subject: .grimorio/hooks/ensure-git-hooks.mjs
// A clone with no git hooks gets both shims on SessionStart; a wired clone is left as is; a clone with its own
// core.hooksPath, or with no installer, is never touched.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const { ensureGitHooks } = await import(pathToFileURL(join(root, ".grimorio/hooks/ensure-git-hooks.mjs")).href);
let failed = 0;
const t = (name, cond, got) => { console.log(`  ${cond ? "ok  " : "FAIL"}  ${name}${cond ? "" : ` (got ${got})`}`); if (!cond) failed++; };

const repo = mkdtempSync(join(tmpdir(), "ensure-git-hooks-"));
execFileSync("git", ["init", "-q", repo]);
mkdirSync(join(repo, ".grimorio/scripts"), { recursive: true });

t("no installer -> skipped", ensureGitHooks(repo) === "skipped", ensureGitHooks(repo));

copyFileSync(join(root, ".grimorio/scripts/install-hooks.sh"), join(repo, ".grimorio/scripts/install-hooks.sh"));
let r = ensureGitHooks(repo);
const hook = (n) => join(repo, ".git/hooks", n);
t("bare clone -> installed", r === "installed", r);
t("both shims point at the repo's own scripts",
  existsSync(hook("pre-commit")) && readFileSync(hook("pre-commit"), "utf8").includes(".grimorio/scripts/pre-commit.sh")
  && readFileSync(hook("pre-push"), "utf8").includes(".grimorio/scripts/pre-push.sh"), "missing shim");
r = ensureGitHooks(repo);
t("wired clone -> present", r === "present", r);

rmSync(hook("pre-push"));
r = ensureGitHooks(repo);
t("one shim missing -> installed again", r === "installed" && existsSync(hook("pre-push")), r);

writeFileSync(hook("pre-commit"), '#!/usr/bin/env bash\nexec "$(git rev-parse --show-toplevel)/.grimorio/scripts/pre-commit.sh" "$@"\n');
r = ensureGitHooks(repo);
t("old exec-direct shim -> replaced by the bash shim", r === "installed" && readFileSync(hook("pre-commit"), "utf8").includes("exec bash"), r);

execFileSync("git", ["config", "core.hooksPath", ".githooks"], { cwd: repo });
rmSync(hook("pre-commit"));
r = ensureGitHooks(repo);
t("own core.hooksPath -> left alone", r === "custom-hookspath" && !existsSync(hook("pre-commit")), r);

rmSync(repo, { recursive: true, force: true });
console.log(failed ? `ensure-git-hooks selftest: ${failed} FAILED` : "ensure-git-hooks selftest: all cases passed");
process.exit(failed ? 1 : 0);
