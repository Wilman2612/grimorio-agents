#!/usr/bin/env bash
# Falsification test for check-agent-tiers.mjs. Every case is a sandbox built fresh in mktemp -d —
# this suite never reads the live .claude/agents/; that integration coverage is the objective's own
# C2 (`node .grimorio/scripts/check-agent-tiers.mjs`) and pre-commit.sh itself, the real enforcement point.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
CHECK="$ROOT/.grimorio/scripts/check-agent-tiers.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

write_agent() { # write_agent <dir> <filename> <frontmatter-lines...>
  local dir="$1" name="$2"; shift 2
  mkdir -p "$dir/.claude/agents"
  mkdir -p "$dir/.grimorio"
  { echo "---"; printf '%s\n' "$@"; echo "---"; echo; echo "body"; } > "$dir/.claude/agents/$name"
}

# Every sandbox is SEEDED with a matching register first, so cases 1-6 keep testing exactly what they
# always tested -- the frontmatter doctrine -- and never trip over the register check that came later.
# Cases 7-10 below seed nothing, or corrupt the seed on purpose, because the register IS what they test.
run() { CLAUDE_PROJECT_DIR="$1" node "$CHECK" --write >/dev/null 2>&1; CLAUDE_PROJECT_DIR="$1" node "$CHECK" 2>&1; echo "EXIT:$?"; }
run_raw() { CLAUDE_PROJECT_DIR="$1" node "$CHECK" 2>&1; echo "EXIT:$?"; }

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

# 7. register committed in HEAD, then deleted from the working tree -> REFUSED. This is the register
#    being removed out from under its readers, which is exactly what must not pass silently.
rm -rf "$T/case7"; write_agent "$T/case7" "ok-sonnet.md" "name: ok-sonnet" "model: sonnet"
CLAUDE_PROJECT_DIR="$T/case7" node "$CHECK" --write >/dev/null 2>&1
( cd "$T/case7" && git init -q . && git add -A &&   git -c user.email=t@t -c user.name=t commit -qm seed ) >/dev/null 2>&1
rm -f "$T/case7/.grimorio/AGENT-TIERS.md"
OUT7="$(run_raw "$T/case7")"
EXIT7="$(echo "$OUT7" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "register deleted but still in HEAD -> non-zero exit" "1" "$EXIT7"
NAMES7="$(echo "$OUT7" | grep -q "AGENT-TIERS.md" && echo yes || echo no)"
a "register deleted but still in HEAD -> names the register" "yes" "$NAMES7"

# 7b. a tree that NEVER declared a register -> exit 0. Fixtures and sandboxes build a .claude/agents/
#     without one, and this gate has no standing to fail a tree it was never installed in.
rm -rf "$T/case7b"; write_agent "$T/case7b" "ok-sonnet.md" "name: ok-sonnet" "model: sonnet"
EXIT7B="$(run_raw "$T/case7b" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "no register and none tracked -> exit 0" "0" "$EXIT7B"

# 8. register present but its table DRIFTED from the shells -> REFUSED. This is the whole point of the
#    check: a stale row sends a user to change the wrong agent's tier.
rm -rf "$T/case8"; write_agent "$T/case8" "ok-sonnet.md" "name: ok-sonnet" "model: sonnet"
CLAUDE_PROJECT_DIR="$T/case8" node "$CHECK" --write >/dev/null 2>&1
sed -i 's/| sonnet |/| opus |/' "$T/case8/.grimorio/AGENT-TIERS.md"
OUT8="$(run_raw "$T/case8")"
EXIT8="$(echo "$OUT8" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "register drifted from shells -> non-zero exit" "1" "$EXIT8"
DRIFT8="$(echo "$OUT8" | grep -q "drifted" && echo yes || echo no)"
a "register drifted -> says so, and names the fix" "yes" "$DRIFT8"

# 9. --write REPAIRS the drift case 8 built, and the next run passes cold.
CLAUDE_PROJECT_DIR="$T/case8" node "$CHECK" --write >/dev/null 2>&1
EXIT9="$(run_raw "$T/case8" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "--write repairs the drift -> exit 0" "0" "$EXIT9"

# 10. register exists but the generated-table markers were removed -> REFUSED, never silently skipped.
rm -rf "$T/case10"; write_agent "$T/case10" "ok-sonnet.md" "name: ok-sonnet" "model: sonnet"
mkdir -p "$T/case10/.claude" "$T/case10/.grimorio"
printf '# Agent Tiers

no table here
' > "$T/case10/.grimorio/AGENT-TIERS.md"
OUT10="$(run_raw "$T/case10")"
EXIT10="$(echo "$OUT10" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "register without the table markers -> non-zero exit" "1" "$EXIT10"
MARK10="$(echo "$OUT10" | grep -q "marker" && echo yes || echo no)"
a "register without markers -> names the missing markers" "yes" "$MARK10"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
