// SessionStart: .git/hooks is not versioned, so install grimorio's two gate shims through install-hooks.sh when one
// is missing, stale or not executable. Acts only at the root of a repo where grimorio is installed and gitGates is
// on, never on a clone with its own core.hooksPath, and never over a hook that is not grimorio's. Never throws.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { isGrimorioInstalled, loadInstallationConfig } from "./installation-config.mjs";

const SHIMS = ["pre-commit", "pre-push"];
/** The line install-hooks.sh writes into every current shim; an older shim of ours lacks it. */
export const SHIM_MARK = "# grimorio gate shim v2";

/** Each shim's state: current, missing, not-executable, stale (an older grimorio shim) or foreign. */
function shimState(file) {
  if (!existsSync(file)) return "missing";
  const text = readFileSync(file, "utf8");
  if (!text.includes(SHIM_MARK)) return /grimorio/i.test(text) ? "stale" : "foreign";
  return statSync(file).mode & 0o111 ? "current" : "not-executable";
}

/**
 * Returns present | installed | foreign-hook | disabled | custom-hookspath | skipped | failed.
 * skipped: no installer, grimorio not installed here, or repoRoot is not its repo's top level.
 */
export function ensureGitHooks(repoRoot) {
  try {
    const installer = join(repoRoot, ".grimorio/scripts/install-hooks.sh");
    if (!existsSync(installer) || !isGrimorioInstalled(repoRoot)) return "skipped";
    if (loadInstallationConfig(repoRoot).gitGates.enabled === false) return "disabled";
    const git = (...args) => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (realpathSync(git("rev-parse", "--show-toplevel")) !== realpathSync(repoRoot)) return "skipped";
    let hooksPath = "";
    try { hooksPath = git("config", "core.hooksPath"); } catch { /* unset */ }
    if (hooksPath) return "custom-hookspath";
    const common = git("rev-parse", "--git-common-dir");
    const hooks = join(isAbsolute(common) ? common : join(repoRoot, common), "hooks");
    const states = () => SHIMS.map((name) => shimState(join(hooks, name)));
    const before = states();
    if (before.includes("foreign")) return "foreign-hook";
    if (before.every((s) => s === "current")) return "present";
    execFileSync("bash", [installer], { cwd: repoRoot, stdio: "ignore", timeout: 10000 });
    return states().every((s) => s === "current") ? "installed" : "failed";
  } catch {
    return "failed";
  }
}

/** The one line the session should see for a result, or null when there is nothing to say. */
export function gitHooksNote(result) {
  if (result === "foreign-hook") {
    return "grimorio git gates: this clone already has its own pre-commit or pre-push hook, so grimorio's gates were " +
      "not installed and its commits are not gated by grimorio. Chain or remove that hook, or set gitGates.enabled " +
      "to false in .claude/grimorio-config.local.json to silence this line.";
  }
  if (result === "failed") {
    return "grimorio git gates: installing the pre-commit and pre-push shims failed, so this clone's commits are not " +
      "gated. Run `bash .grimorio/scripts/install-hooks.sh` to see why.";
  }
  return null;
}
