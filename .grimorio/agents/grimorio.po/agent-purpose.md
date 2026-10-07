# Agent PURPOSE — why each agent exists, and what it owes because of that

@size-exempt: pre-existing size debt (678 lines) -- one section per agent/agent-mode's own purpose and
what it owes because of it; a split would scatter one agent's rationale across files.

This file holds the CURRENT, standing truth about why grimorio's agents and agent-modes exist, and what each
owes because of that reason. Split out of `project.grimorio-vision.md` on 2026-09-07.

**WHEN you capture anything about what an agent is FOR — its purpose, its vision, its reason for existing, or a
standing way of working an agent must know ⟶ it belongs HERE, never in `project.grimorio-vision.md`**, which
keeps the product/campaign vision and the corpus-level rules. Product/campaign vision content lives at
ref:memory/grimorio.po-memory/project.vision.md#classification--every-section-by-axis-and-where-its-text-lives.

-> the file this was split from: `project.grimorio-vision.md`, retired 2026-09-30 — its content now lives at
   ref:repo/.grimorio/GRIMORIO-VISION.md, `grimorio.system-keeper`-owned going forward.

**Boundary.** This file records WHAT an agent is for and WHY — never HOW to build, rebuild, or restructure it.
Whether any agent named below needs to be replaced, rewritten, or only re-verified against its mission is a
HOW/architecture call, out of PO's own scope (behavior.md Core rule 2) — the CEO's or grimorio.system-keeper's to
make, never decided by this record or by a brief invoking it.

---

## The design agent's mission — close GAME 2's gaps from design, AS-IS before TO-BE

GAME 2's own product vision lives at ref:memory/grimorio.po-memory/project.vision/game-2-thesis.md; this section is that
ambition's flip side — why a design agent (agent:grimorio.design-orchestrator today) has to exist at all and how
it is obliged to work. Source: a byte-verified CEO turn chain, `user:` lines byte-exact, migrated whole into this
file per the custody-check rule.

### The mission, verbatim (Spanish governs; translation for reading only)

> "yo necesito el juego dos. El juego dos, como está, no sé, es irrealizable por problemas en el motor, por,
> bueno, no son problemas, porque funcionan, pero necesidades de cambios en el motor, necesidades de cambio en
> los workflow, necesidad de cambio en la API, hay un montón, más la capa del propio juego y cosas así. Entonces,
> necesito tapar todos los huecos, necesito saber cómo funcionan, poner, entender primero, escribir cómo está
> todo, y luego generar las reglas de cambio del to be... Cada vez que te pido algo, lo que termina pasando es
> que mezclas diseños, mezclas cosas, nada está pensado... hay huecos lógicos, la falta de coherencia interna, la
> falta de visión global... no sabes cómo funciona, me alucinas. Entonces, lo que quiero es cerrar estas cosas
> desde la parte más barata, que en teoría es el diseño."
>
> Translated: "I need Game 2. Game 2, as it stands, is — I don't know — unrealizable, because of problems in the
> engine — well, not problems, because they work, but needs for changes in the engine, needs for changes in the
> workflows, need for change in the API, there's a lot, plus the game's own layer and things like that. So I need
> to plug all the gaps, I need to know how they work, first understand, write down how everything is, and only
> then generate the TO-BE change rules... Every time I ask you for something, what ends up happening is you mix
> designs, mix things, nothing is thought through... there are logical holes, the lack of internal coherence, the
> lack of global vision... you don't know how it works, you hallucinate to me. So what I want is to close these
> things from the cheapest layer, which in theory is design."

**In one line:** GAME 2, as it stands, is irrealizable — not because anything is broken, but because the engine,
the workflows, the API, and the game layer all need changes, and many of the systems GAME 2 touches are
undocumented and undesigned. Close the gaps from the CHEAPEST layer: design. Code-level correction structurally
fails — one part analyzed, the rest forgotten, coherence lost, hallucination follows — and ending that failure
mode is this mission's whole reason to exist.

### The mission's outer bound, and its handoff — ALL the gaps, and presentation is never this agent's job (CEO ruling, 2026-09-09)

