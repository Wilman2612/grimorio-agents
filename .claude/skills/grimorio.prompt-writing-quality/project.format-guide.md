# Format Guide — the exact syntax every prompt convention is written in

Sibling to ref:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md. That file holds what each
control-flow word (UNLESS, GIVEN, UNTIL, ENSURE, FALLBACK, PRIORITIZE, …) MEANS and how it composes with
the four openers — read it first if you haven't; this file never repeats what a word means. This file holds
something narrower and more mechanical: the exact SEPARATOR, the exact reference STRING, the exact HEADING
each convention in the corpus uses — so a writer six months from now finds the whole spec in one place
instead of reconstructing it from a conversation or from scattered examples.

**This file is HOW a prompt is written; it never says WHERE the content goes.** The doctrine these forms
serve — why a hard rule needs an opener at all — lives in this skill's own sibling `SKILL.md`, at
ref:skill/grimorio.prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
→ "HARD RULES ARE THE ONLY MECHANISM PROSE HAS". Grimorio's four-level PLACEMENT doctrine (which FILE a rule
belongs in) is a separate question and stays in ref:skill/grimorio.agent-writing. Read the sibling SKILL.md section when
deciding whether a clause needs an opener at all; read this file once you are writing the rule itself.

CEO, on why this file exists: *"There has to be a guide about ALL the formats we are making, because right
now you will remember, but later you are going to forget."*

---

## 1. THE RULE FORM — opener, then `⟶` when the kind takes a condition

A normative rule opens with one of the vocabulary words. Kinds that take a condition separate it from the
imperative with `⟶`; kinds that don't take one, don't get one.

```
**ALWAYS <imperative>.**                          invariant — takes NO condition
**NEVER <prohibition>.**                          invariant — takes NO condition
**BEFORE <event> ⟶ <imperative>.**                precondition
**WHEN <checkable condition> ⟶ <imperative>.**    trigger
**UNLESS <condition> ⟶ <exception>.**             escape hatch inside another rule
**UNTIL <condition> ⟶ <repeat>.**                 stopping condition
**FALLBACK <condition> ⟶ <route>.**               failure routing
**ENSURE <property> before declaring done.**      postcondition — no condition
**CHECK: <question in past tense>?**              after-the-fact — no condition
```

Two hard requirements, both earned by measurement, not preference:

**ALWAYS start a rule's opener on its own source line, with that rule's `⟶` (if it has one) on the SAME
line.** A rule whose opener or `⟶` wraps onto a continuation line is invisible to a line-based parser —
measured: 32 well-formed rules went unreadable and 18 were mis-flagged as broken, both from exactly this.
`grimorio.prompt-writer` (a prior instance of the agent authoring this file) found the durable fix: make the
format machine-readable, rather than teach every downstream parser to tolerate every possible wrap.

**NEVER force a condition onto ALWAYS or NEVER.** They are invariants. A fabricated condition reads as
though the invariant has an exception it does not have, which is worse than stating no condition at all.

---

## 2. THE SEPARATOR IS `⟶`, NEVER `→` — record the reason, it is not arbitrary

`→` is already the POINTER separator (`-> skill → "Section"`) and appears **1,197 times** in the corpus.
Reusing it as a rule's condition-to-imperative separator makes a pointer and a rule indistinguishable to a
reader and to any line-based tooling — found by running the auditor (ref:repo/scripts/audit-chain.mjs) against the
corpus, not by reasoning about it in the abstract.

`⟶` was chosen over the more obvious doubled arrow `→→`: `→→` CONTAINS `→` as a literal substring, so any
search for the pointer separator would false-positive on every rule that used it. `⟶` (a distinct codepoint,
not a repurposed one) cannot collide with `→` in either direction, and it had **zero** occurrences anywhere
in the corpus before this convention — a clean namespace, not a squatted one.

