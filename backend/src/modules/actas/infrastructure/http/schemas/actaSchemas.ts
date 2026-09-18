import { z } from "zod";

export const createActaSchema = z.object({
	sistemaId: z.number().int().positive("El sistema es requerido"),
	inicio: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}$/,
			"La fecha de inicio debe tener formato YYYY-MM-DD",
		),
	fin: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}$/,
			"La fecha de fin debe tener formato YYYY-MM-DD",
		),
	observacion: z.string().optional(),
	ticketIds: z.array(z.number().int().positive()).optional(),
});

export const uploadArchivoActaSchema = z.object({
	claseId: z.number().int().positive("La clase de archivo es requerida"),
	nombre: z
		.string()
		.min(2, "El nombre del archivo es requerido")
		.max(200)
		.trim(),
	ruta: z.string().min(1, "La ruta del archivo es requerida").trim(),
	formato: z.enum(["jpg", "jpeg", "png", "webp", "pdf"]),
	tamano: z.number().int().positive("El tamaño del archivo debe ser positivo"),
	observacion: z.string().optional(),
});
