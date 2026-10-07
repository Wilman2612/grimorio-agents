# Design Orchestrator — Exemplar: Iterable/Grafana Dashboard (CEO-authored) — JSON-vs-Silver Field Map

Companion depth file of ref:agent/grimorio.design-orchestrator/exemplar-ceo-dashboard.md
(the index — provenance, the why-index-plus-six-companions reasoning, and the pointer list to all six
companions live there). Reached only from the index; **NEVER referenced directly, and NEVER loaded by default**
— same standing as the index itself. This is the CEO's own original file, verbatim, at its own original length
— a single distinct concern (the full JSON-leaf-to-silver-column field map), never merged into the main
scorecard companion.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the CEO's own `iterable-schema-json-vs-silver.md`. This file's own internal cross-links to its siblings (e.g.
`iterable-grafana.html`, `iterable-dashboard-evidence.html`, `iterable-column-lineage.html`) point at the CEO's
original `.html` site, not at this split's own `.md` companion filenames, and are left verbatim rather than
silently rewritten — the index's own closing note names this explicitly.

---

<!-- VERBATIM SOURCE: iterable-schema-json-vs-silver.md BEGINS -->
Field map · JSON path vs silver vs gold

# Every JSON leaf, and the silver column it becomes.

> Compare is JSON (inside bronze `payload`) vs the silver this analysis defines. There is no Iterable silver table yet — a 15-column stub written before this analysis was discarded and is not a schema.
>
> Bronze (8 columns) already exists. Silver flattens every 1:1 scalar (including tpmo). Gold is the thin 5-min cube the mockups query. Headers never. Plan HTML is one STRING on silver, not exploded.

## 0. Counts

| Layer | Fields |
|---|---|
| Bronze Delta table | 8 columns. JSON is one STRING (`payload`). |
| Kafka record (dropped at ingest) | key, value, timestampType — not stored. value → payload. |
| JSON wrapper (Function) | 5 keys: topic_name, message, message_headers, message_enqueued_timestamp, processed_timestamp |
| message_headers | 14 keys (2 secrets). None go to silver. |
| message | 3 keys: email, eventName, dataFields |
| dataFields union (7 events) | 47 top-level keys |
| dataFeed.trk | 12 leaves |
| dataFeed.tpmo | 18 leaves (missed by one-row schema_of_json) |
| dataFeed.med_plans_benefits | 2 + 35 per result + planBenefits array of {categoryName, inNetwork, rawValue} |
| Silver (this analysis) | 84 columns: 14 survive to gold + 70 stay silver-only. tpmo = 17 cols + 1 plan STRING. Headers out. |

## 1. Bronze Delta — mps_email.bronze.iterable_system_webhook_raw_events

From `src/bronze/bronze_streaming_ingestion_azure.py` CREATE TABLE. This is the database table. The Iterable schema lives *inside* payload.

| Bronze column | Type | Source | Silver | Gold |
|---|---|---|---|---|
| `id` | BIGINT IDENTITY | Delta | bronze_row_id | no |
| `source_topic_name` | STRING | JSON `topic_name` | topic_name | no |
| `partition` | INT | Event Hub / Kafka | no | no |
| `offset` | BIGINT | Event Hub / Kafka | no | no |
| `stream_name` | STRING | Kafka topic | no | no |
| `stream_enqueued_timestamp` | TIMESTAMP | Kafka timestamp | message_enqueued_at (from JSON) + keep bronze ts as bronze_inserted companion | no |
| `payload` | STRING (full JSON) | Kafka value | not copied | no |
| `row_inserted_timestamp` | TIMESTAMP | Delta default now() | bronze_inserted_at | no |
| **Kafka fields dropped in transform (not bronze columns)** | | | | |
| `key` | BINARY | Kafka | dropped | no |
| `value` | BINARY | Kafka → payload | — | no |
| `timestampType` | INT | Kafka | dropped | no |

## 2. JSON wrapper — inside payload (Function format_message)

| JSON path | Type | Silver | Gold |
|---|---|---|---|
| `$.topic_name` | STRING | topic_name | no |
| `$.message` | STRUCT | exploded | no |
| `$.message_headers` | MAP | no (secrets) | no |
| `$.message_enqueued_timestamp` | STRING ISO | message_enqueued_at | no |
| `$.processed_timestamp` | STRING ISO | processed_at | no |
| `$.message.email` | STRING | email | no |
| `$.message.eventName` | STRING | event_name | PK |
| `$.message.dataFields` | STRUCT | exploded below | — |

