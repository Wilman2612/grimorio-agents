# Task flow — design for review

How grimorio takes a task from the principal's "execute" to a delivered, proven result: mission, architecture,
execution plan, steps, subtasks, evidence and support documents. Written 2026-10-20 from the messages of session
`ab161c11`, and updated through his 42nd message (2026-10-31), for his review. **Nothing here is built yet.**

| File | What it holds |
|---|---|
| ref:repo/.grimorio/design/task-flow/pseudo-spec.md | his asks verbatim, by category, with what answers each; the tensions and how they ended; my proposals he corrected; the session's other asks, so none is lost |
| ref:repo/.grimorio/design/task-flow/vision.md | the six-field harness the flow is judged against |
| ref:repo/.grimorio/design/task-flow/quasi-software-view.md | the flow drawn: states, loops, who acts on each state, entry cases, the step loop, evidence, support documents, the synthesizer, planning by role, scripts against judgment |

**Read in this order:** the vision first, which is two minutes. Then the main diagram at the top of the view, then
the decisions below. The pseudo-spec is there to check that nothing of his was dropped.

## Decisions that are his

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | who writes the execution plan | a new `grimorio.planner` agent / a phase of the delegate / a phase of the solution architect | **a new agent**: it needs a clean context and its own playbook. The delegate is the one re-planning today, and architecture is not execution (A4) |
| D2 | does he approve the plan before it runs | always / only when grimorio wrote it (E1, E2) / never | **only E1 and E2**: he approves the "how it was split" view, then it runs alone. His own plan (E3) and resumed work (E4) run without approval. This sits between "que lo haga solo" (F6) and "todas estas categorías están bien" (E11) |
| D3 | where the task folder lives | tracked in the repo / `.grimorio/tmp/`, gitignored and lost when a cloud container is reclaimed / outside the repo | **text tracked, binaries outside git**: mission, plan, ideas and failure cards are tracked; screenshots and large outputs stay out of git, and the rendered report carries them. Location does not matter, as long as it survives (I2, I3) |
| D4 | how he views the support documents | a page rendered from the folder (opened locally, or published as a private page from a cloud session) / a GitHub board or ticket | **the rendered page**; GitHub later, at most as a mirror of the steps. Call limits, latency, and transcripts and screenshots do not fit an issue (H4) |
| D5 | the one-line reminder on every message while a task is open | a new hook on his message, silent when no task is open / no hook, only the explicit moments (opening, on demand, before a spawn) | **the hook, silent without an open task**, so it never fires when grimorio is not in use (C7). Adding a hook needs his yes |
| D6 | what happens to the branch objective file | retire it / keep it only as the slice of a plan that one branch closes / leave it as is | **keep it only as a slice**: its checks are copied from the gates of the steps that branch closes, which makes it the pre-check tied to what will be generated (I6) |
| D7 | the synthesizer reads the kind of his new messages from the delta (new task, continue, correction), the hand-over carries it, and the spawn gate requires only what that kind needs | change the gate / leave it requiring a full synthesizer run and a coverage scout after every message of his | **change it**: this is his own proposal (J1, J8, J9), and today a plain "continúa" pays for a synthesizer run, the board feeder and a coverage scout (J4). The gate is a hook, so the change needs his yes when it is built |

## After his review

Building this gets its own plan in the form he asked for (E11): the categories of change, each with its before and
after, what is tested together and what apart, and the whole route.

This branch, `claude/task-flow-design`, starts from `claude/tender-cray-qw8chb`. It therefore carries that branch's
three unmerged commits (git hooks, agent folders, the extract-cleaner path fix), which still wait for his OK.
