# Type Object and data templates — the reuse spine

The patterns that make "a game is DATA, not code" mechanical. Read this before designing any content model:
units, weapons, abilities, structures, terrain effects, status effects, buildables.

---

## Type Object — a "type" becomes a data row, not a class

Source: Nystrom, *Game Programming Patterns* — https://gameprogrammingpatterns.com/type-object.html

### The problem, in his words

Designers want hundreds of variants. Subclassing cannot keep up, and the loop is miserable: a designer asks for
troll health 48 → 52, a programmer edits source, the game recompiles, the change gets checked in, the designer
finally sees it. Nystrom: *"We spend the day frustrated because we've turned into data monkeys. Our designers
are frustrated because it takes them forever to get a simple number tuned."*

### The shape — two classes, and **no inheritance between them**

```cpp
// Rejected: a class per variant
class Monster { };
class Dragon : public Monster { };
class Troll  : public Monster { };

// Type Object: the "type" is an OBJECT the instance points at
class Breed {
  int health_;  const char* attack_;
public:
  Breed(int health, const char* attack) : health_(health), attack_(attack) {}
  int getHealth() { return health_; }
  const char* getAttack() { return attack_; }
};

class Monster {
  int health_;      // per-instance (extrinsic)
  Breed& breed_;    // shared per-type (intrinsic)
public:
  Monster(Breed& breed) : health_(breed.getHealth()), breed_(breed) {}
  const char* getAttack() { return breed_.getAttack(); }
};
```

Nystrom: *"Two classes. Notice that there's no inheritance at all."* It is precisely the is-a → has-a swap:
`Dragon IS-A Monster` becomes `Monster HAS-A Breed`.

### Types defined in a data file — his own example

```json
{
  "Troll":        { "health": 25, "attack": "The troll hits you!" },
  "Troll Archer": { "parent": "Troll", "health": 0,
                    "attack": "The troll archer fires an arrow!" },
  "Troll Wizard": { "parent": "Troll", "health": 0,
                    "attack": "The troll wizard casts a spell on you!" }
}
```

*"Now our designer can tune the health in `Troll` and all three breeds will be updated."* This is the direct
textual proof of "new variant = new data row, not new code."

### When to use it — his two explicit triggers

1. *"You don't know what types you will need up front"* — e.g. content that may be added later or by someone
   else.
2. *"You want to be able to modify or add new types without having to recompile or change code."*

### Keep in Mind — the full cost side

- **You take over the compiler's bookkeeping by hand.** *"We have to make sure all of the breed objects are
  instantiated and kept in memory as long as our monsters need them."* Nothing enforces this for you.
- **Subclassing already IS this pattern, done for you.** Nystrom's own framing: *"The vtable is our breed
  object… C++ classes are the Type Object pattern applied to C, handled automatically by the compiler."*
  Stepping outside it means re-implementing what the compiler was doing. Know why you're paying that.
- **THE SHARPEST CAVEAT — data is easy, behaviour is hard.** *"With subclassing, you can override a method and
  do whatever you want to… When we use the Type Object pattern instead, we replace an overridden method with a
  member variable."* His summary: **"This makes it very easy to use type objects to define type-specific
  _data_, but hard to define type-specific _behavior_."**

  This is the caveat that decides your architecture. If a variant needs a different **number**, it is a data
  row. If it needs a genuinely different **procedure**, Type Object alone will not carry it and you must pick
  one of: a **registry seam** (a data string keyed to a registered pure function — the cheapest and the right
  default), Subclass Sandbox, or a scripting layer. Do NOT resolve it by adding a branch to the universal path;
  that is exactly how the switchboard starts.

### Inheritance between type objects — both mechanisms

