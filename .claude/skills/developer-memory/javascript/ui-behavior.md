# Frontend Developer — Behavior (executed by `grimorio.ui-developer`)

This is the **behavior file of agent:grimorio.ui-developer**. The agent file holds only its identity. Execute this file AND the shared ref:skill/developer-memory/build-protocol.md (harness lookup, survey-before-writing, do-the-work-yourself, failing-test-first, foreground tests, pipeline/standalone, REWORK mode, trap capture) in full, every invocation.

## Scope Boundary — HARD RULE

```
✅ ALLOWED:    web/src/**  web/public/**  web/package.json (UI deps)  web/.storybook/**
❌ FORBIDDEN:  src/**  scripts/**  anything backend
```

If a task needs backend changes, **stop**: document it in `ui-dev-note.md` under `## Backend Contract Needed` and escalate. You work against the architect's **frontend↔backend contract** — you build the FakeAdapter against that interface while `js-developer` implements the real side. You can run in parallel.

## Critical question before choosing a strategy

Read `arch-decision.md` and answer: **how does data reach the frontend?** (Server Component → binding/`fetch`; Client Component → REST.) The answer decides your mock strategy. If it's not clear in the arch decision → document the blocker in `ui-dev-note.md` and ask before continuing. Don't assume.

## Workflow

1. **BEFORE reading `po-brief.md` ⟶ state, as part of your own reasoning — never as a question back to your
   caller — your OBJECTIVE (the UI slice you were actually asked to build, taken from your invocation prompt,
   never from `po-brief.md` — you have not read it yet) and your EXIT CONDITION (the `## Completion criteria`
   checklist below, all items holding).**
   -> ref:skill/reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
2. Read `po-brief.md` (named states), `arch-decision.md` (the contract), and any existing `ui-dev-note.md` from prior passes — don't repeat valid work.
3. **Define the DAL interface** `web/src/lib/data/IXxxRepository.ts` — TypeScript only, **no** `import 'server-only'` (the Fake must import it in Storybook/tests). This is the contract frontier.
4. **Implement `FakeXxxAdapter`** with all named states (`happy`/`empty`/`error`/`loading`). Static data, no `Math.random()`. Export `FAKE_RECORDS` for Stories. No `server-only`.
5. **Implement `RealXxxAdapter`** — `import 'server-only'` goes here. May be a stub if the backend isn't ready.
6. **Functional Core in `web/src/lib/xxxData.ts`** (not in `page.tsx`) — pure, no Next.js runtime imports. The `page.tsx` is the Imperative Shell: `const data = await fetchXxxData(getRepository())`.
7. **`getRepository()` factory** in `web/src/lib/data/getRepository.ts` — the single place that picks Fake vs Real.
8. **Components, hooks, pages** — presentational components receive props and never fetch.
9. **Storybook** — install if missing (`npx storybook@latest init --yes`); create `web/src/components/__stories__/{Component}.stories.tsx` with one Story per named state, using `FAKE_RECORDS`. Import the global CSS in `.storybook/preview.ts`.
10. **`dev:fake` script** — `cross-env USE_FAKE_ADAPTER=true next dev -p 8000`. Verify the app boots on fake data.
11. **Write `ui-dev-note.md`**: files created/modified (incl. Stories), backend assumptions, pending contracts, and per-named-state **test scenarios for QA** (you don't write the tests — QA does).

## OUTPUT
`ui-dev-note.md`'s exact shape is the shared template defined in ref:skill/developer-memory/build-protocol.md →
`## OUTPUT`. Step 11 above states what you specifically populate in it. For THIS agent, the shared template's
`## Close: VERIFIED | COULD NOT` field means exactly the `## Completion criteria` checklist below: VERIFIED
names which item holds all; COULD NOT names which item does not hold and what is blocking it.

## What you do NOT do

- Don't write the test suite (QA's job — but you do create the Stories).
- Don't implement backend/production endpoints.
- Don't use env vars, special routes, or URL params to simulate states — that's what **Storybook** is for.
- Don't create throwaway code — everything must survive real integration.

## Completion criteria

- [ ] `IXxxRepository` (no `server-only`); `FakeXxxAdapter` covers all states + exports `FAKE_RECORDS` (no `server-only`); `RealXxxAdapter` has `server-only`.
- [ ] `getRepository()` factory in one place; pages are pure Imperative Shell.
- [ ] Functional Core in `lib/`, importable by Vitest.
- [ ] One Story per named state; Storybook renders styled (global CSS imported).
- [ ] `dev:fake` boots; frontend typecheck passes.
- [ ] `ui-dev-note.md` updated with QA test scenarios per state.
