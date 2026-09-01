# Design Orchestrator — Phase 7: PLACE & REPORT (terminal — no hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `## OUTPUT` block, below, is
actually filled in.** There is no Phase 8 to defer an unfinished field to.

## The question this phase answers

Where does this design live, and what does the reader need to know? Groups placement + the write + the
refusals + the report as ONE cognitive mission — a human author thinks of "hand over the finished, correctly-
shaped deliverable" as one sitting, not several separate errands.

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** Placing and reporting a finished design is
this phase's whole job; a placement question that turns out to be genuinely ambiguous is escalated per the
rule below, never resolved by this phase quietly deciding it should now own product-placement authority it
does not have.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — decide the location,
   write the design deliverable(s), report — with an optional escalation node (step 3 below) only WHEN
   genuinely warranted; and nothing else.**
2. **ALWAYS structure the `design.md` deliverable's own location by PLATFORM vs GAMES: reusable-across-every-game
   design under `.claude/skills/grimorio.system-design/designs/platform/`, design specific to one game under
   `.claude/skills/grimorio.system-design/designs/<game>/`** — this agent's own design artifacts are ITS OWN memory (CEO
   ruling, 2026-08-20), never the top-level `designs/` folder, which is slated for deletion and no longer
   governs where this agent writes. **NEVER invent a third location, and NEVER open a rival documentation home
   beside it.**
3. **WHEN the platform-vs-game separation is derivable from step 2's own criterion above — reusable across every
   game vs specific to one game ⟶ use it, no escalation.** **WHEN nothing exists to grab onto, or the separation
   is genuinely too ambiguous to derive from that criterion ⟶ escalate for a human-in-the-loop decision.** This
   agent has no direct CEO channel — it is not agent:grimorio.po — so route it the same way the blocker rule
   below already routes a genuine blocker, per import:skill/grimorio.agent-selection's own ladder. **The DEFAULT path is
   always derive-from-the-criterion; escalation is the exception for genuine ambiguity, never a step run "to be
   safe" on every design.**
4. **Write the design deliverable(s) at the decided location — either `design.md` alone, or the family of
   files Phase 6 converged to.** **NEVER produce an HTML file yourself** — rendering to HTML is
   agent:grimorio.design-redactor's job, a wholly separate later step this agent never performs.
5. **NEVER build the feature this design describes.** This agent produces documentation, never code.
6. **NEVER write or scope an executive summary, at any length or fidelity.** ->
   ref:skill/grimorio.system-design#shared-rule--executive-summary-is-out-of-scope for the canonical statement and its
   proper CEO attribution — don't expect a second copy of it here. WHEN a design surfaces material that looks
   like it wants one ⟶ flag it as a named future need in the report below; never attempt it yourself.
7. **WHEN you hit a genuine blocker mid-design — a missing prerequisite, a contradiction between
   this project's own designs catalog and the live code — OR a design about to be finalized unchallenged ⟶ escalate per
   import:skill/grimorio.agent-selection's own ESCALATION LADDER (one concrete blocker ⟶ agent:grimorio.unblocker; a
   design about to finalize unchallenged ⟶ agent:grimorio.entropy) rather than guessing past it.** **ALWAYS
   raise either in the FOREGROUND and wait on it directly**, per ref:skill/grimorio.conduct#spawning-an-agent,
   rule 9c(3). **WHEN raising either agent per this step ⟶ NEVER pass `model` without a NAMED reason, and NEVER
   tier either below `sonnet`** — mirroring `grimorio.system-keeper`'s own critic-integrity tier-floor
   discipline (ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md's own step 3 and LOAD
   section, itself grounded in ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on
   — a reviewing agent's tier is floored at the generator's tier, never lower): `agent:grimorio.unblocker`
   already declares `sonnet` and `agent:grimorio.entropy` already declares `opus` as their own defaults, so the
   floor is already satisfied with `model` omitted — a genuine adversarial or verification-shaped spawn from
   this chain is never quietly run on a cheaper tier than the work it is reviewing.
8. **ALWAYS report, additive to nothing already written into the deliverable(s) itself:** the objective and exit
   condition, per
   import:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11;
   TWO DISTINCT facts about Phase 6's own gate, never collapsed into one bare line — which of the OLD 8-check
   gate's checks passed vs N/A-with-reason, AND Phase 6's own CLOSURE TABLE EXIT-vs-LOOP-BACK result (the
   actual current exit condition — Phase 7 is reached only on EXIT, so state that explicitly rather than
   leaving it implied by having reached this phase at all); a VERIFIED/COULD-NOT close.

## LOAD (JIT) — scoped to this phase only

- **No load needed for the platform-vs-game split** — the criterion is now stated INLINE in step 2 above, not
  deferred to an external index file.
- import:skill/grimorio.agent-selection — the escalation-ladder slice ONLY, steps 3 and 7 above. **NEVER re-import the
  scout-raise slice here** — that was Phase 1's own, already spent.
- import:skill/grimorio.reasoning-principles — the objective/exit-condition/VERIFIED-COULD-NOT contract, step 8's load.

## OUTPUT

```
LOCATION DECIDED:          <.claude/skills/grimorio.system-design/designs/platform/ or
                           .claude/skills/grimorio.system-design/designs/<game>/ — never a third location; DERIVED
                           from step 2's own criterion, or ESCALATED per step 3, state which>
ESCALATION RAISED:          <"Not needed — derived from step 2's own platform-vs-game criterion" / "Yes —
                            agent:grimorio.unblocker or agent:grimorio.entropy, what it returned,
                            foreground-confirmed, tier-floor confirmed (model omitted, or a NAMED reason
                            given for any departure, never below sonnet)">
DELIVERABLE FILE(S) WRITTEN: <confirm every file exists at the decided location — `design.md` alone, or every
                            file in the family Phase 6 converged to>
NEVER-HTML CONFIRMED:       <confirm no HTML file was produced by this agent>
NEVER-EXEC-SUMMARY:          <confirm none was written; named as a future need if material surfaced
                            wanting one, "None" otherwise>
GATE CHECKS (from Phase 6): <TWO distinct facts, never one collapsed line — (1) the OLD 8-check gate: which
                            of the reconciled 8 checks passed vs N/A-with-reason; (2) the CLOSURE TABLE: EXIT
                            confirmed (every row held all 5 gates — always true here, since Phase 7 is only
                            reached on Phase 6's own EXIT decision, restated explicitly rather than left
                            implied) — both restated for a reader who has not seen Phase 6's own file>
OBJECTIVE:                  <what was actually asked>
EXIT CONDITION:              <the checkable state that means it holds>
CLOSE:                       <VERIFIED, naming which evidence backs which claim — or COULD NOT,
                            naming what is still open, why, and what the next pass needs>
```

## Terminal state — no hand-off

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh Phase 0
(ref:skill/grimorio.system-design/design-orchestrator-behavior.md), never resumed mid-chain from this file.
