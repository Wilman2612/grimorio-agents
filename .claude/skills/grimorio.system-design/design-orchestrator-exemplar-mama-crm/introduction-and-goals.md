# Design Orchestrator — Exemplar: MaMa-CRM — Introduction and Goals

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-mama-crm.md (the index —
provenance, the source's own short overview, and the pointer list to all five companions live there). Reached
only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the index
itself. Part of the same split (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own
SPLIT-default rule) that keeps the index itself under the ~500-line smell threshold.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte — the
"Introduction and Goals" section of the MaMa-CRM arc42 document (arc42 §1; Gernot Starke; full citation and
provenance live in the index). An `[Image elided: ... — original path ...]` bracketed note marks each point an
embedded image was elided; the index's own closing note lists all eighteen, named honestly rather than dropped
silently. This document's own internal cross-references (e.g. `[section 1.1.2](../01-introduction-and-goals/)`,
`[chapter 12](../12-glossary/)`) point at the live examples.arc42.org site's own routing and will not resolve
here; left verbatim rather than silently rewritten, per the same discipline A6's own index applies to its now-
broken in-file anchors.

---

<!-- VERBATIM SOURCE: 01-introduction-and-goals.md BEGINS -->

This document describes the MaMa-CRM platform, a software product family to coordinate processes between mass-market-service-providers and their clients. MaMa-CRM provides the foundation for individual systems, which have to be customized or configured for specific CRM domains.

MaMa-CRM has been built and is being operated by an innovative datacenter
(let’s call it InDAC[^indac]) – a company providing a variety of hosted software services to its clients. Within business process outsourcing initiatives, InDAC is operating specific instances of MaMa-CRM for its customers.

[^indac]: The real company behind the MaMa-CRM system prefers not to be disclosed here. The name InDAC (= Innovative data center) is therefore pure fantasy. The original system wasn't called MaMa, but had a different name  – I hope you don’t mind.

Let’s clarify MaMa-CRM’s scope with a few brief examples (you’ll find more details in the
[requirements overview](../01-introduction-and-goals/)):

* Telecommunication providers offer new or updated tariffs to their customers. These have several possibilities, like email, phone, letter or fax, to respond or issue support queries regarding such offers.
* Retail organizations send specific advertising or marketing  material to certain parts of their customers. Again, these can react on several different communication channels. These kinds of advertisements are called _target group marketing_.
* Insurance companies propose modifications or enhancements of existing contracts to specific customer groups. Insured persons or organizations can react over different communication channels, like phone, mail, email or even in person. In case they accept this proposal, they have to submit a legally binding signature.

The following figure shows a generalized overview:

[Image elided: MaMa - Generalized Overview — original path ../images/1-generalized-overview.png]

In that figure, the mandator represents an arbitrary company or organization serving mass market customers. MaMa, our system, can host CRM campaigns for many different mandators from different industries.

>For an explanation of the terms campaign, activity, mandator and partner,
>please refer to the glossary in [chapter 12](../12-glossary/)

## 1.1 Requirements Overview

MaMa-CRM controls customer relationship CRM campaigns, which InDAC (the contractor of MaMa) conducts for his mandators. InDACs’ mandators are companies like insurance or telco enterprises – which themselves offer services or products to mass market customers. These mandators outsource their CRM related business processes to InDAC.

MaMa-CRM shall support the following campaign types:

* Changes to tariffs or contracts for insurance companies, telecom and internet service providers and energy suppliers. You’ll find a detailed example for this process below.
* Processing of billing information for call-by-call telephone service providers: Mandator submits billing data to MaMa, which coordinates printing, submission and support for the resulting invoices. Management or handling of payments is out-of-scope for MaMa-CRM.
* Management of binary images for credit card and insurance companies, which print cardholders’ images onto the cards to prevent misuse. The German e-Health card belongs
to this type.
* Meter reading for either energy or water providing companies or large-scale real-estate enterprises.

As MaMa is the foundation for a whole family of CRM systems, it shall be adaptable to a variety of different input and output interfaces and channels without any source code modification!
This interface flexibility is detailed in [section 1.1.2](../01-introduction-and-goals/).

### 1.1.1 Campaign Example: Mobile Phone Contract Modification

An example shall clarify the complex business and technical requirements to MaMa.

MoPho is a (hypothetical) mobile phone provider with a large customer base and a variety of different tariff options (flat fee, time-based, volume-based etc.). Some of these tariffs or tariff combinations are not marketable any longer (a shorthand for “MoPho does not earn its’ desired profit from them… - but that’s another story). Others are technically outdated.

