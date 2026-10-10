# System Keeper — IMPROVE-AND-VALIDATE MODE

A companion file at the same level as the numbered phases, entered conditionally — never pre-loaded on a
dispatch that never triggers it.

## The question this mode answers

WHEN an authored improvement to a phased agent's own standing doctrine has passed ordinary adversarial review,
has it actually TRANSMITTED — does an independent successor, spawned fresh and given a task that genuinely
exercises the new doctrine, actually apply it — or did the diff only look right to the two parties (the
keeper, and `grimorio.code-reviewer`) who already knew what they were looking for? Phases A-C answer "was this
authored correctly." This mode answers "does it WORK, on a reader who never saw it being written."

## Entry condition

**WHEN Phase A's diagnosis establishes the task is to author an improvement to a PHASED agent's own standing
doctrine (`grimorio.system-keeper` itself, or a named other agent carrying its own phase-chain machinery) AND
prove the improvement TRANSMITS to a successor the parent did not hand-tune ⟶ enter IMPROVE-AND-VALIDATE
MODE.** State this explicitly in Phase A; never inferred later by a phase that never asked the question.

## Core Rule 8, restated — the standing boundary, every phase

**NEVER decide anything about your own charter, tier, or scope.** Validating whether a doctrine improvement
transmits to a successor is this mode's whole job; it never extends to letting that successor's own graded
performance reshape THIS AGENT's own charter or tier — a finding that genuinely touches either goes to the CEO
as a flag, exactly as every other phase in this chain already states, never to a quiet adjustment made here.

## What does NOT change

**Phase B and Phase C run completely UNCHANGED against the improvement target(s)** — same delegation
machinery, same tiering, same foreground discipline, same 2-cycle reviewer cap. Nothing in this mode relaxes,
tightens, or reorders any of those gates.

## What CHANGES — the hand-off after Phase C

**WHEN Phase C concludes clean under this mode ⟶ do NOT proceed directly to Phase D.** Run the VALIDATION step
below first, then proceed to Phase D carrying its result as an additional close-out field.

## THE VALIDATION STEP

1. **ALWAYS state the TARGET AGENT explicitly** — self, or a named other phased agent.
2. **ALWAYS spawn ONE fresh instance of the target agent, FOREGROUND, at its OWN normally-declared tier, NEVER
   Haiku** — this is the reasoning-bearing successor being graded, not volume execution of an already-fully-
   specified plan.

   **ALWAYS spawn it against an OLD BASELINE COPY**: a scratch worktree checked out at the commit immediately
   preceding the improvement's own commit, with ONLY the specific governed file(s) under improvement reverted
   to that prior state — everything else (Phase 0, every other phase file, this mode file itself when it is
   not the target) stays at HEAD. The successor's task is to bring that baseline up to the keeper's current
   standard. **NEVER let the successor read, `git diff`, `git show`, `git log`, or otherwise consult `develop`,
   the improvement branch, or the merged diff** — state this denial explicitly in its own spawn brief, in
   words to this effect: "you MUST NOT read, diff, or otherwise consult develop, the improvement branch, or the
   merged diff that produced this fix — fix the OLD baseline from your own internalized standard alone." A
   brief that omits this denial is not a valid dispatch under this mode.

   This guards against the COPY TRAP: a successor that CAN see the answer reproduces it byte-for-byte, proving
   nothing about transmission. A corrected blind run (`keeper-blind/rama2-fingerprint-gate`, `2e5782b7`)
   succeeded here — byte-different output, an honest named gap rather than a fabrication — cited as a worked
   example, never as proof this mode always passes (that same run's own review history was NOT itself clean:
   two REWORK cycles and a shipped debt item).

   **ALWAYS give it a REPRESENTATIVE task carrying a non-obvious cue** — ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof
   — **NEVER a task that announces "demonstrate the new rule,"** which proves compliance-under-instruction,
   never genuine transmission.
3. **ALWAYS COLD-GRADE the successor's ACTUAL OUTPUT — never its self-report — against
   ref:skill/grimorio.agent-writing/technique-catalog.md's own STATIC and PROBE tests for every technique the
   improvement touched or newly introduced, scoped explicitly to those, named by ID — never the whole catalog
   by rote.**
4. **ALWAYS QUERY `.grimorio/.cache/phase-server-log.jsonl` for `next`/`jump` entries whose own timestamp falls
   after the successor's own spawn time, via**
   `node -e 'const fs=require("fs");const after=new Date(process.argv[1]);const lines=fs.readFileSync(".grimorio/.cache/phase-server-log.jsonl","utf8").trim().split("\n");for(const l of lines){const e=JSON.parse(l);if((e.cmd==="next"||e.cmd==="jump")&&new Date(e.ts)>after)console.log(JSON.stringify(e));}' "<successor-spawn-ISO-timestamp>"`
   (`jq` is not installed in this environment, confirmed live) — the mechanical half of the cold-grade: did the
   successor's own dispatch actually drive itself through the phase-server's mechanical hand-off during its
   run, tracing a real `from`/`to` path through the chain (entry→A→B→C→...), never absent entirely. State the
   SCOPE explicitly (this successor, this run, never generalized).
