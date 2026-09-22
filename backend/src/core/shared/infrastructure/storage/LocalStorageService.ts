import { injectable } from "tsyringe";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { BaseError } from "@/core/shared/domain/error/BaseError";

export interface StoredFileInfo {
	nombreOriginal: string;
	nombreArchivo: string;
	ruta: string;
	formato: string;
	tamano: number;
	url: string;
}

@injectable()
export class LocalStorageService {
	private readonly uploadDir: string;

	constructor() {
		this.uploadDir = path.resolve(process.cwd(), "uploads");
		if (!existsSync(this.uploadDir)) {
			mkdirSync(this.uploadDir, { recursive: true });
		}
	}

	async saveFile(file: File): Promise<StoredFileInfo> {
		const originalName = file.name;
		const rawExt = path.extname(originalName).toLowerCase().replace(".", "");
		const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf"];

		if (!allowedExtensions.includes(rawExt)) {
			throw new BaseError(
				`Formato de archivo no permitido (.${rawExt}). Formatos válidos: ${allowedExtensions.join(", ")}`,
				400,
			);
		}

		// Límite de 15MB
		const maxSizeBytes = 15 * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			throw new BaseError("El tamaño del archivo supera el límite de 15MB", 400);
		}

		const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${rawExt}`;
		const destinationPath = path.join(this.uploadDir, uniqueName);

		const buffer = await file.arrayBuffer();
		await Bun.write(destinationPath, buffer);

		const relativeUrl = `/uploads/${uniqueName}`;

		return {
			nombreOriginal: originalName,
			nombreArchivo: uniqueName,
			ruta: relativeUrl,
			formato: rawExt,
			tamano: file.size,
			url: relativeUrl,
		};
	}
}
