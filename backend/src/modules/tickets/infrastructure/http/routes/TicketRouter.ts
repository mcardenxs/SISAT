import { Hono } from "hono";
import { injectable, inject } from "tsyringe";
import { TicketController } from "../controllers/TicketController";
import { AuthMiddleware } from "@/modules/auth/infrastructure/http/middlewares/authMiddleware";

@injectable()
export class TicketRouter {
	public readonly router: Hono;

	constructor(
		@inject(TicketController)
		private readonly ticketController: TicketController,
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
		 * /api/tickets:
		 *   get:
		 *     tags: [Tickets]
		 *     summary: Listar tickets con filtros
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Lista de tickets
		 */
		this.router.get("/", this.ticketController.getAll);

		/**
		 * @openapi
		 * /api/tickets/{id}:
		 *   get:
		 *     tags: [Tickets]
		 *     summary: Obtener detalle completo de un ticket con asignaciones, atenciones y evidencias
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Detalle del ticket
		 */
		this.router.get("/:id", this.ticketController.getById);

		/**
		 * @openapi
		 * /api/tickets:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Registrar un nuevo ticket de soporte
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Ticket creado con folio generado
		 */
		this.router.post("/", this.ticketController.create);

		/**
		 * @openapi
		 * /api/tickets/{id}/asignaciones:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Asignar ticket a un desarrollador vigente
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Asignación creada
		 */
		this.router.post("/:id/asignaciones", this.ticketController.assign);

		/**
		 * @openapi
		 * /api/tickets/{id}/reasignaciones:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Reasignar ticket a otro desarrollador mediante procedimiento almacenado
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Ticket reasignado
		 */
		this.router.post("/:id/reasignaciones", this.ticketController.reassign);

		/**
		 * @openapi
		 * /api/tickets/{id}/atenciones:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Iniciar ciclo de atención técnica
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Ciclo de atención iniciado
		 */
		this.router.post("/:id/atenciones", this.ticketController.startAtencion);

		/**
		 * @openapi
		 * /api/tickets/atenciones/{atencionId}/intervenciones:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Registrar intervención técnica en un ciclo de atención
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Intervención registrada
		 */
		this.router.post(
			"/atenciones/:atencionId/intervenciones",
			this.ticketController.createIntervencion,
		);

		/**
		 * @openapi
		 * /api/tickets/{id}/evidencias:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Registrar evidencia técnica (inicial, seguimiento, final)
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Evidencia vinculada
		 */
		this.router.post("/:id/evidencias", this.ticketController.createEvidencia);

		/**
		 * @openapi
		 * /api/tickets/atenciones/{atencionId}/terminar:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Finalizar ciclo de atención técnica con diagnóstico y solución
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Ciclo de atención finalizado
		 */
		this.router.post(
			"/atenciones/:atencionId/terminar",
			this.ticketController.endAtencion,
		);

		/**
		 * @openapi
		 * /api/tickets/{id}/atenciones/{atencionId}/evaluacion:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Evaluar atención por parte del responsable del sistema
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Evaluación registrada
		 */
		this.router.post(
			"/:id/atenciones/:atencionId/evaluacion",
			this.ticketController.createEvaluacion,
		);

		/**
		 * @openapi
		 * /api/tickets/{id}/atenciones/{atencionId}/cierre:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Cerrar formalmente el ticket de soporte
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       201:
		 *         description: Ticket cerrado
		 */
		this.router.post(
			"/:id/atenciones/:atencionId/cierre",
			this.ticketController.closeTicket,
		);

		/**
		 * @openapi
		 * /api/tickets/{id}/reapertura:
		 *   post:
		 *     tags: [Tickets]
		 *     summary: Reabrir ticket generando nuevo ciclo consecutivo
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Ticket reabierto
		 */
		this.router.post("/:id/reapertura", this.ticketController.reopenTicket);
	}
}
