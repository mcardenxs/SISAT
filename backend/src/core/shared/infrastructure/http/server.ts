import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { Scalar } from "@scalar/hono-api-reference";
import { openApiSpec } from "@/core/config/swagger";
import { env } from "@/core/config/env";
import { serveStatic } from "hono/bun";
import type { StatusCode } from "hono/utils/http-status";
import { existsSync } from "node:fs";
import path from "node:path";

import { container } from "@/core/shared/infrastructure/di/container";
import { UserRouter } from "@/core/user/infrastructure/http/routes/UserRouter";
import { AuthRouter } from "@/modules/auth/infrastructure/http/routes/AuthRouter";
import { PermissionRouter } from "@/modules/authorization/infrastructure/http/routes/PermissionRouter";

const app = new Hono();

// 1. Middlewares Nativos (Reemplazan a helmet, morgan y cors)
app.use("*", secureHeaders());
app.use("*", cors());
app.use("*", logger());
// Nota: express.json() desaparece. Hono procesa el JSON automáticamente
// cuando llamas a c.req.json() en tus controladores.

// 2. Documentación de la API (Scalar)
app.get("/openapi.json", (c) => c.json(openApiSpec));
app.get("/api-docs.json", (c) => c.json(openApiSpec));
app.get(
	"/docs",
	Scalar({
		url: "/openapi.json",
		pageTitle: "SISAT API Reference",

		theme: "purple",
	}),
);
app.get("/api-docs", (c) => c.redirect("/docs"));

// 3. Resolución de dependencias (TSyringe sigue intacto)
const userRouter = container.resolve(UserRouter);
const authRouter = container.resolve(AuthRouter);
const permissionRouter = container.resolve(PermissionRouter);

// 4. Registro de rutas
// En Hono se usa .route() en lugar de .use() para anidar otros routers
app.route("/api/user", userRouter.router);
app.route("/api/users", userRouter.router);
app.route("/api/auth", authRouter.router);
app.route("/api/permissions", permissionRouter.router);

// 5. Global Error Handler
app.onError((err, c) => {
	console.error(err);

	let status: StatusCode = 500;
	if (
		typeof err === "object" &&
		err !== null &&
		"status" in err &&
		typeof (err as { status: unknown }).status === "number"
	) {
		const parsedStatus = (err as { status: number }).status;
		if (parsedStatus >= 400 && parsedStatus <= 599) {
			status = parsedStatus as StatusCode;
		}
	}

	return c.json({ error: err.message || "Internal Server Error" }, status);
});

// 6. Servir Frontend en Producción (SPA)
const frontendDistPath = existsSync(
	path.resolve(process.cwd(), "frontend/dist"),
)
	? path.resolve(process.cwd(), "frontend/dist")
	: path.resolve(process.cwd(), "../frontend/dist");

if (
	(env.NODE_ENV === "prod" || process.env.SERVE_FRONTEND === "true") &&
	existsSync(frontendDistPath)
) {
	const relativeDist = path.relative(process.cwd(), frontendDistPath);

	// Servir archivos estáticos generados por Vite (assets, imágenes, etc.)
	app.use("/*", serveStatic({ root: relativeDist }));

	// Fallback para navegación SPA en rutas cliente
	app.get("*", async (c) => {
		const reqPath = c.req.path;
		if (
			reqPath.startsWith("/api") ||
			reqPath.startsWith("/docs") ||
			reqPath.startsWith("/openapi") ||
			reqPath.startsWith("/api-docs")
		) {
			return c.notFound();
		}

		const indexPath = path.join(frontendDistPath, "index.html");
		if (existsSync(indexPath)) {
			return new Response(Bun.file(indexPath), {
				headers: {
					"Content-Type": "text/html; charset=utf-8",
				},
			});
		}

		return c.notFound();
	});
}

export { app };
