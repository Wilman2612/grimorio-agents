---
name: loop-and-graph
description: "The CEO's own dictated execution machine for how grimorio works EVERY problem — a game, a workflow, an API, a mechanic — never only a clause audit. DECOMPOSE FIRST splits the problem, general to specific, until each item is TESTABLE. THE LOOP is the WHILE/FOREACH iteration and its exit condition: every item closes PROVEN or as a FINDING, never abandoned. THE POPULATION GROWS: a blocked item INSERTS its missing prerequisite as a new item ahead of it, rather than stalling or hand-rolling a private workaround. THE PLAN IS AN ARTIFACT EVERY LEVEL EXPANDS: write the plan into the loop's own artifact tree BEFORE executing it, at the level that raised you. THE GRAPH names who is in it — planner, worker, probe, code-reviewer — and the branch-per-worker/merge rule. THE PROBE states what counts as proof: a cue that does not name the thing being tested, and reading the obligation (lazy `ref:` vs eager `import:`) before writing a pass condition. Load BEFORE planning or executing any multi-item task or loop, before giving an item its pass condition, and before designing a probe of whether a rule or instruction actually fires."
---

# LOOP + GRAPH — how grimorio is supposed to work, on EVERY problem

This is the CEO's own dictated execution machine — not invented, not a summary of one — for how ANY problem
gets worked here: a game, a workflow, an API, a mechanic. It is not a clause-audit procedure; that was an
early misreading of this file, corrected below.

> **Status.** The CEO's own explanation, given 2026-08-11 across two messages, because none of it was
> happening. *"nada de esto se te hubiera pasado ni por la mente… si es que no te lo estoy diciendo yo
> explícitamente. Ahora, el chiste de grimorio es que pudieras hacer todo eso con todos los problemas todo el
> tiempo, sin que yo te lo tuviera que estar diciendo."*
>
> **The first version of this file made it a method for auditing clauses. That was wrong and he corrected it
> immediately:** *"estos problemas aplican para todo… no entiendo por qué es tan complicado."* The clause
> audit is ONE INSTANCE. The shape below is the shape for a game, a workflow, an API, a mechanic — anything.
>
> **This is NOT a ledger.** Same session he ordered: *"para con los ledgers, porque me están volviendo loco."*
> -> "FINDINGS, NOT LEDGER WRITES" at the bottom.

---

## 1. DECOMPOSE FIRST — general → abstraction → specific, until a thing is TESTABLE

This is the part that comes before any loop exists, and it is why `reasoning-principles` opens with DECOMPOSE.
**You go from the most general thing to something specific, deciding as you go and filling in what each
decision opens.** You stop descending when the item is small enough that you can PROVE it.

His worked example, verbatim:

> *"Ok, necesitas eso. ¿Qué necesito primero? Primero necesito una web, tengo que mostrarlo. Esa web dentro
> necesita matchmaking, que tenga el workflow, que tenga sesiones, etcétera. El juego… necesitas la API.
> Tienes todos esos ítems, uno por uno. ¿Cómo planeamos esos? Ya tienes el ítem: el juego. ¿Qué lenguaje voy
> a usar, qué mecánicas va a tener — mecánica por mecánica, probar mecánica por mecánica? Ok, listo, mecánica
> por mecánica no hace un juego. ¿Cómo hago? Combinación de mecánicas. Luego ya tengo las mecánicas: ¿qué más
> necesita un juego? Una estructura, reglas, etcétera. Principio, fin de juego, lo que sea. O sea, vas
> descomponiendo. Igualito, igualito, el workflow: necesito una vista de workflow, necesito una interface,
> necesito un backend. Necesito nodos — ¿qué nodos tengo? Tengo texto, tengo… Yo tengo todo por separado."*

> *"Un juego se descompone en varias cosas: una mecánica. Ok, es una abstracción. ¿Qué es una mecánica? Es
> una palabra muy general. Defino una mecánica: va a ser batallas de lancero versus tal, o ataque, o moral,
> lo que sea. Ya tengo una abstracción. Moral es muy ambiguo — moral tiene muchas cosas dentro, y te vas
> yendo más y más y más y más, y cada vez más específico. A eso es a lo que me refiero."*

