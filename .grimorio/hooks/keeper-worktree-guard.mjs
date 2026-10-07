/* @keep-comment
 * @size-exempt: 679 lines. grimorio.system-keeper / grimorio.hooks tooling owns whether to split it.
 * keeper-worktree-guard.cjs — FOUR responsibilities now, all in this one file, never split into a second
 * hook (grimorio.code-harness's own "Tree ownership" section: "his own order authorizes widening
 * keeper-worktree-guard.cjs's own detection specifically — not inventing a second, different hook"):
 *
 * @keep-comment
 *   1. PreToolUse (Edit|Write|MultiEdit) — the ORIGINAL job, UNCHANGED: DENIES an edit whose resolved
 *      target path lands inside the MAIN TREE while the calling session is itself rooted in a LINKED
 *      WORKTREE, decided automatically from real git identity every invocation. See handleEditGuard()
 *      and deny() below, and the commit that landed the original rewrite for the incident and the prior
 *      marker-based design it replaced.
 *   2. PostToolUse (Agent) — NEW: registers a spawn that SHARES the caller's own tree (no
 *      isolation:"worktree") into a small per-tree JSON registry once it is actually live in the
 *      background. See handleAgentDispatch() below.
 * @keep-comment
 *   3. SubagentStop — CLEARS a registry entry, on the PLATFORM-SET agent_id (identical across an agent's own
 *      SubagentStart and SubagentStop) gated by background_tasks holding no live work of this agent's own
 *      OTHER than its own self-entry. The agent's own final message is never read. This event was an
 *      intentional no-op until 2026-09-07, on a finding that no platform-authored signal existed here — a
 *      finding made without ever observing a real payload, because that pass's own probe was blocked before
 *      it ran. A later probe captured the payloads directly and refuted it. See handleSubagentStop() and
 *      hasOtherLiveBackgroundWork() below for the observed fields, why the self-entry must be excluded, the
 *      fail-closed cases, and the one shape that is still inferred rather than observed.
 *   4. PreToolUse (Bash) — NEW: before a STATE-CHANGING git command (checkout/switch/reset/stash/merge/
 *      rebase/cherry-pick/revert/pull/branch-delete/clean-force/restore) runs, checks that tree's own
 *      registry and either DENIES (a subagent) or REMINDS (the main loop) when another agent is registered
 *      live there. See handleBashGitCommand() below.
 *
 * WHY 2-4 EXIST. The CEO named the actual gap directly (translated, relayed by grimorio.system-keeper,
 * not independently quotable by this file's own author — rule 11): dispatching agents into a shared tree,
 * develop included, is the legitimate working model — "ah pero... si estamos permitiendo despachar a la
 * rama dev... pero se tiene que estar consiente del contexto" ("but if we're allowing dispatch to the
 * dev branch... you just have to be CONSCIOUS OF THE CONTEXT") — so the fix is AWARENESS, never a
 * location prohibition: for the MAIN LOOP, inject context and never block; for a SUBAGENT, block, because
 * a subagent has no one else refusing on its behalf. This is the SAME main-loop-inject / subagent-block
 * split already standing in this repo's own hooks/harness.md ("WHEN a hook would BLOCK ⟶ key it on
 * agent_type being PRESENT, so it binds subagents and lets the main loop through" — CEO, 2026-08-09),
 * applied here to a NEW detection surface, not a new policy invented for this file.
 *
 * WHY A NEW REGISTRY FILE, NOT THE EXISTING agent-invocations.log. Diagnosed by grimorio.system-keeper,
 * relayed here (rule 11 — labeled as its own reasoning, not the CEO's words): neither
 * log-agent-invocation.cjs nor log-agent-completion.cjs carries a tree-root field, that log's own
 * "branch" field is sampled once at dispatch time from the CALLER's cwd and never re-read (so it can
 * never reflect a child that later changes branch inside a shared tree), a background spawn's own "post"
 * row is written at LAUNCH not at actual completion, and — most decisive — `.grimorio/.cache/` is
 * gitignored, so every `git worktree add` gets its own separate copy of both logs: a hook in worktree A
 * structurally cannot see what worktree B logged. The registry below needs no tree-path field of its own
 * either way: it always lives inside the SAME shared tree's own `.grimorio/.cache/`, so whichever copy a
 * hook reads already IS the tree in question, by construction.
 *
 * HONEST LIMITATION, named rather than papered over: the registry below is a small JSON file, mutated by
 * a read-modify-write-then-atomic-rename on every dispatch/clear/prune. subagentstop-wait.cjs's own header
 * (this same directory) documents MEASURING a real lost-update race under exactly this shape (a shared
 * JSON blob, concurrent hook firings) and deliberately moving away from it. This file keeps the JSON-
 * registry shape anyway, per its own spec. CORRECTED (grimorio.code-reviewer, REWORK cycle 2, FINDING-02):
 * an earlier version of this paragraph claimed a lost update here "can only ever" leave an occupant
 * UNREGISTERED, never cause a false BLOCK — that claim was FALSE, reproduced live by the reviewer. Two
 * CONCURRENT SubagentStop removals racing on the same file can leave a stale PHANTOM occupant instead:
 * registry {A, C}, both removals read the same pre-image, each computes the OTHER's own removal, and
 * whichever write lands last silently UNDOES the first removal — final registry {A} even though both A
 * and C already stopped. That phantom then wrongly DENIES a subagent, or wrongly REMINDS the main loop,
 * @keep-comment
 * for up to OCCUPANT_STALE_MS (4 hours) against an occupant that no longer exists.
 *
 * @keep-comment
 *
 * THE PHANTOM-OCCUPANT RACE ABOVE IS LIVE AGAIN, and saying so is the point of this paragraph. A middle
 * version of this file removed the SubagentStop-driven removal entirely and then claimed the race "can no
 * longer occur through THAT path." The 2026-09-07 rebuild reinstates that removal path, so two concurrent
 * SubagentStop removals racing on this same JSON file CAN once more silently undo one another, exactly as
 * described above. It is accepted, not solved: its cost is a stale phantom occupant — a wrongly-denied
 * subagent or a wrongly-reminded main loop, self-healing within OCCUPANT_STALE_MS — whereas the defect the
 * rebuild fixes is a mechanism that could never clear at all for its own real population. A file that claims
 * a reopened race is closed is worse than one that names it, which is why this paragraph was rewritten
 * rather than left standing (grimorio.code-reviewer, cycle 1 FINDING-03).
 *
 * OTHER NAMED LIMITATIONS (grimorio.code-reviewer, REWORK cycle 2, FINDING-04/FINDING-05):
 *   - The state-changing verb set is exactly what this file's own SIMPLE_STATE_CHANGING_VERBS/
 *     isBranchDeleteCommand/isForceCleanCommand enumerate — checkout, switch, reset, stash, merge, rebase,
 *     cherry-pick, revert, pull, a branch DELETE, a FORCED (non-dry-run) clean, or restore. A git operation
 *     outside this list that could also relocate/discard another occupant's tree is a coverage gap to close
 *     by WIDENING this list, never by inventing a second detector.
 *   - Detection is defeated entirely by a NESTED shell invocation: `sh -c "git checkout other-branch"`,
 *     `bash -c "..."`, or `eval "..."` all have "sh"/"bash"/"eval", never "git", as gitCommandIndex's own
 *     command-position token, so the whole command passes through silently even though it performs a real
 *     state-changing operation. Not fixed this pass (would require recursing into the nested argument
 *     string, a materially larger change) — named here explicitly rather than left as a silent gap.
 *
 * @keep-comment
 * MEASURED, THEN FIXED (grimorio.code-reviewer, review-cap escalation; CEO ruling relayed by
 * grimorio.system-keeper, not independently quotable — rule 11): handleSubagentStop's own FINAL_CLOSE/
 * isChildFinished self-authored-text-shape check — the mechanism that decided whether to clear a registry
 * entry — was measured against this repo's own real .claude/.cache/agent-completions.log: 71 of 327 (21.7%)
 * non-final SubagentStop firings across 177 multi-firing agents already satisfied FINAL_CLOSE, independently
 * reproduced by grimorio.system-keeper at 68/327 (20.8%). A still-working agent's own tree-occupancy
 * protection could be silently, prematurely cleared roughly 1 time in 5, with no backstop, on exactly the
 * population (long-running background dispatches) this mechanism exists to protect. The CEO's ruling: a guard
 * whose clearing half fails one time in five, at the exact moment it exists to act, on exactly the population
 * it protects, with irreversible loss and no backstop, is not a residual risk to accept — it is the "check
 * that silently always passes" wearing a measurement instead of a hope, and it does not ship. FIXED here:
 * @keep-comment
 * FINAL_CLOSE, isChildFinished, loadCompletionRows (now unused by anything, removed as dead code per this
 * repo's own "no superseded code left beside its replacement" discipline) are all REMOVED, along with the
 * pathToFileURL import and the async keywords on handleSubagentStop/main() they required — not merely
 * disabled, and they must not return.
 *
 * SUPERSEDED, 2026-09-07 — read this before trusting the paragraph above's own conclusion. The first fix went
 * further than the evidence required: it made handleSubagentStop a permanent NO-OP, leaving pruneStaleOccupants's
 * own 4-hour staleness ceiling as the ONLY way an entry was ever removed, on the finding that no
 * platform-authored terminal signal existed on SubagentStop at all. That finding was reached WITHOUT EVER
 * OBSERVING A REAL PAYLOAD — that pass's own live probe was blocked by the permission classifier before it
 * ran, and it reported an absence it had no way to test, which is precisely what THE TWO-OWNER SPLIT forbids.
 * A later probe observed the payloads directly and refuted it: agent_id is platform-set and identical across
 * an agent's own Start and Stop, and background_tasks states whether anything of that agent's is still
 * running. handleSubagentStop now clears on those two fields (see its own comment below); the 4-hour ceiling
 * is DEMOTED to a backstop for a SubagentStop that never arrives. The fail-closed hard rule in
 * grimorio.code-harness ("Tree occupancy awareness") is unchanged and still binding — it is now satisfied by
 * a real signal rather than by refusing to clear at all. The 21%-failure measurement above stands exactly as
 * written: it is why the agent's own TEXT is still never read.
 *
 * FORWARD-FINDING, named here and NOT fixed here: subagentstop-wait.cjs's own use of this SAME FINAL_CLOSE/
 * isChildFinished predicate (the source this file's own copy was duplicated from) carries this SAME measured
 * false-positive rate — it decides whether a background dependency has genuinely finished before un-blocking
 * a parent's own close. Out of scope for this pass, per the CEO's own explicit scope boundary ("only the
 * clearing half plus the fail-closed rule and that record; nothing else in the diff reopens") — but that file
 * is not left exposed the identical way: scripts/parked-watch.mjs already provides an independent backstop
 * for its use (a top-level session watch that can notice and wake a genuinely parked parent, per
 * grimorio-conduct rule 8), which THIS file's own tree-occupancy mechanism never had. Whoever picks up
 * subagentstop-wait.cjs's own predicate next should not have to re-measure this from scratch — the 71/327 and
 * 68/327 figures above are that same measurement, not a second one to reproduce.
 *
 * @keep-comment NEVER: exit non-zero, or let an uncaught exception escape this file. ANY internal failure —
 * including a failed or unsupported `git` call, or a failed registry read/write — degrades to silent
 * passthrough (fail-open) — the same invariant harness-lookup.cjs, worktree-create-from-develop.cjs, and
 * spawn-grimorio-conduct-gate.cjs (this directory) already state for themselves — except the TWO
 * deliberate `permissionDecision:"deny"` cases below (deny(), for responsibility 1; denySubagentOccupancy(),
 * for responsibility 4), which are this file's whole reason to exist.
 *
 * IF ANY PART OF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB: there is no marker to disarm any
 * of the four responsibilities — retire the specific one outright instead of working around it.
 *   - To retire responsibility 1 (the edit guard) ONLY: remove the "PreToolUse" -> "Edit|Write|MultiEdit"
 *     entry pointing at this file from .claude/settings.json, and delete handleEditGuard()/deny() below.
 *   - To retire responsibilities 2-4 (the occupancy-awareness mechanism) ONLY: remove the "PostToolUse" ->
 *     "Agent", "SubagentStop" -> "*", and "PreToolUse" -> "Bash" entries pointing at this file from
 *     .claude/settings.json, and delete every function below handleEditGuard() up to (not including) main().
 *   - To retire this file ENTIRELY: remove all four entries above and delete this file.
 * Retiring any of these deliberately is legitimate; bypassing one is not.
 */

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { cacheRelative } from "../../scripts/refobl/cache-paths.mjs";

