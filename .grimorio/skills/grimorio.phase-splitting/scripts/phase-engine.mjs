#!/usr/bin/env node
// @keep-comment — a cross-file contract note: the subcommand list, manifest shape, and log-line field
// names below are read by name from other files (system-keeper-improve-and-validate-mode.md's own step 4
// greps the transition log by cmd/chain/from/to/on), not just descriptive prose about this file alone.
// General, chain-agnostic phase-hand-off engine. No chain data lives in this file — every chain is a
// manifest at `<agent>-phases/chain.json` (searched under .claude/, or pointed at directly with
// --manifest). Supersedes the old per-agent-hardcoded
// .grimorio/skills/grimorio.agent-writing/system-keeper-phases/scripts/phase-server.mjs.
//
// Subcommands (space-separated `--flag value`, or `--flag=value` — both accepted):
//   list   --chain <agent> [--manifest <path>]
//   start  --chain <agent> [--at <id>] [--run <id>] [--manifest <path>]
//   next   --run <id> --on <condition>
//   jump   --run <id> --to <id> --reason "..."
//   record --run <id> <artifact-name> [path]
//   status --run <id>
//   assert --run <id> visited <id> | produced <name> | at <id>
//   verify-chain --run <id>
//   facts  --target <path>[,<path>...]
//
// @keep-comment
// Manifest shape: { agent, entry, phases: [{ id, file, loads?, requires?, produces?, "produces-exempt"?,
// next, desc? }] }. `requires`/`produces` gate `record`/`next`/`start --at`; `loads` and `desc` are
// informational, printed verbatim in the pointer. A phase with neither requires nor produces is a legal
// pure passthrough. `produces-exempt` is OPTIONAL: `next` condition names, on this SAME phase, for which
// the OUTGOING produces check is skipped (a declared loop-back, going back to redo work) — never exempts
// the INCOMING `requires` check, never applies to `jump` (already unconditionally exempt, see below).
//
// Run state: .grimorio/.cache/phase-runs/<run-id>.json — { chain, currentPhase, visited, artifacts, startedAt }.
// Transition log: .grimorio/.cache/phase-server-log.jsonl (unchanged path/shape from the old engine) — every
// `next`/`jump` line keeps the fields cmd/chain/from/to/on (jump: reason instead of on), because
// system-keeper-improve-and-validate-mode.md step 4 already greps this file by those exact names.

import { existsSync } from "node:fs";
import { extname, dirname, join } from "node:path";
import {
  usageError,
  resolveManifestPath,
  loadManifest,
  runStatePath,
  loadRunState,
  saveRunState,
  genRunId,
  log,
} from "./phase-store.mjs";
import { cmdVerifyChain } from "./verify-chain.mjs";

// Consumes one `--flag`/`--flag=value`/`--flag value` token at argv[i], writes it into `flags`, and
// returns the index to resume the walk from. For the space-separated form this returns i+1 (the value
// token's own index) — the caller's own for-loop increment then advances past it — never a prefix
// filter, which would let the value token fall through and be misread as positional (see traps.md).
function consumeFlagToken(argv, i, token, flags) {
  const eq = token.indexOf("=");
  if (eq !== -1) {
    flags[token.slice(2, eq)] = token.slice(eq + 1);
    return i;
  }
  const key = token.slice(2);
  const next = argv[i + 1];
  if (next !== undefined && !next.startsWith("--")) {
    flags[key] = next;
    return i + 1;
  }
  flags[key] = true;
  return i;
}

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      i = consumeFlagToken(argv, i, a, flags);
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function printPointer(runId, manifest, phaseId) {
  const phase = manifest.byId.get(phaseId);
  const idx = manifest.phases.findIndex((p) => p.id === phaseId) + 1;
  const total = manifest.phases.length;
  console.log(`RUN ${runId}`);
  console.log(`PHASE ${phaseId} · ${phase.desc || ""} · ${idx} of ${total}`);
  console.log(`READ  ${phase.file}`);
  const loads = phase.loads && phase.loads.length ? phase.loads.join(" · ") : "none";
  console.log(`LOAD  ${loads}`);
  const produces = phase.produces && phase.produces.length ? phase.produces.join(", ") : "none";
  console.log(`PRODUCES ${produces}`);
  const nextMap = phase.next || {};
  if (Object.keys(nextMap).length === 0) {
    console.log("TERMINAL — no further hand-off");
  } else {
    console.log(
      `DONE WHEN you run: node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs next --run ${runId} --on <condition>`,
    );
  }
}

