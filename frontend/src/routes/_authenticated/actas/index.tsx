import { createFileRoute, redirect } from "@tanstack/react-router";
import { ActasPage } from "@/modules/actas/pages/ActasPage";
import { useAuthStore } from "@/core/auth/store";

const ALLOWED_ROLES = [
	"ADMINISTRADOR",
	"ADMIN",
	"JEFE_DE_AREA",
	"RESPONSABLE_DE_SISTEMA",
];

export interface ActaSearch {
	sistemaId?: number;
	areaId?: number;
	situacionId?: number;
}

export const Route = createFileRoute("/_authenticated/actas/")({
	validateSearch: (search: Record<string, unknown>): ActaSearch => ({
		sistemaId: search.sistemaId ? Number(search.sistemaId) : undefined,
		areaId: search.areaId ? Number(search.areaId) : undefined,
		situacionId: search.situacionId ? Number(search.situacionId) : undefined,
	}),
	beforeLoad: () => {
		const { user } = useAuthStore.getState();
		if (!user?.role || !ALLOWED_ROLES.includes(user.role)) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: ActasPage,
});
