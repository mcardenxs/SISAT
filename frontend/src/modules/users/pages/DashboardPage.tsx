import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/core/auth/store";
import { useDashboardQuery } from "../hooks/useDashboardQuery";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/core/components/ui/Card";
import { Can } from "@/core/permissions/Can";
import {
	Ticket,
	Clock,
	CheckCircle2,
	FileText,
	Monitor,
	Users,
	Building2,
	Plus,
	ArrowRight,
	Layers,
	Activity,
} from "lucide-react";
import { CreateTicketModal } from "@/modules/tickets/components/CreateTicketModal";
import { CreateActaModal } from "@/modules/actas/components/CreateActaModal";
import { RoleInboxWidget } from "../components/RoleInboxWidget";

export function DashboardPage() {
	const user = useAuthStore((state) => state.user);
	const { data: stats, isLoading } = useDashboardQuery();

	const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
	const [isCreateActaOpen, setIsCreateActaOpen] = useState(false);

	const roleVariant =
		user?.role === "ADMINISTRADOR" || user?.role === "ADMIN"
			? "purple"
			: user?.role === "RESPONSABLE_DE_SISTEMA" || user?.role === "MOD"
				? "warning"
				: user?.role === "DESARROLLADOR"
					? "info"
					: "default";

	// Métricas cuantitativas
	const ticketsSinAsignar =
		stats?.ticketsPorFase.find((f) => f.faseCodigo === "REGISTRADO")?.total ??
		0;
	const ticketsEnAtencion = stats?.resumenTickets.activos ?? 0;
	const ticketsResueltosPendientes =
		stats?.ticketsPorFase.find(
			(f) => f.faseCodigo === "RESUELTO_POR_DESARROLLO",
		)?.total ?? 0;
	const actasPendientes = stats?.resumenActas.generadas ?? 0;

	return (
		<div className="space-y-8">
			{/* Banner de Bienvenida y Accesos Rápidos */}
			<div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
				<div className="relative z-10 max-w-3xl space-y-3">
					<div className="inline-flex items-center gap-2">
						<Badge variant={roleVariant} className="px-3 py-1 text-xs">
							Rol: {user?.role}
						</Badge>
						<Badge variant="success" className="px-3 py-1 text-xs">
							SISAT Operativo
						</Badge>
					</div>

					<h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
						Panel Operativo &bull; {user?.name}
					</h1>

					<p className="text-sm sm:text-base text-slate-300 leading-relaxed">
						Sistema Institucional de Soporte y Atención Técnica. Supervisión en
						tiempo real de atenciones, ciclos de desarrollo, actas semanales y
						trazabilidad.
					</p>

					{/* Accesos Rápidos requeridos */}
					<div className="flex flex-wrap items-center gap-3 pt-3">
						<Can resource="tickets" action="create">
							<Button
								size="md"
								onClick={() => setIsCreateTicketOpen(true)}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Registrar Ticket de Incidencia
							</Button>
						</Can>

						<Can resource="actas" action="create">
							<Button
								variant="outline"
								size="md"
								onClick={() => setIsCreateActaOpen(true)}
								className="gap-2 text-white border-slate-700 hover:bg-slate-800"
							>
								<FileText className="h-4 w-4 text-indigo-400" />
								Emitir Acta Semanal
							</Button>
						</Can>

						<Link to="/tickets">
							<Button
								variant="ghost"
								size="md"
								className="gap-2 text-slate-300"
							>
								Explorar Tickets
								<ArrowRight className="h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Modales Rápidos */}
			<CreateTicketModal
				isOpen={isCreateTicketOpen}
				onClose={() => setIsCreateTicketOpen(false)}
			/>
			<CreateActaModal
				isOpen={isCreateActaOpen}
				onClose={() => setIsCreateActaOpen(false)}
			/>

			{/* Resumen Cuantitativo Vivo */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-bold text-white flex items-center gap-2">
						<Activity className="h-4 w-4 text-indigo-400" />
						Resumen Cuantitativo en Vivo
					</h2>
					<span className="text-xs text-slate-500">
						Actualización reactiva con TanStack Query
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{/* 1. Registrados sin asignar */}
					<Card className="border-slate-800 bg-slate-900/60">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Sin Asignar
							</CardTitle>
							<div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
								<Ticket className="h-4 w-4" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-extrabold text-amber-400">
								{isLoading ? "..." : ticketsSinAsignar}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Tickets registrados esperando asignación técnica
							</p>
						</CardContent>
					</Card>

					{/* 2. En atención activa */}
					<Card className="border-slate-800 bg-slate-900/60">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								En Atención Activa
							</CardTitle>
							<div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
								<Clock className="h-4 w-4" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-extrabold text-indigo-400">
								{isLoading ? "..." : ticketsEnAtencion}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Ciclos de diagnóstico e intervención en curso
							</p>
						</CardContent>
					</Card>

					{/* 3. Soluciones pendientes de validar */}
					<Card className="border-slate-800 bg-slate-900/60">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Soluciones por Validar
							</CardTitle>
							<div className="p-2 rounded-lg bg-cyan-600/10 text-cyan-400">
								<CheckCircle2 className="h-4 w-4" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-extrabold text-cyan-400">
								{isLoading ? "..." : ticketsResueltosPendientes}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Resueltos por desarrollo, en espera de evaluación
							</p>
						</CardContent>
					</Card>

					{/* 4. Actas pendientes de firma */}
					<Card className="border-slate-800 bg-slate-900/60">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Actas Pendientes Firma
							</CardTitle>
							<div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400">
								<FileText className="h-4 w-4" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-extrabold text-emerald-400">
								{isLoading ? "..." : actasPendientes}
							</div>
							<p className="text-xs text-slate-500 mt-1">
								Documentos semanales listos para recolección de firmas
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Totales Generales Institucionales */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
				<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400">
							<Users className="h-5 w-5" />
						</div>
						<div>
							<span className="text-xs text-slate-400 font-medium">
								Usuarios Activos
							</span>
							<p className="text-xl font-bold text-white">
								{isLoading
									? "..."
									: (stats?.totalesGenerales.usuariosActivos ?? 0)}
							</p>
						</div>
					</div>
					<Link
						to="/users"
						className="text-xs text-indigo-400 hover:text-indigo-300"
					>
						Ver todos &rarr;
					</Link>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400">
							<Monitor className="h-5 w-5" />
						</div>
						<div>
							<span className="text-xs text-slate-400 font-medium">
								Sistemas en Operación
							</span>
							<p className="text-xl font-bold text-white">
								{isLoading
									? "..."
									: (stats?.totalesGenerales.sistemasActivos ?? 0)}
							</p>
						</div>
					</div>
					<Link
						to="/sistemas"
						className="text-xs text-indigo-400 hover:text-indigo-300"
					>
						Ver catálogo &rarr;
					</Link>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-lg bg-emerald-600/10 text-emerald-400">
							<Building2 className="h-5 w-5" />
						</div>
						<div>
							<span className="text-xs text-slate-400 font-medium">
								Áreas Organizacionales
							</span>
							<p className="text-xl font-bold text-white">
								{isLoading
									? "..."
									: (stats?.totalesGenerales.areasActivas ?? 0)}
							</p>
						</div>
					</div>
					<Link
						to="/areas"
						className="text-xs text-indigo-400 hover:text-indigo-300"
					>
						Ver áreas &rarr;
					</Link>
				</div>
			</div>

			{/* Bandeja de Entrada Personalizada por Rol */}
			<RoleInboxWidget />

			{/* Distribuciones del Negocio: Fase, Prioridad, Sistemas */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Distribución por Fase */}
				<Card className="border-slate-800 bg-slate-900/60">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Layers className="h-5 w-5 text-indigo-400" />
							<CardTitle className="text-base">
								Distribución de Tickets por Fase Operativa
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{stats?.ticketsPorFase.map((f) => (
							<div key={f.faseId} className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className="text-slate-300 font-medium">
										{f.faseNombre}
									</span>
									<span className="font-mono text-slate-400">
										{f.total} ticket(s)
									</span>
								</div>
								<div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
									<div
										className="h-full bg-indigo-500 rounded-full transition-all duration-500"
										style={{
											width: `${
												stats.resumenTickets.total > 0
													? (f.total / stats.resumenTickets.total) * 100
													: 0
											}%`,
										}}
									/>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Distribución por Prioridad */}
				<Card className="border-slate-800 bg-slate-900/60">
					<CardHeader>
						<div className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-indigo-400" />
							<CardTitle className="text-base">
								Distribución por Nivel de Prioridad
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{stats?.ticketsPorPrioridad.map((p) => {
							const colorClass =
								p.prioridadCodigo === "CRITICA" || p.prioridadCodigo === "ALTA"
									? "bg-rose-500"
									: p.prioridadCodigo === "MEDIA"
										? "bg-amber-500"
										: "bg-emerald-500";

							return (
								<div key={p.prioridadId} className="space-y-1">
									<div className="flex items-center justify-between text-xs">
										<span className="text-slate-300 font-medium">
											{p.prioridadNombre}
										</span>
										<span className="font-mono text-slate-400">
											{p.total} ticket(s)
										</span>
									</div>
									<div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
										<div
											className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
											style={{
												width: `${
													stats.resumenTickets.total > 0
														? (p.total / stats.resumenTickets.total) * 100
														: 0
												}%`,
											}}
										/>
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
