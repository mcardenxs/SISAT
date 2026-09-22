import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type {
	ActaDto,
	CreateActaDto,
	InclusionDto,
	ArchivoActaDto,
	UploadArchivoActaDto,
} from "../dtos/ActaDto";
import { BaseError } from "@/core/shared/domain/error/BaseError";

@injectable()
export class ActaUseCases {
	private async generateFolio(): Promise<string> {
		const date = new Date();
		const year = date.getFullYear();
		const prefix = `ACT-${year}-`;

		const lastActa = await prisma.acta.findFirst({
			where: { act_folio: { startsWith: prefix } },
			orderBy: { act_id: "desc" },
		});

		let sequence = 1;
		if (lastActa) {
			const parts = lastActa.act_folio.split("-");
			if (parts[2]) {
				const num = Number.parseInt(parts[2], 10);
				if (!Number.isNaN(num)) {
					sequence = num + 1;
				}
			}
		}

		return `${prefix}${String(sequence).padStart(4, "0")}`;
	}

	private mapActa(a: any): ActaDto {
		return {
			id: a.act_id,
			sistemaId: a.act_fksistema,
			sistemaNombre: a.act_sistema,
			areaId: a.act_fkarea,
			areaNombre: a.act_area,
			usuarioId: a.act_fkusuario,
			firmanteNombre: a.act_firmante,
			situacionId: a.act_fksituacion,
			situacionCodigo: a.situacion?.sit_codigo,
			situacionNombre: a.situacion?.sit_nombre,
			folio: a.act_folio,
			inicio: a.act_inicio.toISOString().split("T")[0],
			fin: a.act_fin.toISOString().split("T")[0],
			generacion: a.act_generacion,
			observacion: a.act_observacion,
			actualizacion: a.act_actualizacion,
			inclusiones: a.inclusion?.map((inc: any): InclusionDto => {
				let devs: string[] = [];
				let evis: string[] = [];
				try {
					devs =
						typeof inc.inc_desarrolladores === "string"
							? JSON.parse(inc.inc_desarrolladores)
							: inc.inc_desarrolladores;
					evis =
						typeof inc.inc_evidencias === "string"
							? JSON.parse(inc.inc_evidencias)
							: inc.inc_evidencias;
				} catch {
					// Fallback
				}
				return {
					id: inc.inc_id,
					actaId: inc.inc_fkacta,
					ticketId: inc.inc_fkticket,
					ticketFolio: inc.ticket?.tic_folio,
					atencionId: inc.inc_fkatencion,
					inicio: inc.inc_inicio,
					fin: inc.inc_fin,
					responsable: inc.inc_responsable,
					desarrolladores: Array.isArray(devs) ? devs : [],
					evidencias: Array.isArray(evis) ? evis : [],
					problema: inc.inc_problema,
					solucion: inc.inc_solucion,
					calificacion: inc.inc_calificacion,
				};
			}),
			archivos: a.archivo?.map(
				(arc: any): ArchivoActaDto => ({
					id: arc.arc_id,
					actaId: arc.arc_fkacta,
					claseId: arc.arc_fkclase,
					claseCodigo: arc.clase?.cla_codigo,
					usuarioId: arc.arc_fkusuario,
					nombre: arc.arc_nombre,
					ruta: arc.arc_ruta,
					formato: arc.arc_formato,
					tamano: arc.arc_tamano,
					observacion: arc.arc_observacion,
					fecha: arc.arc_fecha,
				}),
			),
		};
	}

	// ----------------- CONSULTAS -----------------

	async findAll(filters?: {
		sistemaId?: number;
		areaId?: number;
		situacionId?: number;
	}): Promise<ActaDto[]> {
		const records = await prisma.acta.findMany({
			where: {
				...(filters?.sistemaId && { act_fksistema: filters.sistemaId }),
				...(filters?.areaId && { act_fkarea: filters.areaId }),
				...(filters?.situacionId && { act_fksituacion: filters.situacionId }),
			},
			orderBy: { act_id: "desc" },
			include: {
				situacion: true,
				inclusion: {
					include: { ticket: true },
				},
				archivo: {
					include: { clase: true },
				},
			},
		});

		return records.map((r) => this.mapActa(r));
	}

	async findById(id: number): Promise<ActaDto> {
		const record = await prisma.acta.findUnique({
			where: { act_id: id },
			include: {
				situacion: true,
				inclusion: {
					include: { ticket: true },
					orderBy: { inc_id: "asc" },
				},
				archivo: {
					include: { clase: true },
					orderBy: { arc_id: "asc" },
				},
			},
		});

		if (!record) {
			throw new BaseError(`Acta con ID ${id} no encontrada`, 404);
		}

		return this.mapActa(record);
	}