**This FINALIZES the split "The three consumers" section below still carried as undecided for its own third
consumer** — read that section's own update note first if arriving from there. Source: the same session as the
board/board-format ruling captured in `BACKLOG.md`'s own "CEO'S OPEN ASKS" #5 and #8; migrated verbatim here
because this half is mission-level (WHY/WHAT this agent is FOR), never process (BACKLOG.md's own domain).

> "Sí, diseño, no, el agente de diseño es el precursor del otro agente. Vamos a tener un agente de, no sé si de
> planeación, no sé si de grounding, no sé no sé cómo llamarlo... Ya veremos el nombre después. Ese agente va a
> ser el que se encargue de generar o de controlar el reporte bonito, y saber cómo genera un reporte bonito a
> partir de lo que el agente de diseño haga. El agente de diseño es el duro, ¿me entiendes? Es el el trabajador
> fuerte. El otro es el que gente genera las PPTs para mostrar al al board. Este es el el duro, el que sabe
> todo, el que tiene que pelear todo, cerrar todos los huecos... mi plan con este es poder cerrar todos los
> huecos de diseño, no que quiero regresar y decir, ah, mira, no consideraste que si pones un nodo aquí, el
> nodo no va a poder porque el motor estaba por aquí y porque el usuario no puede hacer así y que la interfaz
> es imposible que muestre toda esta información, ¿me entiendes? Es lo que quiero evitar, quiero cerrar todo...
> pero con la inteligencia artificial deberíamos poder cerrar al menos los [huecos] lógicos. Eso es subjetivo, y
> eso te lo quiero probar, que puedas probar eso."
>
> Translated: "Yes, design — no, the design agent is the PRECURSOR of the other agent. We're going to have an
> agent for — I don't know if planning, I don't know if grounding, I don't know what to call it yet... We'll
> figure out the name later. That agent is the one in charge of generating, or controlling, the pretty report,
> and knowing how to build a pretty report FROM WHAT THE DESIGN AGENT PRODUCES. The design agent is THE HEAVY
> ONE, understand? It's the strong worker. The other one is the one that generates the PPTs to show the board.
> This one [the design agent] is the tough one, the one that knows everything, the one that has to fight
> everything, close all the gaps... my plan with this one is to be able to close ALL the design gaps — not to
> come back later and say 'ah look, you didn't consider that if you put a node here, the node won't work
> because the engine was over here, and because the user can't do it that way, and the interface can't possibly
> show all this information' — understand? That's what I want to avoid, I want to close everything... it's
> hard, but with artificial intelligence we should be able to close at least the LOGICAL gaps. That's
> subjective, and that's what I want to prove to you — that you can prove it."

**In one line:** the design agent (agent:grimorio.design-orchestrator today — "el duro"/"el trabajador fuerte")
is the PRECURSOR agent: it does the hard work, and its mission's outer bound is now stated as ALL the design
gaps, with the LOGICAL gaps named as the assured, provable minimum ("eso te lo quiero probar"). A SEPARATE,
LATER agent — name undecided, "planeación" or "grounding" floated as candidates — takes the design agent's own
output and turns it into the presentable report/PPTs for the board. **The design agent never produces the
presentation itself; that boundary is now settled, not open.** WHO that later agent ends up being and HOW it
is built stay exactly as undecided as every other open question in this file — only the SPLIT itself, and
which side owns which half, is what this ruling settles.

### The method — describe the AS-IS first (errors included), only then the TO-BE the change requires

> "raramente un diseño viene del vacío, ¿no? Lo normal es que tengas una aplicación ya corriendo... entonces,
> necesito que primero sea capaz de describir el sistema bien, ¿cierto? con sus errores y todo, porque parte de
> la metodología de UML, y luego de eso, recién generar la versión to be que se requiera para el cambio...
> necesito tapar todos los huecos... y luego generar las reglas de cambio del to be para que cada uno quede como
> mi visión lo está pidiendo, cada uno en su dominio independiente, funcionando juntas... necesito que se basen
> en el diseño, porque cuando te lo corrijo en código, lo que termina pasando es que analizas una parte, pero se
> te olvida el resto, o no tiene coherencia, o hay muchos errores."
>
> Translated: "a design rarely comes from a vacuum, right? The normal thing is you already have an application
> running... so I need it to first be able to describe the system well, right? with its errors and everything,
> because that's part of the UML methodology, and only after that, generate the TO-BE version the change
> requires... I need to plug all the gaps... and then generate the TO-BE change rules so each one ends up as my
> vision is asking for it, each one in its own independent domain, working together... I need it grounded in the
> design, because when I correct it in code, what ends up happening is you analyze one part but forget the rest,
> or it has no coherence, or there are a lot of errors."

**The standing method:** describe the running system WELL first, errors included — part of the UML methodology,
not an embarrassment to skip past. Only THEN generate the TO-BE version the change actually requires. Target
state: each system in its own independent domain, functioning together, per the CEO's own vision. Every change is
grounded in the design; correcting straight in code is what loses the rest, loses coherence, and produces errors.

### The artifact-selection principle — the problem dictates the artifact, never a menu or coverage

> "el chiste de esos archivos es que, bueno, por el tipo de funcionalidad que son, vas a encontrar tablas... pero
> es por el tipo, ese es el diseño para un dashboard. Hice todo ese diseño para un dashboard, montón de gráficos,
> no vas a encontrar casos de uso, no vas a encontrar diagramas... porque no corresponde el problema. El [spend
> API] tiene diagramas de caso de uso y de esas cosas, porque es una funcionalidad, pero para ser justos el
> dashboard también puede tener diagramas de caso de uso, pero realmente no correspondía, porque ya sabía
> aquello."
>
> Translated: "the point of those files is that, well, given the kind of functionality they are, you'll find
> tables... but that's because of the TYPE — that is the design for a dashboard. I made that whole design for a
> dashboard, a bunch of charts, you won't find use cases, you won't find diagrams... because the problem doesn't
> call for it. The [spend API] has use-case diagrams and things like that, because it's a piece of functionality
> — but to be fair the dashboard COULD also have use-case diagrams, it just genuinely wasn't called for, because
> I already knew that part."

**The principle:** each artifact exists ONLY to answer a genuinely open question of THAT specific problem — what
is already known gets NO artifact, ever, regardless of what a completeness checklist would otherwise demand. His
own two worked examples, kept as the standing exemplar pair: the dashboard design is tables/lineage with no
use-case diagrams (that was already known — a dashboard); the spend-api design has use-case diagrams (that was
the genuinely open question). **Already implemented, verified, not merely asserted:**
agent:grimorio.design-orchestrator's own Phase 4 runs exactly this per-question INCLUDE/OMIT/GAP disposition —
ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md ("WHEN a question
names no artifact ⟶ it is a GAP", never a silent drop and never a fourth disposition).

### The derivation mandate — re-derive the design agent from four inputs, in the corpus's current notation

> "Yo volvería a revisar la definición formal y compararlo contra lo que yo necesito, más los gates, lo que
> está, lo que premia y lo que producen y esas cosas para hacer un diseño... utilizando la nomenclatura ya
> superpoderosa que tenemos ahorita, sacar una gente [agente] que sea capaz de ayudarme con ese problema."
>
> Translated: "I would go back and review the formal definition and compare it against what I need, plus the
> gates — what exists, what it rewards and what it produces and so on, to make a design... using the already
> super-powerful nomenclature we have right now, derive an agent capable of helping me with that problem."

**The mandate:** whichever agent ends up owning this job must be DERIVED, never patched, holding four inputs
together at once: **(a) the FORMAL DEFINITION** — the UML/requirements methodology itself; **(b) THIS NEED** —
the mission, method, and artifact-selection principle above, in the CEO's own words, not a compressed proxy of
them; **(c) the CURRENT AGENT'S ACTUAL TEXT** — what agent:grimorio.design-orchestrator and
agent:grimorio.design-redactor actually say today, read fresh, never recalled from memory; **(d) WHAT THE GATES
REWARD AND PRODUCE** — the real scoring mechanics of
ref:skill/grimorio.loop-and-graph/design-completeness-gate.md and any other gate the design pipeline
runs, since a gate that rewards coverage over open-questions is the exact root cause the artifact-selection
principle above exists to correct. **ALWAYS use the corpus's CURRENT notation throughout** (the four openers,
`⟶`, `import:`/`ref:`/`cite:`, ref:skill/grimorio.phase-splitting's own phase-chain form) — **NEVER invent a
parallel format alongside it.**

**This is the anchor future derivation must trace to. WHEN agent:grimorio.design-orchestrator is rewritten,
replaced, or its phase-chain restructured ⟶ that work's own record states how it satisfies (a)-(d) above — NEVER
re-litigate them, and NEVER treat a paraphrase of this section as having satisfied (c)'s own fresh-read
requirement.**

---

## The AS-IS pass's own mission — read alone, it carries no campaign objective

The AS-IS pass, read on its own, is NOT the campaign mission above — it carries no objective to "advance GAME 2"
or "close the gaps." Describing the system well IS its whole mission. In the CEO's own words it is
*"la parte más sin misión"* — the part most without a mission: *"es, literalmente, describir un sistema, el
único que necesite es que lo escriba bien"* ("it is, literally, describing a system; the only thing it needs is
to write it well"). Source: the same byte-verified CEO turn
chain as above, later in the same session. "ACS" throughout the quotes below is voice-to-text noise for "AS-IS"
— read literally, not as a distinct term. His hedges and repetitions are preserved, not smoothed. Spanish
governs; English is for reading only.

### The AS-IS pass needs the CEO's vision handed IN — it already had a vision of what to DO

> "No son menos, porque pasa es que la gente favor, la gente adviser, lo que él dijo es, este agente necesita
> una visión. Y si te referías a, necesita una visión sobre lo que tiene que hacer, ya la tenía. Y si te
> referías a, para funcionar, requiere que le pases tu visión, pues sí, le requiere, pero estábamos pasando
> solamente la pasada as is. Y esa es la parte que no nos está funcionando. Entonces, es la parte más sin
> misión, sin que hay, ¿no? Es como, literalmente, es describir un sistema, el único que que necesite es que
> lo escriba bien. Ok, su misión sería, supongo, describirlo de la manera suficiente para que deje no deje
> huecos sobre qué qué falta desarrollar o qué."
>
> Translated: "It's not less [important] — what happens is the adviser guy, what he said is: this agent needs
> a vision. And if you meant it needs a vision of what it has to do, it already had that. And if you meant, to
> function it requires that you pass it your vision — well yes, it requires that, but we were only passing it
> the AS-IS pass. And that's the part that isn't working for us. So it's the part that's most without a
> mission, without — right? It's like, literally, it's describing a system — the only thing it needs is to
> write it well. OK, its mission would be, I suppose, to describe it thoroughly enough that it leaves — doesn't
> leave — gaps about what's missing to develop, or whatever."

**In one line:** an adviser's "this agent needs a vision" finding is true only in the narrow sense that the
AS-IS pass needs the CEO's vision handed IN to function — it already had a vision of what it must DO. Read
alone, it carries no campaign objective — describing the system well IS the whole mission.

### The quality bar, in his own words — an open-ended list, never a closed checklist

> "En realidad, en en el ACS es simplemente que no queden preguntas de, es diferente el ACS al to be, ¿cierto?
> Porque el ACS simplemente describe lo que hay, de manera en que sean completo, de que descubra todos los
> casos que existe, que descubran. O sea, el ACS y el to be cuando te digo es diferente, porque el ACS es, ok,
> ¿qué hay? ¿no? Y es, ok, ¿cómo lo represento bien, que cumpla todos los escenarios, que No necesites regresar
> el código para entender cómo está funcionando, que no está demasiado complejo, que sea, que demuestre todo,
> ¿no? que estés presentando bien la arquitectura, que, este, ¿qué más se puede preguntar? No sé, hay una
> cierta cantidad de cosas que es al As Is que tiene que cumplirse, unos ciertos gráficos,"
>
> Translated: "Actually, in — in the ACS [AS-IS] it's simply that no questions remain about — the ACS is
> different from the TO-BE, right? Because the ACS simply describes what's there, in a way that's complete,
> that it discovers every case that exists, that it discovers [them]. I mean, the ACS and the TO-BE, when I say
> that, it's different, because the ACS is: OK, what's there? Right? And it's: OK, how do I represent it well —
> that it satisfies every scenario, that you don't need to go back to the code to understand how it's working,
> that it isn't too complex, that it — that it demonstrates everything, right? — that you're presenting the
> architecture well, that — what else can be asked? I don't know, there's a certain amount of things the AS-IS
> has to satisfy, certain diagrams,"

**His own hedge stays open, never closed into a checklist on his behalf.** He names: no questions remain;
discovers every case that exists; covers all scenarios; never need to go back to the code to understand how it
works; not too complex; demonstrates everything; presents the architecture well; a certain set of required
diagrams. He immediately asks himself *"¿qué más se puede preguntar?"* ("what else can be asked?") and answers
*"no sé"* ("I don't know") — deriving a quality criterion from this list owes that same hedge, never a closed
checklist he did not give.

He restates the same ask later in the same session, distinguishing it from unmeasurable human taste:

> "Hay cosas que no te puedo explicar, como bien dices, no son medibles en cuanto al gusto humano, cosas así,
> pero tampoco te he pedido un gusto humano, lo que te pedí parece bastante razonable. La cierta cantidad de
> gráficos, cierto tipo de gráficos, la necesidad de completitud, cómo medir la completitud."
>
> Translated: "There are things I can't explain to you — as you rightly say, they're not measurable in terms of
> human taste, things like that — but I haven't asked you for human taste either. What I asked for seems fairly
> reasonable: a certain amount of graphics, a certain type of graphics, the need for completeness, and how to
> measure completeness."

**Restated, not new:** what's unmeasurable (human taste) he never asked for; what he actually asked for — a
certain amount of graphics, certain types of graphics, the need for completeness, and how to measure
completeness — is enumerated and, in his own words, "bastante razonable."

### The three consumers

> "más la limitación de que, ok, esto va a ser rentarizado por alguien, que es el del HTML, y luego será usado
> para generar el to be y para generar el, ¿cómo se llama? el reporte para humanos, que todavía no hemos ni
> siquiera empezado."
>
> Translated: "plus the constraint that, OK, this is going to be rendered by someone — the HTML guy — and then
> it'll be used to generate the TO-BE, and to generate the — what's it called? — the report for humans, which
> we haven't even started yet."

**The three consumers, named plainly:** (1) it will be RENDERED by someone — *"el del HTML"* — the corpus's
existing agent:grimorio.design-redactor is the HTML renderer today, though this turn names the role, not the
agent, by name; (2) it will be used to GENERATE THE TO-BE; (3) it will be used to generate THE HUMAN REPORT —
which, in his own words, *"todavía no hemos ni siquiera empezado"* ("we haven't even started yet").

**UPDATE, 2026-09-09 — consumer 3's OWNER is now named at the mission level, superseding "undecided" below for
that half.** See "The mission's outer bound, and its handoff" above: a separate, later, not-yet-named agent
(design-orchestrator itself never produces it) owns turning the design agent's output into this human
report/presentation. **No pipeline stage or agent implementing that later agent exists today** — exactly WHO it
ends up being and HOW it is built stays a HOW/architecture call, out of PO's own scope; only the split (never
the design agent itself) is settled.

### The honesty obligation — if the domain doesn't exist, the AS-IS says so

> "mucho era para la gente de diseño en general, el agente Asis probablemente tenga otro requerimiento, ¿cierto?
> Otra visión aparte, porque su intención es simplemente describir lo que hay... Pero su función es diferente,
> la del [AS-IS], porque si tienes un código de espagueti y yo te digo, ah, tengo este dominio, pero realmente
> no existe. Entonces, ¿qué haces? Hay que ver, ¿no? A lo mejor no existe el dominio, me describes las
> funcionalidades y aclarándome que no es un dominio, y entonces el to be se encargará de moverlo a un dominio.
> Bueno, como te digo, cada uno tiene su propia misión, visión y lo que sea."
>
> Translated: "much of that was for the design agent in general — the AS-IS agent probably has a different
> requirement, right? A separate vision, because its intent is simply to describe what's there... But its
> function is different, the AS-IS's, because if you have spaghetti code and I tell you 'ah, I have this
> domain,' but it really doesn't exist — then what do you do? You have to look, right? Maybe the domain doesn't
> exist — you describe the functionalities to me and clarify that it isn't a domain, and then the TO-BE takes
> care of moving it toward one. Well, like I said, each one has its own mission, vision, whatever."

**The AS-IS agent's requirement DIFFERS from the design-agent-in-general's:** its intention is simply to
describe what exists. If the CEO claims a domain ("tengo este dominio") but the code is spaghetti and the domain
does not actually exist, the AS-IS pass must SAY SO — describe the functionalities and CLARIFY that it is not a
domain — never accept his framing at face value. Moving it toward an actual domain is explicitly the TO-BE's
job, never the AS-IS's.

### The close — tied to the still-separate thread of splitting the design agent into multiple modes or agents

> "Entonces, claro, e La Solamente eso es el modo o agente as is, no sé cuál hayas considerado, pero no va, si
> ese quieres una misión, esa es su misión, visión, no sé. Y es una partecita lo que ya habíamos dicho sobre
> reescribir el agente en múltiples modos o en múltiples agentes. Entonces, este, no sé si te ayudo o no, pero,
> bueno, eso es lo que yo veo."
>
> Translated: "So, right — that alone is the AS-IS mode or agent, I don't know which one you had considered,
> but it doesn't — if you want a mission, that's its mission, vision, I don't know. And it's a small piece of
> what we'd already said about rewriting the agent into multiple modes or into multiple agents. So, um, I don't
> know if that helps you or not, but well, that's what I see."

He draws the AS-IS/TO-BE line twice in this same turn (the quality-bar quote above, and here): AS-IS asks "what
is there, and how do I represent it well"; TO-BE is a different question. His closing line ties this mission
directly to the still-separate, already-discussed thread of rewriting the design agent into multiple modes or
multiple agents — named here, not resolved.

### What is still undecided

**NEVER let this record, or a brief invoking it, decide on its own whether agent:grimorio.design-orchestrator
needs to be REPLACED, materially rewritten, or only re-verified against this mission, and NEVER let it decide
which agent(s) end up owning the AS-IS mode** — the closing quote above ties this mission to "rewriting the
agent into multiple modes or multiple agents," a thread already live elsewhere in this corpus
(role-classification, RuntimeMode-vs-conditional-branch work) but not resolved here. Both are HOW/architecture
calls, the CEO's or grimorio.system-keeper's alone.

---

## Vision/Mission is a first-class agent-design artifact, owed to every agent-design context

Not the design-agent family alone — a vision (his own hedge: "no sé si visión, misión") is now, in his own
words, as important as the quasi-software-view itself, owed to EVERY agent-design context. Source: the same
session's final turn before sleep. Voice-to-text noise preserved verbatim; three garbled fragments are marked
with an editorial bracket rather than smoothed: "el last East tiene superprensión" reads as "el AS-IS tiene su
[visión propia]"; "el TV" reads as "el TO-BE"; "el agente Disney" reads as "el agente de diseño" (the design
agent). None of the three is cleaned up in the quote itself — the garble is quoted as spoken. Spanish governs;
English is translation only.

