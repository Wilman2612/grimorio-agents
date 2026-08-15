#!/usr/bin/env bash
# Where the plan is being LOST — from .claude/.cache/agent-invocations.log
#
# Blocks 1-4 answer "why was this raised INSTEAD OF executing the plan".
# Blocks 5-9 answer "what was raised", which is the cheaper question and was all this used to do.
# Lines logged before 2026-07-30 carry only 7 fields; the plan blocks skip them rather than lie.
set -uo pipefail
# Read from the same root the WRITER uses. The hook writes to $CLAUDE_PROJECT_DIR; git toplevel
# only agrees with that in the main checkout, so inside a worktree the old version silently
# reported "no invocations logged yet" while the log was filling up one directory over.
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}" || exit 1
LOG=".claude/.cache/agent-invocations.log"
[ -f "$LOG" ] || { echo "no invocations logged yet ($LOG)"; exit 0; }

TOTAL=$(grep -c . "$LOG" || true)
RICH=$(awk -F'\t' 'NF>=11' "$LOG" | grep -c . || true)
printf "%s spawn(s) logged; %s carry plan context (fields 8-11)\n\n" "$TOTAL" "$RICH"

echo "== 1. DEVIATION — spawns with NO milestone link (prohibition 9: never delegate without a plan)"
if [ "$RICH" -eq 0 ]; then
  echo "   (no spawns carry plan context yet — nothing to say, and saying more would be invention)"
else
  awk -F'\t' 'NF>=11 && $10=="MISSING" {printf "   %s  %-28s %s\n", substr($1,12,8), $3, $7}' "$LOG"
  awk -F'\t' 'NF>=11 {n++; if($10=="MISSING") m++} END {
    printf "   -> %d of %d plan-aware spawns have no link (%.0f%%)\n", m+0, n, (n?100*m/n:0)}' "$LOG"
fi

echo
echo "== 2. CHURN — the same agent re-raised on the same thing (the stuck-loop signal)"
awk -F'\t' 'NF>=11 && $11!="-" {printf "   %s  %-28s %-4s %s\n", substr($1,12,8), $3, $11, $7}' "$LOG" \
  | grep . || echo "   none — no agent was re-raised on the same description stem"

echo
echo "== 3. OFF-PLAN BRANCHES — spawns raised from a branch carrying no objective file"
awk -F'\t' 'NF>=11 && $9=="no" {print "   "$8}' "$LOG" | sort | uniq -c | sort -rn | grep . \
  || echo "   none"

echo
echo "== 4. GATE COST — how much of the budget goes to reviewing rather than building"
awk -F'\t' '{n++; if($3 ~ /code-reviewer|security|qa|critic/) g++} END {
  printf "   %d of %d spawns are gates (%.0f%%)\n", g+0, n, (n?100*g/n:0)}' "$LOG"
echo "   A CLOSED plan should need FEWER gates, not more. This number alone cannot say whether any"
echo "   gate was justified — read it WITH block 2: a gate re-raised on the same diff is churn, a"
echo "   gate raised once per closed cycle is prohibition 27 working as intended."

echo
echo "== 5. invocations by agent type"
cut -f3 "$LOG" | sort | uniq -c | sort -rn

echo
echo "== 6. explicit model overrides (prohibition 11 — should be rare, and NAMED when it happens)"
awk -F'\t' '$4!="-" {print "   "$3" -> "$4}' "$LOG" | sort | uniq -c | sort -rn | grep . \
  || echo "   none — every spawn used the agent's own declared tier"
awk -F'\t' '$4=="-"' "$LOG" | grep -c . | xargs printf "   %s spawn(s) with NO override\n"

