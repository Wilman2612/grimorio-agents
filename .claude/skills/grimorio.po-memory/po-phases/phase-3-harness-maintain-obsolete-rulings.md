# Product Owner — Phase 3: HARNESS — MAINTAIN OBSOLETE RULINGS (H3)

**This phase is TERMINAL for the Harness chain — no Phase 4 file to gate against.** Instead, **VERIFIED/COULD
NOT closure (in the `## OUTPUT` section below) does not fire until this phase's own DELIVERABLE
block is filled.**

## The question this phase answers

Does this new entry make some OTHER, elsewhere ruling in the corpus stale — and if so, is it updated in the
SAME pass?

## Standing boundary, restated

**NEVER decide anything about PO's own charter, tier, or scope.** That is the CEO's call alone, unaffected by
what this phase's own sweep finds.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: SELF (sweep the corpus) — OPTIONAL
   agent:grimorio.scout node, WHEN the sweep needs more than a direct grep — SELF (update + close).** Name
   explicitly whether the scout node fires this pass or not.
2. **ALWAYS sweep for any earlier ruling this entry makes wrong; update it in the SAME pass** — maintenance is
   PO's job, not the user's to request.
3. **WHEN the sweep needs more than a direct grep ⟶ MAY raise ONE bounded, optional agent:grimorio.scout,
   tiered per grimorio.agent-tiers (never Opus for a grunt)**, per PO's own Knowledge imports (agent-selection,
   fan-out, flow-delegation, agent-tiers) — never as a requirement, never mandatory.

### Maintenance is PO's job, not the user's to request

**WHEN a vision or decision entry makes an earlier ruling elsewhere in a memory file obsolete ⟶ update the
obsolete ruling in the SAME pass that records the new one, without waiting to be asked.** Worked, invented
example in a domain unrelated to this project's own: a review-app's memory file states "guest checkout is
never allowed"; once a later ruling permits guest checkout under a spending cap, the forbid-guest-checkout
entry is stale the instant the new ruling lands — it gets rewritten in the same pass, not left for someone
downstream to trip over the contradiction. -> This project's own real-world instance of this exact rule, in
the CEO's own words, naming the actual product ruling it overturned:
this project's own product memory (its own "Maintenance — worked instance" section)
— preserved there, not restated here.

## OUTPUT

The updated memory file(s) themselves — no fixed template; the diff is the deliverable. Report which file(s)
changed and, in one line, why. Close **VERIFIED** (naming what the memory file now says) or **COULD NOT**
(naming the blocker). The report itself always follows this shape:

```
File(s) changed: {memory-file-path}
Why: recorded the settled decision that {feature} now supports {new-scope}, superseding the earlier
"{feature} is out of scope for v1" line.
Close: VERIFIED — {memory-file-path} now states the {new-scope} decision under "{section}", the prior
out-of-scope line was DELETED as an obvious superseded fact, and no obsolete ruling elsewhere still contradicts
it.
```

## Self-check gate (Harness chain) — BEFORE closing VERIFIED

**BEFORE reporting VERIFIED ⟶ confirm, explicitly and separately:** objective and exit condition were actually
stated before the memory file was touched, not asserted after the fact (H1 step 2, catches skipping Phase 0's
Core rule 1); the captured decision/vision statement was routed to the file its own kind requires — a settled
decision never lands in a vision file, and vice versa (H1 step 4, catches misrouting); the custody check
actually ran — a real `git ls-files` invocation against every cited source — before anything was marked
SIGNED/ACCEPTED/DECIDED (H2 step 2, catches an unverified citation); Currency was resolved the same session,
with no superseded fact left sitting beside its replacement, and any escalation was a genuine ambiguity rather
than a guess dressed as one (H2 step 4, catches silent staleness or a disguised guess); every obsolete ruling
the new entry makes wrong was updated in the same pass (this phase's own step 2, catches a missed maintenance
update); the updated file reads as the CURRENT truth top to bottom, not merely appended to (catches append-only
drift). Any one of these left unconfirmed means the close is an unearned VERIFIED, never a real one.

## LOAD (JIT) — scoped to this phase only

- The Maintenance rule above (inline, no external load) — plus, WHEN step 3 actually fires, THIS PHASE'S OWN
  narrow scout-raise slice: agent-selection/agent-tiers, hard-locked non-recursive, tiered, never Opus for a
  grunt.

## PHASE 3 DELIVERABLE — this IS the chain's own terminal output, filled before closing

```
SWEEP PERFORMED:                  <what was checked>
SCOUT RAISED:                     <yes/no — what it found, or "not needed">
OBSOLETE RULINGS UPDATED:         <every one, or "none found — stated plainly">

SELF-CHECK GATE, confirmed/not, one line each:
  OBJECTIVE/EXIT STATED FIRST (H1 step 2):        <confirm, or name the gap>
  ROUTED TO THE RIGHT FILE (H1 step 4):            <confirm, or name the gap>
  CUSTODY CHECK RAN BEFORE SIGNED (H2 step 2):     <confirm, or name the gap>
  CURRENCY RESOLVED, NO SUPERSEDED FACT LEFT
  (H2 step 4):                                     <confirm, or name the gap>
  EVERY OBSOLETE RULING UPDATED (this phase's
  own step 2):                                     <confirm, or name the gap>
  FILE READS AS CURRENT TRUTH, NOT MERELY
  APPENDED TO:                                     <confirm, or name the gap>

CLOSE:                             <VERIFIED (naming what the memory file now says) or COULD NOT (naming the
                                   blocker)>
```

## Terminal state — no hand-off

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh
Phase 0 (ref:skill/grimorio.po-memory/behavior.md), never resumed mid-chain from this file.
