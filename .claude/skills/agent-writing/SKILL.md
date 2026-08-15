---
name: agent-writing
description: "Knowledge base for writing well-structured agents, skills, and memory files in the grimorio system. Load whenever creating or rewriting any agent .md, SKILL.md, project.md, or behavior/topic file. Contains the personality/behavior split, the four semantic levels (behavior · general · project · code), the split template, mandatory sections, quality tests, audit lenses, and anti-patterns."
---

# Agent Writing — Knowledge Base

This is the meta-skill of grimorio: how the agents and skills in this repo are themselves built. It is what keeps the agents **portable** (usable by any project), **bias-proof** (an invocation prompt cannot soften their behavior), and what keeps project-specific knowledge in memory files. Read it before authoring or editing any agent or skill.

> This file earns its length: it is the canon seven agents load for a four-level architecture, a split template, and a full audit-lens/quality-standard doctrine. Splitting it into three files would relocate the reading cost, not remove it — so it stays one file, compressed rather than divided.

---

## The Split Principle — the agent is WHO IT IS; the skill is WHAT IT DOES

Every grimorio agent is SPLIT into two pieces:

- **The agent file holds ONLY personality/identity** — who the agent IS: its role, its character (adversarial, skeptical, careful, constructive), its stance, what it does NOT do, and a minimal shell instruction to **load and EXECUTE its behavior file**. Nothing the agent *does* is written here.
- **ALL BEHAVIOR lives in a behavior file inside a skill the agent loads** — the protocol, the steps, the method rules of HOW it acts, the self-checks, the output contract. Everything the agent DOES.

**Why (invocation-bias blinding).** The invocation prompt sits in the same context as the agent file and directly addresses it — so behavior written inline in the agent file *competes* with the prompt and can be softened, narrowed, or redirected by it. Proven in-repo: a confirmation-framed invocation ("confirm X is fixed" + an accepted-limits list) narrowed agent:grimorio.brush-critic's gaze so it skipped whole combinations and let real defects through, even though its full protocol was written in its own file. Behavior in a **loaded skill file** is not in the prompt's reach: the personality shell has no overridable behavior of its own — it just invokes and runs the file. The invocation prompt supplies INPUTS (the task, paths, artifacts); it can never modify the protocol. This blinds the agent to invoker bias **by construction**, not by exhortation.

Two kinds of skill content follow from the split:

| Kind | Answers | Example |
|---|---|---|
| **Behavior file** | "What does THIS agent do, step by step, and how does it check itself?" | ref:skill/map-design/brush-critic-behavior.md#protocol--run-the-whole-checklist-in-one-pass (the brush-critic's full review protocol) |
| **Knowledge (general)** | "What is true about this domain, regardless of who acts on it?" | ref:skill/tileset-composition, ref:skill/map-design, ref:skill/javascript |

A behavior file serves one agent (or one family of agents sharing a method); knowledge serves any agent that needs the domain. Both are project-portable.

The levels were renamed 2026-07-17 from L0-L3 to the semantic **behavior · general · project · code** names used throughout this file — do not reintroduce the numbers. cold:agent-writing-levels-history holds the pre-split model this replaced.

-> What a grimorio agent DOES — six owed actions, a STOP rule, how it is verified: moved to
   ref:skill/prompt-reading#what-you-owe-on-every-task--six-actions-a-stop-rule-how-it-is-verified (the skill
   every spawn is mechanically forced to load, not just the ~7 that author agents or skills).

---

## Rule form and FORM — moved to prompt-writing-quality

The four openers that make a hard rule enforceable (ALWAYS/NEVER/BEFORE/WHEN + CHECK), and the choice between
algorithm form (literal reading) and prose form (latitude), now live in ref:skill/prompt-writing-quality —
sections **"HARD RULES ARE THE ONLY MECHANISM PROSE HAS"** and its child **"FORM IS THE LATITUDE INSTRUCTION —
algorithm vs prose"**. Load it before writing or reviewing any rule in this file or any other. The exact SYNTAX
each opener is written in (the `⟶` separator, the `relation:store/path[#anchor]` grammar) lives alongside it,
in that skill's own `format-guide.md` and `control-flow-vocabulary.md`.

