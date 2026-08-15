# Simulation patterns — the tick, the order stream, determinism, and the optimizations

The structural patterns of a simulation kernel. Every "Keep in Mind" below is from the source, not from taste —
these are the halves of the patterns that normally get dropped.

---

## Game Loop

Source: https://gameprogrammingpatterns.com/game-loop.html

**Problem.** Run consistently across hardware while advancing without blocking on input: *"games keep moving
even when the user isn't providing input."*

**When to use it.** *"I can say with pretty good confidence that you _will_ use this pattern."*

**Keep in Mind.**
- *"Your game loop will be firmly in that 10%"* of code consuming 90% of run time.
- On some platforms you must integrate with an existing OS/engine loop rather than replace it.
- **Variable timestep destroys determinism**: *"The same bullet will end up in different places on their
  machines."*

**The gameplay-speed fork, which is the one that matters for a server-side sim:** fixed step / no sync (simple,
but *"game speed is directly affected by hardware"*) · fixed step + sync (power-friendly, but the *"game can
play too slowly"*) · variable step (adapts to lag but *"makes gameplay non-deterministic and unstable"*) · fixed
update / variable render (most adaptable, *"more complex"*).

For an authoritative, replayable simulation the answer is **fixed timestep, tick-counted, with no wall clock
anywhere in sim logic**. The variable-render half belongs to the render, not here — see ref:skill/game-development.

---

## Update Method

Source: https://gameprogrammingpatterns.com/update-method.html

**Problem.** Behaviour written as an inline blocking loop locks the game — *"the guard makes his rounds"* while
nothing else runs. As entities multiply the loop becomes *"an increasingly large pile of variables and
imperative code."*

**When to use it.** Multiple objects running simultaneously, behaviour mostly independent per object, simulated
over time. Poor fit for abstract turn games — no need to *"tell pawns to update every frame."*

**Keep in Mind — four real traps:**
1. **Resume state.** Slicing behaviour per frame *"makes it more complex"* — each object must store enough to
   resume, since the call stack is lost between frames.
2. **Ordering is semantics.** *"If A comes before B in the list, when A updates it sees B's previous state.
   When B updates, it sees A's new state."* Usually fine; when it isn't, that's Double Buffer's cue.
3. **Mutation during iteration.** Objects added mid-frame would act before players see them (cache the count at
   frame start). Objects removed before the current index cause **skipped updates** — iterate backward, or
   *"mark the object as dead, but leave it in place… skip any dead objects. Then walk the list again to remove
   the corpses."*
4. **Dormant objects still cost.** They burn CPU and thrash cache in the main collection; a separate active-only
   collection trades memory for CPU once many entities sleep. (This is the same move as existential processing —
   see ref:skill/game-patterns/data-oriented-design.md.)

**The fork worth knowing:** where `update()` lives — on the entity (simplest, brittle as variety grows) vs on a
**component** (his recommended default) vs on a **delegate object**, which he says explicitly is *"use with
State or Type Object patterns."* That is the textual bridge from the tick into the content model.

---

## Command / the order stream — the pattern that buys the most

Source: https://gameprogrammingpatterns.com/command.html, plus the RTS lockstep literature below.

**Problem.** Decouple **what** triggers an action from **how** it's carried out by reifying the call as an
object. Nystrom's three uses: input remapping; **directing actors** — decoupling the producer of a command (AI
or a player) from the consumer (the actor); and undo/redo.

**Why it is the highest-leverage pattern in a simulation**, from the networking literature: in Age of Empires
the architecture was to run *"the exact same simulation on each machine, passing each an identical set of
commands that were issued by the users at the same time."* Commands issued during a turn were *"scheduled for
execution two 'communications turns' in the future"* so every peer — **including the issuing player's own
machine** — executes the same command on the same logical tick.

That extends Nystrom's pattern in an important way: the command object is not merely a replayable unit of
logic, it is **the only channel through which the simulation may be touched at all**. Once that holds, you get
four things from one decision:

```
                        ┌─▶ replay        (persist the stream + seed; re-run it)
   orders ──▶ [ SIM ] ──┼─▶ networking    (ship orders, not state)
   (the only            ├─▶ dispute       (re-derive any contested outcome)
    way in)             └─▶ AI == human   (an agent issues orders through the same door)
```

**Keep in Mind — the cost is DISCIPLINE, not runtime.** Nystrom: *"It takes discipline to make sure every data
modification goes through a command, but once you do that, the rest is easy."* One direct state poke that
bypasses the stream and every guarantee above is void — silently, and usually only discovered when a replay
diverges months later. On undo state he prefers minimal deltas: *"It's cheaper to manually store only the bits
you change."*

