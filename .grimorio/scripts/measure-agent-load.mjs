#!/usr/bin/env node
// @keep-comment — a usage contract: the exact CLI flag shapes and word-count method below are what makes
// a re-run of this tool reproducible without guessing, not just descriptive prose about this file alone.
// Reusable, reproducible load measurement for a phased agent's chain — the "before/after with the
// command that produces it, never an estimate" tool. No chain name is hardcoded anywhere below the CLI
// flag; every path is derived from the `--chain <agent>` value plus fixed, generic conventions (the
// `.grimorio/skills/grimorio.agent-writing/<agent>-behavior.md` / `<agent>-phases/` layout both migrated
// chains already share, and the new `<agent>-phases/chain.json` manifest for --mode new).
//
// Word-count method, stated once so a re-run is reproducible without guessing:
//   text.split(/\s+/).filter(Boolean).length
//
// --mode new measures CUMULATIVE UNION along a PATH (floorFiles once, plus each visited phase's own file
// + `loads`, deduped by resolved path) — never a per-phase isolated sum, because nothing unloads between
// phases in one continuous run. --path <id,id,...> walks a given phase-id sequence (validated against the
// manifest); --peak-paths runs every forward-only root-to-terminal path and marks the max PEAK.

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { findRepoRoot } from "../skills/grimorio.phase-splitting/scripts/repo-root.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = findRepoRoot(HERE);
const require = createRequire(import.meta.url);
const resolver = require(join(REPO_ROOT, ".grimorio/scripts/refobl/resolve.cjs"));
const AW = ".grimorio/skills/grimorio.agent-writing";