## 3. message_headers — 14 keys, all out

| Header | Role | Silver | Gold |
|---|---|---|---|
| `SasKey` | secret | no | no |
| `subscription-key` | secret | no | no |
| `SasKeyName` | policy name | no | no |
| `Namespace` | id | no | no |
| `Topic` | id | no | no |
| `key` | hostname (≠ sendingDomain) | no | no |
| `Request-Id` | trace | no | no |
| `Request-Context` | trace | no | no |
| `X-AppGW-Trace-Id` | trace | no | no |
| `X-ORIGINAL-HOST` | infra | no | no |
| `X-Original-URL` | infra | no | no |
| `X-FORWARDED-PROTO` | infra | no | no |
| `X-FORWARDED-PORT` | infra | no | no |
| `X-Forwarded-For` | infra | no | no |

## 4. dataFields — every top-level key (prod union, 7 events)

Path = `$.message.dataFields.<key>`. Events: S send, O open, C click, B bounce, K skip, U unsub, P complaint.

| JSON key | Type | Events | Silver | Gold |
|---|---|---|---|---|
| `bounceMessage` | STRING | B, U rare | bounce_message | no |
| `campaignId` | BIGINT | S O C B K U P | campaign_id | PK |
| `campaignName` | STRING | S O C B K U P | campaign_name | label |
| `catalogCollectionCount` | BIGINT | S | catalog_collection_count | no |
| `catalogLookupCount` | BIGINT | S | catalog_lookup_count | no |
| `channelId` | BIGINT | S O C B K U P | channel_id | no |
| `channelIds` | ARRAY<BIGINT> | U | channel_ids | no |
| `city` | STRING | O C | city | no |
| `contentId` | BIGINT | S O C K | content_id | no |
| `country` | STRING | O C | country | no |
| `createdAt` | STRING → TIMESTAMP | S O C B K U P | created_at + event_timestamp | bucket_start |
| `dataFeed` | STRUCT (see §5–7) | S (~213k/221k) | trk + tpmo exploded; plans as STRING | 4 trk keys |
| `email` | STRING | S O C B K U P | email | no |
| `emailId` | STRING | S O C B K U P | email_id | no |
| `emailListIds` | ARRAY | U | email_list_ids | no |
| `emailSubject` | STRING | S O C B K U P | email_subject | no |
| `esDocumentId` | STRING | S C B K U P (not O) | es_document_id | no |
| `espName` | STRING | S | esp_name | no |
| `experimentId` | STRING | S O C B K U P | experiment_id | PK |
| `fromPhoneNumber` | STRING | U | from_phone_number | no |
| `hrefIndex` | BIGINT | C (206/9037) | href_index | no |
| `ip` | STRING | O C | ip | no |
| `isBot` | BOOLEAN | O C | is_bot | PK |
| `labels` | ARRAY<STRING> | S O C B K U P | labels | no |
| `linkUrl` | STRING | C | link_url | no |
| `locale` | STRING | S O C B K U P | locale | no |
| `messageBusId` | STRING | S | message_bus_id | no |
| `messageId` | STRING | S O C B K U P | message_id | lookup only |
| `messageTypeId` | BIGINT | S O C B K U P | message_type_id | no |
| `messageTypeIds` | ARRAY | U | message_type_ids | no |
| `productRecommendationCount` | BIGINT | S | product_recommendation_count | no |
| `proxySource` | STRING | O C | proxy_source | no |
| `reason` | STRING | K | skip_reason | PK |
| `recipientState` | STRING | B P, U rare | recipient_state | PK |
| `region` | STRING | O C | region | no |
| `sendingDomain` | STRING | S | sending_domain | PK |
| `templateId` | BIGINT | S O C B K U P | template_id | PK |
| `templateName` | STRING | S O C B K U P | template_name | no |
| `timeZone` | STRING | O C | time_zone | no |
| `trackedLink` | STRUCT | C | exploded §4b | no |
| `transactionalData` | STRING | S K | transactional_data | no |
| `unsubSource` | STRING | U | unsub_source | no |
| `url` | STRING | C | url | no |
| `userAgent` | STRING | O C | user_agent | no |
| `userAgentDevice` | STRING | O C | user_agent_device | no (v1 cube) |
| `workflowId` | BIGINT (U: STRING in infer) | S O C B K U P | workflow_id | no |
| `workflowName` | STRING | S O C B K U P | workflow_name | no |
| **4b. trackedLink leaves** | | | | |
| `trackedLink.templateUrl` | STRING | C | tracked_link_template_url | no |
| `trackedLink.trackingId` | STRING | C | tracked_link_tracking_id | no |

