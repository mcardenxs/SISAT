# Reglas del Backend (Hexacore)

> Parte del monorepo Hexacore. Para reglas de workspaces, instalación y lint ver `../AGENTS.md`.

## Operación en el monorepo

- **Instalar:** siempre con pnpm desde la raíz y versión exacta: `pnpm add -E <paquete> --filter backend`. Prohibido `bun install` / `bun add`.
- **Ejecutar:** siempre con Bun desde este workspace: `pnpm --filter backend dev`, `pnpm --filter backend test`, `bun scripts/create-admin.ts`, `bun prisma/seed.ts`.
- **Lint:** no hay Biome local; se lintea desde la raíz con `pnpm lint` / `pnpm lint:fix`.
- Todas las rutas de este archivo son relativas a `backend/` (`src/`, `prisma/`, `docs/`, `scripts/`).

## Stack

- **Runtime:** Bun (solo ejecución, nunca instalación)
- **Framework:** Hono
- **DB:** Solo Prisma v7 con MariaDB / MySQL (pinnado a `7.x`, prohibido v8)
- **Idioma de respuesta:** Español

## Dependencias

Antes de instalar cualquier paquete, revisar `package.json` para confirmar si ya existe.

## Arquitectura

- `src/` — todo el código
- `src/core/` — base general, utilidades compartidas, configuración y módulos de dominio transversales (ej. `src/core/user`)
- `src/modules/<nombre>/{domain,application,infrastructure}` — módulos de características delimitadas (ej. `auth`, `authorization`)
- `/docs` — guías detalladas (p.ej., cómo crear un módulo completo, guía de testing y autenticación)

## Capas

### Domain

Interfaces, errores (extendiendo `BaseError`) y modelos. Sin dependencias de frameworks.

### Application

- Método principal de Use Cases: `run` (nunca `execute`)
- Prohibido devolver entidades de dominio hacia HTTP. Usar Mappers y DTOs

### Infrastructure — HTTP

Todo en `infrastructure/http/`: Rutas, Controladores, Middlewares, Schemas.

**Controladores** — uno por caso de uso en `http/controllers/`:

- Heredan de `BaseController`, usan `this.executeSafely(c, async () => { ... })`
- Método: `run = async (c: Context): Promise<Response>` (Hono usa `Context`, nunca `req, res`)

**Rutas** — clases en `http/routes/` decoradas con `@injectable()`:

- Inyectar controladores y middlewares por constructor
- `public readonly router: Hono = new Hono()` interno (nunca `Router()` de Express)
- Registro de endpoints: `this.router.get("/", this.ctrl.run)` o `this.router.post("/", middleware.handle(...), this.ctrl.run)`
- Prohibido usar `container.resolve()` en la declaración de rutas
- Montaje en el servidor: `src/core/shared/infrastructure/http/server.ts` con `app.route("/api/...", router.router)`

## Inyección de dependencias (TSyringe)

- `@injectable()` obligatorio en: Casos de Uso, Controladores, Repos, Mappers
- Prohibido instanciar con `new` en código productivo (permitido solo en tests unitarios para aislamiento)
- Interfaces: registrar en `src/core/shared/infrastructure/di/container.ts` e inyectar con `@inject("TokenName")`
- `import type` → Interfaces, DTOs, Tipos inyectados vía `@inject`
- `import` regular → Clases inyectadas directamente (ej: Controladores en Rutas)
