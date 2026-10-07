# Design Orchestrator — Exemplar: Iterable/Grafana Dashboard (CEO-authored) — Evidence Pack

@size-exempt: pre-existing size debt (778 lines) -- same reason as its sibling `iterable-grafana.md`: a
verbatim CEO-authored exemplar, quoted rather than summarized so the calibration bar stays real.

Companion depth file of ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard.md
(the index — provenance, the why-index-plus-six-companions reasoning, and the pointer list to all six
companions live there). Reached only from the index; **NEVER referenced directly, and NEVER loaded by default**
— same standing as the index itself. This is the CEO's own original file, verbatim, at its own original length
— a single distinct concern (proving sufficiency query-by-query against the real gold table for every panel),
never merged into the main scorecard companion.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the CEO's own `iterable-dashboard-evidence.md`. This file references PPT slide screenshots
(`ppt-slides/slide-NN.png`) exactly where the CEO's own source places them; the index's own closing note names
this elision explicitly. This file's own internal cross-links to its siblings (e.g. `iterable-grafana.html`,
`iterable-schema-json-vs-silver.html`, `iterable-column-lineage.html`) point at the CEO's original `.html`
site, not at this split's own `.md` companion filenames, and are left verbatim rather than silently rewritten —
the index's own closing note names this explicitly.

---

<!-- VERBATIM SOURCE: iterable-dashboard-evidence.md BEGINS -->
# Evidence — each Grafana panel vs Katy's slide vs gold query

*Evidence pack · not a trust report · Katy ODP slides are screenshots of the file*

# Each panel: the slide she drew, the Grafana we would ship, the SQL, the gold columns that query touches.

**Sufficiency is checked query-by-query, not by a summary paragraph.**

If a SELECT can be written against `mps_email.gold.iterable_email_event_counts_5min` and the result columns match the panel, the cube is enough.
If the SELECT needs a column the cube does not keep, that panel is blocked — the missing column is named.
Field map: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html).
Scorecard: [iterable-grafana.html](iterable-grafana.html).

## Table of contents

