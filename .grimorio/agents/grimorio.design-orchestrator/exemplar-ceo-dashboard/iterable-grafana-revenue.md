# Design Orchestrator — Exemplar: Iterable/Grafana Dashboard (CEO-authored) — Revenue Extension

Companion depth file of ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard.md
(the index — provenance, the why-index-plus-six-companions reasoning, and the pointer list to all six
companions live there). Reached only from the index; **NEVER referenced directly, and NEVER loaded by default**
— same standing as the index itself. This is the CEO's own original file, verbatim, at its own original length
— the CEO's own separately-bounded "extra" question for PPT slide 11 (Revenue), never merged into or split out
of the main scorecard companion.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the CEO's own `iterable-grafana-revenue.md`. This file's own internal cross-links to its five siblings (e.g.
`iterable-grafana.html`, `iterable-grafana-audience.html`) point at the CEO's original `.html` site, not at
this split's own `.md` companion filenames, and are left verbatim rather than silently rewritten — the index's
own closing note names this explicitly.

---

<!-- VERBATIM SOURCE: iterable-grafana-revenue.md BEGINS -->
# Revenue extension — Iterable Grafana

*Extension of the scorecard · PPT slide 11 · same pattern as Audience (slide 10)*

# Revenue is green. Extra we own: a conversion↔send path table. No Iterable REST.

> Four color pairs. One conversion, a list of emails before it, four ways to give that conversion's $ to those emails. Grafana reads a table we build from EDM gold + silver sends.
>
> Gold-1 does not change (no email, no $). Audience extra is gold-2; EmailType is `split(campaign_name, '_')[1]` — same parse here for first-touch stage.
> The $ is already here: `vw_enrollments_es.AnnualPremium`, `vw_policy_fact.PolicyAnnualPremium` + `Email`.
> Sends are silver: `email`, `message_id`, `campaign_id`, `campaign_name`, time.
> Extra: one path gold (conversion × sends in lookback). Last / first / linear / decay are four queries on that table — not four pipelines.
> ROI without email spend stays a rate of $ per send, not a true ROI. LTV is the same $ over a longer window, by segment.
> Parent: [iterable-grafana.html](iterable-grafana.html).
> Audience: [iterable-grafana-audience.html](iterable-grafana-audience.html).

