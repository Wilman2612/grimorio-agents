# Design Orchestrator — Exemplar: gRPC Retry Design (gRFC A6) — Detailed Design

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-grpc-retries.md (the index —
provenance, the source's own table of contents, and the pointer table to all three companions live there).
Reached only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the
index itself. Part of the same split
(ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own SPLIT-default rule) that keeps
the index itself under the ~500-line smell threshold.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the "Detailed Design" section of gRFC A6 (Noah Eisen and Eric Gribkoff; full citation and provenance live in the
index). A `[State/Diagram — original embeds ...]` bracketed note marks each point an embedded image was
elided; the index's own closing note lists all seven, named honestly rather than dropped silently.

---

<!-- VERBATIM SOURCE BEGINS -->
### Detailed Design

#### Retry Policy Capabilities

Retry policies support configuring the maximum number of retries, the parameters for exponential backoff, and the set of retryable status codes, as follows:

```
"retryPolicy": {
  "maxAttempts": 4,
  "initialBackoff": "0.1s",
  "maxBackoff": "1s",
  "backoffMultiplier": 2,
  "retryableStatusCodes": [
    "UNAVAILABLE"
  ]
}
```
Each of these configuration options is detailed in its own section below.

##### Maximum Number of Retries

`maxAttempts` specifies the maximum number of RPC attempts, including the original request.

gRPC's call deadline applies across all attempts for a given RPC. For example, if the specified deadline for an RPC is July 23 9:00:00pm PDT the operation will fail after that time regardless of how many attempts were configured or attempted.

*[State Diagram — original embeds `A6_graphics/too_many_attempts.png` / `.svg` here; see closing note below.]*

##### Exponential Backoff

The `initialBackoff`, `maxBackoff`, and `backoffMultiplier` parameters tune the exponential delay before retry attempts.

Jitter of plus or minus 0.2 is applied to the backoff delay to avoid hammering servers at the same time from a large number of clients.  Note that this means that the backoff delay may actually be slightly lower than `initialBackoff` or slightly higher than `maxBackoff`.

The initial retry attempt will occur after `initialBackoff * random(0.8, 1.2)`.  After that, the `n`-th attempt will occur after `min(initialBackoff*backoffMultiplier**(n-1), maxBackoff) * random(0.8, 1.2))`.

##### Retryable Status Codes

When gRPC receives a non-OK response status from a server, this status is checked against the set of retryable status codes in `retryableStatusCodes` to determine if a retry attempt should be made.

In general, only status codes that indicate the service did not process the request should be retried. However, a more aggressive set of parameters can be specified when the service owner knows that a method is idempotent, or safe to be processed more than once by the server. For example, if an RPC to a delete user method fails with an `INTERNAL` error code, it's possible that the user was already deleted before the failure occurred. If the method is idempotent then retrying the call should have no adverse effects. However, it is entirely possible to implement a non-idempotent delete method that has adverse side effects if called multiple times, and such a method should not be retried unless the error codes guarantee the original RPC was not processed. It is up to the service owner to pick the correct set of retryable status codes given the semantics of their service. gRPC retries do not provide a mechanism to specifically mark a method as idempotent.

##### Validation of retryPolicy

If `retryPolicy` is specified in a service config choice, the following validation rules apply:
1. `maxAttempts` MUST be specified and MUST be a JSON integer value greater than 1. Values greater than 5 are treated as 5 without being considered a validation error.
2. `initialBackoff` and `maxBackoff` MUST be specified, MUST follow the JSON representaion of [proto3 Duration type](https://developers.google.com/protocol-buffers/docs/proto3#json), and MUST have a duration value greater than 0.
3. `backoffMultiplier` MUST be specified and MUST be a JSON number greater than 0.
4. `retryableStatusCodes` MUST be specified as a JSON array of status codes and be non-empty. Each status code MUST be a valid gRPC status code and specified in the integer form or the case-insensitive string form (eg. [14], ["UNAVAILABLE"] or ["unavailable"]).

#### Hedging Policy

Hedging enables aggressively sending multiple copies of a single request without waiting for a response. Because hedged RPCs may be be executed multiple times on the server side, typically by different backends, it is important that hedging is only enabled for methods that are safe to execute multiple times without adverse affect.

Hedged requests are configured with the following parameters:

```
"hedgingPolicy": {
  "maxAttempts": 4,
  "hedgingDelay": "0.5s",
  "nonFatalStatusCodes": [
    "UNAVAILABLE",
    "INTERNAL",
    "ABORTED"
  ]
}
```

When a method has chosen a `hedgingPolicy`, the original RPC is sent immediately, as with a standard non-hedged call. After `hedgingDelay` has elapsed without a successful response, the second RPC will be issued. If neither RPC has received a response after `hedgingDelay` has elapsed again, a third RPC is sent, and so on, up to `maxAttempts`. In the above configuration, after 1ms there would be one outstanding RPC (the original), after 501ms there would be two outstanding RPCs (the original and the first hedged RPC), after 1001ms there would be three outstanding RPCs, and after 1501ms there would be four. As with retries, gRPC call deadlines apply to the entire chain of hedged requests. Once a deadline has passed, the operation fails regardless of in-flight RPCS, and regardless of the hedging configuration.

The implementation will ensure that the listener returned to the client application forwards its calls (such as `onNext` or `onClose`) to all outstanding hedged RPCs.

When a non-error response is received (in response to any of the hedged requests), all outstanding hedged requests are canceled and the response is returned to the client application layer.

If a non-fatal status code is received from a hedged request, then the next hedged request in line is sent immediately, shortcutting its hedging delay. If any other status code is received, all outstanding RPCs are canceled and the error is returned to the client application layer.

If all instances of a hedged RPC fail, there are no additional retry attempts. Essentially, hedging can be seen as retrying the original RPC before a failure is even received.

If server pushback that specifies not to retry is received in response to a hedged request, no further hedged requests should be issued for the call.

##### Validation of hedgingPolicy

If `hedgingPolicy` is specified in a service config choice, the following validation rules apply:
1. `maxAttempts` MUST be specified and MUST be a JSON integer value greater than 1. Values greater than 5 are treated as 5 without being considered a validation error.
2. `hedgingDelay` is an optional field but if specified MUST follow the JSON representation of proto3 Duration type.
3. `nonFatalStatusCodes` is an optional field but if specified MUST be specified as a JSON array of status codes. Each status code MUST be a valid gRPC status code and specified in the integer form or the case-insensitive string form (eg. [14], ["UNAVAILABLE"] or ["unavailable"]).

*[State Diagram — original embeds `A6_graphics/basic_hedge.png` / `.svg` here; see closing note below.]*

#### Throttling Retry Attempts and Hedged RPCs

gRPC prevents server overload due to retries and hedged RPCs by disabling these policies when the client's ratio of failures to successes passes a certain threshold. The throttling is done per server name. Retry throttling may be configured as follows:

```
"retryThrottling": {
  "maxTokens": 10,
  "tokenRatio": 0.1
}
```

Throttling may only be specified per server name, rather than per method or per service.

For each server name, the gRPC client maintains a `token_count` variable which is initially set to `maxTokens` and can take values between `0` and `maxTokens`. Every outgoing RPC (regardless of service or method invoked) will effect `token_count` as follows:
* Every failed RPC will decrement the `token_count` by 1.
* Every successful RPC will increment the `token_count` by `tokenRatio`.

If `token_count` is less than or equal to the threshold, defined to be `(maxTokens / 2)`, then RPCs will not be retried until `token_count` rises over the threshold.

Throttling also applies to hedged RPCs. The first outgoing RPC will always be sent, but subsequent hedged RPCs will only be sent if `token_count` is greater than the threshold.

Neither retry attempts or hedged RPCs block when `token_count` is less than or equal to the threshold. Retry attempts are canceled and the failure returned to the client application. The hedged request is cancelled, and if there are no other already-sent hedged RPCs the failure is returned to the client application.

The only RPCs that are counted as failures for the throttling policy are RPCs that fail with a status code that qualifies as a [retryable](#retryable-status-codes) or [non-fatal status code](#hedging-policy), or that receive a pushback response indicating not to retry. This avoids conflating server failure with responses to malformed requests (such as the `INVALID_ARGUMENT` status code).

##### Validation of retryThrottling

If `retryThrottling` is specified in a service config, the following validation rules apply:
1. `maxTokens` MUST be specified and MUST be a JSON integer value in the range (0, 1000].
2. `tokenRatio` MUST be specified and MUST be a JSON floating point greater than 0. Decimal places beyond 3 are ignored. (eg. 0.5466 is treated as 0.546.)

#### Pushback

Servers may explicitly pushback by setting metadata in their response to the client. The pushback can either tell the client to retry after a given delay or to not retry at all. If the client has already exhausted its `maxAttempts`, the call will not be retried even if the server says to retry after a given delay.

Pushback may also be received to a hedged request. If the pushback says not to retry, no further hedged requests will be sent. If the pushback says to retry after a given delay, the next hedged request (if any) will be issued after the given delay has elapsed.

A new metadata key, `"grpc-retry-pushback-ms"`, will be added to support server pushback. The value is to be an ASCII encoded signed 32-bit integer with no unnecessary leading zeros that represents how many milliseconds to wait before sending a retry. If the value for pushback is negative or unparseble, then it will be seen as the server asking the client not to retry at all.

When a client receives an explicit pushback response from a server, and it is appropriate to retry the RPC, it will retry after exactly that delay.  For subsequent retries, the delay period will be reset to the `initialBackoff` setting and scale according to the [Exponential Backoff](#exponential-backoff) section above, unless an explicit pushback response is received again.

#### Limits on Retries and Hedges

`maxAttempts` in both `retryPolicy` and `hedgingPolicy` have, by default, a client-side maximum value of 5. This client-side maximum value can be changed by the client through the use of channel arguments. Service owners may specify a higher value for these parameters, but higher values will be treated as equal to the maximum value by the client implementation. This mitigates security concerns related to the service config being transferred to the client via DNS.

#### Summary of Retry and Hedging Logic
There are five possible types of server responses. The list below enumerates the behavior of retry and hedging policies for each type of response. In all cases, if the maximum number of retry attempts or the maximum number of hedged requests is reached, no further RPCs are sent. Hedged RPCs are returned to the client application when all outstanding and pending requests have either received a response or been canceled.

1. OK
    1. Retry policy: Successful response, return success to client application
    2. Hedging policy: Successful response, cancel previous and pending hedges

2. Fatal Status Code
    1. Retry policy: Don't retry, return failure to client application
    2. Hedging policy: Cancel previous and pending hedges

3. Retryable/Non-Fatal Status Code without Server Pushback
    1. Retry policy: Retry according to policy
    2. Hedging policy: Immediately send next scheduled hedged request, if any. Subsequent hedged requests will resume at `hedgingDelay`

4. Pushback: Don't Retry
    1. Retry policy: Don't retry, return failure to client application
    2. Hedging policy: Don't send any more hedged requests.

5. Pushback: Retry in *n* ms
    1. Retry policy: Retry in *n* ms. If this attempt also fails, retry delay will reset to initial backoff for the following retry (if applicable)
    2. Hedging policy: Send next hedged request in *n* ms. Subsequent hedged requests will resume at `n + hedgingDelay`

*[State Diagram — original embeds `A6_graphics/StateDiagram.png` / `.svg` here; see closing note below.]*

