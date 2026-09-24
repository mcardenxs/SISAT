import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { actaApi, type CreateActaInput } from "../api/actaApi";
import { sistemaApi } from "@/modules/sistemas/api/sistemaApi";
import { toast } from "sonner";

interface CreateActaModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateActaModal({ isOpen, onClose }: CreateActaModalProps) {
	const queryClient = useQueryClient();

	// Periodo por defecto de 7 días (DATEDIFF = 6)
	const today = new Date();
	const defaultStart = new Date(today);
	defaultStart.setDate(today.getDate() - 6);
	const defaultEnd = today;

	const [formData, setFormData] = useState<CreateActaInput>({
		sistemaId: 0,
		inicio: defaultStart.toISOString().split("T")[0],
		fin: defaultEnd.toISOString().split("T")[0],
		observacion: "",
	});

	const { data: sistemas } = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
		enabled: isOpen,
	});

	const mutation = useMutation({
		mutationFn: actaApi.create,
		onSuccess: (newActa) => {
			toast.success(`Acta ${newActa.folio} generada con éxito`);
			queryClient.invalidateQueries({ queryKey: ["actas"] });
			onClose();
		},
		onError: (err: Error & { response?: { data?: { error?: string } } }) => {
			const msg =
				err.response?.data?.error || err.message || "Error al generar acta";
			toast.error(msg);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.sistemaId) {
			toast.error("Seleccione un sistema institucional");
			return;
		}

		// Validar DATEDIFF = 6
		const d1 = new Date(`${formData.inicio}T00:00:00Z`);
		const d2 = new Date(`${formData.fin}T00:00:00Z`);
		const diff = Math.round(
			(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
		);
		if (diff !== 6) {
			toast.error(
				`El periodo debe ser exactamente de 7 días (DATEDIFF=6). Días seleccionados: ${diff}`,
			);
			return;
		}

		mutation.mutate(formData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Generar Acta Semanal de Soporte"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="acta-sistema-select"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
					>
						Sistema Institucional
					</label>
					<select
						id="acta-sistema-select"
						value={formData.sistemaId}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								sistemaId: Number(e.target.value),
							}))
						}
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
						required
					>
						<option value={0}>Seleccione un sistema...</option>
						{sistemas?.map((s) => (
							<option key={s.id} value={s.id}>
								{s.clave} - {s.nombre}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<Input
						type="date"
						label="Fecha Inicial"
						value={formData.inicio}
						onChange={(e) => {
							const start = e.target.value;
							// Auto-calcular fin para cumplir DATEDIFF = 6 (7 días)
							const d = new Date(`${start}T00:00:00Z`);
							d.setDate(d.getDate() + 6);
							setFormData((prev) => ({
								...prev,
								inicio: start,
								fin: d.toISOString().split("T")[0],
							}));
						}}
						required
					/>

					<Input
						type="date"
						label="Fecha Final (+6 días)"
						value={formData.fin}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, fin: e.target.value }))
						}
						required
					/>
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="acta-observacion-textarea"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
					>
						Observaciones del Acta
					</label>
					<textarea
						id="acta-observacion-textarea"
						rows={2}
						value={formData.observacion}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, observacion: e.target.value }))
						}
						placeholder="Notas u observaciones para el acta semanal..."
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
					/>
				</div>

				<div className="flex items-center justify-end gap-2 pt-2">
					<Button variant="ghost" onClick={onClose}>
						Cancelar
					</Button>
					<Button type="submit" isLoading={mutation.isPending}>
						Generar e Incluir Tickets
					</Button>
				</div>
			</form>
		</Modal>
	);
}
