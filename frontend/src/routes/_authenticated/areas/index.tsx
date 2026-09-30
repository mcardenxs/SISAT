import { createFileRoute, redirect } from "@tanstack/react-router";
import { AreasPage } from "@/modules/organizacion/pages/AreasPage";
import { useAuthStore } from "@/core/auth/store";

export const Route = createFileRoute("/_authenticated/areas/")({
	beforeLoad: () => {
		const { user } = useAuthStore.getState();
		if (user?.role !== "ADMINISTRADOR" && user?.role !== "ADMIN") {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: AreasPage,
});
