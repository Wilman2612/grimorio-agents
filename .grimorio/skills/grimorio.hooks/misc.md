# Misc — H1 `harness-lookup.cjs`, H3 `prompt-check.cjs`, H5 `mark-skill-loaded.cjs`

Three hooks with no shared theme beyond "none of the other four companions fit them." Read
`ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does` for the wiring; this file is exclusively WHY.

## H1 — harness-lookup.cjs

**ALWAYS read `ref:skill/grimorio.code-harness/hook.md` for this hook's own script contract and
wiring — NEVER duplicate its content here.** That file already is the correct, complete home for it, written
before this skill existed: the design contract (why it is safe, why it only ever adds context and never blocks),
the file/wiring pointers, and the maintainer notes (session-restart timing, the standalone test invocation, the
soft-layer-must-stand-alone rule) all live there in full. This section stays a one-line pointer on purpose —
migrating that content a second time here would be the exact duplication `ref:skill/grimorio.hooks/SKILL.md`
itself warns against.

---

## H3 — prompt-check.cjs

**What it is.** `PostToolUse: Edit|Write|MultiEdit` + `PostToolUse: Agent` — asserts a NEGATIVE reminder after a
prompt-surface write or a spawn, then gets out of the way. It parses nothing and never denies.

**Why it asserts a negative rather than a positive.** This is the one thing a hook can do that memory cannot
fake: asked to "comply with the standard," a reader recites it from memory and invents what it lacks; told it
probably broke the standard, it has to go and look. The distinction is deliberate design, not an oversight — a
hook that could actually PARSE prompt quality would be a different, much larger mechanism; this one instead
manufactures the doubt that sends a reader back to `ref:skill/grimorio.prompt-writing-quality` itself.

---

## H5 — mark-skill-loaded.cjs

**What it is.** `PostToolUse: Skill` — two independent behaviors on every `Skill` call, both writes-only, never
blocking. (1) An always-on debug log: appends one JSONL line per `Skill` call, TRACKED or not, to
`.claude/.cache/skill-load-debug.log`. (2) TRACKED markers: records that a specific tracked skill loaded THIS
session, in a marker file a gate could consult.

**Why the always-on log was added.** It is the mechanical, non-introspective instrument for telling whether a
skill actually loaded, independent of whether an agent's behavior afterward shows a matching footprint — those
are different questions, and a measurement this session (`objectives/grimorio-loop-graph-findings.md`
F17/F19/F20) had no mechanical way to tell them apart. Always-on by design, not flag-gated: one fewer thing to
remember when a measurement matters later, at disk-only cost — the same precedent `log-agent-invocation.cjs`
(H2) already set in this repo.

**Why the TRACKED markers exist, and why they are kept even though nothing reads them.** `agent-selection-loaded`
and `prompt-quality-loaded` exist solely for two gates that once consulted them — both gates are now deleted, and
**nothing reads what this half writes.** It is kept deliberately unremoved: deleting wired machinery is a
separate call from adding to it, and that call belongs to the CEO, not to whoever next notices the marker is
inert.

**The lesson this hook's own history carries, kept here because it is about markers in general, not this hook
alone.** A session-keyed marker file cannot prove a skill is still IN CONTEXT. The real decay is neither
wall-clock nor spawn count — it is context COMPACTION, which can summarise a loaded skill's text out of context
while the marker, which knows nothing about what survived, still says "loaded." WHEN tempted to gate anything on
"was skill X loaded" ⟶ remember the marker answers a different question than the one being asked.
