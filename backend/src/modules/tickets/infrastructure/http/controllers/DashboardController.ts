import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { DashboardMetricsUseCase } from "../../../application/useCases/DashboardMetricsUseCase";
import { prisma } from "@/core/config/prisma";

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
			const user = c.get("user");
			const areaId = c.req.query("areaId")
				? Number(c.req.query("areaId"))
				: undefined;
			const sistemaId = c.req.query("sistemaId")
				? Number(c.req.query("sistemaId"))
				: undefined;

			const stats = await this.dashboardMetricsUseCase.run(
				{
					areaId,
					sistemaId,
				},
				user?.id,
				user?.role,
			);
			return this.ok(c, stats);
		});
	};
}
