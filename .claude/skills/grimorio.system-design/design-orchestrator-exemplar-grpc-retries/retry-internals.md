# Design Orchestrator — Exemplar: gRPC Retry Design (gRFC A6) — Retry Internals

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-grpc-retries.md (the index —
provenance, the source's own table of contents, and the pointer table to all three companions live there).
Reached only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the
index itself. Part of the same split
(ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own SPLIT-default rule) that keeps
the index itself under the ~500-line smell threshold.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the "Retry Internals" section of gRFC A6 (Noah Eisen and Eric Gribkoff; full citation and provenance live in the
index). A `[State/Diagram — original embeds ...]` bracketed note marks each point an embedded image was
elided; the index's own closing note lists all seven, named honestly rather than dropped silently.

---

<!-- VERBATIM SOURCE BEGINS -->
### Retry Internals

#### Where Retries Occur

The retry policy will be implemented in-between the channel and the load balancing policy. That way every retry gets a chance to be sent out on a different subchannel than it originally failed on.

*[Diagram — original embeds `A6_graphics/WhereRetriesOccur.png` / `.svg` here; see closing note below.]*

#### When Retries are Valid

In certain cases it is not valid to retry an RPC. These cases occur when the RPC has been *committed*, and thus it does not make sense to perform the retry.

An RPC becomes *committed* in two scenarios:

1. The client receives [Response-Headers](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md#responses).
2. The client's outgoing message has overflowed the gRPC client library's buffer.

The reasoning behind the first scenario is that the Response-Headers include initial metadata from the server. The metadata (or its absence) it is transmitted to the client application. This may fundamentally change the state of the client, so we cannot safely retry if a failure occurs later in the RPC's life.

gRPC servers should delay the Response-Headers until the first response message or until the application code chooses to send headers. If the application code closes the stream with an error before sending headers or any response messages, gRPC servers should send the error in Trailers-Only.

To clarify the second scenario, we define an *outgoing message* as everything the client sends on its connection to the server. For unary and server streaming calls, the outgoing message is a single message. For client and bidirectional streaming calls, the outgoing message is the entire message stream issued by the client after opening the connection. The gRPC client library buffers outgoing messages, and as long as the entirety of the outgoing message is in the buffer, it can be resent and retried. But as soon as the outgoing message grows too large to buffer, the gRPC client library cannot replay the entire stream of messages, and thus retries are not valid.

#### Memory Management (Buffering)

The gRPC client library will support application-configured limits for the amount of memory used for retries, and these configuration options may include limits on per-channel memory usage and per-RPC memory usage. These limits are configured by the client, rather than coming from the service config.

RPCs may only be retried when they are contained in the buffer. New RPCs which do not fit in the available buffer space (either due to the total available buffer space, or due to the per-RPC limit) will not be retryable, but the original RPC will still be sent.

After the RPC response has been returned to the client application layer, the RPC is removed from the buffer.

Client streaming RPCs will take up additional buffer space with each subsequent message, so additional buffering policy is needed. When the application sends a message on an RPC that causes the RPC to exceed the buffer limit, the RPC becomes committed, meaning that we choose one attempt to continue and stop all others.

For retriable RPCs, when an RPC becomes committed, the client will continue with the currently in-flight attempt but will not make any subsequent attempts, even if the current attempt fails with a retryable status and there are retry attempts remaining.

For hedged RPCs, when an RPC becomes committed, the client will continue the currently in-flight attempt on which the maximum number of messages have already been sent. All other currently in-flight attempts will be immediately cancelled, and no subsequent attempts will be started.

Once we have committed to a particular attempt, any messages that have already been sent on the that attempt can be immediately freed from the buffer, and each subsequent message that is replayed can be freed as soon as it is sent. The new message sent by the application (which caused the RPC to exceed the buffer limit) will never be added to the buffer in the first place; it will stay pending until all previous messages have been replayed, and then it will be sent immediately without buffering.

When an RPC is evicted from the buffer, pending hedged requests should be canceled immediately. Implementations must avoid potential scheduling race conditions when canceling pending requests concurrently with incoming responses to already sent hedges, and ensure that failures are relayed to the client application logic when no more hedged requests will be possible and all outstanding requests have returned.

#### Transparent Retries

RPC failures can occur in four distinct ways:

1. The RPC fails at the client-side load balancing step.
2. Load balancing succeeds but the RPC never leaves the client.
3. The RPC reaches the server, but has never been seen by the server application logic.
4. The RPC is seen by the server application logic, and fails.

*[Diagram — original embeds `A6_graphics/WhereRPCsFail.png` / `.svg` here; see closing note below.]*

The last case is handled by the configurable retry policy that is the main focus of this document. The second and third cases are retried automatically by the gRPC client library, **regardless** of the retry configuration set by the service owner. We are able to do this because these request have not made it to the server application logic, and thus are always safe to retry.

In the first case, in which the RPC fails at the load balancing step, the appropriate action depends on what pick result type caused that failure. If the pick result type was `DROP`, the RPC will fail immediately, without any retries. If the pick result type was `TRANSIENT_FAILURE`, the RPC will be handled by the configured retry policy.

In the second case, in which load balancing succeeds but the RPC never leaves the client, the client library can transparently retry until a success occurs, or the RPC's deadline passes.

If the RPC reaches the gRPC server library, but has never been seen by the server application logic (the third case), the client library will immediately retry it once. If this fails, then the RPC will be handled by the configured retry policy. This extra caution is needed because this case involves extra load on the wire. In the gRPC HTTP/2 transport, the client library knows it is in this case if the stream ends with an `RST_STREAM` frame with the error code `REFUSED_STREAM` or if the HTTP/2 connection closes with a `GOAWAY` frame with the last stream identifier less than the stream's ID.

Since retry throttling is designed to prevent server application overload, and these transparent retries do not make it to the server application layer, they do not count as failures when deciding whether to throttle retry attempts.

Similarly, transparent retries do not count toward the limit of configured RPC attempts (`maxAttempts`).

*[State Diagram — original embeds `A6_graphics/transparent.png` / `.svg` here; see closing note below.]*

#### Exposed Retry Metadata

In order to make data about retries available to the server application logic, the client library will set the outgoing initial metadata entry `"grpc-previous-rpc-attempts"` with a value equal to the number of preceding retry atttempts. Thus, it will not be present on the first RPC, will be 1 for the second RPC, and so on. The value for this field will be an integer. The client library may also set this entry in the received initial metadata that it provides to the client application.

#### Disabling Retries

Clients cannot override retry policy set by the service config. However, retry support can be disabled entirely within the gRPC client library. This is designed to enable existing libraries that wrap gRPC with their own retry implementation (such as Veneer Toolkit) to avoid having retries taking place at the gRPC layer and within their own libraries.

Eventually, retry logic should be taken out of the wrapping libraries, and only exist in gRPC. But allowing the retries to be disabled entirely will make that rollout process easier.

#### Retry and Hedging Statistics

__Notice__: Retry statistics has been updated in the new design [gRFC-A45](A45-retry-stats.md). The original design below is obsolete.

gRPC will treat each retry attempt or hedged RPC as a distinct RPC with regards to the current per-RPC metrics. For example, when an RPC fails with a retryable status code and a retry attempt is made, the original request and the retry attempt will be recorded as two separate RPCs.

Additionally, to present a clearer picture of retry attempts, we add three additional per-method metrics:

1. Total number of retry attempts made
2. Total number of retry attempts which failed
3. A histogram of retry attempts made:
    1. The number of retry attempts will be classified into the following buckets:
        1. \>=1, >=2, >=3, >=4, >=5, >=10, >=100, >=1000
    2. Each retry attempt increments the count in exactly bucket. For example:
        1. The 1st retry attempt adds one to the ">=1" count
        2. The 2nd retry attempt adds one to the ">=2" count, leaving the count for ">=1" unchanged.
        3. The 5th through 9th retry attempts each add one to the ">=5" count.
        4. The 10th through 99th retry attempts each add one to the ">=10" count.

For hedged requests, we record the same stats as above, treating the first hedged request as the initial RPC and subsequent hedged requests as retry attempts.

