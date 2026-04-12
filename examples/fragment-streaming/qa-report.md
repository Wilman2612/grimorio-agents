# QA Report — Fragment Streaming

**Feature**: fragment-streaming
**Fecha**: 2026-04-11
**Status**: PASS

---

## Tests Escritos

### Server: `apps/memory-engine/src/tests/fragment-streaming-transform.test.ts`
Cobertura de `createFragmentStreamingTransform()`:

| Test | Resultado |
|---|---|
| single-topic plain text emits all as fragmentIndex 0 | ✅ PASS |
| tag-style multi-fragment emits correct fragmentIndex per segment | ✅ PASS |
| separator-style multi-fragment emits correct fragmentIndex | ✅ PASS |
| partial tag split across chunks handled correctly | ✅ PASS |
| three fragments assigned correct indices | ✅ PASS |
| empty stream produces no output | ✅ PASS |
| response without fragment wrapper all goes to fragmentIndex 0 | ✅ PASS |

**Total: 7/7 passed**

### Client: `apps/web-client/src/tests/unit/use-send-message-fragments.test.ts`
Cobertura de helpers NDJSON:

**applyNdjsonLine (6/6)**:
| Test | Resultado |
|---|---|
| accumulates delta for given fragmentIndex | ✅ PASS |
| tracks maxIndex when new fragmentIndex arrives | ✅ PASS |
| calls onStatus for status lines | ✅ PASS |
| skips malformed JSON silently | ✅ PASS |
| skips lines missing fragmentIndex or delta | ✅ PASS |
| skips whitespace-only lines | ✅ PASS |

**findStreamingCutPoint (6/6)**:
| Test | Resultado |
|---|---|
| returns length when last message has id | ✅ PASS |
| cuts back over single streaming placeholder | ✅ PASS |
| cuts back over multiple streaming messages (multi-fragment) | ✅ PASS |
| does not cut past error messages (isError=true) | ✅ PASS |
| does not cut past messages with id | ✅ PASS |
| handles empty array | ✅ PASS |

**buildFragmentMessages (4/4)**:
| Test | Resultado |
|---|---|
| creates count messages with correct content from map | ✅ PASS |
| creates empty content for missing indices | ✅ PASS |
| all messages have role assistant | ✅ PASS |
| handles count=1 for single fragment | ✅ PASS |

**Total: 16/16 passed**

---

## Tests de Regresión

| Test File | Resultado |
|---|---|
| `fragment-stripping.test.ts` (5 tests) | ✅ PASS — no regresiones |
| `fragmenter.test.ts` | ❌ FAIL — error pre-existente (`@/lib/result` no encontrado), NO causado por este feature |

---

## TypeScript
`npx tsc --noEmit` → sin errores.

---

## Observaciones

1. **`createFragmentStrippingStream()`** se mantiene exportada y sus 5 tests siguen pasando.
2. **Estado del server**: emite NDJSON correctamente para single-topic y multi-topic.
3. **Estado del client**: helpers puros testeados en aislamiento, routing NDJSON agregado en `sendAndProcessResponse` y `sendThreadMessage`.
4. **Casos edge cubiertos**:
   - Tags partidos entre chunks
   - Separator-style vs tag-style
   - 3+ fragmentos
   - Status messages embebidos
   - Líneas malformadas ignoradas silenciosamente
5. **Comportamiento en error**: `findStreamingCutPoint` + `isError=true` boundary garantizan que mensajes de error no se sobreescriben en retries.

---

## Gaps de Testing (no cubiertos por estos tests)

- Integración end-to-end `handleNdjsonFragmentResponse` con mock Response (requiere jsdom + requestAnimationFrame mock)
- Concurrencia real de RAF callbacks durante streaming veloz
- Thread mode (single-fragment NDJSON apenas)

Estos se dejan para FASE 6 (manual-verifier) y futuros tests de integración.
