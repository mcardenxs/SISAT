import { injectable } from "tsyringe";
import type { Pagination } from "@/core/shared/domain/Pagination";
import type { UserFilters } from "../../domain/repository/UserFilters";
import type { UserRepository } from "../../domain/repository/UserRepository";
import { prisma } from "@/core/config/prisma";
import { User } from "../../domain/User";

interface PrismaUsuarioRecord {
	usu_id: number;
	usu_fkarea: number;
	usu_fkestado: number;
	usu_nombre: string;
	usu_apellido: string;
	usu_correo: string;
	usu_contrasena: string;
	usu_puesto: string;
	perfil: {
		rol: {
			rol_id: number;
			rol_codigo: string;
			rol_nombre: string;
		};
	}[];
}

@injectable()
export class PrismaUserRepository implements UserRepository {
	private toDomain(raw: PrismaUsuarioRecord): User {
		const roles = raw.perfil.map((p) => p.rol.rol_codigo);
		const primaryRole = roles[0] ?? "CONSULTA";
		const isActive = raw.usu_fkestado === 1;

		return User.reconstitute(
			raw.usu_nombre,
			raw.usu_correo,
			raw.usu_contrasena,
			isActive,
			raw.usu_id,
			primaryRole,
			raw.usu_apellido,
			raw.usu_fkarea,
			raw.usu_puesto,
			roles,
		);
	}

	async find(filters: UserFilters): Promise<Pagination<User>> {
		const { page, limit, email } = filters;
		const skip = (page - 1) * limit;

		const where = {
			...(email && {
				usu_correo: { contains: email },
			}),
		};

		const [data, totalItems] = await prisma.$transaction([
			prisma.usuario.findMany({
				where,
				skip,
				take: limit,
				orderBy: { usu_id: "asc" },
				include: {
					perfil: {
						include: {
							rol: true,
						},
					},
				},
			}),
			prisma.usuario.count({ where }),
		]);

		return {
			data: data.map((record) => this.toDomain(record)),
			page,
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
		};
	}

	async findById(id: number): Promise<User | null> {
		const record = await prisma.usuario.findUnique({
			where: { usu_id: id },
			include: {
				perfil: {
					include: {
						rol: true,
					},
				},
			},
		});

		if (!record) return null;

		return this.toDomain(record);
	}

	async create(data: User): Promise<User> {
		const roleCodes =
			data.getRoles().length > 0 ? data.getRoles() : [data.getRole()];
		const roles = await prisma.rol.findMany({
			where: { rol_codigo: { in: roleCodes } },
		});

		const defaultRole = await prisma.rol.findFirst({
			where: { rol_codigo: "CONSULTA" },
		});
		const rolIds =
			roles.length > 0
				? roles.map((r) => r.rol_id)
				: defaultRole
					? [defaultRole.rol_id]
					: [5];

		const record = await prisma.usuario.create({
			data: {
				usu_nombre: data.getName(),
				usu_apellido: data.getApellido() || "",
				usu_correo: data.getEmail(),
				usu_contrasena: data.getPasswordHash(),
				usu_fkarea: data.getAreaId() || 1,
				usu_fkestado: data.getIsActive() ? 1 : 2,
				usu_puesto: data.getPuesto() || "",
				perfil: {
					create: rolIds.map((rId) => ({ per_fkrol: rId })),
				},
			},
			include: {
				perfil: {
					include: {
						rol: true,
					},
				},
			},
		});

		return this.toDomain(record);
	}

	async update(data: User): Promise<User> {
		const userId = data.getId();
		const roleCodes =
			data.getRoles().length > 0 ? data.getRoles() : [data.getRole()];
		const roles = await prisma.rol.findMany({
			where: { rol_codigo: { in: roleCodes } },
		});

		if (roles.length > 0) {
			await prisma.perfil.deleteMany({
				where: { per_fkusuario: userId },
			});
			await prisma.perfil.createMany({
				data: roles.map((r) => ({
					per_fkusuario: userId,
					per_fkrol: r.rol_id,
				})),
			});
		}

		const record = await prisma.usuario.update({
			where: { usu_id: userId },
			data: {
				usu_nombre: data.getName(),
				usu_apellido: data.getApellido(),
				usu_correo: data.getEmail(),
				usu_contrasena: data.getPasswordHash(),
				usu_fkestado: data.getIsActive() ? 1 : 2,
				usu_fkarea: data.getAreaId(),
				usu_puesto: data.getPuesto(),
			},
			include: {
				perfil: {
					include: {
						rol: true,
					},
				},
			},
		});

		return this.toDomain(record);
	}

	async delete(id: number): Promise<void> {
		// En SISAT las bajas son lógicas para preservar integridad
		await prisma.usuario.update({
			where: { usu_id: id },
			data: { usu_fkestado: 2 },
		});
	}
}
