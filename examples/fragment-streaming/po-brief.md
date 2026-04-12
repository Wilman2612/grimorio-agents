# PO Brief — Fragment Streaming

**Feature slug**: `fragment-streaming`
**Fecha**: 2026-04-11
**Status**: APPROVED

---

## Contexto del Problema

La IA genera respuestas usando etiquetas `<fragments>` y `<fragment>` para indicar que el contenido debería separarse en múltiples burbujas de chat independientes (multi-topic response). Actualmente:

- El servidor hace strip de esas etiquetas y envía todo como un bloque de texto plano
- El cliente renderiza una sola burbuja con todo el contenido concatenado
- El usuario ve un mensaje largo y monolítico cuando debería ver 2 o más respuestas separadas

## Valor para el Usuario

Cuando el usuario pregunta sobre varios temas distintos, la IA responde como si fueran conversaciones separadas — cada tema en su propia burbuja, con su propio espacio visual. Esto hace la conversación más natural y legible.

---

## User Stories

### US-1 — Multi-burbuja en streaming
**Como usuario**, cuando la IA decide que mi mensaje toca dos o más temas distintos, **quiero ver las respuestas aparecer como burbujas separadas del asistente**, streameadas progresivamente, para que la conversación se sienta natural y fácil de leer.

### US-2 — Experiencia sin regresión para respuestas simples
**Como usuario**, cuando la IA responde con un solo tema, **quiero que la experiencia de streaming sea idéntica a la actual** (una sola burbuja progresiva), sin degradación de rendimiento ni cambio visual.

### US-3 — Historial consistente
**Como usuario**, cuando recargo la conversación, **quiero ver las mismas burbujas separadas** que vi durante el streaming (sin re-colapso en un solo mensaje).

---

## Criterios de Aceptación

### AC-1 — Protocolo server→client
- [ ] El servidor envía `Content-Type: application/x-ndjson` para toda respuesta de chat
- [ ] Cada línea es un JSON válido: `{"fragmentIndex":N,"delta":"texto"}`
- [ ] Las etiquetas `<fragment>`, `<fragments>`, `</fragments>` nunca llegan al cliente
- [ ] El fin de stream se detecta correctamente (sin `done` flag explícito requerido — EOF natural)

### AC-2 — Streaming progresivo multi-burbuja
- [ ] El cliente muestra la primera burbuja (fragmentIndex=0) en cuanto llegan los primeros bytes
- [ ] Cuando llega el primer delta con fragmentIndex=1, aparece una segunda burbuja debajo
- [ ] Cada burbuja crece independientemente con sus propios deltas
- [ ] La animación/RAF batching no introduce lag perceptible

### AC-3 — Respuesta de un solo fragmento sin cambio visual
- [ ] Para fragmentIndex=0 only, la experiencia es visualmente idéntica a hoy
- [ ] No hay flasheo ni re-render innecesario

### AC-4 — Verificación manual
- [ ] El `manual-verifier` envía el prompt: `"Explícame en dos partes: primero qué es el sol, luego qué es la luna"`
- [ ] Ve aparecer **2 burbujas separadas del asistente**, cada una streameando su contenido progresivamente
- [ ] Ambas burbujas persisten al recargar la página

### AC-5 — Tests
- [ ] Test unitario: `createFragmentStreamingTransform()` emite NDJSON correcto para input con `<fragments>`
- [ ] Test unitario: cliente procesa líneas NDJSON y produce múltiples mensajes en estado
- [ ] Tests anteriores de fragment-stripping/detection siguen pasando (o se reemplazan)

---

## Out of Scope
- Thread mode no necesita multi-fragment (threads siempre responden un solo mensaje)
- No se cambia la lógica de `storeMultiFragmentResponseAsync` (ya funciona bien para historial)
- No se agrega UI especial de "loading" por fragment (la burbuja vacía es suficiente indicador)

---

## Notas Técnicas para Architect

- El servidor ya detecta fragmentos DESPUÉS del stream para guardado en DB. Eso NO cambia.
- La transformación debe ocurrir durante el piping, no post-facto
- `fragmentIndex` y `fragmentGroupId` ya existen en el modelo `Message` y en `ChatMessageArea`
- `ChatMessageArea` ya renderiza burbujas de tipo `FragmentBlock` para mensajes con `fragmentIndex`
- El campo `isError` en `Message` del cliente debe preservarse (para compatibilidad)
