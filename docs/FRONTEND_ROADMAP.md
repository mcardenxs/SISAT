# Especificación de Requerimientos y Hoja de Ruta del Frontend (SISAT)

Este documento detalla el diagnóstico exhaustivo de la discrepancia entre las capacidades ya desarrolladas en el **Backend (Bun + Hono + Prisma + TSyringe)** y el estado actual del **Frontend (Vite + React 19 + TanStack Suite + Tailwind v4)**. Incluye el catálogo completo de vistas, componentes, formularios, contratos de API y flujos de trabajo pendientes de implementación.

---

## 1. Diagnóstico General y Resumen Ejecutivo

| Área / Módulo | Estado en Backend | Estado en Frontend | Nivel de Brecha |
| :--- | :--- | :--- | :--- |
| **Tickets de Soporte** | 100% (Ciclo de 5 fases, asignaciones, atenciones, intervenciones, evidencias, evaluación, cierre y reapertura) | 20% (Solo grilla básica de cards y modal básico de alta) | **Crítica** |
| **Sistemas** | 100% (CRUD, vinculación de responsables y desarrolladores con vigencia histórica) | 25% (Cards estáticas de solo lectura con contadores) | **Alta** |
| **Actas Semanales** | 100% (Validación $DATEDIFF=6$, agregación de atenciones, carga de acta firmada y anexos) | 25% (Cards estáticas y modal básico de creación) | **Alta** |
| **Áreas** | 100% (Listar, obtener detalle, crear y actualizar estado/nombre) | 30% (Cards de solo lectura) | **Media** |
| **Usuarios** | 100% (Listado paginado, búsqueda, creación, actualización y eliminación) | 35% (Tabla paginada con buscador simple y tarjeta de perfil propio) | **Media** |
| **Autorización / RBAC** | 100% (Motor dinámico de permisos por recurso/acción, roles del sistema) | 0% (Sin vistas, sin matriz de permisos y sin directivas condicionales de UI) | **Alta** |
| **Dashboard** | 100% (Datos disponibles a través de los diferentes endpoints) | 20% (Métricas de plantilla fijas y conteo básico de usuarios) | **Media** |

---

## 2. Matriz de Endpoints Backend vs Implementación Frontend

```text
Backend Endpoint                                   Método   Existe en Frontend API   Tiene Vista / UI
------------------------------------------------------------------------------------------------------
/api/auth/login                                    POST     ✅ Sí                     ✅ Sí
/api/auth/register                                 POST     ✅ Sí                     ✅ Sí
/api/auth/refresh                                  POST     ✅ Sí (interceptor)       N/A (automático)
/api/auth/logout                                   POST     ✅ Sí                     ✅ Sí
/api/auth/me                                       GET      ✅ Sí                     ✅ Sí
/api/users                                         GET      ✅ Sí                     ✅ Sí
/api/users/:id                                     GET      ❌ No                     ❌ No
/api/users                                         POST     ❌ No                     ❌ No
/api/users/:id                                     PUT      ❌ No                     ❌ No
/api/users/:id                                     DELETE   ❌ No                     ❌ No
/api/permissions                                   GET      ❌ No                     ❌ No
/api/permissions/:id                               GET      ❌ No                     ❌ No
/api/permissions                                   POST     ❌ No                     ❌ No
/api/permissions/:id                               PUT      ❌ No                     ❌ No
/api/permissions/:id                               DELETE   ❌ No                     ❌ No
/api/permissions/users/:userId                     GET      ❌ No                     ❌ No
/api/catalogos                                     GET      ✅ Sí                     ✅ Sí (selects)
/api/catalogos/:catalogo                           GET      ✅ Sí                     ❌ No
/api/areas                                         GET      ✅ Sí                     ✅ Sí
/api/areas/:id                                     GET      ❌ No                     ❌ No
/api/areas                                         POST     ❌ No                     ❌ No
/api/areas/:id                                     PATCH    ❌ No                     ❌ No
/api/sistemas                                      GET      ✅ Sí                     ✅ Sí
/api/sistemas/:id                                  GET      ✅ Sí                     ❌ No
/api/sistemas                                      POST     ✅ Sí                     ❌ No
/api/sistemas/:id                                  PATCH    ❌ No                     ❌ No
/api/sistemas/:id/responsables                     POST     ❌ No                     ❌ No
/api/sistemas/responsables/:id/finalizar           PATCH    ❌ No                     ❌ No
/api/sistemas/:id/desarrolladores                  POST     ❌ No                     ❌ No
/api/sistemas/desarrolladores/:id/finalizar        PATCH    ❌ No                     ❌ No
/api/tickets                                       GET      ✅ Sí                     ✅ Sí
/api/tickets/:id                                   GET      ✅ Sí                     ❌ No
/api/tickets                                       POST     ✅ Sí                     ✅ Sí
/api/tickets/:id/asignaciones                      POST     ❌ No                     ❌ No
/api/tickets/:id/reasignaciones                    POST     ❌ No                     ❌ No
/api/tickets/:id/atenciones                        POST     ❌ No                     ❌ No
/api/tickets/atenciones/:id/intervenciones         POST     ❌ No                     ❌ No
/api/tickets/:id/evidencias                        POST     ❌ No                     ❌ No
/api/tickets/atenciones/:id/terminar               POST     ❌ No                     ❌ No
/api/tickets/:id/atenciones/:id/evaluacion         POST     ❌ No                     ❌ No
/api/tickets/:id/atenciones/:id/cierre             POST     ❌ No                     ❌ No
/api/tickets/:id/reapertura                        POST     ❌ No                     ❌ No
/api/actas                                         GET      ✅ Sí                     ✅ Sí
/api/actas/:id                                     GET      ✅ Sí                     ❌ No
/api/actas                                         POST     ✅ Sí                     ✅ Sí
/api/actas/:id/archivos                            POST     ❌ No                     ❌ No
```

