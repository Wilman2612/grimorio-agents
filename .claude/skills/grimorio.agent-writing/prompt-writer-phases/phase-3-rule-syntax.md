# Prompt Writer — Phase 3: RULE SYNTAX

**NEVER read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** FILE STRUCTURE assembles rules into a file; handing it rules
that are not yet individually well-formed just relocates the defect one phase later, where it is harder to
isolate.

## The question this phase answers

Is each individual hard rule I write correctly formed? A genuinely different question from "is the FILE shaped
right" (Phase 4) or "am I avoiding a known authoring mistake" (Phase 5) — three questions a prior, fused
drafting phase in this agent's own history never distinguished, which is exactly why each now owns its own
phase.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — write every rule,
   then re-scan what was written — and nothing else; this agent never invokes another agent, in any phase,
   ever.**
2. **ALWAYS write every hard rule with one of the four openers — ALWAYS / NEVER / BEFORE / WHEN — or the CHECK
   form.** A clause with none of these is not a hard rule; either give it one or write it as knowledge in a
   skill, not as a rule. OPEN
   ref:skill/grimorio.prompt-writing-quality/project.format-guide.md#1-the-rule-form--opener-then--when-the-kind-takes-a-condition
   for the exact syntax every opener is written in — the `⟶` separator, the hard-wrap-on-one-line requirement,
   and the `relation:store/path[#anchor]` reference grammar you'll need for any pointer inside the rule.
3. **WHEN a rule needs an exception, a precondition, or a postcondition that plain ALWAYS/NEVER/BEFORE/WHEN
   can't express cleanly ⟶ open ref:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md and reach for the
   matching word** — UNLESS for an exception inside a rule, GIVEN/ASSUME for a fixed precondition, CONSTRAINTS
   as a grouping heading, UNTIL/ENSURE/VERIFY/FALLBACK for a stopping/validation/routing step, PRIORITIZE/FAVOR/
   IGNORE/EXCLUDE for the heuristic register. **These compose with the four openers from step 2 — they never
   replace them**; a rule still opens with ALWAYS/NEVER/BEFORE/WHEN/CHECK and the extension word sits inside or
   alongside it.
4. **WHEN the artifact concerns model-tier selection for invocations it authors into another agent ⟶ apply
   ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier's scale rather than inventing a tier** — name the
   archetype, name the tier, don't leave "choose wisely" unstated. **N/A on most passes**: this agent is
   hard-locked non-recursive and does not itself invoke other agents, so this step fires only when the CONTENT
   being authored governs a DIFFERENT agent's own tiering decisions.

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- ref:skill/grimorio.prompt-writing-quality/project.format-guide.md#1-the-rule-form--opener-then--when-the-kind-takes-a-condition —
  the exact rule-form syntax.
- ref:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md — the extension vocabulary, whole file (under 200
  lines, no anchor owed).
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — WHEN step 4 above fires, never loaded otherwise.
- **NEVER load file-structure or content-guardrail specifics here** — each is a later phase's own question.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
RULES WRITTEN:           <count, or list — every hard rule drafted this phase>
OPENER CHECK (OWN GATE): <re-scanned every rule above — every one carries ALWAYS/NEVER/BEFORE/WHEN/CHECK, or it
                         was moved to knowledge instead — Y/N, per rule if any failed>
EXTENSION VOCAB USED:    <which words, where, or "None needed this pass">
TIER MENTION:            <N/A, or: archetype named + tier named, per step 4>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md next, carrying forward: the
syntactically-verified rule set above.** Phase 4 assembles these rules into the actual file — it does not
re-derive or re-check their individual form.
