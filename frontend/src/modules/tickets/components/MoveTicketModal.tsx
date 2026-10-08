import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { sistemaApi } from "@/modules/sistemas/api/sistemaApi";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { toast } from "sonner";
import { ArrowRightLeft } from "lucide-react";

interface MoveTicketModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	currentSistemaId: number;
	currentSistemaNombre?: string;
}

export function MoveTicketModal({
	isOpen,
	onClose,
	ticketId,
	currentSistemaId,
	currentSistemaNombre = "Sistema Actual",
}: MoveTicketModalProps) {
	const [sistemaDestinoId, setSistemaDestinoId] = useState<number>(0);
	const [motivo, setMotivo] = useState("");

	const { moveTicketMutation } = useTicketMutations(ticketId);

	const { data: sistemas = [], isLoading } = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
		enabled: isOpen,
	});

	const availableSistemas = sistemas.filter((s) => s.id !== currentSistemaId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!sistemaDestinoId) {
			toast.error("Seleccione el sistema institucional de destino");
			return;
		}
		if (!motivo.trim()) {
			toast.error("Debe indicar el motivo de la transferencia de sistema");
			return;
		}

		await moveTicketMutation.mutateAsync({
			id: ticketId,
			data: {
				sistemaDestinoId,
				motivo: motivo.trim(),
			},
		});

		onClose();
		setSistemaDestinoId(0);
		setMotivo("");
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Cambio de Sistema Institucional Asociado"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-xs leading-relaxed">
					<div className="flex items-center gap-1.5 font-semibold text-blue-200 mb-1">
						<ArrowRightLeft className="h-4 w-4" />
						Reclasificación de Sistema (Doc. 3.8)
					</div>
					Al transferir este ticket a otro sistema institucional, las
					asignaciones técnicas previas concluirán y el ticket iniciará
					registrado para que el responsable del nuevo sistema lo asigne a su
					equipo técnico.
				</div>

				<div>
					<label
						htmlFor="sistema-origen-input"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
					>
						Sistema Actual
					</label>
					<input
						id="sistema-origen-input"
						type="text"
						value={currentSistemaNombre}
						disabled
						className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
					/>
				</div>

				<div>
					<label
						htmlFor="sistema-destino-select"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
					>
						Sistema de Destino *
					</label>
					<select
						id="sistema-destino-select"
						value={sistemaDestinoId}
						onChange={(e) => setSistemaDestinoId(Number(e.target.value))}
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						required
						disabled={isLoading}
					>
						<option value={0}>Seleccione el nuevo sistema...</option>
						{availableSistemas.map((s) => (
							<option key={s.id} value={s.id}>
								{s.clave} - {s.nombre}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="movimiento-motivo-textarea"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
					>
						Motivo del Cambio *
					</label>
					<textarea
						id="movimiento-motivo-textarea"
						rows={3}
						value={motivo}
						onChange={(e) => setMotivo(e.target.value)}
						placeholder="Explique por qué este ticket corresponde a otro sistema institucional..."
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						required
					/>
				</div>

				<div className="flex items-center justify-end gap-2 pt-2">
					<Button variant="ghost" onClick={onClose}>
						Cancelar
					</Button>
					<Button
						type="submit"
						isLoading={moveTicketMutation.isPending}
						disabled={sistemaDestinoId === 0 || !motivo.trim()}
					>
						Transferir Ticket
					</Button>
				</div>
			</form>
		</Modal>
	);
}
