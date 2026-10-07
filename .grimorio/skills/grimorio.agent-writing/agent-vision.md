# Agent Vision — the design harness a caller judges an agent against

A Vision is the reason an agent exists AT ALL, held APART from the per-invocation MISSION every brief already
carries ("you're a grimorio agent and your mission this time is to do X"). The two are genuinely different
questions: a mission changes every invocation; a Vision does not change until the agent itself is redesigned.
**NEVER let this file be read as resolving whether the two eventually collapse into one artifact** — that stays
exactly as open as the CEO left it, per
cite:agent/grimorio.po/agent-purpose.md@645d8ed940b3488a0159166c83403578edb78b5a#his-own-open-question--is-this-one-concept-or-two.

## A Vision is a DESIGN HARNESS — not a rationale, not merely a wiring contract

An earlier version of this file treated a Vision as an interface contract: what a caller REQUIRES of an agent,
what it PROVIDES, the CLASS of information in and out, and the QUALITY BAR both sides must meet. That shape was
itself a correction of a still-earlier one (a FOUNDING JUDGMENT the agent's output was graded against) — the CEO
rejected THAT one outright: it stated why an agent exists and how to grade it, rationale a reader admires rather
than an instrument a reader can actually use. The interface-contract shape was closer, but mid-design he
corrected it once more, relayed via grimorio.system-keeper, translated for reading only:

> "they may not be the contract I specifically told you about, I don't think so, but they ARE a design HARNESS —
> so it isn't over-dimensioned, isn't under-dimensioned, so I can judge whether this holds up, is enough and
> sufficient, for what I need."

**A Vision is a DESIGN HARNESS: the instrument a reader uses to judge whether a proposed agent is
over-dimensioned, under-dimensioned, or sufficient for the need.** The wiring/contract fields are still real and
still required below — they answer only ONE part of that judgment (can a caller actually plug this agent into a
neighbour) — never the whole of it. Every field in this file's own six-field format exists to serve THAT
judgment; a field that cannot be checked against "is this agent the right size for what it's for" does not
belong here.

**The second thing a Vision must do — the reason it binds the agent itself, not only its reader:** an agent that
holds only a literal instruction can defend the wrong thing to the death. Soldiers ordered to hold a bridge, who
were never told the actual objective was to keep the enemy from crossing it, would defend the bridge itself to
the last man — told the real objective, the right move might have been to destroy the bridge, not die holding
it. **An agent holding the real objective can deviate CORRECTLY from a literal instruction that would betray
it; an agent holding only the instruction defends the bridge to the death and reports success.** This is the
test a well-written Vision must pass, restated below as half of this file's own negative test: could this
agent, reading only its Vision, recognise that a handed instruction serves the wrong thing and act toward the
real objective instead?

**Why a FORMAT is owed at all, rather than leaving each Vision to whatever a given pass produces** — the same
argument ref:skill/grimorio.prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
already makes for a rule's own opener, applied here to a document's own required fields instead. His own words,
relayed via grimorio.system-keeper, translated for reading only:

> "if you don't give the AI a format — and the keeper should already know this — it will write whatever it
> wants, with quality that varies by how capable the model happened to be that day. No format means no floor."

## The six required top-level fields

**ALWAYS give a derived Vision exactly these six top-level fields, never five, never seven, and never a
different split of the same content.** Each is defined below with what it must contain AND the negative
instruction that catches it being silently satisfied by restated function or identity instead.

1. **REQUIRES** — the concrete need or cost this agent exists to cut, drawn from the caller's or parent's own
   already-stated vision, **NEVER invented**. A real, current, NAMED cost — his own worked instance is three
   disconnected systems (the spend API, workflows, the game itself) with no integration between them, and the
   cost is COGNITIVE, not code. **NEVER let REQUIRES read as a generic, self-referential restatement of the
   agent's own function** ("this agent exists because X was needed," where X is just the agent's job renamed) —
   that fails this field and fails the negative test below. For a SPLIT, this is where the parent-child
   relationship is grounded — never a separate ledger heading: what this child now draws from the parent's own
   vision. **WHEN the parent does not yet carry a Vision ⟶ derive one onto the parent's own shell in the SAME
   pass.** Worked instance, drafted on the reverted branch: agent:grimorio.design-orchestrator's own REQUIRES field names
   GAME 2's own unrealizability and the cognitive cost of three disconnected systems, drawn straight from the
   founding material, never invented for the occasion.
