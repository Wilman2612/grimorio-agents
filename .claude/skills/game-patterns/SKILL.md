---
name: game-patterns
description: "The game-domain PATTERN canon for the simulation side: reuse via DATA (Type Object, Component, data templates), the data-vs-code boundary that makes 'a game is DATA' mechanical, data-oriented design (SoA, existential processing), the simulation patterns (game loop, command/order stream, determinism, replay), and a DIAGNOSTIC checklist for detecting the canon being violated. Load before designing or reviewing any simulation/engine/content-model code. Sits ON TOP of the language skills (golang/javascript), not instead of them. (Sourced from Nystrom, Fabian, Gregory, the ECS literature, and the real 0 A.D./OpenRA content files — not written from memory.)"
---

# Skill: game-patterns — the simulation-side pattern canon

The layer that sits **on top of** normal programming principles. ref:skill/golang / ref:skill/javascript tell you how to write
the code; ref:skill/development-patterns#mandatory-patterns--cheat-sheet tells you where it goes; **this tells you what shape a GAME's content model
and simulation must take** so the thing stays extensible after the tenth unit, the fiftieth weapon, and the
second designer.

## How to read this — don't read it all

| You are… | Read |
|---|---|
| Reviewing a diff | **All 10 diagnostics below are the review checklist.** Checks 1, 5, and 10 are answerable from a diff alone; 2, 3, 8, and 9 need a repo-wide grep and are cheap to run; 4, 6, and 7 need case-by-case judgment against the diff's intent |
| Adding a unit / weapon / effect / structure | The through-line + ./type-object-and-data-templates.md |
| Choosing or changing how entities are stored | ./entity-and-component-models.md, then ./data-oriented-design.md |
| Working on the tick, orders, or determinism | ./simulation-patterns.md — and check 10 before anything else |
| Told "use pattern X" and wondering if you should | The pattern index — specifically the **when NOT** column |
| Checking whether a claim here is real | ./sources.md, which also lists what could NOT be sourced |

**First time in this repo:** read this file's through-line and diagnostics, then ./project.md for what our
simulation actually does. That is enough to work. The rest is reference you open when the task touches it.

> **Scope.** This is the **simulation / domain / content-model** side. The client-side RENDER canon (game loop
> for a canvas, tween/interpolation, PixiJS/Phaser lifecycle, juice, animation) is a separate skill:
> **ref:skill/game-development**. They share vocabulary (Game Loop, Update Method, State, Component) and deliberately
> do not duplicate: ref:skill/game-development covers those patterns as they apply to drawing; this skill covers them
> as they apply to simulating.

---

## The through-line: REUSE IS VIA DATA, and it is the whole point

Making one game thing feel good is expensive. So games do not make a hundred things — they make **a few
well-tuned primitives and then vary them by data**. Every weapon in a good game is roughly the same weapon
with different numbers and a different pick of shared parts. This is not thrift, it is the only way a content
roster scales.

The mechanical form of that principle is a **hard boundary between the engine and the content**:

```
   CONTENT (data)                     ENGINE (code)
   ─────────────────                  ────────────────────────
   spearman.json  ─┐                  ┌─ Attack        (one universal implementation)
   halberdier.json ├─ reference by ──▶├─ Health           of each PRIMITIVE, driven
   crossbowman.json┘     NAME         ├─ Movement         entirely by the data it is
                                      └─ SpreadDamage     handed. Never per-content.
   Adding content        Adding a primitive
   = a new data row      = a new NAMED, data-referenceable type
   = ZERO code           = code ONCE, then free forever
```

The failure this prevents, stated plainly: **every time a weapon behaves slightly differently you add a flag
and an `if`.** Ten weapons later the combat function is a switchboard nobody can reason about, no two branches
are tested together, and a designer cannot change anything without a programmer. Type Object, Component, and
data templates are what turn "a game is DATA" from an aspiration into a thing the compiler and the file layout
enforce.

### The three-tier boundary

Both reference engines separate **content** from **new primitives** from **engine work** — but they do not
agree on the middle. 0 A.D. has a genuine sandboxed middle tier (a JS component, no engine rebuild, reachable
by modders); OpenRA effectively has **two** tiers, because its "new trait" path already means compiling C# into
a DLL. Treat tier 2 as a spectrum, and note that where your tier-2 line sits is a real design choice with a
real cost, not something the prior art settles for you.

