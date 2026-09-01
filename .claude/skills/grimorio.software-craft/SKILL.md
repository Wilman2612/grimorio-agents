---
name: grimorio.software-craft
description: "Language-agnostic software craft: SOLID/KISS/DRY/YAGNI and the classic design-pattern vocabulary, the data-structure and sorting/searching complexity vocabulary, and Kleppmann-grounded data-intensive-systems decision-point axes (DB family choice, cache placement/invalidation, write/insertion strategy). The GENERAL layer every developer agent loads; grimorio.javascript/grimorio.python/golang hold the language-specific personalization on top of what this file states. Load before writing, reviewing, or refactoring any code, in any language."
---

# Skill: grimorio.software-craft

The general-level software-engineering knowledge that is true **regardless of language** — best practices,
pattern vocabulary, data-structure/complexity vocabulary, and data-systems decision points. Every language skill
(ref:skill/grimorio.javascript, ref:skill/grimorio.python, ref:skill/grimorio.golang) assumes a developer already has this layer and adds
only what is specific to its own language on top of it. If a rule here and a rule in a language skill ever seem
to overlap, this file states the timeless principle; the language skill states the syntax that principle takes
in that language.

---

## Best Practices — timeless, language-agnostic

### SOLID

The five class/module-design principles (Robert C. Martin, popularized across *Agile Software Development:
Principles, Patterns, and Practices*, 2002, and *Clean Code*, 2008):

| Principle | States |
|---|---|
| **S** — Single Responsibility | A module has exactly one reason to change. |
| **O** — Open/Closed | Open for extension, closed for modification — add behavior via a new implementation at a seam, never by editing a switch/if-chain scattered across the code. |
| **L** — Liskov Substitution | A subtype must be usable anywhere its supertype is expected, without surprising the caller. |
| **I** — Interface Segregation | Many small, focused interfaces beat one fat interface consumers only partially need. |
| **D** — Dependency Inversion | Depend on abstractions, not concretions — the high-level policy does not depend on the low-level detail; both depend on an interface. |

### KISS / DRY / YAGNI

Three complementary pressure-release valves against premature complexity:

