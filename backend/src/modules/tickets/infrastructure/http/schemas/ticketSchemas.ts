import { z } from "zod";

export const createTicketSchema = z.object({
	sistemaId: z.number().int().positive("El sistema es requerido"),
	areaId: z.number().int().positive("El área es requerida"),
	prioridadId: z.number().int().positive("La prioridad es requerida"),
	solicitudId: z.number().int().positive("El tipo de solicitud es requerido"),
	titulo: z
		.string()
		.min(3, "El título debe tener al menos 3 caracteres")
		.max(200)
		.trim(),
	descripcion: z
		.string()
		.min(5, "La descripción debe tener al menos 5 caracteres")
		.trim(),
});

export const assignTicketSchema = z.object({
	usuarioId: z.number().int().positive("El usuario desarrollador es requerido"),
	principal: z.boolean().optional(),
});

export const reassignTicketSchema = z.object({
	usuarioOrigenId: z
		.number()
		.int()
		.positive("El usuario de origen es requerido"),
	usuarioDestinoId: z
		.number()
		.int()
		.positive("El usuario de destino es requerido"),
	motivo: z
		.string()
		.min(5, "El motivo de reasignación debe tener al menos 5 caracteres")
		.trim(),
});

export const createAtencionSchema = z.object({
	diagnostico: z.string().optional(),
	ciclo: z.number().int().positive().optional(),
});

export const createIntervencionSchema = z.object({
	descripcion: z
		.string()
		.min(3, "La descripción de la intervención es requerida")
		.trim(),
	minutos: z
		.number()
		.int()
		.positive("Los minutos trabajados deben ser mayores a cero"),
	interno: z.boolean().optional(),
});

export const createEvidenciaSchema = z.object({
	claseId: z.number().int().positive("La clase de evidencia es requerida"),
	nombre: z
		.string()
		.min(2, "El nombre del archivo es requerido")
		.max(200)
		.trim(),
	ruta: z.string().min(1, "La ruta del archivo es requerida").trim(),
	formato: z
		.string()
		.min(1, "El formato o extensión es requerido")
		.max(20)
		.trim(),
	tamano: z.number().int().positive("El tamaño del archivo es requerido"),
	descripcion: z.string().optional(),
	atencionId: z.number().int().positive().optional(),
	reaperturaId: z.number().int().positive().optional(),
});

export const terminarAtencionSchema = z.object({
	diagnostico: z.string().min(5, "El diagnóstico técnico es requerido").trim(),
	solucion: z
		.string()
		.min(5, "La descripción de la solución es requerida")
		.trim(),
	cambios: z.string().optional(),
	modulos: z.string().optional(),
	datos: z.string().optional(),
	comentarios: z.string().optional(),
});

export const createEvaluacionSchema = z.object({
	calificacion: z
		.number()
		.int()
		.min(1, "La calificación mínima es 1")
		.max(5, "La calificación debe estar entre 1 y 5 estrellas"),
	confirmacion: z.boolean(),
	conformidad: z.string().optional(),
	inconformidad: z.string().optional(),
});

export const createCierreSchema = z.object({
	comentario: z.string().optional(),
});

export const createReaperturaSchema = z.object({
	atencionOrigenId: z
		.number()
		.int()
		.positive("La atención origen es requerida"),
	motivo: z.string().min(5, "El motivo de reapertura es requerido").trim(),
	comentario: z.string().optional(),
});
