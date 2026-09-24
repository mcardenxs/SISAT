import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSistemaDetailQuery } from "../hooks/useSistemasQuery";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import {
	ArrowLeft,
	Monitor,
	Building2,
	ExternalLink,
	Edit,
	ShieldCheck,
	Code2,
	Ticket as TicketIcon,
} from "lucide-react";
import { SistemaResponsablesTab } from "../components/SistemaResponsablesTab";
import { SistemaDesarrolladoresTab } from "../components/SistemaDesarrolladoresTab";
import { SistemaTicketsTab } from "../components/SistemaTicketsTab";
import { EditSistemaModal } from "../components/EditSistemaModal";

interface SistemaDetailPageProps {
	sistemaId: number;
}

export function SistemaDetailPage({ sistemaId }: SistemaDetailPageProps) {
	const { data: sistema, isLoading, error } = useSistemaDetailQuery(sistemaId);
	const [activeTab, setActiveTab] = useState<
		"responsables" | "desarrolladores" | "tickets"
	>("responsables");
	const [isEditOpen, setIsEditOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="p-16 text-center text-slate-400">
				Cargando detalle del sistema #{sistemaId}...
			</div>
		);
	}

	if (error || !sistema) {
		return (
			<div className="p-8 text-center bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-400">
				<p className="font-semibold">Sistema institucional no encontrado.</p>
				<Link
					to="/sistemas"
					className="text-xs text-indigo-400 underline mt-2 inline-block"
				>
					Regresar a Sistemas
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Navegación de regreso */}
			<div className="flex items-center justify-between">
				<Link
					to="/sistemas"
					className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Volver a Sistemas
				</Link>
				<span className="text-xs text-slate-500">
					Actualizado: {new Date(sistema.actualizacion).toLocaleDateString()}
				</span>
			</div>

			{/* Ficha Técnica Principal */}
			<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2.5">
							<span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/50 px-2.5 py-0.5 rounded border border-indigo-500/20 uppercase">
								{sistema.clave}
							</span>
							<Badge variant={sistema.estadoId === 1 ? "success" : "default"}>
								{sistema.estadoNombre ||
									(sistema.estadoId === 1 ? "Activo" : "Inactivo")}
							</Badge>
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white pt-1">
							{sistema.nombre}
						</h1>
					</div>

					<div className="flex items-center gap-2 self-start md:self-auto">
						{sistema.url && (
							<a
								href={sistema.url}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center"
							>
								<Button variant="outline" size="sm" className="gap-1.5">
									<ExternalLink className="h-3.5 w-3.5 text-slate-400" />
									Ir al Sistema
								</Button>
							</a>
						)}
						<Can resource="sistemas" action="update">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsEditOpen(true)}
								className="gap-1.5 text-indigo-400 hover:bg-indigo-950/20"
							>
								<Edit className="h-4 w-4" />
								Editar Ficha
							</Button>
						</Can>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
					<div className="md:col-span-2 rounded-xl bg-slate-950/40 p-4 border border-slate-800/80 space-y-2">
						<span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
							Descripción Operativa
						</span>
						<p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
							{sistema.descripcion}
						</p>
						{sistema.observacion && (
							<div className="pt-2 border-t border-slate-800/60 mt-2">
								<span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
									Observaciones Técnicas:
								</span>
								<p className="text-xs text-slate-400">{sistema.observacion}</p>
							</div>
						)}
					</div>

					<div className="rounded-xl bg-slate-950/40 p-4 border border-slate-800/80 space-y-3 text-xs">
						<div className="flex items-center gap-2 text-slate-300">
							<Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
							<div>
								<span className="text-[10px] text-slate-500 block uppercase">
									Área Dueña
								</span>
								<span className="font-semibold text-slate-200">
									{sistema.areaNombre}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2 text-slate-300">
							<Monitor className="h-4 w-4 text-indigo-400 shrink-0" />
							<div>
								<span className="text-[10px] text-slate-500 block uppercase">
									Clave Única
								</span>
								<span className="font-mono text-slate-200">
									{sistema.clave}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Pestañas de Navegación del Sistema */}
			<div className="space-y-4">
				<div className="flex border-b border-slate-800">
					<button
						type="button"
						onClick={() => setActiveTab("responsables")}
						className={`pb-3 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 ${
							activeTab === "responsables"
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-slate-400 hover:text-slate-200"
						}`}
					>
						<ShieldCheck className="h-4 w-4" />
						Responsables (
						{sistema.responsables?.filter((r) => !r.fin).length || 0})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("desarrolladores")}
						className={`pb-3 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 ${
							activeTab === "desarrolladores"
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-slate-400 hover:text-slate-200"
						}`}
					>
						<Code2 className="h-4 w-4" />
						Equipo de Desarrollo (
						{sistema.desarrolladores?.filter((d) => !d.fin).length || 0})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("tickets")}
						className={`pb-3 px-4 text-xs font-semibold transition-colors border-b-2 flex items-center gap-2 ${
							activeTab === "tickets"
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-slate-400 hover:text-slate-200"
						}`}
					>
						<TicketIcon className="h-4 w-4" />
						Tickets Vinculados
					</button>
				</div>

				{activeTab === "responsables" && (
					<SistemaResponsablesTab
						sistemaId={sistema.id}
						responsables={sistema.responsables}
					/>
				)}

				{activeTab === "desarrolladores" && (
					<SistemaDesarrolladoresTab
						sistemaId={sistema.id}
						desarrolladores={sistema.desarrolladores}
					/>
				)}

				{activeTab === "tickets" && (
					<SistemaTicketsTab sistemaId={sistema.id} />
				)}
			</div>

			{/* Modal de Edición */}
			<EditSistemaModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				sistema={sistema}
			/>
		</div>
	);
}
