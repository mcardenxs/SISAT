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
import { CatalogoRouter } from "@/modules/catalogos/infrastructure/http/routes/CatalogoRouter";
import { AreaRouter } from "@/modules/organizacion/infrastructure/http/routes/AreaRouter";
import { SistemaRouter } from "@/modules/sistemas/infrastructure/http/routes/SistemaRouter";
import { TicketRouter } from "@/modules/tickets/infrastructure/http/routes/TicketRouter";
import { ActaRouter } from "@/modules/actas/infrastructure/http/routes/ActaRouter";
import { UploadController } from "./UploadController";
import { DashboardController } from "@/modules/tickets/infrastructure/http/controllers/DashboardController";
import type { AuthMiddleware } from "@/modules/auth/infrastructure/http/middlewares/authMiddleware";

const app = new Hono();

// 1. Middlewares Nativos (Reemplazan a helmet, morgan y cors)
app.use("*", secureHeaders());
app.use("*", cors());
app.use("*", logger());
// Nota: express.json() desaparece. Hono procesa el JSON automáticamente
// cuando llamas a c.req.json() en tus controladores.

// Servir archivos estáticos subidos
app.use("/uploads/*", serveStatic({ root: "./" }));

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
const catalogoRouter = container.resolve(CatalogoRouter);
const areaRouter = container.resolve(AreaRouter);
const sistemaRouter = container.resolve(SistemaRouter);
const ticketRouter = container.resolve(TicketRouter);
const actaRouter = container.resolve(ActaRouter);
const uploadController = container.resolve(UploadController);
const dashboardController = container.resolve(DashboardController);
const authMiddleware = container.resolve<AuthMiddleware>("AuthMiddleware");

// 4. Registro de rutas
// En Hono se usa .route() en lugar de .use() para anidar otros routers
app.route("/api/user", userRouter.router);
app.route("/api/users", userRouter.router);
app.route("/api/auth", authRouter.router);
app.route("/api/permissions", permissionRouter.router);
app.route("/api/catalogos", catalogoRouter.router);
app.route("/api/areas", areaRouter.router);
app.route("/api/sistemas", sistemaRouter.router);
app.route("/api/tickets", ticketRouter.router);
app.route("/api/actas", actaRouter.router);

// Endpoints globales de uploads y dashboard
app.post("/api/uploads", authMiddleware.handle, uploadController.run);
app.get("/api/dashboard/stats", authMiddleware.handle, dashboardController.run);

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

	return c.json(
		{ error: err.message || "Internal Server Error" },
		status as any,
	);
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
			reqPath.startsWith("/api-docs") ||
			reqPath.startsWith("/uploads")
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
