import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/core/api/client";
import { ticketApi } from "../api/ticketApi";
import type {
	AssignTicketInput,
	ReassignTicketInput,
	StartAtencionInput,
	CreateIntervencionInput,
	CreateEvidenciaInput,
	TerminarAtencionInput,
	CreateEvaluacionInput,
	CloseTicketInput,
	ReopenTicketInput,
	MoveTicketInput,
	UpdateTicketInput,
} from "../api/types";

export function useTicketMutations(ticketId?: number) {
	const queryClient = useQueryClient();

	const invalidateTicketQueries = () => {
		queryClient.invalidateQueries({ queryKey: ["tickets"] });
		if (ticketId) {
			queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
		}
		queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
	};

	const assignMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: AssignTicketInput }) =>
			ticketApi.assign(id, data),
		onSuccess: () => {
			toast.success("Desarrollador asignado correctamente");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const reassignMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: ReassignTicketInput }) =>
			ticketApi.reassign(id, data),
		onSuccess: () => {
			toast.success("Ticket reasignado exitosamente");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const startAtencionMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data?: StartAtencionInput }) =>
			ticketApi.startAtencion(id, data),
		onSuccess: () => {
			toast.success("Ciclo de atención técnica iniciado");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const createIntervencionMutation = useMutation({
		mutationFn: ({
			atencionId,
			data,
		}: {
			atencionId: number;
			data: CreateIntervencionInput;
		}) => ticketApi.createIntervencion(atencionId, data),
		onSuccess: () => {
			toast.success("Intervención registrada en bitácora");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const createEvidenciaMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: CreateEvidenciaInput }) =>
			ticketApi.createEvidencia(id, data),
		onSuccess: () => {
			toast.success("Evidencia técnica adjuntada");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const endAtencionMutation = useMutation({
		mutationFn: ({
			atencionId,
			data,
		}: {
			atencionId: number;
			data: TerminarAtencionInput;
		}) => ticketApi.endAtencion(atencionId, data),
		onSuccess: () => {
			toast.success(
				"Atención técnica concluida. Pendiente de evaluación y cierre",
			);
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const createEvaluacionMutation = useMutation({
		mutationFn: ({
			id,
			atencionId,
			data,
		}: {
			id: number;
			atencionId: number;
			data: CreateEvaluacionInput;
		}) => ticketApi.createEvaluacion(id, atencionId, data),
		onSuccess: () => {
			toast.success("Evaluación de atención técnica registrada");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const closeTicketMutation = useMutation({
		mutationFn: ({
			id,
			atencionId,
			data,
		}: {
			id: number;
			atencionId: number;
			data?: CloseTicketInput;
		}) => ticketApi.closeTicket(id, atencionId, data),
		onSuccess: () => {
			toast.success("Ticket cerrado formalmente");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const reopenTicketMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: ReopenTicketInput }) =>
			ticketApi.reopenTicket(id, data),
		onSuccess: () => {
			toast.success("Ticket reabierto con un nuevo ciclo de atención");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const moveTicketMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: MoveTicketInput }) =>
			ticketApi.moveTicket(id, data),
		onSuccess: () => {
			toast.success("Ticket transferido a nuevo sistema");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const updateTicketMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateTicketInput }) =>
			ticketApi.update(id, data),
		onSuccess: () => {
			toast.success("Datos del ticket actualizados");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const pauseTicketMutation = useMutation({
		mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
			ticketApi.pause(id, { motivo }),
		onSuccess: () => {
			toast.warning("Ticket pausado (en espera de información)");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const resumeTicketMutation = useMutation({
		mutationFn: (id: number) => ticketApi.resume(id),
		onSuccess: () => {
			toast.success("Ticket reanudado a fase en proceso");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	const cancelTicketMutation = useMutation({
		mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
			ticketApi.cancel(id, { motivo }),
		onSuccess: () => {
			toast.error("Ticket cancelado formalmente");
			invalidateTicketQueries();
		},
		onError: (err) => toast.error(getErrorMessage(err)),
	});

	return {
		assignMutation,
		reassignMutation,
		startAtencionMutation,
		createIntervencionMutation,
		createEvidenciaMutation,
		endAtencionMutation,
		createEvaluacionMutation,
		closeTicketMutation,
		reopenTicketMutation,
		moveTicketMutation,
		updateTicketMutation,
		pauseTicketMutation,
		resumeTicketMutation,
		cancelTicketMutation,
	};
}
