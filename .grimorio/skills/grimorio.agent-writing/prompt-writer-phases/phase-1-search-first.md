# Prompt Writer — Phase 1: SEARCH-FIRST

**NEVER read Phase 2 until this phase's deliverable is filled.**

This phase establishes three facts: what was asked, what the target files say now, and what precedent exists. It
chooses no level, no form, and drafts nothing.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **ALWAYS read the spec in full and hold it verbatim.** WHEN it reads as a compressed summary rather than the
   principal's own words ⟶ record that as a finding; never fill its gaps yourself.
3. **ALWAYS open every target file in full before forming a view of it.**
4. **WHEN the task rewrites or audits an existing file ⟶ run every audit lens of
   ref:skill/grimorio.prompt-writing-quality#audit-lenses on the current file before anything is drafted.**
5. **ALWAYS look for precedent of two kinds** — an artifact of the same TYPE (a comparable shell, behavior file,
   skill), and a prior instance of the same SOLUTION shape (ref:skill/grimorio.reasoning-principles/exemplar-grounding.md).
   WHEN either does not exist ⟶ say so.
6. **WHEN the spec describes a script, a mechanism, or the line between what a script computes and what a model
   judges ⟶ apply the USES and LIMITS lists of ref:skill/grimorio.agent-writing/symbiosis-doctrine.md and name
   the entries that apply.**
7. **WHEN the spec repeats one fully decided change across several files ⟶ record a MECHANICAL-VOLUME finding.**
   Only the keeper may raise a Haiku clone for it.
8. **WHEN the spec cannot be written to standard ⟶ refuse here.**

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
SPEC HELD VERBATIM:        <first and last line of the spec, quoted>
SPEC QUALITY FINDING:      <"compressed summary: <what is missing>" | "None">
TARGET FILE(S) READ:       <one line per file: path, read in full>
REWRITE OR FRESH:          <REWRITE + one line per audit lens, "None" where clean | FRESH>
PRECEDENT:                 <type precedent and solution exemplar, each a pointer or "None found">
SYMBIOSIS ENTRIES:         <entries that apply | "N/A — no script/model boundary">
MECHANICAL-VOLUME FINDING: <the repeated change and its files | "None">
CORE RULE CHECK:           <REFUSED: <why> | writable, proceeding>
```

Example of a filled block:

```
SPEC HELD VERBATIM:        "Add a rule: the reviewer must quote the line it flags." … "Land it in its behavior file."
SPEC QUALITY FINDING:      None
TARGET FILE(S) READ:       .grimorio/agents/grimorio.ux/behavior.md, read in full
REWRITE OR FRESH:          REWRITE — L1 None; L4 two checklists cover contrast; L7 history paragraph in Steps; others None
PRECEDENT:                 type: grimorio.code-reviewer behavior.md; exemplar: code-reviewer's quote-the-line rule
SYMBIOSIS ENTRIES:         N/A — no script/model boundary
MECHANICAL-VOLUME FINDING: None
CORE RULE CHECK:           writable, proceeding
```

## Hard hand-off

**WHEN the core rule check did not refuse ⟶ run `next --run <id> --on continue`, carrying the verbatim spec, the
targets' content and any lens findings into Phase 2. WHEN it refused ⟶ run `next --run <id> --on refused`.**
