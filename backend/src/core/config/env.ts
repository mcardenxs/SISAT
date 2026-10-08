import { z } from "zod";

const EnvSchema = z.object({
	HOST: z.string().default("0.0.0.0"),
	PORT: z.coerce.number("El puerto debe ser un numero").default(3000),
	NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
	DATABASE_URL: z.string().url("DATABASE_URL debe ser una URL valida"),
	JWT_SECRET: z.string().min(1, "JWT_SECRET es obligatorio"),
});

const envPrev = {
	HOST: process.env.HOST || "0.0.0.0",
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_SECRET: process.env.JWT_SECRET,
};

export const env = EnvSchema.parse(envPrev);