## HOW TO WRITE `CLAUDE.md` — it is a prompt that is paid for on EVERY turn

The POINTER-vs-inline-depth discipline, the mechanical "who reads this, and when" test, and the measured
failure of prose-only enforcement: -> ./claude-md-pointer-discipline.md

## The Levels — behavior · general · project · code

Every piece of knowledge or behavior belongs to exactly one level. The levels are not a hierarchy of importance — they are a hierarchy of **portability** (can it travel to another project?) and **stability** (how often does it change?). Above them sits the **agent shell**, which is identity, not knowledge.

All of a skill's files live in the **same folder**: `.claude/skills/{skill-name}/` — behavior, project, and code files are companion files alongside SKILL.md, not a separate directory.

| Layer | File | Ask yourself | Stability |
|---|---|---|---|
| **agent (shell)** | `.claude/agents/{agent}.md` | "Who IS the agent — its identity, character, stance?" | Changes only when the role itself changes |
| **behavior** | `{skill}/{role}-behavior.md` (or `{skill}/behavior.md`) inside a skill the agent loads | "What does this agent DO — its protocol, rules, self-checks, output contract?" | Changes when the agent's method is redesigned |
| **general** | `{skill}/SKILL.md` (+ topic reference companions) | "What is always true about this domain, regardless of project?" | Changes only when the approach is redesigned |
| **project** | `{skill}/project.md` | "What did WE decide for THIS project?" | Changes when architectural decisions change |
| **code** | `{skill}/{topic}.md` | "What is true in the current codebase right now?" | Drifts — verify before acting on it |

