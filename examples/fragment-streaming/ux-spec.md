# UX Spec — Fragment Streaming

**Feature**: fragment-streaming
**Fecha**: 2026-04-11
**Input**: po-brief.md

---

## Flujo de Usuario

### Estado 1: Usuario envía mensaje

```
[Usuario] Explícame en dos partes: qué es el sol y qué es la luna
```

→ El input se limpia, el mensaje del usuario aparece en burbuja azul oscuro a la derecha.
→ Aparece una sola burbuja de typing del asistente (cursor `▌` o TypingIndicator).

### Estado 2: Primer fragmento llega (fragmentIndex=0)

```
[Usuario]  Explícame en dos partes...

[Asistente] El sol es una estrella de tipo G ubicada en el centro de nuestro sistema solar▌
```

- La burbuja del asistente crece progresivamente con cada delta
- Visual: idéntico al comportamiento actual de una sola burbuja
- No hay indicador especial de "multi-fragment incoming"

### Estado 3: Segundo fragmento llega (fragmentIndex=1)

```
[Usuario]  Explícame en dos partes...

[Asistente] El sol es una estrella de tipo G ubicada en el centro de nuestro sistema solar...

[Asistente] La luna es el satélite natural de la Tierra▌
```

- La primera burbuja queda estática (su contenido final ya está)
- Una nueva burbuja del asistente aparece debajo, streameando su propio contenido
- Transición: la nueva burbuja aparece SIN animación de entrada especial (aparece directamente)
- Ambas burbujas tienen el mismo estilo visual (`MessageBubble` estándar)

### Estado 4: Stream completado

```
[Usuario]  Explícame en dos partes...

[Asistente] El sol es una estrella de tipo G...
            [Deepen button]

[Asistente] La luna es el satélite natural...
            [Deepen button]
```

- Ambas burbujas muestran el botón "Deepen" (si tienen `id` del servidor)
- El `id` llega del historial al recargar — durante streaming el id puede ser `undefined`

---

## Especificación Visual de Bubbles Durante Streaming

### Burbuja en streaming (parcial)
```
┌────────────────────────────────────────────┐
│ El sol es una estrella de tipo G ubica▌    │
└────────────────────────────────────────────┘
```
- Contenido: texto parcial con cursor `▌` al final (implementado por ReactMarkdown fallback `"▌"`)
- Border: `border-[#E8E7E4]` estándar
- Sin indicador especial de "este es el fragmento N"

### Burbuja completada
```
┌────────────────────────────────────────────┐
│ El sol es una estrella de tipo G...        │
│                                            │
│                          [↩ Profundizar]   │
└────────────────────────────────────────────┘
```
- Sin cambio visual respecto a hoy para burbujas normales

### Estado de carga ANTES de que llegue el primer byte

Si llega el status message del servidor (`"Generando tu resumen del día anterior..."`):
```
📝 Generando tu resumen del día anterior...  ← texto italic pequeño
[Asistente] ▌
```
- El `statusMessage` sigue apareciendo sobre la burbuja (comportamiento existente en `ChatMessageArea`)

### TypingIndicator
- Se muestra cuando `isLoading && messages[last].content === ""`
- Con multi-fragment: la segunda burbuja empieza vacía, por lo que el TypingIndicator podría flashear
- **Decisión UX**: aceptable, el usuario ve que la segunda burbuja está cargando

---

## Claves i18n Necesarias

NO se agregan nuevas claves de i18n — no hay texto hardcodeado nuevo en esta feature.

Los textos del botón "Profundizar" (`chat.deepenAction`), "Deepen" etc. ya existen.

---

## Accesibilidad

- Cada burbuja tiene `data-role="assistant"` (ya implementado en `MessageBubble`)
- Las dos burbujas son elementos distintos en el DOM → screen readers las leen como mensajes separados
- No se requiere `aria-live` adicional — React renderiza y screen readers detectan cambios automáticamente

---

## Estados de Error

### Error durante streaming multi-fragment
- Si el stream se interrumpe en medio del fragmento 1, la burbuja 0 queda con su contenido parcial
- La burbuja 1 (en streaming) se reemplaza con: `"Lo siento, hubo un error. Intenta de nuevo."`
- La burbuja 0 NO se toca — preserva el contenido recibido
- **Decisión**: es aceptable dejar el fragmento 0 y mostrar error solo en el fragmento que falló (o en la última burbuja activa)

---

## Diferencias con Estado Actual

| Aspecto | Hoy | Con la feature |
|---|---|---|
| Content-Type server | `text/plain` | `application/x-ndjson` |
| Burbujas por respuesta multi-topic | 1 | N (según fragmentos) |
| Streaming visible | sí (1 burbuja) | sí (múltiples burbujas) |
| FragmentBlock (historial) | ya funciona | sigue igual |
| Thread mode | sin cambio | sin cambio |

---

## NO se hace (Out of Scope UX)

- No hay badge/número en la burbuja ("Fragmento 1 de 2")
- No hay animación de "separación" entre fragmentos
- No hay indicador visual de que hay más fragmentos por venir
- No hay botón de "colapsar" los fragmentos