- **KISS** (Keep It Simple, Stupid) — the simplest design that satisfies the requirement beats a cleverer one; cleverness is a cost paid by every future reader.
- **DRY** (Don't Repeat Yourself) — every piece of knowledge has one authoritative representation; duplication is a defect because the copies drift.
- **YAGNI** (You Aren't Gonna Need It) — build the abstraction the current requirement needs, not the one a hypothetical future requirement might. Extract a pattern when a second real use case appears, not before.

These three exist in tension with each other and with SOLID's Open/Closed principle — the resolution is judgment, not a formula: DRY says extract; YAGNI says wait for the second case; KISS says don't build the generic version speculatively. **NEVER extract a reusable abstraction preemptively.** **WHEN only one real use case exists ⟶ wait for a genuine second one before generalizing.** A design that pre-builds for an imagined future case violates YAGNI even when it looks like good OCP.

### The classic pattern vocabulary (Gang of Four)

**Named here, not exhaustively taught.** **WHEN a pattern's own trigger condition below is genuinely present in the code ⟶ reach for that named pattern.** **NEVER apply one preemptively, "because it might be needed."** Full treatment: Gamma, Helm, Johnson, Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software* (Addison-Wesley, 1994) — the GoF catalogue every pattern name below traces back to.

| Category | Pattern | Trigger |
|---|---|---|
| Creational | **Factory Method / Abstract Factory** | Object creation logic needs to vary by subtype without the caller knowing which concrete type it gets. |
| Creational | **Builder** | Construction needs many optional parameters or must happen in validated stages. |
| Structural | **Adapter** | An existing interface doesn't match what the caller needs — wrap it, don't rewrite it. |
| Structural | **Decorator** | Behavior needs to be added to an individual object, at runtime, without touching its class or every sibling instance. |
| Structural | **Facade** | A subsystem's real interface is too wide for its typical caller — offer a narrow, purpose-built front. |
| Behavioral | **Strategy** | Two or more interchangeable algorithms/behaviors exist for the same job — extract each into its own class, select at the seam, never a long if-else/switch chain. |
| Behavioral | **Observer** | One state change must notify an open-ended set of interested parties without the source knowing who they are. |
| Behavioral | **Template Method** | A multi-step process has a fixed skeleton with a few steps that vary by subtype. |
| Behavioral | **Command** | An action needs to be queued, logged, undone, or passed around as a first-class value rather than invoked directly. |
| Behavioral | **State** | An object's behavior changes based on an internal state machine — model each state as its own class rather than a field plus branching. |

**Caution, named because it is the most-misused entry in the catalogue**: **Singleton** guarantees one instance and a global access point — it is frequently reached for as "the pattern for shared config/service" and just as frequently creates hidden global state that breaks testability and hides a dependency a constructor should have declared instead. **NEVER reach for Singleton as the default answer to "this needs to be shared."** **WHEN a dependency needs to be swapped or faked in a test ⟶ use dependency injection (below) instead.**

### Guard clauses / fail-fast

**ALWAYS validate preconditions at the top of a routine and return/raise immediately on failure, rather than
nesting the success path inside a deep conditional.** The routine's main logic then reads left-aligned, at one
level of indentation, because every invalid case has already exited. This is not a language-specific style
choice — it is the same discipline ref:skill/grimorio.javascript states as "guard clauses at function start for fail-fast
on invalid inputs" and ref:skill/grimorio.golang states as "happy path left-aligned (Go proverb): guard clauses + early
returns" — two languages independently converging on the identical shape because it is a property of the
technique, not of either language's syntax.

**ALWAYS check the cheapest precondition first.** **BEFORE touching I/O, a network call, or anything expensive
⟶ validate every argument/precondition that can be checked in memory alone** — an invalid input should never
survive long enough to pay for work that was always going to be discarded.

### Dependency Injection (the concept, not the container)

A module declares what it needs — through its constructor, or a function's parameters — rather than reaching
out and constructing or locating its own dependencies. The caller (or a composition root) supplies a concrete
implementation at the point of use. This is Dependency Inversion (SOLID's "D") made concrete as a wiring
technique, named and popularized in this form by Martin Fowler, "Inversion of Control Containers and the
Dependency Injection pattern" (2004, martinfowler.com).

What DI actually buys: a module can be tested with a fake/stub implementation instead of the real one, and a
dependency can be swapped (a different provider, a different persistence engine) without touching the module's
own logic. What DI is not: a specific framework or annotation syntax — constructor injection with no framework
at all is DI; a service-locator that a module calls internally to *fetch* its own dependency is NOT DI, because
the dependency is still hidden rather than declared. Every language skill in this corpus states DI's syntax in
that language (TypeScript constructor injection, Python's `typing.Protocol` seams, Go's small consumer-defined
interfaces) — the concept above is what all three are instances of.

---

## Data Structures & Complexity — the vocabulary a structure/algorithm choice draws on

The point of this section is vocabulary and trigger conditions, not a textbook treatment. Full grounding:
Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* (MIT Press — "CLRS"), the standard reference this
entire section traces back to.

### Core structures

| Structure | What it's for | Complexity signature |
|---|---|---|
| **Array / List** | Ordered, indexable sequence | O(1) index access; O(n) unsorted search; O(n) insert/delete at an arbitrary position |
| **Hash Map / Hash Set** | Key-based lookup, membership test | O(1) average lookup/insert/delete; no ordering guarantee; degrades toward O(n) under a poor hash/heavy collisions |
| **Balanced tree family** (BST → self-balancing: AVL, red-black, B-tree) | Ordered data with fast lookup, insert, delete, AND range queries | O(log n) for lookup/insert/delete; an *unbalanced* BST degrades to O(n) on adversarial/sorted insertion order — this is exactly why the self-balancing variants exist |
| **Graph** (adjacency list or matrix) | Relationships between entities — not just a hierarchy | Traversal (BFS/DFS) is O(V + E) with an adjacency list; reach for a graph the moment the real question is "what connects to what," not "what contains what" |
| **Heap / Priority Queue** | Repeated access to the current min/max element | O(log n) insert and extract-min/max; O(1) peek — the structure behind scheduling, top-k, and Dijkstra's algorithm |

### Sorting

| Class | Examples | Complexity |
|---|---|---|
| **Comparison sorts** | Merge sort, quicksort, heapsort | O(n log n) — and O(n log n) is a *proven lower bound* for any sort that only compares elements pairwise; nothing in this class beats it |
| **Non-comparison sorts** | Counting sort, radix sort | O(n) — achievable only because they exploit structure in the KEYS themselves (a small/known integer range) rather than comparing arbitrary elements; not applicable to an arbitrary comparable type |

### Searching

**Binary search** — O(log n) — carries one non-negotiable **precondition**: the input must already be sorted
(or otherwise monotonic on the predicate being searched). **NEVER binary-search data that is not already sorted
or monotonic on the searched predicate — it does not degrade gracefully, it returns a wrong answer silently.**
This precondition is the trap: a codebase's "it's slow, use binary search" instinct fails the moment the data
isn't already ordered, and sorting it first to enable one lookup can cost more than the linear scan it was meant
to avoid.

---

## Data-Intensive Systems — decision-point axes, never a prescription

This section names **where a real decision exists** in a data-intensive design and what question each option
answers well. **NEVER read any table in this section as a recommendation — it names a decision point and its
options, never which option to pick; the pick is a project decision, made against the project's own actual
access pattern, not derivable from this general file.** The standard reference for this entire domain, and the
one to actually open once a decision point below is recognized: Martin Kleppmann, *Designing Data-Intensive
Applications* (O'Reilly, 2017) — storage engines, replication, and derived data are its chapters most relevant
to the three axes below.

### Axis 1 — database family choice

| Family | Answers well | When this matters |
|---|---|---|
| **Relational** | Data with many-to-many relationships that must stay consistent across a transaction | Multi-entity writes that must succeed or fail together; ad-hoc joins across entities are a normal query shape |
| **Document** | An aggregate that is usually read and written as one unit | The access pattern is "fetch this whole record," and the record's own internal shape varies between instances |
| **Key-value** | Pure lookup by a known key, at very high throughput | The query is always "get me the value for this key" — never a range or a join |
| **Graph** | Relationship-traversal-heavy queries | The question is "what connects to what, how many hops away" (recommendation, fraud-ring detection, social-graph traversal) rather than "give me records matching a filter" |
| **Time-series** | High-ingest, append-mostly data queried by time window | Writes are overwhelmingly new events with a timestamp; reads are aggregates over a recent or bucketed window |

### Axis 2 — cache placement and invalidation

**Placement — when a write happens, where does the cache get updated relative to the durable store:**

- **Write-through** — the cache is updated synchronously with the write to the store; higher write latency, but the cache is never stale.
- **Write-back** — the write lands in the cache first and is flushed to the store later; lower write latency, but a crash before flush can lose data, and the cache is briefly the only copy of truth.
- **Write-around** — the write goes straight to the store, bypassing the cache; the cache only fills on a subsequent read — good when written data is rarely re-read soon after.

**Invalidation — how a cached value stops being trusted once the underlying data changes:**

- **Invalidation-on-write** — the write path explicitly evicts or updates the affected cache entry; correct immediately, but every writer must know what to invalidate.
- **TTL (time-to-live)** — an entry simply expires after a fixed window; no writer coordination needed, but the system tolerates some window of staleness by design.

The trade this axis matters for: how much staleness the domain can tolerate versus how much write-path
complexity the team is willing to own.

### Axis 3 — write/insertion strategy

**In-place update (B-tree-style engines)** — a write locates the existing record's position and overwrites it
there. Reads are fast because the data is always in its final, ordered location; writes cost a disk seek to the
right page (and page-split overhead when a page fills).

**Log-structured / append-only (LSM-tree-style engines)** — a write is appended sequentially, never seeking to
overwrite; multiple sorted runs accumulate and are periodically merged (compaction). Writes are cheap (pure
sequential append); reads pay for it by potentially having to check several accumulated runs before compaction
catches up, and compaction itself is a background cost.

**Why this is a real trade, not a strictly-better option**: an LSM-tree-style engine trades write cost for read
cost in the *opposite direction* from a B-tree — it is the right axis to recognize the moment a design leans
write-heavy (event ingestion, logging, time-series) versus read-heavy with point lookups (an index serving
interactive queries). Neither engine family is "faster" in general; each wins on the workload shape that matches
its own trade.

---

## Who uses this, and how

**Every developer agent** — JavaScript/TypeScript, Python, Go, UI, and game developers alike — loads this skill
for the GENERAL layer described above: it is true regardless of which language or codebase the developer is
working in.

**Each language skill personalizes on top of this file, never restates it.** ref:skill/grimorio.javascript,
ref:skill/grimorio.python, and ref:skill/grimorio.golang each hold what is specific to their own language — naming conventions,
async idioms, type-system rules, language-specific testing conventions — layered on top of the SOLID/pattern/
data-structure/data-systems vocabulary this file already establishes. Where a language skill's own content
would otherwise re-derive one of the principles above from scratch, it points here instead of repeating it.
