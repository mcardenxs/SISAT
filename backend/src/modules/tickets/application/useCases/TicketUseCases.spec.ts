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

	it("debería fallar cancelTicket si el ticket ya se encuentra en fase CERRADO_POR_RESPONSABLE", async () => {
		const findUniqueMock = mock().mockResolvedValue({
			tic_id: 20,
			fase: { fas_codigo: "CERRADO_POR_RESPONSABLE" },
		});
		(prisma as any).ticket = {
			findUnique: findUniqueMock,
		};

		expect(
			useCases.cancelTicket(20, "Ya no se requiere", 1),
		).rejects.toThrow("No se puede cancelar un ticket que ya fue cerrado formalmente");
	});
});
