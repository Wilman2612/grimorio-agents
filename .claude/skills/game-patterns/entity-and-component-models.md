# Entity and component models — from god-object to ECS, and what each costs

How a game represents "a thing in the world." Four positions on one spectrum, each with a real cost. Read this
before choosing or changing an entity representation.

---

## The spectrum

Gregory's taxonomy (from the legitimately published *Game Engine Architecture* excerpt) names the same
progression the other authorities describe:

```
object-centric              component-based             property-centric / ECS
─────────────               ───────────────             ──────────────────────
one class per               entity = a bag of           entity = an ID; data lives in
kind of thing;              components; behaviour       per-component arrays; behaviour
behaviour on the            still often on the          lives in SYSTEMS that iterate
class                       component                   those arrays

"each game object is        composition over            "OOP colocates data with behavior,
represented by a            inheritance                 ECS separates data from behavior"
single instance of                                      — Sander Mertens, ECS FAQ
a single class"
   ── Gregory
```

Moving right buys flexibility and throughput; it costs intuition, ergonomics, and a pile of things that were
free on the left. **You do not have to reach the right end.** Most of the reuse win in this skill comes from
Type Object and data templates, which live comfortably in the middle.

---

## Component — Nystrom's version

Source: https://gameprogrammingpatterns.com/component.html

**The problem — "the Gordian knot."** One class touches physics, rendering, AI, sound, economy. *"A class that
big means even the most seemingly trivial changes can have far-reaching implications. Soon, the class collects
bugs faster than it collects features."*

**When to use it (his own criteria, near-verbatim):**
> - You have a class that touches multiple domains which you want to keep decoupled from each other.
> - A class is getting massive and hard to work with.
> - You want to be able to define a variety of objects that share different capabilities, but using inheritance
>   doesn't let you pick the parts you want to reuse precisely enough.

That third bullet is the composition-over-inheritance core, and it is the one that matters for content reuse:
**new behaviour = compose existing component types onto an entity, not a new subclass and not a new branch.**

**Keep in Mind (verbatim):**
> "The Component pattern adds a good bit of complexity over simply making a class and putting code in it. Each
> conceptual 'object' becomes a cluster of objects that must be instantiated, initialized, and correctly wired
> together. Communication between the different components becomes more challenging, and controlling how they
> occupy memory is more complex."

Plus pointer-chasing indirection in hot loops. **Do not adopt Component because it is the fashionable answer** —
it earns its cost only when the coupling/bloat problem above is real.

**The shape:**
```cpp
class InputComponent    { virtual void update(GameObject&) = 0; };
class PhysicsComponent  { virtual void update(GameObject&, World&) = 0; };
class GraphicsComponent { virtual void update(GameObject&, Graphics&) = 0; };

class GameObject {
  InputComponent*    input_;
  PhysicsComponent*  physics_;
  GraphicsComponent* graphics_;
  void update(World& w, Graphics& g) {
    input_->update(*this);
    physics_->update(*this, w);
    graphics_->update(*this, g);
  }
};
```

**The forks:**
- *Acquisition* — components construct themselves (self-consistent, inflexible) vs are wired in externally
  (enables data-driven reconfiguration — **this is the fork that makes components authorable from data**).
- *Inter-component communication* — shared state in the container (loose, but creates implicit update-order
  dependencies) vs direct references (fast, re-couples) vs message passing through the container (most
  decoupled, most machinery).

---

## ECS proper — where behaviour leaves the entity entirely

### The canonical definition

Adam Martin, *"Entity Systems are the Future of MMOG Development"* (t-machine.org, 2007):
- **Entity** — *"a different concrete in-game object"*; crucially, *"Entities have no data and no methods"* —
  an entity is an identifier.
- **Component** — *"Labels the Entity as possessing this particular aspect"*; a data container, no methods.
- **System** — *"Each System runs continuously… and performs global actions on every Entity that possesses a
  Component of the same aspect."*

He names the shift an **"inversion of responsibility"** and insists these are not two flavours of one idea but
mutually exclusive paradigms. His motivation is live-service iteration: *"its long term success or failure
depends more upon the ability of the dev team to evolve that game into a better game month after month than
upon anything else"* — and his claimed advantages are squarely about that: *"No programmer required for
designers to modify game logic"*, *"Much faster compile/test/debug cycles."* He also names the tradeoff himself:
runtime indirection and dynamic lookups cost performance.

Sander Mertens's ECS FAQ gives the cleanest one-line distinction in the whole literature:
> **"Inheritance is a 1st class citizen in OOP, composition is a 1st class citizen in ECS."**
> **"OOP colocates data with behavior, ECS separates data from behavior."**

### The distinction people get wrong

"Unity components" are **not** ECS. Unity's own Entities docs say so directly: *"instead of writing your own
MonoBehaviours to store instance data and implement custom game logic, you define ECS components to store the
data at runtime"* — MonoBehaviour components carry data **and** methods; `IComponentData` structs carry data
only, and logic lives in systems. Unity keeps MonoBehaviour as an **authoring** layer that converts into the
runtime ECS layer, with an explicit rationale: *"the most convenient data layout to use to author is not the
most efficient data layout at runtime."*

That sentence generalizes well beyond Unity: **the shape that is good to author is rarely the shape that is
good to run.** A build/bake step between them is a legitimate design, not a smell.

### Storage models — the real engineering fork

