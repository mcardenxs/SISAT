import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { CheckCircle } from "lucide-react";

interface CierreTicketModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	atencionId: number;
}

export function CierreTicketModal({
	isOpen,
	onClose,
	ticketId,
	atencionId,
}: CierreTicketModalProps) {
	const [comentario, setComentario] = useState("");

	const { closeTicketMutation } = useTicketMutations(ticketId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await closeTicketMutation.mutateAsync({
			id: ticketId,
			atencionId,
			data: {
				comentario: comentario.trim() || undefined,
			},
		});

		onClose();
		setComentario("");
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Cierre Formal del Ticket">
			<form onSubmit={handleSubmit} className="space-y-4">
				<p className="text-xs text-slate-300">
					Al cerrar formalmente este ticket, su fase pasará a{" "}
					<strong className="text-emerald-400">CERRADO_POR_RESPONSABLE</strong>{" "}
					y quedará disponible para su agrupación en las actas semanales de
					entrega-recepción.
				</p>

				<div>
					<label
						htmlFor="cierre-comentario-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Comentario Final de Cierre (opcional)
					</label>
					<textarea
						id="cierre-comentario-textarea"
						value={comentario}
						onChange={(e) => setComentario(e.target.value)}
						rows={3}
						placeholder="ej. Ticket solventado a entera satisfacción de la jefatura solicitante..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={closeTicketMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={closeTicketMutation.isPending}
						className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
					>
						<CheckCircle className="h-4 w-4" />
						{closeTicketMutation.isPending
							? "Cerrando..."
							: "Confirmar Cierre Formal"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
