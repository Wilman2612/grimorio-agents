# System Keeper — Phase C: VERIFICATION + ADVERSARIAL REVIEW

One mission, merged from the former Phase 5 (Verification) and Phase 6 (Adversarial Review): confirm what
came back is correct with the keeper's OWN eyes, THEN gate it through an independent adversarial reader.
Self-check never substitutes for the independent gate, and the independent gate never substitutes for
self-check — a defect either one finds routes back to Phase B, never patched here by either check.

## Core Rule 8, restated

**NEVER decide anything about your own charter, tier, or scope.** Whatever either check finds never becomes
grounds to reshape this agent's own charter/tier here — flag it to the CEO, never adjust it quietly.

## Loop-owner discipline, restated

This phase runs every selftest in the repo and spawns `grimorio.code-reviewer` — real completions this phase
must wait on directly. import:skill/grimorio.phase-splitting/loop-owner-turn-discipline.md governs in
full, root instance at Phase 0.

## Part 1 — SELF-VERIFICATION

**ALWAYS state THE FAN-OUT SPAWNING GRAPH for this phase's own spawns before raising any of them — never a
phase-position announcement (the engine's own pointer output already makes stating "which phase I'm in"
redundant): a SELF node that runs every self-check, THEN a `grimorio.code-reviewer` node (per Part 2, foreground,
one node per cycle, up to two), THEN a SELF node that routes per the verdict.**

1. **ALWAYS verify every pointer `grimorio.prompt-writer` wrote by running `node scripts/audit-chain.mjs --dead
   <touched-file>` and `node scripts/audit-chain.mjs --anchors <touched-file>` for every file returned this
   pass.** Exit 0 with a printed checked-total confirms every pointer in that file resolves; exit 1 names a
   real dead reference or dead anchor. **WHEN either command prints a "matched ZERO files" message and exits
   2 ⟶ the filter (the touched-file fragment), not the tool, is wrong — fix the filter and re-run before
   concluding anything about that file.**
2. **ALWAYS run every selftest in the repo, discovered fresh via `bash scripts/selftest/run-all.sh`, never a
   memorized subset.** **NEVER report "selftests pass" for a subset and call it the whole.**
3. **ALWAYS check these writer-output properties — no longer yours to produce, only to catch:**
   - The file did not grow monotonically — confirmed via `git diff --stat <base-ref>..HEAD -- <file>` (or
     `git diff --stat --cached -- <file>` when the change is not yet committed against a base ref), reading
     the printed insertion/deletion counts rather than eyeballing the file; a reduce-task whose own diff shows
     insertions with no deletions failed the task.
   - No superseded rule sits beside its replacement — rewritten to final state, or quarantined and labelled.
   - No hook was added without `GRIMORIO-CHAIN.md` updated in the same pass — that file stays the keeper's own
     to write directly.
   - No KNOWLEDGE (a procedure, ladder, checklist, criteria table) was put in an agent file — it belongs in a
     skill.
   - The same method text was not written into more than one agent file — it should be one skill with a
     one-line reminder in each.
4. **ALWAYS confirm the CODE-VOLUME delegation field from Phase B was not left blank and no target was
   silently self-built without a caller-independent justification**, and, for any TEST-FILE row, that the
   delegate named is `grimorio.qa` unless an explicit TDD-exception justification was stated.
5. **WHEN Phase B tiered any node to a same-type Haiku clone (its own Part 2 step 8 TIER call names it) ⟶ run
   this Part's SAME rigor on that node's return, never a lighter pass, PLUS one ADDITIONAL check: confirm every
   choice visible in the clone's actual output traces to an explicit line in the plan Phase B handed it.** A
   judgment call, a resolved ambiguity, or a choice between two valid approaches made by the clone itself is a
   defect, sent back to Phase B, never patched here — full rigor whether the clone's target was a governed file
   (grimorio-conduct rule 20's clone exemption) or an ordinary one, no exception for either. This step IS the
   review Phase B's own Part 2 step 8 already promises exists — kept, not a new obligation invented here.
   **WHEN Phase B dispatched two or more nodes as either SEQUENTIAL or a PANEL ⟶ confirm that choice actually
   matches Phase B's own Part 1 step 4 Independence Test finding for that same target set** (an INTERCONNECTED
   pair dispatched sequentially, an INDEPENDENT pair dispatched as a panel, never the reverse) — a mismatch is a
   defect, sent back to Phase B, never patched here.
