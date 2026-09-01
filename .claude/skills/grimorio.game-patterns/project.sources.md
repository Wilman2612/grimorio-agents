# Sources — every authority, with its URL, and an honest list of what could NOT be sourced

This canon was **read, not recalled.** Every claim in this skill traces to a source below. The gaps at the
bottom are stated as gaps rather than filled from memory — a confidently-wrong canon in a weak domain is worse
than an admitted hole.

---

## Primary — read in full, directly fetched

### Robert Nystrom, *Game Programming Patterns* — https://gameprogrammingpatterns.com/
Free and complete online. All nineteen pattern pages below were fetched directly; none were unreachable.

| Pattern | URL |
|---|---|
| Game Loop | /game-loop.html |
| Update Method | /update-method.html |
| Double Buffer | /double-buffer.html |
| Bytecode | /bytecode.html |
| Subclass Sandbox | /subclass-sandbox.html |
| Type Object | /type-object.html |
| State | /state.html |
| Component | /component.html |
| Event Queue | /event-queue.html |
| Service Locator | /service-locator.html |
| Data Locality | /data-locality.html |
| Dirty Flag | /dirty-flag.html |
| Object Pool | /object-pool.html |
| Spatial Partition | /spatial-partition.html |
| Command | /command.html |
| Flyweight | /flyweight.html |
| Observer | /observer.html |
| Prototype | /prototype.html |
| Singleton | /singleton.html |

*Note on Command:* that chapter has no headers literally titled "When to Use It" or "Keep in Mind" (verified by
a second targeted fetch). Its guidance in this skill is drawn from the chapter's prose, not from those sections.

### Richard Fabian, *Data-Oriented Design* — https://www.dataorienteddesign.com/dodbook/
Free online. Chapters fetched: node2 (Data-Oriented Design), node3 (Relational Databases), node4 (Existential
Processing), node5 (Component Based Objects), node9 (Optimisations), node11 (Maintenance and reuse), node12
(What's wrong?).

### 0 A.D. — github.com/0ad/0ad (branch `master`, no commit pinned at fetch time — cite:ext/0ad needs `@rev` before it
can be written, so these stay named, not fenced-as-a-live-reference, until a commit is recorded)
Files fetched verbatim (paths relative to the 0 A.D. repo root, branch `master`):
```
binaries/data/mods/public/simulation/templates/template_unit.xml
…/template_unit_infantry.xml
…/template_unit_infantry_melee.xml
…/template_unit_infantry_melee_spearman.xml
…/units/athen/infantry_spearman_b.xml
…/infantry_spearman_a.xml
…/templates/mixins/hoplite.xml
…/templates/mixins/civ/athen.xml
source/simulation2/docs/SimulationDocs.h
```
The last one is the project's own component-authoring doc (schema, `op="add"`, the C++/JS component split).

### OpenRA — github.com/OpenRA/OpenRA (branch `bleed`, no commit pinned at fetch time — same `@rev` gap as 0 A.D.
above)
Files fetched verbatim (paths relative to the OpenRA repo root, branch `bleed`):
```
mods/ra/rules/infantry.yaml
mods/ra/rules/defaults.yaml
mods/ra/weapons/ballistics.yaml
OpenRA.Mods.Common/Traits/AutoTarget.cs
OpenRA.Game/Network/OrderManager.cs
```
In order: the `DOG` and `E1` actors; `^Vehicle`/`^Soldier`; `^Cannon`/`25mm`/`90mm`; the `TraitInfo` shape; order
pacing, sync hashing, disconnect-as-order. Also read: the Modding Guide wiki page (the YAML-vs-C# boundary quote).

### ECS literature
- Adam Martin, *"Entity Systems are the Future of MMOG Development"* — t-machine.org, Parts 1 and 2 fetched
  directly.
- Sander Mertens, **ECS FAQ** — github.com/SanderMertens/ecs-faq (mirrored at flecs.dev/ecs-faq).
- Sander Mertens, *"Building an ECS #2: Archetypes and Vectorization"* — ajmmertens.medium.com.
- Sander Mertens, *"Why Vanilla ECS Is Not Enough"* and *"Why Storing State Machines in ECS Is a Bad Idea"* —
  ajmmertens.medium.com. **The best honest-costs source in the field, first-hand from a library author.**
- flecs **Prefabs manual** — https://github.com/SanderMertens/flecs/blob/master/docs/PrefabsManual.md.
- **EnTT** crash course — skypjack.github.io/entt (sparse-set model, the "pay for what you use" philosophy).
- **Unity Entities** manual — https://docs.unity3d.com/Packages/com.unity.entities (the MonoBehaviour-as-authoring-layer
  rationale).

### Deterministic simulation
- Bettner & Terrano, *"1500 Archers on a 28.8"* — gamedeveloper.com reprint (the Yale-hosted PDF repeatedly
  failed with `ECONNRESET`; the same content was verified through two other legitimate re-hosts).
