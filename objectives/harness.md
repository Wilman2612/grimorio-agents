# `objectives/harness.md` — git-side marker only, not the methodology

This file is no longer where the branch-objective methodology is documented. It is now ONLY the marker
`obj_methodology_present()` (`.grimorio/skills/grimorio.objective-harness/scripts/objective-lib.sh`) checks for —
`OBJ_MARKER="objectives/harness.md"` — to decide whether `open-branch.sh` and
`close-branch.sh` apply to a given branch at all. Its presence is the switch; its content is no longer
read for guidance.

**The real guidance now lives at `.grimorio/skills/grimorio.objective-harness/SKILL.md`** — the cycle, the hard
invariants, the two VERIFY-syntax pitfalls that make `close-branch.sh` reject a correct check, the branch
model, and who works where. Read it there, not here.

**Deleting this file switches `open-branch.sh` and `close-branch.sh` off for the branch.** Do it only as a
deliberate act.
