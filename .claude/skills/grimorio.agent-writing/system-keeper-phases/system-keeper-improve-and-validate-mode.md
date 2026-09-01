# System Keeper — IMPROVE-AND-VALIDATE MODE

This is a companion file inside `system-keeper-phases/`, at the SAME level (behavior) as the seven numbered
phase files it sits beside, and following the SAME conventions every one of them already uses. It is NOT a
numbered phase forced onto every dispatch — it is a NAMED MODE, entered conditionally, the same shape
ref:skill/grimorio.agent-writing/prompt-writer-behavior.md#clone-executor-mode--entry-point-for-a-haiku-tiered-same-type-clone
already establishes for `grimorio.prompt-writer`'s own chain: a mode file reached only WHEN its own entry
condition holds, read fresh at the point it fires, never pre-loaded on a dispatch that never triggers it.

## The question this mode answers

WHEN an authored improvement to a phased agent's own standing doctrine has landed and passed ordinary
adversarial review, has it actually TRANSMITTED — does an independent successor, spawned fresh from the
improved files and given a task that genuinely exercises the new doctrine, actually apply it — or did the
diff only look right to the two parties (the keeper itself, and `grimorio.code-reviewer`) who already knew what
they were looking for? Phases 1-7 answer "was this authored correctly." This mode answers a categorically
different question: "does it WORK, on a reader who never saw it being written."

## Entry condition

**WHEN the task, as Phase 1's own OBJECTIVE and Phase 2's own diagnosis establish it, is to author an improvement to a PHASED agent's own standing doctrine (`grimorio.system-keeper` itself, or a named other agent carrying its own phase-chain machinery) AND prove the improvement TRANSMITS to a successor the parent did not hand-tune ⟶ enter IMPROVE-AND-VALIDATE MODE.** `ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md`'s
own diagnosis is where this fires, as a new named field in that phase's own DELIVERABLE (`MODE ENTERED`) — this
file does not author that field, only states the CONTRACT it must satisfy: `MODE ENTERED` names either
`IMPROVE-AND-VALIDATE — <why>` (this mode fires, this dispatch) or `No — <one-line reason>` (it does not), never
left blank, and never inferred later by a phase that never asked the question.

## Core Rule 8, restated — the standing boundary, every phase

**NEVER decide anything about your own charter, tier, or scope.** Validating whether a doctrine improvement
transmits to a successor is this mode's whole job; it never extends to letting that successor's own graded
performance reshape THIS AGENT's own charter or tier — a finding that genuinely touches either goes to the CEO
as a flag, exactly as every other phase in this chain already states, never to a quiet adjustment made here.

## What does NOT change — Phases 3 and 4 run completely unmodified