**The tell that you have not descended far enough: the item's name is still a category.** "Moral" is not a
task; it is a bag. "Mechanic" is not a task. Keep splitting until the name describes something you can run a
probe against and get a yes or a no.

**A COMBINATION is its own item, never a free consequence of its parts.** *"mecánica por mecánica no hace un
juego"* — proving each mechanic in isolation leaves the composition unproven, so the composition gets its own
item, its own pass condition, and its own probe.

**Items that do not touch each other run in PARALLEL — that is what fan-out is for.** *"algunos no tendrán
nada que ver, como por ejemplo el juego con el workflow… y se pueden hacer en paralelo."* The split is the
caller's to name, not the worker's to discover.

## 2. THE LOOP — the iteration and its exit condition

> *"Primero, tenemos loop con graph, que significa planificar primero el loop y luego darle la estructura…
> hace un while, o tienes que descomponerlo… y un foreach, regla por regla, trigger por trigger, o como
> quieras llamarlo. Uno por uno, prueba algo que funcione. Si no funciona, lo arreglo y me muevo al
> siguiente, y es un while, y está ahí, moviéndose, uno por uno."*
>
> *"¿Cuándo termino? Cuando he probado que todas funcionan… Ya tienes tu condición de iteración: uno, he
> probado que todo funcione; o la otra cosa que puede pasar es que no lo he podido arreglar, probé tres,
> cuatro veces — que viene por parte del graph. Y si ya intentaste, lo marcas como hallazgo. Y hallazgos,
> para que un siguiente loop —o corregido por mí, automático— intente encontrar las cosas que se arreglaron,
> qué funcionó, tomarlas como ejemplo, intentar de nuevo, y si no, escalármelo. Básico."*

```
PLAN (before any work)
  └─ DECOMPOSE until each item is testable          §1
  └─ give EACH item its PASS CONDITION, a priori    ── by me, by an agent, or by an
                                                       agent whose only job is conditions

WHILE items remain unproven
  FOREACH item  (independent items in parallel — fan-out):
        ┌──────────────── THE GRAPH, one traversal per item ────────────────┐
        │  planner        the probe + the pass condition                     │
        │      ↓                                                             │
        │  worker (Sonnet)  ONE item, ONE instruction, own branch            │
        │      ↓              (branch = copy of the CURRENT branch)          │
        │  probe            does it actually work / fire, under a real cue?  │
        │      ↓                                                             │
        │   ┌── passes ──→ code-reviewer ──→ MERGE ──→ discard branch        │
        │   └── fails ───→ FIX ──→ re-probe ──→ retry, max N                 │
        │                    └── still failing after N ──→ FINDING           │
        └────────────────────────────────────────────────────────────────────┘
        close the item, move to the next

EXIT when every item is either:
  (1) PROVEN — probed, fixed if it needed fixing, and it works; or
  (2) FINDING — N retries spent, recorded with WHAT WAS TRIED, so the next loop reads
      what did get fixed elsewhere, copies it as the example, and retries — escalating
      to him only after that fails too.
```

**The retry ceiling and the FINDING belong to the GRAPH, not the loop.** The loop only asks whether items
remain. Retry-then-record is an edge inside one traversal.

**A FINDING is fuel for the next iteration, never a dead end.** It carries the attempts and points at the
items that DID get fixed, so the next pass has a worked example before anything reaches him.

## 2b. THE POPULATION GROWS — a blocked item INSERTS its prerequisite (CEO, 2026-08-13)

> *"Pues hombre, es automatic testing… no tiene que ser 100% official channel, pero no tiene que ser un
> blocker. ¿Es hueco en el loop? Supongo que ahora mismo el loop está tan fijo que le impide agendar una
> tarea anterior para completar otra tarea bloqueada. Digamos que el QA reporta bloqueo: el padre del loop
> debe detectar qué tiene que hacer para hacer la tarea posible, ¿no? Siempre que no rompa los objetivos.
> Parar por algo así, que es deducible, no me parece sano."*

