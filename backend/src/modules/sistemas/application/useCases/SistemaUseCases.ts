import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type {
	SistemaDto,
	CreateSistemaDto,
	UpdateSistemaDto,
	ResponsableDto,
	AssignResponsableDto,
	EndResponsableDto,
	DesarrolladorDto,
	AssignDesarrolladorDto,
	EndDesarrolladorDto,
} from "../dtos/SistemaDto";
import { BaseError } from "@/core/shared/domain/error/BaseError";

@injectable()
export class SistemaUseCases {
	private mapResponsable(r: any): ResponsableDto {
		return {
			id: r.res_id,
			sistemaId: r.res_fksistema,
			usuarioId: r.res_fkusuario,
			usuarioNombre: r.usuario
				? `${r.usuario.usu_nombre} ${r.usuario.usu_apellido}`.trim()
				: undefined,
			usuarioEmail: r.usuario?.usu_correo,
			estadoId: r.res_fkestado,
			estadoNombre: r.estado?.est_nombre,
			principal: Boolean(r.res_principal),
			inicio: r.res_inicio,
			fin: r.res_fin,
		};
	}

	private mapDesarrollador(d: any): DesarrolladorDto {
		return {
			id: d.des_id,
			sistemaId: d.des_fksistema,
			usuarioId: d.des_fkusuario,
			usuarioNombre: d.usuario
				? `${d.usuario.usu_nombre} ${d.usuario.usu_apellido}`.trim()
				: undefined,
			usuarioEmail: d.usuario?.usu_correo,
			estadoId: d.des_fkestado,
			estadoNombre: d.estado?.est_nombre,
			inicio: d.des_inicio,
			fin: d.des_fin,
		};
	}

	private mapSistema(s: any): SistemaDto {
		return {
			id: s.sis_id,
			areaId: s.sis_fkarea,
			areaNombre: s.area?.are_nombre,
			estadoId: s.sis_fkestado,
			estadoNombre: s.estado?.est_nombre,
			clave: s.sis_clave,
			nombre: s.sis_nombre,
			descripcion: s.sis_descripcion,
			url: s.sis_url,
			observacion: s.sis_observacion,
			registro: s.sis_registro,
			actualizacion: s.sis_actualizacion,
			responsables: s.responsable
				? s.responsable.map((r: any) => this.mapResponsable(r))
				: undefined,
			desarrolladores: s.desarrollador
				? s.desarrollador.map((d: any) => this.mapDesarrollador(d))
				: undefined,
		};
	}

	// ----------------- CRUD SISTEMAS -----------------

	async findAll(): Promise<SistemaDto[]> {
		const records = await prisma.sistema.findMany({
			orderBy: { sis_id: "asc" },
			include: {
				area: true,
				estado: true,
				responsable: {
					include: { usuario: true, estado: true },
					where: { res_fkestado: 1 },
				},
				desarrollador: {
					include: { usuario: true, estado: true },
					where: { des_fkestado: 1 },
				},
			},
		});
		return records.map((r) => this.mapSistema(r));
	}

	async findById(id: number): Promise<SistemaDto> {
		const record = await prisma.sistema.findUnique({
			where: { sis_id: id },
			include: {
				area: true,
				estado: true,
				responsable: {
					include: { usuario: true, estado: true },
					orderBy: { res_inicio: "desc" },
				},
				desarrollador: {
					include: { usuario: true, estado: true },
					orderBy: { des_inicio: "desc" },
				},
			},
		});
		if (!record) {
			throw new BaseError(`Sistema con ID ${id} no encontrado`, 404);
		}
		return this.mapSistema(record);
	}

	async create(dto: CreateSistemaDto): Promise<SistemaDto> {
		const existingClave = await prisma.sistema.findUnique({
			where: { sis_clave: dto.clave },
		});
		if (existingClave) {
			throw new BaseError(
				`Ya existe un sistema con la clave '${dto.clave}'`,
				400,
			);
		}

		// Validar área existente
		const area = await prisma.area.findUnique({
			where: { are_id: dto.areaId },
		});
		if (!area) {
			throw new BaseError(`El área con ID ${dto.areaId} no existe`, 404);
		}

		const record = await prisma.sistema.create({
			data: {
				sis_clave: dto.clave,
				sis_nombre: dto.nombre,
				sis_descripcion: dto.descripcion,
				sis_url: dto.url ?? null,
				sis_observacion: dto.observacion ?? null,
				sis_fkarea: dto.areaId,
				sis_fkestado: dto.estadoId ?? 1,
			},
			include: { area: true, estado: true },
		});

		return this.mapSistema(record);
	}

	async update(id: number, dto: UpdateSistemaDto): Promise<SistemaDto> {
		const existing = await prisma.sistema.findUnique({
			where: { sis_id: id },
		});
		if (!existing) {
			throw new BaseError(`Sistema con ID ${id} no encontrado`, 404);
		}

		if (dto.clave && dto.clave !== existing.sis_clave) {
			const duplicate = await prisma.sistema.findUnique({
				where: { sis_clave: dto.clave },
			});
			if (duplicate) {
				throw new BaseError(
					`Ya existe un sistema con la clave '${dto.clave}'`,
					400,
				);
			}
		}

		if (dto.areaId && dto.areaId !== existing.sis_fkarea) {
			const area = await prisma.area.findUnique({
				where: { are_id: dto.areaId },
			});
			if (!area) {
				throw new BaseError(`El área con ID ${dto.areaId} no existe`, 404);
			}
		}

		const record = await prisma.sistema.update({
			where: { sis_id: id },
			data: {
				...(dto.clave && { sis_clave: dto.clave }),
				...(dto.nombre && { sis_nombre: dto.nombre }),
				...(dto.descripcion && { sis_descripcion: dto.descripcion }),
				...(dto.url !== undefined && { sis_url: dto.url }),
				...(dto.observacion !== undefined && {
					sis_observacion: dto.observacion,
				}),
				...(dto.areaId && { sis_fkarea: dto.areaId }),
				...(dto.estadoId && { sis_fkestado: dto.estadoId }),
			},
			include: { area: true, estado: true },
		});

		return this.mapSistema(record);
	}

