# Design Orchestrator — Exemplar: Iterable/Grafana Dashboard (CEO-authored) — Main Scorecard

@size-exempt: pre-existing size debt (987 lines) -- a verbatim CEO-authored exemplar, quoted rather than
summarized so the calibration bar stays real; a split would fragment one worked example across files.

Companion depth file of ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard.md
(the index — provenance, the why-index-plus-six-companions reasoning, the why-not-split-further reasoning for
THIS file specifically, and the pointer list to all six companions live there). Reached only from the index;
**NEVER referenced directly, and NEVER loaded by default** — same standing as the index itself. This is the
CEO's own original file, verbatim, at its own original 966 lines, deliberately NOT split further — the index's
own "why the main companion is not split further" section states the reasoning; it is not restated here.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte — the
CEO's own `iterable-grafana.md`. A `[Interactive Sankey diagram rendered client-side ...]` bracketed note marks
the one point an embedded interactive chart was elided; the index's own closing note explains it, and the
sibling images (`ppt-slides/slide-NN.png`) referenced inline below are left exactly as the CEO wrote them,
unresolved in this repo — named honestly in the index's own closing note rather than silently dropped. This
file's own internal cross-links to its five siblings (e.g. `iterable-grafana-audience.html`) point at the CEO's
original `.html` site, not at this split's own `.md` companion filenames, and are left verbatim rather than
silently rewritten — the index's own closing note names this explicitly.

---

<!-- VERBATIM SOURCE: iterable-grafana.md BEGINS -->
*One document · silver · gold · A–F green · extras: gold-2 + conversion path · no Iterable REST*

# Build silver and gold-1 for A–D. Slide 10 is a second gold (1 email). Slide 11 is a third gold (conversion × send). Not the same table. Pete is the POC, not a third spec.

