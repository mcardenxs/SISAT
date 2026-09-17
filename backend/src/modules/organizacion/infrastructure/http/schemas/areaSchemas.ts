import { z } from "zod";

export const createAreaSchema = z.object({
	nombre: z
		.string()
		.min(2, "El nombre del área debe tener al menos 2 caracteres")
		.max(200),
	descripcion: z.string().optional(),
	estadoId: z.number().int().min(1).max(2).optional().default(1),
});

export const updateAreaSchema = z.object({
	nombre: z.string().min(2).max(200).optional(),
	descripcion: z.string().optional(),
	estadoId: z.number().int().min(1).max(2).optional(),
});
