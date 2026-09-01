# Design Orchestrator — Exemplar: MaMa-CRM (arc42 Software Architecture Document)

A companion reference file in the `system-design` skill, the same tier and mechanism as
ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-grpc-retries.md — the FULL, real text of an external,
human-authored, WHOLE-SYSTEM-scope arc42 Software Architecture Document, held here as an INDEX plus five
verbatim companion files, not a distillation or a "why this is good" essay layered on top of fragments. This
file exists so the bar-anchor ref:skill/grimorio.system-design/design-orchestrator-phases/phase-1-search-first.md's own
step 5c holds does not depend on re-fetching an external URL on every design run, and so the CEO can audit the
exemplar's actual content inside the repo instead of trusting a raw external URL. Reached on demand via
`cold:arc42-mama-crm-exemplar` (ref:skill/grimorio.agent-writing/project.cold-store.md). **NEVER load this file by default.** The
standing bar-anchor — the WHOLE-SYSTEM writing discipline named in step 5c's own prose, distinct from, and
never a replacement for, step 5b's own single-feature bar — lives inline in step 5c's own prose; this file
backs it only when a reader genuinely needs to go deeper than that inline statement.

**Why an index plus five companions, not one file** — this exemplar's full arc42 twelve-section text crosses
the ~500-line smell threshold by a wide margin (ref:skill/grimorio.conduct#branches-commits-and-knowledge rule
23), and SPLIT is the now-live default remedy for an oversized skill reference/exemplar file
(ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md — step 2 of its own Steps section). This
file stays the short index — provenance, the source's own short introduction to the system, and pointers to the
five companions below — and the five companions hold the rest of the source text VERBATIM, moved, never
compressed or distilled, two to three arc42 sections apiece, in the source's own numeric order. Nothing here is
trimmed — every word the source wrote still exists in the tree, just filed under its own companion, one hop
away.

## Provenance — SOURCE ONLY, never a load instruction

**Title:** MaMa-CRM — a Software Architecture Document (arc42 template)
**Author:** Gernot Starke (arc42 co-creator; personal site gernotstarke.de)
**System documented:** a real, anonymized customer-relationship-management (CRM) system for mass-market
campaign/customer-contact handling (insurance, credit-card, telecom, energy/water providers), built to launch
the German government-mandated e-Health-Card and later reused for other campaigns. Real team: 7-10 people,
2-4 week iterations, ~15 months.
**License:** CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0 International) —
https://creativecommons.org/licenses/by-sa/4.0/. Confirmed independently at TWO levels: (1) the live
examples.arc42.org site's own footer ("Site content is licensed CC BY-SA 4.0. Each example additionally
carries its own licence and attribution on its overview page.") plus this example's own per-page license box;
(2) the site's own raw source data itself, `_systems/mama/index.md`'s own frontmatter: "Confirmed by Gernot
Starke, 2026-08-07: he is the author of this documentation and it is CC BY-SA 4.0. The source chapter carries
no licence statement of its own, so this is recorded here rather than derived." ShareAlike honored: this
extract holds the source VERBATIM, never adapted — a verbatim hold with attribution is what CC BY-SA permits
without triggering the ShareAlike obligation a genuine adaptation would carry.
**Original source:** https://leanpub.com/arc42byexample ("arc42 by Example", the real book by Gernot Starke).
**Canonical source (this extract):** https://examples.arc42.org/systems/mama/
**Raw source (this extract):** https://raw.githubusercontent.com/arc42/examples.arc42.org-site/main/_systems/mama/
**Imported into the examples site:** 2026-08.

