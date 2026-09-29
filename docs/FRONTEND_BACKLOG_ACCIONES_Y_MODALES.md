# Backlog Técnico de Acciones, Modales y Mejoras UI (Frontend)

Este documento detalla los componentes, modales y adaptaciones pendientes en el frontend para cubrir al 100% las capacidades del backend y las reglas de diseño del proyecto.

---

## 1. Modales y Acciones Operativas Pendientes

### 1.1. Modal de Transferencia de Sistema (`MoveTicketModal.tsx`)
- **Objetivo:** Permitir al Responsable de Sistema o Administrador transferir un ticket erróneamente clasificado a otro sistema institucional.
- **Backend Endpoint:** `POST /api/tickets/:id/movimiento`
- **Mutación en Frontend:** Ya existe en `useTicketMutations().moveTicketMutation`.
- **Campos del formulario:**
  - `sistemaDestinoId` (Select con sistemas activos del catálogo).
  - `motivo` (Textarea obligatorio explicando la causa de la transferencia).
- **Ubicación:** `src/modules/tickets/components/MoveTicketModal.tsx`.
- **Integración:** Botón con ícono `ArrowRightLeft` en la cabecera de `TicketDetailPage.tsx`.

### 1.2. Modal de Edición de Ticket (`EditTicketModal.tsx`)
- **Objetivo:** Permitir modificar título, descripción, módulo y prioridad sin tener que cancelar y recrear el ticket.
- **Backend Endpoint:** `PATCH /api/tickets/:id`
- **Mutación en Frontend:** Ya existe en `useTicketMutations().updateTicketMutation`.
- **Campos del formulario:**
  - `titulo` (Input de texto).
  - `descripcion` (Textarea).
  - `prioridadId` (Select de prioridades).
  - `modulo` (Input de texto opcional).
- **Ubicación:** `src/modules/tickets/components/EditTicketModal.tsx`.
- **Integración:** Botón con ícono `Pencil` en la cabecera de `TicketDetailPage.tsx`.

### 1.3. Reemplazo de `window.prompt()` por Modales UI
Actualmente, las acciones de pausa y cancelación usan el diálogo nativo del navegador `window.prompt(...)`, lo que degrada la experiencia de usuario y rompe la accesibilidad:
- **`PauseTicketModal.tsx`:**
  - Cuadro de diálogo modal que solicita `motivo` de pausa (ej. "En espera de validación del usuario o datos adicionales").
  - Llama a `pauseTicketMutation.mutate({ id, motivo })`.
- **`CancelTicketModal.tsx`:**
  - Cuadro de diálogo con advertencia semántica (color rojo/rose) que solicita `motivo` obligatorio de cancelación.
  - Llama a `cancelTicketMutation.mutate({ id, motivo })`.

### 1.4. Reemplazo de `window.confirm()` por ConfirmDialog
- **Problema actual:** En `src/modules/users/components/UsersTable.tsx` (línea 47), el borrado de usuarios ejecuta `window.confirm(...)`.
- **Solución:** Implementar `ConfirmDialog.tsx` reutilizable en `src/core/components/ui/` para confirmaciones defensivas con botón de confirmación y cancelación estilizados.

---

## 2. Refactorización y Modularización (< 300 Líneas)

Según [`frontend/AGENTS.md`](file:///Users/mcardenas/Documents/GitHub/sisat/frontend/AGENTS.md), los archivos deben mantenerse por debajo de las 250-300 líneas de código. Los siguientes archivos superan el límite y requieren modularización preventiva:

| Archivo | Líneas Actuales | Límite Máximo | Descomposición Sugerida |
| :--- | :--- | :--- | :--- |
| `src/modules/tickets/pages/TicketDetailPage.tsx` | **465** | 300 | Extraer:<br>1. `TicketHeader.tsx` (metadatos, folio, badges, botones de edición/movimiento).<br>2. `TicketActionBar.tsx` (barra de botones de acción condicionales). |
| `src/modules/users/pages/DashboardPage.tsx` | **393** | 300 | Extraer:<br>1. `DashboardKpiGrid.tsx` (tarjetas cuantitativas).<br>2. `DashboardWelcomeBanner.tsx`. |
| `src/modules/actas/pages/ActaDetailPage.tsx` | **320** | 300 | Extraer la cabecera del acta y el listado de archivos a componentes independientes. |

---

## 3. Estandarización de Formularios con TanStack Form + Zod

Varios modales creados recientemente gestionan su estado mediante múltiples llamadas a `useState`. Aunque funcionan, la convención del proyecto exige:
- Usar `useForm` de `@tanstack/react-form`.
- Definir el esquema de validación en la carpeta `schemas/` con Zod (`zod/v4`).
- Validación en tiempo de cambio o blur antes del envío al backend.

**Componentes a migrar gradualmente:**
- `CreateAreaModal.tsx` y `EditAreaModal.tsx`.
- `CreateSistemaModal.tsx` y `EditSistemaModal.tsx`.
- `AssignResponsableModal.tsx` y `AssignDesarrolladorModal.tsx`.

---

## 4. Configuración de Pruebas Unitarias y de Componentes

El frontend actualmente cuenta con **0 tests**. Siguiendo la habilidad `optimal-test-design`, se debe configurar Vitest + Testing Library:

### Pruebas Prioritarias
1. **Tests unitarios para `usePermission.ts`:**
   - Verificar que `ADMIN` retorne `true` para cualquier recurso/acción.
   - Verificar que `DESARROLLADOR` no tenga acceso a `asignaciones:create` ni `cierre:create`.
   - Verificar que `CONSULTA` solo tenga permisos de lectura.
2. **Tests para `authGuards.ts`:**
   - Verificar que un desarrollador solo pueda operar tickets asignados a su ID.
3. **Tests de integración para el ciclo de tickets:**
   - Simular la transición de fases y habilitación de botones (`ASIGNADO` -> `EN_PROCESO` -> `RESUELTO`).
