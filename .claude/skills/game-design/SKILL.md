---
name: game-design
description: "Universal game-design methodology canon: MDA and the hypothesis-vs-validated distinction, tuning process (Riot/Firaxis), proposal-doc shape (one-page/diagram-first vs the dead GDD), systems-vs-content design, vertical slice, kill-your-darlings, playtest cadence, and the prior-art grounding bar. Load before doing any constructive game-design work."
---

# Game Design — Methodology Canon

Universal, sourced game-design practice. Authored from a sourced scout pass
(the 14-finding scout report with its primary sources is LOST — it lived only in `tmp/`) after an
entropy review flagged that design work here was running canon-free — NOT from model free-recall. Project
decisions (what THIS game is) live in the product vision, not here.

## The one distinction everything hangs on: HYPOTHESIS vs VALIDATED
A design proposal grounded in prior-art is a **hypothesis**, not a validated decision. Every professional
practice found says so:
- **MDA** (Hunicke/LeBlanc/Zubek, AAAI 2004): designers author **Mechanics**, but the **Dynamics** that emerge
  in play are not reliably predictable by reasoning about the mechanic on paper — they must be OBSERVED through
  play. Judging a design's outcome from its written rule is the literal failure MDA warns against.
- **Riot's Champion Balance Framework** (2019, published): data-INFORMED, never data-dictated; every proposed
  number carries "a thesis on what they're trying to prove or disprove" and passes a **playtest-validation
  gate** before shipping.
- **Firaxis/XCOM** (Jake Solomon): spreadsheet-first but NOT spreadsheet-final — "beautiful spreadsheets with
  all things accounted for" still get overridden by what playtesting reveals, especially emergent multi-system
  interactions invisible on paper.
- **Paper prototyping** exists precisely because "a game isn't evaluated by how clever its mechanics seem on
  paper, but by how it feels when played" — the cheapest playable version validates; the document never does.

**Rule:** every numeric/tuning/mechanic proposal is labeled **`hypothesis — grounded in [prior-art], pending
playtest`** unless it has actually been exercised in play/simulation. Presenting a grounded-but-unplayed
proposal as settled design is a named departure from professional practice.

**Heuristic:** in an engine where the game is declarative DATA over a fixed interpreter, re-spec-and-rerun is
far cheaper than in normal game dev — so the playtest gate is affordable and there is no excuse to skip it.
Design work should say explicitly WHEN the loop-back happens (who re-invokes design against real match data).

## Playtest cadence — a loop, not a gate
Professional cadence is **weekly or more, continuous through production** (Blizzard/Overwatch built their whole
pipeline around it; indie teams run lightweight repeatable processes). Design is re-entered after
implementation; a proposal doc that is never revisited after the mechanic runs is a one-shot artifact — the
exact "goes stale on first contact" failure below.

## Proposal-doc shape — diagram-first, per decision (the GDD is dead)
- **Sweatman** (lead designer, Jagex — "Death of the Game Design Document"): the single comprehensive
  converged-before-testing GDD has five named failure modes — enshrines untested assumptions as settled, goes
  stale when implementation starts, is rarely actually read, imposes rigid constraints that stifle learning,
  and blocks recovery when a fundamental error surfaces mid-build.
- **Librande** (Creative Director EA/Maxis — "One-Page Designs", GDC): the industry counter-practice is NOT
  shorter prose — it is **annotated-diagram-first**: "strong central images with crucial, context-giving
  notes", one page per design, answering "what is the most important thing I need to communicate right now?".
  Aimed explicitly at cross-discipline and NON-DESIGNER readers — prose-heavy docs are the ones no one reads.

**Rule:** a design proposal leads with the diagram/table per decision — an annotated map for terrain/tactics, a
stat table for rosters, a flow sketch for command/messaging — prose is the caption, not the artifact.
**Anti-pattern:** a long unconstrained prose doc for a non-designer stakeholder — it reproduces all five GDD
failure modes and will not be read.

## Systems design vs content design — two disciplines, two rigor bars
- **Systems design** = the reusable rule (a morale FORMULA, a facing penalty model). Validated by
  composition: does it interact coherently with every other system, with no special cases?
- **Content design** = instances inside an existing system (THIS unit's stats, THIS map). Validated
  comparatively: balanced against sibling content.
In a game-is-DATA architecture the split is load-bearing: a SYSTEM decision changes the interpreter/schema
surface (expensive, architecture-adjacent); a CONTENT decision is a new data instance (cheap). **Tag every
design decision SYSTEM or CONTENT and apply the matching validation bar.**

## Vertical slice & the composition test
A vertical slice is a small fully-realized portion of the real game — its value is exposing where scope
assumptions break **under real execution**. A prose walkthrough written by the designer is a paper-trace, not a
slice: it cannot produce dynamics the author didn't already predict. Use the walkthrough to design; trust only
the executed slice to validate.

## Kill your darlings — the cut discipline
Good design "is tight, focused, and shaves off as much chaff as possible": cut mechanics you are attached to
when they don't serve the game, judged against explicit design goals. A "what's OUT (and why)" section is the
structural home for this — but it only works with real adversarial pressure (someone must challenge scope), not
as a rubber-stamped everything-in wishlist.

## The prior-art grounding bar
Grounding names **the game AND the exact mechanism/formula/rule** ("WC3's 7×6 attack×armor percentage matrix;
Piercing×Fortified = 35%"), never just the game ("morale like Total War"). **A citation with no mechanism is a
name-drop, not grounding — complete it or cut it.** Prefer the project's already-paid-for research catalogue
over re-fetching; fetch fresh only what the catalogue lacks.

## Anti-patterns
| Anti-pattern | Consequence |
|---|---|
| Presenting a grounded-but-unplayed number as settled | Untested assumption enshrined; falsified later at 10× cost (Sweatman failure #1) |
| One long prose GDD for a non-designer reader | Not read; stale on first implementation contact |
| Designing systems and content with one undifferentiated rigor bar | Schema-surface changes slip through as if they were cheap data edits |
| Prior-art name-drops without mechanisms | Confident-sounding, unverifiable grounding — poisons downstream decisions |
| No loop-back after the mechanic runs | The proposal doc becomes a one-shot artifact; design never learns from play |
