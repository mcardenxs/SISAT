export interface SistemaDto {
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
	registro: Date;
	actualizacion: Date;
	responsables?: ResponsableDto[];
	desarrolladores?: DesarrolladorDto[];
}

export interface CreateSistemaDto {
	areaId: number;
	clave: string;
	nombre: string;
	descripcion: string;
	url?: string;
	observacion?: string;
	estadoId?: number;
}

export interface UpdateSistemaDto {
	areaId?: number;
	clave?: string;
	nombre?: string;
	descripcion?: string;
	url?: string | null;
	observacion?: string | null;
	estadoId?: number;
}

export interface ResponsableDto {
	id: number;
	sistemaId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	estadoId: number;
	estadoNombre?: string;
	principal: boolean;
	inicio: Date;
	fin: Date | null;
}

export interface AssignResponsableDto {
	sistemaId: number;
	usuarioId: number;
	principal?: boolean;
	inicio?: Date;
}

export interface EndResponsableDto {
	fin?: Date;
}

export interface DesarrolladorDto {
	id: number;
	sistemaId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	estadoId: number;
	estadoNombre?: string;
	inicio: Date;
	fin: Date | null;
}

export interface AssignDesarrolladorDto {
	sistemaId: number;
	usuarioId: number;
	inicio?: Date;
}

export interface EndDesarrolladorDto {
	fin?: Date;
}
