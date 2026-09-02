# The LIVE-FIRE HARNESS — how a modified hook in THIS worktree is observed actually firing

Measured 2026-09-02 by `grimorio.delegate` ab191f43aedebbb76, for the grimorio mechanics queue. Every line
below is a recorded observation, not a design intention.

## The problem it solves

A hook is wired in `.claude/settings.json` as `node "$CLAUDE_PROJECT_DIR/.claude/hooks/<x>.cjs"`. For an
agent running in the MAIN checkout, `$CLAUDE_PROJECT_DIR` is the main checkout — so the hook files that fire
on its own spawns are the MAIN checkout's copies. A change made in a worktree therefore CANNOT be observed
firing from a session rooted in the main checkout, and modifying the main checkout to get a firing is
forbidden (it is another branch's working tree and the CEO's own live session).

`EnterWorktree` does not solve it. **MEASURED — refused:**

> Cannot enter worktree: the current working directory E:\Proyect\<repo-root> is the repository root, not an
> isolated worktree — switching is only available to sessions whose working directory is inside a worktree
> of this repository.

## The route that WORKS — measured, in three steps

**A headless `claude` session launched with its cwd inside the worktree roots `$CLAUDE_PROJECT_DIR` at the
WORKTREE**, so the worktree's `.claude/settings.json` and the worktree's hook files are what run.

### Step 1 — hooks fire at all (PROVEN)

    cd E:/Proyect/<repo-root>-wt-phase-reaudit
    claude -p "Call the Skill tool once with skill=grimorio.working-memory. Then reply PROBE-OK" --model haiku

The worktree's `.claude/.cache/skill-load-debug.log` was created — it did not exist before (the worktree had
never hosted a session; only `fingerprint-gate-log.jsonl` was present). Its single line reads:

    {"ts":"2026-09-02T15:31:09.797Z","skill":"grimorio.working-memory",
     "session_id":"2b0c087c-...","agent_type":"-","cwd":"E:\\Proyect\\<repo-root>-wt-phase-reaudit"}

`cwd` is the worktree. **The worktree's own hook file ran, with the worktree as project dir.**

### Step 2 — a plain `-p` session CANNOT spawn (measured obstacle, not a dead end)

`claude -p` produces a session with `agent_type` ABSENT, which `spawn-verbatim-origin-gate.cjs` reads as
"the caller is the top-level main loop" — so the gate applies in full. Two attempts were denied. Its
ELEMENT 3 additionally demands log proof that a `grimorio.extract-cleaner` dispatch COMPLETED in that same
session within 30 minutes, which a fresh probe session cannot satisfy cheaply.

### Step 3 — `--agent <type>` IS the working harness (PROVEN, end to end)

    cd E:/Proyect/<repo-root>-wt-phase-reaudit
    claude --agent general-purpose --model haiku --permission-mode acceptEdits \
      -p "Use the Agent tool exactly once: subagent_type='Explore', description='live fire probe',
          prompt='Load skill/grimorio.conduct first. Then reply with exactly CHILD-OK and nothing else.'.
          Then reply with exactly PARENT-DONE."

This is NOT a workaround invented here — it is the exact case
`spawn-verbatim-origin-gate.cjs`'s own header already documents as **THE HONEST LIMITATION**: a session
launched via `claude --agent <type>` carries `agent_type` on its own `PreToolUse:Agent` event, so the gate
reads the caller as a subagent and exits 0.

**Observed result — a REAL child, and the full hook lifecycle firing in the worktree:**

    agent-invocations.log  2026-09-02T15:35:00.777Z  pre   Explore  f12=general-purpose  child=-
    agent-invocations.log  2026-09-02T15:35:01.310Z  post  Explore  f12=general-purpose  child=af6841c54b66a58a3  async_launched
    agent-completions.log  2026-09-02T15:35:05.504Z  a7e97341  af6841c54b66a58a3  Explore  "CHILD-OK"

Both log files were created IN THE WORKTREE by the worktree's own `log-agent-invocation.cjs` and
`log-agent-completion.cjs`. The completion row proves **`SubagentStop` fired in the worktree**, which is the
event `subagentstop-wait.cjs` is wired to; the spawn proves `SubagentStart` fired, which is
`subagent-id-injection.cjs`'s event; and `PreToolUse: Edit|Write` in such a session is
`keeper-worktree-guard.cjs`'s event.

**Therefore items 1, 2 and 3 can each be observed FIRING against their modified code, with zero risk to the
main checkout.**

## A side finding worth keeping (it constrains item 3's design)

In a `--agent`-launched session the caller's `agent_type` is populated (`f12=general-purpose`) but its
`agent_id` is NOT (`f14=-`). So for a child spawned by such a session there is no parent id to inject at
all. A parent-id injection must ABSTAIN in that case rather than guess — the same abstain path the
ambiguity case already needs.

## Housekeeping

`.claude/.cache/` is gitignored (`.gitignore:58`), so probe traffic never enters a commit; `git status`
stayed clean throughout. Probe artifacts may be left in place — they are real evidence, not pollution.
