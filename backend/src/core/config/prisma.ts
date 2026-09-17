import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const rawUrl = `${process.env.DATABASE_URL}`;
const connectionString = rawUrl.startsWith("mysql://")
	? rawUrl.replace("mysql://", "mariadb://")
	: rawUrl;

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

export { prisma };
