import { createFileRoute, redirect } from "@tanstack/react-router";
import { UsersPage } from "@/modules/users/pages/UsersPage";
import { useAuthStore } from "@/core/auth/store";

export const Route = createFileRoute("/_authenticated/users")({
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
	component: UsersPage,
});
