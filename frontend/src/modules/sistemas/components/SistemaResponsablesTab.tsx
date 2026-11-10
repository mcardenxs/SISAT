import { useState } from "react";
import type { Responsable } from "../api/sistemaApi";
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
			<div className="flex items-center justify-between pb-3 border-b border-subtle">
				<div>
					<h3 className="text-sm font-semibold text-foreground">
						Equipo de Responsables del Software
					</h3>
					<p className="text-xs text-foreground-muted mt-0.5">
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
				<div className="rounded-surface border border-primary-border bg-surface p-5 shadow-surface">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-start gap-3.5">
							<div className="p-2.5 rounded-control bg-primary-light text-primary border border-primary-border">
								<ShieldCheck className="h-6 w-6" />
							</div>
							<div>
								<h4 className="text-base font-semibold text-foreground">
									{principal.usuarioNombre || `Usuario #${principal.usuarioId}`}
								</h4>
								<p className="text-xs text-foreground-muted mt-1">
									{principal.usuarioEmail}
								</p>
								<p className="text-[11px] text-foreground-subtle mt-0.5">
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
								className="text-foreground-muted hover:text-danger hover:bg-danger-subtle self-start sm:self-auto gap-1"
							>
								<UserMinus className="h-3.5 w-3.5" />
								Finalizar Vigencia
							</Button>
						</Can>
					</div>
				</div>
			) : (
				<div className="rounded-surface border border-warning-border bg-warning-subtle p-4 text-xs text-warning">
					Este sistema no tiene actualmente un{" "}
					<strong>Responsable Principal</strong> asignado.
				</div>
			)}

			{/* Responsables Secundarios Vigentes */}
			<div className="rounded-surface border border-subtle bg-surface p-5 shadow-surface">
				<h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
					Responsables Secundarios / Suplentes Vigentes ({secundarios.length})
				</h4>

				{secundarios.length === 0 ? (
					<p className="text-xs text-foreground-subtle italic">
						No hay responsables secundarios registrados.
					</p>
				) : (
					<div className="divide-y divide-subtle">
						{secundarios.map((r) => (
							<div
								key={r.id}
								className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
							>
								<div>
									<span className="font-semibold text-foreground">
										{r.usuarioNombre || `Usuario #${r.usuarioId}`}
									</span>
									<p className="text-foreground-muted text-[11px]">
										{r.usuarioEmail}
									</p>
									<span className="text-[10px] text-foreground-subtle">
										Inicio: {new Date(r.inicio).toLocaleDateString()}
									</span>
								</div>

								<Can resource="sistemas" action="update">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setSelectedToEnd(r)}
										className="text-foreground-muted hover:text-danger hover:bg-danger-subtle"
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
				<div className="rounded-surface border border-subtle bg-surface p-5 shadow-surface">
					<h4 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider mb-3 flex items-center gap-1.5">
						<History className="h-3.5 w-3.5 text-foreground-subtle" />
						Historial de Ex-Responsables ({historico.length})
					</h4>
					<div className="divide-y divide-subtle text-xs">
						{historico.map((r) => (
							<div
								key={r.id}
								className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-foreground-muted"
							>
								<div>
									<span className="text-foreground font-medium">
										{r.usuarioNombre || `Usuario #${r.usuarioId}`}
									</span>
									<span className="text-foreground-subtle text-[11px] ml-2">
										({r.usuarioEmail})
									</span>
								</div>
								<div className="text-[11px] text-foreground-subtle">
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