function projectDirOf(input) {
  return process.env.CLAUDE_PROJECT_DIR || (input && input.cwd) || process.cwd();
}

// Resolve the incoming file_path to absolute. It may arrive relative to input.cwd (the same field
// harness-lookup.cjs already reads for its own base) rather than to this process's own cwd.
function resolveIncoming(filePath, input) {
  if (path.isAbsolute(filePath)) return filePath;
  const base = (input && typeof input.cwd === "string" && input.cwd) || process.cwd();
  return path.resolve(base, filePath);
}

function normalize(absPath) {
  const resolved = path.resolve(absPath);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

// @keep-comment MEASURED, not assumed: on git < 2.31 (this machine's own git is 2.30.0.windows.1, confirmed
// live while writing this file's own selftest), `rev-parse` does NOT reject an unrecognized
// `--path-format=absolute` flag -- it echoes the token back as an extra output line and still exits 0,
// producing a TWO-LINE result that would silently corrupt every path comparison downstream while still
// looking like success (never reaching the fail-open branch at all). Degrading safely on this would make the
// whole mechanism permanently inert on this repo's own actual git -- so ATTEMPT 1 asks for the modern flag
// and accepts only a clean single-line result (rejecting the two-line echo like a thrown error); WHEN it
// fails ⟶ ATTEMPT 2 retries bare (every git version supports it) and resolves the result to absolute itself,
// since the bare form can come back relative. WHEN attempt 2 also fails ⟶ null, like any other git-resolution
// failure. Mirrors worktree-create-from-develop.cjs's own tiered fallback philosophy (this same directory).
function gitRevParseOne(flagArgs, baseDir) {
  const opts = { cwd: baseDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] };
  try {
    const raw = execFileSync("git", ["rev-parse", "--path-format=absolute", ...flagArgs], opts).trim();
    if (raw !== "" && !raw.includes("\n")) return raw;
  } catch (_) {
    /* fall through to attempt 2 below */
  }
  try {
    const raw = execFileSync("git", ["rev-parse", ...flagArgs], opts).trim();
    if (raw === "" || raw.includes("\n")) return null;
    return path.resolve(baseDir, raw);
  } catch (_) {
    return null;
  }
}

