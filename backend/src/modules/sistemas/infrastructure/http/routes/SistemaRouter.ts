import { Hono } from "hono";
import { injectable, inject } from "tsyringe";
import { SistemaController } from "../controllers/SistemaController";
import { AuthMiddleware } from "@/modules/auth/infrastructure/http/middlewares/authMiddleware";

@injectable()
export class SistemaRouter {
	public readonly router: Hono;

	constructor(
		@inject(SistemaController)
		private readonly sistemaController: SistemaController,
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
		 * /api/sistemas:
		 *   get:
		 *     tags: [Sistemas]
		 *     summary: Listar todos los sistemas con sus responsables y desarrolladores activos
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Lista de sistemas
		 */
		this.router.get("/", this.sistemaController.getAll);

		/**
		 * @openapi
		 * /api/sistemas/{id}:
		 *   get:
		 *     tags: [Sistemas]
		 *     summary: Obtener detalle completo de un sistema institucional
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
		 *         description: Detalle del sistema
		 */
		this.router.get("/:id", this.sistemaController.getById);

		/**
		 * @openapi
		 * /api/sistemas:
		 *   post:
		 *     tags: [Sistemas]
		 *     summary: Registrar un nuevo sistema institucional
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Sistema creado exitosamente
		 */
		this.router.post("/", this.sistemaController.create);

		/**
		 * @openapi
		 * /api/sistemas/{id}:
		 *   patch:
		 *     tags: [Sistemas]
		 *     summary: Actualizar información de un sistema
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Sistema actualizado
		 */
		this.router.patch("/:id", this.sistemaController.update);

		/**
		 * @openapi
		 * /api/sistemas/{id}/responsables:
		 *   post:
		 *     tags: [Sistemas]
		 *     summary: Asignar un usuario como responsable de un sistema
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Responsable asignado
		 */
		this.router.post(
			"/:id/responsables",
			this.sistemaController.assignResponsable,
		);

		/**
		 * @openapi
		 * /api/sistemas/responsables/{responsableId}/finalizar:
		 *   patch:
		 *     tags: [Sistemas]
		 *     summary: Finalizar vigencia de un responsable
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Responsable finalizado
		 */
		this.router.patch(
			"/responsables/:responsableId/finalizar",
			this.sistemaController.endResponsable,
		);

		/**
		 * @openapi
		 * /api/sistemas/{id}/desarrolladores:
		 *   post:
		 *     tags: [Sistemas]
		 *     summary: Asignar un desarrollador a un sistema
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Desarrollador asignado
		 */
		this.router.post(
			"/:id/desarrolladores",
			this.sistemaController.assignDesarrollador,
		);

		/**
		 * @openapi
		 * /api/sistemas/desarrolladores/{desarrolladorId}/finalizar:
		 *   patch:
		 *     tags: [Sistemas]
		 *     summary: Finalizar vigencia de un desarrollador asignado
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Desarrollador finalizado
		 */
		this.router.patch(
			"/desarrolladores/:desarrolladorId/finalizar",
			this.sistemaController.endDesarrollador,
		);
	}
}
