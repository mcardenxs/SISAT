# SISAT (Sistema Integral de Soporte y Atención Técnica)

Monorepo fullstack con arquitectura hexagonal en el backend y arquitectura modular basada en características en el frontend, diseñado para la gestión integral de incidencias, tickets de soporte técnico, ciclos de atención, evidencias y actas semanales de entrega-recepción para sistemas institucionales.

- **Backend:** Hono + Bun + TypeScript + Prisma 7 + TSyringe (Inyección de Dependencias) + MariaDB 11.8.
- **Frontend:** React 19 + Vite + TypeScript + TanStack Suite (Query, Router, Form) + Tailwind CSS v4 + Biome.
- **Base de Datos:** MariaDB 11.8 con integridad relacional estricta, triggers de auditoría y procedimientos almacenados (`sisat_reasignar_ticket`).
- **Gestión de paquetes:** **pnpm** como único gestor (`pnpm-lock.yaml`).

---

## Características Principales

1. **Autenticación y Control de Acceso (RBAC):**
   - JWT con rotación y persistencia de Refresh Tokens.
   - 5 roles institucionales: `ADMINISTRADOR`, `RESPONSABLE_DE_SISTEMA`, `DESARROLLADOR`, `JEFE_DE_AREA` y `CONSULTA`.
2. **Organización y Catálogos:**
   - Gestión de áreas institucionales y catálogos normalizados (`estado`, `fase`, `constancia`, `situacion`, `prioridad`, `solicitud`, `rol`, `clase`).
   - CRUD de sistemas institucionales con asignación de Responsables (con validación de responsable principal único) y Desarrolladores asignados.
3. **Flujo de Tickets de Soporte:**
   - Generación automática de folios correlativos (`TIC-YYYYMM-XXXX`).
   - Asignación y reasignación de tickets con auditoría histórica y procedimiento almacenado (`sisat_reasignar_ticket`).
   - Ciclos consecutivos de atención (`atencion`), bitácora de intervenciones con cálculo de minutos (`intervencion`), y gestión de evidencias técnicas (`evidencia`).
   - Finalización formal con diagnóstico y solución técnica (`termino`), evaluación por estrellas de 1 a 5 (`evaluacion`), cierre formal (`cierre`) y reapertura controlada (`reapertura`).
4. **Actas Semanales de Entrega-Recepción:**
   - Agrupación periódica de soporte semanal con validación de periodo estricto de 7 días (`DATEDIFF(act_fin, act_inicio) = 6`).
   - Inclusión automática con snapshot histórico en JSON de participantes y evidencias.
   - Carga y validación de actas firmadas por Jefaturas de Área (`archivo`).
5. **Frontend Modular y Reactivo:**
   - Dashboards, tablas reactivas, badges de estado en tiempo real y modales interactivos para registro de tickets y generación de actas.

---

## Credenciales por Defecto

Para acceder al sistema en el entorno de desarrollo local:

* **URL Frontend:** `http://localhost:5173`
* **API / Backend:** `http://localhost:3000`
* **Documentación Interactiva (Scalar):** `http://localhost:3000/docs`
* **Correo:** `admin@sisat.local`
* **Contraseña:** `Admin123456!`
* **Roles asignados:** `ADMINISTRADOR`, `RESPONSABLE_DE_SISTEMA`, `DESARROLLADOR`, `JEFE_DE_AREA`.

