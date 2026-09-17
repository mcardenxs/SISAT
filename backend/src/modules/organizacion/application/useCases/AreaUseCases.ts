import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type { AreaDto, CreateAreaDto, UpdateAreaDto } from "../dtos/AreaDto";
import { BaseError } from "@/core/shared/domain/error/BaseError";

@injectable()
export class AreaUseCases {
	private toDto(record: {
		are_id: number;
		are_nombre: string;
		are_descripcion: string | null;
		are_fkestado: number;
		are_actualizacion: Date;
		estado?: { est_nombre: string };
	}): AreaDto {
		return {
			id: record.are_id,
			nombre: record.are_nombre,
			descripcion: record.are_descripcion,
			estadoId: record.are_fkestado,
			estadoNombre: record.estado?.est_nombre,
			actualizacion: record.are_actualizacion,
		};
	}

	async findAll(): Promise<AreaDto[]> {
		const records = await prisma.area.findMany({
			orderBy: { are_id: "asc" },
			include: { estado: true },
		});
		return records.map((r) => this.toDto(r));
	}

	async findById(id: number): Promise<AreaDto> {
		const record = await prisma.area.findUnique({
			where: { are_id: id },
			include: { estado: true },
		});
		if (!record) {
			throw new BaseError(`Área con ID ${id} no encontrada`, 404);
		}
		return this.toDto(record);
	}

	async create(dto: CreateAreaDto): Promise<AreaDto> {
		const existing = await prisma.area.findUnique({
			where: { are_nombre: dto.nombre },
		});
		if (existing) {
			throw new BaseError(
				`Ya existe un área con el nombre '${dto.nombre}'`,
				400,
			);
		}

		const record = await prisma.area.create({
			data: {
				are_nombre: dto.nombre,
				are_descripcion: dto.descripcion,
				are_fkestado: dto.estadoId ?? 1,
			},
			include: { estado: true },
		});

		return this.toDto(record);
	}

	async update(id: number, dto: UpdateAreaDto): Promise<AreaDto> {
		const existing = await prisma.area.findUnique({
			where: { are_id: id },
		});
		if (!existing) {
			throw new BaseError(`Área con ID ${id} no encontrada`, 404);
		}

		if (dto.nombre && dto.nombre !== existing.are_nombre) {
			const duplicate = await prisma.area.findUnique({
				where: { are_nombre: dto.nombre },
			});
			if (duplicate) {
				throw new BaseError(
					`Ya existe un área con el nombre '${dto.nombre}'`,
					400,
				);
			}
		}

		const record = await prisma.area.update({
			where: { are_id: id },
			data: {
				...(dto.nombre && { are_nombre: dto.nombre }),
				...(dto.descripcion !== undefined && {
					are_descripcion: dto.descripcion,
				}),
				...(dto.estadoId && { are_fkestado: dto.estadoId }),
			},
			include: { estado: true },
		});

		return this.toDto(record);
	}
}
