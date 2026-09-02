---
name: grimorio.agent-selection
description: "The agent selector — WHICH grimorio agent to invoke, WHEN. Consult before spawning ANY agent. Covers the lightweight 'agents on demand' model, the dev/feature routing tree, the research/knowledge routing (entropy / researcher / solution-architect / documentation), the two-phase research flow, and the HARD rule against generic general-purpose research grunts. Skill loading is automatic; agent selection is NOT — this skill makes it reliable. (Formerly `.claude/happy-path.md`.)"
---

# Agent Selection — which agent, when (agents on demand)

> **The direction:** agents are pulled in **as the work needs them** — not run as a fixed line every time. A typo
> needs a developer. A domain-heavy feature needs an architect first. A risky diff needs an adversarial reviewer.
> Most "little things" need one or two agents, not ten. **Skill loading is automatic; agent selection is NOT** —
> so this skill exists to make "which agent, when" reliable. Consult it before spawning anything. We are emulating
> Anthropic's automatic *skill* loading, but for *agents*.

---

## Before you route anything: read the capabilities ledger

**This project's own feature-status ledger is the record of what is ALREADY BUILT.** Read it before you
pick an agent, and STATE what it says already exists in the brief you write, so the agent wires the GAP instead
of re-deriving the substrate.

This is not advice. Four capabilities were found built-and-never-wired, and three more were re-discovered in a
single session. **The cause is undiagnosed as of 2026-08-03.** The earlier account — that the rule demanding this
read lived only in `CLAUDE.md`, which no sub-agent ever receives — was measured FALSE: every sub-agent receives
`CLAUDE.md` automatically at birth, via the platform's own context assembly. Treat this as an UNDIAGNOSED
incident, not a known failure mode. One unverified candidate mechanism, not confirmed for this incident: goal
tokens can be present in context and still lose attention weight over turns under a loaded session
(ref:skill/grimorio.documentation-memory doc 59). A survey or design brief that does not say what already exists is the tell that
this step was skipped. The ledger is current (measured: 18 commits in 17 days, spot-checks accurate) — when it is
not consulted, that is a routing failure, not a stale-content failure.

An agent surfacing "that's already built" more than once is the same tell.

---

## Default mode: direct & adversarial (the lightweight path)

For most work, skip the orchestrator. Invoke exactly the agent the moment calls for:

```
grimorio.js-developer   rename this symbol across the module        # one agent, done
grimorio.security       audit the upload endpoint                    # adversarial, à la carte
grimorio.code-reviewer  review the current diff                      # adversarial, à la carte
grimorio.ux             tear down these Storybook stories            # adversarial, à la carte
grimorio.web-architect  is this WEB approach sound before I build it?  # game → grimorio.game-architect
```

Each agent runs **standalone**: it reads what it needs, does its job, reports. No artifact directory, no pipeline. This is how the system is used day to day — the adversarial correctors (security, code-reviewer, ux, manual-verifier) are most valuable invoked on a real change, on demand.

---

## As-needed escalation: pull agents in when the situation demands

The same request can need different agents. Decide by what the change actually touches:

```
request
  │
  ├─ trivial (rename / literal / typo) ........... developer            → done
  ├─ contained code change ...................... developer → code-reviewer
  ├─ risky / security-sensitive ................. developer → security + code-reviewer
  ├─ UI change .................................. ui-developer → ux → manual-verifier
  ├─ "is this sound?" / cross-cutting ........... architect (text-only) → then build
  ├─ domain-heavy / unfamiliar area ............. analyze the domain first → architect → build
  └─ full feature .............................. the maximal pipeline below
```


### Two rules about USING these gates, both earned the expensive way (2026-07-28)

**1. Gate the CHANGE, never the accumulation.** `code-reviewer` reviews what you are about to commit. Run over
a session's worth of accumulated commits it stops being a gate and becomes a retrospective audit — and an audit
of thousands of lines returns an avalanche by construction, which then reads as a blocking work list. Proven
here: one invocation over 111 files and ~15,300 insertions spanning fifteen commits consumed a night. If
unreviewed commits have piled up, that is a DEBT TO DECLARE, not a gate to run.

> **This is NOT in tension with `CLAUDE.md`'s "review once, at the END, on the whole branch — not per commit"
> (CEO ruling, 2026-07-30: *"it's too much review, and you're also making more commits now"* (translated)). They answer
> different questions. The unit `code-reviewer` gates is the BRANCH — one declared objective, one out-of-scope
> fence, so by construction one coherent change — never a session's PILE of unrelated commits. "Once at the end"
> forbids re-running the gate on every single commit inside that one change; "gate the change, never the
> accumulation" forbids letting review lapse until it is reviewing a heap of unrelated work, which is what turns
> a gate into a retrospective audit. Same rule, same direction, read together instead of picked between.**
>
> **The corollary matters as much as the rule: if a branch DID grow into a session's accumulation, that is the
> anti-bucket defect a branch-scoping gate exists to catch** — the fix is to SPLIT the branch, never to skip
> the review. A branch whose diff no longer states one sentence without "and also" is already past the point
> where "once at the end" is doing what it was written to do.

