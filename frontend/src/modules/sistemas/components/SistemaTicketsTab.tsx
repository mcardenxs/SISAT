import { useTicketsQuery } from "@/modules/tickets/hooks/useTicketsQuery";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/core/components/ui/Badge";
import {
	getFaseVariant,
	formatTimeAgo,
} from "@/modules/tickets/components/TicketTableView";
import {
	Ticket as TicketIcon,
	CheckCircle2,
	AlertCircle,
	Clock,
	ExternalLink,
} from "lucide-react";

interface SistemaTicketsTabProps {
	sistemaId: number;
}

export function SistemaTicketsTab({ sistemaId }: SistemaTicketsTabProps) {
	const { data: tickets = [], isLoading } = useTicketsQuery({ sistemaId });

	const total = tickets.length;
	const resueltos = tickets.filter(
		(t) =>
			t.faseCodigo === "RESUELTO_POR_DESARROLLO" ||
			t.faseCodigo === "CERRADO_POR_RESPONSABLE",
	).length;
	const activos = tickets.filter(
		(t) =>
			!["CERRADO_POR_RESPONSABLE", "CANCELADO"].includes(t.faseCodigo || ""),
	).length;
	const tasaResolucion = total > 0 ? Math.round((resueltos / total) * 100) : 0;

	if (isLoading) {
		return (
			<div className="p-12 text-center text-slate-400">
				Cargando tickets asociados a este sistema...
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Métricas de Resolución del Sistema */}
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
					<div className="flex items-center justify-between pb-1">
						<span className="text-xs text-slate-400 font-medium">
							Total de Tickets
						</span>
						<TicketIcon className="h-4 w-4 text-indigo-400" />
					</div>
					<div className="text-2xl font-bold text-white">{total}</div>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
					<div className="flex items-center justify-between pb-1">
						<span className="text-xs text-slate-400 font-medium">
							En Atención Activa
						</span>
						<AlertCircle className="h-4 w-4 text-amber-400" />
					</div>
					<div className="text-2xl font-bold text-amber-400">{activos}</div>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
					<div className="flex items-center justify-between pb-1">
						<span className="text-xs text-slate-400 font-medium">
							Solventados
						</span>
						<CheckCircle2 className="h-4 w-4 text-emerald-400" />
					</div>
					<div className="text-2xl font-bold text-emerald-400">{resueltos}</div>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
					<div className="flex items-center justify-between pb-1">
						<span className="text-xs text-slate-400 font-medium">
							Tasa de Resolución
						</span>
						<Clock className="h-4 w-4 text-cyan-400" />
					</div>
					<div className="text-2xl font-bold text-cyan-400">
						{tasaResolucion}%
					</div>
				</div>
			</div>

			{/* Listado de Tickets */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
				<h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
					Historial de Incidencias y Requerimientos ({total})
				</h4>

				{total === 0 ? (
					<p className="text-xs text-slate-500 italic">
						No se han generado tickets de soporte para este sistema.
					</p>
				) : (
					<div className="divide-y divide-slate-800/80">
						{tickets.map((t) => (
							<div
								key={t.id}
								className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
							>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-mono text-xs font-semibold text-indigo-400">
											{t.folio}
										</span>
										<Badge variant={getFaseVariant(t.faseCodigo)}>
											{t.faseNombre || t.faseCodigo}
										</Badge>
										<span className="text-slate-500 text-[11px] flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{formatTimeAgo(t.registro)}
										</span>
									</div>
									<p className="font-medium text-slate-200">{t.titulo}</p>
									<span className="text-slate-400 text-[11px]">
										Solicitado por: {t.usuarioNombre || "Usuario institucional"}
									</span>
								</div>

								<Link
									to="/tickets/$ticketId"
									params={{ ticketId: String(t.id) }}
									className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 shrink-0"
								>
									Ver ticket
									<ExternalLink className="h-3.5 w-3.5" />
								</Link>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
