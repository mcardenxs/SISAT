import { apiClient } from "@/core/api/client";

export interface DashboardStats {
	resumenTickets: {
		total: number;
		activos: number;
		resueltos: number;
		cerrados: number;
		cancelados: number;
	};
	ticketsPorFase: Array<{
		faseId: number;
		faseCodigo: string;
		faseNombre: string;
		total: number;
	}>;
	ticketsPorPrioridad: Array<{
		prioridadId: number;
		prioridadCodigo: string;
		prioridadNombre: string;
		total: number;
	}>;
	ticketsPorSistema: Array<{
		sistemaId: number;
		sistemaNombre: string;
		total: number;
	}>;
	resumenActas: {
		total: number;
		generadas: number;
		cargadas: number;
	};
	totalesGenerales: {
		usuariosActivos: number;
		sistemasActivos: number;
		areasActivas: number;
	};
}

export const dashboardApi = {
	getStats: async (): Promise<DashboardStats> => {
		const response = await apiClient.get<DashboardStats>("/dashboard/stats");
		return response.data;
	},
};
