import { createFileRoute } from "@tanstack/react-router";
import { AreasPage } from "@/modules/organizacion/pages/AreasPage";

export const Route = createFileRoute("/_authenticated/areas/")({
	component: AreasPage,
});
