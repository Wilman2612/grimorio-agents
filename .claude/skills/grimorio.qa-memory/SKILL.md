---
name: grimorio.qa-memory
description: "Semantic memory for the QA agent. SKILL.md (general) = universal testing principles, AAA structure, the four coverage quadrants, test-layer selection, weak-test anti-patterns, and streaming test patterns. For this project's test suite and framework (project/code) read ./project.md."
---

# QA Memory — General: Universal Testing Principles

## WHO READS YOUR TESTS, AND WHAT THAT DEMANDS (CEO, 2026-07-30)

**He does not read code, and he does not read tests either.** His words (translated): *"I barely read raw code
anymore… I don't read tests either."* So a green suite is not a deliverable to him — it is a claim he cannot check. What he does instead:

> (translated) *"What I do is SEE that the tests are generating the right thing. I'd expect to be able to open
> Playwright, click, and watch all the workflows being created. Or open the browser and walk through all your
> test cases VISUALLY. If I wanted to see the workflows execute: even if I don't create it through the UI, when
> I create it via the database and bring up the UI, I'll be able to see the workflow — that's how I know you're
> validating everything."*

**ALWAYS make the top of the pyramid WATCHABLE.** A run he can click through and observe is the artifact; the
assertions are how it fails, not how he reads it. Concretely, for anything he will judge:
- the case list is traversable in a real browser, one visible state at a time;
- state seeded through the DATA layer must SHOW UP in the UI — that round trip is what proves the validation
  chain, and it is the check he named himself;
- a failure names what it expected in words a non-author can act on.

**NEVER treat unit tests as the proof of a feature.** His words (translated): *"unit tests are almost invisible
to me — they should exist so YOU can verify something you want to pin down, but not because I'm going to review
them or because they're the main mechanism."* They are yours, for pinning a specific branch or a residual assertion the bigger test
structurally cannot make. That is exactly why the pyramid is inverted here, and this is the reason.

**ALWAYS prove a claim with a test that was seen RED first, never with a report.** If you say it works, the test
proving it exists and you watched it fail for the right reason before it passed.

**And the ideal he stated: he should not have to raise the application at all.** (translated) *"The ideal is that
I don't have to boot the application — but the truth is I have to boot it to see that you're doing things correctly."*
Every time he has to boot it himself to check something, that is a test you did not write.


> The `qa-report.md` output format lives in ./behavior.md → `## OUTPUT`. This skill holds the *testing knowledge* the QA agent applies.

## HOW TO PLAN A FEATURE'S TESTS — start at the TOP, and split the PIPE from the VARIATIONS

**This is the first thing to do, before writing a single test.** It is a CEO ruling (2026-07-29) and it is
project-agnostic. It was previously written down only as one milestone's rungs, inside a product ledger the QA
agent does not read — which is why it kept not being applied.

> (translated) "You start from the top, not from the bottom."

The two moves, in order:

**1. Test the PIPE once, at full-stack.** Walk the real chain end to end, one time, with a few tests — not every
case. For the workflow builder that is exactly: the nodes can be ADDED and EDITED · saving GENERATES the workflow
JSON (save = produce the JSON, that is its state) · **Run is a SEPARATE action** that reads that JSON in the
backend and runs the game · and the game actually runs and can be inspected. In his words:

> (translated) "I don't need every workflow, every variation of the workflow you want to test, to go through
> that whole mechanism. It can be separated."

**2. Test the VARIATIONS at integration.** Once the pipe is proven, every variation is a cheaper question asked
directly of the artifact the pipe produces:

> (translated) "The other tests then vary: hey, the workflow already recorded in JSON does what it says it has to do."

**Then, and only then, drop to unit** — for what those two layers structurally cannot reach:

> (translated) "If you want to check 'hey, this button, this exception somewhere, is it logging the right thing,
> is it using such-and-such class, such-and-such adapter' — whatever can't be tested through that, you write unit tests."

### Where E2E sits — the happy-path floor, not an on-demand layer (CEO, 2026-08-13)

**ALWAYS give every feature's happy path a full-stack (local) test — the browser-driven, watchable layer
defined below under "Full-stack (local)" — BEFORE any integration or unit test written for that feature.**
**NEVER leave that floor on-demand or deferred to a pre-publish pass.** His own words, translated: *"tested
top to bottom: end-to-end first, because I review in e2e. I should not have any need to go and test. ALL the
happy paths should be tested, at minimum, in e2e."*

