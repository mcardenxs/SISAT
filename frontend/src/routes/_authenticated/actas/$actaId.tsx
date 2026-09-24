import { createFileRoute } from "@tanstack/react-router";
import { ActaDetailPage } from "@/modules/actas/pages/ActaDetailPage";

export const Route = createFileRoute("/_authenticated/actas/$actaId")({
	component: ActaDetailRouteComponent,
});

function ActaDetailRouteComponent() {
	const { actaId } = Route.useParams();
	return <ActaDetailPage actaId={Number(actaId)} />;
}
