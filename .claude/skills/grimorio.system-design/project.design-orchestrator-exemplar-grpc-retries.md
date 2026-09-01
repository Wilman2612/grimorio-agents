# Design Orchestrator — Exemplar: gRPC Retry Design (gRFC A6)

A companion reference file in the `system-design` skill, the same tier and mechanism as
ref:skill/grimorio.system-design/project.design-orchestrator-quasi-software-view.md — the FULL, real text of an external,
human-vetted design document, held here as an INDEX plus three verbatim companion files, not a distillation or
a "why this is good" essay layered on top of fragments. This file exists so the bar-anchor
ref:skill/grimorio.system-design/design-orchestrator-phases/phase-1-search-first.md's own step 5b holds does not depend
on re-fetching an external URL on every design run, and so the CEO can audit the exemplar's actual content
inside the repo instead of trusting a raw external URL. Reached on demand via `cold:grpc-a6-retry-exemplar`
(ref:skill/grimorio.agent-writing/project.cold-store.md). **NEVER load this file by default.** The standing bar-anchor (writing
discipline, structural honesty — never the section-heading shape) lives inline in step 5b's own prose; this
file backs it only when a reader genuinely needs to go deeper than that inline statement.

**Why an index plus companions, not one file** — this exemplar crossed the ~500-line smell threshold
(ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 23), and SPLIT is the now-live default remedy
for an oversized skill reference/exemplar file
(ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md — step 2 of its own Steps section). This
file stays the short index — provenance, the source's own table of contents, Abstract/Background/Overview, and
pointers to the three companions below — and the three companions hold the rest of the source text VERBATIM,
moved, never compressed or distilled. Splitting does not raise the concern a prior version of this file's own
note argued against (trimming/compressing the real document down to fit): nothing here is trimmed — every word
the source wrote still exists in the tree, just filed under its own section, one hop away.

## Provenance — SOURCE ONLY, never a load instruction

