import { createFileRoute } from "@tanstack/react-router";
import { SistemasPage } from "@/modules/sistemas/pages/SistemasPage";

export const Route = createFileRoute("/_authenticated/sistemas/")({
	component: SistemasPage,
});
