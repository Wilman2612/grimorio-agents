# `objectives/` — one file per live branch, saying what that branch is for

**This folder is not an index and does not need maintaining.** A branch's objective is at
`objectives/<branch>.md` — the path is *derived from the branch name*, so there is no registry to keep
in sync. When the branch closes, the file is deleted. `ls objectives/` therefore answers *"where are we,
how are we doing, what is open?"* by construction: what is here is what is live.

It is emphatically **not a map of the codebase.** The CEO rejected discovery indexes with reasons —
*"hay que mantenerlos, hay que confiar en que los vas a mantener bien, que no van a ocupar cincuenta
kilobytes"*. This folder indexes WORK IN FLIGHT, never code, and it shrinks as work closes.

## The cycle

| | What happens | Enforced by |
|---|---|---|
| **Open** | The branch and its objective are created in one act | `scripts/open-branch.sh` |
| **Work** | Every commit checks the objective exists and the branch stays in its declared scope | `scripts/pre-commit.sh` (install: `scripts/install-hooks.sh`) |
| **Close** | Every check must be ticked and its VERIFY command run green; the objective is compressed into one line in the project's own features ledger; the file is deleted, the branch merged and pruned | `scripts/close-branch.sh` |

```
open-branch.sh ──> objectives/<branch>.md ──> pre-commit gates every commit against it
                                          │
                                          └──> close-branch.sh ──> features ledger (the record
                                                                   of what EXISTS)
                                                              └──> objective deleted, branch pruned
```

## COMMIT WHEN A CYCLE CLOSES — standing CEO ruling, no permission needed

*(Moved out of `CLAUDE.md` 2026-07-30. It belongs here: this file owns the commit cycle.)*

**A closed cycle gets a commit. Immediately, without asking.** Feature done → commit. Fix done → commit. Gate
passed → commit. **One commit per closed thing**, separated by area so any one of them can be reviewed or
reverted alone. Do NOT batch a day's work into one pile, and do NOT wait for permission — permission is
standing, and asking for it again each time is the failure this rule closes. It has been raised more than once.

**Why it is not cosmetic.** In the source project, a signed design document was once lost permanently because
it had never been tracked, and over a dozen more files were rescued from deletion with hours to spare.
**Uncommitted work is unrecoverable work.**

The only things held back are secrets and files the principal explicitly asked to review first. Messages are
in English — subject, body and footers — per the global rule.

## Hard invariants — these are GATES, not preferences

1. **No commit on a non-trunk branch without an objective file.** The reason this is mechanical and not
   a rule: a milestone-branch practice was adopted in words once and never once used, and dozens of
   short-lived agent-worktree branches accumulated that nobody could account for. *"Es más que nada un
   tema de realización."*
2. **The objective declares what the branch must NOT touch**, and the commit gate enforces it. This is
   the anti-bucket gate: one milestone branch became a bucket for unrelated work because nothing ever
   compared a commit against what the branch was for.
3. **Nothing merges with an open check.** *"Hasta que no se cumplan todos los objetivos, no paras."*
4. **Every check carries a VERIFY command that a stranger can run**, and the close-out runs all of them
   cold. A check only a human can confirm is how a practice gets adopted in words and never used.
5. **See each gate FAIL before trusting it.** Repo standing rule: a probe that has only ever been green
   is not a probe. `scripts/selftest-objective.sh` does exactly this for the methodology itself — and
   for the injection, where "it fired" is unfalsifiable unless you have also seen it NOT fire.
6. **The features ledger is updated BY the close-out, never from memory.** Read this precisely, because
   two looser versions of it were written down and both were false. The close-out is *what writes* the
   feature line: it refuses an objective whose feature line is missing or still the template
   placeholder, and after writing it asserts **that the feature line is actually present in the
   ledger**. Not "the ledger changed" — that is satisfied by any unrelated edit the branch happened to
   make to the file, and it passed a close-out whose write had silently done nothing. There is no gate
   demanding you edited the ledger by hand during the branch, and none is wanted.
