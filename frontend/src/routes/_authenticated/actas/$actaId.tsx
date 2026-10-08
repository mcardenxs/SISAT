import { createFileRoute, redirect } from "@tanstack/react-router";
import { ActaDetailPage } from "@/modules/actas/pages/ActaDetailPage";
import { useAuthStore } from "@/core/auth/store";

const ALLOWED_ROLES = [
	"ADMINISTRADOR",
	"ADMIN",
	"JEFE_DE_AREA",
	"RESPONSABLE_DE_SISTEMA",
];

export const Route = createFileRoute("/_authenticated/actas/$actaId")({
	beforeLoad: () => {
		const { user } = useAuthStore.getState();
		if (!user?.role || !ALLOWED_ROLES.includes(user.role)) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: ActaDetailRouteComponent,
});

function ActaDetailRouteComponent() {
	const { actaId } = Route.useParams();
	return <ActaDetailPage actaId={Number(actaId)} />;
}