**The defect this closes, and it happened:** a live-mode E2E item could not run because a match requires a
funded wallet and NOTHING outside production can put money in one — the spend layer has budgets, spending
and cut-off, but its only entry is Stripe. The QA agent's two available exits were both bad: declare itself
blocked, or hand-roll a workaround. It hand-rolled one, which leaves no trace that a real gap exists.

**WHEN an item cannot proceed because a PREREQUISITE is missing, and what the prerequisite is can be DEDUCED ⟶ the loop's owner INSERTS that prerequisite as a new item ahead of the blocked one, and continues.**
It does not stop, and it does not let the blocked item invent a private workaround.

**The bound, in his words: "siempre que no rompa los objetivos."** An inserted item makes the blocked one
POSSIBLE — it never widens the goal, never trades away a stated bar, and never becomes a reason the original
item quietly changes shape. If closing the gap would do any of those, that is not an insertion; that is a
FINDING plus a question for him.

**A workaround is not an insertion, and the difference is the trace.** A private fix inside one item's own
work leaves the gap unrecorded and the next item hits it again. An inserted item carries its own DONE and
its own probe, so the gap is closed once, visibly, for everyone after.

**The population is therefore not fixed at PLAN time.** §1's decomposition is the STARTING population, not
the final one — the loop discovers prerequisites by executing, which is the whole reason it is a loop and
not a checklist.

**His own caveat, kept because it is honest:** *"no sé si mi definición de loop es la misma que la definición
de loop que está en Internet, pero bueno."* It is the standard shape — a work queue, a fixed per-item
pipeline, a bounded retry, and a dead-letter for what the retries could not settle. The names differ; the
machine does not.

## 2c. THE PLAN IS AN ARTIFACT EVERY LEVEL EXPANDS (CEO, 2026-08-13)

> *"Todos deberían estar expandiendo el artifact del loop, supongo que en subarchivos y carpetas, para que
> sea auditable."*

And on who plans what, correcting an earlier over-reading: *"no tenías que planear todos desde el delegado —
planeabas la parte superior y cada quien se encarga de su planeación, y así hacia abajo."*

**ALWAYS write your plan into the loop's own artifact tree before you execute it — a subfolder and files of
your own, under the level that raised you.** The caller plans its layer and nothing below it; each agent
plans its own piece and expands the tree at its own branch. The result is one auditable structure, from the
top objective down to the individual probe.

**The defect this closes, measured 2026-08-13 over 98 spawns in one session:** exactly three ran at Haiku
tier, and all three were raised by the ONE agent that had written its plan to a file first. Everybody else
planned inside their own reasoning, where nothing is left over to hand down — **a plan that never becomes a
thing cannot be split, and what cannot be split cannot be tiered.** The Haiku-first rule was not being
disobeyed; it had nothing to act on. The same pattern held on the previous day's only other file-written
plan, which also delegated downward.

**This is also the CHANNEL, and that is the load-bearing part.**
cite:skill/documentation-memory/docs/66-missing-prerequisite-discovered-mid-run-prior-art-referencia.md#verdict-up-front
found that the systems which avoid silent workarounds do not avoid them by choosing a resolution strategy —
they avoid them because **discovery and resolution happen through the same tracked mechanism, so there is no
side door.** A blocked item writes its blocker into this same tree, where the level above it reads. The QA
agent that hand-rolled a wallet workaround had no such place to write; that was a missing mechanism, not
poor judgement.

**NEVER treat the tree as a report written after the fact.** It is written BEFORE execution and amended
DURING it — that is what makes it a plan rather than a summary, and what lets a reader see the decision as
it stood when it was made.

## 3. THE GRAPH — who is in it, and the branch rule