**Phase 3 (PLACEMENT) and Phase 4 (AUTHORING-COORDINATION) run completely UNCHANGED against the improvement
target(s) under this mode** — the same delegation-decision machinery, the same tiering rules, the same
foreground/never-pass-model discipline, no special-casing of any kind because the target happens to be
doctrine this mode will later validate. **Phase 5 (VERIFICATION) and Phase 6 (ADVERSARIAL REVIEW) likewise run
completely UNCHANGED** — the improvement itself is verified and code-reviewed exactly like any other governed
change, under the SAME code-reviewer cumulative two-cycle cap Phase 6 already states
(`ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md`'s own step 5). Nothing in this
mode relaxes, tightens, or reorders any of those four phases' own gates.

## What CHANGES — the hand-off after Phase 6

**WHEN Phase 6 concludes UNDER THIS MODE — APPROVED, or a cap-reached SHIPPED-WITH-RECORDED-REWORK — ⟶ do NOT
proceed directly to Phase 7.** Enter this mode's own VALIDATION step (below) instead, THEN proceed to Phase 7
carrying the validation's own result forward as an additional close-out field. The routing itself is wired at
`ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md`'s own hard hand-off, as a WHEN
clause stated there — this file does not restate Phase 6's own text, only the CONTRACT: Phase 6 hands this mode
the SAME final disposition and the SAME full cycle history it would otherwise have handed Phase 7 directly.

## THE VALIDATION STEP

1. **ALWAYS state the TARGET AGENT under improvement explicitly** — self (`grimorio.system-keeper`), or a
   named other phased agent — before anything else in this step.
2. **ALWAYS spawn ONE fresh instance of the target agent, in the FOREGROUND — NEVER backgrounded, per this
   whole chain's own standing foreground discipline (ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md's
   own step 3, ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md's own step 3, not
   re-derived here) — via the Agent tool, at the target agent's OWN normally-declared tier, NEVER Haiku for
   this spawn.** This is the reasoning-bearing successor actually being graded; Haiku is the volume-execution
   tier for a plan already fully specified, never the tier for the very doctrine being tested for genuine
   transmission.

   **WHEN a phase or mode file the successor must read to function — Phase 0, every phase file, INCLUDING this
   mode file itself — is not itself the specific file under improvement in this validation run ⟶ never treat
   the successor's own reading of it as a blindness violation:** reading its own governing doctrine is
   unavoidable and is exactly what this validation exists to test.

   **WHEN a phase or mode file — INCLUDING this very mode file, since step 1 above explicitly supports `self
   (grimorio.system-keeper)` as a TARGET AGENT — IS itself the specific file under improvement in this
   validation run ⟶ that file's own PRE-IMPROVEMENT version IS the OLD BASELINE CONTENT and MUST be hidden
   from the successor exactly like any other governed target:** spawn the successor against the
   pre-improvement version of THAT file specifically, while everything else in its normal operating doctrine
   stays current, per the mechanism below. This mirrors what the cited `rama2-fresh` precedent (below)
   actually did — that run worked because this mode file was genuinely absent from the successor's own tree,
   never because a rule licensed reading its current, already-fixed content; a self-validation run must
   reproduce that same absence deliberately, never exempt itself from it.

   What MUST stay hidden, in either case, is the TASK'S OWN ANSWER — never the successor's own surrounding
   governing doctrine: **ALWAYS spawn the successor against an OLD BASELINE COPY** — a version of the target
   agent's own governed files predating this specific improvement — **with its task being to bring that
   baseline up to the keeper's current standard.** **ALWAYS construct that OLD BASELINE COPY the same concrete
   way, every time: a scratch worktree checked out at the commit immediately preceding the improvement's own
   commit, with ONLY the specific governed file(s) actually under improvement reverted to that prior-commit
   state** — per the conditioning above, IT is this very mode file itself WHEN this mode file is the target
   under improvement — **while every other phase file, Phase 0, and (when not itself the target) this mode
   file all stay at HEAD, current.** Two different keepers must never improvise two different setups for this
   same step. This scratch worktree already IS the SELF-MODIFICATION case ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md#worktree-isolation-is-for-self-modification-never-a-normal-improvement-pass names — the governed file(s) under improvement are always among this dispatch's own TARGET FILE(S), so that section's own FIRST rule (a worktree is warranted here, since the governed file(s) under improvement are always among this dispatch's own TARGET FILE(S)) already covers this step's own worktree-creation setup, confirmed consistent, never duplicated or contradicted here — NEVER read this as also invoking that section's own THIRD clause (the guard-hook arming instruction): nothing in this VALIDATION STEP arms `keeper-worktree-guard.cjs` before spawning the successor in step 2 below, and this sentence claims no such coverage. **NEVER let the successor read, `git diff`, `git show`, `git log`, or otherwise consult
   `develop`, the improvement branch, or the merged diff that produced the improvement being validated, by ANY
   means, at any point** — state this denial as an instruction the successor's OWN spawn brief must carry
   explicitly, in words to this effect: *"you MUST NOT read, diff, or otherwise consult develop, the
   improvement branch, or the merged diff that produced this fix — fix the OLD baseline from your own
   internalized standard alone."* **WHEN a spawn brief omits this explicit denial ⟶ it is not a valid blind
   dispatch under this mode.**

   This guards against the COPY TRAP: a successor that CAN see the answer can `git diff` it and reproduce it
   byte-for-byte, proving nothing about genuine transmission — it proves only that copying works. REPORTED —
   not independently verifiable in this repo's own history, since no committed failed attempt exists (the
   correction most likely happened live, in conversation, before the flawed instruction was ever executed as a
   dispatch), and never presented as an independently Measured fact the way the next citation is: a live run
   demonstrated exactly this failure when the successor could see the branch/diff. A corrected BLIND run, run
   the way this rule now requires, succeeded AT THE NARROW POINT THIS RULE ACTUALLY NEEDS — the successor's own
   output was byte-DIFFERENT from the reference answer (genuinely re-derived), and it honestly NAMED, rather
   than fabricated, that it could not safely reproduce the ~48KB `technique-catalog.md` from memory; the
   successor re-derived a functionally-working D8 fingerprint-gate + IMPROVE-AND-VALIDATE MODE backfill. State
   plainly, in the same breath, that this SAME run's own adversarial-review history was NOT itself a clean
   pass: two REWORK cycles, a HIGH-severity finding self-fixed but never independently re-gated by a third
   review pass, and a named MEDIUM debt item shipped under the project's own 2-cycle cap; the branch stayed
   open, never merged, for the CEO's own cold grade. Concrete, already-committed internal precedent for this
   exact corrected
   method: git branch `keeper-blind/rama2-fingerprint-gate`, commit `2e5782b7` (checked out, at authoring time,
   in worktree `.claude/worktrees/rama2-fresh` — an ephemeral local checkout location, not itself part of the
   tracked tree, so it carries no `relation:store/path` form of its own; the durable identifier is the commit).
   That commit's own `tmp/keeper-blind/PLAN-GRAPH.md` states this method explicitly ("No `git diff`/`git show`/
   `git log` was ever run against `develop` or any ref other than rama2-fresh's own local history") and records
   that same catalog-honesty finding — cited here, per H3 below's own tmp/-path caveat, as a WORKED EXAMPLE
   only, never as a load-bearing pointer a later decision depends on (`cite:tmp/path` is impossible by this
   corpus's own reference grammar).

   **ALWAYS give it a
   REPRESENTATIVE task that would genuinely exercise the improved doctrine — a decoy task carrying a
   non-obvious cue, per ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof's own method — and NEVER a
   task that announces "demonstrate the new rule," which proves only compliance-under-instruction, never
   genuine transmission.** Grounded in ref:skill/grimorio.agent-writing/project.technique-catalog.md's own F7 row ("the §4
   probe (non-obvious cue)"), which already names exactly this method — not re-derived here.
3. **ALWAYS COLD-GRADE the successor's own ACTUAL OUTPUT — never its own self-report — with the keeper's OWN
   eyes**, per this whole chain's own standing "an agent's own claim is not evidence" discipline, **against
   ref:skill/grimorio.agent-writing/project.technique-catalog.md's own STATIC and PROBE tests for every technique the
   improvement touched or newly introduced — scoped explicitly to those touched techniques, named by ID and
   name, NEVER graded against the whole catalog by rote.** This step's own output is a per-technique table —
   technique ID/name, CONSIDERED-AND-HOW or DEGRADED-AND-WHY, none silently skipped — reusing
   ref:skill/grimorio.agent-writing/project.technique-catalog.md's own C5 row ("`foreach` / coverage-validation": "list ALL
   findings or write 'None'") as the enumeration discipline, rather than inventing a second one.
4. **ALWAYS QUERY the firing-log at `the fingerprint-gate log` for entries whose `agent`
   field matches the successor's own declared agent type AND whose `ts` falls after the successor's own spawn
   time** — this is the MECHANICAL half of the cold-grade: did the D8 gate genuinely fire during the
   successor's own dispatch, in which phases, with which verdicts. **ALWAYS state the SCOPE of this query
   explicitly, every time it is run** — one successor's one run, on this session/machine, never generalized
   into a claim that the gate "always fires" — per ref:skill/grimorio.agent-writing/project.technique-catalog.md's own E6 row
   ("A count needs its population": "Report count + population + the command; never a bare number"), the real
   catalog entry this framing rests on.
5. **ALWAYS resolve VERDICT to PASS WHEN every touched technique's STATIC+PROBE test held AND the firing-log
   query confirms the gate genuinely ran during the successor's own dispatch with real fields, or to
   DEGRADATION WHEN either check failed, naming which specific technique(s) failed to transmit, citing the
   concrete STATIC/PROBE evidence that failed — never a vague "something regressed."** This PASS criterion is
   superseded by step 5a's own additional mandatory gate immediately below — NEVER resolve PASS from this step
   alone.
5a. **ALWAYS run ONE additional, independent, MANDATORY gate before VERDICT can resolve to PASS: a
   byte-for-byte comparison between the successor's own output on the old-baseline task and the keeper's own
   reference answer for that SAME baseline** (the actual improvement's already-landed content). **WHEN that
   comparison is byte-IDENTICAL ⟶ this is a COPY, never a demonstration of transmission** — the blind denial
   required by step 2 above was either not enforced or was leaked some other way — **and NEVER score it as
   PASS, regardless of what the technique-table or firing-log checks show; name it and investigate it, never
   silently accept it.** **WHEN the successor's output holds step 5's own STATIC+PROBE and firing-log checks
   AND is byte-DIFFERENT from the reference ⟶ this is RE-DERIVED** — the genuine signal this whole mode exists
   to produce. **ALWAYS resolve VERDICT to PASS only WHEN ALL THREE checks hold: step 5's own STATIC+PROBE
   check, step 5's own firing-log check, AND this step's own byte-diff check confirming RE-DERIVED, never
   COPIED.** **ALWAYS treat a COPIED result exactly as a DEGRADATION for step 6's own loop-back and its same
   2-cycle cumulative cap** — it means the validation failed to prove transmission, regardless of the specific
   reason.
6. **WHEN DEGRADATION ⟶ route back to
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-3-placement.md and
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md to fix the ROOT doctrine that
   failed to transmit — NEVER patch the successor's own output directly**, which is a disposable graded
   instance, never a deliverable in its own right — **then re-run this ENTIRE validation step again from step
   2.** CAP this loop at the SAME cumulative cycle cap
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md's own step 5 already states for
   its own adversarial-review loop — two cycles, cumulative, never reset by a fresh successor spawn — not a new
   number invented here. **WHEN the cap is reached and DEGRADATION still stands ⟶ proceed to Phase 7 anyway
   and record the true outcome honestly, as "SHIPPED WITH RECORDED FIXED-POINT GAP"** — mirroring Phase 6's own
   SHIPPED-WITH-RECORDED-REWORK naming convention exactly, never laundered into a false PASS.
7. **NEVER let the successor's own self-assessment count as this step's own PASS verdict** — the parent that
   authored the improvement is structurally biased to bless its own work; only the keeper's independent read of
   the successor's actual output, plus the mechanical firing-log query, may produce a PASS.

## H3 — the THREE-PLANS artifact, required to ENTER this mode

**ALWAYS produce and save three named plans to `tmp/<task-slug>/PLAN-GRAPH.md`** (per
ref:skill/grimorio.working-memory#the-folder's own `tmp/{task-slug}/` convention), BEFORE Phase 4 spawns anything, as a
condition of entering this mode at all: **PLAN A (WHAT-IT-WILL-BE)** — the target/decomposition, never a vague
description; **PLAN B (the SPECIFIC SOLUTION)** — named files, cause-to-fix, NEVER the generic
"review→fix→QA→close" process-shape; **PLAN C (DELEGATION)** — who holds each piece, at which tier, who
reviews. **This COMPOSES WITH, and never replaces,
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-3-placement.md's own MULTI-TARGET DECOMPOSITION step (its
own step 7) whenever the improvement touches more than one target file** — the same multi-target machinery,
never a second one invented alongside it. **WHEN a tmp/ path is later cited as evidence this ran ⟶ state
plainly that a `tmp/` path is never a citable source for a signed decision**
(ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 17; the folder convention itself is
ref:skill/grimorio.working-memory) — cite it, when at all, only as a WORKED EXAMPLE for a future reader, never as a
load-bearing pointer a later decision depends on.

## Standing infrastructure note

**The firing-log this mode's own VALIDATION step 4 queries is NOT exclusive to this mode** — EVERY ordinary
dispatch through the keeper's or the writer's own phase chain already writes to it on every fingerprinted phase
transition, mode or not, per ref:skill/grimorio.phase-splitting/project.fingerprint-gate.md's own algorithm. This mode is simply
the FIRST standing consumer that QUERIES this log, closing an ANALOGOUS "written but nobody consumes it" gap to
the one ref:skill/grimorio.agent-writing/project.technique-catalog.md's own G5 and G6 rows already diagnose for the sibling
skill-load logger, `skill-load-debug.log` — G5's own MEASURED field, quoted verbatim: "log exists; 'no gate
consumes these markers' (own comment)"; G6's own "What it obliges," quoted verbatim: "No phase field (0/3479),
session-scoped STOCK, records LOAD not FOLLOWING." **NEVER read this as G5 or G6's own documented weakness now
being resolved** — `skill-load-debug.log` itself REMAINS unconsumed after this diff, exactly as G5/G6 found it;
only the NEW, different `fingerprint-gate-log.jsonl` file gains a consumer here, never a second, mode-specific
logging mechanism invented alongside the one that already exists.

## LOAD (JIT)

- import:skill/grimorio.agent-writing/project.technique-catalog.md — the WHOLE file, for step 3's own cold-grade: every touched
  technique's STATIC and PROBE test is drawn from this catalog, not re-derived — the same EVALUATION use
  ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md already makes of this same file, cited
  here as the precedent rather than re-argued.
  FINGERPRINT: PER-TECHNIQUE TABLE field below (a genuine CONSIDERED-AND-HOW/DEGRADED-AND-WHY row per touched
  technique cannot be produced without opening this catalog and reading its actual STATIC/PROBE tests).
- import:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof — narrow, for step 2's own decoy-task design
  only; never the whole skill, which Phase 3/Phase 2 each already load their own narrower slice of elsewhere in
  this chain. This step 2 must actually APPLY this method to design the decoy task, which is exactly what
  `import:` ("load in full before acting") means here, never `ref:` ("optional, read only if the situation
  arises").
  FINGERPRINT: DECOY TASK field below (a task carrying a genuinely non-obvious cue, rather than one that
  announces what it tests, cannot be produced without applying this method).
- **NEVER load anything about placement, authoring coordination, or adversarial-review syntax here** — Phases
  3-6 run unmodified under this mode, per the section above, and this file adds nothing to what they already
  load.

## VALIDATION DELIVERABLE

```
TARGET AGENT:              <self (grimorio.system-keeper) or a named other phased agent, per step 1>
THREE-PLANS ARTIFACT:      <tmp/<task-slug>/PLAN-GRAPH.md path, confirming PLAN A/B/C all written BEFORE
                            Phase 4 spawned anything, per H3 above — never cited as a signed source, a
                            worked example only>
SUCCESSOR SPAWN CONFIRMED: <foreground — yes; tier — the target agent's own normally-declared tier, NEVER
                            Haiku, named explicitly, per step 2>
DECOY TASK:                <the actual task text handed to the successor, and one sentence on why its cue is
                            non-obvious rather than an announced "demonstrate the new rule," per step 2>
PER-TECHNIQUE TABLE:       <one row per technique the improvement touched or introduced — ID/name,
                            CONSIDERED-AND-HOW or DEGRADED-AND-WHY, none silently skipped, per step 3>
FIRING-LOG QUERY:          <the actual query run against the fingerprint-gate log, its
                            SCOPE stated explicitly (this successor, this run, this session/machine —
                            never generalized), and its result, per step 4>
VALIDATION VERDICT:        <PASS (steps 3, 4, AND the byte-diff RE-DERIVED-vs-COPIED check, all three
                            held) / DEGRADATION (name the specific technique(s) and the concrete evidence
                            that failed, OR name that the byte-diff check found a COPY), per step 5 and
                            step 5a>
RE-DERIVED-VS-COPIED CHECK: <the actual byte-diff comparison actually run between the successor's own output
                            and the keeper's own reference answer for the same baseline — RE-DERIVED
                            (byte-different, confirmed) / COPIED (byte-identical — the test FAILED, name how
                            access to the answer was not fully denied) — never left blank, never inferred
                            without actually running the comparison, per step 5a>
CYCLES RUN:                <1 or 2, CUMULATIVE, same cap as
                            ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md's
                            own step 5 — never reset by a fresh successor spawn, per step 6>
FINAL OUTCOME:              <PASS (ship) / SHIPPED WITH RECORDED FIXED-POINT GAP (cap reached, DEGRADATION
                            still stands, shipped anyway, honestly recorded per step 6> — never softened
                            toward PASS>
```

## Hard hand-off

**BEFORE reading `ref:skill/grimorio.agent-writing/system-keeper-phases/phase-7-close-out-report.md` ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/system-keeper-phases/system-keeper-improve-and-validate-mode.md`) and
this mode's own filled VALIDATION DELIVERABLE block, written to disk first per that gate's own algorithm — the
read below now runs on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read `ref:skill/grimorio.agent-writing/system-keeper-phases/phase-7-close-out-report.md` next, carrying
forward: Phase 6's own final disposition and full cycle history (unchanged, per the section above), PLUS this
mode's own FINAL OUTCOME as an additional close-out field.** Phase 7 reports the true outcome to the caller — it
does not re-run this mode's own validation and does not relitigate its verdict.
