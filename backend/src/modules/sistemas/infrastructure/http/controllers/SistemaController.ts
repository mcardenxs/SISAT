import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { SistemaUseCases } from "../../../application/useCases/SistemaUseCases";
import { validate } from "@/core/shared/infrastructure/libs/validate";
import {
	createSistemaSchema,
	updateSistemaSchema,
	assignResponsableSchema,
	endResponsableSchema,
	assignDesarrolladorSchema,
	endDesarrolladorSchema,
} from "../schemas/sistemaSchemas";

@injectable()
export class SistemaController extends BaseController {
	constructor(
		@inject(SistemaUseCases)
		private readonly sistemaUseCases: SistemaUseCases,
	) {
		super();
	}

	getAll = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const sistemas = await this.sistemaUseCases.findAll();
			return this.ok(c, sistemas);
		});
	};

	getById = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const id = Number(c.req.param("id"));
			const sistema = await this.sistemaUseCases.findById(id);
			return this.ok(c, sistema);
		});
	};

	create = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const body = await c.req.json();
			const dto = validate(createSistemaSchema, body);
			const created = await this.sistemaUseCases.create(dto);
			return this.created(c, created);
		});
	};

	update = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const id = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(updateSistemaSchema, body);
			const updated = await this.sistemaUseCases.update(id, dto);
			return this.ok(c, updated);
		});
	};

	assignResponsable = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const sistemaId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(assignResponsableSchema, body);
			const responsable = await this.sistemaUseCases.assignResponsable({
				sistemaId,
				...dto,
			});
			return this.created(c, responsable);
		});
	};

	endResponsable = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const responsableId = Number(c.req.param("responsableId"));
			const body = await c.req.json().catch(() => ({}));
			const dto = validate(endResponsableSchema, body);
			const ended = await this.sistemaUseCases.endResponsable(
				responsableId,
				dto,
			);
			return this.ok(c, ended);
		});
	};

	assignDesarrollador = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const sistemaId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(assignDesarrolladorSchema, body);
			const dev = await this.sistemaUseCases.assignDesarrollador({
				sistemaId,
				...dto,
			});
			return this.created(c, dev);
		});
	};

	endDesarrollador = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const desarrolladorId = Number(c.req.param("desarrolladorId"));
			const body = await c.req.json().catch(() => ({}));
			const dto = validate(endDesarrolladorSchema, body);
			const ended = await this.sistemaUseCases.endDesarrollador(
				desarrolladorId,
				dto,
			);
			return this.ok(c, ended);
		});
	};
}
