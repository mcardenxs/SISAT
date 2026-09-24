import { useQuery } from "@tanstack/react-query";
import { ticketApi } from "../api/ticketApi";
import type { Ticket } from "../api/types";

export function useTicketsQuery(filters?: {
	sistemaId?: number;
	faseId?: number;
	usuarioId?: number;
}) {
	return useQuery({
		queryKey: ["tickets", filters],
		queryFn: () => ticketApi.getAll(filters),
	});
}

export function useTicketDetailQuery(ticketId: number) {
	return useQuery<Ticket>({
		queryKey: ["ticket", ticketId],
		queryFn: () => ticketApi.getById(ticketId),
		enabled: !Number.isNaN(ticketId) && ticketId > 0,
	});
}