| Tier | What it is | Cost | Who can do it |
|---|---|---|---|
| **1. New content** | Recombine EXISTING primitives with new values / a new parent template | A data file, often <15 lines | A designer, no build |
| **2. New primitive** | A behaviour no existing primitive can express as a parameter — a new named type | Code ONCE; thereafter referenceable by name from any data row | A programmer |
| **3. Engine integration** | Something needing the tick loop, storage layout, or determinism substrate | Code + review + regolden | A programmer, gated |

**Tier 1 must be the overwhelming majority of all content changes.** In 0 A.D. a concrete Athenian hoplite is
an ~8-line XML file over a 4-level template chain; in OpenRA the `25mm` and `90mm` cannons are ~5–15 line diffs
over a shared `^Cannon`. Tier 2 is legitimate and necessary — the sin is not writing code, the sin is writing
code that serves **one** content item instead of adding a primitive **all future content can name**.

-> The full shape, with the real 0 A.D. / OpenRA files quoted: **./type-object-and-data-templates.md**

> **HARD RULE — NEVER hardcode a game (or a minigame) into engine code.** The engine is a fixed interpreter;
> a game's rules are a declarative DATA spec it reads, reachable through the tier-1/tier-2 path above — never
> a special-cased branch written into the tick/systems tree for that one game. This is the through-line's
> failure mode at whole-game scale instead of single-weapon scale: the same "one content item paid for in
> engine code" defect the NEW-PRIMITIVE test (diagnostic 5, below) already catches at the content-row level.

---

## The pattern index

Every row is actionable. **The "when NOT" column is the load-bearing one** — Nystrom is unusually good on this
and it is the half of the canon that normally gets lost. Details, code shapes, and design forks live in the
topic files named in the last column.

### Content-model patterns — the reuse spine

| Pattern | Problem it solves | When NOT to use it | Depth |
|---|---|---|---|
| **Type Object** | A subclass-per-variant explosion. A "breed"/type becomes a **data row**, so a new monster/weapon/unit is a new row, never a new class or branch | When types need **type-specific BEHAVIOUR**, not just data — Nystrom: *"easy to define type-specific data, but hard to define type-specific behavior."* You then need a registered-behaviour seam, Subclass Sandbox, or scripting. Also: you take over the compiler's bookkeeping by hand | ./type-object-and-data-templates.md |
| **Flyweight** | Many instances redundantly storing the same intrinsic data; shared per-kind data stored once | When the shared object would need to be **mutable** (sharing implies near-immutability), or when the pointer indirection costs more cache than the memory it saves | ./type-object-and-data-templates.md |
| **Prototype (as DATA)** | Duplication across content rows: a row declares another row as its parent and states only its deltas | The **classic GoF object-`clone()` form** is near-useless in a modern engine — Nystrom's own critique: it just relocates the boilerplate. Only the data-prototype/delegation form earns its keep | ./type-object-and-data-templates.md |
| **Component** | A god-entity class touching physics, render, AI, economy at once; an entity becomes a **bag of declared parts** | When the coupling/bloat problem isn't real yet — it adds genuine complexity: each object becomes a cluster to instantiate, wire, and communicate between. Don't adopt it because it's fashionable | ./entity-and-component-models.md |
| **ECS (strict)** | Component's logical end-state: entities are bare IDs, components are pure data, **systems own all behaviour** | Hierarchies, component sharing, multiple instances of one component, runtime tags, state machines, reactive triggers, and system ordering are all things vanilla ECS handles **badly** — the flecs author says so first-hand. Spatial structures resist it. Bolting it onto a non-ECS engine costs real glue | ./entity-and-component-models.md |

### Data-oriented patterns — layout and branch elimination

