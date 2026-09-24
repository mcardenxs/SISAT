import { useQuery } from "@tanstack/react-query";
import { sistemaApi } from "../api/sistemaApi";
import type { Sistema } from "../api/sistemaApi";

export function useSistemasQuery() {
	return useQuery<Sistema[]>({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
	});
}

export function useSistemaDetailQuery(sistemaId: number) {
	return useQuery<Sistema>({
		queryKey: ["sistema", sistemaId],
		queryFn: () => sistemaApi.getById(sistemaId),
		enabled: !Number.isNaN(sistemaId) && sistemaId > 0,
	});
}
