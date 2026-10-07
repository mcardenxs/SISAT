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
import { PageHeader } from "@/core/components/ui/PageHeader";
import { EmptyState } from "@/core/components/ui/EmptyState";
import { Alert } from "@/core/components/ui/Alert";
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
			{/* Encabezado con PageHeader según el sistema de diseño */}
			<PageHeader
				title="Tickets de Soporte"
				description="Ciclo operativo de 5 fases, asignaciones técnicas, bitácora y entrega-recepción."
				actions={
					<div className="flex items-center gap-2.5">
						<div className="flex items-center rounded-control border border-subtle bg-surface p-0.5 shadow-surface">
							<button
								type="button"
								onClick={() => setViewMode("grid")}
								className={`p-1.5 rounded-control transition-colors cursor-pointer ${
									viewMode === "grid"
										? "bg-primary text-white"
										: "text-foreground-muted hover:text-foreground"
								}`}
								title="Modo Cuadrícula"
								aria-label="Modo Cuadrícula"
							>
								<LayoutGrid className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setViewMode("table")}
								className={`p-1.5 rounded-control transition-colors cursor-pointer ${
									viewMode === "table"
										? "bg-primary text-white"
										: "text-foreground-muted hover:text-foreground"
								}`}
								title="Modo Tabla"
								aria-label="Modo Tabla"
							>
								<TableIcon className="h-4 w-4" />
							</button>
						</div>

						<Can resource="tickets" action="create">
							<Button
								onClick={() => setIsCreateOpen(true)}
								className="gap-2"
								size="sm"
							>
								<Plus className="h-4 w-4" />
								Nuevo Ticket
							</Button>
						</Can>
					</div>
				}
			/>

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
				<div className="p-12 text-center text-foreground-muted text-sm">
					Cargando tickets de soporte...
				</div>
			)}

			{error && (
				<Alert variant="danger" title="Error de carga">
					No se pudieron cargar los tickets de soporte. Por favor intenta
					nuevamente.
				</Alert>
			)}

			{!isLoading && !error && filteredTickets.length === 0 && (
				<EmptyState
					icon={<TicketIcon className="h-10 w-10" />}
					title="No se encontraron tickets"
					description="Prueba modificando los filtros o registra un nuevo ticket de incidencia."
					action={
						<Can resource="tickets" action="create">
							<Button
								size="sm"
								onClick={() => setIsCreateOpen(true)}
								className="gap-2"
							>
								<Plus className="h-4 w-4" />
								Registrar Ticket
							</Button>
						</Can>
					}
				/>
			)}

			{!isLoading &&
				!error &&
				filteredTickets.length > 0 &&
				(viewMode === "table" ? (
					<TicketTableView tickets={filteredTickets} />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredTickets.map((ticket) => (
							<Link
								key={ticket.id}
								to="/tickets/$ticketId"
								params={{ ticketId: String(ticket.id) }}
								className="group block"
							>
								<Card className="h-full hover:border-strong transition-colors">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-2">
											<div>
												<div className="flex items-center gap-2">
													<span className="font-mono text-xs text-primary font-semibold">
														{ticket.folio}
													</span>
													<span className="text-[11px] text-foreground-subtle flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{formatTimeAgo(ticket.registro)}
													</span>
												</div>
												<CardTitle className="text-base font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
													{ticket.titulo}
												</CardTitle>
											</div>
											<Badge variant={getFaseVariant(ticket.faseCodigo)}>
												{ticket.faseNombre || ticket.faseCodigo}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-3 text-xs">
										<p className="text-foreground-muted line-clamp-2">
											{ticket.descripcion}
										</p>

										<div className="border-t border-subtle pt-3 space-y-1.5">
											<div className="flex items-center gap-1.5 text-foreground-muted">
												<Server className="h-3.5 w-3.5 text-primary" />
												<span className="font-medium text-foreground">
													{ticket.sistemaNombre}
												</span>
												<span className="text-foreground-subtle">
													({ticket.areaNombre})
												</span>
											</div>
											<div className="flex items-center gap-1.5 text-foreground-muted">
												<User className="h-3.5 w-3.5 text-foreground-subtle" />
												<span>
													Solicitante:{" "}
													<span className="text-foreground">
														{ticket.usuarioNombre || "Usuario institucional"}
													</span>
												</span>
											</div>
										</div>

										<div className="border-t border-subtle pt-3 flex items-center justify-between text-[11px] text-foreground-subtle">
											<span>{ticket.atenciones?.length || 0} ciclo(s)</span>
											<span className="inline-flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition-transform font-medium">
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