This is not a new layer — it IS move 1 above ("Test the PIPE once, at full-stack") applied PER FEATURE rather
than once for the whole product, ever. "Test the pipe once" forbids re-walking an ALREADY-PROVEN mechanism once
per VARIATION of it; it never excused a feature's happy path from being proven at that layer AT ALL.

"On demand, or before a publish to production" still names a real tier — the separate, more expensive
**deployed-E2E** smoke tier (item 1, "E2E (deployed)", under "Test Layer Selection" below: the deployed
system, real external services, a real deploy). That tier stays occasional. It never described this floor, and
the two must not be read as one layer — the mislabeling is the defect this rewrite fixes.

This reconciles with, and does not overturn, the 2026-07-29 ruling above ("You start from the top, not from the
bottom") — both rulings are top-down, full-stack/e2e-first; only the mislabeling is removed here, not the
method.

**The diagnostic that catches the usual error:** if the same mechanism is being walked end-to-end once per
variation, the plan is wrong — the pipe and the variations have not been separated. Pushing N workflows through
the full chain buys one fact N times and never asks the cheap question directly.

This composes with the pyramid note below: *weight upward* says which layer catches real bugs; *pipe vs
variations* says how to avoid paying the top layer's price N times.

---

## Principles (project-agnostic)

- **Tests are the living spec**: each acceptance criterion, architectural constraint, and edge case needs a test that would FAIL if the behavior changed.
- **The pyramid shape is a human-authoring-cost artifact, not a value ranking — for AI-built code, weight upward.** The classic pyramid (many unit, fewer integration, minimal E2E) optimizes for what's CHEAP for a human to hand-write, not for what's most likely to catch a real bug. Don't write a heavier-layer test where a lighter one proves the behavior — but for a feature an AI agent both implemented AND unit-tested, a green unit suite proves only that the code matches the SAME mental model that wrote it; it cannot catch a blind spot shared between the implementation and its own accompanying test (the exact way a subtly-wrong design reads as "tested" and ships anyway). An integration/full-stack run against real infrastructure (real DB, real services, a real browser) is structurally able to catch what no amount of additional unit tests can, because it doesn't share the author's blind spot. Still write the unit tests (they're cheap, fast, and pin down logic precisely) — but treat at least one real integration/full-stack run per feature that touches persistence or a live contract as NON-OPTIONAL, not a "nice to have if time allows."
- **Isolate what you own**: unit tests mock everything external; integration tests use real infrastructure; never combine both in one test.
- **Tests must be deterministic**: a flaky test is a bug. If it passes sometimes, it is not a valid test.

---

## Arrange → Act → Assert

| Phase | Contains | Anti-pattern |
|---|---|---|
| Arrange | All inputs, mocks, preconditions | Setting up state inside Act — the cause becomes invisible |
| Act | Exactly one operation — the behavior under test | Multiple operations — failure is ambiguous |
| Assert | The exact observable outcome (return, side effect, state) | Asserting internals — breaks on refactor without behavior change |

**One behavior per test**: the name must complete "it should…". If it needs "and", split it. Each test runs independently — no order dependence; reset shared state in `beforeEach`.

---

## Coverage Planning (answer before writing tests)

1. Behaviors to validate (primary behavior per acceptance criterion).
2. Most likely failure modes per changed file (how could the change be subtly wrong?).
3. Edge cases not in the ACs (empty, zero, negative, concurrent).
4. Test layer per behavior (see selection below).
5. Regression risks from the changed files.
6. Untestable-criteria check: each AC is testable in some layer OR is a hardware feature for the manual-verifier. Otherwise flag it as a coverage gap with a suggested manual check or a PO reword.

## Bug-fix workflow — reproduce before you fix

When the task is fixing a REPORTED failure, the first test you write is not a unit test — it is a
**reproduction of the actual failure, using the real path that surfaced it** (the real caller, the real
steps, the real integration point — if it was hit through the UI, reproduce it through the UI; if it was
hit through a real service call, reproduce it through a real service call). This is the test that proves
your hypothesis about the bug is correct, not a synthetic isolated unit around a function you assume is
the cause. Confirm it fails for the DIAGNOSED reason (not a different one), then fix, then confirm it goes
green. A narrow unit test around an isolated function can pass cleanly while the real reported bug is
still live, if the unit never exercises the actual path that broke — this is exactly how a "fixed, tests
green" bug ships still broken.

