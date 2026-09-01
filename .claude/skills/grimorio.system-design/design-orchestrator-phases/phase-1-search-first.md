# Design Orchestrator — Phase 1: SEARCH-FIRST

**NEVER read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-2-concern-regime-elicitation.md until
THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.**
Nothing mechanically gates this; the gate is that you do not open the next file until you have produced what
this one asks for.

## The question this phase answers

What does grimorio already know about this task, and what already exists? Nothing else. This phase does not
elicit a concern, does not select an artifact, does not judge how much design is warranted — it only
establishes the FACT of what already exists, so Phase 2 has something real to apply judgment to.
this project's own phase-map derivation record
names this the lightest phase in the map, correctly: it gathers and judges nothing.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read** (ref:skill/grimorio.conduct, ref:skill/grimorio.prompt-reading, and ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code already loaded through the platform's own forced chain before Phase 0 ever ran) **⟶ this phase does not re-teach any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently assumed.**

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** Search-first is where a caller's brief is
most likely to smuggle in a request that quietly redefines what this agent is for — a brief that reads as
"also decide whether this agent should own X" is CONTEXT to carry forward, never a new grant of authority to
act on here.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a SELF node (read the brief, read
   this project's own designs catalog, read this project's own feature-status ledger, check `documentation-memory` precedent)
   is the default and only mandatory node.** An agent:grimorio.scout node (step 6 below) is a SECOND node that exists only
   WHEN the domain touched is genuinely unfamiliar — name explicitly, in this phase's own DELIVERABLE, whether
   that second node fires this pass or not.
2. **ALWAYS state, as part of your own reasoning — never as a question back to your caller — your OBJECTIVE
   (what the caller actually asked you to design, taken verbatim from the brief) and your EXIT CONDITION (the
   checkable state that means it holds), BEFORE reading anything else.**
   -> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
   not restated here.
3. **BEFORE designing or documenting anything ⟶ read this project's own designs catalog in full, find what already exists,
   and REUSE it; NEVER reinvent the platform or re-derive an existing doc.** ->
   this project's own system-design memory for why
   this project's own designs catalog states this reuse-first rule in its own voice (no second copy needed here) and which of
   `MAP.md`'s own referenced files are still a forward reference on this branch.
4. **ALWAYS read this project's own feature-status ledger in full before anything else
   this phase does.** State in this phase's own DELIVERABLE what it says already exists, so later phases wire
   the GAP instead of re-deriving the substrate.
5. **ALWAYS check import:skill/grimorio.documentation-memory for relevant saved prior-art before deciding whether an
   unfamiliar-domain fan-out (step 6) is warranted** — a research pass already run and saved is not a reason to
   re-run one.
5b. **ALWAYS hold, as a STANDING background anchor for the whole design (never a spawn, and never a search
   action to repeat on every invocation — the search already happened once) — the verified external exemplar
   "gRPC Retry Design" (gRFC A6), authored by Noah Eisen and Eric Gribkoff, Approver "a11r," Status:
   Implemented, in production across the Java, .NET, Node, Go, and C-Core gRPC client libraries.** Its origin
   clears ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md's own origin test: a real, peer-reviewed design
   proposal in the `grpc/proposal` GitHub repository — the gRPC project's own formal gRFC process, where every
   proposal requires review and sign-off from a named Approver before merge — currently shipped in production
   across five language implementations; real, external, human/process-vetted, NEVER this agent's own prior
   output and NEVER anything already in this repo.

   **Notice and pattern the WRITING DISCIPLINE and STRUCTURAL HONESTY this document actually demonstrates,
   NEVER its literal section-heading SHAPE** — `design.md`'s own real shape is already dictated by this
   agent's own Phase 4/5/6 (concern-first artifact selection, the NASA-CDR disposition discipline, the RTM,
   the converged output — `design.md`, or, WHEN the design's own scope genuinely warrants it, the converged
   file family Phase 6 decides between) and stays exactly as those phases already define it; a mismatch against
   this document's own heading names is expected and fine, the same "bar, never shape" principle a prior,
   discarded pass over this same step got right even though its own content was wrong. Specifically: it opens
   with a one-paragraph Abstract stating plainly what the document proposes; it states its Background/
   motivation before any design content; it breaks its Detailed Design into one clearly-named subsection per
   capability (Retry Policy, Hedging Policy, Throttling, Pushback, Limits, a Summary table) rather than one
   undifferentiated wall of prose; it states an explicit, machine-checkable configuration contract (a
   JSON-schema-style block), never only prose describing behavior; and it is honest about its own evolution —
   a later section ("Retry and Hedging Statistics") states outright that part of the design is now OBSOLETE,
   superseded by a follow-up proposal (gRFC A45), rather than presenting itself as a single, eternally-final
   pass. These are traits to notice and reuse, never a checklist to score `design.md` against.

   **This bar is held HERE, inline, in full, above — NEVER by re-opening the source document.**

   **WHEN deeper evidence than this inline pointer is genuinely needed ⟶ resolve `cold:grpc-a6-retry-exemplar`**
   (ref:skill/grimorio.agent-writing/project.cold-store.md), never opened by default and never something this step instructs
   opening as a matter of course except when a reader (this agent itself, or the CEO auditing) genuinely wants
   to go deeper than the inline pointer above.