> *"Si lo vas a invocar tú, tú eres la primera parte del grafo, el primer nodo. Si lo vas a hacer trayendo un
> delegado, tú y el delegado participan… probablemente vas a necesitar primero el keeper, que va a ser un
> agente Sonnet. Al keeper le vas a dar la parte que tiene que revisar, y solamente esa única instrucción, si
> vas a hacer un fan-out. Que no se choquen. O que tengan la instrucción de trabajar sobre una nueva rama,
> copia de la rama actual —que creo que antes lo estábamos haciendo únicamente sobre develop, pero sobre la
> rama actual— y se mergea al final, o sea, descarta la rama al final. Entonces, si va a haber un merge,
> tiene que haber un keeper, un code reviewer, más los agentes que requieran las pruebas, y tú como planner o
> como revisor. Y luego, cuando cada una te ha aprobado, se mergea, se cierra y se mueve a la siguiente
> instrucción, y se cierra un ítem de dirección."*

**Each worker gets a NEW branch that is a COPY OF THE CURRENT BRANCH — no longer always `develop`.** It merges
at the end and the branch is discarded. Because there is a merge, the graph must carry a `code-reviewer`
before it, plus whatever test agents the item needs.

**The coordinator coordinates; the workers are Sonnet, and some items are Haiku work.** *"los que hacen el
trabajo son agentes Sonnet. A Sonnet — incluso hay trabajo para Haiku. Algunos de los agentes multipropósito
puede ser en Haiku."* One agent closes one item.

## 4. THE PROBE — what counts as proof

**ALWAYS probe with a cue that does not name the thing being tested.** Ask an agent to decompose a small
problem and see whether `reasoning-principles` actually loaded; ask it to look at some file and see whether
`prompt-reading` loaded first. **NEVER ask whether the instruction is in its context** — that measures string
retrieval, which already passes and is not what fails.

> *"Le dices a un agente: oye, ¿puedes leer bien tus prompts, tu razonamiento, tus skills? Y él te responderá
> sí, y por lo menos lo que deberías haber visto es que efectivamente esté cargando el skill de
> prompt-reading. Si quieres lo haces menos obvio: oye, revisa el archivo readme, una cosa así. Cualquier
> cosita, porque es una instrucción que se carga, debería cargarse siempre. Y si falla, es que tu condición
> no es buena, y hay que arreglarlo."*
>
> *"Pídele a un agente que te descomponga un problema chiquito. Cualquier problema — aunque no uses la
> respuesta, ¿lo carga? Realmente lo carga."*

**ALWAYS read the obligation from the relation before writing the pass condition.** A `ref:` is LAZY — it
passes if the agent can reach it when asked, and reaching it on request IS a pass. An `import:` or a
"load this before anything" is EAGER — it passes only if it loaded with nobody mentioning it. Grading a lazy
reference by an eager bar invents a failure; grading an eager one by a lazy bar hides one.

> *"La primera regla es la del PO memory, que está como referencia: técnicamente es prosa, entonces no estás
> obligado a cargarlo. Puedes levantar su paciente, ver que lo lee y que si se lo preguntas, lo va a leer; y
> porque se lo has preguntado, como referencia es lazy, así que está bien. Si lo puede leer, pasa su prueba."*

**A Sonnet failure is a REAL failure; a Haiku failure may be a wording defect.** *"en Sonnet no hay excusa.
Sonnet es muy capaz de cargar instrucciones. Si no lo está haciendo, falla, y tienes que arreglarlo."* Haiku
not loading is admissible evidence that the clause must be made more obvious — not proof the agent cannot.

## FINDINGS, NOT LEDGER WRITES

A correction or defect noticed DURING a loop becomes a FINDING inside that loop's own output (§2 above) —
never a separate ledger append — so the next iteration actually reads it where it is working, not in a file
nobody re-opens.

**The ledger-write prohibition itself, and whether it is currently in force, is owned by your project's own
current-objective file and ref:skill/grimorio-conduct rules 18/26 — read those for the live ruling, never this
file.** This file states only the loop-methodology half: where a noticed defect goes while a loop is running.
