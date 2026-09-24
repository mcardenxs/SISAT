import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { Star, Award } from "lucide-react";
import { cn } from "@/core/utils/cn";

interface EvaluacionAtencionModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	atencionId: number;
}

export function EvaluacionAtencionModal({
	isOpen,
	onClose,
	ticketId,
	atencionId,
}: EvaluacionAtencionModalProps) {
	const [calificacion, setCalificacion] = useState<number>(5);
	const [confirmacion, setConfirmacion] = useState(true);
	const [conformidad, setConformidad] = useState("");
	const [inconformidad, setInconformidad] = useState("");

	const { createEvaluacionMutation } = useTicketMutations(ticketId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await createEvaluacionMutation.mutateAsync({
			id: ticketId,
			atencionId,
			data: {
				calificacion,
				confirmacion,
				conformidad: confirmacion ? conformidad.trim() || undefined : undefined,
				inconformidad: !confirmacion
					? inconformidad.trim() || undefined
					: undefined,
			},
		});

		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Evaluación de Atención Técnica"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="evaluacion-estrellas"
						className="block text-xs font-medium text-slate-300 mb-2"
					>
						Calificación del Servicio (1 a 5 estrellas)
					</label>
					<fieldset
						id="evaluacion-estrellas"
						aria-label="Calificación del Servicio en estrellas"
						className="flex items-center gap-1.5 border-0 p-0 m-0"
					>
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								type="button"
								onClick={() => setCalificacion(star)}
								aria-label={`Calificar con ${star} de 5 estrellas`}
								className="p-1 hover:scale-110 transition-transform focus:outline-none"
							>
								<Star
									className={cn(
										"h-7 w-7 transition-colors",
										star <= calificacion
											? "fill-amber-400 text-amber-400"
											: "text-slate-600 hover:text-slate-500",
									)}
								/>
							</button>
						))}
						<span className="ml-2 text-sm font-semibold text-slate-200">
							{calificacion} / 5
						</span>
					</fieldset>
				</div>

				<div className="flex items-center gap-2 pt-2">
					<input
						type="checkbox"
						id="confirmacionCheckbox"
						checked={confirmacion}
						onChange={(e) => setConfirmacion(e.target.checked)}
						className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						htmlFor="confirmacionCheckbox"
						className="text-xs font-medium text-slate-300"
					>
						¿Conformidad con la solución técnica implementada?
					</label>
				</div>

				{confirmacion ? (
					<div>
						<label
							htmlFor="evaluacion-conformidad-textarea"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Comentarios de Conformidad (opcional)
						</label>
						<textarea
							id="evaluacion-conformidad-textarea"
							value={conformidad}
							onChange={(e) => setConformidad(e.target.value)}
							rows={2}
							placeholder="Observaciones de satisfacción sobre la atención..."
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>
				) : (
					<div>
						<label
							htmlFor="evaluacion-inconformidad-textarea"
							className="block text-xs font-medium text-amber-400 mb-1"
						>
							Motivo de Inconformidad (explicación de la persistencia de falla)
						</label>
						<textarea
							id="evaluacion-inconformidad-textarea"
							value={inconformidad}
							onChange={(e) => setInconformidad(e.target.value)}
							rows={2}
							required
							placeholder="Describe por qué no se resolvió adecuadamente el requerimiento..."
							className="w-full rounded-lg border border-amber-500/40 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
						/>
					</div>
				)}

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={createEvaluacionMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							createEvaluacionMutation.isPending ||
							(!confirmacion && !inconformidad.trim())
						}
						className="gap-2"
					>
						<Award className="h-4 w-4" />
						{createEvaluacionMutation.isPending
							? "Guardando..."
							: "Registrar Evaluación"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