// Returns { gitDir, commonDir, worktreeRoot } when all three resolve, or null on ANY failure -- read by the
// caller as "cannot determine worktree status", never as a violation (passthrough).
function resolveGitFacts(baseDir) {
  const gitDir = gitRevParseOne(["--git-dir"], baseDir);
  const commonDir = gitRevParseOne(["--git-common-dir"], baseDir);
  const worktreeRoot = gitRevParseOne(["--show-toplevel"], baseDir);
  if (!gitDir || !commonDir || !worktreeRoot) return null;
  return { gitDir, commonDir, worktreeRoot };
}

function deny(mainTreePath, mainTreeRoot, worktreeRoot, worktreeEquivalent) {
  const message =
    `keeper-worktree-guard.cjs BLOCKED this edit: "${mainTreePath}" resolves inside the MAIN TREE ` +
    `(${mainTreeRoot}) while this session is rooted in a linked worktree (${worktreeRoot}).\n\n` +
    `Use the worktree-equivalent path instead:\n  ${worktreeEquivalent}\n\n` +
    `This main-tree location is protected because a spawned child's edit landing here, instead of in its ` +
    `own worktree, is exactly the mistake this guard exists to catch (see the commit that landed this rewrite ` +
    `for the incident that produced it, and for why this is now a directory-prefix match rather than a ` +
    `small named list).\n\n` +
    `IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, retire it outright instead of working around ` +
    `it -- there is no marker to disarm any more: remove the "PreToolUse" -> "Edit|Write|MultiEdit" entry ` +
    `pointing at keeper-worktree-guard.cjs from .claude/settings.json, and delete this file.`;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: message,
      },
    }),
  );
}

