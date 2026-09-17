import { injectable } from "tsyringe";
import { prisma } from "@/core/config/prisma";
import type { CatalogoItemDto } from "../dtos/CatalogoItemDto";
import { BaseError } from "@/core/shared/domain/error/BaseError";

export type CatalogoTipo =
	| "estado"
	| "fase"
	| "constancia"
	| "situacion"
	| "prioridad"
	| "solicitud"
	| "rol"
	| "clase";

@injectable()
export class GetCatalogosUseCase {
	async getCatalogo(tipo: CatalogoTipo): Promise<CatalogoItemDto[]> {
		switch (tipo) {
			case "estado": {
				const items = await prisma.estado.findMany({
					orderBy: { est_id: "asc" },
				});
				return items.map((i) => ({
					id: i.est_id,
					codigo: i.est_codigo,
					nombre: i.est_nombre,
				}));
			}
			case "fase": {
				const items = await prisma.fase.findMany({
					orderBy: { fas_id: "asc" },
				});
				return items.map((i) => ({
					id: i.fas_id,
					codigo: i.fas_codigo,
					nombre: i.fas_nombre,
				}));
			}
			case "constancia": {
				const items = await prisma.constancia.findMany({
					orderBy: { con_id: "asc" },
				});
				return items.map((i) => ({
					id: i.con_id,
					codigo: i.con_codigo,
					nombre: i.con_nombre,
				}));
			}
			case "situacion": {
				const items = await prisma.situacion.findMany({
					orderBy: { sit_id: "asc" },
				});
				return items.map((i) => ({
					id: i.sit_id,
					codigo: i.sit_codigo,
					nombre: i.sit_nombre,
				}));
			}
			case "prioridad": {
				const items = await prisma.prioridad.findMany({
					orderBy: { pri_id: "asc" },
				});
				return items.map((i) => ({
					id: i.pri_id,
					codigo: i.pri_codigo,
					nombre: i.pri_nombre,
				}));
			}
			case "solicitud": {
				const items = await prisma.solicitud.findMany({
					orderBy: { sol_id: "asc" },
				});
				return items.map((i) => ({
					id: i.sol_id,
					codigo: i.sol_codigo,
					nombre: i.sol_nombre,
				}));
			}
			case "rol": {
				const items = await prisma.rol.findMany({ orderBy: { rol_id: "asc" } });
				return items.map((i) => ({
					id: i.rol_id,
					codigo: i.rol_codigo,
					nombre: i.rol_nombre,
				}));
			}
			case "clase": {
				const items = await prisma.clase.findMany({
					orderBy: { cla_id: "asc" },
				});
				return items.map((i) => ({
					id: i.cla_id,
					codigo: i.cla_codigo,
					nombre: i.cla_nombre,
				}));
			}
			default:
				throw new BaseError(`Catálogo no reconocido: ${tipo}`, 400);
		}
	}

	async getAllCatalogos(): Promise<Record<CatalogoTipo, CatalogoItemDto[]>> {
		const [
			estado,
			fase,
			constancia,
			situacion,
			prioridad,
			solicitud,
			rol,
			clase,
		] = await Promise.all([
			this.getCatalogo("estado"),
			this.getCatalogo("fase"),
			this.getCatalogo("constancia"),
			this.getCatalogo("situacion"),
			this.getCatalogo("prioridad"),
			this.getCatalogo("solicitud"),
			this.getCatalogo("rol"),
			this.getCatalogo("clase"),
		]);

		return {
			estado,
			fase,
			constancia,
			situacion,
			prioridad,
			solicitud,
			rol,
			clase,
		};
	}
}