### The framing

> "hay que definir bien claro la visión, cuando es otra parte, ahora también por tanto o más importante, tan
> importante ahora como él, quasi overview, tienes que tener en cuenta una visión cuando diseñas un agente."
>
> Translated: "we need to clearly define the vision, when it's a different part — now also just as, or more,
> important, as important now as the quasi-[software-]overview — you have to take a vision into account when
> you design an agent."

**In one line:** a vision is now a FIRST-CLASS agent-design artifact, held ALONGSIDE the quasi-software-view,
never subordinate to it — required whenever an agent is designed, not only for the design-agent family.

### The cascade — every split-off agent gets its own vision/mission

> "Por lo mismo, cuando partes un agente y lo partes en múltiples agentes, como también te habíamos diseñado
> con el quasi software view, que ahora debería poder soportar relaciones entre agentes, que no sé cómo quedó
> eso. Pues, cuando creas un nuevo agente, partiendo uno, tienes que crearle su propia visión y misión al otro.
> No, no sé si visión, misión, ¿ya? pero se entiende lo que estoy intentando decir. Este, el last East tiene
> superprensión, el TV tiene su propio, si es un agente separado y no es el agente principal, tendría su propia
> visión, y el agente Disney en general tiene su propia visión, y la tarea tiene su visión y todo va más o menos
> así, ¿entiendes?"
>
> Translated: "For the same reason, when you split an agent, splitting it into multiple agents — like we'd also
> designed with the quasi-software-view, which should now be able to support relations between agents, though I
> don't know how that ended up — well, when you create a new agent by splitting one, you have to create its own
> vision and mission for the other one. No — I don't know if it's vision, mission, OK? — but you get what I'm
> trying to say. Um, the AS-IS has its own [vision], the TO-BE has its own — if it's a separate agent and not
> the main agent, it would have its own vision — and the design agent in general has its own vision, and the
> TASK has its own vision, and it all goes more or less like that, understand?"

