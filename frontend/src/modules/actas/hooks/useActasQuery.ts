import { useQuery } from "@tanstack/react-query";
import { actaApi } from "../api/actaApi";
import type { Acta } from "../api/actaApi";

export function useActasQuery(filters?: {
	sistemaId?: number;
	areaId?: number;
	situacionId?: number;
}) {
	return useQuery<Acta[]>({
		queryKey: ["actas", filters],
		queryFn: () => actaApi.getAll(filters),
	});
}

export function useActaDetailQuery(actaId: number) {
	return useQuery<Acta>({
		queryKey: ["acta", actaId],
		queryFn: () => actaApi.getById(actaId),
		enabled: !Number.isNaN(actaId) && actaId > 0,
	});
}
