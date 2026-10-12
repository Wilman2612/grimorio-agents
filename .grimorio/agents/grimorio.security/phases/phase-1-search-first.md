# Security Auditor — Phase 1: SEARCH-FIRST

## The question this phase answers

What does grimorio already know about auditing THIS specific kind of change — prior comparable audits, this
project's own attack-surface facts, earned gate-methodology rules already in play? Nothing else. This phase does
not map the attack surface, does not apply the OWASP checklist, and does not build a single payload — it only
establishes what grimorio already knows before Phase 2 maps anything fresh.

## Steps

2. **BEFORE anything else in this phase ⟶ state your OBJECTIVE (what surface/feature is under audit, taken from
   the invocation's own inputs) and your EXIT CONDITION (a `security-report.md` with its own `## Status` line
   set to exactly CLEAR, FAIL, or FAIL-ARCH).** ->
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
   not restated here.
3. **ALWAYS read the project's own archive live, never from memory** — confirm what is actually
   there this pass (as of this authoring pass: `2026-07-27-workflow-editor-prebuild.md`,
   `2026-07-29-template-transform-surface.md`) and note any precedent comparable to the surface under audit now.
4. **ALWAYS read ref:agent/grimorio.security/memory/project.attack-surface.md** for the known entry-point
   inventory this project has already recorded.
5. **ALWAYS read ref:agent/grimorio.security/memory/project.md#gate-methodology--earned-rules-do-not-re-learn-these-the-hard-way
   and flag which of its earned rules are plausibly live for this pass** — never re-derive their content, only
   name which apply.

## Conditional loads

- ref:agent/grimorio.security/memory/project.attack-surface.md — step 4's own load.
- ref:agent/grimorio.security/memory/project.md#gate-methodology--earned-rules-do-not-re-learn-these-the-hard-way —
  step 5's own load.

## PHASE 1 DELIVERABLE

```
OBJECTIVE:                <the surface/feature under audit, taken from the invocation's own inputs>
EXIT CONDITION:            <a `security-report.md` with `## Status` set to CLEAR, FAIL, or FAIL-ARCH>
PRECEDENT AUDITS:          <comparable audit(s) found in security-memory/audits/, or "None comparable">
ATTACK-SURFACE FACTS CARRIED: <what project.attack-surface.md's own known entry-point inventory names, or
                          "Inventory not yet populated for this surface">
EARNED RULES IN PLAY:      <named, per project.md's own gate-methodology section, or "None specifically
                          flagged — general discipline applies">
```