- Glenn Fiedler, *"Deterministic Lockstep"* and *"Floating Point Determinism"* — gafferongames.com.

### Data-driven game objects
- Scott Bilas, *"A Data-Driven Game Object System"*, GDC 2002 (Gas Powered Games / Dungeon Siege) — deck fetched
  from https://gamedevs.org/uploads/data-driven-game-object-system.pdf. Property bags, templates with inheritance in
  data, hot-editing, one code path supporting hundreds of variations.

---

## Partially sourced — use with the stated caveat

- **Jason Gregory, *Game Engine Architecture*** — **the book is paywalled and was not pirated.** What IS
  verified: the public table of contents on the author's own gameenginebook.com confirms §1.6 "Runtime Engine
  Architecture" exists and is where the layering diagram lives; and a **legitimately published excerpt** on
  gamedeveloper.com (the game-object-update chapter) supplies the object-centric / component-based /
  property-centric taxonomy, the batched-update argument, and dependency-phased updates. Those are quotable and
  are what this skill uses.
- **Scott Bilas's roster figures** — the primary PDF at this.scottbilas.com is image-based and did not extract.
  A readable AnyFlip mirror gives "4000 total object types, 70,000 objects" for the single-player world. Treat
  as moderate confidence (a mirror, not the primary), and disregard the "7,300 / 73,000" figures that appear in
  search snippets — those look like OCR garbling of the same numbers.
- **OpenRA trait-system description** (`"Traits consist of an info class and a class that does stuff…"`) —
  `docs.openra.net/en/release/traits/` returned 404/timeout on both attempts; that specific quote came via a
  search index of the GitHub wiki, not a page directly fetched. **The underlying mechanism is independently
  verified** by the real `AutoTarget.cs` source, so the claim stands on the code even though the quote is
  second-hand.
- **0 A.D. determinism/OOS details** — the primary wiki (trac/gitea.wildfiregames.com) is behind Anubis
  bot-protection and blocked **both** WebFetch and a live Playwright session. The OOS/hash/`commands.txt`
  details came from search-surfaced excerpts of that same wiki. Directionally reliable; not quote-verified the
  way the OpenRA source is.
- **Bevy ECS storage** (Table vs SparseSet, archetype definition) — assembled from the community cheat-book and
  search synthesis, **not** fetched from Bevy's own docs.rs or official book. Verify directly before relying on
  it.
- **Unity's 64 KB archetype chunk size** — search-synthesized, not confirmed against a primary Unity
  architecture doc. Do not make that number load-bearing.
- **Mike Acton, *"Data-Oriented Design and C++"* (CppCon 2014)** — only a secondary isocpp.org summary was read.
  No verbatim quotes were obtained from the slides or a transcript. His thesis is paraphrased, not quoted.

---

## COULD NOT SOURCE — stated as gaps, not filled

1. **Gregory's §1.6 layering diagram, box by box.** Its existence and topic are confirmed; its literal content
   is behind the paywall. No paraphrase of it appears in this skill as if it were a quote.
2. **A "when ECS is overkill" threshold.** No source states a project-scope cutoff. The friction is
   well-documented everywhere; the line is nobody's published number. Treat "ECS is overkill here" as an
   argument you must make, never a citation you can drop.
3. **Replay-vs-patch compatibility policy.** What happens to old replays after a balance change is a real,
   well-known consequence, but no citable practitioner source was found addressing it explicitly.
4. **A Riot / Firaxis / Blizzard talk on balance data in data files + hot reload.** Searched for specifically
   and not found. The GDC Vault talks that surface under "data-driven" (Riot's *"From Data Driven to Data
   Informed"*, *"Slay the Spire: Metrics Driven Design"*) are about **analytics-informed design** — a different
   meaning of the same phrase — and are paywalled besides. **Do not conflate the two senses.** Bilas's GDC 2002
   talk is the verified source for the data-files-not-code sense.
5. **t-machine.org Parts 3–4**, where Martin reportedly addresses the performance tradeoff in more depth — not
   fetched.
6. **OpenRA's full Projectile/Warhead type catalogue** — only the four appearing in `ballistics.yaml` (`Bullet`,
   `SpreadDamage`, `LeaveSmudge`, `CreateEffect`) were quoted from source.
7. **OpenRA's `mod.yaml` assembly-loading key** for custom trait DLLs — inferred from the Modding Guide's prose,
   not directly sourced.

---

## A note on the one place the authorities genuinely disagree

Nystrom's *State* pattern and Fabian's *existential processing* give opposite advice about where entity state
lives. This is not a sourcing ambiguity — both texts are clear, and they conflict. It is addressed head-on in
ref:skill/grimorio.game-patterns/project.data-oriented-design.md rather than smoothed over. Fabian's own *"What's wrong?"* chapter, despite its title,
does **not** contain a self-critique of DOD — that finding is stated in the same file so nobody cites it as one.