echo
echo "   -- direction of each override vs the agent's OWN declared tier, read live from"
echo "      .claude/agents/<subagent_type>.md frontmatter's \`model:\` key (never hardcoded) --"
declare -A RANK=( [haiku]=1 [sonnet]=2 [opus]=3 [fable]=4 )
agent_declared_tier() {
  local f=".claude/agents/$1.md"
  [ -f "$f" ] || return 0
  awk '/^---[ \t]*$/{c++; next} c==1 && /^model:[ \t]*/{sub(/^model:[ \t]*/,""); gsub(/^[ \t"]+|[ \t"]+$/,""); print; exit}' "$f"
}
UP=0; DOWN=0; EQ=0; UNK=0; PAIRS=""
while read -r cnt agent override; do
  [ -z "$agent" ] && continue
  declared="$(agent_declared_tier "$agent")"
  if [ -z "$declared" ] || [ -z "${RANK[$declared]:-}" ] || [ -z "${RANK[$override]:-}" ]; then
    class="UNKNOWN"; UNK=$((UNK+cnt))
  elif [ "${RANK[$override]}" -gt "${RANK[$declared]}" ]; then
    class="UP"; UP=$((UP+cnt))
  elif [ "${RANK[$override]}" -lt "${RANK[$declared]}" ]; then
    class="DOWN"; DOWN=$((DOWN+cnt))
  else
    class="EQUAL"; EQ=$((EQ+cnt))
  fi
  PAIRS="${PAIRS}   ${cnt}x  ${agent} -> ${override}  (declared: ${declared:-UNKNOWN})  [$class]\n"
done < <(awk -F'\t' '$4!="-" {print $3"\t"$4}' "$LOG" | sort | uniq -c)
printf "   UP=%d  DOWN=%d  EQUAL=%d  UNKNOWN=%d  (%d override row(s) total)\n" \
  "$UP" "$DOWN" "$EQ" "$UNK" "$((UP+DOWN+EQ+UNK))"
printf "$PAIRS" | grep . || echo "   none"

echo
echo "== 7. CALLER ATTRIBUTION (field 12 — the caller's own agent_type; \"-\" = top-level main loop)"
echo "   log-agent-invocation.cjs runs on PostToolUse (fires when the spawn RETURNS, not when it was"
echo "   dispatched) — every row here records the caller of a COMPLETED spawn. Read it as a fact about"
echo "   who raised what, never as a timing or concurrency signal (that removed a PARALLELISM block"
echo "   here that made exactly that mistake against this same field)."
NF12=$(awk -F'\t' 'NF>=12' "$LOG" | grep -c . || true)
NOF12=$(awk -F'\t' 'NF<12' "$LOG" | grep -c . || true)
printf "   %d of %d rows carry field 12 (ragged/legacy rows without it are excluded from the\n" "$NF12" "$((NF12+NOF12))"
printf "   breakdown below, never counted as a real value)\n"
awk -F'\t' 'NF>=12 {c[$12]++} END {for (k in c) print (k=="-" ? "(top-level main loop)" : k) "\t" c[k]}' "$LOG" \
  | sort -t$'\t' -k2,2rn \
  | awk -F'\t' '{printf "   %-30s %d spawn(s) raised\n", $1, $2}' \
  | grep . || echo "   none"

echo
echo "== 8. brief size per agent type (chars): a brief that keeps growing is a task never split"
awk -F'\t' '{n[$3]++; s[$3]+=$6; if($6>m[$3]) m[$3]=$6}
  END {for (a in n) printf "   %6d avg  %6d max  %3d spawns  %s\n", s[a]/n[a], m[a], n[a], a}' "$LOG" \
  | sort -rn

echo
echo "== 9. most recently logged spawns (last 20 rows)"
echo "   log-agent-invocation.cjs runs on PostToolUse, so this is COMPLETION order — never read it as"
echo "   dispatch order or as evidence of which spawns ran sequentially vs in parallel."
tail -20 "$LOG" | awk -F'\t' '{printf "   %s  %-28s %-12s %s\n", substr($1,12,8), $3, ($10==""?"-":$10), $7}'
