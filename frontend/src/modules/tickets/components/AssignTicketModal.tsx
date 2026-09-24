import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/modules/users/api/usersApi";
import { useTicketMutations } from "../hooks/useTicketMutations";
import type { Asignacion } from "../api/types";
import { UserCheck, RefreshCw } from "lucide-react";

interface AssignTicketModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	currentAsignacion?: Asignacion;
}

export function AssignTicketModal({
	isOpen,
	onClose,
	ticketId,
	currentAsignacion,
}: AssignTicketModalProps) {
	const isReassign = Boolean(currentAsignacion);
	const [selectedUserId, setSelectedUserId] = useState<number | "">("");
	const [isPrincipal, setIsPrincipal] = useState(true);
	const [motivo, setMotivo] = useState("");

	const { assignMutation, reassignMutation } = useTicketMutations(ticketId);

	const { data: usersData, isLoading: isLoadingUsers } = useQuery({
		queryKey: ["usersListForAssign"],
		queryFn: () => usersApi.getUsers({ limit: 100 }),
		enabled: isOpen,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUserId) return;

		if (isReassign && currentAsignacion) {
			if (!motivo.trim()) return;
			await reassignMutation.mutateAsync({
				id: ticketId,
				data: {
					usuarioOrigenId: currentAsignacion.usuarioId,
					usuarioDestinoId: Number(selectedUserId),
					motivo: motivo.trim(),
				},
			});
		} else {
			await assignMutation.mutateAsync({
				id: ticketId,
				data: {
					usuarioId: Number(selectedUserId),
					principal: isPrincipal,
				},
			});
		}

		onClose();
		setMotivo("");
		setSelectedUserId("");
	};

	const isPending = assignMutation.isPending || reassignMutation.isPending;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={
				isReassign
					? "Reasignar Ticket de Soporte"
					: "Asignar Desarrollador al Ticket"
			}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				{isReassign && currentAsignacion && (
					<div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
						<span className="font-semibold">Desarrollador actual: </span>
						{currentAsignacion.usuarioNombre ||
							`Usuario #${currentAsignacion.usuarioId}`}
					</div>
				)}

				<div>
					<label
						htmlFor="assign-user-select"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						{isReassign
							? "Nuevo Desarrollador Asignado"
							: "Seleccionar Desarrollador"}
					</label>
					<select
						id="assign-user-select"
						value={selectedUserId}
						onChange={(e) => setSelectedUserId(Number(e.target.value))}
						required
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">
							{isLoadingUsers
								? "Cargando usuarios..."
								: "Selecciona un usuario..."}
						</option>
						{usersData?.data
							.filter(
								(u) => !isReassign || u.id !== currentAsignacion?.usuarioId,
							)
							.map((u) => (
								<option key={u.id} value={u.id}>
									{u.name} {u.apellido || ""} ({u.email}) - {u.role}
								</option>
							))}
					</select>
				</div>

				{!isReassign && (
					<div className="flex items-center gap-2 pt-1">
						<input
							type="checkbox"
							id="principalCheckbox"
							checked={isPrincipal}
							onChange={(e) => setIsPrincipal(e.target.checked)}
							className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="principalCheckbox"
							className="text-xs text-slate-300"
						>
							Marcar como responsable técnico principal
						</label>
					</div>
				)}

				{isReassign && (
					<div>
						<label
							htmlFor="reassign-motivo"
							className="block text-xs font-medium text-slate-300 mb-1.5"
						>
							Motivo de la reasignación (obligatorio)
						</label>
						<Input
							id="reassign-motivo"
							value={motivo}
							onChange={(e) => setMotivo(e.target.value)}
							placeholder="Explica la causa de cambio de técnico..."
							required
							minLength={5}
						/>
					</div>
				)}

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							isPending || !selectedUserId || (isReassign && !motivo.trim())
						}
						className="gap-2"
					>
						{isReassign ? (
							<RefreshCw className="h-4 w-4" />
						) : (
							<UserCheck className="h-4 w-4" />
						)}
						{isPending
							? "Guardando..."
							: isReassign
								? "Confirmar Reasignación"
								: "Asignar Técnico"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
