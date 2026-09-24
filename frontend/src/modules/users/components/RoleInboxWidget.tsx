import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/core/auth/store";
import { useTicketsQuery } from "@/modules/tickets/hooks/useTicketsQuery";
import { useActasQuery } from "@/modules/actas/hooks/useActasQuery";
import { Badge } from "@/core/components/ui/Badge";
import {
	Code2,
	UserCheck,
	FileText,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import {
	getFaseVariant,
	formatTimeAgo,
} from "@/modules/tickets/components/TicketTableView";

export function RoleInboxWidget() {
	const user = useAuthStore((state) => state.user);

	const { data: tickets = [] } = useTicketsQuery();
	const { data: actas = [] } = useActasQuery();

	const isDev = user?.role === "DESARROLLADOR";
	const isResp = user?.role === "RESPONSABLE_DE_SISTEMA";
	const isJefe = user?.role === "JEFE_DE_AREA";
	const isAdmin = user?.role === "ADMINISTRADOR" || user?.role === "ADMIN";

	// 1. Desarrollador: atenciones activas
	const devActiveTickets = tickets.filter((t) => {
		const isAssigned = t.asignaciones?.some(
			(a) => !a.fin && a.usuarioId === user?.id,
		);
		const isInProcess = ["ASIGNADO", "EN_PROCESO"].includes(t.faseCodigo || "");
		return (isAssigned || isDev) && isInProcess;
	});

	// 2. Responsable: pendientes de asignar y soluciones por validar
	const unassignedTickets = tickets.filter(
		(t) => t.faseCodigo === "REGISTRADO",
	);
	const pendingValidationTickets = tickets.filter(
		(t) => t.faseCodigo === "RESUELTO_POR_DESARROLLO",
	);

	// 3. Jefe de Área: actas listas para firma
	const actasPendingFirma = actas.filter(
		(a) => a.situacionCodigo === "GENERADA" || a.situacionCodigo === "EN_FIRMA",
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-base font-bold text-white flex items-center gap-2">
					<UserCheck className="h-5 w-5 text-indigo-400" />
					Bandeja de Entrada Operativa &bull; {user?.role}
				</h2>
				<span className="text-xs text-slate-400">
					Tareas y flujos priorizados para tu perfil
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{/* Widget Desarrollador */}
				{(isDev || isAdmin) && (
					<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
						<div className="flex items-center justify-between pb-2 border-b border-slate-800">
							<div className="flex items-center gap-2">
								<Code2 className="h-4 w-4 text-emerald-400" />
								<h3 className="text-xs font-semibold text-slate-200">
									Mis Atenciones Activas
								</h3>
							</div>
							<Badge variant="success">{devActiveTickets.length}</Badge>
						</div>

						{devActiveTickets.length === 0 ? (
							<p className="text-xs text-slate-500 italic py-4 text-center">
								No tienes atenciones técnicas activas asignadas.
							</p>
						) : (
							<div className="space-y-2">
								{devActiveTickets.slice(0, 3).map((t) => (
									<Link
										key={t.id}
										to="/tickets/$ticketId"
										params={{ ticketId: String(t.id) }}
										className="block p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800/80 transition-colors"
									>
										<div className="flex items-center justify-between text-xs">
											<span className="font-mono text-indigo-400 font-semibold">
												{t.folio}
											</span>
											<span className="text-[10px] text-slate-500 flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{formatTimeAgo(t.registro)}
											</span>
										</div>
										<p className="text-xs font-medium text-slate-200 truncate mt-1">
											{t.titulo}
										</p>
										<span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
											Registrar tiempo / solución &rarr;
										</span>
									</Link>
								))}
							</div>
						)}
					</div>
				)}

				{/* Widget Responsable: Tickets por Asignar */}
				{(isResp || isAdmin) && (
					<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
						<div className="flex items-center justify-between pb-2 border-b border-slate-800">
							<div className="flex items-center gap-2">
								<AlertCircle className="h-4 w-4 text-amber-400" />
								<h3 className="text-xs font-semibold text-slate-200">
									Pendientes de Asignar Técnico
								</h3>
							</div>
							<Badge variant="warning">{unassignedTickets.length}</Badge>
						</div>

						{unassignedTickets.length === 0 ? (
							<p className="text-xs text-slate-500 italic py-4 text-center">
								Todos los tickets registrados cuentan con técnico.
							</p>
						) : (
							<div className="space-y-2">
								{unassignedTickets.slice(0, 3).map((t) => (
									<Link
										key={t.id}
										to="/tickets/$ticketId"
										params={{ ticketId: String(t.id) }}
										className="block p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800/80 transition-colors"
									>
										<div className="flex items-center justify-between text-xs">
											<span className="font-mono text-amber-400 font-semibold">
												{t.folio}
											</span>
											<Badge variant="default" className="text-[10px]">
												{t.sistemaNombre}
											</Badge>
										</div>
										<p className="text-xs font-medium text-slate-200 truncate mt-1">
											{t.titulo}
										</p>
									</Link>
								))}
							</div>
						)}
					</div>
				)}

				{/* Widget Responsable: Soluciones por Validar */}
				{(isResp || isAdmin) && (
					<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
						<div className="flex items-center justify-between pb-2 border-b border-slate-800">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-cyan-400" />
								<h3 className="text-xs font-semibold text-slate-200">
									Soluciones por Validar
								</h3>
							</div>
							<Badge variant="info">{pendingValidationTickets.length}</Badge>
						</div>

						{pendingValidationTickets.length === 0 ? (
							<p className="text-xs text-slate-500 italic py-4 text-center">
								No hay soluciones pendientes de evaluación y cierre.
							</p>
						) : (
							<div className="space-y-2">
								{pendingValidationTickets.slice(0, 3).map((t) => (
									<Link
										key={t.id}
										to="/tickets/$ticketId"
										params={{ ticketId: String(t.id) }}
										className="block p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800/80 transition-colors"
									>
										<div className="flex items-center justify-between text-xs">
											<span className="font-mono text-cyan-400 font-semibold">
												{t.folio}
											</span>
											<span className="text-[10px] text-slate-400">
												{t.sistemaNombre}
											</span>
										</div>
										<p className="text-xs font-medium text-slate-200 truncate mt-1">
											{t.titulo}
										</p>
										<span className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
											Evaluar y cerrar ticket &rarr;
										</span>
									</Link>
								))}
							</div>
						)}
					</div>
				)}

				{/* Widget Jefe de Área: Actas Pendientes de Firma */}
				{(isJefe || isAdmin) && (
					<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
						<div className="flex items-center justify-between pb-2 border-b border-slate-800">
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4 text-indigo-400" />
								<h3 className="text-xs font-semibold text-slate-200">
									Actas Listas para Firma
								</h3>
							</div>
							<Badge variant="purple">{actasPendingFirma.length}</Badge>
						</div>

						{actasPendingFirma.length === 0 ? (
							<p className="text-xs text-slate-500 italic py-4 text-center">
								No hay actas semanales pendientes de tu firma.
							</p>
						) : (
							<div className="space-y-2">
								{actasPendingFirma.slice(0, 3).map((a) => (
									<Link
										key={a.id}
										to="/actas/$actaId"
										params={{ actaId: String(a.id) }}
										className="block p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800/80 transition-colors"
									>
										<div className="flex items-center justify-between text-xs">
											<span className="font-mono text-indigo-400 font-semibold">
												{a.folio}
											</span>
											<Badge variant={getFaseVariant(a.situacionCodigo)}>
												{a.situacionNombre || a.situacionCodigo}
											</Badge>
										</div>
										<p className="text-xs font-medium text-slate-200 truncate mt-1">
											{a.sistemaNombre} ({a.areaNombre})
										</p>
										<span className="text-[10px] text-slate-400 mt-0.5 block">
											Periodo: {a.inicio} al {a.fin}
										</span>
									</Link>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
