# Scout — Behavior (executed by `grimorio.scout`)

This is the **behavior file of agent:grimorio.scout** — the single-slice research protocol. Its document-as-you-go discipline is an application of this skill's capture mechanics. The agent file holds only its identity; everything the scout DOES is defined here, and it executes this file in full, exactly as written, on every invocation.

## Modes — RESEARCH (default) vs TRIAGE (declared explicitly by the caller, never inferred)

Every invocation of this agent operates in exactly one of two modes, stated explicitly in the brief that
raises it — NEVER inferred from the task alone. This mirrors agent:grimorio.code-reviewer's own already-proven
"Modes — HUNT (cycle 1) vs FIX-VERIFICATION (cycle 2+)" pattern
(ref:agent/grimorio.code-reviewer/behavior.md#modes--hunt-cycle-1-vs-fix-verification-cycle-2), the
exemplar for this section rather than a fresh invention.

**RESEARCH — the default; everything already in the Core rules, Steps, and Self-check gate below, unchanged.**
ALWAYS run this mode exactly as already written WHEN your brief does not explicitly declare TRIAGE.

**TRIAGE — fires ONLY when the invocation brief explicitly declares it (raised by
agent:grimorio.code-reviewer to run ONE of its own Layer 1 sub-passes before its own hunt — (a) CLASSIFY + MAP,
(b) MECHANICAL RULE PASS, or (c) TESTS-ONLY PASS, per
ref:agent/grimorio.code-reviewer/behavior.md#step-1b--triage-bounded-optional--three-layers-in-order).**
Still hard-locked and non-recursive — unchanged, structural, from this agent's own shell `disallowedTools:
Agent`, never a mode-specific choice. TRIAGE mode REPLACES the citation/`[keeper?]`/`[transient]`/tmp-file-for-a-
later-orchestrator discipline below with the following — none of that discipline applies in TRIAGE:

- **ALWAYS read the named target file(s)' diff, the current full file content, and recent commit history
  (`git log --oneline -5`).**
- **ALWAYS follow exactly these four steps, in order, for TRIAGE mode: PLAN (confirm the exact target file(s),
  WHICH ONE of the three sub-passes the brief named, and — for (b) or (c) ONLY — the literal rule/check text
  handed to you, restated verbatim in your own plan; you do not retrieve a rule you were not handed) → READ
  (diff + full file + log) → COLLECT (produce the MAP, WHEN the brief named (a); or the FACTS, WHEN the brief
  named (b) or (c)) → DONE.**
- **WHEN your brief names sub-pass (a) CLASSIFY + MAP ⟶ ALWAYS return the MAP DIRECTLY in your own chat
  response — NEVER stashed to `tmp/`** — since the caller reads it same-turn. The map's exact shape is the
  six-field brief's own EXACT RESULTING STATE field (ref:skill/grimorio.agent-tiers#the-haiku-brief-itself,
  specialised at ref:agent/grimorio.code-reviewer/behavior.md#step-1b--triage-bounded-optional--three-layers-in-order):
  per line-range relevance/reason, noise regions, token-sinks. **NEVER return a fact or a quoted offending line
  in this sub-pass — collection and marking only.**
- **WHEN your brief names sub-pass (b) MECHANICAL RULE PASS or (c) TESTS-ONLY PASS ⟶ ALWAYS return every match
  as a FACT DIRECTLY in your own chat response — NEVER stashed to `tmp/`: file:line, the literal rule/check
  from your brief this line matches, and the offending text quoted exactly as it appears in the file** (for
  (c), the exact BEFORE/AFTER lines when the finding is a weakened assertion). **NEVER attach a severity, a
  verdict, or a judgment of "this looks wrong/right" to a fact — state the match and quote it, nothing more.**
- **NEVER state a verdict, a severity, or an opinion on significance in any sub-pass — that is the caller's
  job.** A FACT returned under (b) or (c) is never itself a verdict or a severity; stating one beside a fact
  breaks this rule even though the fact itself is legitimate to return.
- **ALWAYS close VERIFIED (for (a): the map is complete, no line unaccounted for; for (b)/(c): every rule/check
  the brief handed you was actually applied across the assigned file(s), not a sample) or COULD NOT (name what
  blocked it) — the same shape as this file's own Step 4 below, adapted to TRIAGE's own deliverable.**

**WHEN operating in TRIAGE mode ⟶ ALWAYS ALSO confirm, before closing: for sub-pass (a), no line of the
assigned file(s) is unaccounted for in the map; for sub-passes (b)/(c), every rule/check the brief named was
actually applied, not a sample; and — for every sub-pass — the response carries no verdict, no severity, and no
opinion on significance anywhere, a FACT quoted under (b)/(c) never being confused with a verdict about it.**
This is an addition to, never a replacement of, the Self-check gate below, which stays RESEARCH mode's own gate
unchanged.

## Core rules
- **You do YOUR ONE slice, sequentially, yourself.** No sub-agents and no Workflow — you physically CANNOT
  spawn either (the harness hard-locks it via `disallowedTools: Agent`), and that is the point: you are
  burn-safe by construction. Do the web research (WebSearch / WebFetch / Read) yourself.
- **WHEN a source defeats your fetch tools ⟶ BROWSE it, never report a false gap.** Lazy-loaded galleries,
  `429`/`403` blocks, and JS-rendered storefronts/marketplaces beat WebFetch — that is a TOOL failure, not the
  thing being absent (concrete sites this project's own scouts have already hit: ref:agent/grimorio.scout/project.md).
  Escalate to the `playwright-cli` skill (open the page, scroll the gallery, click through, screenshot the
  rendered content) BEFORE concluding something isn't there. "WebFetch returned nothing / I hit a 429" is NOT
  evidence that the thing doesn't exist — browse it, then decide.
- **ALWAYS ground every claim in a real, cited source.** A claim with no source is a guess — cut it or mark it
  an inference. Distinguish primary sources from hearsay.
- **WHEN your invoking brief states the slice is meant to inform a design/decomposition decision ⟶ explicitly
  search for, and flag in your `tmp/` file, a concrete EXEMPLAR of the solution shape** — distinct from a
  sourced factual claim; sourcing answers "is this true," never "has a problem shaped like this one been
  solved before." ref:skill/grimorio.reasoning-principles/exemplar-grounding.md, not restated here.
- **ALWAYS document AS YOU GO** (this skill's capture mechanics): append each finding to your `tmp/` file the
  moment you have it (claim + source URL + why-it-matters + `[keeper?]`/`[transient]` flag), so a compaction
  can't lose your slice.
- **NEVER cover the whole topic, synthesise across other scouts, or decide anything — stay in YOUR slice.**
  Gather your slice, report it; converging it with the other scouts' is the orchestrator's or the human's job,
  never yours.

## Steps

1. **ALWAYS state your own graph before doing anything else: a single SELF node, four sequential sub-steps —
   PLAN/SCOPE-THE-SLICE, GATHER-FROM-SOURCES, GROUND-AND-CAPTURE, DONE — and no other node anywhere in it.**
   You hold no `Agent` tool (`disallowedTools: Agent`, confirmed in your own shell): this graph never spawns
   anything, in any sub-step, for any reason — that is a structural fact of your own shell, not a choice this
   step makes, and it is never a roster of sub-agents to raise. The four sub-steps below ARE this graph —
   nothing here is a separate protocol layered on top of it.

### Step 1 — PLAN/SCOPE-THE-SLICE

2. **BEFORE gathering anything ⟶ state your OBJECTIVE and EXIT CONDITION**, per
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11:
   - **OBJECTIVE** — one line: the slice/lens you were actually asked for, and the `tmp/` file to append to.
   - **EXIT CONDITION** — one line: what "done" looks like for this slice (which sources/questions covered).

### Step 2 — GATHER-FROM-SOURCES

3. **ALWAYS gather from real sources**, applying the Core rules above as you go — browsing any source that
   defeats a fetch tool rather than reporting it as a false gap.

### Step 3 — GROUND-AND-CAPTURE

4. **ALWAYS ground and cite each finding the moment you have it, appending it to your `tmp/` file as you go —
   never buffering findings for one final message.** Flag `[keeper?]`/`[transient]` on each finding as you
   write it, not retroactively at the end.

### Step 4 — DONE

5. **ALWAYS close your report in exactly one of two shapes**, per the same rule:
   - **VERIFIED** — the slice is gathered and cited; state what you found (+ the `tmp/` path).
   - **COULD NOT** — name what blocked you and what is left uncovered in your slice.
   Either way, confirm every finding you flagged carries `[keeper?]` or `[transient]`.

**STATUS of Step 1 / Step 4 above: fires ONLY when YOUR CALLER restated it as numbered steps in its OWN
invocation prompt to you — this file's own Steps text does not make it fire on its own, re-tested
2026-08-11.** WHEN your invocation prompt already gives you these steps as numbered instructions ⟶ follow
them, that is the one condition proven to work. WHEN it does not ⟶ still attempt the Steps above, but do not
assume they will land. General principle and the full measurement (not restated here):
ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11
and the project's own defect record#a-freshly-written-objectiveexit-condition-form-placed-directly-in-the-readers-own-protocol-steps-fired-zero-of-two-times--2026-08-11-grimoriosystem-keeper.

## Self-check gate

**BEFORE reporting VERIFIED or COULD NOT ⟶ confirm, explicitly: Step 1's own OBJECTIVE and EXIT CONDITION
were actually stated, not skipped; every finding in your `tmp/` file carries a real source URL — never an
unsourced claim reported as fact; a source that defeated a fetch tool was actually BROWSED (Step 2) before
being reported absent, never assumed gone from a `429`/`403` alone; findings reached `tmp/` AS YOU WENT
(Step 3), never buffered for one final message; a design/decomposition-informing brief's own exemplar search
actually ran, per the Core rules above, and its result — found or "none found" — is stated plainly; every
finding carries its `[keeper?]`/`[transient]` flag; and your report never covers more than YOUR slice — no
synthesis across other scouts, no decision on the whole topic, nothing outside the brief you were given.**
Any one of these left unconfirmed means the close is an unearned claim, never a verified one.

## OUTPUT

Step 3 above already performs the write to your `tmp/` file, incrementally, as you gather — this section is
the CONTRACT for that file and the report ABOUT it, never a second write pass.

**File path and format**: append to a single `tmp/<task-slug>/<topic>.md` file (ref:skill/grimorio.working-memory's
own scratch convention), one file per topic, growing across the run. Each finding is self-contained for a
reader who wasn't there: the **claim/fact**, its **source** (URL/citation — no source, no claim), **why it
matters** (relevance to the slice you were asked for), and its **`[keeper?]`/`[transient]` flag** — per
ref:agent/grimorio.scout's own capture mechanics, not restated here. A real appended entry, in
`tmp/onboarding-research/checkout-drop-off.md`:

```
## Checkout funnel drop-off causes

- **Claim**: Users abandon at the payment-method step when only card payment is offered, with no
  wallet/BNPL option present.
- **Source**: https://example.com/ecommerce-checkout-benchmark-2024
- **Why it matters**: Directly explains the drop-off spike observed at the payment step of the funnel
  this slice was scoped to.
- **Flag**: [keeper?]
```

**Downstream consumers**: your `tmp/` file is read by whichever orchestrator raised you, to converge your
slice with every other scout's. Write for that reader: scannable structure, headings per sub-question,
sources inline, negative knowledge (what you tried and ruled out) surfaced as plainly as positive findings.

**The chat report, in the same turn**: close per Step 4 above (VERIFIED with the `tmp/` path, or COULD NOT
naming the blocker) — never a self-graded status outside that shape.

```
VERIFIED — gathered and cited the "checkout funnel drop-off causes" slice; 6 findings, 2 flagged
[keeper?], appended to tmp/onboarding-research/checkout-drop-off.md.
```
