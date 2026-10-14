# Prompt Writer — Phase 4: FILE STRUCTURE

**IN:** the drafted text. **OUT:** the files on disk and the deliverable below, with every check's exit code.

## Steps

1. **ALWAYS write the files to disk yourself.**
2. **ALWAYS put a phase file's loads and exit conditions in its chain manifest, never in the phase file.**
   Any other file declares its loads in one block, one line per target, each target cited once.
3. **ALWAYS keep a shell to what the agent does and its one behavior entry point.** Everything it does goes in the
   behavior file; **WHEN Phase 2 derived a Vision ⟶ write it as the Vision file in the agent's `design/` folder.**
4. **NEVER write the same method into two files** — extract it to the skill both load and point to it.
5. **WHEN the file defines two or more phases ⟶ size each affected phase**
   (ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split) **and classify each affected node
   REPORT-ONLY or MODIFYING**
   (ref:skill/grimorio.phase-splitting/flow-method.md#rule-8--divide-phases-intelligently-for-delegation--parallelization).
6. **WHEN you add, rename or remove a `##` section in a file that has a `description:` ⟶ update the description.**
7. **WHEN authoring a new agent ⟶ write its birth-harness to disk**, in the shape Phase 2 named.
8. **WHEN the file is an index or ledger several readers consult ⟶ write into it who updates it and when.**
9. **WHEN the change alters what an artifact accepts, requires or enforces ⟶ grep for every site that describes
   the old behavior and update each.**
10. **ALWAYS run these on every file written, one command each:**

    ```
    node .grimorio/scripts/audit-chain.mjs --dead <path-fragment>
    node .grimorio/scripts/audit-chain.mjs --anchors <path-fragment>
    node .grimorio/scripts/audit-chain.mjs --graph-first <path-fragment>
    node .grimorio/scripts/audit-chain.mjs --examples <path-fragment>
    node .grimorio/skills/grimorio.agent-writing/scripts/check-prompt-shape.mjs <file>
    node .grimorio/scripts/check-file-size.mjs --limit 500 <file>
    git diff --stat -- <file>
    ```

    | Result | Do |
    |---|---|
    | exit 0 | write the command and its result in CHECKS |
    | exit 1 | fix the file and re-run; after two retries, stop with the output verbatim |
    | exit 2 | the fragment matched no file: fix the fragment, never the file — not a retry |
    | check-file-size reports OVER | split the file into an index plus topic files, moving content verbatim |
    | `git diff --stat` on a rewrite shows insertions and no deletions | find what the new text replaces, remove it, re-run |

## Deliverable

```
FILES WRITTEN:          <path per file>
LOADS:                  <where declared: chain manifest | one block> — <targets>
VISION WRITTEN:         <path in design/ | "N/A">
DUPLICATION:            <what was extracted, to where | "None">
PHASE SIZING:           <per affected phase: size and REPORT-ONLY | MODIFYING | "N/A — no phases">
DESCRIPTION SYNC:       <updated | "N/A">
BIRTH-HARNESS WRITTEN:  <path | "N/A — not a new agent">
UPDATE RULE:            <written into <file> | "N/A">
OLD-BEHAVIOR SITES:     <sites updated | "N/A">
CHECKS:                 <one line per command: result>
```

Example:

```
FILES WRITTEN:          .grimorio/agents/grimorio.ux/phases/phase-3-review.md
LOADS:                  chain manifest — no new target
VISION WRITTEN:         N/A
DUPLICATION:            None
PHASE SIZING:           phase 3: 61 lines against siblings of 48-70; MODIFYING
DESCRIPTION SYNC:       N/A
BIRTH-HARNESS WRITTEN:  N/A — not a new agent
UPDATE RULE:            N/A
OLD-BEHAVIOR SITES:     N/A
CHECKS:                 --dead 0; --anchors 0; --graph-first 0; --examples 0; shape 0; size 0; diff +9 −14
```
