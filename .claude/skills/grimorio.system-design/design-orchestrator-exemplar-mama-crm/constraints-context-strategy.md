# Design Orchestrator — Exemplar: MaMa-CRM — Constraints, Context and Scope, Solution Strategy

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-mama-crm.md (the index —
provenance, the source's own short overview, and the pointer list to all five companions live there). Reached
only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the index
itself. Part of the same split (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own
SPLIT-default rule) that keeps the index itself under the ~500-line smell threshold.

Everything from each marker below to its matching closing marker is the source document's own text, byte-for-
byte — the "Architecture Constraints" (arc42 §2), "Context and Scope" (arc42 §3), and "Solution Strategy"
(arc42 §4) sections of the MaMa-CRM arc42 document (Gernot Starke; full citation and provenance live in the
index). An `[Image elided: ... — original path ...]` bracketed note marks each point an embedded image was
elided; the index's own closing note lists all eighteen, named honestly rather than dropped silently. This
document's own internal cross-references (e.g. `[section 8.3 on CSV-Import/Export](../08-crosscutting-concepts/)`,
`[section 7](../07-deployment-view/)`) point at the live examples.arc42.org site's own routing and will not
resolve here; left verbatim rather than silently rewritten, per the same discipline A6's own index applies to
its now-broken in-file anchors.

---

## 2 Architecture Constraints (arc42 §2)

<!-- VERBATIM SOURCE: 02-architecture-constraints.md BEGINS -->

## General Constraints

Setup Campaign without programming

: To setup a campaign, no _programming_ shall be necessary. _Configuration_ in various forms  is allowed. 

Implementation based upon Java 

: MaMa-CRM shall work on a recent Java runtime (>1.6)

Use Oracle(tm) as database

: InDAC holding company has negotiated a favorable deal with Oracle Inc. considering license and maintenance fee, therefore Oracle-DB has to be used for data storage.

## Software Infrastructure Constraints

* Linux operating system (preferably RedHat Enterprise Linux, as there exist _hardened_ editions certified by several security organizations.
* Open source frameworks with liberal licenses are possible (esp.: GNU and FSF licenses not allowed)
* Code generation / MDSD preferred for development
* Use of (UML) modeling tool recommended
* InDAC prefers iterative development processes but does not impose them.
* Sound technical documentation: InDAC emphasizes long-lasting, robust and cost-effective software systems and therefore strongly requires maintainable, understandable and expressive technical documentation (part of which you are currently reading).

## Operational constraints

* Every MaMa-CRM instance shall be operable in its own virtual machine
* MaMa shall run in batch/background mode to minimize operation overhead
* Complete configuration shall be possible from custom Eclipse plugin (alternatively: via browser)
<!-- VERBATIM SOURCE: 02-architecture-constraints.md ENDS -->

## 3 Context and Scope (arc42 §3)

<!-- VERBATIM SOURCE: 03-context-and-scope.md BEGINS -->

## 3.1 (Generic) Business Context

Every MaMa  instance communicates with a single mandator and one or more partner organizations,
like shown in the diagram below. Partners are external service providers, for example printer, mail delivery services, scan services, call-center or internet hosting providers.

[Image elided: MaMa Generic Business Context (informal) — original path ../images/3-informal-business-context.png]

|Interface / Neighbor system |Exchanged Data |
|-|---|
|Client and campaign master data |(inbound, from mandator)	Mandator transfers campaign and client master data to MaMa-CRM. |
| | |
|Final results  (outbound, to mandator) |MaMa transfers final campaign results back to mandator. This is the ultimate goal of the campaign. |
| | |
|Status reports |MaMa periodically sends status reports to the mandator and interested partners. |
| | |
|Clarification requests |Sometimes client data is wrong, outdated or corrupted, so that certain activities within the campaign cannot be executed for this client. In such cases, MaMa sends clarification requests to the mandator: The corresponding client data has to be checked - and returned to MaMa in corrected way or the client is revoked and will not be processed any further by MaMa. |
| | |
|Client data (outbound, to partner) |MaMa sends client data to partners, depending on campaign business rules and processing results. MaMa has a distinct interface configured for every partner. |
| | |
|Preliminary results (inbound, from partner)	|Partners send results of their respective work back to MaMa. This data is called “preliminary results”, as it requires processing and evaluation by MaMa before it can be marked as final. Process logs and partner status report are also transmitted to MaMa via this interface. |

**Client data (outbound)**

Client data is sent to partners on a "need-to-know" basis to achieve data minimality:
Every partner organization gets only the data they absolutely require to fulfill their
campaign tasks.

For example, MaMa will not disclose clients' street address to call centers (they usually
  get to know name, phone contact and sometimes one or two additional attributes for verification purposes.)

