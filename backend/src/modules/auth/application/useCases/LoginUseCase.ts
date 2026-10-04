import { injectable, inject } from "tsyringe";
import type { LoginDto } from "../dtos/LoginDto";
import { BaseError } from "@/core/shared/domain/error/BaseError";
import type { UserRepository } from "@/core/user/domain/repository/UserRepository";
import type { PasswordHasher } from "@/core/user/domain/service/PasswordHasher";
import type { TokenService } from "../../domain/service/TokenService";
import type { RefreshTokenRepository } from "../../domain/repository/RefreshTokenRepository";
import type { UserDto } from "@/core/user/application/dtos/UserDto";
import { UserMapper } from "@/core/user/application/mappers/UserMapper";

/** Duración del refresh token: 7 días */
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@injectable()
export class LoginUseCase {
	constructor(
		@inject("UserRepository") private readonly userRepository: UserRepository,
		@inject("PasswordHasher") private readonly passwordHasher: PasswordHasher,
		@inject("JwtService") private readonly tokenService: TokenService,
		@inject("RefreshTokenRepository")
		private readonly refreshTokenRepo: RefreshTokenRepository,
	) {}

	async run(
		dto: LoginDto,
	): Promise<{ accessToken: string; refreshToken: string; user: UserDto }> {
		const user = await this.userRepository.findByEmail(dto.email);

		if (!user) {
			throw new BaseError("Credenciales inválidas", 401);
		}

		if (!user.getIsActive()) {
			throw new BaseError(
				"Cuenta de usuario desactivada. Contacte al administrador",
				403,
			);
		}

		const isPasswordValid = await this.passwordHasher.compare(
			dto.password,
			user.getPasswordHash(),
		);

		if (!isPasswordValid) {
			throw new BaseError("Credenciales inválidas", 401);
		}

		// Access token de corta duración (15 min)
		const accessToken = this.tokenService.generateToken({
			id: user.getId(),
			email: user.getEmail(),
			role: user.getRole(),
		});

		// Refresh token opaco, persistido como hash en BD
		const rawRefreshToken = this.tokenService.generateRefreshToken();
		const tokenHash = this.tokenService.hashRefreshToken(rawRefreshToken);

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

		await this.refreshTokenRepo.create({
			tokenHash,
			userId: user.getId(),
			expiresAt,
		});

		return {
			accessToken,
			refreshToken: rawRefreshToken,
			user: UserMapper.toDto(user),
		};
	}
}
