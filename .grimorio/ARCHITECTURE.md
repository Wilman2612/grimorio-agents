# Grimorio — the architecture, specified

**The objective.** Grimorio is a GENERIC agent system, meant to be shared. The test is the CEO's own:
*"si no sirve para mi página de remates o para cualquier puta huevada, se va."* If a file serves only this
one product, it is the consuming project's, not grimorio's.

This file is the spec. It settles where every kind of file lives, why, and what must never happen.

---

## 1. THE ONE MECHANISM EVERYTHING ELSE FOLLOWS FROM: DISCOVERY IS OPT-IN

Claude Code auto-discovers whatever it finds under `.claude/skills/` and `.claude/agents/` and offers it to
**every** agent. That listing costs context on every turn, for every agent, whether or not the thing is
relevant.

So `.claude/` is not a storage location. **It is a PUBLICATION surface.**

A grimorio skill is published by a **stub**, 11 lines, that carries no doctrine:

```
.claude/skills/grimorio.agent-tiers/SKILL.md     <- the stub: frontmatter + ONE pointer
.grimorio/skills/grimorio.agent-tiers/SKILL.md   <- the canonical content
```

The stub's own words: *"This adapter exists solely because Claude Code discovers project skills under
`.claude/skills`; it carries no second copy of the doctrine."*

**NEVER put real content directly under `.claude/skills/`.** It does two wrong things at once: it publishes
that content to every agent's skill list, and it bypasses the stub pattern so there is no longer one
canonical home.

**THIS IS THE WHOLE REASON `skills-store/` EXISTED**, and the reason it can now die. It was a place to keep
things OUT of auto-discovery at a time when an agent had to be a single loose file at the root of
`.claude/agents/` and could not own a folder. An agent can own a folder now, so the hiding place is
unnecessary — but the PROPERTY it provided is still required, and it is now provided by *not writing a stub*.

> **This rule was violated on 2026-10-04 and the violation is why it is rule 1.** Six of the adopter's own
> containers were moved into `.claude/skills/project.*`, and the session's own tool listing immediately
> began offering `project.game-design`, `project.map-design`, `project.tileset-composition`,
> `project.game-patterns` and `project.game-development` to every agent. The move was reasoned as "the
> consuming project's content goes beside its own agents" — true about OWNERSHIP, and wrong about the
> container, because `.claude/` publishes. **Those six moves are listed in §8 as TO UNDO.**

---

## 2. THE CONTAINERS

