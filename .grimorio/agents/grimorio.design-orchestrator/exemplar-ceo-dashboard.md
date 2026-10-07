# Design Orchestrator — Exemplar: Iterable/Grafana Email-Deliverability Dashboard (CEO-authored)

A companion reference file in the `system-design` skill, the same tier and mechanism as
ref:agent/grimorio.design-orchestrator/exemplar-grpc-retries.md,
ref:agent/grimorio.design-orchestrator/exemplar-mama-crm.md, and
ref:memory/grimorio.system-design-memory/project.design-orchestrator-exemplar-ceo-spend-contract.md — the FULL, real
text of a human-vetted design document, held here as an INDEX plus six verbatim companion files, not a
distillation or a "why this is good" essay layered on top of fragments. This file exists so a bar-anchor for a
DASHBOARD-TYPE AS-IS problem does not depend on re-fetching or re-copying this content on every design run, and
so the CEO can audit the exemplar's actual content inside the repo. **NEVER load this file by default.** The
standing bar-anchor this file backs (diagrams/tables/SQL only, zero use-case diagrams because that question was
already closed for this problem, one bounded question per file, sufficiency checked query-by-query rather than
by a summary paragraph, a blocked panel named as blocked rather than silently dropped) belongs inline wherever a
`system-design` phase step holds it; this file backs that inline statement only when a reader genuinely needs
to go deeper.

**Why an index plus six companions, not one file, and not a re-split either** — the six CEO source files total
2,733 lines, several times over the ~500-line smell threshold
(ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 23) that makes an index-plus-companions split
the default remedy for an oversized skill reference/exemplar file
(ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md — step 2 of its own Steps
section). The CEO's own six files already ARE a deliberate split — one bounded question per file (the main
scorecard covers the core A-F panel decisions; Audience and Revenue are each a separate "extra" question the
CEO scoped into its own file; column lineage, the JSON-vs-silver field map, and the evidence pack are each a
single distinct concern) — so this pass preserves that boundary exactly as the companion boundary, rather than
inventing a different cut or merging anything back together. Nothing here is trimmed: every word each of the
six source files wrote still exists in the tree, filed under its own same-named companion, one hop away from
this index.

