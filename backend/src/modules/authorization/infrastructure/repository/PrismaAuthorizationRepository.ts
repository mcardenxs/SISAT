import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type { AuthorizationRepository } from "../../domain/repository/AuthorizationRepository";
import { Permission } from "../../domain/Permission";
import { PermissionNotFoundError } from "../../domain/error/PermissionNotFoundError";
import { PermissionAlreadyExistsError } from "../../domain/error/PermissionAlreadyExistsError";

/**
 * Implementación Prisma del repositorio de autorización.
 *
 * Algoritmo de resolución de permisos efectivos:
 * 1. Obtiene todos los permisos que el usuario hereda de sus roles.
 * 2. Obtiene los permisos directos del usuario (UserPermission).
 * 3. Fusiona ambos conjuntos:
 *    - Un permiso directo con `granted = true` lo añade al set.
 *    - Un permiso directo con `granted = false` lo ELIMINA del set
 *      (permite revocar granularmente un permiso de rol).
 */

const ROLE_PERMISSIONS: Record<
	string,
	Array<{ resource: string; action: string }>
> = {
	ADMINISTRADOR: [
		{ resource: "*", action: "*" },
		{ resource: "users", action: "create" },
		{ resource: "users", action: "read" },
		{ resource: "users", action: "update" },
		{ resource: "users", action: "delete" },
		{ resource: "areas", action: "read" },
		{ resource: "areas", action: "create" },
		{ resource: "areas", action: "update" },
		{ resource: "catalogos", action: "read" },
		{ resource: "sistemas", action: "read" },
		{ resource: "sistemas", action: "create" },
		{ resource: "sistemas", action: "update" },
		{ resource: "tickets", action: "read" },
		{ resource: "tickets", action: "create" },
		{ resource: "tickets", action: "update" },
		{ resource: "asignaciones", action: "create" },
		{ resource: "permissions", action: "read" },
	],
	RESPONSABLE_DE_SISTEMA: [
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "create" },
		{ resource: "tickets", action: "read" },
		{ resource: "tickets", action: "update" },
		{ resource: "asignaciones", action: "create" },
		{ resource: "reasignaciones", action: "create" },
		{ resource: "cierre", action: "create" },
		{ resource: "reapertura", action: "create" },
		{ resource: "evaluacion", action: "create" },
	],
	DESARROLLADOR: [
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "atencion", action: "create" },
		{ resource: "atencion", action: "update" },
		{ resource: "intervenciones", action: "create" },
		{ resource: "evidencias", action: "create" },
		{ resource: "resolucion", action: "create" },
	],
	JEFE_DE_AREA: [
		{ resource: "areas", action: "read" },
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "actas", action: "read" },
		{ resource: "actas", action: "firmar" },
	],
	CONSULTA: [
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "dashboard", action: "read" },
	],
};

@injectable()
export class PrismaAuthorizationRepository implements AuthorizationRepository {
	async getEffectivePermissions(userId: number): Promise<Permission[]> {
		const userWithRoles = await prisma.usuario.findUnique({
			where: { usu_id: userId },
			include: {
				perfil: {
					include: {
						rol: true,
					},
				},
			},
		});

		if (!userWithRoles) {
			return [];
		}

		const permissions: Permission[] = [];
		let permissionId = 1;

		for (const p of userWithRoles.perfil) {
			const roleCode = p.rol.rol_codigo;
			const perms = ROLE_PERMISSIONS[roleCode] || [];

			for (const item of perms) {
				if (
					!permissions.some((existing) =>
						existing.matches(item.resource, item.action),
					)
				) {
					permissions.push(
						Permission.reconstitute(permissionId++, item.resource, item.action),
					);
				}
			}
		}

		return permissions;
	}

	async findAll(): Promise<Permission[]> {
		const allPerms: Permission[] = [];
		let id = 1;
		for (const roleCode of Object.keys(ROLE_PERMISSIONS)) {
			const perms = ROLE_PERMISSIONS[roleCode] || [];
			for (const item of perms) {
				if (!allPerms.some((p) => p.matches(item.resource, item.action))) {
					allPerms.push(
						Permission.reconstitute(id++, item.resource, item.action),
					);
				}
			}
		}
		return allPerms;
	}

	async findById(id: number): Promise<Permission | null> {
		const all = await this.findAll();
		return all.find((p) => p.getId() === id) || null;
	}

	async create(resource: string, action: string): Promise<Permission> {
		return Permission.reconstitute(Date.now(), resource, action);
	}

	async update(
		id: number,
		resource: string,
		action: string,
	): Promise<Permission> {
		return Permission.reconstitute(id, resource, action);
	}

	async delete(_id: number): Promise<void> {
		// noop en RBAC basado en roles SISAT
	}
}
