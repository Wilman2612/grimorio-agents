# Design Orchestrator — Exemplar: Iterable/Grafana Dashboard (CEO-authored) — Audience Extension

Companion depth file of ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard.md
(the index — provenance, the why-index-plus-six-companions reasoning, and the pointer list to all six
companions live there). Reached only from the index; **NEVER referenced directly, and NEVER loaded by default**
— same standing as the index itself. This is the CEO's own original file, verbatim, at its own original length
— the CEO's own separately-bounded "extra" question for PPT slide 10 (Audience), never merged into or split out
of the main scorecard companion.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the CEO's own `iterable-grafana-audience.md`. This file's own internal cross-links to its five siblings (e.g.
`iterable-grafana.html`, `iterable-grafana-revenue.html`) point at the CEO's original `.html` site, not at this
split's own `.md` companion filenames, and are left verbatim rather than silently rewritten — the index's own
closing note names this explicitly.

---

<!-- VERBATIM SOURCE: iterable-grafana-audience.md BEGINS -->
# Audience extension — Iterable Grafana

Extension of the scorecard · PPT slide 10 · not Revenue · not A–D gold-1

# Audience is green. Extra we own: gold-2 (one email). EmailType is already on the webhook name.

**Slide 10 ships as Grafana observability — period vs previous period — from gold-2. No Iterable REST.**

Scorecard A–D does not change. Gold-1 still has no email. Revenue (slide 11) is green with its own path gold.
Prod names are `{site}_{EmailType}_{when}` — `AFL.com_Marketing_Aug`, `MA.com_Trigger_5day`, `MA.com_Sunset_0day`.
Journeys also stamp `EmailType: Dispo` on labels; blast Marketing is `labels []` so we parse the name, not labels.
PPT words welcome / nurture / win-back are not in prod — paint EmailType; DOC maps if they want those labels.
`GET /api/campaigns` is optional (Pete Campaign List: state / sendSize only). Not required for this slide.
Parent: [iterable-grafana.html](iterable-grafana.html).

