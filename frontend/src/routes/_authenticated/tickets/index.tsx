import { createFileRoute } from "@tanstack/react-router";
import { TicketsPage } from "@/modules/tickets/pages/TicketsPage";

export interface TicketSearch {
	sistemaId?: number;
	faseId?: number;
	prioridadId?: number;
	solicitudId?: number;
	search?: string;
}

export const Route = createFileRoute("/_authenticated/tickets/")({
	validateSearch: (search: Record<string, unknown>): TicketSearch => ({
		sistemaId: search.sistemaId ? Number(search.sistemaId) : undefined,
		faseId: search.faseId ? Number(search.faseId) : undefined,
		prioridadId: search.prioridadId ? Number(search.prioridadId) : undefined,
		solicitudId: search.solicitudId ? Number(search.solicitudId) : undefined,
		search: typeof search.search === "string" ? search.search : undefined,
	}),
	component: TicketsPage,
});
