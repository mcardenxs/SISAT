import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type {
	TicketDto,
	CreateTicketDto,
	AsignacionDto,
	AssignTicketDto,
	ReassignTicketDto,
	AtencionDto,
	CreateAtencionDto,
	TerminarAtencionDto,
	CreateIntervencionDto,
	IntervencionDto,
	CreateEvidenciaDto,
	EvidenciaDto,
	CreateEvaluacionDto,
	EvaluacionDto,
	CreateCierreDto,
	CierreDto,
	CreateReaperturaDto,
	MoveTicketDto,
	UpdateTicketDto,
} from "../dtos/TicketDto";
import { BaseError } from "@/core/shared/domain/error/BaseError";

@injectable()
export class TicketUseCases {
	private async generateFolio(): Promise<string> {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const prefix = `TIC-${year}${month}-`;

		const lastTicket = await prisma.ticket.findFirst({
			where: { tic_folio: { startsWith: prefix } },
			orderBy: { tic_id: "desc" },
		});

		let sequence = 1;
		if (lastTicket) {
			const parts = lastTicket.tic_folio.split("-");
			if (parts[2]) {
				const num = Number.parseInt(parts[2], 10);
				if (!Number.isNaN(num)) {
					sequence = num + 1;
				}
			}
		}

		return `${prefix}${String(sequence).padStart(4, "0")}`;
	}