---

## 3. Módulo 1: Tickets de Soporte (`/tickets`)

### 3.1. Flujo de Estados del Negocio

```text
[1. REGISTRADO]
       │
       ▼ (Responsable del Sistema asigna desarrollador)
[2. ASIGNADO]
       │
       ▼ (Desarrollador asignado inicia atención)
[3. EN PROCESO] ── (Registra intervenciones de tiempo y adjunta evidencias)
       │
       ▼ (Desarrollador termina con diagnóstico y solución)
[4. RESUELTO_POR_DESARROLLO]
       │
       ├──► (Responsable evalúa con éxito y cierra) ──► [5. CERRADO_POR_RESPONSABLE]
       │
       └──► (Inconformidad o persistencia de falla) ──► [REAPERTURA: Nuevo Ciclo] ──► [1. REGISTRADO]
```

### 3.2. Vistas Requeridas

1. **Listado Principal con Filtros (`src/routes/_authenticated/tickets/index.tsx`)**:
   - Barra de filtros: Selector de Sistema, Selector de Fase (`REGISTRADO`, `ASIGNADO`, `EN_PROCESO`, `RESUELTO_POR_DESARROLLO`, `CERRADO_POR_RESPONSABLE`), Selector de Prioridad, Selector de Solicitud y buscador por Folio (`TIC-...`).
   - Vista conmutable entre Modo Cuadrícula (Cards) y Modo Tabla (TanStack Table).
   - Indicador visual rápido del tiempo transcurrido desde el registro.

2. **Vista de Detalle Operativo (`src/routes/_authenticated/tickets/$ticketId.tsx`)**:
   - **Encabezado:** Folio en monoespaciado, Título, Badge de Fase con color semántico, Prioridad, Sistema, Área solicitante y Solicitante.
   - **Stepper de Progreso:** Indicador visual de en qué fase se encuentra el ticket.
   - **Bloque de Acciones según Rol:**
     - Botón *Asignar / Reasignar* (Visible para Responsable de Sistema / Admin).
     - Botón *Iniciar Atención* (Visible para el Desarrollador asignado cuando está en `ASIGNADO`).
     - Botón *Registrar Intervención* (Para sumar minutos de trabajo en la bitácora técnica).
     - Botón *Adjuntar Evidencia* (Carga de logs, capturas o archivos de apoyo).
     - Botón *Terminar Atención* (Para entregar diagnóstico y solución).
     - Botón *Evaluar y Cerrar* (Para el Responsable del Sistema tras revisar la solución).
     - Botón *Reabrir Ticket* (En caso de inconformidad).
   - **Pestaña 1: Ciclo de Atención Actual:**
     - Diagnóstico, Solución, Módulos afectados, Modificaciones a BD.
     - Bitácora de Intervenciones: listado cronológico de tiempos invertidos con nombre del desarrollador y descripción.
     - Evidencias: galería o lista de archivos adjuntos clasificados por tipo.
   - **Pestaña 2: Historial de Ciclos:**
     - Si el ticket ha sido reabierto, ver el detalle de los ciclos anteriores (Ciclo 1, Ciclo 2, etc.).
   - **Pestaña 3: Trazabilidad y Asignaciones:**
     - Historial de desarrolladores asignados y reasignaciones con su motivo.
     - Bitácora de transiciones de fase (quién cambió la fase, fecha y comentarios).

