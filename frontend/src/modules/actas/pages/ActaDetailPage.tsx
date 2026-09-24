import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useActaDetailQuery } from "../hooks/useActasQuery";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import {
	ArrowLeft,
	FileText,
	Upload,
	ExternalLink,
	Paperclip,
	Printer,
} from "lucide-react";
import { UploadArchivoActaModal } from "../components/UploadArchivoActaModal";
import { ActaPrintableTemplate } from "../components/ActaPrintableTemplate";

interface ActaDetailPageProps {
	actaId: number;
}

export function ActaDetailPage({ actaId }: ActaDetailPageProps) {
	const { data: acta, isLoading, error } = useActaDetailQuery(actaId);
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	const [activeView, setActiveView] = useState<"detalle" | "impresion">(
		"detalle",
	);

	if (isLoading) {
		return (
			<div className="p-16 text-center text-slate-400">
				Cargando detalle de acta semanal #{actaId}...
			</div>
		);
	}

	if (error || !acta) {
		return (
			<div className="p-8 text-center bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-400">
				<p className="font-semibold">
					Acta no encontrada o error al consultar.
				</p>
				<Link
					to="/actas"
					className="text-xs text-indigo-400 underline mt-2 inline-block"
				>
					Regresar al listado de actas
				</Link>
			</div>
		);
	}

	const getSituacionVariant = (codigo?: string) => {
		switch (codigo) {
			case "GENERADA":
				return "warning" as const;
			case "EN_FIRMA":
				return "purple" as const;
			case "CARGADA":
				return "success" as const;
			default:
				return "default" as const;
		}
	};

	return (
		<div className="space-y-6">
			{/* Barra superior de navegación */}
			<div className="flex items-center justify-between">
				<Link
					to="/actas"
					className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Volver a Actas
				</Link>

				<div className="flex items-center gap-2">
					<Button
						variant={activeView === "detalle" ? "outline" : "ghost"}
						size="sm"
						onClick={() => setActiveView("detalle")}
						className="text-xs"
					>
						<FileText className="h-3.5 w-3.5 mr-1" />
						Vista Operativa
					</Button>
					<Button
						variant={activeView === "impresion" ? "outline" : "ghost"}
						size="sm"
						onClick={() => setActiveView("impresion")}
						className="text-xs"
					>
						<Printer className="h-3.5 w-3.5 mr-1" />
						Plantilla Imprimible
					</Button>
				</div>
			</div>

			{activeView === "impresion" ? (
				<ActaPrintableTemplate acta={acta} />
			) : (
				<>
					{/* Encabezado Institucional */}
					<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
						<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2.5">
									<span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/40 px-2.5 py-0.5 rounded border border-indigo-500/20">
										{acta.folio}
									</span>
									<Badge variant={getSituacionVariant(acta.situacionCodigo)}>
										{acta.situacionNombre || acta.situacionCodigo}
									</Badge>
								</div>
								<h1 className="text-2xl font-bold tracking-tight text-white pt-1">
									Acta Semanal de Entrega-Recepción
								</h1>
								<p className="text-xs text-slate-400">
									Periodo: <strong>{acta.inicio}</strong> al{" "}
									<strong>{acta.fin}</strong> (7 días naturales)
								</p>
							</div>

							<div className="flex items-center gap-2.5 self-start md:self-auto">
								<Can resource="actas" action="create">
									<Button
										size="sm"
										onClick={() => setIsUploadOpen(true)}
										className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
									>
										<Upload className="h-4 w-4" />
										Subir Acta Firmada (PDF)
									</Button>
								</Can>
							</div>
						</div>

						{/* Datos del Acta */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
							<div className="rounded-xl bg-slate-950/40 p-3.5 border border-slate-800 text-xs">
								<span className="text-[10px] text-slate-500 uppercase block font-semibold">
									Sistema Involucrado
								</span>
								<span className="font-medium text-slate-200 mt-0.5 block">
									{acta.sistemaNombre}
								</span>
							</div>

							<div className="rounded-xl bg-slate-950/40 p-3.5 border border-slate-800 text-xs">
								<span className="text-[10px] text-slate-500 uppercase block font-semibold">
									Área Solicitante
								</span>
								<span className="font-medium text-slate-200 mt-0.5 block">
									{acta.areaNombre}
								</span>
							</div>

							<div className="rounded-xl bg-slate-950/40 p-3.5 border border-slate-800 text-xs">
								<span className="text-[10px] text-slate-500 uppercase block font-semibold">
									Firmante Responsable
								</span>
								<span className="font-medium text-slate-200 mt-0.5 block">
									{acta.firmanteNombre}
								</span>
							</div>
						</div>

						{acta.observacion && (
							<p className="text-xs text-slate-400 bg-slate-950/30 p-3 rounded-lg border border-slate-800">
								<strong>Observaciones: </strong>
								{acta.observacion}
							</p>
						)}
					</div>

					{/* Tabla de Inclusiones Semanales */}
					<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<h3 className="text-sm font-semibold text-white">
								Atenciones Técnicas Incluidas en el Acta (
								{acta.inclusiones?.length || 0})
							</h3>
						</div>

						{!acta.inclusiones || acta.inclusiones.length === 0 ? (
							<p className="text-xs text-slate-500 italic text-center py-6">
								No se incluyeron tickets en este periodo de acta.
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-left text-xs">
									<thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider">
										<tr>
											<th className="px-4 py-3">Folio</th>
											<th className="px-4 py-3">Problema Reportado</th>
											<th className="px-4 py-3">Solución Implementada</th>
											<th className="px-4 py-3">Desarrolladores</th>
											<th className="px-4 py-3 text-center">Calificación</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-800/60">
										{acta.inclusiones.map((inc) => (
											<tr
												key={inc.id}
												className="hover:bg-slate-800/30 transition-colors"
											>
												<td className="px-4 py-3 font-mono font-semibold text-indigo-400">
													<Link
														to="/tickets/$ticketId"
														params={{ ticketId: String(inc.ticketId) }}
														className="hover:underline flex items-center gap-1"
													>
														{inc.ticketFolio || `#${inc.ticketId}`}
														<ExternalLink className="h-3 w-3" />
													</Link>
												</td>
												<td className="px-4 py-3 text-slate-300 max-w-xs truncate">
													{inc.problema}
												</td>
												<td className="px-4 py-3 text-slate-300 max-w-xs truncate">
													{inc.solucion}
												</td>
												<td className="px-4 py-3 text-slate-400 text-[11px]">
													{inc.desarrolladores?.join(", ") || "Equipo TI"}
												</td>
												<td className="px-4 py-3 text-center">
													{inc.calificacion ? (
														<Badge
															variant="warning"
															className="font-mono text-[10px]"
														>
															{inc.calificacion} / 5
														</Badge>
													) : (
														<span className="text-slate-500">N/A</span>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* Módulo de Archivos Adjuntos */}
					<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
						<div className="flex items-center justify-between border-b border-slate-800 pb-3">
							<h3 className="text-sm font-semibold text-white flex items-center gap-2">
								<Paperclip className="h-4 w-4 text-indigo-400" />
								Documentos y Archivos Oficiales ({acta.archivos?.length || 0})
							</h3>
						</div>

						{!acta.archivos || acta.archivos.length === 0 ? (
							<div className="text-center py-6 text-xs text-slate-500 italic">
								Aún no se ha cargado el acta firmada ni anexos en PDF.
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{acta.archivos.map((arc) => (
									<div
										key={arc.id}
										className="p-3 rounded-lg border border-slate-800 bg-slate-950/50 flex items-start justify-between gap-2 text-xs"
									>
										<div className="space-y-1 min-w-0">
											<div className="flex items-center gap-1.5">
												<Badge
													variant="purple"
													className="text-[10px] uppercase"
												>
													{arc.formato}
												</Badge>
												{arc.claseCodigo && (
													<span className="text-[10px] text-emerald-400 font-semibold">
														{arc.claseCodigo}
													</span>
												)}
											</div>
											<p className="font-semibold text-slate-200 truncate">
												{arc.nombre}
											</p>
											{arc.observacion && (
												<p className="text-[11px] text-slate-400 truncate">
													{arc.observacion}
												</p>
											)}
											<span className="text-[10px] text-slate-500 block">
												{(arc.tamano / 1024).toFixed(1)} KB &bull;{" "}
												{new Date(arc.fecha).toLocaleDateString()}
											</span>
										</div>

										<a
											href={arc.ruta}
											target="_blank"
											rel="noreferrer"
											className="p-1.5 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
											title="Descargar o ver archivo"
										>
											<ExternalLink className="h-4 w-4" />
										</a>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}

			{/* Modal Carga de Archivo */}
			<UploadArchivoActaModal
				isOpen={isUploadOpen}
				onClose={() => setIsUploadOpen(false)}
				actaId={acta.id}
			/>
		</div>
	);
}