	// ----------------- RESPONSABLES DE SISTEMA -----------------

	async assignResponsable(dto: AssignResponsableDto): Promise<ResponsableDto> {
		const sistema = await prisma.sistema.findUnique({
			where: { sis_id: dto.sistemaId },
		});
		if (!sistema) {
			throw new BaseError(`Sistema con ID ${dto.sistemaId} no encontrado`, 404);
		}

		const usuario = await prisma.usuario.findUnique({
			where: { usu_id: dto.usuarioId },
		});
		if (!usuario) {
			throw new BaseError(`Usuario con ID ${dto.usuarioId} no encontrado`, 404);
		}

		// Verificar si ya es responsable vigente
		const vigente = await prisma.responsable.findFirst({
			where: {
				res_fksistema: dto.sistemaId,
				res_fkusuario: dto.usuarioId,
				res_fin: null,
			},
		});
		if (vigente) {
			throw new BaseError(
				`El usuario ya está asignado actualmente como responsable de este sistema`,
				400,
			);
		}

		const isPrincipal = dto.principal ?? false;
		const now = dto.inicio ?? new Date();

		// Si es asignado como principal, finalizar cualquier principal previo vigente de este sistema
		if (isPrincipal) {
			await prisma.responsable.updateMany({
				where: {
					res_fksistema: dto.sistemaId,
					res_principal: true,
					res_fin: null,
				},
				data: {
					res_fin: now,
					res_fkestado: 2, // Inactivo
				},
			});
		}

		const record = await prisma.responsable.create({
			data: {
				res_fksistema: dto.sistemaId,
				res_fkusuario: dto.usuarioId,
				res_fkestado: 1, // Activo
				res_principal: isPrincipal,
				res_inicio: now,
				res_fin: null,
			},
			include: { usuario: true, estado: true },
		});

		return this.mapResponsable(record);
	}

	async endResponsable(
		responsableId: number,
		dto?: EndResponsableDto,
	): Promise<ResponsableDto> {
		const record = await prisma.responsable.findUnique({
			where: { res_id: responsableId },
		});
		if (!record) {
			throw new BaseError(
				`Asignación de responsable con ID ${responsableId} no encontrada`,
				404,
			);
		}
		if (record.res_fin !== null || record.res_fkestado === 2) {
			throw new BaseError(`La asignación ya se encuentra finalizada`, 400);
		}

		const endDate = dto?.fin ?? new Date();
		if (endDate < record.res_inicio) {
			throw new BaseError(
				`La fecha de fin no puede ser menor a la fecha de inicio`,
				400,
			);
		}

		const updated = await prisma.responsable.update({
			where: { res_id: responsableId },
			data: {
				res_fin: endDate,
				res_fkestado: 2, // Inactivo
			},
			include: { usuario: true, estado: true },
		});

		return this.mapResponsable(updated);
	}

	// ----------------- DESARROLLADORES ASIGNADOS -----------------

	async assignDesarrollador(
		dto: AssignDesarrolladorDto,
	): Promise<DesarrolladorDto> {
		const sistema = await prisma.sistema.findUnique({
			where: { sis_id: dto.sistemaId },
		});
		if (!sistema) {
			throw new BaseError(`Sistema con ID ${dto.sistemaId} no encontrado`, 404);
		}

		const usuario = await prisma.usuario.findUnique({
			where: { usu_id: dto.usuarioId },
		});
		if (!usuario) {
			throw new BaseError(`Usuario con ID ${dto.usuarioId} no encontrado`, 404);
		}

		// Verificar si ya está asignado y vigente
		const vigente = await prisma.desarrollador.findFirst({
			where: {
				des_fksistema: dto.sistemaId,
				des_fkusuario: dto.usuarioId,
				des_fin: null,
			},
		});
		if (vigente) {
			throw new BaseError(
				`El desarrollador ya está asignado actualmente a este sistema`,
				400,
			);
		}

		const now = dto.inicio ?? new Date();

		const record = await prisma.desarrollador.create({
			data: {
				des_fksistema: dto.sistemaId,
				des_fkusuario: dto.usuarioId,
				des_fkestado: 1, // Activo
				des_inicio: now,
				des_fin: null,
			},
			include: { usuario: true, estado: true },
		});

		return this.mapDesarrollador(record);
	}

	async endDesarrollador(
		desarrolladorId: number,
		dto?: EndDesarrolladorDto,
	): Promise<DesarrolladorDto> {
		const record = await prisma.desarrollador.findUnique({
			where: { des_id: desarrolladorId },
		});
		if (!record) {
			throw new BaseError(
				`Asignación de desarrollador con ID ${desarrolladorId} no encontrada`,
				404,
			);
		}
		if (record.des_fin !== null || record.des_fkestado === 2) {
			throw new BaseError(
				`La asignación del desarrollador ya se encuentra finalizada`,
				400,
			);
		}

		const endDate = dto?.fin ?? new Date();
		if (endDate < record.des_inicio) {
			throw new BaseError(
				`La fecha de fin no puede ser menor a la fecha de inicio`,
				400,
			);
		}

		const updated = await prisma.desarrollador.update({
			where: { des_id: desarrolladorId },
			data: {
				des_fin: endDate,
				des_fkestado: 2, // Inactivo
			},
			include: { usuario: true, estado: true },
		});

		return this.mapDesarrollador(updated);
	}
}
