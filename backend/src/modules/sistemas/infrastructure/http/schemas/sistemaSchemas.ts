import { z } from "zod";

export const createSistemaSchema = z.object({
	clave: z
		.string()
		.min(2, "La clave debe tener al menos 2 caracteres")
		.max(50, "La clave no puede exceder 50 caracteres")
		.trim(),
	nombre: z
		.string()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.max(200, "El nombre no puede exceder 200 caracteres")
		.trim(),
	descripcion: z
		.string()
		.min(5, "La descripción debe tener al menos 5 caracteres")
		.trim(),
	areaId: z.number().int().positive("El área es requerida"),
	url: z.string().url("URL no válida").optional().or(z.literal("")),
	observacion: z.string().optional(),
	estadoId: z.number().int().positive().optional(),
});

export const updateSistemaSchema = z.object({
	clave: z
		.string()
		.min(2, "La clave debe tener al menos 2 caracteres")
		.max(50, "La clave no puede exceder 50 caracteres")
		.trim()
		.optional(),
	nombre: z
		.string()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.max(200, "El nombre no puede exceder 200 caracteres")
		.trim()
		.optional(),
	descripcion: z
		.string()
		.min(5, "La descripción debe tener al menos 5 caracteres")
		.trim()
		.optional(),
	areaId: z.number().int().positive().optional(),
	url: z.string().url("URL no válida").optional().nullable().or(z.literal("")),
	observacion: z.string().optional().nullable(),
	estadoId: z.number().int().positive().optional(),
});

export const assignResponsableSchema = z.object({
	usuarioId: z.number().int().positive("El ID del usuario es requerido"),
	principal: z.boolean().optional(),
	inicio: z
		.string()
		.datetime()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
});

export const endResponsableSchema = z.object({
	fin: z
		.string()
		.datetime()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
});

export const assignDesarrolladorSchema = z.object({
	usuarioId: z.number().int().positive("El ID del usuario es requerido"),
	inicio: z
		.string()
		.datetime()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
});

export const endDesarrolladorSchema = z.object({
	fin: z
		.string()
		.datetime()
		.optional()
		.transform((val) => (val ? new Date(val) : undefined)),
});
