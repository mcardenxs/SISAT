# Análisis de Brecha y Requerimientos Pendientes de SISAT

**Documento de Referencia:** Especificación de Requerimientos Iniciales de SISAT (Secciones 2 y 3).  
**Fecha de Elaboración:** Septiembre 2026  
**Estado General del Proyecto:** 85% de coincidencia estructural implementada (Backend y Base de Datos muy avanzados, Frontend con detalles de integración y reglas de negocio pendientes).

---

## 1. Resumen Ejecutivo de la Comparativa

| Módulo / Requerimiento | Estado en Spec Oficial | Estado en Base de Datos / Backend | Estado en Frontend | Nivel de Brecha |
| :--- | :--- | :--- | :--- | :--- |
| **Flujo de Tickets (8 fases)** | 100% definido | 100% implementado | 80% (Faltan modales de pausa/cancelación) | **Baja** |
| **Doble Estado (Operativo vs Documental)** | Obligatorio | 100% sincronizado en BD | 40% (Falta visibilidad destacada en UI) | **Media** |
| **Quién registra Tickets** | Solo Responsables de Sistema y Admin | Permitido por rol | 70% (Se le habilitó al Jefe de Área por error) | **Media** |
| **Rol del Jefe de Área** | Solo Dashboard de avance y firma de actas | APIs de consulta listas | 60% (Tiene botones operativos indebidos) | **Alta** |
| **Evidencia Inicial en Alta de Ticket** | Imágenes, PDF y Videos ligeros (máx 30MB) | Servicio de upload listo | 30% (El modal no pide evidencia al crear) | **Alta** |
| **Cambio de Ticket a otro Sistema (Movimiento)**| Reclasificación con motivo e histórico | Modelo y endpoint listos | 10% (Falta el modal visual `MoveTicketModal`) | **Alta** |
| **Atención Técnica y Bitácora** | Tiempos, cambios en BD, diagnóstico | 100% implementado | 95% (Intervenciones y terminación operativas) | **Mínima** |
| **Calificación de Solución (1 a 5)** | Validación de conformidad/inconformidad | 100% implementado | 100% implementado en modal | **Ninguna** |
| **Reapertura de Tickets** | Historial de ciclos consecutivos | 100% implementado | 100% implementado en modal y pestaña | **Ninguna** |
| **Actas Semanales (Periodo 7 días)** | Generación, impresión y firma | 100% implementado | 95% (Plantilla imprimible y upload de PDF) | **Mínima** |
| **Dashboard del Jefe de Área** | Consulta de KPIs sin operar tickets | Endpoint `/api/dashboard/stats` listo | 75% (Falta segmentar solo métricas de su área) | **Media** |
| **Privacidad de Usuarios y Permisos** | Solo Administrador | Controlado en backend | 50% (La pestaña `/users` es visible para todos) | **Alta** |

---

## 2. Lo que YA está Desarrollado y Cumple al 100%

1. **Ciclo de Vida de 8 Estados:**
   - La tabla `fase` cuenta con los 8 estados exactos: `REGISTRADO`, `ASIGNADO`, `EN_PROCESO`, `EN_ESPERA_DE_INFORMACION`, `RESUELTO_POR_DESARROLLO`, `CERRADO_POR_RESPONSABLE`, `REABIERTO` y `CANCELADO`.
   - Las transiciones de estado guardan fecha, usuario responsable y comentarios de auditoría en la tabla `transicion`.
2. **Atención Técnica Profunda:**
   - Registro de diagnóstico técnico, descripción de la solución, módulos modificados, afectaciones a base de datos (`ate_datos`) y bitácora de minutos invertidos por desarrollador.
3. **Calificación y Conformidad:**
   - Escala del 1 al 5 con control de conformidad o motivos de inconformidad.
4. **Reapertura con Trazabilidad:**
   - Generación de nuevo ciclo de atención consecutivo (`Ciclo 1`, `Ciclo 2`, etc.) conservando el historial intacto.
5. **Actas Semanales de Entrega-Recepción:**
   - Validación estricta del corte semanal ($DATEDIFF = 6$).
   - Formato oficial con membrete y espacios para firmas/sellos para exportar a PDF o imprimir con `@media print`.
   - Carga de documento PDF firmado y sellado vinculándolo al folio del acta.

---

## 3. Catálogo Detallado de lo que FALTA por Implementar

