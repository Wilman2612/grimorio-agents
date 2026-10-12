// SessionStart: .git/hooks is not versioned, so install grimorio's two gate shims through install-hooks.sh
// whenever one is missing or stale. Returns present | installed | custom-hookspath | skipped | failed; never
// throws, and leaves a clone with its own core.hooksPath alone.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

const SHIMS = { "pre-commit": ".grimorio/scripts/pre-commit.sh", "pre-push": ".grimorio/scripts/pre-push.sh" };

export function ensureGitHooks(repoRoot) {
  try {
    const installer = join(repoRoot, ".grimorio/scripts/install-hooks.sh");
    if (!existsSync(installer)) return "skipped";
    const git = (...args) => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    let hooksPath = "";
    try { hooksPath = git("config", "core.hooksPath"); } catch { /* unset */ }
    if (hooksPath) return "custom-hookspath";
    const common = git("rev-parse", "--git-common-dir");
    const hooks = join(isAbsolute(common) ? common : join(repoRoot, common), "hooks");
    const wired = Object.entries(SHIMS).every(([name, script]) => {
      const f = join(hooks, name);
      return existsSync(f) && readFileSync(f, "utf8").includes(`exec bash "$(git rev-parse --show-toplevel)/${script}"`);
    });
    if (wired) return "present";
    execFileSync("bash", [installer], { cwd: repoRoot, stdio: "ignore", timeout: 10000 });
    return "installed";
  } catch {
    return "failed";
  }
}
