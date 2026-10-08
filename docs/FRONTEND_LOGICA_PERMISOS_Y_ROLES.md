# Especificación de Lógica de Roles, Permisos y Autorización Contextual (Frontend)

Este documento describe la especificación técnica de la lógica de acceso en el frontend de SISAT. Define la transición del modelo de control de acceso básico por roles (**RBAC**) hacia el modelo de control de acceso basado en atributos y contexto (**ABAC**).

---

## 1. Diagnóstico del Estado Actual

Actualmente, el frontend implementa el hook `usePermission(resource, action)` y el componente `<Can>`:
- **Lo que funciona:** Oculta opciones del menú de navegación y botones a nivel general (un usuario con rol `CONSULTA` o `DESARROLLADOR` no ve botones de administración, asignación o cierre).
- **El problema detectado:** Las acciones operativas en [`TicketDetailPage.tsx`](file:///Users/mcardenas/Documents/GitHub/sisat/frontend/src/modules/tickets/pages/TicketDetailPage.tsx) y en [`RoleInboxWidget.tsx`](file:///Users/mcardenas/Documents/GitHub/sisat/frontend/src/modules/users/components/RoleInboxWidget.tsx) evalúan únicamente el **rol global** del usuario, omitiendo la **pertenencia o asignación contextual**:
  1. Cualquier usuario con rol `DESARROLLADOR` puede ver e interactuar con los botones de *"Iniciar Atención"*, *"Registrar Intervención"* y *"Terminar Atención"* en tickets que pertenecen a otros desarrolladores.
  2. Cualquier usuario con rol `RESPONSABLE_DE_SISTEMA` puede reasignar, evaluar o cerrar tickets de sistemas que no tiene a su cargo.
  3. En el Dashboard, el widget *"Mis Atenciones Activas"* lista tickets ajenos debido a una condición laxa en la evaluación de arrays.
  4. En el listado de tickets (`/tickets`), no existe una segmentación rápida entre "Todos los tickets" y "Mis asignaciones".

---

## 2. Matriz de Autorización Contextual por Rol

| Rol | Alcance en Lectura | Acciones Permitidas | Condición Contextual Estricta |
| :--- | :--- | :--- | :--- |
| **ADMINISTRADOR** | Todos los módulos y registros | Todas las acciones operativas y administrativas | `true` (Sin restricciones) |
| **DESARROLLADOR** | Todos los tickets, sistemas, áreas y actas | Iniciar atención, registrar tiempos/intervenciones, subir evidencias, terminar atención técnica | **Solo si el ticket tiene una asignación activa donde:**<br>`ticket.asignaciones.some(a => !a.fin && a.usuarioId === user.id)` |
| **RESPONSABLE DE SISTEMA** | Todos los tickets, sistemas y actas | Asignar desarrollador, reasignar, transferir sistema, evaluar atención técnica, cerrar ticket | **Solo si el usuario es responsable vigente del sistema del ticket:**<br>`sistema.responsables.some(r => !r.fin && r.usuarioId === user.id)` |
| **JEFE DE ÁREA** | Tickets de su área, actas de su área, sistemas | Crear tickets para su área, firmar actas semanales de entrega-recepción, reabrir ticket por inconformidad | **Solo si el ticket o acta pertenece a su área:**<br>`ticket.areaId === user.areaId` |
| **CONSULTA / OPERADOR** | Lectura general | Ninguna mutación operativa | Solo consulta |

---

## 3. Cambios Concretos Requeridos por Pantalla

### 3.1. Detalle del Ticket (`src/modules/tickets/pages/TicketDetailPage.tsx`)

#### A. Definición de Helpers Contextuales
Extraer en constantes computadas al inicio de la renderización:

```typescript
const currentUser = useAuthStore((state) => state.user);
const isAdmin = currentUser?.role === "ADMINISTRADOR" || currentUser?.role === "ADMIN";

// 1. Asignación activa del ticket
const activeAsignacion = ticket.asignaciones?.find((a) => !a.fin);

// 2. ¿El usuario conectado es el desarrollador asignado?
const isAssignedDev = isAdmin || (activeAsignacion?.usuarioId === currentUser?.id);

// 3. ¿El usuario conectado es el creador / solicitante del ticket?
const isTicketCreator = isAdmin || (ticket.usuarioId === currentUser?.id);

// 4. ¿El usuario conectado es responsable del sistema asociado?
// (Validable contra la lista de responsables vigentes del sistema o permiso de rol con fallback defensivo)
const isSystemManager = isAdmin || (
  currentUser?.role === "RESPONSABLE_DE_SISTEMA" &&
  // Si el objeto ticket incluye la relación de responsables o sistemaId validado
  ticket.sistemaId !== undefined
);
```

#### B. Ajuste de Visibilidad de Botones de Acción

1. **Iniciar Atención (`Can resource="atencion" action="create"`):**
   ```tsx
   {isAssignedDev && (ticket.faseCodigo === "ASIGNADO" || (!currentAtencion && !isClosed && !isCancelled)) && (
     <Button onClick={handleStartAtencion}>Iniciar Atención</Button>
   )}
   ```
2. **Registrar Intervención (`Can resource="intervenciones" action="create"`):**
   ```tsx
   {isAssignedDev && currentAtencion && !isClosed && !isCancelled && (
     <Button onClick={() => setIsIntervencionOpen(true)}>Registrar Intervención</Button>
   )}
   ```
3. **Terminar Atención Técnica (`Can resource="resolucion" action="create"`):**
   ```tsx
   {isAssignedDev && currentAtencion && !isResolved && !isClosed && !isCancelled && (
     <Button onClick={() => setIsTerminarOpen(true)}>Terminar Atención</Button>
   )}
   ```
4. **Asignar / Reasignar (`Can resource="asignaciones" action="create"`):**
   ```tsx
   {isSystemManager && !isClosed && !isCancelled && (
     <Button onClick={() => setIsAssignOpen(true)}>
       {activeAsignacion ? "Reasignar Desarrollador" : "Asignar Desarrollador"}
     </Button>
   )}
   ```
5. **Evaluar y Cerrar (`Can resource="evaluacion" action="create"`):**
   ```tsx
   {isSystemManager && isResolved && currentAtencion && (
     <Button onClick={() => setIsEvaluacionOpen(true)}>Evaluar Atención</Button>
   )}
   ```
6. **Reabrir Ticket (`Can resource="reapertura" action="create"`):**
   ```tsx
   {(isSystemManager || isTicketCreator) && (isClosed || isResolved) && (
     <Button onClick={() => setIsReabrirOpen(true)}>Reabrir Ticket</Button>
   )}
   ```

---

### 3.2. Bandeja de Entrada del Dashboard (`src/modules/users/components/RoleInboxWidget.tsx`)

#### Corrección del Filtro de Atenciones Activas (Líneas 31-37)

**Código con error:**
```typescript
// ERROR: Si isDev es true, devuelve cualquier ticket en proceso sin importar la asignación
const devActiveTickets = tickets.filter((t) => {
  const isAssigned = t.asignaciones?.some(
    (a) => !a.fin && a.usuarioId === user?.id,
  );
  const isInProcess = ["ASIGNADO", "EN_PROCESO"].includes(t.faseCodigo || "");
  return (isAssigned || isDev) && isInProcess; // BUG
});
```

**Código corregido:**
```typescript
const devActiveTickets = tickets.filter((t) => {
  const isAssigned = t.asignaciones?.some(
    (a) => !a.fin && a.usuarioId === user?.id,
  );
  const isInProcess = ["ASIGNADO", "EN_PROCESO"].includes(t.faseCodigo || "");
  // Un desarrollador solo debe ver los tickets asignados a él; un admin ve todos los activos
  return (isAdmin ? isInProcess : isAssigned && isInProcess);
});
```

---

### 3.3. Listado General de Tickets (`src/modules/tickets/pages/TicketsPage.tsx`)

Agregar control de pestañas o switch rápido:
- **Pestaña 1: "Mis Asignaciones"** (por defecto para desarrolladores): Filtra tickets donde el usuario activo sea el desarrollador con asignación vigente.
- **Pestaña 2: "Todos los Tickets"**: Grilla global completa con los filtros de sistema, fase y prioridad.
- Enviar el parámetro `usuarioId` al hook `useTicketsQuery({ sistemaId, faseId, usuarioId })` cuando aplique.

---

## 4. Helper Reutilizable de Autorización Contextual

Para evitar duplicar código, se recomienda crear la utilidad:
`src/core/permissions/authGuards.ts`:

```typescript
import type { User } from "@/core/auth/types";
import type { Ticket } from "@/modules/tickets/api/types";

export const canOperateTicket = (user: User | null, ticket: Ticket): boolean => {
  if (!user) return false;
  if (user.role === "ADMINISTRADOR" || user.role === "ADMIN") return true;

  const activeAsignacion = ticket.asignaciones?.find((a) => !a.fin);
  return activeAsignacion?.usuarioId === user.id;
};

export const canManageTicket = (user: User | null, ticket: Ticket): boolean => {
  if (!user) return false;
  if (user.role === "ADMINISTRADOR" || user.role === "ADMIN") return true;

  return user.role === "RESPONSABLE_DE_SISTEMA";
};
```
