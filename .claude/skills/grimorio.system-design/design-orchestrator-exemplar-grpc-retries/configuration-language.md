# Design Orchestrator — Exemplar: gRPC Retry Design (gRFC A6) — Configuration Language

Companion depth file of ref:skill/grimorio.system-design/project.design-orchestrator-exemplar-grpc-retries.md (the index —
provenance, the source's own table of contents, and the pointer table to all three companions live there).
Reached only from the index; **NEVER referenced directly, and NEVER loaded by default** — same standing as the
index itself. Part of the same split
(ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own SPLIT-default rule) that keeps
the index itself under the ~500-line smell threshold.

Everything from the marker below to the end of this file is the source document's own text, byte-for-byte —
the "Configuration Language" section of gRFC A6 (Noah Eisen and Eric Gribkoff; full citation and provenance live in the
index). A `[State/Diagram — original embeds ...]` bracketed note marks each point an embedded image was
elided; the index's own closing note lists all seven, named honestly rather than dropped silently.

---

<!-- VERBATIM SOURCE BEGINS -->
### Configuration Language

Retry and hedging configuration is set as part of the service config, which is transmitted to the client during DNS resolution. Like other aspects of the service config, retry or hedging policies can be specified per-method, per-service, or per-server name.

Service owners must choose between a retry policy or a hedging policy. Unless the service owner specifies a policy in the configuration, retries and hedging will not be enabled. The retry policy and hedging policy each have their own set of configuration options, detailed below.

The parameters for throttling retry attempts and hedged RPCs when failures exceed a certain threshold are also set in the service config. Throttling applies across methods and services on a particular server, and thus may only be configured per-server name.

#### Retry Policy

This is an example of a retry policy and its associated configuration. It implements exponential backoff with a maximum of four RPC attempts (1 original RPC, and 3 retries), only retrying RPCs when an `UNAVAILABLE` status code is received.

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

#### Hedging Policy

The following example of a hedging policy configuration will issue an original RPC, then up to three hedged requests for each RPC, spaced out at 500ms intervals, until either: one of the requests receives a valid response, all fail, or the overall call deadline is reached. Analogously to `retryableStatusCodes` for the retry policy, `nonFatalStatusCodes` determines how hedging behaves when a non-OK response is received.

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

The following example issues four RPCs simultaneously:

```
"hedgingPolicy": {
  "maxAttempts": 4,
  "hedgingDelay": "0s",
  "nonFatalStatusCodes": [
    "UNAVAILABLE",
    "INTERNAL",
    "ABORTED"
  ]
}
```

#### Throttling Configuration
Throttling configuration applies to all services and methods on a given server, and so can only be set per-server name. The following configuration throttles retry attempts and hedged RPCs when the client's ratio of failures to successes exceeds ~10%.

```
"retryThrottling": {
  "maxTokens": 10,
  "tokenRatio": 0.1
}
```

#### Integration with Service Config

The retry policy is transmitted to the client through the service config mechanism. The following is what the JSON configuration file would look like:

```
{
  "loadBalancingPolicy": string,

  "methodConfig": [
    {
      "name": [
        {
          "service": string,
          "method": string,
        }
      ],

      // Only one of retryPolicy or hedgingPolicy may be set. If neither is set,
      // RPCs will not be retried or hedged.

      "retryPolicy": {
        // The maximum number of RPC attempts, including the original RPC.
        //
        // This field is required and must be two or greater.
        "maxAttempts": number,

        // Exponential backoff parameters. The initial retry attempt will occur
        // after initialBackoff * random(0.8, 1.2). After that, the nth attempt
        // since the last server pushback response (if any), will occur at
        // min(initialBackoff*backoffMultiplier**(n-1), maxBackoff) *
        // random(0.8, 1.2).
        // The following two fields take their form from:
        // https://developers.google.com/protocol-buffers/docs/proto3#json
        // They are representations of the proto3 Duration type. Note that the
        // numeric portion of the string must be a valid JSON number.
        // They both must be greater than zero.
        "initialBackoff": string,  // Required. Long decimal with "s" appended
        "maxBackoff": string,  // Required. Long decimal with "s" appended
        "backoffMultiplier": number  // Required. Must be greater than zero.

        // The set of status codes which may be retried.
        //
        // Status codes are specified in the integer form or the case-insensitive
        // string form (eg. [14], ["UNAVAILABLE"] or ["unavailable"])
        //
        // This field is required and must be non-empty.
        "retryableStatusCodes": []
      }

      "hedgingPolicy": {
        // The hedging policy will send up to maxAttempts RPCs.
        // This number represents the all RPC attempts, including the
        // original and all the hedged RPCs.
        //
        // This field is required and must be two or greater.
        "maxAttempts": number,

        // The original RPC will be sent immediately, but the maxAttempts-1
        // subsequent hedged RPCs will be sent at intervals of every hedgingDelay.
        // Set this to "0s", or leave unset, to immediately send all maxAttempts RPCs.
        // hedgingDelay takes its form from:
        // https://developers.google.com/protocol-buffers/docs/proto3#json
        // It is a representation of the proto3 Duration type. Note that the
        // numeric portion of the string must be a valid JSON number.
        "hedgingDelay": string,

        // The set of status codes which indicate other hedged RPCs may still
        // succeed. If a non-fatal status code is returned by the server, hedged
        // RPCs will continue. Otherwise, outstanding requests will be canceled and
        // the error returned to the client application layer.
        //
        // Status codes are specified in the integer form or the case-insensitive
        // string form (eg. [14], ["UNAVAILABLE"] or ["unavailable"])
        //
        // This field is optional.
        "nonFatalStatusCodes": []
      }

      "waitForReady": bool,
      "timeout": string,
      "maxRequestMessageBytes": number,
      "maxResponseMessageBytes": number
    }
  ]

  // If a RetryThrottlingPolicy is provided, gRPC will automatically throttle
  // retry attempts and hedged RPCs when the client's ratio of failures to
  // successes exceeds a threshold.
  //
  // For each server name, the gRPC client will maintain a token_count which is
  // initially set to maxTokens, and can take values between 0 and maxTokens.
  //
  // Every outgoing RPC (regardless of service or method invoked) will change
  // token_count as follows:
  //
  //   - Every failed RPC will decrement the token_count by 1.
  //   - Every successful RPC will increment the token_count by tokenRatio.
  //
  // If token_count is less than or equal to maxTokens / 2, then RPCs will not
  // be retried and hedged RPCs will not be sent.
  "retryThrottling": {
    // The number of tokens starts at maxTokens. The token_count will always be
    // between 0 and maxTokens.
    //
    // This field is required and must be in the range (0, 1000].  Up to 3
    // decimal places are supported
    "maxTokens": number,

    // The amount of tokens to add on each successful RPC. Typically this will
    // be some number between 0 and 1, e.g., 0.1.
    //
    // This field is required and must be greater than zero. Up to 3 decimal
    // places are supported.
    "tokenRatio": number
  }
}
```