## 5. dataFeed.trk — 12 leaves (send only, AFID dashboard)

| JSON path | Type | Silver | Gold |
|---|---|---|---|
| `dataFeed.trk.afid` | STRING | trk_afid | PK stamped |
| `dataFeed.trk.vertical` | STRING | trk_vertical | PK stamped |
| `dataFeed.trk.email_type` | STRING | trk_email_type | PK stamped |
| `dataFeed.trk.project` | STRING | trk_project | PK stamped |
| `dataFeed.trk.campaign` | STRING | trk_campaign | no (≠ campaignName) |
| `dataFeed.trk.program` | STRING | trk_program | no |
| `dataFeed.trk.template_name` | STRING | trk_template_name | no |
| `dataFeed.trk.promo_number` | STRING | trk_promo_number | no |
| `dataFeed.trk.sf_tfn` | STRING | trk_sf_tfn | no |
| `dataFeed.trk.did` | STRING | trk_did | no |
| `dataFeed.trk.call_link` | STRING | trk_call_link | no |
| `dataFeed.trk.encoded_parameter` | STRING | trk_encoded_parameter | no |

## 6. dataFeed.tpmo — 18 leaves (silver columns, not gold)

| JSON path | Type | Silver | Gold |
|---|---|---|---|
| `dataFeed.tpmo.zipCode` | STRING | tpmo_zip_code | no |
| `dataFeed.tpmo.countyFIPS[].name` | STRING | tpmo_county_fips_json | no |
| `dataFeed.tpmo.countyFIPS[].fips` | STRING | tpmo_county_fips_json | no |
| `dataFeed.tpmo.carrierCollectionKey` | STRING | tpmo_carrier_collection_key | no |
| `dataFeed.tpmo.mapd.standardPlans` | BIGINT | tpmo_mapd_standard_plans | no |
| `dataFeed.tpmo.mapd.specialNeedsPlans` | BIGINT | tpmo_mapd_special_needs_plans | no |
| `dataFeed.tpmo.mapd.total` | BIGINT | tpmo_mapd_total | no |
| `dataFeed.tpmo.pd.total` | BIGINT | tpmo_pd_total | no |
| `dataFeed.tpmo.ma.standardPlans` | BIGINT | tpmo_ma_standard_plans | no |
| `dataFeed.tpmo.ma.specialNeedsPlans` | BIGINT | tpmo_ma_special_needs_plans | no |
| `dataFeed.tpmo.ma.total` | BIGINT | tpmo_ma_total | no |
| `dataFeed.tpmo.snp.cSnp` | BIGINT | tpmo_snp_csnp | no |
| `dataFeed.tpmo.snp.dSnp` | BIGINT | tpmo_snp_dsnp | no |
| `dataFeed.tpmo.snp.iSnp` | BIGINT | tpmo_snp_isnp | no |
| `dataFeed.tpmo.snp.total` | BIGINT | tpmo_snp_total | no |
| `dataFeed.tpmo.carriers` | BIGINT | tpmo_carriers | no |
| `dataFeed.tpmo.brands` | BIGINT | tpmo_brands | no |
| `dataFeed.tpmo.plans` | BIGINT | tpmo_plans | no |

## 7. dataFeed.med_plans_benefits — plan-object keys (one silver STRING, not exploded)

From the prod emailSend. Every leaf below maps to the same silver column `med_plans_benefits_json`. `planBenefits` is an array of maps keyed by category name; each item is `{categoryName, inNetwork, rawValue}` (HTML). Exploding it would change grain. Not on gold.