```
.grimorio/                       GRIMORIO'S OWN. This is what gets shared.
├── agents/<grimorio.x>/         A FOLDER PER AGENT (§3)
├── skills/<grimorio.x>/         what MANY agents load (§4)
├── memory/<grimorio.x-memory>/  project + code levels (§5)
├── tmp/                         working memory, WRITE-ONLY (§6)
├── hooks/<hook>.mjs             implementations (§7)
├── .cache/                      RUNTIME STATE, gitignored: the invocation and completion logs, the
│                                tree-occupancy registry, the phase-server log, the board's claim
│                                ledger. Declared ONCE as `cacheRoot` in .grimorio/scripts/refobl/skill-roots.json
│                                and read through .grimorio/scripts/refobl/cache-paths.cjs -- never named as a
│                                literal by a consumer
├── templates/                   what an INSTALLATION starts from, not what this one runs: the root
│                                CLAUDE.md a fresh adopter receives. Never written over one that
│                                already exists, because in an adopting repo that file is theirs
└── ARCHITECTURE.md              this file, plus grimorio's other ROOT DOCUMENTS: AGENT-TIERS.md,
                                 GRIMORIO-CHAIN.md, GRIMORIO-INDEX.md, GRIMORIO-VISION.md. These are
                                 grimorio's own doctrine and index, so they sit at grimorio's own root --
                                 they were under `.claude/`, which publishes, and they are not published

.claude/                         WHAT CLAUDE CODE PUBLISHES, plus what the adopter wrote. Exports by
│                                ALLOWLIST -- never by denylist, because §2 defines an adopter's own agent
│                                as whole, unprefixed and unsplit, so the `project.` prefix that marks
│                                ownership everywhere else catches nothing here. The list is declared in
│                                .grimorio/scripts/export/export-surface.mjs and read by BOTH the gate and
│                                the exporter; two copies of it diverged once and four hook files were lost
├── agents/<grimorio.x>.md       a light adapter: frontmatter + identity + pointers
├── agents/<their-agent>.md      THE ADOPTER'S OWN AGENT, whole, unprefixed, unsplit
├── skills/<grimorio.x>/SKILL.md a stub: frontmatter + ONE pointer. No doctrine.
├── hooks/<hook>.cjs|.mjs        a dispatcher, 245-615 bytes, importing its logic from .grimorio/hooks/.
│                                The only layer settings.json names. BOTH module formats travel: the
│                                allowlist read format rather than ownership once, and a dispatcher
│                                arrived without the library it imports
├── grimorio-config.json         GRIMORIO'S COMMITTED DEFAULTS -- language, the owned prefixes, the board's
│                                tokens. The loader shallow-merges the gitignored `.local.json` beside it
│                                ON TOP, and THROWS when this file is missing, so it travels. It was once
│                                recorded here as the adopter's and held back, and every hook that reads
│                                it then crashed on load in a fresh installation
├── board-config.json            THE ADOPTER'S: the board owner, project and repo. Never exports -- it
│                                names a person, which is the one thing the leak gate refuses outright
└── settings.json                the CEO's. Never edited by a migration, and never COPIED to a target:
                                 it wires the hooks, so an adopter must get their own

.codex/                          THE SAME KIND OF TREE FOR ANOTHER HOST, and grimorio's own throughout.
├── agents/<grimorio.x>.toml     the agent definitions in that host's format
├── hooks/<hook>.mjs             its dispatchers and the libraries they import
└── hooks.json                   the wiring. Unlike settings.json it carries no installation of its own --
                                 its paths derive from the repo root -- so it travels verbatim

.agents/skills/<grimorio.x>/     A THIRD SURFACE, not a subfolder of the second: that host discovers
                                 SKILLS under its own root. Stubs only, same as .claude/skills/

scripts/                         THE ADOPTER'S OWN root scripts -- their selftests, their export
                                 declaration. grimorio's 100-odd live under .grimorio/scripts/, where
                                 POSITION marks ownership and no prefix is needed
tools/                           PARKED by him. The empty folder may stand; nothing moves into it.
```

**There is no container beyond the ones above.** A file that fits nowhere here is a signal that the spec
is wrong, not a licence to invent a folder. The sentence used to carry a NUMBER; it does not now, because
a hand-kept count in prose is the exact defect this section warns about -- it goes quiet when it falls
behind rather than noisy. What counts the publication surfaces is
`.grimorio/scripts/export/surface-coverage.mjs`, which refuses an export when one of them is undeclared.

---

## 3. `agents/<grimorio.x>/` — A FOLDER PER AGENT

Everything that belongs to ONE agent and applies to EVERY project using it:

```
.grimorio/agents/grimorio.entropy/
├── agent.md                      the agent
├── behavior.md                   the old L0. The CHECKING lives here
├── provocation-grounding.md      the old L1: general, applies to any project
├── entropy-phases/phase-N-x.md   only when the agent is phased
└── scripts/panel-check.mjs       a script only this agent uses
```

Its published face is `.claude/agents/grimorio.entropy.md`: **a light adapter.** Frontmatter (name,
description, tools, model), the identity paragraph, and pointers. No doctrine, no second copy.

**A general file only ONE agent ever loads belongs HERE, never in `skills/`.** That distinction is the
store's entire reason for existing and the folder replaces it.

### How a split is actually done (CEO, 2026-10-04)

> *"Empiezas el L0, revisas el L1, cualquier cosa que sea fuera de eso, fuera. Y el L1 puede referenciar
> algunos documentos tipo 'ah, seguimos este patrón, hacemos el siguiente' — no sé, son razonamientos. No es
> que empieza a listar algo propio de arena. Se quita. Así de simple."*

**ALWAYS split in this order, and the order is what makes it mechanical rather than a judgement call:**

1. **Take L0 — the behavior.** It goes to the agent's folder. This is not a decision; the behavior file IS
   the agent.
2. **Review L1 — the general files.** Keep what is a REASONING: a pattern, a method, a way of deciding, the
   kind of thing that reads *"we follow this pattern, then we do the next"*. Those travel with the agent to
   any project.
3. **Anything outside L0 and L1 goes OUT.** Not relocated cleverly — out of the agent's folder.
4. **The tell that a file is NOT L1: it starts LISTING something of arena's.** A reasoning is portable; an
   inventory of this product's mechanics, maps, units or screens is not. When a general file begins to
   enumerate the product, that file is the adopter's, and it leaves.