// @keep-comment
// FINDING (this pass, prompt-writer): the original main() this function was renamed from already ran 29
// body lines, past grimorio.javascript's 20-line cap, before this pass ever touched it. Fixed here rather
// than carried forward, since this pass is already rewriting this exact function -- split by
// responsibility (resolve the collision facts, THEN act on them), mirroring this same directory's own
// established remedy for the identical defect (spawn-verbatim-origin-gate.cjs's own FINDING-02 comments).
// Behavior is byte-for-byte unchanged: same checks, same order, same deny() call with the same arguments.
function resolveMainTreeCollision(input, filePath) {
  const facts = resolveGitFacts(projectDirOf(input));
  if (!facts) return null; // cannot determine worktree status -> passthrough, per this file's own fail-open invariant
  // Not inside a linked worktree at all -- this session IS the main checkout. Never applies here.
  if (normalize(facts.gitDir) === normalize(facts.commonDir)) return null;

  // commonDir ends in a literal ".git" segment for a STANDARD, non-bare, non-"--separate-git-dir"
  // repository (this project's own topology) -- its parent is then the main tree's own working-tree root.
  const mainTreeRoot = path.dirname(path.resolve(facts.commonDir));
  const mainTreeRootNorm = normalize(mainTreeRoot);
  const incomingAbs = resolveIncoming(filePath, input);
  const incomingNorm = normalize(incomingAbs);

  const isMainTreeRootItself = incomingNorm === mainTreeRootNorm;
  const isUnderMainTree = incomingNorm.startsWith(mainTreeRootNorm + path.sep);
  if (!isMainTreeRootItself && !isUnderMainTree) return null;

  const worktreeEquivalent = path.join(facts.worktreeRoot, path.relative(mainTreeRoot, incomingAbs));
  return { incomingAbs, mainTreeRoot, worktreeRoot: facts.worktreeRoot, worktreeEquivalent };
}

function handleEditGuard(input) {
  const ti = input.tool_input || {};
  const filePath = ti.file_path || ti.filePath;
  if (!filePath) return;
  const collision = resolveMainTreeCollision(input, filePath);
  if (!collision) return;
  deny(collision.incomingAbs, collision.mainTreeRoot, collision.worktreeRoot, collision.worktreeEquivalent);
}

// @keep-comment
// ============================================================================================================
// RESPONSIBILITIES 2-4 — TREE OCCUPANCY AWARENESS (NEW). Shared registry helpers first, then one function
// per responsibility, then the git-verb detection the Bash check needs. See this file's own header for the
// design reasoning (WHY 2-4 EXIST, WHY A NEW REGISTRY FILE, HONEST LIMITATION).
// ============================================================================================================

const REGISTRY_RELATIVE_PATH = cacheRelative("tree-occupants.json");