**Why the main companion (`iterable-grafana.md`, 966 lines) is NOT split further, stated explicitly rather than
left an unexplained exception** — at 966 lines it crosses the ~500-line smell threshold on its own, more than
the other five companions combined stay under. This dispatch's own placement judgment is that it is NOT split
further, because doing so would fragment the CEO's own deliberate one-scorecard-one-file organization: the file
carries a single bounded decision (the A-F panel scorecard plus its own comparison against a second, independent
Confluence design spec) held together by the CEO's own internal cross-references (`#estado`, `#lineage`,
`#silver`, `#gold`, `#a` through `#f`, `#conf`, `#conf-views`, `#alias`) that all point WITHIN this one file —
splitting it would sever content the CEO himself deliberately wrote to be read as one continuous decision record,
which is exactly the second of the two legitimate LAST-RESORT grounds step 2 above names ("splitting would sever
content that has to be read together"), not a bare unchallenged size-justification.

**The identical reasoning, named honestly rather than left silent, ALSO covers `iterable-dashboard-evidence.md`
(758 source lines) — a second file this dispatch's own brief did not call out by name, but which crosses the
same threshold for the same reason.** It is one continuous evidence pack, held together by its own internal
table of contents (`#cube`, `#a` through `#d`, `#blocked`, `#audience`, `#lineage`) all pointing within itself,
proving sufficiency panel-by-panel against a single named gold table — splitting it would sever the exact
"query, then its evidence, then the next query" reading order the CEO built it in. This entry was added by the
authoring pass itself, not the original dispatch brief, precisely so this index does not silently leave a
second oversized companion unexplained while naming only the first — flagged explicitly in this authoring
pass's own report back to `grimorio.system-keeper` rather than resolved invisibly.

The remaining four companions each already sit at, or well under, a size a reader can hold in one place —
Audience and Revenue are the CEO's own separately-bounded "extra" questions, and lineage/field-map are each a
single distinct concern —
so none of them raises the same question.

## Provenance — SOURCE ONLY, never a load instruction

**Title:** Iterable/Grafana Email-Deliverability Dashboard — AS-IS Technical Design (six-file scorecard +
extensions + evidence)
**Author:** the CEO
**What it is:** a real, human-authored AS-IS technical design of a dashboard-type problem — replacing an
ad-hoc Grafana/Iterable email-deliverability mockup with a data-warehouse-grounded scorecard (silver event
table, several gold cubes, panel-by-panel SQL) — written by the CEO himself, in a professional capacity outside
this repo's own arena platform, as a worked exemplar of how a DASHBOARD-TYPE AS-IS problem should be documented:
diagrams/tables/SQL only, zero use-case diagrams (that question was already closed for this problem before this
document was written), one bounded question per file, sufficiency checked query-by-query against a named gold
table rather than by a summary paragraph, and every blocked or gapped panel named as blocked/gapped rather than
silently dropped or invented around.
**License:** N/A — internal CEO-authored work product, not a third-party publication.

This clears ref:skill/grimorio.reasoning-principles/exemplar-grounding.md's own origin test on its FIRST,
stronger branch, not its second: the test states that an instance a human — the CEO, or a human reviewer — has
explicitly vetted as good is a VALID exemplar in its own right, including a repo instance the CEO points at and
says to use. This is exactly that case, the same branch ref:memory/grimorio.system-design-memory/project.design-orchestrator-exemplar-ceo-spend-contract.md's
own provenance section already clears for the sibling functionality-type exemplar. It is NOT the second branch
the gRFC A6 and MaMa-CRM sibling exemplars clear (real, external, human/process-vetted by a party outside this
repo) — this document was never published externally and was never subject to an outside review gate; its
validity rests entirely on the CEO's own authorship and his own act of holding it up as the form ground truth
for a dashboard-type problem. Stating it as "external" anywhere would misrepresent its actual provenance; it is
internal, CEO-authored, and CEO-vetted by construction.

**NEVER treat the `tmp/` staging copies this content was read from as these extracts' source of record** — the
six source files were supplied to this authoring pass as working copies for landing, not as a permanent repo
location; once landed, this file and its six companions are the durable copies going forward, per
ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 17's bar against citing a `tmp/` path as the
source of a signed decision.

---

**Everything below this line, until the closing note, is the source document's own text, substantially as
written — not a summary, not a rubric extracted from it.**

---

The six source files each open with their own title line and their own cross-links to their siblings, so this
index does not restate their opening content the way the two prior split exemplars restate a single source
document's own Abstract/Overview — there is no single shared opening paragraph across six independently-titled
CEO files. Read the companion you actually need; the six-file map below states, in one line each, what
question it is bounded to and how the CEO's own files already cross-reference one another.

## The companions — reached only from here, never referenced directly

Six depth files, each holding one of the CEO's own six source files, verbatim, under its own original title —
the CEO's own file boundary, unchanged:

- ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard/iterable-grafana.md — the main
  scorecard (966 lines, NOT split further — see "why the main companion is not split further" above): the
  final-state decision table for every silver/gold layer, the comparison against a second, independent
  Confluence Grafana design spec (same gold, second spec), the column lineage summary, the silver/gold table
  definitions, and the panel-by-panel SQL + Grafana mockups for reports A (Campaign Health) through D
  (Bounce/Skip), plus pointers out to the two extension companions below for E (Audience) and F (Revenue).
- ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard/iterable-grafana-audience.md —
  the Audience extension (PPT slide 10): why a second, person-grain gold table is needed on top of the main
  scorecard's 5-minute event cube, the EmailType-from-webhook-name parse that needs no additional REST call,
  and a full worked comparison of what Grafana can and cannot paint for this one bounded question.
- ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard/iterable-grafana-revenue.md —
  the Revenue extension (PPT slide 11): the four-credit-model (last/first/linear/decay) conversion-attribution
  problem, the extra conversion-to-send path table it needs, and the same green/not-shipped discipline as the
  Audience companion, for this one bounded question.
- ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard/iterable-column-lineage.md — a
  single distinct concern: column-level lineage from the flat silver event table through the 5-minute gold
  cube to the dashboards that actually read each surviving column, naming exactly which columns are dropped in
  the `GROUP BY` and why.
- ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard/iterable-schema-json-vs-silver.md
  — a single distinct concern: the full JSON-leaf-to-silver-column field map, from the raw webhook payload
  through every nested object (`dataFeed.trk`, `dataFeed.tpmo`, `dataFeed.med_plans_benefits`) down to the one
  silver column each leaf becomes, and whether that column ever reaches gold.
- ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard/iterable-dashboard-evidence.md —
  a single distinct concern: the evidence pack proving sufficiency query-by-query against the actual gold
  table for every panel in reports A through D, and naming every panel that is BLOCKED (no gold query exists)
  rather than asserting sufficiency by appearance.

Open a companion only when the index's own framing genuinely is not enough and the reader needs that specific
file's real text.

---

## Closing note — what this extract does NOT carry, named honestly rather than dropped silently

The six source files embed content a plain-markdown copy cannot reproduce, named explicitly here rather than
silently dropped, the same honest-naming discipline the two sibling exemplars already use for the images they
could not carry:

1. **`iterable-grafana.md` and `iterable-column-lineage.md` each embed a live, interactive Plotly Sankey
   diagram, rendered client-side in the original HTML.** `iterable-grafana.md`'s own source states this
   inline, verbatim, at the exact point the diagram appears: *"[Interactive Sankey diagram rendered
   client-side via Plotly.js into `<div id="sankey">` — no static content to transcribe; see the fullscreen
   version linked above for the same lineage.]"* — this extract carries that same bracketed elision note,
   unedited, in its companion. `iterable-column-lineage.md` is itself the "fullscreen version" that first
   source line points at, and its own companion here carries the SAME kind of elision at its own equivalent
   point, marked `[Chart: interactive Plotly Sankey diagram rendered here (silver → gold → dash flow). The
   diagram's node/link data is the same lineage captured in the lists and table below.]` — in both cases the
   surrounding lists and tables that describe the SAME lineage in text are carried in full, so no information
   the diagrams convey is lost, only their interactive rendering.
