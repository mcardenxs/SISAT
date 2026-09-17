import { apiClient } from "@/core/api/client";

export interface Area {
	id: number;
	nombre: string;
	descripcion: string | null;
	estadoId: number;
	estadoNombre?: string;
	actualizacion: string;
}

export interface CreateAreaInput {
	nombre: string;
	descripcion?: string;
	estadoId?: number;
}

export const areaApi = {
	getAll: async (): Promise<Area[]> => {
		const response = await apiClient.get<Area[]>("/api/areas");
		return response.data;
	},

	getById: async (id: number): Promise<Area> => {
		const response = await apiClient.get<Area>(`/api/areas/${id}`);
		return response.data;
	},

	create: async (data: CreateAreaInput): Promise<Area> => {
		const response = await apiClient.post<Area>("/api/areas", data);
		return response.data;
	},
};