```
Pointer (existing, unchanged):  -> `agent-writing` → "HARD RULES ARE THE ONLY MECHANISM PROSE HAS"
Rule (this convention):         **WHEN a file passes ~500 lines ⟶ treat it as a smell and split or trim it.**
```

ref:repo/scripts/audit-chain.mjs still expects `→` only and does not yet parse `⟶` — that gap is a known,
deliberately deferred follow-up, not something to patch from inside this file.

---

## 3. THE LOAD REFERENCE — `relation:store/path[#anchor]` — two axes, not one prefix

Anywhere a writer names a skill, a repo file, or a scratch artifact precisely — inside a trigger, as a
pointer's target, or as evidence for a claim — the reference takes this exact grammar:

```
relation:store/path[#anchor]
```

```
relation ∈ import (a MANDATORY dependency)  ·  ref (go look — optional)  ·  cite (proof for a claim)

**`import:` HAS TWO AUDIENCES AND THEY READ IT DIFFERENTLY (CEO, 2026-08-09).** The AUTHOR of a shell
writes it to DECLARE: this skill is obligatory for this agent. Every READER — the agent itself, and
anyone reasoning about it — must read it as an INSTRUCTION: **ALWAYS load an `import:` target in full
before you act on anything it governs.** **NEVER treat an `import:` line as evidence the target is
already in your context.** Nothing loads it: an agent is handed its own shell, `CLAUDE.md`, and a list
of skill NAMES with one-line descriptions. Measured 2026-08-08 — a rule living in a skill body produced
ZERO compliance across three clean runs, because no agent ever received its text. The old wording here
said *"loaded, it is IN the writer's own context"*, which told 296 readers they already held something
they did not.
store    ∈ skill (.claude/skills/)  ·  repo (any repo path)  ·  tmp (scratch)  ·  ext (another project's tree)
```

```
import:skill/name                 a MANDATORY dependency — see the two audiences below
import:skill/name#anchor          the same, scoped to one section of that dependency
ref:repo/path                     go look if you need it — not loaded
ref:tmp/path                      a transient note, safe to point at
cite:repo/path                    this is the writer's PROOF for the claim just made
cite:ext/project@rev#path         proof from a tree that is not ours — always pinned, never resolved here
```

### WHEN AN ANCHOR IS OWED — the reader's cost, not the citing sentence

An `#anchor` is a READ INSTRUCTION, not a bookmark. `ref:skill/{name}/{file}.md#section` means *extract that section*:
`scripts/refobl/read.cjs` performs exactly that, resolving the reference and printing from that heading to
the next heading of the same or shallower depth — one section, not one document. Run without an anchor, it
prints the target's INDEX (line numbers plus headings) instead of the target, so a reader chooses a section
before loading anything.

**WHEN you write a reference into a markdown file over 200 lines ⟶ give it an `#anchor`.**

Measured 2026-08-05 across the 495 references in the corpus that carry one: following them by FILE costs
194,497 lines; by SECTION, 36,160 — **158,337 lines nobody has to load, 81%**. Treat that figure as already
stale the moment it is read, the same discipline this file already applies to every other number in §3; the
VERIFY commands at the end of this subsection are the live re-check.

**The criterion is the READER'S cost, never the citing sentence.** The retired criterion — leave a reference
bare when the citing sentence treats the target as a whole — was true on its own terms and answered the wrong
question: judged entirely from the writer's side, it never priced what following the reference costs. Under
it, 227 references pointed into 400+-line files with no anchor. It is superseded, not live guidance — read it
as history, not as a rule still in force.

**"No heading fits" is a claim about the TARGET FILE, not about the reference.** Of the 87 long targets that
held an anchorless reference, zero had too few headings to anchor into. A target so shapeless that no section
answers the citing sentence is an unsplit file — the ~500-line smell arriving from the other direction — and
the fix is to section or split the target, never to leave the reference bare.

**Three exemptions, and only three:**

