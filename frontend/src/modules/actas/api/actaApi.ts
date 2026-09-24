import { apiClient } from "@/core/api/client";

export interface Inclusion {
	id: number;
	actaId: number;
	ticketId: number;
	ticketFolio?: string;
	atencionId: number;
	inicio: string;
	fin: string;
	responsable: string | null;
	desarrolladores: string[];
	evidencias: string[];
	problema: string;
	solucion: string;
	calificacion: number | null;
}

export interface ArchivoActa {
	id: number;
	actaId: number;
	claseId: number;
	claseCodigo?: string;
	usuarioId: number;
	nombre: string;
	ruta: string;
	formato: string;
	tamano: number;
	observacion: string | null;
	fecha: string;
}

export interface Acta {
	id: number;
	sistemaId: number;
	sistemaNombre: string;
	areaId: number;
	areaNombre: string;
	usuarioId: number;
	firmanteNombre: string;
	situacionId: number;
	situacionCodigo?: string;
	situacionNombre?: string;
	folio: string;
	inicio: string;
	fin: string;
	generacion: string;
	observacion: string | null;
	actualizacion: string;
	inclusiones?: Inclusion[];
	archivos?: ArchivoActa[];
}

export interface CreateActaInput {
	sistemaId: number;
	inicio: string;
	fin: string;
	observacion?: string;
	ticketIds?: number[];
}

export interface UploadArchivoActaInput {
	claseId: number;
	nombre: string;
	ruta: string;
	formato: "jpg" | "jpeg" | "png" | "webp" | "pdf";
	tamano: number;
	observacion?: string;
}

export const actaApi = {
	getAll: async (filters?: {
		sistemaId?: number;
		areaId?: number;
		situacionId?: number;
	}): Promise<Acta[]> => {
		const response = await apiClient.get<Acta[]>("/actas", {
			params: filters,
		});
		return response.data;
	},

	getById: async (id: number): Promise<Acta> => {
		const response = await apiClient.get<Acta>(`/actas/${id}`);
		return response.data;
	},

	create: async (data: CreateActaInput): Promise<Acta> => {
		const response = await apiClient.post<Acta>("/actas", data);
		return response.data;
	},

	uploadArchivo: async (
		actaId: number,
		data: UploadArchivoActaInput,
	): Promise<ArchivoActa> => {
		const response = await apiClient.post<ArchivoActa>(
			`/actas/${actaId}/archivos`,
			data,
		);
		return response.data;
	},
};
