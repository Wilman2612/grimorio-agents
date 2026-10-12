# grimorio.drift-auditor — Vision (design document)

Read when designing or re-designing this agent or a neighbour that calls it; never loaded at runtime.

**Requires (of the caller, drawn from the founding material — never invented):** grimorio's own governance/
index files silently drift from the live repo, and the tools that could catch that drift already exist —
`grimorio.system-keeper` had built 20+ audit/governance tools in `scripts/` and 11 more under
`scripts/selftest/`, and nothing in the system named them: `ref:repo/.grimorio/scripts/agent-stats.sh` had been run zero times
ever, including by `grimorio.system-keeper` itself while auditing the system it measures. The same files that
list "what exists" admit, in their own text, that they go stale ("recount before trusting an old figure — this
section drifts fast"; a worktree inventory explicitly recorded as a snapshot that "none... will be migrated by
this fix; each ages out naturally"). The cost is COGNITIVE/TRUST, not code: every reader who consults these
files to learn "what exists" is trusting numbers and lists nobody has periodically re-checked.

**Objective:** keep grimorio's own hand-maintained governance/index files trustworthy — so any reader can rely
on what they claim about the live system without independently re-deriving it by hand first.

**The wiring shape:**
- *Provides:* a structured DRIFT REPORT — per governance file, per checked claim: PASS / DRIFT (both values
  shown, command cited) / STALE (the claim's own referent is gone) / UNVERIFIABLE (no live check exists, named
  rather than guessed) — plus an overall verdict and a prioritized fix list for agent:grimorio.system-keeper. Never
  edits a governance file.
- *Input class:* nothing, for a standing sweep across the full known population, or one or more specific
  governance files a caller wants scoped re-checked. Never a single already-diagnosed fact — a grep or a scout
  is cheaper for that.
- *Output class:* the drift report above — never a fix, never an edited file. Every claim carries the live
  command run and its raw output beside the document's own claim. Never speculative: everything reported is
  checked against the real live repo, never inferred as a stand-in for a check that wasn't run.

**Applicability:** invoke before trusting an old count/list/inventory for a real decision, or on a recurring
cadence to catch drift before it compounds. Do NOT invoke to verify one already-suspected fact (cheaper checked
by hand), to audit non-governance content (code correctness, a design doc's own claims — agent:grimorio.code-reviewer
/ agent:grimorio.qa territory), or expecting it to fix anything it finds.

**Boundaries:**
- *Never-skip:* must actually RUN the live tool/command for every claim it reports on — never accept a
  document's own claim as true without independent, live verification this invocation.
- *Inviolable:* NEVER edit a governance/index file itself, however small or obviously correct the fix looks —
  holds even against the CEO himself. NEVER fabricate or guess a live number when no tool to check it exists —
  report UNVERIFIABLE plainly instead. May raise exactly ONE bounded `agent:grimorio.scout` child at a time —
  Haiku-tier per ref:skill/grimorio.agent-tiers, never a panel, never any other agent type, never itself, never
  an orchestrator, never a developer — to run ONE of the audit toolchain's own commands and report its raw
  output for ONE governance claim; NEVER let that child classify a claim PASS/DRIFT/STALE/UNVERIFIABLE, which
  stays this agent's own judgment alone, the same bounded grant `grimorio.code-reviewer` already carries
  (commits `bf0b457f`/`5d452eb8`) — per
  ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on, delegating
  READING is not delegating the VERDICT. A raised `grimorio.scout` is itself hard-locked non-recursive
  (`disallowedTools: Agent`, unchanged), so this grant does not deepen the fan-out's own
  depth-bounded-at-ONE-level invariant
  (ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize) — this agent becomes a NEW
  panel-orchestrator floor, never a new depth.

**Acceptable result:** every claim reported carries the exact live command run and its raw output beside the
document's own claim, so a human reading only the summary could still verify a discrepancy without re-running
anything; zero claims silently skipped from a document's own declared scope; a FAITHFUL TRANSLATION — nothing
lost between the raw tool output and what gets reported. agent:grimorio.system-keeper needs each DRIFT/STALE row
complete enough to act on directly, without re-deriving the live check itself.
