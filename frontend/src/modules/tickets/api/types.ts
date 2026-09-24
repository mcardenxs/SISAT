export interface Asignacion {
	id: number;
	ticketId: number;
	usuarioId: number;
	usuarioNombre?: string;
	usuarioEmail?: string;
	usuarioAsignaId?: number;
	usuarioAsignaNombre?: string;
	estadoId?: number;
	estadoNombre?: string;
	principal: boolean;
	fecha: string;
	fin: string | null;
}

export interface Intervencion {
	id: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	descripcion: string;
	minutos: number;
	interno: boolean;
	fecha: string;
}

export interface Evidencia {
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
	fecha: string;
}

export interface Evaluacion {
	id: number;
	ticketId: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	calificacion: number;
	confirmacion: boolean;
	conformidad?: string | null;
	inconformidad?: string | null;
	fecha: string;
}

export interface Cierre {
	id: number;
	ticketId: number;
	atencionId: number;
	usuarioId: number;
	usuarioNombre?: string;
	comentario?: string | null;
	fecha: string;
}

export interface Atencion {
	id: number;
	ticketId: number;
	ciclo: number;
	inicio: string;
	diagnostico: string | null;
	solucion: string | null;
	cambios: string | null;
	modulos: string | null;
	datos: string | null;
	comentarios: string | null;
	termino?: {
		id: number;
		atencionId: number;
		usuarioId: number;
		usuarioNombre?: string;
		fecha: string;
	} | null;
	evaluacion?: Evaluacion | null;
	cierre?: Cierre | null;
	intervenciones?: Intervencion[];
	evidencias?: Evidencia[];
}

export interface Transicion {
	id: number;
	ticketId: number;
	faseOrigenId?: number;
	faseOrigenNombre?: string;
	faseDestinoId?: number;
	faseDestinoNombre?: string;
	usuarioId: number;
	usuarioNombre?: string;
	comentario?: string | null;
	fecha: string;
}

export interface Movimiento {
	id: number;
	ticketId: number;
	sistemaOrigenId: number;
	sistemaOrigenNombre?: string;
	sistemaDestinoId: number;
	sistemaDestinoNombre?: string;
	usuarioId: number;
	usuarioNombre?: string;
	motivo: string;
	fecha: string;
}

export interface Ticket {
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
	registro: string;
	actualizacion: string;
	asignaciones?: Asignacion[];
	atenciones?: Atencion[];
	evidencias?: Evidencia[];
	transiciones?: Transicion[];
	movimientos?: Movimiento[];
}

export interface CreateTicketInput {
	sistemaId: number;
	areaId: number;
	prioridadId: number;
	solicitudId: number;
	titulo: string;
	descripcion: string;
}

export interface AssignTicketInput {
	usuarioId: number;
	principal?: boolean;
}

export interface ReassignTicketInput {
	usuarioOrigenId: number;
	usuarioDestinoId: number;
	motivo: string;
}

export interface StartAtencionInput {
	diagnostico?: string;
	ciclo?: number;
}

export interface CreateIntervencionInput {
	descripcion: string;
	minutos: number;
	interno?: boolean;
}

export interface CreateEvidenciaInput {
	claseId: number;
	nombre: string;
	ruta: string;
	formato: string;
	tamano: number;
	descripcion?: string;
	atencionId?: number;
	reaperturaId?: number;
}

export interface TerminarAtencionInput {
	diagnostico: string;
	solucion: string;
	cambios?: string;
	modulos?: string;
	datos?: string;
	comentarios?: string;
}

export interface CreateEvaluacionInput {
	calificacion: number;
	confirmacion: boolean;
	conformidad?: string;
	inconformidad?: string;
}

export interface CloseTicketInput {
	comentario?: string;
}

export interface ReopenTicketInput {
	atencionOrigenId: number;
	motivo: string;
	comentario?: string;
}

export interface MoveTicketInput {
	sistemaDestinoId: number;
	motivo: string;
}

export interface UpdateTicketInput {
	titulo?: string;
	descripcion?: string;
	prioridadId?: number;
	areaId?: number;
	solicitudId?: number;
}

export interface TicketFilterParams {
	sistemaId?: number;
	faseId?: number;
	usuarioId?: number;
	solicitudId?: number;
	prioridadId?: number;
	search?: string;
}
