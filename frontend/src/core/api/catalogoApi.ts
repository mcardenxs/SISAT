import { apiClient } from "./client";

export interface CatalogoItem {
	id: number;
	codigo: string;
	nombre: string;
}

export interface CatalogosCompletos {
	estado: CatalogoItem[];
	fase: CatalogoItem[];
	constancia: CatalogoItem[];
	situacion: CatalogoItem[];
	prioridad: CatalogoItem[];
	solicitud: CatalogoItem[];
	rol: CatalogoItem[];
	clase: CatalogoItem[];
}

export const catalogoApi = {
	getAll: async (): Promise<CatalogosCompletos> => {
		const res = await apiClient.get<CatalogosCompletos>("/catalogos");
		return res.data;
	},

	getByKey: async (key: string): Promise<CatalogoItem[]> => {
		const res = await apiClient.get<CatalogoItem[]>(`/catalogos/${key}`);
		return res.data;
	},
};