## THE BREAK-PROOF — a test you have not SEEN fail is not evidence

**Repo standing rule, and it is an EXECUTED step, not a thought experiment.** "Would my assertion catch it?"
is reasoning, and reasoning is what produced five verification probes in one session (2026-07-28) that all
failed toward *everything is fine*. The step is mechanical:

1. Land the test and watch it pass.
2. **MUTATE the real code** the test claims to protect — invert the condition, drop the guard, return the
   wrong constant. Not the test; the code.
3. Watch it go **RED**. If it stays green, the test proves something other than what you think.
4. Restore the code, re-run, confirm green **and** confirm the tree is clean (`git status`) — a mutation left behind is worse than no test.

State in your report which tests were break-proofed and how. A test whose failure nobody has observed is a
claim, not a probe — the same rule applies to any adversarial GATE that has only ever returned PASS: plant
the violation, watch it refuse.

## The hand-written EXPECTED OBJECT — the sibling of the doubled collaborator

Writing the expected payload by hand and asserting the code produces it proves **the author's model of the
payload**, not the payload the real consumer accepts. It passes while production rejects the message: the
two agree with each other and neither was checked against the thing that actually parses it.

The tell is a literal object/dict in the test that mirrors the shape the code under test builds. Fix it the
same way as a doubled collaborator — assert against the REAL consumer, a committed fixture both sides read,
or a schema that is the single source of truth. **If the expectation and the implementation were authored by
the same pass, they are one claim, not two.** This is how M8 was reported as advanced on a green test that
asserted the wrong surface.

## A doubled collaborator proves the double, not the claim (CEO, 2026-07-28)

**The general rule, and it decides most of what follows in this file:** when every collaborator is replaced
by a double, the test proves the doubles were configured. It cannot prove anything about how the real pieces
connect — the caller can change, the route can be reached another way, the wiring can break — and the test
stays green throughout. (translated) *"You'd be testing the mocks. The route could be called another way, or the
method that invokes it could change."*

So a claim of the form *"X is enforced"*, *"Y is reachable only by Z"*, *"A and B agree"* is provable ONLY at
a layer where the real pieces meet. A solitary unit test asserting it is not weak evidence — it is evidence
for a different, weaker statement, and the two are easy to confuse because they read alike.

**The replacement shape: ONE parameterized integration test over a TABLE**, in the shape of an xUnit theory
with inline data — one body, one row per case — rather than one test function per case. That is what makes an
integration test cheap enough to replace a pile of units instead of merely joining them.

**Worked example (the case that produced this rule).** A handler test doubled both repositories and asserted
`{ok:false, code:"FORBIDDEN"}` against an invented owner. It read as "a stranger cannot read another player's
transcript". What it actually proved was "this function returns that object when you lie to it about who the
owner is" — two different sentences, and only one of them is reassuring. It could not catch a broken
middleware, a route that never reaches the handler, or a requester id read wrongly from the token. The
replacement is one table over every protected route × {anonymous, non-owner, owner}.

**Generalise it rather than copying it.** The same substitution applies wherever a claim spans pieces:
cross-language agreement (one table of fixtures read by both languages, not two suites asserting separately),
persistence round-trips, cap and budget enforcement, anything where the interesting failure is in the seam.
**Ask what the claim actually spans; if it spans a seam, no amount of unit tests reaches it.**

**And the corollary that protects you from doing this backwards: build the replacement FIRST, watch it fail
when the behaviour is broken, and only then delete what it supersedes.** Deleting first loses coverage, and a
table that has never been seen to fail is worse than the scattered units it replaced — it looks like broad
coverage and is not.

---

## Test Layer Selection — pick by the CLAIM, not by what's cheapest to write

Choose the test's scope by the specific claim you are trying to prove: include every system genuinely
UNDER TEST (and whatever is structurally required to reach it), and deliberately EXCLUDE systems that are
irrelevant to that claim — e.g. proving "combat resolves correctly" needs no real auth, because auth is
not the thing being proven; standing up real auth there is wasted scope, not rigor. Then, within the scope
the claim needs, write the STRONGEST test that proves the target behavior FIRST — the one covering the
most real surface — and add a narrower unit test only for a residual assertion the strong test structurally
cannot make (a specific exception is thrown, a specific lock blocks, a specific branch executes). Never the
reverse order (many units first, a heavier test added later "if time allows" — that's how the pyramid
becomes an excuse instead of a shape).