**Forks.** Reusable vs one-shot commands · undo by stored delta vs Memento vs a persistent data structure ·
immediate vs deferred execution through a queue · full command classes vs a closure for simple cases.

---

## Determinism — what a replayable simulation forbids

If the simulation is authoritative, replayable, or arbitrates a dispute, determinism is not an optimization —
it is the product.

**The forbidden list** (Bettner & Terrano; Fiedler, gafferongames.com):
- *"the code must not depend on any local factor (such as having free time, special hardware, or different
  settings)"* and *"the code path taken on all machines must match."* No wall-clock reads in sim logic — the
  tick counter is the only clock.
- **Randomness is replicated state**, not a side channel: seed identically and carry the PRNG state forward
  (AoE saved and re-seeded *"with the last random number"*). One PRNG per simulation instance, threaded
  explicitly.
- **No iteration over non-deterministically-ordered collections.** (In Go this is the language's single biggest
  determinism trap — see ref:skill/golang.)
- **Float hazards** (Fiedler): algebraic compiler optimizations and fused multiply-add round differently across
  architectures; transcendentals (`sin`/`cos`/`tan`) differ between AMD and Intel; x87's 80-bit internal
  precision differs from 64-bit. Practitioner workarounds: pin one compiler and instruction set for the build,
  force strict IEEE modes, control FPU precision explicitly. His caveat is honest: *"floating point determinism
  is a complicated subject and there's no silver bullet"* — full cross-platform determinism is near-impossible
  in the general case, which is why single-build-target determinism is the achievable goal.

**Detecting divergence: hash the state, periodically.** AoE checksummed *"the world, the objects, the
Pathfinding, targeting and every other system."* Their war story is the reason this is non-negotiable — errors
compound silently: *"very subtle differences would multiply over time. A deer slightly out of alignment… would
forage slightly differently — and minutes later a villager would path a tiny bit off."*

OpenRA still does exactly this twenty years later: `OrderManager` paces the sim on frame-tagged order packets
with the comment *"We expect every frame to have a queued order packet, even if it contains no orders, as this
controls the pacing of the game simulation"* — even a no-op tick is an explicit synchronization barrier — and
`ReceiveSync()`/`OutOfSync()` compare periodic state hashes. Even **disconnects** are injected into the order
stream as scheduled markers *"so all clients… process the disconnect on the same world tick."* 0 A.D. detects
out-of-sync the same way, *"by hashing the serialisation data."*

**Replay = the order stream + the seed, never state snapshots.** OpenRA's `.orarep` and 0 A.D.'s `commands.txt`
are both exactly this. The payoff is that replay size is proportional to **player actions**, not to entity count
or frame count — the storage corollary of Fiedler's "bandwidth proportional to input, not objects."

The constraint is unavoidable and worth stating out loud: **a replay is valid only if the sim is bit-exact
deterministic given the same stream and seed.** A replay system and multiplayer lockstep have the identical
forbidden-list; you cannot have one without paying for the other.

*(COULD NOT SOURCE: no citable practitioner source was found for replay-vs-patch compatibility policy — i.e.
what happens to old replays after a balance change. It is a real consequence; treat it as an open design
question, not a settled one.)*

---

## Double Buffer

Source: https://gameprogrammingpatterns.com/double-buffer.html

**Problem.** State modified incrementally while something reads it mid-modification. Generalizes past graphics
tearing to any case where sequential per-object updates create order-dependent results but *all actors should
appear to update simultaneously.*

**When to use it — all four must hold:** state is modified incrementally; it may be read mid-modification;
access mid-work must be prevented; reads must not wait on writes.

**Keep in Mind.** *"If it takes longer to swap than it does to modify the state to begin with, then we haven't
helped ourselves at all."* Requires *"two copies of your state in memory at all times."* Under pointer-swap,
buffers hold data up to two frames old, and *"outside code cannot store persistent pointers to the buffer."*

**Forks.** Pointer swap (cheap regardless of size; staler; no external references) vs copying (one frame old;
slower swap, blocks access during it). Monolithic buffer (one cheap swap) vs distributed per-object buffering
(a static shared `current_` index lets `swap()` be called once for all objects).

---

## State (FSM)

Source: https://gameprogrammingpatterns.com/state.html

**Problem.** Flag soup — *"Complex branching and mutable state… are two of those error-prone kinds of code"* —
where only certain combinations of `isJumping_`/`isDucking_` are valid and every new feature adds more.

**When to use it.** Behaviour changes with internal state; the states are *"a relatively small number of
distinct options"*; the entity processes a series of inputs over time.