	private mapTicket(t: any): TicketDto {
		return {
			id: t.tic_id,
			folio: t.tic_folio,
			titulo: t.tic_titulo,
			descripcion: t.tic_descripcion,
			sistemaId: t.tic_fksistema,
			sistemaNombre: t.sistema?.sis_nombre,
			areaId: t.tic_fkarea,
			areaNombre: t.area?.are_nombre,
			usuarioId: t.tic_fkusuario,
			usuarioNombre: t.usuario
				? `${t.usuario.usu_nombre} ${t.usuario.usu_apellido}`.trim()
				: undefined,
			prioridadId: t.tic_fkprioridad,
			prioridadCodigo: t.prioridad?.pri_codigo,
			prioridadNombre: t.prioridad?.pri_nombre,
			solicitudId: t.tic_fksolicitud,
			solicitudCodigo: t.solicitud?.sol_codigo,
			solicitudNombre: t.solicitud?.sol_nombre,
			faseId: t.tic_fkfase,
			faseCodigo: t.fase?.fas_codigo,
			faseNombre: t.fase?.fas_nombre,
			constanciaId: t.tic_fkconstancia,
			constanciaCodigo: t.constancia?.con_codigo,
			constanciaNombre: t.constancia?.con_nombre,
			registro: t.tic_registro,
			actualizacion: t.tic_actualizacion,
			asignaciones: t.asignacion?.map((a: any) => ({
				id: a.asi_id,
				ticketId: a.asi_fkticket,
				usuarioId: a.asi_fkusuario,
				usuarioNombre: a.usuario_asignacion_asi_fkusuarioTousuario
					? `${a.usuario_asignacion_asi_fkusuarioTousuario.usu_nombre} ${a.usuario_asignacion_asi_fkusuarioTousuario.usu_apellido}`.trim()
					: undefined,
				usuarioEmail: a.usuario_asignacion_asi_fkusuarioTousuario?.usu_correo,
				usuarioAsignaId: a.asi_fkusuario_asigna,
				usuarioAsignaNombre: a.usuario_asignacion_asi_fkusuario_asignaTousuario
					? `${a.usuario_asignacion_asi_fkusuario_asignaTousuario.usu_nombre} ${a.usuario_asignacion_asi_fkusuario_asignaTousuario.usu_apellido}`.trim()
					: undefined,
				estadoId: a.asi_fkestado,
				estadoNombre: a.estado?.est_nombre,
				principal: Boolean(a.asi_principal),
				fecha: a.asi_fecha,
				fin: a.asi_fin,
			})),
			atenciones: t.atencion?.map((at: any) => ({
				id: at.ate_id,
				ticketId: at.ate_fkticket,
				ciclo: at.ate_ciclo,
				inicio: at.ate_inicio,
				diagnostico: at.ate_diagnostico,
				solucion: at.ate_solucion,
				cambios: at.ate_cambios,
				modulos: at.ate_modulos,
				datos: at.ate_datos,
				comentarios: at.ate_comentarios,
				termino: at.termino
					? {
							id: at.termino.ter_id,
							atencionId: at.termino.ter_fkatencion,
							usuarioId: at.termino.ter_fkusuario,
							usuarioNombre: at.termino.usuario
								? `${at.termino.usuario.usu_nombre} ${at.termino.usuario.usu_apellido}`.trim()
								: undefined,
							fecha: at.termino.ter_fecha,
						}
					: null,
				evaluacion: at.evaluacion
					? {
							id: at.evaluacion.eva_id,
							ticketId: at.evaluacion.eva_fkticket,
							atencionId: at.evaluacion.eva_fkatencion,
							usuarioId: at.evaluacion.eva_fkusuario,
							usuarioNombre: at.evaluacion.usuario
								? `${at.evaluacion.usuario.usu_nombre} ${at.evaluacion.usuario.usu_apellido}`.trim()
								: undefined,
							calificacion: at.evaluacion.eva_calificacion,
							confirmacion: Boolean(at.evaluacion.eva_confirmacion),
							conformidad: at.evaluacion.eva_conformidad,
							inconformidad: at.evaluacion.eva_inconformidad,
							fecha: at.evaluacion.eva_fecha,
						}
					: null,
				cierre: at.cierre
					? {
							id: at.cierre.cie_id,
							ticketId: at.cierre.cie_fkticket,
							atencionId: at.cierre.cie_fkatencion,
							usuarioId: at.cierre.cie_fkusuario,
							usuarioNombre: at.cierre.usuario
								? `${at.cierre.usuario.usu_nombre} ${at.cierre.usuario.usu_apellido}`.trim()
								: undefined,
							comentario: at.cierre.cie_comentario,
							fecha: at.cierre.cie_fecha,
						}
					: null,
				intervenciones: at.intervencion?.map((i: any) => ({
					id: i.int_id,
					atencionId: i.int_fkatencion,
					usuarioId: i.int_fkusuario,
					usuarioNombre: i.usuario
						? `${i.usuario.usu_nombre} ${i.usuario.usu_apellido}`.trim()
						: undefined,
					descripcion: i.int_descripcion,
					minutos: i.int_minutos,
					interno: Boolean(i.int_interno),
					fecha: i.int_fecha,
				})),
				evidencias: at.evidencia?.map((e: any) => ({
					id: e.evi_id,
					ticketId: e.evi_fkticket,
					atencionId: e.evi_fkatencion,
					reaperturaId: e.evi_fkreapertura,
					claseId: e.evi_fkclase,
					claseCodigo: e.clase?.cla_codigo,
					usuarioId: e.evi_fkusuario,
					nombre: e.evi_nombre,
					ruta: e.evi_ruta,
					formato: e.evi_formato,
					tamano: e.evi_tamano,
					descripcion: e.evi_descripcion,
					fecha: e.evi_fecha,
				})),
			})),
			transiciones: t.transicion?.map((tr: any) => ({
				id: tr.tra_id,
				ticketId: tr.tra_fkticket,
				faseOrigenId: tr.tra_fkfase_origen,
				faseOrigenNombre:
					tr.fase_transicion_tra_fkfase_origenTofase?.fas_nombre,
				faseDestinoId: tr.tra_fkfase_destino,
				faseDestinoNombre:
					tr.fase_transicion_tra_fkfase_destinoTofase?.fas_nombre,
				usuarioId: tr.tra_fkusuario,
				usuarioNombre: tr.usuario
					? `${tr.usuario.usu_nombre} ${tr.usuario.usu_apellido}`.trim()
					: undefined,
				comentario: tr.tra_comentario,
				fecha: tr.tra_fecha,
			})),
			movimientos: t.movimiento?.map((m: any) => ({
				id: m.mov_id,
				ticketId: m.mov_fkticket,
				sistemaOrigenId: m.mov_fksistema_origen,
				sistemaOrigenNombre:
					m.sistema_movimiento_mov_fksistema_origenTosistema?.sis_nombre,
				sistemaDestinoId: m.mov_fksistema_destino,
				sistemaDestinoNombre:
					m.sistema_movimiento_mov_fksistema_destinoTosistema?.sis_nombre,
				usuarioId: m.mov_fkusuario,
				usuarioNombre: m.usuario
					? `${m.usuario.usu_nombre} ${m.usuario.usu_apellido}`.trim()
					: undefined,
				motivo: m.mov_motivo,
				fecha: m.mov_fecha,
			})),
		};
	}

	// ----------------- CONSULTAS -----------------

