import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/core/shared/infrastructure/http/base.controller";
import { BaseError } from "@/core/shared/domain/error/BaseError";
import { RegisterUseCase } from "../../../application/useCases/RegisterUseCase";

import { validate } from "@/core/shared/infrastructure/libs/validate";
import { registerSchema } from "../schemas/authSchemas";

@injectable()
export class RegisterController extends BaseController {
	constructor(
		@inject(RegisterUseCase) private readonly registerUseCase: RegisterUseCase,
	) {
		super();
	}

	run = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			if (process.env.ALLOW_PUBLIC_REGISTRATION !== "true") {
				throw new BaseError(
					"El registro público está deshabilitado por política institucional. Los usuarios deben ser dados de alta por un Administrador.",
					403,
				);
			}

			const body = await c.req.json();
			const dto = validate(registerSchema, body);
			const result = await this.registerUseCase.run(dto);

			return this.created(c, result);
		});
	};
}