2. **OBJECTIVE** — the goal this agent serves, stated at GOAL level, never an operation or subfunction dressed
   up as one — this is the field the bridge parable above is about. **Reuse, do not duplicate the test**:
   ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md#steps's own step 2c
   already runs Cockburn's own goal-level ("go to lunch") test on exactly this kind of statement — apply that
   SAME test to a Vision's own OBJECTIVE field, never re-derive or restate the test a second time here.
3. **THE WIRING SHAPE** — three sub-bullets under one heading, unchanged in content from the earlier
   interface-contract design, now explicitly ONE PART of the harness rather than the whole of it:
   - **PROVIDES** — what the agent hands back to its caller. For a split, what STAYS with the parent.
   - **INPUT CLASS** — a CLASS of input, never one example invocation.
   - **OUTPUT CLASS** — the class of what comes back. **WHEN part of the output is a BASELINE description of
     what already exists ⟶ that part is NEVER speculative** — checked against the real document or the real
     code, never inferred as a stand-in for a check that wasn't run — **even though the Vision AS A WHOLE MAY
     be speculative about a destination and land progressively through deeper planning** (agent:grimorio.solution-architect
     already works this way). The AS-IS half of an output never gets that latitude; a claimed domain the code
     does not actually support is said so plainly, never quietly moved toward a domain that isn't there.
4. **APPLICABILITY** — named conditions for when this agent WOULD serve the need, and when it would NOT: the
   explicit over-/under-dimensioning test a reader checks BEFORE reaching for this agent. **NEVER fold this
   silently into INPUT CLASS** — INPUT CLASS says what shape of input the agent accepts once invoked;
   APPLICABILITY says whether invoking it at all is the right call for this need.
5. **BOUNDARIES** — two named sub-parts, both required, never collapsed into one:
   - **NEVER-SKIP** — a completeness floor: what this agent must never omit, even under pressure to finish
     fast.
   - **INVIOLABLE** — a refusal that holds even against the CEO himself. Treat this with the same weight this
     corpus gives a NEVER rule, scoped to this one agent — a soft preference dressed as INVIOLABLE fails this
     field.
6. **ACCEPTABLE RESULT** — the checkable standard, folding what an earlier design called the QUALITY BAR,
   including what the next consumer downstream needs. **Checkable, never aspirational.** Ground this the way
   both worked examples below already do: a human-facing report generated downstream from this
   agent's output must be a FAITHFUL TRANSLATION — precise enough that a reader of only the pretty version could
   still spot a real discrepancy against the machine-level detail, because nothing needed was lost between this
   agent's own output and it. **OPTIONAL closing note, never a numbered field of its own:** a rough APPROACH —
   where to start looking — folded under ACCEPTABLE RESULT WHEN the founding material actually hands one in;
   **NEVER invented when it wasn't given**, and never how-to-do-it, which belongs to the behavior file, not
   here.

## The WIRING+HARNESS negative test

**ALWAYS run BOTH halves of this test on a drafted Vision before calling it done — never only one:**

**(a) THE WIRING TEST.** Could a caller, reading ONLY this section, decide WHEN to invoke this agent, WHAT to
hand it, and WHAT to expect back — wiring it to a neighbour — WITHOUT opening its behavior file?

**(b) THE HARNESS TEST.** Could a reader, using ONLY this section, judge whether a proposed version of this
agent is over-dimensioned, under-dimensioned, or sufficient for the need?

**WHEN either answer is NO ⟶ discard the draft and re-derive it from the founding material actually handed in,
OR, WHEN that founding material genuinely does not support a real derivation, flag that plainly rather than
manufacture one.** A draft that could have been written by someone who knew only the agent's function, never why
it was ever asked for, fails (a) and usually fails (b) too — it is the Identity/Personality paragraph wearing a
Vision's name.

**WHEN agent:grimorio.system-keeper's own Phase 5 (VERIFICATION) reviews a newly-authored or newly-split
agent's shell ⟶ it independently re-applies this SAME two-part test to the Vision it finds there** — never
taken on `grimorio.prompt-writer`'s own report field alone, per the "## Consumption" section below, not
re-derived twice in this same file.

## Where it is carried — the shell's own `## Vision` section

