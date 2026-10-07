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
import { StatCard } from "@/core/components/ui/StatCard";
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
			? "info"
			: user?.role === "RESPONSABLE_DE_SISTEMA" || user?.role === "MOD"
				? "warning"
				: user?.role === "DESARROLLADOR"
					? "success"
					: "neutral";

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
		<div className="space-y-6">
			{/* Banner de Bienvenida y Accesos Rápidos */}
			<div className="rounded-surface border border-subtle bg-surface p-6 shadow-surface space-y-4">
				<div className="max-w-3xl space-y-2">
					<div className="inline-flex items-center gap-2">
						<Badge variant={roleVariant} className="px-2.5 py-0.5 text-xs">
							Rol: {user?.role}
						</Badge>
						<Badge variant="success" className="px-2.5 py-0.5 text-xs">
							SISAT Operativo
						</Badge>
					</div>

					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
						Panel Operativo &bull; {user?.name}
					</h1>

					<p className="text-sm text-foreground-muted leading-relaxed">
						Sistema Institucional de Soporte y Atención Técnica. Supervisión en
						tiempo real de atenciones, ciclos de desarrollo, actas semanales y
						trazabilidad.
					</p>

					{/* Accesos Rápidos */}
					<div className="flex flex-wrap items-center gap-2.5 pt-2">
						<Can resource="tickets" action="create">
							<Button
								size="sm"
								onClick={() => setIsCreateTicketOpen(true)}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Registrar Ticket
							</Button>
						</Can>

						<Can resource="actas" action="create">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setIsCreateActaOpen(true)}
								className="gap-2"
							>
								<FileText className="h-4 w-4" />
								Emitir Acta Semanal
							</Button>
						</Can>

						<Link to="/tickets">
							<Button variant="ghost" size="sm" className="gap-2">
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

			{/* Resumen Cuantitativo Vivo con StatCards */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-base font-semibold text-foreground flex items-center gap-2">
						<Activity className="h-4 w-4 text-primary" />
						Resumen Cuantitativo en Vivo
					</h2>
					<span className="text-xs text-foreground-subtle">
						Actualización reactiva
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						label="Sin Asignar"
						value={isLoading ? "..." : ticketsSinAsignar}
						description="Tickets registrados esperando asignación técnica"
						icon={<Ticket className="h-4 w-4" />}
					/>
					<StatCard
						label="En Atención Activa"
						value={isLoading ? "..." : ticketsEnAtencion}
						description="Ciclos de diagnóstico e intervención en curso"
						icon={<Clock className="h-4 w-4" />}
					/>
					<StatCard
						label="Soluciones por Validar"
						value={isLoading ? "..." : ticketsResueltosPendientes}
						description="Resueltos por desarrollo, en espera de evaluación"
						icon={<CheckCircle2 className="h-4 w-4" />}
					/>
					<StatCard
						label="Actas Pendientes Firma"
						value={isLoading ? "..." : actasPendientes}
						description="Documentos semanales listos para recolección de firmas"
						icon={<FileText className="h-4 w-4" />}
					/>
				</div>
			</div>

			{/* Totales Generales Institucionales */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="rounded-surface border border-subtle bg-surface p-4 shadow-surface flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-control bg-primary-light text-primary">
							<Users className="h-5 w-5" />
						</div>
						<div>
							<span className="text-xs text-foreground-muted font-medium">
								Usuarios Activos
							</span>
							<p className="text-xl font-semibold text-foreground">
								{isLoading
									? "..."
									: (stats?.totalesGenerales.usuariosActivos ?? 0)}
							</p>
						</div>
					</div>
					<Can resource="users" action="read">
						<Link
							to="/users"
							className="text-xs text-primary hover:text-primary-hover font-medium"
						>
							Ver todos &rarr;
						</Link>
					</Can>
				</div>

				<div className="rounded-surface border border-subtle bg-surface p-4 shadow-surface flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-control bg-primary-light text-primary">
							<Monitor className="h-5 w-5" />
						</div>
						<div>
							<span className="text-xs text-foreground-muted font-medium">
								Sistemas en Operación
							</span>
							<p className="text-xl font-semibold text-foreground">
								{isLoading
									? "..."
									: (stats?.totalesGenerales.sistemasActivos ?? 0)}
							</p>
						</div>
					</div>
					<Can resource="sistemas" action="read">
						<Link
							to="/sistemas"
							className="text-xs text-primary hover:text-primary-hover font-medium"
						>
							Ver catálogo &rarr;
						</Link>
					</Can>
				</div>

				<div className="rounded-surface border border-subtle bg-surface p-4 shadow-surface flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-control bg-primary-light text-primary">
							<Building2 className="h-5 w-5" />
						</div>
						<div>
							<span className="text-xs text-foreground-muted font-medium">
								Áreas Organizacionales
							</span>
							<p className="text-xl font-semibold text-foreground">
								{isLoading
									? "..."
									: (stats?.totalesGenerales.areasActivas ?? 0)}
							</p>
						</div>
					</div>
					<Can resource="areas" action="read">
						<Link
							to="/areas"
							className="text-xs text-primary hover:text-primary-hover font-medium"
						>
							Ver áreas &rarr;
						</Link>
					</Can>
				</div>
			</div>

			{/* Bandeja de Entrada Personalizada por Rol */}
			<RoleInboxWidget />

			{/* Distribuciones del Negocio: Fase, Prioridad */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Distribución por Fase */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Layers className="h-4 w-4 text-primary" />
							<CardTitle>Distribución de Tickets por Fase Operativa</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{stats?.ticketsPorFase.map((f) => (
							<div key={f.faseId} className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className="text-foreground font-medium">
										{f.faseNombre}
									</span>
									<span className="font-mono text-foreground-muted">
										{f.total} ticket(s)
									</span>
								</div>
								<div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
									<div
										className="h-full bg-primary rounded-full transition-all duration-300"
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
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Activity className="h-4 w-4 text-primary" />
							<CardTitle>Distribución por Nivel de Prioridad</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-3">
						{stats?.ticketsPorPrioridad.map((p) => {
							const colorClass =
								p.prioridadCodigo === "CRITICA" || p.prioridadCodigo === "ALTA"
									? "bg-danger"
									: p.prioridadCodigo === "MEDIA"
										? "bg-warning"
										: "bg-success";

							return (
								<div key={p.prioridadId} className="space-y-1">
									<div className="flex items-center justify-between text-xs">
										<span className="text-foreground font-medium">
											{p.prioridadNombre}
										</span>
										<span className="font-mono text-foreground-muted">
											{p.total} ticket(s)
										</span>
									</div>
									<div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
										<div
											className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
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