### 3.3. Componentes y Modales a Crear
- `AssignTicketModal.tsx`: Permite seleccionar el desarrollador del sistema, marcar si es principal y, en caso de reasignación, capturar obligatoriamente el motivo.
- `IntervencionFormModal.tsx`: Formulario con minutos empleados, descripción de actividades y flag de visibilidad interna.
- `UploadEvidenciaModal.tsx`: Formulario para registrar URL/archivo de evidencia, seleccionando la clase correspondiente (captura, log, script, etc.).
- `TerminarAtencionModal.tsx`: Formulario con validación Zod que exige diagnóstico técnico, solución aplicada, módulos modificados y cambios en datos.
- `EvaluacionAtencionModal.tsx`: Calificación (1 al 5), checkbox de confirmación y texto de conformidad o inconformidad.
- `ReabrirTicketModal.tsx`: Captura del motivo de reapertura y evidencias de reincidencia.
- `CierreTicketModal.tsx`: Comentario final de cierre formal.

---

## 4. Módulo 2: Sistemas Institucionales (`/sistemas`)

### 4.1. Vistas Requeridas

1. **Listado de Sistemas (`src/routes/_authenticated/sistemas/index.tsx`)**:
   - Mantener la grilla informativa enriqueciéndola con acciones rápidas.
   - Botón superior "Registrar Nuevo Sistema".
   - Acceso al detalle mediante click en la tarjeta.

2. **Vista de Detalle del Sistema (`src/routes/_authenticated/sistemas/$sistemaId.tsx`)**:
   - **Ficha Técnica:** Clave única, nombre oficial, descripción, área dueña del software, URL de acceso público/privado, observaciones y estado.
   - **Pestaña de Responsables:**
     - Tarjeta destacada con el Responsable Principal vigente.
     - Tabla de responsables secundarios vigentes.
     - Botón "Nombrar Responsable" (`POST /sistemas/:id/responsables`).
     - Historial de ex-responsables con fecha de inicio y término.
     - Botón "Dar de Baja / Finalizar Vigencia" (`PATCH /sistemas/responsables/:id/finalizar`).
   - **Pestaña de Desarrolladores:**
     - Lista del equipo de desarrollo asignado al sistema.
     - Botón "Asignar Desarrollador" (`POST /sistemas/:id/desarrolladores`).
     - Botón "Finalizar Asignación" (`PATCH /sistemas/desarrolladores/:id/finalizar`).
   - **Pestaña de Tickets Vinculados:**
     - Listado de tickets generados específicamente para este sistema con métricas de resolución.

### 4.2. Componentes y Modales a Crear
- `CreateSistemaModal.tsx`: Formulario para alta de sistema (clave, nombre, áreaId, url, descripción, observación).
- `EditSistemaModal.tsx`: Actualización de datos descriptivos y estado operativo.
- `AssignResponsableModal.tsx`: Selector de usuario, fecha de inicio y switch de Responsable Principal.
- `AssignDesarrolladorModal.tsx`: Selector de usuario desarrollador y fecha de incorporación.
- `EndVigenciaConfirmModal.tsx`: Cuadro de diálogo defensivo para registrar la fecha de fin de asignación.

---

## 5. Módulo 3: Actas Semanales de Entrega-Recepción (`/actas`)

