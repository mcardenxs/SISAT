import { apiClient } from "@/core/api/client";

export interface Asignacion {
	id: number;
	ticketId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	principal: boolean;
	fecha: string;
	fin: string | null;
}

export interface Intervencion {
	id: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	descripcion: string;
	minutos: number;
	interno: boolean;
	fecha: string;
}

export interface Atencion {
	id: number;
	ticketId: number;
	ciclo: number;
	inicio: string;
	diagnostico: string | null;
	solucion: string | null;
	cambios: string | null;
	termino?: {
		id: number;
		fecha: string;
		usuarioNombre?: string;
	} | null;
	evaluacion?: {
		calificacion: number;
		confirmacion: boolean;
		conformidad?: string | null;
	} | null;
	intervenciones?: Intervencion[];
}

export interface Transicion {
	id: number;
	ticketId: number;
	faseOrigenNombre?: string;
	faseDestinoNombre?: string;
	usuarioNombre?: string;
	comentario?: string | null;
	fecha: string;
}

export interface Ticket {
	id: number;
	folio: string;
	titulo: string;
	descripcion: string;
	sistemaId: number;
	sistemaNombre?: string;
	areaId: number;
	areaNombre?: string;
	usuarioId: number;
	usuarioNombre?: string;
	prioridadId: number;
	prioridadNombre?: string;
	solicitudId: number;
	solicitudNombre?: string;
	faseId: number;
	faseCodigo?: string;
	faseNombre?: string;
	constanciaId: number;
	constanciaNombre?: string;
	registro: string;
	actualizacion: string;
	asignaciones?: Asignacion[];
	atenciones?: Atencion[];
	transiciones?: Transicion[];
}

export interface CreateTicketInput {
	sistemaId: number;
	areaId: number;
	prioridadId: number;
	solicitudId: number;
	titulo: string;
	descripcion: string;
}

export const ticketApi = {
	getAll: async (filters?: {
		sistemaId?: number;
		faseId?: number;
	}): Promise<Ticket[]> => {
		const response = await apiClient.get<Ticket[]>("/api/tickets", {
			params: filters,
		});
		return response.data;
	},

	getById: async (id: number): Promise<Ticket> => {
		const response = await apiClient.get<Ticket>(`/api/tickets/${id}`);
		return response.data;
	},

	create: async (data: CreateTicketInput): Promise<Ticket> => {
		const response = await apiClient.post<Ticket>("/api/tickets", data);
		return response.data;
	},
};