On the other hand, print service providers usually don't get to know the phone numbers of clients, as the latter is not required to deliver printed letters via postal services.

### 3.1.1 Formal Business Context
The diagram below contains a more formal version of the context diagram. It includes
an `admin` interface, which was left out in the informal version above.

[Image elided: MaMa Generic Business Context (informal) — original path ../images/3-business-context.png]

The `admin` interface enables MaMa and campaign administrators to perform all required
administrative tasks needed to init, configure and operate campaigns.

### 3.1.2 Specific Business Context: Mobile Phone Contract Modification

The following diagram details the example already shown in [section 1.1.1](../01-introduction-and-goals/).

[Image elided: Mobile Phone Example Context — original path ../images/3-telco-sample-context.png]

The data flows are detailed (in excerpts!) in the following table:

|Neighbor System |Exchanged Data|Format|
|-|--|--|
|Mandator (inbound)|Client Master Data: Name, Address, Contact, Contract, Tariff. Once for every client in the campaign, second as response to clarification requests. |Zip-compressed CSV, via sftp (mandator uploads) |
| | |
|Mandator (outbound)|Final results: ID, tariff and contract details for every client who accepted the contract modification proposal |Zip-compressed CSV over sftp, MaMa uploads |
| | |
|Mandator (outbound)|Clarification request    | ----- " ----- |
| | |
|Print Service Provider (outbound) |Print Data: Name, Address, parts of contract and tariff. |Zip-compressed, PGP-encrypted CSV via http upload |
| | |
|... |... |...|

**Mapping of Attributes to CSV-Fields**

For every instance of MaMa, the mapping of data attributes to fields/records in data
transmissions has to be specified in detail. This is done by a domain specific language,
details are described in [section 8.3 on CSV-Import/Export](../08-crosscutting-concepts/)

## 3.2 Technical / Deployment Context

MaMa instances are supposed to run distinct virtual machines (whereas certain[^distincthardware] mandators
or campaigns require instances to be deployed on their own physical hardware -
which results in significantly higher campaign costs.)

Details of the MaMa deployment are explained in the
[deployment view in section 7](../07-deployment-view/)

The following diagram gives a schematic overview of the typical MaMa deployment setup.

[Image elided: Typical MaMa Deployment Context — original path ../images/3-typical-deployment-context.png]

|Element |Description|
|-|---|
|«Instance» MaMa  |A distinct instance of MaMa, running a specific campaign (connected to a single mandator and a number of campaign-specific partner organizations) |
| | |
|InDAC Hardware |Physical server (Dell, HP or similar), located on InDAC premises. Running RHE Linux and a virtualization environment (not shown in diagram) |
| | |
|«Category» Mandator |For every MaMa instance there is one distinct mandator.  |
| | |
|«Category» Partner  |For every MaMa instance there might be several different partner organizations, each one having a distinct communication channel. |
| | |
|«Instance» Database |Every MaMa instance has its own database instance, usually within the same virtual machine. |
| | |
|Linux VM | Virtualized (RHE) Linux environment. Configured to disallow unwanted external access (e.g. ssh only allowed from within InDAC) |
| | |

[^distincthardware]: Some mandators with extremely high security requirements negotiated their own distinct physical hardware for their MaMa instance(s).
<!-- VERBATIM SOURCE: 03-context-and-scope.md ENDS -->

## 4 Solution Strategy (arc42 §4)

<!-- VERBATIM SOURCE: 04-solution-strategy.md BEGINS -->

Here you just find the shorthand form of the architectural approaches to
the most important (quality) requirements, plus the links to the detailed
description in section 8 (crosscutting concepts).

|Goal/Requirement    |Architectural Approach |Details|
|--|---|-|
|[Flexible Data Structure](../01-introduction-and-goals/) |Database structure + persistence code is completely (100%) generated from UML-model |[Section 8.1](../08-crosscutting-concepts/) |
| | | |
|[Flexibility in Transmission Formats (CSV and fix-record-formats)](../01-introduction-and-goals/)|Create domain-specific languages for CSV and fix-format import/export configurations. Build an ANTLR based parser for these languages plus the corresponding interpreters. |[Section 8.2](../08-crosscutting-concepts/) |
| | | |
|Flexibility (Configurable CSV/fix formats) |Implement customized editor for CSV/fix DSL as Eclipse plugin |[Section 8.2](../08-crosscutting-concepts/)  |
| | | |
|[Performance](../01-introduction-and-goals/) (import/process 250k images/24hrs) |Treat images as special case, store images in filesystem instead of database, create unique path/filename based upon cient-ID, include load-testing in automatic build, create test-data generator |Include special case for image persistence in [code generator, Section 8.1](../08-crosscutting-concepts/) |
| | | |
<!-- VERBATIM SOURCE: 04-solution-strategy.md ENDS -->