**Keep in Mind / when NOT.** FSMs are *"not even _Turing complete_"*, and adding an orthogonal axis (weapons on
top of movement) explodes combinatorially unless split into **concurrent** machines. A plain FSM has no memory
of history — that's what **pushdown** automata recover. And explicitly: complex AI wants **behaviour trees or
planning**, not an FSM — *"FSMs excel at specific, bounded problems but collapse under sophisticated behavioral
requirements."*

**Forks.** Hierarchical states (substates delegate unhandled input to a superstate) · pushdown automata (push a
firing state over jumping, pop back) · concurrent machines (split orthogonal concerns rather than multiply
states).

> **Read this against ref:skill/game-patterns/data-oriented-design.md.** Fabian's existential processing directly contradicts the
> State pattern's premise. The reconciliation rule: **branch on state a human reasons about; partition by state
> a loop reasons about.**

---

## Event Queue

Source: https://gameprogrammingpatterns.com/event-queue.html

**Problem.** *"Decouple when a message or event is sent from when it is processed."* Observer decouples *who*;
Event Queue decouples *in time*.

**When to use it.** *"You only need a queue when you want to decouple something in time."* And explicitly not
otherwise: *"If you only want to decouple who receives a message from its sender, patterns like Observer and
Command will take care of this with less complexity."* Also a poor fit *"when the sender needs a response"* —
the sender can only *"throw a request on the queue and hope for the best."*

**Keep in Mind — three sharp ones:**
- **Still a global.** A central queue *"is still a global, with all of the danger that entails."*
- **Events must be data-heavy, because the world moves on.** Between enqueue and drain, a referenced entity may
  no longer exist — so *"queued events tend to be more data heavy than events in synchronous systems"* (a sound
  event carries volume and id, never a live entity pointer).
- **Feedback loops go from loud to silent.** Synchronously, *"cycles overflow the stack and crash your game"* —
  a fail-fast bug. Queued, it *"unwind[s] the stack, so the game may keep running even though spurious events
  are sloshing back and forth."* A crash you can debug becomes a storm you can't see.

**Forks.** Events (already happened, broadcast) vs messages/requests (to do, usually single listener) ·
single-cast / broadcast / work queue · one writer vs many (cycles, and the event must carry its sender) ·
ownership transfer on enqueue vs shared vs queue-owned pooled objects.

---

## Dirty Flag

Source: https://gameprogrammingpatterns.com/dirty-flag.html

**Problem.** *"Avoid unnecessary work by deferring it until the result is needed"* — redundant recomputation of
derived data.

**When to use it — two explicit gates.** *"The primary data has to change more often than the derived data is
used"*, and *"It should be hard to update incrementally"* — if a running total keeps the value correct cheaply,
do that instead.

**Keep in Mind.** Deferred work can concentrate into a visible stall: *"if the game doesn't _start_ chewing
until right when the player expects to see the result, that can cause an unpleasant visible pause."* The real
cost is stale-state bugs: *"Miss it in one place, and your program will incorrectly use stale derived data. This
leads to confused players and bugs that are very hard to track down."* Every mutation site must set the flag.
And it trades CPU for memory.

**Forks.** Clean on demand / at checkpoints / in the background · fine-grained flags (less reprocessing, more
bookkeeping) vs coarse (cheaper bookkeeping, reprocesses unchanged data).

---

## Object Pool

Source: https://gameprogrammingpatterns.com/object-pool.html

**When to use it (near-verbatim):** *"You need to frequently create and destroy objects. Objects are similar in
size. Allocating objects on the heap is slow or could lead to memory fragmentation. Each object encapsulates a
resource… that is expensive to acquire and could be reused."*

**When it is WASTED:**
- **Tuning burden both ways** — *"The size of an object pool needs to be tuned… also take care that the pool
  isn't too big"*; an oversized pool is the waste problem in a different shape.
- **A hard ceiling** — *"Only a fixed number of objects can be active at any one time"*, which is a gameplay
  constraint, not just a technical one.
- **Size variability kills it** — *"each slot in the pool has enough memory for the largest possible object."*
  Heterogeneous sizes mean padding every slot to the worst case.
- And the standing rule: no measured allocation bottleneck, no pool.

**Shape.** The free list lives in the objects' own memory via a union — `state_.next` where the live object
would keep its data — so `create()` is O(1) with no separate freelist allocation.

---

## Spatial Partition

Source: https://gameprogrammingpatterns.com/spatial-partition.html

**When to use it.** *"you have a set of objects that each have some kind of position and that you are doing
enough queries to find objects by location that your performance is suffering."* **The gate is query volume, not
the existence of positions.**

