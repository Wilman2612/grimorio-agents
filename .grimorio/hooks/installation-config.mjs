// Reads .claude/grimorio-config.json (committed, English defaults) and shallow-merges
// .claude/grimorio-config.local.json (gitignored, this installation's own override) on top.
// Design: ref:memory/grimorio.system-design-memory/designs/platform/installation-config/design.md
import { readFileSync, existsSync } from "fs";
import path from "path";

const projectRoot = process.env.CLAUDE_PROJECT_DIR || ".";
const cache = new Map();

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

/** True WHEN grimorio is installed at `root`: its committed config is there. */
export function isGrimorioInstalled(root = projectRoot) {
  return existsSync(path.join(root, ".claude/grimorio-config.json"));
}

export function loadInstallationConfig(root = projectRoot) {
  if (cache.has(root)) return cache.get(root);
  const COMMITTED = path.join(root, ".claude/grimorio-config.json");
  const LOCAL = path.join(root, ".claude/grimorio-config.local.json");
  if (!existsSync(COMMITTED)) {
    throw new Error(`installation-config: missing committed config at ${COMMITTED}`);
  }
  const committed = readJson(COMMITTED);
  const local = existsSync(LOCAL) ? readJson(LOCAL) : {};
  const tokens = {
    ...committed.tokens,
    ...local.tokens,
    categories: { ...committed.tokens.categories, ...(local.tokens && local.tokens.categories) },
  };
  const config = {
    language: local.language || committed.language,
    tokens,
    writeGuard: local.writeGuard || committed.writeGuard,
    grimorioOwnedPrefixes: local.grimorioOwnedPrefixes || committed.grimorioOwnedPrefixes,
    gitGates: { enabled: true, ...committed.gitGates, ...local.gitGates },
  };
  cache.set(root, config);
  return config;
}