| JSON path | Type | Silver | Gold |
|---|---|---|---|
| `med_plans_benefits.zipCode` | STRING | med_plans_benefits_json | no |
| `med_plans_benefits.planCount` | BIGINT | med_plans_benefits_json | no |
| `results[].specialNeedsPlan` | STRING / null | med_plans_benefits_json | no |
| `results[].deductible` | BIGINT | med_plans_benefits_json | no |
| `results[].initialCoverageLimit` | BIGINT | med_plans_benefits_json | no |
| `results[].catastrophicLimit` | BIGINT | med_plans_benefits_json | no |
| `results[].maximumOutOfPocket` | BIGINT | med_plans_benefits_json | no |
| `results[].outOfNetworkMaximumOutOfPocket` | BIGINT | med_plans_benefits_json | no |
| `results[].outOfNetworkMedicalDeductible` | BIGINT | med_plans_benefits_json | no |
| `results[].combinedMedicalDeductible` | BIGINT | med_plans_benefits_json | no |
| `results[].premiumRange` | STRING | med_plans_benefits_json | no |
| `results[].acceptsMailOrder` | BOOLEAN | med_plans_benefits_json | no |
| `results[].annualCost` | BIGINT | med_plans_benefits_json | no |
| `results[].drugCost` | BIGINT | med_plans_benefits_json | no |
| `results[].lowPerformer` | BOOLEAN | med_plans_benefits_json | no |
| `results[].enrollmentFormURL` | STRING | med_plans_benefits_json | no |
| `results[].starRatingsURL` | STRING | med_plans_benefits_json | no |
| `results[].summaryOfBenefitsURL` | STRING | med_plans_benefits_json | no |
| `results[].name` | STRING | med_plans_benefits_json | no |
| `results[].planType` | STRING | med_plans_benefits_json | no |
| `results[].planCode` | STRING | med_plans_benefits_json | no |
| `results[].carrierName` | STRING | med_plans_benefits_json | no |
| `results[].carrierLogoUrl` | STRING | med_plans_benefits_json | no |
| `results[].year` | STRING | med_plans_benefits_json | no |
| `results[].rating` | STRING | med_plans_benefits_json | no |
| `results[].premium` | BIGINT | med_plans_benefits_json | no |
| `results[].medicalDeductible` | BIGINT | med_plans_benefits_json | no |
| `results[].hasVision` | BOOLEAN | med_plans_benefits_json | no |
| `results[].hasDental` | BOOLEAN | med_plans_benefits_json | no |
| `results[].hasHearing` | BOOLEAN | med_plans_benefits_json | no |
| `results[].hasInsulinSavings` | BOOLEAN | med_plans_benefits_json | no |
| `results[].hasPreferredPharmacies` | BOOLEAN | med_plans_benefits_json | no |
| `results[].benefitCheckImageUrl` | STRING | med_plans_benefits_json | no |
| `results[].sunfirePlanId` | STRING | med_plans_benefits_json | no |
| `results[].countyFips` | STRING | med_plans_benefits_json | no |
| `results[].commissionTypeId` | BIGINT | med_plans_benefits_json | no |
| `results[].nonCommissionable` | BOOLEAN | med_plans_benefits_json | no |
| `results[].planBenefits[].<category>[].categoryName` | STRING | med_plans_benefits_json | no |
| `results[].planBenefits[].<category>[].inNetwork` | BOOLEAN | med_plans_benefits_json | no |
| `results[].planBenefits[].<category>[].rawValue` | STRING (HTML) | med_plans_benefits_json | no |

## 8. Out of silver on purpose (still in bronze payload)

Out of silver: partition, offset, stream_name, payload blob, 14 headers. Out of gold (in silver): tpmo scalars, `med_plans_benefits_json`, device, geo, TFN, email. Gold adds `event_count` and `row_updated_at` (not in JSON).

---

Scorecard: [iterable-grafana.html](iterable-grafana.html).
Evidence: [iterable-dashboard-evidence.html](iterable-dashboard-evidence.html).
Lineage: [iterable-column-lineage.html](iterable-column-lineage.html).
Bronze CREATE: `src/bronze/bronze_streaming_ingestion_azure.py`. Wrapper: `deploy_azure/src/data_mps/streaming_events_helper.py`.
<!-- VERBATIM SOURCE: iterable-schema-json-vs-silver.md ENDS -->
