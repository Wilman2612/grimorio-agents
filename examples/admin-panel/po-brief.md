# Feature Brief: Admin Panel

## Problem Statement

DiarioIA no tiene forma de que el operador del producto (el dueño, un solo super-admin por ahora) pueda ver el estado de la plataforma, revisar qué usuarios están activos, controlar el estado de sus suscripciones y monitorear métricas de uso y costo. Sin este panel, el operador debe consultar la base de datos directamente para obtener cualquier información operativa, lo cual es lento, inseguro y no escala. El admin panel es la herramienta de operación del negocio — no una función de usuario final.

**Restricción de privacidad crítica**: El administrador NO puede ver el contenido de las entradas del diario ni las conversaciones de ningún usuario. La visibilidad se limita estrictamente a datos operativos y de suscripción.

---

## User Stories

### Historia 1: Acceso al panel de administración

- **Como** super-admin de DiarioIA,
- **Quiero** acceder a la sección `/admin` desde la interfaz principal,
- **Para** operar la plataforma sin tener que manipular la base de datos directamente.

  - **Given** que estoy autenticado con una cuenta marcada como super-admin (via Clerk metadata o email allowlist)
  - **When** navego a `/admin` o hago clic en el enlace/botón de acceso al panel
  - **Then** veo el dashboard principal del panel de administración

- **Given** que estoy autenticado con una cuenta de usuario regular (sin privilegios de admin)
  - **When** intento navegar a cualquier ruta bajo `/admin`
  - **Then** recibo un error 403 o soy redirigido a la página principal, sin ver ningún contenido del panel

- **Given** que no estoy autenticado
  - **When** intento navegar a cualquier ruta bajo `/admin`
  - **Then** soy redirigido al flujo de login de Clerk

---

### Historia 2: Dashboard de métricas operativas

- **Como** super-admin,
- **Quiero** ver un dashboard con métricas clave de la plataforma,
- **Para** entender el estado de salud del negocio de un vistazo.

  - **Given** que accedo al dashboard de `/admin`
  - **When** la página carga
  - **Then** veo las siguientes métricas:
    - Total de usuarios registrados
    - Usuarios activos (al menos 1 mensaje en los últimos 30 días)
    - Mensajes enviados en las últimas 24 horas
    - Al menos un gráfico o visualización de tendencia (eje de tiempo vs. actividad)
    - Costo estimado de API (si los datos están disponibles; si no, la métrica muestra "N/D" sin romper la página)

- **Given** que no hay datos disponibles aún (plataforma recién lanzada)
  - **When** accedo al dashboard
  - **Then** las métricas muestran `0` o `N/D` en lugar de mostrar errores o pantalla en blanco

---

### Historia 3: Listado y vista de usuarios

- **Como** super-admin,
- **Quiero** ver una lista de todos los usuarios registrados con información operativa básica,
- **Para** poder identificar cuentas, revisar su estado y tomar decisiones de soporte.

  - **Given** que navego a la sección de usuarios en `/admin/users`
  - **When** la página carga
  - **Then** veo una lista paginada de usuarios con al menos los siguientes campos:
    - ID de usuario
    - Email
    - Fecha de registro
    - Estado de suscripción (activo / inactivo / sin suscripción)
    - Fecha de último acceso o última actividad (si está disponible)

- **Given** que existen más de 20 usuarios
  - **When** veo la lista
  - **Then** la lista está paginada o tiene scroll virtual — no se cargan todos los usuarios en una sola petición sin límite

- **Given** que hago clic en un usuario de la lista
  - **When** se abre el detalle del usuario
  - **Then** veo la información ampliada del usuario (datos de perfil, suscripción actual, historial de suscripciones si existe) y NO veo ningún contenido de sus entradas de diario ni sus mensajes de chat

---

### Historia 4: Gestión de suscripciones

- **Como** super-admin,
- **Quiero** ver el estado de suscripción de cada usuario con sus fechas de vigencia y datos financieros básicos,
- **Para** poder monitorear la salud de ingresos y detectar anomalías.

  - **Given** que navego a la sección de suscripciones en `/admin/subscriptions`
  - **When** la página carga
  - **Then** veo una lista de suscripciones con al menos:
    - Email del usuario asociado
    - Plan (nombre del tier)
    - Estado: activo / cancelado / expirado / en prueba
    - Fecha de inicio
    - Fecha de vencimiento o próximo cobro
    - Monto (si está disponible desde el proveedor de pagos)

- **Given** que una suscripción está próxima a vencer (dentro de 7 días) o ya expirada
  - **When** aparece en la lista
  - **Then** se muestra con una indicación visual diferenciada (ícono, badge o color) que la distingue del resto

