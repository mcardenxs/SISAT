import { createFileRoute } from "@tanstack/react-router";
import { SistemaDetailPage } from "@/modules/sistemas/pages/SistemaDetailPage";

export const Route = createFileRoute("/_authenticated/sistemas/$sistemaId")({
	component: SistemaDetailRouteComponent,
});

function SistemaDetailRouteComponent() {
	const { sistemaId } = Route.useParams();
	return <SistemaDetailPage sistemaId={Number(sistemaId)} />;
}
