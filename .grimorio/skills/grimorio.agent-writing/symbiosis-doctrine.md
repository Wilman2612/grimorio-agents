# The Symbiosis Doctrine — which half is a script's, which half is a model's

This file generalizes a test this corpus had already independently derived three times, at three different
scopes, before anyone stated it once at the level that covers all three. It does not replace any of the three —
each stays the authoritative account of its own axis — and this file never restates their content, only cites
it.

## Relationship to THE HARNESS, THE SYMBIOSIS, and THE SHAPE — read this first, never skip it as ceremony

ref:skill/grimorio.prompt-writing-quality#the-harness--grounding-an-obligation-into-a-checkable-determination-the-ceos-own-recurring-construct-formalized-here
answers, for an agent's own OUTPUT: which of its claims needs external grounding, and at what tier (deterministic
/ agent-based verifier / structural). ref:skill/grimorio.prompt-writing-quality#the-symbiosis--the-input-side-twin-of-the-harness
answers, for an agent's own INPUT: what a script should already have constructed before an agent ever reads it,
so the agent's own context holds only the judgment-bearing residue. ref:skill/grimorio.agent-writing#the-shape
answers a THIRD, prior question: how much agent should exist at all — an agent is sized to exactly the judgment
a script cannot hold deterministically, never padded with ceremony that exists only because nobody trusted the
agent that produced it.

**All three already run the SAME underlying test, applied to three different axes of one agent's own design
(output / input / size).** This file states that test at the level that covers all three AND everything none of
the three were ever scoped to reach — a phase transition, a board-register write, an extraction watermark, a
hook-versus-prose choice, a reference-resolution check — every step of every process this corpus runs, not only
the shape of one agent. **NEVER read this file as a fourth, competing account of output/input/size** — for
those three specific questions, the three sections above stay the standing, undiluted answer; cite them, never
re-derive them here.

## THE TEST — stated once, applicable without asking each time

**A step belongs to a SCRIPT when BOTH hold:** (1) its correct output is a FIXED FUNCTION of state that already
exists on disk, in a log, or in a git ref — nothing about the correct answer depends on interpreting intent,
weighing taste, or synthesizing across sources with no fixed schema; and (2) its correctness can be CHECKED
mechanically (an exit code, a diff, a grep, a byte-exact comparison) rather than by judgment.

**A step stays with the MODEL when either fails:** the right answer depends on what was actually MEANT (not
just what was said), on a call two competent reasoners could make differently and both defend, or on
synthesizing heterogeneous, un-schema'd sources into one coherent judgment.

**WHEN you are deciding whether a step you are about to write into an agent, a hook, or a process belongs to a
script or to the model ⟶ apply this test BEFORE drafting the step, never after** — a step drafted as prose first
and tested second has already spent the ceremony this doctrine exists to prevent.

**The CEO's own framing, translated (relayed via `grimorio.system-keeper`, not independently quotable beyond
what is stated here, per grimorio-conduct rule 11): "great power comes with great responsibility."** A script
can hold a great deal — searches already known to be needed, an index, pointers, a computed fact — but the
limit has to be marked as clearly as the use: some things are simply reading, and the complete text has to
reach the model for review at delivery time. Both halves below are that same sentence, split into what is
GRANTED and what is WITHHELD, because a doctrine that only lists USES and never names LIMITS teaches half a
boundary. `agent:grimorio.system-keeper` and `agent:grimorio.prompt-writer` both hold this list — a script's
own author needs it to write clean, maintainable, understandable code to the right boundary; the agent-writer
needs it to know what a script may be asked to do before ever describing the step in prose instead.

## THE SIGNALS — six indicators that feed THE TEST, never a fourth test

A candidate step can be checked against six concrete indicators before THE TEST above is even applied — none
replaces THE TEST; each is evidence toward its SCRIPT side.

1. **DETERMINISM.** The same result, every time.
2. **AN EXTERNAL TOOL.** Someone else's, or one of this corpus's own.
3. **REPETITION.** The same actions, performed again.
4. **HARD TO DISCOVER.** Re-deducing a fixed shape — an API's own structure, a file's own layout — on every
   use, when learning it once would do.
5. **TOOL-USE OVER JUDGEMENT.** The step is about HOW you drive a tool, never about WHAT to decide.
6. **FORMATS AND COUNTS.** Line counts, parsing, verifying a shape.

**WHEN a candidate step matches several of the six signals above ⟶ treat it as a strong SCRIPT/TOOL candidate under THE TEST already stated.**