function cmdList(flags) {
  const chainName = flags.chain || "system-keeper";
  const manifest = loadManifest(resolveManifestPath(chainName, flags.manifest));
  for (const p of manifest.phases) console.log(`${p.id}\t${p.file}\t${p.desc || ""}`);
  process.exit(0);
}

// WHEN `--run` names an EXISTING run ⟶ this resumes it (prints the pointer for wherever it already is
// and exits) rather than falling through to fresh-start logic below. Never returns on that path.
function resolveOrResumeRun(flags, chainName, manifest) {
  const runId = flags.run;
  if (!runId || !existsSync(runStatePath(runId))) return;
  const state = loadRunState(runId);
  if (state.chain !== chainName) {
    usageError(`--run "${runId}" belongs to chain "${state.chain}", not "${chainName}"`);
  }
  printPointer(runId, manifest, state.currentPhase);
  process.exit(0);
}

// Brand-new run: zero artifacts have ever been recorded, so every requires entry is missing by
// construction. This is the deliberate `--at` refusal (design decision, not an --assume escape).
function assertStartRequires(startPhase, phaseNode) {
  const requires = phaseNode.requires || [];
  if (requires.length === 0) return;
  console.error(
    `ERROR: cannot start at phase "${startPhase}": requires artifact(s) not recorded for this new run: ${requires.join(", ")}`,
  );
  process.exit(1);
}

function cmdStart(flags) {
  const chainName = flags.chain || "system-keeper";
  const manifest = loadManifest(resolveManifestPath(chainName, flags.manifest));
  resolveOrResumeRun(flags, chainName, manifest);

  const runId = flags.run || genRunId();
  const startPhase = flags.at || manifest.entry;
  if (!manifest.byId.has(startPhase)) usageError(`unknown phase id "${startPhase}" in chain "${chainName}"`, 2);
  const phaseNode = manifest.byId.get(startPhase);
  assertStartRequires(startPhase, phaseNode);

  const state = {
    chain: chainName,
    currentPhase: startPhase,
    visited: [startPhase],
    artifacts: {},
    startedAt: new Date().toISOString(),
  };
  saveRunState(runId, state);
  log({ cmd: "start", chain: chainName, run: runId, from: null, to: startPhase });
  printPointer(runId, manifest, startPhase);
  process.exit(0);
}

function assertPhaseRequiresRecorded(phase, runId, state) {
  const requires = phase.requires || [];
  const missing = requires.filter((name) => !state.artifacts[name]);
  if (missing.length === 0) return;
  console.error(
    `ERROR: phase "${phase.id}" requires artifact(s) not yet recorded for run "${runId}": ${missing.join(", ")}`,
  );
  process.exit(1);
}

// CEO ruling: `requires` (incoming precondition) and `produces` (outgoing promise) are BOTH checked on
// `next`, together — an artifact with no downstream `requires` consumer was previously never enforced.
// `jump` stays exempt from both checks on purpose (see the module header note above).

// `condition` is the `next` edge taken; WHEN it's in the phase's own `produces-exempt` array, skip this
// check for this call only — every OTHER condition from the phase still enforces it as before.
function assertPhaseProducesRecorded(phase, runId, state, condition) {
  const exempt = phase["produces-exempt"] || [];
  if (exempt.includes(condition)) return;
  const produces = phase.produces || [];
  const missing = produces.filter((name) => !state.artifacts[name]);
  if (missing.length === 0) return;
  console.error(
    `ERROR: phase "${phase.id}" has not recorded its own produces artifact(s) for run "${runId}": ${missing.join(", ")}`,
  );
  process.exit(1);
}

