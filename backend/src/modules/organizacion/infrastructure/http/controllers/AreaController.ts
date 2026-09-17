import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { AreaUseCases } from "../../../application/useCases/AreaUseCases";
import { validate } from "@/core/shared/infrastructure/libs/validate";
import { createAreaSchema, updateAreaSchema } from "../schemas/areaSchemas";

@injectable()
export class AreaController extends BaseController {
	constructor(
		@inject(AreaUseCases)
		private readonly areaUseCases: AreaUseCases,
	) {
		super();
	}

	getAll = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const areas = await this.areaUseCases.findAll();
			return this.ok(c, areas);
		});
	};

	getById = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const id = Number(c.req.param("id"));
			const area = await this.areaUseCases.findById(id);
			return this.ok(c, area);
		});
	};

	create = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const body = await c.req.json();
			const dto = validate(createAreaSchema, body);
			const created = await this.areaUseCases.create(dto);
			return this.created(c, created);
		});
	};

	update = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const id = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(updateAreaSchema, body);
			const updated = await this.areaUseCases.update(id, dto);
			return this.ok(c, updated);
		});
	};
}
