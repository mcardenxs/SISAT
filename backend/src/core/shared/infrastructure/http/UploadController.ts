import type { Context } from "hono";
import { injectable, inject } from "tsyringe";
import { BaseController } from "./base.controller";
import { LocalStorageService } from "../storage/LocalStorageService";
import { BaseError } from "@/core/shared/domain/error/BaseError";

@injectable()
export class UploadController extends BaseController {
	constructor(
		@inject(LocalStorageService)
		private readonly storageService: LocalStorageService,
	) {
		super();
	}

	run = async (c: Context): Promise<Response> => {
		return this.executeSafely(c, async () => {
			const body = await c.req.parseBody();
			const file = body.file;

			if (!file || !(file instanceof File)) {
				throw new BaseError(
					"No se proporcionó ningún archivo válido en el campo 'file'",
					400,
				);
			}

			const stored = await this.storageService.saveFile(file);
			return this.created(c, stored);
		});
	};
}
