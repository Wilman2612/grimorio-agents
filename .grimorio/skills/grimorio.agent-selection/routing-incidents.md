# Routing incidents — where each hard rule in the selection skill came from

A record, not a prompt. Every rule in ref:skill/grimorio.agent-selection stands on its own wording; this file
exists so a reader can tell whether a rule still has a reason when the platform changes underneath it. Read it
when you are about to change or drop a routing rule — never to decide a route.

## The delegate was the right pick and nobody picked it

Measured 2026-09-08/09: of 118 logged dispatches, `grimorio.delegate` accounted for 3 — all three on 09, after
the principal asked why there were none. 08 alone shows zero. The wrong pick felt right because a developer or
QA agent is a specialist for a scoped change, and handing one end-to-end ownership either overruns its contract
or earns a correct refusal; three refusals in one session were exactly that.

## A builder with no Agent tool could not gate itself, and was right not to try

A render fix went straight to `grimorio.game-developer`, before builders held the `Agent` tool at all. It did
the work correctly, reported "UNGATED — I have no Agent tool", and refused to author its own gate file. The
main loop had to run the critic itself; one direct critic spawn would have closed the loop.

**Why the rule outlived the incident:** builders now DO carry `Agent`, for same-type volume fan-out. The reason
a builder may not gate itself is no longer tool absence — it is that a self-authored gate is forged. If the
platform changes again, this rule's reason does not.

## An accumulation reviewed as if it were a change

One `code-reviewer` invocation over 111 files and ~15,300 insertions spanning fifteen commits consumed a night
and returned an avalanche, which then read as a blocking work list. The gate's unit is the branch; a branch
whose diff cannot be stated in one sentence without "and also" is already the anti-bucket defect, and the fix is
to split it.

## A gate's verdict read as permission-denied

A security auditor returned "a correct engine with no caller" — correct on its own terms. It was read as a
block, and cost four rounds chasing a closure that depended on work nobody had scheduled. The finding described
the reach of the finding, never what could be built next.

## Divergence suppressed four times, two different ways

Twice by persona-override: `entropy` invoked with "you are a senior designer, be constructive, no open
questions" — the panel silently does not run and the blind spots are lost. Twice by objective-binding, which
needs no override at all: restating an open instruction as "explore X for OUR render / OUR 11 gaps" narrows it
just as fatally, because the brief is written from closing the current item rather than from the open words.
The principal restored the divergence by hand both times.

## Capabilities built and never wired

Four capabilities were found built-and-never-wired, and three more re-discovered in a single session. **The
cause is undiagnosed as of 2026-08-03.** The earlier account — that the rule lived only where sub-agents never
read it — was measured FALSE: every sub-agent receives the root instructions at birth. One unverified candidate,
not confirmed for this incident: goal tokens can be present in context and still lose attention weight over
turns under load. The ledger itself was current when checked (18 commits in 17 days, spot-checks accurate), so
this is a routing failure, not a stale-content one.

## Gates skipped by an improvising loop

Measured 2026-07-28 across ten fronts: QA invoked zero times, the reviewer once, on fifteen commits at once. In
a pre-mapped route the gates are edges the work must cross; in an improvised loop they are rules to remember at
the moment the loop is busiest.

## manual-verifier stopped being routine

Principal's ruling, 2026-07-28: with full-stack tests in place it is *"menos necesario — se levanta cuando
quieres revisar algo que está fallando"*. Raise it to investigate a FAILURE; for a routine visual check the main
loop drives the browser itself through the `playwright-cli` skill. Reaching for an agent where a tool exists is
one layer of indirection too many.

## Vocabulary: "delegate" names an agent type, not an act

`grimorio.delegate` is a proper noun. The act of raising any agent is SPAWNING. Two hooks once exact-string
matched on the word, which is why the convention was written down; they no longer do, so the convention now
rests on prose. Unrelated senses — delegating responsibility to a named document, the Gang-of-Four delegate
object — are untouched by it.
