#!/usr/bin/env bash
# @size-exempt: pre-existing size debt (638 lines on develop, unchanged by the one-line reference correction
# that first surfaced it to this gate) -- whoever owns this suite decides whether to split it; this branch
# only renamed a sibling selftest it cites and declines to take on a split it did not cause.
# selftest/keeper-worktree-guard.sh — ANSWERS: does .claude/hooks/keeper-worktree-guard.cjs actually detect,
# AUTOMATICALLY and UNCONDITIONALLY (no marker, no arming step -- that CLI, scripts/keeper-worktree-guard.mjs,
# is retired and no longer exists), that the calling session is rooted inside a LINKED WORKTREE via real
# `git rev-parse` identity, and DENY an Edit/Write/MultiEdit whose resolved file_path lands inside the MAIN
# TREE while the session is worktree-rooted -- via the REAL directory-prefix check on git identity, never via
# string pattern-matching on the path's own text, proven both ways: DENY still fires when the main-tree path's
# text happens to mimic the worktree's own leaf name (Case 4), and PASSTHROUGH still holds when a legitimate
# worktree-rooted path's text happens to mimic the main tree's own leaf name (Case 4b) -- while staying silent
# (passthrough) for a write that targets the caller's own worktree, for a main-checkout session writing inside
# its own main tree, and when `git` itself cannot be resolved. WHEN: after touching keeper-worktree-guard.cjs.
#
# Drives the real hook via subprocess with JSON on stdin, exactly the minimal shape a real PreToolUse event
# carries ({"tool_input":{"file_path":...},"cwd":...} — see keeper-worktree-guard.cjs's own header) — never
# imports its internals. This IS the correct proof method here, not a lesser substitute: keeper-worktree-guard.cjs
# IS already wired into .claude/settings.json's own PreToolUse Edit|Write|MultiEdit matcher — verified live
# against this repo's own settings.json before writing this claim. (A PRIOR version of this file's own header
# claimed the opposite, that the hook was "not yet wired into the .claude/settings.json that governs a live
# main-checkout session" — that claim was false and is corrected here, not carried forward.) Direct subprocess
# invocation, feeding the exact stdin shape the harness would produce and inspecting stdout/exit code, is
# still the standard, legitimate way to unit-test a hook script without driving a real Edit/Write tool call,
# and is the same method this repo's own selftest/harness-lookup.sh and selftest/spawn-verbatim-origin-gate.mjs
# use.
#
# THE FIXTURE, REWRITTEN FROM SCRATCH: the hook now decides everything from REAL `git rev-parse` output, so
# this selftest exercises it against a REAL, throwaway git repository with a REAL linked worktree — never
# fake JSON marker fixtures (there is no marker any more). Both scratch trees are created fresh under the OS
# temp dir via mktemp, never the real repo trees, and are cleaned up unconditionally via an EXIT trap.
set -euo pipefail
# @keep-comment -- the cache root comes from .grimorio/scripts/refobl/skill-roots.json's `cacheRoot`, the SAME
# declaration the hooks read. A literal here is how all seven of these selftests broke at once when
# the root moved: the fixture wrote to one path and the code under test read the other.
CACHE_REL="$(node -p "require('$(git rev-parse --show-toplevel)/.grimorio/scripts/refobl/cache-paths.cjs').cacheRoot()")"
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes
ROOT="$(pwd -W 2>/dev/null || pwd)"
HOOK="$ROOT/.claude/hooks/keeper-worktree-guard.cjs"
NODE_BIN="$(command -v node)"

FAIL=0
FAILED_CASES=()