1. **`import:skill/<name>` with no file** — the directory form, the Knowledge-block line of an agent shell.
   It declares a WHOLE-SKILL dependency, and the harness loads a skill entire, so an anchor there would not
   narrow a read, it would change what the line SAYS — from *"this skill is loaded"* to *"load only this
   section"*. `ref:skill/<name>` is NOT exempt: that one is a pointer, and a pointer into a 400-line
   `SKILL.md` is exactly the read an anchor exists to cut. `scripts/audit-chain.mjs`'s `wholeSkillLoad` check
   enforces this split mechanically.
2. **An INDEX ROW** — a line in a README or index whose whole purpose is *"here is that document"*, where the
   reader genuinely wants the whole file.
3. **The path is the SUBJECT of the sentence, not a destination** — *"features-status.md drifts from shipped
   code"*, *"the 32 dead citations sit inside features-status.md"*. Nobody follows that to read anything; an
   anchor there fakes precision instead of buying anything.

The CEO's diagnosis is what forced this, in translation (2026-08-05): *"So you're going to make it load the
entire file instead of doing a grep? You could even put a line count if you wanted, though it would be
better to extract up to the next section."*

VERIFY the rule is live: `node scripts/audit-chain.mjs --anchorless | tail -1` and `node scripts/audit-chain.mjs
--anchors | tail -1`.

**NEVER write a path without a relation prefix.** A bare `foo/bar.md` in a sentence is a reference the
audit cannot see, and the corpus carries thousands of them — the exact hole the CEO named: *"a veces
solamente mencionas el nombre del archivo, suponiendo que ya fue cargado en otro contexto, y se escapa
la importación"* (2026-08-05). `audit-chain.mjs --unprefixed` lists every one. Two exemptions, both
narrow: `./file.md` inside a `SKILL.md` (that relative form is what lets a skill be exported), and the
four-level KIND names — `project.md`, `behavior.md`, `SKILL.md` — when they name a level rather than a
file, since there is no such file to resolve.

**STORE=ext is never resolved locally**, because nothing here can fetch another project's tree — so it
MUST carry `@rev`. The revision is the only thing that keeps the claim recoverable. It was forced by the
corpus, not invented: a citations file pointed at 30 paths inside a third-party repo, and every internal
store would have resolved them against THIS repo and reported all 30 dead.

STORE=skill still reaches a file inside that skill and a heading inside that file, exactly as the earlier
fragment form did — a RELATION now sits in front of every depth, bare skill, file, or anchor alike, not just
the skill-level form.

**Why one axis was not enough.** The prior scheme (`skill:` / `repo:` / `tmp:`) answered only where a thing
lived; it fixed a bare backtick being indistinguishable from a code identifier, but it could not say what the
writer's RELATION to the thing was. Loading a dependency, pointing a reader at a file to go read later, and
offering a path as proof for a claim all rendered as the same string. The CEO's own diagnosis, in translation:
*"I was talking about a more general design... because a scratch path really shouldn't be cited inside skills
the way it was — I mean, just having a format that clearly tells us: a fragment was IMPORTED, versus a file
was REFERENCED in general — and whether it's tmp or repo. What worries me about your format is that it's too
simple."* His approval of the fix, in translation: *"yes, I like this one more."*

### `agent:<name>` — the thing you RAISE, not the thing you read

```
agent:grimorio.po                 this names an agent you can raise
```

An agent is the one referent in this corpus that is not a document. The three relations all describe
something you do to a FILE — load it, go look at it, offer it as proof — and none of them describes
*"this is a thing you can invoke"*. Writing `ref:repo/.claude/agents/grimorio.po.md` is not wrong, it is
BESIDE the point: it sends a reader to read a shell when what they wanted was to raise the agent.

Flat, like `cold:` and for the same reason — no path, no extension. It resolves against
`.claude/agents/<name>.md`, so `audit-chain.mjs` can still report a reference to an agent that no longer
exists, which is the property every form here has to keep.

**NEVER write a bare `grimorio.<name>` where you mean the agent.** 633 such mentions accumulated before
this form existed, and a bare backticked name is indistinguishable from a code identifier — which is the
exact ambiguity the whole grammar was built to remove, surviving in the one class nobody had a form for.

