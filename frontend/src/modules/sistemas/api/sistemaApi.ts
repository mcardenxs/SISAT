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
}

export const sistemaApi = {
	getAll: async (): Promise<Sistema[]> => {
		const response = await apiClient.get<Sistema[]>("/api/sistemas");
		return response.data;
	},

	getById: async (id: number): Promise<Sistema> => {
		const response = await apiClient.get<Sistema>(`/api/sistemas/${id}`);
		return response.data;
	},

	create: async (data: CreateSistemaInput): Promise<Sistema> => {
		const response = await apiClient.post<Sistema>("/api/sistemas", data);
		return response.data;
	},
};