7. **Every ticked check carries a runnable VERIFY, counted.** "At least one exists" would pass an
   objective of eight checks with one runnable command and seven bare-text placeholders — the exact
   shape of a stalled front. The close-out compares the two counts.
8. **The scope gate sees deletions and renames, not only additions.** Deleting an out-of-scope file is
   still unrelated work, and a rename INTO a forbidden path would otherwise escape scope in one move.
   Prune-what-dies makes delete-only commits routine here; they are the last shape the gate can afford
   to miss.
9. **A pattern with no glob character covers the path and everything under it.** `services/game-sim` and
   `services/game-sim/` mean the same thing. Taking the slashless form literally would leave a branch
   silently unscoped — a gate failing in the dangerous direction.
10. **A base must be a LOCAL branch, and an ANCESTOR of the branch closing.** A remote-tracking ref
   passes `rev-parse --verify` and is then checked out detached, so the merge lands on a dangling
   commit and the real branch never moves. A base that has advanced past the fork means the checks ran
   against something other than what would land — merge the base in first.
11. **The gate is not its own kill switch.** A commit deleting `objectives/harness.md` is refused
   outright, because the out-of-scope gate cannot defend the marker: the marker *is* the gate.
   Retiring the methodology stays possible — it just has to be deliberate.
12. **A branch with no objective of its own INHERITS the nearest ancestor's, and is bound by its
   scope.** A delegate spawned with `isolation: "worktree"` is on a branch the harness created, which
   has no objective file — so before this, the one party doing the work was the one party under no
   declared scope. It now works inside its parent's objective, and the commit gate enforces the
   parent's out-of-scope paths against it. `open-branch.sh --here` still gives it a narrower objective
   of its own, which overrides. Inheritance is a fallback, never an amnesty: a branch descending from
   no objective-carrying branch at all is refused exactly as before.
13. **A closing cycle must drain any ledger entry whose Enforcement mechanism it just shipped, or the
   branch does not close.** The CEO ruled it: closing a cycle reviews the ledger and drops what no
   longer applies. That was already prose — the CLOSED section's own header — and prose alone let fixed
   entries sit OPEN while the same cycle's own fix shipped past them ungated. A dedicated selftest,
   wired as a gate of `scripts/close-branch.sh`, catches exactly that gap and refuses to close past it,
   without draining the standing backlog or replacing the periodic full-backlog pass — both remain
   separate, still-needed work.

## Before a feature branch merges

*(Moved out of `CLAUDE.md` 2026-08-04 — the only real reader was the main loop / a delegate acting as it,
exactly the audience this file already addresses directly.)*

The review happens **once, at the END, on the whole branch — not per commit.** A code review and a security
look are both required before a merge; refactoring belongs at the end too, on finished code, never mid-flight.

Merging also moves the codebase's own map: **update the `harness.md` of every subtree the branch touched**
before the merge lands, so the next reader's upward lookup (see `code-harness`) still describes what is
actually there.

## Where the objective reaches — the injection

The commit gate binds the party *least* likely to drift. The objective therefore also travels, resolved
from the branch name with nobody having to paste it:

| Reached by | Mechanism | Form |
|---|---|---|
| **`grimorio.delegate` spawns** (worktree-isolated included) | self-read at task start — see `.claude/skills/flow-delegation/delegate-behavior.md` § "Read your objective before you begin" | the FULL objective, both the project's global current-objective file and its own `objectives/<branch>.md` |
| **Every other spawnable agent type** (e.g. `js-developer`, `ui-developer`, `go-developer`, `py-developer`, `web-architect`, `qa`) | none | **nothing reaches it at spawn time — this is an open gap, not a solved one** |
| **Loops and Workflows** (every prompt; `/loop` and Workflow steps never touch the `Agent` tool) | **none — the hook that once injected a reminder was deleted and nothing replaced it** | **nothing reaches it now — this path is UNCOVERED, not merely undocumented** |
| **The commit** | `scripts/pre-commit.sh` | refusal |

