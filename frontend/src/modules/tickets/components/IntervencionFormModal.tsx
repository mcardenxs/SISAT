import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { Clock } from "lucide-react";

interface IntervencionFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	atencionId: number;
}

export function IntervencionFormModal({
	isOpen,
	onClose,
	ticketId,
	atencionId,
}: IntervencionFormModalProps) {
	const [minutos, setMinutos] = useState<number>(30);
	const [descripcion, setDescripcion] = useState("");
	const [interno, setInterno] = useState(false);

	const { createIntervencionMutation } = useTicketMutations(ticketId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!descripcion.trim() || minutos <= 0) return;

		await createIntervencionMutation.mutateAsync({
			atencionId,
			data: {
				descripcion: descripcion.trim(),
				minutos,
				interno,
			},
		});

		onClose();
		setDescripcion("");
		setMinutos(30);
		setInterno(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Registrar Intervención Técnica"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="intervencion-minutos"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Tiempo Invertido (minutos)
					</label>
					<Input
						id="intervencion-minutos"
						type="number"
						min={1}
						step={5}
						value={minutos}
						onChange={(e) => setMinutos(Number(e.target.value))}
						required
					/>
					<p className="text-[11px] text-slate-500 mt-1">
						Equivalente a {(minutos / 60).toFixed(1)} hora(s) de labor técnica
					</p>
				</div>

				<div>
					<label
						htmlFor="intervencion-desc"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Descripción de Actividades Realizadas
					</label>
					<textarea
						id="intervencion-desc"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						rows={3}
						required
						minLength={3}
						placeholder="Detalla las pruebas, análisis de código, corrección de bugs o ajustes realizados..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center gap-2 pt-1">
					<input
						type="checkbox"
						id="intervencionInterno"
						checked={interno}
						onChange={(e) => setInterno(e.target.checked)}
						className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="intervencionInterno"
						className="text-xs text-slate-300"
					>
						Nota técnica interna (no visible para el solicitante final)
					</label>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={createIntervencionMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							createIntervencionMutation.isPending ||
							!descripcion.trim() ||
							minutos <= 0
						}
						className="gap-2"
					>
						<Clock className="h-4 w-4" />
						{createIntervencionMutation.isPending
							? "Guardando..."
							: "Registrar Intervención"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