In their ongoing effort to optimize their business, MoPho management decided to streamline their tariff landscape. Within a large campaign they contact every customer with outdated tariffs and offer upgrades to new and mostly more beneficial tariff options. Some customers get to pay less, but have to accept a longer contract duration. Others will have to pay a little more, but receive additional services, increased capacity, bandwidth or other benefits. In all cases where customers accept the new tariff
offer, the formal contract between MoPho and the customer has to be updated, which requires a valid signature to be legally binding[^signature].

MoPho intends to inform certain customers via printed letters of the new tariff offerings. Customers can react via letter, fax, phone or in person at one of MoPho’s many sales outlets. As MoPho’s core competency are _phone services_, it doesn’t want to bother with printing letters, scanning and processing replies, answering phone inquiries and dealing with other out-of-scope activities. Therefore they employ MaMa-CRM as an all-around carefree solution. Look at MaMa’s approach to this scenario:

[Image elided: Telecommunication Example Scenario — original path ../images/1-telco-sample-scenario.png]

The 9 steps depicted in that scenario need some explanation:

1. MoPho selects pertained customers from its internal IT systems. We’re talking about a 30+ million customer base and approximately 10 million of those customers will be part of this campaign. MoPho exports their address-, contract- and tariff data and transmits these to MaMa-CRM. MaMa imports this customer data.
2. MaMa forwards only the relevant parts of customer data to the print service provider (a «Partner»). This company creates personalized letters from address and tariff data, prints those letters and finally delivers them to the postal service (which ensures the letters finally end up in customers' mailboxes).
3. MaMa now informs the call center (also a «Partner») participating in this campaign, so they can prepare for the customers reaction.
4. In the meantime the print service has delivered the letters to the postal service,
which delivers letters to the customers. This is more difficult than it sounds: 1-5% of addresses tend to change  within 12 month, depending on the customer base. Some customers refuse to accept marketing letters. The postal service informs MaMa about all the problematic cases (address unknown, forwarding request etc.), so MaMa can decide on further activities.
5. The customers decide what to do with the letter: There's a multitude of options here:
   *	Customer fills out the enclosed reply form and signs it.
   * Customer fills out the reply form, but forgets to sign it.
   * Customer does not understand this offer and sends written inquiry by letter.
   * Customer inquires by phone call.
   * Customer ignores letter and does not react at all.
   * There are additional special cases (customer is not contractually capable, has a custodian or legal guardian, is under-age, deceased or temporarily unavailable…).
6. Let's assume the customer accepts and sends the letter back via postal service. These letters will be forwarded to the scan service provider (again, a «Partner»), which scans them and performs optical character recognition.
7. MaMa imports the scan-results from the scan service provider. Again, several cases are possible.
8. MaMa distinguishes between all possible cases and takes appropriate actions:
   * The form is completely filled and signed.
   * The form is completely filled, but customer forgot to sign.
   * Customer signed, but forgot to fill other important fields in the form...
   * If the form is not returned within an appropriate period of time, MaMa might decide
    to resend the letter, maybe even with a different wording, layout or even a different
    contractual offer.
   * Surely you can imagine several other possible options...
9. Finally, for every customer who accepted the changed tariff agreement, MaMa sends back
the appropriate information, so the mandator MoPho can internally change the corresponding master data, namely contracts and tariffs and take all other required actions (activities in MaMa).

For the phone service provider MoPho, the primary advantage is the centralized interface to all customer interaction: All processes required to conduct this crucial campaign are handled by MaMa-CRM, without intervention by MoPho. Very practical for MoPho is the nearly unlimited flexibility of MaMa-CRM to import and export a variety of different data formats. This flexibility enables MaMa-CRM to easily incorporate new campaign partners (like a second scan service provider, an additional email-service provider or web hosting partner).

### 1.1.2 Campaign Configuration

MaMa provides the software foundation for _campaign instances_ that have to be extensively configured to operate for a specific mandator with a number of specific partners.

The following section gives an overview of such a configuration for the MoPho campaign described in the previous [section](../01-introduction-and-goals/).

**1.Configure client master data**

Define and configure required data attributes and additional classes,
usually this information is completely provided by the mandator.

This data (e.g. contract-, tariff-, offer- and other business-specific entities or attributes)
are _modeled_ as extensions of the MaMa base model in UML.

In the MoPho telecommunications example, this data includes:

* Existing tariff
* List of potential new tariffs
* Contract number
* Validity period of existing tariff
* Validity period of new tariff

**2. Configure communication channels**  

* Define and exchange security credentials (passwords, certificates, user-ids).
* Determine contact address, especially for handling technical and process issues.

**3. Define campaign meta data**

* start- and end dates,
* target dates for specific activities,
* reply address for letters, reply email address,
* phone number for call center,

**4. Define campaign activities**

Campaign activities[^see-mama-glossary] can be either input-, output- and MaMa-internal activities.

* Output-activities _export_ data to partners or the mandator, e.g:
  * PrintLetter
  * DataToCallCenter
  * DataToScanServiceProvider
  * ResultsToMandator
  * ProductionOrderToCardProvider

* Input-activities _import_ data provided by the mandator or partners, e.g.:
  * MasterDataFromMandatorImport
  * ScanDataImport
  * CallCenterImport
  * SalesOutletImport

* Internal activities define data maintenance operations, e.g.:
  * Delete customer data 60 days after completion.
  * Delete all campaign data 120 days after campaign termination.

**5. Model campaign flows**

What is the required flow of activities, what needs to happen
under which conditions (including plausibility checks).

### 1.1.3 Activities Subject to Charge

Some activities result in charges, for example:

* sending letters via postal service results in postal charges
* producing e-Health cards results in card production charges

As we are talking about potentially millions of clients respectively activities,
these charges will amount to a significant flow of money:

> **MaMa-CRM does NOT handle billing and payment processes**.

Instead these are handled parallel to MaMa-campaigns by InDACs'
finance department[^financial-activities].

### 1.1.4 Additional Requirements

**Status and Financial Reporting**

MaMa has to campaign reports containing all campaign activities and
their results (e.g. how many letters were printed, how many
calls from clients were processes in the call center, how many
clients sent their return letter etc.)

It's especially important to report about activities subject
to a charge (aka having financial consequences). Although MaMa-CRM
is not responsible for the resulting billing and payment processes,
mandators and partners need reliable and trustworthy reports about
such activities.

MaMa shall offer adequate standard reports covering these cases.

**Client Data Belongs To Mandators**

MaMa-CRM follows a very strict data protection policy: All data
processes in campaigns is somehow related to clients and needs to
be kept strictly confidential. Mandators always remain owners of all
such data, from whatever partner it is transferred to MaMa by whatever
activities.

After a campaign officially ends, all (!) data including backups, configurations,
data and metadata needs to be deleted[^no-svn].

[^signature]: In some countries or for some contract types there might be simpler solutions than a written signature. Please ignore that for the moment.

[^see-mama-glossary]: See the [MaMa-CRM Glossary](../12-glossary/) for definitions of these term.

[^financial-activities]: In the real system, billing and payment was usually processed by the mandators (!) - but these 3-party processes are not significant for the software architecture, and therefore left out of this documentation.

[^no-svn]: Effectively this requirement forbade the use of the well-known version control systems "subversion" (svn), as by development time of MaMa-CRM, svn could not reliably _purge_ files from version history! Therefore a campaign-spanning svn repository was not allowed.

## 1.2 Quality Goals

### 1.2.1 Flexibility First

[Image elided: untitled — original path ../images/1-aspects-of-flexibility.png]

Simply stated, MaMa is a data hub with flexibility in several aspects:
It imports data (aspect 1) coming over various transmission channels (aspect 2)
executes a set of specific business rules (aspect 3) to determine further activities to be performed with this data. Such activities consist of data exports (aspect 4) to certain business partners (like print-, scan- or fax service providers, call centers and the like).

MaMa has to be flexible concerning all these aspects.

#### Aspect 1: Flexibility in Data Structure and Format

MaMa always deals with variants of `client`data - the most simple version could
look like an instance of the following class definition:

~~~~
public class Client
  String primaryKey
  String lastName
  String firstName
  Date birthDate
  String title
  Address postalAddress
~~~~

MaMa needs to import such data from various campaign partners.
These partners operates their own IT systems with their own data formats. They will export
the affected data records in some format (see below) of their choice.
MaMa needs to handle many such formats:

*	Comma separated value (CSV): attributes are separated by a (configurable) delimiter, e.g.:
“id01”, “starke”, “gernot”, “23-jul-1963”, “willi-lauf”, “D-50858”, “cologne”, “germany”

  * Field order and delimiter can vary.
  * Elements could be enclosed in either “ or ‘ or even «».
*	Fix length formats, where every data record has a fixed length. Shorter entries are padded with empty strings or zeroes.
*	XML dialects, either conforming to an appropriate schema or DTD.

Regardless of format, data elements need to comply to validation or plausibility rules.
Good news: No serialized objects from programming language runtimes (e.g. from a java virtual machine) have to be processed.  

#### Aspect 2: Flexibility in Transmission Formats and Modes

MaMa needs to handle the following transmission-related aspects:

* Standard transmission protocols (ftp, sftp, http, https) as both client and server
* Compressed,
* Encrypted
* Creation of checksums, at least with counters, MD5 and SHA-1
* Mandator- or campaign specific credentials for secure transmission
* Transmission metadata, i.e.: Count the number of successful transmissions and send the number of the last successful transmissions as a prefix to the next transmission.

#### Aspect 3: Flexibility in Business / Campaign Rules

MaMa needs to support several categories of campaign rules (sometimes called business rules)

* What are required and possible activities in this campaign?
* In what order shall these activities be executed?
* Certain types of activities (especially data import activities) are sometimes triggered
by «Partner» organizations. What kind of event triggers what activities?
* How often to remind clients/customers by letter?
* When to call clients/customers by phone?
* What data is mandatory from the customer and what is optional?
* How long to keep data records, when to delete or archive data records?
* Whom to contact when certain (data) conditions arise?

#### Aspect 4: Flexibility in Data Export

Now that MaMa has received and processed data (by import, transmission and rule processing),
it needs to send data to the campaign partners.
Analogous to data import, these receiving partners have very specific
requirements concerning data formats.

It is pretty common for MaMa to receive data from a partner company or mandator in CSV
format, import it into its own relational database, process it record-by-record,
export some records in XML to one partner and some other records in a fix format
to another partner.

### 1.2.2 Quality Goals (Scenarios)

#### Prio 1: Flexibility

MaMa-CRM can:

* import and export (configurable) CSV and fix-record-length data.
* import and export data via ftp, sftp, http and https, as client and server.
* handle compressed data. Compression algorithm is configurable per activity, standard lossless have to be supported.
* handle encrypted data. Security credentials need to be exchanged between parties prior to campaigns during campaign setup. PGP or derivatives are recommended.
* handle hashes or similar transmission metadata, configurable per campaign.

For all these topics, InDAC administrators can fully configure all campaign-specific aspects
within one workday.

#### Prio 2: Security

MaMa will keep all its client and campaign related data safe. It shall never be possible
for campaign-external parties to access data or metadata.

InDAC Administrators need to sign nondisclosure contracts to be allowed to administer
campaign data. This organizational issue is out-of-scope for MaMa.

#### Prio 3: Runtime Performance

MaMa can fully process 250.000 scanned return letters within 24 hours.

### 1.2.3 Non-Goals (Out of Scope)

* MaMa shall be exclusively operated by InDAC. It shall not evolve into a marketable product.
* MaMa shall not replace conventional CRM systems, like Siebel™, salesforce.com™ or others.
* MaMa does not handle billing and payment of any charges generated by its activities,
e.g. sending letters or others. See [section 1.1.3](../01-introduction-and-goals/)

## 1.3 Stakeholder

|Role                 |Description                   |Goal, Intention                   |
|---------------------|------------------------------|----------------------------------|
|Mandator |The organizations paying InDAC for conducting one or more campaigns |Minimal effort to get data _into_ and _out of_ MaMa-CRM, minimal effort to configure campaign rules etc. |
| | |
|Management of contractee (InDAC) |Requires flexible and performant foundation for current and future business segments.	|Periodical cooperation on current and changed requirements, solution approaches.|
| | |
|Software developers participating in MaMa implementation	|Design MaMa internal structure, implement building blocks. |Active participation in technical decisions.|
| | |
|Partner	|Companies supporting parts of the campaign processes, like print- or scan service providers, postal service, card producers, call centers. Partner need to send and receive data from MaMa, need to negotiate interface contracts, organizational and operational details. | Effective, productive and robust interfaces between MaMa and partner.|
| | |
|Government agency    |Several agencies regulate MaMa campaigns, for example: Insurance regulation body or governmental IT-security body. |Ensure that MaMa fulfills all data security regulations|
| | |
|Eclipse-RCP  (rich client platform) |Open source project (provider of UI framework)	|MaMa uses Eclipse rich client platform to implement the graphical user interface.	Eclipse changes its API quite often and therefore (unpredictably) influences UI development.|

### 1.3.1 Special Case: German e-Health Card

[Image elided: Sample German e-Health card — original path ../images/egk-sample.png]

InDAC hosted several campaigns in the evaluation phase of the German e-Health card,
which had to comply to business and technical standards issued by the corresponding
standardization body. That was a company especially founded for this purpose
by the German Government.

Interesting fact for the MaMa-CRM development team: That company wasn't operational
when MaMa development started - therefore the standards that had to be adhered to
hadn't even been created or published...

### 1.3.2 «Partner» or «Mandator» Specify Interface Details
MaMa-CRM offers detailed interface specification documents, which partners
(like print- or scan service providers) can use to implement,
configure and operate their interfaces to MaMa. Due to MaMas great flexibility
it usually works the other way round: Mandators and Partners provide MaMa with _their_
interface descriptions, which MaMa administrators only configure to make it operational.
<!-- VERBATIM SOURCE: 01-introduction-and-goals.md ENDS -->
