export interface TicketDto {
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
	prioridadCodigo?: string;
	prioridadNombre?: string;
	solicitudId: number;
	solicitudCodigo?: string;
	solicitudNombre?: string;
	faseId: number;
	faseCodigo?: string;
	faseNombre?: string;
	constanciaId: number;
	constanciaCodigo?: string;
	constanciaNombre?: string;
	registro: Date;
	actualizacion: Date;
	asignaciones?: AsignacionDto[];
	atenciones?: AtencionDto[];
	transiciones?: TransicionDto[];
	movimientos?: MovimientoDto[];
}

export interface MovimientoDto {
	id: number;
	ticketId: number;
	sistemaOrigenId: number;
	sistemaOrigenNombre?: string;
	sistemaDestinoId: number;
	sistemaDestinoNombre?: string;
	usuarioId: number;
	usuarioNombre?: string;
	motivo: string;
	fecha: Date;
}

export interface MoveTicketDto {
	ticketId: number;
	sistemaDestinoId: number;
	motivo: string;
}

export interface UpdateTicketDto {
	titulo?: string;
	descripcion?: string;
	prioridadId?: number;
	areaId?: number;
	solicitudId?: number;
}

export interface PauseTicketDto {
	motivo: string;
}

export interface CancelTicketDto {
	motivo: string;
}

export interface CreateTicketDto {
	sistemaId: number;
	areaId: number;
	prioridadId: number;
	solicitudId: number;
	titulo: string;
	descripcion: string;
}

export interface AsignacionDto {
	id: number;
	ticketId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	usuarioAsignaId: number;
	usuarioAsignaNombre?: string;
	estadoId: number;
	estadoNombre?: string;
	principal: boolean;
	fecha: Date;
	fin: Date | null;
}

export interface AssignTicketDto {
	ticketId: number;
	usuarioId: number;
	principal?: boolean;
}

export interface ReassignTicketDto {
	ticketId: number;
	usuarioOrigenId: number;
	usuarioDestinoId: number;
	motivo: string;
}

export interface AtencionDto {
	id: number;
	ticketId: number;
	ciclo: number;
	inicio: Date;
	diagnostico: string | null;
	solucion: string | null;
	cambios: string | null;
	modulos: string | null;
	datos: string | null;
	comentarios: string | null;
	termino?: TerminoDto | null;
	evaluacion?: EvaluacionDto | null;
	cierre?: CierreDto | null;
	intervenciones?: IntervencionDto[];
	evidencias?: EvidenciaDto[];
}

export interface CreateAtencionDto {
	ticketId: number;
	ciclo?: number;
	diagnostico?: string;
}

export interface TerminarAtencionDto {
	atencionId: number;
	diagnostico: string;
	solucion: string;
	cambios?: string;
	modulos?: string;
	datos?: string;
	comentarios?: string;
}

export interface IntervencionDto {
	id: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	descripcion: string;
	minutos: number;
	interno: boolean;
	fecha: Date;
}

export interface CreateIntervencionDto {
	atencionId: number;
	descripcion: string;
	minutos: number;
	interno?: boolean;
}

export interface EvidenciaDto {
	id: number;
	ticketId: number;
	atencionId?: number | null;
	reaperturaId?: number | null;
	claseId: number;
	claseCodigo?: string;
	usuarioId: number;
	nombre: string;
	ruta: string;
	formato: string;
	tamano: number;
	descripcion?: string | null;
	fecha: Date;
}

export interface CreateEvidenciaDto {
	ticketId: number;
	atencionId?: number;
	reaperturaId?: number;
	claseId: number;
	nombre: string;
	ruta: string;
	formato: string;
	tamano: number;
	descripcion?: string;
}

export interface TerminoDto {
	id: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	fecha: Date;
}

export interface EvaluacionDto {
	id: number;
	ticketId: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	calificacion: number;
	confirmacion: boolean;
	conformidad?: string | null;
	inconformidad?: string | null;
	fecha: Date;
}

export interface CreateEvaluacionDto {
	ticketId: number;
	atencionId: number;
	calificacion: number;
	confirmacion: boolean;
	conformidad?: string;
	inconformidad?: string;
}

export interface CierreDto {
	id: number;
	ticketId: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	comentario?: string | null;
	fecha: Date;
}

export interface CreateCierreDto {
	ticketId: number;
	atencionId: number;
	comentario?: string;
}

export interface CreateReaperturaDto {
	ticketId: number;
	atencionOrigenId: number;
	motivo: string;
	comentario?: string;
}

export interface TransicionDto {
	id: number;
	ticketId: number;
	faseOrigenId: number;
	faseOrigenNombre?: string;
	faseDestinoId: number;
	faseDestinoNombre?: string;
	usuarioId: number;
	usuarioNombre?: string;
	comentario?: string | null;
	fecha: Date;
}