	async findAll(filters?: {
		sistemaId?: number;
		faseId?: number;
		usuarioId?: number;
	}): Promise<TicketDto[]> {
		const records = await prisma.ticket.findMany({
			where: {
				...(filters?.sistemaId && { tic_fksistema: filters.sistemaId }),
				...(filters?.faseId && { tic_fkfase: filters.faseId }),
				...(filters?.usuarioId && { tic_fkusuario: filters.usuarioId }),
			},
			orderBy: { tic_id: "desc" },
			include: {
				sistema: true,
				area: true,
				usuario: true,
				prioridad: true,
				solicitud: true,
				fase: true,
				constancia: true,
				asignacion: {
					include: {
						usuario_asignacion_asi_fkusuarioTousuario: true,
						usuario_asignacion_asi_fkusuario_asignaTousuario: true,
						estado: true,
					},
					orderBy: { asi_id: "desc" },
				},
				atencion: {
					include: {
						termino: { include: { usuario: true } },
						evaluacion: { include: { usuario: true } },
						cierre: { include: { usuario: true } },
						intervencion: { include: { usuario: true } },
						evidencia: { include: { clase: true } },
					},
					orderBy: { ate_ciclo: "desc" },
				},
			},
		});

		return records.map((r) => this.mapTicket(r));
	}

	async findById(id: number): Promise<TicketDto> {
		const record = await prisma.ticket.findUnique({
			where: { tic_id: id },
			include: {
				sistema: true,
				area: true,
				usuario: true,
				prioridad: true,
				solicitud: true,
				fase: true,
				constancia: true,
				asignacion: {
					include: {
						usuario_asignacion_asi_fkusuarioTousuario: true,
						usuario_asignacion_asi_fkusuario_asignaTousuario: true,
						estado: true,
					},
					orderBy: { asi_id: "desc" },
				},
				atencion: {
					include: {
						termino: { include: { usuario: true } },
						evaluacion: { include: { usuario: true } },
						cierre: { include: { usuario: true } },
						intervencion: {
							include: { usuario: true },
							orderBy: { int_id: "asc" },
						},
						evidencia: { include: { clase: true }, orderBy: { evi_id: "asc" } },
					},
					orderBy: { ate_ciclo: "asc" },
				},
				transicion: {
					include: {
						fase_transicion_tra_fkfase_origenTofase: true,
						fase_transicion_tra_fkfase_destinoTofase: true,
						usuario: true,
					},
					orderBy: { tra_id: "asc" },
				},
				movimiento: {
					include: {
						sistema_movimiento_mov_fksistema_origenTosistema: true,
						sistema_movimiento_mov_fksistema_destinoTosistema: true,
						usuario: true,
					},
					orderBy: { mov_id: "asc" },
				},
			},
		});

		if (!record) {
			throw new BaseError(`Ticket con ID ${id} no encontrado`, 404);
		}

		return this.mapTicket(record);
	}

	// ----------------- CREACIÓN DE TICKET -----------------

	async create(dto: CreateTicketDto, actorId: number): Promise<TicketDto> {
		// Validar fase 'REGISTRADO' y constancia 'NO_APLICA'
		const faseRegistrado = await prisma.fase.findUnique({
			where: { fas_codigo: "REGISTRADO" },
		});
		if (!faseRegistrado) {
			throw new BaseError(
				"Fase 'REGISTRADO' no encontrada en el catálogo",
				500,
			);
		}

		const constanciaNoAplica = await prisma.constancia.findUnique({
			where: { con_codigo: "NO_APLICA" },
		});
		if (!constanciaNoAplica) {
			throw new BaseError(
				"Constancia 'NO_APLICA' no encontrada en el catálogo",
				500,
			);
		}

		const folio = await this.generateFolio();

		const record = await prisma.ticket.create({
			data: {
				tic_folio: folio,
				tic_titulo: dto.titulo,
				tic_descripcion: dto.descripcion,
				tic_fksistema: dto.sistemaId,
				tic_fkarea: dto.areaId,
				tic_fkusuario: actorId,
				tic_fkprioridad: dto.prioridadId,
				tic_fksolicitud: dto.solicitudId,
				tic_fkfase: faseRegistrado.fas_id,
				tic_fkconstancia: constanciaNoAplica.con_id,
			},
			include: {
				sistema: true,
				area: true,
				usuario: true,
				prioridad: true,
				solicitud: true,
				fase: true,
				constancia: true,
			},
		});

		return this.mapTicket(record);
	}

	// ----------------- ASIGNACIÓN Y REASIGNACIÓN -----------------

