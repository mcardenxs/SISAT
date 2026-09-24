import { apiClient } from "@/core/api/client";
import type {
	Ticket,
	CreateTicketInput,
	AssignTicketInput,
	ReassignTicketInput,
	StartAtencionInput,
	CreateIntervencionInput,
	CreateEvidenciaInput,
	TerminarAtencionInput,
	CreateEvaluacionInput,
	CloseTicketInput,
	ReopenTicketInput,
	MoveTicketInput,
	UpdateTicketInput,
	Asignacion,
	Atencion,
	Intervencion,
	Evidencia,
	Evaluacion,
	Cierre,
} from "./types";

export * from "./types";

export const ticketApi = {
	getAll: async (filters?: {
		sistemaId?: number;
		faseId?: number;
		usuarioId?: number;
	}): Promise<Ticket[]> => {
		const response = await apiClient.get<Ticket[]>("/tickets", {
			params: filters,
		});
		return response.data;
	},

	getById: async (id: number): Promise<Ticket> => {
		const response = await apiClient.get<Ticket>(`/tickets/${id}`);
		return response.data;
	},

	create: async (data: CreateTicketInput): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>("/tickets", data);
		return response.data;
	},

	assign: async (
		ticketId: number,
		data: AssignTicketInput,
	): Promise<Asignacion> => {
		const response = await apiClient.post<Asignacion>(
			`/tickets/${ticketId}/asignaciones`,
			data,
		);
		return response.data;
	},

	reassign: async (
		ticketId: number,
		data: ReassignTicketInput,
	): Promise<{ message: string }> => {
		const response = await apiClient.post<{ message: string }>(
			`/tickets/${ticketId}/reasignaciones`,
			data,
		);
		return response.data;
	},

	startAtencion: async (
		ticketId: number,
		data?: StartAtencionInput,
	): Promise<Atencion> => {
		const response = await apiClient.post<Atencion>(
			`/tickets/${ticketId}/atenciones`,
			data || {},
		);
		return response.data;
	},

	createIntervencion: async (
		atencionId: number,
		data: CreateIntervencionInput,
	): Promise<Intervencion> => {
		const response = await apiClient.post<Intervencion>(
			`/tickets/atenciones/${atencionId}/intervenciones`,
			data,
		);
		return response.data;
	},

	createEvidencia: async (
		ticketId: number,
		data: CreateEvidenciaInput,
	): Promise<Evidencia> => {
		const response = await apiClient.post<Evidencia>(
			`/tickets/${ticketId}/evidencias`,
			data,
		);
		return response.data;
	},

	endAtencion: async (
		atencionId: number,
		data: TerminarAtencionInput,
	): Promise<Atencion> => {
		const response = await apiClient.post<Atencion>(
			`/tickets/atenciones/${atencionId}/terminar`,
			data,
		);
		return response.data;
	},

	createEvaluacion: async (
		ticketId: number,
		atencionId: number,
		data: CreateEvaluacionInput,
	): Promise<Evaluacion> => {
		const response = await apiClient.post<Evaluacion>(
			`/tickets/${ticketId}/atenciones/${atencionId}/evaluacion`,
			data,
		);
		return response.data;
	},

	closeTicket: async (
		ticketId: number,
		atencionId: number,
		data?: CloseTicketInput,
	): Promise<Cierre> => {
		const response = await apiClient.post<Cierre>(
			`/tickets/${ticketId}/atenciones/${atencionId}/cierre`,
			data || {},
		);
		return response.data;
	},

	reopenTicket: async (
		ticketId: number,
		data: ReopenTicketInput,
	): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>(
			`/tickets/${ticketId}/reapertura`,
			data,
		);
		return response.data;
	},

	moveTicket: async (
		ticketId: number,
		data: MoveTicketInput,
	): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>(
			`/tickets/${ticketId}/movimiento`,
			data,
		);
		return response.data;
	},

	update: async (
		ticketId: number,
		data: UpdateTicketInput,
	): Promise<Ticket> => {
		const response = await apiClient.patch<Ticket>(
			`/tickets/${ticketId}`,
			data,
		);
		return response.data;
	},

	pause: async (
		ticketId: number,
		data: { motivo: string },
	): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>(
			`/tickets/${ticketId}/pausar`,
			data,
		);
		return response.data;
	},

	resume: async (ticketId: number): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>(
			`/tickets/${ticketId}/reanudar`,
			{},
		);
		return response.data;
	},

	cancel: async (
		ticketId: number,
		data: { motivo: string },
	): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>(
			`/tickets/${ticketId}/cancelar`,
			data,
		);
		return response.data;
	},
};
