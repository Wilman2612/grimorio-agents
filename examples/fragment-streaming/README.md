# Real run: Fragment Streaming

This is a real pipeline execution — not a demo, not a happy path scenario.

**Feature**: Multi-bubble NDJSON streaming (AI responses that span multiple chat bubbles)  
**Status at pipeline start**: Feature had been deferred twice. Previous session deleted dead code. This run implemented it.

---

## The Problem

The AI generates responses using `<fragments>` XML tags to signal that a reply should split into multiple independent chat bubbles. The existing system stripped those tags and sent everything as one flat text block. The user saw a single long message when they should have seen 2+ separate bubbles.

This had failed to ship in two prior attempts because the protocol (server → client) wasn't defined clearly enough. The fix required coordinating changes across server, client, and tests simultaneously.

---

## Pipeline Artifacts

| File | Agent | What it contains |
|---|---|---|
| [po-brief.md](po-brief.md) | PO | 3 user stories, 5 acceptance criteria — including AC-4: *"send a two-part prompt, see 2 separate assistant bubbles"* |
| [ux-spec.md](ux-spec.md) | UX | Named states for the streaming flow: before-send, first-bubble-streaming, second-bubble-appears, final |
| [arch-decision.md](arch-decision.md) | Architect | Protocol decision (switch entire chat to `application/x-ndjson`), state machine design, files to change |
| [dev-notes.md](dev-notes.md) | Developer | What was built: `FragmentStreamState` class, `createFragmentStreamingTransform()`, client-side NDJSON helpers |
| [qa-report.md](qa-report.md) | QA | 23 unit tests passing. Pre-existing `fragmenter.test.ts` failure correctly identified as out-of-scope |
| [verification-report.md](verification-report.md) | Manual Verifier | Real browser run. Two findings: 0-bubble state at 3s (expected, undocumented), Send button lock on >60s responses |

The UX spec's named states (state2, state3, state4) are what drove the verification — the verifier checked each state by name, not just "does the page load".

---

## Screenshots

From the UX verification pass (state-by-state, as defined in the UX spec):

| State | Screenshot |
|---|---|
| Before send | [03-before-send.png](screenshots/03-before-send.png) |
| First bubble streaming | [04-state2-first-bubble-streaming.png](screenshots/04-state2-first-bubble-streaming.png) |
| Second bubble appears | [05-state3-second-bubble-appears.png](screenshots/05-state3-second-bubble-appears.png) |
| Final state — both complete | [06-state4-final.png](screenshots/06-state4-final.png) |

---

## What this shows about the system

The pipeline caught two things that wouldn't have surfaced in a normal review:

1. **The mid-stream 0-bubble behavior** — the verifier documented this because it was checking against named states, not just "does it look right". Without state-based checking, this would have passed silently and become a confusing bug report later.

2. **The slow-response button lock** — this is the kind of edge case that only appears under real conditions (a prompt that generates a large response). The verifier was running against a live LLM, not a mock, so it hit it naturally.

Neither of these required human intervention to detect.
