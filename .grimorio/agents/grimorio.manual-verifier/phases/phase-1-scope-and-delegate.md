# Manual Verifier — Phase 1: SCOPE-AND-DELEGATE

## The question this phase answers

What exactly is being verified, and should this run solo or fan out? Nothing else. This phase does not run a
sanity baseline, does not verify a single acceptance criterion, and does not open a browser — it only
establishes the scope, what it affects, and how the work ahead gets divided (or doesn't), so every later phase
(or every fanned-out child) has real, bounded ground to work from.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct, ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently assumed.**

## Steps

1. **This phase's graph is ONE of THREE branches — a PARENT
   fan-out branch, a PARENT solo branch, or a CHILD branch:**
   - **PARENT, fan-out branch**: a SELF node (declare the scope, check for a prior report, build the Impact
     Matrix, evaluate the FAN-OUT BRANCH gate) fanning out into N agent:grimorio.manual-verifier `haiku`
     children — one per scripted click-path or one route's screenshot capture — foreground and synchronous,
     WHEN the gate holds.
   - **PARENT, solo branch**: a SELF node alone (declare the scope, check for a prior report, build the Impact
     Matrix, evaluate the gate), proceeding solo, WHEN the gate does not hold.
   - **CHILD branch**: a SELF node that skips straight to Phase 2 — no scope-declaration, no Impact-Matrix
     build, no gate evaluation — WHEN this invocation's own brief identifies it as a fanned-out child.

   This agent never invokes any OTHER agent type, in any phase, ever — the only agent this chain ever spawns is
   a same-type child of itself, and only from the PARENT fan-out branch above.

1a. **WHEN this invocation's own brief identifies it as a fanned-out CHILD ⟶ skip directly to Phase 2 — never
   run steps 2-5 below** (this phase's entire remaining scope-declaration, Impact-Matrix-build, and FAN-OUT
   BRANCH work).

2. **Declare the scope.** The scope tells you what's being verified. Without it, verification is blind — you
   can't tell a new bug from a pre-existing one. Valid scope, in order of preference: feature artifacts
   (`po-brief.md`'s own acceptance criteria and named states; `ui-dev-note.md`/`dev-notes.md` for changed
   routes/components), then a commit range (`git diff main --name-only`), then an explicit instruction. **WHEN
   none of these exist ⟶ do not start; write `FAIL` (blocker: missing scope, documented) as your
   `verification-report.md` output per ref:agent/grimorio.manual-verifier/phases/phase-5-report-and-merge.md's
   own `## Status` rule, and exit** — workers are stateless and never ask the user directly
   (ref:skill/grimorio.feature-workflow#status-codes).

3. **ALWAYS check for a prior `verification-report.md` on these same routes/components, as part of THIS
   scope-declaration mission — never as a separate search step.** This is what satisfies
   ref:skill/grimorio.phase-splitting's own mandatory SEARCH-FIRST requirement for a purpose-driven agent's
   opening phase, and the choice not to give SEARCH-FIRST a standalone node is deliberate, stated here rather
   than left for a reader to wonder about: this phase's own scope-declaration (step 2) plus its Impact-Matrix
   build (step 4) already perform that search AGAINST THIS SPECIFIC TASK — reading PO/dev-notes artifacts,
   grepping the codebase for what changed — which is exactly what SEARCH-FIRST asks for; the corpus-wide
   precedent half (general verification principles, the BLOCKED-hardware list) is already JIT-scoped as a
   standing import on `grimorio.manual-verifier-memory` itself, never something a fresh phase would add. Manufacturing
   a 6th node here would be the exact over-splitting
   ref:skill/grimorio.phase-splitting#where-a-boundary-falls--judgment-never-an-algorithm forbids:
   fragmenting one coherent "what am I looking at" mission into two ceremony steps.

4. **Build an Impact Matrix**: for each changed component, grep which pages consume it → affected URLs. This is
   what you verify, beyond just the happy path.

5. **FAN-OUT BRANCH** — before any scripted click-path or route capture begins:
   1. Open import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
      and run its step-1 GATE check against the Impact Matrix above.
   2. **WHEN the gate holds ⟶ fan out to `haiku` children of your own type, one per scripted click-path or one
      route's screenshot capture** (your VOLUME UNIT) — do NOT run the whole matrix solo. **ALWAYS give each
      child its own `tmp/<child-id>/work` and `tmp/<child-id>/notes`, never a shared folder**
      (ref:skill/grimorio.working-memory#the-folder). **WHEN two children would write the same path ⟶ partition
      differently or run those two in series** — partition-by-path alone is not enough. **ALWAYS pass
      `model: "haiku"` when spawning a child** — mandatory, not discretionary, per the volume-fan-out
      ladder's own step 3 above (ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm):
      a downward pass from this agent's own declared `sonnet` default needs no named reason, per
      `grimorio.agent-tiers`'s own downward-override allowance
      (import:skill/grimorio.agent-tiers#how-to-apply-it-the-mechanics).
   3. **WHEN the gate does not hold ⟶ proceed solo, but DECLARE in one line WHY it failed**, before continuing
      to Phase 2. **NEVER skip the declaration** — silence is not "solo by default."
   4. **WHEN you fan out ⟶ each child writes its own report to `tmp/<child-id>/verification-report.md`, never
      the bare OUTPUT filename** — so concurrent children never collide, the same way they never overwrite each
      other's screenshots. **A CHILD invocation skips this node's own scope-declaration (step 2) and the
      prior-report check (step 3) and this gate itself (step 5)**; it executes only the narrow scope (its one
      click-path or route) named in its own brief, and its own Phase 1 short-circuits straight through to
      Phase 2.

## Conditional loads

- ref:skill/grimorio.feature-workflow#status-codes — step 2's own stateless-never-ask rule on missing scope.

## PHASE 1 DELIVERABLE

```
SCOPE:                     <the declared scope + its SOURCE, ranked per the preference order — feature
                          artifacts / commit range / explicit instruction — or the FAIL exit per step 2 if
                          none exist>
IMPACT MATRIX:              <table — changed component -> consuming pages/URLs>
PRIOR-REPORT CHECK:         <a prior verification-report.md found on these same routes/components, named with
                          its path, or "None found">
FAN-OUT DECISION:           <GATE: HELD / DID NOT HOLD, per step 5.1 — WHEN HELD: N children spawned, their
                          tiers (haiku), their tmp/<child-id>/{work,notes} paths, per-path partitioning
                          confirmed non-colliding — WHEN DID NOT HOLD: the one-line WHY, per step 5.3>
ROUTE:                      <fan-out (children fired) | continue (solo) | child>
```

## Hand-off

**WHEN this invocation is a fanned-out CHILD (step 1a) ⟶ `--on child`; WHEN the FAN-OUT BRANCH gate held and
children were spawned (step 5.2) ⟶ `--on fan-out` — Phases 2-4 are then the children's work, and the parent goes on
to wait for and merge every child's report; otherwise (the gate did not hold, step 5.3) `--on continue`.**
