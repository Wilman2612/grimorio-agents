// Reads .claude/grimorio-config.json (committed, English defaults) and shallow-merges
// .claude/grimorio-config.local.json (gitignored, this installation's own override) on top.
// Design: ref:memory/grimorio.system-design-memory/designs/platform/installation-config/design.md
import { readFileSync, existsSync } from "fs";
import path from "path";

const root = process.env.CLAUDE_PROJECT_DIR || ".";
const COMMITTED = path.join(root, ".claude/grimorio-config.json");
const LOCAL = path.join(root, ".claude/grimorio-config.local.json");

let cached = null;

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

export function loadInstallationConfig() {
  if (cached) return cached;
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
  cached = {
    language: local.language || committed.language,
    tokens,
    writeGuard: local.writeGuard || committed.writeGuard,
    grimorioOwnedPrefixes: local.grimorioOwnedPrefixes || committed.grimorioOwnedPrefixes,
  };
  return cached;
}
