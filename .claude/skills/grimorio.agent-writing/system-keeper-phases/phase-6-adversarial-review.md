# System Keeper — Phase 6: ADVERSARIAL REVIEW

**NEVER read ref:skill/grimorio.agent-writing/system-keeper-phases/phase-7-close-out-report.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** A close-out report that has not yet been told the reviewer's real verdict has nothing honest to say
about it.

## The question this phase answers

Would an independent adversarial reader find something wrong that the keeper itself is blind to, and is it
fixed within a bounded number of cycles? `grimorio.code-reviewer` is a categorically different actor from
every other phase in this chain — a SEPARATE agent, in a SEPARATE context, whose whole purpose is to not share
the keeper's own assumptions. The failure this phase exists to avoid is bolting "review" onto the work as an
afterthought; the fix is not to skip the phase, it is to make sure it answers its own genuine question against
its own knowledge, which an independent agent's signed verdict does by construction.

## Core Rule 8, restated — the standing boundary, every phase

**NEVER decide anything about your own charter, tier, or scope.** Whatever `grimorio.code-reviewer` finds
about the diff, it never becomes grounds to reshape this agent's own charter or tier here — a finding that
genuinely touches either goes to the CEO as a flag, not to a quiet adjustment in this phase.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: SELF (assemble the full diff) →
   `grimorio.code-reviewer` (spawn, foreground, one node per cycle, up to two) → SELF (read the verdict, route
   per the steps below).** The reviewer node repeats at most once, per the cap in step 5.
2. **ALWAYS raise `agent:grimorio.code-reviewer` on the full governance diff BEFORE it lands, passing this
   agent's own agent id in the brief so the reviewer can address findings back to you.** An ungated governance
   diff can ship a silent false negative into the corpus with nothing adversarial ever reading it. Brief it
   with the FULL diff, never a summary of it — a summary is exactly the framing that narrows an adversarial
   agent's gaze away from what it would otherwise catch.
3. **ALWAYS invoke it in the FOREGROUND, never backgrounded, and never pass `model` without a NAMED reason** —
   the same foreground and never-pass-model discipline Phase 4 already carries for its own spawn, restated
   here because this is a second, separate spawn this chain makes, not a fact this phase can assume it still
   remembers from three files back.
4. **WHEN a REWORK verdict returns ⟶ the defect goes back to
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md, is re-verified independently
   at ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md again, and only then goes back to
   `grimorio.code-reviewer` for a second cycle.** Never patch the diff yourself in this phase and never
   re-submit it to the reviewer without Phase 5 re-verifying it first — a defect fixed without re-verification
   is a guess that it was fixed correctly, not a proof.
5. **ALWAYS CAP adversarial-review gating on this diff at TWO cycles, CUMULATIVE across however many separate
   `grimorio.code-reviewer` instances it takes to reach that count — never reset by raising a fresh reviewer
   instance.** This project's own general REWORK-cycle discipline (ref:skill/grimorio.feature-workflow#rework-cycle)
   already caps a failing agent at two cycles before escalating; this agent's own cap differs in what happens
   NEXT, and that difference is deliberate, stated here in full because the current file names no numeric cap
   anywhere. **NEVER treat a freshly spawned `grimorio.code-reviewer` instance's own self-reported "cycle 1" as
   resetting this phase's own count.** The cycle count is a property of how many times THIS PHASE has gated
   THIS target, tracked by the keeper across the whole gating process — never a property of what any one
   reviewer instance reports about itself; a fresh instance's own first look at the diff still lands on
   whichever cycle the keeper's own running count already says it is. **WHEN this phase's own cumulative count
   reaches its SECOND cycle and that cycle still returns REWORK ⟶ do NOT raise a third cycle, from a fresh
   instance or the same one — proceed to Phase 7 and record the true outcome honestly, rather than escalating
   and waiting, and rather than laundering a lingering REWORK into a false APPROVED.** The harm a
   third-cycle-forever pattern would cause: an adversarial gate that never lets a diff ship no matter how it
   improves is not a stricter gate, it is an unbounded loop wearing a gate's shape, and the governance change
   this chain exists to land never reaches the corpus at all — and a cap that resets on every fresh reviewer
   instance is not a cap at all, it is the same unbounded loop wearing a bounded-looking number. SHIPPING with
   an honestly recorded REWORK is a truthful outcome this rule accepts on purpose; silently reporting APPROVED
   when the reviewer never said so is not.
