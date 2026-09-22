import { injectable, inject } from "tsyringe";
import type { UpdateUserDto } from "../dtos/UpdateUserDto";
import type { UserDto } from "../dtos/UserDto";
import type { UserRepository } from "../../domain/repository/UserRepository";
import { UserMapper } from "../mappers/UserMapper";
import { UserNotFoundError } from "../../domain/error/UserNotFoundError";
import type { PasswordHasher } from "../../domain/service/PasswordHasher";

@injectable()
export class UpdateUserUseCase {
	constructor(
		@inject("UserRepository") private readonly userRepository: UserRepository,
		@inject("PasswordHasher")
		private readonly passwordHasherService: PasswordHasher,
	) {}

	async run(id: number, dto: UpdateUserDto): Promise<UserDto> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new UserNotFoundError();
		}

		let passwordHash: string | undefined;
		if (dto.password) {
			passwordHash = await this.passwordHasherService.hash(dto.password);
		}

		user.updateProfile({
			name: dto.name,
			apellido: dto.apellido,
			emailStr: dto.email,
			areaId: dto.areaId,
			puesto: dto.puesto,
			roleStr: dto.role,
			roles: dto.roles,
			isActive: dto.isActive,
			passwordHash,
		});

		const updatedUser = await this.userRepository.update(user);
		return UserMapper.toDto(updatedUser);
	}
}
