# Design Orchestrator — Exemplar: MaMa-CRM — Crosscutting Concepts, Architecture Decisions

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-mama-crm.md (the index —
provenance, the source's own short overview, and the pointer list to all five companions live there). Reached
only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the index
itself. Part of the same split (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own
SPLIT-default rule) that keeps the index itself under the ~500-line smell threshold.

Everything from each marker below to its matching closing marker is the source document's own text, byte-for-
byte — the "Cross-cutting Concepts" (arc42 §8) and "Architecture Decisions" (arc42 §9) sections of the
MaMa-CRM arc42 document (Gernot Starke; full citation and provenance live in the index). An `[Image elided: ...
— original path ...]` bracketed note marks each point an embedded image was elided; the index's own closing
note lists all eighteen, named honestly rather than dropped silently. This document's own internal cross-
references (e.g. `["import raw"](../06-runtime-view/)`) point at the live examples.arc42.org site's own
routing and will not resolve here; left verbatim rather than silently rewritten, per the same discipline A6's
own index applies to its now-broken in-file anchors.

---

## 8 Cross-cutting Concepts (arc42 §8)

<!-- VERBATIM SOURCE: 08-crosscutting-concepts.md BEGINS -->

## 8.1 Generated Persistence based upon Domain Model

MaMa uses a code generator to generate all (!!) required persistence
code from a UML entity model. The overall concept of this generation is depicted
in the following diagram. Generic and campaign-specific parts are stereotyped
in this diagram. The «campaign-specific» Data Management component is
automatically created and packaged by the build process.

[Image elided: Overview of Code Generation — original path ../images/8-code-generation-overview.png]

|Element|Applicability |Description|
|--|--|--|
|Core Domain Model |«generic» |UML model containing the generic classes and relations every MaMa instance needs. |
| | | |
|Core Domain Data Management |«campaign-specific» |Handwritten code, some Hibernate stuff, some generic finder and repository methods. |
| | | |
|Specific Domain Model |«campaign-specific» |UML model enhancing the Core Domain Model. |
| | | |
|Data Management |«campaign-specific» |Java jar archive generated by the code generator specifically for a campaign. Name and ID of campaign is contained in metadata, so different instances of this element are distinguishable, e.g. for audit or revision purposes.|
| | | |
|[Code Generator](../08-crosscutting-concepts/) |«generic» | not shown in diagram. |

This concept relies on the following prerequisites:

### Prerequisites:

* Every MaMa instance will handle data related to individual
  people - called _clients_ in MaMa domain terminology.
* All clients will have a small number of common attributes.
* For all productive campaigns MaMa needs to handle an arbitrary number
  of additional attributes.

* Every mandator will _add_ several campaign-specific attributes to
  the client, and/or will add campaign specific types (like insurance-contract
  or mobile-phone-contract)
* Once configured prior to campaign start, these campaign specific data structures
  will rarely change[^didnotchange]

[^didnotchange]: In several years of MaMa operation, data structures within an active campaign always remained fix, therefore MaMa did never need any data migration utilities...

### 8.1.1 Generic Domain Model ("MaMa-Core-Domain")

[Image elided: MaMa Generic Domain Model — original path ../images/8-generic-domain.png]

|Element|Description                                 |
|-|-|
|Client|Abstract class, representing a person plus corresponding contact information.  |
| | |
|Contact|Contact information that will be used for contacting the client instances during campaign execution. |
| | |
|Next Action   |Generic class describing campaign activities. Central to the concept of [campaign process control](../08-crosscutting-concepts/) and business rule execution |

### 8.1.2 Example for a Campaign Specific Domain Model

Specific campaign models always contain a (physical) copy of the complete
core domain. The abstract Client class always need to be subclassed, and might
be 1:n associated with additional classes.

[Image elided: Specific Comain Model (for hypothetic insurance campaign) — original path ../images/8-specific-domain.png]

### 8.1.3 Generator Details

* MaMa uses OpenArchitectureWare to generate the complete persistence code.
* Generation relies on the open source Hibernate O/R mapping and persistence framework.
* The generator generated the following elements:
  * DDL code to create database, schema, tables and indices.
  * Hibernate mapping files
  * Campaign specific implementations of `findClientByXY`, `findNextActivity` and similar  methods
  * A number of campaign- and configuration specific methods for reporting and monitoring
* m:n associations are not supported
* modifications of data structures are not possible when campaigns are already active.  

Due to nondisclosure agreements with InDAC we cannot show example source code
for the persistence concept.

**Alternatives**

* Initially MaMa had started with AndroMDA code generation framework, but
that open source project lost popularity, could not deliver the required support and
ceased working with newer Maven releases - so MaMa switched to OAW.
* MaMa uses the commercial MagicDraw UML (in version 9.0)
modeling tool, which can in principle generate code
based upon models, but proved to be too inflexible for the desired Hibernate integration.
The contracting entity (InDAC) refused to upgrade to newer versions or alternative tools.

## 8.2 CSV Import / Export

* TODO: Describe (some) details of the CSV configuration DSL
* TODO: Describe (customized) Eclipse editor for these DSLs

## 8.3 Configurable File Filters

As explained in the runtime scenario ["import raw"](../06-runtime-view/),
every file read during import from an external source needs to be transformed
via configurable filters. We most often have two kinds of filters, encryption
and compression.

The names and required parameter settings for every filter is managed
as part of the activity configuration within a campaign.

### Encryption filters

Encryption filters are compliant to the Java Cryptography Architecture
([JCA](https://docs.oracle.com/javase/8/docs/technotes/guides/security/crypto/CryptoSpec.html)),
interfaces.

We urge mandators and partners to use crypto providers from
the [BouncyCastle](https://www.bouncycastle.org/java.html) portfolio.
Encryption and decryption filters need credentials or certificates
as part of their configuration.

>Due to the sensitive nature of data handled by the original MaMa system
>the owner required strict nondisclosure in that aspect. Therefore we are
>not allowed to go into any detail of security.

### Compression filter

MaMa supports only losless compression algorithms,
Compression can be configured to be either DEFLATE (as used in zip or gzip)
or varieties of Lempel-Ziv compression. Compression filters have
no parameters.

## 8.4 Rule Engine for Process and Flow Control

### 8.4.1 Flow of Action

### 8.4.2 Drools as Rule Engine
MaMa uses the open source rule engine [Drools](https://www.drools.org) for definition, implementation and
execution of business rules. Rules are defined as text files, which is interpreted
at runtime by the rule engine. This enables modification and maintenance of
rules without recompilation and redeployment of the whole system.

On the other hand, faulty rules can seriously hamper an active campaign – therefore
modification of business rules shall always be thoroughly tested!

Rules always have a simple “when `<A>` then `<B>`” format, where `<A>` and `<B>` are Java expressions.

You find a complete reference and many examples of the rule language at
[Drools documentation home](https://www.drools.org/learn/documentation.html).
<!-- VERBATIM SOURCE: 08-crosscutting-concepts.md ENDS -->

## 9 Architecture Decisions (arc42 §9)

<!-- VERBATIM SOURCE: 09-architecture-decisions.md BEGINS -->

No Commercial CRM Tool

: Do not use any of the commercial CRM tools as foundation for MaMa.
The main reason was the incredible amount of flexibility required to quickly
setup campaigns. This decision proved to be correct, as several early competitors
(which operated upon slightly customized standard CRM tools) failed to enter
the market MaMa operated in.

JBoss Drools for Rule Processing

: Use JBoss Drools as rule processing engine. We evaluated Python (Jython) as
an alternative, but that proved to be incredibly slow for our kind of processing.

No ETL Tool for Data import

: Do not use an ETL tool for importing data. The contractor, InDAC, refused
to consider the license fee of commercial ETL tools - therefore the development
team had no chance to even evaluate those as data import solutions.
<!-- VERBATIM SOURCE: 09-architecture-decisions.md ENDS -->