5a. **WHEN this phase's own cumulative count is AT the cap (its second cycle) AND that cycle's own verdict is
   REWORK ⟶ only a BLOCKING finding — CRITICAL or HIGH severity, in `grimorio.code-reviewer`'s own severity
   vocabulary — ever justifies recording the outcome as a lingering REWORK; classify every LOW or MEDIUM
   finding in that same cycle as non-blocking debt instead, and ship.** Reuse this project's own existing
   triage discipline rather than inventing a second one:
   ref:skill/grimorio.reasoning-principles#measuring-is-not-building--the-bound-on-the-two-sections-below-hard-rule-ceo-2026-07-30's
   own "triage a finding into real+blocking / real+debt / not-our-problem, by WHO PAYS" applies here at full
   force — a LOW/MEDIUM finding this project pays nothing to leave open is real+debt, never a blocker.
   **ALWAYS name each finding classified this way, with what and where, in this phase's own DELIVERABLE
   below** — never fold it silently into a bare "REWORK" line, and never let it change CYCLES RUN or the cap
   itself. The harm: an ungated agent burns real spawn budget re-litigating a narrowing finding past the point
   of returns, on a gate that already has a bounded number of cycles to spend.

## LOAD (JIT) — scoped to this phase only

**D8 note:** this phase carries no mandatory `import:` target — every LOAD line here is `ref:` (lazy), so no
fingerprint applies.

- THIS PHASE'S OWN narrow slice of grimorio.agent-selection/grimorio.agent-tiers: how to brief an adversarial gate with the FULL
  diff, never a summary
  (ref:skill/grimorio.agent-selection#hard-rules-of-invocation-mirrored-as-triggers-in-claudemd--agent-selection); the
  critic-integrity tier-floor rule — a critic's tier is floored at the generator's tier, never lower, and
  `grimorio.code-reviewer` already declares `sonnet` as its own default, which already satisfies the floor
  with `model` omitted (ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on);
  the same foreground/never-pass-model discipline as Phase 4, restated in step 3 above rather than assumed
  still in context. **NEVER import the general escalation ladder here** (Phase 2's own slice) — this phase's
  spawn is always `grimorio.code-reviewer`, never a choice among five signals.
- ref:skill/grimorio.reasoning-principles#measuring-is-not-building--the-bound-on-the-two-sections-below-hard-rule-ceo-2026-07-30 —
  step 5a's own triage discipline (real+blocking / real+debt / not-our-problem, by WHO PAYS), reused here at
  the cap rather than invented fresh.

## PHASE 6 DELIVERABLE — do not read Phase 7 until this is filled

```
CYCLE 1 VERDICT:     <APPROVED / REWORK / ESCALATE, verbatim from the reviewer, plus what it
                     found if not APPROVED>
CYCLE 2 VERDICT:      <same fields — "N/A, cycle 1 was APPROVED" if no second cycle ran>
CYCLES RUN:           <1 or 2, CUMULATIVE for this target across however many separate
                     `grimorio.code-reviewer` instances it took to reach that count — never reset by a
                     fresh spawn, never 3, per step 5>
NON-BLOCKING DEBT AT CAP: <per step 5a — "N/A, cap not reached this pass" / "N/A, the cap cycle's own
                     finding(s) were all CRITICAL/HIGH, none classified as debt" / one line per LOW/MEDIUM
                     finding from the cap cycle classified as non-blocking debt and deferred, naming what
                     and where — kept distinct from whatever was CRITICAL/HIGH and actually got fixed>
FINAL DISPOSITION:    <APPROVED (ship) / SHIPPED WITH RECORDED REWORK (cap reached, reviewer's
                     last verdict was still REWORK after step 5a's own triage, shipped anyway per the cap
                     rule above) — state which, honestly, never softened toward APPROVED>
```

## Hard hand-off

**WHEN this dispatch is operating under IMPROVE-AND-VALIDATE MODE (per ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-improve-and-validate-mode.md, entered at Phase 2) ⟶ do NOT proceed directly to Phase 7 — read that mode file's own VALIDATION step next, carrying forward the
SAME final disposition and cycle history below, and let ITS OWN exit condition determine when Phase 7 is
finally read.**

**WHEN this dispatch is NOT operating under that mode ⟶ ALWAYS read
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-7-close-out-report.md next, carrying forward: the final
disposition above and the full cycle history (both verdicts, not only the last one).** Phase 7 reports the
true outcome to the caller — it does not re-run review and does not relitigate the reviewer's verdict.
