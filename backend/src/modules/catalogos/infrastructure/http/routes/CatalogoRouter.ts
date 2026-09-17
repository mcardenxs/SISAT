import { Hono } from "hono";
import { injectable, inject } from "tsyringe";
import { GetCatalogosController } from "../controllers/GetCatalogosController";

@injectable()
export class CatalogoRouter {
	public readonly router: Hono;

	constructor(
		@inject(GetCatalogosController)
		private readonly getCatalogosController: GetCatalogosController,
	) {
		this.router = new Hono();
		this.initRoutes();
	}

	private initRoutes() {
		/**
		 * @openapi
		 * /api/catalogos:
		 *   get:
		 *     tags: [Catalogos]
		 *     summary: Obtener todos los catálogos del sistema
		 *     responses:
		 *       200:
		 *         description: Catálogos completos de SISAT
		 */
		this.router.get("/", this.getCatalogosController.run);

		/**
		 * @openapi
		 * /api/catalogos/{catalogo}:
		 *   get:
		 *     tags: [Catalogos]
		 *     summary: Obtener un catálogo específico
		 *     parameters:
		 *       - in: path
		 *         name: catalogo
		 *         required: true
		 *         schema:
		 *           type: string
		 *           enum: [estado, fase, constancia, situacion, prioridad, solicitud, rol, clase]
		 *     responses:
		 *       200:
		 *         description: Lista de items del catálogo solicitado
		 */
		this.router.get("/:catalogo", this.getCatalogosController.run);
	}
}
