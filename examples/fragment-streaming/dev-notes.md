# Dev Notes — Fragment Streaming

**Status**: DONE (multi-bubble NDJSON streaming implemented)
**Date**: 2026-04-11 (v2 — supersedes dead-code-removal session)

---

## Phase 1 (previous session): Dead Code Removal
- Deleted the already-dead `handleNdjsonResponse()` and `parseNdjsonLine()` from `use-send-message.ts`
- Cleaned up the unreachable NDJSON branch in `sendAndProcessResponse()`

## Phase 2 (this session): Full NDJSON Implementation

### Server: `apps/memory-engine/src/application/chat/chat-response.ts`

**Added `FragmentStreamState` class** (~60 lines before `ChatResponseService`):
- State machine: `fragmentIndex`, `inFragmentsBlock`, `waitingForFirstFragment`, `suppressedWhitespace`
- Methods: `processChunk()`, `flush()`, `emitDelta()`, `onText()`, `onTag()`, `processBuffer()`
- Handles tag-style AND separator-style `<fragments>` XML
- Tags split across chunk boundaries handled correctly (pending buffer)

**Added `createFragmentStreamingTransform()` export**:
- 5-line factory that creates a TransformStream backed by `FragmentStreamState`
- Emits `{"fragmentIndex":N,"delta":"text"}\n` NDJSON lines

**Modified `streamAsync()`**:
- `pipeThrough(createFragmentStrippingStream())` → `pipeThrough(createFragmentStreamingTransform())`
- `Content-Type: text/plain; charset=utf-8` → `Content-Type: application/x-ndjson`

**Modified `prependStatusChunk()`**:
- `data: {"type":"status","message":"..."}\n\n` → `{"type":"status","message":"..."}\n`
- SSE format → NDJSON format (consistent with new protocol)

**Kept `createFragmentStrippingStream()`** — still exported (5 existing tests reference it)

### Client: `apps/web-client/src/components/chat/use-send-message.ts`

**Added module-level types**:
- `type NdjsonStreamState = { contents: Map<number, string>; maxIndex: number }`
- `type RafState = { pending: boolean }`

**Added exported helpers (testable)**:
- `findStreamingCutPoint(prev)` — scans back for streaming messages (no id, no isError)
- `buildFragmentMessages(contents, count)` — creates Message[] from fragment contents Map
- `applyNdjsonLine(line, state, onStatus?)` — parses and applies a single NDJSON line

**Added module-level function**:
- `scheduleFragmentRaf(raf, state, setMessages)` — RAF-batched multi-bubble setMessages

**Added `handleNdjsonFragmentResponse()`** (~20 lines):
- Reads NDJSON stream line-by-line
- Calls `applyNdjsonLine` per line, `scheduleFragmentRaf` after each chunk
- Final flush with definitive setMessages call
- try/catch error handling → sets error message in last streaming slot

**Modified `sendAndProcessResponse()`**:
- Added: `else if (contentType.includes("application/x-ndjson")) { await handleNdjsonFragmentResponse(...); }`

**Modified `sendThreadMessage()`**:
- Same NDJSON branch added (threads always send single-fragment NDJSON now)

---

## Key Design Decisions

### scan-back pattern (findStreamingCutPoint)
Instead of tracking a mutable `streamingCount`, we scan backwards through the `prev` array finding all assistant messages with `id === undefined && !isError`. These are the "streaming" ephemeral messages.
- This avoids React closure issues with stale `streamingCount`
- `isLoading` gate ensures only 1 active stream at a time
- `isError=true` acts as a sentinel (doesn't get erased by new streaming messages)

### RAF snapshot at execution time
`scheduleFragmentRaf` reads `st.maxIndex` and copies `st.contents` INSIDE the RAF callback (at execution time, not at schedule time). This means the RAF always shows the most up-to-date data available at render time.

---

## Net Change

- New files: 2 test files
- Modified files: 2 production files
- Lines added: ~180 (server class + factory + client helpers + handler)
- Lines removed: 0 (kept stripping stream for backward compat)
- TypeScript errors: 0


**Status**: DONE
**Date**: 2026-04-11

---

## Changes Made

### pps/web-client/src/components/chat/use-send-message.ts

**Deleted handleNdjsonResponse()** (~35 lines)
- Buffered NDJSON stream, assembled fragments from ragmentContents map, called setMessages with array of fragment messages.
- Was unreachable: the server never sends Content-Type: application/x-ndjson (see arch-decision.md §Why NOT Option A).

**Deleted parseNdjsonLine()** (~12 lines)
- Helper for the above. Parsed { fragmentIndex, delta } lines into a Map<number, string>.
- Removed together with its only caller.

**Removed else if (contentType.includes("application/x-ndjson")) branch** in sendAndProcessResponse()
- Content-type routing now: pplication/json → handleJsonResponse, everything else → handleStreamResponse.

---

## What Was NOT Changed

| Symbol | Reason Kept |
|---|---|
| Message.fragmentIndex | Used by ChatMessageArea.tsx to route messages to FragmentBlock component |
| Message.fragmentGroupId | Part of the Message type used for DB-loaded history display |
| createFragmentStrippingStream() | Server-side, actively used in streamAsync() |
| detectFragments() | Used by processAndStoreResponseAsync() for DB storage |
| storeMultiFragmentResponseAsync() | DB storage — working correctly |

---

## Net Change

- Lines removed: ~50
- Lines added: 0
- TypeScript errors: 0
