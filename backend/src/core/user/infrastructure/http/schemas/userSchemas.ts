import { z } from "zod";

const passwordSchema = z
	.string("Password is required")
	.min(12, "Password must be at least 12 characters")
	.regex(/[A-Z]/, "Password must include at least one uppercase letter")
	.regex(/[a-z]/, "Password must include at least one lowercase letter")
	.regex(/[0-9]/, "Password must include at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must include at least one special character",
	);

export const createUserSchema = z.object({
	email: z.email("Must be a valid email"),
	name: z.string().optional(),
	apellido: z.string().optional(),
	password: passwordSchema,
	areaId: z.number().int().positive().optional(),
	puesto: z.string().optional(),
	role: z.string().optional(),
	roles: z.array(z.string()).optional(),
});

export const updateUserSchema = z.object({
	email: z.email("Must be a valid email").optional(),
	name: z.string().optional(),
	apellido: z.string().optional(),
	password: passwordSchema.optional(),
	areaId: z.number().int().positive().optional(),
	puesto: z.string().optional(),
	role: z.string().optional(),
	roles: z.array(z.string()).optional(),
	isActive: z.boolean().optional(),
});

export const userIdSchema = z.object({
	id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
});

export const getAllUsersSchema = z.object({
	page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
	limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
	email: z.string().optional(),
});
