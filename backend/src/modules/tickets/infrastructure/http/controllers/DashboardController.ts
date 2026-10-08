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
			let areaId = c.req.query("areaId")
				? Number(c.req.query("areaId"))
				: undefined;
			const sistemaId = c.req.query("sistemaId")
				? Number(c.req.query("sistemaId"))
				: undefined;

			// Si el usuario es Jefe de Área, auto-filtrar estrictamente por su área institucional (Doc. 3.2 y 3.13)
			if (user?.role === "JEFE_DE_AREA" && user.id) {
				const usuario = await prisma.usuario.findUnique({
					where: { usu_id: user.id },
					select: { usu_fkarea: true },
				});
				if (usuario?.usu_fkarea) {
					areaId = usuario.usu_fkarea;
				}
			}

			const stats = await this.dashboardMetricsUseCase.run({
				areaId,
				sistemaId,
			});
			return this.ok(c, stats);
		});
	};
}