**ALWAYS carry a Vision on the agent's own SHELL** (`.claude/agents/grimorio.<name>.md`, or its
`project.<name>.md` counterpart for a project-scoped agent), **as a new `## Vision` section placed AFTER the
identity/personality prose and BEFORE the `## Behavior` block.** ->
ref:skill/grimorio.agent-writing#the-agent-shell--identity-in-the-agent-file names this exact ordering slot for
every other shell section in sequence; a Vision takes the same slot, never a new class of section standing
outside that order.

**NEVER carry a Vision only inside a phase file, a comment, or anywhere only the agent itself ever reads.** The
founding reason for grounding this in the shell specifically, translated: *"that isn't documented anywhere... I
want every agent to carry it as a design reason"* —
cite:agent/grimorio.po/agent-purpose.md@645d8ed940b3488a0159166c83403578edb78b5a#why-it-must-be-carried-not-merely-known.

A `## Vision` section is IDENTITY-ADJACENT content — the same class as the Personality paragraph already
legitimately living in a shell, never protocol, never an output format, never a self-check. -> the rule that
keeps a Vision-bearing shell from ever failing the shell-purity check on this basis:
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md#steps, check 1.

## Maintenance — FIXED at birth, revised only on a deliberate re-design

Whether a Vision is a LIVING document an agent updates as understanding lands, or FIXED at birth with evolving
detail carried elsewhere, was left open by the CEO — he does not know and says so explicitly. **This file's own
call, made by grimorio.system-keeper, stated here for a reader to see and open to reversal: a Vision is FIXED at
birth, and revised ONLY on a deliberate RE-DESIGN pass of the agent itself — NEVER silently drifted by routine
work.** The reasoning: a harness that keeps changing stops being a stable yardstick for "is this over- or
under-dimensioned," which is the whole reason it exists, per the governing definition above. The
quasi-software-view stays the place where evolving mechanical/technical detail is maintained routinely — that
split is unaffected by this decision.

## Update obligation

**ALWAYS keep this file current — owner: `grimorio.system-keeper`. WHEN a future CEO correction changes any
of the six required top-level fields, their own definitions, the WIRING+HARNESS negative test, or the
INLINE-NEVER-A-SEPARATE-FILE / BUDGET-YIELDS-TO-VISION constraints this file states ⟶ rewrite this file to
the new current truth in the SAME pass, never layer a correction note beside the old text.** WHAT WOULD FAIL
IF THIS WENT STALE: `grimorio.prompt-writer`'s own Phase 2 VISION DERIVED step and `grimorio.system-keeper`'s
own Phase 5 VISION CHECK would both keep passing their own mechanical gates (D8 structural presence;
independent-re-open) while silently deriving and validating Visions against a shape the CEO has already moved
past — the floor stays green while the substance drifts.

## Scope generalization — the pseudo-spec also owes this harness

The same harness format is owed to more than an agent's own shell. The CEO calls the wider case a "pseudo-spec"
— the vision behind a REQUEST he makes, not only an agent's own charter — his own words, translated: the design
agent in general has its own vision, and the TASK has its own —
cite:agent/grimorio.po/agent-purpose.md@645d8ed940b3488a0159166c83403578edb78b5a#the-cascade--every-split-off-agent-gets-its-own-visionmission.
**WHO writes a pseudo-spec's own contract, and WHERE it is carried, is a HOW/architecture call this file does
not resolve** — mirroring cite:agent/grimorio.po/agent-purpose.md's own "what is still
undecided" discipline at that same anchor; **NEVER let this file, or a pass invoking it, invent an owner for
that question.**

## Consumption — who is forced to read a Vision once it exists

**Two forced downstream reads, named plainly rather than left implicit:**

(a) **agent:grimorio.system-keeper's own Phase 5 (VERIFICATION)** independently re-derives and applies this
file's own two-part WIRING+HARNESS test against the Vision it finds on every newly-authored or newly-split
agent shell — never trusting `grimorio.prompt-writer`'s own report field alone, per
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-c-verification-review.md's own VISION CHECK, added
alongside its pre-existing BIRTH-HARNESS CHECK in that file's own established additive style. A missing or
inadequate Vision is a defect sent back to Phase 4, under the SAME 2-cycle cumulative cap already governing
every other writer-output property that phase holds.

