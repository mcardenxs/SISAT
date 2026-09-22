import { injectable, inject } from "tsyringe";
import type { CreateUserDto } from "../dtos/CreateUserDto";
import type { UserDto } from "../dtos/UserDto";
import type { UserRepository } from "../../domain/repository/UserRepository";
import { User } from "../../domain/User";
import { BaseError } from "@/core/shared/domain/error/BaseError";
import { UserMapper } from "../mappers/UserMapper";
import type { PasswordHasher } from "../../domain/service/PasswordHasher";
import type { EventBus } from "@/core/shared/domain/events/EventBus";

@injectable()
export class CreateUserUseCase {
	constructor(
		@inject("UserRepository") private readonly userRepository: UserRepository,
		@inject("PasswordHasher")
		private readonly passwordHasherService: PasswordHasher,
		@inject("EventBus") private readonly eventBus: EventBus,
	) {}

	async run(dto: CreateUserDto): Promise<UserDto> {
		const existingUsers = await this.userRepository.find({
			page: 1,
			limit: 1,
			email: dto.email,
		});
		if (existingUsers?.data?.length > 0) {
			throw new BaseError("User with this email already exists", 400);
		}

		const passwordHash = await this.passwordHasherService.hash(dto.password);
		const user = User.create(
			dto.name || "",
			dto.email,
			passwordHash,
			dto.role || (dto.roles && dto.roles[0]) || "CONSULTA",
			dto.apellido || "",
			dto.areaId || 1,
			dto.puesto || "",
			dto.roles || [],
		);
		const createdUser = await this.userRepository.create(user);

		createdUser.addCreateEvent();

		this.eventBus.publishAll(createdUser.pullDomainEvents());

		return UserMapper.toDto(createdUser);
	}
}