2. **`iterable-grafana.md`, `iterable-grafana-audience.md`, `iterable-grafana-revenue.md`, and
   `iterable-dashboard-evidence.md` all reference PPT slide screenshots exported from the CEO's own
   `Grafana Iterable Uses.odp` presentation**, at paths like `ppt-slides/slide-07.png` through
   `ppt-slides/slide-11.png` (and the evidence companion additionally references `slide-01.png` through
   `slide-12.png` in its own footer). None of these PNG files is included in this extract — they are not
   fetched, not redrawn, not approximated. Every reference to one is left exactly where the CEO's own source
   places it (an inline `![slide N](ppt-slides/slide-NN.png)` image tag that will not resolve to an actual
   image in this repo), rather than silently stripped, so a reader can see precisely where a visual mockup
   informed the CEO's own decision even though the mockup image itself is not carried.
3. **Every companion's own internal cross-links to its five siblings** (e.g. `iterable-grafana.md`'s own
   `[extension](iterable-grafana-audience.html)`, or `iterable-dashboard-evidence.md`'s own
   `[iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html)`) are left exactly as the CEO
   wrote them — pointing at `.html` filenames from the CEO's own original site, not at this split's own
   `.md` companion filenames. They are the SAME six documents this split's own companion list above already
   names by their real `.md` basenames; the `.html` links do not resolve here and are left verbatim rather
   than silently rewritten, the same discipline the MaMa-CRM sibling exemplar already applies to its own now-
   unresolvable `examples.arc42.org` routing links.
