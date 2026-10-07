#!/usr/bin/env bash
# selftest/board-reconcile.sh — ANSWERS: does .claude/hooks/board-reconcile-lib.mjs correctly resolve the main
# checkout from BOTH a plain repo root and a linked worktree, subtract claimed shas from a commit range, tolerate
# a corrupt/partial claim-ledger line without throwing, isolate the per-session turn-start watermark between two
# different session_ids, and resolve a dispatch row's own CALLER identity alongside its timestamp; do
# .claude/hooks/board-reconcile.cjs's TWO main-loop-only triggers -- `PreToolUse: Bash` (fires UNCONDITIONALLY,
# before every main-loop Bash call, never reasoning about what the command IS) and `Stop` (the backstop, firing
# at turn end regardless of the last action) -- both read the SAME commit-graph check: silent on a session's
# first-ever firing (seeding the watermark), DENY/BLOCK naming exactly the unclaimed sha(s) once a PRIOR
# unreconciled commit exists (even when the very next command is NOT a git commit at all -- the direct
# regression test for a command-string detector's own structural blind spot to a commit made by a wrapper
# script), keep naming the SAME sha on every subsequent firing until it is genuinely claimed (the watermark
# never advances past a still-unclaimed commit), and never fire for a spawned agent's own Bash call or Stop;
# does its SubagentStop half attribute a FIRST-LEVEL initiator's own commits as claim lines
# (`by:"<type>/<id>"`) while a NESTED/grandchild spawn's own SubagentStop claims nothing, and never block
# either way; and do the env-overridable SESSION_CAP / KILL_SWITCH_TRIP_AT constants and the
# `${CACHE_REL}/board-reconcile.disabled` flag actually bound/short-circuit BOTH main-loop triggers, SHARING
# one counter, end to end via real repeated firings, never a single pre-seeded check alone. WHEN: after
# touching board-reconcile.cjs or board-reconcile-lib.mjs.
#
# @size-exempt: crossed 500 lines this pass (FINDING-01 CRITICAL correction) adding an entire new SECTION ST
# (the Stop backstop, a trigger point that did not exist in the prior pass) plus the direct FINDING-01
# regression test and the watermark-retention regression test in SECTION B, plus the shared-counter proof in
# SECTION C -- every added line is a real assertion against a CRITICAL-severity fix, never padding; trimming
# coverage to hit a line count is the wrong trade here.
#
# Design: .grimorio/skills/grimorio.board/plan/subtask-lifecycle.md, sections "The interruption point —
# SECOND design" and "THE CLAIM LEDGER" — this file proves those primitives' own implementation, never re-derives
# them. The graph-based, two-EVENT shape this file now tests (PreToolUse: Bash unconditional + Stop backstop,
# never a command-string detector) is a 2026-09-23 correction described in board-reconcile.cjs's own header —
# that document predates the correction and is never itself the source for it.
#
# Modeled on this directory's own house pattern for a cap/kill-switch-bearing hook: scripts/selftest/
# subagentstop-wait.sh (env-overridable constants, cap/kill-switch/disabled-flag proof via real repeated firings,
# never a single pre-seeded state alone) and .grimorio/scripts/selftest/keeper-worktree-guard.sh (a REAL, throwaway git repo
# plus a REAL linked worktree, built fresh under the OS temp dir and torn down unconditionally, `node -e` used to
# call into a module and to parse/assert on its output rather than a text-substring guess).
# Both hooks are driven by REAL subprocess invocation, stdin JSON in, stdout/exit code out — never by importing
# board-reconcile.cjs's own internals. board-reconcile-lib.mjs (ESM) is called directly via a dynamic `import()`
# inside a `node -e` harness, the same technique keeper-worktree-guard.sh's own `winjoin()`/`assert_deny_json()`
# already use to reach into a module from bash.
set -euo pipefail
# @keep-comment -- the cache root comes from .grimorio/scripts/refobl/skill-roots.json's `cacheRoot`, the SAME
# declaration the hooks read. A literal here is how all seven of these selftests broke at once when
# the root moved: the fixture wrote to one path and the code under test read the other.
CACHE_REL="$(node -p "require('$(git rev-parse --show-toplevel)/.grimorio/scripts/refobl/cache-paths.cjs').cacheRoot()")"
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes
ROOT="$(pwd)"
HOOK="$ROOT/.claude/hooks/board-reconcile.cjs"
LIBFILE="$ROOT/.claude/hooks/board-reconcile-lib.mjs"
LIBURL="$(node -e "console.log(require('url').pathToFileURL(process.argv[1]).href)" "$LIBFILE")"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FAIL=0
assert_eq() { # assert_eq <actual> <expected> <label>
  local actual="$1" expected="$2" label="$3"
  if [[ "$actual" == "$expected" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected '$expected', got '$actual'"
    FAIL=1
  fi
}
assert_contains() { # assert_contains <haystack> <needle> <label>
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected to find: $needle"
    echo "  --- actual output ---"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}
assert_empty() { # assert_empty <haystack> <label>
  local haystack="$1" label="$2"
  if [[ -z "$haystack" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected NO output, got:"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}
assert_file_exists() { # assert_file_exists <path> <label>
  if [[ -f "$1" ]]; then
    echo "PASS: $2"
  else
    echo "FAIL: $2 — expected file to exist: $1"
    FAIL=1
  fi
}
assert_file_absent() { # assert_file_absent <path> <label>
  if [[ ! -f "$1" ]]; then
    echo "PASS: $2"
  else
    echo "FAIL: $2 — expected file to NOT exist: $1"
    FAIL=1
  fi
}

# --- lib-level callers: each dynamically imports board-reconcile-lib.mjs and calls exactly one export --------
lib_main_checkout() { # lib_main_checkout <cwd>
  node -e '
    (async () => {
      const lib = await import(process.argv[1]);
      console.log(lib.mainCheckout(process.argv[2]));
    })();
  ' "$LIBURL" "$1"
}
lib_read_claims() { # lib_read_claims <claimsPath> — prints JSON.stringify(readClaims(path))
  node -e '
    (async () => {
      const lib = await import(process.argv[1]);
      console.log(JSON.stringify(lib.readClaims(process.argv[2])));
    })();
  ' "$LIBURL" "$1"
}
lib_unclaimed_commits() { # lib_unclaimed_commits <turnStartSha> <claimsJson> <cwd>
  node -e '
    (async () => {
      const lib = await import(process.argv[1]);
      const claims = JSON.parse(process.argv[3]);
      console.log(JSON.stringify(lib.unclaimedCommits(process.argv[2], claims, process.argv[4])));
    })();
  ' "$LIBURL" "$1" "$2" "$3"
}
lib_write_turn_start() { # lib_write_turn_start <path> <sessionId> <sha>
  node -e '
    (async () => {
      const lib = await import(process.argv[1]);
      lib.writeTurnStart(process.argv[2], process.argv[3], process.argv[4]);
    })();
  ' "$LIBURL" "$1" "$2" "$3"
}
lib_read_turn_start() { # lib_read_turn_start <path> <sessionId> — "__NULL__" stands in for a real null
  node -e '
    (async () => {
      const lib = await import(process.argv[1]);
      const v = lib.readTurnStart(process.argv[2], process.argv[3]);
      console.log(v === null ? "__NULL__" : v);
    })();
  ' "$LIBURL" "$1" "$2"
}

build_repo() { # build_repo <dir> — a real, throwaway git repo with one seed commit
  mkdir -p "$1"
  git -C "$1" init -q -b main
  git -C "$1" config user.email test@example.com
  git -C "$1" config user.name "Test"
  git -C "$1" config core.autocrlf false  # silence Windows LF/CRLF noise; irrelevant to what is under test
  printf 'seed\n' > "$1/seed.txt"
  git -C "$1" add seed.txt
  git -C "$1" commit -q -m "seed commit"
}

# write_dispatch_rows <repoDir> <session> <type> <toolUseId> <childAgentId> <isoTimestamp> [callerType="-"]
# [callerId="-"] — appends a real PRE row then a real POST row to ${CACHE_REL}/agent-invocations.log,
# matching log-agent-invocation.cjs's own 17-field order exactly (fields 0,2,11,12,13,14,15 are the only ones
# resolveDispatchInfo() reads -- field 11/13 are the CALLER's own agent_type/agent_id, "-" meaning "the main
# loop dispatched this directly"; the rest are filled with harmless placeholders). This is what a REAL
# Agent-tool dispatch of `type`, closing with `childAgentId`, actually leaves behind in the log -- used to
# prove FINDING-01's fix (board-reconcile.cjs scopes a child's own claim to commits at-or-after THIS row
# pair's own timestamp, never before it) AND the 2026-09-23 caller-gate (a NON-"-" callerType/callerId means a
# NESTED/grandchild spawn, which must claim nothing). Every existing call site below omits callerType/callerId,
# so it defaults to "-"/"-" -- a FIRST-LEVEL initiator, by construction, unless a case explicitly overrides it.
write_dispatch_rows() {
  local repo="$1" session="$2" type="$3" tool_use_id="$4" child_id="$5" ts="$6"
  local caller_type="${7:--}" caller_id="${8:--}"
  local log="$repo/${CACHE_REL}/agent-invocations.log"
  mkdir -p "$(dirname "$log")"
  printf '%s\t%s\t%s\t-\t-\t100\t"desc"\tmain\tno\t\t-\t%s\tpre\t%s\t%s\t-\t-\n' \
    "$ts" "$session" "$type" "$caller_type" "$caller_id" "$tool_use_id" >> "$log"
  printf '%s\t%s\t%s\t-\t-\t100\t"desc"\tmain\tno\t\t-\t%s\tpost\t%s\t%s\t%s\tasync_launched\n' \
    "$ts" "$session" "$type" "$caller_type" "$caller_id" "$tool_use_id" "$child_id" >> "$log"
}

# write_completion_row <repoDir> <session> <agentId> <agentType> — appends a real row to
# ${CACHE_REL}/agent-completions.log, matching log-agent-completion.cjs's own 6-field order exactly
# (session is 8-char-sliced there too, matching write_dispatch_rows' own convention -- irrelevant for the
# short test session ids used below). This is what a REAL child's own terminal SubagentStop leaves behind
# (H10 fires on the SAME event board-reconcile.cjs's own handleSubagentStop does) -- used to prove a
# first-level initiator has genuinely CLOSED, the opposite of the LIVE case write_dispatch_rows alone
# represents (a PRE+POST pair with no matching completion row).
write_completion_row() {
  local repo="$1" session="$2" agent_id="$3" agent_type="$4"
  local log="$repo/${CACHE_REL}/agent-completions.log"
  mkdir -p "$(dirname "$log")"
  printf '%s\t%s\t%s\t%s\t%s\t-\n' \
    "$(node -e "console.log(new Date().toISOString())")" "$session" "$agent_id" "$agent_type" '"done"' >> "$log"
}

# run_hook <repoDir> <sessionCap> <killAt> <stdinJson> — invokes the REAL hook as a subprocess, cwd AND
# CLAUDE_PROJECT_DIR both anchored to repoDir (a plain repo has no worktree indirection, so this is the
# common, correct anchoring for every case below except the lib-level worktree case, which never shells out
# to the hook at all).
run_hook() {
  local repo="$1" cap="$2" kill_at="$3" input="$4"
  ( cd "$repo" && \
    CLAUDE_PROJECT_DIR="$repo" \
    BOARD_RECONCILE_SESSION_CAP="$cap" \
    BOARD_RECONCILE_KILL_SWITCH_TRIP_AT="$kill_at" \
    node "$HOOK" <<< "$input" )
}

echo "=== board-reconcile selftest ==="
echo

# ======================================================================================================
# SECTION L — lib-level (board-reconcile-lib.mjs, called directly, no hook subprocess involved)
# ======================================================================================================

# --- L1 / L1b: mainCheckout() from a plain repo root AND from a linked worktree ------------------------
MAINTREE_DIR="$WORK/l1-main"
WORKTREE_PARENT="$WORK/l1-wt-parent"
WORKTREE_DIR="$WORKTREE_PARENT/wt"
build_repo "$MAINTREE_DIR"
mkdir -p "$WORKTREE_PARENT"
git -C "$MAINTREE_DIR" worktree add -q -b selftest-lib-branch "$WORKTREE_DIR"

EXPECTED_MAIN="$(node -e "console.log(require('path').resolve(process.argv[1]))" "$MAINTREE_DIR")"
OUT_L1="$(lib_main_checkout "$MAINTREE_DIR")"
assert_eq "$OUT_L1" "$EXPECTED_MAIN" "L1 — mainCheckout() resolves from a plain repo root"

OUT_L1B="$(lib_main_checkout "$WORKTREE_DIR")"
assert_eq "$OUT_L1B" "$EXPECTED_MAIN" "L1b — mainCheckout() resolves the MAIN tree's own root from a linked worktree"

# --- L2: unclaimedCommits() subtracts claimed shas from a commit range ---------------------------------
REPO_L2="$WORK/l2-repo"
build_repo "$REPO_L2"
SHA0="$(git -C "$REPO_L2" rev-parse HEAD)"
git -C "$REPO_L2" commit -q --allow-empty -m "c1"; SHA1="$(git -C "$REPO_L2" rev-parse HEAD)"
git -C "$REPO_L2" commit -q --allow-empty -m "c2"; SHA2="$(git -C "$REPO_L2" rev-parse HEAD)"
git -C "$REPO_L2" commit -q --allow-empty -m "c3"; SHA3="$(git -C "$REPO_L2" rev-parse HEAD)"
CLAIMS_JSON_L2="[{\"turn\":\"$SHA0\",\"sha\":\"$SHA2\",\"by\":\"x\",\"at\":\"y\"}]"
OUT_L2="$(lib_unclaimed_commits "$SHA0" "$CLAIMS_JSON_L2" "$REPO_L2")"
EXPECTED_L2="[\"$SHA1\",\"$SHA3\"]"
assert_eq "$OUT_L2" "$EXPECTED_L2" "L2 — unclaimedCommits() = commit range minus the claimed sha, order preserved"

# --- L3: a claim ledger with one corrupt/partial line is tolerated (skipped, never thrown) -------------
CLAIMS_FIXTURE="$WORK/l3-claims.jsonl"
printf '{"turn":"deadbeef","sha":"cafefeed","by":"main/-","at":"2026-01-01T00:00:00.000Z"}\n' > "$CLAIMS_FIXTURE"
printf 'not even json{{{\n' >> "$CLAIMS_FIXTURE"
printf '\n' >> "$CLAIMS_FIXTURE"
set +e
OUT_L3="$(lib_read_claims "$CLAIMS_FIXTURE")"
RC_L3=$?
set -e
assert_eq "$RC_L3" "0" "L3 — readClaims() never throws on a corrupt/partial/blank line"
assert_eq "$OUT_L3" '[{"turn":"deadbeef","sha":"cafefeed","by":"main/-","at":"2026-01-01T00:00:00.000Z"}]' \
  "L3 — readClaims() keeps the one valid line and skips the corrupt and blank ones"

# --- L4: the per-session turn-start watermark is isolated between two different session_ids ------------
TURNSTART_FIXTURE="$WORK/l4-turn-start.json"
lib_write_turn_start "$TURNSTART_FIXTURE" "sessionA" "shaA000" > /dev/null
lib_write_turn_start "$TURNSTART_FIXTURE" "sessionB" "shaB000" > /dev/null
OUT_L4A="$(lib_read_turn_start "$TURNSTART_FIXTURE" "sessionA")"
OUT_L4B="$(lib_read_turn_start "$TURNSTART_FIXTURE" "sessionB")"
OUT_L4C="$(lib_read_turn_start "$TURNSTART_FIXTURE" "sessionC-never-seen")"
assert_eq "$OUT_L4A" "shaA000" "L4 — sessionA's own watermark reads back correctly"
assert_eq "$OUT_L4B" "shaB000" "L4 — sessionB's own watermark reads back correctly, unaffected by sessionA's write"
assert_eq "$OUT_L4C" "__NULL__" "L4 — an unknown session_id reads back null, never another session's value"

echo

bash_input() { # bash_input <sessionId> [command="true"] — the gate is UNCONDITIONAL now (no command-string
               # detector at all), so the command content is arbitrary unless a specific case needs to prove
               # something about it (e.g. that a NON-commit command still denies -- FINDING-01's own
               # regression test below).
  printf '{"hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"%s"},"session_id":"%s"}' \
    "${2:-true}" "$1"
}
stop_input() { # stop_input <sessionId> — the Stop-half backstop, same graph-based check as bash_input.
  printf '{"hook_event_name":"Stop","session_id":"%s"}' "$1"
}

# ======================================================================================================
# SECTION B — hook-level, the PreToolUse: Bash main-loop gate, now UNCONDITIONAL (board-reconcile.cjs,
# real subprocess, real temp git repo). REDESIGNED 2026-09-23, cycle 2: the OLD command-string detector
# (isGitCommitCommand) is GONE -- code-reviewer's own FINDING-01 (CRITICAL) proved it structurally blind to
# a commit made by a wrapper SCRIPT (close-branch.sh's own internal `git commit`/`git merge`), since the
# TOP-LEVEL Bash command string never carries a git verb in that case. The gate now fires on EVERY main-loop
# Bash call and reasons ONLY about the commit graph, never about command shape.
# ======================================================================================================

REPO_B="$WORK/b-repo"
build_repo "$REPO_B"
HEAD_B0="$(git -C "$REPO_B" rev-parse HEAD)"

# --- B1: first-ever Bash call for a session is silent; the watermark seeds to current HEAD ---------------
OUT_B1="$(run_hook "$REPO_B" 3 20 "$(bash_input b1)")"
assert_empty "$OUT_B1" "B1 — the first-ever Bash call for a session is silent (nothing prior to reconcile)"
TURN_START_B="$REPO_B/${CACHE_REL}/board-turn-start.json"
assert_contains "$(cat "$TURN_START_B" 2>/dev/null || true)" "$HEAD_B0" "B1 — the turn-start watermark was seeded to current HEAD"

# --- B2: FINDING-01's own regression test -- a PRIOR unclaimed commit DENIES the NEXT Bash call even when
# that next command is NOT a git commit at all (a fixture standing in for "a wrapper script that ran git
# commit internally, followed by an unrelated command" -- the exact shape close-branch.sh's own callers
# produce). The OLD isGitCommitCommand detector would have stayed silent here; the graph-based check does not
# care what the command is.
git -C "$REPO_B" commit -q --allow-empty -m "unclaimed commit A, made by something -- the mechanism never asks what"
SHA_B_A="$(git -C "$REPO_B" rev-parse HEAD)"
OUT_B2="$(run_hook "$REPO_B" 3 20 "$(bash_input b1 'npm test')")"
assert_contains "$OUT_B2" '"permissionDecision":"deny"' "B2 — a PRIOR unclaimed commit denies the NEXT Bash call, even a non-commit one (FINDING-01 regression test)"
assert_contains "$OUT_B2" "$SHA_B_A" "B2 — the deny reason names exactly the unclaimed sha"

# --- B2b: the watermark-retention fix (the HIGH finding) -- the SAME unclaimed sha is STILL named on a
# SECOND, IDENTICAL Bash call, because the watermark no longer advances past a still-unclaimed commit. This
# is the direct opposite of 1dfcd6ba's own (wrong) B2b, which expected the second attempt to go silent.
OUT_B2B="$(run_hook "$REPO_B" 3 20 "$(bash_input b1 'ls')")"
assert_contains "$OUT_B2B" '"permissionDecision":"deny"' "B2b — a second, later Bash call against the SAME unclaimed commit denies again (watermark did not advance)"
assert_contains "$OUT_B2B" "$SHA_B_A" "B2b — the SAME sha is named a second time, not silently dropped"

# --- B3: once the commit is genuinely claimed, the NEXT Bash call goes silent -- proving the deny is real
# work, not a stuck state, and giving B2/B2b's own claim ledger a way out.
CLAIMS_B="$REPO_B/${CACHE_REL}/board-claims.jsonl"
mkdir -p "$(dirname "$CLAIMS_B")"
TURN_B1="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).b1)" "$TURN_START_B")"
printf '{"turn":"%s","sha":"%s","by":"main/-","at":"2026-01-01T00:00:00.000Z","nothing":true}\n' "$TURN_B1" "$SHA_B_A" >> "$CLAIMS_B"
OUT_B3="$(run_hook "$REPO_B" 3 20 "$(bash_input b1)")"
assert_empty "$OUT_B3" "B3 — once genuinely claimed, the next Bash call is silent again"

# --- B4: a spawned agent's own Bash call (agent_id/agent_type present) never fires this gate, even with a
# PRIOR unclaimed commit sitting in the range -- this gate is main-loop-only, full stop, regardless of what
# command the child runs.
REPO_B4="$WORK/b4-repo"
build_repo "$REPO_B4"
run_hook "$REPO_B4" 3 20 "$(bash_input b4)" > /dev/null  # seed the watermark, main-loop side
git -C "$REPO_B4" commit -q --allow-empty -m "unclaimed commit, present when the CHILD runs its own Bash command"
CHILD_INPUT='{"hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"echo child"},"session_id":"b4","agent_id":"ChildX","agent_type":"grimorio.scout"}'
OUT_B4="$(run_hook "$REPO_B4" 3 20 "$CHILD_INPUT")"
assert_empty "$OUT_B4" "B4 — a spawned agent's own Bash call never fires this main-loop-only gate"

# --- B5: the `bash_input`-driven equivalent of ST5 -- FINDING-06's own guard is SHARED (runMainLoopGate),
# so handleBashCheck defers EXACTLY like handleStop while a first-level initiator is still LIVE. This is
# the MORE exposed of the two triggers (fires on every Bash call, not once per turn), and is exactly the
# gap left when the guard was originally scoped to handleStop alone.
REPO_B5="$WORK/b5-repo"
build_repo "$REPO_B5"
run_hook "$REPO_B5" 3 20 "$(bash_input b5)" > /dev/null  # seed the watermark, main-loop side
DISPATCH_TS_B5="$(node -e "console.log(new Date().toISOString())")"
write_dispatch_rows "$REPO_B5" "b5" "grimorio.scout" "tool-b5" "LiveChildB5" "$DISPATCH_TS_B5"  # caller "-"/"-" -- first-level, LIVE (no completion row)
git -C "$REPO_B5" commit -q --allow-empty -m "an unclaimed commit while a first-level initiator is still live"
TURN_START_B5="$REPO_B5/${CACHE_REL}/board-turn-start.json"
TURN_BEFORE_B5="$(cat "$TURN_START_B5" 2>/dev/null || true)"
OUT_B5="$(run_hook "$REPO_B5" 3 20 "$(bash_input b5)")"
assert_empty "$OUT_B5" "B5 — handleBashCheck DEFERS entirely (no deny) while a first-level initiator is still LIVE"
assert_eq "$(cat "$TURN_START_B5" 2>/dev/null || true)" "$TURN_BEFORE_B5" \
  "B5 — the deferred firing never touches the turn-start watermark either"

# --- B6: once that SAME initiator's own completion row lands, handleBashCheck resumes and denies on the
# SAME still-unclaimed commit -- the defer is temporary here too, never a permanent skip.
write_completion_row "$REPO_B5" "b5" "LiveChildB5" "grimorio.scout"
OUT_B6="$(run_hook "$REPO_B5" 3 20 "$(bash_input b5)")"
assert_contains "$OUT_B6" '"permissionDecision":"deny"' "B6 — once the initiator closes, handleBashCheck resumes and denies on the SAME still-unclaimed commit"

echo

# ======================================================================================================
# SECTION ST — hook-level, the Stop backstop (board-reconcile.cjs, real subprocess, real temp git repo).
# Proves the SAME graph-based check ALSO fires at turn end, catching the tail case handleBashCheck
# structurally cannot: an unclaimed commit produced by the main loop's own LAST action in a turn, with no
# subsequent Bash call to ever trigger SECTION B's own gate.
# ======================================================================================================

REPO_ST="$WORK/st-repo"
build_repo "$REPO_ST"
run_hook "$REPO_ST" 3 20 "$(bash_input st1)" > /dev/null  # seed the watermark, main-loop side

# --- ST1: Stop stays silent when nothing is unclaimed -----------------------------------------------------
OUT_ST0="$(run_hook "$REPO_ST" 3 20 "$(stop_input st1)")"
assert_empty "$OUT_ST0" "ST1 — Stop stays silent when nothing is unclaimed"

# --- ST2: the TAIL CASE -- an unclaimed commit is the LAST action in the turn (no PreToolUse: Bash ever
# fires after it); only Stop ever sees it, and it BLOCKS, naming the sha, using the {decision:"block"}
# envelope (never the PreToolUse permissionDecision:"deny" envelope -- different event, different shape).
git -C "$REPO_ST" commit -q --allow-empty -m "the turn's own LAST action -- no Bash call ever follows this"
SHA_ST="$(git -C "$REPO_ST" rev-parse HEAD)"
OUT_ST2="$(run_hook "$REPO_ST" 3 20 "$(stop_input st1)")"
assert_contains "$OUT_ST2" '"decision":"block"' "ST2 — Stop blocks on the tail-case unclaimed commit (the backstop's own reason to exist)"
assert_contains "$OUT_ST2" "$SHA_ST" "ST2 — the block names exactly the tail-case sha"

# --- ST3: the watermark-retention fix applies to Stop too -- a SECOND, IDENTICAL Stop firing still names
# the SAME sha, never silently sliding past it.
OUT_ST3="$(run_hook "$REPO_ST" 3 20 "$(stop_input st1)")"
assert_contains "$OUT_ST3" '"decision":"block"' "ST3 — a second Stop firing against the SAME unclaimed commit blocks again"
assert_contains "$OUT_ST3" "$SHA_ST" "ST3 — the SAME sha is named a second time, not silently dropped"

# --- ST4: a child's own close is a SubagentStop event, never "Stop" -- but the defensive agent_type/
# agent_id check in handleStop is proven anyway, matching handleBashCheck's own shape.
CHILD_STOP_INPUT='{"hook_event_name":"Stop","session_id":"st1","agent_id":"ChildX","agent_type":"grimorio.scout"}'
OUT_ST4="$(run_hook "$REPO_ST" 3 20 "$CHILD_STOP_INPUT")"
assert_empty "$OUT_ST4" "ST4 — a Stop payload carrying agent_id/agent_type (defensive case) never fires this main-loop-only gate"

# --- ST5: FINDING-06's own direct regression test -- a LIVE (dispatched, backgrounded, NO completion row)
# first-level initiator makes Stop DEFER entirely: no check, no deny, no watermark write, even with a real
# unclaimed commit sitting in the range. This is the race the old handleStop's own safety argument missed:
# a background-dispatched first-level initiator can still be working in the SAME tree when the main loop's
# own turn ends.
REPO_ST5="$WORK/st5-repo"
build_repo "$REPO_ST5"
run_hook "$REPO_ST5" 3 20 "$(bash_input st5)" > /dev/null  # seed the watermark, main-loop side
DISPATCH_TS_ST5="$(node -e "console.log(new Date().toISOString())")"
write_dispatch_rows "$REPO_ST5" "st5" "grimorio.scout" "tool-st5" "LiveChild5" "$DISPATCH_TS_ST5"  # caller "-"/"-" by default -- first-level, LIVE (no completion row written)
git -C "$REPO_ST5" commit -q --allow-empty -m "an unclaimed commit while a first-level initiator is still live"
TURN_START_ST5="$REPO_ST5/${CACHE_REL}/board-turn-start.json"
TURN_BEFORE_ST5="$(cat "$TURN_START_ST5" 2>/dev/null || true)"
OUT_ST5="$(run_hook "$REPO_ST5" 3 20 "$(stop_input st5)")"
assert_empty "$OUT_ST5" "ST5 — Stop DEFERS entirely (no deny) while a first-level initiator is still LIVE"
assert_eq "$(cat "$TURN_START_ST5" 2>/dev/null || true)" "$TURN_BEFORE_ST5" \
  "ST5 — the deferred firing never touches the turn-start watermark either"

# --- ST6: once that SAME initiator's own completion row lands (CLOSED, not live), Stop resumes ordinary
# behavior and blocks on the SAME still-unclaimed commit -- the defer is temporary, never a permanent skip.
write_completion_row "$REPO_ST5" "st5" "LiveChild5" "grimorio.scout"
OUT_ST6="$(run_hook "$REPO_ST5" 3 20 "$(stop_input st5)")"
assert_contains "$OUT_ST6" '"decision":"block"' "ST6 — once the initiator closes, Stop resumes and blocks on the SAME still-unclaimed commit"

echo

# ======================================================================================================
# SECTION S — hook-level, SubagentStop half (board-reconcile.cjs, real subprocess)
# ======================================================================================================

REPO_S="$WORK/s-repo"
build_repo "$REPO_S"
# Seed this session's own watermark first (mirrors the main loop's own prior Bash-call firing, exactly
# as B1 does).
run_hook "$REPO_S" 3 20 "$(bash_input s1)" > /dev/null

# Dispatch the child FIRST (a real PRE+POST row pair, exactly what a genuine Agent-tool spawn leaves behind),
# THEN let it commit — this is the ONLY case a claim is legitimate in (FINDING-01's own fix scopes a child's
# claim to commits at-or-after its own dispatch).
DISPATCH_TS_S1="$(node -e "console.log(new Date().toISOString())")"
write_dispatch_rows "$REPO_S" "s1" "grimorio.scout" "tool-s1" "Ab1" "$DISPATCH_TS_S1"
sleep 1
git -C "$REPO_S" commit -q --allow-empty -m "child commit B, made AFTER its own dispatch"
SHA_S_B="$(git -C "$REPO_S" rev-parse HEAD)"

OUT_S1="$(run_hook "$REPO_S" 3 20 '{"hook_event_name":"SubagentStop","session_id":"s1","agent_id":"Ab1","agent_type":"grimorio.scout"}')"
assert_empty "$OUT_S1" "S1 — SubagentStop never blocks, even with an unclaimed commit present"
CLAIMS_S="$REPO_S/${CACHE_REL}/board-claims.jsonl"
assert_contains "$(cat "$CLAIMS_S" 2>/dev/null || true)" "\"by\":\"grimorio.scout/Ab1\"" \
  "S1 — a commit made AFTER the child's own dispatch is appended as a claim line, attributed by:\"<type>/<id>\""
assert_contains "$(cat "$CLAIMS_S" 2>/dev/null || true)" "$SHA_S_B" \
  "S1 — the claim line names the child's own post-dispatch commit sha"

# --- S1b: no real child identity (agent_id/agent_type absent) -> nothing claimed, still never blocks ----
REPO_S2="$WORK/s2-repo"
build_repo "$REPO_S2"
run_hook "$REPO_S2" 3 20 "$(bash_input s2)" > /dev/null
git -C "$REPO_S2" commit -q --allow-empty -m "commit with no child identity"
OUT_S1B="$(run_hook "$REPO_S2" 3 20 '{"hook_event_name":"SubagentStop","session_id":"s2"}')"
assert_empty "$OUT_S1B" "S1b — a SubagentStop with no agent_id/agent_type is a silent no-op"
assert_file_absent "$REPO_S2/${CACHE_REL}/board-claims.jsonl" "S1b — no claim line was ever written with no real child identity"

# --- S1c: FINDING-01 regression guard (code-reviewer, CYCLE 1 HUNT, CRITICAL) — a commit made BEFORE any
# child is dispatched must NEVER be claimed by an unrelated child spawned afterward. This is the ORDINARY
# SEQUENTIAL case the original bug fired on (main loop commits, then spawns anything), not only the named,
# still-accepted concurrent-children edge case.
REPO_S3="$WORK/s3-repo"
build_repo "$REPO_S3"
run_hook "$REPO_S3" 3 20 "$(bash_input s3)" > /dev/null
git -C "$REPO_S3" commit -q --allow-empty -m "an EARLIER commit, made BEFORE any child is ever dispatched"
SHA_S3_EARLY="$(git -C "$REPO_S3" rev-parse HEAD)"

sleep 1
DISPATCH_TS_S3="$(node -e "console.log(new Date().toISOString())")"
write_dispatch_rows "$REPO_S3" "s3" "grimorio.scout" "tool-s3" "ScoutID3" "$DISPATCH_TS_S3"

OUT_S1C="$(run_hook "$REPO_S3" 3 20 '{"hook_event_name":"SubagentStop","session_id":"s3","agent_id":"ScoutID3","agent_type":"grimorio.scout"}')"
assert_empty "$OUT_S1C" "S1c — an unrelated child's SubagentStop stays silent (never blocks either way)"
CLAIMS_S3="$REPO_S3/${CACHE_REL}/board-claims.jsonl"
# The scout made no commit of its own after its own dispatch, so it has nothing to claim at all -- the
# earlier commit must never appear as ITS claim. Absence of the claims file entirely is the clean proof
# (same pattern S1b already uses); a non-absent file naming the early sha would be the regression itself.
assert_file_absent "$CLAIMS_S3" \
  "S1c — the pre-dispatch commit is correctly left unclaimed by the unrelated child (no claim line written)"

# The REAL log-agent-completion.cjs (H10) fires on this SAME SubagentStop event and would already have
# written this scout's own completion row by now -- write it here too, so this fixture matches reality:
# otherwise the scout still reads as LIVE (no completion row) to the shared runMainLoopGate defer below,
# and the re-check two lines down would wrongly stay silent instead of proving what it exists to prove.
write_completion_row "$REPO_S3" "s3" "ScoutID3" "grimorio.scout"

# The commit did not just vanish: it stays eligible for the main loop's own PreToolUse: Bash gate to see and
# demand an answer for, exactly as the un-scoped SubagentStop would have wrongly pre-empted before this fix.
OUT_S1C_GATE="$(run_hook "$REPO_S3" 3 20 "$(bash_input s3)")"
assert_contains "$OUT_S1C_GATE" '"permissionDecision":"deny"' \
  "S1c — the SAME pre-dispatch commit is still eligible for the main loop's own PreToolUse: Bash gate to deny on"
assert_contains "$OUT_S1C_GATE" "$SHA_S3_EARLY" \
  "S1c — the main loop's own PreToolUse: Bash gate names exactly that pre-dispatch commit"

echo

# --- S2 (NESTED/GRANDCHILD): a child whose own dispatch row shows a NON-"-" caller (i.e. it was spawned by
# ANOTHER agent, never by the main loop directly) claims NOTHING at its own SubagentStop, even with a real
# post-dispatch commit sitting unclaimed -- the initiator above it already answers for the whole unit. This is
# the 2026-09-23 caller-gate this redesign adds to handleSubagentStop.
REPO_S_NESTED="$WORK/s-nested-repo"
build_repo "$REPO_S_NESTED"
run_hook "$REPO_S_NESTED" 3 20 "$(bash_input snested)" > /dev/null

DISPATCH_TS_NESTED="$(node -e "console.log(new Date().toISOString())")"
# The caller here is "grimorio.js-developer/ParentXYZ" -- a SPAWNED agent, never "-"/"-" -- so this dispatch
# row represents a GRANDCHILD, not a first-level initiator.
write_dispatch_rows "$REPO_S_NESTED" "snested" "grimorio.scout" "tool-nested" "GrandchildID" "$DISPATCH_TS_NESTED" \
  "grimorio.js-developer" "ParentXYZ"
sleep 1
git -C "$REPO_S_NESTED" commit -q --allow-empty -m "grandchild's own commit, made AFTER its own dispatch"

OUT_S2="$(run_hook "$REPO_S_NESTED" 3 20 '{"hook_event_name":"SubagentStop","session_id":"snested","agent_id":"GrandchildID","agent_type":"grimorio.scout"}')"
assert_empty "$OUT_S2" "S2 (nested/grandchild) — SubagentStop never blocks, even for a nested spawn"
assert_file_absent "$REPO_S_NESTED/${CACHE_REL}/board-claims.jsonl" \
  "S2 (nested/grandchild) — a NESTED/grandchild spawn's own SubagentStop registers NOTHING, even with a real post-dispatch commit -- the first-level initiator above it already answers for the whole unit"

echo

# ======================================================================================================
# SECTION C — cap / kill-switch / disabled-flag fail-open (real repeated firings, never a single
# pre-seeded state alone). Both main-loop triggers (PreToolUse: Bash and Stop) share ONE counter (one log,
# one SESSION_BLOCK_CAP, one KILL_SWITCH_TRIP_AT) -- the underlying question ("is there unclaimed work") is
# the SAME regardless of which event asks it; C1b below proves the sharing directly.
# ======================================================================================================

# --- C1: BOARD_RECONCILE_SESSION_CAP actually stops repeated re-denies once reached (all via PreToolUse: Bash)
REPO_C1="$WORK/c1-repo"
build_repo "$REPO_C1"
run_hook "$REPO_C1" 2 20 "$(bash_input c1)" > /dev/null  # seed, cap=2

git -C "$REPO_C1" commit -q --allow-empty -m "c1 unclaimed 1"
OUT_C1A="$(run_hook "$REPO_C1" 2 20 "$(bash_input c1)")"
git -C "$REPO_C1" commit -q --allow-empty -m "c1 unclaimed 2"
OUT_C1B="$(run_hook "$REPO_C1" 2 20 "$(bash_input c1)")"
git -C "$REPO_C1" commit -q --allow-empty -m "c1 unclaimed 3"
OUT_C1C="$(run_hook "$REPO_C1" 2 20 "$(bash_input c1)")"

assert_contains "$OUT_C1A" '"permissionDecision":"deny"' "C1 — 1st re-deny fires (cap=2)"
assert_contains "$OUT_C1B" '"permissionDecision":"deny"' "C1 — 2nd re-deny fires (still at cap=2)"
assert_empty "$OUT_C1C" "C1 — 3rd attempt is silent: SESSION_CAP=2 reached, the mechanism stops re-denying"

# --- C1b: the counter is SHARED across BOTH main-loop triggers -- one deny via PreToolUse: Bash, one via
# Stop, and the cap (2) is reached by their COMBINED total, not tracked separately per event type. Each
# firing below is against a GENUINELY DISTINCT unclaimed set (a NEW commit lands between each one) -- see
# C1c below for the FINDING-07 case this one does NOT cover: repeated IDENTICAL sets never consuming budget.
REPO_C1B="$WORK/c1b-repo"
build_repo "$REPO_C1B"
run_hook "$REPO_C1B" 2 20 "$(bash_input c1b)" > /dev/null  # seed, cap=2
git -C "$REPO_C1B" commit -q --allow-empty -m "c1b unclaimed 1"
OUT_C1B_1="$(run_hook "$REPO_C1B" 2 20 "$(bash_input c1b)")"           # 1st deny, via PreToolUse: Bash
git -C "$REPO_C1B" commit -q --allow-empty -m "c1b unclaimed 2"        # a NEW, DISTINCT unclaimed set
OUT_C1B_2="$(run_hook "$REPO_C1B" 2 20 "$(stop_input c1b)")"           # 2nd deny, via Stop -- SAME counter
git -C "$REPO_C1B" commit -q --allow-empty -m "c1b unclaimed 3"        # a THIRD, DISTINCT unclaimed set
OUT_C1B_3="$(run_hook "$REPO_C1B" 2 20 "$(bash_input c1b)")"           # 3rd attempt, back on PreToolUse: Bash

assert_contains "$OUT_C1B_1" '"permissionDecision":"deny"' "C1b — 1st deny fires via PreToolUse: Bash (cap=2)"
assert_contains "$OUT_C1B_2" '"decision":"block"' "C1b — 2nd deny fires via Stop, still within the SAME shared cap=2"
assert_empty "$OUT_C1B_3" "C1b — 3rd attempt (back on PreToolUse: Bash) is silent -- the shared counter, not a per-event one, reached cap=2"

# --- C1c: FINDING-07's own direct regression test -- a REPEATED, IDENTICAL unclaimed set (no new commit
# between firings) never consumes cap budget on its own, even across MANY firings, because
# handleBashCheck now fires on every Bash call and would otherwise exhaust a low cap on ordinary,
# unrelated command cadence alone, silencing a still-completely-unaddressed commit. Every one of five
# back-to-back firings against the SAME single unclaimed commit must still deny (cap=2 is NEVER reached).
REPO_C1C="$WORK/c1c-repo"
build_repo "$REPO_C1C"
run_hook "$REPO_C1C" 2 20 "$(bash_input c1c)" > /dev/null  # seed, cap=2
git -C "$REPO_C1C" commit -q --allow-empty -m "c1c the ONE unclaimed commit, never claimed, never changes"
SHA_C1C="$(git -C "$REPO_C1C" rev-parse HEAD)"
for i in 1 2 3 4 5; do
  OUT="$(run_hook "$REPO_C1C" 2 20 "$(bash_input c1c "cmd$i")")"
  assert_contains "$OUT" "$SHA_C1C" "C1c — firing #$i against the SAME unchanged unclaimed set still denies (cap=2 never actually reached)"
done

# --- C2: BOARD_RECONCILE_KILL_SWITCH_TRIP_AT trips the repo-wide disabled flag across DIFFERENT sessions
REPO_C2="$WORK/c2-repo"
build_repo "$REPO_C2"
DISABLED_C2="$REPO_C2/${CACHE_REL}/board-reconcile.disabled"

run_hook "$REPO_C2" 20 2 "$(bash_input cA)" > /dev/null  # seed session cA, kill_at=2
git -C "$REPO_C2" commit -q --allow-empty -m "cA unclaimed 1"
OUT_C2A="$(run_hook "$REPO_C2" 20 2 "$(bash_input cA)")"  # total denies: 1
assert_contains "$OUT_C2A" '"permissionDecision":"deny"' "C2 — sessionA's own first deny fires"
assert_file_absent "$DISABLED_C2" "C2 — kill switch has not tripped yet after only 1 total deny (KILL_AT=2)"

run_hook "$REPO_C2" 20 2 "$(bash_input cB)" > /dev/null  # seed a DIFFERENT session
git -C "$REPO_C2" commit -q --allow-empty -m "cB unclaimed 1"
OUT_C2B="$(run_hook "$REPO_C2" 20 2 "$(bash_input cB)")"  # total denies: 2 -> trips
assert_contains "$OUT_C2B" '"permissionDecision":"deny"' "C2 — sessionB's own first deny fires"
assert_file_exists "$DISABLED_C2" "C2 — the 2nd total deny (KILL_AT=2) trips the repo-wide disabled flag"

git -C "$REPO_C2" commit -q --allow-empty -m "cA unclaimed 2, after the kill switch tripped"
OUT_C2C="$(run_hook "$REPO_C2" 20 2 "$(bash_input cA)")"
assert_empty "$OUT_C2C" "C2 — once tripped, a subsequent Bash call on EITHER session stays silent (fail-open)"

# --- C3: a pre-existing ${CACHE_REL}/board-reconcile.disabled flag short-circuits BOTH main-loop triggers
# to silent, BEFORE even the first-run watermark seeding.
REPO_C3="$WORK/c3-repo"
build_repo "$REPO_C3"
mkdir -p "$REPO_C3/${CACHE_REL}"
: > "$REPO_C3/${CACHE_REL}/board-reconcile.disabled"
OUT_C3="$(run_hook "$REPO_C3" 3 20 "$(bash_input c3)")"
assert_empty "$OUT_C3" "C3 — a pre-existing disabled flag short-circuits the PreToolUse: Bash gate to silent"
assert_file_absent "$REPO_C3/${CACHE_REL}/board-turn-start.json" \
  "C3 — the disabled check runs BEFORE the first-run watermark seed, so no turn-start file is ever written"
OUT_C3B="$(run_hook "$REPO_C3" 3 20 "$(stop_input c3)")"
assert_empty "$OUT_C3B" "C3b — the SAME pre-existing disabled flag short-circuits the Stop backstop to silent too"

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
