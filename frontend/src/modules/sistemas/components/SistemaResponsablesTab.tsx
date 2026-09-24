import { useState } from "react";
import type { Responsable } from "../api/sistemaApi";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import { UserCheck, ShieldCheck, UserMinus, History } from "lucide-react";
import { AssignResponsableModal } from "./AssignResponsableModal";
import { EndVigenciaConfirmModal } from "./EndVigenciaConfirmModal";
import { useSistemaMutations } from "../hooks/useSistemaMutations";

interface SistemaResponsablesTabProps {
	sistemaId: number;
	responsables?: Responsable[];
}

export function SistemaResponsablesTab({
	sistemaId,
	responsables = [],
}: SistemaResponsablesTabProps) {
	const [isAssignOpen, setIsAssignOpen] = useState(false);
	const [selectedToEnd, setSelectedToEnd] = useState<Responsable | null>(null);

	const { endResponsableMutation } = useSistemaMutations(sistemaId);

	const vigentes = responsables.filter((r) => !r.fin);
	const principal = vigentes.find((r) => r.principal);
	const secundarios = vigentes.filter((r) => !r.principal);
	const historico = responsables.filter((r) => r.fin);

	const handleEndConfirm = async (fin?: string) => {
		if (!selectedToEnd) return;
		await endResponsableMutation.mutateAsync({
			responsableId: selectedToEnd.id,
			data: { fin },
		});
		setSelectedToEnd(null);
	};

	return (
		<div className="space-y-6">
			{/* Barra de acción */}
			<div className="flex items-center justify-between pb-3 border-b border-slate-800">
				<div>
					<h3 className="text-sm font-semibold text-white">
						Equipo de Responsables del Software
					</h3>
					<p className="text-xs text-slate-400 mt-0.5">
						Funcionarios autorizados para validación técnica, cierre y emisión
						de actas.
					</p>
				</div>
				<Can resource="sistemas" action="update">
					<Button
						size="sm"
						onClick={() => setIsAssignOpen(true)}
						className="gap-1.5"
					>
						<UserCheck className="h-4 w-4" />
						Nombrar Responsable
					</Button>
				</Can>
			</div>

			{/* Tarjeta destacada: Responsable Principal Vigente */}
			{principal ? (
				<div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-5 shadow-lg">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-start gap-3.5">
							<div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
								<ShieldCheck className="h-6 w-6" />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<h4 className="text-base font-bold text-white">
										{principal.usuarioNombre ||
											`Usuario #${principal.usuarioId}`}
									</h4>
									<Badge variant="purple" className="text-xs">
										Responsable Principal
									</Badge>
									<Badge variant="success" className="text-xs">
										Vigente
									</Badge>
								</div>
								<p className="text-xs text-slate-300 mt-1">
									{principal.usuarioEmail}
								</p>
								<p className="text-[11px] text-slate-500 mt-0.5">
									En funciones desde:{" "}
									{new Date(principal.inicio).toLocaleDateString()}
								</p>
							</div>
						</div>

						<Can resource="sistemas" action="update">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelectedToEnd(principal)}
								className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 self-start sm:self-auto gap-1"
							>
								<UserMinus className="h-3.5 w-3.5" />
								Finalizar Vigencia
							</Button>
						</Can>
					</div>
				</div>
			) : (
				<div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300">
					Este sistema no tiene actualmente un{" "}
					<strong>Responsable Principal</strong> asignado.
				</div>
			)}

			{/* Responsables Secundarios Vigentes */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
					Responsables Secundarios / Suplentes Vigentes ({secundarios.length})
				</h4>

				{secundarios.length === 0 ? (
					<p className="text-xs text-slate-500 italic">
						No hay responsables secundarios registrados.
					</p>
				) : (
					<div className="divide-y divide-slate-800/80">
						{secundarios.map((r) => (
							<div
								key={r.id}
								className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
							>
								<div>
									<span className="font-semibold text-slate-200">
										{r.usuarioNombre || `Usuario #${r.usuarioId}`}
									</span>
									<p className="text-slate-400 text-[11px]">{r.usuarioEmail}</p>
									<span className="text-[10px] text-slate-500">
										Inicio: {new Date(r.inicio).toLocaleDateString()}
									</span>
								</div>

								<Can resource="sistemas" action="update">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedToEnd(r)}
										className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
									>
										Dar de Baja
									</Button>
								</Can>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Historial de Ex-Responsables */}
			{historico.length > 0 && (
				<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
					<h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
						<History className="h-3.5 w-3.5 text-slate-500" />
						Historial de Ex-Responsables ({historico.length})
					</h4>
					<div className="divide-y divide-slate-800/60 text-xs">
						{historico.map((r) => (
							<div
								key={r.id}
								className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-slate-400"
							>
								<div>
									<span className="text-slate-300 font-medium">
										{r.usuarioNombre || `Usuario #${r.usuarioId}`}
									</span>
									<span className="text-slate-500 text-[11px] ml-2">
										({r.usuarioEmail})
									</span>
								</div>
								<div className="text-[11px] text-slate-500">
									{new Date(r.inicio).toLocaleDateString()} &mdash;{" "}
									{r.fin ? new Date(r.fin).toLocaleDateString() : "Concluido"}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Modales */}
			<AssignResponsableModal
				isOpen={isAssignOpen}
				onClose={() => setIsAssignOpen(false)}
				sistemaId={sistemaId}
			/>

			{selectedToEnd && (
				<EndVigenciaConfirmModal
					isOpen={Boolean(selectedToEnd)}
					onClose={() => setSelectedToEnd(null)}
					title="Dar de Baja a Responsable de Sistema"
					personName={
						selectedToEnd.usuarioNombre || `Usuario #${selectedToEnd.usuarioId}`
					}
					onConfirm={handleEndConfirm}
					isPending={endResponsableMutation.isPending}
				/>
			)}
		</div>
	);
}