**2. A gate's verdict is an INPUT to your plan, never a substitute for it.** An adversarial agent's
open/closed vocabulary describes the reach of ITS finding. It does not say what may be built next. The main
loop owns the plan and decides whether a finding blocks the next step, weighed against severity and real
exploitability. Proven here: a security auditor's "a correct engine with no caller" — correct, on its own
terms — was read as permission-denied and cost four rounds chasing a closure that depended on work nobody had
scheduled yet. If you are doing backend, prove the calls that WILL be made to you; whether the frontend calls
it yet is a different front's job.

**Classify before routing**, and pull in only the agents the change needs — a misclassified request (feature vs bug vs refactor) wastes every downstream agent's context. An architect for a typo is waste; skipping the architect on a cross-service change is a bug.

> **`manual-verifier` is ON-DEMAND only (CEO, 2026-07-28).** With full-stack tests in place it is *"less
> necessary — it gets raised when you want to review something that's failing, and besides now you have Playwright CLI"* (translated).
> Raise it to investigate a FAILURE; for a routine visual check the main loop drives the browser itself via the
> `playwright-cli` skill. Reaching for an agent where a tool exists is one layer of indirection too many.

### Render conventions → a visual critic for that surface

A game RENDER (not a map, not one brush) is gated by a visual critic for that surface: it scores the render
against the sourced P0–P3 game-convention checklist — time/pause, movement/harvest/construction feedback,
resource/health HUD, camera/load — with BOTH a static per-part image check AND a live FUNCTIONAL traversal
that operates the controls. It tracks state, so a new fix cannot silently regress a category that already
passed. Its trigger otherwise lives only inside this project's own game-development conventions record, one hop from where you
decide which critic to spawn.

Do not confuse it with the two map critics: one judges a MAP's composition, another judges ONE terrain brush.
This one judges a running render against game conventions.

### When you need someone to OWN a task while you do something else → `grimorio.delegate` (read this BEFORE raising one)

**If a task needs someone to own it end to end, raise agent:grimorio.delegate.** Not a developer, not
whatever agent the task's subject matter suggests — a delegate owns ONE task end to end and returns a
**finished deliverable**, not a progress report. Reach for it when the work is a whole task rather than a
slice, and when you will not be watching every step. That agent exists for exactly this and it was raised zero
times in a twenty-hour session while its work was handed to the wrong types.

**"You will not be watching every step" is not the only reason to reach for a delegate.** The deeper one —
independence, not capability — lives at ref:skill/grimorio.flow-delegation#independence-not-capability--why-you-raise-a-delegate-ceo-ruling-2026-08-12.

**Why the wrong pick feels right, and it was made repeatedly:**
- A **developer or QA agent** is a specialist for a scoped change, not an owner of an objective. Handing it
  end-to-end ownership either overruns its contract or gets a correct refusal — three refusals in one session
  were exactly this.

| You need | Raise |
|---|---|
| Someone to OWN a task end to end while you do something else | **agent:grimorio.delegate** |
| One scoped change in a known area, by a specialist | the matching developer / `qa` |
| One narrow slice of a fan-out, non-recursive | agent:grimorio.scout |

**agent:grimorio.delegate is the owner:** it works one objective to completion against numbered checks, unblocks
itself, surfaces questions without parking its turn, returns a finished deliverable rather than a progress
report, and **tiers its own children** — so the volume goes down to `haiku` while the deciding stays where it
belongs.

**It is `opus` by declared default, and that is correct.** The delegate is the expensive tier because it does the
deciding; the saving comes from its children going DOWN-tier, never from under-tiering the owner. Do not pass
`model` to it.