**WHEN that same candidate ALSO carries irreducible judgement — the kind THE TEST's own "stays with the MODEL" clause already names ⟶ classify it as a JOB, never a TOOL: automation covers PART of it, never the whole.**

**ALWAYS still write the automated part as a script, per the Uses list below.**

**ALWAYS name the judgement residue explicitly.**

**NEVER let that residue be silently absorbed into "the model just does it."**

**Automation ALONE is a TOOL. Automation PLUS irreducible judgement is a JOB.**

## PAYOFFS OF THE SPLIT — consequences of having made it, never inputs to THE TEST

THE SIGNALS and THE TEST above decide, BEFORE the fact, whether a step belongs to a script or to the model. What
follows is a DIFFERENT thing: not evidence for that decision, but what a step GAINS once the decision has
already been made and the split already built. **The CEO named this distinction himself, this session,
translated (relayed via `grimorio.system-keeper`, not independently quotable beyond what is stated here, per
grimorio-conduct rule 11): "it's one more component of the symbiosis, add it as such, because it isn't its only
objective."**

**NEVER fold either payoff below into THE SIGNALS above.** **NEVER treat either payoff as an input to THE TEST
above.** Both payoffs below are REASONS the split is worth obeying once it exists, never a seventh SIGNAL and
never a new branch of THE TEST's own classification logic.

**PAYOFF 1 — TESTABILITY.** The split (script gathers DATA → model decides → script VERIFIES) is what makes a
step debuggable at all: a step built this way can be exercised by stubbing the model half with a synthetic
output and asserting on both script halves; a step that is only a line of prose cannot be exercised at all —
there is nothing to stub, and nothing to check it against but re-reading the prose itself.

**The CEO's own quote, translated (relayed via `grimorio.system-keeper`, not independently quotable beyond what
is stated here, per grimorio-conduct rule 11): "at first I did symbiosis for tokens... but now I really realize
how hard it is to debug whether an agent does what it's supposed to do — if everything has a program underneath
that leaves less room for agent judgment, or at least carries me through it, I can create a kind of mock for the
LLM and actually test it."**

Measured exemplar: `ref:repo/scripts/selftest/spawn-verbatim-origin-gate.mjs` feeds synthetic prompts standing
in for what an agent would write and asserts ALLOW or DENY — that IS a mock of the model half. Its case BG2
(`ref:repo/scripts/selftest/spawn-verbatim-origin-gate.mjs:443-449`) asserts that a background hand-back plus a
genuine new CEO turn afterward must DENY: it asserts `"permissionDecision":"deny"` and that the deny message
names "ELEMENT 3".

Measured counter-exemplar — the LIMIT of the mechanism, not a second success: two gates state their own
override in FAILURE TEXT that no code reads, not in anything mockable. `ref:repo/scripts/pre-commit.sh:138`'s
`fail` message ends "...or, if this is a deliberate new corpus convention, say so in the commit message.", and
`ref:skill/grimorio.prompt-writing-quality/format-guide.md#when-an-anchor-is-owed--the-readers-cost-not-the-citing-sentence`'s
KIND-name exemption (the project/behavior/SKILL carve-out) likewise lives only in its own prose.
A gate whose contract lives only in its own error-message prose, never in code, cannot be mocked the way BG2
can — which is exactly why nobody found a missing escape for weeks; it was found by colliding with it, not by
testing it.

**PAYOFF 2 — SELF-DESCRIPTION.** Well-written symbiosis scripts let the system describe itself, in a medium an
agent reads better than prose. The alternative is a hand-maintained description of a live system, which drifts
by construction and drifts silently — the SAME disease a hand-maintained inventory of what a system actually
does always carries, and the same fix: GENERATE the description instead of hand-maintaining it.

**The CEO's own quote, translated, from a separate turn — a separate idea, never a restatement of PAYOFF 1's own
quote above (relayed via `grimorio.system-keeper`, not independently quotable beyond what is stated here, per
grimorio-conduct rule 11): "now instead of auto-discoveries... if we start writing the new symbiosis scripts
well, the code itself can start to be discovered on its own, and in a language more understandable to AIs than
prose."**

