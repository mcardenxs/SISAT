import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type { RefreshTokenRepository } from "../../domain/repository/RefreshTokenRepository";

interface StoredToken {
	id: number;
	tokenHash: string;
	userId: number;
	expiresAt: Date;
	revoked: boolean;
}

const memoryTokens: StoredToken[] = [];
let nextId = 1;

@injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
	async create(data: {
		tokenHash: string;
		userId: number;
		expiresAt: Date;
	}): Promise<void> {
		memoryTokens.push({
			id: nextId++,
			tokenHash: data.tokenHash,
			userId: data.userId,
			expiresAt: data.expiresAt,
			revoked: false,
		});
	}

	async findValidByHash(
		tokenHash: string,
	): Promise<{ id: number; userId: number; expiresAt: Date } | null> {
		const token = memoryTokens.find(
			(t) =>
				t.tokenHash === tokenHash &&
				!t.revoked &&
				t.expiresAt.getTime() > Date.now(),
		);

		if (!token) return null;

		return {
			id: token.id,
			userId: token.userId,
			expiresAt: token.expiresAt,
		};
	}

	async revokeById(id: number): Promise<void> {
		const token = memoryTokens.find((t) => t.id === id);
		if (token) {
			token.revoked = true;
		}
	}

	async revokeAllByUserId(userId: number): Promise<void> {
		for (const token of memoryTokens) {
			if (token.userId === userId && !token.revoked) {
				token.revoked = true;
			}
		}
	}

	async deleteExpired(): Promise<void> {
		const now = Date.now();
		const valid = memoryTokens.filter(
			(t) => !t.revoked && t.expiresAt.getTime() > now,
		);
		memoryTokens.length = 0;
		memoryTokens.push(...valid);
	}
}
