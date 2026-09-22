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
			const stats = await this.dashboardMetricsUseCase.run();
			return this.ok(c, stats);
		});
	};
}
