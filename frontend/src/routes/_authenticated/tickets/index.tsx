import { createFileRoute } from "@tanstack/react-router";
import { TicketsPage } from "@/modules/tickets/pages/TicketsPage";

export const Route = createFileRoute("/_authenticated/tickets/")({
	component: TicketsPage,
});
