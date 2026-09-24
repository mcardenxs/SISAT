import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { AlertTriangle } from "lucide-react";

interface EndVigenciaConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	personName: string;
	onConfirm: (fin?: string) => Promise<void>;
	isPending: boolean;
}

export function EndVigenciaConfirmModal({
	isOpen,
	onClose,
	title,
	personName,
	onConfirm,
	isPending,
}: EndVigenciaConfirmModalProps) {
	const [finDate, setFinDate] = useState(new Date().toISOString().slice(0, 16));

	const handleConfirm = async (e: React.FormEvent) => {
		e.preventDefault();
		await onConfirm(finDate ? new Date(finDate).toISOString() : undefined);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<form onSubmit={handleConfirm} className="space-y-4">
				<div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300">
					<AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
					<div>
						<p className="font-semibold text-slate-100">
							Confirmación de Finalización de Vigencia
						</p>
						<p className="mt-1 text-slate-300">
							Estás a punto de dar de baja la vinculación activa de{" "}
							<strong className="text-white">{personName}</strong> con este
							sistema. Esta acción quedará asentada en el histórico.
						</p>
					</div>
				</div>

				<div>
					<label
						htmlFor="end-vigencia-fecha-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Fecha y Hora Oficial de Término
					</label>
					<Input
						id="end-vigencia-fecha-input"
						type="datetime-local"
						value={finDate}
						onChange={(e) => setFinDate(e.target.value)}
						required
					/>
				</div>

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
						disabled={isPending}
						className="gap-2 bg-rose-600 hover:bg-rose-500 text-white"
					>
						{isPending ? "Finalizando..." : "Dar de Baja / Finalizar Vigencia"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
