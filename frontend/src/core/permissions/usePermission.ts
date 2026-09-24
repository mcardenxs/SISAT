import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/core/auth/store";
import { permissionApi } from "./permissionApi";

const ROLE_FALLBACKS: Record<
	string,
	Array<{ resource: string; action: string }>
> = {
	ADMINISTRADOR: [{ resource: "*", action: "*" }],
	ADMIN: [{ resource: "*", action: "*" }],
	RESPONSABLE_DE_SISTEMA: [
		{ resource: "users", action: "read" },
		{ resource: "areas", action: "read" },
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "tickets", action: "create" },
		{ resource: "tickets", action: "update" },
		{ resource: "actas", action: "read" },
		{ resource: "asignaciones", action: "create" },
		{ resource: "reasignaciones", action: "create" },
		{ resource: "cierre", action: "create" },
		{ resource: "reapertura", action: "create" },
		{ resource: "evaluacion", action: "create" },
	],
	DESARROLLADOR: [
		{ resource: "users", action: "read" },
		{ resource: "areas", action: "read" },
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "actas", action: "read" },
		{ resource: "atencion", action: "create" },
		{ resource: "atencion", action: "update" },
		{ resource: "intervenciones", action: "create" },
		{ resource: "evidencias", action: "create" },
		{ resource: "resolucion", action: "create" },
	],
	JEFE_DE_AREA: [
		{ resource: "users", action: "read" },
		{ resource: "areas", action: "read" },
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "tickets", action: "create" },
		{ resource: "actas", action: "read" },
		{ resource: "actas", action: "create" },
		{ resource: "actas", action: "firmar" },
	],
	CONSULTA: [
		{ resource: "users", action: "read" },
		{ resource: "areas", action: "read" },
		{ resource: "sistemas", action: "read" },
		{ resource: "tickets", action: "read" },
		{ resource: "actas", action: "read" },
		{ resource: "dashboard", action: "read" },
	],
};

/**
 * Custom hook para comprobar si el usuario en sesión tiene permiso
 * para realizar una acción específica sobre un recurso determinado.
 */
export function usePermission(resource: string, action: string): boolean {
	const user = useAuthStore((state) => state.user);

	const { data: userPermissions } = useQuery({
		queryKey: ["userPermissions", user?.id],
		queryFn: () => (user?.id ? permissionApi.getUserPermissions(user.id) : []),
		enabled: Boolean(user?.id),
		staleTime: 1000 * 60 * 5, // 5 min
	});

	if (!user) {
		return false;
	}

	// Superusuario admin
	if (user.role === "ADMINISTRADOR" || user.role === "ADMIN") {
		return true;
	}

	// Permisos dinámicos del backend
	if (userPermissions && userPermissions.length > 0) {
		const hasDynamic = userPermissions.some((p) => {
			const resourceMatch = p.resource === "*" || p.resource === resource;
			const actionMatch = p.action === "*" || p.action === action;
			return resourceMatch && actionMatch;
		});
		if (hasDynamic) return true;
	}

	// Fallback por rol asignado
	const roles = [user.role, ...(user.roles ?? [])].filter(Boolean);
	for (const r of roles) {
		const rolePerms = ROLE_FALLBACKS[r] || [];
		const hasRolePerm = rolePerms.some((p) => {
			const resourceMatch = p.resource === "*" || p.resource === resource;
			const actionMatch = p.action === "*" || p.action === action;
			return resourceMatch && actionMatch;
		});
		if (hasRolePerm) return true;
	}

	return false;
}