### Brecha 1: Ajuste del Rol del Jefe de Área (Regla de Negocio Crítica)
* **Requerimiento Oficial (Punto 2.4 y 3.2):**  
  > *"Acceso del jefe de área: Dashboard de avance, sin operación directa del ticket."*  
  > *"Firma y sella el acta semanal."*
* **Situación Actual:** En el frontend, el Jefe de Área tiene habilitado el botón de "Crear Ticket" y puede acceder a vistas de edición.
* **Qué falta hacer:**
  1. Remover `tickets:create` de los permisos por defecto del Jefe de Área en `usePermission.ts`.
  2. En el Dashboard y en `/tickets`, ocultar los botones de alta y gestión técnica para el Jefe de Área.
  3. Asegurar que su vista esté enfocada en:
     - El Dashboard con los KPIs de su departamento.
     - El módulo de Actas Semanales (`/actas`) para firmar y sellar las entregas.

---

### Brecha 2: Quién puede Registrar Tickets
* **Requerimiento Oficial (Punto 2.4):**  
  > *"Usuarios que levantan tickets: Solo responsables de sistemas en primera instancia (y Administrador)."*
* **Situación Actual:** Cualquier usuario con permiso genérico de creación ve el botón de "Nuevo Ticket".
* **Qué falta hacer:**
  1. En el frontend, condicionar el botón de "Nuevo Ticket" en `/tickets` y `/dashboard` para que únicamente se active si:
     ```typescript
     const canCreateTicket = isAdmin || user.role === "RESPONSABLE_DE_SISTEMA";
     ```
  2. En el desplegable de "Sistema" del modal de alta, si el usuario es `RESPONSABLE_DE_SISTEMA`, prefiltrar únicamente los sistemas que tiene formalmente asignados bajo su responsabilidad.

---

### Brecha 3: Carga de Evidencia Inicial al Crear el Ticket
* **Requerimiento Oficial (Punto 2.5 y 3.4):**  
  > *"El responsable registra el ticket y adjunta evidencia del problema."*  
  > *"Imágenes (JPG, PNG, WEBP), PDF, documentos o videos ligeros (MP4) con límite máximo de 30 MB."*