| Pattern | Problem it solves | When NOT to use it | Depth |
|---|---|---|---|
| **Structure-of-Arrays** | Per-entity structs defeat cache locality and vectorization; parallel columns fix both | Ordering a table for cache coherency **trades away** its parallelism — you pick one per case. And a hot/cold split is only worth it under a measured problem | ./data-oriented-design.md |
| **Existential processing** | An entity's state expressed by **which collection it is in**, not by a flag branched on every tick — the `if` disappears structurally | It fragments storage and makes "the player object does X" un-thinkable; Fabian concedes data becomes an indirect lookup instead of one dereference. State-transition-heavy entities pay a move cost on every transition | ./data-oriented-design.md |
| **Data Locality** | Cache misses in a hot pass | **Optimization-only.** Nystrom gates it explicitly: only with a measured performance problem, profiler-confirmed to be cache misses. Costs you inheritance and interfaces. He calls it "between a black art and a rathole" | ./data-oriented-design.md |
| **Object Pool** | Allocation churn and heap fragmentation | Wasted when objects vary in size (every slot pads to the largest), when the pool is untuned in either direction, or when allocation was never a measured bottleneck. Imposes a hard active-count ceiling | ./simulation-patterns.md |
| **Spatial Partition** | O(n²) "what is near me" scans | **The gate is query VOLUME, not "objects have positions."** For small n the bookkeeping exceeds the saving; constantly-moving objects pay a continuous reorganization tax that can eat the win | ./simulation-patterns.md |
| **Dirty Flag** | Recomputing derived data that changes more often than it is read | When the derived value **can** be maintained incrementally (do that instead), or when deferred work would concentrate into one visible stall. Its real cost is stale-state bugs: miss one setter and you get silent wrong answers | ./simulation-patterns.md |

### Simulation-structure patterns

| Pattern | Problem it solves | When NOT to use it | Depth |
|---|---|---|---|
| **Game Loop** | Advancing the world independently of input | You will use it. The fork that matters is fixed-vs-variable timestep — **variable timestep makes gameplay non-deterministic**, which forfeits replay and dispute-resolution | ./simulation-patterns.md |
| **Update Method** | Per-entity behaviour as one frame's slice | Poor fit for abstract/turn games. Costs: each entity must store resume state; ordering is load-bearing (A sees B's old state); mutating the collection mid-iteration is a classic trap | ./simulation-patterns.md |
| **Command / order stream** | The sim is touched **only** through reified orders — which buys replay, networking, undo, and AI-vs-human symmetry in one move | Its cost is **discipline**: every state mutation must go through it, or the guarantee is void. Nystrom: *"It takes discipline to make sure every data modification goes through a command."* | ./simulation-patterns.md |
| **Double Buffer** | Order-dependent updates when everything should appear simultaneous | Costs 2× the state in memory, and if swapping costs more than mutating you have gained nothing. External code can't hold persistent pointers under a pointer-swap | ./simulation-patterns.md |
| **State (FSM)** | Flag soup: `isJumping && !isDucking && …` | FSMs are not Turing-complete and blow up combinatorially; complex AI wants behaviour trees or planning instead. And note the **direct conflict with existential processing** — Fabian says don't store the state on the entity at all | ./simulation-patterns.md |
| **Event Queue** | Decoupling **in time**, sender from processing | Only when you need time-decoupling — Observer/Command are cheaper if you only need to decouple *who*. It is still a global; control flow becomes non-obvious; queued events must be data-heavy because the referenced entity may be gone by drain time; and feedback loops turn a loud stack overflow into a **silent** event storm | ./simulation-patterns.md |
| **Bytecode / scripting VM** | Sandboxed, hot-reloadable, designer-authored behaviour | **Almost always overkill.** Nystrom: *"the most complex pattern in this book, and it's not something to throw into your game lightly."* Mandatory front-end authoring tool, loss of conventional debugging, near-guaranteed scope creep into "a shanty town." Not for hot paths | ./simulation-patterns.md |
| **Subclass Sandbox** | Many variants needing controlled access to engine services | The base class **accretes** — it ends up coupled to every subsystem any subclass needs, the classic fragile-base-class trap. Prefer Component; Nystrom says so himself | ./simulation-patterns.md |
| **Service Locator** | Reaching a service without coupling to its concrete class | It is **a global in disguise** — the dependency is hidden, not removed; lookups can fail; the service can't know who is calling. Nystrom's advice on when to use it is literally *"sparingly"* | ./simulation-patterns.md |
| **Singleton** | — | **Don't.** Nystrom's chapter is an argument against it and closes *"I've never used the full Gang of Four implementation in a game."* Pass it in, provide it via a base, or centralize into one explicit root object | ./simulation-patterns.md |

