import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	ArrowDown,
	ArrowLeftRight,
	ArrowUp,
	Bug,
	CheckCircle2,
	ClipboardCheck,
	ClipboardList,
	Headphones,
	Minus,
	PauseCircle,
	PenLine,
	Rocket,
	RotateCcw,
	ShieldAlert,
	Sparkles,
	Tag,
	UserCheck,
	Wrench,
	XCircle,
} from "lucide-react";

export type TicketBadgeVariant =
	| "neutral"
	| "info"
	| "success"
	| "warning"
	| "danger"
	| "purple";

export interface TicketDisplayMeta {
	label: string;
	variant: TicketBadgeVariant;
	icon: LucideIcon;
	iconContainerClass: string;
}

const DEFAULT_FASE_DISPLAY: TicketDisplayMeta = {
	label: "Sin fase",
	variant: "neutral",
	icon: ClipboardList,
	iconContainerClass: "bg-surface-muted text-foreground-muted border-subtle",
};

const FASE_DISPLAY_MAP: Record<string, TicketDisplayMeta> = {
	REGISTRADO: {
		label: "Registrado",
		variant: "neutral",
		icon: ClipboardList,
		iconContainerClass: "bg-surface-muted text-foreground-muted border-subtle",
	},
	ASIGNADO: {
		label: "Asignado",
		variant: "info",
		icon: UserCheck,
		iconContainerClass: "bg-info-subtle text-info border-info-border",
	},
	EN_PROCESO: {
		label: "En Proceso",
		variant: "info",
		icon: Wrench,
		iconContainerClass: "bg-info-subtle text-info border-info-border",
	},
	EN_ESPERA_DE_INFORMACION: {
		label: "En Espera de Información",
		variant: "warning",
		icon: PauseCircle,
		iconContainerClass: "bg-warning-subtle text-warning border-warning-border",
	},
	RESUELTO_POR_DESARROLLO: {
		label: "Resuelto por Desarrollo",
		variant: "warning",
		icon: ClipboardCheck,
		iconContainerClass: "bg-warning-subtle text-warning border-warning-border",
	},
	CERRADO_POR_RESPONSABLE: {
		label: "Cerrado por Responsable",
		variant: "success",
		icon: CheckCircle2,
		iconContainerClass: "bg-success-subtle text-success border-success-border",
	},
	REABIERTO: {
		label: "Reabierto",
		variant: "warning",
		icon: RotateCcw,
		iconContainerClass: "bg-warning-subtle text-warning border-warning-border",
	},
	CANCELADO: {
		label: "Cancelado",
		variant: "danger",
		icon: XCircle,
		iconContainerClass: "bg-danger-subtle text-danger border-danger-border",
	},
};

const DEFAULT_PRIORIDAD_DISPLAY: TicketDisplayMeta = {
	label: "Normal",
	variant: "neutral",
	icon: Minus,
	iconContainerClass: "bg-surface-muted text-foreground-muted border-subtle",
};

const PRIORIDAD_DISPLAY_MAP: Record<string, TicketDisplayMeta> = {
	CRITICA: {
		label: "Crítica",
		variant: "danger",
		icon: AlertTriangle,
		iconContainerClass: "bg-danger-subtle text-danger border-danger-border",
	},
	ALTA: {
		label: "Alta",
		variant: "warning",
		icon: ArrowUp,
		iconContainerClass: "bg-warning-subtle text-warning border-warning-border",
	},
	MEDIA: {
		label: "Media",
		variant: "info",
		icon: Minus,
		iconContainerClass: "bg-info-subtle text-info border-info-border",
	},
	BAJA: {
		label: "Baja",
		variant: "success",
		icon: ArrowDown,
		iconContainerClass: "bg-success-subtle text-success border-success-border",
	},
};

const DEFAULT_SOLICITUD_DISPLAY: TicketDisplayMeta = {
	label: "Solicitud",
	variant: "neutral",
	icon: Tag,
	iconContainerClass: "bg-surface-muted text-foreground-muted border-subtle",
};

const SOLICITUD_DISPLAY_MAP: Record<string, TicketDisplayMeta> = {
	ERROR: {
		label: "Error",
		variant: "danger",
		icon: Bug,
		iconContainerClass: "bg-danger-subtle text-danger border-danger-border",
	},
	AJUSTE_DE_INFORMACION: {
		label: "Ajuste de Información",
		variant: "info",
		icon: PenLine,
		iconContainerClass: "bg-info-subtle text-info border-info-border",
	},
	MEJORA: {
		label: "Mejora",
		variant: "success",
		icon: Sparkles,
		iconContainerClass: "bg-success-subtle text-success border-success-border",
	},
	NUEVA_FUNCIONALIDAD: {
		label: "Nueva Funcionalidad",
		variant: "purple",
		icon: Rocket,
		iconContainerClass: "bg-primary-light text-primary border-primary-border",
	},
	CAMBIO_SOLICITADO: {
		label: "Cambio Solicitado",
		variant: "info",
		icon: ArrowLeftRight,
		iconContainerClass: "bg-info-subtle text-info border-info-border",
	},
	INCIDENTE: {
		label: "Incidente",
		variant: "warning",
		icon: ShieldAlert,
		iconContainerClass: "bg-warning-subtle text-warning border-warning-border",
	},
	SOPORTE_OPERATIVO: {
		label: "Soporte Operativo",
		variant: "neutral",
		icon: Headphones,
		iconContainerClass: "bg-surface-muted text-foreground-muted border-subtle",
	},
};

function resolveDisplayMeta(
	map: Record<string, TicketDisplayMeta>,
	fallback: TicketDisplayMeta,
	codigo?: string,
): TicketDisplayMeta {
	if (!codigo) return fallback;
	return map[codigo.toUpperCase()] ?? fallback;
}

/** Resuelve el icono, color semántico y etiqueta visual de la fase de un ticket. */
export function getFaseDisplay(codigo?: string): TicketDisplayMeta {
	return resolveDisplayMeta(FASE_DISPLAY_MAP, DEFAULT_FASE_DISPLAY, codigo);
}

/** Resuelve el icono, color semántico y etiqueta visual de la prioridad de un ticket. */
export function getPrioridadDisplay(codigo?: string): TicketDisplayMeta {
	return resolveDisplayMeta(
		PRIORIDAD_DISPLAY_MAP,
		DEFAULT_PRIORIDAD_DISPLAY,
		codigo,
	);
}

/** Resuelve el icono, color semántico y etiqueta visual del tipo de solicitud de un ticket. */
export function getSolicitudDisplay(codigo?: string): TicketDisplayMeta {
	return resolveDisplayMeta(
		SOLICITUD_DISPLAY_MAP,
		DEFAULT_SOLICITUD_DISPLAY,
		codigo,
	);
}