### `cold:<handle>` — the one reference that deliberately does not look like a path

```
cold:handle                       exists so it is NOT read; unopenable by construction
cold:handle#anchor                the same, at one section
```

A cold handle is FLAT: **no slash, no extension, nothing path-shaped.** It is the only form here whose
value is what it withholds. The CEO's reason, and it is not about loading at all:

> *"si me lo pones allí, yo voy a suponer que tengo que ir y revisar ese archivo, y tú también."*

A path-shaped reference is an invitation neither a human nor an agent declines deliberately. A handle
cannot be opened, so resolving it is a decision. **It stays reconstructible** through
ref:skill/grimorio.agent-writing/project.cold-store.md — the manifest maps every handle to a live path or a
`git:<sha>:<path>`, which is what lets `--cold` still report a dead one: *"tiene que ser reconstruible…
para poder revisar si está muerto o no también"* (same day).

Note the axis this sits on. `cold` is not a fourth RELATION — relation describes the writer's intent,
and intent cannot be enforced. Reachability is a property of the STORE, so cold is where the file LIVES.
Relation and store collapse into one token here because *do not load it* and *it lives in the manifest*
are the same fact.

**WHEN nothing — no script, no hook, no agent — consumes a file's bytes ⟶ do NOT give it a handle;
delete it.** Git already holds it, and absence is stronger than any rule: a file that is not there
cannot be read by mistake. `cold:` is for what must stay in the tree.

**The payoff: two combinations become IMPOSSIBLE to write, not merely forbidden.**

```
cite:tmp/path      IMPOSSIBLE — proof that cannot outlive the claim
import:tmp/path    IMPOSSIBLE — depending on scratch
```

`cite:tmp/path` is CLAUDE.md rule 24 — "NEVER cite a `tmp/` path as the source of a SIGNED decision" — and
for that rule's entire life it was prose nobody could check: a bare `tmp/…` path sitting in a paragraph is
not a searchable shape, so no one could ever produce the list of violations. Under this grammar the same
prohibition is a TYPE ERROR instead of an unenforced sentence — `--invalid` lists every impossible
combination in the corpus by file, so the check runs as a grep against the text, not as a rule someone has to
remember to apply. A prohibition nobody can check is weaker than a combination that cannot be written: that
is the whole improvement, stated plainly — it does not make rule 24 stricter, it makes rule 24 a fact about
the grammar instead of a fact someone has to recall.

**This is a strictly better version of the fix rule 24 already got — not a second attempt beside it.** The
first fix (commit `533edd8`) turned the rule into a grep: a dedicated `tmp:` prefix made every citation of
scratch findable, and running that grep once already proved the rule mattered — 32 citations pointed at
files that no longer existed on disk. That was real progress, worth keeping as the historical proof this was
never a hypothetical problem. But it still let a writer type `cite:tmp/path` and only get caught later, on
audit. The two-axis grammar removes the keystroke itself: `cite:tmp/path` does not parse as a valid
reference at all, so there is nothing left for rule 24 to say in prose — the grammar says it now.

**Scope: what converts, and the one path that no longer has anywhere to go.** Convert LOAD DECLARATIONS and
POINTERS — a skill's own load line, an agent's "read X before doing Y", a cross-reference from one skill to
another. Do NOT convert narrative citations inside research reports and incident logs — prose recounting what
happened, where a path is mentioned in passing as part of the story rather than as an instruction to go read
it. The one exception is unchanged in shape but sharper in consequence: a path offered as EVIDENCE for a
claim converts even inside prose, because that is exactly what `cite:` exists for. The sharper part: under
the single-axis scheme a `tmp` path offered as evidence still had somewhere to go (`tmp:path`, greppable but
legal); under this scheme it does not, because `cite:tmp/path` is impossible. A `tmp` citation can only be
converted by promoting the evidence itself to a permanent repo artifact first and writing `cite:repo/path`,
or left unconverted and flagged as debt — there is no third option that writes `cite:` in front of a `tmp`
path.

