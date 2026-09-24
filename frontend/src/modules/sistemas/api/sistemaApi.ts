import { apiClient } from "@/core/api/client";

export interface Responsable {
	id: number;
	sistemaId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	estadoId: number;
	estadoNombre?: string;
	principal: boolean;
	inicio: string;
	fin: string | null;
}

export interface Desarrollador {
	id: number;
	sistemaId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	estadoId: number;
	estadoNombre?: string;
	inicio: string;
	fin: string | null;
}

export interface Sistema {
	id: number;
	areaId: number;
	areaNombre?: string;
	estadoId: number;
	estadoNombre?: string;
	clave: string;
	nombre: string;
	descripcion: string;
	url: string | null;
	observacion: string | null;
	registro: string;
	actualizacion: string;
	responsables?: Responsable[];
	desarrolladores?: Desarrollador[];
}

export interface CreateSistemaInput {
	clave: string;
	nombre: string;
	descripcion: string;
	areaId: number;
	url?: string;
	observacion?: string;
	estadoId?: number;
}

export interface UpdateSistemaInput {
	clave?: string;
	nombre?: string;
	descripcion?: string;
	areaId?: number;
	url?: string | null;
	observacion?: string | null;
	estadoId?: number;
}

export interface AssignResponsableInput {
	usuarioId: number;
	principal?: boolean;
	inicio?: string;
}

export interface AssignDesarrolladorInput {
	usuarioId: number;
	inicio?: string;
}

export interface EndVigenciaInput {
	fin?: string;
}

export const sistemaApi = {
	getAll: async (): Promise<Sistema[]> => {
		const response = await apiClient.get<Sistema[]>("/sistemas");
		return response.data;
	},

	getById: async (id: number): Promise<Sistema> => {
		const response = await apiClient.get<Sistema>(`/sistemas/${id}`);
		return response.data;
	},

	create: async (data: CreateSistemaInput): Promise<Sistema> => {
		const response = await apiClient.post<Sistema>("/sistemas", data);
		return response.data;
	},

	update: async (id: number, data: UpdateSistemaInput): Promise<Sistema> => {
		const response = await apiClient.patch<Sistema>(`/sistemas/${id}`, data);
		return response.data;
	},

	assignResponsable: async (
		sistemaId: number,
		data: AssignResponsableInput,
	): Promise<Responsable> => {
		const response = await apiClient.post<Responsable>(
			`/sistemas/${sistemaId}/responsables`,
			data,
		);
		return response.data;
	},

	endResponsable: async (
		responsableId: number,
		data?: EndVigenciaInput,
	): Promise<Responsable> => {
		const response = await apiClient.patch<Responsable>(
			`/sistemas/responsables/${responsableId}/finalizar`,
			data || {},
		);
		return response.data;
	},

	assignDesarrollador: async (
		sistemaId: number,
		data: AssignDesarrolladorInput,
	): Promise<Desarrollador> => {
		const response = await apiClient.post<Desarrollador>(
			`/sistemas/${sistemaId}/desarrolladores`,
			data,
		);
		return response.data;
	},

	endDesarrollador: async (
		desarrolladorId: number,
		data?: EndVigenciaInput,
	): Promise<Desarrollador> => {
		const response = await apiClient.patch<Desarrollador>(
			`/sistemas/desarrolladores/${desarrolladorId}/finalizar`,
			data || {},
		);
		return response.data;
	},
};
