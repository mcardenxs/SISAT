import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/core/api/client";
import { areaApi } from "../api/areaApi";
import type { CreateAreaInput, UpdateAreaInput } from "../api/areaApi";

export function useAreaMutations() {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["areas"] });
		queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
	};

	const createAreaMutation = useMutation({
		mutationFn: (data: CreateAreaInput) => areaApi.create(data),
		onSuccess: () => {
			toast.success("Área institucional creada con éxito");
			invalidate();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const updateAreaMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateAreaInput }) =>
			areaApi.update(id, data),
		onSuccess: () => {
			toast.success("Área institucional actualizada");
			invalidate();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	return {
		createAreaMutation,
		updateAreaMutation,
	};
}