### 5.1. Reglas de Negocio del Backend
- El acta agrupa atenciones técnicas terminadas en un periodo estricto de 7 días naturales ($DATEDIFF = 6$).
- El firmante se vincula automáticamente tomando al responsable o jefatura del área.
- Estados del Acta:
  - `GENERADA`: Creada por el sistema, lista para revisión.
  - `EN_FIRMA`: Lista para impresión y recolección de firmas físicas/electrónicas.
  - `CARGADA`: Documento final firmado adjunto en PDF en el repositorio de archivos.

### 5.2. Vistas Requeridas

1. **Listado de Actas (`src/routes/_authenticated/actas/index.tsx`)**:
   - Filtros por Sistema, Área y Situación (`GENERADA`, `EN_FIRMA`, `CARGADA`).
   - Cards/Tabla con Folio (`ACT-YYYY-XXXX`), periodo, total de tickets cubiertos y estado.

2. **Vista de Detalle y Emisión de Acta (`src/routes/_authenticated/actas/$actaId.tsx`)**:
   - **Encabezado Institucional:** Folio formal, periodo semanal, sistema involucrado, área y nombre del firmante responsable.
   - **Tabla de Inclusiones Semanales:**
     - Tabla detallada con cada ticket incluido: Folio, ciclo atendido, problema reportado, solución implementada, desarrolladores intervinientes y calificación del usuario.
   - **Módulo de Archivos Adjuntos:**
     - Listado de documentos cargados (Acta firmada, Anexos técnicos).
     - Botón "Subir Acta Firmada (PDF)" (`POST /actas/:id/archivos`).
   - **Modo de Impresión / Exportación:**
     - Vista con formato estandarizado para imprimir en papel o guardar como PDF con espacios designados para las firmas:
       1. Firma de Jefatura de Área Solicitante.
       2. Firma del Responsable del Sistema.
       3. Firma del Coordinador de Desarrollo.

### 5.3. Componentes y Modales a Crear
- `UploadArchivoActaModal.tsx`: Formulario para subir archivo PDF (nombre, clase de documento, ruta/archivo, observaciones).
- `ActaPrintableTemplate.tsx`: Componente diseñado específicamente con directivas CSS `@media print` para generar actas oficiales con membrete institucional.

---

## 6. Módulo 4: Áreas Organizacionales (`/areas`)

### 6.1. Vistas Requeridas
- **Listado y Administración (`src/routes/_authenticated/areas/index.tsx`)**:
  - Agregar botón "Nueva Área Institucional".
  - En cada tarjeta de área: botones de acción para editar datos o cambiar estado (Activo/Inactivo).
  - Contador de sistemas adscritos al área y número de usuarios pertenecientes.

### 6.2. Componentes y Modales a Crear
- `CreateAreaModal.tsx`: Formulario con nombre y descripción.
- `EditAreaModal.tsx`: Modificación de nombre, descripción y estado (`estadoId`).

---

## 7. Módulo 5: Usuarios, Roles y Permisos (RBAC)

### 7.1. Roles Reconocidos en el Sistema
1. `ADMINISTRADOR`: Control total del sistema (`* : *`).
2. `RESPONSABLE_DE_SISTEMA`: Asignación y reasignación de tickets, evaluación y cierre, consulta de actas y métricas.
3. `DESARROLLADOR`: Atención técnica de tickets asignados, bitácora de intervenciones, carga de evidencias y entrega de soluciones.
4. `JEFE_DE_AREA`: Creación de tickets de su departamento, consulta de actas y firma de entrega-recepción.
5. `CONSULTA`: Solo lectura y seguimiento de tickets.

### 7.2. Vistas Requeridas

1. **Gestión de Usuarios (`src/routes/_authenticated/users.tsx`)**:
   - Incorporar botón "Crear Usuario".
   - En la tabla de usuarios: columna de acciones con botón "Editar" y botón "Eliminar".
   - Botón para ver los "Permisos Efectivos" del usuario.

2. **Matriz de Permisos (`src/routes/_authenticated/permissions/index.tsx`)**:
   - Vista administrativa donde se visualicen los recursos del sistema (`tickets`, `sistemas`, `actas`, `areas`, `users`, `permissions`) y las acciones (`create`, `read`, `update`, `delete`, `firmar`).
   - Matriz de permisos heredados por cada rol.

