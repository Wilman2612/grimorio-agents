# Design Orchestrator — Exemplar: MaMa-CRM — Quality Requirements, Risks and Technical Debt, Glossary

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-mama-crm.md (the index —
provenance, the source's own short overview, and the pointer list to all five companions live there). Reached
only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the index
itself. Part of the same split (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own
SPLIT-default rule) that keeps the index itself under the ~500-line smell threshold.

Everything from each marker below to its matching closing marker is the source document's own text, byte-for-
byte — the "Quality Requirements" (arc42 §10), "Risks and Technical Debt" (arc42 §11), and "Glossary" (arc42
§12) sections of the MaMa-CRM arc42 document (Gernot Starke; full citation and provenance live in the index).
This span carries no embedded images of its own (all eighteen sit in earlier sections; the index's own closing
note lists every one). This document's own internal cross-references (e.g. `[section 1.2.2](../01-introduction-and-goals/)`)
point at the live examples.arc42.org site's own routing and will not resolve here; left verbatim rather than
silently rewritten, per the same discipline A6's own index applies to its now-broken in-file anchors.

---

## 10 Quality Requirements (arc42 §10)

<!-- VERBATIM SOURCE: 10-quality-requirements.md BEGINS -->

(for a brief overview of quality requirements, please see [section 1.2.2](../01-introduction-and-goals/)).

## Flexibility Scenarios

|ID |Scenario |
|---|---------------------------|
|F1 |New CSV import format shall be configurable at CCT  within 2 hours. |
| | |
|F2 |New fix-field import format shall be configurable at CCT within 2 hours. |
| | |
|F3 |New XML based import format shall be configurable at CCT within 2 hours. |
| | |
|F4 |New CSV export format shall be configurable at CCT within 2 hours. |
| | |
|F5 |New fix-field export format shall be configurable at CCT within 2 hours. |
| | |
|F6 |New XML based export format shall be configurable at CCT within 2 hours. |

**CCT**: Campaign configuration time

In all cases we require both a documentation of the desired format, plus a minimum
of 10 different test data records.

## Runtime Performance Scenarios

|ID |Scenario |
|---|---------------------------|
|P1 |Import and fully process 250.000 scanned documents (including images) within 24hrs. That's an average processing rate of approximately 3 complete documents per second. Import format will be a combination of csv file plus images as single files.|
| | |
|P2 |Import and fully process 100.000 records of csv file within 30 minutes |
| | |

## Security Scenarios

|ID |Scenario |
|---|---------------------------|
|S1 |Client and campaign data from one mandator shall never be accessible for another mandator. |
| | |
|S2 |MaMa is required to preserve all incoming data from mandators and partners for the appropriate timeframe (usually 90-180 days after the end of a campaign). Such archived data (e.g. files or messages) needs to be made completely accessible for an auditor or inspection within 90 minutes at most.  |
| | |
|S3 |In case campaigns involve financial data of clients (e.g. credit card, bank account or similar information), these have to be processed and managed compliant to [PCIDSS](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard) regulations.
<!-- VERBATIM SOURCE: 10-quality-requirements.md ENDS -->

## 11 Risks and Technical Debt (arc42 §11)

<!-- VERBATIM SOURCE: 11-risks-and-technical-debt.md BEGINS -->

* The `Receiver` component suffers from overly complicated source code,
created by a number of developers without consent. Since early days, most production bugs resulted from this part of MaMa-CRM.

* The runtime flexibility of import/export configurations and campaign processes might lead to incorrect and _undetected_ behavior at runtime, as there are no configuration checks. Mischievous administrators can misconfigure any MaMa-CRM instance at any time.

* Configuration settings are not archived and therefore might get lost (so there might
be no fallback to the last working configuration in case of trouble).   

* The 'Common-Metadata-Store' is an overly trivial and resource-wasting synchronization
mechanism and should be replaced with a decent async / event-based system asap.
<!-- VERBATIM SOURCE: 11-risks-and-technical-debt.md ENDS -->

## 12 Glossary (arc42 §12)

<!-- VERBATIM SOURCE: 12-glossary.md BEGINS -->

|Term|Definition|
|-|----|
|Activity |Process step of campaign. For MaMa-CRM: either inbound, outbound or internal. |
| | |
|Activity, internal |Scheduled data maintenance activities, i.e. removing some data 90 days after its last usage. In Germany, data security law requires some kinds of data to be deleted after certain intervals. |
| | |
|Activity, inbound |Read data (i.e. files) delivered by either a ->partner or ->mandator. |
| | |
|Activity, outbound |Send data to either a partner or mandator. |
| | |
|Branch office |Business organization directly associated with mandator, serves a subset of one mandators’ consumers. |
| | |
|Campaign |Coordinated set of activities, initiated by a ->mandator towards a potentially large number of ->clients. MaMa-CRM campaigns usually aim at acquiring certain kinds of data, like passport photographs, social security numbers, signatures etc. |
| | |
|CID  |Common Insurance ID, 10-digit number to uniqely identify an health insured person in Germany. Created by a central agency. |
| | |
|Client |aka: Consumer. Single person or company with a business relationship to mandator. The end user of the services or products provided by the mandator. |
| | |
|CSV | Comma Separated Value |
| | |
|End user |Synonym for consumer. |
| | |
|InDAC |Contractee of MaMa-CRM, the data-center that initiated and payed for its development. Provides CRM campaign services for several mandators. |
| | |
|Instance |MaMa-CRM is a family of systems, where a single instance is configured and operated for exactly one mandator and one or more campaigns. |
| | |
|Mandator |Organization responsible for a campaign. Conducts business in a mass-market domain like insurance, telecommunication, retail or energy. |
| | |
|Partner |_Category_ name for service providers: Organization or enterprise providing services for MaMa, like printing, scanning, phone and call-center, mail delivery, and so forth. |
| | |
|PCIDSS |[Payment Card Industry Data Security Standard](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard), a collection of proprietary standards for secure handling and managemant of credit card related data.
| | |
|RSN |Request sequence number, 0-padded 8-digit string containing the sequence number of CID requests. |
<!-- VERBATIM SOURCE: 12-glossary.md ENDS -->