// CEO ruling: entering a phase (via `next` or `jump`) clears exactly THAT phase's own `produces`
// names from state.artifacts, so a stale record from a prior visit can never satisfy the gate on a
// later departure without being re-earned. Scope is this phase's own `produces` ONLY — never
// `requires`, never another phase's artifacts. A first-ever visit has nothing to clear (no-op).
function clearOwnProducesOnEntry(targetPhase, state) {
  for (const name of targetPhase.produces || []) delete state.artifacts[name];
}

function resolveNextTarget(phase, condition, manifest, chainName) {
  const nextMap = phase.next || {};
  const target = nextMap[condition];
  if (!target) {
    const valid = Object.keys(nextMap);
    console.error(
      `ERROR: no transition from "${phase.id}" on condition "${condition}" in chain "${chainName}". ` +
        `Valid conditions from "${phase.id}": ${valid.join(", ") || "(none — this phase is terminal)"}`,
    );
    process.exit(1);
  }
  if (!manifest.byId.has(target)) usageError(`manifest error: phase "${phase.id}" points to unknown target "${target}"`, 2);
  return target;
}

function cmdNext(flags) {
  const runId = flags.run;
  const condition = flags.on;
  if (!runId || !condition) usageError("next requires --run <id> and --on <condition>");
  const state = loadRunState(runId);
  const manifest = loadManifest(resolveManifestPath(state.chain, flags.manifest));
  const phase = manifest.byId.get(state.currentPhase);
  if (!phase) usageError(`run "${runId}" is at unknown phase "${state.currentPhase}" in chain "${state.chain}"`, 2);

  assertPhaseRequiresRecorded(phase, runId, state);
  assertPhaseProducesRecorded(phase, runId, state, condition);
  const target = resolveNextTarget(phase, condition, manifest, state.chain);
  clearOwnProducesOnEntry(manifest.byId.get(target), state);

  state.currentPhase = target;
  state.visited.push(target);
  saveRunState(runId, state);
  log({ cmd: "next", chain: state.chain, run: runId, from: phase.id, to: target, on: condition });
  printPointer(runId, manifest, target);
  process.exit(0);
}

function cmdJump(flags) {
  const runId = flags.run;
  const to = flags.to;
  const reason = flags.reason;
  if (!runId || !to || !reason) usageError('jump requires --run <id>, --to <id>, and --reason "<why>"');
  const state = loadRunState(runId);
  const manifest = loadManifest(resolveManifestPath(state.chain, flags.manifest));
  if (!manifest.byId.has(to)) usageError(`unknown node id "${to}" in chain "${state.chain}"`, 2);
  clearOwnProducesOnEntry(manifest.byId.get(to), state);

  const from = state.currentPhase;
  state.currentPhase = to;
  state.visited.push(to);
  saveRunState(runId, state);
  log({ cmd: "jump", chain: state.chain, run: runId, from, to, reason });
  printPointer(runId, manifest, to);
  process.exit(0);
}

function assertArtifactProduced(phase, artifactName) {
  const produces = phase.produces || [];
  if (produces.includes(artifactName)) return;
  console.error(
    `ERROR: artifact "${artifactName}" is not listed in phase "${phase.id}"'s own produces array. ` +
      `Valid: ${produces.join(", ") || "(none)"}`,
  );
  process.exit(2);
}

