import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import {
	GetCatalogosUseCase,
	type CatalogoTipo,
} from "../../../application/useCases/GetCatalogosUseCase";

@injectable()
export class GetCatalogosController extends BaseController {
	constructor(
		@inject(GetCatalogosUseCase)
		private readonly getCatalogosUseCase: GetCatalogosUseCase,
	) {
		super();
	}

	run = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const catalogoParam = c.req.param("catalogo") as CatalogoTipo | undefined;

			if (catalogoParam) {
				const items = await this.getCatalogosUseCase.getCatalogo(catalogoParam);
				return this.ok(c, items);
			}

			const todos = await this.getCatalogosUseCase.getAllCatalogos();
			return this.ok(c, todos);
		});
	};
}
