# Output Placement — where an agent's output format lives

## The CEO's ruling and the rule

CEO: *"They should not be depending on ref:skill/feature-workflow#artifact-directory-structure to have an output format. Either they put it in a
separate file, as I think I had it at some point, or they put it INSIDE the same skill they load
mandatorily. That way they generate their outputs quickly and it is CLOSER to each one — so you are not
guessing what the output is."*

**ALWAYS place an agent's output format in that agent's OWN behavior file, or in a skill it is required to
load.** **NEVER place it in a shared protocol skill the agent has to go find** — the way ref:skill/feature-workflow#artifact-directory-structure
holds artifact formats for 12 different agents today. Distance between an agent and its own output format is
a guessing cost paid on every single run of that agent; the format belongs where the agent already is, not
where a search has to reach for it.

## Migration status — SPEC APPLIED

**This section's SPEC is now APPLIED.** The migration landed in ten commits on `develop`
(`faf4c4b`…`a6d6144`): the seven single-producer formats moved verbatim into that agent's own behavior file
under `## OUTPUT` — po-brief.md → po-memory, arch-decision.md → architect-memory, qa-report.md → qa-memory,
ux-review.md → ux-memory, security-report.md → security-memory, code-review.md → code-reviewer-memory,
verification-report.md → verifier-memory. The one format with several producers — dev-notes.md/ui-dev-note.md,
produced by js/go/py/ui-developer — moved into `ref:skill/developer-memory/build-protocol.md`, the skill all four
already load mandatorily, with a pointer from each per-language behavior file. The one format with no
remaining producer — execution-log.md, belonged to the retired `feature-orchestrator` — was deleted outright
rather than relocated. ref:skill/feature-workflow#routing-rules's `## Artifact Formats` section is gone entirely; the skill itself
survives for its routing rules, status codes, and REWORK cycle.