**The cascade, exactly as he states it, never resolved further:** the AS-IS has its own vision; the TO-BE has
its own, but ONLY conditionally — "si es un agente separado y no es el agente principal" (IF it becomes a
separate agent rather than staying the main one); the design agent IN GENERAL has its own; and the TASK has its
own. **His own hedge on the term stays open, never settled into either word on his behalf:** "no sé si visión,
misión."

**His own open question, unresolved:** whether the quasi-software-view now supports RELATIONS BETWEEN AGENTS —
"que ahora debería poder soportar relaciones entre agentes, que no sé cómo quedó eso." Nothing in this corpus
has checked or resolved this.

**What is still undecided.** What each cascade level's vision/mission actually CONTAINS — the cascade above
names WHO owes a vision; it does not design any of them. Designing the AS-IS's, the TO-BE's (conditional), the
design-agent's, or the TASK's own vision content is a HOW/architecture call, out of PO's own scope.

---

## Every agent must CARRY its own design rationale — why it exists at all, not merely its per-invocation mission

Every agent already receives a per-invocation MISSION in its brief ("you're a grimorio agent and your mission
this time is..."). Separate from that — his own open question, stated twice, never resolved — is the reason the
agent EXISTS AT ALL. Source: a byte-verified CEO transcript chain migrated verbatim into
cite:memory/grimorio.po-memory/docs/design-rationale-agent-purpose-ceo-ruling.md — read that file for the full
verbatim source. Spanish governs; English is translation only. "cada gente" is voice-to-text for "cada agente"
throughout this turn, and "OMR" is "UML" — both noted, neither smoothed out of the quotes.

### His own open question — is this one concept or two?

> "el punto es, cuando yo te pido un agente, ¿no? que te lo pido como, por ejemplo, el agente de investigación,
> el agente de divergencia, que la pido por un motivo, ¿no?"
>
> Translated: "the point is, when I ask you for an agent, right — when I ask for it, like, for example, the
> research agent, the divergence agent — I ask for it for A REASON, right?"

Against that reason, he sets the ordinary case, which already exists in every brief:

> "normalmente tú levantas un agente, dices, oye, eres un agente de grimorio y tu misión para esta vez es hacer
> tal cosa, ¿no? Ya, esa es una misión."
>
> Translated: "normally you raise an agent, you say, hey, you're a grimorio agent and your mission this time is
> to do such-and-such thing, right? OK, that's a mission."

And he states, in his own words, that he does not know whether these are one concept or two — preserved here
exactly as open, never resolved on his behalf:

> "pero ahorita la misión o misión o visión, supongo, creo que son dos cosas. O sea, yo no sé si dos conceptos,
> no sé si tengamos que incluir dos conceptos por separado... su misión será un poquito diferente, pero aparte
> de la visión. Entonces, por eso no sé si incluir la misión."
>
> Translated: "but right now the mission — or mission or vision, I suppose — I think they're two things. I
> mean, I don't know if [they're] two concepts, I don't know if we have to include two separate concepts...
> its mission will be a bit different, but SEPARATE from the vision. So that's why I don't know whether to
> include the mission."

