# Prompt Writer — Phase 4: FILE STRUCTURE

**NEVER read Phase 5 until this phase's deliverable is filled.** This phase assembles the drafted text into files,
writes them, and runs the deterministic checks.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **ALWAYS write the file(s) to disk yourself.**
3. **ALWAYS declare loads once.** A phase file's loads go in its chain manifest, never in a LOAD section of the
   file; any other file declares them in one block, one line per target. Cite each target once per file.
   **NEVER reference a design document from a prompt.**
4. **ALWAYS keep a shell to identity, boundaries and one behavior entry point.** Everything the agent does lives in
   its behavior file; its Vision and other design material live in the agent's `design/` folder. **NEVER split a
   shell into companion files.**
5. **WHEN a skill file passes ~500 lines ⟶ split it into an index plus topic files, moving content verbatim.**
   Keep it whole only when it is the smallest unit a reader needs in one place, and say so.
6. **WHEN the file defines two or more phases ⟶ size each affected phase**
   (ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split) and split or flag an overloaded
   one; **classify each affected node REPORT-ONLY or MODIFYING**
   (ref:skill/grimorio.phase-splitting/flow-method.md#rule-8--divide-phases-intelligently-for-delegation--parallelization).
7. **NEVER write the same method into two files** — extract it to the skill both already load and point to it.
8. **WHEN you add, rename or remove a `##` section in a file that has a `description:` ⟶ update the description.**
9. **WHEN authoring a new agent ⟶ write its birth-harness to disk in this pass**, in the shape Phase 2 named.
10. **WHEN the file is a durable artifact several readers consult — an index, a ledger ⟶ write into it a rule naming
    its owner and when it is updated.**
11. **WHEN the change alters a contract — what an artifact accepts, requires or enforces ⟶ grep for every site that
    describes the old contract and reconcile each one in this pass.**
12. **ALWAYS run, for each file written, each check below as its own command, and act on the exit code:**

    ```
    node .grimorio/scripts/audit-chain.mjs --dead <path-fragment>
    node .grimorio/scripts/audit-chain.mjs --anchors <path-fragment>
    node .grimorio/scripts/audit-chain.mjs --graph-first <path-fragment>
    node .grimorio/scripts/audit-chain.mjs --examples <path-fragment>
    node .grimorio/skills/grimorio.agent-writing/scripts/check-prompt-shape.mjs <file>
    ```

    | Exit | Meaning | Do |
    |---|---|---|
    | 0 | clean | record the command and its result |
    | 1 | a violation in the file | fix the file and re-run; after 2 retries, stop and report the output verbatim |
    | 2 | the fragment matched no file | fix the fragment, never the file; this is not a retry |

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
FILES WRITTEN:          <path per file>
LOADS:                  <where declared: chain manifest | one block> — <targets>
SHELL PURITY:           <"identity, boundaries, entry point only" | what moved out, and where | "N/A — no shell">
SIZE:                   <lines per skill file; SPLIT | WHOLE: <reason> | under limit>
PHASE SIZING:           <per affected phase: size and REPORT-ONLY | MODIFYING | "N/A — no phases">
DUPLICATION:            <what was extracted, to where | "None">
DESCRIPTION SYNC:       <updated | "N/A">
BIRTH-HARNESS WRITTEN:  <path | "N/A — not a new agent">
UPDATE RULE:            <written into <file> | "N/A">
CONTRACT SITES:         <sites reconciled | "N/A — no contract change">
CHECKS:                 <one line per command: exit code>
```

Example of a filled block:

```
FILES WRITTEN:          .grimorio/agents/grimorio.ux/phases/phase-3-review.md
LOADS:                  chain manifest — no new target
SHELL PURITY:           N/A — no shell
SIZE:                   under limit
PHASE SIZING:           phase 3: 61 lines against siblings of 48-70; MODIFYING
DUPLICATION:            None
DESCRIPTION SYNC:       N/A
BIRTH-HARNESS WRITTEN:  N/A — not a new agent
UPDATE RULE:            N/A
CONTRACT SITES:         N/A — no contract change
CHECKS:                 --dead 0; --anchors 0; --graph-first 0; --examples 0; check-prompt-shape 0
```

## Hard hand-off

**ALWAYS run `next --run <id> --on always`, carrying the files written and the check results into Phase 5.**
