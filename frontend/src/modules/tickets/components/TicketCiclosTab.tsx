import type { Atencion } from "../api/types";
import { Badge } from "@/core/components/ui/Badge";
import { History, Award, CheckCircle, Clock } from "lucide-react";

interface TicketCiclosTabProps {
	atenciones?: Atencion[];
	currentCiclo?: number;
}

export function TicketCiclosTab({
	atenciones = [],
	currentCiclo,
}: TicketCiclosTabProps) {
	const previousCiclos = atenciones.filter((a) => a.ciclo !== currentCiclo);

	if (previousCiclos.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-slate-800 p-10 text-center text-slate-500">
				<History className="h-8 w-8 mx-auto text-slate-600 mb-2" />
				<p className="font-semibold text-slate-300">
					Sin historial de ciclos previos
				</p>
				<p className="text-xs text-slate-500 mt-1">
					Este ticket se encuentra en su ciclo original de resolución. Si es
					reabierto, aquí se archivarán los ciclos cerrados.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			{previousCiclos.map((ciclo) => (
				<div
					key={ciclo.id}
					className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
				>
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<div className="flex items-center gap-2">
							<Badge variant="purple" className="font-semibold text-xs">
								Ciclo #{ciclo.ciclo}
							</Badge>
							<span className="text-xs text-slate-400 flex items-center gap-1">
								<Clock className="h-3 w-3 text-slate-500" />
								Iniciado: {new Date(ciclo.inicio).toLocaleString()}
							</span>
						</div>

						{ciclo.evaluacion && (
							<div className="flex items-center gap-1.5 text-xs text-amber-300">
								<Award className="h-4 w-4 text-amber-400" />
								<span>{ciclo.evaluacion.calificacion} / 5 estrellas</span>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
						<div>
							<span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
								Diagnóstico reportado en el ciclo
							</span>
							<p className="text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
								{ciclo.diagnostico || "Sin diagnóstico especificado"}
							</p>
						</div>

						<div>
							<span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
								Solución entregada
							</span>
							<p className="text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
								{ciclo.solucion || "Sin solución registrada"}
							</p>
						</div>
					</div>

					{ciclo.cierre && (
						<div className="rounded-lg bg-emerald-950/20 border border-emerald-900/40 p-3 text-xs flex items-start gap-2">
							<CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
							<div>
								<span className="font-semibold text-emerald-300">
									Cierre del Ciclo por: {ciclo.cierre.usuarioNombre}
								</span>
								<p className="text-slate-300 mt-0.5">
									{ciclo.cierre.comentario || "Sin comentarios de cierre."}
								</p>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