// Read the occupancy registry for a given tree root, tolerant of a missing or corrupt file (fail-open:
// "cannot read" is read as "no occupants registered," never a crash and never a false BLOCK).
function readOccupantRegistry(regPath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(regPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

// Write-to-temp-then-rename (atomic replace on both POSIX and NTFS) -- narrows, though per
// subagentstop-wait.cjs's own header can never fully eliminate, a concurrent read-modify-write race
// between two firings of this hook in the same tree. See this file's own header, HONEST LIMITATION, for
// why that residual risk is accepted here rather than redesigned around.
function writeOccupantRegistry(regPath, registry) {
  try {
    fs.mkdirSync(path.dirname(regPath), { recursive: true });
    const tmpPath = `${regPath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(registry), "utf8");
    fs.renameSync(tmpPath, regPath);
  } catch (_) {
    /* fail-open: a registry write that fails only degrades awareness, never blocks or crashes */
  }
}

// Build one registry entry for a live, shared-tree background dispatch. tool_use_id is the JOIN KEY
// (present on both pre/post rows per log-agent-invocation.cjs's own field-15 comment); agentId is only
// ever present once the child actually exists (a post-row-only field there too).
function buildOccupantEntry(toolUseId, description, agentId) {
  return {
    toolUseId,
    agentId: agentId || null,
    description,
    dispatchedAt: new Date().toISOString(),
    status: "live",
  };
}

// @keep-comment
// PostToolUse:Agent -- register a dispatch that shares the CALLER's own tree (never one isolated into its
// own worktree, per tool_input.isolation) and is still live at Post time. A foreground spawn already
// "completed" by the time Post fires needs no lasting entry: the collision window it would guard is
// already closed, so write-then-immediately-remove is equivalent to never writing -- handled here simply
// by requiring status to be exactly "async_launched" before anything is written.
function handleAgentDispatch(input) {
  const t = input.tool_input || {};
  if (t.isolation === "worktree") return;
  const toolUseId = input.tool_use_id;
  if (!toolUseId) return;
  const response = input.tool_response || {};
  if (response.status !== "async_launched") return;
  const facts = resolveGitFacts(projectDirOf(input));
  if (!facts) return;
  const regPath = path.join(facts.worktreeRoot, REGISTRY_RELATIVE_PATH);
  const registry = readOccupantRegistry(regPath);
  registry[toolUseId] = buildOccupantEntry(toolUseId, String(t.description || ""), response.agentId);
  writeOccupantRegistry(regPath, registry);
}

// @keep-comment SubagentStop -- CLEARS, on two PLATFORM-SET fields, neither of which the stopping agent can
// author. This function was an intentional no-op until 2026-09-07, on the finding that no platform-authored
// terminal signal existed on this event. THAT FINDING WAS WRONG, and HOW it was wrong matters more than the
// fix: the pass that produced it never observed a single real SubagentStop payload -- its own live probe was
// BLOCKED before it ran, and it reported an absence it had no way to test. A later probe (a temporary logging
// hook wired onto SubagentStart/SubagentStop/PostToolUse, fired by real dispatches in one session, then
// removed) captured the payloads directly. What actually arrives:
//
//   SubagentStart:       agent_id, agent_type
//   SubagentStop:        agent_id, agent_type, background_tasks, stop_hook_active, agent_transcript_path, ...
//   PostToolUse[Agent]:  tool_response.status -- "completed" for a foreground spawn (observed with real
//                        durations of 89s/308s/497s/612s), "async_launched" at 6ms for a background one
//
// agent_id is IDENTICAL across an agent's own Start and Stop, so a registered dispatch and a stopping agent
// join on it exactly. That join is what this function uses; the agent's own final message text is never read.
//
// WHY background_tasks GATES THE CLEAR. subagentstop-wait.cjs (this same directory) documents SubagentStop
// firing MULTIPLE times for one agent before its true terminal stop -- and can itself block-and-continue an
// agent that still holds a live background child. Clearing on an agent_id match ALONE would therefore fire on
// such a non-terminal stop and free a tree whose occupant is still working. background_tasks is the platform's
// own statement about that: empty means nothing of this agent's own is still running.
//
// THE FAIL-CLOSED RULE IS NOT RELAXED BY THIS FIX -- it is now satisfied by a better signal instead of by
// refusing to clear at all. A missing agent_id, or a background_tasks that is absent or not an array, all
// mean this guard CANNOT ESTABLISH a terminal stop, and it then leaves the tree occupied.
//
// CORRECTED, cycle 1 (grimorio.code-reviewer, CRITICAL), because the first version of this comment stated
// the opposite of what the capture shows and the code was built on that error: background_tasks is NOT empty
// at a background agent's own terminal stop. It still lists THE AGENT ITSELF, status "running" -- and
// background dispatches are the only population this registry ever tracks. A raw emptiness check was
// therefore INERT for every real case while claiming to work. The self-entry is now excluded before the
// question is asked; see hasOtherLiveBackgroundWork() below for the observation and its limits.
//
// WHAT STAYS DELETED, AND WHY IT MUST NOT COME BACK: the FINAL_CLOSE / isChildFinished self-authored-text
// shape check. Measured against this repo's own real completion records, that shape matched 71 of 327 (21.7%),
// independently reproduced at 68 of 327 (20.8%), of NON-FINAL SubagentStop firings -- an agent merely writing
// "VERIFIED" into its own last message satisfied it. It is category (c), the gameable middle, per
// ref:skill/grimorio.prompt-writing-quality's own "THE TWO-OWNER SPLIT": neither proof that a step happened
// nor a re-derivation of ground truth, only an inspection of an artifact's outward shape. The same predicate
// still lives in subagentstop-wait.cjs, tolerated there because parked-watch.mjs can recover from its false
// positives; here there is no such backstop, which is why it is refused outright.
//
// pruneStaleOccupants's own 4-hour staleness ceiling remains, DEMOTED to a backstop for the one case this
// function cannot cover at all -- a SubagentStop that never arrives (a crashed session, a hook error).
// @keep-comment
// Does this stopping agent still have OTHER live background work of its own? Returns false only when that
// question is answerable AND the answer is no -- every unanswerable state (absent, non-array) returns true,
// so the caller stays occupied.
//
// THE SELF-ENTRY IS EXCLUDED, and this is the whole subtlety. background_tasks is the platform's own task
// bookkeeping, and at an agent's OWN terminal SubagentStop that bookkeeping still lists THE AGENT ITSELF,
// with status "running" -- observed directly (grimorio.code-reviewer, cycle 1 CRITICAL, reproduced by the
// main loop against the raw probe capture):
//   agent_id ad2a9012b1f3fd472 -> background_tasks [{id:"ad2a9012b1f3fd472", status:"running", ...}]
// That was the ONLY background dispatch in the probe -- and background dispatches are the ONLY population
// this registry ever tracks, since handleAgentDispatch registers exclusively on status "async_launched".
// A first version of this predicate checked the raw array for emptiness and was therefore INERT for its
// entire real population: it could never have cleared anything, while its own comments claimed it did. The
// seven EMPTY observations in that same capture all belong to FOREGROUND agents, which are never registered
// at all -- an irrelevant population, generalized from by mistake.
//
// STILL UNOBSERVED, named rather than assumed: a genuinely distinct child dispatched BY the stopping agent.
// No such case exists in the capture, so its shape is inferred from the self-entry's shape. Any entry whose
// id is not this agent's own is therefore treated as live work and blocks the clear -- the conservative
// reading, chosen because being wrong in that direction only leaves a tree marked occupied.
function hasOtherLiveBackgroundWork(backgroundTasks, agentId) {
  if (!Array.isArray(backgroundTasks)) return true; // unanswerable -> assume live
  return backgroundTasks.some((task) => !task || task.id !== agentId);
}

// @keep-comment
// A dispatch is keyed by tool_use_id; agentId is the join. Scan rather than index: one agent could in
// principle hold more than one entry, and a null agentId (an entry registered before its child existed)
// must never match a real one.
function clearOccupantsByAgentId(registry, agentId) {
  let cleared = false;
  for (const key of Object.keys(registry)) {
    const entry = registry[key];
    if (entry && entry.agentId && entry.agentId === agentId) {
      delete registry[key];
      cleared = true;
    }
  }
  return cleared;
}

function handleSubagentStop(input) {
  const agentId = input && input.agent_id;
  if (!agentId) return; // no join key -> cannot establish a terminal stop -> stay occupied
  if (hasOtherLiveBackgroundWork(input.background_tasks, agentId)) return;

  const facts = resolveGitFacts(projectDirOf(input));
  if (!facts) return;
  const regPath = path.join(facts.worktreeRoot, REGISTRY_RELATIVE_PATH);
  const registry = readOccupantRegistry(regPath);
  if (clearOccupantsByAgentId(registry, agentId)) writeOccupantRegistry(regPath, registry);
}

// @keep-comment
// State-changing git operations -- a checkout, switch (added FINDING-04, grimorio.code-reviewer REWORK
// cycle 2: the modern checkout/branch-switch replacement since git 2.23, does exactly what checkout does,
// including discarding local changes with -f/--discard-changes), reset, stash (including its pop/drop/
// clear subcommands -- matched by the bare "stash" prefix below, no subcommand distinction needed), merge,
// rebase, cherry-pick, revert, pull (added FINDING-04: fetch+merge/rebase in one step -- covered
// UNCONDITIONALLY here, even a fast-forward pull can relocate an occupant's uncommitted-but-unstaged view
// via a working-tree conflict, and a --rebase pull is materially a rebase), a branch DELETE (-d/-D/
// --delete; creating or listing a branch is never state-changing to another occupant), a FORCED clean
// (plain `git clean` with neither -f nor --force is a dry run by git's own default and touches nothing --
// see isForceCleanCommand's own -n/--dry-run precedence fix, FINDING-03), or restore.
const SIMPLE_STATE_CHANGING_VERBS = new Set([
  "checkout",
  "switch",
  "reset",
  "stash",
  "merge",
  "rebase",
  "cherry-pick",
  "revert",
  "pull",
  "restore",
]);

// @keep-comment
// Global git options that take a following value token, so the verb scan below can skip past them instead
// of mis-reading the VALUE as the verb (e.g. `git -C ../other-tree checkout ...` must not read
// "../other-tree" as the subcommand). NOT EXHAUSTIVE -- best-effort tokenization of an arbitrary shell
// string, never a full git-CLI grammar. A global option missed here can only ever WEAKEN detection (skip a
// real state-changing command), never falsely flag a benign one -- the same fail-open bias this whole file
// already carries.
const GIT_GLOBAL_OPTS_WITH_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace"]);

// Walk tokens AFTER the literal "git" token, skipping global options (and their value, when the option
// takes one), and return the remaining tokens starting at the actual subcommand -- or null when nothing
// but options/flags follows.
function tokensFromGitVerb(tokensAfterGit) {
  let i = 0;
  while (i < tokensAfterGit.length) {
    const tok = tokensAfterGit[i];
    if (GIT_GLOBAL_OPTS_WITH_VALUE.has(tok)) {
      i += 2;
      continue;
    }
    if (tok.startsWith("-")) {
      i += 1;
      continue;
    }
    return tokensAfterGit.slice(i);
  }
  return null;
}

function isBranchDeleteCommand(verbTokens) {
  return verbTokens.includes("-d") || verbTokens.includes("-D") || verbTokens.includes("--delete");
}

// FIXED (grimorio.code-reviewer, REWORK cycle 2, FINDING-03, verified live against real git): -n/--dry-run
// makes `git clean` remove nothing at all, EVEN WHEN -f/--force is also given -- git's own dry-run always
// takes precedence. `git clean -n -f` must never be flagged as state-changing; checked (and combined short
// flags like "-fn"/"-nf") the SAME way the -f scan below already handles combined short flags.
function isForceCleanCommand(verbTokens) {
  const hasDryRun = verbTokens.some((tok) => /^-[a-z]*n[a-z]*$/i.test(tok)) || verbTokens.includes("--dry-run");
  if (hasDryRun) return false;
  return verbTokens.some((tok) => /^-[a-z]*f[a-z]*$/i.test(tok)) || verbTokens.includes("--force");
}

// @keep-comment
// Find "git" in COMMAND POSITION for one segment's own tokens -- the first meaningful token, after
// skipping any leading VAR=value environment-variable assignments (`FOO=bar git checkout ...`; leading
// whitespace is already collapsed by segmentIsStateChanging's own .trim().split()). Returns that index, or
// -1 when the segment's own COMMAND is not literally "git". FIXED (grimorio.system-keeper, REWORK cycle 1,
// reproduced live): a bare `tokens.indexOf("git")` anywhere in the token stream also matched "git"
// appearing as an ARGUMENT to an unrelated command -- e.g. `echo please dont run git checkout` was
// misread as a real `git checkout` and wrongfully DENIED. Command-position-only closes this: "git" must be
// the segment's own invoked command, never merely a word appearing later in it.
const ENV_ASSIGNMENT_RE = /^[A-Za-z_][A-Za-z0-9_]*=/;
function gitCommandIndex(tokens) {
  let i = 0;
  while (i < tokens.length && ENV_ASSIGNMENT_RE.test(tokens[i])) i += 1;
  return tokens[i] === "git" ? i : -1;
}

// One shell segment (already split on &&/||/;/|/newline by the caller) is state-changing when its own
// COMMAND is git (never merely a segment that mentions "git" somewhere in its text -- see
// gitCommandIndex's own header) invoking one of the SIMPLE verbs above, or `branch` with a delete flag, or
// `clean` with a force flag.
function segmentIsStateChanging(segment) {
  const tokens = segment.trim().split(/\s+/);
  const gitIdx = gitCommandIndex(tokens);
  if (gitIdx === -1) return false;
  const verbTokens = tokensFromGitVerb(tokens.slice(gitIdx + 1));
  if (!verbTokens || verbTokens.length === 0) return false;
  const verb = verbTokens[0];
  if (SIMPLE_STATE_CHANGING_VERBS.has(verb)) return true;
  if (verb === "branch") return isBranchDeleteCommand(verbTokens);
  if (verb === "clean") return isForceCleanCommand(verbTokens);
  return false;
}

// A Bash command can be compound (&&, ||, ;, |, or a literal newline joining multiple invocations) --
// state-changing if ANY segment is, never only the first.
function isStateChangingGitCommand(command) {
  const segments = String(command || "").split(/&&|\|\||[;|\n]/);
  return segments.some(segmentIsStateChanging);
}

// @keep-comment
// Drop any entry older than OCCUPANT_STALE_MS before evaluating occupancy, and any entry this file itself
// cannot parse a timestamp for -- a crashed agent whose SubagentStop never fired must not block a tree
// forever. OCCUPANT_STALE_MS is measured in HOURS, not minutes, chosen and justified explicitly rather
// than left a bare number: a real in-flight background task sharing a tree (a flow-delegation-owned
// end-to-end build, a multi-phase authoring pass) plausibly runs for a long working session, not a few
// minutes -- unlike subagentstop-wait.cjs's own WAIT_MS (an ACTIVE wait, a different purpose entirely) --
// but nowhere near a stale, multi-day-old session that should never still read as occupying a tree. 4 hours
// covers a long single working session while still self-clearing well before the next day's own work begins.
const OCCUPANT_STALE_MS = 4 * 60 * 60 * 1000;

function pruneStaleOccupants(registry, nowMs) {
  const pruned = {};
  for (const key of Object.keys(registry)) {
    const entry = registry[key];
    const dispatchedMs = entry && Date.parse(entry.dispatchedAt);
    if (!entry || !Number.isFinite(dispatchedMs)) continue;
    if (nowMs - dispatchedMs > OCCUPANT_STALE_MS) continue;
    pruned[key] = entry;
  }
  return pruned;
}

function liveOccupantsExcludingCaller(registry, callerAgentId) {
  return Object.values(registry).filter((entry) => entry.agentId !== callerAgentId);
}

function describeOccupants(occupants) {
  return occupants
    .map((o) => `- ${o.agentId || "(unknown id)"}: "${o.description || "(no description)"}", dispatched ${o.dispatchedAt}`)
    .join("\n");
}

function occupancyRetirementNote(matcherLabel) {
  return (
    `IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, retire it outright instead of working around ` +
    `it -- remove the "PreToolUse" -> "${matcherLabel}" entry pointing at keeper-worktree-guard.cjs from ` +
    `.claude/settings.json (see this file's own header for the other two entries this same retirement needs), ` +
    `and delete this file's occupancy-check code.`
  );
}

function denySubagentOccupancy(occupants, worktreeRoot) {
  const message =
    `keeper-worktree-guard.cjs BLOCKED this state-changing git command: tree "${worktreeRoot}" has ` +
    `another agent registered as currently live:\n\n${describeOccupants(occupants)}\n\n` +
    `A checkout/reset/stash/merge/rebase/cherry-pick/revert/branch-delete/clean-force/restore run here ` +
    `would relocate or discard whatever that agent is standing in -- its branch, its HEAD, its ` +
    `uncommitted changes -- none of which you were asked to disturb (see the code-harness skill's own ` +
    `"Tree ownership" rule for why this is never safe to route around). Wait for it to finish, or ` +
    `coordinate directly instead of running this now.\n\n` +
    occupancyRetirementNote("Bash");
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: message,
      },
    }),
  );
}

