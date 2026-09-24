import { useState } from "react";
import type { Desarrollador } from "../api/sistemaApi";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import { Code2, UserPlus, UserMinus, History } from "lucide-react";
import { AssignDesarrolladorModal } from "./AssignDesarrolladorModal";
import { EndVigenciaConfirmModal } from "./EndVigenciaConfirmModal";
import { useSistemaMutations } from "../hooks/useSistemaMutations";

interface SistemaDesarrolladoresTabProps {
	sistemaId: number;
	desarrolladores?: Desarrollador[];
}

export function SistemaDesarrolladoresTab({
	sistemaId,
	desarrolladores = [],
}: SistemaDesarrolladoresTabProps) {
	const [isAssignOpen, setIsAssignOpen] = useState(false);
	const [selectedToEnd, setSelectedToEnd] = useState<Desarrollador | null>(
		null,
	);

	const { endDesarrolladorMutation } = useSistemaMutations(sistemaId);

	const vigentes = desarrolladores.filter((d) => !d.fin);
	const historico = desarrolladores.filter((d) => d.fin);

	const handleEndConfirm = async (fin?: string) => {
		if (!selectedToEnd) return;
		await endDesarrolladorMutation.mutateAsync({
			desarrolladorId: selectedToEnd.id,
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
						Equipo de Desarrollo Asignado
					</h3>
					<p className="text-xs text-slate-400 mt-0.5">
						Desarrolladores autorizados para atender incidencias y emitir
						diagnósticos en este software.
					</p>
				</div>
				<Can resource="sistemas" action="update">
					<Button
						size="sm"
						onClick={() => setIsAssignOpen(true)}
						className="gap-1.5"
					>
						<UserPlus className="h-4 w-4" />
						Asignar Desarrollador
					</Button>
				</Can>
			</div>

			{/* Grilla de Desarrolladores Vigentes */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
					<Code2 className="h-4 w-4 text-indigo-400" />
					Técnicos y Programadores en Activo ({vigentes.length})
				</h4>

				{vigentes.length === 0 ? (
					<p className="text-xs text-slate-500 italic">
						No hay desarrolladores asignados activamente a este sistema.
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{vigentes.map((dev) => (
							<div
								key={dev.id}
								className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-start justify-between gap-3"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-sm text-slate-200">
											{dev.usuarioNombre || `Desarrollador #${dev.usuarioId}`}
										</span>
										<Badge variant="success" className="text-[10px]">
											Activo
										</Badge>
									</div>
									<p className="text-xs text-slate-400">{dev.usuarioEmail}</p>
									<span className="text-[11px] text-slate-500 block pt-1">
										Incorporación: {new Date(dev.inicio).toLocaleDateString()}
									</span>
								</div>

								<Can resource="sistemas" action="update">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedToEnd(dev)}
										className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
										title="Finalizar asignación"
									>
										<UserMinus className="h-3.5 w-3.5" />
									</Button>
								</Can>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Histórico de Ex-Desarrolladores */}
			{historico.length > 0 && (
				<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
					<h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
						<History className="h-3.5 w-3.5 text-slate-500" />
						Historial de Desarrolladores Anteriores ({historico.length})
					</h4>
					<div className="divide-y divide-slate-800/60 text-xs">
						{historico.map((dev) => (
							<div
								key={dev.id}
								className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-slate-400"
							>
								<div>
									<span className="text-slate-300 font-medium">
										{dev.usuarioNombre || `Usuario #${dev.usuarioId}`}
									</span>
									<span className="text-slate-500 text-[11px] ml-2">
										({dev.usuarioEmail})
									</span>
								</div>
								<div className="text-[11px] text-slate-500">
									{new Date(dev.inicio).toLocaleDateString()} &mdash;{" "}
									{dev.fin
										? new Date(dev.fin).toLocaleDateString()
										: "Concluido"}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Modales */}
			<AssignDesarrolladorModal
				isOpen={isAssignOpen}
				onClose={() => setIsAssignOpen(false)}
				sistemaId={sistemaId}
			/>

			{selectedToEnd && (
				<EndVigenciaConfirmModal
					isOpen={Boolean(selectedToEnd)}
					onClose={() => setSelectedToEnd(null)}
					title="Finalizar Asignación de Desarrollador"
					personName={
						selectedToEnd.usuarioNombre || `Usuario #${selectedToEnd.usuarioId}`
					}
					onConfirm={handleEndConfirm}
					isPending={endDesarrolladorMutation.isPending}
				/>
			)}
		</div>
	);
}
