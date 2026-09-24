import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

interface TerminarAtencionModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	atencionId: number;
}

const terminarSchema = z.object({
	diagnostico: z
		.string()
		.min(5, "El diagnóstico técnico debe tener al menos 5 caracteres"),
	solucion: z
		.string()
		.min(5, "La solución aplicada debe tener al menos 5 caracteres"),
	modulos: z.string().optional(),
	datos: z.string().optional(),
	cambios: z.string().optional(),
	comentarios: z.string().optional(),
});

export function TerminarAtencionModal({
	isOpen,
	onClose,
	ticketId,
	atencionId,
}: TerminarAtencionModalProps) {
	const [diagnostico, setDiagnostico] = useState("");
	const [solucion, setSolucion] = useState("");
	const [modulos, setModulos] = useState("");
	const [datos, setDatos] = useState("");
	const [cambios, setCambios] = useState("");
	const [comentarios, setComentarios] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { endAtencionMutation } = useTicketMutations(ticketId);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const validation = terminarSchema.safeParse({
			diagnostico: diagnostico.trim(),
			solucion: solucion.trim(),
			modulos: modulos.trim() || undefined,
			datos: datos.trim() || undefined,
			cambios: cambios.trim() || undefined,
			comentarios: comentarios.trim() || undefined,
		});

		if (!validation.success) {
			const errMap: Record<string, string> = {};
			for (const issue of validation.error.issues) {
				const field = issue.path[0] as string;
				errMap[field] = issue.message;
			}
			setErrors(errMap);
			return;
		}

		setErrors({});
		await endAtencionMutation.mutateAsync({
			atencionId,
			data: validation.data as {
				diagnostico: string;
				solucion: string;
				cambios?: string;
				modulos?: string;
				datos?: string;
				comentarios?: string;
			},
		});

		onClose();
		setDiagnostico("");
		setSolucion("");
		setModulos("");
		setDatos("");
		setCambios("");
		setComentarios("");
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Finalizar Atención Técnica (Diagnóstico y Solución)"
			className="max-w-xl"
		>
			<form onSubmit={handleSubmit} className="space-y-3.5">
				<div>
					<label
						htmlFor="terminar-diagnostico-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Diagnóstico Técnico (Causa Raíz) *
					</label>
					<textarea
						id="terminar-diagnostico-textarea"
						value={diagnostico}
						onChange={(e) => setDiagnostico(e.target.value)}
						rows={2}
						placeholder="Identificación del error, comportamiento anómalo o falla de origen..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
					{errors.diagnostico && (
						<p className="text-[11px] text-rose-400 mt-1">
							{errors.diagnostico}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="terminar-solucion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Solución Aplicada *
					</label>
					<textarea
						id="terminar-solucion-textarea"
						value={solucion}
						onChange={(e) => setSolucion(e.target.value)}
						rows={2}
						placeholder="Procedimiento técnico, fix de código o parche implementado..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
					{errors.solucion && (
						<p className="text-[11px] text-rose-400 mt-1">{errors.solucion}</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="terminar-modulos-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Módulos Afectados / Modificados
						</label>
						<input
							id="terminar-modulos-input"
							value={modulos}
							onChange={(e) => setModulos(e.target.value)}
							placeholder="ej. Módulo de Facturación, Auth"
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label
							htmlFor="terminar-datos-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Modificaciones a Base de Datos
						</label>
						<input
							id="terminar-datos-input"
							value={datos}
							onChange={(e) => setDatos(e.target.value)}
							placeholder="ej. Scripts DDL/DML, corrección de registros"
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="terminar-cambios-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Detalle de Cambios en Código / Configuración
					</label>
					<textarea
						id="terminar-cambios-textarea"
						value={cambios}
						onChange={(e) => setCambios(e.target.value)}
						rows={2}
						placeholder="Commits, pull requests o librerías actualizadas..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={endAtencionMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={endAtencionMutation.isPending}
						className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
					>
						<CheckCircle2 className="h-4 w-4" />
						{endAtencionMutation.isPending
							? "Terminando..."
							: "Concluir Atención Técnica"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
