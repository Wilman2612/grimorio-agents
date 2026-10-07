// The `verify-chain` subcommand's own implementation, split out of phase-engine.mjs to keep that file
// under the repo's own size limit (.grimorio/scripts/check-file-size.mjs --limit 500). Exports cmdVerifyChain, the
// single entry point phase-engine.mjs's own `case "verify-chain":` dispatch calls.

import { readFileSync, existsSync } from "node:fs";
import { usageError, LOG_PATH, loadRunState, loadManifest, resolveManifestPath } from "./phase-store.mjs";

// Recovers which condition (or jump) each phase was departed on — order matches state.visited 1:1.
function readRunTransitions(runId) {
  if (!existsSync(LOG_PATH)) return [];
  const lines = readFileSync(LOG_PATH, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return lines.filter((e) => e.run === runId && (e.cmd === "next" || e.cmd === "jump"));
}

function buildDeparturesByPhase(runId) {
  const map = new Map();
  for (const t of readRunTransitions(runId)) {
    (map.get(t.from) ?? map.set(t.from, []).get(t.from)).push(t);
  }
  return map;
}

// null WHEN `phase`'s own produces are satisfied (present, or every logged departure used a `next`
// condition in its own `produces-exempt` list — `jump` never grants this exemption); else the problem string.
function checkPhaseProduces(phase, state, departuresByPhase) {
  const produces = phase.produces || [];
  const missing = produces.filter((name) => !state.artifacts[name]);
  if (missing.length === 0) return null;
  const exempt = phase["produces-exempt"] || [];
  const departures = departuresByPhase.get(phase.id) || [];
  const allExempt = departures.length > 0 && departures.every((d) => d.cmd === "next" && exempt.includes(d.on));
  return allExempt ? null : `phase "${phase.id}" missing produces artifact(s): ${missing.join(", ")}`;
}

function checkVisitedPhase(id, state, manifest, departuresByPhase) {
  const phase = manifest.byId.get(id);
  if (!phase) return `phase "${id}" was visited but is no longer declared in ${state.chain}'s own chain.json`;
  return checkPhaseProduces(phase, state, departuresByPhase);
}

function countPresentArtifacts(phase, state) {
  return (phase.produces || []).filter((name) => state.artifacts[name]).length;
}

// @keep-comment
// A TERMINAL phase is one with no outgoing `next` conditions at all. The distinction is load-bearing for
// `cmdVerifyChain` below, and ONLY there: `checkProduces` in phase-engine.mjs fires on a DEPARTURE, so a
// phase that can still be departed has a future moment in which to earn its own produces, and excluding it
// while it is current is correct. A terminal phase has no such moment — sitting in it IS the close. Without
// this distinction a `produces` declared on a terminal phase is INERT: `next` never fires for it (no edges)
// and `verify-chain` skipped it (it is always the current phase at the end of a run), so the engine reported
// CHAIN VERIFIED on a run whose final phase had recorded nothing.
// @keep-comment
function isTerminal(phase) {
  return !phase || Object.keys(phase.next || {}).length === 0;
}

// Every visited phase must pass checkVisitedPhase above — see that function's own comment for the
// produces-exempt loop-back carve-out. The CURRENT phase is excluded only while it is still DEPARTABLE
// (mid-transition, its produces still earnable on the way out); a current phase that is TERMINAL is checked,
// per isTerminal above.
export function cmdVerifyChain(flags) {
  const runId = flags.run;
  if (!runId) usageError("verify-chain requires --run <id>");
  const state = loadRunState(runId);
  const manifest = loadManifest(resolveManifestPath(state.chain, flags.manifest));
  const departuresByPhase = buildDeparturesByPhase(runId);
  const toCheck = [...new Set(state.visited)].filter(
    (id) => id !== state.currentPhase || isTerminal(manifest.byId.get(id)),
  );
  const problems = toCheck.map((id) => checkVisitedPhase(id, state, manifest, departuresByPhase)).filter(Boolean);
  if (problems.length > 0) {
    console.error(`CHAIN BROKEN — run "${runId}":`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  const artifactsConfirmed = toCheck.reduce((sum, id) => sum + countPresentArtifacts(manifest.byId.get(id), state), 0);
  console.log(`CHAIN VERIFIED: ${toCheck.length} phases, ${artifactsConfirmed} artifacts confirmed`);
  process.exit(0);
}
