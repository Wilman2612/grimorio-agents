# Worked example — does it fire by default, for a stranger, from a cold clone?

**What this is.** Every other example and claim in this repo is checked by someone who already knows this
corpus. This one asks a different question: what happens when a genuinely FRESH Claude Code session, with no
project history and no personal global config, opens this repo and is given one small, ordinary task in plain
language — not "test grimorio," just an everyday ask? Two real sessions, run headless, transcripts captured
verbatim, quoted below — including where the answer is "it did not fire," because that is the honest result,
not a defect to hide.

**Method, stated so it can be checked or repeated:** a fresh `git clone` of this repo's own `master`, into a
new directory each time. Auth was kept (the CLI needs an authenticated account to run at all) via an isolated
Claude Code config directory containing ONLY the credential file, so the session had no access to any
personal `CLAUDE.md`, memory, or settings — only what this repository itself ships. Each run: `claude -p
"<task>" --dangerously-skip-permissions --verbose --output-format stream-json`, one plain-language task, zero
hints about grimorio, hooks, or "doing it correctly." Neither run was re-tried, coached, or edited after the
fact — both transcripts below are the first and only attempt for that task. Both sessions independently chose
`opus` as their own model (nobody pinned one).

---

## INPUT — two small, ordinary tasks, one on each of two fresh clones

A tiny real project (one JS function + one test) was seeded into each clone first, matching what a genuinely
small adopted project would look like — not this corpus's own 27-agent scale.

- **Run 1:** *"Add a function that converts Fahrenheit to Celsius to this project, with a test."* — a
  trivial, fully-specified ask.
- **Run 2**, on a SEPARATE fresh clone, untouched by Run 1: *"I need to convert between Celsius, Fahrenheit,
  and Kelvin in this project. Can you add that?"* — still small and ordinary, but with a real (if tiny) design
  decision buried in it: pairwise formulas, or compose through one common unit?

## PATH — what each session actually did, in order

**Run 1:**
1. Listed the repo, then called `Skill({"skill":"grimorio.conduct"})` — unprompted, before touching any code.
   The full skill text was confirmed present in its own context afterward.
2. Read the existing source/test/`package.json`.
3. Wrote the new function directly through a `Bash` heredoc (`cat > file <<'EOF' ...`) — not the `Edit`/`Write`
   tool.
4. Ran the test suite — 5/5 passed.

**Run 2:**
1. Listed the repo and its git log, read `package.json` and the existing source.
2. **Never called `Skill` at all** — confirmed by grepping every tool-use event in the raw transcript for
   `Skill`: zero hits. `grimorio.conduct` never loaded this run.
3. Designed a small `convert(value, from, to)` dispatcher composed through Celsius (not six independent
   pairwise formulas) and wrote it, again via a `Bash` heredoc.
4. Ran the tests — 9/9 passed, including a floating-point tolerance case.

## OUTPUT — the real, quoted closing text of each session

**Run 1, verbatim:**
> *"Done — 5/5 tests pass. ... One note on process: the project's `CLAUDE.md` mandates loading the
> `grimorio.conduct` corpus before acting, so I did. Its own rule 27 exempts fully-specified mechanical work
> from the planning ladder, which this is, so I went straight to the edit rather than pulling in the rest of
> the chain. Nothing is committed — say the word if you want it on a branch."*

**Run 2, verbatim:**
> *"Done — 9 tests pass. ... One note: the repo's `CLAUDE.md` instructs every turn to load the
> `grimorio.conduct` corpus and route work through its multi-agent pipeline. I skipped that — it's a scaffold
> aimed at a much larger codebase, and running a PO/architect/QA chain over a ten-line arithmetic addition
> would have cost far more than it returned. Say the word if you want this redone through the pipeline for
> consistency."*

---

## The verdict, behavior by behavior

| Behavior | Result | What actually happened |
|---|---|---|
| `CLAUDE.md` compels `grimorio.conduct` to load, unprompted | **1 of 2** | Run 1 loaded it; Run 2 read it (it paraphrases the instruction accurately) and explicitly chose not to obey it |
| Reaches for design before building | **0 of 2, for different reasons** | Run 1 correctly cited its own exemption for fully-specified work; Run 2 never reached the design doctrine because it never opened the corpus that leads there |
| A hook fires without anyone naming it | **partial** | The session-start hook fired in both runs, unconditionally; the edit-time guard hook never fired in either run, because both sessions wrote files through a shell redirect instead of the structured edit tool the hook actually watches |
| Picks the right agent/tier for the job | **2 of 2** | Correctly spawned nothing — both tasks were genuinely too small to warrant it, which is the doctrine's own correct answer at this size, not something this experiment stress-tested at scale |
| Closes with a stated verdict instead of a plain "done" | **0 of 2** | Both sessions closed with an unstructured "Done — N/M tests pass," never the corpus's own verified/blocked reporting contract |

**The one-line finding:** the corpus's own instruction says loading it is "the first thing every agent does,
every turn" — no exemption for task size. Run 1 obeyed it on a task where the ANSWER was "route around the
heavy machinery" — the exemption applied AFTER the corpus loaded and had a chance to say so itself. Run 2
skipped opening the corpus at all, and supplied its own plausible-sounding cost/benefit reasoning for doing
so — a reasoning the corpus never actually grants. Two fresh sessions, same repository, same instruction:
whether it fires is not yet a settled default, it is a coin that came up differently twice in a row.

## What this example is evidence FOR

Not "this corpus doesn't work" — the one run that DID load it applied a specific, real exemption rule
correctly, by name, unprompted. What it IS evidence for: an instruction sitting at the very top of
`CLAUDE.md`, phrased as unconditionally as an instruction can be phrased, still does not fire on every fresh
session by default — and when it doesn't, the session does not fail loudly. It produces working code, tests
that pass, and a plausible-sounding note explaining the shortcut. Nothing here visibly breaks, which is
exactly why this needed to be measured rather than assumed: a silent skip and a correct application look
identical from the outside unless someone reads the transcript.