- **Given** que no hay suscripciones registradas
  - **When** accedo a la sección
  - **Then** veo un estado vacío descriptivo en lugar de una pantalla en blanco o error

---

### Historia 5: Protección de privacidad del contenido de usuarios

- **Como** usuario de DiarioIA,
- **Quiero** que mis entradas de diario y conversaciones con la IA sean completamente privadas,
- **Para** que ni siquiera el administrador del sistema pueda leer mi contenido personal.

  - **Given** que un super-admin ha ingresado al panel
  - **When** consulta cualquier vista del panel — dashboard, detalle de usuario, suscripciones
  - **Then** ninguna API del panel devuelve contenido de diario, mensajes de conversación, ni fragmentos de memoria semántica o episódica de ningún usuario

---

## Acceptance Criteria

- [ ] Las rutas `/admin/*` retornan HTTP 403 cuando el usuario autenticado no tiene el rol `super-admin`.
- [ ] Las rutas `/admin/*` redirigen a login cuando el usuario no está autenticado.
- [ ] El dashboard muestra: total de usuarios, usuarios activos (últimos 30 días), mensajes en últimas 24h, y al mínimo una visualización gráfica de actividad.
- [ ] Si los datos de costo de API no están disponibles, la métrica muestra "N/D" sin errores de runtime.
- [ ] La lista de usuarios en `/admin/users` muestra: ID, email, fecha de registro, estado de suscripción, y última actividad.
- [ ] La lista de usuarios está paginada (máximo 50 por página), no carga todos los registros sin límite.
- [ ] El detalle de un usuario no expone ningún campo de contenido del diario, mensajes de chat, ni memoria de IA.
- [ ] La lista de suscripciones en `/admin/subscriptions` muestra: usuario, plan, estado, fechas de inicio/vencimiento, y monto si disponible.
- [ ] Las suscripciones vencidas o próximas a vencer (≤7 días) tienen indicación visual diferenciada.
- [ ] No existen acciones destructivas (sin botones de eliminar usuarios, cancelar suscripciones, ni resetear datos) en esta versión.
- [ ] El mecanismo de autorización de super-admin funciona via Clerk metadata (`publicMetadata.role === "super-admin"`) con soporte alternativo de email allowlist configurable via variable de entorno.
- [ ] El enlace/botón de acceso al panel de admin es visible en la interfaz principal **solo** para usuarios con rol super-admin — es invisible para usuarios regulares.
- [ ] Todas las cadenas de texto visibles del panel usan el sistema de i18n (`useTranslations()`), en español e inglés.

---

## Out of Scope

- Eliminación o suspensión de cuentas de usuario (no hay acciones destructivas en esta versión).
- Cancelación manual de suscripciones desde el panel.
- Roles de administración múltiples o granulares (solo super-admin por ahora).
- Sistema de gestión dinámica de roles (asignación de roles desde el panel mismo).
- Impersonación de usuarios (admin logueado como un usuario).
- Logs de auditoría de acciones del admin.
- Vista del historial de conversaciones o entradas del diario de cualquier usuario.
- Panel de admin como aplicación separada (`apps/admin`).
- Autenticación separada del admin (usa Clerk igual que el resto de la app).
- Integración directa con el proveedor de pagos para acciones (solo lectura de datos si están accesibles).
- Notificaciones o alertas automáticas (ej. email cuando una suscripción expira).
- Exportación de datos a CSV u otros formatos.

---

## Blockers (Human Decision Required)

- **Costos de API**: Para mostrar costos estimados de API en el dashboard, se necesita saber si existe un origen de datos ya instrumentado (tabla de auditoría de uso de tokens, integración con el proveedor de LLM). Si no existe, la métrica se omite o muestra "N/D". El Arquitecto debe determinar si la instrumentación existe antes de implementar esta métrica.
- **Datos financieros de suscripciones**: El monto y datos de facturación de suscripciones dependen de si el proveedor de pagos (Stripe u otro) está integrado y si se persisten en la base de datos. El Arquitecto debe verificar qué campos financieros existen actualmente.

---

## Success Metrics

- El super-admin puede verificar el estado de cualquier usuario y su suscripción en menos de 30 segundos sin necesidad de consultar la base de datos directamente.
- Ningún dato de contenido de usuario (diario, chat, memoria) es accesible desde ningún endpoint del panel.
- Un usuario regular que intenta acceder a `/admin` es bloqueado en el 100% de los intentos.
- El dashboard carga sin errores en todos los estados posibles (plataforma vacía, datos parciales, datos completos).

---

## Status: DONE