**A prior `PreToolUse: Agent` reminder hook was deleted — CEO ruling.** It never did what its own row used
to claim: it fired in the CALLER's own turn, before the spawned child's context exists, so its injected
context never reached a delegate at all; it only ever informed the caller, who already had a direct way to
read the same file. This was shown twice independently, including a zero-tool probe that found the objective
and the spawn checks both ABSENT from inside a freshly spawned child's own context. It also ran on hundreds of
spawns without ever preventing the failure its own isolation check named.

What replaced it is a genuinely different mechanism, not a rewritten hook: the CHILD reads its own tracked
files after it exists, rather than a hook trying to hand it something before it exists — and today that
self-read exists only for `grimorio.delegate`, per the table above.

**The same deletion cost a second, unrelated thing.** The old hook's isolation check was the only place a
PARTITION-before-SERIALIZE ordering — and the restriction that `isolation: "worktree"` is reserved to the main
loop and `grimorio.delegate`, last, never for one job with N helpers — was written down. It went with the rest
of the hook, undisclosed until a later pass. It is now migrated to `.claude/skills/fan-out/SKILL.md`'s Hard
rules block, a file most spawn-capable agents already load — restated there, not here.

**Which objective governs a branch is decided in exactly ONE place** — `obj_resolve` in
`scripts/objective-lib.sh`, reached by the hooks through `scripts/objective-current.sh`. The injector and
the gate cannot disagree, because they are the same function. A second implementation in JavaScript
would have drifted on its first edit, and that drift has the worst possible failure mode: a delegate
told it is working inside one scope while the gate measures it against another.

**The injection never blocks.** No objective, no git, no bash, a broken resolver — all degrade to
injecting nothing, and the spawn or turn proceeds. A methodology that can break a session is a
methodology that gets switched off.

**`scripts/selftest-objective.sh` can go stale on its own** when the mechanism it checks changes shape (a
hook deleted, a check renamed) — a follow-up pass has to bring the selftest back in sync; that is normal
maintenance, not a defect of the methodology itself.

## When the gate is live

The commit gate fires on a branch that has `objectives/harness.md` in its working tree **or in HEAD**.
Merging the methodology into a branch is what switches its gate on — which also makes the activation
visible in history. Branches that predate it are left alone rather than blocked by a rule their own
checkout has never heard of.

HEAD is consulted and not only the tree because the working-tree-only version was an escape hatch: one
commit deleting the marker turned every objective gate off, in the same commit that did the unrelated
work the gate existed to refuse.

Trunk is never gated, and neither is a detached HEAD or a merge commit.

## THE BRANCH MODEL — CEO ruling, 2026-07-30

> *"En teoría, tú deberías trabajar sobre DEVELOP, y luego MAIN es para liberar a producción. Main y develop
> son obviamente ramas PROTEGIDAS, y luego de eso, las otras son feature branches."*

And on why a delegate gets a branch AND a worktree, in his words: it receives a copy of the repo **including
the main branch's focus plus its own objective**, so *"entiende cuál es el objetivo principal de la rama, sabe
que no es su objetivo específico, pero para que tenga contexto… así sabe en qué enfocarse pero no pierde el
contexto global."* That pairing — the project's global current-objective file for the global focus,
`objectives/<branch>.md` for the slice — is INTENTIONAL, not incidental.

**What this resolves, and it is the root cause behind a whole night of drift in the source project.** The set
of trunk branch names is configured once (`scripts/objective-lib.sh`) so the gate never fires there and
`close-branch.sh` never runs for work that lands directly on trunk — measured in the source project: several
close-outs skipped across hundreds of commits, multiple merged branches whose objective was still sitting in
`objectives/` pretending to be open, a features ledger with stale rows, and a backlog claiming work was
unbuilt that had merged days earlier.

The fix is NOT to gate the integration branch. Under this model the integration branch (commonly `develop`)
takes merges only: feature branches carry the objective and the gate, and they merge INTO it. **The defect was
work landing DIRECTLY on trunk**, which bypasses the whole cycle by construction.

-> `scripts/status.sh` reports the drift this causes at any time; `scripts/close-landed.sh` consolidates work
   that already landed on trunk, which is the case `close-branch.sh` structurally cannot cover.

