# Technique Catalog — what a prompt-writer reaches for, and how a grader checks it

Each entry: **id — name** (M = mandatory wherever its situation arises, O = optional), what it does, its *Static
test* on the files, and where one exists a *Probe*: a task whose cue does not name the technique (F7). PART 1 holds
techniques any prompt engineer uses; PART 2 holds grimorio's own, each group naming its owning skill once.

---

## PART 1 — KNOWN TECHNIQUES

- **K1 — Role framing** (O). An adversarial identity for a critic, auditor or gatekeeper ("you try to break
  this"); never for a purely procedural agent. *Static test:* every critic's identity paragraph names what it hunts.
- **K2 — Exact cases** (M where a boundary is fuzzy). Two or three input ⟶ output pairs, or a decision table of
  `WHEN x ⟶ y` rows, covering both sides of the boundary. *Static test:* each judgement with a fuzzy line carries cases.
  *Probe:* give an input sitting on the line; does it land on the side the cases put it?
- **K3 — Output skeleton plus one real example** (M). The deliverable's fields spelled in place, then one
  literal instance a correct run would produce (C1-C3). The reader fills the skeleton; it never invents a shape.
- **K4 — Delimit material from instructions** (M). Pasted text, briefs and file contents sit under their own
  heading or fence, and the prompt says that material is data, not orders. *Static test:* no input is interleaved with
  the instructions that use it.
- **K5 — Material first, ask last** (O). Long inputs come before the instructions and questions that use them.
- **K6 — Reason before verdict** (M). A field that needs reasoning comes BEFORE the verdict field it informs,
  never after (lens L9). *Static test:* in every deliverable, verdict fields follow their reasoning fields.
- **K7 — Quote, then judge** (M for evidence-based verdicts). Extract the quotes or lines the verdict rests on
  first; judge from them only. *Static test:* the deliverable carries an EVIDENCE field ahead of its verdict.
- **K8 — Decision boundaries** (M). Every decision gets an explicit IF-THEN; "handle edge cases appropriately"
  names no edge case. *Static test:* no instruction delegates a decision with "appropriately", "as needed", "use judgement".
- **K9 — Failure-mode specification** (M). Define the output for missing input, contradicting sources and an
  impossible deliverable, not only the happy path. *Static test:* each hard case has a stated output.
- **K10 — Positive framing** (O). "Do X" over "don't do Y"; keep NEVER for prohibitions whose violation is the
  main risk, so it keeps its weight.
- **K11 — One-clause reason** (O). Give the WHY in one clause when it changes what the reader does in a case the
  rule did not foresee; never a story.
- **K12 — Self-check with named failures** (M when output feeds another agent). Each item names the failure it
  catches; "is it complete?" catches nothing (A2).
- **K13 — Style mirrors output** (O). Write the prompt in the register and format you want back.
- **K14 — Examples unlike the given case** (M). An example never repeats the principal's own case, even
  paraphrased: same principle, a different domain.
- **K15 — Decompose into a chain** (M for multi-stage work). Split work whose stages need different knowledge
  into a sequence of prompts (D-group phases) or into independent children (F-group fan-out).

---

## PART 2 — GRIMORIO TECHNIQUES

### A — Notation (ref:skill/grimorio.prompt-writing-quality/format-guide.md)

- **A1 — Four openers** (M). Every binding rule opens ALWAYS / NEVER / BEFORE / WHEN; BEFORE and WHEN take `⟶`.
  *Static test:* every normative line opens with one. *Probe:* ask it to add a rule; does it land with an opener?
- **A2 — CHECK** (M). A past-tense self-audit question answered before reporting done.
- **A3 — `⟶` separates a condition from its order; `→` only points** (M). *Static test:* no `→` used as a rule separator.
- **A5 — `import:`** (M). A mandatory load, read in full before acting on what it governs.
- **A6 — `ref:`** (O). Read it when its situation arises. *Probe:* in a task where it does not arise, it stays unopened.
- **A7 — `cite:`** (M in records). Proof for a claim, pinned to the commit it was verified at. Never in a prompt.
- **A8 — `agent:`** (M). An agent you raise, not a file you read.
- **A9 — `cold:`** (M). A handle presented so it is NOT opened.
- **A10 — Two-axis form** (M). `relation:store/path#anchor`; a reference into a long file carries its anchor.
- **A11 — No gloss** (M). The target is read in full; a one-line summary of it is never the target.
- **A12 — Load once** (M). Loads declared once: a phased agent's in its chain manifest, any other file's in one
  block; one target cited once per file. *Static test:* no phase file repeats its manifest's loads.

### B — Control-flow vocabulary (ref:skill/grimorio.prompt-writing-quality/control-flow-vocabulary.md)

- **B1 UNLESS** — a deterministic exception inside a rule. **B2 IGNORE / EXCLUDE** — prune entirely, never
  down-weight. **B3 PRIORITIZE / FAVOR** (O) — weighting; a deviation states its reason. **B4 GIVEN / ASSUME** —
  a premise never re-verified. **B5 CONSTRAINTS** — a heading whose every line binds. **B6 UNTIL** — the
  condition stops the loop, not the agent's judgement. **B7 ENSURE / VERIFY** — validate before declaring done.
  **B8 FALLBACK** — take the stated fallback, never an improvised one. All M wherever their situation arises.
  *Static test:* exceptions, prunings, premises, stops and fallbacks use the word, not prose.

### C — Output (ref:skill/grimorio.prompt-writing-quality)

- **C1 — `## OUTPUT` contract** (M). Heading spelled exactly; names the file, the format, disk before chat, and
  what an empty section says.
- **C2 — Examples are the real output** (M). One to three fenced literal artifacts, never a description of one.
  A field-description skeleton is not an example. *Static test:* `node .grimorio/scripts/audit-chain.mjs --examples <filter>`.
- **C3 — Inline format spec** (M). Every field a consumer parses is named in place (lens L5).
- **C4 — Tables** (O). For parallel options, rule forms and decision matrices.
- **C5 — Coverage loop** (M). A check runs over EVERY item: "list ALL findings or write None".
- **C6 — Form is the latitude** (M). Numbered algorithm where a literal reading is wanted; prose where latitude
  is. *Probe:* ask for a rule that must be obeyed literally; is it an algorithm?
- **C7 — Quality checklist and audit lenses** (M). Findings, or "None", per lens.
- **C8 — Evidence, not appearance** (M). The author leaves durable evidence of what was considered; the reviewer
  deduces omissions from the gap to scope. *Probe:* a polished but incomplete artifact; is the gap caught?

### D — Phases (ref:skill/grimorio.phase-splitting)

- **D1 — A phase is its own file** (M). It carries its steps, its deliverable, and WHEN each exit condition
  applies; its loads and exit conditions live in the chain manifest, which the engine prints. A phase that only executes owes
  no graph step; the graph is the plan of an agent that plans (F6).
- **D2 — The engine reveals the next file** (M). A phase file never says "do not read the next phase": the next
  file's path exists only in the engine's answer to `next`.
- **D3 — A real boundary** (M). A distinct question, deliverable and knowledge, or no boundary. *Probe:* give an
  atomic task; no phases get invented.
- **D4 — Size by rendering** (M). Render each phase's full load, count it, split an overloaded one.
- **D5 — Archetypes** (O). A purpose-driven agent opens with SEARCH-FIRST.
- **D6 — Quasi-software view** (M for a new chain). A saved three-layer diagram (state machine, loop, graph) in
  the agent's `design/` folder: a design document, never loaded at runtime.
- **D7 — Each phase self-contained and gated** (M).
- **D8 — Fingerprint** (M). Each mandatory load leaves a deliverable field only its application can fill; a
  blank or copied field is a D8 FAIL.
- **D9 — Progressive revelation** (M). No later phase's knowledge loaded early; facts a phase depends on are
  restated in it.
- **D10 — Orchestrator vs purpose-driven** (M). An orchestrator's phases are its workflow; a purpose agent's
  phases are its function stages.
- **D11 — Instructions as flow** (M). An instruction is a drawable control flow; prose carries information.

### E — Reasoning and evidence (ref:skill/grimorio.reasoning-principles)

- **E1 — Objective and exit condition** (M). State what was asked and the checkable done-state; close VERIFIED
  with evidence or COULD NOT with the blocker. *Probe:* give a task with no stated objective.
- **E2 — Decompose first** (M for tangled asks). PARTS / DISSOLVED / CONFLICTS / PROVING-ORDER / OPEN, before acting.
- **E3 — Claims carry their source** (M). A child's report inherits no confidence.
- **E4 — A check names what would prove it false** (M).
- **E5 — Written is not fired** (M). A behaviour-changing rule is VERIFIED only by an observation that it fired.
- **E6 — A count carries its population and its command** (M).
- **E7 — Make it work** (M). A causal claim, a test, then "why did the expected not happen" — never a try-list.
- **E8 — Exemplar** (M for design). Search for a prior instance of the solution's shape; say so when none exists.
- **E9 — Solve in order** (M). Most general first; prove each piece before the next.
- **E10 — Owed actions** (M). The reading actions ref:skill/grimorio.prompt-reading owes; STOP and do a skipped one.
- **E11 — Build the noun named** (M). The requested entity, never the nearest primitive.
- **E12 — Effect is a rate** (M). Before/after, never a stock count today; a rate is not attribution.
- **E13 — Proven domain** (M). Every "it works" names where it was proven and where it was not.
- **E14 — A measurement enters a prompt only as logic** (M). A threshold, a budget or a limit the reader applies;
  never a finding for the reader to reason from. *Static test:* no instruction carries a number the reader cannot act on.

### F — Delegation (ref:skill/grimorio.flow-delegation, ref:skill/grimorio.fan-out, ref:skill/grimorio.agent-tiers)

- **F1 — Flow-brief** (M). Objective verbatim, context, numbered completion checks, default on silence, failsafe
  bound; Part 0 checks coverage after planning.
- **F2 — Child independence** (M). Own id, own workspace; a blocker is surfaced, never parked on.
- **F3 — Guardian** (M). Holds the saved objective; reviews milestones as a separate reader.
- **F4 — Caller owns the split** (M). The brief names one child per independent item, or declares solo.
- **F5 — Tier by rule** (M). Haiku executes, Sonnet is standard, Opus or Fable reasons; planning is never Haiku.
- **F6 — Plan and graph before spawning** (M).
- **F7 — Probe with a hidden cue** (M). Never ask "is it in your context".
- **F8 — Never end a turn on a dependency** (M). Foreground what you need next.
- **F9 — Keeper decides where, writer decides how** (M). A governed-file change routes keeper ⟶ writer.

### G — Identity and levels (ref:skill/grimorio.agent-writing)

- **G1 — Purpose paragraph** (M). The shell opens with what the agent is and does.
- **G2 — Principal-intent fidelity** (M). Acceptance never narrower than the principal's words; those words pass
  down verbatim.
- **G3 — Shell and behavior split** (M). The shell is identity plus one entry point; the behavior file holds
  everything the agent does.
- **G4 — Four levels** (M). Behavior, general, project, code; a general file never cites a project path.
- **G7 — An agent's own folder** (O). Its behavior, phases, optional `memory/` and `design/`.

### H — Placement of knowledge

- **H1 — Knowledge that must fire carries control language** (M). A knowledge skill whose content must change
  behavior either states it with openers, or a named agent's behavior file carries the rule that fires it.
  *Probe:* give a task the knowledge governs; does the control fire?
