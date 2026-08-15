#!/usr/bin/env bash
# Falsification test for check-agent-tiers.mjs. Every case is a sandbox built fresh in mktemp -d —
# this suite never reads the live .claude/agents/; that integration coverage is the objective's own
# C2 (`node scripts/check-agent-tiers.mjs`) and pre-commit.sh itself, the real enforcement point.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
CHECK="$ROOT/scripts/check-agent-tiers.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

write_agent() { # write_agent <dir> <filename> <frontmatter-lines...>
  local dir="$1" name="$2"; shift 2
  mkdir -p "$dir/.claude/agents"
  { echo "---"; printf '%s\n' "$@"; echo "---"; echo; echo "body"; } > "$dir/.claude/agents/$name"
}

run() { CLAUDE_PROJECT_DIR="$1" node "$CHECK" 2>&1; echo "EXIT:$?"; }

# 1. opus + disallowedTools: Agent -> REFUSED, names the file
rm -rf "$T/case1"; write_agent "$T/case1" "bad-opus.md" "name: bad-opus" "disallowedTools: Agent" "model: opus"
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "opus+disallowedTools Agent -> non-zero exit" "1" "$EXIT1"
NAMES1="$(echo "$OUT1" | grep -q "bad-opus.md" && echo yes || echo no)"
a "opus+disallowedTools Agent -> names the file" "yes" "$NAMES1"

# 2. fable + disallowedTools: Agent -> REFUSED
rm -rf "$T/case2"; write_agent "$T/case2" "bad-fable.md" "name: bad-fable" "disallowedTools: Agent" "model: fable"
EXIT2="$(run "$T/case2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "fable+disallowedTools Agent -> non-zero exit" "1" "$EXIT2"

# 3. opus, no disallowedTools -> allowed (a real orchestrator)
rm -rf "$T/case3"; write_agent "$T/case3" "ok-opus.md" "name: ok-opus" "model: opus"
EXIT3="$(run "$T/case3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "opus, no disallowedTools -> exit 0" "0" "$EXIT3"

# 4. sonnet + disallowedTools: Agent -> allowed (a real executor)
rm -rf "$T/case4"; write_agent "$T/case4" "ok-sonnet.md" "name: ok-sonnet" "disallowedTools: Agent" "model: sonnet"
EXIT4="$(run "$T/case4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "sonnet+disallowedTools Agent -> exit 0" "0" "$EXIT4"

# 5. no model: key at all -> REFUSED
rm -rf "$T/case5"; write_agent "$T/case5" "no-model.md" "name: no-model" "disallowedTools: Agent"
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "no model: key -> non-zero exit" "1" "$EXIT5"
NAMES5="$(echo "$OUT5" | grep -q "no-model.md" && echo yes || echo no)"
a "no model: key -> names the file" "yes" "$NAMES5"

# 5b. substring guard: disallowedTools: AgentSomething must NOT read as Agent (opus tier stays allowed)
rm -rf "$T/case5b"; write_agent "$T/case5b" "substring.md" "name: substring" "disallowedTools: AgentSomething" "model: opus"
EXIT5B="$(run "$T/case5b" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "disallowedTools: AgentSomething (substring) -> exit 0" "0" "$EXIT5B"

# 6. missing agents dir -> fails LOUD (non-zero), never silently allows
rm -rf "$T/case6"; mkdir -p "$T/case6"
EXIT6="$(run "$T/case6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "missing agents dir -> non-zero exit" "1" "$EXIT6"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
