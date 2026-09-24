import { apiClient } from "./client";

export interface StoredFileInfo {
	nombreOriginal: string;
	nombreArchivo: string;
	ruta: string;
	formato: string;
	tamano: number;
	url: string;
}

export const uploadApi = {
	upload: async (file: File): Promise<StoredFileInfo> => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await apiClient.post<StoredFileInfo>(
			"/uploads",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);

		return response.data;
	},
};
