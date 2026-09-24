import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTicketsQuery } from "../hooks/useTicketsQuery";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/core/components/ui/Card";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import { Can } from "@/core/permissions/Can";
import {
	Ticket as TicketIcon,
	Clock,
	User,
	Server,
	Plus,
	LayoutGrid,
	Table as TableIcon,
	ExternalLink,
} from "lucide-react";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { TicketFilters } from "../components/TicketFilters";
import {
	TicketTableView,
	getFaseVariant,
	formatTimeAgo,
} from "../components/TicketTableView";

export function TicketsPage() {
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	// Filtros
	const [sistemaId, setSistemaId] = useState<number | undefined>();
	const [faseId, setFaseId] = useState<number | undefined>();
	const [prioridadId, setPrioridadId] = useState<number | undefined>();
	const [solicitudId, setSolicitudId] = useState<number | undefined>();
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: tickets,
		isLoading,
		error,
	} = useTicketsQuery({
		sistemaId,
		faseId,
	});

	// Filtrado en memoria para campos no cubiertos directamente por backend params
	const filteredTickets = useMemo(() => {
		if (!tickets) return [];
		return tickets.filter((t) => {
			if (prioridadId && t.prioridadId !== prioridadId) return false;
			if (solicitudId && t.solicitudId !== solicitudId) return false;
			if (searchTerm.trim()) {
				const term = searchTerm.toLowerCase().trim();
				const matchFolio = t.folio.toLowerCase().includes(term);
				const matchTitulo = t.titulo.toLowerCase().includes(term);
				if (!matchFolio && !matchTitulo) return false;
			}
			return true;
		});
	}, [tickets, prioridadId, solicitudId, searchTerm]);

	const handleResetFilters = () => {
		setSistemaId(undefined);
		setFaseId(undefined);
		setPrioridadId(undefined);
		setSolicitudId(undefined);
		setSearchTerm("");
	};

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
							<TicketIcon className="h-5 w-5" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Tickets de Soporte
						</h1>
					</div>
					<p className="text-sm text-slate-400 mt-1">
						Ciclo operativo de 5 fases, asignaciones técnicas, bitácora y
						entrega-recepción.
					</p>
				</div>

				<div className="flex items-center gap-2.5 self-start sm:self-auto">
					{/* Selector de modo Cuadrícula / Tabla */}
					<div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							className={`p-1.5 rounded-md transition-colors ${
								viewMode === "grid"
									? "bg-indigo-600 text-white shadow"
									: "text-slate-400 hover:text-white"
							}`}
							title="Modo Cuadrícula"
						>
							<LayoutGrid className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => setViewMode("table")}
							className={`p-1.5 rounded-md transition-colors ${
								viewMode === "table"
									? "bg-indigo-600 text-white shadow"
									: "text-slate-400 hover:text-white"
							}`}
							title="Modo Tabla"
						>
							<TableIcon className="h-4 w-4" />
						</button>
					</div>

					<Can resource="tickets" action="create">
						<Button onClick={() => setIsCreateOpen(true)} className="gap-2">
							<Plus className="h-4 w-4" />
							Nuevo Ticket
						</Button>
					</Can>
				</div>
			</div>

			{/* Modal Crear Ticket */}
			<CreateTicketModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Barra de Filtros */}
			<TicketFilters
				sistemaId={sistemaId}
				faseId={faseId}
				prioridadId={prioridadId}
				solicitudId={solicitudId}
				searchTerm={searchTerm}
				onSistemaChange={setSistemaId}
				onFaseChange={setFaseId}
				onPrioridadChange={setPrioridadId}
				onSolicitudChange={setSolicitudId}
				onSearchChange={setSearchTerm}
				onReset={handleResetFilters}
			/>

			{/* Contenido / Estados de carga */}
			{isLoading && (
				<div className="p-12 text-center text-slate-400">
					Cargando tickets de soporte...
				</div>
			)}

			{error && (
				<div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl">
					Error al cargar los tickets de soporte.
				</div>
			)}

			{!isLoading && !error && filteredTickets.length === 0 && (
				<div className="p-12 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
					<TicketIcon className="h-10 w-10 mx-auto text-slate-600 mb-2" />
					<p className="font-semibold text-slate-300">
						No se encontraron tickets
					</p>
					<p className="text-xs text-slate-500 mt-1">
						Prueba modificando los filtros o registra un nuevo ticket.
					</p>
				</div>
			)}

			{!isLoading &&
				!error &&
				filteredTickets.length > 0 &&
				(viewMode === "table" ? (
					<TicketTableView tickets={filteredTickets} />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
						{filteredTickets.map((ticket) => (
							<Link
								key={ticket.id}
								to="/tickets/$ticketId"
								params={{ ticketId: String(ticket.id) }}
								className="group block"
							>
								<Card className="h-full border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-200">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-2">
											<div>
												<div className="flex items-center gap-2">
													<span className="font-mono text-xs text-indigo-400 font-semibold">
														{ticket.folio}
													</span>
													<span className="text-[11px] text-slate-500 flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{formatTimeAgo(ticket.registro)}
													</span>
												</div>
												<CardTitle className="text-base font-semibold text-white mt-1 group-hover:text-indigo-300 transition-colors">
													{ticket.titulo}
												</CardTitle>
											</div>
											<Badge variant={getFaseVariant(ticket.faseCodigo)}>
												{ticket.faseNombre || ticket.faseCodigo}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-3 text-xs">
										<p className="text-slate-300 line-clamp-2">
											{ticket.descripcion}
										</p>

										<div className="border-t border-slate-800 pt-3 space-y-1.5">
											<div className="flex items-center gap-1.5 text-slate-400">
												<Server className="h-3.5 w-3.5 text-indigo-400" />
												<span className="font-medium text-slate-200">
													{ticket.sistemaNombre}
												</span>
												<span className="text-slate-500">
													({ticket.areaNombre})
												</span>
											</div>
											<div className="flex items-center gap-1.5 text-slate-400">
												<User className="h-3.5 w-3.5 text-slate-500" />
												<span>
													Solicitante:{" "}
													<span className="text-slate-300">
														{ticket.usuarioNombre || "Usuario institucional"}
													</span>
												</span>
											</div>
										</div>

										<div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-500">
											<span className="text-slate-400">
												{ticket.atenciones?.length || 0} ciclo(s)
											</span>
											<span className="inline-flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform">
												Detalle operativo
												<ExternalLink className="h-3 w-3" />
											</span>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				))}
		</div>
	);
}
