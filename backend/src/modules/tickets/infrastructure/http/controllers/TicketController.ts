import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { TicketUseCases } from "../../../application/useCases/TicketUseCases";
import { validate } from "@/core/shared/infrastructure/libs/validate";
import {
	createTicketSchema,
	assignTicketSchema,
	reassignTicketSchema,
	createAtencionSchema,
	createIntervencionSchema,
	createEvidenciaSchema,
	terminarAtencionSchema,
	createEvaluacionSchema,
	createCierreSchema,
	createReaperturaSchema,
	moveTicketSchema,
	updateTicketSchema,
	pauseTicketSchema,
	cancelTicketSchema,
} from "../schemas/ticketSchemas";

@injectable()
export class TicketController extends BaseController {
	constructor(
		@inject(TicketUseCases)
		private readonly ticketUseCases: TicketUseCases,
	) {
		super();
	}

	getAll = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const sistemaId = c.req.query("sistemaId")
				? Number(c.req.query("sistemaId"))
				: undefined;
			const faseId = c.req.query("faseId")
				? Number(c.req.query("faseId"))
				: undefined;
			const usuarioId = c.req.query("usuarioId")
				? Number(c.req.query("usuarioId"))
				: undefined;

			const tickets = await this.ticketUseCases.findAll({
				sistemaId,
				faseId,
				usuarioId,
			});
			return this.ok(c, tickets);
		});
	};

	getById = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const id = Number(c.req.param("id"));
			const ticket = await this.ticketUseCases.findById(id);
			return this.ok(c, ticket);
		});
	};

	create = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const body = await c.req.json();
			const dto = validate(createTicketSchema, body);
			const ticket = await this.ticketUseCases.create(dto, user.id);
			return this.created(c, ticket);
		});
	};

	assign = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(assignTicketSchema, body);
			const asignacion = await this.ticketUseCases.assign(
				{ ticketId, ...dto },
				user.id,
			);
			return this.created(c, asignacion);
		});
	};

	reassign = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(reassignTicketSchema, body);
			const result = await this.ticketUseCases.reassign(
				{ ticketId, ...dto },
				user.id,
			);
			return this.ok(c, result);
		});
	};

	startAtencion = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json().catch(() => ({}));
			const dto = validate(createAtencionSchema, body);
			const atencion = await this.ticketUseCases.startAtencion(
				{ ticketId, ...dto },
				user.id,
			);
			return this.created(c, atencion);
		});
	};

	createIntervencion = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const atencionId = Number(c.req.param("atencionId"));
			const body = await c.req.json();
			const dto = validate(createIntervencionSchema, body);
			const intervencion = await this.ticketUseCases.createIntervencion(
				{ atencionId, ...dto },
				user.id,
			);
			return this.created(c, intervencion);
		});
	};

	createEvidencia = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(createEvidenciaSchema, body);
			const evidencia = await this.ticketUseCases.createEvidencia(
				{ ticketId, ...dto },
				user.id,
			);
			return this.created(c, evidencia);
		});
	};

	endAtencion = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const atencionId = Number(c.req.param("atencionId"));
			const body = await c.req.json();
			const dto = validate(terminarAtencionSchema, body);
			const atencion = await this.ticketUseCases.endAtencion(
				{ atencionId, ...dto },
				user.id,
			);
			return this.ok(c, atencion);
		});
	};

	createEvaluacion = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const atencionId = Number(c.req.param("atencionId"));
			const body = await c.req.json();
			const dto = validate(createEvaluacionSchema, body);
			const evaluacion = await this.ticketUseCases.createEvaluacion(
				{ ticketId, atencionId, ...dto },
				user.id,
			);
			return this.created(c, evaluacion);
		});
	};

	closeTicket = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const atencionId = Number(c.req.param("atencionId"));
			const body = await c.req.json().catch(() => ({}));
			const dto = validate(createCierreSchema, body);
			const cierre = await this.ticketUseCases.closeTicket(
				{ ticketId, atencionId, ...dto },
				user.id,
			);
			return this.created(c, cierre);
		});
	};

	reopenTicket = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(createReaperturaSchema, body);
			const ticket = await this.ticketUseCases.reopenTicket(
				{ ticketId, ...dto },
				user.id,
			);
			return this.ok(c, ticket);
		});
	};

	move = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(moveTicketSchema, body);
			const ticket = await this.ticketUseCases.moveTicket(
				{ ticketId, ...dto },
				user.id,
			);
			return this.ok(c, ticket);
		});
	};

	update = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(updateTicketSchema, body);
			const ticket = await this.ticketUseCases.update(ticketId, dto);
			return this.ok(c, ticket);
		});
	};

	pause = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(pauseTicketSchema, body);
			const ticket = await this.ticketUseCases.pauseTicket(
				ticketId,
				dto.motivo,
				user.id,
			);
			return this.ok(c, ticket);
		});
	};

	resume = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const ticket = await this.ticketUseCases.resumeTicket(ticketId, user.id);
			return this.ok(c, ticket);
		});
	};

	cancel = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const ticketId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(cancelTicketSchema, body);
			const ticket = await this.ticketUseCases.cancelTicket(
				ticketId,
				dto.motivo,
				user.id,
			);
			return this.ok(c, ticket);
		});
	};
}
