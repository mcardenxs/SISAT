import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { DashboardMetricsUseCase } from "../../../application/useCases/DashboardMetricsUseCase";

@injectable()
export class DashboardController extends BaseController {
	constructor(
		@inject(DashboardMetricsUseCase)
		private readonly dashboardMetricsUseCase: DashboardMetricsUseCase,
	) {
		super();
	}

	run = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const areaId = c.req.query("areaId")
				? Number(c.req.query("areaId"))
				: undefined;
			const sistemaId = c.req.query("sistemaId")
				? Number(c.req.query("sistemaId"))
				: undefined;

			const stats = await this.dashboardMetricsUseCase.run({
				areaId,
				sistemaId,
			});
			return this.ok(c, stats);
		});
	};
}