	async assign(dto: AssignTicketDto, actorId: number): Promise<AsignacionDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: dto.ticketId },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${dto.ticketId} no encontrado`, 404);
		}

		const isPrincipal = dto.principal ?? true;
		const now = new Date();

		// Si es asignado como principal, finalizar cualquier principal previo vigente de este ticket
		if (isPrincipal) {
			await prisma.asignacion.updateMany({
				where: {
					asi_fkticket: dto.ticketId,
					asi_principal: true,
					asi_fin: null,
				},
				data: {
					asi_fin: now,
					asi_fkestado: 2, // Inactivo
				},
			});
		}

		const record = await prisma.asignacion.create({
			data: {
				asi_fkticket: dto.ticketId,
				asi_fkusuario: dto.usuarioId,
				asi_fkestado: 1, // Activo
				asi_fkusuario_asigna: actorId,
				asi_principal: isPrincipal,
				asi_fecha: now,
				asi_fin: null,
			},
			include: {
				usuario_asignacion_asi_fkusuarioTousuario: true,
				usuario_asignacion_asi_fkusuario_asignaTousuario: true,
				estado: true,
			},
		});

		// Si el ticket estaba en 'REGISTRADO', actualizar a 'ASIGNADO' y registrar transición
		if (ticket.fase.fas_codigo === "REGISTRADO") {
			const faseAsignado = await prisma.fase.findUnique({
				where: { fas_codigo: "ASIGNADO" },
			});
			if (faseAsignado) {
				await prisma.ticket.update({
					where: { tic_id: dto.ticketId },
					data: { tic_fkfase: faseAsignado.fas_id },
				});
				await prisma.transicion.create({
					data: {
						tra_fkticket: dto.ticketId,
						tra_fkfase_origen: ticket.tic_fkfase,
						tra_fkfase_destino: faseAsignado.fas_id,
						tra_fkusuario: actorId,
						tra_comentario: "Ticket asignado a desarrollador",
					},
				});
			}
		}

		return {
			id: record.asi_id,
			ticketId: record.asi_fkticket,
			usuarioId: record.asi_fkusuario,
			usuarioNombre:
				`${record.usuario_asignacion_asi_fkusuarioTousuario.usu_nombre} ${record.usuario_asignacion_asi_fkusuarioTousuario.usu_apellido}`.trim(),
			usuarioEmail: record.usuario_asignacion_asi_fkusuarioTousuario.usu_correo,
			usuarioAsignaId: record.asi_fkusuario_asigna,
			usuarioAsignaNombre:
				`${record.usuario_asignacion_asi_fkusuario_asignaTousuario.usu_nombre} ${record.usuario_asignacion_asi_fkusuario_asignaTousuario.usu_apellido}`.trim(),
			estadoId: record.asi_fkestado,
			estadoNombre: record.estado.est_nombre,
			principal: record.asi_principal,
			fecha: record.asi_fecha,
			fin: record.asi_fin,
		};
	}

	async reassign(
		dto: ReassignTicketDto,
		actorId: number,
	): Promise<{ asignacionAnterior: number; asignacionNueva: number }> {
		const result: any = await prisma.$queryRawUnsafe(
			`CALL sisat_reasignar_ticket(?, ?, ?, ?, ?)`,
			dto.ticketId,
			dto.usuarioOrigenId,
			dto.usuarioDestinoId,
			actorId,
			dto.motivo,
		);

		return {
			asignacionAnterior: result[0]?.asignacion_anterior ?? 0,
			asignacionNueva: result[0]?.asignacion_nueva ?? 0,
		};
	}

	// ----------------- ATENCIÓN TÉCNICA Y CICLOS -----------------

	async startAtencion(
		dto: CreateAtencionDto,
		actorId: number,
	): Promise<AtencionDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: dto.ticketId },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${dto.ticketId} no encontrado`, 404);
		}

		// Determinar siguiente ciclo
		const lastAtencion = await prisma.atencion.findFirst({
			where: { ate_fkticket: dto.ticketId },
			orderBy: { ate_ciclo: "desc" },
		});
		const nextCiclo =
			dto.ciclo ?? (lastAtencion ? lastAtencion.ate_ciclo + 1 : 1);

		const record = await prisma.atencion.create({
			data: {
				ate_fkticket: dto.ticketId,
				ate_ciclo: nextCiclo,
				ate_inicio: new Date(),
				ate_diagnostico: dto.diagnostico ?? null,
			},
		});

		// Actualizar fase a 'EN_PROCESO' si corresponde
		const faseEnProceso = await prisma.fase.findUnique({
			where: { fas_codigo: "EN_PROCESO" },
		});
		if (faseEnProceso && ticket.fase.fas_codigo !== "EN_PROCESO") {
			await prisma.ticket.update({
				where: { tic_id: dto.ticketId },
				data: { tic_fkfase: faseEnProceso.fas_id },
			});
			await prisma.transicion.create({
				data: {
					tra_fkticket: dto.ticketId,
					tra_fkfase_origen: ticket.tic_fkfase,
					tra_fkfase_destino: faseEnProceso.fas_id,
					tra_fkusuario: actorId,
					tra_comentario: `Inicio de ciclo de atención #${nextCiclo}`,
				},
			});
		}

		return {
			id: record.ate_id,
			ticketId: record.ate_fkticket,
			ciclo: record.ate_ciclo,
			inicio: record.ate_inicio,
			diagnostico: record.ate_diagnostico,
			solucion: record.ate_solucion,
			cambios: record.ate_cambios,
			modulos: record.ate_modulos,
			datos: record.ate_datos,
			comentarios: record.ate_comentarios,
		};
	}

	async createIntervencion(
		dto: CreateIntervencionDto,
		actorId: number,
	): Promise<IntervencionDto> {
		const atencion = await prisma.atencion.findUnique({
			where: { ate_id: dto.atencionId },
		});
		if (!atencion) {
			throw new BaseError(
				`Atención con ID ${dto.atencionId} no encontrada`,
				404,
			);
		}

		const record = await prisma.intervencion.create({
			data: {
				int_fkatencion: dto.atencionId,
				int_fkusuario: actorId,
				int_descripcion: dto.descripcion,
				int_minutos: dto.minutos,
				int_interno: dto.interno ?? false,
			},
			include: { usuario: true },
		});

		return {
			id: record.int_id,
			atencionId: record.int_fkatencion,
			usuarioId: record.int_fkusuario,
			usuarioNombre:
				`${record.usuario.usu_nombre} ${record.usuario.usu_apellido}`.trim(),
			descripcion: record.int_descripcion,
			minutos: record.int_minutos,
			interno: record.int_interno,
			fecha: record.int_fecha,
		};
	}

	async createEvidencia(
		dto: CreateEvidenciaDto,
		actorId: number,
	): Promise<EvidenciaDto> {
		const record = await prisma.evidencia.create({
			data: {
				evi_fkticket: dto.ticketId,
				evi_fkatencion: dto.atencionId ?? null,
				evi_fkreapertura: dto.reaperturaId ?? null,
				evi_fkclase: dto.claseId,
				evi_fkusuario: actorId,
				evi_nombre: dto.nombre,
				evi_ruta: dto.ruta,
				evi_formato: dto.formato,
				evi_tamano: dto.tamano,
				evi_descripcion: dto.descripcion ?? null,
			},
			include: { clase: true },
		});

		return {
			id: record.evi_id,
			ticketId: record.evi_fkticket,
			atencionId: record.evi_fkatencion,
			reaperturaId: record.evi_fkreapertura,
			claseId: record.evi_fkclase,
			claseCodigo: record.clase.cla_codigo,
			usuarioId: record.evi_fkusuario,
			nombre: record.evi_nombre,
			ruta: record.evi_ruta,
			formato: record.evi_formato,
			tamano: record.evi_tamano,
			descripcion: record.evi_descripcion,
			fecha: record.evi_fecha,
		};
	}

	async endAtencion(
		dto: TerminarAtencionDto,
		actorId: number,
	): Promise<AtencionDto> {
		const atencion = await prisma.atencion.findUnique({
			where: { ate_id: dto.atencionId },
			include: { ticket: { include: { fase: true } } },
		});
		if (!atencion) {
			throw new BaseError(
				`Atención con ID ${dto.atencionId} no encontrada`,
				404,
			);
		}

		// Actualizar atención con solución y cambios
		await prisma.atencion.update({
			where: { ate_id: dto.atencionId },
			data: {
				ate_diagnostico: dto.diagnostico,
				ate_solucion: dto.solucion,
				...(dto.cambios !== undefined && { ate_cambios: dto.cambios }),
				...(dto.modulos !== undefined && { ate_modulos: dto.modulos }),
				...(dto.datos !== undefined && { ate_datos: dto.datos }),
				...(dto.comentarios !== undefined && {
					ate_comentarios: dto.comentarios,
				}),
			},
		});

		// Registrar término
		const now = new Date();
		const terminoRecord = await prisma.termino.create({
			data: {
				ter_fkatencion: dto.atencionId,
				ter_fkusuario: actorId,
				ter_fecha: now,
			},
			include: { usuario: true },
		});

		// Actualizar fase a 'RESUELTO_POR_DESARROLLO' y constancia a 'PENDIENTE_DE_ACTA'
		const faseResuelto = await prisma.fase.findUnique({
			where: { fas_codigo: "RESUELTO_POR_DESARROLLO" },
		});
		const constanciaPendiente = await prisma.constancia.findUnique({
			where: { con_codigo: "PENDIENTE_DE_ACTA" },
		});
		if (faseResuelto) {
			await prisma.ticket.update({
				where: { tic_id: atencion.ate_fkticket },
				data: {
					tic_fkfase: faseResuelto.fas_id,
					...(constanciaPendiente && {
						tic_fkconstancia: constanciaPendiente.con_id,
					}),
				},
			});
			await prisma.transicion.create({
				data: {
					tra_fkticket: atencion.ate_fkticket,
					tra_fkfase_origen: atencion.ticket.tic_fkfase,
					tra_fkfase_destino: faseResuelto.fas_id,
					tra_fkusuario: actorId,
					tra_comentario: "Atención finalizada y resuelta por desarrollo",
				},
			});
		}

		return {
			id: atencion.ate_id,
			ticketId: atencion.ate_fkticket,
			ciclo: atencion.ate_ciclo,
			inicio: atencion.ate_inicio,
			diagnostico: dto.diagnostico,
			solucion: dto.solucion,
			cambios: dto.cambios ?? atencion.ate_cambios,
			modulos: dto.modulos ?? atencion.ate_modulos,
			datos: dto.datos ?? atencion.ate_datos,
			comentarios: dto.comentarios ?? atencion.ate_comentarios,
			termino: {
				id: terminoRecord.ter_id,
				atencionId: terminoRecord.ter_fkatencion,
				usuarioId: terminoRecord.ter_fkusuario,
				usuarioNombre:
					`${terminoRecord.usuario.usu_nombre} ${terminoRecord.usuario.usu_apellido}`.trim(),
				fecha: terminoRecord.ter_fecha,
			},
		};
	}

	// ----------------- EVALUACIÓN Y CIERRE -----------------

	async createEvaluacion(
		dto: CreateEvaluacionDto,
		actorId: number,
	): Promise<EvaluacionDto> {
		const record = await prisma.evaluacion.create({
			data: {
				eva_fkticket: dto.ticketId,
				eva_fkatencion: dto.atencionId,
				eva_fkusuario: actorId,
				eva_calificacion: dto.calificacion,
				eva_confirmacion: dto.confirmacion,
				eva_conformidad: dto.conformidad ?? null,
				eva_inconformidad: dto.inconformidad ?? null,
			},
			include: { usuario: true },
		});

		return {
			id: record.eva_id,
			ticketId: record.eva_fkticket,
			atencionId: record.eva_fkatencion,
			usuarioId: record.eva_fkusuario,
			usuarioNombre:
				`${record.usuario.usu_nombre} ${record.usuario.usu_apellido}`.trim(),
			calificacion: record.eva_calificacion,
			confirmacion: record.eva_confirmacion,
			conformidad: record.eva_conformidad,
			inconformidad: record.eva_inconformidad,
			fecha: record.eva_fecha,
		};
	}

	async closeTicket(dto: CreateCierreDto, actorId: number): Promise<CierreDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: dto.ticketId },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${dto.ticketId} no encontrado`, 404);
		}

		const record = await prisma.cierre.create({
			data: {
				cie_fkticket: dto.ticketId,
				cie_fkatencion: dto.atencionId,
				cie_fkusuario: actorId,
				cie_comentario: dto.comentario ?? null,
			},
			include: { usuario: true },
		});

		// Actualizar fase a 'CERRADO_POR_RESPONSABLE' y constancia a 'PENDIENTE_DE_ACTA'
		const faseCerrado = await prisma.fase.findUnique({
			where: { fas_codigo: "CERRADO_POR_RESPONSABLE" },
		});
		const constanciaPendiente = await prisma.constancia.findUnique({
			where: { con_codigo: "PENDIENTE_DE_ACTA" },
		});
		if (faseCerrado) {
			await prisma.ticket.update({
				where: { tic_id: dto.ticketId },
				data: {
					tic_fkfase: faseCerrado.fas_id,
					...(constanciaPendiente && {
						tic_fkconstancia: constanciaPendiente.con_id,
					}),
				},
			});
			await prisma.transicion.create({
				data: {
					tra_fkticket: dto.ticketId,
					tra_fkfase_origen: ticket.tic_fkfase,
					tra_fkfase_destino: faseCerrado.fas_id,
					tra_fkusuario: actorId,
					tra_comentario:
						dto.comentario ??
						"Ticket cerrado satisfactoriamente por responsable",
				},
			});
		}

		return {
			id: record.cie_id,
			ticketId: record.cie_fkticket,
			atencionId: record.cie_fkatencion,
			usuarioId: record.cie_fkusuario,
			usuarioNombre:
				`${record.usuario.usu_nombre} ${record.usuario.usu_apellido}`.trim(),
			comentario: record.cie_comentario,
			fecha: record.cie_fecha,
		};
	}

	async reopenTicket(
		dto: CreateReaperturaDto,
		actorId: number,
	): Promise<TicketDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: dto.ticketId },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${dto.ticketId} no encontrado`, 404);
		}

		// Crear atención destino consecutiva
		const atencionOrigen = await prisma.atencion.findUnique({
			where: { ate_id: dto.atencionOrigenId },
		});
		if (!atencionOrigen) {
			throw new BaseError(
				`Atención de origen con ID ${dto.atencionOrigenId} no encontrada`,
				404,
			);
		}

		const atencionDestino = await prisma.atencion.create({
			data: {
				ate_fkticket: dto.ticketId,
				ate_ciclo: atencionOrigen.ate_ciclo + 1,
				ate_inicio: new Date(),
			},
		});

		await prisma.reapertura.create({
			data: {
				rea_fkticket: dto.ticketId,
				rea_fkatencion_origen: dto.atencionOrigenId,
				rea_fkatencion_destino: atencionDestino.ate_id,
				rea_fkusuario: actorId,
				rea_motivo: dto.motivo,
				rea_comentario: dto.comentario ?? null,
			},
		});

		// Actualizar fase a 'REABIERTO'
		const faseReabierto = await prisma.fase.findUnique({
			where: { fas_codigo: "REABIERTO" },
		});
		if (faseReabierto) {
			await prisma.ticket.update({
				where: { tic_id: dto.ticketId },
				data: { tic_fkfase: faseReabierto.fas_id },
			});
			await prisma.transicion.create({
				data: {
					tra_fkticket: dto.ticketId,
					tra_fkfase_origen: ticket.tic_fkfase,
					tra_fkfase_destino: faseReabierto.fas_id,
					tra_fkusuario: actorId,
					tra_comentario: `Reapertura: ${dto.motivo}`,
				},
			});
		}

		return this.findById(dto.ticketId);
	}

	// ----------------- TRANSFERENCIA ENTRE SISTEMAS -----------------

	async moveTicket(dto: MoveTicketDto, actorId: number): Promise<TicketDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: dto.ticketId },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${dto.ticketId} no encontrado`, 404);
		}

		if (ticket.tic_fksistema === dto.sistemaDestinoId) {
			throw new BaseError(
				"El sistema de destino debe ser diferente al sistema actual",
				400,
			);
		}

		const sistemaDestino = await prisma.sistema.findUnique({
			where: { sis_id: dto.sistemaDestinoId },
		});
		if (!sistemaDestino) {
			throw new BaseError(
				`El sistema de destino con ID ${dto.sistemaDestinoId} no existe`,
				404,
			);
		}

		const now = new Date();

		// Finalizar cualquier asignación activa del sistema previo
		await prisma.asignacion.updateMany({
			where: {
				asi_fkticket: dto.ticketId,
				asi_fin: null,
			},
			data: {
				asi_fin: now,
				asi_fkestado: 2, // Inactivo
			},
		});

		// Registrar movimiento
		await prisma.movimiento.create({
			data: {
				mov_fkticket: dto.ticketId,
				mov_fksistema_origen: ticket.tic_fksistema,
				mov_fksistema_destino: dto.sistemaDestinoId,
				mov_fkusuario: actorId,
				mov_motivo: dto.motivo,
				mov_fecha: now,
			},
		});

		// Si el ticket estaba asignado o en proceso, retornarlo a 'REGISTRADO' en el nuevo sistema
		const faseRegistrado = await prisma.fase.findUnique({
			where: { fas_codigo: "REGISTRADO" },
		});
		const nuevaFaseId = faseRegistrado?.fas_id ?? ticket.tic_fkfase;

		await prisma.ticket.update({
			where: { tic_id: dto.ticketId },
			data: {
				tic_fksistema: dto.sistemaDestinoId,
				tic_fkarea: sistemaDestino.sis_fkarea,
				tic_fkfase: nuevaFaseId,
				tic_actualizacion: now,
			},
		});

		if (faseRegistrado && ticket.tic_fkfase !== faseRegistrado.fas_id) {
			await prisma.transicion.create({
				data: {
					tra_fkticket: dto.ticketId,
					tra_fkfase_origen: ticket.tic_fkfase,
					tra_fkfase_destino: faseRegistrado.fas_id,
					tra_fkusuario: actorId,
					tra_comentario: `Transferido al sistema ${sistemaDestino.sis_nombre}: ${dto.motivo}`,
				},
			});
		}

		return this.findById(dto.ticketId);
	}

	// ----------------- FASES: PAUSA, REANUDAR, CANCELAR -----------------

	async pauseTicket(
		id: number,
		motivo: string,
		actorId: number,
	): Promise<TicketDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: id },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${id} no encontrado`, 404);
		}

		const fasePausa = await prisma.fase.findUnique({
			where: { fas_codigo: "EN_ESPERA_DE_INFORMACION" },
		});
		if (!fasePausa) {
			throw new BaseError("Fase EN_ESPERA_DE_INFORMACION no encontrada", 500);
		}

		await prisma.ticket.update({
			where: { tic_id: id },
			data: {
				tic_fkfase: fasePausa.fas_id,
				tic_actualizacion: new Date(),
			},
		});

		await prisma.transicion.create({
			data: {
				tra_fkticket: id,
				tra_fkfase_origen: ticket.tic_fkfase,
				tra_fkfase_destino: fasePausa.fas_id,
				tra_fkusuario: actorId,
				tra_comentario: `En espera de información: ${motivo}`,
			},
		});

		return this.findById(id);
	}

	async resumeTicket(id: number, actorId: number): Promise<TicketDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: id },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${id} no encontrado`, 404);
		}

		const faseEnProceso = await prisma.fase.findUnique({
			where: { fas_codigo: "EN_PROCESO" },
		});
		if (!faseEnProceso) {
			throw new BaseError("Fase EN_PROCESO no encontrada", 500);
		}

		await prisma.ticket.update({
			where: { tic_id: id },
			data: {
				tic_fkfase: faseEnProceso.fas_id,
				tic_actualizacion: new Date(),
			},
		});

		await prisma.transicion.create({
			data: {
				tra_fkticket: id,
				tra_fkfase_origen: ticket.tic_fkfase,
				tra_fkfase_destino: faseEnProceso.fas_id,
				tra_fkusuario: actorId,
				tra_comentario: "Reanudación de atención técnica",
			},
		});

		return this.findById(id);
	}

	async cancelTicket(
		id: number,
		motivo: string,
		actorId: number,
	): Promise<TicketDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: id },
			include: { fase: true },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${id} no encontrado`, 404);
		}

		if (ticket.fase.fas_codigo === "CERRADO_POR_RESPONSABLE") {
			throw new BaseError(
				"No se puede cancelar un ticket que ya fue cerrado formalmente",
				400,
			);
		}

		const faseCancelado = await prisma.fase.findUnique({
			where: { fas_codigo: "CANCELADO" },
		});
		if (!faseCancelado) {
			throw new BaseError("Fase CANCELADO no encontrada", 500);
		}

		const now = new Date();

		// Finalizar asignaciones vigentes
		await prisma.asignacion.updateMany({
			where: { asi_fkticket: id, asi_fin: null },
			data: { asi_fin: now, asi_fkestado: 2 },
		});

		await prisma.ticket.update({
			where: { tic_id: id },
			data: {
				tic_fkfase: faseCancelado.fas_id,
				tic_actualizacion: now,
			},
		});

		await prisma.transicion.create({
			data: {
				tra_fkticket: id,
				tra_fkfase_origen: ticket.tic_fkfase,
				tra_fkfase_destino: faseCancelado.fas_id,
				tra_fkusuario: actorId,
				tra_comentario: `Ticket cancelado: ${motivo}`,
			},
		});

		return this.findById(id);
	}

	async update(id: number, dto: UpdateTicketDto): Promise<TicketDto> {
		const ticket = await prisma.ticket.findUnique({
			where: { tic_id: id },
		});
		if (!ticket) {
			throw new BaseError(`Ticket con ID ${id} no encontrado`, 404);
		}

		await prisma.ticket.update({
			where: { tic_id: id },
			data: {
				...(dto.titulo && { tic_titulo: dto.titulo }),
				...(dto.descripcion && { tic_descripcion: dto.descripcion }),
				...(dto.prioridadId && { tic_fkprioridad: dto.prioridadId }),
				...(dto.areaId && { tic_fkarea: dto.areaId }),
				...(dto.solicitudId && { tic_fksolicitud: dto.solicitudId }),
				tic_actualizacion: new Date(),
			},
		});

		return this.findById(id);
	}
}