**NEVER let a file stay because it is "mostly general".** The enumeration is the test, and it is binary: a
file that lists the adopter's own things is arena's, however good the prose around the list is.


---

## 4. `skills/<grimorio.x>/` — WHAT MANY AGENTS LOAD

Several agents load it and it carries no agent's behavior. It earns its place in every agent's listing, so it
gets a stub under `.claude/skills/`.

**The loader count is measured over the WHOLE population, never over the agent shells alone.** A skill is
loaded from `SKILL.md` files, phase files and memory skills too.

> **Measured 2026-10-04, and five skills were one command from deletion because of it.** Five containers
> were classified as orphans on a count taken over `.claude/agents/` only. Opening what actually referenced
> them: `grimorio.python` named by 16 files, `frontend-development` by 13, `ai-game-dev-methodology` by 8,
> `software-craft` by 6, `fail-fast` by 5. **A classification is only as good as the population it was
> counted over.**

---

## 5. `memory/<grimorio.x-memory>/` — THE PROJECT AND CODE LEVELS

The four levels are **behavior · general · project · code**. Behavior and general travel with the agent (§3).
Project and code come OUT of the agent, into `memory/`, so all memory is manageable in one place.

**An adopter's own `project.*` file inside `.grimorio/memory/` is the convention WORKING, not a leak.** The
`project.` prefix marks OWNERSHIP, never position in the folder (ruling of 2026-10-01, landed across 34
files). What keeps it out of the shared package is the export's SCRUB step, not the directory.

---

## 6. `tmp/` — WORKING MEMORY, WRITE-ONLY

The root is declared ONCE, as `workRoot` in `.grimorio/scripts/refobl/skill-roots.json`, and every writer READS it.

**An agent may be told to WRITE here. LOADING a file from here is forbidden**, and refused at commit time
(`TMP_REFERENCE_ADDED`). Nothing that must survive lives in a temp folder, so a tracked prompt citing one of
its files is citing something whose disappearance nobody controls.

> **Measured: of 75 distinct `tmp/` targets cited across 53 tracked files, 71 no longer existed.** 95%
> already dead, and every gate had passed them. `tmp` stays a RECOGNISED store in the grammar on purpose:
> deleting it from the store list makes `ref:tmp/x` unparseable, so the auditor stops counting it and the
> problem goes invisible instead of refused.

The previous root, `tmp/` at the repo top, is **left where it is** and dies by disuse. Its contents are
untracked and their own only copy.

---

## 7. `hooks/` — IMPLEMENTATION AND DISPATCHER

The logic lives in `.grimorio/hooks/<hook>.mjs`. What stays in `.claude/hooks/<hook>.cjs` is a dispatcher of
17–26 lines that dynamically imports it. **The dispatcher keeps its exact path and filename**, because that
is what `settings.json` names — which is why `settings.json` needs no edit and must never get one.

**THE FAIL-OPEN INVARIANT.** A bug in a hook, its implementation, or any sibling it imports must never be the
reason a spawn breaks project-wide. ESM links the whole module graph before running any of it, so a broken
sibling makes the dynamic `import()` reject, caught by the dispatcher's catch-all: silent exit 0.

**Modifying a hook needs the CEO's answer, and the RELAY is that answer.** A dispatched agent has no channel
to him; the main loop carries his approval into the brief, quoting him, and that relay satisfies the gate.
(Rule 22 of `grimorio.conduct/main-loop-only.md`.)

---

## 8. THE ADOPTER'S OWN CONTENT — DEFERRED, AND THAT MEANS UNTOUCHED

The adopter's own agents — `project.brush-critic`, `project.map-cartographer`, `project.conventions-critic`,
`project.map-aesthete`, `project.map-aesthetic-critic`, `project.map-content-critic`, plus the game
developer and game architect — **stay exactly as they are**, whole, inside `.claude/`. Their skills stay
exactly where they are too.

**He deferred this deliberately:** *"o migrarlos a grimorio pero en otra estructura que no habíamos
diseñado, entonces dijimos por ahora que se queden así."* There is no designed structure for them yet.
Deferred means **do not move it, do not rename it, do not give it a stub.**

**TO UNDO, from 2026-10-04:** six containers were moved to `.claude/skills/project.*` against this section
and against §1. They return to `.grimorio/skills-store/` under their original names:

| | files | commit to revert |
|---|---|---|
| `grimorio.game-development` | 10 | `a37784f6` |
| `grimorio.map-design` | 7 | `e07e3aac` |
| `grimorio.tileset-composition` | 9 | `5c3a48c2` |
| `grimorio.game-patterns` | 7 | `9203a46b` |
| `grimorio.map-encoding` | 1 | `f477ac08` |
| `grimorio.game-design` | 38 | uncommitted; discard |

---

## 9. THE EXPORT

`.grimorio/` is the source. The export SCRUBs what is the adopter's: `project.export-baseline.md` states it
— *"exports only its behavior/general levels; `project.md` and code files never export."* The `project.`
prefix is the marker the scrub keys on, which is why the prefix is about ownership and not position.

`.claude/` never exports at all.

---

## 10. HOW A CONTAINER MOVES

**By a tool, from a reviewable map — never by a hand pass per folder.**
`scripts/migrate/container-map.json` holds the judgement as data; `.grimorio/scripts/migrate/move-container.mjs`
performs one entry: the files, the references AND the code paths.

The three cases a reference rewriter structurally cannot see, each found by moving one folder by hand:

1. **A code path built from SEGMENTS** — `path.join(root, ".grimorio", "skills-store", "<name>", "scripts")`.
   The path never appears as text, so no grep, no sed and no reference rewriter finds it. It failed all eight
   of the first agent's selftests.
2. **A reference to an EARLIER location** — `.claude/skills-store/<name>`, already nonexistent. Invisible to
   `--dead`, which scans relation-prefixed tokens, and to `--prefix`, whose directory is the one being moved.
3. **A directory rename the filesystem REFUSES** while every file inside it is movable. Copy, then delete;
   git recovers the set as renames by content.

And the fourth, which is the big half when a folder is also renamed: **the STORE TOKEN.** A container is cited
far more as `ref:skill/<old>` than as a raw path — measured 334 token-form references against 39 raw-path
ones across six folders.

**Measure dead references BEFORE and AFTER in the SAME tree.** The tool's own output says a count is not
comparable across trees, and a cross-tree comparison wasted an hour of this migration on 39 phantom
regressions.

---

## 11. STATE

| | |
|---|---|
| `.grimorio/hooks/` | **DONE** — 21 implementations, `settings.json` byte-identical |
| `.grimorio/memory/` | **DONE** — 314 files, 13 folders |
| `.grimorio/tmp/` | **DONE** — declared once, writers repointed, loading refused |
| `.grimorio/agents/` | 5 of ~11 — extract-cleaner, experimenter, solution-architect, scout, unblocker |
| `.grimorio/skills/` | 9 shared containers moved in |
| the documentador | **DELETED** — 80 files, 174 references treated, dead refs 344 → 276 |
| `skills-store/` | **DELETED** — all 22 placed, the folder gone, its line removed from `roots` |
| `.grimorio/.cache/` | **DONE** — declared once, 36 literals removed, 28 live entries copied, 7,149 log rows intact |
| the root documents | **DONE** — four docs moved out of `.claude/`, 93 references rewritten across 45 files |

**The two that remain, and why they are not mechanical:**

- **`grimorio.board`** (19 files) — TWO behavior files, feeder and writer, for two agents sharing one script
  set. One folder or two is a decision, not a move.
- **`grimorio.system-design`** (150 files) — THREE behavior files inside a folder that is otherwise a shared
  skill. The behaviors go to their agents (§3) first; what remains is a skill (§4).

---

## 12. DEFERRED, AND NOT GUESSED HERE

- **The adopter's own agents** (§8). No structure designed. Untouched.
- **`.grimorio/memory/grimorio.board-memory/` and `.claude/current-objective.md`** — grimorio's own, at the publication surface, and
  they fit NO container above. They are STATE, but not the gitignored runtime kind `.cache/` holds: the
  registers (`register.md`, `grimorio-backlog.md`, `grimorio-defects.md`) and the current objective are
  TRACKED DOCUMENTS a human reads and git versions. `.cache/` already takes the board's claim ledger and its
  index, which is the machine half. Where the HUMAN half lives is a decision, not a move, so it is not made
  here -- per this file's own rule that a file fitting nowhere means the spec is wrong, not that a folder
  should be invented. Eight scripts write under `.grimorio/memory/grimorio.board-memory/`; two name `current-objective.md`.
- **`tools/`** — parked. The empty folder may stand; nothing moves into it.
- **The PO memory split** — it holds project-level content that is not split today.
- **The reference-direction exception** he remembers ruling (2026-09-21T18:49) and does not remember the
  content of. Recoverable by tracing, not by design.
