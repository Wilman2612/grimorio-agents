---
name: grimorio.code-harness
description: "The co-located, hierarchical CODE-GUARDRAIL system: `harness.md` files that live next to the code they govern, the upward-lookup discipline that reads them BEFORE any modification so an agent doesn't re-discover the architecture or invent/break things, and the hard rule that a folder needing a guardrail gets a real co-located `harness.md`, never a route table added to the lookup hook. Load before creating or modifying files in this repo, and before authoring or editing a harness.md. GENERAL — portable to any project that adopts grimorio."
---

**What a harness IS — the CEO's definition, verbatim and authoritative (2026-07-29):**

> *"El harness teóricamente es cualquier cosa que debería leerse **antes de proponer estructura de archivos**.
> Puede ser referenciar otros archivos en otro lado del proyecto que sean importantes, leerlos; reglas de 'oye,
> no modifiques esto sin tocar esto'; reglas de 'no dupliques código'; en fin, cosas que hay que leer. **No
> tanto sobre los objetivos de la rama.** Es **jerárquico**: lo que aplique de ahí para abajo, o algunas
> referencias."*

Three things follow, and the second and third are the ones most often missed when authoring one:

1. It is read **before you propose file structure** — earlier than "before you edit". Inspecting counts.
2. It may **point outward**: naming important files elsewhere in the project that must be read alongside this
   subtree is legitimate harness content, not scope creep.
3. Cross-file obligations ("don't modify X without touching Y") and anti-duplication rules belong here. A
   harness is not only architecture-in-brief.

A branch's OBJECTIVE is explicitly **not** harness material — different mechanism, different lifetime.

---

A `harness.md` is a **co-located guardrail document** for the code in its folder subtree. Before you create or
modify any file, you do an **upward lookup** — from the target file's folder up to the repo root — read every
`harness.md` on that path, and obey them. It tells you *what to know and respect before touching THIS code* — the
architecture in brief, the hard invariants, the "do NOT invent / do NOT break" rules, and where the deep knowledge
lives — so you don't re-discover the design the hard way or bolt on a parallel mechanism that re-breaks a solved
problem.

> **Naming — don't confuse two "harness" things.** A `harness.md` (this skill) is a **code guardrail file**. It is
> NOT one of grimorio's **knowledge-harness AGENTS** (agent:grimorio.po, agent:grimorio.web-architect, agent:grimorio.game-architect, …, which maintain memory
> skills). Same word, different mechanism: a harness.md constrains *how you edit code*; a knowledge-harness agent
> *writes settled knowledge into memory*.

## Where each thing lives — sized by how often it loads (this is the whole point)
Three tiers, distinguished by load cost, NOT by importance:

| File | Loads | Size | Holds |
|---|---|---|---|
| **CLAUDE.md** | EVERY request | **minimal** | one short rule + a pointer to this skill — nothing more |
| **this skill (ref:skill/grimorio.code-harness)** | when relevant | can be large | the full PROCEDURE (what a harness is, the lookup, when, how to write one) |
| **`harness.md`** (co-located) | only when you touch its subtree | **full document** | the COMPLETE rules for that domain — the real content, not a short reference |

The `harness.md` carries the full text of a domain's rules **because it does not load on every request** — only
when an edit reaches its subtree (via the hook or the manual lookup). So it is a complete document, not a stub.
CLAUDE.md is the opposite: it rides every request, so it stays a one-line pointer.

## The lookup protocol (how you USE a harness)
- **When:** ONCE, before your FIRST modification in a task — not before every file, not per-edit. (A PreToolUse
  hook also injects the ascending harnesses before Edit/Write; see Enforcement. Do the manual lookup regardless —
  the hook is a backstop, not a substitute.)
- **How:** for each file you will touch/create, walk from its folder **upward to the repo root**, collecting every
  `harness.md` on the way. Read them all. **Deepest = most specific** (governs the narrow subtree); shallower ones
  give the broader frame. When two disagree, the deeper one wins for its subtree.
- **Then obey:** treat the invariants and "do-not"s as binding. If the task would **break a stated rule**, do NOT
  silently override it and do NOT quietly work around it — hit the GATE.

### The MAIN LOOP is the weak point of this protocol (HARD RULE)

The read-first that the Agent-spawn hook injects for sub-agents **does NOT fire for the main loop** — so the main
loop is precisely the reader that skips the lookup, and it does. Two corrections, both binding:

- **INSPECTION counts, not just modification.** The main loop most often skips the harness when it is only
  *reading* a subtree to understand it — which is the moment the harness is worth most, because it carries the
  author's guardrails and the facts that are *not* recoverable from the code. Before you inspect **or** modify a
  file structure, read that subtree's `harness.md`.
- **Read ONCE per task, then proceed.** Track in-context whether you have already read a given harness this task;
  do not re-read it before every file. The lookup is a task-entry step, not a per-edit tax.

## A folder that needs a guardrail gets a FILE, never a route in the hook (HARD RULE, CEO 2026-08-15)

**NEVER add a path table, prefix registry, or route map to the lookup hook ⟶ place a `harness.md` in the
folder that needs one.** The hook is a LOOKUP: it walks upward from the file being edited and picks up
whatever it finds. It knows no paths, and must not learn any.

A route table breaks the mechanism in three ways at once — the guardrail stops living beside what it
governs, a second source of truth appears that someone must keep in sync, and every new folder now requires
editing a hook, which is CEO-gated (ref:repo/.claude/hooks/harness.md). The CEO, on the day a delegate added
one: *"¿Por qué el hook tiene rutas permitidas? Yo nunca puse eso, puse un lookup."* It was reverted the same
day and the folder got a plain `harness.md` instead.