This is a real, human-authored, whole-system Software Architecture Document — the full arc42 12-section
template applied to an actual, if anonymized, production system Gernot Starke was personally part of building.
It clears ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md's own origin test: real, external,
human-authored, narrated in first person by a named, checkable individual (arc42's own co-creator), never this
agent's own prior output, never anything already in this repo.

**NEVER read any URL above as something to open or re-open.** They are this extract's provenance, carried so
the source stays attached and auditable — the full text below, not a re-fetch, is what the standing
bar-anchor actually draws on.

---

**Everything below this line, until the closing note, is the source document's own text, substantially as
written — not a summary, not a rubric extracted from it.**

---

## Overview

MaMa-CRM takes the burden of (usually paper-based) customer contacts from
organizations working in mass markets, like insurance, credit-card providers,
mobile telecommunication providers, energy and water providers or large
real-estate companies (in MaMa speak these are called «Mandator»).

[Image elided: MaMa-CRM — original path images/mama-logo.jpg]

It has been initially ordered by an independent mid-sized data center to
support the launch of the German (government-enforced) e-Health-Card — and
later on used to support _campaigns_ like telephone billing, electrical-power
metering and similar stuff.

For every mandator, there is at least one completely independent MaMa-CRM
instance running, which is specifically configured for its mandator and a
campaign.

MaMa-CRM architecture documentation is quite heavy in the requirements part,
describing several _aspects of flexibility_ that triggered many central
architecture decisions.

The team that built the system consisted of 7-10 persons working in 2-4 week
iterations for about 15 months.

Me (Gernot Starke) had the honor to be part of that team in a responsible
role. The original client allowed me to talk and write about the system
without disclosing the company name. I was not allowed to use any of the
original documentation or source code.

Thanx to Thorsten, Sven, Arno and a few unnamed other guys for great
cooperation and a successful finish.

> In the [full book](https://leanpub.com/arc42byexample), MaMa-CRM is
> completely documented. Especially the architecture decisions and solution
> concepts that support the enormous flexibility may be worth a read :-)

## The companions — reached only from here, never referenced directly

Five depth files, each holding two or three of the source document's own arc42 sections, verbatim, under their
own original section headings:

- ref:skill/grimorio.system-design/design-orchestrator-exemplar-mama-crm/introduction-and-goals.md — the source's own
  "Introduction and Goals" section (arc42 §1): requirements overview, the mobile-phone-contract-modification
  campaign example, campaign configuration, quality goals (flexibility broken into four aspects, then into
  scenarios), non-goals, and stakeholders.
- ref:skill/grimorio.system-design/design-orchestrator-exemplar-mama-crm/constraints-context-strategy.md — the source's
  own "Architecture Constraints" (§2), "Context and Scope" (§3), and "Solution Strategy" (§4) sections: general/
  infrastructure/operational constraints, the business and technical/deployment context (generic and the
  telco-example specific case), and the shorthand solution-strategy table linking each quality goal to its
  architectural approach.
- ref:skill/grimorio.system-design/design-orchestrator-exemplar-mama-crm/building-block-runtime-deployment.md — the
  source's own "Building Block View" (§5), "Runtime View" (§6), and "Deployment View" (§7) sections: the
  whitebox decomposition across three levels (MaMa system, Import Handler, Receiver), the Import File runtime
  scenario (raw import + validation), and the campaign-per-VM deployment topology including the Common
  Metadata Store.
- ref:skill/grimorio.system-design/design-orchestrator-exemplar-mama-crm/crosscutting-concepts-decisions.md — the
  source's own "Crosscutting Concepts" (§8) and "Architecture Decisions" (§9) sections: generated persistence
  from a UML domain model, CSV import/export, configurable file filters, the Drools rule engine for process
  control, and the three named architecture decisions with their own rationale.
- ref:skill/grimorio.system-design/design-orchestrator-exemplar-mama-crm/quality-risks-glossary.md — the source's own
  "Quality Requirements" (§10), "Risks and Technical Debt" (§11), and "Glossary" (§12) sections: the
  flexibility/performance/security quality scenarios, the named risks and technical debt, and the domain
  glossary.

Open a companion only when the inline bar-anchor at phase-1-search-first.md's own step 5c genuinely is not
enough and the reader needs that specific section's real text.

---

## Closing note — what this extract does NOT carry, named honestly rather than dropped silently

The original document embeds **18 images** across the index and its twelve arc42 sections, each a static PNG
or JPG hosted in the source repo's own `images/` directory (relative to each page — `images/...` from the
index, `../images/...` from every numbered section). This extract names them explicitly rather than
fabricating a redraw or silently omitting the fact that they exist:

1. `images/mama-logo.jpg` — the index's own overview (elided above).
2. `images/1-generalized-overview.png` — §1 Introduction and Goals, the generalized-overview figure.
3. `images/1-telco-sample-scenario.png` — §1, the Mobile Phone Contract Modification campaign example.
4. `images/1-aspects-of-flexibility.png` — §1, Quality Goals → Flexibility First (untitled alt text in source).
5. `images/egk-sample.png` — §1, Stakeholder → Special Case: German e-Health Card.
6. `images/3-informal-business-context.png` — §3 Context and Scope, the generic business-context diagram.
7. `images/3-business-context.png` — §3, the formal business-context diagram.
8. `images/3-telco-sample-context.png` — §3, the Mobile Phone Contract Modification specific context.
9. `images/3-typical-deployment-context.png` — §3, Technical/Deployment Context.
10. `images/5-MaMa-Level-1.png` — §5 Building Block View, MaMa Whitebox Level 1.
11. `images/5-importHandler.png` — §5, Import Handler (Whitebox), MaMa Level 2 (untitled alt text in source).
12. `images/5-receiver-level-3.png` — §5, Receiver (Whitebox), MaMa Level 3 (untitled alt text in source).
13. `images/9-getRawFile.png` — §6 Runtime View, Import Raw Generic (the source's own path carries a "9-"
    prefix despite living in §6 — an inconsistency in the source, named honestly rather than corrected).
14. `images/9-validateRawData.png` — §6, Validate File (same "9-" path-prefix inconsistency as above).
15. `images/7-deployment-overview.png` — §7 Deployment View, Deployment Overview.
16. `images/8-code-generation-overview.png` — §8 Crosscutting Concepts, Generated Persistence based upon
    Domain Model.
17. `images/8-generic-domain.png` — §8, the Generic Domain Model ("MaMa-Core-Domain").
18. `images/8-specific-domain.png` — §8, the Example for a Campaign Specific Domain Model.

None of these eighteen files is reproduced here — they are not fetched, not redrawn, not approximated. Each
image's place in the document is marked inline above and in the companions with a bracketed `[Image elided:
... — original path ...]` note at the exact point it appears in the source, so a reader can see where visual
content was elided without losing the surrounding text's own meaning.

**Count note, flagged honestly rather than silently reconciled:** the branch objective that produced this
extract records this exemplar as carrying 17 images; a direct count of every `![...]` embed line across all 13
fetched source files (the index plus twelve numbered sections) totals 18, verified live with
`grep -n '!\[' tmp/keeper-exemplar4/notes/mama-src-fetched/*.md`. The list above is the verified count, not the
stated one — recorded here, and as a named FINDING in this agent's own report, rather than silently proceeding
on an unverified number.
