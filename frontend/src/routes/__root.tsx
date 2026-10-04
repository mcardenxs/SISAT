import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import type { RouterContext } from "@/core/router";
import { NotFoundPage } from "@/core/components/NotFoundPage";

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<Toaster richColors position="top-right" theme="dark" />
		</>
	);
}