**In one line:** the per-invocation MISSION (already in every brief, nothing new) is set against the reason the
agent EXISTS AT ALL (undocumented, this section's whole subject) — and whether these are one artifact or two is
his own open question, stated twice, never his settled position. A capture that resolves this for him is a
capture that lies; it stays open here exactly as he left it.

### The founding worked example — the divergence agent

> "el agente de divergencia te lo pedía porque, cuando te mandás a investigar, ¿no? pues había cosas que no
> encontrabas durante tu investigación, que yo sabía que, claro, yo tengo cinco años de universidad, pero tú
> eres un modelo de inteligencia artificial con acceso a Internet. Así que no había excusas, entonces,
> probablemente era porque estabas buscando un cajón cerrado. Entonces, te dije, ok, vamos a sacar un agente de
> divergencia. Él tiene que ir y buscar diferentes hilos, y una respuesta más amplia de lo que no sé, porque,
> claro, no lo hace todo. Entonces, eso era tu la finalidad de esa gente en específico, ¿no?"
>
> Translated: "I asked you for the divergence agent because, when [I] sent you to research, right, there were
> things you weren't finding during your research, and I knew that — sure, I have five years of university, but
> you're an AI model with internet access. So there was no excuse — it was probably because you were searching
> inside a closed drawer. So I told you, OK, let's pull out a divergence agent. It has to go look for different
> threads, a broader answer for what [it doesn't know it doesn't know] — because, of course, it doesn't do
> everything [alone]. So THAT was that agent's own finality, specifically."

He adds the agent's later fate, in passing, as part of the same account: "Luego estaba la gente de
convergencia, que se unió con el researcher" (then there was the convergence agent, which merged with the
researcher) — recorded here for completeness, not itself the point of the example.