**Title:** gRPC Retry Design (informally gRFC A6)
**Author(s):** Noah Eisen ([ncteisen](https://github.com/ncteisen)) and Eric Gribkoff ([ericgribkoff](https://github.com/ericgribkoff))
**Approver:** a11r
**Status:** Implemented — in production across the Java, .NET, Node, Go (except hedging), and C-Core (except
hedging) gRPC client libraries
**Last updated:** 2024-08-23
**Discussion at:** https://groups.google.com/forum/#!topic/grpc-io/zzHIICbwTZE
**Canonical source:** https://github.com/grpc/proposal/blob/master/A6-client-retries.md
**Raw source:** https://raw.githubusercontent.com/grpc/proposal/master/A6-client-retries.md

This is a real, peer-reviewed design proposal in the `grpc/proposal` GitHub repository — the gRPC project's own
formal design-doc process: every gRFC requires review and sign-off from a named Approver before merge. It
clears ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md's own origin test: real, external, human/
process-vetted via the gRFC repo's own named-Approver review gate, currently shipped in production across five
language implementations — never this agent's own prior output, never anything already in this repo.

**NEVER read either URL above as something to open or re-open.** They are this extract's provenance, carried so
the source stays attached and auditable — the full text below, not a re-fetch, is what step 5b's bar-anchor
actually draws on.

---

**Everything below this line, until the closing note, is the source document's own text, substantially as
written — not a summary, not a rubric extracted from it.**

---

gRPC Retry Design
----
* Author(s): [Noah Eisen](https://github.com/ncteisen) and [Eric Gribkoff](https://github.com/ericgribkoff)
* Approver: a11r
* Status: Implemented
* Implemented in: Java, .NET, Node, Go except hedging, and C-Core except hedging
* Last updated: 2024-08-23
* Discussion at: https://groups.google.com/forum/#!topic/grpc-io/zzHIICbwTZE

Table of Contents
----
  * [Abstract](#abstract)
  * [Background](#background)
  * [Proposal](#proposal)
     * [Overview](#overview)
     * [Detailed Design](#detailed-design)
        * [Retry Policy Capabilities](#retry-policy-capabilities)
           * [Maximum Number of Retries](#maximum-number-of-retries)
           * [Exponential Backoff](#exponential-backoff)
           * [Retryable Status Codes](#retryable-status-codes)
        * [Hedging Policy](#hedging-policy)
        * [Throttling Retry Attempts and Hedged RPCs](#throttling-retry-attempts-and-hedged-rpcs)
        * [Pushback](#pushback)
        * [Limits on Retries and Hedges](#limits-on-retries-and-hedges)
        * [Summary of Retry and Hedging Logic](#summary-of-retry-and-hedging-logic)
     * [Retry Internals](#retry-internals)
        * [Where Retries Occur](#where-retries-occur)
        * [When Retries are Valid](#when-retries-are-valid)
        * [Memory Management (Buffering)](#memory-management-buffering)
        * [Transparent Retries](#transparent-retries)
        * [Exposed Retry Metadata](#exposed-retry-metadata)
        * [Disabling Retries](#disabling-retries)
        * [Retry and Hedging Statistics](#retry-and-hedging-statistics)
     * [Configuration Language](#configuration-language)
        * [Retry Policy](#retry-policy)
        * [Hedging Policy](#hedging-policy-1)
        * [Throttling Configuration](#throttling-configuration)
        * [Integration with Service Config](#integration-with-service-config)

**[Editorial note, not part of the source: this table of contents' own entries under "Detailed Design",
"Retry Internals", and "Configuration Language" — and the Overview section's own cross-references into them,
below — no longer resolve in-file. Splitting this document moved those three sections into their own companion
files (see "## The companions" below); the anchors are kept verbatim as the source wrote them, unedited, but a
markdown anchor never jumps across files. WHEN following one of these links ⟶ open the relevant companion
directly instead.]**

## Abstract

gRPC client library will automatically retry failed RPCs according to a policy set by the service owner.

## Background

Currently, gRPC does not retry failed RPCs. All failed RPCs are immediately returned to the application layer by the gRPC client library.

Many teams have implemented their own retry logic wrapped around gRPC like [Veneer Toolkit](https://github.com/googleapis/toolkit) and [Cloud Bigtable](https://github.com/GoogleCloudPlatform/cloud-bigtable-client).

## Proposal

### Overview

gRPC will support two configurable retry policies. The [service configuration](https://github.com/grpc/grpc/blob/master/doc/service_config.md) (which will soon be [published via DNS](https://github.com/grpc/proposal/pull/5)) may choose from a retry policy (retry failed RPCs) or a hedging policy (aggressively send the same RPC multiple times in parallel). An individual RPC may be governed by a retry policy or a hedge policy, but not both.

Retry policy capabilities are as follows. Each has a detailed description below.
* [Maximum number of retry attempts](#maximum-number-of-retries)
* [Exponential backoff](#exponential-backoff)
* [Set of retryable status codes](#retryable-status-codes)

The hedging policy has the following parameters. See details [here](#hedging-policy).
* Maximum number of hedged requests
* Delay between hedged requests
* Set of non-fatal status codes

Additionally, gRPC provides a mechanism to throttle retry attempts and hedged RPCs when the ratio of failures to successes exceeds a threshold. See [detailed description of throttling](#throttling-retry-attempts-and-hedged-rpcs).

We also provide a mechanism for servers to explicitly signal clients to retry after a settable delay. See [detailed description of server pushback](#pushback).

In some cases, gRPC can guarantee that a request has never been seen by the server application logic. These cases will be transparently retried by gRPC, as detailed [here](#transparent-retries).

Lastly, information about number of retry attempts will be exposed to the client and server applications through metadata. Find more details [here](#exposed-retry-metadata).

*[State Diagram — original embeds `A6_graphics/basic_retry.png` / `A6_graphics/basic_retry.svg` here; see
closing note below.]*

## The companions — reached only from here, never referenced directly

Three depth files, each holding one contiguous span of the source document's own text, verbatim, under its own
original section heading:

- ref:skill/grimorio.system-design/design-orchestrator-exemplar-grpc-retries/detailed-design.md — the source's own
  "Detailed Design" section: Retry Policy Capabilities (Maximum Number of Retries, Exponential Backoff,
  Retryable Status Codes), Hedging Policy, Throttling Retry Attempts and Hedged RPCs, Pushback, Limits on
  Retries and Hedges, Summary of Retry and Hedging Logic.
- ref:skill/grimorio.system-design/design-orchestrator-exemplar-grpc-retries/retry-internals.md — the source's own
  "Retry Internals" section: Where Retries Occur, When Retries are Valid, Memory Management (Buffering),
  Transparent Retries, Exposed Retry Metadata, Disabling Retries, Retry and Hedging Statistics.
- ref:skill/grimorio.system-design/design-orchestrator-exemplar-grpc-retries/configuration-language.md — the source's
  own "Configuration Language" section: Retry Policy, Hedging Policy, Throttling Configuration, Integration
  with Service Config (the full JSON service-config shape).

Open a companion only when the inline bar-anchor at phase-1-search-first.md's own step 5b genuinely is not
enough and the reader needs that specific section's real text.

---

## Closing note — what this extract does NOT carry, named honestly rather than dropped silently

The original document embeds **seven state-diagram images**, each referenced both as a PNG and a linked SVG,
hosted in the source repo's own `A6_graphics/` directory. This extract names them explicitly rather than
fabricating a redraw or silently omitting the fact that they exist:

1. `A6_graphics/basic_retry.png` / `.svg` — the overview state diagram, in Proposal → Overview.
2. `A6_graphics/too_many_attempts.png` / `.svg` — Maximum Number of Retries.
3. `A6_graphics/basic_hedge.png` / `.svg` — Hedging Policy.
4. `A6_graphics/StateDiagram.png` / `.svg` — Summary of Retry and Hedging Logic (the full per-response-type
   state machine).
5. `A6_graphics/WhereRetriesOccur.png` / `.svg` — Retry Internals → Where Retries Occur.
6. `A6_graphics/WhereRPCsFail.png` / `.svg` — Retry Internals → Transparent Retries (the four ways an RPC can
   fail).
7. `A6_graphics/transparent.png` / `.svg` — Transparent Retries, the transparent-retry state diagram.

None of these fourteen files is reproduced here — they are not fetched, not redrawn, not approximated. Each
diagram's place in the document is marked inline above with a bracketed `[State Diagram — original embeds
...]` note at the exact point it appears in the source, so a reader can see where visual content was elided
without losing the surrounding text's own meaning.
