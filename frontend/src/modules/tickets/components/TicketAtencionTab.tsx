import type { Atencion, Evidencia } from "../api/types";
import { Badge } from "@/core/components/ui/Badge";
import {
	Clock,
	FileText,
	Database,
	Layers,
	CheckCircle2,
	ExternalLink,
	Paperclip,
	Lock,
} from "lucide-react";

interface TicketAtencionTabProps {
	atencion?: Atencion | null;
	ticketEvidencias?: Evidencia[];
}

export function TicketAtencionTab({
	atencion,
	ticketEvidencias = [],
}: TicketAtencionTabProps) {
	if (!atencion) {
		return (
			<div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
				Este ticket aún no cuenta con un ciclo de atención técnica iniciado.
			</div>
		);
	}

	const allEvidencias = [
		...(atencion.evidencias || []),
		...ticketEvidencias.filter(
			(e) => !atencion.evidencias?.some((ae) => ae.id === e.id),
		),
	];

	return (
		<div className="space-y-6">
			{/* Diagnóstico y Solución Técnica */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
					<div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
						<FileText className="h-4 w-4" />
						Diagnóstico Técnico (Causa Raíz)
					</div>
					<p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
						{atencion.diagnostico || (
							<span className="text-slate-500 italic">
								En análisis por el desarrollador asignado...
							</span>
						)}
					</p>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
					<div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
						<CheckCircle2 className="h-4 w-4" />
						Solución Aplicada
					</div>
					<p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
						{atencion.solucion || (
							<span className="text-slate-500 italic">
								Pendiente de resolución técnica...
							</span>
						)}
					</p>
				</div>
			</div>

			{/* Módulos y Base de Datos */}
			{(atencion.modulos || atencion.datos || atencion.cambios) && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{atencion.modulos && (
						<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
							<span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
								<Layers className="h-3.5 w-3.5 text-indigo-400" />
								Módulos Afectados
							</span>
							<p className="text-xs text-slate-200">{atencion.modulos}</p>
						</div>
					)}
					{atencion.datos && (
						<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
							<span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
								<Database className="h-3.5 w-3.5 text-amber-400" />
								Modificaciones en BD
							</span>
							<p className="text-xs text-slate-200">{atencion.datos}</p>
						</div>
					)}
					{atencion.cambios && (
						<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
							<span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
								<FileText className="h-3.5 w-3.5 text-cyan-400" />
								Cambios de Configuración
							</span>
							<p className="text-xs text-slate-200">{atencion.cambios}</p>
						</div>
					)}
				</div>
			)}

			{/* Bitácora de Intervenciones */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
					<h3 className="text-sm font-semibold text-white flex items-center gap-2">
						<Clock className="h-4 w-4 text-indigo-400" />
						Bitácora de Intervenciones de Tiempo
					</h3>
					<span className="text-xs text-slate-400">
						Total acumulado:{" "}
						<strong className="text-indigo-300">
							{atencion.intervenciones?.reduce(
								(acc, i) => acc + i.minutos,
								0,
							) || 0}{" "}
							minutos
						</strong>
					</span>
				</div>

				{!atencion.intervenciones || atencion.intervenciones.length === 0 ? (
					<p className="text-xs text-slate-500 italic">
						No se han registrado intervenciones de tiempo en este ciclo.
					</p>
				) : (
					<div className="divide-y divide-slate-800/80">
						{atencion.intervenciones.map((intv) => (
							<div
								key={intv.id}
								className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4 text-xs"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-slate-200">
											{intv.usuarioNombre || `Técnico #${intv.usuarioId}`}
										</span>
										{intv.interno && (
											<Badge variant="warning" className="text-[10px] gap-1">
												<Lock className="h-2.5 w-2.5" />
												Interno
											</Badge>
										)}
										<span className="text-slate-500 text-[11px]">
											{new Date(intv.fecha).toLocaleString()}
										</span>
									</div>
									<p className="text-slate-300">{intv.descripcion}</p>
								</div>
								<Badge variant="purple" className="shrink-0 font-mono">
									{intv.minutos} min
								</Badge>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Evidencias Adjuntas */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
					<h3 className="text-sm font-semibold text-white flex items-center gap-2">
						<Paperclip className="h-4 w-4 text-indigo-400" />
						Archivos y Evidencias Técnicas
					</h3>
					<span className="text-xs text-slate-400">
						{allEvidencias.length} archivo(s)
					</span>
				</div>

				{allEvidencias.length === 0 ? (
					<p className="text-xs text-slate-500 italic">
						No se han adjuntado evidencias a este ciclo.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{allEvidencias.map((evi) => (
							<div
								key={evi.id}
								className="p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-colors flex items-start justify-between gap-2"
							>
								<div className="space-y-1 min-w-0">
									<div className="flex items-center gap-1.5">
										<Badge variant="default" className="text-[10px] uppercase">
											{evi.formato || "file"}
										</Badge>
										{evi.claseCodigo && (
											<span className="text-[10px] text-indigo-400 font-medium">
												{evi.claseCodigo}
											</span>
										)}
									</div>
									<p className="text-xs font-semibold text-slate-200 truncate">
										{evi.nombre}
									</p>
									{evi.descripcion && (
										<p className="text-[11px] text-slate-400 truncate">
											{evi.descripcion}
										</p>
									)}
									<span className="text-[10px] text-slate-500 block">
										{(evi.tamano / 1024).toFixed(1)} KB &bull;{" "}
										{new Date(evi.fecha).toLocaleDateString()}
									</span>
								</div>

								<a
									href={evi.ruta}
									target="_blank"
									rel="noreferrer"
									className="p-1.5 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors shrink-0"
									title="Abrir evidencia"
								>
									<ExternalLink className="h-4 w-4" />
								</a>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
