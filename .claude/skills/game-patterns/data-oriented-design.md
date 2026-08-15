# Data-oriented design — layout, existential processing, and the honest limits

Source: Richard Fabian, *Data-Oriented Design*, free at https://www.dataorienteddesign.com/dodbook/
(chapter URLs are `nodeN.html`; cited per section below).

> **Read this book as ADVOCACY, not as a balanced survey.** That is not a slight — it is a sourcing fact
> established below, and it changes how you should weigh its claims.

---

## The thesis

DOD is a methodology centred on **how data is actually structured, accessed, and transformed** given real
hardware — not on modelling the problem domain directly in code. Data is *"mere facts that can be interpreted in
whatever way necessary"* to produce the required outputs. Doing it well means knowing your data's type,
frequency, quantity, shape, and probability distribution. (node2)

**The case against one-object-per-entity** (node2):
- **The implicit environment.** An object drags its whole context around — Fabian invokes Joe Armstrong's
  "gorilla holding the banana and the entire jungle" line: wrapping data in a domain-concept object bundles in
  unrelated data merely because *some* operation needs it, even when most call sites don't. (The quip is
  Armstrong's, reused by Fabian — attribute it as Armstrong-via-Fabian.)
- **The grid example.** Developers modelling a grid-based system in OOP make one object *per tile* instead of
  one contiguous grid, then struggle to find neighbours and reason about spatial relationships.
- **Evolution failure.** Because a class embeds assumptions about which data belongs together, a requirements
  shift reworks the hierarchy. He argues this bites game development unusually hard because initial design
  assumptions almost never survive to ship.

---

## The relational model — entities as rows, components as tables

(node3) Treat entities as **rows in tables**, components as **separate tables**, and apply relational
normalisation to game data.

His worked example is a level of rooms/doors/keys/traps. Instead of a `Room` class holding a variable-length
collection of pickups and door references, you get a `Rooms` table (atomic columns only), a `PickupInstances`
table linking rooms→pickups, a `Doors` table (FromRoom, ToRoom), and a `LockedDoors` table (door→required key).

He walks the normal forms explicitly:
- **1NF** — no NULLs, no multi-valued cells. Optional `ColourTint`/`Animation` fields become their own tables,
  so *"there are only rows for things which matter"* — no NULL-padding for pickups that have no tint.
- **2NF** — remove partial dependencies on compound keys.
- **3NF** — remove transitive dependencies.
- **BCNF** — assignment that depends on attributes rather than on the key goes through a lookup table.

*"As we normalise our data [there] is a tendency to split data by dependency"* — which he notes is the same
split engines already make between entities and components, now made systematic.

### Structure-of-Arrays vs Array-of-Structs

The chapter doesn't use the acronyms, but the relational-tables model **is** SoA in substance: parallel columns
rather than one array of monolithic per-entity structs.

**What it buys:**
- Rows with no cross-row dependency are *"trivially parallel processed"* — maps onto SIMD/GPU-style processing.
- Adding a feature adds a **new table** and changes nothing existing — *"old executables keep running on new
  data files and vice versa."*
- Sparse/optional data normalises away NULL-padding waste.
- **Schema as documentation**: *"The schema of a database could be all that is required to understand a
  sufficiently well-designed database."*

**When it is NOT worth it — the tradeoff he names himself:** ordering a table for cache coherency (partitioning
"open doors" before "closed doors" within one array) trades away parallelism. His line: *"Introducing order into
a table makes the whole table inherently less parallelisable to operations."* Cache-friendly **order** and
embarrassingly-parallel **unordered** access pull in opposite directions. You pick per case; you don't get both.

**And his own limit on how far to go:** *"In many cases, it would seem we have added complexity when it wasn't
necessary, and that's up to experimentation and experience to help you decide how far to go."* **No stopping
rule is given.** He defers to judgement — so anyone citing DOD to justify a restructuring owes the argument, not
the citation.

---

## Existential processing — the single most useful idea here

(node4) **An entity's state is expressed by WHICH TABLE IT IS IN, not by a flag you branch on.**

> *"an entity has an implicit boolean hidden in the row existing in the table."*

If an entity has a row in the damaged-entities table, it **is** damaged — no `isHurt` flag. If it's in the
dead-entities table, it's dead, and zero health is implied by presence, not stored and not checked.

**The consequence he draws explicitly — and the reason this matters for the whole skill:**

> Per-entity update loops full of `if` statements are a **smell** indicating the data isn't organised by
> existential state yet.

```
// The smell — one loop over everything, branching per entity
for e in allEntities:
    if e.alive and e.hurt and (now - e.lastDamage) > threshold:
        regenerate(e)

// Existential — the loop only ever RECEIVES entities the condition already selected
for e in damagedEntities:          // membership IS the condition
    regenerate(e)
```

His worked example is exactly health regeneration, with the rules "full-health entities don't regenerate",
"dead entities don't regenerate", "regen fires only after enough time since damage". The existential version
keeps an `entityhealth` table containing **only currently-damaged entities** — *"we only add a new entityhealth
element when an entity takes damage"* — so health data isn't even stored for entities that have never been hurt.

