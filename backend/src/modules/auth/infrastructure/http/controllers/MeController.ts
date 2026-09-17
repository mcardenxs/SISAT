import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import type { UserRepository } from "@/core/user/domain/repository/UserRepository";
import { UserMapper } from "@/core/user/application/mappers/UserMapper";

@injectable()
export class MeController extends BaseController {
	constructor(
		@inject("UserRepository") private readonly userRepository: UserRepository,
	) {
		super();
	}

	run = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const userPayload = c.get("user");
			const userId = userPayload?.id;

			if (!userId) {
				return c.json({ error: "No autenticado" }, 401);
			}

			const user = await this.userRepository.findById(userId);
			if (!user) {
				return c.json({ error: "Usuario no encontrado" }, 404);
			}

			return this.ok(c, { user: UserMapper.toDto(user) });
		});
	};
}
