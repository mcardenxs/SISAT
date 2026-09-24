import type { Transicion, Asignacion, Movimiento } from "../api/types";
import { Badge } from "@/core/components/ui/Badge";
import { ArrowRight, Clock, User, ArrowLeftRight, History } from "lucide-react";

interface TicketTimelineProps {
	transiciones?: Transicion[];
	asignaciones?: Asignacion[];
	movimientos?: Movimiento[];
}

export function TicketTimeline({
	transiciones = [],
	asignaciones = [],
	movimientos = [],
}: TicketTimelineProps) {
	return (
		<div className="space-y-6">
			{/* Transiciones de Fase */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
					<History className="h-4 w-4 text-indigo-400" />
					Bitácora de Transiciones de Fase
				</h3>

				{transiciones.length === 0 ? (
					<p className="text-xs text-slate-500 italic">
						No hay transiciones registradas aún.
					</p>
				) : (
					<div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
						{transiciones.map((tr) => (
							<div key={tr.id} className="relative">
								<div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-950" />
								<div className="space-y-1">
									<div className="flex flex-wrap items-center gap-2 text-xs">
										{tr.faseOrigenNombre ? (
											<span className="text-slate-400">
												{tr.faseOrigenNombre}
											</span>
										) : (
											<span className="text-slate-500">Inicio</span>
										)}
										<ArrowRight className="h-3 w-3 text-slate-500" />
										<Badge variant="info">
											{tr.faseDestinoNombre || "Fase desconocida"}
										</Badge>
										<span className="text-slate-500 text-[11px] flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{new Date(tr.fecha).toLocaleString()}
										</span>
									</div>
									<div className="text-xs text-slate-300 flex items-center gap-1">
										<User className="h-3 w-3 text-slate-500" />
										<span>
											Por: {tr.usuarioNombre || `Usuario #${tr.usuarioId}`}
										</span>
									</div>
									{tr.comentario && (
										<p className="text-xs text-slate-400 bg-slate-950/60 rounded-md p-2 border border-slate-800/80 mt-1">
											{tr.comentario}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Historial de Asignaciones */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
					<User className="h-4 w-4 text-indigo-400" />
					Historial de Desarrolladores Asignados
				</h3>

				{asignaciones.length === 0 ? (
					<p className="text-xs text-slate-500 italic">
						Sin técnicos asignados hasta el momento.
					</p>
				) : (
					<div className="divide-y divide-slate-800/80">
						{asignaciones.map((asig) => (
							<div
								key={asig.id}
								className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
							>
								<div>
									<div className="flex items-center gap-2">
										<span className="font-semibold text-slate-200">
											{asig.usuarioNombre || `Usuario #${asig.usuarioId}`}
										</span>
										{asig.principal && (
											<Badge variant="purple" className="text-[10px]">
												Principal
											</Badge>
										)}
										{!asig.fin ? (
											<Badge variant="success" className="text-[10px]">
												Vigente
											</Badge>
										) : (
											<Badge variant="default" className="text-[10px]">
												Finalizada
											</Badge>
										)}
									</div>
									<p className="text-slate-400 text-[11px] mt-0.5">
										Asignado por: {asig.usuarioAsignaNombre || "Administrador"}
									</p>
								</div>

								<div className="text-right text-[11px] text-slate-500">
									<div>Inicio: {new Date(asig.fecha).toLocaleDateString()}</div>
									{asig.fin && (
										<div>Fin: {new Date(asig.fin).toLocaleDateString()}</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Movimientos o Reclasificaciones */}
			{movimientos.length > 0 && (
				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
					<h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
						<ArrowLeftRight className="h-4 w-4 text-indigo-400" />
						Reclasificaciones de Sistema
					</h3>
					<div className="space-y-3">
						{movimientos.map((m) => (
							<div
								key={m.id}
								className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 text-xs"
							>
								<div className="flex items-center gap-2 font-medium text-slate-300">
									<span>{m.sistemaOrigenNombre}</span>
									<ArrowRight className="h-3 w-3 text-slate-500" />
									<span className="text-indigo-400">
										{m.sistemaDestinoNombre}
									</span>
								</div>
								<p className="text-slate-400 mt-1">Motivo: {m.motivo}</p>
								<div className="mt-2 text-[11px] text-slate-500">
									Por: {m.usuarioNombre} &bull;{" "}
									{new Date(m.fecha).toLocaleString()}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