Measured exemplar: `ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does`
labels `ref:repo/scripts/pre-commit.sh` "the only OTHER place anything still REFUSES," while
`ref:repo/scripts/pre-push.sh` — wired into `.git/hooks/pre-push` since 2026-08-06, measured via `git log` on
`ref:repo/scripts/install-hooks.sh`/`ref:repo/scripts/pre-push.sh` — ALSO refuses, and the string "pre-push"
appears ZERO times anywhere in `ref:repo/.grimorio/GRIMORIO-CHAIN.md`.
The cause, also measured: `ref:repo/scripts/audit-chain.mjs` validates TEXT references (dead pointers, anchors) and
never reads live wiring at all — zero matches for `ref:repo/.claude/settings.json`, `.git/hooks`, `pre-commit`, or `pre-push`
anywhere in that script. Nothing ever compared the chain doc's own claims against what is actually wired.

**NEVER build the fix this payoff names here — name the shape only.** A gate-inventory generator, derivable
from `ref:repo/.claude/settings.json`'s own hook registry, `.git/hooks/`, and each gate script's own `fail()` call sites, would
let a chain doc like `ref:repo/.grimorio/GRIMORIO-CHAIN.md` regenerate itself from live wiring instead of drifting
from it — the same GENERATE-not-hand-maintain fix PAYOFF 2 names above, not a new one. This is a worked
CONSEQUENCE of PAYOFF 2, stated
so it is understood, never a task this section authorizes anyone to pick up.

## Uses — what a script may hold

**Every entry below is ALREADY BUILT and ALREADY MEASURED in this corpus, never a hypothetical — cite the
instance, never invent one to illustrate a use this corpus has not actually exercised.**

1. **PHASE/STATE TRANSITIONS.** `ref:repo/.grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs` hands
   out the next node instead of an agent narrating a transition in prose — "which phase comes next" is a fixed
   function of the current node and the declared condition, checkable by a table lookup, never a judgment call.
2. **DETERMINISTIC CHECK REPORTS.** A script's own scan result (findings of a file-size/comment-length/
   reference-resolution scan) is handed to the agent as a fact to reason FROM; the agent never re-derives the
   tooling that produces it — `check-comment-blocks.mjs`, `check-agent-tiers.mjs`, `audit-chain.mjs` are the
   standing exemplars.
3. **WATERMARKS AND DELTAS.** `extract-cleaner`'s watermark makes "what is new since last time" a mechanical
   delta against a persisted hash, never a topic-boundary judgment a model re-derives every run.
4. **GATES THAT ACTUALLY FIRE.** A rule enforced by an actual gate fired reliably; an identical rule stated only
   in prose, with no gate, fired inconsistently across otherwise-identical runs — the difference was never the
   rule's wording, it was whether a script, not good faith, carried it.
5. **SET-MEMBERSHIP VERIFICATION.** A claimed check is trusted only once it is verified by SET MEMBERSHIP
   against a live, re-read source (does the register actually contain this entry, checked by a fresh read) —
   never by trusting a self-report that claims the check ran.
6. **LABEL-VS-MECHANISM VERIFICATION.** A window's own LABEL ("20 turns") was compared against what the window
   actually covered and found to silently drop turns sent with a file open in the IDE — the label was prose
   describing a mechanism nobody had mechanically verified matched its own claim.
7. **INDEX-AND-POINTERS — DIFFERENT from use 2 above, never confused with it.** Use 2 hands the agent a FACT a
   script already computed; this use hands the agent an INDEX plus a byte/line-range POINTER into content the
   script never read for relevance at all — "this is between line X and line Y; if you need it, read it,
   search it" — and defers the READ decision itself to the model, rather than the script pre-judging what
   matters. Two already-built instances, never generalised under this name before now: `extract-cleaner`'s own
   persisted watermark, read again here as an INDEX of what has already been handed out (the model decides what,
   if anything, to re-examine, never the script) — the SAME mechanism as use 3 above, cited a second time
   because it is genuinely both an index AND a delta, not two different scripts; and `phase-server.mjs`'s own
   one-phase-at-a-time hand-off — the script holds the FULL chain as an index, and hands the agent only the
   pointer to the next phase's own file, never the whole chain's content at once — the SAME mechanism as use 1
   above, cited a second time for the identical reason.
8. **GRAPH PLANNING (designed, not yet built).** An agent currently re-derives, in prose, from the Independence
   Test's three questions, whether two targets are independent, every single time it plans a fan-out
   (ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10). Whether two
   targets touch disjoint files with no cross-reference in either one's own spec is a checkable FACT — a
   file-overlap and cross-reference scan. The design: a script computes a DRAFT independence graph from the
   target list and hands it to the planning agent as a fact to confirm or override; the agent's own judgment is
   reserved for non-file-based coupling (shared runtime behavior, ordering that matters for reasons no static
   scan sees) — never for re-deriving the whole graph from nothing. Registered, not yet built:
   `ref:memory/grimorio.board-memory/grimorio-backlog.md#phase-enginemjss-four-remaining-designed-only-subcommands-c7-2026-09-17-substrate-migrated-2026-09-22`,
   subcommand (c), `plan-graph <target-list-file>`.