**In one line — this is the canonical instance of what a "vision" IS:** a judgment he made about a FAILURE MODE
(the researcher was searching inside a closed box — his own diagnosis, not a complaint about output quality),
turned into an agent whose entire reason to exist is closing exactly that blind spot. Nothing about the
divergence agent's later mechanics (it merged with the researcher) changes what its FOUNDING reason was.

**The consequence — an agent's output is judged against its founding desire:**

> "cuando cuando cuando te digo, ok, ¿qué espero de la salida de la gente de divergencia? Pues, la respuesta y
> el proceso del cómo, el por qué y qué salir y todo eso, bien atado a la al deseo por el que se creó, a la
> visión."
>
> Translated: "so when — when — when I tell you, OK, what do I expect from the divergence agent's OUTPUT? Well,
> the answer, and the process of the how, the why, and whatever comes out of it — all of it — [must be] tightly
> tied to the DESIRE it was created for, to the vision."

**In one line:** an expectation of an agent's output — the answer, the process, the how, the why — that is not
anchored in the DESIRE the agent was created to satisfy is unanchored. The founding reason is not backstory; it
is the standard the output is judged against.

### Why it must be CARRIED, not merely known

> "eso no está en ningún lado. Y si está de estar en comentarios o alguna cosa en el peor, medio escondido,
> entonces quiero que cada gente lo porte como motivo de diseño, ¿se entiende? O sea, ¿por qué exista esta pieza
> de software, como si fuera un producto? Algo, no sé si OMR lo hacía, pero parte de las razones de diseño, ¿se
> entiende? No sé si UML lo hacía."
>
> Translated: "that isn't documented anywhere. And if it exists at all, it's in comments or something, at
> worst, half-hidden. So I want EVERY AGENT TO CARRY IT as a DESIGN REASON — understand? Like, why does this
> piece of software exist, as if it were a product? Something — I don't know if UML did this, but [I mean] part
> of the design reasons — understand? I don't know if UML did this."

**In one line:** the requirement is not "this is knowable somewhere" — it is CARRIED, by the agent itself, as a
design reason, the way a product's own reason to exist would be documented — not filed away in a comment, not
inferable only by someone who goes digging.

### The sourced answer to his own question — UML carries no rationale construct; design rationale does

He asked, twice, whether UML captured this ("no sé si OMR lo hacía... no sé si UML lo hacía") and did not answer
his own question. The answer below is the corpus's own research, checked against external sources before being
written here — not something he said, and not to be read as if he said it.

**UML does not capture design rationale.** UML's own diagram families (class, sequence, state machine, use-case,
activity, and the rest of the OMG specification) notate STRUCTURE and BEHAVIOUR — what the system is and does —
never WHY a decision was made. This is uncontroversial within the field; UML carries no rationale construct of
its own.

