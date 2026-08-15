# Documentation as ANCHOR, not a second truth — a companion to "Currency"

This is a companion to import:skill/agent-writing#quality-standards-for-agents → "Quality Standards for Agents" → "Currency". Currency governs a
single file staying internally consistent, top to bottom. This file extends the same duty across the boundary
between a memory file and the code it describes: a memory file must read as CURRENT truth, and "current" includes
agreeing with the code, not only with itself.

## The arc he actually lived through, and why it landed here (CEO, translated)

Three extremes, each tried or diagnosed, none of them kept:

**1. Code-only — rejected.** *"At one point I wanted the documentation to live ONLY in the code... I did not
want documentation guiding the code or the other way round; I wanted the single source of truth to be the
code."* Dropped because a codebase tells you WHAT, never WHY — the reasoning behind a decision is not
recoverable by reading the result of it.

**2. The heavy plan-then-code gate — rejected.** *"Originally, when I made Grimorio, I wanted that whenever you
were going to develop, you went to the planning and documentation doc, generated it, used it, and only then
moved to the code. I discarded that — it is too slow and too heavy."* Dropped because a mandatory doc-first gate
on every change is too slow for the pace this project runs at.

**3. Document nothing — the state this ruling fixes.** *"The other extreme is the one we have now, which is
DOCUMENT NOTHING... if none of this gets documented, it does not get documented. It is in the code, yes, but you
have to FIND it — and finding it does not tell you WHY."* This is the diagnosed failure behind the specific fix
in ref:skill/solution-architecture/behavior.md — a design that lived nowhere but a context that later got reset.

**Where he landed — the ANCHOR, reconciled, complementary:** *"Every time design is discussed: go to the
documentation, review it, and if differences are found, update them. It is the ANCHOR. If something contradicts
between the documentation and the code, you RECONCILE — but neither of the two is THE one. They are
COMPLEMENTARY. The documentation is there so you understand WHY something happened, but I do not want it to be a
limitation either."*

## The mechanical rule

**WHEN a design is under discussion or being decided ⟶ go to the existing documentation for that topic, review
it, and RECONCILE it against the code: update whichever side is stale, and delete what is genuinely
contradictory.** Neither the documentation nor the code outranks the other by default — they are complementary.
The documentation's value is explaining WHY the code is the way it is; it must never be treated as a hard
limitation that blocks a code change the reconciliation itself shows is needed.

## The boundary — do NOT read this as "keep docs in sync on every change"

**NEVER treat reconciliation as a per-commit or per-edit obligation.** This fires WHEN design is being discussed
or decided — not on routine code changes. He rejected exactly that heavier obligation twice, in two different
forms (extremes 1 and 2 above); re-imposing it here would recreate the failure he already discarded.

**FOR NOW this stays MANUAL.** *"You do NOT have to go and update the documentation every time you do
something — that is too heavy for the system. It could be an independent agent, but I do not want to get into
that now. For now, manual."* WHEN the doc-vs-code gap looks like it could be closed by an automatic per-commit
sync agent, do NOT build one on the strength of this file — that scope was explicitly declined, not merely
unaddressed.

## Why several files, not one

*"Delete whatever is contradictory, pass the design through properly, and keep a single source of truth. The
difference is that before we had it in ONE file, which made it too heavy and hard to control; now we have it in
SEVERAL, which will make it easier to keep."* The multi-file shape is what makes reconciliation tractable at
all — a single 1000+ line file is unreconcilable in practice even when the duty to do it exists.

-> This is the same reference-depth doctrine already written, applied to why splitting matters here too:
import:skill/agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files → "Reference depth, don't hyper-compress — a skill can (and should) have MANY reference
files". Apply it; this file does not restate it.