## WHO WORKS WHERE — CEO ruling, 2026-07-31

His words, and they split into three DIFFERENT rules, not one — the prior wording ("never work directly on
the integration or release branch") bound everyone identically and was wrong in both directions:

> *"Un DELEGADO nunca debe trabajar sobre la rama develop. Tú, como chat principal, SÍ puedes trabajar en
> develop — tienes que invocar tus agentes, obvio, pero técnicamente puedes trabajar sobre develop, solo que
> tienes que hacer commits cuando acabes algo, precisamente para que no haya problemas con los worktrees de los
> delegados. O al menos asegurarte de que todo esté cerrado antes de lanzar un worktree para un delegado, sería
> el mínimo. Y no deberías estar creando, bajo ninguna circunstancia, un worktree sobre develop, porque tú
> trabajas EN develop — entonces crear un worktree para develop lo va a bloquear, obviamente."*

1. **A DELEGATE never works on the integration branch.** Unchanged from the prior rule — this is the half
   that was already right.

   **Running the scripted close is not "working" — CEO clarification, 2026-08-07.** "Works" above bounds
   EDITING, COMMITTING, and CHECKING OUT the integration branch, never running `scripts/close-branch.sh`.
   **WHEN a delegate's own checks hold ⟶ it MAY run `scripts/close-branch.sh` itself.**

   > *"No puede trabajar no significa no puede mergear… y aun si no puede, puede hacer stacking, y tú
   > mergear."* — CEO, 2026-08-07

   Verified by reading the script rather than assumed: the close-out first looks up whether the integration
   branch is checked out in ANOTHER worktree (`git worktree list --porcelain`). Because rule 2 below keeps
   that branch held by the MAIN LOOP's own checkout at all times, that lookup finds it there and merges into
   it via `git -C <that-worktree> merge --no-ff` — so, given rule 2 holding, the delegate's own tree never
   runs `git checkout` and never holds it. The script also carries a fallback (`git checkout -q "$base"`) for
   when no worktree holds the base at all; that branch fires only if rule 2 has already been broken, which is
   exactly what keeps it from firing here.

   **WHEN closing is genuinely barred ⟶ the delegate STACKS and the main loop merges the stack.** It opens
   its next branch on top of its own instead of stopping. Both branches close the same gap: a loop ends at
   CLOSED, never at "my checks are green" — the delegate's own completion rule lives in
   `.claude/skills/flow-delegation/delegate-behavior.md`.

2. **The MAIN LOOP may work directly on the integration branch** — it is the one party that invokes the
   agents — but must **commit when it finishes a thing**, so a delegate's worktree never collides with
   uncommitted work. Minimum bar: everything committed BEFORE any delegate worktree is launched.
3. **NEVER create a worktree checked out ON the integration branch.** The main loop works there; a worktree
   that checks it out LOCKS it, because git refuses two checkouts of the same branch.

**Rule 3 is not hypothetical — it fired the same night this ruling was given, in the source project.** A
delegate's worktree ended up holding the integration branch after its own branch was closed and deleted, and
the main loop then could not check it out to repair a misrouted merge — a `fatal: '<branch>' is already
checked out at '<worktree path>'` error, verbatim.

## Milestones are not a separate kind of thing

A milestone is a branch with an objective. `**Milestone:** M8` on the objective adds the RED-status gate
(a green spec can prove the wrong surface) and `**Exit spec:**` adds the cold spec run. Those two gates
came from a now-retired dedicated script, which `close-branch.sh` replaced — they are now data on the
objective instead of a hard-coded branch table.

## Fields the scripts actually read

`**Branch:**` · `**Base:**` (what it merges into) · `**Feature section:**` (the heading in the ledger the
feature line lands under) · `**Milestone:**` and `**Exit spec:**` (optional) · `- [ ]`/`- [x]` checks
with `` VERIFY: `cmd` `` · the ```` ```paths ```` fence under *Out of scope* · the *Feature line* section.
Everything else in the file is for humans.
