import { useAuthStore } from "@/core/auth/store";

/**
 * Matriz estricta de permisos por rol para la interfaz de usuario de SISAT.
 * Asegura que cada perfil operativo visualice exclusivamente las opciones y
 * acciones correspondientes a sus atribuciones institucionales:
 *
 * - ADMINISTRADOR: Control total del sistema (* : *).
 * - RESPONSABLE_DE_SISTEMA: Gestión de sistemas, ciclos de tickets y actas vinculadas.
 * - DESARROLLADOR: Bitácora de incidencias técnicas y tickets asignados.
 * - JEFE_DE_AREA: Levantamiento de tickets, consulta de avances y firma de actas semanales.
 * - CONSULTA: Visualización básica y seguimiento.
 */
const ROLE_PERMISSIONS: Record<
	string,
	Array<{ resource: string; action: string }>
> = {
	ADMINISTRADOR: [{ resource: "*", action: "*" }],
	ADMIN: [{ resource: "*", action: "*" }],
	RESPONSABLE_DE_SISTEMA: [
		{ resource: "sistemas", action: "read" },
		{ resource: "sistemas", action: "update" },
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
		{ resource: "tickets", action: "read" },
		{ resource: "atencion", action: "create" },
		{ resource: "atencion", action: "update" },
		{ resource: "intervenciones", action: "create" },
		{ resource: "evidencias", action: "create" },
		{ resource: "resolucion", action: "create" },
	],
	JEFE_DE_AREA: [
		{ resource: "tickets", action: "read" },
		{ resource: "tickets", action: "create" },
		{ resource: "actas", action: "read" },
		{ resource: "actas", action: "create" },
		{ resource: "actas", action: "firmar" },
	],
	CONSULTA: [
		{ resource: "tickets", action: "read" },
		{ resource: "dashboard", action: "read" },
	],
};

/**
 * Custom hook para comprobar si el usuario en sesión tiene permiso
 * para realizar una acción específica sobre un recurso determinado.
 */
export function usePermission(resource: string, action: string): boolean {
	const user = useAuthStore((state) => state.user);

	if (!user) {
		return false;
	}

	// 1. Superusuario administrador: acceso irrestricto total
	if (user.role === "ADMINISTRADOR" || user.role === "ADMIN") {
		return true;
	}

	// 2. Recursos estructurales exclusivos de administradores:
	// Gestión de usuarios, administración de áreas y matriz de permisos RBAC
	if (
		resource === "users" ||
		resource === "areas" ||
		resource === "permissions"
	) {
		return false;
	}

	// 3. Resolución por rol institucional
	const roles = [user.role, ...(user.roles ?? [])].filter(Boolean);
	for (const r of roles) {
		const rolePerms = ROLE_PERMISSIONS[r] || [];
		const hasRolePerm = rolePerms.some((p) => {
			const resourceMatch = p.resource === "*" || p.resource === resource;
			const actionMatch = p.action === "*" || p.action === action;
			return resourceMatch && actionMatch;
		});
		if (hasRolePerm) return true;
	}

	return false;
}
