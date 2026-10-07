import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import type { RouterContext } from "@/core/router";
import { useThemeStore } from "@/core/theme/store";

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	const theme = useThemeStore((s) => s.theme);

	return (
		<>
			<Outlet />
			<Toaster richColors position="top-right" theme={theme} />
		</>
	);
}
