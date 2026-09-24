import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/core/api/client";
import { sistemaApi } from "../api/sistemaApi";
import type {
	CreateSistemaInput,
	UpdateSistemaInput,
	AssignResponsableInput,
	AssignDesarrolladorInput,
	EndVigenciaInput,
} from "../api/sistemaApi";

export function useSistemaMutations(sistemaId?: number) {
	const queryClient = useQueryClient();

	const invalidateSistemaQueries = () => {
		queryClient.invalidateQueries({ queryKey: ["sistemas"] });
		if (sistemaId) {
			queryClient.invalidateQueries({ queryKey: ["sistema", sistemaId] });
		}
		queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
	};

	const createSistemaMutation = useMutation({
		mutationFn: (data: CreateSistemaInput) => sistemaApi.create(data),
		onSuccess: () => {
			toast.success("Sistema institucional registrado exitosamente");
			invalidateSistemaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const updateSistemaMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateSistemaInput }) =>
			sistemaApi.update(id, data),
		onSuccess: () => {
			toast.success("Sistema institucional actualizado");
			invalidateSistemaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const assignResponsableMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: AssignResponsableInput }) =>
			sistemaApi.assignResponsable(id, data),
		onSuccess: () => {
			toast.success("Responsable de sistema asignado");
			invalidateSistemaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const endResponsableMutation = useMutation({
		mutationFn: ({
			responsableId,
			data,
		}: {
			responsableId: number;
			data?: EndVigenciaInput;
		}) => sistemaApi.endResponsable(responsableId, data),
		onSuccess: () => {
			toast.success("Vigencia de responsable finalizada");
			invalidateSistemaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const assignDesarrolladorMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: AssignDesarrolladorInput;
		}) => sistemaApi.assignDesarrollador(id, data),
		onSuccess: () => {
			toast.success("Desarrollador asignado al sistema");
			invalidateSistemaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const endDesarrolladorMutation = useMutation({
		mutationFn: ({
			desarrolladorId,
			data,
		}: {
			desarrolladorId: number;
			data?: EndVigenciaInput;
		}) => sistemaApi.endDesarrollador(desarrolladorId, data),
		onSuccess: () => {
			toast.success("Asignación de desarrollador finalizada");
			invalidateSistemaQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	return {
		createSistemaMutation,
		updateSistemaMutation,
		assignResponsableMutation,
		endResponsableMutation,
		assignDesarrolladorMutation,
		endDesarrolladorMutation,
	};
}