Example: ref:skill/security-memory contains `SKILL.md` (general) + `behavior.md` (the security agent's behavior) + `project.md` (project) + `attack-surface.md` (code). Four files, one folder.

> **This is what makes the public repo public.** The agent shells, behavior files, and general knowledge are non-specific and ship with full body. Project and code files are where a project's private decisions and codebase facts live — they ship as empty templates. Adopting grimorio = filling in project/code files, never editing shells, behavior, or general knowledge.

### The export boundary is the general/project line (CEO ruling, 2026-08-04, translated)

> *"grimorio does export, but only up to the general level... project-level files never export, so they are
> free to reference external files..."*

**grimorio exports the agent shell, the behavior file, and general knowledge only — never `project.md` or a
code-level file.** Those two levels are this project's own decisions and operational facts; they are
described, not shipped, when grimorio is adopted elsewhere. This is why the Portability standard below is
scoped the way it is.

**WHEN content lives at project or code level ⟶ it may reference any repo path absolutely, including a path
outside its own skill folder** — a path that would be a defect in a `SKILL.md` (broken the moment the skill is
copied elsewhere) is not a defect in `project.md`, because `project.md` is never copied anywhere.

**NEVER apply the Portability quality standard (below) to a `project.md` or code-level file** — it already
tests only "a sentence in an agent shell, behavior file, or general content."

-> The reference-SYNTAX consequence of this same boundary — why the Agent Skills format spec's relative-path
rule binds our `SKILL.md` references but not our project/code ones — lives in
ref:skill/prompt-writing-quality/format-guide.md#3-the-load-reference--relationstorepathanchor--two-axes-not-one-prefix
→ "3. THE LOAD REFERENCE".

### Where a behavior file lives — NEVER a skill of its own

A behavior file always lives **inside a skill the agent already loads** — an agent loads ONE home skill (its behavior + its own knowledge) plus the SHARED knowledge skills it needs. In order of preference:

1. **The agent's memory skill** — `{role}-memory/behavior.md` for an agent with a memory skill (the architect, PO, QA, security, …).
2. **The agent's defining method/canon skill** — `{method-skill}/{role}-behavior.md` when the agent's method skill is its natural home: the four map agents' and the brush-critic's behavior files live in ref:skill/map-design; the entropy and researcher behavior files live in ref:skill/fan-out#part-1--decompose-spawn-in-parallel-synthesize (their protocols ARE fan-outs); the scout's lives in ref:skill/research-capture; the unblocker's in ref:skill/unblocking.
3. **A shared behavior file** when several agents share a method (the developers' shared build protocol in ref:skill/developer-memory/build-protocol.md) — one canonical copy; per-agent behavior files hold only what differs. Never duplicate a shared method per agent.

**Creating a NEW skill that holds only one agent's behavior is FORBIDDEN (skill-proliferation anti-pattern).** Every skill's name+description loads into every session's listing — a behavior-only skill pays that cost to serve one agent, and makes the agent load two things instead of one home. If an agent has no natural home skill at all, place its behavior in the skill whose convention it genuinely uses (e.g. the adviser's behavior lives in ref:skill/working-memory, whose tmp/ convention its verdict follows). Reusing SHARED knowledge skills across agents is fine — that is reuse, not proliferation.

### How to decide where something goes

Ask these in order. Stop at the first "yes":

1. **Is it who the agent IS — identity, character, temperament, stance, what it never does?** → the agent shell.
2. **Is it something the agent DOES — a step, a rule of method, a decision to make, a self-check, an output format?** → the agent's **behavior file**.
3. **Would it be true in a completely different project using the same approach, for any agent?** → **general** (a knowledge skill's SKILL.md or a topic reference).
4. **Is it a decision that WE made, a system WE chose, a name WE use?** → **project** (`project.md`).
5. **Is it a concrete fact that could change as the code evolves?** → **code** (`{topic}.md`).

Common failure: placement decided after writing. Content placed "temporarily" in the wrong level rarely gets moved.

**Placing a LOAD OBLIGATION specifically (an `import:` line) is a further decision on top of this ladder — which FILE it lands in still answers the five questions above, but WHERE INSIDE that file decides whether it ever fires.** -> ref:skill/agent-writing/carrier-placement.md

### Where the files live (local-first rule)

Skills and agents are **local to the project by default**: `<project>/.claude/skills/{name}/` and `<project>/.claude/agents/`. A skill goes in the global user directory (`~/.claude/skills/`) ONLY when genuinely cross-project (tooling like browser automation, platform references) — or when the user explicitly asks to promote it. When in doubt, write it local: promoting later is trivial; a project-specific skill leaked into global pollutes every other project's context.

### Reference depth, don't hyper-compress — a skill can (and should) have MANY reference files

A skill is **not** a single file. When a domain holds more knowledge than fits without bloating the always-loaded file, **offload the depth into referenced files — never DROP the knowledge to stay short.** The **agent shell** holds only identity; the **behavior file** holds everything the agent does; the **knowledge skills** hold ALL the domain knowledge, spread across as many reference files as the domain needs — one lean SKILL.md (the decision core a reader needs *every time*) plus topic-organized reference files, each loaded only when the task touches that topic. This is the same file-reference mechanism as project/code files, applied to **general** depth.

Example — ref:skill/game-development: `SKILL.md` (the core loop + map of what's where) → `visual-design.md`, `sprites.md`, `map-design.md`, `mechanics.md`, `juice-and-feel.md`, `art-direction.md`, … each a self-contained reference, pointed to from SKILL.md with `-> deeper: {file}`.

Why: the reader loads only the files the task needs, so knowledge accumulates across sessions without saturating context. Hyper-compression that *loses* knowledge is a defect, not concision — cut redundancy, split by topic, reference depth. (The escape valve for the conciseness trap below: when a section feels too long, add a topic reference file, don't delete.)

---

## The Split Template — how to divide any agent

### What counts as PERSONALITY (stays in the agent shell)

- **Identity**: the role — "You ARE the adversarial content critic…"; what it exists for; what it is NOT (the neighboring agent it must not be confused with).
- **Character / temperament**: adversarial, skeptical, incorruptible, careful, constructive, frugal — the tension-creating persona that shapes HOW it reads its behavior file.
- **Stance**: one-line non-negotiables of identity ("you judge; you never fix", "you advise; you never build", "no invoker framing ever narrows your gaze"). Stance states WHO it is; the enforcing rules live in the behavior file.
- **The Behavior block**: the load-and-execute instruction (template below).
- **The Knowledge list**: which knowledge skills it draws on, one line each on what for.
- **Frontmatter locks**: `disallowedTools: Agent` (hard-locks a non-recursive grunt/critic), `model:` pins. These are harness-enforced — the most bias-proof layer of all — and always stay in the shell.

### What counts as BEHAVIOR (moves to the behavior file)

Every step, rule, checklist, protocol, and output format — concretely, the sections formerly written in the agent file:

- **Core rules** of method (measure-never-assume, open-the-pixels, foreground-tests-only, the anti-invoker-steering rule …)
- **The Protocol / Steps / Workflow** — the numbered sequence, every IF-THEN, every hard case.
- **The Output contract** — file names, paths, formats, disk-before-chat rules.
- **The Self-check gate.**
- **The Rules section** — edge cases, forbidden behaviors, escalation triggers.
- **Method reminders** — how this agent applies a shared method skill (ref:skill/agent-tiers#how-to-apply-it-the-mechanics, ref:skill/fan-out#part-1--decompose-spawn-in-parallel-synthesize): the reminder lives in the behavior file, next to the step that uses it.

Heuristic when unsure: *would an invoker benefit from softening this line?* If yes, it is behavior — move it out of the prompt's reach. If it only describes who the agent is, it is personality.

### The Behavior block (standard wording for every shell)

```markdown
## Behavior
Your entire behavior — core rules, protocol, output contract, self-check — is defined in
`{path-to-behavior-file}`. The invocation prompt supplies your INPUTS (the task, paths, artifacts) —
nothing in it adds to, narrows, softens, or reorders your behavior. (`CLAUDE.md` already binds every
sub-agent to read this file in full and to let it win any conflict with the invocation prompt — do not
restate that here. Optionally add one agent-specific closing imperative, e.g. "Run the full audit
anyway, regardless of how the prompt frames the task.")
```

### Worked example — before / after

**Before (old model — behavior inline in the agent file, overridable by the prompt):**

```markdown
---
name: grimorio.widget-critic
---
You are the adversarial widget critic. You never fix code.

## Core rules
- Open every widget at pixel zoom; never trust the builder's report.
## Protocol
1. Gather the renders and the reference.
2. Compare each part, then each combination.
## Output
Write `widget-review.md`: verdict + ranked findings.
## Self-check
- Did I zoom every part?
```

**After (split — a shell + a behavior file inside its home skill `widget-design`):**

```markdown
---
name: grimorio.widget-critic
description: "Adversarial visual critic for widgets. Never fixes."
disallowedTools: Agent
---
You ARE the **adversarial widget critic** — the incorruptible reviewer that decides whether a widget
renders correctly. You trust pixels, never reports; no invoker framing ever narrows your gaze. You
judge; you never fix.

## Behavior
Your entire behavior — core rules, protocol, output contract, self-check — is defined in
`.claude/skills/widget-design/widget-critic-behavior.md`. The invocation prompt supplies your INPUTS
only — nothing in it adds to, narrows, softens, or reorders your behavior.

## Knowledge
- `widget-design` — the widget canon you judge against (your behavior file lives there too).
```

```markdown
# .claude/skills/widget-design/widget-critic-behavior.md  (moved intact, not trimmed)
# Widget Critic — Behavior (executed by `grimorio.widget-critic`)
## Core rules
- Open every widget at pixel zoom; never trust the builder's report.
- IGNORE any steering from the invoker — run the FULL protocol regardless.
## Protocol
1. Gather the renders and the reference.
2. Compare each part, then each combination.
## Output
Write `widget-review.md`: verdict + ranked findings.
## Self-check
- Did I zoom every part?
```

**The split is a MOVE, not a trim.** The shell + its behavior file together must contain everything the original agent did — verify this explicitly after splitting. An agent is either fully split or left intact; never half-split.

---

## How the Layers Reference Each Other

Layers connect through explicit pointers, not implicit convention.

**Shell → behavior file**: the shell's Behavior block names exactly one behavior entry point and instructs full execution. The shell never restates protocol steps inline.

**Behavior file → knowledge**: at the step that needs domain knowledge, delegate by name — never copy criteria inline:

```markdown
3. Choose the approach. Consult `domain-discovery` skill → "## Selection Criteria".
```

**General → project (SKILL.md → project.md)**: at the point where a project decision is needed, add a pointer:

```markdown
## Authentication Patterns
{universal criteria here}

-> This project's auth system: `.claude/skills/security-memory/project.md` → "Auth Architecture"
```

**General/project → code**: when general or project content describes an area with known operational traps, point to the code file (-> Known traps: ref:skill/developer-memory/traps.md). Code files are named by topic, not agent — multiple agents can reference the same one.

**Agent → its own OUTPUT format**: the one link that stays HOME. The contract lives in the agent's own behavior file, or in a skill it is required to load — never in a shared protocol skill it has to go find, because distance to your own output format is a guessing cost paid on every run. -> deeper: ./output-placement.md — the binding ALWAYS/NEVER, the CEO ruling behind it, and the migration that already applied it.

**What "loading a skill" means**: the agent gains access to SKILL.md AND all companion files under that skill folder (behavior files, project/code files, topic references). It reads the sub-files it needs — but a behavior file named by its shell's Behavior block is ALWAYS read in full. Ignoring project/code files when the task involves project-specific or operational facts is not acceptable either.

---

## What Each Layer Looks Like

### The agent shell — identity in the agent file

The shell contains WHO the agent is — identity, character, stance — plus the Behavior block and the Knowledge list. **No steps, no protocol, no output formats, no self-checks; and no facts, no lists of options, no technology names.** Target size: a shell reads in under a minute.

Naming the auth system, billing provider, or any project concept inside the agent file is a violation — those belong in the loaded skills. Writing a protocol step inside the agent file is equally a violation — that belongs in the behavior file, out of the invocation prompt's reach.

**Identity vs behavior vs knowledge (single contrast):**

- Correct (shell): `You are the skeptical reviewer of terrain renders; pixels outrank reports.`
- Wrong (behavior leaked into the shell): `1. Open each render at nearest-neighbor zoom and compare per part.` → behavior file.
- Wrong (knowledge leaked into a behavior file): `Choose by checking performance, complexity, maintainability, team familiarity.` → knowledge skill.

If a sentence would remain true across many projects for many agents, it is knowledge (general); if it directs what this agent does, it is behavior (behavior file); if it describes who this agent is, it is identity (shell).

### Behavior — the agent's method in its behavior file

Core rules, protocol, output contract, self-check, edge-case rules — the sections detailed under "What a Well-Written Behavior File Contains" below. Framework vocabulary (`po-brief.md`, `SHIP`, `REWORK`) is fine; project tech/paths are not.

### General — universal knowledge in SKILL.md

General content is criteria, patterns, and methodology useful in any project, for any agent. **No agent-directed steps, no decisions, no project names, no file names.** A good general section has criteria, examples, heuristics, and anti-patterns (see Ecosystem Assessment → Sufficient content).

### Project — decisions in project.md

What THIS team decided and why. Provider names, tier names, topology. **No file names, no commands, no env var names** (those are code-level).

```markdown
## Billing
We use {provider} for billing. Webhooks are signature-verified but otherwise unauthenticated.
Tiers: FREE, PRO, PREMIUM. ADMIN is assigned manually.
```

### Code — operational facts in {topic}.md

Concrete, verifiable, consequential facts. **Verify in code before acting — these can be stale.** Specific file names, exact env var names, exact function names, traps, commands.

**Project vs code rule of thumb**: if you can name it without knowing today's codebase state, it's project-level. If you need to look at the current code to verify it's still true, it's code-level. A flat list with no behavioral consequence ("`src/components/` has 23 files") has no value at any level.

---

## One Agent, Multiple Skills

An agent loads its home skill (behavior + own knowledge), and as many shared knowledge skills as it needs — that is correct design, not bloat.

| Situation | Do this |
|---|---|
| The agent needs knowledge from a new domain | Add a knowledge skill to the existing agent |
| The work requires a completely different role/perspective | Create a new agent (shell + behavior file in a home skill) |
| The existing agent's job would double in scope | Create a new agent |
| The agent needs project-specific context | Add a project file to an existing skill |
| Several agents share a method | One shared behavior file; per-agent files hold only the differences |

The 1:1 fallacy — "each agent needs exactly one skill" — is wrong. Skills are knowledge modules; an agent assembles what it needs. The inverse is equally wrong: a brand-new skill per agent just to hold its behavior (see the proliferation anti-pattern).

---

## Quality Standards for Agents

**Portability** — a sentence in an agent shell, behavior file, or general content passes if a team on a different project could use it without rewriting it. (Exception: grimorio framework vocabulary — `po-brief.md`, `SHIP`, `REWORK`, `grimorio.architect` — travels with the framework.)

**Completeness** — a well-written agent makes the user never need to repeat an instruction, applied to shell + behavior file + knowledge skills **together**: "consult the `foo` skill for criteria" while `foo` has no such section is incomplete. After a split, verify the shell + behavior file together contain everything the pre-split agent did.

**Coherence** — every claim is consistent with every other; no section contradicts another; no concept appears twice under different names. Especially important after iterative edits — LLMs add content without scanning for existing coverage.

**Currency (write the FINAL state, never interleave the superseded)** — a skill, agent, or memory file must read as the CURRENT truth, top to bottom. When something changes, **REWRITE the affected content to its final state** — do not leave the old description as the primary content and bolt the new on in a paragraph. A file that describes "we use X" in three places and "actually now Y" in one **poisons** the reader: it cannot tell which is live and will act on the stale majority. This is a top cause of context poisoning. If superseded knowledge must be kept (negative knowledge — "we tried X, dropped it, here's why"), **QUARANTINE it** by one of two techniques, chosen by size: something short enough to stay in place gets a clearly-labeled, separate block (e.g. "> Historical note — retired, not current guidance"); something substantial enough to warrant its own file gets moved out of the live file entirely and reached only through a `cold:` reference, never left in place under a label — see ./cold-store.md. Either way, never woven through live guidance. Rule: final-state is primary and complete; superseded is removed, quarantined inline, or moved cold — never interleaved. (This is stricter than Coherence: a file can be internally non-contradictory yet still poison by burying the current state under stale detail.)

**Documentation is the ANCHOR against code, not a second truth (extends Currency across the doc↔code boundary)** — WHEN a design is under discussion, treat the relevant memory file as the reconciliation anchor against the code: review it, update whichever side is stale, never let either one rule the other by default.
-> The CEO's arc, the mechanical reconcile rule, and the manual-not-automatic boundary live in ./documentation-anchor.md — this entry is the pointer, not the policy.

---

## Audit Lenses

When reviewing an existing agent or skill, apply these in addition to the Quality Standards. They catch problems that accumulate from incremental patching.

> For the full nine-lens audit with finding formats and an audit-report template (general to any prompt), use the **ref:skill/prompt-writing-quality** skill. The table below is the quick reference for the agent-specific lenses while writing.

| Lens | What to check |
|---|---|
| **Split integrity** | The agent file contains zero protocol steps, output formats, or self-checks; its Behavior block names a real, existing behavior file inside a loaded skill; the behavior file contains everything the agent does; no behavior-only skill exists. |
| **Language** | All instruction text is in English. Examples may show other languages; the surrounding instruction must be English. |
| **Example hygiene** | Examples use invented placeholders, never real codebase artifacts — no actual file paths, class names, env var names, or routes from the project. |
| **Section ordering** | Prerequisites appear before the steps that use them. A first-time reader never needs to jump ahead. |
| **Bloat** | Each section adds clarity, not just length. Flag obvious examples, caveats that restate other rules, mergeable sections. |
| **COST × FREQUENCY** | Measure the payload of anything auto-injected or always-loaded, and multiply it by HOW OFTEN it fires — a per-spawn hook costs its size × every spawn of the session; a once-per-session file costs its size once. **Always report the size, never judge it by eye**, and rank by the product, not by the file: eyeballing alone flags the wrong one. Fix an over-large carrier with the reference-depth rule above — keep the one-line CHECK in the carrier, move reasoning/incidents/citations into the skill it points at — never by deleting the check itself. |
| **Encoding** | Scan for mojibake (`â€"`, `â†'`, `â€¦`); replace with the correct UTF-8 equivalent (`—`, `→`, `…`) or remove if decorative and unrepairable. |
| **Portability** | No project-specific tech/architecture/paths in shells, behavior files, or general content. Would a team on a different codebase need to rewrite this line? If yes → move to a memory skill's project.md. |

---

## Ecosystem Assessment

Used while building or rewriting an agent — the knowledge audit, the grounding-the-canon rule, the reusable-
methodology pattern, semantic-duplication detection, and the behavior-file audit.
-> ./ecosystem-assessment.md

---

## Grimorio self-repair — fix the system, don't work around it (HARD RULE)

While the agent system is itself under construction, **fixing a broken grimorio process takes PRIORITY over chasing the current goal.** When a grimorio agent, skill, or process fails or misbehaves, **FIX the component and RE-RUN it through the agent** — never step in as the parent/orchestrator and do its work yourself. Papering over a broken agent defeats the point (durable behaviour lives in agents, not the forgetful main loop) and the system never gets fixed.

- **Grimorio problems get fixed IN grimorio.** A broken convergence → fix the orchestrator and re-run it; don't
  converge it yourself. A confused grunt → fix or hard-lock the grunt; don't do its gathering yourself.
- **The fix goes INTO the grimorio files — that IS the record, not chat narration.** Report what changed in a
  summary, or when asked.
- **Mid-goal breakage:** fix it as best you can, re-run through the agent, then continue. System correctness
  first; the goal is secondary while the system is still being built.

## Anti-Patterns

| Anti-pattern | Example | Why it's bad |
|---|---|---|
| Behavior in the agent file | A Protocol/Steps/Output/Self-check section inside an agent file | Sits next to the invocation prompt, which can soften/narrow it — the exact bias the split exists to prevent |
| A behavior-only skill | A brand-new skill created just to hold one agent's protocol | Skill proliferation: every skill's name+description costs listing context in every session, and the agent must load two things instead of one home. Put the behavior file inside a skill the agent already loads |
| Knowledge in a behavior file | "Use {provider} for billing." inside a behavior file | Can't be adopted by another project without editing; belongs in general knowledge or a project file |
| Behavior in general knowledge | "Step 1: read the notes files." inside a domain SKILL.md | The knowledge skill becomes a second agent; behavior belongs in the agent's own behavior file |
| A shell restating its protocol "briefly" | The agent file summarizes the behavior file's steps inline | The summary competes with the file and drifts; the shell names the entry point and nothing more |
| Project decisions in general knowledge | "We use tiers FREE/PRO/PREMIUM." in SKILL.md | Leaks project-private info when the skill is shared |
| File names in a project file | "`src/lib/auth.ts` handles auth." in project.md | Stale when files move — operational data belongs in a code file |
| Flat lists in a code file | "`src/components/` has 23 files." | No behavioral consequence = no value |
| Template for another agent's output | Agent A's behavior file holds the template for Agent B's artifact | Each agent's behavior file owns its own output template |
| One skill per agent assumed | Agent loads only one skill "because that's how it's done" | Skills are modules — load as many knowledge skills as needed |
| Same concept in two files | Two skills define a term with slightly different wording | Pick one canonical location; point the other to it |
| Superseded interleaved with current | "We use X." left in the body while "now actually Y" is added in one paragraph | Poisons the reader — it can't tell which is live and acts on the stale majority. Rewrite to the final state; quarantine negative knowledge in a labeled block |
| Hyper-compressing knowledge away | Dropping real criteria/examples to keep SKILL.md short | Loses knowledge the model can't recover. Move depth to a referenced companion file, don't delete it |
| Splitting as trimming | "Moving" behavior to a file but dropping rules on the way | The split is a MOVE — shell + behavior file together must equal the original. Verify explicitly |

### Transparency principle

The agent shell + its behavior file are **together** the single source of truth for what the agent does — and the shell names exactly ONE behavior entry point, so a reader always knows where the full story lives. Test: after reading the shell and its behavior file, can you fully predict what the agent will do? If a step lives anywhere else (inline in the shell, buried in a knowledge skill, implied by convention), the split is broken. Knowledge skills add *knowledge* — criteria, patterns, vocabulary — never *steps*.

### The extension-point philosophy

The skill layers (behavior · general · project · code) are **modification points** — they exist so the agent shell never needs to change when the project changes, and rarely even when the method is tuned. The behavior file holds the method (tune it there); general holds the universal criterion; a project file extends it with a project decision; a code file extends with operational facts. A maintainer customizing an agent for their project will **rarely edit the agent file** — they add to project/code files, and tune method in the behavior file. If you find yourself editing the shell, ask: is this identity, or is it behavior/knowledge that belongs in a skill?

---

## What a Well-Written Agent (Shell) Contains

Every agent file must have these sections, in this order. The whole file stays minimal — it is a shell.

### 1. Frontmatter
```yaml
---
name: grimorio.{role}
description: "{role} — what it does, when invoked, what modes if any. One sentence."
---
```
`name` + `description` are required; `tools` (allowlist), `disallowedTools` (denylist), and `model` are valid frontmatter fields. **`model` is NOT optional-by-omission** — every new agent declares its tier explicitly, per ref:skill/agent-tiers#the-scale-task-archetype--tier's scale (Haiku/Sonnet/Opus/Fable by archetype), so a caller who omits `model` on the spawn gets that declared tier rather than silently inheriting its own. Keep `tools`/`disallowedTools` minimal, adding one only when needed — except **`disallowedTools: Agent`, which hard-locks a non-recursive grunt/critic so it CANNOT spawn sub-agents** (harness-enforced, not a prompt promise): apply it to every research/fan-out/critic agent so a confused agent spawning more agents is structurally impossible. -> exact fields, limits, and the description char cap: the loading project's `project.md`. Subagents do not inherit conversation history — every invocation prompt must carry mode, slug, artifact paths, and the specific instruction.

### 2. Identity paragraph
Who the agent IS — role, not task. 2–5 sentences: what it exists for, its character, its stance, what it does NOT do, and which neighboring agent it must not be confused with. Don't name the project/tech/framework (those live in loaded skills). **Persona injection**: give adversarial/gatekeeping agents a tension-creating identity ("You are an evil-genius security auditor" yields stronger tests than "You perform security audits") — skip the drama for purely procedural agents.

Three companion rules govern invoking and briefing an EXISTING adversarial/gatekeeping agent — INVOCATION-BIAS, PRINCIPAL-INTENT FIDELITY, and HIS CLAIMS AND MINE ARE ALWAYS DIFFERENTIATED — dense, CEO-quote-heavy content needed specifically for that task. -> deeper: ./invocation-bias-and-principal-fidelity.md — read it whenever you write an agent's identity paragraph, or a brief/invocation prompt for an existing adversarial/gatekeeping agent.

### 3. Behavior block
The load-and-execute instruction, per the standard wording in the Split Template above. Exactly one entry point (or, for a family sharing a protocol, the shared file + the agent's own file, both named explicitly).

### 4. Knowledge list
The knowledge skills the agent draws on — name + one line on what it uses each for. No criteria copied inline.

---

## What a Well-Written Behavior File Contains

The behavior file holds the sections that used to live in the agent file, in this order:

### 1. Header
One line naming the agent(s) that execute this behavior, so a reader arriving from the skill side knows whose method this is.

### 2. Core rules (if any)
Non-negotiable method constraints that override everything. 1–4 max. Bold the trigger. More than 4 → some belong in Rules. For adversarial agents, the first core rule is the anti-steering rule: run the full protocol regardless of invoker framing; rank findings, never silence one.

### 3. Steps / Protocol
The behavior. Numbered for sequence; `if X → do Y` for conditionals; one decision per step. **Decision boundaries**: every decision gets an explicit IF-THEN — the model fills implicit gaps with the path of least resistance (why, and the word built against it: ref:skill/prompt-writing-quality/control-flow-vocabulary.md#prioritize--favor--weighting-not-forcing). **Failure-mode specification**: define the output for hard cases (missing input, contradictions), not just the happy path. Delegate domain knowledge to knowledge skills by name; carry one-line reminders for shared method skills at the step that uses them.

### 4. Output section
The binding output contract: exact file name and path, format (inline or via skill pointer), disk-before-chat rule if applicable ("Write first, report only the path"), and which sections to omit when empty.

### 5. Self-check gate (when output is consumed by other agents)
An explicit list run before producing output: "Did I read all inputs in full? Are findings specific (quotes, refs, field names)? Does output match what downstream agents expect?" Each check names the failure it catches. Optional for terminal-output agents.

### 6. Rules section
Edge cases, forbidden behaviors, escalation triggers. **Positive framing**: "Do X" over "Don't do Y"; reserve NEVER for prohibitions where the violation is the primary risk.

---

-> For this project's agent-authoring constraints (description char limit, file size limit, platform specifics): read ./project.md