function cmdRecord(flags, positional) {
  const runId = flags.run;
  const [artifactName, path] = positional;
  if (!runId || !artifactName) usageError("record requires --run <id> <artifact-name> [path]");
  const state = loadRunState(runId);
  const manifest = loadManifest(resolveManifestPath(state.chain, flags.manifest));
  const phase = manifest.byId.get(state.currentPhase);
  if (!phase) usageError(`run "${runId}" is at unknown phase "${state.currentPhase}" in chain "${state.chain}"`, 2);

  assertArtifactProduced(phase, artifactName);

  state.artifacts[artifactName] = { path: path ?? null, phase: phase.id, ts: new Date().toISOString() };
  saveRunState(runId, state);
  log({ cmd: "record", chain: state.chain, run: runId, phase: phase.id, artifact: artifactName, path: path ?? null });
  console.log(`RECORDED ${artifactName}${path ? ` PATH ${path}` : ""}`);
  process.exit(0);
}

function cmdStatus(flags) {
  const runId = flags.run;
  if (!runId) usageError("status requires --run <id>");
  const state = loadRunState(runId);
  console.log(`RUN ${runId}`);
  console.log(`CHAIN ${state.chain}`);
  console.log(`PHASE ${state.currentPhase}`);
  console.log(`VISITED ${state.visited.join(" -> ")}`);
  console.log("ARTIFACTS");
  const names = Object.keys(state.artifacts);
  if (names.length === 0) {
    console.log("  (none)");
  } else {
    for (const name of names) {
      const a = state.artifacts[name];
      console.log(`  ${name}\tphase=${a.phase}\tpath=${a.path ?? "-"}\tts=${a.ts}`);
    }
  }
  process.exit(0);
}

function cmdAssert(flags, positional) {
  const runId = flags.run;
  const [mode, value] = positional;
  if (!runId || !mode || !value) {
    usageError("assert requires --run <id> and one of: visited <id> | produced <name> | at <id>");
  }
  const state = loadRunState(runId);
  let ok;
  if (mode === "visited") ok = state.visited.includes(value);
  else if (mode === "produced") ok = Object.prototype.hasOwnProperty.call(state.artifacts, value);
  else if (mode === "at") ok = state.currentPhase === value;
  else usageError(`assert: unknown mode "${mode}" — expected visited | produced | at`);
  console.log(ok ? `OK ${mode} ${value}` : `FAIL ${mode} ${value}`);
  process.exit(ok ? 0 : 1);
}

// Computes plain filesystem facts about a target (exists, extension, chain.json sibling) -- never a
// decision. See the commit message for which phase-file fields this replaces.
function cmdFacts(flags) {
  const raw = flags.target;
  if (!raw) usageError("facts requires --target <path>[,<path>...]");
  const targets = String(raw).split(",").map((s) => s.trim()).filter(Boolean);
  // FINDING-06 (code-reviewer, cycle 1): matches check-comment-blocks.mjs's own SOURCE convention
  // (.ts/.tsx/.py/.go are all live script extensions in this repo's own developer agents).
  const SCRIPT_EXT = [".cjs", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".sh", ".py", ".go"];
  for (const t of targets) {
    const exists = existsSync(t);
    const ext = extname(t) || "(none)";
    const scriptModelBoundary = SCRIPT_EXT.includes(extname(t));
    const chainJsonSibling = existsSync(join(dirname(t), "chain.json"));
    console.log(
      `${t}: exists=${exists} ext=${ext} script-model-boundary=${scriptModelBoundary} chain-json-sibling=${chainJsonSibling}`
    );
  }
  process.exit(0);
}

const [, , cmd, ...rest] = process.argv;
const { flags, positional } = parseArgs(rest);
switch (cmd) {
  case "list":
    cmdList(flags);
    break;
  case "start":
    cmdStart(flags);
    break;
  case "next":
    cmdNext(flags);
    break;
  case "jump":
    cmdJump(flags);
    break;
  case "record":
    cmdRecord(flags, positional);
    break;
  case "status":
    cmdStatus(flags);
    break;
  case "assert":
    cmdAssert(flags, positional);
    break;
  case "verify-chain":
    cmdVerifyChain(flags);
    break;
  case "facts":
    cmdFacts(flags);
    break;
  default:
    usageError(`unknown or missing subcommand "${cmd ?? ""}"`);
}