	// ----------------- GENERACIÓN DE ACTA -----------------

	async create(dto: CreateActaDto, actorId: number): Promise<ActaDto> {
		// Validar sistema y área
		const sistema = await prisma.sistema.findUnique({
			where: { sis_id: dto.sistemaId },
			include: { area: true },
		});
		if (!sistema) {
			throw new BaseError(`Sistema con ID ${dto.sistemaId} no encontrado`, 404);
		}

		// Determinar el firmante (Jefe de Área correspondiente al sistema)
		let firmanteId = actorId;
		const actorUser = await prisma.usuario.findUnique({
			where: { usu_id: actorId },
			include: { perfil: { include: { rol: true } } },
		});

		const isActorJefeOfArea =
			actorUser?.usu_fkarea === sistema.sis_fkarea &&
			actorUser?.perfil.some((p) => p.rol.rol_codigo === "JEFE_DE_AREA");

		if (!isActorJefeOfArea) {
			const jefeArea = await prisma.usuario.findFirst({
				where: {
					usu_fkarea: sistema.sis_fkarea,
					usu_fkestado: 1,
					perfil: {
						some: { rol: { rol_codigo: "JEFE_DE_AREA" } },
					},
				},
			});

			if (!jefeArea) {
				throw new BaseError(
					`El área '${sistema.area.are_nombre}' no cuenta con un Jefe de Área activo asignado para firmar el acta oficial.`,
					400,
				);
			}

			firmanteId = jefeArea.usu_id;
		}

		// Validar diferencia de 6 días: DATEDIFF(fin, inicio) = 6
		const startDate = new Date(`${dto.inicio}T00:00:00Z`);
		const endDate = new Date(`${dto.fin}T00:00:00Z`);
		const diffDays = Math.round(
			(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		if (diffDays !== 6) {
			throw new BaseError(
				`El periodo del acta debe ser exactamente de una semana (7 días, DATEDIFF=6). Días calculados: ${diffDays}`,
				400,
			);
		}

		// Situación inicial 'GENERADA'
		const situacionGenerada = await prisma.situacion.findUnique({
			where: { sit_codigo: "GENERADA" },
		});
		if (!situacionGenerada) {
			throw new BaseError(
				"Situación 'GENERADA' no encontrada en catálogo",
				500,
			);
		}

		const folio = await this.generateFolio();

		// Crear Acta
		const acta = await prisma.acta.create({
			data: {
				act_fksistema: sistema.sis_id,
				act_fkarea: sistema.sis_fkarea,
				act_fkusuario: firmanteId,
				act_fksituacion: situacionGenerada.sit_id,
				act_sistema: sistema.sis_nombre,
				act_area: sistema.area.are_nombre,
				act_firmante: "Pendiente", // Actualizado por trigger bi_acta_validar
				act_folio: folio,
				act_inicio: startDate,
				act_fin: endDate,
				act_observacion: dto.observacion ?? null,
			},
		});

		// Buscar atenciones elegibles para inclusión
		// Regla de negocio: tickets del sistema, fase RESUELTO_POR_DESARROLLO o CERRADO_POR_RESPONSABLE,
		// con fecha de término o cierre dentro del periodo, y que sea el último ciclo de atención
		const eligibleTickets = await prisma.ticket.findMany({
			where: {
				tic_fksistema: sistema.sis_id,
				fase: {
					fas_codigo: {
						in: ["RESUELTO_POR_DESARROLLO", "CERRADO_POR_RESPONSABLE"],
					},
				},
				...(dto.ticketIds &&
					dto.ticketIds.length > 0 && {
						tic_id: { in: dto.ticketIds },
					}),
			},
			include: {
				asignacion: {
					include: { usuario_asignacion_asi_fkusuarioTousuario: true },
				},
				atencion: {
					orderBy: { ate_ciclo: "desc" },
					take: 1,
					include: {
						termino: true,
						cierre: true,
						evaluacion: true,
						evidencia: true,
					},
				},
			},
		});

		// Insertar inclusiones que cumplan las fechas del acta
		for (const t of eligibleTickets) {
			const atencion = t.atencion[0];
			if (!atencion || !atencion.termino) continue;

			const terminoDate = atencion.termino.ter_fecha;
			const cierreDate = atencion.cierre?.cie_fecha;

			// Verificar que esté en el rango de fechas
			const inRange =
				(terminoDate >= startDate &&
					terminoDate <= new Date(`${dto.fin}T23:59:59Z`)) ||
				(cierreDate &&
					cierreDate >= startDate &&
					cierreDate <= new Date(`${dto.fin}T23:59:59Z`));

			if (!inRange) continue;

			// Participantes desarrolladores (JSON Array)
			const devs = Array.from(
				new Set(
					t.asignacion
						.map((a: any) =>
							a.usuario_asignacion_asi_fkusuarioTousuario
								? `${a.usuario_asignacion_asi_fkusuarioTousuario.usu_nombre} ${a.usuario_asignacion_asi_fkusuarioTousuario.usu_apellido}`.trim()
								: null,
						)
						.filter(Boolean),
				),
			);

			// Evidencias (JSON Array)
			const evis = atencion.evidencia.map((e: any) => e.evi_nombre);

			await prisma.inclusion.create({
				data: {
					inc_fkacta: acta.act_id,
					inc_fkticket: t.tic_id,
					inc_fkatencion: atencion.ate_id,
					inc_inicio: atencion.ate_inicio,
					inc_fin: atencion.termino.ter_fecha,
					inc_desarrolladores: JSON.stringify(devs),
					inc_evidencias: JSON.stringify(evis),
					inc_problema: t.tic_descripcion,
					inc_solucion: atencion.ate_solucion || "Atención técnica completada",
					inc_calificacion: atencion.evaluacion?.eva_calificacion ?? null,
				},
			});

			// Actualizar estado documental del ticket a 'EN_ACTA_GENERADA'
			const constanciaEnActa = await prisma.constancia.findUnique({
				where: { con_codigo: "EN_ACTA_GENERADA" },
			});
			if (constanciaEnActa) {
				await prisma.ticket.update({
					where: { tic_id: t.tic_id },
					data: { tic_fkconstancia: constanciaEnActa.con_id },
				});
			}
		}

		return this.findById(acta.act_id);
	}

	// ----------------- CARGA DE ARCHIVO DE ACTA -----------------

	async uploadArchivo(
		dto: UploadArchivoActaDto,
		actorId: number,
	): Promise<ArchivoActaDto> {
		const acta = await prisma.acta.findUnique({
			where: { act_id: dto.actaId },
			include: { situacion: true },
		});
		if (!acta) {
			throw new BaseError(`Acta con ID ${dto.actaId} no encontrada`, 404);
		}

		const record = await prisma.archivo.create({
			data: {
				arc_fkacta: dto.actaId,
				arc_fkclase: dto.claseId,
				arc_fkusuario: actorId,
				arc_nombre: dto.nombre,
				arc_ruta: dto.ruta,
				arc_formato: dto.formato,
				arc_tamano: dto.tamano,
				arc_observacion: dto.observacion ?? null,
			},
			include: { clase: true },
		});

		// Si el archivo es 'ACTA_FIRMADA', actualizar situación a 'CARGADA' y tickets a 'ACTA_FIRMADA_CARGADA'
		if (record.clase.cla_codigo === "ACTA_FIRMADA") {
			const situacionCargada = await prisma.situacion.findUnique({
				where: { sit_codigo: "CARGADA" },
			});
			if (situacionCargada) {
				await prisma.acta.update({
					where: { act_id: dto.actaId },
					data: { act_fksituacion: situacionCargada.sit_id },
				});
			}

			const constanciaFirmada = await prisma.constancia.findUnique({
				where: { con_codigo: "ACTA_FIRMADA_CARGADA" },
			});
			if (constanciaFirmada) {
				const inclusiones = await prisma.inclusion.findMany({
					where: { inc_fkacta: dto.actaId },
					select: { inc_fkticket: true },
				});
				const ticketIds = inclusiones.map((inc) => inc.inc_fkticket);
				if (ticketIds.length > 0) {
					await prisma.ticket.updateMany({
						where: { tic_id: { in: ticketIds } },
						data: { tic_fkconstancia: constanciaFirmada.con_id },
					});
				}
			}
		}

		return {
			id: record.arc_id,
			actaId: record.arc_fkacta,
			claseId: record.arc_fkclase,
			claseCodigo: record.clase.cla_codigo,
			usuarioId: record.arc_fkusuario,
			nombre: record.arc_nombre,
			ruta: record.arc_ruta,
			formato: record.arc_formato,
			tamano: record.arc_tamano,
			observacion: record.arc_observacion,
			fecha: record.arc_fecha,
		};
	}
}
