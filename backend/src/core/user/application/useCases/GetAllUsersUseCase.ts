import { injectable, inject } from "tsyringe";
import type { UserRepository } from "../../domain/repository/UserRepository";
import type { GetAllUsersDto } from "../dtos/GetAllUsersDto";
import type { UserDto } from "../dtos/UserDto";
import type { Pagination } from "@/core/shared/domain/Pagination";
import { UserMapper } from "../mappers/UserMapper";

@injectable()
export class GetAllUsersUseCase {
	constructor(
		@inject("UserRepository") private readonly userRepository: UserRepository,
	) {}

	async run(dto: GetAllUsersDto): Promise<Pagination<UserDto>> {
		const filters = {
			page: dto.page,
			limit: dto.limit,
			email: dto.email,
			role: dto.role,
		};

		const paginatedResult = await this.userRepository.find(filters);

		return {
			...paginatedResult,
			data: paginatedResult.data.map((user) => UserMapper.toDto(user)),
		};
	}
}