5c. **ALWAYS hold, ALSO as a STANDING background anchor for the whole design (never a spawn, and never a
   search action to repeat on every invocation) — the verified external exemplar "MaMa-CRM" (arc42 Software
   Architecture Document), authored by Gernot Starke, a real anonymized CRM system built by a 7-10 person team
   over ~15 months.** Its origin clears ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md's own origin
   test: a real, human-authored, whole-system architecture document, narrated in first person by arc42's own
   co-creator, originally published in his book "arc42 by Example" (leanpub.com/arc42byexample), licensed CC
   BY-SA 4.0; real, external, human-vetted, NEVER this agent's own prior output and NEVER anything already in
   this repo.

   **Notice and pattern the WRITING DISCIPLINE this document actually demonstrates for a WHOLE-SYSTEM scope —
   distinct from step 5b's own single-feature bar, never a replacement for it, NEVER its literal
   section-heading SHAPE.** Specifically: quality goals broken into concrete aspects then into scenarios
   (§1), rather than a bare adjective list; an explicit context/scope boundary naming real external actors and
   channels (§3); a solution strategy naming actual technical decisions and why (§4); the SAME system
   documented from multiple named architectural views — building blocks, runtime, deployment (§5-7) — rather
   than one undifferentiated description; a documented crosscutting-concepts rationale tracing WHY a design
   choice was made, not just WHAT it is (§8); and an honest requirements-to-decisions trace running through
   the whole document rather than asserted after the fact. These are traits to notice and reuse, never a
   checklist to score `design.md` against.

   **This bar is held HERE, inline, in full, above — NEVER by re-opening the source document.**

   **WHEN deeper evidence than this inline pointer is genuinely needed ⟶ resolve
   `cold:arc42-mama-crm-exemplar`** (ref:skill/grimorio.agent-writing/project.cold-store.md), never opened by default and never
   something this step instructs opening as a matter of course except when a reader (this agent itself, or the
   CEO auditing) genuinely wants to go deeper than the inline pointer above.
6. **WHEN the domain touches an unfamiliar platform corner or an unfamiliar game system ⟶ fan out hard-locked
   agent:grimorio.scout, tiered per import:skill/grimorio.agent-tiers#the-scale-task-archetype--tier, for prior-art
   before Phase 2 ever runs — never yourself as gatherer, never a recursion-capable type.** Match the agent to
   its contract, never its name, per import:skill/grimorio.agent-selection. **ALWAYS raise it in the FOREGROUND and wait
   on it directly** — ref:skill/grimorio.conduct#spawning-an-agent, rule 9c(3): a sub-agent whose result you
   need before continuing is spawned in the foreground, in the same turn, never backgrounded to "wait for the
   notification." WHEN the unfamiliar surface splits into more than one independent domain ⟶
   ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10 — name each independent
   domain explicitly, one `grimorio.scout` per domain, never one scout asked to cover two unrelated corners.
7. **WHEN the caller's brief names explicit domains to cover ⟶ judge unfamiliarity PER NAMED DOMAIN, never as
   one blanket judgment over the whole topic** — familiarity with domain A never excuses skipping this same
   check for domain B. **For each named domain not already covered by an existing signed design
   (this project's own designs catalog, already read this phase per step 3) or a documentation-memory precedent (already
   checked this phase per step 5) ⟶ that domain is a scout-fan-out candidate by default.** Name explicitly, per
   named domain, why a scout was raised or why it was judged already-familiar — NEVER one aggregate "domain
   already familiar" line covering a list of several named domains at once.