**NEVER dress a dead or impossible reference in live syntax.** A reference whose target no longer exists on
disk stays exactly as broken as it already was; it does not get upgraded into `relation:store/path` form just
because the form now exists, because that would claim the target is checkable when it is not. `--dead` lists
every reference, old form or new, whose target fails to resolve; a converter's job on finding one is to flag
it, never to launder it into the live grammar.

**A `cite:` may optionally pin the commit its claim was verified at — `cite:repo/path@<sha>[#anchor]` — set
beside the unpinned form used everywhere above to make the difference visible:**

```
cite:repo/path                 unpinned — the form used everywhere in this section until now
cite:repo/path@<sha>           pinned — <sha> is the commit the writer verified the claim against
cite:repo/path@<sha>#anchor    pinned, with the existing #anchor form still available
```

The pin sits exactly where purl (Package URL — the `pkg:type/namespace/name@version` grammar used across the
dependency-scanning and SBOM ecosystem) puts its own version slot: naming a THING is not enough to make a
claim checkable, a reference to it also needs a coordinate into WHICH STATE of that thing was verified. Git
already holds every past state of every tracked file, commit by commit — pinning asks for no new archival
system, only a coordinate into the one the repo already has. Two independent literatures document what
happens without that coordinate: Klein et al., "Scholarly Context Not Found: One in Five Articles Suffers from
Reference Rot," PLOS ONE, 2014, measured that a large share of scholarly web citations stop resolving to, or
stop matching, what they originally cited; and the Zittrain/Albert/Lessig work behind Perma.cc, "Perma:
Scoping and Addressing the Problem of Link and Reference Rot in Legal Citations," documents the same failure
for legal citation and built the caching fix for it. Both converge on the thesis this convention exists to
enforce: a resolving path is not a live citation — the file underneath it can be rewritten with no trace, and
an unpinned cite stays green forever regardless.

**ALWAYS pin a NEW `cite:` reference to the commit it was verified at.** From this point forward, a writer
adding a citation never writes the bare `cite:repo/path` form — only `cite:repo/path@<sha>`, `<sha>` being the
commit current at the moment the claim was checked against the file.

**NEVER bulk-pin the 215 citations already in the corpus that predate this convention.** -> live count:
`node scripts/audit-chain.mjs` → "cite refs PINNED to a revision" (215 is the denominator at this writing;
treat it as stale and re-run — the same discipline this file already applies to every other number in §3).
Nobody recorded, at the moment each of those citations was first written, which commit its claim was verified
against — so pinning them retroactively means GUESSING a revision, and a guessed pin is worse than no pin at
all: it asserts a verification happened at a specific commit when it did not, a fabricated provenance claim
wearing the shape of a real one. **WHEN an existing unpinned citation is next touched AND its claim
re-verified ⟶ pin it to the commit that re-verification happens at** — that is the only moment the writer
actually holds a true revision to record, and the only honest way this backlog closes: one citation at a
time, at the moment of real re-verification, never in bulk.

This is the second defense against the same failure the `cite:tmp/path` IMPOSSIBLE rule above already guards,
one layer earlier: that rule keeps a citation from ever pointing at something that can vanish outright; this
one keeps a citation that survives from silently drifting under a reader's feet.