---

## Diagnostics — checks you either performed or did not

Run these against a design or a diff. Each is mechanical: it produces a number or a yes/no, not an opinion.
A failing check is not automatically a defect — but it is a thing you must be able to **justify out loud**.

**1. The DATA-ONLY test (the headline).** *Can a new weapon, unit, terrain effect, or structure be added by
editing DATA only, with no engine change?* Take the last content addition and count: files touched, split into
data files vs code files. Healthy looks like *N content items, 1 data file, 0 files under the systems/tick
tree*. Unhealthy looks like *1 content item, 6 code files*.

**2. The SWITCH-SITE COUNT.** Grep for every `switch`/`if` chain over each content-type enum. **Flyweight's own
trigger, verbatim from Nystrom: "If you find yourself creating an enum and doing lots of switches on it,
consider this pattern instead."** One switch that routes to a data lookup is fine. Two or more sites that each
re-derive a different aspect of the same type means the type's identity belongs in a data row.

**3. The DUPLICATED-SWITCH test.** Does the *same* switch over the *same* enum exist in two or more packages?
This is the terminal stage of check 2 and is always a defect — the enum has become a de-facto data table that
nobody made into one, so every consumer maintains its own copy.

**4. The CAPABILITY-FLAG test.** Is each behavioural capability (is-siegeable, is-a-depot, blocks-movement,
emits-a-projectile) a **field on the type's data row**, or is it enum membership hardcoded in a predicate? If
it's a predicate, adding a variant means editing that predicate — and every other one like it.

**5. The NEW-PRIMITIVE test (the honest counterweight).** Writing code is *not* the violation. When code was
required, ask: did it add a **named primitive that any future data row can reference** (OpenRA's `SpreadDamage`
is named from YAML; a `Reach bool` + one universal predicate is a schema extension), or did it add a special
case for **one** content item (`if name == "halberd"`)? The first is Tier 2 and correct. The second is the
defect this whole skill exists to catch.

**6. The TYPE-SPECIFIC-BEHAVIOUR test.** When a type genuinely needs *procedural* behaviour rather than
different numbers — Nystrom's sharpest caveat — is there a **registry seam** (a data string keyed to a
registered pure function) so the behaviour is still *selected* by data? Or did the behaviour get hardcoded into
the universal path with a branch?

**7. The EXISTENTIAL test.** Does a per-entity hot loop branch on a boolean the entity carries? Fabian:
per-entity loops full of `if`s mean the data isn't organised by state yet — the loop should iterate a
collection whose *membership already encodes the condition*.

**8. The THIN-DIFF test.** Does a concrete content row inherit from a template and state only its **deltas**,
or does it restate every field? A roster where each row is fully spelled out has no template layer, and every
global tuning change becomes a hundred edits.

**9. The SCHEMA-FROM-CODE test.** Is the content data validated against a schema **derived from the same
declaration that implements the behaviour** (0 A.D.'s per-component RelaxNG `GetSchema()`; OpenRA's `[Desc]`
attributes on the `TraitInfo` fields, which generate both the docs and the schema)? A hand-maintained separate
schema drifts; no schema at all is how a data layer becomes soup. This is the anti-soup answer both engines
converged on independently.

**10. The DETERMINISM test (any sim that replays or arbitrates).** Is the replay an **order stream + seed**
rather than state snapshots? And is the forbidden-list held: no wall-clock reads in sim logic, one seeded PRNG
threaded explicitly, no iteration over non-deterministically-ordered collections, no branching on local
hardware or settings?

> **The trap this list is missing if you write it from the C++ lockstep literature: FLOAT FUSION.** The Go
> language spec *explicitly permits* an implementation to "combine multiple floating-point operations into a
> single fused operation, possibly across statements, and produce a result that differs from the value obtained
> by executing and rounding the instructions individually." In practice `a*b + c` may compile to a single FMA on
> arm64 and to separate rounded operations on amd64 — **same code, same seed, different result, different
> winner.** The other nine checks pass a codebase with this in it, because it is invisible at the level they
> look. Suppress it where it matters by forcing an intermediate rounding — `float64(a*b) + c` — which the spec
> guarantees breaks the fusion. Audit any multiply-then-add in damage, morale, or scoring math. If the sim
> arbitrates anything a player can lose money on, this is not a nicety.
> -> The Go-specific determinism traps in full (map iteration, global `rand`, FMA): the ref:skill/golang skill.