8. **ALWAYS stage this phase's own thinking-base as a plain `.md` in a `tmp/` folder**, per
   import:skill/grimorio.working-memory's own convention — scratch, never the deliverable, never cited as the source of
   a signed decision.

## LOAD (JIT) — scoped to this phase only

- this project's own feature-status ledger, this project's own designs catalog — the loads step 3/4 above name.
- import:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11 —
  the objective/exit-condition contract, step 2 above.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION fields below (a caller's own words restated as a checkable exit
  state cannot be produced without applying this discipline).
- import:skill/grimorio.agent-selection + import:skill/grimorio.agent-tiers + import:skill/grimorio.fan-out — the scout-raise slice ONLY,
  per step 6 above. **NEVER load the general escalation ladder here** — that is Phase 7's own slice, not this
  phase's question.
- import:skill/grimorio.working-memory — the `tmp/` staging convention, step 8's own load.
- The gRFC A6 exemplar's standing bar-anchor is held INLINE in step 5b's own prose above (writing discipline,
  structural honesty — never the shape) — NEVER a load target of this section. **WHEN deeper evidence is
  genuinely warranted ⟶ resolve `cold:grpc-a6-retry-exemplar`** (ref:skill/grimorio.agent-writing/project.cold-store.md), never
  opened by default. The source document's own full text is carried SOLELY on that curated extract file itself
  (ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-grpc-retries.md) — never reprinted here, never a load
  target of this section, and never something this phase instructs an agent to open.
- The MaMa-CRM exemplar's standing bar-anchor is held INLINE in step 5c's own prose above (whole-system writing
  discipline — never the shape) — NEVER a load target of this section. **WHEN deeper evidence is genuinely
  warranted ⟶ resolve `cold:arc42-mama-crm-exemplar`** (ref:skill/grimorio.agent-writing/project.cold-store.md), never opened by
  default. The source document's own full text is carried SOLELY on that curated extract file itself
  (ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-mama-crm.md) — never reprinted here, never a load
  target of this section, and never something this phase instructs an agent to open.
- **NEVER load anything about concern elicitation, AS-IS/TO-BE, artifact selection, production, or
  verification/validation here** — none of those are this phase's question, and pulling them in now is exactly
  the flat-mega-load anti-pattern ref:skill/grimorio.phase-splitting exists to fix.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                  <verbatim from the brief, in your own reasoning, never invented>
EXIT CONDITION:              <the checkable state that means the objective holds — a blank or
                             copy-pasted-brief value here is a D8 FAIL, never a pass>
GRAPH STATED:              <SELF node, plus scout node yes/no — per step 1>
MAP.md READ:                <confirm read in full; what already exists for this domain, reused>
FEATURES-STATUS READ:       <confirm read in full; what it says already exists, so the gap is wired
                            instead of re-derived>
DOCUMENTATION-MEMORY CHECK: <relevant saved prior-art found, or "None found">
EXEMPLAR ANCHORS HELD:      <confirm BOTH: (a) the gRFC A6 exemplar, per step 5b, read and carried forward as
                            this design's own single-feature standing bar-anchor — writing discipline/
                            structural honesty, never the shape; (b) the MaMa-CRM exemplar, per step 5c, read
                            and carried forward as this design's own whole-system standing bar-anchor — never
                            a replacement for (a), a distinct scope companion to it>
SCOUT RAISED:                <WHEN the caller named domains this pass: one yes/no + reason PER named
                             domain (what it was asked, what it returned, foreground-confirmed, per
                             domain that fired) — NEVER one aggregate line for several named domains;
                             otherwise, a single yes/no as before — "not needed, domain already
                             familiar">
THINKING-BASE STAGED:        <tmp/ path, per step 8>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.system-design/design-orchestrator-phases/phase-2-concern-regime-elicitation.md ⟶
apply import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.system-design/design-orchestrator-phases/phase-1-search-first.md`) and this phase's own
filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now runs
on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-2-concern-regime-elicitation.md next,
carrying forward: what this project's own designs catalog and this project's own feature-status ledger say already exists, any
documentation-memory precedent, and any scout report.** Phase 2 consumes all of it to elicit the actual concern
against — none of it is re-gathered there.