* **Situación Actual:** El modal [`CreateTicketModal.tsx`](file:///Users/mcardenas/Documents/GitHub/sisat/frontend/src/modules/tickets/components/CreateTicketModal.tsx) solo pide sistema, título, descripción, prioridad y tipo de solicitud. La evidencia tiene que subirse después entrando al detalle del ticket.
* **Qué falta hacer:**
  1. Integrar el input de subida de archivos dentro de `CreateTicketModal.tsx`.
  2. Validar extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, `.mp4`, `.docx`, `.xlsx`, `.zip`.
  3. Validar el tamaño máximo: archivos normales hasta 15 MB, videos MP4 ligeros hasta **30 MB**.
  4. Al crear el ticket, enviar el archivo a `/api/uploads` y ligar automáticamente el registro en `/api/tickets/:id/evidencias` como evidencia de tipo `INICIAL`.

---

### Brecha 4: Cambio de Ticket a otro Sistema (Movimiento)
* **Requerimiento Oficial (Punto 3.8):**  
  > *"El sistema debe permitir cambiar un ticket a otro sistema cuando haya sido clasificado incorrectamente: Sistema original, Sistema nuevo, Usuario que realizó el cambio, Fecha y Motivo del cambio."*
* **Situación Actual:** El backend ya tiene la tabla `movimiento` y el endpoint `POST /api/tickets/:id/movimiento`. En el frontend existe la mutación en `useTicketMutations.ts`, pero no existe el modal en la interfaz.
* **Qué falta hacer:**
  1. Crear el componente `src/modules/tickets/components/MoveTicketModal.tsx`.
  2. Incluir un selector de `sistemaDestinoId` y un campo de texto obligatorio para el `motivo`.
  3. Agregar el botón con ícono `ArrowRightLeft` ("Transferir Sistema") en la cabecera de `TicketDetailPage.tsx`.
  4. En la pestaña de trazabilidad de `TicketDetailPage.tsx`, mostrar el historial de transferencias que ha tenido el ticket.

---

### Brecha 5: Visibilidad del Doble Estado (Técnico vs Documental)
* **Requerimiento Oficial (Punto 2.4 y 3.7):**  
  > *"Cierre técnico vs. cierre documental: El ticket puede cerrarse aunque el acta firmada no esté cargada."*  
  > *"Manejar un estado documental separado del estado técnico: Pendiente de acta, En acta generada, Acta firmada cargada."*
* **Situación Actual:** El backend actualiza automáticamente la tabla `constancia` al emitir o subir el acta, pero en el frontend solo se muestra con claridad el badge de la fase operativa (ej. *Cerrado*).
* **Qué falta hacer:**
  1. En `TicketTableView.tsx` (modo tabla), agregar una columna explícita: **"Estado Documental"**.
  2. En `TicketDetailPage.tsx`, mostrar dos badges semánticos en el encabezado:
     - **Badge 1 (Operativo):** `[ Cerrado por Responsable ]` (Verde / Emerald).
     - **Badge 2 (Documental):** `[ Pendiente de Acta ]` (Ámbar / Warning) o `[ Acta Firmada Cargada ]` (Azul / Blue).

---

### Brecha 6: Sustitución de `window.prompt()` y `window.confirm()`
* **Requerimiento Oficial (Punto 3.6):**  
  > *"Estados: En espera de información y Cancelado."*
* **Situación Actual:** En `TicketDetailPage.tsx` líneas 325 y 340, pausar y cancelar ejecutan diálogos nativos `prompt("Motivo...")`. En `UsersTable.tsx` se usa `window.confirm(...)`.
* **Qué falta hacer:**
  1. Crear `PauseTicketModal.tsx` para pausar el ticket a *En espera de información* pidiendo el motivo de forma amigable.
  2. Crear `CancelTicketModal.tsx` con alerta visual destructiva.
  3. Crear `ConfirmDialog.tsx` para confirmaciones seguras.

---

### Brecha 7: Privacidad y Acceso a la Gestión de Usuarios
* **Requerimiento Oficial (Punto 3.2):**  
  > *"Administrador: Control total de usuarios y roles. Los demás roles no administran usuarios."*
* **Situación Actual:** En el Navbar, la opción "Usuarios" (`/users`) aparece a todos los roles debido a que comparten el permiso de lectura de directorio.
* **Qué falta hacer:**
  1. En `MainLayout.tsx`, ocultar el enlace de "Usuarios" para cualquier rol que no sea `ADMINISTRADOR`.
  2. Proteger la ruta `/users` para que si un desarrollador o usuario de consulta escribe la URL en el navegador, se le deniegue el acceso.

---

### Brecha 8: Segmentación Contextual de Vistas (No ver tickets generales)
* **Requerimiento Oficial (Punto 2.2, 3.2 y 3.13):**  
  > *"Los tickets serán levantados por los responsables de cada sistema y atendidos por sus desarrolladores."*  
  > *"Dashboard de avance para jefe de área con reportes de su área o sistema."*
* **Situación Actual:** Todos los usuarios ven la lista completa global de todos los tickets y áreas de la institución.
* **Qué falta hacer:**
  1. En `TicketsPage.tsx`, aplicar por defecto el filtro según el usuario conectado:
     - Desarrollador &rarr; Solo sus tickets asignados.
     - Responsable &rarr; Solo tickets de sus sistemas a cargo.
     - Jefe de Área &rarr; Solo tickets de su área.
  2. En `RoleInboxWidget.tsx`, corregir el bug que muestra todos los tickets activos al rol desarrollador.

---

## 4. Plan de Acción Priorizado

```text
SPRINT 1: Seguridad, Privacidad y Reglas de Negocio (Inmediato)
├── 1. Ocultar módulo /users y /permissions para roles no administradores.
├── 2. Restringir la creación de tickets únicamente a Responsables de Sistema y Admin.
├── 3. Ajustar el rol de Jefe de Área a modo estricto de consulta y firma.
└── 4. Corregir el bug del widget del Dashboard (RoleInboxWidget).

SPRINT 2: Operación y Modales de Tickets
├── 1. Crear MoveTicketModal.tsx (Transferir ticket a otro sistema).
├── 2. Crear PauseTicketModal.tsx y CancelTicketModal.tsx (Eliminar window.prompt).
├── 3. Agregar subida de evidencia inicial (con límite de 30MB) en CreateTicketModal.tsx.
└── 4. Mostrar el badge dual en la UI: Estado Técnico vs. Estado Documental.

SPRINT 3: Segmentación y Filtros Contextuales
├── 1. Filtro por defecto en /tickets ("Mis Asignaciones" / "Mis Sistemas").
└── 2. Segmentar las métricas del Dashboard para que el Jefe de Área solo vea su departamento.
```
