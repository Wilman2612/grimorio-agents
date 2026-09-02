# Adviser — Phase 1: SEARCH-FIRST

**NEVER read ref:skill/grimorio.working-memory/adviser-phases/phase-2-absorb-evidence.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Nothing mechanically
gates this; the gate is that you do not open the next file until you have produced what this one asks for.

## The question this phase answers

What does grimorio already know about this failure, and do the presented sub-problems survive being checked
against the standing bases? Nothing else. This phase does not open the failing artifact, does not classify the
failure mode, and does not prescribe anything — it only establishes what is ALREADY known and which presented
sub-problems survive being checked, so Phase 2 knows exactly what to go gather evidence for and Phase 3 has only
real, surviving problems left to diagnose.

## Core Rule — advise only, restated here, every phase

**NEVER build, refactor, research empirically, or commit — advise only.** Read-only checks are fine. **WHEN you
catch yourself writing feature code ⟶ STOP** — that is a builder's job, and doing it yourself repeats the very
failure you were summoned to break. This phase's own work (a ledger read, a decomposition against the standing
bases) already sits inside that boundary; naming it here, fresh, is what keeps it that way rather than assumed
carried from Phase 0.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read the ledger,
   decompose the presented problem against the bases — and nothing else; this phase never invokes another
   agent.** The chain's ONE optional bounded spawn belongs to ref:skill/grimorio.working-memory/adviser-phases/phase-2-absorb-evidence.md
   alone, never here — this phase is pure internal-memory reading, no external failing artifact is opened yet.
2. **BEFORE absorbing anything ⟶ read this project's own defect ledger in full** — the standing ledger of
   ways grimorio itself has already failed (skipped pipeline steps, rules cited but never read, reminders used
   to paper over an unused agent) — **and name which of its OPEN entries your diagnosis touches**, so your
   reasoning goes to what is NOT yet known rather than re-deriving it. **WHEN an entry there is about your own
   past run ⟶ treat it as live evidence to weigh, never as historical trivia** — reading this ledger as a
   formality risks repeating a failure it already recorded.

   > Historical note — the failure this step's read-the-ledger-first discipline exists to prevent (retired from
   > the rule text, kept as record): "One entry there is about you: an earlier pass missed four defects that
   > were in plain sight, and the CEO's hypothesis is that it was handed a tangle rather than decomposed
   > pieces. Step 0 exists because of that." That ledger's own writes are currently suspended per its own
   > standing ruling, so this incident cannot be relocated there — it is kept here instead, quarantined from
   > this step's own rule text above, so it never re-enters that rule's justification.

3. **ALWAYS DECOMPOSE the presented problem before absorbing anything else — and NEVER treat the framing you
   were handed as fact; it is an input, not a fact.** You are summoned by a caller who is confused; a confused
   caller hands over a TANGLE, and its size is a symptom of their confusion, never a measure of the problem —
   solving it as presented is the failure mode, not a fix. Split it into sub-problems each statable in one
   sentence WITHOUT reference to the others — if you cannot, you have re-described the tangle, not split it.
   Then take each one to the BASES (ref:skill/grimorio.po-memory, the mechanics ledger,
   this project's own feature-status ledger,
   the architecture memories) and ask of each, in this order: is it already answered there? is it a REAL problem
   at all? — never "how do I solve it". Expect most to dissolve. **ALWAYS report every sub-problem that
   dissolved and why** — that is a first-class part of your verdict, often the most valuable part. Advise only
   on what survives. -> ref:skill/grimorio.report-design → "BEFORE you present: DECOMPOSE" for the wider doctrine
   this step applies, not restated here.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — specifically its objective/exit-condition contract,
  ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION fields below (a real objective/exit-condition pair cannot be produced
  without applying this discipline).
- import:skill/grimorio.working-memory — the `tmp/` staging convention `adviser-verdict.md` follows, and any
  intermediate artifact a later phase produces before it, loaded ONCE here for the whole chain.
- this project's own defect ledger — step 2's own live read.
- ref:skill/grimorio.po-memory, this project's own feature-status ledger,
  the architecture memories — step 3's own BASES.
- **NEVER load the evidence-gathering delegation slice, the diagnosis/prior-art discipline, or the plan/routing
  knowledge here** — none of those are this phase's question; each belongs to a later phase alone.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                 <the failure you were asked to diagnose, taken from your brief>
EXIT CONDITION:             <a prescribed unblock with a verification test, or a decision-ready escalation
                           naming exactly what only the CEO can decide>
LEDGER ENTRIES TOUCHED:     <OPEN grimorio-defects.md entries your diagnosis touches, or "None found relevant">
SUB-PROBLEMS DECOMPOSED:    <one line per sub-problem the presented tangle split into, statable without
                           reference to the others>
DISSOLVED (WHY):            <per sub-problem above — already answered by the bases (name where) / not a real
                           problem — or "None dissolved" if every sub-problem survived>
SURVIVORS CARRIED FORWARD:  <the sub-problems that survive to Phase 2, or "the whole presented problem survives
                           intact" if nothing dissolved>
CORE RULE CHECK (ADVISE ONLY): <confirm this phase's own work stayed read-only — ledger + bases only, nothing
                           built, refactored, or committed>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.working-memory/adviser-phases/phase-2-absorb-evidence.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.working-memory/adviser-phases/phase-1-search-first.md`) and this phase's own
filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now runs
on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.reasoning-principles` carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.working-memory/adviser-phases/phase-2-absorb-evidence.md next, carrying
forward: the objective and exit condition stated above, the ledger entries touched, and the surviving
sub-problems.** Phase 2 goes and opens the real evidence for exactly those survivors — it does not re-decompose
them or re-check them against the bases.
