import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTicketDetailQuery } from "../hooks/useTicketsQuery";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import {
	ArrowLeft,
	Server,
	Building2,
	User,
	Play,
	Clock,
	Paperclip,
	CheckCircle2,
	Award,
	RotateCcw,
	UserPlus,
	Pause,
	AlertOctagon,
} from "lucide-react";
import { TicketStepper } from "../components/TicketStepper";
import { TicketAtencionTab } from "../components/TicketAtencionTab";
import { TicketCiclosTab } from "../components/TicketCiclosTab";
import { TicketTimeline } from "../components/TicketTimeline";
import { AssignTicketModal } from "../components/AssignTicketModal";
import { IntervencionFormModal } from "../components/IntervencionFormModal";
import { UploadEvidenciaModal } from "../components/UploadEvidenciaModal";
import { TerminarAtencionModal } from "../components/TerminarAtencionModal";
import { EvaluacionAtencionModal } from "../components/EvaluacionAtencionModal";
import { CierreTicketModal } from "../components/CierreTicketModal";
import { ReabrirTicketModal } from "../components/ReabrirTicketModal";
import { getFaseVariant } from "../components/TicketTableView";

interface TicketDetailPageProps {
	ticketId: number;
}

export function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
	const { data: ticket, isLoading, error } = useTicketDetailQuery(ticketId);
	const {
		startAtencionMutation,
		pauseTicketMutation,
		resumeTicketMutation,
		cancelTicketMutation,
	} = useTicketMutations(ticketId);

	// Tabs
	const [activeTab, setActiveTab] = useState<
		"atencion" | "ciclos" | "trazabilidad"
	>("atencion");

	// Modales
	const [isAssignOpen, setIsAssignOpen] = useState(false);
	const [isIntervencionOpen, setIsIntervencionOpen] = useState(false);
	const [isEvidenciaOpen, setIsEvidenciaOpen] = useState(false);
	const [isTerminarOpen, setIsTerminarOpen] = useState(false);
	const [isEvaluacionOpen, setIsEvaluacionOpen] = useState(false);
	const [isCierreOpen, setIsCierreOpen] = useState(false);
	const [isReabrirOpen, setIsReabrirOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="p-16 text-center text-slate-400">
				Cargando detalle operativo del ticket #{ticketId}...
			</div>
		);
	}

	if (error || !ticket) {
		return (
			<div className="p-8 text-center bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-400">
				<p className="font-semibold">Ticket no encontrado o error al cargar.</p>
				<Link
					to="/tickets"
					className="text-xs text-indigo-400 underline mt-2 inline-block"
				>
					Regresar al listado de tickets
				</Link>
			</div>
		);
	}

	// Ciclo de atención actual (último iniciado)
	const currentAtencion =
		ticket.atenciones && ticket.atenciones.length > 0
			? ticket.atenciones[ticket.atenciones.length - 1]
			: null;

	const activeAsignacion = ticket.asignaciones?.find((a) => !a.fin);

	const isPaused = ticket.faseCodigo === "EN_ESPERA_DE_INFORMACION";
	const isClosed = ticket.faseCodigo === "CERRADO_POR_RESPONSABLE";
	const isResolved = ticket.faseCodigo === "RESUELTO_POR_DESARROLLO";
	const isCancelled = ticket.faseCodigo === "CANCELADO";

	return (
		<div className="space-y-6">
			{/* Barra superior de navegación */}
			<div className="flex items-center justify-between">
				<Link
					to="/tickets"
					className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Volver a Tickets
				</Link>
				<span className="text-xs text-slate-500">
					Registro: {new Date(ticket.registro).toLocaleString()}
				</span>
			</div>

			{/* Encabezado Principal */}
			<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="space-y-1">
						<div className="flex flex-wrap items-center gap-2.5">
							<span className="font-mono text-sm font-bold text-indigo-400 bg-indigo-950/40 px-2.5 py-0.5 rounded border border-indigo-500/20">
								{ticket.folio}
							</span>
							<Badge variant={getFaseVariant(ticket.faseCodigo)}>
								{ticket.faseNombre || ticket.faseCodigo}
							</Badge>
							<Badge variant="purple">
								Prioridad: {ticket.prioridadNombre || "Normal"}
							</Badge>
							<Badge variant="info">
								Solicitud: {ticket.solicitudNombre || "Incidencia"}
							</Badge>
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white pt-1">
							{ticket.titulo}
						</h1>
					</div>

					{/* Ficha rápida de Metadatos */}
					<div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
						<div className="flex items-center gap-1.5">
							<Server className="h-4 w-4 text-indigo-400" />
							<div>
								<span className="text-[10px] text-slate-500 block uppercase">
									Sistema
								</span>
								<span className="font-medium text-slate-200">
									{ticket.sistemaNombre}
								</span>
							</div>
						</div>
						<div className="h-6 w-px bg-slate-800" />
						<div className="flex items-center gap-1.5">
							<Building2 className="h-4 w-4 text-emerald-400" />
							<div>
								<span className="text-[10px] text-slate-500 block uppercase">
									Área
								</span>
								<span className="font-medium text-slate-200">
									{ticket.areaNombre}
								</span>
							</div>
						</div>
						<div className="h-6 w-px bg-slate-800" />
						<div className="flex items-center gap-1.5">
							<User className="h-4 w-4 text-amber-400" />
							<div>
								<span className="text-[10px] text-slate-500 block uppercase">
									Solicitante
								</span>
								<span className="font-medium text-slate-200">
									{ticket.usuarioNombre}
								</span>
							</div>
						</div>
					</div>
				</div>

				<p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 p-3.5 rounded-xl border border-slate-800/80">
					{ticket.descripcion}
				</p>
			</div>

			{/* Stepper de Progreso Operativo */}
			<TicketStepper faseCodigo={ticket.faseCodigo} />

			{/* Bloque de Acciones según Rol / Estado */}
			<div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
				{/* 1. Asignar / Reasignar (Responsable / Admin) */}
				<Can resource="asignaciones" action="create">
					{!isClosed && !isCancelled && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsAssignOpen(true)}
							className="gap-1.5"
						>
							<UserPlus className="h-4 w-4" />
							{activeAsignacion
								? "Reasignar Desarrollador"
								: "Asignar Desarrollador"}
						</Button>
					)}
				</Can>

				{/* 2. Iniciar Atención (Desarrollador asignado en fase ASIGNADO) */}
				<Can resource="atencion" action="create">
					{(ticket.faseCodigo === "ASIGNADO" ||
						(!currentAtencion && !isClosed && !isCancelled)) && (
						<Button
							size="sm"
							onClick={() => startAtencionMutation.mutate({ id: ticket.id })}
							disabled={startAtencionMutation.isPending}
							className="gap-1.5 bg-indigo-600 hover:bg-indigo-500"
						>
							<Play className="h-4 w-4" />
							Iniciar Atención
						</Button>
					)}
				</Can>

				{/* 3. Registrar Intervención */}
				<Can resource="intervenciones" action="create">
					{currentAtencion && !isClosed && !isCancelled && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsIntervencionOpen(true)}
							className="gap-1.5"
						>
							<Clock className="h-4 w-4" />
							Registrar Intervención
						</Button>
					)}
				</Can>

				{/* 4. Adjuntar Evidencia */}
				<Can resource="evidencias" action="create">
					{!isClosed && !isCancelled && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsEvidenciaOpen(true)}
							className="gap-1.5"
						>
							<Paperclip className="h-4 w-4" />
							Adjuntar Evidencia
						</Button>
					)}
				</Can>

				{/* 5. Terminar Atención */}
				<Can resource="resolucion" action="create">
					{currentAtencion && !isResolved && !isClosed && !isCancelled && (
						<Button
							size="sm"
							onClick={() => setIsTerminarOpen(true)}
							className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
						>
							<CheckCircle2 className="h-4 w-4" />
							Terminar Atención
						</Button>
					)}
				</Can>

				{/* 6. Evaluar y Cerrar (Responsable / Admin cuando está resuelto) */}
				<Can resource="evaluacion" action="create">
					{isResolved && currentAtencion && !currentAtencion.evaluacion && (
						<Button
							size="sm"
							onClick={() => setIsEvaluacionOpen(true)}
							className="gap-1.5 bg-amber-600 hover:bg-amber-500 text-white"
						>
							<Award className="h-4 w-4" />
							Evaluar Atención
						</Button>
					)}
				</Can>

				<Can resource="cierre" action="create">
					{isResolved && currentAtencion && (
						<Button
							size="sm"
							onClick={() => setIsCierreOpen(true)}
							className="gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white"
						>
							<CheckCircle2 className="h-4 w-4" />
							Cerrar Formalmente
						</Button>
					)}
				</Can>

				{/* 7. Reabrir Ticket */}
				<Can resource="reapertura" action="create">
					{(isClosed || isResolved) && currentAtencion && (
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsReabrirOpen(true)}
							className="gap-1.5 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
						>
							<RotateCcw className="h-4 w-4" />
							Reabrir Ticket
						</Button>
					)}
				</Can>

				{/* Pausar / Reanudar */}
				{!isClosed && !isCancelled && (
					<>
						{isPaused ? (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => resumeTicketMutation.mutate(ticket.id)}
								disabled={resumeTicketMutation.isPending}
								className="gap-1 text-emerald-400"
							>
								<Play className="h-3.5 w-3.5" />
								Reanudar Ticket
							</Button>
						) : (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									const motivo = prompt("Motivo de espera de información:");
									if (motivo)
										pauseTicketMutation.mutate({ id: ticket.id, motivo });
								}}
								className="gap-1 text-slate-400 hover:text-amber-400"
							>
								<Pause className="h-3.5 w-3.5" />
								Pausar
							</Button>
						)}

						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								const motivo = prompt("Motivo de cancelación del ticket:");
								if (motivo)
									cancelTicketMutation.mutate({ id: ticket.id, motivo });
							}}
							className="gap-1 text-slate-400 hover:text-rose-400"
						>
							<AlertOctagon className="h-3.5 w-3.5" />
							Cancelar
						</Button>
					</>
				)}
			</div>

			{/* Pestañas de Detalle */}
			<div className="space-y-4">
				<div className="flex border-b border-slate-800">
					<button
						type="button"
						onClick={() => setActiveTab("atencion")}
						className={`pb-3 px-4 text-xs font-semibold transition-colors border-b-2 ${
							activeTab === "atencion"
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-slate-400 hover:text-slate-200"
						}`}
					>
						Ciclo de Atención Actual
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("ciclos")}
						className={`pb-3 px-4 text-xs font-semibold transition-colors border-b-2 ${
							activeTab === "ciclos"
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-slate-400 hover:text-slate-200"
						}`}
					>
						Historial de Ciclos ({ticket.atenciones?.length || 0})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("trazabilidad")}
						className={`pb-3 px-4 text-xs font-semibold transition-colors border-b-2 ${
							activeTab === "trazabilidad"
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-slate-400 hover:text-slate-200"
						}`}
					>
						Trazabilidad y Asignaciones
					</button>
				</div>

				{activeTab === "atencion" && (
					<TicketAtencionTab
						atencion={currentAtencion}
						ticketEvidencias={ticket.evidencias}
					/>
				)}

				{activeTab === "ciclos" && (
					<TicketCiclosTab
						atenciones={ticket.atenciones}
						currentCiclo={currentAtencion?.ciclo}
					/>
				)}

				{activeTab === "trazabilidad" && (
					<TicketTimeline
						transiciones={ticket.transiciones}
						asignaciones={ticket.asignaciones}
						movimientos={ticket.movimientos}
					/>
				)}
			</div>

			{/* Modales Interactivos del Ciclo */}
			<AssignTicketModal
				isOpen={isAssignOpen}
				onClose={() => setIsAssignOpen(false)}
				ticketId={ticket.id}
				currentAsignacion={activeAsignacion}
			/>

			{currentAtencion && (
				<>
					<IntervencionFormModal
						isOpen={isIntervencionOpen}
						onClose={() => setIsIntervencionOpen(false)}
						ticketId={ticket.id}
						atencionId={currentAtencion.id}
					/>
					<TerminarAtencionModal
						isOpen={isTerminarOpen}
						onClose={() => setIsTerminarOpen(false)}
						ticketId={ticket.id}
						atencionId={currentAtencion.id}
					/>
					<EvaluacionAtencionModal
						isOpen={isEvaluacionOpen}
						onClose={() => setIsEvaluacionOpen(false)}
						ticketId={ticket.id}
						atencionId={currentAtencion.id}
					/>
					<CierreTicketModal
						isOpen={isCierreOpen}
						onClose={() => setIsCierreOpen(false)}
						ticketId={ticket.id}
						atencionId={currentAtencion.id}
					/>
					<ReabrirTicketModal
						isOpen={isReabrirOpen}
						onClose={() => setIsReabrirOpen(false)}
						ticketId={ticket.id}
						atencionOrigenId={currentAtencion.id}
					/>
				</>
			)}

			<UploadEvidenciaModal
				isOpen={isEvidenciaOpen}
				onClose={() => setIsEvidenciaOpen(false)}
				ticketId={ticket.id}
				atencionId={currentAtencion?.id}
			/>
		</div>
	);
}
