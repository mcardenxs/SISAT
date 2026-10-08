import "reflect-metadata";
import { app } from "@/core/shared/infrastructure/http/server";
import { env } from "./core/config/env";

const server = Bun.serve({
	hostname: env.HOST,
	port: env.PORT,
	fetch: app.fetch,
});

console.log("-----------------------------------------");
console.log(`🚀 Server ready at: ${server.url}`);
console.log(`📡 Environment: ${env.NODE_ENV}`);
console.log("-----------------------------------------");
