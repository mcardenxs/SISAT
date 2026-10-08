import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type { RefreshTokenRepository } from "../../domain/repository/RefreshTokenRepository";

@injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
	async create(data: {
		tokenHash: string;
		userId: number;
		expiresAt: Date;
	}): Promise<void> {
		await prisma.refresh_token.create({
			data: {
				rft_token_hash: data.tokenHash,
				rft_fkusuario: data.userId,
				rft_expiracion: data.expiresAt,
				rft_revocado: false,
			},
		});
	}

	async findValidByHash(
		tokenHash: string,
	): Promise<{ id: number; userId: number; expiresAt: Date } | null> {
		const record = await prisma.refresh_token.findFirst({
			where: {
				rft_token_hash: tokenHash,
				rft_revocado: false,
				rft_expiracion: { gt: new Date() },
			},
		});

		if (!record) return null;

		return {
			id: record.rft_id,
			userId: record.rft_fkusuario,
			expiresAt: record.rft_expiracion,
		};
	}

	async revokeById(id: number): Promise<void> {
		await prisma.refresh_token.update({
			where: { rft_id: id },
			data: { rft_revocado: true },
		});
	}

	async revokeAllByUserId(userId: number): Promise<void> {
		await prisma.refresh_token.updateMany({
			where: {
				rft_fkusuario: userId,
				rft_revocado: false,
			},
			data: { rft_revocado: true },
		});
	}

	async deleteExpired(): Promise<void> {
		await prisma.refresh_token.deleteMany({
			where: {
				OR: [{ rft_expiracion: { lt: new Date() } }, { rft_revocado: true }],
			},
		});
	}
}
