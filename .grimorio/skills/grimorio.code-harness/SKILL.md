---
name: grimorio.code-harness
description: "The co-located, hierarchical code guardrail-file system: upward-lookup before touching code, gates, tree-ownership, tree-occupancy-awareness, state anchoring, and push/rebase/squash/merge-commit rules. Load before creating, modifying, or inspecting repo files, or running git rebase/squash/merge/push."
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
>
> A third, unrelated sense shares the same filename: ref:repo/objectives/harness.md is a **branch-process gate**
> (misnamed — a branch's own objective is explicitly not harness material), the only one of the three that
> actually BLOCKS, at commit; its own content is never read for guidance — the real guidance for it lives at
> ref:skill/grimorio.objective-harness.

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

## Tree ownership — a child NEVER touches a tree it does not own (HARD RULE)

**NEVER run `git checkout`, `git reset`, `git stash`, or any branch switch on a tree you do not own.** A
checkout, reset, or stash never touches only your own work: it relocates or discards whoever else is standing
in that tree — their branch, their HEAD, their uncommitted changes — none of which the acting agent ever
touched or was ever asked to disturb. The cost is real and often unrecoverable: work discarded outright, or
salvageable only by manually diffing `git status` across every tree involved and moving files back by hand —
an expensive, error-prone recovery that obeying this rule in the first place makes unnecessary.

This is narrower than, and does not restate, ref:skill/grimorio.objective-harness#who-works-where--ceo-ruling-2026-07-31's
own "WHO WORKS WHERE" ruling — that section governs who may check out the INTEGRATION branch specifically
(never a delegate, always the main session). This rule is the general case: any tree, any branch, any agent,
whether or not the integration branch is involved.

**A mechanism now exists, in `.claude/hooks/keeper-worktree-guard.cjs`, widened per the CEO's own prior order —
which authorizes widening that hook's own detection specifically, never inventing a second, different hook —
but it targets a NARROWER, DIFFERENT case than THIS rule.** This rule is about a CHILD touching a tree it does
NOT own; the mechanism instead covers TWO AGENTS SHARING one tree (the working model the section below
legitimizes), one of them about to run a state-changing git command while the other is still registered live
there. For a subagent, it DENIES that command (checkout/switch/reset/stash/merge/rebase/cherry-pick/revert/
pull/branch-delete/clean-force/restore) when another agent is currently registered live in the same tree; for the
main loop, it INJECTS a non-blocking reminder naming the occupant instead of blocking. -> the very next
section, ref:skill/grimorio.code-harness#tree-occupancy-awareness--know-who-else-is-standing-here-hard-rule,
for the obligation this mechanism enforces.

**Read its coverage narrowly, so nobody over-reads it as total enforcement of THIS rule.** It depends on the
other agent having been dispatched WITHOUT `isolation:"worktree"` (a truly isolated worktree needs no such
registration — no collision is possible there); registration itself depends on `PostToolUse:Agent` firing
correctly, and CLEARING never depends on any agent-authored signal at all — `SubagentStop` clears on two
platform-set fields (`agent_id`, and a `background_tasks` holding no live work of that agent's own beyond its
own self-entry), never on the agent's own final message. An occupant that crashes outright, or whose
`SubagentStop` never arrives, is still cleared only by the 4-hour staleness ceiling, which remains as the
backstop for exactly that case. **CORRECTED 2026-09-07** — a prior version of this paragraph said
`SubagentStop` was a permanent no-op and that EVERY occupant was cleared only by the 4-hour ceiling; that was
true of a middle version of the mechanism and is no longer true of it, so an agent that finishes cleanly no
longer holds its own protection for hours after it is done. THIS rule's own broader case —
a rogue child running `git checkout` on a tree it never had any legitimate reason to be in at all — is not the
new mechanism's target and stays enforced by prose alone, exactly as before.

## Tree occupancy awareness — know who else is standing here (HARD RULE)

**BEFORE you run a state-changing git command (checkout, switch, reset, stash, merge, rebase, cherry-pick, revert, pull, a branch delete, or a forced clean/restore) in a tree you share with another agent ⟶ be conscious of who else is registered live there.**

This is the obligation `.claude/hooks/keeper-worktree-guard.cjs`'s own
tree-occupancy mechanism (the section above) exists to enforce, stated here as a rule in its own right, never
only as a description of what the hook does: dispatching agents into a shared tree, `develop` included, is the
legitimate working model (rule 16) — the gap this rule closes is never WHERE an agent works, only whether it is
CONSCIOUS OF THE CONTEXT before a state-changing command relocates or discards whatever another agent standing
in that same tree is doing.

The mechanism enforces this asymmetrically, by caller: a SUBAGENT about to run such a command while another
agent is registered live in the same tree is DENIED outright, because a subagent has no one else refusing on
its behalf; the MAIN LOOP gets a non-blocking reminder naming the occupant instead, because a human is already
in the loop to weigh it. -> the section above,
ref:skill/grimorio.code-harness#tree-ownership--a-child-never-touches-a-tree-it-does-not-own-hard-rule, for
exactly what this mechanism does and does not cover.

**WHEN the clearing mechanism cannot establish — from a signal the registered agent does not itself author — that the agent has genuinely reached its terminal stop ⟶ it MUST treat the tree as still occupied and NEVER clear that registry entry.** The costs are asymmetric and not close: a stale "occupied" flag costs a warning
on a tree that is actually free — recoverable, visible, annoying; a premature clear costs a destructive git
operation on an occupied tree — irreversible, silent, and the founding incident this whole mechanism exists to
prevent. A self-authored completion claim — an agent's own final message merely matching a "VERIFIED"/"COULD
NOT" shape — is NEVER, on its own, such a signal: measured against this project's own real completion
records, that exact shape-check was independently satisfied by 71 of 327 (21.7%), then 68 of 327 (20.8%),
non-final firings of the event this mechanism used to clear on before this rule existed — a still-working
agent's own protection could be silently, prematurely cleared roughly 1 time in 5. -> ref:repo/.claude/hooks/keeper-worktree-guard.cjs
for the full measurement record and the same measured rate's own unfixed forward-finding about
`subagentstop-wait.cjs`.

The rule above is a bar, never a claim that no such signal exists — and the difference cost this corpus two
passes. The first satisfied the bar by refusing to clear at all, on a finding that no platform-authored
terminal signal was available; that finding was reported without ever observing a real payload, because the
pass's own probe was blocked before it ran. A later probe observed the payloads directly and refuted it. The
second pass then read that capture too narrowly — it saw `background_tasks` empty on seven FOREGROUND stops
and generalized, missing that the one BACKGROUND stop (the only population this registry tracks) listed the
stopping agent ITSELF as still running. That version could never have cleared anything, while its own comments
claimed it worked; an adversarial review caught it by replaying the captured payload against the real hook.
**WHEN you cannot establish a fact a rule turns on ⟶ report that you could not test it, never that it is
absent** — an untested absence, written down as a finding, becomes a permanent design constraint nobody
re-examines. **WHEN a measurement's population is not the population a mechanism acts on ⟶ it is not evidence
for that mechanism, however many samples it holds.**

## State anchoring — SESSION-scoped state anchors to the main checkout, TREE-scoped to the current tree (HARD RULE)

A third, sibling concern to tree ownership and tree occupancy above — not which tree an agent may touch, but where a SCRIPT's own PERSISTED state should live once an agent is standing in one. The CEO, on why this is now a script's own explicit obligation rather than a model's implicit good judgement (2026-09-22, translated): *"Now that the script is more mechanical than intelligent, you have to account for the reasoning you used to be doing yourself... A model would probably have noticed it wasn't in the worktree."* A model standing in the wrong directory notices; a script that reads `process.cwd()` and proceeds does not — every migration of judgement from a model into a script owes that judgement back, in writing, or it is silently dropped.

**BEFORE a script persists state across runs — an invocations log, a watermark, an index/cache, a claim ledger, or any other file meant to survive beyond one call ⟶ classify that state as SESSION-scoped or TREE-scoped, and record which, in a comment, at the point the anchor path is resolved — never left implicit.**

```
          SESSION-scoped                          TREE-scoped
          one conversation, wherever              one branch's working copy
          its agents happen to stand              and nothing else
  ------------------------------------    ------------------------------------
  an invocations log, a watermark,         the source being changed,
  an index/cache, a claim ledger           `objectives/<branch>.md`, selftest scratch
  ------------------------------------    ------------------------------------
  ANCHOR: the main checkout                ANCHOR: the current tree
```

**ALWAYS anchor SESSION-scoped state to the MAIN CHECKOUT, never to `process.cwd()` or `CLAUDE_PROJECT_DIR` directly.** A session is one conversation; which tree a given agent happens to stand in while doing its own work is an implementation detail of isolation, and it must never split that session's own record in two. **ALWAYS anchor TREE-scoped state to the CURRENT tree instead** — anchoring it to the main checkout would be the opposite mistake, collapsing every tree's own working copy into one shared file.

`git rev-parse --git-common-dir` already resolves to the shared `.git` directory whether or not the caller is standing in a worktree, so the main checkout is one `dirname` away with no separate "am I in a worktree" check needed:

```js
const commonDir    = path.resolve(cwd, git(["rev-parse", "--git-common-dir"]));
const mainCheckout = path.dirname(commonDir);
```

Worked exemplar, already built: `ref:repo/.grimorio/skills/grimorio.board/scripts/board-lib.mjs`'s own `MAIN_CHECKOUT` export and its preceding comment — copy both, never re-derive the formula or the classification from scratch.

**The MAIN LOOP practically never runs in a worktree, which is why this must be got right there first.** **WHEN a CHILD is given its own worktree ⟶ it runs its own hooks and scripts from that worktree, never the main checkout** — that is the point of giving it one, and the asymmetry with the main loop above is deliberate, never an oversight to close.

## Push and consolidation — rebase, squash, merge-commit awareness (HARD RULE)

**BEFORE running `git rebase`, `git merge --squash`, creating a merge commit, or trusting a `--cached`/bare-
`HEAD` diff as "what this step just changed" ⟶ know what that operation does to commit hashes, history shape,
and diff tooling.** A rebase or squash invalidates anything anchored to a pre-operation sha or commit count; a
merge commit means `--cached`/bare-`HEAD` diff tooling reads an IMPLICIT, currently-moving reference point
instead of the incremental change — it can still equal the pre-merge state mid-merge, or report EMPTY once
anything else has moved `HEAD`/the index since (a later commit landing, for instance) — this repo has already
paid for the merge-commit case once (`6b7daaaf`, restoring a gate switch a merge silently turned off for two
days).

-> The full doctrine — what each operation breaks, the substitute, the confirmed incident, the found live
exposure, and the `git-history-safety.mjs` script that makes the mechanical half of this checkable:
`./push-and-history-rewrite.md`.

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
  tool. Script contract + settings wiring: `./hook.md`.

## Relationship to the rest of the system
- **CLAUDE.md** = global, always-loaded, kept minimal — one rule + the pointer here.
- **Skills** = portable/durable DEPTH (the craft/theory). A harness ROUTES to them for theory.
- **arch-decision.md** = the design-of-record for a specific build. A harness names the current one under "read
  first" so an edit conforms to the signed design instead of re-litigating it.

-> The hook script + settings wiring: `./hook.md`. For a real worked instance, read the earliest
`harness.md` committed in the target codebase — the first one tends to be the most battle-tested template.
