import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/modules/users/api/usersApi";
import { useSistemaMutations } from "../hooks/useSistemaMutations";
import { UserCheck } from "lucide-react";

interface AssignResponsableModalProps {
	isOpen: boolean;
	onClose: () => void;
	sistemaId: number;
}

export function AssignResponsableModal({
	isOpen,
	onClose,
	sistemaId,
}: AssignResponsableModalProps) {
	const [usuarioId, setUsuarioId] = useState<number | "">("");
	const [principal, setPrincipal] = useState(true);
	const [inicio, setInicio] = useState(new Date().toISOString().slice(0, 16));

	const { assignResponsableMutation } = useSistemaMutations(sistemaId);

	const { data: usersData, isLoading: isLoadingUsers } = useQuery({
		queryKey: ["usersListForSistema"],
		queryFn: () => usersApi.getUsers({ limit: 100 }),
		enabled: isOpen,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!usuarioId) return;

		await assignResponsableMutation.mutateAsync({
			id: sistemaId,
			data: {
				usuarioId: Number(usuarioId),
				principal,
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
			title="Nombrar Responsable del Sistema"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="responsable-user-select"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Usuario Funcionario / Responsable *
					</label>
					<select
						id="responsable-user-select"
						value={usuarioId}
						onChange={(e) => setUsuarioId(Number(e.target.value))}
						required
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">
							{isLoadingUsers
								? "Cargando usuarios..."
								: "Selecciona usuario..."}
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
						htmlFor="responsable-inicio-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Fecha y Hora de Inicio de Vigencia
					</label>
					<Input
						id="responsable-inicio-input"
						type="datetime-local"
						value={inicio}
						onChange={(e) => setInicio(e.target.value)}
					/>
				</div>

				<div className="flex items-center gap-2 pt-1">
					<input
						type="checkbox"
						id="principalResponsableSwitch"
						checked={principal}
						onChange={(e) => setPrincipal(e.target.checked)}
						className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="principalResponsableSwitch"
						className="text-xs text-slate-300"
					>
						Nombrar como <strong>Responsable Principal</strong> vigente
					</label>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={assignResponsableMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={assignResponsableMutation.isPending || !usuarioId}
						className="gap-2"
					>
						<UserCheck className="h-4 w-4" />
						{assignResponsableMutation.isPending
							? "Guardando..."
							: "Nombrar Responsable"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
