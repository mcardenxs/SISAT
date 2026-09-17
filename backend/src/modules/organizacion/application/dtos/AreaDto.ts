export interface AreaDto {
	id: number;
	nombre: string;
	descripcion?: string | null;
	estadoId: number;
	estadoNombre?: string;
	actualizacion: Date;
}

export interface CreateAreaDto {
	nombre: string;
	descripcion?: string;
	estadoId?: number;
}

export interface UpdateAreaDto {
	nombre?: string;
	descripcion?: string;
	estadoId?: number;
}
