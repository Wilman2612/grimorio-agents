---
name: working-memory
description: "Shared convention for scratch/working files during a task: write intermediate artifacts to a temporary folder in real time, and consolidate to permanent memory ONLY when the task settles. Load whenever a task produces work-in-progress that isn't final yet — research, investigation, adversarial analysis, multi-step exploration."
---

# Skill: working-memory

**Use when**: a task produces intermediate artifacts that are not yet final — research/investigation,
adversarial analysis, a fan-out that must reach consensus, or any multi-step exploration that needs a
place to think before anything is decided. It is the general case of the ref:skill/feature-workflow#artifact-directory-structure pipeline's
`tmp/features/{slug}/` convention.

---

## The rule

**Working artifacts go to a temporary folder in real time. Permanent memory receives ONLY settled results,
and only once the task is done.**

- **Consolidation is gated on EXPLICIT human approval — never self-certified.** An agent (or the main loop)
  must NOT decide on its own that its conclusion is "settled" and write it to permanent memory. "Settled"
  means *the human approved it*, not that you finished analyzing. Default EVERYTHING to the temporary folder;
  promote to permanent memory only when the human explicitly says to consolidate. When in doubt: `tmp/`.
- While a task is in progress, write notes, drafts, partial findings, and intermediate outputs to a
  **temporary working folder** — never to permanent memory (an agent's `project.md`/`docs`, the repo's
  canonical docs, or a skill's memory).
- Writing half-formed conclusions to permanent memory **poisons future context**: later agents read them as
  current truth and drift. Permanent memory is for what is *settled*, not for what is *being figured out*.
- **Consolidate at the end, not during.** When the task finishes, promote only the settled decisions/findings
  to their permanent home (the owning agent's memory, or the repo). Open questions stay flagged as open —
  never recorded as decided.

## The folder

```
tmp/{task-slug}/          # kebab-case, derived from the task (e.g. tmp/solution-planning/, tmp/redemption-research/)
  <working files>
```

- Use **absolute paths** when reading/writing.
- The folder is **inspectable in real time** — that is its point: work is visible while it happens, without
  committing anything permanent.
- It is **disposable**. Do not rely on it surviving across sessions for anything that matters — that is what
  end-of-task consolidation is for.

## When NOT to use it

- A single settled fact that belongs in permanent memory now → write it there directly (don't stage it).
- The final, blessed output of a task → consolidate it to its permanent home; don't leave the only copy in `tmp/`.

## REPO-FIRST — the repository, not Claude memory (HARD RULE)

*(Moved out of `CLAUDE.md` 2026-07-30. Same axis as the rest of this skill: which store does a piece of
knowledge belong in.)*

**Write knowledge to the REPOSITORY by default.** It is auditable by the CEO and it migrates on clone.

**NEVER write to Claude memory (`~/.claude/projects/.../memory/`) anything that could live in the repo.** That
store is reserved for machine-specific things that must not be committed but must be runnable here — secrets,
local paths, credentials. **NEVER duplicate into memory what already exists in the repo:** memory spends tokens
invisibly on every turn and the CEO cannot audit it.

## `tmp/` is NOT a citable source for a SIGNED decision (HARD RULE — mechanical check)

`tmp/` is scratch and gets pruned in cleanups, **on purpose**. So a signed / ACCEPTED product or architecture
decision that cites a `tmp/` path as its "source of record" is a **custody defect**, not a shortcut — the pointer
outlives the thing it points at, and the substance is gone.

**The check is mechanical, not a reminder to be careful.** Before marking anything ACCEPTED / SIGNED /
"source of record" in a memory skill, the content being signed off must already live in a **repo-tracked file** —
`git ls-files <path>` returns it, or it will the moment the current commit lands.

- If the substance still lives only in `tmp/`, **the harness pass that signs it is not finished.** Migrate the
  substance into the owning memory skill FIRST (the PO's, the architect's, or the librarian's `docs/`), and only
  THEN cite that repo-tracked path.
- A `tmp/` citation is acceptable **only** for a still-open, not-yet-decided working file — never for anything
  already marked accepted or signed.

> This rule was written from a real loss: a signed vision section cited a design document that was never
> git-tracked; a routine cleanup deleted it and it was permanently unrecoverable. The forensic record and the
> reconstruction live in cite:skill/po-memory/docs/1Q-agentic-layer-reconstruction.md.

-> Pipeline instance of this convention (named artifacts per pipeline agent): ref:skill/feature-workflow#artifact-directory-structure skill,
   "Artifact Directory Structure".
-> The adviser's use of this convention: ./adviser-behavior.md.
