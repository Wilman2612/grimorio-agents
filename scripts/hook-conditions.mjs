#!/usr/bin/env node
// @keep-comment scripts/hook-conditions.mjs — this header states the ISOLATION and POPULATION
// invariants a later editor must not simplify away (CEO ruling: encode isolation as a hard rule
// with its reason, in the file, so a probe state cannot quietly be dropped) plus the LENS-not-GATE
// reading the whole tool exists to teach. Not a description of current behaviour that would drift —
// see `development-patterns`'s own comment rule, which this earns an exemption from on that basis.
//
// CLAUDE.md rule 23 (~500-line SMELL threshold): this file earns its size rather than splitting.
// It is ONE diagnostic CLI with no other consumer — the PROBES/SCENARIOS declarations, the runner
// that executes them, and the report that renders them are read together or not at all, and
// splitting the data from the functions that interpret it would cost a reader an extra file open
// for no benefit. `scripts/audit-chain.mjs` (777 lines) is the same shape of single-file diagnostic
// CLI, in this same directory, at this same size.
//
// ANSWERS ONE QUESTION, and only one: does a given hook, IN A GIVEN STATE, have an EFFECT right now — does
// it emit context, does it deny, does it write anything a model or a gate will see — or does it run and
// produce NOTHING? "Wired to an event" (GRIMORIO-CHAIN.md §3) and "has an effect in this state" are two
// different constructs, and nothing before this tool measured the second one.
//
// THIS IS A LENS, NOT A GATE. Emptiness is an OBSERVATION, never a finding on its own — a hook emitting
// nothing is USUALLY CORRECT: a dedup working as designed, a branch with no objective, a path with no
// governing harness.md. There is no bar an empty run violates, so treating emptiness as a failure would be
// a vacuous gate — GATE-IS-VACUOUS is already the largest failure class on record in this repo. Read the
// report, then judge with your own eyes whether a given emptiness is right for that state; this tool does
// not judge that for you.
//
// This tool does NOT check: whether a hook's emitted text is correct or good advice, whether a DENY was
// the right call, whether the states below cover every real trigger a hook could ever see, or whether
// .claude/settings.json's wiring is well DESIGNED (only, with --check, whether it is well FORMED). It only
// answers, for the states declared below, whether the hook produced bytes or not — and, with --check, only
// whether the wiring resolves and whether a hook broke its own documented no-throw/no-nonzero-exit contract.
//
// THE ANSWER IS ALWAYS MEASURED, NEVER HAND-WRITTEN. Every row in PROBES below declares only the INPUT
// STATE — the payload and the environment a maintainer chose to exercise. The byte count, the exit code,
// the emitted text: all of it comes from actually RUNNING the hook, now, in this process, against that
// state. A prose "condition" column typed by hand is exactly the drift that produced three disagreeing
// hook-population figures and one first-touch byte count quoted as if it repeated every time — see
// reasoning-principles/SKILL.md, "A COUNT NEEDS ITS POPULATION". The next maintainer WILL be tempted to
// "just add a note" describing what a hook does instead of adding a probe state that proves it. Don't:
// add a row to PROBES and let the run answer it.
//
// ISOLATION IS LOAD-BEARING — do not simplify a probe by dropping it. Three hooks under .claude/hooks write
// to disk: harness-lookup.cjs (a per-session dedup file, in os.tmpdir() — NOT under CLAUDE_PROJECT_DIR, so
// sandboxing the project dir alone does not contain it), mark-skill-loaded.cjs (marker files under
// .claude/.cache, which nothing reads any more — the gates that consulted them are deleted), and
// log-agent-invocation.cjs (.claude/.cache/agent-invocations.log — the exact corpus scripts/agent-stats.sh
// measures; probing it for real would pollute that toolchain's own population). A fourth,
// worktree-create-from-develop.cjs, is worse: run against a real repo it calls `git worktree add` for
// real. WRITES is computed below by scanning each hook's own source for the calls that cause them
// (fs.writeFileSync/appendFileSync, a literal "worktree"/"add" pair) rather than hand-listed, for the same
// reason the condition itself is never hand-written — a hand list drifts the day a hook gains a new write.
// So: TMPDIR/TEMP/TMP are ALWAYS redirected to a throwaway directory and the session_id is ALWAYS a
// synthetic string that can never collide with a live one, for every probe regardless of hook; and every
// WRITING hook additionally runs with CLAUDE_PROJECT_DIR (and, for worktree-create-from-develop.cjs, its
// own payload `cwd`) pointed at a throwaway sandbox directory rather than this repo. Read-only hooks may
// run against the real repo where a probe wants to show real repo state — that is allowed, not a gap. The
// case this tool was commissioned to reproduce (a hook emitting 0 bytes on the live branch because no
// objective file existed there) belonged to a hook since deleted; the reasoning outlived it.
//
// A SECOND AXIS, beside the per-hook one above: SCENARIOS. The per-hook question ("does this ONE hook have
// an effect in this state") does not answer "does a real ACT — a file edit, an agent spawn — meet ANY
// effective gate at all", because a conjunction of individually-correct silences is invisible in a table of
// individual rows. A scenario declares only its ORDERED STEPS (event + tool_name + payload); WHICH hooks
// each step meets, and in what order, is derived from `.claude/settings.json`'s own matcher rules — same
// discipline as PROBES, never hand-listed. The steps of one scenario share a session id, a sandbox project
// directory, and a scenario-scoped tmp dir, so state set by an earlier step (a marker written, a dedup
// primed) is visible to a later one — exactly as it would be within one real session. Its own POPULATION
// BOUNDARY: this axis covers only hooks `.claude/settings.json` wires against an event/matcher a scenario's
// steps test. `scripts/pre-commit.sh` and `scripts/close-branch.sh` are real, later links in the chain a
// commit or a branch-close walks, and sit ENTIRELY outside `.claude/settings.json` — this axis does not see
// them, says so in its own output, and must never be read as "the whole chain a real act walks".
//
// Usage:  node scripts/hook-conditions.mjs                 full report: population + probes + scenarios
//         node scripts/hook-conditions.mjs --check          the two narrow GATE conditions only (see below)
//         node scripts/hook-conditions.mjs <name-fragment>  filter population/probes by hook file, and
//                                                            scenarios by label or any hook they meet

import { readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const HOOKS_DIR = join(ROOT, ".claude/hooks");
const SETTINGS = join(ROOT, ".claude/settings.json");
const posix = (p) => p.replace(/\\/g, "/");

// ============================================================================================
// POPULATION — every .cjs under .claude/hooks, partitioned live: WIRED (named in settings.json),
// MODULE (not wired, but require()'d by another hook), ORPHAN (neither). Never a hand count.
// ============================================================================================

function listHookFiles() {
  return readdirSync(HOOKS_DIR).filter((f) => f.endsWith(".cjs")).sort();
}

function wiredNames() {
  const settings = JSON.parse(readFileSync(SETTINGS, "utf8"));
  const names = new Set();
  for (const events of Object.values(settings.hooks || {})) {
    for (const entry of events) {
      for (const h of entry.hooks || []) {
        const m = String(h.command || "").match(/hooks\/([A-Za-z0-9_-]+\.cjs)"?$/);
        if (m) names.add(m[1]);
      }
    }
  }
  return names;
}

// file -> [files that require() it]. Relative-require only (`./x.cjs`) — the only form used in this
// directory; a hook requiring outside .claude/hooks would need its own row, not silently swept in here.
function requiredByMap() {
  const map = new Map();
  for (const f of listHookFiles()) {
    const text = readFileSync(join(HOOKS_DIR, f), "utf8");
    for (const m of text.matchAll(/require\(["']\.\/([A-Za-z0-9_-]+\.cjs)["']\)/g)) {
      map.set(m[1], [...(map.get(m[1]) ?? []), f]);
    }
  }
  return map;
}

// A hook WRITES if its own source calls fs.writeFileSync/appendFileSync, or names "worktree" and "add"
// (the only git-mutation this directory performs). Scanned, not hand-listed — see the header.
function writesFilesystem(file) {
  const text = readFileSync(join(HOOKS_DIR, file), "utf8");
  return /\bfs\.(writeFileSync|appendFileSync)\s*\(/.test(text) || (/"worktree"/.test(text) && /"add"/.test(text));
}

function population() {
  const files = listHookFiles();
  const wired = wiredNames();
  const reqBy = requiredByMap();
  return files.map((f) => {
    const write = writesFilesystem(f);
    if (wired.has(f)) return { file: f, kind: "WIRED", write };
    if (reqBy.has(f)) return { file: f, kind: "MODULE", write, requiredBy: reqBy.get(f) };
    return { file: f, kind: "ORPHAN", write };
  });
}

// @keep-comment CONTRACT NOTE — the exact matcher semantics a maintainer must reproduce to keep chain
// membership correct: no `matcher` fires unconditionally for the event, `"*"` fires for any tool, and
// any other `matcher` is an alternation tested as `^(?:<matcher>)$` against the step's tool_name — the
// same rule the platform itself dispatches by. Never hand-listed here or anywhere else — the day
// settings.json's matchers change, this changes with them instead of silently going stale.
function hooksForStep(event, toolName) {
  const settings = JSON.parse(readFileSync(SETTINGS, "utf8"));
  const entries = (settings.hooks || {})[event] || [];
  const matched = [];
  for (const entry of entries) {
    const matcher = entry.matcher;
    const ok = matcher === undefined || matcher === "*" || new RegExp(`^(?:${matcher})$`).test(toolName ?? "");
    if (!ok) continue;
    for (const h of entry.hooks || []) {
      const m = String(h.command || "").match(/hooks\/([A-Za-z0-9_-]+\.cjs)"?$/);
      if (m) matched.push(m[1]);
    }
  }
  return matched;
}

// ============================================================================================
// ISOLATION PLUMBING
// ============================================================================================

// One throwaway root for the whole run. TMPDIR/TEMP/TMP for every child process point HERE, always —
// harness-lookup.cjs's dedup state lives in os.tmpdir() regardless of CLAUDE_PROJECT_DIR, so this is the
// only redirect that actually contains it.
const PROBE_TMP = mkdtempSync(join(tmpdir(), "hookcond-tmp-"));
// A SEPARATE root for fixture project directories (harness.md trees, seeded .claude/.cache markers) —
// kept apart from PROBE_TMP so a hook's own TMPDIR redirection can never collide with a fixture path.
const SANDBOX_ROOT = mkdtempSync(join(tmpdir(), "hookcond-proj-"));
// One synthetic session id for the entire run. Never a live one: no real session_id has this prefix, and
// reusing this exact string across probes is what lets harness-lookup's call-1/call-2 dedup probes see
// each other, on purpose, the same way two calls in one real session would.
const SESSION = "probe-hookcond-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

function freshDir(prefix) {
  return mkdtempSync(join(SANDBOX_ROOT, prefix + "-"));
}
function seed(projectDir, relPath, content) {
  const p = join(projectDir, relPath);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  return p;
}
function readSeeded(p) {
  try { return readFileSync(p, "utf8"); } catch { return null; }
}

// @keep-comment ISOLATION CONTRACT (see header) — projectDir defaults to the real repo, safe only
// because callers of a WRITING hook must pass a throwaway one explicitly (buildProbes() below always
// does); tmpDir defaults to the whole-run PROBE_TMP, but a SCENARIO passes its own scenario-scoped tmp
// dir so its dedup/marker state can never collide with an unrelated PROBES row sharing the same run.
function runHook(hookFile, payload, { projectDir, tmpDir } = {}) {
  const cwd = projectDir ?? ROOT;
  const tmp = tmpDir ?? PROBE_TMP;
  const env = { ...process.env, CLAUDE_PROJECT_DIR: cwd, TMPDIR: tmp, TEMP: tmp, TMP: tmp };
  let stdout = "", exitCode = 0, threw = null;
  try {
    stdout = execFileSync(process.execPath, [join(HOOKS_DIR, hookFile)], {
      input: JSON.stringify(payload),
      cwd,
      env,
      encoding: "utf8",
      timeout: 10000,
    });
  } catch (e) {
    exitCode = typeof e.status === "number" ? e.status : 1;
    threw = e.message;
    stdout = e.stdout ? String(e.stdout) : "";
  }
  return { bytes: Buffer.byteLength(stdout, "utf8"), stdout, exitCode, threw };
}

// Renders a result to one line: DENY reason, CONTEXT preview, a note pointing at a side effect this hook
// makes on disk instead of on stdout, or "(no output)" — never a bare byte count with nothing to read.
function preview(result, sideEffectNote) {
  if (result.threw) return `THREW / exit ${result.exitCode}: ${result.threw.split("\n")[0].slice(0, 120)}`;
  if (result.bytes === 0) return sideEffectNote ? `(no stdout) ${sideEffectNote}` : "(no output)";
  try {
    const parsed = JSON.parse(result.stdout);
    const hso = parsed.hookSpecificOutput || {};
    if (hso.permissionDecision) return `${hso.permissionDecision.toUpperCase()}: ${String(hso.permissionDecisionReason || "").split("\n")[0].slice(0, 100)}`;
    if (hso.additionalContext) return `CONTEXT: ${String(hso.additionalContext).replace(/\s+/g, " ").slice(0, 100)}`;
  } catch { /* not JSON, e.g. worktree-create-from-develop's bare path on stdout */ }
  return result.stdout.replace(/\s+/g, " ").slice(0, 100);
}

// A generic disk-effect detector for SCENARIOS, used instead of a per-hook hand list of "which file might
// this one write". Recursively fingerprints every file under the given roots (size + mtime); the SCENARIO
// runner calls this once before its first step and once after its last, and the diff is the scenario's
// disk effect — attributable to "whichever WRITE-flagged hook this scenario met", never guessed further.
function snapshotTree(roots) {
  const map = new Map();
  const walk = (dir) => {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else { try { const st = statSync(p); map.set(posix(p), `${st.size}:${st.mtimeMs}`); } catch { /* raced/gone */ } }
    }
  };
  for (const r of roots) walk(r);
  return map;
}
function diffTree(before, after) {
  const changed = [];
  for (const [p, sig] of after) changed.push({ path: p, kind: before.has(p) ? (before.get(p) === sig ? null : "modified") : "added" });
  return changed.filter((c) => c.kind);
}

// ============================================================================================
// PROBES — one row per real trigger a maintainer chose to exercise. Each row is (hook, label,
// payload, optional fixture). Add a row here instead of a prose note when a hook's behaviour changes.
// ============================================================================================

function buildProbes() {
  const probes = [];
  const add = (hook, label, payload, opts) => probes.push({ hook, label, payload, opts, result: null });

  // ---- subagent-id-injection.cjs — read-only, touches no filesystem state at all.
  add("subagent-id-injection.cjs", "agent_id present (SubagentStart)",
    { hook_event_name: "SubagentStart", agent_id: "probe-agent-id", agent_type: "grimorio.prompt-writer", session_id: SESSION });
  add("subagent-id-injection.cjs", "agent_id absent",
    { hook_event_name: "SubagentStart", session_id: SESSION });

  // ---- harness-lookup.cjs — WRITING (dedup state in os.tmpdir()). Self-contained fixture project dirs
  // so the probe never depends on this repo's real harness.md layout. Call 1 and call 2 reuse the SAME
  // sandbox, the SAME SESSION, and the SAME PROBE_TMP on purpose — that is what lets call 2 observe call
  // 1's dedup state, exactly as two edits in one real session would.
  {
    const withHarness = freshDir("hl-withharness");
    seed(withHarness, "harness.md", "root fixture harness\n");
    seed(withHarness, "sub/harness.md", "sub fixture harness\n");
    const target = join(withHarness, "sub", "file.go");
    seed(target, "", ""); // seed() writes relPath under projectDir; give it a real leaf path to exist at
    const payload = { hook_event_name: "PreToolUse", tool_name: "Edit", session_id: SESSION, tool_input: { file_path: target } };
    add("harness-lookup.cjs", "call 1 — harness.md found above target (emits, writes dedup state)", payload, { projectDir: withHarness });
    add("harness-lookup.cjs", "call 2 — same session, same target (0 bytes, dedup)", payload, { projectDir: withHarness });

    const noHarness = freshDir("hl-noharness");
    const target2 = join(noHarness, "sub", "file.go");
    seed(target2, "", "");
    add("harness-lookup.cjs", "no governing harness.md anywhere above target (0 bytes)",
      { hook_event_name: "PreToolUse", tool_name: "Edit", session_id: SESSION, tool_input: { file_path: target2 } },
      { projectDir: noHarness });
  }

  // ---- mark-skill-loaded.cjs — WRITING (marker on Skill tool use). Also silent on stdout by design.
  {
    const tracked = freshDir("msl-tracked");
    const markerPath = join(tracked, ".claude/.cache/agent-selection-loaded");
    add("mark-skill-loaded.cjs", "tracked skill (agent-selection) loaded — writes session id to marker",
      { hook_event_name: "PostToolUse", tool_name: "Skill", session_id: SESSION, tool_input: { skill: "agent-selection" } },
      { projectDir: tracked, readBack: markerPath });

    const untracked = freshDir("msl-untracked");
    const noMarkerPath = join(untracked, ".claude/.cache/agent-selection-loaded");
    add("mark-skill-loaded.cjs", "untracked skill name — no marker written",
      { hook_event_name: "PostToolUse", tool_name: "Skill", session_id: SESSION, tool_input: { skill: "some-other-skill" } },
      { projectDir: untracked, readBack: noMarkerPath });
  }

  // ---- log-agent-invocation.cjs — WRITING (appends one line to a log). Also silent on stdout by design.
  {
    const dir = freshDir("lai");
    const logPath = join(dir, ".claude/.cache/agent-invocations.log");
    add("log-agent-invocation.cjs", "Agent spawn — appends one plan-context line",
      { hook_event_name: "PostToolUse", tool_name: "Agent", session_id: SESSION,
        tool_input: { subagent_type: "grimorio.prompt-writer", prompt: "MILESTONE-LINK: n/a — probe\ndo it", description: "probe task" } },
      { projectDir: dir, readBack: logPath });
  }

  // ---- worktree-create-from-develop.cjs — WRITING, and the most dangerous one to get wrong: run against
  // a real repo it calls `git worktree add` for real. `cwd` in the payload (not CLAUDE_PROJECT_DIR) is
  // what this hook actually reads for its repo root, so the sandbox MUST be passed there, always — a
  // plain non-git throwaway directory, so every tier fails closed and it gives up quietly by design.
  {
    const dir = freshDir("wcfd");
    add("worktree-create-from-develop.cjs", "non-git throwaway dir (all tiers fail safely, no worktree created)",
      { hook_event_name: "WorktreeCreate", name: "probe-hookcond-wt", cwd: dir, session_id: SESSION }, { projectDir: dir });
  }

  return probes;
}

// ============================================================================================
// SCENARIOS — the CHAIN axis (see header). Seeded with the three scenarios that produced the three
// wrong causal stories this tool replaces: a prompt on develop, a file edit, an agent spawn.
// ============================================================================================

function buildScenarios() {
  return [
    {
      label: "main-loop prompt on develop",
      note: "runs against the REAL repo, not a fixture — every hook this meets is read-only, and the point " +
        "is to show the actual current branch/objective state, which will vary day to day.",
      projectDir: ROOT,
      steps: (session) => [
        { event: "UserPromptSubmit", toolName: undefined,
          payload: { hook_event_name: "UserPromptSubmit", session_id: session } },
      ],
    },
    {
      label: "ordinary file edit, second edit of the session",
      note: "a harness.md governs the target on purpose (call 1 primes the dedup this scenario's own call 2 " +
        "then observes) but the path is neither a governance path nor a claimed domain, and the caller has " +
        "no agent_type (the top-level main loop) — the scenario a real 'nothing fired, and every silence " +
        "was individually correct' conjunction looks like.",
      fixture: (dir) => {
        seed(dir, "harness.md", "root fixture harness\n");
        seed(dir, "sub/harness.md", "sub fixture harness\n");
        return join(dir, "sub", "file.go");
      },
      steps: (session, target) => [
        { event: "PreToolUse", toolName: "Edit",
          payload: { hook_event_name: "PreToolUse", tool_name: "Edit", session_id: session, tool_input: { file_path: target } } },
        { event: "PreToolUse", toolName: "Edit",
          payload: { hook_event_name: "PreToolUse", tool_name: "Edit", session_id: session, tool_input: { file_path: target } } },
      ],
    },
    {
      label: "agent spawn — the two halves of a spawn land on different events",
      note: "STALE UNTIL 2026-08-12, corrected here: this note used to claim 'neither hook can refuse the " +
        "spawn — nothing wired here refuses anything', which stopped being true the moment " +
        "spawn-grimorio-conduct-gate.cjs was wired PreToolUse:Agent (2026-08-11) — this step's own PreToolUse " +
        "payload below (prompt: 'do it', no compelling grimorio-conduct instruction) is DENIED by that hook, " +
        "live, every run. The remaining, still-true half: log-agent-invocation.cjs is SILENT on stdout at " +
        "PreToolUse while WRITING the dispatch row to disk (0 bytes emitted), so reading stdout alone would " +
        "wrongly call log-agent-invocation.cjs's own effect absent; at PostToolUse prompt-check.cjs emits its " +
        "reminder, so THAT half is plainly gated on stdout. Three hooks meet this step's two events in total " +
        "(log-agent-invocation.cjs + spawn-grimorio-conduct-gate.cjs at PreToolUse, prompt-check.cjs at " +
        "PostToolUse) and two of the three have a real effect beyond logging.",
      steps: (session) => [
        { event: "PreToolUse", toolName: "Agent",
          payload: { hook_event_name: "PreToolUse", tool_name: "Agent", session_id: session,
            tool_input: { subagent_type: "grimorio.prompt-writer", prompt: "do it" } } },
        { event: "PostToolUse", toolName: "Agent",
          payload: { hook_event_name: "PostToolUse", tool_name: "Agent", session_id: session,
            tool_input: { subagent_type: "grimorio.prompt-writer", prompt: "do it", description: "probe task" } } },
      ],
    },
  ];
}

// @keep-comment DESIGN INVARIANT, not a description of current behaviour: this was tried the other
// way and produced a wrong result mid-build. Isolation: its own sandbox/tmp dir/synthetic session per
// scenario (never PROBES' globals — a shared session would leak an unrelated probe's dedup state in).
// Verdict shape: EACH STEP gets its OWN verdict from a before/after snapshot taken around just that
// step, on stdout bytes AND disk — never summed across the scenario and never stdout alone. Summing
// let an earlier PRIMING step's real effect bury the silence of the act actually under test; stdout
// alone missed `log-agent-invocation.cjs` writing with 0 bytes on stdout. The scenario's headline is
// its LAST step's verdict — the same question the CEO measured by hand. Reverting either simplification
// silently reintroduces the bug that was already found and fixed here.
function runScenario(scenario, index) {
  const dir = freshDir(`scn${index}`);
  const tmp = mkdtempSync(join(PROBE_TMP, `scn${index}-`));
  const session = SESSION + `-scn${index}`;
  const target = scenario.fixture ? scenario.fixture(dir, session) : undefined;

  const steps = scenario.steps(session, target).map((step) => {
    const before = snapshotTree([dir, tmp]);
    const matched = hooksForStep(step.event, step.toolName);
    const runs = matched.map((hook) => ({ hook, result: runHook(hook, step.payload, { projectDir: dir, tmpDir: tmp }) }));
    const after = snapshotTree([dir, tmp]);
    const diskChanges = diffTree(before, after);
    const stdoutEffectful = runs.filter((r) => r.result.bytes > 0);
    const writeCapableMet = [...new Set(runs.map((r) => r.hook))].filter((h) => writesFilesystem(h));

    let verdict;
    if (!stdoutEffectful.length && !diskChanges.length) {
      verdict = `UNGATED — ${runs.length} hook(s) met, all silent on stdout AND on disk. A LENS finding, ` +
        `not a verdict: every individual silence may be exactly correct for this state.`;
    } else if (!stdoutEffectful.length && diskChanges.length) {
      verdict = `silent on stdout but NOT ungated — disk changed (${diskChanges.length} path(s)); ` +
        `write-capable hook(s) met: ${writeCapableMet.join(", ") || "(none flagged — investigate)"}.`;
    } else {
      verdict = `NOT ungated — ${stdoutEffectful.length}/${runs.length} hook(s) emitted output on stdout.`;
    }
    return { ...step, runs, diskChanges, verdict };
  });

  return { label: scenario.label, note: scenario.note, steps, headline: steps[steps.length - 1].verdict };
}

// ============================================================================================
// RUN + REPORT
// ============================================================================================

function runAll(probes) {
  for (const p of probes) {
    p.result = runHook(p.hook, p.payload, p.opts);
    if (p.opts && p.opts.readBack) p.after = readSeeded(p.opts.readBack);
  }
}

function checkWiring() {
  const settings = JSON.parse(readFileSync(SETTINGS, "utf8"));
  const missing = [];
  for (const [event, entries] of Object.entries(settings.hooks || {})) {
    for (const entry of entries) {
      for (const h of entry.hooks || []) {
        const m = String(h.command || "").match(/hooks\/([A-Za-z0-9_-]+\.cjs)"?$/);
        if (!m) continue;
        try { statSync(join(HOOKS_DIR, m[1])); }
        catch { missing.push({ event, file: m[1] }); }
      }
    }
  }
  return missing;
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const filter = args.find((a) => !a.startsWith("--"));

  try {
    if (check) {
      let bad = 0;

      const missing = checkWiring();
      console.log(missing.length
        ? `FAIL  wiring integrity — ${missing.length} settings.json entr${missing.length === 1 ? "y names" : "ies name"} a hook file that does not exist`
        : `PASS  wiring integrity — every .claude/settings.json hook entry resolves to a file on disk`);
      for (const m of missing) console.log(`      ${m.event}  ->  ${m.file}  MISSING`);
      bad += missing.length ? 1 : 0;

      const probes = buildProbes().filter((p) => !filter || p.hook.includes(filter));
      runAll(probes);
      const broken = probes.filter((p) => p.result.exitCode !== 0 || p.result.threw);
      console.log(broken.length
        ? `FAIL  contract integrity — ${broken.length}/${probes.length} probe(s) exited non-zero or threw on a well-formed payload`
        : `PASS  contract integrity — all ${probes.length} probed states exited 0, no hook threw`);
      for (const b of broken) console.log(`      ${b.hook}  "${b.label}"  ${preview(b.result)}`);
      bad += broken.length ? 1 : 0;

      console.log("");
      console.log("This is the only GATE this tool carries. It does NOT check that emptiness is wrong —");
      console.log("emptiness is usually correct. See the full report (no --check) to read every probe's answer.");
      process.exit(bad ? 1 : 0);
    }

    const pop = population().filter((p) => !filter || p.file.includes(filter));
    const wired = pop.filter((p) => p.kind === "WIRED");
    const modules = pop.filter((p) => p.kind === "MODULE");
    const orphans = pop.filter((p) => p.kind === "ORPHAN");

    console.log(`THIS IS A LENS, NOT A GATE. Emptiness below is an OBSERVATION, never a finding by itself.`);
    console.log(`Population computed live from ${posix(HOOKS_DIR.replace(ROOT, "."))} and ${posix(SETTINGS.replace(ROOT, "."))} — never a constant.`);
    console.log("");
    console.log(`.cjs files under .claude/hooks   ${population().length}`);
    console.log(`  WIRED (named in settings.json)  ${population().filter((p) => p.kind === "WIRED").length}`);
    console.log(`  MODULE (require()'d, no event)  ${population().filter((p) => p.kind === "MODULE").length}`);
    console.log(`  ORPHAN (neither)                ${population().filter((p) => p.kind === "ORPHAN").length}`);
    console.log("");

    for (const w of wired) console.log(`  WIRED   ${w.write ? "[writes disk]" : "[read-only]  "}  ${w.file}`);
    for (const m of modules) console.log(`  MODULE  ${m.write ? "[writes disk]" : "[read-only]  "}  ${m.file}   required by: ${m.requiredBy.join(", ")}   (not runnable as a hook — no event triggers it directly)`);
    for (const o of orphans) console.log(`  ORPHAN  ${o.write ? "[writes disk]" : "[read-only]  "}  ${o.file}   NAMED NOWHERE — wired to no event, required by nothing`);

    console.log("");
    console.log(`PROBES — one row per real trigger state exercised THIS RUN. bytes=0 means "ran, emitted nothing".`);
    const probes = buildProbes().filter((p) => !filter || p.hook.includes(filter));
    runAll(probes);
    let lastHook = null;
    for (const p of probes) {
      if (p.hook !== lastHook) { console.log(""); lastHook = p.hook; }
      const sideEffect = p.opts && p.opts.readBack
        ? `on-disk effect: ${p.after === null ? "marker/log absent after run" : `now reads "${p.after.slice(0, 60).replace(/\s+/g, " ")}"`}`
        : null;
      console.log(`  ${p.hook}`);
      console.log(`    ${p.label}`);
      console.log(`    bytes=${p.result.bytes}  exit=${p.result.exitCode}  ${preview(p.result, sideEffect)}`);
    }

    console.log("");
    console.log(`SCENARIOS — the CHAIN axis. For an ORDERED SEQUENCE of steps, which hooks does each step`);
    console.log(`meet (derived live from .claude/settings.json's own matchers, never hand-listed), and did`);
    console.log(`the CONJUNCTION of all of them have any effect at all — on stdout OR on disk.`);
    console.log(`POPULATION BOUNDARY: only hooks .claude/settings.json wires. scripts/pre-commit.sh and`);
    console.log(`scripts/close-branch.sh are real, later links in the chain a commit/branch-close walks and`);
    console.log(`sit entirely outside settings.json — NOT included, NOT implied to be included.`);
    const scenarios = buildScenarios().filter((s) => {
      if (!filter) return true;
      if (s.label.includes(filter)) return true;
      const wouldMeet = s.steps("preview-session", "preview-target").flatMap((st) => hooksForStep(st.event, st.toolName));
      return wouldMeet.some((h) => h.includes(filter));
    });
    scenarios.forEach((scenario, i) => {
      const r = runScenario(scenario, i);
      console.log("");
      console.log(`  SCENARIO: ${r.label}`);
      console.log(`    ${r.note}`);
      r.steps.forEach((step, si) => {
        const tag = si === r.steps.length - 1 && r.steps.length > 1 ? " [the act under test]" : r.steps.length > 1 ? " [priming]" : "";
        console.log(`    step ${si + 1}: ${step.event}${step.toolName ? ` (tool_name=${step.toolName})` : ""} — meets ${step.runs.length} hook(s)${tag}`);
        for (const run of step.runs) {
          console.log(`      ${run.hook}   bytes=${run.result.bytes}  exit=${run.result.exitCode}  ${preview(run.result)}`);
        }
        if (step.diskChanges.length) {
          console.log(`      disk changed: ${step.diskChanges.map((c) => `${c.kind} ${c.path.split(/[\\/]/).slice(-2).join("/")}`).join(", ")}`);
        }
        console.log(`      step verdict: ${step.verdict}`);
      });
      console.log(`    SCENARIO VERDICT (last step): ${r.headline}`);
    });

    console.log("");
    console.log(`NOT CHECKED by this tool: whether emitted text is correct, whether a DENY was the right call,`);
    console.log(`whether these states/scenarios cover every real trigger, whether the wiring above is well`);
    console.log(`DESIGNED (only --check's narrower "is it well FORMED" is a gate here), or any link in a real`);
    console.log(`chain that sits outside .claude/settings.json (pre-commit.sh, close-branch.sh, and so on).`);
  } finally {
    try { rmSync(SANDBOX_ROOT, { recursive: true, force: true }); } catch { /* best effort */ }
    try { rmSync(PROBE_TMP, { recursive: true, force: true }); } catch { /* best effort */ }
  }
}

main();