> Sufficiency is the query under each panel. Spec is the PPT and the Confluence Grafana design. Pete is a working POC.
>
> Silver: 1 webhook = 1 row, MPS bronze — not CDS `AZRTZTCDS`.
> Gold-1: 5-minute counts, 15 keys. Sparse: `skip_reason`, `recipient_state`, `unsub_source`, `is_bot`, `user_agent_device`. Labels: `campaign_name`, `template_name`.
> Gold-3: click events by `url` ([Confluence Campaign Detail → top URLs](#conf-v3)).
> Gold-2: 1 email — we ship it for [Audience, PPT slide 10](#e).
> Mailbox-ISP gold — for [PPT slide 9](#b-isp): "% of sends reaching inbox" is Confluence deliverability `(send − bounce) / send` by mailbox domain, plus open rate by ISP. Same table. Not Postmaster.
> Audience is green with gold-2 (1 email). EmailType = second token of `campaign_name` (`{site}_{EmailType}_{when}`). No `GET /api/campaigns`. Analysis: [iterable-grafana-audience.html](iterable-grafana-audience.html).
> Revenue is green with one extra gold we own: conversion↔send path (four color pairs on one table). Same parse for first-touch stage. Analysis: [iterable-grafana-revenue.html](iterable-grafana-revenue.html).
> GPM / MX Toolbox are ops ingestions on Grafana Data — not this KPI.

[State](#estado) [Lineage](#lineage) [Silver](#silver) [Gold](#gold) [A](#a) [B](#b) [C](#c) [D](#d) [E Audience](#e) [F Revenue](#f) [Still open](#open) [Audience extension](iterable-grafana-audience.html) [Revenue extension](iterable-grafana-revenue.html) [Field map](iterable-schema-json-vs-silver.html) [Evidence](iterable-dashboard-evidence.html) [Equivalent fields](#alias) [Confluence design](#conf) [7 views](#conf-views)

<a id="estado"></a>
## 0. Final state — what we ship

| Layer / report | Decision | Why |
|---|---|---|
| Silver `iterable_system_email_events` | Build | 1 webhook = 1 row. Keeps `email`. No headers (SasKey). Plan blob as STRING. No silver table today. |
| Gold-1 `iterable_email_event_counts_5min` | Build | 15 keys. Sparse extras: `unsub_source`, `user_agent_device` (NULL on event types that do not carry them — same as `skip_reason`). Labels: `any_value(campaign_name)`, `any_value(template_name)`. Stamp AFID/domain from the send via `message_id`. |
| Gold-2 person `iterable_email_person` | Build for [Audience (PPT slide 10)](#e) | 1 row per email. Lifecycle, DMA, frequency, overlap, age (CUY / enrollments), AFID. **Not** used by A–D, slide 11, or the [7 Confluence views](#conf-views) — those run on gold-1. Slide 11 is a different gold. |
| Path gold `iterable_conversion_sends` | Build for [Revenue (PPT slide 11)](#f) | 1 row = (sale × Iterable send in 90d). $ from policy/enrollment gold. Four color pairs = four SQL on this table. Not gold-2 (no $ on a person cube). Not gold-1 (no email, no $). |
| Gold-3 `iterable_email_clicks_url_5min` | Build for [Confluence Campaign Detail → top clicked URLs](#conf-v3) | Click events only. Keys: bucket, sending_domain, campaign_id, template_id, url. URL on gold-1 would explode the cube. Grafana does not scan silver for top links. |
| Gold mailbox-ISP `iterable_email_mailbox_isp_5min` | Build for [PPT slide 9 Inbox Delivery by ISP](#b-isp) | "% of sends reaching inbox" = Confluence `(send − bounce) / send`, grouped by mailbox domain of `email`. Same table does open/click by ISP. Extra gold because mailbox ISP is on every event (would bloat gold-1). GPM / MX Toolbox are a different Grafana ingest (ops), not this panel. |
| A Campaign Health (slide 7) | Ship | Gold-1. Time is `createdAt` → `bucket_start`. Hour-of-day is `hour(bucket_start)`, not a missing field. |
| B Domain Health (slides 8–9) | Ship · label alias | Slide 8 rates from gold-1 (row text = website footnote). Slide 9: Confluence deliverability + open by mailbox ISP, gold mailbox-ISP. Pete is the POC of this scorecard, not another spec. |
| C AFID | Ship | Not on the PPT; you asked. Gold-1 already has the stamped keys. |
| D Bounce / skip | Ship | Gold-1. Pete Campaign List (`/api/campaigns`) is a POC of campaignState / sendSize — optional, not required for EmailType or for this D panel. |
| Silver `iterable_campaigns` | Not needed for category | Prod names already encode type: `{site}_{EmailType}_{offset}` (Marketing, Newsletter, Trigger, Dispo, Eapp, Sunset, …). Labels on journeys: `EmailType: Dispo`. Blast Marketing has `labels []`. Parse the name. GET /campaigns is optional (state/sendSize only). Pete still prototyped it. |
| E Audience (slide 10) | Ship · + gold-2 | Gold-2 + CUY/AFID/DMA. EmailType = parse `campaign_name`. No catalog GET. Not the Revenue table. Detail: [iterable-grafana-audience.html](iterable-grafana-audience.html). |
| F Revenue (slide 11) | Ship · + path gold | Four color pairs on path gold — not gold-2. $ from policy/enrollment. First-touch stage = parse `campaign_name`. ROI spend unnamed. Detail: [iterable-grafana-revenue.html](iterable-grafana-revenue.html). |

<a id="conf"></a>
## Confluence Grafana design (DPO) — same gold, second spec

First read 2026-08-24. Canonical page: [Grafana Email Deliverability — Dashboard Views Design](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/2280226825) (DPO, v1, no comments). It is a **7-view Grafana spec** on Iterable **system** webhooks, filterable by project and date. Store they wrote: CDS `AZRTZTCDS`. Store we use: MPS bronze → silver → gold-1. Same events, different warehouse. PPT/Pete (A–F below) is the other spec. Gold-1 serves both.

Sister pages on the same wiki (not the 7-view design, but they name the sources):

- [Grafana Data](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/379813889) — Email bucket is five ingestions: (1) Iterable system webhooks, (2) MXToolbox API (DMARC/dq as a time series), (3) GPM / Google Postmaster, (4) Iterable+Everest "likely replace with Grafana", (5) synthetic DNS checks for `dmarc`/`mx`. Inbox % is items 2–3, not the webhook.
- [Google Postmaster Tools](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/1761705991) — Gmail bulk metrics: user-reported spam, reputation, auth, delivery errors. UI `postmaster.google.com` + API. Alert on reputation drop / error-rate increase. Not an Iterable event.
- [Email Marketing KPI Monitoring (Lynn Bass)](https://tz-cloud.atlassian.net/wiki/spaces/~LBass/pages/1993506819) — ops runbook. Open/deliverability/eApp today = Power BI. Send skips = Iterable UI. Inbox placement / sending reputation / Gmail spam rate = **MX Toolbox alerts** (Gmail spam-rate change, DMARC compliance, SPF/DKIM failure) escalated to DOC. Debounce credits are a vendor balance, not a webhook.

### Events they listed vs what we keep

Confluence "Source Events & Available Fields". The Azure Function on `system-webhooks` does not filter event types. Silver is 1 webhook = 1 row of whatever arrives. Unfiltered bronze `GROUP BY eventName`: 7 names, ~555k rows, `dataFields.createdAt` from **2026-08-14 00:02 UTC** (~11 days, **off-AEP**). No `emailSubscribe`. Same window has 3,131 unsubs — worth a webhook check later, not a gold blocker. We still parse subscribe if it starts landing.

| Event | Confluence key fields | Silver | Gold-1 key? |
|---|---|---|---|
| `emailSend` | `campaignId`, `campaignName`, `templateId`, `templateName`, `messageId`, `channelId`, `experimentId`, `labels`, `createdAt` | all except `labels` (not parsed) and `channelId` (project alias — see #alias) | yes; name = `any_value` |
| `emailOpen` | `campaignId`, `templateId`, `messageId`, `userAgentDevice`, `proxySource`, `isBot`, `createdAt` | `is_bot` + `user_agent_device`. `proxySource` not parsed as a key | `is_bot` + device |
| `emailClick` | + `url`, `country` | url / device / geo on silver | device on gold-1. url on gold-3 |
| `emailBounce` | `recipientState` HardBounce / SoftBounce | `recipient_state` as free string (prod also has MailboxFull, …) | yes |
| `emailComplaint` | ids + `createdAt` | yes | via `event_name` |
| `emailUnSubscribe` | + `unsubSource`, `channelId` | `unsub_source`. Wire name has capital S. Prod also has `emailListIds` on **every** unsub (1,872 / 1,872) — keep as STRING, do not explode | rate via `event_name`; `unsub_source` sparse gold-1 key. List ids stay silver |
| `emailSendSkip` | `campaignId`, `messageId`, `reason` (FrequencyCapping / Unsubscribed / HoldOut / etc.), `createdAt`. They said no `templateId` | `skip_reason` free string (prod also CampaignDeactivated). Prod skip rows **do** carry `templateId` (3,262 / 3,262) — Confluence was wrong on that field | yes. Skip analysis is still campaign + reason; template is available if we want it |
| `emailSubscribe` | `signupSource`, `emailListIds` | Parse if it lands. Unfiltered bronze: 0 / ~555k off-AEP. [Comms Audit AEP 2025](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/2526380056) defines this event as the trigger for **post-sale** BPO / Disenrollment journeys — not list signup. List ids / signup live on the [Iterable user profile](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/7505937). | Not a gold-1 KPI. List census is Users/Lists API. |

### Formulas they wrote (Grafana computes; gold stores counts)

| Metric | Confluence | PPT / Pete | Lynn Bass ops | This gold |
|---|---|---|---|---|
| Open | open/send · Human open: `isBot = false` | open/send | <5% after 48h = concern (Power BI today) | open/send, `is_bot IS NOT TRUE` |
| CTR | **click/send** | mock 3.8% next to open 24.7% | — | click/send |
| CTOR | click/open | not on the mock | — | same two SUMs |
| Skip | **skip / (send + skip)** | "% of sends" | skips should be 0 on non-Journey (Iterable UI today) | same counts — Grafana design uses Confluence; PPT wording is the footnote |
| Deliverability / "% reaching inbox" | (send − bounce) / send · warn <97% / crit <95% | PPT slide 9 same words | goal 98%+ · below 95% after 48h (Power BI) | play — this is the metric. By domain = gold-1. By ISP = gold mailbox-ISP. |
| Bounce | all / hard / soft vs send · alert 1.5% / 2% | hard 1/2% | — | `recipient_state` on gold-1 |
| Complaint | complaint/send · 0.08% / 0.1% | 0.05 / 0.1% | Gmail spam-rate change = MX Toolbox, not this ratio | play (Iterable complaint ≠ GPM spam %) |
| Unsub | unsub/send · 0.4 / 0.5% | 0.3 / 0.5% | — | play |

<a id="conf-views"></a>
### The 7 views — panel by panel

Every rate below is Grafana arithmetic on gold-1 `event_count` unless marked gold-3 (URLs).

### View 1 — Project Overview · maps to A · play

Health of one MA project. Dropdown filters every panel. Groups by project (they said domain / `channelId` — we filter `sending_domain`; website host is the B1 footnote).

- KPI row: Sends, Open, CTR, Bounce, Complaint, Unsub, Skip — play (A1–A8)
- Trend: Open, CTR, Bounce, Complaint daily, 14-day default — play (`bucket_start`)
- Send volume bar: daily `emailSend` + `emailSendSkip` stacked — play
- Event breakdown table: count per event type per day — play
- Alert state indicators green/amber/red — Grafana alert UI on the thresholds below, not a gold column

```sql
SELECT date_trunc('day', bucket_start) AS day, event_name, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start) AND sending_domain IN (${project:sqlstring})
GROUP BY 1,2
-- stacked volume = emailSend + emailSendSkip. KPI rates: see A1 (Confluence skip = skips/(sends+skips)).
```

### View 2 — Cross-Project Comparison · maps to B · play · 7 vs 27 names · score weights unspecified

Side-by-side of "all 7 MA projects". PPT slide 8 is 27 websites. Same gold GROUP BY; the row label is the alias. Composite "health score" = weighted average of KPIs, green ≥75 / amber 50–74 / red <50 — they did **not** write the weights. Ship the rate table; the 0–100 gauge waits on weights.

- Horizontal bars: Open, Bounce, Complaint ranked — play
- Summary table: one row per project, seven rates — play (B1)
- Health-score gauge — rates exist; formula for 0–100 does not

```sql
SELECT sending_domain,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS ctr,
  SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS bounce_rate,
  SUM(CASE WHEN event_name='emailComplaint' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS complaint_rate,
  SUM(CASE WHEN event_name='emailUnSubscribe' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS unsub_rate,
  SUM(CASE WHEN event_name='emailSendSkip' THEN event_count ELSE 0 END)
    / NULLIF(
        SUM(CASE WHEN event_name IN ('emailSend','emailSendSkip') THEN event_count ELSE 0 END)
      ,0) AS skip_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1
ORDER BY bounce_rate DESC
```

<a id="conf-v3"></a>
### View 3 — Campaign Detail · maps to A10 + D · play · gold-1 + gold-3

- Campaign table (id, name, seven rates, send date) — play gold-1
- A/B: group by `experiment_id` when not null; else shared `template_id` (Colibri) — play. `labels` not parsed
- Skip by campaign + `reason` — play
- Top clicked URLs — gold-3 (not silver)
- Device pie — gold-1 `user_agent_device` (not gold-2 last-device)

```sql
SELECT experiment_id, campaign_id, campaign_name,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS ctr
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start) AND experiment_id IS NOT NULL
GROUP BY 1,2,3

SELECT user_agent_device, event_name, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name IN ('emailOpen','emailClick') AND is_bot IS NOT TRUE
  AND $__timeFilter(bucket_start)
GROUP BY 1,2

SELECT url, campaign_id, SUM(event_count) clicks
FROM mps_email.gold.iterable_email_clicks_url_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1,2 ORDER BY clicks DESC LIMIT 20
```

### View 4 — Template Performance · not on the PPT · play

Template vs audience: one row per `template_id`, trend, campaigns that used it. Skip is **not** at this grain — skip webhook has no `templateId` (their note, matches the payload).

```sql
SELECT template_id,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS ctr,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END),0) AS ctor,
  SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS bounce_rate,
  count(DISTINCT campaign_id) AS campaigns
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1
-- do not add skip_rate here. emailSendSkip has no template_id to stamp.
```

### View 5 — Send Skip Analysis · maps to D · play

Rising FrequencyCapping = over-send pressure. Keep `skip_reason` as a free string (prod has CampaignDeactivated; they listed FrequencyCapping / Unsubscribed / HoldOut).

- Skip volume and skip-rate trends per project — play
- Reason bar + stacked by project — play
- FrequencyCapping WoW +20% / +40% alert — Grafana alert on the same column

```sql
SELECT date_trunc('day', bucket_start) AS day, sending_domain,
  SUM(CASE WHEN event_name='emailSendSkip' THEN event_count ELSE 0 END) AS skips,
  SUM(CASE WHEN event_name='emailSendSkip' THEN event_count ELSE 0 END)
    / NULLIF(
        SUM(CASE WHEN event_name IN ('emailSend','emailSendSkip') THEN event_count ELSE 0 END)
      ,0) AS skip_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1,2

SELECT skip_reason, sending_domain, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailSendSkip' AND $__timeFilter(bucket_start)
GROUP BY 1,2
```

### View 6 — Bounce Health · maps to D / B2 · play

Hard vs soft. They named HardBounce / SoftBounce; keep the free string so MailboxFull still groups.

```sql
SELECT date_trunc('day', bucket_start) AS day, sending_domain,
  SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS bounce_rate,
  SUM(CASE WHEN event_name='emailBounce' AND recipient_state='HardBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS hard_rate,
  SUM(CASE WHEN event_name='emailBounce' AND recipient_state='SoftBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS soft_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1,2
```

### View 7 — Unsubscribe & Complaint · maps to A + D · play · `unsub_source` on gold-1

- Complaint and unsub rate trends with 0.08/0.1% and 0.4/0.5% lines — play
- Combined table per project — play
- `unsubSource` (EmailLink, UpdateSubscriptionsAPI, …) — gold-1 sparse key, NULL on every non-unsub row

```sql
SELECT unsub_source, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailUnSubscribe' AND $__timeFilter(bucket_start)
GROUP BY 1
```

### Alert thresholds (per project, not global)

| Alert | Confluence warn / crit | Gold column |
|---|---|---|
| Bounce (hard+soft) | 1.5% / 2% | bounce/send on gold-1 |
| Complaint | 0.08% / 0.1% | complaint/send |
| Open-rate drop vs 7-day avg | 5 pts / 10 pts | Grafana vs its own series — no extra table |
| Unsub | 0.4% / 0.5% | unsub/send |
| Skip | 5% / 10% of (send+skip) | skip/(send+skip) |
| FrequencyCapping WoW | +20% / +40% | `skip_reason` |
| Deliverability | <97% / <95% | (send−bounce)/send |

Lynn Bass inbox alerts (Gmail spam-rate change, DMARC, SPF/DKIM) fire in MX Toolbox, not on this cube. Do not pretend gold-1 complaint rate is that alert.

### Open questions on that page — answered here

| # | They asked Jignesh / Tony | Answer for this job |
|---|---|---|
| 1 | Table/view name in `AZRTZTCDS` — one table or many? | Not CDS. One MPS silver: `mps_email.silver.iterable_system_email_events`, `event_name` discriminates the seven types. |
| 2 | Which column is the 7 MA domains — `channelId` / `projectId` / website? | alias — gold-1 rates by `sending_domain` (MailGun). Slide/Confluence "project" row text is website host (headers `key`) or `trk.project`. 7 MA vs PPT 27 is the same footnote, not a missing rate. |
| 3 | Are `recipientState`, `reason`, `unsubSource`, `isBot`, `userAgentDevice`, `experimentId` persisted? | Parse 1:1 scalars. Gold-1 keys: state, reason, is_bot, experiment_id, **unsub_source, user_agent_device**. URL is gold-3, not gold-1. `labels` not parsed. |
| 4 | ETL freshness — Event Consumer vs batch? | Bronze already streaming. Gold-1 = 5-minute job. Alerts fire on warehouse lag, not on the webhook clock. |
| 5 | Read-only account to `AZRTZTCDS`? | Grafana PULL = Databricks SQL warehouse on gold, same pattern as other EDM dashes. Not CDS credentials. |

Deliverability on that page is `(send − bounce) / send` — that is PPT "% of sends reaching inbox". GPM / MX Toolbox are listed as other Grafana ingestions (ops), not this metric. Audience (slide 10) is green with gold-2 — EmailType from `campaign_name`, no REST — [extension](iterable-grafana-audience.html). Revenue (slide 11) is green with path gold — [extension](iterable-grafana-revenue.html).

<a id="lineage"></a>
## 1. Lineage — columns the GROUP BY keeps, and which dash they feed

Left = silver (flat event). Middle = gold-1 cube. Right = Grafana. Green bands are 1:1 into gold. Orange is dropped by GROUP BY (still on silver). Blue is many-to-many into the four deliverability dashes — not one field per report. Fullscreen Sankey: [iterable-column-lineage.html](iterable-column-lineage.html). Every JSON leaf: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html). Panel proof: [iterable-dashboard-evidence.html](iterable-dashboard-evidence.html).

[Interactive Sankey diagram rendered client-side via Plotly.js into `<div id="sankey">` — no static content to transcribe; see the fullscreen version linked above for the same lineage.]

Gold-1 also keeps `unsub_source` and `user_agent_device` (sparse, like `skip_reason`). `url` is gold-3, not this cube. `email` is dropped from gold-1; it is the grain of gold-2.

Same pipeline as layers (gold-2 and warehouse joins), not a second column Sankey:

```text
flowchart TB
  bronze[Bronze payload STRING]
  silver[Silver 1 event 1 row]
  g1[Gold-1 5 min x 15 keys]
  g2[Gold-2 1 email · slide 10]
  g3[Gold-3 clicks x url]
  path[Path gold · slide 11
  conversion × send]
  bronze --> silver
  silver -->|stamp message_id then GROUP BY| g1
  silver -->|GROUP BY email| g2
  silver -->|emailClick only| g3
  silver -->|emailSend in 90d| path
  g1 --> A[A Campaign Health PLAY]
  g1 --> B[B Domain Health PLAY]
  g1 --> C[C AFID PLAY]
  g1 --> D[D Bounce skip PLAY]
  g3 --> V3[View 3 top URLs PLAY]
  gisp[Gold mailbox-ISP]
  silver -->|stamp mailbox_isp| gisp
  gisp --> Bisp[slide 9 deliverability + open by ISP PLAY]
  g2 --> Eplay[E lifecycle frequency overlap PLAY]
  zip[send tpmo.zipCode]
  geo[dim_geography ZipCode]
  dma[dim_geography_dma state county]
  enroll[vw_enrollments_es Age]
  cuy[cuy_leads DOB]
  afidm[afid_master afid]
  pol[vw_policy_fact Email + $]
  g2 --> zip
  zip --> geo
  geo --> dma
  dma --> Edma[E DMA PLAY]
  g2 --> enroll
  g2 --> cuy
  g2 --> afidm
  enroll --> Eage[E age · unknown band if no DOB]
  afidm --> Eacq[E AFID channel PLAY]
  pol --> path
  path --> Fplay[F four color pairs PLAY]
  miss[Not this job]
  miss --> Red2[E Iterable list census · not gold-2]
  miss --> Red3[F email spend / LTV later]
```

<a id="silver"></a>
## 2. Silver — data we will have

Table: `mps_email.silver.iterable_system_email_events`. Grain: 1 row = 1 system-webhook event. Not built yet. Entire `message_headers` object stays out. Leaf-by-leaf map: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html).

| Group | Columns | On gold-1? |
|---|---|---|
| Clock / id | `event_timestamp`, `bronze_row_id`, `message_id`, `event_name` | timestamp → 5-min bucket; message_id stamp only |
| Person | `email` | No. Yes on gold-2 |
| Campaign | `campaign_id`, `campaign_name`, `template_id`, `template_name`, `experiment_id` | Yes (names are `any_value` labels) |
| Domain | `sending_domain` (send); stamped onto the rest | Yes |
| trk | `trk_afid`, vertical, email_type, project, `promo_number`, `sf_tfn`, `call_link`, did, … | 4 keys on gold-1. Two TFNs stay on silver: `promo_number` (e.g. 866-437-0422) and `sf_tfn` (e.g. 551-251-3517), plus `call_link` (`tel:18664370422`) |
| Skip / bounce | `skip_reason`, `recipient_state` | Yes |
| Unsub source | `unsub_source` (EmailLink, UpdateSubscriptionsAPI, …) | Yes — sparse gold-1 key (View 7) |
| List ids / signup | `email_list_ids` STRING (array, do not explode). `signup_source` if subscribe lands | No — silver only. Unsub already has list ids. Subscribe: 0 rows in unfiltered bronze. |
| Open/click | `is_bot`, `user_agent_device`, geo, url, `mailbox_isp` | `is_bot` + `user_agent_device` on gold-1. `url` on gold-3. `mailbox_isp` stamped on silver; extra gold for [slide 9](#b-isp) |
| tpmo zip / FIPS | `tpmo_zip_code`, county FIPS name+fips (send only) | No on gold-1. Yes on silver / gold-2 — DMA join keys |
| plan blob | `med_plans_benefits_json` | No (not on the PPT) |

<a id="gold"></a>
## 3. Gold — what we group

### Gold-1 · A–D and Confluence views 1–2, 4–7 · 15 keys

Sparse keys (`skip_reason`, `recipient_state`, `unsub_source`, `user_agent_device`, `is_bot`) are NULL on event types that do not carry them. GROUP BY does not multiply send rows. Device splits open/click only (~3–5 values). `url` is not a gold-1 key — that is gold-3. Grafana does not scan silver for A–D or the 7 views.

```sql
-- 15 keys. names = any_value.
SELECT
  window(event_timestamp, '5 minutes').start AS bucket_start,
  sending_domain, campaign_id, any_value(campaign_name),
  template_id, any_value(template_name), experiment_id,
  trk_afid, trk_vertical, trk_email_type, trk_project,
  event_name, skip_reason, recipient_state, unsub_source, is_bot, user_agent_device,
  count(*) AS event_count
FROM silver_after_stamp   -- AFID/domain copied from the emailSend of the same message_id
GROUP BY 1,2,3,5,7,8,9,10,11,12,13,14,15,16,17
```

### Gold-3 · View 3 top clicked URLs · click events only

```sql
SELECT
  window(event_timestamp, '5 minutes').start AS bucket_start,
  sending_domain, campaign_id, template_id, url,
  count(*) AS event_count
FROM silver
WHERE event_name = 'emailClick'
GROUP BY 1,2,3,4,5
-- not a gold-1 key. url cardinality would bloat the cube.
```

<a id="gold-isp"></a>
### Gold mailbox-ISP · [PPT slide 9](#b-isp) (Confluence deliverability + open by mailbox)

```sql
-- mailbox_isp stamped on silver from split(email,'@')[1].
-- reaching inbox % = (send - bounce) / send  -- Confluence, not Postmaster.
SELECT
  window(event_timestamp, '5 minutes').start AS bucket_start,
  sending_domain, mailbox_isp, event_name, is_bot,
  count(*) AS event_count
FROM silver
GROUP BY 1,2,3,4,5
-- GPM / MX Toolbox stay on Grafana Data as ops. Not this cube.
```

<a id="gold-2"></a>
### Gold-2 · ships for [Audience (PPT slide 10)](#e) — not slide 11

Gold-1 has no `email` and no zip. Audience joins are gold-2 (and silver). No $ on this table. JSON identifiers, proven against `DESCRIBE`. Full offer / not-offer: [Audience extension](iterable-grafana-audience.html).

| JSON path | On which event | Join to (DESCRIBE) | Gets |
|---|---|---|---|
| `message.email` / `dataFields.email` | all 7 | `edm.gold.cds_persons.email` | city, state, `postalCode`. No DOB (DESCRIBE has no birth column). |
| same `email` | all 7 | `edm.silver.vw_enrollments_es.ApplicantEmailAddress` | person `Age` — applicants. Unknown band for the rest. |
| same `email` | all 7 | `edm.silver.cuy_leads.emailAddress` | `dateOfBirth`. We already push this to Iterable. Do not Users-API it back. Hit rate not run. |
| `dataFields.dataFeed.trk.afid` | send only; stamp via `messageId` | `sns_lead.gold.afid_master.afid` | channel / tactic — the PPT "from Iterable" pie is this write, not a profile pull |
| `dataFields.dataFeed.tpmo.zipCode` | send only; stamp via `messageId` | `edm.gold.dim_geography.ZipCode` | `State`, `County`, `CountyFIPS`. No DMA column on this table. |
| `dataFields.dataFeed.tpmo.countyFIPS[].fips` / `.name` | send only | `dim_geography.CountyFIPS` or `dim_geography_dma.county` | county key. DMA table has no zip. |
| State + County from the zip hop | — | `edm.gold.dim_geography_dma` (`state`, `county` → `dmacode`, `market`) | Nielsen DMA. County string match is the remaining risk. |
| `dataFields.messageId` | almost all | same-table stamp send → open | Copies AFID + zip onto events that do not carry `dataFeed`. Not a CDS person id. |

```sql
SELECT email,
  max(case when event_name='emailSend' then event_timestamp end)        AS last_send_at,
  max(case when event_name='emailOpen' then event_timestamp end)        AS last_open_at,
  max(case when event_name='emailUnSubscribe' then event_timestamp end) AS last_unsub_at,
  count_if(event_name='emailSend') AS send_count,
  count_if(event_name='emailOpen' AND is_bot IS NOT TRUE) AS open_count,
  max(user_agent_device) AS last_device,
  max(trk_afid)          AS last_trk_afid,
  max(campaign_id)       AS last_campaign_id,
  max(tpmo_zip_code)     AS last_zip_code,
  max(tpmo_county_name)  AS last_county_name,
  max(tpmo_county_fips)  AS last_county_fips
FROM mps_email.silver.iterable_system_email_events
GROUP BY email
```

<a id="gold-path"></a>
### Path gold · ships for [Revenue (PPT slide 11)](#f) — not gold-2

Gold-2 is people we emailed. Path gold is a sale joined to the sends that person got in the 90d before it. Grafana reads this table; it does not scan enrollments. Four color pairs are four queries here — not four jobs. Full SQL: [Revenue extension](iterable-grafana-revenue.html).

```sql
-- Grain: 1 row = (conversion × send in lookback). message_id null = Direct.
conversion_id, email, conversion_ts, dollar, dollar_kind,
message_id, campaign_id, campaign_name, send_ts,
days_before, position_from_last, position_from_first

-- Fill. Default conversion = issued policy if DOC is silent.
INSERT INTO mps_email.gold.iterable_conversion_sends
SELECT
  p.PolicyKey, p.Email, p.SignDate, p.PolicyAnnualPremium, 'policy_annual',
  ev.message_id, ev.campaign_id, ev.campaign_name, ev.event_timestamp,
  datediff(p.SignDate, ev.event_timestamp),
  row_number() OVER (PARTITION BY p.PolicyKey ORDER BY ev.event_timestamp DESC),
  row_number() OVER (PARTITION BY p.PolicyKey ORDER BY ev.event_timestamp ASC)
FROM edm.gold.vw_policy_fact p
LEFT JOIN mps_email.silver.iterable_system_email_events ev
  ON lower(ev.email) = lower(p.Email)
 AND ev.event_name = 'emailSend'
 AND ev.event_timestamp BETWEEN p.SignDate - INTERVAL 90 DAYS AND p.SignDate
WHERE p.PolicyAnnualPremium IS NOT NULL AND p.Email IS NOT NULL
```

<a id="alias"></a>
## Equivalent / similar fields — same word, not the same column

These are footnotes / warnings, not partials. The metric exists; the string on the wire is a sibling of the word on the slide. Grafana can display an alias, we can normalize in silver, or add a small gold/map. Partial is only when the number cannot be computed.

| Word people use | Candidates (do not mix) | What we use |
|---|---|---|
| Project / domain (slide 8, 27 rows) | `sendingDomain` = MailGun `marketing.medicareadvantage.com`<br>headers `key` = website `aetna-medicareadvantage.com`<br>`trk.project` = `AMA.com` | Gold-1 rates: `sending_domain`. Slide labels: headers `key` (normalize or extra gold). `trk.project` is dashboard C, not B. |
| Campaign | `campaignId` / `campaignName` (Iterable)<br>`trk.campaign` (tracking string)<br>Catalog `/api/campaigns` `type` / `sendSize` / state | Gold-1: `campaign_id` + `campaign_name`. EmailType = `split(campaign_name, '_')[1]`. GET /campaigns is optional (state/sendSize only). Tracking campaign stays on events silver. |
| Campaign type (slide 7) | `trk.email_type` (Marketing)<br>`trk.vertical` (MA)<br>Campaigns API Blast/Triggered | v1 filter: `trk_email_type` / `trk_vertical`. Lifecycle type on slide 10 = parse `campaign_name` (Marketing, Trigger, Dispo, Eapp, Sunset…). Blast/Triggered is an API `type` — optional GET, not this filter. |
| AFID | `trk.afid` (516075, affiliate)<br>Facebook campaign id (not in this JSON)<br>`afid_master.afid` | Silver + gold-1 stamped from send. Name lookup = `afid_master`. |
| TFN | `promo_number` (866-437-0422)<br>`sf_tfn` (551-251-3517)<br>`call_link` (`tel:` the promo) | All three on silver. Not gold-1 keys. |
| Time / real time / send time | `createdAt` (event clock)<br>gold-1 `bucket_start` (floor 5 min)<br>"in real time" = refresh<br>"by send time" = hour of that clock | A9 = series on `bucket_start`. A12 = `hour(bucket_start)`. Not a missing field. |
| Spam / complaint | PPT `spamComplaint`<br>webhook `emailComplaint` | Silver/gold: `emailComplaint`. SQL with the PPT name returns 0 rows. |
| Unsubscribe | PPT/Pete `emailUnsubscribe`<br>webhook `emailUnSubscribe` | Wire name with capital S. |
| CTR | click / send (slide numbers 3.8% next to open 24.7%)<br>click / open | Grafana: clicks/sends unless they ask otherwise. Same two SUMs. |
| "% of sends reaching inbox" | PPT slide 9<br>Confluence Deliverability Rate = (send − bounce) / send<br>Pete POC used the same webhook counts | That formula, by mailbox ISP on gold mailbox-ISP. GPM / MX Toolbox are ops on Grafana Data, not this number. |
| Skip KPI | Pete: skip **count**<br>PPT: skip % of sends<br>Confluence Grafana: skip / (send + skip) | same counts — ship Confluence formula on the Grafana design; PPT "% of sends" is the footnote. |
| Skip reason | PPT: DataFeedError, EmptyContent<br>Pete dropdown: QuietHours, OverSending, …<br>prod: CampaignDeactivated | Free string `skip_reason`. Do not freeze an enum. |
| Bounce | all bounce / send<br>hard-only (slide 4)<br>`recipient_state` (HardBounce, MailboxFull, …) | Keep `recipient_state` on gold-1. Grafana can do all-bounce or hard-only. |
| Message id | webhook `messageId`<br>`cds_emailevents.msgId`<br>`emailId` | Stamp send→open uses webhook `messageId`. CDS `msgId` is unproven equal. |
| Person id | webhook: none<br>`cds_persons.cdsPersonId`<br>`email` | Join person by `email` only. |
| Age | enrollments `Age` / DOB (applicants)<br>`cds_persons`: no DOB (DESCRIBE)<br>`dim_geography.MedianAge` = census of the **zip** | Person age bands = enrollments. Do not use zip MedianAge. |
| DMA / geo | open `city` / `region`<br>send `tpmo.zipCode` / county FIPS<br>`cds_persons.postalCode`<br>`dim_geography` (zip → County, State; **no DMA column**)<br>`dim_geography_dma` (`dmacode`, `market` by state+county) | DMA = zip → geography → dma table. City/region is not DMA. |
| Acquisition | PPT "Iterable subscriber data" Paid Search / Broker<br>`afid_master.channel`<br>leadsource `utmSource` (lead/AFID, not email) | v1 proxy: AFID channel. Subscriber pie is still missing. |
| Template | `templateId` / `templateName`<br>`trk.template_name`<br>GA4 `templateId` | Gold-1: `template_id`. GA4 join uses that. |

<a id="a"></a>
## A · Campaign Health · slide 7 · ship

**Grafana draft**

Campaign Health — time **30d** · project **$project**

- Sends: 12.4k
- Delivery: 98.2%
- Bounce: 1.4%
- Skip: 2.1%
- Open: 24.7%
- CTR: 3.8%
- Spam: 0.06%
- Unsub: 0.22%

**PPT Katy slide 7**

![slide 7](ppt-slides/slide-07.png)

### A1–A8 KPIs · play · gold-1

```sql
SELECT
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailSendSkip' THEN event_count ELSE 0 END) AS skips,
  SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END) AS bounces,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END) AS opens,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END) AS clicks,
  SUM(CASE WHEN event_name='emailComplaint' THEN event_count ELSE 0 END) AS spam,
  SUM(CASE WHEN event_name='emailUnSubscribe' THEN event_count ELSE 0 END) AS unsubs
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start) AND sending_domain IN (${project:sqlstring})
-- delivery=(sends-bounces)/sends  bounce=bounces/sends
-- skip=skips/(sends+skips)   -- Confluence Grafana design; PPT said "% of sends"
-- open=opens/sends  ctr=clicks/sends  ctor=clicks/opens  spam=spam/sends
```

### A9 volume · A10 campaigns · A11 spam vs send · play

```sql
SELECT bucket_start AS time, SUM(event_count) AS sends
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailSend' AND $__timeFilter(bucket_start)
GROUP BY 1

SELECT campaign_id, campaign_name,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS bounce_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start) GROUP BY 1,2

SELECT bucket_start AS time,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailComplaint' THEN event_count ELSE 0 END) AS spam
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start) GROUP BY 1
```

### A12 by send time · play · slide 7 "campaign type and send time"

Not a gap. Iterable sends `createdAt`; gold-1 keeps it as `bucket_start`. Grafana groups however we want: by day, by 5 min, or by clock hour.

```sql
SELECT hour(bucket_start) AS send_hour,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1
ORDER BY 1
```

<a id="b"></a>
## B · Domain Health · slides 8–9 · ship

**Grafana draft — rows = sending_domain**

Domain Health

| Domain | Delivery | Open | Spam | Bounce |
|---|---|---|---|---|
| marketing.medicareadvantage.com | 95% | 27% | 1.5% | 1.8% |

**PPT slide 8 — websites, no MailGun**

![slide 8](ppt-slides/slide-08.png)

### B1 scorecard · play · warning: row label

Rates are the gold-1 SUMs. The slide's row text is the website; the column is MailGun `sending_domain`. Same entities, different string — alias, map, or a tiny gold. Not a missing rate.

```sql
SELECT sending_domain,
  1 - SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS delivery,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate,
  SUM(CASE WHEN event_name='emailComplaint' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS spam_rate,
  SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS bounce_rate,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS ctr
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY sending_domain
-- Missing for rows to read Aetna-MedicareAdvantage.com:
-- website_host from headers.key (do not copy SasKey) or a 27-row map.
-- sending_domain in prod = marketing.medicareadvantage.com
```

### B2 hard/soft · B3 pie · B4 trend · B5 volume · play

```sql
SELECT recipient_state, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailBounce' AND sending_domain='$project' GROUP BY 1

SELECT event_name, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name IN ('emailOpen','emailClick','emailUnSubscribe','emailComplaint')
  AND sending_domain='$project' GROUP BY 1
```

<a id="b-isp"></a>
### B-ISP · slide 9 "Inbox Delivery by ISP" · play

**PPT slide 9 — one panel. Confluence named the metric. Pete is the POC.**

![slide 9](ppt-slides/slide-09.png)

One ask, two numbers on the same grain. Confluence formula for "% of sends reaching inbox" is deliverability: `(emailSend − emailBounce) / emailSend`. Group it by mailbox ISP = domain of `email` (`gmail.com`, `yahoo.com`). Open rate per ISP is `emailOpen / emailSend` on that same group. GPM / MX Toolbox on Grafana Data are reputation ops, not this panel.

```sql
SELECT mailbox_isp,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  1 - SUM(CASE WHEN event_name='emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS reaching_inbox,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate,
  SUM(CASE WHEN event_name='emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS click_rate
FROM mps_email.gold.iterable_email_mailbox_isp_5min
WHERE $__timeFilter(bucket_start) AND sending_domain = '$project'
GROUP BY 1
-- reaching_inbox = Confluence Deliverability Rate, by mailbox.
-- extra gold: mailbox_isp is on every event; do not put it on gold-1.
```

<a id="c"></a>
## C · AFID · not on the PPT · ship (your ask)

### C1–C3 · play · gold-1 stamp

```sql
SELECT COALESCE(trk_afid,'(none)') afid, trk_project, trk_vertical, trk_email_type,
  SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name='emailSend' THEN event_count ELSE 0 END),0) AS open_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY 1,2,3,4
```

<a id="d"></a>
## D · Bounce / skip · slides 2–4 · ship

**Grafana draft**

Deliverability ops

Skip reasons:

| reason | n |
|---|---|
| CampaignDeactivated | 1.9k |

Bounce state:

| state | n |
|---|---|
| HardBounce | 240 |

**PPT slide 3**

![slide 3](ppt-slides/slide-03.png)

### D1–D4 · play

Skip rate on the Grafana design is Confluence: `skips / (sends + skips)`. PPT said "% of sends" — footnote, same two SUMs. Lynn Bass: skips should be 0 on non-Journey (ops check, not a gold column).

```sql
SELECT skip_reason, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailSendSkip' GROUP BY 1

SELECT recipient_state, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailBounce' GROUP BY 1

SELECT campaign_id, campaign_name, SUM(event_count) n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name='emailBounce' AND recipient_state LIKE '${bounce_type}%'
GROUP BY 1,2 ORDER BY n DESC LIMIT 15
```

### Pete Campaign List · optional · not EmailType

```sql
-- Pete POC: GET /api/campaigns (campaignState, sendSize, Blast/Triggered).
-- Not a D panel. Not required for Audience EmailType — that is on campaign_name.
-- Keep GET only if someone wants Pete's Campaign List columns. See audience extension.
```

<a id="e"></a>
## E · Audience · slide 10 · green · extra: gold-2

Grafana grain: this window vs the previous window of the same length — not % of lifetime list.
Gold-2 (1 email) + CUY / enrollments / AFID / DMA joins.
EmailType = `split(campaign_name, '_')[1]` on the webhook name already in gold-1.
No `GET /api/campaigns`. Not a million-ID bronze. Not Users API.
Full flow, offer / not-offer, and the 12.4% math:
[iterable-grafana-audience.html](iterable-grafana-audience.html).

| Panel | | From |
|---|---|---|
| Lifecycle Active / At-risk / Lapsed / Unsub | play | gold-2 last_open / last_unsub — people we emailed |
| Device & hour | play | gold-2 people; gold-1 event pie = View 3 |
| Frequency + campaign overlap | play | gold-2 / silver |
| DMA | play | gold-2 zip → dim_geography → dim_geography_dma |
| Age <64 / 65–69 / 70+ | play | CUY DOB + enrollments Age. Unknown band for the rest. Not cds_persons. |
| Acquisition Paid Search / Broker | play | AFID master — we already write signupSource into Iterable |
| Growth +12.4% · flow vs flow | play | gold-1. Subscribe as list-join = DOC webhook config. Not 1k/1M lifetime. |
| Churn 3.1% of sends | play | gold-1 (unsub+bounce)/send. Bounce ≠ re-sub. |
| Win-back lift 18.6% | play | Parse `campaign_name` EmailType (Sunset / Trigger / Dispo…). No GET /campaigns. PPT "win-back" is not a prod string — paint EmailType. |

**What we paint — Grafana grain, people we emailed**

Audience · our stream — range **last 90d** · vs **previous 90d**

- Growth · flow vs flow: +12.4%
- Churn of sends: 3.1%
- Win-back lift: +18.6%
- Active 30d: 58%

Device:

| device | people |
|---|---|
| mobile | — |

Hour: `hour(last_open)`

**PPT slide 10 — same panels, our tables + EmailType from the name**

![slide 10](ppt-slides/slide-10.png)

### E1 lifecycle · play · gold-2

```sql
SELECT
  CASE
    WHEN last_unsub_at IS NOT NULL THEN 'Unsubscribed'
    WHEN last_open_at >= current_date - 30 THEN 'Active'
    WHEN last_open_at >= current_date - 60 THEN 'At-risk'
    ELSE 'Lapsed'
  END AS lifecycle,
  count(*) AS people
FROM mps_email.gold.iterable_email_person
GROUP BY 1
```

### E2 device + hour · play · gold-2 people · gold-1 event pie is View 3

Gold-2 `last_device` = people. Confluence View 3 pie = event counts on gold-1 `user_agent_device`. Do not mix them.

```sql
SELECT last_device, count(*) people
FROM mps_email.gold.iterable_email_person GROUP BY 1

SELECT hour(last_open_at) AS hr, count(*) people
FROM mps_email.gold.iterable_email_person GROUP BY 1
```

### E3 frequency and campaign overlap · play

```sql
SELECT send_count, open_count, count(*) people
FROM mps_email.gold.iterable_email_person GROUP BY 1,2

SELECT email, count(DISTINCT campaign_id) campaigns
FROM mps_email.silver.iterable_system_email_events
WHERE event_name='emailSend' GROUP BY 1
HAVING count(DISTINCT campaign_id) >= 2
```

### E4 DMA · play · gold-2 join · DESCRIBE-proven hop

`dim_geography` has `ZipCode`, `State`, `County`, `CountyFIPS` — no DMA column. `dim_geography_dma` has `dmacode`, `market` keyed by `state`+`county` — no zip. JSON key is send `tpmo.zipCode` (or FIPS). Fallback: `email` → `cds_persons.postalCode` if that person exists in CDS.

```sql
SELECT dma.dmacode, dma.market, count(*) AS people
FROM mps_email.gold.iterable_email_person p
LEFT JOIN edm.gold.dim_geography g
  ON g.ZipCode = p.last_zip_code
LEFT JOIN edm.gold.dim_geography_dma dma
  ON dma.state = g.State
 AND lower(dma.county) = lower(g.County)
GROUP BY 1, 2
-- Remaining risk: county string (Brevard vs Brevard County). Test on a sample.
-- dim_geography.MedianAge is census age of the ZIP, not the subscriber. Do not use it for E5.
```

### E5 age · play · CUY + enrollments · unknown band for the rest

Webhook has no DOB. We join `edm.silver.cuy_leads.dateOfBirth` (already pushed to Iterable via APIM) and enrollments `Age`. Do not round-trip Users API. `cds_persons` has no DOB (DESCRIBE). Hit rate not run — unknown is a band, not a blocker. Math and why: [extension](iterable-grafana-audience.html#offer).

```sql
SELECT
  CASE
    WHEN coalesce(e.Age, floor(months_between(current_date, c.dateOfBirth)/12)) < 65 THEN '<64'
    WHEN coalesce(e.Age, floor(months_between(current_date, c.dateOfBirth)/12)) < 70 THEN '65-69'
    WHEN coalesce(e.Age, floor(months_between(current_date, c.dateOfBirth)/12)) IS NOT NULL THEN '70+'
    ELSE 'unknown'
  END AS band,
  count(*) people
FROM mps_email.gold.iterable_email_person p
LEFT JOIN edm.silver.vw_enrollments_es e ON e.ApplicantEmailAddress = p.email
LEFT JOIN edm.silver.cuy_leads c ON lower(c.emailAddress) = lower(p.email)
GROUP BY 1
-- DESCRIBE cds_persons: no DOB. ZIP MedianAge is census, not this panel.
```

### E6 acquisition · play · AFID we already write

The PPT "FROM ITERABLE" pie is `signupSource` / `afid` we push. Join `afid_master`. Do not pull the profile back.

```sql
SELECT am.channel, am.sub_channel, count(*) people
FROM mps_email.gold.iterable_email_person p
LEFT JOIN sns_lead.gold.afid_master am ON am.afid = p.last_trk_afid
GROUP BY 1,2
```

### E7 growth + churn of sends · play · Grafana formula, not lifetime %

+12.4% = neto(this range) / neto(previous range) − 1. Unsub is gold-1. Subscribe as list-join is DOC webhook config (0 rows today; Comms Audit = post-sale BPO). Churn of sends = (unsub+bounce)/send. Not 1,000 / 1,000,000 of the padrón. Why the million-ID bronze is not this panel: [extension § 12.4%](iterable-grafana-audience.html#math).

```sql
-- Churn of sends this window vs previous. Bounce is not re-sub.
SELECT
  SUM(CASE WHEN event_name IN ('emailUnSubscribe','emailBounce') THEN event_count END)
    / SUM(CASE WHEN event_name='emailSend' THEN event_count END) AS churn_of_sends
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}

-- Growth flow vs flow. Subscribe lands if DOC enables list-join.
SELECT
  (SUM(CASE WHEN event_name='emailSubscribe' THEN event_count ELSE 0 END)
   - SUM(CASE WHEN event_name='emailUnSubscribe' THEN event_count ELSE 0 END))
  AS neto
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}
```

### E8 win-back lift · play · parse `campaign_name`

Mock text is campaign lift, not unsub-then-subscribe. Prod names are `{site}_{EmailType}_{when}` — `AFL.com_Marketing_Aug`, `MA.com_Trigger_5day`, `MA.com_Sunset_0day`. PPT words welcome / nurture / win-back are not in prod; paint EmailType. No catalog GET. Detail: [extension § EmailType](iterable-grafana-audience.html#job).

```sql
-- EmailType is token 2 of the webhook name already on gold-1. No JOIN, no REST.
SELECT split(campaign_name, '_')[1] AS email_type,  -- Marketing, Trigger, Dispo, Eapp, Sunset, …
       SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count END)
         / SUM(CASE WHEN event_name='emailSend' THEN event_count END) AS open_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}
GROUP BY 1
```

<a id="f"></a>
## F · Revenue · slide 11 · green · extra: path gold

Four color pairs. One conversion, the emails before it, four ways to give that $ to those emails.
Extra we own: path gold. First-touch stage = same EmailType parse as Audience — no catalog GET.
Full analysis: [iterable-grafana-revenue.html](iterable-grafana-revenue.html).

| Pair | | From |
|---|---|---|
| Purple · last-touch + campaign ROI | play | last send on the path. $ per send from gold-1. ROI unlabeled without email spend. |
| Teal · first-touch + lifecycle | play | first send + `split(campaign_name, '_')[1]` |
| Orange · linear + email vs direct | play | $ / n sends. Empty path = direct |
| Navy · time-decay + LTV | decay · LTV later | weight by days-before. LTV = commissions, later card |

**What we paint — conversion gold**

Revenue attribution · path of sends

- Attributed $: $
- Conversions: n
- ROI: if cost

**PPT slide 11**

![slide 11](ppt-slides/slide-11.png)

### F1 credit models · path of sends

```sql
-- Grafana reads path gold. Last / first / linear / decay = four filters on this table.
-- Not gold-2. Not a scan of enrollments.
SELECT campaign_id, sum(dollar) AS dollar
FROM mps_email.gold.iterable_conversion_sends
WHERE position_from_last = 1
  AND conversion_ts BETWEEN ${__from} AND ${__to}
GROUP BY 1
```

### F-partial · GA4 funnel by template · not the slide

```sql
SELECT g.templateId, g.SessionStart, g.formSubmission, g.eAppStep1
FROM edm.gold.ga4_iterable_fact g
JOIN mps_email.gold.iterable_email_event_counts_5min c
  ON c.template_id = g.templateId
-- sessions/forms, not $. Keep as a funnel footnote.
```

## 4. Grouped fields (gold-1) × report

| Gold-1 column | A | B | C | D |
|---|---|---|---|---|
| `bucket_start` | yes | yes | filter | filter |
| `sending_domain` | filter | rows | filter | filter |
| `campaign_id` / name | table | — | — | top |
| `template_id` / name | filter · View 4 | — | — | — |
| `experiment_id` | View 3 A/B | — | — | — |
| `trk_afid` vertical email_type project | filter | — | rows | — |
| `event_name` + `event_count` | rates | rates | rates | rates |
| `skip_reason` | — | — | — | pie |
| `recipient_state` | — | hard/soft | — | pie |
| `unsub_source` | — | — | — | View 7 |
| `is_bot` | open/CTR | open | open | — |
| `user_agent_device` | View 3 pie | — | — | — |

`email`, zip, and FIPS are not on gold-1: they are gold-2 / silver, which is why audience joins do not run on the 5-min cube. `url` is gold-3. If `email` is dropped from silver, E, mailbox_isp, and any person join die.

<a id="open"></a>
## 5. Still not on this webhook

Audience and Revenue are two extras, two golds — not one table.
[Slide 10 = gold-2](iterable-grafana-audience.html).
[Slide 11 = path gold](iterable-grafana-revenue.html).
EmailType is a parse, not a third table. No Iterable REST for either.

| # | PPT panel | Confluence | This job |
|---|---|---|---|
| 1 | E list / age / Paid Search / win-back | Closed. Grafana grain = period vs previous. EmailType from `campaign_name`. CUY/AFID/DMA are our tables. No GET /campaigns. | green · + gold-2 — [extension](iterable-grafana-audience.html) |
| 2 | F four color pairs | Closed. Path gold from policy/enrollment $ × silver sends. ROI spend unnamed. LTV later. | green · + path gold — [extension](iterable-grafana-revenue.html) |

Not blockers:

| # | Item | Note |
|---|---|---|
| 3 | Website hostname / 7 MA vs 27 | Alias of `sending_domain`. Headers `key` only; never SasKey. |
| 4 | View 2 composite 75/50 | Rates play. Weights for the 0–100 gauge were not written. |
| 5 | Skip % wording | Confluence skip/(send+skip). PPT "% of sends". Same two SUMs. |
| 6 | Win-back / welcome / nurture strings | Not in prod names. Paint EmailType (Marketing, Trigger, Dispo, Eapp, Sunset…). DOC maps those words if they want the mock labels. GET not required. |
| 7 | GPM / MX Toolbox | Grafana Data ops ingestions. Not the deliverability KPI. |

Samples still worth running: DMA county string match; webhook email hit rate on CUY DOB; `messageId` vs `msgId`. DOC: enable/confirm `emailSubscribe` as list-join. No Iterable `Api-Key` required for EmailType. GET /campaigns stays optional (state/sendSize only).

---

**Footer**

PPT: `ppt-slides/slide-01.png`–`12.png` from Grafana Iterable Uses.odp.
Confluence: DPO [Grafana Email Deliverability — Dashboard Views Design](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/2280226825)
+ [Grafana Data](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/379813889)
+ [Google Postmaster Tools](https://tz-cloud.atlassian.net/wiki/spaces/DPO/pages/1761705991)
+ Lynn Bass [Email Marketing KPI Monitoring](https://tz-cloud.atlassian.net/wiki/spaces/~LBass/pages/1993506819).
One-day gold-1 sample (without device/unsub split measured separately): 10808 / 26321 = 2.4×.
DESCRIBE used: `edm.gold.cds_persons`, `edm.gold.dim_geography_dma`, `edm.gold.dim_geography`. Age join: `edm.silver.cuy_leads.dateOfBirth`, `edm.silver.vw_enrollments_es.Age`.
Scorecard: this file. Audience: [iterable-grafana-audience.html](iterable-grafana-audience.html).
Revenue (open until closed): [iterable-grafana-revenue.html](iterable-grafana-revenue.html).
Field map: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html).
Evidence: [iterable-dashboard-evidence.html](iterable-dashboard-evidence.html).
Lineage: [iterable-column-lineage.html](iterable-column-lineage.html).
<!-- VERBATIM SOURCE: iterable-grafana.md ENDS -->