**Worked example (battle/combat logic, no UI yet):** a unit test here only proves "the classes behave
correctly in isolation." An integration test — spin up the backend, create a match through the data layer
directly (skip auth, it isn't under test), stream a real sequence of battle events at it, inspect the end
state — proves the actual behavior end-to-end and covers far more real surface in one test than a pile of
per-class units. Add unit tests afterward only for the specific residual assertions integration can't
cleanly make.

**Worked example (the UI already exists, proving the whole product):** once a real UI exists, drive the
REAL browser over the full local stack (e.g. Playwright) clicking through the actual user flow. This is
deliberately different from the combat example — it proves TWO different things, and you should know which
one you're actually claiming: (a) "the frontend doesn't break" (a UI-smoke claim) vs (b) "the whole system
functions together, frontend included" (the real integration claim). Don't let one stand in for the other.

1. Needs the **deployed** system + real external services (real auth / payments / model provider, cloud env) → **E2E (deployed)** — smoke / release confidence only, minimal.
2. Needs a **real browser driving the real UI over a real (local) backend** → **Full-stack (local)** — the whole flow wired and run locally, expensive externals stubbed (see the tier below).
3. Needs a real DB or external service, **no UI** → **Integration**.
4. Exercises business logic with no I/O → **Unit**.
5. Unsure → **Integration** (catches more real failures than unit alone).

## Full-stack (local) — the tier between integration and deployed-E2E

The highest-fidelity test you can run **without deploying**. It **reuses the integration harness verbatim** —
real services wired together, a real (local, Docker) database, real HTTP between them — and adds the one thing
integration lacks: it **stands up the real UI in a real browser** and drives the actual user flow through it,
asserting on BOTH the screen and the persisted backend state.

- **Reuses (from integration):** real service wiring, real transport, a real DB — **local Docker, destroyable,
  never a cloud/prod DB**. Same setup, near-identical cost.
- **Adds (over integration):** the real UI driven by a real browser (Playwright), so it catches what an
  API-level integration test cannot — the frontend↔backend contract and the actual click-path a user takes.
- **This tier is the mandatory happy-path floor** — every feature's happy path is proven here before any
  narrower layer, never on demand: see "Where E2E sits" above
  (ref:skill/grimorio.qa-memory#where-e2e-sits--the-happy-path-floor-not-an-on-demand-layer-ceo-2026-08-13).
- **Cheaper / more deterministic than deployed-E2E because** it runs entirely on the local machine with the
  expensive, brittle externals stubbed or cheapened: a fake or low-cost model instead of the real provider, a
  local Docker DB instead of the cloud, test-mode auth instead of real SSO, **no deploy**. Fast enough to run often.
- **Use it to** prove a whole user flow end-to-end (e.g. author → run → replay) and to catch **cross-boundary
  defects** unit + integration miss — transport / serialization / content-contract drift between two correct
  systems. Keep it thin above integration; it does not replace unit/integration coverage.
- **Capture screenshots at meaningful checkpoints during the run, not just assertions.** A full-stack run
  that only asserts pass/fail throws away the one thing a manual pass uniquely provided: photographic
  evidence of what the state actually looked like at each step. Screenshotting inside the automated run
  (before/after each user-facing state change) turns the same run into both functional proof AND visual
  evidence — this is *why* manual-verifier's necessity drops once qa runs real full-stack: qa's own run now
  answers "does this actually work, and here's what it looked like," not just "the assertion passed."
- **It is NOT a replacement for the manual-verifier — but it substantially lowers how much manual-verifier
  is needed.** This tier is automated and repeatable (asserted, CI-runnable); manual-verifier is a
  human-like open-ended *visual* exploration (does anything look wrong beyond what anyone thought to
  assert?) over the same running app. When a full-stack run already screenshotted the relevant states,
  route manual-verifier to a LIGHTER, happy-path/spot-check pass over what qa's screenshots already cover,
  not a full independent re-verification — reserve full-weight manual-verifier for surfaces with real
  visual/UX nuance qa's functional assertions wouldn't think to check (layout, contrast, an unexpected
  element, a state qa's script never drove). Never use "qa already ran full-stack" as a reason to skip
  manual-verifier entirely on a feature with meaningful new UI — only as a reason to make its pass lighter.

-> This project's full-stack-local recipe (ports, the local Docker DB, the model-provider seam, test-auth):
   `./project.md` (project/code).

## Four Coverage Quadrants (per behavior)

| Quadrant | Test |
|---|---|
| Happy path | Valid input → expected output |
| Boundary values | The exact edge (limit = 5: test 4, 5, 6) |
| Invalid input | Malformed/missing/out-of-range → typed error |
| Unauthorized access | No auth / wrong role / other user's resource → 401/403 |

---

## Weak-Test Anti-Patterns

| Anti-pattern | Why weak |
|---|---|
| `expect(fn).not.toThrow()` | Any return value passes — proves nothing |
| `expect(result).toBeDefined()` | Passes for `{}` or `[]` |
| `expect(spy).toHaveBeenCalled()` | Doesn't check arguments — a wrong call passes |
| Asserting only the happy path on branching code | The branch is untested |

For every test ask: *"If someone flipped a condition, removed a branch, returned the wrong value, or skipped a side effect — would my assertion catch it?"* If no, strengthen it. **Never weaken an assertion to make a test pass** — if the implementation is incomplete, the status is FAIL.

---

## Streaming / Async Test Patterns

When the change involves streaming or async delivery, cover: **protocol (unit)** — correct output for valid input; chunks split mid-token; empty chunks, malformed lines, EOF. **Server (integration)** — declared `Content-Type`; body matches the protocol for a known input; N fragments → N units. **Client (unit)** — each frame applied to state correctly; N fragments → N messages; error state on mid-stream interruption. **State transitions (unit)** — one test per named transition.

-> This project's test framework/assertion API and suite layout: read ./project.md (there is no `test-suite.md`; its content was folded into `./project.md`)
-> The `qa-report.md` output format: ./behavior.md → `## OUTPUT`

## Judging whether a test EARNS its place: mutate the guarantee, not the file

A test suite cannot be judged by volume. "1,842 production lines against 3,851 test lines" is a real smell worth
investigating and it is **not** a finding — it does not distinguish a duplicated guarantee from a sole guard, and
those have opposite correct actions.

**The only instrument that distinguishes them is mutation, aimed at the guarantee:**

1. Name the specific guarantee the test claims (a bound, a refusal, an ordering, a message).
2. Break exactly that in the production code.
3. Re-run the suite **with the test under audit EXCLUDED**.
4. Three outcomes, three different actions:
   - **Something else goes red** → the case is DUPLICATED. Delete it and name the test that now owns it.
   - **Nothing goes red** → the case is the SOLE GUARD. Keep it, and say so. Deleting it leaves the limit
     unguarded with the tree still green — strictly worse than the clutter it was accused of being.
   - **Nothing goes red even WITH it** → the test does not guard what it claims. That is the real defect.

### Two traps that produced wrong answers on 2026-07-29, both mine

**The detection signal.** Three consecutive audits of the same three caps gave three different answers, because
the pass/fail was scraped with `grep` from vitest output that carries ANSI escapes. Use the **process exit
code**, and establish a clean baseline first (mutate nothing, confirm zero failures). A mutation harness whose
own signal is unreliable manufactures conclusions in both directions — it reported redundancy that did not exist
AND sole-guarding that did not exist.

**Auditing the file instead of its guarantees.** I mutated three exported caps and concluded things about a
15-case file that barely touches them. Its real subjects were JSONLogic depth bounds, schema size caps, whether
a refusal NAMES the offending node, and whether the refusal came from the BOUND rather than from a fail-closed
catch — with positive controls for each. **Read the case names before designing the mutation.** A file full of
bounds-with-positive-controls is security-boundary testing, not the lazy doubled-collaborator kind, and volume
alone cannot tell them apart.

---

## Why mutation is the standard here, in one line

A test is a **claim** about the code, and a claim with no refutation condition is not evidence — mutation is
simply what refuting a test's claim looks like. The rule is not QA-specific and does not live here: it binds
every check, guard, gate, parity claim, and reported number, by anyone.
-> ref:skill/grimorio.reasoning-principles → "MEASURING IS NOT PROVING".