3. **Guardián de Permisos en el Frontend (Control de Acceso en UI)**:
   - Crear el custom hook `usePermission(resource, action)` que consulte los permisos del usuario en sesión.
   - Crear el componente wrapper `<Can resource="tickets" action="create"> ... </Can>` para ocultar botones no permitidos (ej. un usuario con rol `CONSULTA` no debe ver botones de "Crear Ticket", "Asignar" o "Finalizar Atención").
   - Ajustar `MainLayout.tsx` para ocultar opciones del menú según permisos.

---

## 8. Módulo 6: Dashboard Operativo (`/dashboard`)

### 8.1. Requerimientos
Reemplazar las métricas dummy de Vite/Bun por widgets con datos reales calculados mediante consultas de TanStack Query:
- **Resumen Cuantitativo:**
  - Tickets Registrados sin asignar.
  - Tickets En Atención activa.
  - Tickets Resueltos pendientes de evaluación del responsable.
  - Actas Semanales pendientes de firma.
- **Bandeja de Entrada Personalizada por Rol:**
  - Si el usuario es **Desarrollador:** Widget "Mis atenciones técnicas activas" (acceso directo a registrar tiempo o entregar solución).
  - Si el usuario es **Responsable de Sistema:** Widget "Tickets pendientes de asignar técnico" y "Soluciones por validar".
  - Si el usuario es **Jefe de Área:** Widget "Actas semanales de mi área listas para firma".
- **Accesos Rápidos:** "Registrar Ticket de Incidencia" y "Emitir Acta Semanal".

---

## 9. Estructura de Archivos Recomendada para el Frontend

```text
frontend/src/
├── core/
│   ├── api/
│   │   ├── client.ts
│   │   ├── types.ts
│   │   └── catalogoApi.ts
│   ├── auth/
│   │   ├── store.ts
│   │   └── types.ts
│   ├── permissions/                         # [NUEVO] Motor de permisos en cliente
│   │   ├── usePermission.ts                 # Hook para comprobar permisos
│   │   └── Can.tsx                          # Componente render condicional
│   └── components/
│       ├── layout/
│       └── ui/
│
├── modules/
│   ├── tickets/
│   │   ├── api/
│   │   │   └── ticketApi.ts                 # Ampliar con los 10 endpoints de mutación
│   │   ├── components/
│   │   │   ├── CreateTicketModal.tsx        # Existente
│   │   │   ├── AssignTicketModal.tsx        # [NUEVO]
│   │   │   ├── IntervencionFormModal.tsx    # [NUEVO]
│   │   │   ├── UploadEvidenciaModal.tsx     # [NUEVO]
│   │   │   ├── TerminarAtencionModal.tsx    # [NUEVO]
│   │   │   ├── EvaluacionAtencionModal.tsx  # [NUEVO]
│   │   │   ├── ReabrirTicketModal.tsx       # [NUEVO]
│   │   │   ├── TicketTimeline.tsx           # [NUEVO] Trazabilidad de fases
│   │   │   └── TicketFilters.tsx            # [NUEVO]
│   │   ├── hooks/
│   │   │   ├── useTicketsQuery.ts           # [NUEVO]
│   │   │   └── useTicketMutations.ts        # [NUEVO]
│   │   └── pages/
│   │       ├── TicketsPage.tsx              # Existente (mejorar)
│   │       └── TicketDetailPage.tsx         # [NUEVO] Vista central operativa
│   │
│   ├── sistemas/
│   │   ├── api/
│   │   │   └── sistemaApi.ts                # Ampliar con asignaciones y bajas
│   │   ├── components/
│   │   │   ├── CreateSistemaModal.tsx       # [NUEVO]
│   │   │   ├── EditSistemaModal.tsx         # [NUEVO]
│   │   │   ├── AssignResponsableModal.tsx   # [NUEVO]
│   │   │   └── AssignDesarrolladorModal.tsx # [NUEVO]
│   │   └── pages/
│   │       ├── SistemasPage.tsx             # Existente
│   │       └── SistemaDetailPage.tsx        # [NUEVO]
│   │
│   ├── actas/
│   │   ├── api/
│   │   │   └── actaApi.ts                   # Ampliar con carga de archivos
│   │   ├── components/
│   │   │   ├── CreateActaModal.tsx          # Existente
│   │   │   ├── UploadArchivoActaModal.tsx   # [NUEVO]
│   │   │   └── ActaPrintableTemplate.tsx    # [NUEVO]
│   │   └── pages/
│   │       ├── ActasPage.tsx                # Existente
│   │       └── ActaDetailPage.tsx           # [NUEVO]
│   │
│   ├── organizacion/
│   │   ├── api/
│   │   │   └── areaApi.ts                   # Ampliar con create y patch
│   │   ├── components/
│   │   │   ├── CreateAreaModal.tsx          # [NUEVO]
│   │   │   └── EditAreaModal.tsx            # [NUEVO]
│   │   └── pages/
│   │       └── AreasPage.tsx                # Existente
│   │
│   └── users/
│       ├── api/
│       │   └── usersApi.ts                  # Ampliar con create, update, delete
│       ├── components/
│       │   ├── CreateUserModal.tsx          # [NUEVO]
│       │   └── EditUserModal.tsx            # [NUEVO]
│       └── pages/
│           ├── UsersPage.tsx                # Existente
│           ├── DashboardPage.tsx            # Rediseñar con KPIs reales
│           └── ProfilePage.tsx              # Existente
│
└── routes/
    └── _authenticated/
        ├── tickets/
        │   ├── index.tsx                    # /tickets
        │   └── $ticketId.tsx                # [NUEVO] /tickets/:id
        ├── sistemas/
        │   ├── index.tsx                    # /sistemas
        │   └── $sistemaId.tsx               # [NUEVO] /sistemas/:id
        ├── actas/
        │   ├── index.tsx                    # /actas
        │   └── $actaId.tsx                  # [NUEVO] /actas/:id
        ├── areas/
        │   └── index.tsx                    # /areas
        ├── permissions/
        │   └── index.tsx                    # [NUEVO] /permissions
        ├── dashboard.tsx                    # /dashboard
        ├── users.tsx                        # /users
        └── profile.tsx                      # /profile
```

