import { Hono } from "hono";
import { injectable, inject } from "tsyringe";
import { AreaController } from "../controllers/AreaController";
import { AuthMiddleware } from "@/modules/auth/infrastructure/http/middlewares/authMiddleware";

@injectable()
export class AreaRouter {
	public readonly router: Hono;

	constructor(
		@inject(AreaController)
		private readonly areaController: AreaController,
		@inject("AuthMiddleware")
		private readonly authMiddleware: AuthMiddleware,
	) {
		this.router = new Hono();
		this.initRoutes();
	}

	private initRoutes() {
		this.router.use(this.authMiddleware.handle);

		/**
		 * @openapi
		 * /api/areas:
		 *   get:
		 *     tags: [Areas]
		 *     summary: Listar todas las áreas institucionales
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Lista de áreas
		 */
		this.router.get("/", this.areaController.getAll);

		/**
		 * @openapi
		 * /api/areas/{id}:
		 *   get:
		 *     tags: [Areas]
		 *     summary: Obtener detalle de un área
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: integer
		 *     responses:
		 *       200:
		 *         description: Área encontrada
		 */
		this.router.get("/:id", this.areaController.getById);

		/**
		 * @openapi
		 * /api/areas:
		 *   post:
		 *     tags: [Areas]
		 *     summary: Crear nueva área institucional
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Área creada
		 */
		this.router.post("/", this.areaController.create);

		/**
		 * @openapi
		 * /api/areas/{id}:
		 *   patch:
		 *     tags: [Areas]
		 *     summary: Actualizar datos o estado de un área
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Área actualizada
		 */
		this.router.patch("/:id", this.areaController.update);
	}
}