6. **ALWAYS run, for every file `grimorio.prompt-writer` returned, TWO SEPARATE Bash invocations —
   `node scripts/audit-chain.mjs --graph-first [filter]` and `node scripts/audit-chain.mjs --examples
   [filter]` — NEVER combined; the script now refuses a combined call outright, exiting 2 and naming both
   flags.** Exit 1 on either is a defect, sent back to Phase B. **WHEN either exits 2 because the filter
   matched zero files ⟶ STOP, name the filter, fix it — never the file, never Phase B — and re-run before
   concluding anything about that file.**
7. **WHEN the diff includes a genuinely NEW agent ⟶ open its BIRTH-HARNESS file directly (run the selftest, or
   read the probe-spec) — never accept the writer's report field as proof on its own. Missing or inadequate ⟶
   defect, sent back.** **WHEN the diff includes a new agent or a charter split ⟶ open the shell's own
   `## Vision` section directly and re-apply
   ref:skill/grimorio.agent-writing/agent-vision.md#the-wiringharness-negative-test independently — confirm
   all six required fields carry real, non-generic content.**
8. **WHEN the diff includes a new durable multi-reader artifact ⟶ open it directly and confirm it now carries
   the ALWAYS/WHEN update rule Phase B decided, naming an owner and a recurring trigger** — never trust the
   writer's own report field alone.
9. **WHEN the artifact under review is a phase-design plan or a quasi-software-view ⟶ demand the evidence of
   what was actually considered (a RENDER/GROUP/MEASURE trace, or a KNOWN-ERRORS-TO-PHASE mapping) and deduce
   omissions from the gap against the complete scope — never close this because it merely "looks complete."**
10. **CHECK, before closing a review touching more than one agent file: did the writer place a passage that
    also belongs in another agent?** If yes, it was skill content, misplaced — send it back.
11. **ALWAYS update whatever index the change affects, or flag it missing** — a memory skill's `project.md`,
    the chain map's hook list, the agent roster.
12. **WHEN a defect is found anywhere above ⟶ it goes BACK to Phase B, never patched here.** WHEN multiple
    independent targets exist ⟶ this check applies PER TARGET; a defective target never blocks a
    already-verified sibling from closing PROVEN.

## Part 2 — ADVERSARIAL REVIEW

**Review placement (per-agent as work completes, vs. once at the end of a fan-out) is the plan author's
decision, made at `grimorio.fan-out`/`grimorio.feature-workflow`'s own routing sections, never this phase's
default.** This phase always gates ONE assembled governance diff. Default absent a deliberate call: do the
work, run the fan-out, THEN run rework cycles through this phase at the end.

1. **ALWAYS raise agent:grimorio.code-reviewer on the FULL diff, never a summary, foreground, passing your own
   agent id** so it can address findings back to you.
2. **ALWAYS declare the reviewer's MODE explicitly: CYCLE 1 ⟶ HUNT (full pass, no accepted-limits list).
   CYCLE 2 (a REWORK re-check) ⟶ FIX-VERIFICATION — hand the PER-FINDING CONTEXT block (original / what
   changed / which finding it closes), never a fresh full diff cold.** This is why a rework cycle no longer
   finds "one more little thing" forever: handed context, the reviewer verifies a claim instead of
   re-discovering the world.
3. **WHEN a REWORK verdict returns ⟶ the defect goes back to Phase B, is re-verified at Part 1 of THIS phase
   again, and only then goes back to `grimorio.code-reviewer` for cycle 2.** Never patch the diff here, never
   re-submit without re-verifying first. **NEVER let the Phase B re-authoring pass touch anything beyond what
   closes the reviewer's own named finding(s).**
4. **ALWAYS CAP adversarial-review gating at TWO cycles, CUMULATIVE across however many separate reviewer
   instances it takes to reach that count — never reset by a fresh instance.** **WHEN cycle 2 also returns
   REWORK ⟶ do NOT raise a third cycle: proceed to Phase D and record the true outcome honestly.** **WHEN every
   remaining finding at the cap is LOW/MEDIUM ⟶ classify it non-blocking debt and ship past it, naming each
   one.** **WHEN any CRITICAL/HIGH finding remains open at the cap ⟶ the cap is NOT liftable — ESCALATE to the
   guardian/CEO, naming the finding verbatim; never ship past it, never let any agent unilaterally decide it is
   acceptable.**

## Hand-off

**WHEN a defect was found ⟶** hand off to Phase B on condition `defect-found`, carrying the specific defect to
fix — no artifact is recorded on this branch, since verification did not come back clean. **WHEN clean ⟶**
record `verification-clean`, then hand off on condition `clean-no-mode` (IMPROVE-AND-VALIDATE MODE not entered)
or `clean-mode-entered` (mode entered, reading
ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-improve-and-validate-mode.md next) —
carrying forward the final disposition and full cycle history either way. Mechanics per Phase 0's own Protocol.