function injectMainLoopOccupancyReminder(occupants, worktreeRoot) {
  const message =
    `keeper-worktree-guard.cjs: tree "${worktreeRoot}" has another agent registered as currently live, ` +
    `right before this state-changing git command would run:\n\n${describeOccupants(occupants)}\n\n` +
    `This is a REMINDER only, never a block -- dispatching agents into this tree is a legitimate working ` +
    `model (rule 16); the gap this closes is being CONSCIOUS OF THE CONTEXT before your own git command ` +
    `relocates or discards whatever that agent is standing in.`;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        additionalContext: message,
      },
    }),
  );
}

// @keep-comment
// PreToolUse:Bash -- the occupancy check itself. Resolves the CURRENT tree (never a hardcoded path), reads
// and prunes that tree's own registry (persisting the prune, so a stale/crashed entry does not linger
// forever), excludes the caller's own registered entry (an agent must never be warned or blocked about its
// own occupancy), and routes the remaining result by caller identity: a subagent (agent_type or agent_id
// present -- the same convention spawn-verbatim-origin-gate.cjs already establishes) is DENIED; the main
// loop (both absent) gets a non-blocking reminder instead.
function handleBashGitCommand(input) {
  const t = input.tool_input || {};
  if (!isStateChangingGitCommand(t.command)) return;
  const facts = resolveGitFacts(projectDirOf(input));
  if (!facts) return;
  const regPath = path.join(facts.worktreeRoot, REGISTRY_RELATIVE_PATH);
  const rawRegistry = readOccupantRegistry(regPath);
  const pruned = pruneStaleOccupants(rawRegistry, Date.now());
  if (Object.keys(pruned).length !== Object.keys(rawRegistry).length) writeOccupantRegistry(regPath, pruned);
  const occupants = liveOccupantsExcludingCaller(pruned, input.agent_id || null);
  if (occupants.length === 0) return;
  if (input.agent_type || input.agent_id) {
    denySubagentOccupancy(occupants, facts.worktreeRoot);
  } else {
    injectMainLoopOccupancyReminder(occupants, facts.worktreeRoot);
  }
}

// @keep-comment
// ============================================================================================================
// DISPATCH -- routes each of the four wired events (see .claude/settings.json) to its own handler above.
// ============================================================================================================

// @keep-comment
// REVERTED TO SYNCHRONOUS (CEO-directed fix, see this file's own header "MEASURED, THEN FIXED"):
// handleSubagentStop no longer awaits a completions-log check -- it never reads the completions log at all,
// deciding only from platform-set payload fields -- so nothing in this file
// has an async path any more. Every handler below is synchronous, matching this directory's own other
// synchronous hooks (see e.g. spawn-verbatim-origin-gate.cjs's own try/main()/catch shape, reused as-is
// below).
function main(input) {
  if (!input) return;

  if (input.hook_event_name === "PostToolUse" && input.tool_name === "Agent") {
    return handleAgentDispatch(input);
  }
  if (input.hook_event_name === "SubagentStop") {
    return handleSubagentStop(input);
  }
  if (input.hook_event_name === "PreToolUse" && input.tool_name === "Bash") {
    return handleBashGitCommand(input);
  }
  if (input.hook_event_name === "PreToolUse") {
    return handleEditGuard(input);
  }
}

export function run(input) {
  main(input);
  return null;
}