**The `./` form is absolute-only everywhere except one case, and the two directions are not symmetric.**
Every STORE atom (`skill`, `repo`, `tmp`) still resolves absolute, with a RELATION prefixed in front — EXCEPT
an intra-skill reference: a skill's own `SKILL.md` pointing at a sibling file inside that same skill now
writes it RELATIVE — a leading `./` plus the sibling file's name, optionally with a `#anchor`. The CEO's
original reasoning for the withdrawal still holds everywhere
else, in translation: *"doesn't relative versus absolute make building the map harder?"* — a relative
reference is a different file depending on who wrote it, and a map built from text alone has no writer's
position to consult to resolve it. The one case where that objection does not apply is the one where the
grammar now diverges: `SKILL.md` is the only file that ever exports (see "The export boundary is the
general/project line" above — `project.md` and code-level files never leave this repo), and
`agentskills.io/specification` mandates relative paths for portability at exactly that surface, so the "which
writer's position" problem never arises — the file always resolves relative to itself. Every OTHER `./`
sighting in the corpus — inside `project.md`, `docs/`, a behavior file, a topic file, or any reference that
crosses from one skill into ANOTHER skill — is still the withdrawn form and still an offender to convert TO
absolute.

**So the conversion runs in two different directions depending on where you are, and confusing them undoes
the fix:** inside a `SKILL.md`, an intra-skill reference converts absolute→relative; everywhere else, a `./`
reference still converts relative→absolute. Don't apply one direction where the other belongs. -> the live
count of each direction: `node scripts/audit-chain.mjs` reports them as "relative intra-skill refs in
SKILL.md (CORRECT, exportable)" vs "RELATIVE refs still to make absolute" — cite the live command, not a
frozen number: treat any number printed here as already stale and re-run the auditor, the same discipline
this file already uses elsewhere in §3.

**An external spec disagrees with this, on purpose — record the disagreement, don't paper over it.** The
Agent Skills format — `agentskills.io/specification`, the spec this repo's own `.claude/skills/*/SKILL.md`
files literally implement, adopted across Claude Code, Gemini CLI, Cursor, and others — mandates the
opposite: *"When referencing other files in your skill, use relative paths from the skill root,"* plus a
shallowness rule, *"Keep file references one level deep from `SKILL.md`. Avoid deeply nested reference
chains."* Its stated reason is portability: a skill is meant to be a relocatable, zip-uploadable unit, and an
absolute path breaks the moment it leaves the repo.

**We diverge, and the CEO ruled why (2026-08-04):**

> *"sobre skills y relativo tiene sentido aunque nuestros skills son compartidos... para hacer lo que dice
> tendríamos que mover los archivos más cerca de su agente pero no serían usables algunos."* — "relative makes
> sense for skills — except ours are shared. Doing what the spec says would mean moving files closer to their
> [single] agent, and some would stop being usable at all."

The spec assumes a skill is self-contained and owned by one agent. This repo's skills are not:
ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize, ref:skill/grimorio.agent-tiers#the-one-rule, and this skill itself are each loaded by many agents, and the
sharing is the point, not an oversight to fix. Full compliance would mean relocating a shared file next to one
"owning" agent and breaking it for every other loader — so we comply where compliance is structurally
possible and diverge where it is not, deliberately, recorded here rather than by omission.

**The divergence is narrower than it first looks, because of the export boundary.** ->
ref:skill/grimorio.agent-writing#the-export-boundary-is-the-generalproject-line-ceo-ruling-2026-08-04-translated → "The export boundary is the general/project line" — grimorio exports the behavior
and general levels only; `project.md` and code-level files never leave this repo, so the spec's portability
concern never applied to them in the first place. Measured over the corpus's 219 self-referencing paths: 93
sit in a `SKILL.md` (general knowledge — the only ones portability-relevant at all) and 81 sit in `project.md`
or `docs/` (project/code — already correctly absolute, and never in tension with the spec to begin with). Only
the 93 are the actual divergence.

**This is not an uninformed deviation.** The same prior-art pass that found this conflict also found genuine
convergence: our three-relation split (`import`/`ref`/`cite`) independently matches Sphinx's
`:doc:`/`:ref:`/`:cite:`, Doxygen's `\ref`/`\include`/`\cite`, and Antora's `xref` pattern — three ecosystems
that arrived, unprompted, at the same INCLUDE-vs-CROSS-REFERENCE split this grammar's `import` vs `ref`/`cite`
draws. And on absolute-vs-relative specifically, three respected systems — Bazel's `@@canonical` labels, Go's
module imports, Antora's resource IDs — each REVERSED an earlier, more relative-tolerant design into an
absolute-only one, for the same reason argued above: no stable position between writer and reader survives.
Antora names the adversary "the relative path problem" verbatim, citing its own dot-dot up-level traversal
syntax as the example. -> Full findings:
ref:tmp/prior-art-reference-conventions/10-agent-formats.md#format-comparison-at-a-glance and
ref:tmp/prior-art-reference-conventions/40-absolute-vs-relative.md#does-prior-art-support-absolute-only-for-a-graph-rebuilt-from-strings-alone.

**This is no longer an open call — the CEO ruled 2026-08-04 to convert them** (relayed via
`grimorio.system-keeper`). `grimorio.system-keeper` + `grimorio.prompt-writer` executed the conversion the
same day. The measured count at execution does not match the figure the ruling itself cited, and the gap is
recorded rather than smoothed over: the CEO's own figure was "93"; `grimorio.system-keeper`'s scan of every
`SKILL.md` for an intra-skill reference found **40 distinct old→new string pairs (78 raw occurrences once
trailing-punctuation duplicates are collapsed) across 15 files**, confirmed by the auditor's before/after
("relative intra-skill refs in SKILL.md" rose from 8 to 86 — a rise of 78, matching the raw-occurrence count
exactly). Where the "93" figure came from could not be reconstructed at execution time — state both numbers
honestly rather than force a match neither figure can currently source.

**The corpus holds references in every prior form; 0 are in this one yet — say that plainly, this is a spec,
not a completed migration.** `node scripts/audit-chain.mjs` (the auditor shipped in commit `916684b`) is the
source of truth for the live figure, not this paragraph — editing this very section changes what it counts,
so treat any number printed here as already stale and re-run the auditor rather than trust the page. At last
edit it reported `TWO-AXIS refs (relation x store)  0 / 1798`, broken down `import 0 · ref 0 · cite 0`, with
`--invalid` ready to list an impossible combination the moment one is written and `--dead` ready to catch a
target that stopped existing. Earlier passes already converted real ground into `skill:` / `repo:` / `tmp:`
(278/759, 0/620, and 121/260 respectively, also at last edit) — that work is not wasted; it correctly told a
real load edge from a code identifier or a story mention. But it is now an INTERMEDIATE state, not a finished
one: a flat `skill:`,
`repo:`, or `tmp:` reference cannot say whether the writer imported, pointed at, or cited the thing, which is
exactly the gap this section closes. **A reader who finds `skill:name` in the wild today is looking at
legacy debt to re-migrate into `import:skill/name` (or `ref:` / `cite:`, whichever the writer actually
meant) — never a second valid form standing beside this one.**

**The reference IS the pointer, fragment or not, relation or not.** Do not additionally maintain an index, a
frontmatter field, or a second list of which skills or files exist or what they cover — that duplication is
the exact defect this file exists to prevent, and SKILL.md's own frontmatter `description` already answers
"what is this skill for" for anyone scanning the listing.

---

## 4. THE OUTPUT HEADING — exactly `## OUTPUT`, nothing else

**ALWAYS declare an agent's output contract under a heading spelled exactly `## OUTPUT`** — that casing,
that wording, a top-level heading, and nothing appended to it (not `## Output contract`, not
`## Output format`, not `## Output`).

Why: measured today, three variants already coexist in the corpus — `## Output` in 18 files, `## OUTPUT` in
2, `## Output contract` in 1 — so a question as simple as "which agents declare an output format?" has no
reliable answer; a grep for any one variant silently misses the other two.

**WHEN the heading in a file you are already touching is spelled any other way ⟶ rewrite it to `## OUTPUT`
while you're in there.** (This is opportunistic, not a mandate to sweep the corpus in one pass.)
Standardised on one heading, "which agents declare an output" becomes
`grep -l '^## OUTPUT'` and the answer is complete.