9. **ARTIFACT CREATION (designed, not yet built).** Creating a new file of a known KIND (a skill topic file, a
   phase file, a design doc) currently means re-deriving its own mandatory-sections boilerplate from the
   authoring skill's prose each time. The design: a generator script, keyed on KIND, emits the skeleton
   pre-stubbed with every mandatory section a file of that kind owes — the model's own work starts at the first
   genuinely-judgment-bearing sentence, never at "what headings does a topic file need." Registered, not yet
   built:
   `ref:memory/grimorio.board-memory/grimorio-backlog.md#phase-enginemjss-four-remaining-designed-only-subcommands-c7-2026-09-17-substrate-migrated-2026-09-22`,
   subcommand (d), `artifact-scaffold <kind> <name>`.
10. **OUTPUT FORMAT (designed, not yet built).** A report's own SHAPE (verdict-first, a themed table, an
    explicit VERIFIED/COULD NOT close) is currently re-derived from ref:skill/grimorio.report-design's own prose
    description on every report. The design: a linter checks the mechanical half of that shape (a verdict line
    present, a table present, a close line present) without ever touching the CONTENT of the verdict — same
    split, applied to the corpus's own reporting surface. Registered, not yet built:
    `ref:memory/grimorio.board-memory/grimorio-backlog.md#phase-enginemjss-four-remaining-designed-only-subcommands-c7-2026-09-17-substrate-migrated-2026-09-22`,
    subcommand (e), `check-format <report-file>`.
11. **DETERMINISTIC CHECK REPORTS, cited a second time — same family as use 2 above, a separate script closing
    a separate gate.** `ref:repo/scripts/registration-cost.mjs` counts lines across a caller-named file list,
    prints one `  <count>  <path>` line per file plus a `TOTAL:` line, and exits 0 (or exits 1 with a usage
    message on zero file arguments); `grimorio.system-keeper`'s own
    ref:skill/grimorio.agent-writing/system-keeper-phases/phase-b-placement-authoring.md's own step 8
    REGISTRATION-COST THRESHOLD gate now reads that `TOTAL:` line as the fact to compare against the
    mechanical-volume saving estimate, rather than the agent re-deriving the sum by hand across several
    `audit-chain.mjs --shape` calls.

## Limits — what a script must never decide

**Both entries below are genuinely MEASURED violations, not hypotheticals — the same discipline as the USES
list above, applied to the boundary's OTHER side.**

1. **JUDGMENT ABOUT RELEVANCE, DISGUISED AS FILTERING.** The main loop's own hand-rolled extractor filtered the
   CEO's own turns by a keyword match and a leading-angle-bracket heuristic — that is JUDGMENT, deciding what
   mattered, performed by pattern-matching inside a script instead of a model, and it silently dropped four of
   his real turns. **The distinguishing principle: a script may INDEX or FILTER by a criterion a MODEL already
   decided and handed it (use 7 above); it may never DECIDE the criterion itself.** A keyword list or a
   structural heuristic standing in for "which turns actually matter" is exactly this limit crossed — no
   pattern-matcher gets to silently decide relevance a model was never asked to confirm.
2. **THE PRINCIPAL'S OWN LANGUAGE, HARDCODED INTO LOGIC.** `.claude/hooks/turn-ledger-lib.mjs` hardcodes its own
   parsing logic around Spanish-language tokens — verified live, this pass: 27+ occurrences of
   `DECLARO`/`CIERRO`/`PENDIENTE`/`categoría` alone, plus five hardcoded category-name literals
   (`peticion`/`ejecucion`/`evaluacion`/`idea`/`diagnostico`), each appearing multiple times, all baked directly
   into the file's own regular expressions and comparisons. **The distinguishing principle, stated explicitly so
   it is never confused with use 4 above (a script EMITTING a format some model or author already chose is
   legitimate — formatting/templating is mechanical): a script HARDCODING that format's own WORDS in ONE
   SPECIFIC LANGUAGE, inside its own decision logic, is not** — it makes a corpus meant to be portable silently
   depend on the principal's own language, with no seam anywhere for a different installation to use its own.
   **Fix-shape named, not built — a backlog candidate, the same standing as the three designed-only USES
   above:** those tokens belong in a per-installation config file, defaulting to English, read by the script at
   runtime, never hardcoded inside its own parsing logic.