| Model | Who | How | Trade |
|---|---|---|---|
| **Archetype** | flecs, Unity DOTS, Bevy (default) | Entities grouped by their **exact** component-set into tables; one contiguous array per component per table | Fastest multi-component iteration and vectorization. **Adding/removing a component moves the entity's whole row to another table**; a component type is duplicated across every archetype that has it, so iterating one component across all entities is comparatively poor |
| **Sparse set** | EnTT (default), Bevy (opt-in per component), flecs ≥4.1 (opt-in) | One sparse+dense pair per component pool | Cheap add/remove, no registration required. Multi-component iteration costs more |

EnTT's own docs state the philosophy plainly: *"When it comes to using an entity-component system, the tradeoff
is usually between performance and memory usage… EnTT follows a completely different approach… gives users the
possibility to pay more for higher performance where needed."*

flecs having added sparse storage in v4.1 alongside archetypes is the tell: **serious implementations
hybridize rather than pick a side**, because the right storage depends on the access pattern of each component.

Mertens's own explanation of why archetypes exist: the naive "one global array per component" design loses
contiguity as soon as entities have heterogeneous component sets — *"we cannot guarantee the array is
contiguous… we cannot vectorize our code."* An **archetype graph** caches add/remove transitions so those
operations stay O(1).

### The honest costs — from the flecs author, first-hand

This is the most valuable ECS source there is, because it is a library author enumerating what his own
library had to add **on top of** textbook ECS. From *"Why Vanilla ECS Is Not Enough"*:

- **Hierarchies** — no built-in way to organize entities hierarchically with local-to-world transforms,
  something *"fundamental to game development."*
- **Component sharing** — no way to express "these entities reference the same underlying data" in ECS's own
  language.
- **Multiple instances of one component type on one entity** — breaks down for several independent buffs or
  timers.
- **Runtime-created tags/categories** — entities can't acquire component types discovered at runtime.
- **State machines** — representing state by toggling tag components is error-prone with no guarantee against
  contradictory combinations.
- **Reactive logic** — vanilla ECS defines which entities a system *matches*, not *when* it should run; no
  native mutation-triggered execution.
- **System execution order** — no formal dependency declaration, so ordering is implicit and *"prone to change
  during refactoring."*

And from *"Why Storing State Machines in ECS Is a Bad Idea"*, with numbers: frequent state-tag add/remove
forces a table copy on **every transition**; multiple orthogonal state machines cause a *"combinatorial
explosion of tables"*; and in sparse-set storage his calculated example has 100 states across 10,000 entities
using *"100 times more memory than theoretically necessary"* from per-component page allocation.

From the ECS FAQ, further honest costs:
- *"Applying [ECS ideas] correctly can take practice. Some aspects of ECS design go against intuition,
  especially when coming from an OOP background."*
- *"Spatial data structures like quadtrees do not match well with the typical ECS layout."*
- *"When ECS is not integrated with an engine, the additional glue-code to bridge between the native engine
  types and the ECS can cause an application to have to write more code."*

**Honest gap:** no source found states a scope threshold below which ECS is not worth it. The friction is
described everywhere; the cutoff is nobody's published number. Treat "ECS is overkill here" as a judgement you
must argue, not a rule you can cite.

---

## Prefabs — ECS's answer to data templates

flecs's prefab manual closes the loop between this file and ref:skill/game-patterns/type-object-and-data-templates.md:

> "Prefabs are entities that can be used as templates for other entities."

Instances relate to their prefab by an **`IsA` relationship**. Inheritable components are *shared across
instances* — stored once, with the explicit rationale of *"static data that's shared across instances, such as
material data, textures or meshes"* (i.e. Flyweight). Non-inheritable components are copied per instance. An
instance **overrides** a value by setting the component locally, and **removing the override "reexposes the
original value of the prefab"** — overrides are non-destructive and reversible.

This is Scott Bilas's 2002 Dungeon Siege design — data-driven object templates with instancing and override —
formalized as a first-class ECS relationship twenty years later. Bilas's own framing from that GDC talk:
designers *"very quickly have their ideas prototyped, usually without engineering intervention"* by picking and
combining components from a data spec, and *"types are organized based on required functionality, not
programmer convenience."*

---

## Batched and phased updates — the systems-engineering argument

From the published *Game Engine Architecture* excerpt, arriving at the same place from a throughput angle
rather than a modelling one:

- **Batch by system, not by object:** *"it is usually far more efficient to update a large number of animations
  in one batch than it is to update each object's animation interleaved with other unrelated operations."*
- **Phase the updates:** inter-object dependencies are resolved by explicit ordering/bucketing, modelled as
  *"a forest of dependency trees"* — distinct from, and complementary to, a single flat update loop.

This is why a tick pipeline is an **ordered list of registered systems** rather than one loop calling
`entity.update()`: the ordering is data you can see, reason about, and change.

---

## Choosing — the short version

| If… | Then |
|---|---|
| Variants differ by **numbers and which shared parts they use** | Type Object + data templates. This is most content, most of the time |
| One class has grown to touch several unrelated domains | Component |
| You need bulk throughput over many homogeneous entities, and profiling says so | SoA / archetype storage (see ref:skill/game-patterns/data-oriented-design.md) |
| A variant needs genuinely different **procedure** | A registry seam: a data string → a registered pure function. Not a branch in the universal path |
| You are reaching for strict ECS | Justify it against the first-hand cost list above, in writing |
