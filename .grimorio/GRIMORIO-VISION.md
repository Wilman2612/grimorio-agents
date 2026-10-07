**Why this file is HERE, at grimorio's own root.** This is the full verbatim migration of
`project.grimorio-vision.md`, which the `po` kept provisionally and which `ledger-retire` deleted from
po-memory (commit `6baa8cc2`) once this content was verified in place.

**It carries NO `project.` prefix, deliberately, and that is the CEO's own ruling (2026-10-01).** The
`project.` convention marks a CONSUMER PROJECT's own content — the half that never exports, written for
whoever adopts grimorio in their own repo. This file is the opposite: it is grimorio's own vision of
itself, which is why it also does not belong inside any one skill. An earlier pass placed it in
`grimorio.agent-writing` as `project.vision.md`; both the folder and the prefix were wrong for the same
reason. It sits at the root beside ref:repo/.grimorio/GRIMORIO-CHAIN.md and ref:repo/.grimorio/GRIMORIO-INDEX.md,
which is where grimorio describes grimorio.

The misuse this corrects is already a measured, open item on the board — `file-naming-convention`, 103
files off-convention under `.claude/skills*` with `project.` applied to grimorio-internal content. This
file is one instance of it, fixed; the other 102 are not.

**Everything below this banner is UNEDITED**, per this corpus's own verbatim-migration convention — including
its own title's "(provisional, PO-kept)", which describes the state this move ends and is therefore
historical, not current.

# Grimorio — meta-system vision (provisional, PO-kept)