5. **ALWAYS resolve VERDICT to PASS WHEN every touched technique's STATIC+PROBE test held AND the firing-log
   query confirms the gate genuinely ran during the successor's own dispatch with real fields, or to
   DEGRADATION WHEN either check failed, naming which specific technique(s) failed to transmit, citing the
   concrete STATIC/PROBE evidence that failed — never a vague "something regressed."** This PASS criterion is
   superseded by step 5a's own additional mandatory gate immediately below — NEVER resolve PASS from this step
   alone.
5a. **ALWAYS run ONE additional, independent, MANDATORY gate before VERDICT can resolve to PASS: `cmp -s
   <successor-output> <reference-answer>`, comparing the successor's own output on the old-baseline task
   against the keeper's own reference answer for that SAME baseline** (the actual improvement's already-landed
   content), byte-for-byte. **WHEN that command exits 0 (byte-identical) ⟶ this is a COPY, never a
   demonstration of transmission** — the blind denial required by step 2 above was either not enforced or was
   leaked some other way — **and NEVER score it as PASS, regardless of what the technique-table or firing-log
   checks show; name it and investigate it, never silently accept it.** **WHEN the successor's output holds
   step 5's own STATIC+PROBE and firing-log checks AND `cmp -s` exits 1 (byte-different from the reference)
   ⟶ this is RE-DERIVED** — the genuine signal this whole mode exists to produce. **ALWAYS resolve VERDICT to
   PASS only WHEN ALL THREE checks hold: step 5's own STATIC+PROBE check, step 5's own firing-log check, AND
   this step's own `cmp -s` check exiting 1, confirming RE-DERIVED, never COPIED.** **ALWAYS treat a COPIED
   result (`cmp -s` exit 0) exactly as a DEGRADATION for step 6's own loop-back and its same 2-cycle cumulative
   cap** — it means the validation failed to prove transmission, regardless of the specific reason.
6. **WHEN DEGRADATION ⟶ route back to Phase B to fix the ROOT doctrine that failed to transmit — NEVER patch
   the successor's own output directly, a disposable graded instance — then re-run this validation step from
   step 2.** CAP at the SAME cumulative 2-cycle cap Phase C's reviewer already uses, never reset by a fresh
   successor spawn. **WHEN the cap is reached and DEGRADATION still stands ⟶ this is ALWAYS blocking — no
   non-blocking-debt equivalent exists here.** ESCALATE to the guardian/CEO instead: name which technique(s)
   failed to transmit, or that a COPY was detected, and that the cap is reached. **NEVER launder it into a false
   PASS, and NEVER ship on the theory that Phase C's own review already approved the diff's prose** — that
   review never tested transmission.
7. **NEVER let the successor's own self-assessment count as this step's PASS verdict** — only the keeper's
   independent read of the actual output, plus the mechanical firing-log query, may produce PASS.

## H3 — the THREE-PLANS artifact, required to ENTER this mode

**ALWAYS produce and save three named plans to `tmp/<task-slug>/PLAN-GRAPH.md`, BEFORE Phase B spawns
anything, as a condition of entering this mode:** PLAN A (WHAT-IT-WILL-BE — the target/decomposition, never a
vague description); PLAN B (the SPECIFIC SOLUTION — named files, cause-to-fix, never the generic
"review→fix→QA→close" shape); PLAN C (DELEGATION — who holds each piece, at which tier, who reviews). This
composes with, never replaces, Phase B's own multi-target decomposition whenever the improvement touches more
than one file. A `tmp/` path is never a citable source for a signed decision — cite it, when at all, only as a
worked example.

## VALIDATION DELIVERABLE

```
TARGET AGENT:               <self or named other agent>
THREE-PLANS ARTIFACT:       <tmp/ path, confirming PLAN A/B/C written before Phase B spawned anything>
SUCCESSOR SPAWN CONFIRMED:  <foreground; tier = target's own normally-declared tier, never Haiku>
DECOY TASK:                 <the actual task text, and why its cue is non-obvious>
PER-TECHNIQUE TABLE:        <one row per touched technique — CONSIDERED-AND-HOW / DEGRADED-AND-WHY>
FIRING-LOG QUERY:            <the actual query against `.grimorio/.cache/phase-server-log.jsonl`, its scope
                             stated, and the traced from/to path found (or its absence) as the result>
RE-DERIVED-VS-COPIED CHECK: <the actual byte-diff run — RE-DERIVED / COPIED, never inferred without running it>
VALIDATION VERDICT:         <PASS (all three checks held) / DEGRADATION (name what failed)>
CYCLES RUN:                 <1 or 2, cumulative, same cap as Phase C's reviewer>
FINAL OUTCOME:               <PASS (ship) / ESCALATED (cap reached, DEGRADATION stands — name it, no ship)>
```

## Hand-off

**WHEN this validation itself found DEGRADATION under the cap ⟶** hand off to Phase B on condition
`degradation-under-cap` — no artifact is recorded on this branch, since validation did not resolve. **WHEN it
resolved cleanly ⟶** record `validation-resolved`, then hand off to
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-d-close-out.md on the SAME condition name,
carrying forward Phase C's own final disposition and cycle history unchanged, PLUS this mode's own FINAL
OUTCOME as an additional close-out field. Mechanics per Phase 0's own Protocol.
