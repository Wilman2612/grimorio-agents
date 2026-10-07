// Shared manifest-loading and run-state I/O primitives, used by BOTH phase-engine.mjs (the CLI dispatch
// for list/start/next/jump/record/status/assert) and verify-chain.mjs (the verify-chain subcommand's own
// implementation). Split out so neither of those two files imports the other — a two-way dependency
// between them — while both still need the same manifest/run-state plumbing.

import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { findRepoRoot } from "./repo-root.mjs";
import { cachePath } from "../../../../.grimorio/scripts/refobl/cache-paths.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = findRepoRoot(HERE);
export const RUNS_DIR = cachePath("phase-runs", REPO_ROOT);
export const LOG_PATH = cachePath("phase-server-log.jsonl", REPO_ROOT);

export function usageError(msg, code = 2) {
  console.error(`USAGE ERROR: ${msg}`);
  console.error(
    'node phase-engine.mjs list --chain <agent> | start --chain <agent> [--at <id>] [--run <id>] | ' +
      'next --run <id> --on <condition> | jump --run <id> --to <id> --reason "..." | ' +
      'record --run <id> <artifact-name> [path] | status --run <id> | ' +
      'assert --run <id> visited <id>|produced <name>|at <id> | verify-chain --run <id>',
  );
  process.exit(code);
}

// A manifest lives at some `<chain>-phases/chain.json` under .claude/ or .grimorio/ — never a hardcoded
// per-chain path. The walk is bounded to those two roots (where every grimorio skill/agent lives, split
// by export boundary per the grimorio-dir-move branch), not the whole repo.
function walkForManifest(dir, target, skip, found) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (!e.isDirectory() || skip.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.name === target) {
      const manifest = join(full, "chain.json");
      if (existsSync(manifest)) found.push(manifest);
    }
    walkForManifest(full, target, skip, found);
  }
}

function findManifestCandidates(chainName) {
  const target = `${chainName}-phases`;
  const SKIP = new Set(["node_modules", ".git", "tmp", ".cache"]);
  const roots = [join(REPO_ROOT, ".claude"), join(REPO_ROOT, ".grimorio")];
  const found = [];
  for (const root of roots) {
    if (existsSync(root)) walkForManifest(root, target, SKIP, found);
  }
  return found;
}

export function resolveManifestPath(chainName, manifestFlag) {
  if (manifestFlag && manifestFlag !== true) {
    const p = join(REPO_ROOT, manifestFlag);
    if (!existsSync(p)) usageError(`--manifest path does not exist: ${manifestFlag}`);
    return p;
  }
  // An agent's own canonical name carries the "grimorio." prefix (its chain.json `agent` field stores
  // it in full); the manifest directory on disk is named bare (`<chain>-phases/`). Accept either form,
  // identical to .grimorio/scripts/measure-agent-load.mjs's own normalization, so `--chain grimorio.system-keeper`
  // and `--chain system-keeper` both resolve to the same manifest.
  const bareChain = chainName.startsWith("grimorio.") ? chainName.slice("grimorio.".length) : chainName;
  const matches = findManifestCandidates(bareChain);
  if (matches.length === 0) {
    usageError(
      `unknown --chain "${chainName}": no <chain>-phases/chain.json found under .claude/ or .grimorio/. ` +
        `Pass --manifest <path> to point at one explicitly.`,
    );
  }
  if (matches.length > 1) {
    const rel = matches.map((m) => relative(REPO_ROOT, m)).join(", ");
    usageError(`ambiguous --chain "${chainName}": multiple manifests found (${rel}). Pass --manifest <path>.`);
  }
  return matches[0];
}

function readManifestJson(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    usageError(`cannot read manifest ${path}: ${e.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    usageError(`manifest ${path} is not valid JSON: ${e.message}`);
  }
}

export function loadManifest(path) {
  const data = readManifestJson(path);
  if (!data.agent || !data.entry || !Array.isArray(data.phases)) {
    usageError(`manifest ${path} missing agent/entry/phases`);
  }
  const byId = new Map();
  for (const p of data.phases) {
    if (!p.id || !p.file) usageError(`manifest ${path} has a phase missing id/file`);
    byId.set(p.id, p);
  }
  if (!byId.has(data.entry)) usageError(`manifest ${path} entry "${data.entry}" is not a declared phase`);
  return { ...data, byId };
}

export function runStatePath(runId) {
  return join(RUNS_DIR, `${runId}.json`);
}

export function loadRunState(runId) {
  const p = runStatePath(runId);
  if (!existsSync(p)) usageError(`unknown --run "${runId}": no state file at ${relative(REPO_ROOT, p)}`);
  return JSON.parse(readFileSync(p, "utf8"));
}

export function saveRunState(runId, state) {
  mkdirSync(RUNS_DIR, { recursive: true });
  writeFileSync(runStatePath(runId), JSON.stringify(state, null, 2) + "\n");
}

export function genRunId() {
  for (;;) {
    const id = Date.now().toString(36).slice(-4) + "-" + Math.random().toString(36).slice(2, 6);
    if (!existsSync(runStatePath(id))) return id;
  }
}

export function log(entry) {
  mkdirSync(dirname(LOG_PATH), { recursive: true });
  appendFileSync(LOG_PATH, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n");
}
