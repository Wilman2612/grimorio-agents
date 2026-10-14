# Prompt Writer — Phase 1: SEARCH-FIRST

**IN:** the keeper's brief. **OUT:** the deliverable below.

## Steps

1. **ALWAYS read the spec in full and hold it verbatim.** WHEN it reads as a compressed summary rather than the
   principal's own words ⟶ write that in SPEC QUALITY FINDING and never fill its gaps yourself.
2. **ALWAYS open every target file in full** — every line, not the first page the read tool returns.
3. **WHEN the task rewrites or audits an existing file ⟶ run every audit lens of
   ref:skill/grimorio.prompt-writing-quality#audit-lenses on the current file.**
4. **ALWAYS look for precedent of two kinds:** an artifact of the same TYPE (a comparable shell, behavior file,
   skill), and a prior instance of the same SOLUTION shape (ref:skill/grimorio.reasoning-principles/exemplar-grounding.md).
   **WHEN the precedent spans more than five files ⟶ you MAY raise one Haiku-tier `agent:grimorio.scout`** with
   the file list and the fields to report; it reads and reports, and drafts nothing.
5. **WHEN the spec describes a script, a mechanism, or the line between what a script computes and what a model
   judges ⟶ apply the USES and LIMITS of ref:skill/grimorio.agent-writing/symbiosis-doctrine.md and name the
   entries that apply.**
6. **WHEN the spec repeats one fully decided change across several files ⟶ write a MECHANICAL-VOLUME finding** —
   the keeper alone decides whether to raise a Haiku clone for it.
7. **WHEN the spec lacks content you would have to invent, names no reader, or asks you to compress the
   principal's words ⟶ write REFUSED and why in CORE RULE CHECK.**

## Deliverable

```
SPEC HELD VERBATIM:        <first and last line of the spec, quoted>
SPEC QUALITY FINDING:      <"compressed summary: <what is missing>" | "None">
TARGET FILE(S) READ:       <one line per file: path, line count read>
REWRITE OR FRESH:          <REWRITE + one line per audit lens, "None" where clean | FRESH>
PRECEDENT:                 <type precedent and solution exemplar, each a pointer or "None found">
SYMBIOSIS ENTRIES:         <entries that apply | "N/A — no script/model boundary">
MECHANICAL-VOLUME FINDING: <the repeated change and its files | "None">
CORE RULE CHECK:           <REFUSED: <why> | writable>
```

Example:

```
SPEC HELD VERBATIM:        "Add a rule: the reviewer must quote the line it flags." … "Land it in its behavior file."
SPEC QUALITY FINDING:      None
TARGET FILE(S) READ:       .grimorio/agents/grimorio.ux/behavior.md, 142 of 142 lines
REWRITE OR FRESH:          REWRITE — L4 two checklists cover contrast; L10 dated incident in step 3; others None
PRECEDENT:                 type: code-reviewer behavior.md; exemplar: code-reviewer's quote-the-line rule
SYMBIOSIS ENTRIES:         N/A — no script/model boundary
MECHANICAL-VOLUME FINDING: None
CORE RULE CHECK:           writable
```

## Hand-off

**WHEN CORE RULE CHECK reads REFUSED ⟶ `--on refused`; otherwise `--on continue`.**
