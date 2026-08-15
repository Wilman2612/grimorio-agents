# Defining a flow — the HOW, with a worked example

The four Part-0 questions (SKILL.md) are WHAT to answer. This file is HOW to answer each, grounded in how
practitioners actually do it, plus one full worked example. For the QUALITY of the objective and the checks you
write (verbatim principal intent, no narrowing, four-elements), that is ref:skill/agent-writing#2-identity-paragraph's job — this file does
not restate it; it composes it: **write the objective per ref:skill/agent-writing#2-identity-paragraph PRINCIPAL-INTENT, the checks per
ref:skill/prompt-writing-quality, and structure the whole per the four questions here.** Practitioner sources:
ref:skill/documentation-memory (the practitioner scout reports on Anthropic / CrewAI / 12-Factor / Cognition are LOST — they lived only in ref:tmp/)
doc 52.

## HOW to answer each question

**1. DONE for the whole.** Write it as a SEPARATE field from the objective — the objective is *what to do*, DONE
is *what completion looks like* (CrewAI's `description` vs `expected_output` split; Anthropic: "objective +
output format + boundaries" per sub-agent). It must be a condition you can CHECK, set at the CEO's bar not a
minimal "it works". Test it: *if I handed only this DONE line to a stranger, could they tell pass from fail
without me?* If not, it is prose, not a DONE.
- ✅ "Both mirror seats reach a war-ready ceiling: cap saturated (~200), ≥7 unit types at volume incl ≥3 elites,
  all 4 resources consumed, outposts near cap — asserted by one integration test."
- ❌ "The economy works" / "close the economy" (unverifiable) · ❌ "≥2 elite types at ≥3 units" (a minimal floor
  masquerading as the goal — the narrowing failure).

**2. DECOMPOSE — sub-tasks, each with its OWN DONE.** Cut the whole into pieces each small enough to have a
checkable completion (Anthropic: "clear task boundaries" per sub-agent; 12-Factor: small, focused agents). A
sub-task whose DONE you can't state is still too big — split again. Each piece's DONE is later handed to a
delegate as its acceptance.

**3. TEST PLAN — how the checks are organised, named to the sub-tasks.** One INTEGRATION scenario per mechanic
(construct condition → assert behavioural outcome; ref:skill/experiment-method scenario-first — NOT unit tests) + one
whole-composition COHERENCE check. Say which test proves which sub-task's DONE. A DONE with no test that proves
it is a claim (agents fabricate verification — SKILL.md).

**4. STAGING — sequence + dependencies.** Order the sub-tasks so a later one never starts on an unverified
earlier one; name where the gate runs. "Escalonar": a→b→c, c depends on a+b, Gate after each code change.

## Worked example — "close the economy at its ideal ceiling" (2026-07-22, real)

**1. DONE (whole):** under ideal deterministic conditions, both mirror seats hit the target RANGES — cap
saturated (~200 pop); ≥7 distinct unit types at volume (≥3 each) incl ≥3 gear-gated elites; all 4 resources
consumed (finite tapped, food sustained by farm, gear>0); outposts expanded toward OutpostCap — proven by the
strengthened coherence integration test passing on both seats, AND viewable at the render link.

**2. DECOMPOSE (each with its DONE):**
| # | Sub-task | DONE |
|---|---|---|
| a | Derive the target ranges from the signed design | a written range spec (cap, per-type volumes, per-resource, territory) |
| b | Measure the actual ideal ceiling (run P8 to plateau, dump composition) | measured composition per seat |
| c | Compare + close every shortfall (drive through) | measured meets the spec on both seats |
| d | Strengthen the coherence test from the ≥2-elite floor to the full ranges | strengthened test passes both seats |
| e | Make it viewable (render plays the rich economy) | the CEO opens the link and sees the ceiling |

**3. TEST PLAN:** the strengthened `TestScenario_RichEconomy_ClosesTheCompositeLoop` proves c+d; the composition
dump proves b; the render proves e; the per-mechanic scenarios (food/farm/market) already exist and stay green.

**4. STAGING:** a → b → c (iterate measure→fix→measure until all ranges hold) → d → e. c depends on a+b; d+e
after c; code-reviewer Gate B after every code change in c/d.

## The anti-pattern this prevents (with cause)
Skipping Part 0 and spawning a delegate against a prose objective → the delegate (and you) never hold a
checkable bar, so it stops at the first "it works", you tick that as a gap closed, and the CEO's actual bar was
never met — then rework. Cause: without a written DONE at the CEO's level, "least-resistance" completion wins.