**What he is describing has a real name and a real literature: DESIGN RATIONALE.** Its lineage, verified against
external sources: **IBIS** (Issue-Based Information System), conceived by Horst Rittel in the 1970s as a way to
work "wicked problems" — problems with no stopping rule and no single right answer — later formalized with
Werner Kunz; **gIBIS**, Conklin & Begeman's 1988 graphical hypertext tool extending IBIS specifically to capture
design rationale; and **QOC** (Questions, Options, Criteria), proposed by MacLean et al. in 1991 as a parallel
graphical method for the same purpose. All three are real, dated, sourced —
[gIBIS: A Hypertext Tool for Exploratory Policy Discussion (Conklin & Begeman, 1988)](https://www.researchgate.net/publication/42790084_Hypermedia_support_for_argumentation-based_rationale_15_years_on_from_gIBIS_and_QOC),
[The what and whence of Issue-Based Information Systems](https://eight2late.com/2009/07/08/the-what-and-whence-of-issue-based-information-systems/).

**Its living form today is the ADR (Architecture Decision Record).** Michael Nygard's 2011 post "Documenting
Architecture Decisions" set the now-standard template: Title, Status, Context, Decision, and Consequences —
verified against [Documenting Architecture Decisions (Nygard, Cognitect, 2011)](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
and its own widely-mirrored template text. Each record's Consequences becomes the Context of the next — Nygard's
own explicit analogy to Alexander's pattern language.

**And ISO/IEC/IEEE 42010 — the standard governing architecture description itself — requires an "architecture
rationale":** the standard makes explicit the relationships between stakeholder concerns, architecture
decisions, and the resulting architecture, and requires that decisions and their rationale be documented as
part of any conforming architecture description — verified against
[ISO/IEC/IEEE 42010:2022](https://www.iso.org/obp/ui/#iso:std:iso-iec-ieee:42010:ed-2:v1:en:term:3.13) and
[the arc42 quality model's own summary of the standard](https://quality.arc42.org/standards/iso-42010).

**The irony, verified against this repo's own files, not merely asserted:**
agent:grimorio.design-orchestrator's own Phase 5
(ref:agent/grimorio.design-orchestrator/phases/phase-5-produce-artifacts.md) already lists ADRs
among the artifact types it can PRODUCE for OTHER systems — the corpus already knows how to write this exact
artifact, has the machinery for it, and has never once turned it on itself, on its own 33 agents. All four
external claims above (UML's silence, the IBIS/gIBIS/QOC lineage, Nygard's ADR template, and 42010's rationale
requirement) held up under verification; none is repeated here on faith alone.

### Measured ground — the gap is real and structural, not a personal preference

An independent investigation (four scouts fanned out and converged by agent:grimorio.researcher, independently
re-opened and spot-checked against their own written files rather than accepted on self-report) found:

- **33/33 of this corpus's own agent shells carry a personality/identity paragraph; 0/33 carry the
  existence-reason construct this section describes.** A live repo grep for an explicit VISION/MISSION heading
  returned zero hits, confirming the "33/33" figure measures the OLDER, already-known Identity/PERSONALITY
  paragraph (ref:skill/grimorio.agent-writing), never the CEO's newly-named construct — the two are not the same
  thing, and conflating them would overstate what already exists.
- **Across eight external agent-declaration systems surveyed** (A2A AgentCard, MCP, CrewAI, AutoGen, LangGraph,
  OpenAI Assistants/Agents SDK, FIPA-ACL, Contract Net Protocol) — every one lets an agent DECLARE a purpose;
  **not one verifies the declaration is true.**
- **Across goal-decomposition prior art** (HTN, KAOS, i*, OKR cascading) plus a coverage-check pass over the
  same eight frameworks — **nothing checks that derived sub-purposes actually COVER the parent's**, with one
  documented exception: **KAOS's optional formal entailment proof**, sound when a goal is formalized in
  temporal logic, but never mandatory and unused by any surveyed agent framework.

This is cited as MEASURED GROUND for why the gap this section describes is real and structural, not a personal
preference.

### What is still open

**Whether mission and existence-reason are one artifact or two** stays exactly as open as he left it — a later
pass's call, never silent. **What a carried design-rationale artifact actually LOOKS LIKE on an agent shell**
(format, where it lives, how it differs from the Identity/PERSONALITY paragraph already in place) is a
HOW/architecture call, entirely out of PO's own scope. **Retrofitting agent:grimorio.design-orchestrator's own
ADR-writing machinery onto the 33 agents themselves** (the irony named above) is named, not decided, here.

---

## The synthesizer's (`agent:grimorio.extract-cleaner`'s) own mission

### Every single agent spawn needs a fresh synthesis — the 30-minute reuse window is a malfunction, not the design

> "mira, la el que el que te esté el que te esté obligando a a a levantar el sintetizador cada treinta minutos,
> en realidad, es un es un mal funcionamiento, debería ser menos. O sea, en realidad, la única razón por la que
> tenemos esos treinta minutos es porque, este, puede que el sintetizador se demore, pero realmente tú deberías
> estar haciéndolo cada spam de agente que tú haces lo necesita, y lo necesita porque Nuestros agentes no son
> agentes que hacen poquito trabajo, son agentes que toman muchos specs, muchos días y vueltas, y yo no estoy
> generando spec ni planificación ni nada. Se tiene que correr con todo el contexto posible para que entiendan
> qué está pasando. Esa es la razón del sintetizador."
>
> Translated: "look, whatever is forcing you to raise the synthesizer every thirty minutes is actually a
> malfunction — it should be less [frequent]. I mean, really, the only reason we have those thirty minutes is
> because, um, the synthesizer might be slow, but really you should be doing it every single agent spawn you
> make needs it, and it needs it because our agents aren't agents that do a little bit of work — they're agents
> that take on many specs, many days and many back-and-forths, and I'm not generating specs or planning or
> anything. It has to run with all the context possible so they understand what's happening. That's the reason
> for the synthesizer."

**In one line:** the 30-minute reuse window in the spawn gate exists ONLY because the synthesizer might be slow
— never as the intended design — and it should be SHORTER. **His actual model, stated plainly: every single
agent spawn needs a fresh synthesis**, because this project's agents receive tasks spanning many specs, many
days, and many back-and-forths, and the CEO himself does not write specs or planning — so an agent must run
with all the context possible to understand what is happening. This is the standing REASON the synthesizer
exists at all, in his own words.

### Its own vision — generate specs directly from the conversation, never from planning documents

> "en cuanto a, hablábamos de guardar visiones para los agentes, bueno, esa es la visión de, o la misión, en
> este caso, de la gente. Y la visión es que pueda, este, genere specs sin necesidad de, bueno, directamente de
> la conversación, no sin necesidad de estar leyendo la planificación, que se pueda entender a través de la
> conversación que estamos teniendo. Porque yo voy ida y vuelta hasta que la entiendes, y luego te digo,
> alánzalo y terminas olvidándolo."
>
> Translated: "as for — we were talking about keeping visions for the agents — well, that's the vision, or the
> mission in this case, for the [synthesizer]. And the vision is that it can, um, generate specs without needing
> to — well, directly from the conversation, without needing to read the planning — that it can be understood
> through the conversation we're having. Because I go back and forth until you understand, and then I tell you
> 'launch it,' and you end up forgetting."

**The synthesizer's own mission, in his own words:** generate specs DIRECTLY FROM THE CONVERSATION, without
needing to read planning documents — understandable through the conversation itself. **His reason, and it is
the exact failure this mission exists to prevent:** he goes back and forth until the main loop understands,
then says "launch it," and the main loop ends up FORGETTING. The fresh-synthesis-per-spawn rule above is the
mechanism; this is the PURPOSE it serves.

---

## The CEO's standing way of working with credentials and passwords

Broader than any single agent's mission — his own standing way of working with anything sensitive (credentials,
passwords, logins), a rule "technical agents" in general need to know, because — his own words — "va a ver a
pasar, y tiene que poder trabajar con eso" (it is going to keep happening, and an agent has to be able to work
with that). The synthesizer's session-id restructure (commit `35b7a4c5`) is the worked instance this rule draws
its example from. Custody check: the chain files this draws from are migrated verbatim into
cite:memory/grimorio.po-memory/docs/credential-handling-pattern-ceo-ruling.md — read that file for the full
verbatim source.

### The ruling itself

> "Pues mira, primero que nada, esta esta forma de trabajar con cosas que requieren permisos o son o son
> sensibles a tipo contraseñas o cosas así, es la forma de trabajo que tengo yo para este tipo de cosas.
> Entonces, cualquier cosa que requiere contraseñas, probablemente va a requerir un trabajo similar, o sea,
> cuando un agente trabaja con contraseñas. En el momento es en el que usará un API, en el que yo me loguee,
> ¿no? Pero yo tengo, en realidad, un trabajo parecido, varias cosas en mi trabajo, ¿ok? donde manejo
> entreseñas y eso, y no me quiero estar logeando, y y la la el el MM no no debe ver la contraseña. Entonces,
> esa es la manera voy a trabajar en contraseña, así que el agente agentes técnicos saberlo también. Porque va
> a ver a pasar, y tiene que poder trabajar con eso. Ahora, eso guárdalo."
>
> Translated: "Look, first of all, this way of working with things that require permissions, or that are
> sensitive like passwords or things like that, is the way I work with this kind of thing. So anything that
> requires passwords is probably going to require similar handling — I mean, when an agent works with
> passwords. The moment [it comes up] is when it will use an API that I log into, right? But I actually have
> similar work — several things in my own work, ok? — where I handle passwords and such, and I don't want to be
> logging in [manually], and the — the model must not see the password. So that's how I'm going to work with
> passwords, so technical agents need to know it too. Because it's going to keep happening, and [an agent] has
> to be able to work with that. Now, save that."

**In one line:** an agent working with credentials will need to use an API the CEO himself logs into; he does
not want to log in by hand for it, and **the model must never see the password.** He explicitly generalizes
this beyond the synthesizer case that prompted it — "cualquier cosa que requiere contraseñas" (anything
requiring passwords) — and explicitly instructs it be recorded — "eso guárdalo" (save that) — because
technical agents need to know it, since it will recur.

### The reasoning behind it

> "por ejemplo, cuando tienes un una un script, ¿no? con una, quieres acceder a un API, y esa API tiene una
> contraseña, pues, si le pides, oye, tráeme la contraseña, entonces el LM se puede reusar a hacerlo por
> permisos, pero si el script es agnóstico y la invocación es agnóstica, y solo trae la data y toda la
> complejidad está adentro, entonces pasa porque no hay nadie que lo haga. Entonces, esa es la manera correcta
> de hacerlo, más que darle permisos."
>
> Translated: "for example, when you have a script, right, that wants to access an API, and that API has a
> password — well, if you ask it, 'hey, bring me the password,' then the model may refuse to do it over
> permissions. But if the script is agnostic and the invocation is agnostic, and it just brings the data and
> all the complexity is inside, then it happens, because nobody has to [touch the sensitive part]. So that's
> the correct way to do it, rather than granting permissions."

**His own analogy, restated plainly:** a script that reaches an API guarded by a password should be asked for
the DATA it fetches, never for the password itself — the password is the tool's own internal business, never
named in the ask.

**What could not be verified as his own words, and was not invented on his behalf:** the fuller framing that
naming the sensitive part in an interface "invites the agent to open it, invites it to try to fix it, and
plants a concept its own task never needed" is real, but it is documented only in commit `35b7a4c5`'s own
message — the implementer's prose, third-person about "his reasoning," never a quote in either transcript this
rule draws from. Read as the correct GLOSS of his analogy above, not as a second verbatim quote.

**The shape that shipped.** An earlier objection existed: hiding a capability inside a script makes it
undeclared and unauditable, and an explicit permission rule was preferred instead. No verbatim CEO reply
resolving that specific exchange exists in either transcript. What stands instead is the resolution actually
shipped in commit `35b7a4c5`: the interface stays agnostic FOR THE AGENT (no session id, no transcript named in
the invocation), while the capability stays declared in ONE auditable place — the tool's own header — FOR A
HUMAN AUDITING THE REPO. Both concerns end up satisfied, not opposed.

### The worked instance — the synthesizer, commit `35b7a4c5` on `develop`

> Before: `node scripts/ceo-transcript-lookup.mjs $CLAUDE_CODE_SESSION_ID --user-count 20 --out X`
> After: `node scripts/session-window.mjs --user-count 20 --out X`

The session resolves inside the tool. The agent's own invocation names neither a session nor a transcript —
only what it wants (a window of recent turns).

---

## Negative examples

**One place, one heading, at the end — never inline beside the rule it once broke.**

- **Attaching campaign framing to the AS-IS pass.** Before the CEO's own correction (recorded above under "The
  AS-IS pass's own mission"), invocations of the AS-IS pass carried language like "advance GAME 2's design" and
  "close the gaps from the cheapest layer" — the CAMPAIGN mission, not the AS-IS pass's own. The AS-IS pass,
  read alone, describes a system; it does not carry an objective. Handing it campaign framing is wrong even
  though the campaign mission and the AS-IS mission are both real and both documented above — the error is
  applying the first where only the second belongs, and it is the concrete failure the two sections above exist
  to prevent.
