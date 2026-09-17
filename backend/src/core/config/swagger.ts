import swaggerJsDoc from "swagger-jsdoc";
import { env } from "./env";

const swaggerOptions: swaggerJsDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "SISAT API",
			version: "1.0.0",
			description:
				"Documentación interactiva de la API de SISAT generada con Scalar. Arquitectura hexagonal construida con Bun, Hono y MariaDB.",
			contact: {
				name: "Soporte SISAT",
			},
		},

		servers: [
			{
				url: `http://localhost:${env.PORT}`,
				description: "Servidor de Desarrollo",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Introduce el token JWT con formato Bearer <token>",
				},
			},
			schemas: {
				UserDto: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						name: { type: "string", example: "John Doe" },
						email: {
							type: "string",
							format: "email",
							example: "user@example.com",
						},
						isActive: { type: "boolean", example: true },
						role: { type: "string", example: "USER" },
					},
					required: ["id", "name", "email", "isActive", "role"],
				},
				PermissionDto: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						resource: { type: "string", example: "users" },
						action: { type: "string", example: "read" },
					},
					required: ["id", "resource", "action"],
				},
				AuthResponse: {
					type: "object",
					properties: {
						accessToken: {
							type: "string",
							example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
						},
						refreshToken: {
							type: "string",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						user: {
							$ref: "#/components/schemas/UserDto",
						},
					},
					required: ["accessToken", "refreshToken", "user"],
				},
				ErrorResponse: {
					type: "object",
					properties: {
						error: {
							type: "string",
							example: "Mensaje descriptivo del error",
						},
						details: {
							type: "string",
							example: "Detalles adicionales de validación",
						},
					},
					required: ["error"],
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		"./src/core/*/infrastructure/http/routes/*.ts",
		"./src/modules/*/infrastructure/http/routes/*.ts",
		"./src/core/*/infrastructure/http/controllers/*.ts",
		"./src/modules/*/infrastructure/http/controllers/*.ts",
	],
};

export const openApiSpec = swaggerJsDoc(swaggerOptions);
export const swaggerSpec = openApiSpec;
