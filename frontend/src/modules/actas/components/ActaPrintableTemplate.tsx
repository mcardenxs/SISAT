import type { Acta } from "../api/actaApi";
import { Button } from "@/core/components/ui/Button";
import { Printer, Hexagon } from "lucide-react";

interface ActaPrintableTemplateProps {
	acta: Acta;
}

export function ActaPrintableTemplate({ acta }: ActaPrintableTemplateProps) {
	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="space-y-4">
			{/* Botón de impresión (oculto al imprimir) */}
			<div className="flex justify-end print:hidden">
				<Button onClick={handlePrint} size="sm" className="gap-2">
					<Printer className="h-4 w-4" />
					Imprimir / Exportar a PDF
				</Button>
			</div>

			{/* Formato Oficial de Acta Imprimible */}
			<div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl print:shadow-none print:p-0 print:m-0 print:bg-white print:text-black">
				{/* Membrete Institucional */}
				<div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 flex items-center justify-center bg-slate-900 text-white rounded">
							<Hexagon className="h-6 w-6" />
						</div>
						<div>
							<h2 className="text-lg font-bold tracking-tight uppercase text-slate-900">
								Sistema de Seguimiento y Atención Técnica (SISAT)
							</h2>
							<p className="text-xs text-slate-600 font-medium">
								Acta Oficial Semanal de Entrega-Recepción de Servicios Técnicos
							</p>
						</div>
					</div>
					<div className="text-right">
						<span className="font-mono text-base font-bold text-slate-900 block">
							{acta.folio}
						</span>
						<span className="text-xs text-slate-500">
							Fecha de emisión: {new Date(acta.generacion).toLocaleDateString()}
						</span>
					</div>
				</div>

				{/* Datos Generales del Periodo */}
				<div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded border border-slate-200 print:bg-transparent print:border-slate-300">
					<div>
						<span className="font-bold text-slate-700 block">
							Sistema Institucional:
						</span>
						<span className="text-slate-900 font-medium">
							{acta.sistemaNombre}
						</span>
					</div>
					<div>
						<span className="font-bold text-slate-700 block">
							Área Solicitante:
						</span>
						<span className="text-slate-900 font-medium">
							{acta.areaNombre}
						</span>
					</div>
					<div>
						<span className="font-bold text-slate-700 block">
							Periodo Semanal Cubierto:
						</span>
						<span className="text-slate-900 font-medium">
							Del {acta.inicio} al {acta.fin} (7 días naturales)
						</span>
					</div>
					<div>
						<span className="font-bold text-slate-700 block">
							Firmante / Responsable Designado:
						</span>
						<span className="text-slate-900 font-medium">
							{acta.firmanteNombre}
						</span>
					</div>
				</div>

				{/* Tabla de Inclusiones Semanales */}
				<div className="mb-8">
					<h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-300 pb-1">
						Relación de Atenciones Técnicas Concluidas (
						{acta.inclusiones?.length || 0})
					</h3>
					<table className="w-full text-left text-xs border border-slate-300 divide-y divide-slate-300">
						<thead className="bg-slate-100 text-slate-700 font-semibold print:bg-slate-200">
							<tr>
								<th className="p-2 border-r border-slate-300">Folio Ticket</th>
								<th className="p-2 border-r border-slate-300">
									Problema Atendido
								</th>
								<th className="p-2 border-r border-slate-300">
									Solución Técnica Aplicada
								</th>
								<th className="p-2 border-r border-slate-300">
									Técnicos Intervinientes
								</th>
								<th className="p-2 text-center">Calificación</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-300">
							{acta.inclusiones?.map((inc) => (
								<tr key={inc.id} className="align-top">
									<td className="p-2 font-mono font-bold text-slate-800 border-r border-slate-300">
										{inc.ticketFolio || `#${inc.ticketId}`}
									</td>
									<td className="p-2 border-r border-slate-300 max-w-[180px]">
										{inc.problema}
									</td>
									<td className="p-2 border-r border-slate-300 max-w-[200px]">
										{inc.solucion}
									</td>
									<td className="p-2 border-r border-slate-300 text-[11px]">
										{inc.desarrolladores.join(", ") || "Equipo TI"}
									</td>
									<td className="p-2 text-center font-bold">
										{inc.calificacion ? `${inc.calificacion}/5` : "Conforme"}
									</td>
								</tr>
							))}
							{(!acta.inclusiones || acta.inclusiones.length === 0) && (
								<tr>
									<td
										colSpan={5}
										className="p-4 text-center text-slate-500 italic"
									>
										No hay atenciones técnicas registradas en este periodo.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Espacios Oficiales Designados para Firmas */}
				<div className="pt-10 break-inside-avoid">
					<p className="text-[11px] text-slate-600 text-center mb-10">
						Los firmantes manifiestan su conformidad con las atenciones técnicas
						descritas en la presente acta.
					</p>

					<div className="grid grid-cols-3 gap-6 text-center text-xs">
						{/* 1. Firma Jefatura de Área Solicitante */}
						<div className="space-y-2">
							<div className="border-t-2 border-slate-900 pt-2 font-bold text-slate-900">
								1. Jefatura de Área Solicitante
							</div>
							<p className="text-[11px] text-slate-600">{acta.areaNombre}</p>
							<div className="text-[10px] text-slate-400 italic">
								Nombre, Cargo y Firma
							</div>
						</div>

						{/* 2. Firma del Responsable del Sistema */}
						<div className="space-y-2">
							<div className="border-t-2 border-slate-900 pt-2 font-bold text-slate-900">
								2. Responsable del Sistema
							</div>
							<p className="text-[11px] text-slate-600">
								{acta.firmanteNombre}
							</p>
							<div className="text-[10px] text-slate-400 italic">
								Firma de Conformidad
							</div>
						</div>

						{/* 3. Firma del Coordinador de Desarrollo */}
						<div className="space-y-2">
							<div className="border-t-2 border-slate-900 pt-2 font-bold text-slate-900">
								3. Coordinación de Desarrollo TI
							</div>
							<p className="text-[11px] text-slate-600">
								Área de Tecnologías de la Información
							</p>
							<div className="text-[10px] text-slate-400 italic">
								Sello y Firma de Entrega
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
