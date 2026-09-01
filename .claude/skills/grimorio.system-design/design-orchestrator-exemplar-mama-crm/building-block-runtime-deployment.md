# Design Orchestrator — Exemplar: MaMa-CRM — Building Block View, Runtime View, Deployment View

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-mama-crm.md (the index —
provenance, the source's own short overview, and the pointer list to all five companions live there). Reached
only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the index
itself. Part of the same split (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own
SPLIT-default rule) that keeps the index itself under the ~500-line smell threshold.

Everything from each marker below to its matching closing marker is the source document's own text, byte-for-
byte — the "Building Block View" (arc42 §5), "Runtime View" (arc42 §6), and "Deployment View" (arc42 §7)
sections of the MaMa-CRM arc42 document (Gernot Starke; full citation and provenance live in the index). An
`[Image elided: ... — original path ...]` bracketed note marks each point an embedded image was elided; the
index's own closing note lists all eighteen, named honestly rather than dropped silently. This document's own
internal cross-references (e.g. `[Section 6.1](../06-runtime-view/)`, `[filter concept](../08-crosscutting-concepts/)`)
point at the live examples.arc42.org site's own routing and will not resolve here; left verbatim rather than
silently rewritten, per the same discipline A6's own index applies to its now-broken in-file anchors.

---

## 5 Building Block View (arc42 §5)

<!-- VERBATIM SOURCE: 05-building-block-view.md BEGINS -->

## 5.1 MaMa Whitebox Level 1

[Image elided: MaMa Whitebox (Level1 ) — original path ../images/5-MaMa-Level-1.png]

**Rationale**:
The structure of building blocks within MaMa is based upon _functional decomposition_ and the concept of _generated persistence_ (see [section 8.1](../08-crosscutting-concepts/)).

**Contained Blackboxes:**

|Element       |Description                                 |
|--------------|--------------------------------------------|
|Import Handler |Imports data from Partners or Mandator via external interfaces |
| | |
|--------------|--------------------------------------------|
|Export Handler|Exports data to Partners or Mandator via external interfaces |
| | |
|--------------|--------------------------------------------|
|Configuration  |Maintains configuration of all import- and export activity types, import- and export filters and campaign business rules. Includes syntax driven editors for configuration. |
| | |
|--------------|--------------------------------------------|
|Reporting |Reports campaign state to Mandator and Partners, as configured. |
| | |
|--------------|--------------------------------------------|
|Process Control |Responsible for management and execution processes within a campaign, especially for execution of campaign specific business rules. |
| | |
|--------------|--------------------------------------------|
|Campaign Data Management |Completely generated. Stores all client- and campaign data.|
| | |
|--------------|--------------------------------------------|
|Operations Monitoring |Monitors (and reports) all import and export processes plus database and application state.|
| | |
|--------------|--------------------------------------------|
|Code Generator |Generates the (complete) `CampaignDataManagement` from a campaign specific UML model. See [persistence concept](../08-crosscutting-concepts/) for details. |  
|--------------|--------------------------------------------|

### Import Handler (Blackbox)

**Intent/Responsibility:** `Import Handler` contains the core functions
to imports data from Partners or Mandator via external interfaces. It handles
csv, fix-format or xml input, either or both encrypted and compressed of configurable
structure.

**Interfaces:**

|Interface (From-To) | Description        |
|----|-----------------------------------------------|
|`getImportConfig`  |Read all required configuration information to perform imports, especially details about data structures (like csv formats) and filter chains. |
| | |
|---|-----------------------------------------------|
|`storeClient` |Sends an imported instance of `Client` to `CampaignDataManagement` to be either updated or inserted. |
| | |
|----|-----------------------------------------------|
|`tryImport`(from `ProcessControl`) |ProcessControl either calls or schedules a specific imports activity. |
| | |
|----|-----------------------------------------------|
|`ImportHandler` -> external port |ImportHandler needs to access various external entities, like ftp server, file system or even remote access to Mandator or Partner hosts.  |

**Quality of Service:**

ImportHandler implements extensive failure handling mechanisms and can therefore deal
with a large number of error categories (e.g. communication errors, data format errors,
  compression and encryption issues and so forth.)

**Details:**

For details see the [Import Handler (Whitebox)](../05-building-block-view/).

### Configuration (Blackbox)

**Intent/Responsibility:** `Configuration` is responsible to provide deploy-time flexibility
to all MaMa subsystems. It handles the following kinds of configuration information:

* Data import and export configuration
  * csv, fix-format and xml formats
  * transmission and routing information, endpoints, network configuration
  * configuration for compression, encryption and similar filter operations
  * account and security information required to communicate with the campaign-specific
  external systems.

* Campaign configuration
  * validation rules
  * activities: what kind of imports, exports and maintenance activities are required for this campaign?
* Configuration for archiving of imported data

**Interfaces:**

* For all configuration methods, the campaignID and mandatorID need always be input parameters.
* Configuration information is always subclass of the (abstract) superclass `Configuration`.

|Interface (From-To) |Description |
|----|-----------------------------------------------|
|`getImportConfig` |Methods to get import configurations for a specific campaign. |
| | |
|`getExportConfig` |Methods to get export configurations for a specific campaign.  |
| | |
|`getCampaignConfig` | |
| | |
|`store/retrieveConfig` |Calls DataManagement to store/retrieve configuration data. |

**Quality of Service:**
(not documented)

## MaMa Level 2

### Import Handler (Whitebox)

[Image elided: untitled — original path ../images/5-importHandler.png]

**Rationale**: This is (again) based upon _functional decomposition_ of the
generic import process. [Section 6.1](../06-runtime-view/)
describes the runtime behavior of this component.

**Contained Blackboxes:**

|Element|Description|
|-|---|
|`Receiver` |Receives data from partners or mandators via the ImportData port.|
| | |
|`ImportErrorHandler` |Handles the various possible errors during import. With severe errors, import is stopped. Many (especially record or object level) errors are recoverable - these will be logged, eventually the administrator is notified. |
| | |
|`ImportData` (Port) |Connection to the outside world - via ftp and http, usually transmitted via VPN. |
| | |
|`FileArchiver` |Non-erasable archive where all imported files are kept for auditability. |
| | |
|`FileFilter` |Various filter operations, like decrypt, unzip etc. Explained in the [filter concept in section 8](../08-crosscutting-concepts/) |
| | |
|`Validator` |Checks files, records (collections of strings) and client objects for validity. |
| | |
|`UnMarshaller` |Creates Java objects from collections of strings by using reflection magic. You don't want to know all the dirty details of this component. |
| | |

**Important Interfaces:**

Not documented.

## MaMa Level 3

### Receiver (Whitebox)

[Image elided: untitled — original path ../images/5-receiver-level-3.png]

**Rationale**: We have to admit that this structure just evolved out of a number of prototypes.
A more functional oriented design would most likely improve understandability, but we
never refactored the code into that direction due to different priorities.

**Contained Blackboxes:**

|Element|Description|
|-|---|
|`Directory` or `WebService` or `Message` - `Listener` |Components that listen for input of specific kinds, e.g. the `DirectoryListener` watches for new files to appear in certain directories, (configurable) either in a local or remote file system.|
| | |
|`FileProcessor` |Completely handles input files, calls all required operations to be performed on the file (archive, unzip, decrypt etc.). A big mess of spaghetti code - you don't want to look at it... |
| | |
|`FileToRecordSplitter` |Depending on configuration, creates a collection of records from the imported file. Most often a record is represented by a single row/line within the file, but sometimes several lines from the file have to be combined. |
| | |
<!-- VERBATIM SOURCE: 05-building-block-view.md ENDS -->

## 6 Runtime View (arc42 §6)

<!-- VERBATIM SOURCE: 06-runtime-view.md BEGINS -->

## 6.1 Import File

One of the major use cases is _Import File_, which can be from both mandator
and partner. Such files contain always contain `Client` related data in
configurable formats (CSV, fix-formats or XML).

We split the explanation of _import file_ into two phases:

1. Import Raw File Generic (from an external source)
2. Validate the imported data and update the internal `Client` database

### 6.1.1 Import Raw Generic

At first we explain the _generic_ import, where no campaign-specific
activities are executed. This concerns `configureReceiveChannel`
and especially the `instantiateFilterChain()`
activities.

[Image elided: (First part of data import:) Import Raw File — original path ../images/9-getRawFile.png]

1. tryImport: `ProcessControl` starts the import. The `activity` is a uniqe
ID identifying the mandator, the campaign and the activity.
2. `importConfiguration` gets all required configuration information
3. `configureReceiveChannel` prepares everything needed to get data
from an external source. For example, URL, filenames and authentication credentials for
an external ftp server need to be configured here.
4. `archive` sends the file to the (configured) archive system, usually
an optical write-once non-erasable backup archive.
5. `setup` initializes the required filters, e.g. unzip or decrypt.
6. `filter` executes all the filters

The steps 5+6 are a dynamically configured pipes-and-filter
dataflow subsystem. You find some more info in
the [filter concept](../08-crosscutting-concepts/).

### 6.1.2 Validate File

**Prerequisite:** Data has been imported from external source, has been successfully
filtered (i.e. decrypted and decompressed). See previous section (Import Raw).

The diagram below contains error handling. In _good cases_ there will be no errors.
Calls to `ImportErrorHandler` are only executed if errors occur!

[Image elided: (Second part of data import:) Validate imported data — original path ../images/9-validateRawData.png]
<!-- VERBATIM SOURCE: 06-runtime-view.md ENDS -->

## 7 Deployment View (arc42 §7)

<!-- VERBATIM SOURCE: 07-deployment-view.md BEGINS -->

## 7.1 Deployment Overview

It was a longstanding goal of MaMa to deploy and operate each MaMa campaign
on a dedicated virtual machine, to clearly separate mandator specific data from
other instances.

The operating-system level configuration and operation mode of these virtual machines
and their host machine directly influences the level of security the campaigns
have. These topics have to be subject of regular security inspections and reviews.

>Due to the sensitive nature of data handled by the original MaMa system
>the owner required strict nondisclosure in that aspect. Therefore we are
>not allowed to go into any detail of security.

[Image elided: MaMa Deployment Overview — original path ../images/7-deployment-overview.png]

|Element |Description                           |
|--------|--------------------------------------|
|Campaign-i |Virtual machine for one single campaign. |
| | |
|Common Metadata Store |Used only in eHealth campaigns to synchronize generation of CIN IDs (see [below](../07-deployment-view/)) |
| | |
|Campaign Configuration Workstation |Workstation (standard PC running Java-enabled OS) used to configure campaigns. |
| | |
|CIN request |Request for Common Insurance Number (see [below](../07-deployment-view/)) |

## 7.2 Campaign Specific Virtual Machine

For every campaign operated by InDAC there will be a single dedicated virtual
machine containing a database instance and all required MaMa code (except the
  graphical configuration UI).

## 7.3 Common Metadata Store (CoMeS)

The German government regulations for the eHealth card contained a very specific process to generate
the "Common Insurance ID" (CID) for persons: This ID could only be generated by a single government entity (formerly the GPFunds, "Deutsche Rentenanstalt", since 2012 the [ISTG](https://de.wikipedia.org/wiki/Informationstechnische_Servicestelle_der_gesetzlichen_Krankenversicherung)).

Requests for calculating the 10-digit CID have to be wrapped in a _request envelope_ containing
the following metadata:

* Unique ID of the requesting entity (usually the tax ID number of the organization/company
  issueing the request.) MaMa needed to use the tax ID of the InDAC data center.
* request purpose (for MaMa, a constant)
* request sequence number (RSN)

This RSN needed to be an uninterrupted sequence of numbers, as GPFunds wanted to make sure
it did not miss any request. For MaMa that implied some synchronization mechanism between otherwise
independend virtual machines. We decided to implement the Common Metadata Store for this reason.

For security reasons MaMa did not use a real database for this purpose, but this custom-build
synchronization solution.

## 7.4 Campaign Configuration Machine

One (or several) operator workstations (standard PC's) will be used to configure
MaMa instances after they have been physically deployed on their respective VMs.

The configuration UI is build as Eclipse RCP plugin.
<!-- VERBATIM SOURCE: 07-deployment-view.md ENDS -->