(b) **A neighbour-authoring pass is forced to read this agent's own Vision before wiring against it.**
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md#steps's own step 2e
carries the actual clause: WHEN the agent being authored calls, or is called by, a neighbour that already carries a Vision,
that neighbour's PROVIDES/INPUT CLASS/OUTPUT CLASS is read FIRST and the new agent's own REQUIRES and WIRING
SHAPE are grounded in it — never derived independently of what the neighbour already commits to. Point at that
step; it is not restated here.

## The worked examples — two real instances from a reverted branch

Both were hand-written under direct instruction, on an interrupted `keeper/agent-birth-vision` branch later
REVERTED from `develop` (commit `eb1a4eaa`, an ancestor of this file's own resurrection) — `agent:grimorio.
design-as-is` does not currently exist and `agent:grimorio.design-orchestrator`'s own live shell carries no
`## Vision` section today. They are kept here ONLY as a worked illustration of the six-field FORMAT — never
cited as proof a currently-shipped agent already carries this shape, checked here against the FINAL six-field
reconciliation rather than assumed to already match it.

**agent:grimorio.design-as-is's own drafted `## Vision`:**

```
**Requires (of the caller, drawn from the parent's own vision — never invented):** ONE concern already routed
to you, its clause already decided (survey vs reverse-engineer); Phase 1's own SEARCH-FIRST findings (what
`designs/MAP.md`/`features-status.md` already say, the EMPIRICAL DOMAIN ENUMERATION + its exact sweep command,
any documentation-memory precedent, the two CEO exemplar anchors); Phase 2's own AS-IS-VOICE DETERMINATION
(provisional) for that concern. You require these as GIVEN — you never re-elicit the concern and never re-decide
the clause yourself.

**Provides (to the caller):** the AS-IS baseline text for that ONE concern, plus confirmation your own LOOP 1
reached its completeness limit. Nothing more — no TO-BE, no gap matrix, no transition plan, no artifact/diagram
selection; those stay `grimorio.design-orchestrator`'s own, at Phase 3. **You exist to pay down the COGNITIVE
cost of understanding one piece of a system nobody connected** — your baseline is the unit that cost gets paid
against; a baseline that still leaves the reader guessing has not actually reduced anything, however complete
it reads.

**Input class:** a single concern-and-clause pair, bundled with the upstream SEARCH-FIRST findings and the
provisional voice determination — never a whole design's worth of concerns at once, never a caller's raw,
unelicited request.

**Output class:** a structured baseline description of what actually exists for that one concern — dependency
facts (DEPENDENCIES-AS-THEY-ARE voice when AS-IS-ONLY), honesty disclosures (a claimed domain that doesn't
actually exist, said so plainly), and a completeness confirmation — never a build plan, a rendered diagram, or a
verdict on artifact type. **NEVER speculative, in any part** — a vision may be vague at first and land
progressively through planning; the AS-IS you hand back never gets that latitude, because the TO-BE, the
artifacts, and the eventual human report all land directly on it. Everything you state is checked against the
real document or the real code, never inferred as a stand-in for a check you didn't run.

**Quality bar:** no open question remains about what is there; every case discovered; every scenario covered;
the caller never needs to go back to the code to understand how the system works from what you handed back; not
too complex; presents the architecture well; honest about what is NOT there. Checkable, not aspirational: your
baseline is precise and complete enough that a human-facing report generated downstream from it would be a
FAITHFUL TRANSLATION — someone reading only that pretty version could still spot a real discrepancy against the
machine-level detail, because nothing needed was lost between your baseline and it. Downstream, Phase 4 needs
this baseline complete enough to select the right artifact against it; Phase 5 needs it complete enough to render
into diagrams without re-reading the code itself — the bar is set by those consumers, not by whether the
text merely reads finished to you.
```

**Does it survive the six-field reconciliation as-is? NO, not without a gap — say so plainly, never silently
backfilled.** WIRING SHAPE (Provides/Input class/Output class) and ACCEPTABLE RESULT (Quality bar) transfer
cleanly, no gap. **REQUIRES is a PARTIAL gap**: the field as written reads as an enumeration of what must be
HANDED IN (closer to what INPUT CLASS already covers) rather than a concrete cost/need statement in its own
right — the actual cost language ("pay down the COGNITIVE cost of understanding one piece of a system nobody
connected") sits inside PROVIDES, not REQUIRES, in that worked example's own text. **OBJECTIVE and APPLICABILITY are genuine
gaps**: neither exists as its own field inside `## Vision` — a goal-level objective statement and boundary
conditions live only in the shell's outer identity prose, never inside the Vision section itself, and were never
Cockburn-tested as OBJECTIVE now requires. **BOUNDARIES is a genuine gap**: the outer shell prose states some
never-do content ("never decides which clause applies... never touches the TO-BE") but it is not inside `##
Vision`, and it is not split into NEVER-SKIP vs INVIOLABLE.

**agent:grimorio.design-orchestrator's own drafted `## Vision`:**

```
**Requires (of the caller):** a domain or system to design — because GAME 2, as it stands, cannot be built: the
spend API, the workflows, and the game itself each function in isolation, built with no path toward GAME 2's own
vision, no integration between them. The cost this agent exists to cut is COGNITIVE, not code — the code changes
themselves are usually cheap; understanding what must change, across systems nobody connected, is not. Requires
whatever already exists (prior designs, shipped code, product context) so the AS-IS is never invented from
nothing, and, where a change is intended, the actual concern that change must answer.

**Provides (to the caller):** a description of the system AS IT IS, errors included, and, where warranted, the
MODIFICATION of how it will end up (the TO-BE) — very detailed, machine-level reports that close every relevant
detail, so the cognitive cost of understanding what changes across disconnected systems is actually PAID DOWN,
not merely documented. A LATER, not-yet-built stage turns this output into a polished human-facing report; this
agent's own deliverable is the machine-level source that stage will need, not the polished report itself.

**Input class:** a concern or domain to design — anywhere from "describe this shipped system" to "design this
change" — accompanied by whatever prior art or product context already exists; never a fully-specified spec (you
elicit the concern yourself, per Phase 2).

**Output class:** a structured `design.md` (or family of files) — AS-IS baseline, TO-BE delta where warranted,
and only the artifact(s) whose job is the elicited concern — never an implementation plan, never rendered HTML
(that is `grimorio.design-redactor`'s job, a separate downstream consumer). **The AS-IS half of this output is
NEVER speculative** — everything downstream (the TO-BE, the artifacts, the eventual human report) lands on it;
a vision may be speculative about the destination and get landed progressively through planning, but the AS-IS
is grounded strictly in what is actually there, checked, never inferred as a stand-in for what wasn't checked.

**Quality bar:** catches errors A PRIORI, before they become expensive to even understand, let alone fix; closes
gaps at the start rather than discovering them mid-build; every design is detailed enough at the machine level
that nothing is left for a human to infer. Checkable, not aspirational: could a renderer produce a faithful
human-facing report from this output alone, without returning to the code — precise and complete enough that a
reader of only the pretty version would still be able to spot a real discrepancy against the machine-level one,
because nothing was lost in the translation. That not-yet-built human-report stage sets part of this bar too,
named honestly as not yet built rather than ignored.
```

**Does it survive the six-field reconciliation as-is? Closer, but still not without gaps.** WIRING SHAPE and
ACCEPTABLE RESULT transfer cleanly — ACCEPTABLE RESULT's own FAITHFUL-TRANSLATION language above is in fact the
source this file's own field 6 draws its wording from. **REQUIRES already satisfies the new field cleanly**: it
names GAME 2's own unrealizability and the disconnected-systems cognitive cost directly, no gap — a better match
than the AS-IS agent's own REQUIRES. **OBJECTIVE and APPLICABILITY are still genuine gaps**, for the same reason
as above: neither is its own field inside `## Vision`, and neither was Cockburn-tested. **BOUNDARIES is still a
genuine gap**: "never builds... never renders to HTML" lives in the outer shell prose, not inside `## Vision`,
and is not split into NEVER-SKIP vs INVIOLABLE.

**In one line, for grimorio.system-keeper to weigh:** both worked examples satisfy WIRING SHAPE and ACCEPTABLE
RESULT without gap; both are missing OBJECTIVE, APPLICABILITY, and a properly-split BOUNDARIES inside their own
`## Vision` section; REQUIRES is solid in design-orchestrator.md and only partially satisfied in design-as-is.md.
Whether either shell needs a follow-up pass to close these gaps is this file's own finding, not this file's own
decision.