---

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Monorepo & Package Manager** | [pnpm](https://pnpm.io/) (workspaces) |
| **Backend Runtime** | [Bun](https://bun.sh/) |
| **Framework HTTP Backend** | [Hono](https://hono.dev/) |
| **Base de Datos** | [MariaDB 11.8](https://mariadb.org/) |
| **Driver Adapter & ORM** | [Prisma v7](https://www.prisma.io/) + `@prisma/adapter-mariadb` |
| **Inyección de Dependencias** | [TSyringe](https://github.com/microsoft/tsyringe) |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Enrutamiento** | [TanStack Router](https://tanstack.com/router) (File-based routing tipado) |
| **Gestión de Estado y Cache** | [TanStack Query v5](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs/) |
| **Estilos & UI** | [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) + [Sonner](https://sonner.emilkowal.ski/) |
| **Linter / Formatter** | [Biome](https://biomejs.dev/) |

---

## Estructura del Proyecto

```text
├── package.json / pnpm-workspace.yaml / biome.json
├── docker-compose.yml              # Contenedores para MariaDB 11.8, Backend y Frontend
├── sisat.sql                       # Esquema canónico DDL con triggers y stored procedures
├── backend/
│   ├── prisma/
│   │   └── schema.prisma           # Modelos mapeados con adaptador MariaDB
│   └── src/
│       ├── core/                   # Configuraciones de Prisma, servidor Hono, contenedor TSyringe
│       └── modules/
│           ├── auth/               # Autenticación JWT y Refresh Tokens
│           ├── authorization/      # Resolución de permisos y roles RBAC
│           ├── catalogos/          # Catálogos del sistema
│           ├── organizacion/       # Áreas institucionales
│           ├── sistemas/           # Sistemas, Responsables y Desarrolladores
│           ├── tickets/            # Flujo completo de tickets, atención y cierre
│           └── actas/              # Generación de actas e inclusiones
└── frontend/
    └── src/
        ├── core/                   # Axios client, auth store, componentes UI (Modal, Button, Input)
        ├── modules/
        │   ├── auth/               # Formularios de Login y Registro
        │   ├── users/              # Gestión de usuarios y perfil
        │   ├── sistemas/           # Vista de Sistemas Institucionales
        │   ├── organizacion/       # Vista de Áreas
        │   ├── tickets/            # Vista y Modal de Tickets
        │   └── actas/              # Vista y Modal de Actas
        └── routes/                 # Árbol de rutas tipadas TanStack Router
```

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v11+
- [Bun](https://bun.sh/) v1.0+
- [Docker](https://www.docker.com/) o [Colima](https://github.com/abiosoft/colima) (para MariaDB 11.8)

---

## Guía de Instalación y Ejecución

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone git@github.com:mcardenxs/SISAT.git
cd SISAT
pnpm install
```

> **Importante:** Usar exclusivamente `pnpm install`. No ejecutar `bun install` ni `npm install`.

### 2. Iniciar la Base de Datos con Docker

```bash
docker compose up -d database
```

Esto levantará el contenedor `sisat_mariadb` en el puerto `3306` ejecutando automáticamente el script `sisat.sql`.

### 3. Variables de Entorno

Crear el archivo `.env` en la raíz de `backend/`:

```bash
cp backend/.env.example backend/.env
```

Configurar los parámetros de conexión:
```env
DATABASE_URL="mariadb://sisat:sisat_local_password@localhost:3306/sisat"
JWT_SECRET="sisat_super_secret_jwt_key"
PORT=3000
NODE_ENV=dev
```

### 4. Generar Cliente de Prisma

```bash
pnpm db:generate
```

### 5. Iniciar en Modo Desarrollo

Para ejecutar backend y frontend simultáneamente:

```bash
pnpm dev
```

O si deseas ejecutarlos en terminales independientes:

```bash
# Terminal 1: Backend con Hono + Bun (puerto 3000 con recarga en caliente)
pnpm dev:backend

# Terminal 2: Frontend con Vite (puerto 5173 con HMR)
pnpm dev:frontend
```

---

## Comandos Útiles

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia Backend y Frontend en paralelo. |
| `pnpm build:frontend` | Compila y valida el tipado del Frontend para producción. |
| `pnpm lint` | Analiza el código con Biome. |
| `pnpm format:fix` | Aplica corrección y formato de código automático con Biome. |
| `pnpm test:backend` | Ejecuta las pruebas unitarias e integrales del Backend. |
| `pnpm db:pull` | Actualiza `schema.prisma` a partir de la base de datos MariaDB. |
| `pnpm db:generate` | Regenera los tipos y cliente de Prisma Client. |

---

## Licencia

Este proyecto está bajo la Licencia MIT.
