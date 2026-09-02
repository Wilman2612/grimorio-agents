# Security Auditor — Phase 1: SEARCH-FIRST

**NEVER read ref:skill/grimorio.security-memory/security-phases/phase-2-map-attack-surface.md until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Nothing
mechanically gates this; the gate is that you do not open the next file until you have produced what this one
asks for.

## The question this phase answers

What does grimorio already know about auditing THIS specific kind of change — prior comparable audits, this
project's own attack-surface facts, earned gate-methodology rules already in play? Nothing else. This phase does
not map the attack surface, does not apply the OWASP checklist, and does not build a single payload — it only
establishes what grimorio already knows before Phase 2 maps anything fresh.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read precedent, read
   attack-surface facts, read earned rules — and nothing else; this agent never invokes another agent, in any
   phase, ever** (Phase 0's own HARD-LOCKED statement, restated here as this phase's own graph fact).
2. **BEFORE anything else in this phase ⟶ state your OBJECTIVE (what surface/feature is under audit, taken from
   the invocation's own inputs) and your EXIT CONDITION (a `security-report.md` with its own `## Status` line
   set to exactly CLEAR, FAIL, or FAIL-ARCH).** ->
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
   not restated here.
3. **ALWAYS read this project's own audit archive live, never from memory** — confirm what is actually
   there this pass and note any precedent comparable to the surface under audit now.
4. **ALWAYS read this project's own attack-surface record** for the known entry-point
   inventory this project has already recorded.
5. **ALWAYS read this project's own security memory (its own "Gate methodology — earned rules" section)
   and flag which of its earned rules are plausibly live for this pass** — never re-derive their content, only
   name which apply.
6. **ALWAYS confirm, explicitly, that this agent never spawns** — the CHILDREN relationship is trivially
   satisfied, restated here as this phase's own step rather than assumed carried from Phase 0 alone.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — specifically its objective/exit-condition contract,
  ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION fields below (a real objective/exit-condition pair cannot be produced
  without applying this discipline).
- import:skill/grimorio.working-memory — the `tmp/` convention for any intermediate/scratch artifact a later
  phase produces before the terminal `security-report.md`, loaded ONCE here for the whole chain.
- this project's own audit archive — read live, never from memory, step 3's own load.
- this project's own attack-surface record — step 4's own load.
- this project's own security memory (its own "Gate methodology — earned rules" section) —
  step 5's own load.
- **NEVER load the OWASP checklist, the payload format, the auth-bypass vectors, or `grimorio.development-patterns`
  here** — none of those are this phase's question; each belongs to a later phase alone.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                <the surface/feature under audit, taken from the invocation's own inputs>
EXIT CONDITION:            <a `security-report.md` with `## Status` set to CLEAR, FAIL, or FAIL-ARCH>
PRECEDENT AUDITS:          <comparable audit(s) found in security-memory/audits/, or "None comparable">
ATTACK-SURFACE FACTS CARRIED: <what project.attack-surface.md's own known entry-point inventory names, or
                          "Inventory not yet populated for this surface">
EARNED RULES IN PLAY:      <named, per project.md's own gate-methodology section, or "None specifically
                          flagged — general discipline applies">
CHILDREN CONFIRMATION:     <this agent never spawns — confirmed>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.security-memory/security-phases/phase-2-map-attack-surface.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.security-memory/security-phases/phase-1-search-first.md`) and this phase's own
filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now runs
on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.reasoning-principles` carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.security-memory/security-phases/phase-2-map-attack-surface.md next, carrying
forward: the OBJECTIVE and EXIT CONDITION stated above, the precedent, the attack-surface facts, and the earned
rules in play.** Phase 2 consumes all of it — it does not re-derive any of it.
