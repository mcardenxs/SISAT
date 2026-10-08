# Plan de Acción y Hoja de Ruta Inmediata (Frontend SISAT)

Este documento organiza cronológicamente las tareas de mejora y consolidación del Frontend. Sirve como lista de seguimiento viva para el equipo de desarrollo.

---

## Resumen de Prioridades

```text
Fase 1: Corrección de Lógica de Roles y Contexto (Alta Prioridad - Seguridad y UX)
   │
   ▼
Fase 2: Nuevas Acciones de Tickets y Eliminación de window.prompt/confirm (Media-Alta)
   │
   ▼
Fase 3: Refactorización y Límite de Tamaño de Archivos (< 300 líneas) (Media)
   │
   ▼
Fase 4: Estandarización de Formularios con TanStack Form y Zod (Mejora Continua)
   │
   ▼
Fase 5: Suite de Pruebas Unitarias de Frontend (Calidad y Estabilidad)
```

---

## Checklist de Tareas por Fase

### Fase 1: Blindaje de Lógica de Roles y Autorización Contextual (Prioridad 1)
- [ ] **1.1. Corregir bug en Dashboard:**
  - Archivo: `src/modules/users/components/RoleInboxWidget.tsx`
  - Reemplazar `(isAssigned || isDev)` por validación estricta de `usuarioId` para que los desarrolladores solo vean sus propios tickets en "Mis Atenciones Activas".
- [ ] **1.2. Crear helper de validación contextual (`authGuards.ts`):**
  - Archivo: `src/core/permissions/authGuards.ts`
  - Centralizar las comprobaciones: `isAssignedDev`, `isSystemManager`, `isTicketCreator`.
- [ ] **1.3. Blindar acciones operativas en `TicketDetailPage`:**
  - Archivo: `src/modules/tickets/pages/TicketDetailPage.tsx`
  - Asegurar que los botones *"Iniciar Atención"*, *"Registrar Intervención"* y *"Terminar Atención"* únicamente aparezcan si el usuario es el desarrollador asignado o administrador.
  - Asegurar que *"Asignar"*, *"Evaluar"* y *"Cerrar"* requieran ser responsable del sistema o administrador.
- [ ] **1.4. Filtro "Mis Asignaciones" en listado de tickets:**
  - Archivo: `src/modules/tickets/pages/TicketsPage.tsx`
  - Agregar pestaña o toggle para alternar entre "Mis tickets asignados" y "Todos los tickets".

---

### Fase 2: Acciones Faltantes de Tickets y Diálogos UI (Prioridad 2)
- [ ] **2.1. Crear modal de transferencia de sistema (`MoveTicketModal`):**
  - Implementar formulario con selector de sistema destino y motivo.
  - Conectar con `moveTicketMutation` y agregar botón en `TicketDetailPage`.
- [ ] **2.2. Crear modal de edición de ticket (`EditTicketModal`):**
  - Implementar edición de título, descripción, módulo y prioridad.
  - Conectar con `updateTicketMutation`.
- [ ] **2.3. Eliminar `window.prompt()` en Pausar y Cancelar:**
  - Crear `PauseTicketModal.tsx` con captura de motivo.
  - Crear `CancelTicketModal.tsx` con advertencia destructiva y motivo.
  - Reemplazar los `prompt()` en `TicketDetailPage.tsx`.
- [ ] **2.4. Eliminar `window.confirm()` en `UsersTable`:**
  - Crear modal de confirmación `ConfirmDialog.tsx` en `src/core/components/ui/`.
  - Reemplazar en `UsersTable.tsx`.

---

### Fase 3: Desacoplamiento y Límite de Archivos (< 300 Líneas) (Prioridad 3)
- [ ] **3.1. Modularizar `TicketDetailPage.tsx` (Actualmente 465 líneas):**
  - Extraer `TicketHeader.tsx` (Folio, badges, metadatos del solicitante y área).
  - Extraer `TicketActionBar.tsx` (Agrupación de botones de acción con sus permisos).
- [ ] **3.2. Modularizar `DashboardPage.tsx` (Actualmente 393 líneas):**
  - Extraer `DashboardKpis.tsx` (Tarjetas de métricas cuantitativas).
  - Extraer `DashboardHeader.tsx` (Banner de bienvenida).
- [ ] **3.3. Modularizar `ActaDetailPage.tsx` (Actualmente 320 líneas):**
  - Extraer la sección de documentos adjuntos a un subcomponente.

---

### Fase 4: Estandarización de Formularios (Prioridad 4)
- [ ] **4.1. Migrar modales de Organización (`CreateAreaModal`, `EditAreaModal`) a TanStack Form + Zod.**
- [ ] **4.2. Migrar modales de Sistemas (`CreateSistemaModal`, `EditSistemaModal`).**
- [ ] **4.3. Migrar modales de Asignación de Personal (`AssignResponsableModal`, `AssignDesarrolladorModal`).**

---

### Fase 5: Suite de Pruebas Automatizadas (Prioridad 5)
- [ ] **5.1. Configuración de entorno de pruebas:**
  - Instalar `vitest` y `@testing-library/react` con pnpm exacto.
  - Agregar script `"test": "vitest run"` en `frontend/package.json`.
- [ ] **5.2. Escribir pruebas unitarias:**
  - `usePermission.test.ts` (Evaluación de roles y permisos dinámicos).
  - `authGuards.test.ts` (Comprobación de asignación contextual).
  - `useTicketMutations.test.ts` (Flujos de cambio de estado y notificaciones sonner).

---

## Referencias y Documentos Relacionados
- [Lógica de Roles y Permisos Contextuales](file:///Users/mcardenas/Documents/GitHub/sisat/docs/FRONTEND_LOGICA_PERMISOS_Y_ROLES.md)
- [Backlog Técnico de Acciones y Modales](file:///Users/mcardenas/Documents/GitHub/sisat/docs/FRONTEND_BACKLOG_ACCIONES_Y_MODALES.md)
- [Roadmap Original del Frontend](file:///Users/mcardenas/Documents/GitHub/sisat/docs/FRONTEND_ROADMAP.md)
