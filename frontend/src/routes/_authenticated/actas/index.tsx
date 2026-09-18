import { createFileRoute } from "@tanstack/react-router";
import { ActasPage } from "@/modules/actas/pages/ActasPage";

export const Route = createFileRoute("/_authenticated/actas/")({
	component: ActasPage,
});
