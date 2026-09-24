import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/modules/users/api/usersApi";
import { useSistemaMutations } from "../hooks/useSistemaMutations";
import { Code2 } from "lucide-react";

interface AssignDesarrolladorModalProps {
	isOpen: boolean;
	onClose: () => void;
	sistemaId: number;
}

export function AssignDesarrolladorModal({
	isOpen,
	onClose,
	sistemaId,
}: AssignDesarrolladorModalProps) {
	const [usuarioId, setUsuarioId] = useState<number | "">("");
	const [inicio, setInicio] = useState(new Date().toISOString().slice(0, 16));

	const { assignDesarrolladorMutation } = useSistemaMutations(sistemaId);

	const { data: usersData, isLoading: isLoadingUsers } = useQuery({
		queryKey: ["usersListForSistemaDev"],
		queryFn: () => usersApi.getUsers({ limit: 100 }),
		enabled: isOpen,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!usuarioId) return;

		await assignDesarrolladorMutation.mutateAsync({
			id: sistemaId,
			data: {
				usuarioId: Number(usuarioId),
				inicio: inicio ? new Date(inicio).toISOString() : undefined,
			},
		});

		onClose();
		setUsuarioId("");
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Asignar Desarrollador al Sistema"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="dev-user-select"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Seleccionar Usuario Desarrollador *
					</label>
					<select
						id="dev-user-select"
						value={usuarioId}
						onChange={(e) => setUsuarioId(Number(e.target.value))}
						required
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">
							{isLoadingUsers
								? "Cargando usuarios..."
								: "Selecciona desarrollador..."}
						</option>
						{usersData?.data.map((u) => (
							<option key={u.id} value={u.id}>
								{u.name} {u.apellido || ""} ({u.email}) - {u.role}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="dev-inicio-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Fecha y Hora de Incorporación
					</label>
					<Input
						id="dev-inicio-input"
						type="datetime-local"
						value={inicio}
						onChange={(e) => setInicio(e.target.value)}
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={assignDesarrolladorMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={assignDesarrolladorMutation.isPending || !usuarioId}
						className="gap-2"
					>
						<Code2 className="h-4 w-4" />
						{assignDesarrolladorMutation.isPending
							? "Asignando..."
							: "Asignar al Equipo"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
