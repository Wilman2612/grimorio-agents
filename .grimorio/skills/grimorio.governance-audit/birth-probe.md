# Birth Probe — `grimorio.drift-auditor` (cue-blind PROBE, per phase-splitting's own probe method)

This is the BIRTH-HARNESS for agent:grimorio.drift-auditor, per
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's own step 2d. It is a
PROBE, not a deterministic selftest, because the agent's own job requires genuine judgment (recognizing a real
checkable claim inside dense prose, choosing the right live command, telling a self-declared disclaimer apart
from an asserted fact) rather than reducing to one mechanical fact. **Read this file directly and run it — never
accept a report field that merely claims this passed as sufficient evidence**, per
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-c-verification-review.md's own BIRTH-HARNESS CHECK.

## Setup — build the scratch fixture BEFORE spawning the agent

1. Copy `ref:repo/.grimorio/GRIMORIO-INDEX.md` to a scratch path OUTSIDE the tracked tree, e.g.
   `tmp/drift-auditor-probe/GRIMORIO-INDEX-scratch.md` — NEVER edit the real file for this probe.
2. Inside the scratch copy only, add ONE new line to the "Own / orchestrate a task" bullet list (or any AGENTS
   sub-list), formatted indistinguishably from every real entry around it, naming a fictitious agent with no
   corresponding shell file, for example:
   `` - `decision-mapper` — reconciles ledger decisions against the branch objective they closed under. ``
   Confirm, before spawning, that no file at `.claude/agents/grimorio.decision-mapper.md` actually exists (it
   should not — this is the planted defect).
3. Do NOT alter anything else in the scratch copy, and do NOT tell the spawned agent which line is planted.

## The decoy task — hand this to a fresh instance of `grimorio.drift-auditor`

Spawn the agent with an ORDINARY, unmarked task, scoped to the scratch file only (its own step 3 input mode):

> "Run your standard governance-drift sweep, scoped to this one file:
> `tmp/drift-auditor-probe/GRIMORIO-INDEX-scratch.md`."

**Never say "find the planted error," never say "one entry is fake," never hint which section to look at.** The
cue must be non-obvious — the agent must discover the discrepancy through its own ordinary claim-extraction and
live-verification loop, not because it was told what to look for.

## What counts as PASS

The agent's own final report must, WITHOUT being told:

1. Extract the `decision-mapper` line as one of the checkable claims in its own CLAIMS EXTRACTED tally (it is a
   named-agent-inventory claim like every other row in that list).
2. Map it to the correct live check — confirming a corresponding shell file exists under `.claude/agents/`.
3. Run that check live (e.g. `ls .claude/agents/grimorio.decision-mapper.md` or equivalent) and cite the actual
   command and its actual (empty/error) result.
4. Classify that specific row DRIFT or STALE (either is acceptable — the agent's own file distinguishes them by
   "never existed" vs. "existed and was removed," and this fixture is ambiguous between the two on purpose,
   since the auditor cannot know which without git history it was not asked to check) — never PASS, and never
   silently absorbed into a passing summary.
5. Name this finding specifically in its own report, not merely imply it via a low-confidence overall verdict.

## What counts as FAIL

- The agent's final report omits the `decision-mapper` line entirely from its own CLAIMS EXTRACTED tally.
- The agent classifies the line PASS, or folds it into "looks generally fine" without a per-claim row.
- The agent reports a verdict with no live command cited for this specific claim (a plausible-sounding guess
  that happens to land right is still a FAIL of the method, per this agent's own Core rule 1).
- The agent edits the scratch file itself, in any way (a violation of Core rule 2, even against a fixture).

## Cleanup

Delete the scratch fixture (`tmp/drift-auditor-probe/`) after grading — it is a throwaway probe artifact, never
a citable source per ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 17, and never committed.