**When it costs more than brute force:**
- *"if your _n_ is small enough, it may not be worth the bother"* — the constant factor exceeds the saving.
- **Movement is the cost driver:** *"Objects that _change_ position are harder to deal with. You'll have to
  reorganize the data structure… and that adds code complexity _and_ spends CPU cycles."* A partition over a
  mostly-static world is cheap; one full of constantly-moving units pays a continuous reorganization tax.
- Memory: *"it trades memory for speed"* — never strictly free.

**Forks.** Flat grid (simple, constant footprint, cheap per-move, wasteful on empty space) vs hierarchical
(quadtree — adapts to density, more complex updates) · fixed vs adaptive (BSP/k-d give consistent queries but
generally want the full dataset up front, making incremental moves expensive) · partition only vs partition plus
a flat collection (faster full traversal, two structures to keep in sync).

---

## Bytecode — read this before anyone proposes a scripting layer

Source: https://gameprogrammingpatterns.com/bytecode.html

**When to use it.** The implementation language is too low-level for the authoring task; compile/iteration times
kill velocity; you must *"ensure the behavior being defined can't break the game."* Explicit caveat: *"Bytecode
is slower than native code, so it isn't a good fit for performance-critical parts of your engine."*

**Why it is almost always overkill — his own words, and they should end most proposals:**
- *"This is the most complex pattern in this book, and it's not something to throw into your game lightly."*
- **Scope creep is near-certain**: *"Every time I see someone define a little language or a scripting system,
  they say, 'Don't worry, it will be tiny.' Then, inevitably, they add more and more little features until it's
  a full-fledged language"* — ending with *"all of the architectural elegance of a shanty town."*
- **You must build an authoring front-end**: *"If you don't have the resources to build an authoring tool, then
  bytecode isn't for you."* Grammar design is a hard UI problem; syntax-error handling is *"hard — and most
  important"*, at risk of making non-technical users feel like they're *"filling in tax forms for an angry
  robotic auditor."*
- **You lose conventional debugging**: stepping the VM *"tells you what the VM _itself_ is doing, and not what
  the bytecode it's interpreting is up to."*

**If you do build one:** *"Stick with a stack-based VM. They're simpler to implement and much simpler to
generate code for."* For values: *"If you can stick with a single data type, do that. Otherwise, do a tagged
union. That's what almost every language interpreter in the world does."*

**The cheaper alternative to check first:** a **registry seam** — a data string keyed to a registered pure
function — gives you data-selected behaviour with none of the VM, tooling, or debugging cost. Reach for bytecode
only when the behaviours themselves must be *authored* by someone who cannot ship code.

---

## Subclass Sandbox, Service Locator, Singleton — the three to be suspicious of

**Subclass Sandbox** (https://gameprogrammingpatterns.com/subclass-sandbox.html). A base class provides the
operations its many subclasses need, so subclasses stay decoupled from the engine. **How it degrades, in his
words:** *"Inheritance is a bad word in many programming circles these days, and one reason is that base classes
tend to accrete more and more code. This pattern is particularly susceptible to that."* Root cause: *"Since
subclasses go through their base class to reach the rest of the game, the base class ends up coupled to every
system _any_ derived class needs"* — *"it's very hard to change the base class without breaking something."* His
own mitigation: *"Consider pulling some of the provided operations out into separate classes… The Component
pattern can help here."* Criterion if you use it anyway: **don't provide an operation only one or two subclasses
need** — the coupling cost lands on everyone.

**Service Locator** (https://gameprogrammingpatterns.com/service-locator.html). *"my simplest advice for when to
use a service locator is: sparingly."* It *"defers wiring it up until runtime. This gives you flexibility, but
the price you pay is that it's harder to understand what your dependencies are by reading the code."* Two risks
a plain singleton doesn't have: the service **can fail to be located**, and **the service doesn't know who is
locating it**, so it must be written to work for any caller. Net: it keeps essentially every downside of a
global and adds lookup failure on top.

**Singleton** (https://gameprogrammingpatterns.com/singleton.html) — his chapter is an argument against it.
*"a singleton _is_ global state — it's just encapsulated in a class."* It hides dependencies from signatures;
*"we've created a chunk of memory that every thread can see and poke at"*; it **conflates two independent
decisions** — *"Ensuring a single instance is useful, but who says we want to let _everyone_ poke at it?"*; and
it costs you initialization-order control, which games specifically need. His alternatives: pass it in; provide
it via a base class; centralize into one deliberate root object; a plain static class for genuinely immutable
stateless functionality. Closing verdict: **"Honestly, I've never used the full Gang of Four implementation in a
game."**