[Themes](#themes) [Reference table](#ref) [Why gold-2](#why) [Flow](#flow) [EmailType](#job) [What we offer](#offer) [What we do not](#not) [12.4%](#math) [Win-back](#winback) [SQL](#sql)

## 0. Five themes — then stop

| Theme | Why it matters |  | Detail |
|---|---|---|---|
| Grafana, not Power BI | The mock +12.4% is this window vs the last window of the same length. Not 1,000 / 1,000,000 of lifetime list. | settled | [§ 12.4%](#math) |
| Gold-2, one email | Lifecycle, DMA, frequency, overlap, age, AFID need a person grain. Gold-1 dropped email on purpose. | build | [§ flow](#flow) |
| EmailType on the name | Prod already encodes type in `campaign_name`. Parse token 2. No `GET /api/campaigns` for this slide. | on the webhook | [§ EmailType](#job) |
| Joins we already have | Age = CUY / enrollments. Acquisition = AFID master. DMA = zip hop. Do not round-trip Iterable Users API for data we pushed. | our tables | [§ offer](#offer) |
| What we do not ship | No million-ID list bronze. No lifetime % of padrón. No Users API for DOB. No $. Subscribe as list-join is DOC webhook config. | out of scope | [§ not offered](#not) |

## 1. Reference — every slide 10 panel

This is the table the scorecard points at. Sufficiency is the query. "Green" means Grafana can paint the panel from what we build; it does not mean 100% of Iterable's user census.

| PPT panel | What the mock says | What we offer | Grain / table | What we do not offer |
|---|---|---|---|---|
| Subscriber Growth Rate +12.4%<br>Rolling 90-day net adds | How much the audience grew this window vs the previous window of the same length. | flow vs flow<br>`neto(this range) / neto(previous range) − 1`. Unsub is gold-1. Subscribe as list-join is Iterable project webhook config (DOC), not a Databricks bronze hole. Optional cheap `GET /lists/{id}/size` if they want level vs level (two integers N). | gold-1 counts; optional one-row size snapshot | 1,000 / 1,000,000 of lifetime list. Bronze of every email on the list. Power BI unique-sent vs list size. |
| List Churn Rate 3.1%<br>Unsubscribes + bounces | A % — of sends, or of list size. | of sends<br>`(unsub + bounce) / send` this window vs previous. Same gold-1 rates as A–D. Bounce is not a re-subscribe. | gold-1 | Churn as % of the Iterable padrón (needs integer N). Bounce does not remove someone from a list. |
| Re-engagement Rate 18.6%<br>Win-back campaign lift | How much win-back campaigns outperform the rest (open / CTR). | parse the name<br>`split(campaign_name, '_')[1]` → Marketing, Trigger, Dispo, Eapp, Sunset, Newsletter, … PPT "win-back" is not a prod string. Paint EmailType. DOC maps if they want the mock words. Iterable has no native "win-back" type. GET not required. | gold-1 `campaign_name` | Unsub then subscribe again. That is re-sub of the same email, and it is **not** the mock text. Catalog GET for state/sendSize — optional, not this panel. |
| Lifecycle<br>Active / At-risk 30+ / Lapsed 60+ / Unsub | Share of "subscribers" in each bucket. | people we emailed<br>Last open / last unsub on gold-2. Grafana time picker still applies to "as of now in this stream". | gold-2 1 email | Share of the Iterable list census (people we never emailed). That is the padrón we are not bronzing. |
| Segment overlap | Over-targeted across campaigns. | campaign overlap<br>Distinct `campaign_id` per email on silver sends. "Segment" here is not `GET /lists`. | silver events | Iterable list-object overlap. CDP Segment the product. |
| Engagement frequency | Sends vs opens per person. | counts on gold-2. | gold-2 | — |
| Cohort retention 30/60/90 | Retention by acquisition channel. | AFID channel × last_open. First-send date from silver as cohort start. | gold-2 + AFID master | Iterable `signupDate` pulled back from Users API. |
| Age / life stage<br>FROM ITERABLE badge | <64 / 65–69 / 70+. | our DOB<br>`edm.silver.cuy_leads.dateOfBirth` and enrollments `Age`. We already push DOB to Iterable via APIM. Do not fetch it back. Hit rate is not 100% (never-enrolled / never-CUY). | gold-2 JOIN CUY / enrollments | `cds_persons` (DESCRIBE: no DOB). ZIP `MedianAge`. Users API round-trip. |
| Geography (Top DMAs) | Florida / Texas / Ohio in the mock — Nielsen DMA. | zip hop<br>Send `tpmo.zipCode` → `dim_geography` → `dim_geography_dma`. Remaining risk: county string ("Brevard" vs "Brevard County"). | gold-2 | Iterable profile zip pulled back. DMA is not a webhook field. |
| Acquisition source<br>Paid Search / Broker / Organic | Pie "from Iterable subscriber data". | AFID proxy<br>We push `signupSource` / `afid` into Iterable. Join `sns_lead.gold.afid_master`. The pie is our write, not a new Iterable pull. | gold-2 JOIN afid_master | A second copy of the same field via Users API. |
| Device & open time | Mobile 9–11 / desktop 1–3. | two grains<br>People: gold-2 `last_device` / `hour(last_open)`. Events: gold-1 `user_agent_device` (Confluence View 3). Do not mix them. | gold-2 and gold-1 | — |

Confluence's 7 Grafana views never asked for this slide. PPT use case 2 did. Pete's Campaign List is a POC of campaignState / sendSize — optional, not the EmailType we parse from the webhook.

## 2. Why we need gold-2 — not a campaigns REST job

A–D already play from gold-1: 5-minute counts, no email. Audience asks questions about **people**. EmailType is already on gold-1 as `campaign_name`. Those are two different extras — only gold-2 is new.

```text
flowchart TB
  subgraph a_d [A–D already green]
    G1["gold-1 · 15 keys · 5 min counts
    campaign_name already there"]
  end
  subgraph aud [Audience · this extension]
    G2["gold-2 · 1 email 1 row
    last_open last_unsub last_zip last_afid"]
  end
  G1 -->|"cannot answer who"| G2
  G1 -->|"parse token 2"| WB["EmailType = split(campaign_name, '_')[1]
  Marketing Trigger Dispo Eapp Sunset"]
  G2 --> Life[lifecycle DMA age AFID frequency]
  WB --> Lift[lift by EmailType · no REST]
```

| Ask on slide 10 | Why gold-1 is not enough | What we add |
|---|---|---|
| Active / lapsed / unsub as people | Gold-1 is event counts. "Last open 60 days ago" is a person state. | Gold-2 `GROUP BY email`. |
| DMA, age, Paid Search | Gold-1 dropped email, zip, AFID-as-person. Joins are warehouse tables we already own. | Gold-2 keeps last zip / last AFID, then JOIN. |
| Overlap across campaigns | Need distinct campaign_id per email. Cube has no email. | Silver events, person grain. |
| Win-back / lifecycle lift | Rates exist on gold-1. The PPT word "win-back" is not a prod string — EmailType is. | `split(campaign_name, '_')[1]`. Not a new event type. Not a GET. |
| Growth +12.4% | Not a person join. It is flow vs flow on the same stream. | Gold-1 unsub + subscribe-if-DOC-enables. Optional integer N. Not gold-2. |

## 3. The flow — three boxes, not one pipe

Legend: we write · Iterable stores · we read for Grafana

### Databricks / ops (we write)

- **CUY leads** — dateOfBirth, email, afid — we already push
- **enrollments Age** — applicants only
- **afid_master** — channel / tactic
- **dim_geography → dma** — zip hop, not Iterable geo
- **No GET /campaigns** — EmailType is on the send name. Optional later: state/sendSize only.

→ APIM update · Segment daily push →

### Iterable (Iterable stores)

- **User profile** — copy of DOB / afid / signupSource _we_ wrote
- **Lists** — Iterable owns emailListIds. We do not fill them from gold.
- **Campaign name on the send** — `{site}_{EmailType}_{when}` lands on the webhook. Catalog GET is a different source (state/sendSize).
- **Send engine** — send / open / bounce / skip — webhook already landing

→ webhook events already landing →

### Grafana (this job) (we read for Grafana)

- **gold-1 5 min** — A–D closed. Growth/churn-of-sends. EmailType from campaign_name.
- **gold-2 1 email** — Audience people: lifecycle, DMA, age, AFID, frequency
- **No silver campaigns table** — Not needed for category. Parse the name on gold-1.
- **No Grafana Iterable plugin** — Pete = Infinity + dump. We persist the webhook instead.

Left → middle is push (APIM / Segment). Middle → right is the webhook we already have. The profile does not come back by itself. Lists are not written from the left. There is no REST pull on the green path.

```text
sequenceDiagram
  participant CUY as CUY / AFID / geo
  participant APIM as APIM users/update
  participant I as Iterable
  participant WH as system-webhooks
  participant B as bronze payload
  participant S as silver events
  participant G1 as gold-1 5min
  participant G2 as gold-2 person
  participant Gr as Grafana
  CUY->>APIM: DOB, afid, signupSource
  APIM->>I: profile write
  I->>WH: emailSend / Open / Bounce / Unsub / Skip
  WH->>B: JSON as-is
  B->>S: 1 webhook = 1 row
  S->>G1: GROUP BY 15 keys including campaign_name
  S->>G2: GROUP BY email
  G2->>CUY: join DOB / Age / AFID / DMA
  G1->>Gr: rates, growth of sends, EmailType from name
  G2->>Gr: lifecycle, DMA, age, AFID
```

## 4. EmailType is on the webhook — no REST

### What we use · already on gold-1

Prod campaign names follow `{site}_{EmailType}_{when}`. Distinct `emailSend` names in bronze already show Marketing, Newsletter, Trigger, Dispo, Eapp, Sunset, Birthday, Guidebook, SOA, Trustpilot, Proposal, Esig. Parse the second underscore token. Journeys also put `EmailType: Dispo` on labels; blast Marketing is `labels []`, so the name is the source that works for both. No Databricks secret. No MERGE catalog. No join.

### Webhook (already exists)

The send already carries `campaignId` and `campaignName`. Gold-1 keeps both as labels. Token 2 is EmailType.

### Not needed: GET /campaigns for category

The catalog GET returns state, sendSize, Blast/Triggered — fields this slide does not ask. Using it to label win-back was the old plan. Prod names already encode the type. Pete still prototyped the GET; we do not ship it for Audience.

```text
flowchart LR
  N["campaign_name on gold-1
  AFL.com_Marketing_Aug
  MA.com_Trigger_5day
  MA.com_Sunset_0day"] --> P["split(_, '_')[1]
  Marketing / Trigger / Sunset"]
  P --> G["Grafana lift by EmailType"]
```

```sql
-- EmailType from the webhook name already on gold-1. No JOIN, no REST.
SELECT split(campaign_name, '_')[1] AS email_type,
       SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count END)
         / SUM(CASE WHEN event_name='emailSend' THEN event_count END) AS open_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}
GROUP BY 1
```

PPT mock says welcome / nurture / win-back. Those strings are not in prod names. We paint EmailType. DOC can map Sunset/Trigger → "win-back" if they want the mock words — that is a label list, not a table.

Optional later, not required to paint this slide green: `GET /api/campaigns` for Pete Campaign List columns (campaignState / sendSize). `GET /lists/{id}/size` only if they insist on level-vs-level list growth instead of flow-vs-flow. Neither is on the green path.

## 5. What we are offering

### Grafana · what we can paint

**Audience Insights · our stream** — range: **last 90d** · compare: **previous 90d**

- Growth · flow vs flow: **+12.4%**
- Churn of sends: **3.1%**
- Win-back lift: **+18.6%**
- Active 30d: **58%**

**Lifecycle · gold-2 people we emailed**

|  | people |
|---|---|
| Active | 58% |
| At-risk 30–60 | 22% |
| Lapsed 60+ | 13% |
| Unsub | 7% |

**DMA · zip hop · our geo**

| market | people |
|---|---|
| Tampa–St. Pete | — |
| Dallas–Ft. Worth | — |

**Age · CUY / enrollments**

| band | people with DOB |
|---|---|
| <64 | — |
| 65–69 | — |
| 70+ | — |

**Acquisition · AFID master**

| channel | people |
|---|---|
| Paid Search | — |
| Broker | — |

### PPT slide 10 — same panels, Grafana grain

![slide 10 Audience Insights](ppt-slides/slide-10.png)

Numbers in the mock are illustration. Grafana will compute them on the selected range vs the previous range of the same length. Age and AFID are "from Iterable" on the slide only because we wrote those fields into Iterable. We join the source of truth we already own.

## 6. What we are not offering

| Ask that sounds like Audience | Why it is out | If they still want it |
|---|---|---|
| Bronze of every email on the Iterable list (padrón of IDs) | The 12.4% mock does not need it. Overlap/lifecycle in Grafana is people we emailed (gold-2). A million-row snapshot is a different product. | A separate job, not this scorecard. Recurring export. Costly. Not required to go green. |
| Growth as 1,000 new / 1,000,000 lifetime = 0.10% | That number barely moves day to day. Grafana is not that chart. Power BI already does list-size commentary for skips. | Leave it in Power BI. |
| Users API `GET /users/get?email=` for DOB | We pushed `dateOfBirth` from CUY. Fetching our own write-back is the wrong direction. | Do not build it. |
| Age for every webhook email | CUY / enrollments will miss people who never became a lead or applicant. That is coverage, not a missing column. | Show "unknown" as a band. Hit rate is a sample still worth running, not a blocker. |
| List churn as unsub+bounce / list size | Needs integer N. Bounce does not leave the list. | Optional `GET /lists/{id}/size`. Cheap. Not in the green path. |
| Win-back = unsub then subscribe | The mock says campaign lift. Re-sub is a different metric and needs `emailSubscribe` as list-join. | Do not ship that as the 18.6% panel. |
| `emailSubscribe` as "joined the list" | 0 rows in unfiltered bronze (~11 days from 2026-08-14, off-AEP). Function does not drop it. Comms Audit: the event is the post-sale BPO / Disenrollment trigger. | DOC: enable the webhook as list-join, or confirm it is not that event. Config, not our bronze. |
| Revenue $ / LTV / last-touch | Slide 11. Separate extra: path gold from policy/enrollment $ × silver sends. Not this file. | [Revenue extension](iterable-grafana-revenue.html) — green with path gold. No Iterable REST. |

## 7. Why +12.4% is green without a million IDs

Grafana is watched every day. Time picker. Refresh. "Is this window worse than the last one?" A lifetime % of the list is a Power BI question and it goes flat.

### Grafana (this project)

Observability. Compare the selected range to the previous range of the same length. Confluence already drew 14-day trends and project thresholds that way.

- Rates in the window: bounce/send, unsub/send
- This window vs the last one
- Spikes, skips, something broken now

### Power BI (Lynn Bass / Reporting)

Static analysis. Weekly / AEP. Year-to-date totals. Unique sent vs list size (to explain skips). That already exists. It is not this job.

Suppose the list has 1,000,000 people (or we email a million). A normal month adds 1,000. A wild AEP adds 100,000. A year later the list is 10,000,000 and the same AEP adds another 100,000.

| Formula | Normal month +1k | AEP +100k on 1M | Same AEP on 10M | Does 12.4% appear? |
|---|---|---|---|---|
| net / lifetime padrón | 1k / 1M = **0.10%** | 100k / 1M = **10%** | 100k / 10M = **1%** | No. The same work looks worse every year. |
| N(today) / N(90d ago) − 1 | ~0.10% | ~10% | ~1% | Still small except AEP. Needs two integers N, not a million IDs. |
| neto(this 90d) / neto(previous 90d) − 1 | 1,000 / 890 − 1 ≈ **12.4%** | 12.4% if last AEP was ~89k | same: 100k vs 89k | **Yes.** Independent of 1M or 10M. This is Grafana. |

```text
flowchart TB
  subgraph have [Already on gold-1]
    U[unsub count this bucket]
    S[send count this bucket]
    U2[unsub previous bucket]
  end
  subgraph doc [DOC config, not our bronze]
    Sub["emailSubscribe as list-join
    0 rows today · Comms Audit = post-sale BPO"]
  end
  subgraph skip [Not this job]
    IDs[bronze of every list email]
    LifePct["1k / 1M lifetime %"]
  end
  have --> Flow["flow vs flow
  neto this range / neto previous − 1"]
  have --> VsSend["unsub/send this 5m vs previous
  churn of sends — no list needed"]
  doc --> Flow
  skip -.->|do not build| X[out]
```

A bank statement without an opening balance does not give you the account total. Flow vs flow does not need the opening balance. The mock +12.4%, if it is not a made-up mock number, is flow vs flow. That is why a million-ID bronze is not the green path.

Today the net flow is incomplete: we have outs (unsub), not list-joins (subscribe). That hole is Iterable project webhook configuration. The Azure Function on `system-webhooks` does not filter event types. If DOC turns list-join on, silver already plans to parse it. Until then Grafana still paints unsub vs unsub and churn-of-sends.

## 8. Win-back is campaign lift — not unsub then subscribe

The mock subtitle is **Win-back campaign lift**. In email that is a campaign to lapsed people (no open in 60+ days). Lift is how much better that campaign's open/CTR is than the rest. It is not someone who unsubscribed and came back.

| If the panel meant… | What that is | Do we have it? |
|---|---|---|
| What the mock says: lift of win-back campaigns | Open/CTR of those campaigns vs others | name is on the event. Parse EmailType. PPT "win-back" is not a prod string — paint Sunset / Trigger / Dispo. |
| Lapsed → active again | % of 60d-no-open who opened again | yes gold-2 `last_open`. Same lifecycle. No subscribe needed. |
| Unsub then subscribe again | Re-sub of the same email | Unsub yes; list-join no (DOC). **Not the mock text.** Do not ship this as 18.6%. |

```text
flowchart LR
  L[lapsed people
  gold-2 last_open over 60d] --> C[EmailType on campaign_name
  Sunset / Trigger / Dispo]
  C --> O[they open again]
  O --> Lift["lift = open_rate of that EmailType
  / open_rate of the rest − 1"]
  U[emailUnSubscribe] -.->|not this panel| R[emailSubscribe re-sub]
```

## 9. Queries — same standard as the scorecard

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

### E2 device + hour · play

People on gold-2. Event pie on gold-1 is Confluence View 3. Do not mix.

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

### E4 DMA · play · zip hop

```sql
SELECT dma.dmacode, dma.market, count(*) AS people
FROM mps_email.gold.iterable_email_person p
LEFT JOIN edm.gold.dim_geography g
  ON g.ZipCode = p.last_zip_code
LEFT JOIN edm.gold.dim_geography_dma dma
  ON dma.state = g.State
 AND lower(dma.county) = lower(g.County)
GROUP BY 1, 2
-- Remaining risk: county string. dim_geography.MedianAge is census ZIP age — do not use it for E5.
```

### E5 age · play · CUY + enrollments · unknown band for the rest

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
-- DESCRIBE cds_persons: no DOB. Do not GET /users/get to retrieve the DOB we pushed.
```

### E6 acquisition · play · AFID we already write

```sql
SELECT am.channel, am.sub_channel, count(*) people
FROM mps_email.gold.iterable_email_person p
LEFT JOIN sns_lead.gold.afid_master am ON am.afid = p.last_trk_afid
GROUP BY 1,2
```

### E7 growth + churn of sends · play · Grafana formula

```sql
-- Churn of sends this window vs previous. Bounce is not re-sub.
SELECT
  SUM(CASE WHEN event_name IN ('emailUnSubscribe','emailBounce') THEN event_count END)
    / SUM(CASE WHEN event_name='emailSend' THEN event_count END) AS churn_of_sends
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}

-- Growth flow vs flow. Subscribe lands only if DOC enables list-join on the webhook.
SELECT
  (SUM(CASE WHEN event_name='emailSubscribe' THEN event_count ELSE 0 END)
   - SUM(CASE WHEN event_name='emailUnSubscribe' THEN event_count ELSE 0 END))
  AS neto
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}
-- Grafana: neto(this) / neto(previous) - 1. Unsub-only still paints vs previous unsub.
```

### E8 lift by EmailType · play · parse `campaign_name`

See [§ 4](#job). Same query as the scorecard. No catalog JOIN.

```sql
-- Token 2 of {site}_{EmailType}_{when}. No REST.
SELECT split(campaign_name, '_')[1] AS email_type,
       SUM(CASE WHEN event_name='emailOpen' AND is_bot IS NOT TRUE THEN event_count END)
         / SUM(CASE WHEN event_name='emailSend' THEN event_count END) AS open_rate
FROM mps_email.gold.iterable_email_event_counts_5min
WHERE bucket_start BETWEEN ${__from} AND ${__to}
GROUP BY 1
```

<details>
<summary>Hunt leftovers — not blockers for green</summary>

1. DOC: confirm / enable `emailSubscribe` as list-join (Comms Audit currently = post-sale BPO).
2. CUY hit rate: how many webhook emails have `dateOfBirth`. Not run.
3. DMA county string match on a sample.
4. DOC maps EmailType → mock words (welcome / nurture / win-back) only if they want those labels. Prod does not have those strings.
5. Optional `GET /api/campaigns` only if they want Pete Campaign List (state / sendSize). Not EmailType.
6. Optional `GET /lists/{id}/size` only if they want level-vs-level N.

A–D / gold-1 / `(send − bounce)/send` do not wait on any of these.

</details>

---

Parent scorecard: [iterable-grafana.html](iterable-grafana.html).
PPT slide 10 from Grafana Iterable Uses.odp.
EmailType from webhook `campaign_name`. Pete's GET /campaigns stays a POC of state/sendSize — not this slide.
Revenue (green + path gold): [iterable-grafana-revenue.html](iterable-grafana-revenue.html).
Do not commit keys. Do not implement notebooks until asked.
<!-- VERBATIM SOURCE: iterable-grafana-audience.md ENDS -->
