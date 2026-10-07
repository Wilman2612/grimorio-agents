---
name: grimorio.hooks
description: "Load to understand why a hook exists and what it fires on. Modifying a hook is gated by the principal and outside this skill."
---

# Grimorio Hooks — why each one exists

## The placement test this skill exists to satisfy

The CEO ruled a placement test for documentation ULTERIOR to code (board register entry `docs-out-of-hooks`,
2026-09-11, translated from Spanish — the original is a RECORD kept at `ref:memory/grimorio.board-memory/register.md`,
not inline here):

> "I don't like the comments. Those hooks are full of comment lines. The code is not the place to put that
> documentation. You have to put a skill, and in that skill it will say: this is how grimorio's hooks work. ...
> you go describing what you were putting in comments per hook, which then nobody reads unless they modify the
> hook. It goes in a skill that is read when someone wants to understand the hooks' behaviour, and that way the
> comments that were there move into documentation. ... whatever cannot be read FROM the code, whatever is
> ULTERIOR to the code — for X or Y reason, for example 'I don't like such a thing' — goes in a skill, where
> that document says: this is because Wilman doesn't like it. Done. Or: look, the library doesn't tell you
> this, but it happens because of blah blah. Done. It is not that it is in the code — it is because of some
> prior reason."

**THE TEST: can this be read FROM the code?** Then the fix is making the code readable, and nothing is written
here about it. **Is it ULTERIOR to the code** — a CEO preference, a measured incident, a superseded design, a
"the library doesn't tell you this but"? Then it lives in this skill, never as a growing comment block in the
hook itself.

## How to use this skill

Each `.claude/hooks/*.cjs` file keeps only what a reader needs to follow its own logic line-by-line — the
CONTRACT (what event fires it, what field does what). Everything ULTERIOR — why it exists, what the CEO said
about it, what was measured, what an earlier version got wrong — lives in one of the five companion files
below, organized by hook FAMILY. Open the companion for the hook you're trying to understand; don't go back to
the hook's own comments expecting the history to still be there once it has migrated.

The section headings inside each companion reuse the exact H-node labels `ref:repo/.grimorio/GRIMORIO-CHAIN.md`
§3 already assigns those hooks, for continuity with a reader who knows that map. Every hook in the table below
now carries a real H-label — `session-start-identity.cjs` (H16) and `subagentstop-wait.cjs` (H15) were assigned
theirs in `.grimorio/GRIMORIO-CHAIN.md`, dated 2026-09-13, found during a verification pass — closing the labeling
gap this section once noted.

**WHEN a new hook is added, or new ULTERIOR content is written for an existing one — by `grimorio.system-keeper` deciding placement, or by `grimorio.prompt-writer` executing it ⟶ that same pass adds it to the matching companion file below (or a new one, named for the hook family).**
**NEVER leave it as a growing comment block inside the hook file itself.** That is the whole mechanism this skill exists to be; whoever lands the hook owns landing its account here too, in the SAME pass, never a follow-up.

**NEVER let this skill's account of a hook duplicate `ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does`'s own wiring/diagram
description.** This skill owns WHY a hook exists — CEO rulings, measured incidents, superseded design; §3 owns
WHAT fires, on which event, in what order, drawn as the mermaid chain. **WHEN this skill's own account of H9,
H11, H12, or H14 changes ⟶ update it HERE ONLY, and leave §3 at its own one-sentence pointer** — never restate
the same narrative in both places again (grimorio-conduct rule 15: a change must not only add).

## The 13 hooks, by companion file

| Hook | H-label (§3) | Companion |
|---|---|---|
| `spawn-grimorio-conduct-gate.cjs` | H9 | `spawn-gates.md` |
| `spawn-verbatim-origin-gate.cjs` | H11 | `spawn-gates.md` |
| `worktree-create-from-develop.cjs` | H8 | `worktree-and-occupancy.md` |
| `keeper-worktree-guard.cjs` | H12 | `worktree-and-occupancy.md` |
| `log-agent-invocation.cjs` | H2 | `logging-and-identity.md` |
| `subagent-id-injection.cjs` | H7 | `logging-and-identity.md` |
| `log-agent-completion.cjs` | H10 | `logging-and-identity.md` |
| `session-start-identity.cjs` | H16 | `logging-and-identity.md` |
| `ref:repo/.claude/hooks/board-reconcile.cjs` | H17 | `ref:skill/grimorio.hooks/board-and-wait.md` |
| `subagentstop-wait.cjs` | H15 | `board-and-wait.md` |
| `harness-lookup.cjs` | H1 | `misc.md` (one-line pointer only — see below) |
| `prompt-check.cjs` | H3 | `misc.md` |
| `mark-skill-loaded.cjs` | H5 | `misc.md` |

`harness-lookup.cjs` (H1) is the one exception to "migrate the ulterior content here": its own contract and
design already have a correct, complete home at `ref:skill/grimorio.code-harness/hook.md` — written
before this skill existed and never duplicated by it. `misc.md`'s own H1 section is a one-line pointer
there, nothing more.
