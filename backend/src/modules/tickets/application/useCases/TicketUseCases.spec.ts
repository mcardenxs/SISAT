import "reflect-metadata";
import { describe, expect, it, mock, beforeEach } from "bun:test";
import { TicketUseCases } from "./TicketUseCases";
import { prisma } from "@/core/config/prisma";
import { BaseError } from "@/core/shared/domain/error/BaseError";

describe("TicketUseCases - Nuevas Funcionalidades", () => {
	let useCases: TicketUseCases;

	beforeEach(() => {
		useCases = new TicketUseCases();
	});

	it("debería fallar moveTicket si el sistema de destino es igual al sistema de origen", async () => {
		// Mock ticket existente
		const findUniqueMock = mock().mockResolvedValue({
			tic_id: 10,
			tic_fksistema: 1,
			fase: { fas_codigo: "EN_PROCESO" },
		});
		(prisma as any).ticket = {
			findUnique: findUniqueMock,
		};

		expect(
			useCases.moveTicket(
				{ ticketId: 10, sistemaDestinoId: 1, motivo: "Cambio de sistema" },
				1,
			),
		).rejects.toThrow(BaseError);
	});

	it("debería fallar create si el usuario no es responsable vigente ni admin", async () => {
		const findFirstMock = mock().mockResolvedValue(null);
		(prisma as any).responsable = {
			findFirst: findFirstMock,
		};

		expect(
			useCases.create(
				{
					sistemaId: 1,
					areaId: 1,
					prioridadId: 1,
					solicitudId: 1,
					titulo: "Error en login",
					descripcion: "No inicia sesión",
				},
				5,
				"DESARROLLADOR",
			),
		).rejects.toThrow(
			"Solo un responsable vigente del sistema puede registrar tickets",
		);
	});

	it("debería filtrar por desarrolladorId en findAll", async () => {
		const findManyMock = mock().mockResolvedValue([]);
		(prisma as any).ticket = {
			findMany: findManyMock,
		};

		await useCases.findAll({ desarrolladorId: 7 });

		expect(findManyMock).toHaveBeenCalled();
		const callArg = findManyMock.mock.calls[0][0];
		const asigCondition = callArg.where.AND
			? callArg.where.AND.find((c: any) => c.asignacion)
			: callArg.where;
		expect(asigCondition.asignacion).toBeDefined();
		expect(asigCondition.asignacion.some.asi_fkusuario).toBe(7);
	});
});