A coordination conflict — another agent holding that subtree right now — is a reason to WAIT for the subtree,
never a reason to route around the mechanism.

## The GATE rule (the most important line in any harness)
A harness may mark a rule as a **gate**: *"if you are about to break this, STOP and ask the user first."* When you
hit a gate you cannot satisfy, surface it to the user with the specific rule and why the task needs to break it, and
wait — you do not decide unilaterally. Gates guard the invariants whose violation is expensive to discover later (an
architecture axiom, a money/security frontier, a design-vs-render contract). Treat a gate as a hard stop.

## How to WRITE a good harness.md (for authors)
The harness.md is the **complete rulebook for its domain** — write the real content, not a thin index. It does not
ride every request, so length is fine when the rules earn it. Structure (omit parts that don't apply):
- **Scope** — one line: what subtree this governs.
- **Architecture** — the shape of this code: the key seam(s), the pattern, how the pieces combine. Enough that an
  editor works WITH the design instead of fighting it — the thing you'd otherwise re-derive every time.
- **Do / Do NOT** — the hard invariants and the concrete anti-patterns ("do NOT invent X", "do NOT reach for Y",
  "search for the existing Z before writing a new one"), each with a *because* when the reason isn't obvious.
- **Gates** — the rules that, if you must break them, require asking the user first (mark them clearly).
- **Read first** — pointers to *which skill* (and section) and *which arch-decision* to read before editing this,
  and WHEN each applies.

**Rules for the content:**
- **Full rules here; THEORY by pointer.** The domain's operating rules live in the harness, complete. Deep,
  portable THEORY (a craft, an algorithm) stays in its skill — link it, don't paste it (a skill re-pasted here
  drifts into a second stale copy). The test: a *rule specific to this code* → write it here; *general craft that
  outlives this code* → point to the skill.
- **Only durable, load-bearing rules.** Invariants that survive across changes — not today's TODO or a one-off.
- **Write the CURRENT state.** When a rule changes, rewrite it — never leave the old rule beside the new (same
  currency discipline as ref:skill/grimorio.agent-writing#quality-standards-for-agents).
- **Co-locate at the right depth.** Put the harness at the folder that OWNS the subtree — the highest folder where
  every rule applies, so the upward lookup reaches it from any file inside.

## Per-feature harnesses — the coverage judgement, and why it lives HERE

**A coverage decision must be recorded where it outlives the work that made it.** This judgement was first written
into a branch's objective file — which the close-out DELETES by design, so the record died with it and a self-test
began reporting it as recorded nowhere. That is the general lesson: *"which of these did we deliberately skip, and
why"* is durable knowledge and belongs in a skill or a co-located harness; only the work item belongs in an objective.

For a domain-root folder with several feature subfolders, judge each one of three ways and RECORD it in the
domain-root's own `harness.md`, not the branch that made the judgement:

| Feature | Harness | Why |
|---|---|---|
| `feature-money`, `feature-with-cross-language-mirror`, `feature-with-fragile-mode-gate` | **own harness** | each carries an invariant a reader cannot get from `ls`: a money frontier with open audits, a cross-language mirror, a fragile mode gate, a hand-synced constant table |
| `feature-thin-slice`, `feature-shared-utility` | **deliberately NONE — covered by a sibling's** | their load-bearing rule is really one shared rule, stated once in the harness that owns it (e.g. the money-owning feature's own harness names the shared utility file it covers). Splitting it would put half the invariant in each of several files, and the coupling itself is the thing worth knowing |
| `feature-crud-a`, `feature-crud-b` | **judged not to need one** | conventional CRUD over the persistence layer, no cross-cutting seam, no invariant that survives a rewrite |

**The judgement is enforced in BOTH directions** wherever a project wires a selftest for it: the "own harness" set
must each carry invariants, seams, a skill pointer and a gate — and the "judged not to need one" set must NOT have
been given one anyway, because a harness written to satisfy a count is a directory listing with a header.

**A harness must name its SEAMS, not only its invariants**, and this is the element most often missing: a
decode that rejects unknown keys, a hand-synced constant table, a cross-layer function import can each go
undescribed as a boundary even when the harness lists every invariant around it, leaving a reader unable to
find the edges without reading the whole subtree. The test: **can a reader list what crosses out of this
subtree, and what guards each crossing, from the harness alone?** Where the answer is "tests only" or
"nothing", say so — an unguarded seam is the most valuable line in the file.

## Enforcement (why this actually gets read)
Two layers, because instruction-only is the failure mode (agents forget):
- **Soft** — this skill + a one-line reminder in CLAUDE.md and in each code-writing agent's behavior file: *before the first
  modification, do the upward `harness.md` lookup and obey.*
- **Hard** — a **PreToolUse hook** on Edit/Write/MultiEdit that, given the target path, collects the ascending
  `harness.md` files and injects them into context (`.claude/hooks/harness-lookup` + `ref:repo/.claude/settings.json`). The
  hook only ADDS context; it never blocks the edit, so a hook failure degrades to the soft layer, never a broken
  tool. Script contract + settings wiring: `./project.hook.md`.

## Relationship to the rest of the system
- **CLAUDE.md** = global, always-loaded, kept minimal — one rule + the pointer here.
- **Skills** = portable/durable DEPTH (the craft/theory). A harness ROUTES to them for theory.
- **arch-decision.md** = the design-of-record for a specific build. A harness names the current one under "read
  first" so an edit conforms to the signed design instead of re-litigating it.

-> The hook script + settings wiring: `./project.hook.md`. For a real worked instance, read the earliest
`harness.md` committed in the target codebase — the first one tends to be the most battle-tested template.
