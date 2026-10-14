# Devil's Advocate — Phase 2: SPAWN-AND-GATHER

## The question this phase answers

For each lens Phase 1 scoped in, who executes it, briefed how, tiered how, returning what? Nothing else — this
phase does not converge, does not judge the findings, and does not close the task.

## Steps

1. **This phase's graph: a SELF node (build the briefs, tier) fanning
   out into N agent:grimorio.scout nodes, one per Phase 1's own scoped lens, foreground and synchronous.**
2. **You are an ORCHESTRATOR here, not a lone gatherer.** Run the panel as a **FAN-OUT, not one view**: one
   INDEPENDENT sub-agent per perspective, each in clean context so the lenses cannot contaminate each other, then
   YOU synthesize their findings in Phase 3. A single lens — especially your own — is a failure; the team invoked
   you precisely to escape their own vantage point.
3. **Bounded, burn-safe by construction.** **ALWAYS spawn ONLY agent:grimorio.scout grunts** — hard-locked
   non-recursive (`disallowedTools: Agent`), one level deep, no runaway. **NEVER spawn `general-purpose` or any
   recursion-capable agent, and never a Workflow** — match agent:grimorio.scout's own CONTRACT per
   ref:skill/grimorio.agent-selection, never a bare name or area; **WHEN stuck on which agent a lens actually
   needs ⟶ use that skill's own ESCALATION LADDER, never invent an ad hoc choice.**
4. **ALWAYS raise each scout per
   ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate** — its ONE lens
   as the objective + full context + a completion check naming an evidence artifact (a cited rule or concrete
   prior-art, never a self-claim), plus the ref:tmp/ file to append to. A bounded scout gather uses the
   LIGHTWEIGHT form (skip the full guardian watcher), but still finishes synchronously and its return is checked
   against the objective, never its self-report.
5. **ALWAYS tier each scout per ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier** (per-lens
   gathering usually Haiku/Sonnet) — reserve your own reasoning for Phase 3's convergence, never spend it here.
6. **ALWAYS brief every scout to attack where the team is most confident.** Taken-for-granted assumptions hide
   behind expertise — the obvious risks everyone already names are noise; instruct each scout to surface what the
   team did NOT have in front of them, asking *"what would THIS person catch that the team missed?"*, tagged to
   its ONE assigned lens:
   - **The first-time / non-technical user** — what confuses them, what does the plan assume they already know,
     where do they bounce or give up?
   - **The domain expert(s) the team lacks** — the UX/design expert (via the Design Canon), and whichever of
     security / growth / accessibility / ops-cost / legal / support the target touches.
   - **Diverse user types** — the impatient power user, the mobile-only user, the accessibility-dependent user,
     the user arriving from a competitor with different expectations.
   - **The skeptic** — unstated assumptions, "what happens when X", edge/failure cases, "why would anyone
     actually…".
   - **Known-knowns vs unknown-unknowns** — one lens audits the STATED assumptions (are the known-knowns
     actually true?), another hunts what the team doesn't know it doesn't know, a third pressure-tests the
     assumptions once they are delivered.
7. **ALWAYS spawn the scout panel SYNCHRONOUSLY (foreground, `run_in_background: false`) in ONE message — block
   until they all return, then take the ordinary `continue` route in the SAME turn.** Do NOT spawn them in the
   background and end your turn — you would never converge, a real observed failure, never a hypothetical one.
8. **NEVER decide, build, design, or archive.** Restated here, in this phase's own words: dispatching scouts is
   orchestration, never a verdict — a scout brief that quietly asks "which of these matters" instead of "what
   does THIS lens catch" has smuggled a decision into a gather step.

## Conditional loads

- ref:skill/grimorio.agent-selection — narrow: only the concern of matching agent:grimorio.scout's own CONTRACT
  and the ESCALATION LADDER for when you are stuck, step 3's own load; never the whole routing table restated
  here.
- ref:skill/grimorio.fan-out — the panel-as-fan-out mechanics (the PARALLEL half of that method, applied per
  lens).
- ref:skill/grimorio.working-memory + ref:agent/grimorio.scout — the `tmp/` convention + as-you-go
  persistence; the scouts persist to `tmp/` as they go, this phase hands each one the file to append to.
- Domain canon PER ACTIVE LENS, loaded conditionally, only for the lenses Phase 1 actually scoped in, never
  eagerly for all 5: ref:agent/grimorio.ux/memory → "Design Canon" for the UX/design-expert lens,
  ref:agent/grimorio.security/memory for the attacker lens.

## PHASE 2 DELIVERABLE

```
SCOPED LENSES RECEIVED: <the SCOPED LENS LIST carried forward from Phase 1, restated>
SCOUTS SPAWNED:         <N scouts and confirmation the panel was raised foreground/synchronous in ONE message>
TIER PER SCOUT:         <one tier per scout, per step 5>
SCOUT TMP FILES:        <one path per lens, plus confirmation each carries grounded findings per the scout's own
                        completion check>
```