**Contents:** [How to read the slide](#read) · [Themes](#themes) · [Reference table](#ref) · [Where the data is](#where) · [The extra table](#job) · [SQL per pair](#sql) · [What we do not](#not)

## 0. How to read slide 11 — four colors, four pairs

The left bars and the right cards share colors on purpose. Each pair is one way to give a conversion's dollar to the emails that person got **before** they converted. It is not CTR (not "per click"). A conversion in Tranzact is a sale / eApp / issued policy with a premium.

|  | Left bar | Right card | In one sentence |
|---|---|---|---|
| [purple] | Last-touch 41% · $284K | Campaign-level ROI | The **last** email before the sale gets 100% of that sale's $. Then: how much $ per send (and per conversion) for that campaign. |
| [teal] | First-touch 28% · $194K | Lifecycle flow | The **first** email (welcome vs nurture vs win-back) gets 100%. Who originated them, not who closed. |
| [orange] | Linear 19% · $131K | Email vs Direct | Every email in the path splits the $ equally. Direct = the sale had **no** Iterable email in the window (empty path). |
| [navy] | Time-decay 12% · $83K | LTV by segment | More recent emails get more of the $. LTV is the same idea over a long window, by a named segment (AFID / lifecycle). |

*41+28+19+12 = 100%. The mock is a mix of credit across models, not four unrelated KPIs. Sufficiency is still the query under each pair — same rule as Audience.*

**What we paint — path gold, four queries**

Grafana mock: *Revenue Attribution · our stream + EDM $* — variable: range **last 90d**

Stat tiles: Last-touch $ · First-touch $ · Linear $ · Time-decay $ (values shown as placeholder `$`)

Panel — *Same conversions · four credit rules*:

| pair | query on the path |
|---|---|
| purple | last send before conversion_ts |
| teal | first send + campaign stage |
| orange | $ / n sends · empty path = direct |
| navy | weight by recency · LTV = longer window |

**PPT slide 11 — four color pairs**

![slide 11](ppt-slides/slide-11.png)

## 1. Five themes — then stop

| Theme | Why it matters |  |  |
|---|---|---|---|
| Same pattern as Audience | Slide 10 needed gold-2 (people). Slide 11 needs a path gold: conversion × the sends before it. Grafana does not scan enrollments. Neither slide needs `GET /api/campaigns`. | extra we own | [§ extra](#job) |
| $ is already EDM | Enrollments and policy gold have premium and email on the same row. CUY only has a sale flag. | in catalog | [§ where](#where) |
| Sends are silver | `email`, `message_id`, `campaign_id`, time. Gold-1 dropped email on purpose — A–D stay on the cube. | this job | [§ extra](#job) |
| Four models, one table | Last / first / linear / decay are four SQL rules on the path. Not four ingestions. | queries | [§ SQL](#sql) |
| ROI spend / LTV segment | Revenue-per-send plays. True ROI needs email spend (not in this catalog). LTV uses commissions + a named segment — later slice, same join. | named gaps | [§ not](#not) |

## 2. Reference — every color pair

Same table as Audience. Green = Grafana can paint it from what we build. Not 100% of sales (email hit rate like age).

| Pair | What the mock says | What we offer | Grain / table | What we do not offer |
|---|---|---|---|---|
| [purple] Last-touch + Campaign ROI<br>*41% · $284K* | Last email before the sale owns the $. Then $ per send and $ per conversion for that campaign. | **yes** last send on the path. Revenue-per-send = attributed $ / gold-1 send_count. Cost-per-conversion / ROI: **numerator only** until email spend exists. | path gold · last row per conversion. Sends from gold-1 for the rate. | CTR. Ad cost as email spend. Fake $284K. |
| [teal] First-touch + Lifecycle<br>*28% · $194K* | First email owns the $. Welcome vs nurture vs win-back — who originated. | **yes** first send on the path. Stage = second token of `campaign_name` (Trigger, Dispo, Marketing, Eapp, Sunset, …). | path gold · first row. No catalog GET. | The PPT words welcome / nurture / win-back — those strings are not in prod names. Paint EmailType; DOC maps if they want the mock labels. |
| [orange] Linear + Email vs Direct<br>*19% · $131K* | Split $ equally across every email in the path. Direct = no Iterable email before the sale. | **yes** $ / count(sends) on the path. Direct = conversion with zero sends in lookback. | path gold · left join (empty path = direct) | — |
| [navy] Time-decay + LTV by segment<br>*12% · $83K* | Recent emails get more weight. LTV = long-term $ vs how that segment engages. | **time-decay** = weight by days-before on the same path (half-life default 7d if DOC is silent). LTV: **same join, longer window** — commissions / last premium, segment = AFID or lifecycle. Not v1 of the four bars. | path gold for decay. Commissions + gold-2 for LTV later. | A webhook "engagement score." We would define it (opens in 90d) if they want that card in v1. |

## 3. Where the data is — this catalog

| Piece | Table | Columns |
|---|---|---|
| Quoted $ + email (eApp) | `edm.silver.vw_enrollments_es` | `ApplicantEmailAddress`, `AnnualPremium`, `CreatedAt` / submit, `LeadLeadId` |
| Issued $ + email (policy) | `edm.gold.vw_policy_fact` | `Email`, `PolicyAnnualPremium`, sign/issue/effective, `DialerLeadId`, `DialerCallId`, `EnrollmentId` |
| Sale flag (no $) | CUY / Iterable `isSale` | Disposition Sale — stops email, not a premium |
| Sends | `mps_email.silver.iterable_system_email_events` | `email`, `message_id`, `campaign_id`, `event_timestamp` where `event_name='emailSend'` |
| Send volume for ROI rate | gold-1 | `campaign_id`, `event_count` of emailSend |
| EmailType (first-touch stage) | path gold `campaign_name` (from silver send) | `split(campaign_name, '_')[1]` — Marketing, Trigger, Dispo, Eapp, Sunset. Not a catalog GET. |
| Long-term $ | `vw_ps_annualpremium_per_enrollmentid` / commission silver | via `EnrollmentId` |

Default conversion if DOC is silent: issued policy on `vw_policy_fact` (has $ and Email; Enrollments already read that fact). Same email hop Audience uses for age.

## 4. Two extras — do not mix them

|  | Audience (slide 10) | Revenue (slide 11) |
|---|---|---|
| What | Was: GET /campaigns for win-back label. **Settled:** not required. Prod names are `{site}_{EmailType}_{offset}`. Parse the second token (Marketing, Trigger, Dispo, Eapp, Sunset, Newsletter, …). GET is optional (state/sendSize only). | Databricks job that writes gold `iterable_conversion_sends`. One row per (sale × email send in 90d). No Iterable API. |
| Why | EmailType is on the webhook name (and on journey labels as `EmailType: Dispo`). Policy/enrollments still do not store it — the send does. Their types are not the words welcome/nurture/win-back; we paint EmailType (DOC can map). | Attach EDM $ to those sends. Last / first / linear / decay are SQL on this gold. First-touch stage = EmailType from the name. |
| Skip it if… | Always skip the GET for category. Keep GET only if someone wants campaignState / sendSize (Pete Campaign List). | Never skip the path gold — otherwise Grafana scans enrollments × silver. |

Policy / enrollments do **not** store "this email was re-engagement." They store the sale. EmailType is on the send's `campaign_name` already. The $ is on the policy/enrollment row. Neither lives on Iterable REST.

Revenue job: do not point Grafana at enrollments (too wide). Do not put $ on gold-1 (no email).

```text
flowchart LR
  PF["vw_policy_fact
  Email + PolicyAnnualPremium"] --> C[conversion
  1 sale 1 row]
  SV["silver emailSend
  email message_id campaign_id time"] --> P[path
  conversion × sends
  in 90d lookback]
  C --> P
  P --> Q1[last]
  P --> Q2[first]
  P --> Q3[linear + direct]
  P --> Q4[time-decay]
  Q1 --> G[Grafana]
  Q2 --> G
  Q3 --> G
  Q4 --> G
```

### `mps_email.gold.iterable_conversion_sends`

Grain: one row per (conversion, send in lookback). Empty path stored as the conversion with null send — that row is Direct.

```text
conversion_id
email
conversion_ts
dollar
dollar_kind          -- policy_annual | eapp_annual
message_id           -- null = direct
campaign_id
campaign_name        -- for EmailType = split(_, '_')[1]
send_ts
days_before
position_from_last   -- 1 = last-touch
position_from_first  -- 1 = first-touch
```

## 5. Queries — same standard as slide 10

### Purple · last-touch + revenue-per-send · play

```sql
SELECT campaign_id, sum(dollar) AS dollar, count(*) AS conversions
FROM mps_email.gold.iterable_conversion_sends
WHERE position_from_last = 1
  AND conversion_ts BETWEEN ${__from} AND ${__to}
GROUP BY 1

-- revenue per send (not CTR)
SELECT c.campaign_id,
       sum(c.dollar) / nullif(sum(g.event_count), 0) AS revenue_per_send
FROM mps_email.gold.iterable_conversion_sends c
JOIN mps_email.gold.iterable_email_event_counts_5min g
  ON g.campaign_id = c.campaign_id AND g.event_name = 'emailSend'
WHERE c.position_from_last = 1
GROUP BY 1
```

### Teal · first-touch + lifecycle · play

```sql
SELECT split(campaign_name, '_')[1] AS email_type,  -- Marketing, Trigger, Dispo, Eapp, Sunset, …
       sum(dollar) AS dollar
FROM mps_email.gold.iterable_conversion_sends
WHERE position_from_first = 1
  AND conversion_ts BETWEEN ${__from} AND ${__to}
GROUP BY 1
```

### Orange · linear + email vs direct · play

```sql
-- linear: each send on the path gets dollar / n
SELECT campaign_id, sum(dollar / n_sends) AS dollar
FROM (
  SELECT campaign_id, dollar,
         count(message_id) OVER (PARTITION BY conversion_id) AS n_sends
  FROM mps_email.gold.iterable_conversion_sends
  WHERE message_id IS NOT NULL
    AND conversion_ts BETWEEN ${__from} AND ${__to}
) t
GROUP BY 1

-- direct vs assisted
SELECT
  CASE WHEN message_id IS NULL THEN 'direct' ELSE 'email-assisted' END AS path,
  sum(dollar) AS dollar
FROM mps_email.gold.iterable_conversion_sends
WHERE conversion_ts BETWEEN ${__from} AND ${__to}
  AND (position_from_last = 1 OR message_id IS NULL)
GROUP BY 1
```

### Navy · time-decay · play · LTV later

```sql
-- half-life 7 days if DOC does not name one
SELECT campaign_id,
       sum(dollar * power(0.5, days_before / 7.0)
             / sum(power(0.5, days_before / 7.0)) OVER (PARTITION BY conversion_id)
       ) AS dollar
FROM mps_email.gold.iterable_conversion_sends
WHERE message_id IS NOT NULL
  AND conversion_ts BETWEEN ${__from} AND ${__to}
GROUP BY 1
```

### Job that fills the path · we own

```sql
INSERT INTO mps_email.gold.iterable_conversion_sends
SELECT
  p.PolicyKey AS conversion_id,
  p.Email AS email,
  p.SignDate AS conversion_ts,
  p.PolicyAnnualPremium AS dollar,
  'policy_annual' AS dollar_kind,
  ev.message_id,
  ev.campaign_id,
  ev.campaign_name,
  ev.event_timestamp AS send_ts,
  datediff(p.SignDate, ev.event_timestamp) AS days_before,
  row_number() OVER (PARTITION BY p.PolicyKey ORDER BY ev.event_timestamp DESC) AS position_from_last,
  row_number() OVER (PARTITION BY p.PolicyKey ORDER BY ev.event_timestamp ASC)  AS position_from_first
FROM edm.gold.vw_policy_fact p
LEFT JOIN mps_email.silver.iterable_system_email_events ev
  ON lower(ev.email) = lower(p.Email)
 AND ev.event_name = 'emailSend'
 AND ev.event_timestamp BETWEEN p.SignDate - INTERVAL 90 DAYS AND p.SignDate
WHERE p.PolicyAnnualPremium IS NOT NULL
  AND p.Email IS NOT NULL
```

## 6. What we do not ship

|  | Why |
|---|---|
| $ on gold-1 | No email on the cube. Path needs person + send. |
| Grafana on `vw_enrollments_es` | Too wide. Same reason Audience is gold-2, not silver scan. |
| Last-touch-only as "the slide" | The four colors are the dashboard. They share one table. |
| CTR as the purple card | ROI is $ per send / per conversion, not click/send. |
| True ROI in v1 | Email spend is not in this catalog. Revenue-per-send still plays. |
| LTV pie in v1 | Commissions exist; "segment" and "engagement score" are not named. Same join, later card. |
| Policy-bridge as last-touch | `cuySessionId = dialerCallId` is "same call," not the path of emails. |

Picks if nobody answers: conversion = issued policy; lookback = 90d; half-life = 7d; v1 = all four credit queries; ROI unlabeled; LTV later.

---

Same pattern as [Audience (slide 10)](iterable-grafana-audience.html): extra table we own, Grafana on gold, joins already in this catalog. No Iterable REST for category.
Parent: [iterable-grafana.html](iterable-grafana.html).
PPT slides 6, 11, 12.
<!-- VERBATIM SOURCE: iterable-grafana-revenue.md ENDS -->
