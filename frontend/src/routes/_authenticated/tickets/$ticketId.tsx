import { createFileRoute } from "@tanstack/react-router";
import { TicketDetailPage } from "@/modules/tickets/pages/TicketDetailPage";

export const Route = createFileRoute("/_authenticated/tickets/$ticketId")({
	component: TicketDetailRouteComponent,
});

function TicketDetailRouteComponent() {
	const { ticketId } = Route.useParams();
	return <TicketDetailPage ticketId={Number(ticketId)} />;
}