assert_empty() {
  local out="$1" label="$2"
  if [[ -z "$out" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected empty stdout (passthrough), got:"
    echo "$out" | sed 's/^/  /'
    FAIL=1
    FAILED_CASES+=("$label")
  fi
}
assert_exit0() {
  local code="$1" label="$2"
  if [[ "$code" -eq 0 ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected exit 0, got $code"
    FAIL=1
    FAILED_CASES+=("$label")
  fi
}
# Parses stdout as JSON and checks hookSpecificOutput.permissionDecision === "deny" plus that the reason
# names the worktree-equivalent path — NEVER a substring grep on the raw envelope (per the brief's own
# requirement to parse the JSON, not grep for a substring).
assert_deny_json() { # assert_deny_json <json-output> <expected-worktree-equiv-path> <label>
  local out="$1" expected_path="$2" label="$3" result
  result="$(printf '%s' "$out" | node -e '
    let raw = "";
    process.stdin.on("data", d => raw += d);
    process.stdin.on("end", () => {
      const expected = process.argv[1];
      let parsed;
      try { parsed = JSON.parse(raw); } catch (e) { console.log("PARSE_FAIL:" + e.message); return; }
      const hso = parsed && parsed.hookSpecificOutput;
      if (!hso) { console.log("NO_HOOKSPECIFICOUTPUT"); return; }
      if (hso.permissionDecision !== "deny") { console.log("WRONG_DECISION:" + hso.permissionDecision); return; }
      const reason = hso.permissionDecisionReason || "";
      if (!reason.includes(expected)) { console.log("REASON_MISSING_WORKTREE_PATH"); return; }
      console.log("OK");
    });
  ' "$expected_path")"
  if [[ "$result" == "OK" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — $result"
    echo "  --- raw output ---"
    echo "$out" | sed 's/^/  /'
    FAIL=1
    FAILED_CASES+=("$label")
  fi
}

# Parses stdout as JSON and checks hookSpecificOutput.permissionDecision === "deny" plus that the reason
# contains an arbitrary expected substring — the generic sibling of assert_deny_json above, used by the
# occupancy-check cases (C1) where the expected substring is an occupant's agentId/description, never a
# worktree-equivalent path.
assert_deny_contains() { # assert_deny_contains <json-output> <expected-substring> <label>
  local out="$1" expected="$2" label="$3" result
  result="$(printf '%s' "$out" | node -e '
    let raw = "";
    process.stdin.on("data", d => raw += d);
    process.stdin.on("end", () => {
      const expected = process.argv[1];
      let parsed;
      try { parsed = JSON.parse(raw); } catch (e) { console.log("PARSE_FAIL:" + e.message); return; }
      const hso = parsed && parsed.hookSpecificOutput;
      if (!hso) { console.log("NO_HOOKSPECIFICOUTPUT"); return; }
      if (hso.permissionDecision !== "deny") { console.log("WRONG_DECISION:" + hso.permissionDecision); return; }
      const reason = hso.permissionDecisionReason || "";
      if (!reason.includes(expected)) { console.log("REASON_MISSING_EXPECTED_TEXT"); return; }
      console.log("OK");
    });
  ' "$expected")"
  if [[ "$result" == "OK" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — $result"
    echo "  --- raw output ---"
    echo "$out" | sed 's/^/  /'
    FAIL=1
    FAILED_CASES+=("$label")
  fi
}
# Parses stdout as JSON and checks it carries a NON-BLOCKING additionalContext naming an expected substring,
# and explicitly that permissionDecision is ABSENT (never merely not "deny" — an occupancy reminder must never
# carry that key at all). Used by the main-loop-side occupancy case (B1).
assert_reminder_json() { # assert_reminder_json <json-output> <expected-substring> <label>
  local out="$1" expected="$2" label="$3" result
  result="$(printf '%s' "$out" | node -e '
    let raw = "";
    process.stdin.on("data", d => raw += d);
    process.stdin.on("end", () => {
      const expected = process.argv[1];
      let parsed;
      try { parsed = JSON.parse(raw); } catch (e) { console.log("PARSE_FAIL:" + e.message); return; }
      const hso = parsed && parsed.hookSpecificOutput;
      if (!hso) { console.log("NO_HOOKSPECIFICOUTPUT"); return; }
      if (Object.prototype.hasOwnProperty.call(hso, "permissionDecision")) {
        console.log("UNEXPECTED_PERMISSION_DECISION:" + hso.permissionDecision); return;
      }
      const ctx = hso.additionalContext || "";
      if (!ctx.includes(expected)) { console.log("CONTEXT_MISSING_EXPECTED_TEXT"); return; }
      console.log("OK");
    });
  ' "$expected")"
  if [[ "$result" == "OK" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — $result"
    echo "  --- raw output ---"
    echo "$out" | sed 's/^/  /'
    FAIL=1
    FAILED_CASES+=("$label")
  fi
}
assert_eq() { # assert_eq <actual> <expected> <label>
  local actual="$1" expected="$2" label="$3"
  if [[ "$actual" == "$expected" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected '$expected', got '$actual'"
    FAIL=1
    FAILED_CASES+=("$label")
  fi
}

winjoin() { # winjoin <base> <rel...> — mirrors the hook's own path.join so expected strings match exactly
  node -e '
    const path = require("path");
    process.stdout.write(path.join(...process.argv.slice(1)));
  ' "$@"
}

build_stdin() { # build_stdin <file_path> <cwd>
  # FIXED (this pass, grimorio.qa, found while running the baseline before adding anything new): main()'s
  # four-responsibility dispatch table routes SOLELY on hook_event_name (+ tool_name for the Bash branch) --
  # it never falls back to "no event name means Edit guard". Before this fix, this builder omitted
  # hook_event_name entirely, so EVERY original case silently matched NONE of main()'s four branches and ran
  # NO check at all -- Cases 2/3/4b/5 (all of which assert EMPTY output) passed VACUOUSLY regardless of
  # whether handleEditGuard() actually ran, while Cases 1/4 (which assert a real DENY) failed outright. A real
  # PreToolUse Edit/Write/MultiEdit event always carries both fields -- restoring them here is fidelity to the
  # real event shape, not a new behavior.
  node -e '
    process.stdout.write(JSON.stringify({
      hook_event_name: "PreToolUse",
      tool_name: "Edit",
      tool_input: {file_path: process.argv[1]},
      cwd: process.argv[2],
    }));
  ' "$1" "$2"
}

run_hook() { # run_hook <file_path> <project_dir> — prints stdout, caller captures $? separately
  build_stdin "$1" "$2" | CLAUDE_PROJECT_DIR="$2" node "$HOOK"
}

# run_hook_git_unresolvable <file_path> <project_dir> — Case 5 only. Resolves node's OWN absolute path first
# (via `command -v`, using the shell's normal PATH), then invokes that absolute path directly with PATH=""
# in the CHILD node process's own environment. This breaks ONLY the hook's internal `execFileSync("git", ...)`
# call (which relies on PATH to locate the "git" binary) — it does NOT break node itself, because node was
# started via its resolved absolute path, never via a bare "node" that would itself need PATH to be found.
# Simply setting PATH="" on the whole `node "$HOOK"` invocation (the naive approach) was rejected because the
# shell would then be unable to resolve the bare "node" command either, breaking the hook's own process before
# it ever ran — this two-step resolve-then-invoke approach is the documented fix for that, per this file's own
# brief.
run_hook_git_unresolvable() {
  build_stdin "$1" "$2" | CLAUDE_PROJECT_DIR="$2" PATH="" "$NODE_BIN" "$HOOK"
}

# ================================================================================================================
# RESPONSIBILITIES 2-4 fixtures — registration/clearing lifecycle (PostToolUse:Agent / SubagentStop) and the
# Bash occupancy check (PreToolUse:Bash). One builder per real event shape, mirroring build_stdin/run_hook
# above — never a shared "generic event" builder, so each function's own argument list documents exactly what
# that real event carries.
# ================================================================================================================

build_stdin_post_agent() { # build_stdin_post_agent <cwd> <tool_use_id> <isolation-or-empty> <status> <agent_id-or-empty> <description>
  node -e '
    const [cwd, toolUseId, isolation, status, agentId, description] = process.argv.slice(1);
    const payload = {
      hook_event_name: "PostToolUse",
      tool_name: "Agent",
      cwd,
      tool_use_id: toolUseId,
      tool_input: {description: description || ""},
      tool_response: {status},
    };
    if (isolation) payload.tool_input.isolation = isolation;
    if (agentId) payload.tool_response.agentId = agentId;
    process.stdout.write(JSON.stringify(payload));
  ' "$1" "$2" "$3" "$4" "$5" "$6"
}
run_hook_post_agent() { # same positional args as build_stdin_post_agent — $1 (cwd) doubles as the project dir
  build_stdin_post_agent "$@" | CLAUDE_PROJECT_DIR="$1" node "$HOOK"
}

# build_stdin_subagent_stop <cwd> <agent_id> [background_tasks_json]
# The THIRD argument is optional ON PURPOSE. Omitting it produces a payload carrying NO background_tasks key
# at all -- the "absent" case, which the hook must treat as "cannot establish a terminal stop" and refuse to
# clear on. Absence is not emptiness, and every pre-existing case below leans on exactly that distinction:
# that is why none of them needed an edit when SubagentStop stopped being a no-op.
build_stdin_subagent_stop() {
  node -e '
    const [cwd, agentId, bg] = process.argv.slice(1);
    const payload = {hook_event_name: "SubagentStop", cwd, agent_id: agentId};
    if (bg !== undefined && bg !== "") payload.background_tasks = JSON.parse(bg);
    process.stdout.write(JSON.stringify(payload));
  ' "$1" "$2" "${3-}"
}
run_hook_subagent_stop() {
  build_stdin_subagent_stop "$@" | CLAUDE_PROJECT_DIR="$1" node "$HOOK"
}

build_stdin_bash() { # build_stdin_bash <cwd> <command> <agent_type-or-empty> <agent_id-or-empty>
  node -e '
    const [cwd, command, agentType, agentId] = process.argv.slice(1);
    const payload = {hook_event_name: "PreToolUse", tool_name: "Bash", cwd, tool_input: {command}};
    if (agentType) payload.agent_type = agentType;
    if (agentId) payload.agent_id = agentId;
    process.stdout.write(JSON.stringify(payload));
  ' "$1" "$2" "$3" "$4"
}
run_hook_bash() { # same positional args as build_stdin_bash — $1 (cwd) doubles as the project dir
  build_stdin_bash "$@" | CLAUDE_PROJECT_DIR="$1" node "$HOOK"
}

# --- Registry fixture helpers — plain JSON file I/O on the SAME shared tree's own registry, per the brief's own
# instruction: "no special tooling exists for it, it's a plain JSON file". Built with plain forward-slash paths
# for our OWN bash-side mkdir/rm/cat calls (unrelated to winjoin above, which exists only to match the hook's
# own INTERNAL path.join()-produced strings inside a denial message — the registry file's own on-disk location
# does not need that exact-string matching, only a consistent physical path, and Windows treats forward- and
# back-slash paths as the same location either way).
reset_registry() { # reset_registry <tree_root_win> — clears any existing registry so each case starts clean
  rm -f "$1/${CACHE_REL}/tree-occupants.json"
}
write_registry_entry() { # write_registry_entry <tree_root_win> <key> <agent_id-or-empty> <description> <dispatched_at_iso>
  local tree="$1" key="$2" agent_id="$3" description="$4" dispatched_at="$5"
  mkdir -p "$tree/${CACHE_REL}"
  node -e '
    const fs = require("fs");
    const [regPath, key, agentId, description, dispatchedAt] = process.argv.slice(1);
    const registry = {};
    registry[key] = {toolUseId: key, agentId: agentId || null, description, dispatchedAt, status: "live"};
    fs.writeFileSync(regPath, JSON.stringify(registry));
  ' "$tree/${CACHE_REL}/tree-occupants.json" "$key" "$agent_id" "$description" "$dispatched_at"
}
registry_has_key() { # registry_has_key <tree_root_win> <key> — prints "yes" or "no"
  node -e '
    const fs = require("fs");
    const [p, key] = process.argv.slice(1);
    let obj = {};
    try { obj = JSON.parse(fs.readFileSync(p, "utf8")); } catch (_) { /* no file yet -> {} */ }
    console.log(Object.prototype.hasOwnProperty.call(obj, key) ? "yes" : "no");
  ' "$1/${CACHE_REL}/tree-occupants.json" "$2"
}
registry_has_agent() { # registry_has_agent <tree_root_win> <agent_id> — prints "yes" or "no", any key
  node -e '
    const fs = require("fs");
    const [p, id] = process.argv.slice(1);
    let obj = {};
    try { obj = JSON.parse(fs.readFileSync(p, "utf8")); } catch (_) { /* no file yet -> {} */ }
    const found = Object.values(obj).some((e) => e && e.agentId === id);
    console.log(found ? "yes" : "no");
  ' "$1/${CACHE_REL}/tree-occupants.json" "$2"
}
iso_now() { node -e 'process.stdout.write(new Date().toISOString())'; }
iso_hours_ago() { node -e 'process.stdout.write(new Date(Date.now() - Number(process.argv[1]) * 60 * 60 * 1000).toISOString())' "$1"; }

# --- FINDING-01 fixture helpers (grimorio.code-reviewer, REWORK cycle 2) ----------------------------------------
# HISTORICAL, and deliberately kept: handleSubagentStop USED to check the agent's own completions-log row
# before deregistering it, dynamically importing .grimorio/scripts/lib/agent-log-rows.mjs from the SAME tree
# CLAUDE_PROJECT_DIR resolves to. It no longer reads that log at all — it decides only from platform-set
# payload fields. This helper is retained ON PURPOSE, not by oversight: cases R2/R5b/R9 still provision the
# module and write a genuine completion row, so that the assertion "the agent's own claim buys NOTHING" is
# made in the STRONGEST case for clearing (real self-authored evidence actually present and reachable),
# rather than passing vacuously because the module was missing. Remove this helper only together with those
# cases' own reason for existing.
provision_agent_log_rows_module() { # provision_agent_log_rows_module <tree_root_win>
  mkdir -p "$1/.grimorio/scripts/lib"
  cp "$ROOT/.grimorio/scripts/lib/agent-log-rows.mjs" "$1/.grimorio/scripts/lib/agent-log-rows.mjs"
}
write_completion_row() { # write_completion_row <tree_root_win> <agent_id> <last_assistant_message>
  mkdir -p "$1/${CACHE_REL}"
  node -e '
    const fs = require("fs");
    const [logPath, agentId, message] = process.argv.slice(1);
    const row = [new Date().toISOString(), "selftst", agentId, "grimorio.qa", JSON.stringify(message), "-"].join("\t");
    fs.appendFileSync(logPath, row + "\n");
  ' "$1/${CACHE_REL}/agent-completions.log" "$2" "$3"
}
reset_completions_log() { # reset_completions_log <tree_root_win>
  rm -f "$1/${CACHE_REL}/agent-completions.log"
}

# --- Scratch fixtures: a REAL throwaway git repo standing in for the main tree, plus a REAL linked worktree ---
MAINTREE_DIR="$(mktemp -d)"
WORKTREE_PARENT="$(mktemp -d)"
WORKTREE_DIR="$WORKTREE_PARENT/wt"
REL_PATH="fixture/Keeper-Guard-SelfTest-Protected.md"

git -C "$MAINTREE_DIR" init -q -b main
git -C "$MAINTREE_DIR" config user.email test@example.com
git -C "$MAINTREE_DIR" config user.name "Test"
mkdir -p "$MAINTREE_DIR/fixture"
printf 'selftest fixture\n' > "$MAINTREE_DIR/$REL_PATH"
git -C "$MAINTREE_DIR" add "$REL_PATH"
git -C "$MAINTREE_DIR" commit -q -m "keeper-worktree-guard selftest fixture commit"

# A NEW, not-yet-existing path — `git worktree add` creates it.
git -C "$MAINTREE_DIR" worktree add -q -b selftest-branch "$WORKTREE_DIR"

MAINTREE_WIN="$(cd "$MAINTREE_DIR" && pwd -W 2>/dev/null || pwd)"
WORKTREE_WIN="$(cd "$WORKTREE_DIR" && pwd -W 2>/dev/null || pwd)"
WORKTREE_LEAF="$(basename "$WORKTREE_DIR")"

cleanup() {
  rm -rf "$MAINTREE_DIR" "$WORKTREE_PARENT"
}
trap cleanup EXIT

MAIN_PROTECTED_PATH="$(winjoin "$MAINTREE_WIN" "$REL_PATH")"
WORKTREE_OWN_PATH="$(winjoin "$WORKTREE_WIN" "$REL_PATH")"
# Case 4's fixture: a main-tree path that textually contains the worktree's own leaf directory name
# ("$WORKTREE_LEAF") as one of its own path segments — a string that LOOKS like it could be the worktree, but
# resolves entirely inside the main tree. Proves the guard keys off real git identity, never string
# pattern-matching, when run (per Case 4 below) from a WORKTREE session — the same base Case 1/2 use.
MAIN_MIMIC_PATH="$(winjoin "$MAINTREE_WIN" "$WORKTREE_LEAF/keeper-guard-selftest-mimic.md")"
# Case 4b's fixture (the negative companion): a WORKTREE-rooted path that textually contains the MAIN tree's own
# leaf directory name as one of its own path segments — the inverse mimicry, resolving entirely inside the
# worktree. A regression to careless substring/pattern-matching on the main tree's own name would incorrectly
# DENY this; the real directory-prefix check must not.
MAINTREE_LEAF="$(basename "$MAINTREE_DIR")"
MIMIC_IN_WORKTREE_PATH="$(winjoin "$WORKTREE_WIN" "$MAINTREE_LEAF/keeper-guard-selftest-mimic2.md")"

echo "=== keeper-worktree-guard.cjs selftest ==="
echo "scratch main-tree root : $MAINTREE_WIN"
echo "scratch worktree root  : $WORKTREE_WIN"
echo

# --- Case 1: COLD-START DENY (the inverse of the old measured bug) --------------------------------------------
# Worktree-rooted session, write resolves under the MAIN tree, ZERO setup/arming of any kind. This is the exact
# case that used to reproduce the measured bug (silently ALLOWED) — it must now be caught automatically.
set +e; OUT1="$(run_hook "$MAIN_PROTECTED_PATH" "$WORKTREE_WIN")"; EXIT1=$?; set -e
assert_exit0 "$EXIT1" "Case 1 — COLD-START, worktree session writing into main tree: hook itself exits 0"
assert_deny_json "$OUT1" "$WORKTREE_OWN_PATH" "Case 1 — COLD-START, worktree session writing into main tree: DENIED with no setup, reason names the worktree-equivalent path"

# --- Case 2: worktree session, write targets its OWN worktree → PASSTHROUGH -----------------------------------
set +e; OUT2="$(run_hook "$WORKTREE_OWN_PATH" "$WORKTREE_WIN")"; EXIT2=$?; set -e
assert_exit0 "$EXIT2" "Case 2 — worktree session writing into its own worktree: exit 0"
assert_empty "$OUT2" "Case 2 — worktree session writing into its own worktree: never blocked"

# --- Case 3: main-checkout session, write targets the main tree → PASSTHROUGH ---------------------------------
# A session legitimately working IN the main tree must never be denied — the hard constraint this rewrite must
# hold, proven directly: gitDir === commonDir for this session, so the check never even reaches the path test.
set +e; OUT3="$(run_hook "$MAIN_PROTECTED_PATH" "$MAINTREE_WIN")"; EXIT3=$?; set -e
assert_exit0 "$EXIT3" "Case 3 — main-checkout session writing into its own main tree: exit 0"
assert_empty "$OUT3" "Case 3 — main-checkout session writing into its own main tree: never blocked"

# --- Case 4: worktree session, main-tree path textually resembles the worktree's own leaf name → DENY ----------
# Previously this case ran from a MAIN-CHECKOUT session — byte-identical to Case 3's own early-return branch,
# since main() returns before the incoming path is ever compared, for ANY main-checkout session — so it never
# actually exercised the mimicry text at all; a regression to careless substring-matching would have passed it
# unnoticed. Rewritten to run from the WORKTREE session instead (the same base Case 1/2 use), targeting the same
# MAIN_MIMIC_PATH: this path genuinely IS under the main tree, so the correct verdict is DENY — proving the guard
# reaches DENY via the real directory-prefix check on git identity, not via any string-pattern shortcut. NOTE: a
# regression to careless substring-matching would ALSO deny here (the mimicry text alone doesn't distinguish the
# two) — see Case 4b below for the negative companion that does.
MIMIC_WORKTREE_EQUIV_PATH="$(winjoin "$WORKTREE_WIN" "$WORKTREE_LEAF/keeper-guard-selftest-mimic.md")"
set +e; OUT4="$(run_hook "$MAIN_MIMIC_PATH" "$WORKTREE_WIN")"; EXIT4=$?; set -e
assert_exit0 "$EXIT4" "Case 4 — worktree session, main-tree path mimicking the worktree's own leaf name: hook itself exits 0"
assert_deny_json "$OUT4" "$MIMIC_WORKTREE_EQUIV_PATH" "Case 4 — worktree session, main-tree path mimicking the worktree's own leaf name: DENIED via the real directory-prefix check, reason names the worktree-equivalent path"

# --- Case 4b: worktree session, own-worktree path textually resembles the main tree's own leaf name → PASSTHROUGH
# The negative companion to Case 4: this path is NOT under the main tree (it resolves entirely inside the
# worktree), yet its text contains the main tree's own leaf directory name as a path segment — exactly the case
# that WOULD incorrectly DENY under a careless substring/pattern-matching regression, and must NOT under the
# real directory-prefix check. Together, Case 4 and 4b distinguish identity-matching from pattern-matching —
# neither alone would catch a regression to the latter.
set +e; OUT4B="$(run_hook "$MIMIC_IN_WORKTREE_PATH" "$WORKTREE_WIN")"; EXIT4B=$?; set -e
assert_exit0 "$EXIT4B" "Case 4b — worktree session, own-worktree path mimicking the main tree's own leaf name: exit 0"
assert_empty "$OUT4B" "Case 4b — worktree session, own-worktree path mimicking the main tree's own leaf name: never blocked — proves DENY isn't reached by string pattern-matching either"

# --- Case 5: fail-open when `git` itself cannot be resolved → PASSTHROUGH -------------------------------------
# Worktree session, but PATH stripped for the hook's own child process only (see run_hook_git_unresolvable's
# own comment for why this breaks git resolution without breaking node itself). Proves the internal
# fail-open-on-error invariant survives the rewrite: an unresolvable git degrades to silent passthrough, never
# a denial and never a crash.
set +e; OUT5="$(run_hook_git_unresolvable "$MAIN_PROTECTED_PATH" "$WORKTREE_WIN")"; EXIT5=$?; set -e
assert_exit0 "$EXIT5" "Case 5 — git unresolvable (PATH stripped for the hook's child process): exit 0"
assert_empty "$OUT5" "Case 5 — git unresolvable (PATH stripped for the hook's child process): fails open, never denies"

# =================================================================================================================
# RESPONSIBILITIES 2-4 — TREE OCCUPANCY AWARENESS (NEW cases below). Reuses WORKTREE_DIR/WORKTREE_WIN as "the
# shared tree" for every case in this section rather than minting a second scratch tree: it is already a REAL
# linked worktree with real git identity (created above for Cases 1-5), resolveGitFacts() needs nothing more
# than that, and a second throwaway tree would only duplicate setup/cleanup cost for no added proof value.
# =================================================================================================================
echo
echo "=== responsibilities 2-4 (tree occupancy awareness) ==="

# --- Case R1 (fire): PostToolUse:Agent, isolation NOT "worktree", status "async_launched" -> registry entry --
reset_registry "$WORKTREE_WIN"
set +e; OUT_R1="$(run_hook_post_agent "$WORKTREE_WIN" "toolu_r1" "" "async_launched" "agent_r1" "R1 background helper")"; EXIT_R1=$?; set -e
assert_exit0 "$EXIT_R1" "Case R1 — PostToolUse:Agent, shared-tree async_launched dispatch: hook itself exits 0"
R1_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r1")"
assert_eq "$R1_HAS_KEY" "yes" "Case R1 — PostToolUse:Agent, shared-tree async_launched dispatch: registry entry created"

# --- Case R2 (fire, CHAINED after R1): a matching SubagentStop with NO background_tasks field, EVEN WITH a
# genuine FINAL_CLOSE row present, never clears the entry ---------------------------------------------------
# WHY IT SURVIVES, stated exactly (2026-09-07): NOT because SubagentStop is a no-op -- it clears again, see
# R6/R6b below -- but because this payload carries no background_tasks key at all, and an absent field is
# unanswerable, so the guard fails closed. That is the same path R8 tests explicitly. This case still
# provisions the completions-log module and writes a genuine FINAL_CLOSE row for agent_r1, and that is the
# whole point: it proves the survival holds in the STRONGEST case for clearing, with the agent's own
# "VERIFIED" claim actually present and reachable, rather than passing vacuously because the module was
# missing. The agent's own text has no path into this decision -- that is what R2 pins down.
reset_completions_log "$WORKTREE_WIN"
provision_agent_log_rows_module "$WORKTREE_WIN"
write_completion_row "$WORKTREE_WIN" "agent_r1" "## Close: VERIFIED — done"
set +e; OUT_R2="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r1")"; EXIT_R2=$?; set -e
assert_exit0 "$EXIT_R2" "Case R2 — SubagentStop, matching agent_id, genuine FINAL_CLOSE row present: hook itself exits 0"
R2_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r1")"
assert_eq "$R2_HAS_KEY" "yes" "Case R2 — SubagentStop, matching agent_id, genuine FINAL_CLOSE row present: R1's registry entry SURVIVES (payload carries NO background_tasks -> absent fails closed, same path as R8)"

# --- Case R3 (silent): tool_response.status "completed" (foreground, already-finished) -> NO lasting entry ----
reset_registry "$WORKTREE_WIN"
set +e; OUT_R3="$(run_hook_post_agent "$WORKTREE_WIN" "toolu_r3" "" "completed" "agent_r3" "R3 foreground helper")"; EXIT_R3=$?; set -e
assert_exit0 "$EXIT_R3" "Case R3 — PostToolUse:Agent, status completed (foreground): hook itself exits 0"
R3_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r3")"
assert_eq "$R3_HAS_KEY" "no" "Case R3 — PostToolUse:Agent, status completed (foreground): no lasting registry entry"

# --- Case R4 (silent): isolation:"worktree" -> NO entry, regardless of status --------------------------------
reset_registry "$WORKTREE_WIN"
set +e; OUT_R4="$(run_hook_post_agent "$WORKTREE_WIN" "toolu_r4" "worktree" "async_launched" "agent_r4" "R4 isolated helper")"; EXIT_R4=$?; set -e
assert_exit0 "$EXIT_R4" "Case R4 — PostToolUse:Agent, isolation:worktree dispatch: hook itself exits 0"
R4_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r4")"
assert_eq "$R4_HAS_KEY" "no" "Case R4 — PostToolUse:Agent, isolation:worktree dispatch: no registry entry created"

# --- Case R5/R5b: SubagentStop fires TWICE for the SAME agent -- the documented shape (subagentstop-wait.cjs's
# own header) where the platform fires SubagentStop multiple times before an agent's true terminal stop.
# HISTORY, kept because it is why this case exists: before any completions-log check, ANY firing cleared the
# entry unconditionally; a FINAL_CLOSE check then gated it on the agent's own final-message shape, and that
# check was itself measured satisfied by ~1 in 5 NON-final firings (the hook's own header, "MEASURED, THEN
# FIXED"), so it could never be trusted either and is now deleted outright.
# WHY BOTH FIRINGS SURVIVE TODAY (2026-09-07), stated exactly: NOT because SubagentStop is a no-op -- it clears
# again, see R6/R6b below -- but because neither payload carries a background_tasks key, and an absent field is
# unanswerable, so the guard fails closed on both. The second firing adds a genuine FINAL_CLOSE row to prove
# that a self-authored completion claim changes nothing across repeated firings, not just a single one.
# Entries are now removed by TWO paths: this event (R6/R6b), and the staleness prune on the separate
# handleBashGitCommand path (Case D3 below), which is the backstop for a SubagentStop that never arrives.
reset_registry "$WORKTREE_WIN"
reset_completions_log "$WORKTREE_WIN"
provision_agent_log_rows_module "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_r5" "agent_r5" "R5 background helper" "$(iso_now)"
set +e; OUT_R5="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r5")"; EXIT_R5=$?; set -e
assert_exit0 "$EXIT_R5" "Case R5 — SubagentStop, FIRST firing, no qualifying completions-log row yet: hook itself exits 0"
R5_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r5")"
assert_eq "$R5_HAS_KEY" "yes" "Case R5 — SubagentStop, FIRST firing: registry entry SURVIVES (payload carries NO background_tasks -> absent fails closed)"

write_completion_row "$WORKTREE_WIN" "agent_r5" "## Close: VERIFIED — done"
set +e; OUT_R5B="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r5")"; EXIT_R5B=$?; set -e
assert_exit0 "$EXIT_R5B" "Case R5b — SubagentStop, SECOND firing, real FINAL_CLOSE row now present: hook itself exits 0"
R5B_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r5")"
assert_eq "$R5B_HAS_KEY" "yes" "Case R5b — SubagentStop, SECOND firing, real FINAL_CLOSE row now present: registry entry STILL SURVIVES (the completions log has no path into this decision at all)"

# --- Cases R6-R9 (2026-09-07): SubagentStop CLEARS again, but only on two PLATFORM-SET fields ---------------
# Both directions are proven here, because only proving one is how the superseded version shipped: a check
# that can never clear passes every "does not clear early" test trivially, and a check that always clears
# passes every "does clear" test trivially. Neither alone is evidence.
#
# R6 is the ONLY case in this file that clears an entry via SubagentStop; R7-R9 are the three fail-closed
# refusals. Note what R9 does NOT rely on: a completions-log row saying VERIFIED is present and is still
# ignored -- the agent's own text has no path into this decision at all any more.
reset_registry "$WORKTREE_WIN"
reset_completions_log "$WORKTREE_WIN"
provision_agent_log_rows_module "$WORKTREE_WIN"

# R6 — THE REAL SHAPE, copied from the probe capture, not an idealized one. At a background agent's own
# terminal stop the platform still lists THE AGENT ITSELF in background_tasks with status "running":
#   agent_id ad2a9012b1f3fd472 -> [{"id":"ad2a9012b1f3fd472","type":"subagent","status":"running",...}]
# A first version of this case used a literal [] and passed while the mechanism was INERT for every real
# background dispatch — the only population this registry tracks. That accidental pass is exactly what
# grimorio.code-reviewer's own cycle-1 CRITICAL caught, by replaying the captured payload against the hook.
# Using the real shape here is what makes this case evidence rather than decoration.
write_registry_entry "$WORKTREE_WIN" "toolu_r6" "agent_r6" "R6 background helper" "$(iso_now)"
set +e; OUT_R6="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r6" '[{"id":"agent_r6","type":"subagent","status":"running","description":"R6 background helper"}]')"; EXIT_R6=$?; set -e
assert_exit0 "$EXIT_R6" "Case R6 — SubagentStop, real captured shape (self-entry only in background_tasks): hook itself exits 0"
R6_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r6")"
assert_eq "$R6_HAS_KEY" "no" "Case R6 — SubagentStop, background_tasks holds ONLY the stopping agent's own self-entry: entry CLEARS (the real terminal-stop shape, not a literal [])"

# R6b — a literal [] must still clear. Kept as a separate case rather than folded into R6: if the platform
# ever stops self-listing, this is the shape that arrives, and nothing else in this file would notice.
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_r6b" "agent_r6b" "R6b background helper" "$(iso_now)"
set +e; OUT_R6B="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r6b" "[]")"; EXIT_R6B=$?; set -e
assert_exit0 "$EXIT_R6B" "Case R6b — SubagentStop, literal empty background_tasks: hook itself exits 0"
R6B_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r6b")"
assert_eq "$R6B_HAS_KEY" "no" "Case R6b — SubagentStop, literal empty background_tasks: entry CLEARS"

# R7 — background_tasks holds an entry that is NOT the stopping agent: genuinely other live work, so the stop
# is not terminal for occupancy purposes and the tree MUST stay occupied. Note this shape is INFERRED, never
# observed — the capture contains no dispatch that raised a child of its own — which is why the conservative
# reading was chosen: an unrecognized entry blocks the clear.
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_r7" "agent_r7" "R7 background helper" "$(iso_now)"
set +e; OUT_R7="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r7" '[{"id":"agent_r7","status":"running"},{"id":"some_other_child","status":"running"}]')"; EXIT_R7=$?; set -e
assert_exit0 "$EXIT_R7" "Case R7 — SubagentStop, background_tasks holds the self-entry PLUS a distinct child: hook itself exits 0"
R7_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r7")"
assert_eq "$R7_HAS_KEY" "yes" "Case R7 — a background_tasks entry that is NOT the stopping agent: entry SURVIVES (other live work means the stop is not terminal)"

# R8 — background_tasks ABSENT entirely. Absence is not emptiness: the field's non-empty behaviour was never
# observed, so an unparseable state is refused rather than interpreted.
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_r8" "agent_r8" "R8 background helper" "$(iso_now)"
set +e; OUT_R8="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r8")"; EXIT_R8=$?; set -e
assert_exit0 "$EXIT_R8" "Case R8 — SubagentStop, matching agent_id, background_tasks ABSENT: hook itself exits 0"
R8_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r8")"
assert_eq "$R8_HAS_KEY" "yes" "Case R8 — SubagentStop, background_tasks ABSENT: entry SURVIVES (absence is not emptiness — fail closed)"

# R9 — THE REGRESSION THIS WHOLE REWORK EXISTS TO PREVENT. A genuine FINAL_CLOSE row is written (the agent
# claiming, in its own words, that it finished) and background_tasks is non-empty. The self-authored claim
# must buy nothing: that exact shape was measured satisfying 71/327 (21.7%) of NON-final firings.
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_r9" "agent_r9" "R9 background helper" "$(iso_now)"
write_completion_row "$WORKTREE_WIN" "agent_r9" "## Close: VERIFIED — done"
set +e; OUT_R9="$(run_hook_subagent_stop "$WORKTREE_WIN" "agent_r9" '[{"id":"agent_r9","status":"running"},{"id":"another_child","status":"running"}]')"; EXIT_R9=$?; set -e
assert_exit0 "$EXIT_R9" "Case R9 — SubagentStop, agent's own VERIFIED completion row present, background_tasks non-empty: hook itself exits 0"
R9_HAS_KEY="$(registry_has_key "$WORKTREE_WIN" "toolu_r9")"
assert_eq "$R9_HAS_KEY" "yes" "Case R9 — the agent's own 'VERIFIED' claim buys NOTHING: entry SURVIVES (self-authored text has no path into this decision)"

# --- Case B1 (fire): Bash occupancy check, MAIN-LOOP side -> non-blocking additionalContext, never a block ----
reset_registry "$WORKTREE_WIN"
FRESH_NOW="$(iso_now)"
write_registry_entry "$WORKTREE_WIN" "toolu_other1" "agent_OTHER1" "another agent mid-task" "$FRESH_NOW"
set +e; OUT_B1="$(run_hook_bash "$WORKTREE_WIN" "git checkout other-branch" "" "")"; EXIT_B1=$?; set -e
assert_exit0 "$EXIT_B1" "Case B1 — Bash occupancy, MAIN-LOOP caller (no agent_type/agent_id), state-changing git command: exit 0"
assert_reminder_json "$OUT_B1" "agent_OTHER1" "Case B1 — Bash occupancy, MAIN-LOOP caller: non-blocking additionalContext names the occupant, no permissionDecision key at all"

# --- Case C1 (fire): Bash occupancy check, SUBAGENT side, SAME occupant, SAME command -> DENY -----------------
# Registry from B1 is reused unchanged (still holds agent_OTHER1) — proves the SAME live occupant produces the
# opposite verdict purely from caller identity, never from a different tree state.
set +e; OUT_C1="$(run_hook_bash "$WORKTREE_WIN" "git checkout other-branch" "grimorio.qa" "agent_CALLER1")"; EXIT_C1=$?; set -e
assert_exit0 "$EXIT_C1" "Case C1 — Bash occupancy, SUBAGENT caller (agent_type+agent_id present), same command as B1: hook itself exits 0"
assert_deny_contains "$OUT_C1" "agent_OTHER1" "Case C1 — Bash occupancy, SUBAGENT caller: DENIED, reason names the occupant"

# --- Case D1 (silent): no registered occupant at all -----------------------------------------------------------
reset_registry "$WORKTREE_WIN"
set +e; OUT_D1="$(run_hook_bash "$WORKTREE_WIN" "git reset --hard" "grimorio.qa" "agent_CALLER_D1")"; EXIT_D1=$?; set -e
assert_exit0 "$EXIT_D1" "Case D1 — Bash occupancy, no registered occupant: exit 0"
assert_empty "$OUT_D1" "Case D1 — Bash occupancy, no registered occupant: silent even for a subagent caller"

# --- Case D2 (silent): the only registered occupant IS the caller itself -> self-exclusion ----------------------
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_self1" "agent_SELF1" "the caller's own earlier dispatch" "$(iso_now)"
set +e; OUT_D2="$(run_hook_bash "$WORKTREE_WIN" "git checkout some-branch" "grimorio.qa" "agent_SELF1")"; EXIT_D2=$?; set -e
assert_exit0 "$EXIT_D2" "Case D2 — Bash occupancy, sole occupant is the caller itself: exit 0"
assert_empty "$OUT_D2" "Case D2 — Bash occupancy, sole occupant is the caller itself: silent (self-exclusion)"

# --- Case D3 (silent): occupant's dispatchedAt is past OCCUPANT_STALE_MS (4h, read from the hook's own source) -
reset_registry "$WORKTREE_WIN"
STALE_ISO="$(iso_hours_ago 5)"
write_registry_entry "$WORKTREE_WIN" "toolu_stale1" "agent_STALE1" "a crashed or long-finished agent" "$STALE_ISO"
set +e; OUT_D3="$(run_hook_bash "$WORKTREE_WIN" "git checkout some-branch" "grimorio.qa" "agent_CALLER_D3")"; EXIT_D3=$?; set -e
assert_exit0 "$EXIT_D3" "Case D3 — Bash occupancy, occupant older than the 4h staleness ceiling: exit 0"
assert_empty "$OUT_D3" "Case D3 — Bash occupancy, occupant older than the 4h staleness ceiling: silent (pruned)"
D3_HAS_KEY_AFTER="$(registry_has_key "$WORKTREE_WIN" "toolu_stale1")"
assert_eq "$D3_HAS_KEY_AFTER" "no" "Case D3 — Bash occupancy, occupant older than the 4h staleness ceiling: prune was PERSISTED to the registry file, not just skipped in memory"

# --- Case D4 (silent x3): a command that matches no state-changing git verb -> silent, even with a FRESH -------
# occupant registered and a SUBAGENT caller (the strictest combination that could still wrongly fire).
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_other_d4" "agent_OTHER_D4" "another agent mid-task" "$(iso_now)"
set +e; OUT_D4A="$(run_hook_bash "$WORKTREE_WIN" "git status" "grimorio.qa" "agent_CALLER_D4")"; EXIT_D4A=$?; set -e
assert_exit0 "$EXIT_D4A" "Case D4a — Bash occupancy, non-state-changing 'git status', fresh occupant + subagent caller: exit 0"
assert_empty "$OUT_D4A" "Case D4a — Bash occupancy, non-state-changing 'git status', fresh occupant + subagent caller: silent"
set +e; OUT_D4B="$(run_hook_bash "$WORKTREE_WIN" "git log --oneline -5" "grimorio.qa" "agent_CALLER_D4")"; EXIT_D4B=$?; set -e
assert_exit0 "$EXIT_D4B" "Case D4b — Bash occupancy, non-state-changing 'git log', fresh occupant + subagent caller: exit 0"
assert_empty "$OUT_D4B" "Case D4b — Bash occupancy, non-state-changing 'git log', fresh occupant + subagent caller: silent"
set +e; OUT_D4C="$(run_hook_bash "$WORKTREE_WIN" "npm test" "grimorio.qa" "agent_CALLER_D4")"; EXIT_D4C=$?; set -e
assert_exit0 "$EXIT_D4C" "Case D4c — Bash occupancy, non-git command 'npm test', fresh occupant + subagent caller: exit 0"
assert_empty "$OUT_D4C" "Case D4c — Bash occupancy, non-git command 'npm test', fresh occupant + subagent caller: silent"

# --- Case E1 (silent) — THE MOST IMPORTANT NEW CASE: the command-position false-positive regression, proven ---
# from the OUTSIDE, via this real subprocess-driven selftest, not merely trusted from gitCommandIndex()'s own
# inline comment. The literal word "git" appears in the command text but is never the invoked command itself —
# a subagent caller, with a FRESH occupant registered (the exact combination that DID wrongly DENY before the
# command-position fix landed), must still be silent.
reset_registry "$WORKTREE_WIN"
write_registry_entry "$WORKTREE_WIN" "toolu_other_e1" "agent_OTHER_E1" "another agent mid-task" "$(iso_now)"
set +e; OUT_E1="$(run_hook_bash "$WORKTREE_WIN" "echo please dont run git checkout" "grimorio.qa" "agent_CALLER_E1")"; EXIT_E1=$?; set -e
assert_exit0 "$EXIT_E1" "Case E1 — command-position regression ('echo ... git checkout' text, never invoked): exit 0"
assert_empty "$OUT_E1" "Case E1 — command-position regression ('echo ... git checkout' text, never invoked): SILENT, never denied, even though 'git checkout' appears in the text and a fresh occupant is registered"

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "keeper-worktree-guard selftest: ALL CASES PASSED"
  exit 0
else
  echo "keeper-worktree-guard selftest: FAILED — ${FAILED_CASES[*]}"
  exit 1
fi
