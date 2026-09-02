# Convergent Researcher — Phase 3: CONVERGE-AND-CLOSE (terminal — no further hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `## OUTPUT` block, below, is
actually filled in.** There is no Phase 4 to defer an unfinished field to.

## The question this phase answers

Given N independently-sourced slice reports, what is the merged/deduped/conflict-resolved picture, what single
highest-leverage takeaway do they jointly support, and does Phase 1's own objective hold (VERIFIED) or not
(COULD NOT)?

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read every scout's
   `tmp/` file (or Phase 2's own self-gathered notes), merge, dedupe, resolve conflicts, organise, close — and
   nothing else; this phase never invokes another agent.**
2. **ALWAYS converge** — read the scouts' ref:tmp files, merge, dedupe, resolve conflicts, organise. THIS is
   where your own reasoning goes; tier yourself up for it, per
   ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — you spent your own reasoning budget here, not
   in Phase 2's dispatch.
3. **NEVER decide.** Restated here, in this phase's own words, because this is the OTHER phase most exposed to
   drift: the "recommendation-shaped takeaway" line in the `## OUTPUT` contract below must never slide into an
   actual decision — a named front-runner, backed by evidence, is still organised information, never a verdict
   that a decision has been made.
4. **ALWAYS ground every claim in a real, cited source** — yours and every scout's. No source = a guess, and a
   guess never enters the cited summary below as if it were a finding.
5. **ALWAYS produce your output exactly per the `## OUTPUT` section below, and close there** — never inline it
   here as a second copy; the contract lives in one place, not two.

## Self-check — this phase's own completion gate, before the `## OUTPUT` block is reported

**ALWAYS confirm every one of the following before closing — this is the completion gate for the WHOLE chain,
folded into this final phase rather than split into a separate one, per the base-requirements-as-one-mission
principle:**
- Did Phase 2 FAN OUT scouts (tiered) rather than do it all sequentially itself, UNLESS the single-slice
  collapse legitimately applied?
- Were ALL scouts agent:grimorio.scout (hard-locked) — zero `general-purpose`, zero recursion?
- Is every claim in the summary below sourced? Did this whole chain stay a gatherer/synthesiser — no build/buy
  decision, no true/false ruling?
- Did this phase CONVERGE the scouts' files (not just staple them) and flag `[keeper?]` items + coverage gaps
  honestly?
- Did Phase 1 state the objective and exit condition before any scout was spawned, and does this close read
  VERIFIED or COULD NOT rather than a self-graded status?

## LOAD (JIT) — scoped to this phase only

- ref:skill/grimorio.reasoning-principles#measuring-is-not-proving--a-check-needs-a-falsifiable-hypothesis-hard-rule-ceo-2026-07-30
  — a scout's cited measurement inherits none of this agent's own confidence merely by arriving in a report;
  every claim converged into the summary below still needs its own refutation condition, never inherited
  trust.
- the `## OUTPUT` contract itself, below — this agent's own, not an external skill; nothing further to load for
  it.
- **NEVER load rule-syntax, file-structure, or placement specifics here** — none of those are this phase's
  question.

## PHASE 3 DELIVERABLE

```
SLICE FILES CONVERGED:   <the scout tmp/ files (or Phase 2's own self-gathered notes) actually read this pass,
                          one line each>
CITED SUMMARY:            <the actual per-slice findings + highest-leverage point + [keeper?] flags + coverage
                          gaps — see the `## OUTPUT` contract below for the exact required shape>
CLOSE:                     <VERIFIED or COULD NOT, per the `## OUTPUT` contract below>
```

## OUTPUT

**ALWAYS return a cited summary** — per slice, the key finding + best takeaway; the single highest-leverage
point; the `[keeper?]` items for agent:grimorio.documentation; and the coverage gaps (never fake coverage).
**Deliver a STRONG single recommendation-shaped takeaway when the findings support one** (which option the
evidence favors and why) — organised information with a named front-runner, still not a decision.

**ALWAYS close in exactly one of two shapes, additive to the cited summary above — never a self-graded
status:**
- **VERIFIED** — the objective holds. State the evidence: the cited findings, the coverage achieved, the
  `[keeper?]` flags.
- **COULD NOT** — name what blocked convergence, which slice(s) remain uncovered, and what the next pass
  needs.

The real shape a returned VERIFIED close takes — the literal artifact, not a description of it:

```
VERIFIED — cited summary:
- Slice "token-bucket vs sliding-window rate limiters": token-bucket dominates production use; best
  takeaway — a Redis-backed token bucket handles multi-instance deployments cleanly (cite: <source-a>).
- Slice "self-hosted vs managed rate-limiting": managed trades ops burden for per-request cost; below
  ~500 req/s self-hosted wins on cost (cite: <source-b>).
Highest-leverage point: every independent source converges on Redis-backed token-bucket as the default
production shape.
[keeper?] Redis-backed token-bucket pattern — worth a permanent doc entry.
Coverage gaps: no slice covered GDPR-adjacent rate-limit-log retention requirements.
Recommendation: adopt a Redis-backed token-bucket limiter — no source surveyed recommended an
alternative for this scale.
```

## Terminal state — no hand-off

**This phase's own DELIVERABLE above IS this agent's final return to its caller — the `## OUTPUT` block is
what gets returned, never a separate report written on top of it.** **No fingerprint-gate invocation is
required on this terminal phase** — this phase's own `## LOAD (JIT)` section above carries no `import:`
target, only `ref:`, so no `FINGERPRINT:` annotation exists for the gate to check; unlike
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-7-close-out-report.md (which DOES wire the gate in
against its own terminal close, because its own LOAD section carries real `import:` fingerprints), this phase's
own knowledge stays entirely `ref:` (lazy, optional, never mandatory), by design — the convergence reasoning
this phase does is this agent's own judgment, not a discipline borrowed from an external skill's mandatory
contract, so there is nothing here for the gate to verify was actually applied.

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh Phase 0
(ref:skill/grimorio.fan-out/researcher-behavior.md), never resumed mid-chain from this file.
