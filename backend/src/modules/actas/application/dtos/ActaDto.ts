export interface ActaDto {
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
	generacion: Date;
	observacion: string | null;
	actualizacion: Date;
	inclusiones?: InclusionDto[];
	archivos?: ArchivoActaDto[];
}

export interface CreateActaDto {
	sistemaId: number;
	inicio: string; // Formato YYYY-MM-DD
	fin: string; // Formato YYYY-MM-DD
	observacion?: string;
	ticketIds?: number[]; // Opcional: tickets específicos a incluir o todos los elegibles
}

export interface InclusionDto {
	id: number;
	actaId: number;
	ticketId: number;
	ticketFolio?: string;
	atencionId: number;
	inicio: Date;
	fin: Date;
	responsable: string | null;
	desarrolladores: string[];
	evidencias: string[];
	problema: string;
	solucion: string;
	calificacion: number | null;
}

export interface ArchivoActaDto {
	id: number;
	actaId: number;
	claseId: number;
	claseCodigo?: string;
	usuarioId: number;
	nombre: string;
	ruta: string;
	formato: string;
	tamano: number;
	observacion?: string | null;
	fecha: Date;
}

export interface UploadArchivoActaDto {
	actaId: number;
	claseId: number;
	nombre: string;
	ruta: string;
	formato: string;
	tamano: number;
	observacion?: string;
}

export interface SignActaDto {
	actaId: number;
	observacion?: string;
}
