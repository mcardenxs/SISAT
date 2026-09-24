import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { RotateCcw } from "lucide-react";

interface ReabrirTicketModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	atencionOrigenId: number;
}

export function ReabrirTicketModal({
	isOpen,
	onClose,
	ticketId,
	atencionOrigenId,
}: ReabrirTicketModalProps) {
	const [motivo, setMotivo] = useState("");
	const [comentario, setComentario] = useState("");

	const { reopenTicketMutation } = useTicketMutations(ticketId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!motivo.trim()) return;

		await reopenTicketMutation.mutateAsync({
			id: ticketId,
			data: {
				atencionOrigenId,
				motivo: motivo.trim(),
				comentario: comentario.trim() || undefined,
			},
		});

		onClose();
		setMotivo("");
		setComentario("");
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Reabrir Ticket de Soporte (Nuevo Ciclo)"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
					Al reabrir el ticket, se iniciará un nuevo ciclo consecutivo de
					atención técnica. El ticket regresará a la fase inicial y los ciclos
					previos quedarán registrados en el histórico.
				</div>

				<div>
					<label
						htmlFor="reabrir-motivo-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Motivo de Reapertura (Persistencia o nueva anomalía) *
					</label>
					<textarea
						id="reabrir-motivo-textarea"
						value={motivo}
						onChange={(e) => setMotivo(e.target.value)}
						rows={3}
						required
						minLength={5}
						placeholder="Describe la inconsistencia o persistencia del problema que justifica la reapertura..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div>
					<label
						htmlFor="reabrir-comentario-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Comentarios Adicionales (opcional)
					</label>
					<input
						id="reabrir-comentario-input"
						value={comentario}
						onChange={(e) => setComentario(e.target.value)}
						placeholder="Instrucciones para el técnico..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={reopenTicketMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={reopenTicketMutation.isPending || !motivo.trim()}
						className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
					>
						<RotateCcw className="h-4 w-4" />
						{reopenTicketMutation.isPending
							? "Reabriendo..."
							: "Confirmar Reapertura"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