-> Determinism in depth, and why the transcript IS the architecture: ./simulation-patterns.md
-> Language-level determinism traps (Go map iteration order, global `rand`): the ref:skill/golang skill.

---

## Anti-patterns

| Anti-pattern | Consequence |
|---|---|
| A flag + an `if` for each variant's slightly-different behaviour | The switchboard. Combinatorially untested, designer-hostile, and it grows forever — the defect this skill exists to prevent |
| A closed enum whose name/capabilities are re-derived by switches in several packages | Every new variant costs N coordinated code edits and one of them will be forgotten |
| New code that serves ONE content item | Tier-2 cost paid for Tier-1 value; the primitive was never extracted so the next item pays again |
| Content rows that restate every field instead of diffing a template | A global tuning change becomes a hundred edits; drift is guaranteed |
| A data layer with no schema and no linter | Soup. Both reference engines answer this with schema-derived-from-the-behaviour-declaration |
| Reaching for ECS/DOD because it is the prestigious answer | You inherit its real costs (hierarchies, relationships, state machines, glue) for a scale that never needed them |
| Applying Data Locality / Object Pool / Spatial Partition without a measured problem | Nystrom gates all three on measurement; unmeasured, it is complexity with no counterpart |
| A scripting VM / bytecode layer for a small behaviour set | The authoring tool, the debugger, and the scope creep cost more than the whole feature |
| Variable timestep or a wall-clock read inside sim logic | Forfeits replay, desync detection, and the ability to arbitrate a disputed result |
| Type Object used for something that needs procedural per-type behaviour | You end up with a data row plus a hidden branch — the worst of both; use a registry seam |

---

## Authorities (a finding cites one of these, not taste)

- **Robert Nystrom, *Game Programming Patterns*** — free and complete at gameprogrammingpatterns.com. The
  spine. Every pattern page carries an explicit "When to Use It" and a "Keep in Mind" section; **the caveats
  are the most valuable part of the book** and are preserved throughout this skill.
- **Richard Fabian, *Data-Oriented Design*** — free at dataorienteddesign.com/dodbook. The relational model of
  game data, SoA, and existential processing. Read as **advocacy**: see the honesty note in
  ./data-oriented-design.md about what the book does and does not concede.
- **Jason Gregory, *Game Engine Architecture*** — the engine-layering and game-object-model taxonomy
  (object-centric / component-based / property-centric), batched and dependency-phased updates. Paywalled; only
  the legitimately published excerpt and the public ToC were verifiable — see ./sources.md for exactly what
  could and could not be sourced.
- **Scott Bilas, "A Data-Driven Game Object System"**, GDC 2002 (Dungeon Siege) — the origin of data-driven
  game objects: property bags, templates with inheritance in data, hot-editing, designers iterating without a
  programmer.
- **Adam Martin, "Entity Systems are the Future of MMOG Development"** (t-machine.org) — the canonical strict
  ECS definition and the "inversion of responsibility" argument.
- **Sander Mertens (flecs)** — the ECS FAQ for the cleanest field definitions, and his own "Why Vanilla ECS Is
  Not Enough" / "Why Storing State Machines in ECS Is a Bad Idea" for the honest costs, first-hand.
- **0 A.D.** (entity template XML + the JS/C++ component system) and **OpenRA** (MiniYAML rules + the trait
  system) — the two open-source RTS engines whose actual content files are quoted throughout as the empirical
  proof that Tier 1 works at roster scale.
- **Bettner & Terrano, "1500 Archers on a 28.8"** and **Glenn Fiedler, gafferongames.com** — deterministic
  lockstep, the command/order stream, and the float-determinism forbidden-list.

-> Every claim's exact URL, plus the explicit **COULD NOT SOURCE** list: **./sources.md**

---

-> This project's simulation, its signed data/registry decisions, and the live audit of where it does and does
   not hold the line: ./project.md.
-> The RENDER-side counterpart canon (draw loop, tween, engine lifecycle, juice): ref:skill/game-development.
-> Language-level rules the code still obeys: ref:skill/golang (determinism traps, hot loops), ref:skill/javascript.
