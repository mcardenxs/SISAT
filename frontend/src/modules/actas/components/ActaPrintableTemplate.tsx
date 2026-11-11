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
		<div className="space-y-4 print:space-y-0 print:m-0 print:p-0 print:h-full">
			{/* Botón de impresión (oculto al imprimir) */}
			<div className="flex justify-end print:hidden">
				<Button onClick={handlePrint} size="sm" className="gap-2">
					<Printer className="h-4 w-4" />
					Imprimir / Exportar a PDF
				</Button>
			</div>

			{/* Formato Oficial de Acta Imprimible */}
			<div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl print:shadow-none print:m-0 print:bg-white print:text-black print:rounded-none print:w-full acta-printable-sheet">
				{/* 1. Membrete Institucional */}
				<div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
					<div className="flex items-center gap-3">
						<div className="h-11 w-11 flex items-center justify-center bg-slate-900 text-white rounded-lg shadow-sm">
							<Hexagon className="h-6 w-6" />
						</div>
						<div>
							<h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-900 leading-tight">
								Sistema de Seguimiento y Atención Técnica (SISAT)
							</h2>
							<p className="text-xs font-semibold text-slate-600 tracking-wide">
								Acta Oficial Semanal de Entrega-Recepción de Servicios Técnicos
							</p>
						</div>
					</div>
					<div className="text-right">
						<span className="font-mono text-base sm:text-lg font-black text-slate-900 block whitespace-nowrap">
							{acta.folio}
						</span>
						<span className="text-xs text-slate-600 whitespace-nowrap">
							Fecha de emisión: {new Date(acta.generacion).toLocaleDateString()}
						</span>
					</div>
				</div>

				{/* 2. Datos Generales del Periodo */}
				<div className="grid grid-cols-2 gap-x-8 gap-y-3.5 text-xs bg-slate-50/70 p-4 rounded-lg border border-slate-300 print:bg-transparent print:border-slate-300">
					<div>
						<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
							Sistema Institucional:
						</span>
						<span className="text-xs sm:text-sm font-bold text-slate-900">
							{acta.sistemaNombre}
						</span>
					</div>
					<div>
						<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
							Área Solicitante:
						</span>
						<span className="text-xs sm:text-sm font-bold text-slate-900">
							{acta.areaNombre}
						</span>
					</div>
					<div>
						<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
							Periodo Semanal Cubierto:
						</span>
						<span className="text-xs sm:text-sm font-bold text-slate-900">
							Del {acta.inicio} al {acta.fin} (7 días naturales)
						</span>
					</div>
					<div>
						<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
							Firmante / Responsable Designado:
						</span>
						<span className="text-xs sm:text-sm font-bold text-slate-900">
							{acta.firmanteNombre}
						</span>
					</div>
				</div>

				{/* 3. Tabla de Inclusiones Semanales */}
				<div className="flex flex-col">
					<div className="flex items-center justify-between border-b border-slate-400 pb-1 mb-2">
						<h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
							Relación de Atenciones Técnicas Concluidas
						</h3>
						<span className="text-xs font-mono font-bold text-slate-700">
							Total atenciones: {acta.inclusiones?.length || 0}
						</span>
					</div>
					<table className="w-full text-left text-xs border border-slate-300 divide-y divide-slate-300">
						<thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider print:bg-slate-200">
							<tr>
								<th className="p-2 border-r border-slate-300 w-28">
									Folio Ticket
								</th>
								<th className="p-2 border-r border-slate-300">
									Problema Atendido
								</th>
								<th className="p-2 border-r border-slate-300">
									Solución Técnica Aplicada
								</th>
								<th className="p-2 border-r border-slate-300 w-44">
									Técnicos Intervinientes
								</th>
								<th className="p-2 text-center w-24">Calificación</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-300 text-xs">
							{acta.inclusiones?.map((inc) => (
								<tr key={inc.id} className="align-top break-inside-avoid">
									<td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-300 whitespace-nowrap">
										{inc.ticketFolio || `#${inc.ticketId}`}
									</td>
									<td className="p-2 border-r border-slate-300 text-slate-800">
										{inc.problema}
									</td>
									<td className="p-2 border-r border-slate-300 text-slate-800">
										{inc.solucion}
									</td>
									<td className="p-2 border-r border-slate-300 text-[11px] text-slate-700">
										{inc.desarrolladores.join(", ") || "Equipo TI"}
									</td>
									<td className="p-2 text-center font-bold text-slate-900">
										{inc.calificacion ? `${inc.calificacion}/5` : "Conforme"}
									</td>
								</tr>
							))}
							{(!acta.inclusiones || acta.inclusiones.length === 0) && (
								<tr>
									<td
										colSpan={5}
										className="py-8 px-6 text-center text-slate-500 italic text-xs bg-slate-50/40"
									>
										<p className="font-semibold text-slate-700 text-xs sm:text-sm">
											No se registraron atenciones técnicas concluidas en este
											periodo semanal.
										</p>
										<p className="text-[11px] text-slate-500 mt-1 max-w-lg mx-auto">
											Durante el lapso reportado, el sistema institucional operó
											con normalidad técnica sin registrar incidencias cerradas
											o atenciones técnicas concluidas.
										</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* 4. Sección de Cierre: Conformidad, Firmas Oficiales Uniformes y Pie Institucional */}
				<div className="break-inside-avoid flex flex-col">
					<p className="text-xs text-slate-600 text-center mb-4 max-w-2xl mx-auto leading-relaxed">
						Los firmantes manifiestan su conformidad con las atenciones técnicas
						descritas en la presente acta, dando fe de la entrega y recepción
						formal de los servicios prestados conforme a las normas
						institucionales del SISAT.
					</p>

					{/* Tabla estructural de Firmas: Garantiza matemáticamente que las 3 líneas estén al mismo nivel */}
					<table className="w-full border-collapse text-center mb-4">
						<tbody>
							{/* Fila 1: Altura reservada exactamente idéntica para las 3 firmas/sellos */}
							<tr>
								<td className="w-1/3 h-16 align-bottom pb-2"></td>
								<td className="w-1/3 h-16 align-bottom pb-2"></td>
								<td className="w-1/3 h-16 align-bottom pb-2"></td>
							</tr>
							{/* Fila 2: Líneas de firma horizontales y datos de los firmantes */}
							<tr>
								<td className="w-1/3 px-3 align-top">
									<div className="border-t-2 border-slate-900 pt-2 flex flex-col items-center">
										<div className="font-bold text-slate-900 uppercase text-[11px] leading-tight min-h-[28px] flex items-center justify-center text-center">
											1. Jefatura de Área Solicitante
										</div>
										<div className="text-[11px] font-medium text-slate-700 leading-tight min-h-[28px] flex items-center justify-center text-center mt-0.5">
											{acta.areaNombre}
										</div>
										<div className="text-[10px] text-slate-500 italic mt-1">
											Nombre, Cargo y Firma
										</div>
									</div>
								</td>
								<td className="w-1/3 px-3 align-top">
									<div className="border-t-2 border-slate-900 pt-2 flex flex-col items-center">
										<div className="font-bold text-slate-900 uppercase text-[11px] leading-tight min-h-[28px] flex items-center justify-center text-center">
											2. Responsable del Sistema
										</div>
										<div className="text-[11px] font-medium text-slate-700 leading-tight min-h-[28px] flex items-center justify-center text-center mt-0.5">
											{acta.firmanteNombre}
										</div>
										<div className="text-[10px] text-slate-500 italic mt-1">
											Firma de Conformidad
										</div>
									</div>
								</td>
								<td className="w-1/3 px-3 align-top">
									<div className="border-t-2 border-slate-900 pt-2 flex flex-col items-center">
										<div className="font-bold text-slate-900 uppercase text-[11px] leading-tight min-h-[28px] flex items-center justify-center text-center">
											3. Coordinación de Desarrollo TI
										</div>
										<div className="text-[11px] font-medium text-slate-700 leading-tight min-h-[28px] flex items-center justify-center text-center mt-0.5">
											Área de Tecnologías de la Información
										</div>
										<div className="text-[10px] text-slate-500 italic mt-1">
											Sello y Firma de Entrega
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* Pie de página institucional oficial (sin quiebre de línea ni desbordamiento) */}
					<div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[9.5px] text-slate-500 font-medium tracking-normal">
						<span className="whitespace-nowrap">
							SISAT &bull; Sistema de Seguimiento y Atención Técnica
						</span>
						<span className="whitespace-nowrap font-mono font-semibold">
							Folio Oficial: {acta.folio}
						</span>
						<span className="whitespace-nowrap">
							Documento Oficial Certificado
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
