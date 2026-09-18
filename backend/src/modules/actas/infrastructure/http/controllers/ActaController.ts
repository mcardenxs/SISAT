import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { ActaUseCases } from "../../../application/useCases/ActaUseCases";
import { validate } from "@/core/shared/infrastructure/libs/validate";
import {
	createActaSchema,
	uploadArchivoActaSchema,
} from "../schemas/actaSchemas";

@injectable()
export class ActaController extends BaseController {
	constructor(
		@inject(ActaUseCases)
		private readonly actaUseCases: ActaUseCases,
	) {
		super();
	}

	getAll = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const sistemaId = c.req.query("sistemaId")
				? Number(c.req.query("sistemaId"))
				: undefined;
			const areaId = c.req.query("areaId")
				? Number(c.req.query("areaId"))
				: undefined;
			const situacionId = c.req.query("situacionId")
				? Number(c.req.query("situacionId"))
				: undefined;

			const actas = await this.actaUseCases.findAll({
				sistemaId,
				areaId,
				situacionId,
			});
			return this.ok(c, actas);
		});
	};

	getById = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const id = Number(c.req.param("id"));
			const acta = await this.actaUseCases.findById(id);
			return this.ok(c, acta);
		});
	};

	create = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const body = await c.req.json();
			const dto = validate(createActaSchema, body);
			const acta = await this.actaUseCases.create(dto, user.id);
			return this.created(c, acta);
		});
	};

	uploadArchivo = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const user = c.get("user");
			const actaId = Number(c.req.param("id"));
			const body = await c.req.json();
			const dto = validate(uploadArchivoActaSchema, body);
			const archivo = await this.actaUseCases.uploadArchivo(
				{ actaId, ...dto },
				user.id,
			);
			return this.created(c, archivo);
		});
	};
}
