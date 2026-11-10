export const ROLE_LABELS: Record<string, string> = {
	ADMINISTRADOR: "ADMINISTRADOR",
	ADMIN: "ADMINISTRADOR",
	RESPONSABLE_DE_SISTEMA: "RESPONSABLE DE SISTEMA",
	MOD: "RESPONSABLE DE SISTEMA",
	DESARROLLADOR: "DESARROLLADOR",
	JEFE_DE_AREA: "JEFE DE ÁREA",
	CONSULTA: "CONSULTA",
};

/**
 * Formatea el código del rol para su presentación visual eliminando guiones bajos
 * y retornando un nombre institucional limpio (ej. RESPONSABLE DE SISTEMA, JEFE DE ÁREA).
 */
export function formatRole(role?: string | null): string {
	if (!role) return "";
	return ROLE_LABELS[role] ?? role.replace(/_/g, " ");
}