function wc(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function readDevelop(relPath) {
  try {
    return execFileSync("git", ["show", `develop:${relPath}`], { cwd: REPO_ROOT, encoding: "utf8" });
  } catch (e) {
    throw new Error(`cannot read develop:${relPath} — ${e.message}`);
  }
}

function readLive(relPath) {
  return readFileSync(join(REPO_ROOT, relPath), "utf8");
}

// The old engine's own CHAINS table, read from `develop` rather than the live tree so this keeps working
// even once no live copy of that engine exists, is the only record of which phase files an agent's old
// chain had. Parsed with a small balanced-brace walk rather than hand-listing files per agent, so no
// chain's file list is hardcoded here.
function extractOldChainNodes(oldServerSrc, chain) {
  const keyRe = new RegExp(`"${chain}"\\s*:\\s*\\{`);
  const keyMatch = keyRe.exec(oldServerSrc);
  if (!keyMatch) throw new Error(`chain "${chain}" not found in develop's old phase-server.mjs`);
  const chainBlock = sliceBalanced(oldServerSrc, keyMatch.index + keyMatch[0].length - 1);
  const nodesMatch = /nodes:\s*\{/.exec(chainBlock);
  if (!nodesMatch) throw new Error(`no nodes block found for chain "${chain}" in develop's old phase-server.mjs`);
  const nodesBlock = sliceBalanced(chainBlock, nodesMatch.index + nodesMatch[0].length - 1);
  // A node's own key is a bare identifier for some chains (A, B, MODE) and a quoted numeral for others
  // ("1", "2") — the old source quotes only where a bare token would be invalid JS, so both forms occur.
  const entries = [...nodesBlock.matchAll(/"?(\w+)"?:\s*\{\s*file:\s*`\$\{AW\}\/([^`]+)`/g)];
  const nodes = {};
  for (const [, key, rel] of entries) nodes[key] = `${AW}/${rel}`;
  return nodes;
}

function sliceBalanced(src, openBraceIndex) {
  let depth = 0;
  let i = openBraceIndex;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return src.slice(openBraceIndex, i);
}

function modeOld(chain) {
  const oldServerSrc = readDevelop(`${AW}/system-keeper-phases/scripts/phase-server.mjs`);
  const nodes = extractOldChainNodes(oldServerSrc, chain);
  const { entry, ...rest } = nodes;
  const phaseFiles = Object.values(rest);

  const files = [
    { label: "shell", path: `.claude/agents/grimorio.${chain}.md` },
    { label: "behavior (old, entry)", path: entry },
    { label: "conduct/SKILL.md", path: ".grimorio/skills/grimorio.conduct/SKILL.md" },
    { label: "prompt-reading/SKILL.md", path: ".grimorio/skills/grimorio.prompt-reading/SKILL.md" },
    { label: "phase-splitting/SKILL.md", path: ".grimorio/skills/grimorio.phase-splitting/SKILL.md" },
    ...phaseFiles.map((p) => ({ label: `phase: ${p}`, path: p })),
  ];

  let total = 0;
  const rows = [];
  for (const f of files) {
    const text = readDevelop(f.path);
    const n = wc(text);
    total += n;
    rows.push({ ...f, words: n });
  }
  return { total, rows };
}

function loadLiveManifest(chain) {
  const manifestPath = join(REPO_ROOT, AW, `${chain}-phases`, "chain.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`no live manifest at ${relative(REPO_ROOT, manifestPath)} — has chain.json been created yet?`);
  }
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function floorFiles(chain) {
  return [
    { label: "shell", path: `.claude/agents/grimorio.${chain}.md` },
    { label: "behavior (new, adapter)", path: `${AW}/${chain}-behavior.md` },
    { label: "conduct/SKILL.md", path: ".grimorio/skills/grimorio.conduct/SKILL.md" },
    { label: "prompt-reading/SKILL.md", path: ".grimorio/skills/grimorio.prompt-reading/SKILL.md" },
  ];
}

function fileEntry(label, relPath) {
  const abs = join(REPO_ROOT, relPath);
  if (!existsSync(abs)) return { label, path: relPath, abs, words: 0, note: "MISSING" };
  return { label, path: relPath, abs, words: wc(readLive(relPath)) };
}

function sumWords(entries) {
  return entries.reduce((sum, e) => sum + e.words, 0);
}

// Validates a phase-id path against the manifest's own shape: every id must be a real phase, and every
// consecutive pair must be joined by a real `next` edge — refuses (naming the bad id or the failed edge)
// rather than silently measuring a path the chain itself could never actually walk.
function validatePath(chain, manifest, pathIds) {
  const byId = new Map(manifest.phases.map((p) => [p.id, p]));
  for (const id of pathIds) {
    if (!byId.has(id)) throw new Error(`"${id}" is not a real phase in ${chain}'s own chain.json — refusing path`);
  }
  for (let i = 0; i < pathIds.length - 1; i++) {
    const cur = byId.get(pathIds[i]);
    const nxt = pathIds[i + 1];
    const edges = Object.values(cur.next || {});
    if (!edges.includes(nxt)) {
      throw new Error(
        `no edge "${pathIds[i]}" -> "${nxt}" in ${chain}'s own chain.json (phase "${pathIds[i]}" next: ${JSON.stringify(cur.next || {})}) — refusing path`
      );
    }
  }
  return byId;
}

// Walks the path, building a running SET of distinct files keyed by resolved absolute path. Returns one
// step per stage (a synthetic FLOOR stage first, then one per phase in the path) so the caller can print
// both the cumulative total AND exactly which files were newly added at each step.
function walkPath(chain, manifest, pathIds) {
  const byId = validatePath(chain, manifest, pathIds);
  const seen = new Set();
  const steps = [];
  let total = 0;

  function addStep(id, candidates) {
    const added = [];
    for (const c of candidates) {
      if (seen.has(c.abs)) continue;
      seen.add(c.abs);
      added.push(c);
    }
    total += sumWords(added);
    steps.push({ id, added, cumulative: total });
  }

  addStep("FLOOR", floorFiles(chain).map((f) => fileEntry(f.label, f.path)));

  for (const id of pathIds) {
    const phase = byId.get(id);
    const candidates = [fileEntry(`phase: ${phase.file}`, phase.file)];
    for (const loadRef of phase.loads || []) {
      const contentPath = resolver.toContentPath(`ref:${loadRef}`);
      if (!contentPath) throw new Error(`could not resolve load "${loadRef}" for phase "${id}"`);
      candidates.push(fileEntry(`load: ${loadRef}`, contentPath));
    }
    addStep(id, candidates);
  }

  return { steps, total };
}

function printPathTable(chain, manifest, pathIds) {
  const { steps, total } = walkPath(chain, manifest, pathIds);
  console.log(`NEW (live tree) — chain "${chain}" — path ${pathIds.join(" -> ")}`);
  for (const step of steps) {
    console.log(`  after ${step.id.padEnd(6)} — cumulative: ${String(step.cumulative).padStart(6)} words`);
    for (const f of step.added) {
      const note = f.note ? `  [${f.note}]` : "";
      console.log(`      +${String(f.words).padStart(6)}  ${f.label}${note}`);
    }
  }
  console.log(`  PATH TOTAL: ${total} words`);
  return total;
}

// Enumerates every root-to-terminal path through the manifest's own `next` graph, forward-only: an edge
// that would revisit a phase already in the CURRENT path is a dead end for enumeration and is simply not
// followed (never emitted as a truncated "path"), so a back-edge (a loop-back like `defect-found: B`) never
// generates an infinite or a fake-terminal path. A phase with an empty `next` map is the only real terminal.
function enumeratePaths(manifest) {
  const byId = new Map(manifest.phases.map((p) => [p.id, p]));
  const paths = [];

  function dfs(current, path, visited) {
    const nextIds = [...new Set(Object.values(byId.get(current).next || {}))];
    if (nextIds.length === 0) {
      paths.push([...path]);
      return;
    }
    const forward = nextIds.filter((nxt) => !visited.has(nxt)); // back-edges pruned: dead ends for path-enumeration purposes only
    if (forward.length === 0) {
      // Every outgoing edge from `current` is a back-edge already in this path (a cycle-only dead end,
      // no forward escape at all) — this branch is genuinely dropped from the enumerated set, so it must
      // say so loudly rather than silently vanish, per this corpus's measured-not-assumed discipline.
      console.error(
        `WARNING: path enumeration dead-ended at phase "${current}" (all outgoing edges already visited in this path) — no complete path recorded through this branch`,
      );
      return;
    }
    for (const nxt of forward) {
      visited.add(nxt);
      path.push(nxt);
      dfs(nxt, path, visited);
      path.pop();
      visited.delete(nxt);
    }
  }

  dfs(manifest.entry, [manifest.entry], new Set([manifest.entry]));
  return paths;
}

function main() {
  const argv = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq !== -1) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        flags[a.slice(2)] = argv[++i];
      } else {
        flags[a.slice(2)] = true;
      }
    }
  }

  const rawChain = flags.chain;
  if (!rawChain) {
    console.error("USAGE: node .grimorio/scripts/measure-agent-load.mjs --chain <agent> --mode old|new [--path <id>,<id>,...|--peak-paths]");
    process.exit(2);
  }
  // An agent's own canonical name always carries the "grimorio." prefix (its shell file, and chain.json's
  // own `agent` field, both store it in full) — but the lookup keys below (the old CHAINS table, and the
  // live manifest's `<chain>-phases/` directory) are bare. Accept either form so `--chain
  // grimorio.system-keeper` and `--chain system-keeper` both resolve to the same thing.
  const chain = rawChain.startsWith("grimorio.") ? rawChain.slice("grimorio.".length) : rawChain;

  if (flags.mode === "old") {
    const { total, rows } = modeOld(chain);
    console.log(`OLD (develop) — chain "${chain}" — total: ${total} words`);
    for (const r of rows) console.log(`  ${String(r.words).padStart(6)}  ${r.path}`);
    process.exit(0);
  }

  if (flags.mode === "new") {
    const manifest = loadLiveManifest(chain);

    if (flags["peak-paths"]) {
      const paths = enumeratePaths(manifest);
      if (paths.length === 0) {
        throw new Error(`no root-to-terminal path found from entry "${manifest.entry}" in ${chain}'s own chain.json`);
      }
      const results = paths.map((pathIds) => ({ pathIds, total: printPathTable(chain, manifest, pathIds) }));
      console.log();
      const peak = results.reduce((a, b) => (b.total > a.total ? b : a));
      console.log(`Per-path totals:`);
      for (const r of results) {
        const mark = r === peak ? "  PEAK" : "";
        console.log(`  ${r.pathIds.join(" -> ").padEnd(30)} ${String(r.total).padStart(6)} words${mark}`);
      }
      process.exit(0);
    }

    if (!flags.path) {
      console.error("USAGE: --mode new requires --path <id>,<id>,... or --peak-paths");
      process.exit(2);
    }
    const pathIds = String(flags.path).split(",").map((s) => s.trim()).filter(Boolean);
    printPathTable(chain, manifest, pathIds);
    process.exit(0);
  }

  console.error(`USAGE: --mode must be "old" or "new", got "${flags.mode}"`);
  process.exit(2);
}

main();
