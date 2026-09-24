import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/core/api/client";
import { actaApi } from "../api/actaApi";
import type { CreateActaInput, UploadArchivoActaInput } from "../api/actaApi";

export function useActaMutations(actaId?: number) {
	const queryClient = useQueryClient();

	const invalidateActaQueries = () => {
		queryClient.invalidateQueries({ queryKey: ["actas"] });
		if (actaId) {
			queryClient.invalidateQueries({ queryKey: ["acta", actaId] });
		}
		queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
	};

	const createActaMutation = useMutation({
		mutationFn: (data: CreateActaInput) => actaApi.create(data),
		onSuccess: () => {
			toast.success("Acta semanal de entrega-recepción generada exitosamente");
			invalidateActaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const uploadArchivoMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UploadArchivoActaInput }) =>
			actaApi.uploadArchivo(id, data),
		onSuccess: () => {
			toast.success("Documento adjuntado exitosamente al acta");
			invalidateActaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	return {
		createActaMutation,
		uploadArchivoMutation,
	};
}
