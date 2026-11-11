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
			<div className="flex items-center justify-between pb-3 border-b border-subtle">
				<div>
					<h3 className="text-sm font-semibold text-foreground">
						Equipo de Desarrollo Asignado
					</h3>
					<p className="text-xs text-foreground-muted mt-0.5">
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
			<div className="rounded-surface border border-subtle bg-surface p-5 shadow-surface">
				<h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-4 flex items-center gap-2">
					<Code2 className="h-4 w-4 text-primary" />
					Técnicos y Programadores en Activo ({vigentes.length})
				</h4>

				{vigentes.length === 0 ? (
					<p className="text-xs text-foreground-subtle italic">
						No hay desarrolladores asignados activamente a este sistema.
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{vigentes.map((dev) => (
							<div
								key={dev.id}
								className="p-4 rounded-control border border-subtle bg-surface-subtle flex items-start justify-between gap-3"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-sm text-foreground">
											{dev.usuarioNombre || `Desarrollador #${dev.usuarioId}`}
										</span>
										<Badge variant="success" className="text-[10px]">
											Activo
										</Badge>
									</div>
									<p className="text-xs text-foreground-muted">
										{dev.usuarioEmail}
									</p>
									<span className="text-[11px] text-foreground-subtle block pt-1">
										Incorporación: {new Date(dev.inicio).toLocaleDateString()}
									</span>
								</div>

								<Can resource="sistemas" action="update">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedToEnd(dev)}
										className="text-foreground-muted hover:text-danger hover:bg-danger-subtle"
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
				<div className="rounded-surface border border-subtle bg-surface p-5 shadow-surface">
					<h4 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3 flex items-center gap-1.5">
						<History className="h-3.5 w-3.5 text-foreground-subtle" />
						Historial de Desarrolladores Anteriores ({historico.length})
					</h4>
					<div className="divide-y divide-subtle text-xs">
						{historico.map((dev) => (
							<div
								key={dev.id}
								className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-foreground-muted"
							>
								<div>
									<span className="text-foreground font-medium">
										{dev.usuarioNombre || `Usuario #${dev.usuarioId}`}
									</span>
									<span className="text-foreground-subtle text-[11px] ml-2">
										({dev.usuarioEmail})
									</span>
								</div>
								<div className="text-[11px] text-foreground-subtle">
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
