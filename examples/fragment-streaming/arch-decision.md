# Architecture Decision — Fragment Streaming

**Status**: SUPERSEDED → v2 APPROVED (2026-04-11 pipeline run)
**Date**: 2026-04-11
**Feature**: fragment-streaming

---

## v2 Decision: Option B — Implement NDJSON Multi-Bubble Streaming

**Previous decision (Option C)** deleted dead code and deferred implementation. That action is complete.
**This decision** implements the actual feature, which is now spec'd (po-brief.md + ux-spec.md).

---

## Protocol: `application/x-ndjson` Always

`FragmentChunk` interface in `apps/memory-engine/src/domain/conversation/contracts.ts` already specifies the shape:
```typescript
{ fragmentIndex: number; delta?: string; done?: boolean }
```

Wire format — every response line is a JSON object:
```ndjson
{"fragmentIndex":0,"delta":"text chunk"}
{"fragmentIndex":1,"delta":"second bubble chunk"}
{"type":"status","message":"Generando resumen..."}
```

---

## Files to Change

### Server: `apps/memory-engine/src/application/chat/chat-response.ts`
1. Add `createFragmentStreamingTransform()` — new export (TransformStream: raw LLM → NDJSON lines)
2. `streamAsync()`: use new transform, Content-Type = `application/x-ndjson`
3. `prependStatusChunk()`: emit `{"type":"status","message":"xxx"}\n` (not SSE format)
4. Keep `createFragmentStrippingStream()` exported (tests still reference it)

### Client: `apps/web-client/src/components/chat/use-send-message.ts`
1. Add `handleNdjsonFragmentResponse()` — replaces the deleted `handleNdjsonResponse()`
2. `sendAndProcessResponse()`: add branch for `application/x-ndjson`
3. `sendThreadMessage()`: add branch for `application/x-ndjson`
4. Keep `handleStreamResponse()` as defensive fallback for text/plain

---

## Transform State Machine

```
Initial: fi=0, inFragmentsBlock=false, waitingForFirstFragment=false

<fragments>  → inFragmentsBlock=true, waitingForFirstFragment=true
<fragment>   → if waitingForFirst: fi=0, waitingForFirst=false
             → else: fi++
</fragment>  → skip
</fragments> → inFragmentsBlock=false

Text:
  waitingForFirstFragment && whitespace-only → accumulate (suppress)
  waitingForFirstFragment && non-whitespace  → fi=0, emit suppressed+text (separator-style)
  else → emit {fi, delta: text}
```

---

## Client State Management: Scan-Back Pattern

```typescript
setMessages((prev) => {
  let cutPoint = prev.length;
  while (cutPoint > 0 && prev[cutPoint-1].role === "assistant"
         && prev[cutPoint-1].id === undefined && !prev[cutPoint-1].isError) {
    cutPoint--;
  }
  return [
    ...prev.slice(0, cutPoint),
    ...Array.from({ length: count }, (_, i) => ({
      role: "assistant" as const,
      content: fragmentContents.get(i) ?? "",
    })),
  ];
});
```

Works because: historical messages have `id`, streaming messages are ephemeral (no `id`, no `isError`).

---

## Decision: Option C — Simplify Now, Multi-Bubble as Future Feature

**Recommended Option: C**

---

## Rationale

### Why NOT Option A
Option A is architecturally unsound. The LLM streams tokens sequentially — <fragments> tags appear mid-stream, not at the start. Detecting them before streaming begins requires buffering the entire response, which defeats streaming's purpose. You would need a two-phase design: buffer → detect → re-stream as ndjson. This is complex, introduces buffering latency, and trades one format for another with no user-visible gain.

### Why NOT Option B (yet)
Option B (client-side inline parsing) is technically correct and the right long-term answer, but it is not a bug fix — it is a new feature. Proper multi-bubble streaming requires:
1. Client must detect <fragments> opening → enter multi-fragment mode.
2. Must handle <fragment> tags split across chunk boundaries (same problem createFragmentStrippingStream already solves server-side).
3. Must render N progressive bubbles simultaneously during streaming, managing N independent setMessages state slots.
4. Must discard or repurpose the pre-allocated empty ssistantMsg placeholder.