> **Scope.** This is the vision for GRIMORIO ITSELF — the agent/skill system we are building to develop arena —
> NOT the product vision (that is ref:memory/grimorio.po-memory/project.vision.md#classification--every-section-by-axis-and-where-its-text-lives). It is not "product," not "activated," still being designed. The
> `po` keeps it **provisionally** (per Wilman, until it graduates to its own home — likely under ref:skill/grimorio.agent-writing#the-split-principle--the-agent-is-who-it-is-the-skill-is-what-it-does).
> Recorded so the meta-design survives context resets — the exact loss it exists to prevent.

## The core idea: an AGENT SELECTOR (skill auto-load, emulated for agents)
Anthropic auto-loads **skills** by description/keyword; it does NOT auto-select **agents**. Grimorio emulates the
same automatic selection, but for **agents**: a reliable "which agent, when" so the right specialist is pulled in
on demand — never a generic worker by default. `CLAUDE.md` → "Agent SELECTION" is the always-loaded trigger; the
ref:skill/grimorio.agent-selection#the-dev-routing-tree--decide-by-what-the-change-touches skill holds the selector's detail (each agent's raison d'être + when to invoke; auto-surfaced by
its description, so it loads even if I forget to look). Each agent has
a reason for being and a moment to be invoked — sometimes a flow (the feature pipeline), sometimes à-la-carte
pieces, but always known, never improvised with a generic worker.

## The research architecture — orchestrator agents + hard-locked grunts (CORRECTED)
Each research agent is an **ORCHESTRATOR of its own internal panel** — a principal that decomposes, spawns a panel
of grunts, and CONVERGES them. The orchestration behaviour lives **IN the agent** (durable — the main loop
forgets; agents don't; that is the whole reason behaviour goes in an agent, not left to me). This CORRECTS an
earlier wrong principle I had written ("orchestration lives above the agent, not inside it").
- **entropy = DIVERGENT orchestrator** — spawns a panel per perspective lens; converges ranked blind-spots.
  "What don't I know?", reacting to the CEO's vision (*"you also thought of X and Y, not only what you told me"*).
- **researcher = CONVERGENT orchestrator** — decomposes ONE decided topic into slices; spawns a panel to gather
  each; converges the cited report. GATHERS/synthesises; does NOT decide (solution-architect / CEO) or verify
  true/false (deep-research).
- **solution-architect = CONVERGENT orchestrator** — build-vs-buy panel over capability pieces.
- **the grunt = agent:grimorio.scout** — hard-locked non-recursive (`disallowedTools: Agent`); does ONE narrow slice
  + documents; **cannot spawn** → the fan-out is burn-safe by construction, ONE level deep.
- **documentation = TRIAGE + CONSOLIDATE** — decides keeper vs transient; we do NOT invent a new triage.

**ENTROPY FIRST (the precise call):** when the CEO tells you something, that's what he KNOWS — not what he doesn't
know he doesn't know. Idea-finding / exploratory → **entropy first (diverge) → CEO decides → researcher
converges.** Researcher-direct ONLY for "research this specific decided thing." Going straight to researcher on an
exploratory question = **nobody diverged** — a real miss.

**The flaw we fixed:** "non-recursive grunt" WAS a behavioural promise, and the burn proved instructions fail
under confusion. Now it is **harness-enforced**: agent:grimorio.scout carries `disallowedTools: Agent`, verified
supported (Claude Code v2.1.172; cite:code.claude.com/docs/en/sub-agents.md). The ref:skill/grimorio.agent-writing/project.md claim
that `tools`/`disallowedTools`/`model` frontmatter was "not part of the format" was WRONG and is corrected — that
wrong belief is precisely why grunts couldn't be locked and the burn was possible.

**Save-as-you-go to ref:tmp/** — phase 2 builds on phase 1 and survives a compaction (the exact loss this whole
selector prevents).

## The four research tools (clean triggers)
entropy (what am I missing?) · researcher (expand this) · solution-architect (build/buy/borrow/reuse + OPEX) ·
bundled deep-research (verify a specific claim true/false — rare, opt-in, ~100 agents, once burned a session).

## Hard rule (burn defense)
NEVER `general-purpose` (or any recursion-capable agent) as a research grunt / fan-out worker — it spawns its own
sub-agents when confused and reincarnates the account-burn. Fan-out grunts must be non-recursive, purpose-built.

## Build status
- ✅ **agent:grimorio.researcher** — BUILT as a **convergent ORCHESTRATOR** (ref:repo/.claude/agents/grimorio.researcher.md):
  decomposes a topic, fans out a panel of agent:grimorio.scout grunts (tiered), converges the cited report.
  (Rebuilt — the first version was a single fat grunt that read the whole internet sequentially at Sonnet cost;
  that missed the fan-out + tiering. Now it orchestrates.)
- ✅ **agent:grimorio.scout** — BUILT (ref:repo/.claude/agents/grimorio.scout.md): the hard-locked non-recursive grunt
  (`disallowedTools: Agent`). Does ONE narrow slice + documents; cannot spawn → the fan-out is burn-safe by
  construction. Used by researcher / entropy / solution-architect.
- ✅ **ref:skill/grimorio.agent-writing/project.md corrected** — frontmatter DOES support `tools`/`disallowedTools`/`model`
  (verified); documented the hard-lock pattern. The prior "not part of the format" claim was the root reason
  grunts couldn't be locked.
- ✅ **entropy + solution-architect + ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize skill + ref:skill/grimorio.agent-selection** — updated: the agent orchestrates its
  own hard-locked panel (not "above the agent"); entropy-first flow documented.
- ✅ **ref:agent/grimorio.scout shared skill** — BUILT (`.grimorio/agents/grimorio.scout/`): the documenter's
  "save/consolidate to ref:tmp/" mechanics, now loaded by `entropy` + `researcher` so they document as they
  investigate. Deciding what to KEEP stays with `documentation`.
- ✅ **ref:skill/grimorio.agent-selection skill** — BUILT (`.grimorio/skills/grimorio.agent-selection/`): the former loose ref:repo/.claude/happy-path.md,
  refactored into a proper skill per ref:skill/grimorio.agent-writing#the-split-template--how-to-divide-any-agent, so it auto-surfaces by description (always loaded, even if I
  forget to look). `CLAUDE.md` and ref:memory/grimorio.po-memory/project.grimorio-vision.md point to it; the loose root doc is deleted. Compress later
  only if it grows too big — Wilman's call on timing.
- ✅ **Non-recursive is now HARNESS-ENFORCED** — agent:grimorio.scout carries `disallowedTools: Agent` (verified).
  No longer a behavioural promise; a runaway is structurally impossible, bounded at one level.

## Governance
Same as product: the vision is Wilman's (CEO); agents/harnesses record and execute, they do not decide.

## Process note — entropy is for unknown-unknowns, not for re-deriving genre-solved problems (2026-07-13)

The `war-sim-entropy-panel` pass mis-applied entropy: it ran to "discover" problems the domain's prior art has
already solved, instead of building. Concretely, it raised strategy exploitability/counterability (Convergence
A's "no stable skill ceiling" angle) as an unresolved structural risk gating the design — when it is ordinary,
documented tier-list dynamics in this exact genre (Gladiabots' own "review your replays and improve" answer),
not novel to Arena. See the correction of record in ref:memory/grimorio.po-memory/project.vision.md#classification--every-section-by-axis-and-where-its-text-lives §1I.

**The lesson, generalizable:** entropy exists to surface genuine unknown-unknowns (what the CEO hasn't thought
of, blind spots the team is too close to see) — it is NOT a substitute for checking established game-dev
patterns and prior art first. Many game-design questions resolve by "how does the genre already handle this"
before they ever need to reach the CEO as an open design question. Route to entropy for the former; route to
agent:grimorio.researcher/prior-art lookup (or just answer it directly if the pattern is well-known) for the
latter — do not let an entropy pass manufacture a blocker out of a solved problem.

## The instruction corpus needs a DECLARED GRAMMAR — parser first, semantic analyzer after (CEO, 2026-08-06)

> **NOT A PRIORITY. Not scheduled, not decomposed, not costed.** His own framing, kept attached to the idea
> because it is part of the record: *"No es prioritario y quizás se pueda trabajar en paralelo con un
> delegado."* Nothing below is a plan or a backlog — no tasks were derived from it, and adopt-vs-build was
> deliberately NOT decided (see "Deliberately not decided" at the end). A vision recorded as a plan is a plan
> nobody agreed to.

### His words, verbatim — this is the record; everything after it is commentary

> "Tengo que explicarte un poquito y quizás tú tengas que guardar esto en la parte de visión de Grimorio. No es
> prioritario y quizás se pueda trabajar en paralelo con un delegado. Pero, claro, o sea, ya esta idea evolucionó
> a, tú estás constantemente modificando esto introduciendo instrucciones nuevas, introduciendo secciones nuevas,
> introduciendo ejemplos, introduciendo correcciones una sobre la otra, porque es tu naturaleza, por alguna
> razón, no borrar. Entonces, estás, a veces te faltan ejemplos, te digo que cargue los ejemplos dinámicamente,
> importaciones, referencias, documentos, hay un montón de estructuras que hay que compensar y que hay que pensar
> y que tiene que seguir un... algunas son obligatorias, como la salida, ¿no? otras son más opcionales, otras son
> control de flujo, como los que tenemos en algoritmos, otras son reglas y planes numerados, otras son prosa. Hay
> varias estructuras que hay que seguir.
>
> Entonces, claro, lo ideal sería que para poder entenderlo, todo siga un flujo y todo siga una estructura de
> manera que sea, siga siendo prosa, siga permitiendo la flexibilidad de un prompt cualquiera, pero esté más
> estructurado. De manera que yo pueda ir y decir, ah, mira, este título comprime toda esta parte, y también
> tiene quince reglas. Entonces, por ejemplo, tendrás título de él, como quien escribe una lista, ¿no? tendrás un
> título de dos, tres palabras, no sé, y luego la extensión completa. Y listo, cuando yo te mande revisar, ah,
> ya, ¿de qué habla cada uno? me podrás decir así, en una pasada, este archivo tal las cosas. No tendrás el
> detalle completo, pero sabes distinguir, vas a poder encontrar duplicados, dónde cortar, dónde agrupar, cómo
> mover, qué está cumpliendo, qué no está cumpliéndose.
>
> Entonces, con eso se puede hacer un analizador sintáctico, luego puedes llevarlo más allá, un analizador
> semántico que cargue, ok, estas son todas las reglas, estos son todos los... y muy rápido, muy muy muy
> comprimido también, a través de un compilador o un analizador semántico ya con LLM que diga, ah, estas
> instrucciones son contradictorias o son probablemente contradictorias, a qué riesgos, hay warnings, puedes
> poner tipo compilador warnings, puedes poner errores, cosas así, ¿me entiendes?
>
> Pero todo parte de que, ok, si te mando revisar, como en este caso, mil líneas es demasiado, y no sigue un
> orden correcto, no sigue una estructura fija. Entonces, es difícil de determinar. Si yo te digo cuál... en tus
> ejemplos existen, no sabes cuántos ejemplos existen. Si te digo en qué partes has hecho una corrección de
> ledger, ¿no? o cuántas has hecho una corrección negativa, no lo sabes y no lo tienes porque tampoco tienes una
> regla.
>
> Entonces, claro, habría que empezar a mantener, uno, las estructuras permitidas, y las que no estén siguiendo
> una de las abstracciones que ya tenemos, definirles un formato que no se cruce con el resto, que sea
> completamente identificable. Y si tú quieres hacer una corrección, listo, se hace y se verifica contra el allow
> list de situaciones y así. ¿Me entiendes?
>
> Es como una herramienta de control de flujo. Es que no sé cómo se llama, porque esos asistentes de código son
> relativamente nuevos. No sé quiénes están utilizándolo de esta manera tampoco. O sea, yo porque estoy intentando
> hacer, no desarrollo desatendido, pero sí aplicación de eso desatendida."

### What he is describing

**The diagnosis he opens with is about the agent, not the tooling:** instructions, sections, examples and
corrections get layered one on top of the other *"porque es tu naturaleza, por alguna razón, no borrar."* The
grammar is the answer to that, not a style preference.

**The structures he enumerates, and he does not treat them as one kind.** Some are OBLIGATORY (the output);
some OPTIONAL; some are CONTROL FLOW (*"como los que tenemos en algoritmos"*); some are RULES AND NUMBERED
PLANS; some are PROSE. Plus the ones he names as already needing compensation — examples, dynamic example
loading, imports, references, documents.

**The binding constraint, in his own words: it must still be prose.** *"Siga siendo prosa, siga permitiendo la
flexibilidad de un prompt cualquiera, pero esté más estructurado."* This is not a migration to a schema.

**The property he wants out of it is COMPRESSION FOR REVIEW.** A two-or-three-word title that stands for a
section, plus its full extension underneath — so that a review pass answers *"¿de qué habla cada uno?"* in one
pass, without the full detail, and can still find duplicates, where to cut, where to group, what to move, and
*"qué está cumpliendo, qué no está cumpliéndose."*

**The staged shape, his ordering:** declared structures → a SYNTACTIC analyzer → then, further out, a SEMANTIC
analyzer run by an LLM over the compressed form, emitting **compiler-style warnings and errors** — including
*"estas instrucciones son contradictorias o son probablemente contradictorias"* and the risks attached.

**The allow-list mechanic for corrections.** Maintain the permitted structures; anything not following an
abstraction we already have gets a format defined for it that *"no se cruce con el resto, que sea completamente
identificable"* — and a correction is then verified against the allow list of situations.

### His two unanswerable questions — the sharpest test of the whole idea

He posed two, and neither could be answered on 2026-08-06: **how many examples exist in the corpus?** and
**where have ledger corrections been made?** Both are unanswerable for the same reason, which is his point:
there is no form that MARKS either one, *"y no lo tienes porque tampoco tienes una regla."*

### What this is called — he does not know, and says so

*"Es como una herramienta de control de flujo. Es que no sé cómo se llama, porque esos asistentes de código son
relativamente nuevos. No sé quiénes están utilizándolo de esta manera tampoco."* Recorded rather than resolved,
because the reason he gives for it matters more than the name: it comes from attempting **unattended
APPLICATION** — *"no desarrollo desatendido, pero sí aplicación de eso desatendida."* That is what makes this a
product-shaped observation about operating the system, not a tooling preference.

### Supporting evidence — MINE, not his (measured 2026-08-06)

He argued the case without numbers. These are the agent's measurements, offered as evidence FOR his argument,
and they are his claim only where quoted above.

- **Corpus-wide: 69% prose.** 63,673 lines over 317 files — 3,549 headings, **139 rules a script can see**, and
  **285 of 317 files carry ZERO rules**. The same run reports `files DECLARING their reader: 0 / 317`.
  cite:repo/.grimorio/scripts/audit-chain.mjs `--shape`.
- **The doctrine skill breaks its own canon.** ref:skill/grimorio.agent-writing/SKILL.md stood at 737 lines / 67 sections / 63%
  prose with 7 rules when he made this argument — in the skill whose own headline is *HARD RULES ARE THE ONLY
  MECHANISM PROSE HAS*.
- **A binding doctrine that no reference can even address.** ref:skill/grimorio.agent-writing/invocation-bias-and-principal-fidelity.md:
  102 lines, ZERO `##` headings, ZERO rules — carrying a doctrine `CLAUDE.md` rule 7 treats as binding.
- **Corpses kept with a label instead of deleted.** The word "superseded" appears on 135 lines across 59 files.
- **The proof the structure argument is not theoretical.** Held to its OWN declared four-field format, the defect
  ledger's OPEN section went **1,108 → 329 lines with all 55 entries intact and none deleted** — a 70% cut with
  the information surviving, purely because the form was declared. cite:memory/grimorio.board-memory/grimorio-defects.md,
  commit `6dc2f2e6`.

> **These are a SNAPSHOT, and three of them were already moving as they were written.** Re-measured the same
> day, ref:skill/grimorio.agent-writing/SKILL.md read 552 lines and "superseded" had fallen from 78 files/197 lines to 59/135,
> because `grimorio/writing-skills-shape` was cutting both at that moment; the defect ledger had already
> relocated out of `agent-writing/`. Treat every number here as stale on sight and re-run
> cite:repo/.grimorio/scripts/audit-chain.mjs — recording a frozen figure as a live fact is the failure this note exists
> to prevent. The corpus-wide percentages were verified live and held exactly.

### This EXTENDS work already shipped — it is not a fresh idea

- cite:repo/.grimorio/scripts/audit-chain.mjs `--outline` already renders headings + rules with prose collapsed to a
  counter, and renders references in the current grammar; `--shape` already reports the heading/rule/table/list/
  prose mix per file. **Both were built before he stated this**, and both are the first rung of what he describes
  — the compressed review pass, minus the declared grammar that would make it complete.
- LOST: documentation-memory/docs/64-agent-instruction-corpus-linting-tooling-prior-art-referencia.md (deleted 2026-10-04, recoverable at f942b355)#verdict-in-one-paragraph
  — prior art, landed the same day. Its finding bears directly here: every framework surveyed validates the
  structure AROUND the prompt and treats **the prompt itself as an opaque blob**; vendor validation stops at
  frontmatter (proven by reading Anthropic's own 102-line validator); a young third-party ecosystem exists
  (`agnix`, 445 rules) but none of it carries our grammar; `@eslint/markdown` is a real mdast language plugin
  and the standout host candidate.

### Deliberately NOT decided

Adopt-vs-build (host on `@eslint/markdown` vs build our own), scope, sequencing, and who would do it are all
**open**. He said not a priority and floated a parallel delegate as a possibility, not an assignment. Recorded
here so the idea survives a context reset — which is this file's whole job — and so that whoever eventually
picks it up starts from his framing rather than re-deriving it.


## Agent PURPOSE — moved to its own file

**Everything about what an AGENT is for — its vision, its reason for existing, the missions of the design
agent and its AS-IS mode, the synthesizer's own mission, the credential-handling pattern, and the
design-rationale ruling — now lives in ref:agent/grimorio.po/agent-purpose.md.** Split out
2026-09-07 at 1024 lines. **WHEN you capture something about what an agent is FOR ⟶ write it there, never
here;** this file keeps the product and campaign vision plus the corpus-level rules.

## Self-repair (HARD RULE — also in `CLAUDE.md`)
While we build grimorio, **fixing a broken grimorio process takes priority over chasing the goal.** When an
agent/skill fails, FIX the grimorio component and RE-RUN it through the agent — the main loop must NOT substitute
as the parent orchestrator/worker to push the goal forward (that papers over the failure and the system never
gets fixed). Fixes go into the grimorio files (that's the record), not chat. *Acknowledged anti-pattern (this
session): converging the entropy/mechanics panels myself instead of fixing entropy's background-spawn bug and
re-running it. The fix (synchronous spawn) is in; going forward: route through grimorio, fix-and-re-run.*
