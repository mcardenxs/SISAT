import type { ReactNode } from "react";
import { usePermission } from "./usePermission";

interface CanProps {
	resource: string;
	action: string;
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Componente guardián condicional para UI.
 * Oculta o renderiza contenido basándose en los permisos del usuario conectado.
 */
export function Can({ resource, action, children, fallback = null }: CanProps) {
	const hasPermission = usePermission(resource, action);

	if (!hasPermission) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