This needs a dedicated spec + ux-spec before implementation. It should not be patched into handleStreamResponse() hastily.

### Why Option C
- **No behavior regression**: current streaming is already single-bubble. Nothing gets worse.
- **DB storage is correct**: storeMultiFragmentResponseAsync() works. Fragments ARE stored separately in the DB. History loads may already render them as separate bubbles (separate Message rows with ragmentIndex) — this is unaffected.
- **Removes ~60 lines of unreachable client code** that creates false confidence and confusion.
- Fast, safe, mechanical.

---

## Files to Change

| File | Action | Layer | What |
|---|---|---|---|
| pps/web-client/src/components/chat/use-send-message.ts | MODIFY | Presentation | Delete handleNdjsonResponse(), parseNdjsonLine(), and the else if (application/x-ndjson) branch in sendAndProcessResponse() |

**No server changes needed.** createFragmentStrippingStream() stays. detectFragments() + storeMultiFragmentResponseAsync() stay.

---

## Existing Abstractions to Keep (Do NOT Remove)

| Symbol | File | Why keep |
|---|---|---|
| createFragmentStrippingStream() | chat-response.ts | Actively used in streamAsync(). Prevents raw XML leaking to client. |
| detectFragments() | detect-fragments.ts | Used by processAndStoreResponseAsync() to store DB rows correctly. |
| storeMultiFragmentResponseAsync() | chat-response.ts | DB storage of multi-fragment responses. Working correctly. |
| Message.fragmentIndex | use-send-message.ts | Part of the Message type used for DB-loaded history. May be used in rendering components. |
| Message.fragmentGroupId | use-send-message.ts | Same — DB hydration. |

> **Check before deleting ragmentIndex/ragmentGroupId from the Message type**: search for usages in chat rendering components. If they are only referenced in the dead handleNdjsonResponse(), they can be removed from the type too. If any rendering component uses them for history display, keep them.

---

## Exact Dead Code to Delete from use-send-message.ts

**1. Remove the ndjson branch** in sendAndProcessResponse():
`	ypescript
// DELETE this entire else-if block:
} else if (contentType.includes("application/x-ndjson")) {
  await handleNdjsonResponse(res, setMessages);
}
`

**2. Delete handleNdjsonResponse() function** (~35 lines, starts with sync function handleNdjsonResponse).

**3. Delete parseNdjsonLine() function** (~12 lines, starts with unction parseNdjsonLine).

After deletion, sendAndProcessResponse() content-type routing becomes:
`	ypescript
if (contentType.includes("application/json")) {
  await handleJsonResponse(...);
} else {
  await handleStreamResponse(...);
}
`

---

## Future: Option B Spec Requirements

When multi-bubble streaming is specced, the developer MUST handle:

1. **Chunk boundary safety**: <fragment> may be split across two chunks. Need a stateful accumulator (same pattern as createFragmentStrippingStream, but in reverse — extract instead of strip).
2. **Placeholder slot management**: sendAndProcessResponse() pre-inserts one empty ssistantMsg. Multi-fragment needs N slots. The first fragment reuses the placeholder; fragments 2..N are inserted as new messages during streaming.
3. **Server option**: Remove createFragmentStrippingStream() OR change it to strip only <fragments> outer wrapper while passing <fragment> inner tags through.
4. **Content-Type signal**: Can use a custom header (e.g. X-Fragment-Mode: multi) set only when the prompt template is known to request multi-fragment output, avoiding mid-stream detection entirely. This avoids the Option A problem.

---

## Security Considerations

None new. This is dead code removal only. No new inputs, no new outputs, no auth surface change.

---

## Trade-offs

| | Option A | Option B | Option C |
|---|---|---|---|
| Implementation risk | HIGH (buffering complexity) | MEDIUM (chunk-split parsing) | LOW (deletion only) |
| Behavior regression | None | None | None |
| User value now | None (already broken) | Multi-bubble streaming | None (status quo) |
| Code health | Adds complexity | Fixes UX properly | Removes dead code |
| Time cost | 2–3 days | 1–2 days (with spec) | 1 hour |

**Choose C now. Spec Option B as a separate feature when the product wants multi-bubble streaming.**