[0 Cube](#cube) [A Campaign Health](#a) [B Domain Health](#b) [C AFID](#c) [D Bounce / skip](#d) [Blocked on gold-1](#blocked) [Audience · other golds](#audience) [Lineage from these queries](#lineage)

## Legend

- `used` in that panel's SELECT
- `on gold` but not this panel
- `compressed` still on silver, not on gold
- `missing` nowhere in webhook / cube

## 0. The table every KEEP query reads

Databricks can have **several gold tables**. Gold-1 below is only the deliverability cube (no email). Audience is a different gold if we build it. The AFID "join" is silver to silver on `message_id`, not a person table.

Grafana A–D do not query silver. Rates are ratios of `event_count` by `event_name` in the same filters.

```sql
-- gold grain. Built from silver AFTER stamping sending_domain + trk_* from the
-- emailSend row of the same message_id onto every event. Then:
SELECT
  window(event_timestamp, '5 minutes').start AS bucket_start,
  sending_domain,
  campaign_id,
  any_value(campaign_name)                  AS campaign_name,
  template_id,
  experiment_id,
  trk_afid,
  trk_vertical,
  trk_email_type,
  trk_project,
  event_name,
  skip_reason,
  recipient_state,
  is_bot,
  count(*)                                  AS event_count
FROM mps_email.silver.iterable_system_email_events
GROUP BY
  window(event_timestamp, '5 minutes').start,
  sending_domain, campaign_id, template_id, experiment_id,
  trk_afid, trk_vertical, trk_email_type, trk_project,
  event_name, skip_reason, recipient_state, is_bot

-- shared Grafana predicate (pasted into every panel below)
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
  AND (${campaign:sqlstring}   = '$__all' OR campaign_id     IN (${campaign:sqlstring}))
  AND (${template:sqlstring}   = '$__all' OR template_id     IN (${template:sqlstring}))
  AND (${afid:sqlstring}       = '$__all' OR trk_afid        IN (${afid:sqlstring}))
  AND (${vertical:sqlstring}   = '$__all' OR trk_vertical    IN (${vertical:sqlstring}))
  AND (${email_type:sqlstring} = '$__all' OR trk_email_type  IN (${email_type:sqlstring}))
```

Table name in queries: `mps_email.gold.iterable_email_event_counts_5min`. Not built yet. The GROUP BY is the compression. Anything not in that list cannot appear in a panel unless we add it to gold or query silver.

## A · Campaign Health — Katy slide 7

**Our Grafana mockup (numbers are fake — they show layout, not warehouse output)**

Campaign Health · time: **Last 30d** · project: **$project** · campaign: **All** · afid: **All**

| Stat | Value |
|---|---|
| A1 Sends | 12.4k |
| A2 Delivery | 98.2% |
| A3 Bounce | 1.4% |
| A4 Skip | 2.1% |
| A5 Open | 24.7% |
| A6 CTR | 3.8% |
| A7 Spam | 0.06% |
| A8 Unsub | 0.22% |

A9 Send volume by bucket_start *(chart placeholder — layout only, no data)*

A10 Campaigns:

| Campaign | Sends | Open | Bounce |
|---|---|---|---|
| AMA.com_Marketing_Aug | 8.1k | 33% | 1.1% |

A11 Spam vs send volume *(chart placeholder — layout only, no data)*

**Katy slide 7 · exported from Grafana Iterable Uses.odp**

![Katy slide 7 Campaign Health](ppt-slides/slide-07.png)

Slide 7 asks: send volume, delivery, bounce alert >2%, open & CTR 30d **by campaign type and send time**, spam vs volume. KPI numbers on the slide (open 24.7%, CTR 3.8%) are the layout we match. Campaign type = filter `trk_email_type` (panel C). Send time hour is a gap — see A-gap.

### A1–A8 · KPI strip — one query, eight stats

Slide cards: Delivery 98.2%, Open 24.7%, CTR 3.8%, Bounce 1.4%, Spam 0.06%. We add Sends, Skip, Unsub (slides 3–4). Grafana stat panel picks one field each. Rates are computed in Grafana from the SUMs, not stored on gold.

```sql
SELECT
  SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END)                              AS sends,
  SUM(CASE WHEN event_name = 'emailSendSkip' THEN event_count ELSE 0 END)                          AS skips,
  SUM(CASE WHEN event_name = 'emailBounce' THEN event_count ELSE 0 END)                            AS bounces,
  SUM(CASE WHEN event_name = 'emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)       AS opens,
  SUM(CASE WHEN event_name = 'emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)      AS clicks,
  SUM(CASE WHEN event_name = 'emailComplaint' THEN event_count ELSE 0 END)                         AS spam,
  SUM(CASE WHEN event_name = 'emailUnSubscribe' THEN event_count ELSE 0 END)                       AS unsubs
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
  AND (${campaign:sqlstring}   = '$__all' OR campaign_id    IN (${campaign:sqlstring}))
  AND (${template:sqlstring}   = '$__all' OR template_id    IN (${template:sqlstring}))
  AND (${afid:sqlstring}       = '$__all' OR trk_afid       IN (${afid:sqlstring}))
  AND (${vertical:sqlstring}   = '$__all' OR trk_vertical   IN (${vertical:sqlstring}))
  AND (${email_type:sqlstring} = '$__all' OR trk_email_type IN (${email_type:sqlstring}))

-- Grafana math (not gold columns):
-- delivery = 1 - bounces/sends          slide 7 target > 97%
-- bounce   = bounces/sends              slide 7 alert 2%
-- skip     = skips/sends                slide 4 "% of sends"
-- open     = opens/sends
-- ctr      = clicks/sends               matches slide 7 3.8% next to open 24.7%
--          -- clicks/opens is also possible from the same two SUMs; not what the slide numbers are
-- spam     = spam/sends                 slide 4 0.1% pause
-- unsub    = unsubs/sends               slide 4 0.5%
```

- bucket_start [used]
- sending_domain [used]
- campaign_id [used]
- template_id [used]
- trk_afid [used]
- trk_vertical [used]
- trk_email_type [used]
- event_name [used]
- is_bot [used]
- event_count [used]

### A9 · Send volume time series

Slide 7 "Track every Iterable send in real time". X = `bucket_start` (5 min). Grafana can roll to day in the panel.

```sql
SELECT
  bucket_start AS time,
  SUM(event_count) AS sends
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailSend'
  AND $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
  AND (${campaign:sqlstring} = '$__all' OR campaign_id IN (${campaign:sqlstring}))
  AND (${afid:sqlstring}     = '$__all' OR trk_afid    IN (${afid:sqlstring}))
GROUP BY 1
ORDER BY 1
```

- bucket_start [used]
- event_name [used]
- event_count [used]
- sending_domain [used]
- campaign_id [used]
- trk_afid [used]

### A10 · Campaigns table

Slide 7 is campaign-level. One row per `campaign_id`. Name is the gold label `any_value(campaign_name)` — not a GROUP BY key, so two names for the same id would collapse; we have not seen that.

```sql
SELECT
  campaign_id,
  campaign_name,
  SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name = 'emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS open_rate,
  SUM(CASE WHEN event_name = 'emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS bounce_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
  AND (${afid:sqlstring} = '$__all' OR trk_afid IN (${afid:sqlstring}))
GROUP BY campaign_id, campaign_name
ORDER BY sends DESC
```

- campaign_id [used]
- campaign_name [used]
- event_name [used]
- is_bot [used]
- event_count [used]
- sending_domain [used]
- trk_afid [used]
- bucket_start [used]

### A11 · Spam vs send volume

Slide 7 "ISP-level feedback loop data plotted alongside send volume". We have complaint counts, not ISP. Two series from the same cube.

```sql
SELECT
  bucket_start AS time,
  SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END)      AS sends,
  SUM(CASE WHEN event_name = 'emailComplaint' THEN event_count ELSE 0 END) AS spam
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY 1
ORDER BY 1
```

- bucket_start [used]
- event_name [used]
- event_count [used]
- sending_domain [used]
- ISP inbox % — not in webhook, not in this SELECT [compressed]

### A-gap · "by send time" (hour of day) — BLOCKED

Slide 7: "segmented by campaign type and send time". Campaign type is `trk_email_type` in the shared WHERE (and dashboard C). Send time as hour is `hour(event_timestamp)` on silver. It is **not** in the gold GROUP BY, so this SELECT is impossible on gold:

```sql
-- CANNOT run on gold. hour_of_day was compressed away.
-- Would require adding hour(event_timestamp) to the gold GROUP BY (×24),
-- or querying silver.
SELECT hour(event_timestamp) AS send_hour, SUM(...) 
FROM gold   -- column does not exist
```

- event_timestamp seconds / hour — silver only [compressed]
- trk_email_type — available as filter, not missing [used]

## B · Domain Health — Katy slides 8 and 9

**Our Grafana mockup — rows are sending_domain (see gap vs her labels)**

Domain Health · time: **Last 30d** · refresh: **5m**

B1 Scorecard:

| Domain | Delivery | Open | Spam | Bounce | CTR |
|---|---|---|---|---|---|
| (red status dot) marketing.medicareadvantage.com | 95% | 27% | 1.50% | 1.80% | 3% |

B2 Hard vs soft:

| recipient_state | n |
|---|---|
| HardBounce | 240 |
| MailboxFull | 180 |

B3 Engagement pie:

| event | n |
|---|---|
| emailOpen | 29% |
| emailClick | 9% |
| emailUnSubscribe | 1% |
| emailComplaint | 1% |

**Katy slide 8 · 27 website names, not MailGun domains**

![Katy slide 8 Domain Health](ppt-slides/slide-08.png)

**Katy slide 9 · drill of MedicareAdvantage.com · Auto 5m · includes Inbox by ISP (blocked)**

![Katy slide 9 domain drill](ppt-slides/slide-09.png)

### B1 · 27-row scorecard

Slide 8 columns: Domain, Delivery, Open, Spam, Bounce, CTR, health bar. Health is Grafana math on those rates (slide 8 cutoffs), not a gold column. **Evidence gap:** her Domain column is `Aetna-MedicareAdvantage.com`. This query groups `sending_domain` (`marketing.medicareadvantage.com` on the prod send). Until gold has `website_host` (from `headers.key`, secrets still dropped) or a 27-row map, B1 will not look like the slide even if every rate is correct.

```sql
SELECT
  sending_domain,
  SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END) AS sends,
  1 - SUM(CASE WHEN event_name = 'emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS delivery,
  SUM(CASE WHEN event_name = 'emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS open_rate,
  SUM(CASE WHEN event_name = 'emailComplaint' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS spam_rate,
  SUM(CASE WHEN event_name = 'emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS bounce_rate,
  SUM(CASE WHEN event_name = 'emailClick' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS ctr
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
GROUP BY sending_domain
```

- sending_domain [used]
- event_name [used]
- is_bot [used]
- event_count [used]
- bucket_start [used]
- website_host (headers.key) — not on gold today [missing]

### B2 · Hard vs soft (slide 9 drill)

```sql
SELECT
  recipient_state,
  SUM(event_count) AS n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailBounce'
  AND $__timeFilter(bucket_start)
  AND sending_domain = '$project'
GROUP BY recipient_state
ORDER BY n DESC
```

- recipient_state [used]
- event_name [used]
- event_count [used]
- sending_domain [used]
- bucket_start [used]

### B3 · Engagement pie (slide 9: Opened / Clicked / Unsubscribed / Marked Spam)

```sql
SELECT
  event_name,
  SUM(event_count) AS n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name IN ('emailOpen','emailClick','emailUnSubscribe','emailComplaint')
  AND $__timeFilter(bucket_start)
  AND sending_domain = '$project'
  AND (event_name NOT IN ('emailOpen','emailClick') OR is_bot IS NOT TRUE)
GROUP BY event_name
```

- event_name [used]
- event_count [used]
- is_bot [used]
- sending_domain [used]
- bucket_start [used]

### B4 · Delivery % vs spam % — 30 day (slide 9 chart)

```sql
SELECT
  bucket_start AS time,
  1 - SUM(CASE WHEN event_name = 'emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS delivery,
  SUM(CASE WHEN event_name = 'emailComplaint' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS spam_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain = '$project'
GROUP BY 1
ORDER BY 1
```

- bucket_start [used]
- event_name [used]
- event_count [used]
- sending_domain [used]

### B5 · Send volume 30d (slide 9 "Total sends this period: 284,920")

```sql
SELECT
  bucket_start AS time,
  SUM(event_count) AS sends
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailSend'
  AND $__timeFilter(bucket_start)
  AND sending_domain = '$project'
GROUP BY 1
```

- bucket_start [used]
- event_name [used]
- event_count [used]
- sending_domain [used]

### B-gap · Inbox Delivery by ISP (slide 9) — BLOCKED

The slide draws Gmail / Yahoo / other inbox %. No column in bronze JSON, silver, or gold is an ISP inbox rate. `ip` on open/click is silver-only and is not inbox placement. No SELECT on this cube can produce that panel.

```sql
-- NO QUERY. Would need Google Postmaster / Validity / similar.
-- Preserving ip on silver does not create this panel.
```

- inbox_placement_by_isp [missing]

## C · AFID / campaign type — not a Katy dashboard; you asked; slide 7 says "campaign type"

**Our Grafana mockup**

AFID performance · project: **$project** · vertical: **All**

C1 Rates by AFID:

| AFID | trk_project | Vertical | Email type | Sends | Open | Bounce |
|---|---|---|---|---|---|---|
| 516075 | AMA.com | MA | Marketing | 8.2k | 33% | 1.1% |
| (none) | — | — | — | 0.4k | 22% | 2.4% |

C2 By vertical:

| vertical | Sends | Open |
|---|---|---|
| MA | 11.1k | 32% |

C3 By email_type:

| email_type | Sends | Unsub |
|---|---|---|
| Marketing | 11.8k | 0.22% |

**No AFID slide. Closest ask: slide 7 "by campaign type". Slide 3 filters are project, campaignId, templateId, date — not AFID.**

![Slide 7 campaign type mention](ppt-slides/slide-07.png)

AFID exists on silver because the prod send has `dataFeed.trk.afid = 516075`. Gold stamps it onto every event of that `message_id` before counting — otherwise C1 open/bounce would all land in `(none)`. `sns_lead.gold.afid_master` is a later name lookup; C1 works with the number.

### C1 · One row per AFID

```sql
SELECT
  COALESCE(trk_afid, '(none)') AS afid,
  trk_project,
  trk_vertical,
  trk_email_type,
  SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END) AS sends,
  SUM(CASE WHEN event_name = 'emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS open_rate,
  SUM(CASE WHEN event_name = 'emailBounce' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS bounce_rate,
  SUM(CASE WHEN event_name = 'emailSendSkip' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS skip_rate,
  SUM(CASE WHEN event_name = 'emailUnSubscribe' THEN event_count ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS unsub_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY 1, 2, 3, 4
ORDER BY sends DESC
LIMIT 100
```

- trk_afid [used]
- trk_project [used]
- trk_vertical [used]
- trk_email_type [used]
- event_name [used]
- is_bot [used]
- event_count [used]
- sending_domain [used]
- bucket_start [used]
- message_id — used at gold build to stamp, then dropped (not in this SELECT) [compressed]
- afid_master.name — join later, key trk_afid is here [gold]

### C2 / C3 · Same cube, different GROUP BY

```sql
-- C2 vertical (slide 7 "campaign type" if they mean vertical)
SELECT trk_vertical,
       SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END) AS sends,
       SUM(CASE WHEN event_name = 'emailOpen' AND is_bot IS NOT TRUE THEN event_count ELSE 0 END)
         / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS open_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY trk_vertical

-- C3 email_type (slide 7 "campaign type" if they mean Marketing vs Transactional)
SELECT trk_email_type,
       SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END) AS sends,
       SUM(CASE WHEN event_name = 'emailUnSubscribe' THEN event_count ELSE 0 END)
         / NULLIF(SUM(CASE WHEN event_name = 'emailSend' THEN event_count ELSE 0 END), 0) AS unsub_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY trk_email_type
```

- trk_vertical [used]
- trk_email_type [used]
- Iterable campaign type Blast/Triggered — Campaigns API, not this cube. campaign_id is on gold if we ingest it later. [missing]

## D · Bounce / skip ops — Katy slides 2–4 (skip reason) + Pete layout

**Our Grafana mockup (Pete's pies, Katy's skip reason)**

Deliverability ops · project: **$project** · bounce_type: **HardBounce**

D1 Skip reasons:

| reason | n |
|---|---|
| CampaignDeactivated | 1.9k |
| DataFeedError | — |

D2 Bounce recipient_state:

| state | n |
|---|---|
| HardBounce | 240 |

D3 Top campaigns for bounce type:

| Campaign | n |
|---|---|
| AMA.com_Marketing_Aug | 120 |

D4 Top campaigns for skip reason:

| Campaign | n |
|---|---|
| AMA.com_Marketing_Aug | 400 |

**Katy slide 3 · skip + reason named as a KPI. Slide 2 examples: DataFeedError, EmptyContent**

![Katy slide 3 KPIs including skip](ppt-slides/slide-03.png)

### D1 · Skip reason (slide 2–4)

```sql
SELECT
  skip_reason,
  SUM(event_count) AS n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailSendSkip'
  AND $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY skip_reason
ORDER BY n DESC
```

- skip_reason [used]
- event_name [used]
- event_count [used]
- sending_domain [used]
- bucket_start [used]

### D2 · Bounce type pie (Pete; slide 9 hard/soft)

```sql
SELECT
  recipient_state,
  SUM(event_count) AS n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailBounce'
  AND $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY recipient_state
```

- recipient_state [used]
- event_name [used]
- event_count [used]

### D3 · Top campaigns for selected bounce type (Pete)

```sql
SELECT
  campaign_id,
  campaign_name,
  SUM(event_count) AS n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailBounce'
  AND recipient_state LIKE '${bounce_type}%'
  AND $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY campaign_id, campaign_name
ORDER BY n DESC
LIMIT 15
```

- campaign_id [used]
- campaign_name [used]
- recipient_state [used]
- event_name [used]
- event_count [used]

### D4 · Top campaigns for selected skip reason (Pete + Katy skip)

```sql
SELECT
  campaign_id,
  campaign_name,
  SUM(event_count) AS n
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE event_name = 'emailSendSkip'
  AND skip_reason = '$skip_reason'
  AND $__timeFilter(bucket_start)
  AND sending_domain IN (${project:sqlstring})
GROUP BY campaign_id, campaign_name
ORDER BY n DESC
LIMIT 15
```

- campaign_id [used]
- campaign_name [used]
- skip_reason [used]
- event_name [used]
- event_count [used]

### D-gap · Pete Campaign List (state, sendSize, type) — BLOCKED

Pete's last row is `GET /api/campaigns`, not events. This cube has `campaign_id` so a later ingest can join. No SELECT on gold produces Draft/Ready/Running or sendSize.

```sql
-- NO QUERY on this gold.
-- Join key that we did keep: campaign_id
```

- campaign_id — preserved for a later join [used]
- campaignState / sendSize / API type [missing]

## Blocked reports — slide exists, no gold query

**Katy slide 10 · Audience. Unique people, age, DMA, acquisition, lifecycle**

![Katy slide 10 Audience](ppt-slides/slide-10.png)

**Katy slide 11 · Revenue. Conversions, ROI, LTV**

![Katy slide 11 Revenue](ppt-slides/slide-11.png)

E and F cannot run on gold-1 (the 5-min cube). They are not "impossible in Databricks". Split: what a second gold from **our** silver can do, vs what is only `email`/`afid`/`template_id` plus a table we already have, vs what we did not find in this repo. Detail: [Audience · other golds](#audience).

### E · Audience (slide 10) — not gold-1 — BLOCKED

Need a **person gold** (1 row = 1 `email`) built from the same silver, and/or joins listed below. Gold-1 drops `email` on purpose.

### F · Revenue (slide 11) — not gold-1 — BLOCKED

`transactionalData` on the send sample is `"{}"`. Known joins: `template_id` → `edm.gold.ga4_iterable_fact`; `email` → enrollments/policies. See [#audience](#audience).

**Katy slide 4 · 7-day alert thresholds. Grafana unified alerts on the same A1 SUMs. Not a table.**

![Katy slide 4 thresholds](ppt-slides/slide-04.png)

**Katy slide 6 · "what we can measure" includes ISP + segment + revenue. Only the KPI slice is this cube.**

![Katy slide 6](ppt-slides/slide-06.png)

## Audience (slide 10) — second gold + tables we found in this repo

Several golds are allowed. Gold-1 stays the 5-min cube (A–D). Gold-2, if we want audience, is **1 row = 1 `email`** from the same silver (last send/open/unsub, device, campaign, AFID). The AFID stamp is still silver↔silver on `message_id`. Person attributes that are not in the webhook are joins to tables below. Sources are the SQL files in `deploy_sql/views/`.

```sql
-- gold-2 grain (not built). Same silver as gold-1. Email stays here.
SELECT
  email,
  max(case when event_name = 'emailSend'         then event_timestamp end) AS last_send_at,
  max(case when event_name = 'emailOpen'         then event_timestamp end) AS last_open_at,
  max(case when event_name = 'emailUnSubscribe'  then event_timestamp end) AS last_unsub_at,
  max(case when event_name = 'emailBounce'       then event_timestamp end) AS last_bounce_at,
  count_if(event_name = 'emailSend')  AS send_count,
  count_if(event_name = 'emailOpen' AND is_bot IS NOT TRUE) AS open_count,
  max(user_agent_device) AS last_device,
  max(trk_afid)          AS last_trk_afid,
  max(campaign_id)       AS last_campaign_id
FROM mps_email.silver.iterable_system_email_events
GROUP BY email
```

Universe = emails that landed in MPS bronze since the job started. Not the full Iterable list, not CDS 17.9M.

### Slide 10 panels vs our silver vs a known join

| Panel on the slide | From our silver / gold-2? | Join to complete it | Found in repo? |
|---|---|---|---|
| Device & open time (mobile 9–11am) | Yes — `user_agent_device` + hour(`createdAt`) | none | Our JSON |
| Lifecycle: Active / At-risk 30d / Lapsed 60d / Unsub | Yes — last_open / last_unsub per email | none for the state machine | Our JSON |
| Engagement frequency (sends vs opens per person) | Yes — send_count / open_count | none | Our JSON |
| Segment overlap (same person, 2+ campaigns) | Yes if "segment" = Iterable `campaign_id` | Iterable **lists** / saved audiences: not ingested | campaign overlap · no list table |
| Geo (slide says DMA) | city / region / zip on open+send | `sns_lead.gold.persons` has city, state, zip on `email`. **No DMA column** in deploy_sql (searched dma / nielsen / zip_dma — zero hits) | zip/city known · DMA not found |
| Subscriber growth / list churn % of list | unique emails we saw + unsub/bounce counts | Need Iterable subscriber snapshot / list size. Not in this repo | list universe not found |
| Age / life stage (<64, 65–69, 70+) | not in the webhook | `edm.silver.vw_enrollments_es.ApplicantEmailAddress` + computed `Age` from encrypted DOB (`[prod]00107_edm_silver_vw_enrollments_es.sql`). Only people who applied. `sns_lead.gold.persons` has **no** DOB | enrollments · incomplete coverage |
| Acquisition (Paid Search / Broker / Organic) | not in the webhook | Two known hops, neither is "Iterable subscriber data": (1) `trk_afid` → `sns_lead.gold.afid_master.channel / sub_channel / tactic / website`; (2) lead grain `mps_lead_acquisition.gold.vw_rpt_leadsourceattributes` has `utmSource`, `utmMedium`, `Normalized Network` (Google search), `afid` — join is lead/AFID, not email | tables known · email hop is weak |
| Cohort retention by acquisition channel | first_send vs later opens, if cohort = first email in our stream | true acquisition channel = same as row above | partial without lead join |

### Tables we opened (join keys)

| Table | File | Join from our data | What it actually has | What it does not |
|---|---|---|---|---|
| `sns_lead.gold.persons` ← `edm.gold.cds_persons` | `[prod]0752_sns_lead_gold_persons.sql` | `email` = `email` | name, phone, city, state, zip, street | age, DMA, acquisition, lead_id |
| `edm.silver.vw_enrollments_es` | `[prod]00107_edm_silver_vw_enrollments_es.sql` | `email` = `ApplicantEmailAddress` | `Age` (from decrypted DOB), zip, plan/carrier — applicants only | people who never enrolled |
| `sns_lead.gold.afid_master` | `[prod]0515_sns_lead_gold_afid_master.sql` | `trk_afid` = `afid` | channel, sub_channel, website, vertical, tactic, agency | person demographics |
| `mps_lead_acquisition.gold.vw_rpt_leadsourceattributes` | `[prod]0227_...leadsourceattributes.sql` | `afid` (and dialer lead ids) — not email | utmSource, utmMedium, Google/YouTube network, keyword, campaign | direct email key |
| `edm.gold.ga4_iterable_fact` | notebook `src/gold/GA4/gold_ga4_iterable.py` | gold-1 `template_id` = `templateId` (not person) | sessions, formSubmission, eAppStep1 by template/day | revenue $, LTV, person |
| `edm.gold.cds_emailevents` + `vw_rpt_email_policy_bridge` | `[prod]0184_...email_policy_bridge.sql` | `msgId` / `cuySessionId` — may or may not equal our `message_id` | path to `rpt_policymeasures` (policy/sale) | not the MPS webhook; overlap unproven |
| `sns_person.gold.vw_contact_preferences_dnc_*` | `[prod]0106`–`0109` | `lead_email` | DNC flags | demographics |
| Iterable subscriber / list size / DMA dim | — | — | — | not in this repo |

### What that means for completing slide 10 / 11 (not planning in the air)

| Can ship without other teams | Can ship if we join tables we already have | Cannot ship from what we found |
|---|---|---|
| Device + hour; lifecycle 30/60d; send/open frequency; campaign overlap; zip/city of openers. Requires gold-2 (email grain) + keep `email` on silver. | Age for **enrollees** (`vw_enrollments_es`). Channel/tactic via AFID master. GA4 funnel by template (slide 11-ish, not $). Policy path only if `message_id` matches `cds_emailevents.msgId` — unproven. | DMA (no table). True Iterable list growth / segment overlap of lists. Age for everyone we emailed. Paid Search vs Broker as subscriber fields. Revenue $ / LTV as drawn on slide 11. |

## Lineage taken from the SELECTs above — not from a separate story

Every gold column. A cell is Y if that dashboard's SQL lists the column. Gap = the panel exists on a slide and the column is not on gold.

| Gold column (the GROUP BY + count) | A Campaign | B Domain | C AFID | D Bounce/skip | Why it is in the cube |
|---|---|---|---|---|---|
| `bucket_start` | A9 A11 | B4 B5 | filter | filter | 5-min grain Katy asked on slide 9 |
| `sending_domain` | filter | B1 rows | filter | filter | B scorecard grain — label ≠ slide 8 websites (gap) |
| `campaign_id` | A10 | — | — | D3 D4 | slide 3 filter; Pete top campaigns |
| `campaign_name` | A10 label | — | — | D3 D4 | label, not a key |
| `template_id` | filter | — | — | — | slide 3 filter; later GA4 join |
| `experiment_id` | no panel | — | — | — | slide 6 A/B. In GROUP BY, unused by A–D SQL. Candidate to drop from v1 cube if unused. |
| `trk_afid` | filter | — | C1 | filter | your ask; stamped via message_id |
| `trk_vertical` | filter | — | C2 | — | one reading of "campaign type" |
| `trk_email_type` | filter | — | C3 | — | other reading of "campaign type" |
| `trk_project` | — | — | C1 | — | AMA.com. Not the 27 websites |
| `event_name` | A1–A11 | B1–B5 | C1–C3 | D1–D4 | every rate |
| `skip_reason` | — | — | — | D1 D4 | slides 2–4 |
| `recipient_state` | — | B2 | — | D2 D3 | hard vs soft |
| `is_bot` | A5 A6 A10 | B1 B3 | C1 | — | open/CTR without IS NOT TRUE would drop sends (null) |
| `event_count` | all | all | all | all | the measure |

### Compressed away — not in any SELECT above

These exist on the designed silver and are absent from every gold GROUP BY, so they cannot appear in A–D. That is the discard list, generated by subtracting the query columns from silver.

| Silver column(s) | Would have served | Why not gold |
|---|---|---|
| `email`, `email_id` | E Audience, F LTV, unique subscribers | Person grain. Keep on silver or E/F die later. |
| `message_id` | Stamp AFID/domain at gold build | Used then dropped. Not a Grafana field. |
| `event_timestamp` (seconds, hour) | A-gap send time | Floored to `bucket_start`. Add `hour_of_day` only if A-gap is v1. |
| `user_agent_device`, ip, geo, url | Slide 10 device / DMA-ish | Not in A–D SQL. Device is a later cube or silver query. |
| `tpmo_*`, `med_plans_benefits_json` | Nobody asked | Not in any slide panel. |
| extra `trk_did` / TFN / call_link | — | Not in any SELECT. |
| workflow, locale, labels, subject, bounce_message, unsub_source | — | Not in any SELECT. |
| `headers.key` website host | B1 looking like slide 8 | Not on silver/gold today (gap). The one compression that breaks a KEEP panel's labels. |

### What the queries prove

| Report | Every panel has a gold SELECT? | Exception you can check above |
|---|---|---|
| A Campaign Health (slide 7) | Yes except send-time hour | A-gap. Campaign type is a filter, not a missing measure. |
| B Domain Health (slides 8–9) | Yes except ISP inbox, and B1 labels | B-gap ISP. B1 groups the wrong string vs the screenshot. |
| C AFID | Yes | Not a Katy dashboard. Relies on stamp at gold build, not on a Grafana join. |
| D Bounce / skip | Yes except Pete Campaign List | D-gap is a different source; `campaign_id` kept. |
| E Audience / F Revenue | Not on gold-1 | Gold-2 (email) covers device/lifecycle/frequency. Joins we found: persons (geo), enrollments (age), afid_master (channel), ga4 by template. DMA / Iterable list / $ LTV not in repo. [#audience](#audience) |

---

Slide PNGs: `ppt-slides/slide-01.png` … `slide-12.png` exported 1920×1080 from `C:\Users\wilman.vasquez\Downloads\Grafana Iterable Uses.odp` via PowerPoint.
Mockup numbers are layout, not a warehouse extract.
Scorecard: [iterable-grafana.html](iterable-grafana.html).
Field map: [iterable-schema-json-vs-silver.html](iterable-schema-json-vs-silver.html).
Lineage: [iterable-column-lineage.html](iterable-column-lineage.html).
<!-- VERBATIM SOURCE: iterable-dashboard-evidence.md ENDS -->
