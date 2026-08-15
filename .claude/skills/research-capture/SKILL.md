---
name: research-capture
description: "How a research agent PERSISTS findings to tmp/ AS IT GOES — so nothing is lost across phases or a context compaction, and a later phase builds on an earlier one without re-investigating. The capture mechanics, extracted so entropy, the researcher, and any research pass share them. NOT the decision of what becomes perpetual knowledge — that stays with grimorio.documentation."
---

# Research Capture — save findings as you go, so nothing is lost

Research that lives only in an agent's head (or in one long final message) is lost the moment the context
compacts or the phase ends — and then it gets re-investigated, burning tokens and time. **Persisting findings to
`tmp/` incrementally is the structural defense against that loss**, and it is what lets a two-phase interaction
(explore → decide → expand) build the second phase on the first instead of starting over.

> **This skill is CAPTURE mechanics only.** Deciding what graduates to *perpetual* knowledge and consolidating
> the bibliography is agent:grimorio.documentation's job (its gatekeeping against sprawl). Use this to know HOW to
> record while you work; hand the keeper-candidates to `documentation`. Complements ref:skill/working-memory (the tmp/
> staging convention) — this adds HOW to write the notes, not just where.

## The one rule
**Write findings to a `tmp/` file the moment you have them — never buffer everything for the final message.** If
your context is wiped mid-run, whatever reached disk survives; whatever was only in-context is gone.

## How to capture (the methodology)
- **One file per topic**, staged under `tmp/` (ref:skill/working-memory convention). Append as you go; do not rewrite the
  whole file each time.
- **Each finding is self-contained for a reader who wasn't there** (a different agent, the CEO, or you after a
  compaction): the **claim/fact**, its **source** (URL / citation — a claim with no source is a guess, mark it as
  such or cut it), and **why it matters** (relevance to the question being answered).
- **Flag each finding**: `[keeper?]` (worth becoming perpetual knowledge — a hint for `documentation`, NOT your
  decision) vs `[transient]` (scaffolding for this pass only). You suggest; the documenter decides.
- **Confidence + provenance**: distinguish a verified convention/primary source from an inference. Surface
  **negative knowledge** (approaches tried and dropped, and why) — it is as valuable as the positive.
- **Scannable structure**: headings per sub-question, short entries, sources inline. The next reader should get
  the picture without re-opening every tab you did.

## Visual research — see it, don't just read it
For any INHERENTLY VISUAL subject (game mechanics, UI/UX prior-art, art direction, how something LOOKS), text
`web_search`/`web_fetch` is only half the picture. Use the **`playwright-cli`** browser (run it via the Bash
tool — a REAL browser, far harder to block than a bare fetch, though a wrong User-Agent may still block some
sites) to open **Google Images** and the subject's own pages/wikis/store pages, and actually SEE it — then fold
the visual observations into the notes ("the unit roster looks like X", "the mass battle stays legible because
of Y spacing/colour/scale"). A visual guide of *what to look for* also sharpens the text search. Use a NAMED
session (`playwright-cli -s=<topic> open ...`) so parallel agents don't clash, and `-s=<topic> kill-all` when
done. Don't research a visual thing blind on text alone — that produces a shallow report.

## Criteria — when this applies
Any agent doing a research/investigation pass (entropy's blind-spot panel, the researcher's deep expansion, a
build-vs-buy scan) loads this and captures as it goes. A one-line lookup does not need it; a multi-source pass does.

## Anti-patterns
| Anti-pattern | Consequence |
|---|---|
| Buffer everything, write one big final message | a compaction mid-run loses it all; the next phase re-investigates |
| A finding with no source | it's a guess dressed as a fact; poisons the reader downstream |
| Deciding here what becomes perpetual | that's `documentation`'s gatekeeping — you only flag `[keeper?]`, you don't consolidate |
| Notes only you can decode | the point is the NEXT reader (post-compaction / another agent) can use them cold |

-> Where tmp/ files live and the staging convention: ref:skill/working-memory.
-> Who decides what's kept and consolidates the bibliography: agent:grimorio.documentation (hand it your `[keeper?]` findings).
