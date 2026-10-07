# The cold store — files that exist so they are not read

A cold reference is written `cold:<handle>`. A handle is flat: **no slash, no extension, nothing that
looks like a path.** That is the whole point. The CEO's complaint was never that these files load — it
was the reflex:

> *"si me lo pones allí, yo voy a suponer que tengo que ir y revisar ese archivo, y tú también."*
> — 2026-08-05

A path-shaped reference is an invitation, and neither a human nor an agent declines it deliberately.
A handle cannot be opened, so resolving one is an act you have to choose. The pause is the mechanism.

**A handle stays reconstructible**, because the second half of the ruling was *"tampoco tienes que
perder la referencia, o sea, tiene que ser reconstruible… para poder revisar si está muerto o no
también."* That is what this table is for: `audit-chain.mjs --cold` resolves every handle here, reports
the ones no reference points at, and reports the ones whose target is gone.

## When a file belongs here

**WHEN a file is kept only in case someone asks ⟶ give it a handle and reference it cold.**
Superseded vision, closed experiments, revision chains, the "was X, now Y" record that the Currency
standard moved out of a live file. Reading one during normal work is the mistake this prevents.

**WHEN nothing — no script, no hook, no agent — consumes the file's bytes ⟶ delete it, do NOT give it
a handle.** Git already holds it, and absence is a stronger guarantee than any rule: the file cannot be
read by mistake because it is not there. `cold:` is only for what must stay in the tree.

## The manifest

`target` is a live path, or `git:<sha>:<path>` once the file has left the tree. `what` exists so the
handle can be found by searching for its subject — a reference that gives only a filename forces the
reader to open the file to learn whether it is the one they wanted, which is the failure this replaces.

| handle | target | what |
|---|---|---|
| `vision-game1-history` | `.grimorio/memory/grimorio.po-memory/project.vision-archive/game-1.md` | GAME 1: the revision chains, experiment write-ups and superseded rulings moved out of the live vision |
| `vision-game2-history` | `.grimorio/memory/grimorio.po-memory/project.vision-archive/game-2.md` | GAME 2: how the thesis and the chat mode reached their current wording |
| `vision-index-history` | `.grimorio/memory/grimorio.po-memory/project.vision-archive/register.md` | The vision index's own history, and the closed contradiction register |
| `vision-shared-history` | `.grimorio/memory/grimorio.po-memory/project.vision-archive/shared.md` | Shared foundations and the orchestration surface: what was moved out of both |
| `vision-systems-history` | `.grimorio/memory/grimorio.po-memory/project.vision-archive/systems.md` | Systems (ranking, editor, model catalog, map surface, match modes): the superseded record |
| `agent-writing-levels-history` | `.grimorio/skills/grimorio.agent-writing/archive.md` | The pre-2026-07-17 behavior model and the L0/L1/L2/L3 → behavior/general/project/code rename |
| `grpc-a6-retry-exemplar` | `.grimorio/agents/grimorio.design-orchestrator/exemplar-grpc-retries.md` | The real, full-text "gRPC Retry Design" (gRFC A6) proposal. RE-SCOPED: no longer design-orchestrator's AS-IS anchor (Phase 1 step 5b) — reserved for a future TO-BE/proposal-writing phase not yet opened |
| `arc42-mama-crm-exemplar` | `.grimorio/agents/grimorio.design-orchestrator/exemplar-mama-crm.md` | The real, full-text "MaMa-CRM" arc42 SAD. DROPPED as design-orchestrator's standing AS-IS anchor (Phase 1 step 5c) — its whole-system writing-discipline bar is now held by `ceo-dashboard-exemplar` below |
| `ceo-spend-contract-exemplar` | `.grimorio/memory/grimorio.system-design-memory/project.design-orchestrator-exemplar-ceo-spend-contract.md` | The real, full-text CEO-authored "Spend Contract — AS-IS Technical Design" anchoring design-orchestrator's own functionality-type AS-IS writing-discipline bar (Phase 1 step 5b) |
| `ceo-dashboard-exemplar` | `.grimorio/agents/grimorio.design-orchestrator/exemplar-ceo-dashboard.md` | Index (+ its six companions under `design-orchestrator-exemplar-ceo-dashboard/`) for the real, full-text CEO-authored "Iterable/Grafana Email-Deliverability Dashboard" exemplar anchoring design-orchestrator's own multi-part/whole-system-type AS-IS writing-discipline bar (Phase 1 step 5c), companion to `ceo-spend-contract-exemplar`'s single-feature bar |
