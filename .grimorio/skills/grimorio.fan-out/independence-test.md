# Fan-Out — The Independence Test

Split out of ref:skill/grimorio.fan-out under `CLAUDE.md` rule 23 (the ~500-line smell threshold) — this is the FULL,
citable-on-its-own text of the hard rule ref:skill/grimorio.fan-out's "Hard rules" section points at; that section keeps
only the one-line pointer, never a second copy of the test itself.

## THE INDEPENDENCE TEST — what makes `split-or-declared-solo` testable, not decorative (HARD RULE, 2026-08-15)

A solo declaration that fires every time is not a signal, per this corpus's own standard for any check:
ref:skill/grimorio.reasoning-principles#measuring-is-not-proving--a-check-needs-a-falsifiable-hypothesis-hard-rule-ceo-2026-07-30
→ "in the case this is supposed to catch, what does it return? WHEN the answer is the same thing it returns
when everything is fine ⟶ throw it away and write a different one."

**BEFORE declaring solo, or deciding not to partition ⟶ run this test per candidate pair of pieces — a YES to
every dash-clause below means YES to independence, consistently across all three:**
1. Can each piece be WRONG on its own — does a defect in one leave the other's correctness unaffected?
2. Can each piece be VERIFIED on its own — can checking one happen without the other already checked?
3. Is neither piece's OUTPUT the other's INPUT — does each piece's input come from somewhere other than the
   other piece's output?

**WHEN all three hold for two or more pieces ⟶ they are independent and PARTITION is owed** — one delegate per
independent piece or cluster, never a single delegate for the set because writing one brief is less work than
writing several. Independent pieces CHECK each other — a single context has nobody positioned to disagree with
it; one same-session delegate split into six scouts along its own axis, and a sibling scout's independent pass
is what caught a scout's wrong claim that would otherwise have deleted a live engine.

**WHEN any one answer is NO ⟶ genuinely solo is the correct call, BUT the declaration must NAME which question
failed and how** (e.g. "Q3 fails — the running count each fix reads is the prior fix's own output"). A solo
declaration that cannot name the failing question is unverified, not proof of anything — this sharpens what
the `split-or-declared-solo` trailing field (rule 9, ref:skill/grimorio.conduct#spawning-an-agent) must
CONTAIN, never a new field alongside it.

A shared DESTINATION is not shared STATE: two pieces that both feed one final synthesis/merge/report stay
independent under Q3 as long as neither reads the OTHER's output before its OWN piece is done. Converging at
the end never by itself fails the test.

**THE CEILING (CEO, 2026-08-15, translated):** *"I would not say we should have more than two or three
delegates at the same time, mostly for the cost of resources."*

**NEVER raise more than 2-3 CONCURRENT delegates at once** — a bound on how many pieces run AT ONCE, for
resource cost, never a reason to skip the test above or under-partition because fewer delegates reads simpler.

**WHEN the test finds more independent pieces than that ⟶ group them into at most 3 concurrent lanes, batching
pieces within a lane sequentially, rather than raising a 4th concurrent delegate.**

-> deeper: ref:skill/grimorio.fan-out/delegation-decision.md#the-independence-test-applied--two-real-declarations-one-session — the
   test applied to two real same-session declarations, reaching two different verdicts.

-> deeper: ref:skill/grimorio.fan-out/delegation-decision.md — the measured evidence behind the rules above (the `grimorio.qa` fan-out
   floor probe: what reproduced it, what didn't, and the CEO's own reading of the result).

**One decision, two endpoints, never two artifacts.** "Emit the loop graph before you spawn or write"
(ref:skill/grimorio.fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08) already requires you
to pre-register NODES / EDGES-and-parallel-groups / TIER-per-node into `tmp/<your-id>/graph.md` before you
spawn — the same decomposition this section requires, written to a file the CHILD NEVER READS. The graph is the
caller's own pre-registration; the brief is where the split must ALSO land, because the brief is the only
surface the child reads. Writing the graph does not satisfy this section, and this section is not a new field
on the graph — do not edit the loop-graph section in ref:skill/grimorio.fan-out to add one; they are one decision with two
endpoints.