**Why he says it isn't new:** *"this eradication of booleans is nothing new, because every time you have a
pointer to something you introduce a boolean"* — a nullable pointer is already an implicit existence-boolean;
existential processing just makes that deliberate.

**The performance claim, stated in this chapter:** processing one homogeneous table gives better locality and
fewer cache misses than branching across a heterogeneous structure, because CPUs *"can efficiently handle
running processing kernels over homogeneous sets of data"* without conditional branches interrupting
instruction flow.

**A debuggability benefit that matters more than the performance one for most teams:** a state transition
becomes a **move between tables** — a visible, traceable event — instead of a silent flag flip buried inside an
object.

**More of his examples**, all the same shape: a table only for weapons currently reloading; a table only for
entities currently affected by oxygen/drowning; a table for cars at traffic speed vs cars independently
pathfinding — *"If they are traffic, then they will spend most of their time driving at traffic speed not some
speed they need to calculate."* Note the design lesson in that last one: **table membership should mirror the
actual frequency distribution of behaviour in the domain.** Don't pay a per-frame branch for the common case.

**The philosophical reversal, and his own admission:** instead of "what exits does this room have?" you ask
"what rows connect other rooms to this one?" He grants the inversion *"can feel backward initially."*

---

## Branch elimination beyond existential processing

(node9, "Optimisations") Existential/"dirty table" processing **is** his primary branch-elimination mechanism,
restated there: *"existence-based processing (dirty tables) instead of checking flags reduces branch
mispredictions."*

Two further techniques from that chapter:
- **Batched events.** Instead of a callback firing per event (scattered read-write cycles), collect into an
  **event table** and process once: *"Rather than have a callback which fires off when a job is done, have an
  event table for done jobs so callbacks can be called once the whole run is finished."*
- **Predication and SIMD** — evaluate both outcomes and select, avoiding the branch — a lower-level complement
  to the table technique.

And the standing discipline: profile before optimizing; define → measure reproducibly → analyze → experiment →
document; separate **hot** (read-write) from **cold** (read-only) data to conserve memory bandwidth.

---

## The honest limits — including one about the book itself

**A sourcing finding worth stating plainly:** the chapter titled *"What's wrong?"* (node12) sounds like a
self-critique and **is not one.** On the actual text it is a critique of *OOP's* problems — cache misses,
virtual-call overhead, deep hierarchies — not an enumeration of DOD's own costs. The nearest things to
concessions there: he grants OOP *"appeals to us"* because it matches how people naturally think about objects,
and that OOP's grouped-by-concern methods act like an *"instruction manual"* for newcomers — then dismisses
both as insufficient. **Do not cite node12 as a balanced "when not to use DOD."**

**The costs he DOES acknowledge** (node11, "Maintenance and reuse"):
- Optimizing a layout for one project's access patterns **reduces its reusability** elsewhere — a direct
  tension between performance tuning and reuse.
- Some cases need genuine **restructuring beyond normalisation** — the textbook normal forms don't always land
  you where the hardware wants you.
- Schema evolution may require **dedicated conversion tooling** — migrating old data to a new layout is real
  machinery, not free.

He frames all three as minor and outweighed. (Flag this tone when relaying his claims.)

Balancing this, his genuine positives from the same chapter: DOD debugging is easier because state changes
aren't hidden inside objects; keep data in simple forms and prefer idempotent transforms; and testing is simpler
because transforms are explicit data-in/data-out — *"You don't even need a framework, just an input and output
table and then a comparison function."*

**The cost he concedes in node5** ("Component Based Objects"), which is the ergonomic one that actually bites:
*"we no longer think of the player as being the centre of the game"* and code is *"no longer tied to a specific
singular entity."* You give up the intuitive object-centric mental model, and you accept *"occasionally having
to look up facts via less direct methods"* — data that used to be one dereference away (`this.health`) may now
need a lookup or a join.

---

## The unresolved tension with Nystrom — name it, don't smooth it

These two authorities give **directly conflicting advice** on state, and any canon that pretends otherwise is
lying to its reader:

| | Nystrom, *State* pattern | Fabian, existential processing |
|---|---|---|
| Where state lives | On the entity — a state object or enum field | Nowhere on the entity — in which table its row sits |
| How it's read | Branch on it at decision points | Never read; membership already selected the entity |
| Optimizing for | A reader's local comprehension, OOP-idiom fluency, per-object granularity | Cache behaviour and bulk throughput, per-system granularity |
| On maintainability | The pattern **aids** it by taming flag soup | Per-object modelling **costs** it under changing requirements |

Both are right within their frame. The practical reconciliation used by real engines is **neither pure**: keep a
small explicit state enum where a human must reason about legal transitions (it is genuine engine vocabulary),
and use table/collection membership where a hot pass would otherwise branch per entity on a condition that
changes rarely. Nystrom's own *Data Locality* chapter is where he moves toward Fabian's ground — it recommends
contiguous component arrays and hot/cold splitting, and explicitly concedes that to get them *"you will have to
give up inheritance, interfaces, and the benefits those tools can provide."*

The decision rule: **branch on state a human reasons about; partition by state a loop reasons about.**
