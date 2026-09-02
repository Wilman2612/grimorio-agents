# Adviser — Phase 2: ABSORB-EVIDENCE

**NEVER read ref:skill/grimorio.working-memory/adviser-phases/phase-3-diagnose-and-prescribe.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** DIAGNOSE-AND-PRESCRIBE classifies a failure mode
against evidence this phase names; handing it an unopened artifact leaves it nothing real to classify.

## The question this phase answers

What actually happened, evidenced — for the sub-problems Phase 1 left standing? Nothing else. This phase does
not classify the failure mode, does not name the misconception, and does not prescribe anything — it only opens
the real artifacts and, WHEN genuinely needed, raises one bounded child to help open them, so Phase 3 reasons
over grounded evidence rather than a summary.

## Core Rule — advise only, restated here, every phase

**NEVER build, refactor, research empirically, or commit — advise only.** Read-only checks are fine. **WHEN you
catch yourself writing feature code ⟶ STOP** — that is a builder's job, and doing it yourself repeats the very
failure you were summoned to break. This is the ONE phase in this chain where the boundary is easiest to miss:
"absorbing evidence" can slide into "fixing what I just opened" under haste, and a spawned child inherits this
same boundary — its own flow-brief (step 3 below) must state it too, never assume the child infers it.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: SELF (open the target/reference, the
   failing artifact, the code path, the attempt history) is the default and only mandatory node.** An
   `agent:` evidence-gathering child (step 3 below) is a SECOND node that exists ONLY when this phase's own
   evidence-gathering genuinely needs an independent worker — name explicitly, in this phase's own DELIVERABLE,
   whether that second node fires this pass or not. **Never this graph's default shape** — the common, legitimate
   case is SELF alone.
2. **ALWAYS absorb the failure**: read the target/reference, the actual failing artifact (open it, never a
   summary), the code that produces it, and the attempt history — for exactly the sub-problems Phase 1's own
   DELIVERABLE carried forward as survivors, never the whole originally-presented tangle.
3. **WHEN this phase's own evidence-gathering genuinely needs an independent worker ⟶ raise a single bounded
   spawn node, here, per ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate**
   — a flow-brief (objective + full context + a completion check naming an evidence artifact) + save the
   invocation — a bounded gather uses the lightweight form. **Tier it per
   ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier**, never inheriting this agent's own Fable
   tier for a grunt gather. Include the advise-only boundary (this phase's own Core Rule above) explicitly in
   the child's own flow-brief — a gathering child that starts "fixing" what it finds is this same violation, one
   level down. **WHEN no independent worker is genuinely needed ⟶ this step is satisfied by stating so plainly**
   in this phase's own DELIVERABLE (`SPAWN RAISED`, below) — most invocations answer "not needed."

## LOAD (JIT) — scoped to this phase only

- **NEVER load reasoning-principles, the diagnosis/misconception/prior-art discipline, or the plan/routing
  knowledge here** — none of those are this phase's question; each belongs to Phase 1 or Phase 3/4 alone. This
  phase's own work is pure tool use (Read/open) against the task's own external artifacts, plus, conditionally,
  one narrow spawn slice.
- ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate — step 3's own
  raise mechanics, loaded ONLY WHEN step 3's own trigger fires this pass. No `FINGERPRINT:` annotation on this
  bullet — the spawn is conditional/optional, never a mandatory content-producing dependency this phase's own
  deliverable structurally requires, mirroring
  ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md's own scout-raise slice, which
  carries none for the identical reason.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — step 3's own tier choice, loaded ONLY WHEN
  step 3's own trigger fires this pass.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
TARGET/REFERENCE OPENED:   <confirm the real target/reference artifact was opened, never a summary, or the
                          sub-problem it belongs to>
FAILING ARTIFACT OPENED:   <confirm the actual failing output was opened directly (the pixels/output/behavior
                          itself), never described secondhand>
CODE PATH OPENED:          <the code that produces the failing artifact, actually read>
ATTEMPT HISTORY:           <what prior attempts were made and what they show, per what was actually found>
SPAWN RAISED:              <yes/no — if yes, the flow-brief's own objective + completion check + tier, and
                          what it returned; if no, "not needed" rather than a silent field>
CORE RULE CHECK (ADVISE ONLY): <confirm this phase's own work — and any spawned child's — stayed read-only:
                          opening and reading artifacts, never fixing or building anything>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.working-memory/adviser-phases/phase-3-diagnose-and-prescribe.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.working-memory/adviser-phases/phase-2-absorb-evidence.md`) and this phase's
own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm.** This phase carries
ZERO `FINGERPRINT:` annotations in its own `## LOAD (JIT)` section above — the spawn slice is conditional, never
mandatory — so per that gate's own "MANDATORY on a fingerprinted phase, INERT on one with none" rule, this step
still runs, exactly as written, and reports `PASS — all 0 declared FINGERPRINT field(s) carry real content`
unconditionally. **Run it anyway** — the uniform step, never a per-phase judgment call about whether the gate
"applies" this time.

**ALWAYS read ref:skill/grimorio.working-memory/adviser-phases/phase-3-diagnose-and-prescribe.md next, carrying
forward: the opened target/reference, the failing artifact, the code path, the attempt history, and whatever the
spawned child returned if step 3 fired.** Phase 3 reasons over exactly this evidence — it does not re-open
anything itself.
