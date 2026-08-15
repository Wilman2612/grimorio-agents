# code-harness — the enforcement hook (script contract + wiring)

The hard-enforcement layer of the harness system: a **PreToolUse hook** that injects the ascending `harness.md`
guardrails into context before any Edit/Write/MultiEdit, so the rules get read even when an agent would otherwise
forget. It complements — does not replace — the soft layer (this skill + the agent/CLAUDE.md reminders).

## Design contract (why it is safe)
- **It only ADDS context. It never blocks an edit and never exits non-zero.** Every failure path is swallowed and
  the tool proceeds. So a broken/slow/absent hook degrades to the soft layer — it can never wedge editing.
- **Per-session dedup.** Each `harness.md` is injected ONCE per session (keyed by `session_id` in a temp state
  file), matching the intent "read the guardrail before you start modifying that subtree," not on every keystroke.
- **Upward walk, deepest-first.** From the target file's folder up to the repo root (a folder containing `.git`),
  collecting every `harness.md`; nearest (most specific) first.

## Files
- **Script:** ref:repo/.claude/hooks/harness-lookup.cjs (CommonJS `.cjs` so it runs regardless of the repo's ESM setting).
  Reads the hook JSON on stdin, extracts `tool_input.file_path`, walks up, and emits
  `{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"…harness bodies…"}}`.
- **Wiring:** ref:repo/.claude/settings.json → `hooks.PreToolUse` with matcher `Edit|Write|MultiEdit`, command
  `node "$CLAUDE_PROJECT_DIR/.claude/hooks/harness-lookup.cjs"`.

## Notes for maintainers
- Claude Code reviews hook changes for safety; a newly-added/edited hook may not take effect until the session is
  restarted or the hook is approved via `/hooks`. Expect it to bind on the NEXT session, not retroactively.
- To test the script standalone:
  `echo '{"session_id":"t","tool_input":{"file_path":"apps/web/src/components/matches/battle/battle-render-continuous/x.ts"}}' | node .claude/hooks/harness-lookup.cjs`
  It should print JSON whose `additionalContext` contains the terrain-brush harness. Run twice with the same
  `session_id` → the second run prints nothing (dedup).
- The soft layer must stand on its own: never rely on the hook as the ONLY thing that surfaces a harness — always
  keep the CLAUDE.md rule + agent reminders current.
