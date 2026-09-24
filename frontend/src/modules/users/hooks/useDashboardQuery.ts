import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";
import type { DashboardStats } from "../api/dashboardApi";

export function useDashboardQuery() {
	return useQuery<DashboardStats>({
		queryKey: ["dashboardStats"],
		queryFn: dashboardApi.getStats,
		refetchInterval: 1000 * 30, // Refresco reactivo cada 30 segundos
	});
}
