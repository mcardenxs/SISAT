import { Hono } from "hono";
import { injectable, inject } from "tsyringe";
import { ActaController } from "../controllers/ActaController";
import { AuthMiddleware } from "@/modules/auth/infrastructure/http/middlewares/authMiddleware";

@injectable()
export class ActaRouter {
	public readonly router: Hono;

	constructor(
		@inject(ActaController)
		private readonly actaController: ActaController,
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
		 * /api/actas:
		 *   get:
		 *     tags: [Actas]
		 *     summary: Listar actas semanales generadas
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Lista de actas
		 */
		this.router.get("/", this.actaController.getAll);

		/**
		 * @openapi
		 * /api/actas/{id}:
		 *   get:
		 *     tags: [Actas]
		 *     summary: Obtener detalle completo de un acta con inclusiones y archivos
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Detalle del acta
		 */
		this.router.get("/:id", this.actaController.getById);

		/**
		 * @openapi
		 * /api/actas:
		 *   post:
		 *     tags: [Actas]
		 *     summary: Generar un acta semanal agrupando atenciones del periodo
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Acta generada
		 */
		this.router.post("/", this.actaController.create);

		/**
		 * @openapi
		 * /api/actas/{id}/archivos:
		 *   post:
		 *     tags: [Actas]
		 *     summary: Cargar archivo a un acta (Acta firmada o anexo)
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Archivo cargado
		 */
		this.router.post("/:id/archivos", this.actaController.uploadArchivo);
	}
}
