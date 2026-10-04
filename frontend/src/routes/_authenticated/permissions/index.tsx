import { createFileRoute, redirect } from "@tanstack/react-router";
import { PermissionsPage } from "@/modules/users/pages/PermissionsPage";
import { useAuthStore } from "@/core/auth/store";

export const Route = createFileRoute("/_authenticated/permissions/")({
	beforeLoad: () => {
		const { user } = useAuthStore.getState();
		const isAdmin =
			user?.roles?.includes("ADMINISTRADOR") ||
			user?.roles?.includes("ADMIN") ||
			user?.role === "ADMINISTRADOR" ||
			user?.role === "ADMIN";

		if (!isAdmin) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: PermissionsPage,
});