```cpp
// Dynamic delegation: walk the parent chain at read time
int Breed::getHealth() {
  if (health_ != 0 || parent_ == NULL) return health_;
  return parent_->getHealth();
}

// Copy-down: resolve once at construction
Breed(Breed* parent, int health, const char* attack) {
  if (parent != NULL) {
    if (health == 0)  health_ = parent->getHealth();
    if (attack == NULL) attack_ = parent->getAttack();
  }
}
```

Copy-down is faster and drops the live parent pointer, at the cost of making type definitions immutable once
built. His inheritance-model fork: **no inheritance** (simple, duplicated effort at fifty breeds) → **single
inheritance** (easy to understand, slower attribute lookup) → **multiple inheritance** (kills nearly all
duplication, but *"extremely complex," "hard to understand and reason about"*).

### The other design forks

| Fork | Options |
|---|---|
| Encapsulation | Type reference **private** (complexity hidden, enables per-instance overrides, costs forwarding methods) vs **public** (outside code can use types without an instance; wider surface) |
| Creation | Pass the type object into the instance's constructor (caller controls allocation) vs a factory method on the type object (the type controls allocation — useful with pools) |
| Mutability | Fixed type (simpler to code, understand, debug) vs mutable type at runtime (less object creation; must validate the new type's requirements are met) |

---

## Flyweight — the memory-side twin, and how it differs

Source: https://gameprogrammingpatterns.com/flyweight.html

Split an object's data into **intrinsic** (shared, context-free — a terrain type's texture, movement cost,
walkability) and **extrinsic** (unique per instance — a tile's grid position). Many instances point at one
shared intrinsic object.

**Its practical trigger is the sharpest diagnostic sentence in the whole book:** *"If you find yourself
creating an enum and doing lots of switches on it, consider this pattern instead."*

**Keep in Mind:** sharing implies near-immutability — *"Flyweight objects are almost always immutable"*; mutate
one and every instance sharing it changes. And the indirection has a cost: *"Chasing a pointer like this can
cause a cache miss"* — Flyweight (saving memory) pulls directly against Data Locality (saving cache misses).

**Its relation to Type Object, verbatim:** *"Both involve delegating part of an object's state to some other
object shared between a number of instances. However, the intent behind the patterns differs. With a type
object, the goal is to minimize the number of classes you have to define… Any memory sharing you get from that
is a bonus. **The Flyweight pattern is purely about efficiency.**"* Same structural shape, different reason —
so when someone asks "is this Flyweight or Type Object?", the answer is *what were you trying to buy?*

---

## Prototype — only the DATA form survives

Source: https://gameprogrammingpatterns.com/prototype.html

Nystrom is skeptical of the classic GoF `clone()` form on its own terms: *"we don't have to create a separate
spawner class for each monster… But we do have to implement `clone()` in each monster class. That's just about
as much code as the spawners."* And he rejects its premise for modern engines: *"We had to take as a given that
we have separate classes for each monster. These days, that's definitely not the way most game engines roll."*

**What survives is prototypes as a DATA-modeling tool** — a content row names another row as its prototype and
states only its deltas:

```
"goblin grunt"   { "health": 20, "attack": "club" }
"goblin wizard"  { "prototype": "goblin grunt", "spells": [...] }
```

No class hierarchy, no `clone()`. This is the same mechanism as Type Object's `parent` field, and it is what
every real engine below actually ships.

---

## What the real engines actually do

Both files below are quoted from the projects' own repositories. They are the empirical answer to "does this
scale to a real roster?"

### 0 A.D. — entity templates, 4+ levels, multi-parent mixins

Template root: `binaries/data/mods/public/simulation/templates/`.

A base template declares every component with defaults (`template_unit.xml` carries `Cost`, `Health`,
`Identity`, `Obstruction`, `Position`, `Resistance`, `UnitAI`, `UnitMotion`, `Vision`, `VisualActor`, …). Each
level down states only a diff. The weapon lives in an `<Attack>` component on the template that owns it:

```xml
<!-- template_unit_infantry_melee_spearman.xml, parent="template_unit_infantry_melee" -->
<Entity parent="template_unit_infantry_melee">
  <Attack>
    <Melee>
      <AttackName>Spear</AttackName>
      <Damage><Hack>3</Hack><Pierce>2.5</Pierce></Damage>
      <MaxRange>4</MaxRange>
      <PrepareTime>500</PrepareTime>
      <RepeatTime>1000</RepeatTime>
      <Bonuses>
        <BonusCavMelee><Classes>Cavalry</Classes><Multiplier>3.0</Multiplier></BonusCavMelee>
      </Bonuses>
    </Melee>
  </Attack>
  <Identity><GenericName>Spearman</GenericName></Identity>
</Entity>
```

Note what is **data** here: the damage triple, the timings, the range, and the **counter-relationship itself**
(3× vs the `Cavalry` class). No engine code defines this weapon.

The concrete unit is a thin diff — the whole Athenian hoplite:

```xml
<Entity parent="civ/athen|hoplite|template_unit_infantry_melee_spearman">
  <Identity>
    <GenericName>Athenian Hoplite</GenericName>
    <SpecificName>Hoplítēs Athēnaîos</SpecificName>
    <Icon>units/athen/infantry_spearman.png</Icon>
  </Identity>
  <Promotion><Entity>units/athen/infantry_spearman_a</Entity></Promotion>
  <VisualActor><Actor>units/athenians/infantry_spearman_b.xml</Actor></VisualActor>
</Entity>
```

**~8 lines** for a fully-specified unit. The rank-up variant (`_a`) is a further 3-line diff over this one.

**Multi-parent composition** (`parent="civ/athen|hoplite|template_unit_..."`) lets independent axes compose —
a civ mixin, a unit-class mixin, and the base template — instead of forcing one inheritance tree. The mixins
are tiny and single-purpose:

```xml
<!-- mixins/hoplite.xml — grants one capability, reusable by any civ's spear line -->
<Entity><UnitAI><Formations datatype="tokens">special/formations/phalanx</Formations></UnitAI></Entity>
```

**Three merge primitives**, which is more than most hand-rolled systems provide:
- plain override (the default),
- **numeric delta** — `<Height op="add">5</Height>` over a parent's `9000` resolves to `9005` (also `op="mul"`),
- **additive token lists** — `merge=""` on a block appends to the parent's list instead of clobbering it.

### OpenRA — MiniYAML rules, traits, and weapons as composed named types

An actor is a set of **traits**; a trait is attached by simply being present. Inheritance is a real diff —
additive *and* subtractive:

```yaml
E1:
	Inherits: ^Soldier
	Inherits@AUTOTARGET: ^AutoTargetGroundAssaultMove
	Valued:
		Cost: 100
	Health:
		HP: 5000
	Armament@PRIMARY:
		Weapon: M1Carbine
	Armament@GARRISONED:
		Name: garrisoned
		Weapon: Vulcan
```

- `Trait@InstanceName` runs **several parametrized instances of the same trait** side by side (two Armaments,
  one for garrisoned firing).
- A leading `-` **removes** an inherited trait (`DOG` strips `-AttackFrontal:` and `-TakeCover:`).
- `Inherits@1: / @2: / @bounty:` is multi-parent composition, exactly parallel to 0 A.D.'s pipe chain.
- `^`-prefixed actors are abstract mixins, never spawned.

**Weapons are the CEO's example made literal** — a weapon is a pick of named types plus numbers:

```yaml
^Cannon:
	ReloadDelay: 50
	Range: 4c768
	Projectile: Bullet
		Speed: 682
		Image: 120MM
	Warhead@1Dam: SpreadDamage
		Spread: 128
		Damage: 4000
		Versus:
			None: 30
			Wood: 75
			Light: 75
	Warhead@2Smu: LeaveSmudge
		SmudgeType: Crater
	Warhead@3Eff: CreateEffect
		Explosions: small_explosion

25mm:
	Inherits: ^Cannon
	ReloadDelay: 21
	Projectile: Bullet
		Speed: 853
	Warhead@1Dam: SpreadDamage
		Damage: 2500
		Versus:
			Light: 116
	-Warhead@2Smu:

90mm:
	Inherits: ^Cannon
	Warhead@1Dam: SpreadDamage
		Versus:
			Heavy: 115
```

`Bullet`, `SpreadDamage`, `LeaveSmudge`, `CreateEffect` each name a registered C# type; the indented block
configures **that type's fields**. So a weapon = one projectile type + N independently swappable warhead types
+ numbers. `90mm` is **three lines**: a cannon that is better against heavy armour. That is what "every weapon
is the same weapon, varied slightly" looks like when it is done properly.

The C# side shows why the YAML keys exist without anyone hand-writing a parser:

```csharp
[Desc("The actor will automatically engage the enemy when it is in range.")]
public class AutoTargetInfo : ConditionalTraitInfo, Requires<AttackBaseInfo>
{
    [Desc("It will try to hunt down the enemy if it is set to AttackAnything.")]
    public readonly bool AllowMovement = true;

    [Desc("Set to a value >1 to override weapons maximum range for this.")]
    public readonly int ScanRadius = -1;

    [Desc("Possible values are HoldFire, ReturnFire, Defend and AttackAnything.")]
    public readonly UnitStance InitialStance = UnitStance.Defend;
}
```

The `public readonly` fields **are** the YAML keys, loaded by reflection; `Requires<AttackBaseInfo>` declares a
trait dependency the loader enforces.

---

## Keeping the data layer from becoming soup

Both engines converged on the same answer, independently — and it is the part most hand-rolled data layers skip:

**The schema is DERIVED from the same declaration that implements the behaviour.**

- **0 A.D.**: every component (C++ or JS) returns a RelaxNG fragment from `GetSchema()` / `.prototype.Schema`;
  the engine assembles all fragments into one global schema and validates every template XML at load.
  `-dumpSchema` prints it. From their own doc: *"Components should define a schema, which is used for several
  purposes: Documentation of the XML structure expected by the component. Automatic error checking that the XML
  matches the expectation."*
- **OpenRA**: the `[Desc(...)]` attributes on the `TraitInfo` fields generate **both** the published trait
  reference **and** the schema, so docs and schema cannot drift. Plus `OpenRA.Utility --check-yaml` as a
  linter, and `Requires<T>` as a load-time dependency check.

Neither maintains a hand-written schema file next to the data. **If you add a data layer without deriving its
schema from the code that consumes it, you have chosen drift.**

0 A.D. additionally mandates per-component tests with a mock harness (`ComponentTestHelper`, `AddMock`) so a
component is testable in isolation from the rest of the simulation graph.

---

## The data-vs-code boundary, stated by the engines themselves

**0 A.D. — three tiers:**
1. New unit / structure / weapon stat block that recombines **existing** components → **a new XML file, zero
   code**.
2. A behaviour no existing component can express → **one new `.js` component** (`Engine.RegisterComponentType`)
   — no engine rebuild, reachable by modders.
3. Behaviour needing tight engine integration or performance → a **C++ component** + `TypeList.h` + rebuild.

**OpenRA — effectively two tiers**, per their Modding Guide: *"At the simplest, a mod may just contain some
custom MiniYaml definitions. More complex mods may need to introduce some custom traits, which are written in a
.NET language (we prefer C#) and compiled into a DLL."* There is no sandboxed middle tier — but note the
crucial property: **once a new trait/warhead/projectile type is compiled, it becomes just another
data-nameable type**, exactly like `Bullet` or `SpreadDamage`. The code was paid once and is now content
infrastructure.

That last property is the whole test in check 5 of the diagnostics: **new code must graduate into the data
vocabulary.** Code that does not — code that serves one content item and can never be named by another — is the
defect.