## The corollary for a judgment that currently sits with a strong model only because its own procedure was never written down

Haiku's own failure on a task like "does this follow SOLID" is not a capability ceiling — per the CEO's own
diagnosis, translated, it fails because the STEPS, the PROCESS, the CHAIN OF THOUGHT are missing, not because
the judgment is inherently un-scriptable. **This means a judgment
that currently sits with a strong model is not a PERMANENT classification — it is a classification that holds
only until its own procedure is written down.** The fix is an ANALYSIS-CAPTURE PROTOCOL, not a standing
model-only label — a way of moving an entry from the LIMITS list above into the USES list, once its own
procedure is actually written down, never a way of moving an entry the other direction.

**ALWAYS run this protocol the FIRST time a strong model performs a judgment expected to recur, before treating
that judgment as permanently model-only:**

1. **ASK the strong model, as an ordinary question** — never an extraction or circumvention of anything — what
   STRATEGY it actually followed: the enumerated sub-checks it performed, in order, to reach its verdict.
2. **CAPTURE that enumerated strategy once**, saved as a named PROCEDURE — a checklist, never a restatement of
   the original vague question.
3. **RE-CLASSIFY every sub-check in the captured procedure against THE TEST above.** A sub-check that is itself
   deterministic (does file X exist, does pattern Y match, is count Z over a threshold) becomes a SCRIPT; a
   sub-check that remains genuinely interpretive is handed to a SMALLER model as a literal, narrow, one-at-a-time
   instruction — never the original open-ended question restated whole.
4. **FEED the where-to-look output of that enumerated procedure into a TRIAGE pass** — which regions of the
   target need the expensive judgment at all, versus which are mechanically already known to be clean.

**agent:grimorio.code-reviewer's own bounded Haiku triage panel** (raised via agent:grimorio.scout, per
ref:skill/grimorio.conduct#spawning-an-agent rule 9e) is the ALREADY-BUILT exemplar of exactly this shape: the
panel collects facts and marks regions, the reviewer alone still signs the verdict — collection delegated,
judgment never delegated. This doctrine generalises that ONE instance into a reusable protocol any agent can
apply to its own recurring judgment, rather than each agent re-discovering the same shape independently.

## Self-application — the keeper's own remaining apparatus, per this doctrine's own closing obligation

**A doctrine that classifies every step but its own author's is not finished being applied.** Three of
agent:grimorio.system-keeper's own standing phases are prose-driven judgment calls the keeper re-derives every
dispatch, even though each is a checklist of already-scripted tools (`ref:repo/scripts/audit-chain.mjs`,
`ref:repo/scripts/hook-conditions.mjs`, `ref:repo/scripts/check-agent-tiers.mjs`, `ref:repo/scripts/selftest/parked-watch.sh`):
Phase A's own step 7 baseline-audit-toolchain run, Phase B's own Independence-Test graph derivation, and Phase
C's own post-authoring toolchain re-run.

**Four of the keeper's own OTHER prose-driven mechanical checks — distinct from the three named above — are
wired to a named, runnable command, each replacing what would otherwise be a vague "consult"/"OPENING"/"a
comparison" instruction with the literal command the agent runs:**
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-a-intake-diagnosis.md's own Part 2 step 2
(index/hooks consult) runs `grep`/`ls` against the named capability;
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-c-verification-review.md's own Part 1 step 1
(pointer verification) runs `audit-chain.mjs --dead`/`--anchors` output grepped for the touched file — neither
flag carries its own `[filter]`, verified live, so the grep match against the printed lines is the real
scoped signal, never the script's own corpus-wide exit code — and Part 1 step 3's first bullet (the
monotonic-growth check) runs `git diff --stat`; and
ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-improve-and-validate-mode.md's own step 4
(the firing-log query) runs a `node -e` one-liner since `jq` is not installed in this environment, confirmed
live, and step 5a (the byte-diff gate) runs `cmp -s`.

**The keeper's own remaining apparatus, named here rather than silently exempted from its own doctrine, is ONE
item:** Phase B's own Part 1 step 4 Independence-Test application, run in prose every pass. This is the
concrete candidate for USE 8 above ("Graph planning") — the keeper is this doctrine's own first-in-line
applicant once `plan-graph` exists, not an agent this doctrine stops short of reaching.
