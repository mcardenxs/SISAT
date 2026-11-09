import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";

export interface DashboardStatsDto {
	resumenTickets: {
		total: number;
		activos: number;
		resueltos: number;
		cerrados: number;
		cancelados: number;
	};
	ticketsPorFase: Array<{
		faseId: number;
		faseCodigo: string;
		faseNombre: string;
		total: number;
	}>;
	ticketsPorPrioridad: Array<{
		prioridadId: number;
		prioridadCodigo: string;
		prioridadNombre: string;
		total: number;
	}>;
	ticketsPorSistema: Array<{
		sistemaId: number;
		sistemaNombre: string;
		total: number;
	}>;
	resumenActas: {
		total: number;
		generadas: number;
		cargadas: number;
	};
	totalesGenerales: {
		usuariosActivos: number;
		sistemasActivos: number;
		areasActivas: number;
	};
}

export interface DashboardFilterDto {
	areaId?: number;
	sistemaId?: number;
}

@injectable()
export class DashboardMetricsUseCase {
	async run(
		filters?: DashboardFilterDto,
		actorId?: number,
		actorRole?: string,
	): Promise<DashboardStatsDto> {
		const ticketWhere: any = {
			...(filters?.areaId && { tic_fkarea: filters.areaId }),
			...(filters?.sistemaId && { tic_fksistema: filters.sistemaId }),
		};

		const actaWhere: any = {
			...(filters?.areaId && { act_fkarea: filters.areaId }),
			...(filters?.sistemaId && { act_fksistema: filters.sistemaId }),
		};

		const sistemaWhere: any = {
			sis_fkestado: 1,
			...(filters?.areaId && { sis_fkarea: filters.areaId }),
			...(filters?.sistemaId && { sis_id: filters.sistemaId }),
		};

		const usuarioWhere: any = {
			usu_fkestado: 1,
			...(filters?.areaId && { usu_fkarea: filters.areaId }),
		};

		// Scoping institucional idéntico a TicketUseCases y SistemaUseCases
		if (
			actorRole &&
			actorId &&
			actorRole !== "ADMINISTRADOR" &&
			actorRole !== "ADMIN"
		) {
			if (actorRole === "JEFE_DE_AREA") {
				const user = await prisma.usuario.findUnique({
					where: { usu_id: actorId },
					select: { usu_fkarea: true },
				});
				if (user?.usu_fkarea) {
					ticketWhere.tic_fkarea = user.usu_fkarea;
					actaWhere.act_fkarea = user.usu_fkarea;
					sistemaWhere.sis_fkarea = user.usu_fkarea;
					usuarioWhere.usu_fkarea = user.usu_fkarea;
				}
			} else if (actorRole === "RESPONSABLE_DE_SISTEMA") {
				const sistemas = await prisma.responsable.findMany({
					where: {
						res_fkusuario: actorId,
						res_fkestado: 1,
						res_fin: null,
					},
					select: { res_fksistema: true },
				});
				const sistemaIds = sistemas.map((s) => s.res_fksistema);
				ticketWhere.tic_fksistema = { in: sistemaIds };
				actaWhere.act_fksistema = { in: sistemaIds };
				sistemaWhere.sis_id = { in: sistemaIds };
			} else if (actorRole === "DESARROLLADOR") {
				const sistemas = await prisma.desarrollador.findMany({
					where: {
						des_fkusuario: actorId,
						des_fkestado: 1,
						des_fin: null,
					},
					select: { des_fksistema: true },
				});
				const devSistemaIds = sistemas.map((s) => s.des_fksistema);
				ticketWhere.OR = [
					...(devSistemaIds.length > 0
						? [{ tic_fksistema: { in: devSistemaIds } }]
						: []),
					{
						asignacion: {
							some: { asi_fkusuario: actorId, asi_fin: null },
						},
					},
				];
				if (devSistemaIds.length > 0) {
					sistemaWhere.sis_id = { in: devSistemaIds };
				}
			}
		}

		const [
			totalTickets,
			fases,
			ticketsFaseCounts,
			prioridades,
			ticketsPrioridadCounts,
			sistemas,
			ticketsSistemaCounts,
			totalActas,
			situacionesActa,
			totalUsuarios,
			totalSistemas,
			totalAreas,
		] = await Promise.all([
			prisma.ticket.count({ where: ticketWhere }),
			prisma.fase.findMany({ orderBy: { fas_id: "asc" } }),
			prisma.ticket.groupBy({
				by: ["tic_fkfase"],
				where: ticketWhere,
				_count: { tic_id: true },
			}),
			prisma.prioridad.findMany({ orderBy: { pri_id: "asc" } }),
			prisma.ticket.groupBy({
				by: ["tic_fkprioridad"],
				where: ticketWhere,
				_count: { tic_id: true },
			}),
			prisma.sistema.findMany({
				where: sistemaWhere,
				select: { sis_id: true, sis_nombre: true },
			}),
			prisma.ticket.groupBy({
				by: ["tic_fksistema"],
				where: ticketWhere,
				_count: { tic_id: true },
			}),
			prisma.acta.count({ where: actaWhere }),
			prisma.acta.groupBy({
				by: ["act_fksituacion"],
				where: actaWhere,
				_count: { act_id: true },
			}),
			prisma.usuario.count({
				where: usuarioWhere,
			}),
			prisma.sistema.count({
				where: sistemaWhere,
			}),
			prisma.area.count({ where: { are_fkestado: 1 } }),
		]);

		// Map conteos de fases
		const faseCountMap = new Map<number, number>(
			ticketsFaseCounts.map((g) => [g.tic_fkfase, g._count.tic_id]),
		);

		const ticketsPorFase = fases.map((f) => ({
			faseId: f.fas_id,
			faseCodigo: f.fas_codigo,
			faseNombre: f.fas_nombre,
			total: faseCountMap.get(f.fas_id) ?? 0,
		}));

		// Clasificación de resumen
		let activos = 0;
		let resueltos = 0;
		let cerrados = 0;
		let cancelados = 0;

		for (const item of ticketsPorFase) {
			if (
				[
					"REGISTRADO",
					"ASIGNADO",
					"EN_PROCESO",
					"EN_ESPERA_DE_INFORMACION",
					"REABIERTO",
				].includes(item.faseCodigo)
			) {
				activos += item.total;
			} else if (item.faseCodigo === "RESUELTO_POR_DESARROLLO") {
				resueltos += item.total;
			} else if (item.faseCodigo === "CERRADO_POR_RESPONSABLE") {
				cerrados += item.total;
			} else if (item.faseCodigo === "CANCELADO") {
				cancelados += item.total;
			}
		}

		// Map conteos de prioridades
		const prioridadCountMap = new Map<number, number>(
			ticketsPrioridadCounts.map((g) => [g.tic_fkprioridad, g._count.tic_id]),
		);
		const ticketsPorPrioridad = prioridades.map((p) => ({
			prioridadId: p.pri_id,
			prioridadCodigo: p.pri_codigo,
			prioridadNombre: p.pri_nombre,
			total: prioridadCountMap.get(p.pri_id) ?? 0,
		}));

		// Map conteos de sistemas
		const sistemaMap = new Map<number, string>(
			sistemas.map((s) => [s.sis_id, s.sis_nombre]),
		);
		const ticketsPorSistema = ticketsSistemaCounts
			.map((s) => ({
				sistemaId: s.tic_fksistema,
				sistemaNombre: sistemaMap.get(s.tic_fksistema) ?? "Desconocido",
				total: s._count.tic_id,
			}))
			.sort((a, b) => b.total - a.total);

		// Conteo de situaciones de actas
		const situacionGenerada = await prisma.situacion.findUnique({
			where: { sit_codigo: "GENERADA" },
		});
		const situacionCargada = await prisma.situacion.findUnique({
			where: { sit_codigo: "CARGADA" },
		});

		const actaCountMap = new Map<number, number>(
			situacionesActa.map((s) => [s.act_fksituacion, s._count.act_id]),
		);

		return {
			resumenTickets: {
				total: totalTickets,
				activos,
				resueltos,
				cerrados,
				cancelados,
			},
			ticketsPorFase,
			ticketsPorPrioridad,
			ticketsPorSistema,
			resumenActas: {
				total: totalActas,
				generadas: situacionGenerada
					? (actaCountMap.get(situacionGenerada.sit_id) ?? 0)
					: 0,
				cargadas: situacionCargada
					? (actaCountMap.get(situacionCargada.sit_id) ?? 0)
					: 0,
			},
			totalesGenerales: {
				usuariosActivos: totalUsuarios,
				sistemasActivos: totalSistemas,
				areasActivas: totalAreas,
			},
		};
	}
}