---

## 10. Hoja de Ruta de Ejecución Recomendada

Para implementar estos requerimientos con cero fricción, se establece el siguiente orden por sprints de desarrollo:

### Fase 1: Flujo Operativo de Tickets (Prioridad 1)
1. Extender `ticketApi.ts` con todos los endpoints de mutación ya disponibles en el backend.
2. Crear la ruta y vista `src/routes/_authenticated/tickets/$ticketId.tsx`.
3. Desarrollar los modales del ciclo de vida: Asignación, Inicio de Atención, Registro de Intervenciones, Carga de Evidencias, Finalización con Diagnóstico/Solución, Evaluación con Conformidad, Cierre y Reapertura.

### Fase 2: Gestión de Sistemas y Equipos Humanos (Prioridad 2)
1. Extender `sistemaApi.ts` para soportar nombramiento y finalización de responsables y desarrolladores.
2. Crear la ruta y vista `src/routes/_authenticated/sistemas/$sistemaId.tsx`.
3. Desarrollar modales para alta de sistema, asignación de responsable principal y asignación de equipo de desarrolladores.

### Fase 3: Detalle de Actas Semanales y Carga de Firma (Prioridad 3)
1. Extender `actaApi.ts` para soportar carga de archivos firmados y consulta de detalle.
2. Crear la ruta `src/routes/_authenticated/actas/$actaId.tsx`.
3. Diseñar la tabla de tickets incluidos y la plantilla imprimible para recolección de firmas.
4. Modal para subir el documento PDF firmado.

### Fase 4: Administración de Áreas, Usuarios y RBAC (Prioridad 4)
1. Extender `areaApi.ts` y `usersApi.ts` con operaciones de creación, modificación y baja.
2. Crear `CreateAreaModal`, `EditAreaModal`, `CreateUserModal`, `EditUserModal`.
3. Implementar el motor de control de acceso en frontend: `usePermission()` y componente `<Can>`.
4. Crear la vista `/permissions` para consulta de matriz de roles y permisos.

### Fase 5: Dashboard Operativo con Métricas Vivas (Prioridad 5)
1. Reemplazar tarjetas estáticas con KPIs reales de tickets por fase, actas pendientes y sistemas activos.
2. Implementar bandejas de trabajo personalizadas según el rol del usuario conectado.
