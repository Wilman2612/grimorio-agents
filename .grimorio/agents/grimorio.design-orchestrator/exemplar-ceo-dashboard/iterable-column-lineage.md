# Design Orchestrator — Exemplar: Iterable/Grafana Dashboard (CEO-authored) — Column Lineage

Companion depth file of ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard.md
(the index — provenance, the why-index-plus-six-companions reasoning, and the pointer list to all six
companions live there). Reached only from the index; **NEVER referenced directly, and NEVER loaded by default**
— same standing as the index itself. This is the CEO's own original file, verbatim, at its own original length
— a single distinct concern (column-level lineage), never merged into the main scorecard companion.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the CEO's own `iterable-column-lineage.md`. A `[Chart: interactive Plotly Sankey diagram ...]` bracketed note
marks the one point an embedded interactive chart was elided; the index's own closing note explains it. This
file's own internal cross-links to its siblings (e.g. `iterable-grafana.html`,
`iterable-schema-json-vs-silver.html`, `iterable-dashboard-evidence.html`) point at the CEO's original `.html`
site, not at this split's own `.md` companion filenames, and are left verbatim rather than silently rewritten —
the index's own closing note names this explicitly.

---

<!-- VERBATIM SOURCE: iterable-column-lineage.md BEGINS -->
*Column-level lineage · Sankey · now a reference picture*

Scorecard: [iterable-grafana.html](iterable-grafana.html). Sign-off queries: [iterable-dashboard-evidence.html#lineage](iterable-dashboard-evidence.html#lineage). Field map: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html).

# What grouping keeps, and what it throws away.

Left is the flat event (silver). Middle is the 5-minute cube (gold). Right is Grafana. Same 14 silver names on the left become the same 14 gold names in the middle (event_timestamp → bucket_start). event_count is new (COUNT of rows). Lost buckets: 4 + 8 + 18 + 13 + 27 = 70. Survive 14 + lost 70 = 84 silver columns.

Legend:
- Silver
- Gold cube
- Lost in GROUP BY
- Dash

[Chart: interactive Plotly Sankey diagram rendered here (silver → gold → dash flow). The diagram's node/link data is the same lineage captured in the lists and table below.]

## Silver survive · 14 columns

- `event_timestamp` — **→ bucket_start**
- `sending_domain` — **GROUP BY**
- `campaign_id` — **GROUP BY**
- `campaign_name` — **label only**
- `template_id` — **GROUP BY**
- `experiment_id` — **GROUP BY**
- `trk_afid` — **GROUP BY**
- `trk_vertical` — **GROUP BY**
- `trk_email_type` — **GROUP BY**
- `trk_project` — **GROUP BY**
- `event_name` — **GROUP BY**
- `skip_reason` — **GROUP BY**
- `recipient_state` — **GROUP BY**
- `is_bot` — **GROUP BY**

Columns dropped in GROUP BY:

- `email, email_id, email_subject, message_id` — **4**
- `trk_campaign program template promo tfn did call_link encoded` — **8**
- `tpmo_* (17 cols) + med_plans_benefits_json` — **18**
- `ip user_agent device proxy city region country tz url link tracked href` — **13**
- `created_at raw, template_name, workflow, locale, labels, esp, catalogs, bounce_msg, unsub, ops` — **27**

## Gold · same 14 names + count

- `bucket_start` — **from event_timestamp**
- `sending_domain` — **same name**
- `campaign_id` — **same name**
- `campaign_name` — **any_value, not GROUP BY**
- `template_id` — **same name**
- `experiment_id` — **same name**
- `trk_afid` — **same name**
- `trk_vertical` — **same name**
- `trk_email_type` — **same name**
- `trk_project` — **same name**
- `event_name` — **same name**
- `skip_reason` — **same name**
- `recipient_state` — **same name**
- `is_bot` — **same name**
- `event_count` — **COUNT(*) — new**

## Dash · uses those gold names

- `bucket_start` — **time A B C D**
- `sending_domain` — **$project · B**
- `campaign_id / campaign_name` — **$campaign · A D**
- `template_id` — **$template**
- `experiment_id` — **A/B filter**
- `trk_afid vertical email_type trk_project` — **C**
- `event_name + event_count` — **KPI rates all**
- `skip_reason` — **D**
- `recipient_state` — **B and D**
- `is_bot` — **A open/CTR**
- `the other 70 silver columns` — **not on dash**

## Gold field × dashboard — not 1:1

Silver → gold is one field to one field. Gold → dash is not. Every dashboard reads the shared core (time + event_name + event_count) plus a few extras. A panel like "skip pie" looks like one field; the rate still needs sends in the same filters.

| Gold field | A Campaign | B Domain | C AFID | D bounce/skip |
| --- | --- | --- | --- | --- |
| bucket_start | time | time | time | time |
| event_name | KPI | KPI | KPI | KPI |
| event_count | SUM | SUM | SUM | SUM |
| sending_domain | filter | rows | filter | filter |
| campaign_id / campaign_name | table | — | — | top N |
| template_id | filter | — | — | — |
| experiment_id | filter | — | — | — |
| trk_afid | filter | — | rows | filter |
| trk_vertical / email_type / trk_project | — | — | rows | — |
| is_bot | open/CTR | — | — | — |
| recipient_state | — | hard/soft | — | bounce pie |
| skip_reason | — | — | — | skip pie |

Counts: 14 keep + 4 + 8 + 18 + 13 + 27 = 84 silver columns. tpmo = 17 typed cols (not 18 JSON leaves). Plan blob = 1 STRING. Field map: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html). Scorecard: [iterable-grafana.html](iterable-grafana.html).
<!-- VERBATIM SOURCE: iterable-column-lineage.md ENDS -->