**A delegate is only as good as its flow-brief** — a FILE (ref:tmp/<id>/brief.md), not a prose paragraph (that is
where compression hides), carrying: the principal's request verbatim, the branch objective, the specific task,
FULL context (so the delegate doesn't re-derive what already exists), numbered checks with runnable VERIFY
commands, a declared default-on-silence, and a failsafe bound, plus a notes folder. Write that brief before you
spawn, and then GUARD it: watch its milestones, not every file. -> ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate for the brief template and
the guardian protocol.

**Nothing about how an agent fans out belongs here.** This file reaches the parent AND the child identically, so a
child would be reading instructions for being a child — which is its own identity, not shared context. Down-tiering
volume to `haiku`, declaring a child non-spawning, reading this file at all: each lives in the agent that does it
(ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code's four-level split). **If you catch yourself writing "if you are the child…" in shared context,
or pasting an agent's own knowledge into a brief, it belongs in the agent** — and the spawn hook may carry only
what must be decided BEFORE the agent exists.

#### Vocabulary: `grimorio.delegate`, FLOW DELEGATE, and SPAWN — what this rule BINDS, HARD RULE

**Binds exactly one act: SPAWNING AN AGENT.** The three terms below name that act and its participants —
they are not an inventory of the word's senses, and nothing here depends on how many senses exist. Any OTHER
use of "delegate"/"delegation" is untouched by this rule, illustrations only, NOT a closed list: assigning
responsibility to a referenced document by name (ref:skill/grimorio.agent-writing#how-the-layers-reference-each-other's
"delegate by name — never copy criteria inline", ref:skill/grimorio.agent-writing#3-steps--protocol's "Delegate domain
knowledge to knowledge skills by name"), and the Gang-of-Four delegate-object design pattern used elsewhere in
this corpus (ref:skill/grimorio.game-patterns/project.simulation-patterns.md#update-method's "a delegate object"). None of
these is a spawn.

**`grimorio.delegate`** is the AGENT TYPE — a proper noun, kept exact by convention alone now: the two hooks that once exact-string-matched that literal, each with its own selftest, are both gone, so nothing mechanical enforces the spelling any more. **FLOW DELEGATE** is the CEO's own term — in translation, *"FLOW DELEGATE is one thing and SUB-AGENT DELEGATE is another"* — for a ROLE: whoever owns ONE task end to end in flow mode under a flow-brief. `grimorio.delegate` is its canonical filler, not its only one; the bare singular noun "a delegate" means THIS, which is why ref:skill/grimorio.fan-out and ref:skill/grimorio.flow-delegation are already correct as written and were never bleeds. **SPAWN** is the ACT of any agent raising any other; every agent does this, not only `grimorio.delegate`. **FAN-OUT** is its parallel-plural shape (N children at once), owned by ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize. The CEO called the act "SUB-AGENT DELEGATE"; this corpus says SPAWN instead because it removes the colliding root entirely — which is what he actually asked for — and because it is already the corpus's dominant word.

**NEVER use "delegate" as a verb for the act of spawning — write "spawn" instead.**
**NEVER write `delegates` / `delegating` / `delegated` / `delegation(s)` for spawned agents or for the act of spawning.**
**WHEN the literal agent type is meant ⟶ write it fully qualified as `grimorio.delegate`, never bare.**
**WHEN you mean two or more instances of the agent TYPE ⟶ write "two `grimorio.delegate` agents", never "two delegates".**

Why `grimorio.delegate` was not renamed to close this: two hooks once exact-string-matched the literal `"grimorio.delegate"`, each with a selftest on top, and a rename would have dangled both for a problem that is only a handful of act-sense bleeds — that is the reasoning that kept the name, and it stands on its own account-burn logic, not on the hooks. Both hooks and their selftests are gone now, so nothing mechanical still forces this file to load before every spawn or catches a stale plural/verb form — COMPLIANCE with the vocabulary rule above is prose alone, unenforced, same as the rest of this corpus once its hook is retired. Naming the ACT stays the cheap correct fix; renaming the AGENT stays the more disruptive one, for reasons that were never about a hook.

### Three architects — route by INDUSTRY, then by dimension (HARD RULE, 2026-07-22; extended 2026-08-08)
There is no single "architect". Web apps, games, and grimorio's own agent/skill/hook system are different
disciplines (DAL/routes/ORM vs ECS/data-vs-code/determinism vs agents-authoring-agents), so the architect role
is split by industry — the failure is defaulting everything to one and designing the game "like a normal web
app", or designing grimorio's own machinery like either:
- a **WEB app** change (the web frontend + its backend) → agent:grimorio.web-architect (reads the PO brief; owns
  the frontend↔backend/DAL contract, OWASP).
- a **GAME** change (the game's simulation service OR its replay render) → agent:grimorio.game-architect. This is ONE agent that runs
  two sequential phases in one context: it DESIGNS the mechanic first (seeing the code — this project's own
  game-design mechanics analysis grounds the design in the real sim/render), then LANDS it in game-code
  architecture as a subsequent step. For a genuinely new/open mechanic, `entropy` still diverges before its
  design phase.
- a change to **grimorio itself** — its own agents, skills, hooks, or rules — → agent:grimorio.system-keeper,
  grimorio's own architect for that industry (the `system-keeper` name is historical, not a different role).
  Distinct from the two above: its industry is not a product surface, it is the layer that builds the
  assistants. Raise it on EVIDENCE only, never a conclusion — the same unbiased-invocation discipline that
  binds every other constructed agent (below), now `grimorio.system-keeper`'s own standing rule. It still never
  authors what it decides — `grimorio.prompt-writer` does. -> ref:skill/grimorio.agent-writing/system-keeper-behavior.md
  for its own phase-chain entry point, and ref:skill/grimorio.agent-writing/system-keeper-phases/phase-3-placement.md
  for how it decides placement specifically — not restated here.
- a **build-vs-buy / stack / OPEX** question (any industry) → `solution-architect`.

So the game-architect is NOT the web-architect with a game hat, and it is NOT split into a separate designer +
architect — the CEO's ruling is one game agent, design-then-land, "reusing the neurons it already used for the
design". Design-having-seen-the-code (vs on paper) is the deliberate advantage of one agent owning both.

### A complete system design vs an architecture decision → `grimorio.design-orchestrator` / `grimorio.design-redactor`

The three architects above decide HOW or WHERE a change lands in code or stack. **WHEN what's needed is the COMPLETE standard design-artifact set (ref:skill/grimorio.system-design's own taxonomy), not one architecture decision ⟶ route to agent:grimorio.design-orchestrator instead of defaulting to an industry architect.** It never builds and never renders to HTML — that is a separate, later step.

**WHEN a finished `design.md` exists and needs to become an HTML page a human reviews VISUALLY ⟶ route to agent:grimorio.design-redactor**, never folded into the same invocation that produced the design.

### If the work needs a GATE, spawn the GATE DIRECTLY — never the builder alone (HARD RULE)

**NEVER let a builder raise its own gate.** This is a separate invariant from builders fanning out same-type
`haiku`-tier children for BUILD VOLUME, and the two must never be blurred together. Builder agents
(`game-developer`, `js-developer`, `ui-developer`, `go-developer`, …) DO carry the `Agent` tool — each one's own
memory behavior file already states this explicitly — and each MAY spawn `haiku`-tier children of its OWN TYPE,
only from inside its own phase's dispatch point(s), for build volume; that is sanctioned, current doctrine, and
nothing here forbids or contradicts it (the full mechanism:
-> ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm,
not restated here). Spawning an ADVERSARIAL GATE/REVIEWER OF ITSELF — a builder raising
`code-reviewer`, `security`, `ux`, or a critic to judge its OWN output — is a different act, on a different agent
type, and it is exactly what "never raise its own gate" forbids: self-gating, never same-type volume fan-out.

The agents actually hard-locked non-recursive — genuinely carrying `disallowedTools: Agent` on their own
frontmatter — are exactly: `grimorio.scout`, `grimorio.code-reviewer`, `grimorio.security`, `grimorio.ux`,
`grimorio.design-redactor`, `grimorio.prompt-writer`, `grimorio.unblocker`, `project.brush-critic`,
`project.conventions-critic`, `project.map-aesthetic-critic`, `project.map-content-critic`. **NEVER gloss this
list as "the critic/reviewer agents"** — `qa` and `manual-verifier` are NOT hard-locked, even though this file
elsewhere names both as the matching adversarial agent to spawn directly (see "Default mode: direct &
adversarial" above); name the precise set above instead of a category.

So a builder spawned DIRECTLY may build, and may fan out its own same-type children for volume — but it must
never spawn its own gate. Its output is **UNGATED** until an adversarial agent runs against it, and the burden
of running that critic/reviewer falls back on the caller. That is a CALLER bug, not the builder's.

So, before spawning: **does this deliverable need an adversarial gate before it can be believed** (a render vs a reference, a risky change needing `code-reviewer`, a feature needing QA)?
- **Yes → spawn the matching adversarial agent DIRECTLY** (`code-reviewer`, `qa`, `security`, `ux`, the matching
  critic — see "Default mode: direct & adversarial" above), briefed with the ACCEPTANCE CRITERIA, not the fix.
  **Or, if the whole build → gate → REWORK arc needs an OWNER driving it**, not just one gate, raise
  agent:grimorio.delegate for that.
- **No → spawn the builder directly.** Fine for a contained, self-verifying change.

**NEVER read a builder's own `Agent` tool — held for sanctioned same-type volume fan-out — as license to spawn
its own critic.** That is self-gating, the exact recursion this rule forbids, on exactly the agent type that
must never raise its own gate; a confused builder then spawns a gate-tree instead of a build-volume one.

Do NOT have a builder schedule the review back to the caller either — the caller then has to babysit an unfinished task, which is the coordination burden a direct spawn (or a delegate, for the whole arc) is there to absorb.

(Real case: a render fix was handed straight to agent:grimorio.game-developer, before the same-type
volume-fan-out exception existed for builders. It did the work correctly, then had to report "UNGATED — I have
no Agent tool", and correctly refused to author its own gate file, because **a self-authored gate is a forged
gate — worse than a missing one**. The main loop had to run the critic itself. One direct critic spawn would
have made the whole loop self-closing. The lesson survives even now that builders hold the `Agent` tool for
volume fan-out: self-gating is still forbidden — the reason today is the invariant itself, never tool absence.)

---

## Research & knowledge agents — when to invoke each

The tree above is the DEV/feature path. **Research and knowledge routing is separate** — and it is where the
"reach for a generic worker" reflex must be killed. Each research/knowledge agent has exactly one job:

| You need... | Agent | Why it, not another |
|---|---|---|
| "What am I missing? What don't I know?" — blind-spots, prior-art, react to a vision | agent:grimorio.entropy | DIVERGENT: breadth, adversarial perspectives, unknown-unknowns. NOT for gathering deep detail. |
| "Expand THIS one thing" — libraries, what was done, what worked/failed, applications, user feedback | agent:grimorio.researcher | CONVERGENT orchestrator: decomposes the topic, fans out hard-locked agent:grimorio.scout grunts (tiered), converges the cited report. Gathers/synthesises; does NOT decide or verify. |
| "Should we build / buy / borrow / reuse X?" (with OPEX) | agent:grimorio.solution-architect | Decides reuse > borrow > buy > build; owns the stack inventory + the ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize methodology. |
| "Verify this specific claim is true/false" | bundled `deep-research` | Adversarial true/false verification ONLY — rare; ~100 agents; **explicit opt-in** (once burned a session). |
| "DESIGN this — turn vision + findings into a concrete proposal" | agent:grimorio.game-architect | CONSTRUCTIVE/convergent design: descriptive proposals ("this is how it works / what we adopt / what's out"), grounded in prior-art. Runs AFTER entropy has diverged on the topic. |
| "Save / consolidate settled research or reference" | agent:grimorio.documentation | The librarian: triages keeper-vs-transient, consolidates perpetual knowledge, prevents sprawl. |

**Never repurpose an agent with a persona-override.** Invoking `entropy` with a "you are a senior designer,
be constructive, no open questions" brief suppresses its divergent identity — the panel silently doesn't run and
the blind-spots are lost (this happened FOUR times now; twice the CEO restored the divergence by hand, then twice
more in the "divergencia" incident 2026-07-22). If the work is constructive design, that is agent:grimorio.game-architect;
if the work is divergence, invoke `entropy` AS entropy.
The flow for a non-trivial design is always **entropy (diverge) → the human reacts → game-architect (converge)**.

> **The subtler, more common form of the same suppression: binding entropy's OBJECTIVE to your current backlog
> item.** You don't need a persona-override to kill divergence — restating the CEO's open goal as "explore X for
> OUR render / OUR 11 gaps / to fix Y" narrows it just as fatally, because you're briefing from *close-my-current-
> item*, not from his open words. For any open/divergent CEO instruction: **paste his words verbatim as the
> objective; add only context; author no scope of your own** — the two binary checks in ref:skill/grimorio.agent-writing#2-identity-paragraph
> PRINCIPAL-INTENT (d). And it is your FIRST move unprompted in a weak domain — see "PROACTIVE entropy" below; if
> the CEO had to say "divergencia", the rule already failed.

agent:grimorio.scout is the **hard-locked grunt** the orchestrators (entropy / researcher / solution-architect) fan out — you don't invoke it directly.

### Which comes FIRST — entropy vs researcher (the precise call)
When the user TELLS you something, they're telling you **what they KNOW** — not what they don't know they don't know. So:
- **Default / idea-finding / "we're exploring": `entropy` FIRST** (divergent) — it surfaces what you're missing and reacts to the user's vision (*"you also thought of X and Y, not just what you said"*). THEN the user decides, THEN `researcher` converges on the chosen thing.
- **`researcher` directly ONLY when the user explicitly asks to research a SPECIFIC, already-decided thing.**
Going straight to `researcher` on an exploratory question means **nobody diverged** — you get depth on the known and miss the unknown-unknowns. (This was a real miss.)

### The research interaction — two phases, both AGENT-orchestrated, documented throughout
1. **Explore (`entropy`)** — divergent. Entropy IS an orchestrator: spawns a panel of hard-locked agent:grimorio.scout grunts (one per lens), each documents its lens to ref:tmp/, entropy converges the ranked blind-spots.
2. **Decide (the human)** — the CEO picks what's worth digging into. Vision/decisions are his, never an agent's.
3. **Expand (`researcher`)** — convergent. The researcher IS an orchestrator: decomposes the chosen topic, fans out hard-locked agent:grimorio.scout grunts (tiered — Haiku to gather), converges the cited report.
4. **Triage + consolidate (`documentation`)** — decides what stays perpetual vs transient, consolidates the keepers.

The orchestration lives **IN the agent** (durable, not dependent on the main loop remembering); the **grunts (agent:grimorio.scout) are hard-locked non-recursive** (`disallowedTools: Agent`) — that is what makes the fan-out burn-safe. **Save-as-you-go** to ref:tmp/ means phase 2 builds on phase 1 and survives a compaction.

### HARD RULES of invocation (mirrored as triggers in `CLAUDE.md` → Agent SELECTION)

**1. NEVER use `general-purpose` (or any recursion-capable agent) as a research grunt or fan-out worker** — it spawns its OWN sub-agents when confused and reincarnates the account-burn. Fan-out grunts MUST be a non-recursive, purpose-built type. If none fits, STOP and propose one — never improvise `general-purpose`. **Nothing enforces this mechanically any more:** the hook that once denied a spawn of `general-purpose` or `claude` without a `GENERIC: <one-line reason no purpose-built agent fits>` line is gone, and that field now buys nothing — measured while it was hook-enforced, 58 of 584 logged spawns still broke this rule, so treat it as unenforced prose and read every spawn choice yourself. `Explore` is exempt from this rule on its own terms, not because of any check: it carries no `Agent` tool, so it is not recursion-capable and cannot reincarnate the account-burn this rule exists to stop.

**2. INVOKE A CONSTRUCTED AGENT UNBIASED — the task + the raw inputs, never a leading or confirmation-framed prompt.** A purpose-built adversarial or gatekeeping agent already carries its job in its identity; hand it the raw artifact plus the reference and say "do your job". Do NOT frame the ask as "verify my fix landed" / "confirm X is correct" / "the structure is fine, just check Y", and do NOT attach an accepted-limits allowlist of what not to flag — that biases a skeptic toward PASS and narrows its gaze to only what you pointed at. Leading prompts are fine for a generic multi-purpose worker; they are self-defeating for a constructed agent whose whole value is its independent judgment. **This includes a DIAGNOSIS: hand the agent the MEASUREMENT and the TASK, never your diagnosis of the cause** — a diagnosis in a brief is an anchor a weaker agent adopts. State the observed failure, mark any attached hypothesis as unverified, and let it find the cause (proven 2026-07-28: QA queried the database the brief's diagnosis blamed, found it clean, and returned the real structural cause instead).
-> full rule, the in-repo proof, and the construction-level defense (the personality/behavior split): ref:skill/grimorio.agent-writing#2-identity-paragraph skill

---

## Knowledge harnesses — WHICH one owns a settled decision, and WHEN to invoke it

*(Moved out of `CLAUDE.md` 2026-07-30 — it is a routing table, and routing is this skill's job.)*

Five agents maintain project memory in **clean context**. Invoke a harness **only when a decision, discovery, or
research LANDS and is settled** — never mid-exploration, never per feature. Before writing substantial knowledge
inline anywhere, stop and route it to its owner:

| Trigger (something settled) | Harness | It writes to |
|---|---|---|
| A confirmed **product** decision/priority (offering, economy, categories) | agent:grimorio.po | ref:skill/grimorio.po-memory |
| A non-obvious **WEB architecture** decision (structure, why, how pieces combine) | agent:grimorio.web-architect | ref:skill/grimorio.architect-memory |
| A non-obvious **GAME** design/architecture decision (a mechanic + how it lands in sim/render code) | agent:grimorio.game-architect | ref:skill/grimorio.game-design |
| A non-obvious **dev** gotcha (hard library, trap) | agent:grimorio.js-developer | this project's own developer trap log |
| A finished **research/investigation**, or reference/theory to keep for later | agent:grimorio.documentation | ref:skill/grimorio.documentation-memory |

**A completed research/investigation is ALWAYS the trigger for agent:grimorio.documentation.** Do not inline a
research report into POC notes or leave it chat-only.

### How to invoke one

- **Pass the FULL content**, verbatim and complete — never a compressed summary. The harness saves the faithful
  artifact; a lossy summary defeats the whole purpose of having one.
- **Do NOT micromanage its file paths or structure.** Each harness loads its own `{agent}-memory` skill and
  already knows where its files go and how to index them. Give it the content + the intent; let it place and
  index. If you find yourself dictating exact paths, you do not trust the harness — stop.
- **Applied vs saved-for-later:** applied architecture/product-in-use → its owning agent; general research and
  reference-for-the-future → agent:grimorio.documentation.
- **Detection efficiency:** do not interrupt mid-discussion. Note it inline, then do a single harness pass once
  the thing is settled. When in doubt → defer, do not invoke.

---

## PROACTIVE entropy — diverge BEFORE the decision is final (HARD RULE)

Run agent:grimorio.entropy on **any non-trivial design or decision before it is finalized** — especially where the
team lacks domain expertise (game design being the standing example). **Do NOT wait to be asked.**

The blind-spot pass is the only place the perspectives the team does not have — the domain expert, the skeptic,
the first-time spectator, the competitor — surface unknown-unknowns and prior-art that would otherwise be missed.
Skipping it because the momentum is on building, and leaving the CEO to invoke it by hand, is a real and repeated
failure of this system, not a scheduling choice.

---

## REFERENCE-FIRST for VISUAL / AESTHETIC deliverables (weak-domain compensation, HARD RULE)

For anything judged by how it **LOOKS** — renders, map/tile art, UI polish — this team and the main loop are
demonstrably WEAK. The compensating protocol is not optional:

1. **Gather concrete visual REFERENCES and distil the target look FIRST, before building.** Never build toward a
   vague "make it look good" or "like the pack". If there is no reference, **go get one** — do not leave the CEO
   to supply it.
2. **Judge against the reference through the ADVERSARIAL visual critic** (the matching visual critic for that
   surface, or a UX critic) — **never** the builder's self-report.
3. **Open the actual rendered image yourself** and put it beside the reference before accepting it or showing it
   to anyone.

Two repeated failures this closes: (a) researching the SYSTEMS layer — algorithms, generation, fairness, the
comfort zone — while skipping the reference/look layer entirely; (b) accepting "looks good / real art ✓" from a
builder's text report instead of comparing the pixels. Both left the CEO hunting references and rendering the
verdict himself, session after session.

**This rule is NOT visual-exclusive — it has already been generalized twice.**
ref:skill/grimorio.ai-game-dev-methodology#reference-first-applies-to-mechanics-not-just-visuals extended it once, from
LOOKS to game mechanics/systems design (retrieve ANCHOR GAMES before designing a mechanic).
ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md extends it a second time, to any decomposition or design
decision in any domain — search for a concrete EXEMPLAR of the SHAPE being decided, not only visual work. Read
that file for the mechanism and the hard rule; it is not restated here.

-> The full post-mortem of this failure mode: this project's own research bibliography, its terrain-render forensic record (read its own "method and its limits" section before trusting anything in it)

---

## The ESCALATION LADDER — five agents, five different distress signals

These five are near-neighbours and are routinely confused. They do **not** collapse into one another: each fires
on a **different signal**, and each returns a **different kind of output**. Match the signal, not the vibe.

| Signal (what is actually happening) | Agent | Tier | What it returns |
|---|---|---|---|
| A design/decision is about to be finalized and nobody has challenged it | agent:grimorio.entropy | per ref:skill/grimorio.agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it | Divergent ranked blind-spots. Proactive — fires before trouble. |
| ONE concrete technical blocker: failing build, infra dead-end, missing capability, under-specified fork | agent:grimorio.unblocker | per ref:skill/grimorio.agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it | A verified way through, resolved autonomously if reversible+low-impact, else a decision-ready escalation. |
| The CEO is FRUSTRATED / chewing the main loop out over a failure or a cost — above all a repeated failure the main loop does not understand | agent:grimorio.adviser | **FABLE** | ADVICE only: the real misconception diagnosed + one prescribed unblock. It never builds. |
| A deliverable has failed the adversarial gate SEVERAL times AND the main loop is round-robining workers itself | agent:grimorio.delegate | **Opus** | A FINISHED deliverable — it owns the task end-to-end. |
| The assistant system itself is failing, drifting, or undesigned — a grimorio agent/skill/hook misbehaving, a rule that fires nowhere, a role nothing owns | agent:grimorio.system-keeper | **Opus** — the coordinator/orchestrator default, per ref:skill/grimorio.agent-tiers#every-agent-declares-its-own-default--omit-model-ceo-fix-2026-07-29-enforced-here-2026-07-30 | A decided change, already placed, verified, and gated — nothing further to route. |

**The brief for that last signal must carry EVIDENCE only, never a conclusion** — the same weight as the
"INVOKE A CONSTRUCTED AGENT UNBIASED" rule already in this skill
(ref:skill/grimorio.agent-selection#hard-rules-of-invocation-mirrored-as-triggers-in-claudemd--agent-selection), applied
to one more agent.

**`adviser` is the ONE agent at FABLE** (CEO, 2026-07-29) — a deliberate ref:skill/grimorio.agent-tiers#the-one-standing-fable-exception-plus-a-second-distress-signal-at-opus-mandated-not-judgment-calls EXCEPTION: the
cheapest-capable default is overridden because its failure mode is "the main loop cannot see its own
misconception", which is the only one worth the top reasoning tier.

### Chewed-out → the Fable adviser (CEO present)
On the frustration signal the main loop must **STOP grinding and spawn the adviser before attempting anything
more**. The main loop stays on communication and direction; the heavy unblocking reasoning goes to the adviser.
The adviser **advises only** — it diagnoses the misconception and prescribes the single highest-leverage unblock,
grounded in evidence and prior-art; the architect and Sonnet builders execute that prescription.

### Stuck loop → the DELEGATE (CEO absent, self-triggered)
This is the twin of the chewed-out rule for when nobody is present to raise the alarm — and here the delegate
**finishes the task rather than advising on it**.

- **The trigger is the churn itself.** Several failed critic/gate passes *plus* the main loop spawning fix after
  fix with no single owner driving it to done. (The case that created the rule: a stair render took 5 build passes
  and 4 critic gates amid main-loop churn before it cracked.)
- **Schedule an Opus-tier delegate that OWNS the task end-to-end, with latitude to CHANGE APPROACH** — not to
  re-run the same worker on the same operation. Reuse agent:grimorio.delegate, which already owns an objective to
  completion against numbered checks, unblocking itself and surfacing questions without parking its turn.
  **Never** improvise `general-purpose`.
- **Brief it by EXPECTATIONS, never by a leading fix** — a specialization of the unbiased-invocation rule above.
  Do not hand it "here is THE fix" or an operation to perform. Define **how it knows it is done and correct — the
  acceptance criteria** — and let the powerful delegate find the path. For a visual deliverable that criterion is
  typically *"coherent + matches the reference image"*; that is an example, not the rule. Every stuck task gets its
  own success-expectation.
- **Why it exists:** it unblocks extreme cases autonomously when the CEO is away, and it **offloads the main loop**
  from churning spawns.

---

## Loop vs graph — grimorio's own working methodology (DECIDED, 2026-07-28)

The CEO asked for the loop-vs-graph distinction (ref:skill/grimorio.documentation-memory doc 58) to be re-analysed as a
methodology for how GRIMORIO ITSELF works — not as product architecture. Re-analysed and decided:

**The default for known-shape, gated work is the GRAPH — the pre-mapped pipeline — not main-loop
improvisation.** The main loop improvising its sequence of spawns is precisely doc 58's "loop":
unpredictable, uncontrolled token burn, hard to debug — and, measured on 2026-07-28, the generator of every
skipped gate that day (QA invoked zero times across ten fronts; the reviewer once, on 15 commits at once). In a
pre-mapped pipeline, QA and review are EDGES the work must traverse; in an improvised loop they are rules the
loop must remember at exactly the moment it is busiest — and doc 59 gives the mechanism for why remembered
rules decay under load (goal tokens lose attention weight while still present).

The decision, concretely:
- **Work that matches a known shape** — a feature, a bug, a refactor, anything whose deliverable needs a gate —
  runs a PRE-MAPPED route, not main-loop improvisation, and the `Workflow` tool remains that route for a
  fan-out. **AUTHORING that route in advance is SETTLED, not open:** it is authorable, and it is already
  practiced and measured in this repo — the method is ref:skill/grimorio.fan-out#split-planning-from-execution--a-temporal-axis-for-pieces-that-only-collide-at-write-time-ceo-2026-08-03
  ("Split PLANNING from EXECUTION"), and the measurement is
  ref:skill/grimorio.fan-out/project.measured-runs.md#measured-the-same-fan-out-task-three-stages-three-outcomes-ceo-2026-08-04
  ("Measured: the same fan-out task, three stages, three outcomes", split into its own file 2026-08-08).
  **What CARRIES an authored plan is a FILE, per piece** —
  already the standing rule above ("A delegate is only as good as its flow-brief — a FILE, not a prose
  paragraph") and in ref:skill/grimorio.fan-out (each child owns `tmp/<child-id>/`); the reason is that a paraphrase
  degrades at every hop it crosses, while a path handed to the next reader does not. **Per-agent EMISSION of that plan now has a standing rule
  and a home, not just a practiced method:**
  ref:skill/grimorio.fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08 requires every
  spawn-capable agent to write its own graph — nodes, edges, tier per delegated node, what it keeps, what
  couldn't be routed — to `tmp/<its-id>/graph.md`; the exact trigger lives at that same pointer, not restated
  here. This closes the AUTHORING half only, and it is a NEW instrument, not `--outline --render md`: that render
  stays diagnostic, over one agent's already-written behavior-file skeleton — the loop's graph is
  context-dependent per task, so only the agent running the task can produce it. **What remains OPEN is a
  DIFFERENT question, and it stays open: what ENFORCES traversal of an authored plan.** Planning ahead and being made to follow the plan are two
  separate questions, and only the first is settled. `grimorio.feature-orchestrator`'s own behaviour file, which
  used to carry this route AS the graph, retired the same day this passage was first flagged (`PLAN.md` item
  1.1), and nobody has re-decided what carries — let alone enforces — the graph for that case now. Candidates,
  none chosen: agent:grimorio.delegate's flow-brief with its numbered checks; the `Workflow` tool, already the
  answer for a fan-out; something else. Do not silently pick one — enforcement is a real open question for the
  CEO or the main loop to settle, not a gap to fill by inertia.
- **The improvised loop is reserved for what graphs are bad at** (doc 58's own boundary): exploration and
  research, micro-operations (a rename, a one-line fix), and interactive direction with the CEO.
- **Hybrid, not dogma** — exactly doc 58's recommendation: loops for flexibility INSIDE graphs for
  reliability. Each pipeline node still reasons freely; the SEQUENCE and the gates are authored.
- **A graph does not preserve intent by itself** (doc 59: drift was measured IN multi-agent workflows, ~50% by
  ~600 interactions) — so the intent clamp and PRINCIPAL-INTENT verbatim rules stay in force on every edge.
  The graph fixes WHO RUNS AND WHEN; the clamp fixes WHAT THEY ARE FOR. Neither substitutes for the other.

The tell you are in the wrong mode: you are sequencing spawns one at a time, deciding after each what comes
next, on work whose shape was known from the start. That is a loop doing a graph's job — what still has no
owner is ENFORCEMENT of that graph once authored (see "What remains OPEN" above).

---

## Known orchestration patterns — a reference, not a route (2026-08-03)

CEO, on what replaces `feature-orchestrator`'s retired pipeline: *"You do not need a whole skill, just a
reference of KNOWN PATTERNS... As one more reference."* This section is that reference: a short catalog of
sequences this project has actually run, each pointing at its fuller protocol. It answers "what has worked
before", never "what enforces it" — the open ENFORCEMENT question above (what mechanism makes an authored
build→gate→rework graph actually get traversed) is untouched by this list and stays open.

**NEVER treat any row below as a required route, and never let this table be rebuilt into an enforced
pipeline under another name.**

**WHEN choosing among known-shape work ⟶ recognize these as examples a reader can follow, not a mechanism a
gate checks against.**

| Pattern | Sequence | Source |
|---|---|---|
| Iterative build | build → build → build → (at the merge) agent:grimorio.code-reviewer | CEO, quoted below; `CLAUDE.md` rule 18; this file's "Gate the CHANGE, never the accumulation" above |
| Greenfield / full feature (short form) | architect → developer → developer → developer → agent:grimorio.qa → agent:grimorio.code-reviewer (before merge) | CEO, quoted below; full artifact-handoff version: `import:skill/grimorio.feature-workflow#routing-rules`, "Feature" row |
| Bug fix | security triage (text-only) → architect check (if hard/cross-service) → developer diagnoses → architect validates (if step 3 says hard/multi-layer) → manual-verifier confirms the bug → developer fixes → qa regression → manual-verifier confirms the fix | `import:skill/grimorio.feature-workflow#bug-triage-progressive-escalation` |
| Refactor | architect → developer → qa → code-reviewer | `import:skill/grimorio.feature-workflow#routing-rules`, "Refactor" row |
| Research, two-phase | agent:grimorio.entropy diverges → the CEO/human decides what's worth digging into → agent:grimorio.researcher converges → agent:grimorio.documentation consolidates | this file, "Which comes FIRST — entropy vs researcher" and "The research interaction — two phases" above |
| Visual/aesthetic, reference-first | gather concrete visual references → build toward them → judge through the adversarial visual critic → open the actual rendered image yourself | this file, "REFERENCE-FIRST for VISUAL / AESTHETIC deliverables" above |

CEO, verbatim, on the first two rows: *"build, build, build, and at the end of the commits, at the merge, you
raise a code reviewer. Or greenfield: architect, then dev, dev, dev, then QA, and then code reviewer before
the merge. Things like that."*

---

## Maximal expansion: the full pipeline (large feature only)

For a change big enough to justify the full pipeline — typed-artifact handoffs, the two developers in
parallel, the adversarial cluster fanned out — the sequence and artifact contracts live in the ref:skill/grimorio.feature-workflow#artifact-directory-structure
skill; per-agent reasoning is each `{agent}-memory` skill. This is the heavy path, not what you reach for on
every little task. **Who composes it** ties to the same open ENFORCEMENT question above (loop vs graph) — not
re-stated here.

---

## Agent vs skill — the boundary

Some of what looks like "an agent" might be better as a **skill that triggers** (knowledge surfaced on a keyword) than a full subagent (a separate reasoning context). When in doubt: if it needs an independent adversarial *perspective*, it's an agent; if it's *knowledge* the current context should apply, it's a skill.

## REWORK rules (when the pipeline does run)

Each adversarial agent has its own counter (max 2 cycles), independent of the others. **NEVER lift the cap, by any agent, for any reason.** **WHEN cycle 2 still fails AND a finding is still open ⟶ it is ESCALATED, never shipped past silently and never given a third attempt** — the full contract (the NOT-LIFTABLE cap and the escalate-at-cap rule) lives at ref:skill/grimorio.feature-workflow#anti-patterns (#3) — not restated here.

---
