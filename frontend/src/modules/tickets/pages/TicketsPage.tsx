import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTicketsQuery } from "../hooks/useTicketsQuery";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/core/components/ui/Card";
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
	Download,
} from "lucide-react";
import { toast } from "sonner";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { TicketFilters } from "../components/TicketFilters";
import { TicketTableView, formatTimeAgo } from "../components/TicketTableView";
import {
	getFaseDisplay,
	getPrioridadDisplay,
	getSolicitudDisplay,
	type TicketDisplayMeta,
} from "../utils/ticketDisplay";

function TicketCardMetaIcon({
	category,
	label,
	meta,
}: {
	category: string;
	label: string;
	meta: TicketDisplayMeta;
}) {
	const Icon = meta.icon;
	const fullLabel = `${category}: ${label}`;

	return (
		<div className="relative group/icon shrink-0" title={fullLabel}>
			<span
				className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-transform group-hover/icon:scale-105 ${meta.iconContainerClass}`}
			>
				<Icon className="h-3.5 w-3.5" aria-hidden="true" />
				<span className="sr-only">{fullLabel}</span>
			</span>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-full top-1/2 z-20 mr-2 -translate-y-1/2 whitespace-nowrap rounded-control border border-subtle bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground shadow-overlay opacity-0 transition-opacity group-hover/icon:opacity-100"
			>
				{fullLabel}
			</span>
		</div>
	);
}

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

	const handleExportCSV = () => {
		if (filteredTickets.length === 0) {
			toast.info("No hay tickets para exportar con los filtros actuales");
			return;
		}

		const headers = [
			"Folio",
			"Título",
			"Sistema",
			"Área",
			"Solicitante",
			"Prioridad",
			"Tipo de Solicitud",
			"Fase Operativa",
			"Estado Documental",
			"Fecha de Registro",
		];

		const rows = filteredTickets.map((t) => [
			`"${t.folio.replace(/"/g, '""')}"`,
			`"${t.titulo.replace(/"/g, '""')}"`,
			`"${(t.sistemaNombre || "").replace(/"/g, '""')}"`,
			`"${(t.areaNombre || "").replace(/"/g, '""')}"`,
			`"${(t.usuarioNombre || "").replace(/"/g, '""')}"`,
			`"${(t.prioridadNombre || "").replace(/"/g, '""')}"`,
			`"${(t.solicitudNombre || "").replace(/"/g, '""')}"`,
			`"${(t.faseNombre || "").replace(/"/g, '""')}"`,
			`"${(t.constanciaNombre || "").replace(/"/g, '""')}"`,
			`"${new Date(t.registro).toLocaleString("es-MX")}"`,
		]);

		const csvContent =
			"\uFEFF" +
			[headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`SISAT_Tickets_${new Date().toISOString().slice(0, 10)}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success(
			`Reporte exportado exitosamente (${filteredTickets.length} tickets)`,
		);
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

						<Button
							variant="secondary"
							onClick={handleExportCSV}
							className="gap-2"
							size="sm"
							title="Exportar listado a CSV"
						>
							<Download className="h-4 w-4" />
							Exportar
						</Button>

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
						{filteredTickets.map((ticket) => {
							const faseDisplay = getFaseDisplay(ticket.faseCodigo);
							const faseLabel =
								ticket.faseNombre || ticket.faseCodigo || faseDisplay.label;

							const prioridadDisplay = getPrioridadDisplay(
								ticket.prioridadCodigo,
							);
							const prioridadLabel =
								ticket.prioridadNombre ||
								ticket.prioridadCodigo ||
								prioridadDisplay.label;

							const solicitudDisplay = getSolicitudDisplay(
								ticket.solicitudCodigo,
							);
							const solicitudLabel =
								ticket.solicitudNombre ||
								ticket.solicitudCodigo ||
								solicitudDisplay.label;

							return (
								<Link
									key={ticket.id}
									to="/tickets/$ticketId"
									params={{ ticketId: String(ticket.id) }}
									className="group block h-full"
								>
									<Card className="h-full flex flex-col hover:border-strong transition-colors">
										<CardHeader className="pb-2 shrink-0">
											<div className="flex items-start justify-between gap-3">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 h-7 min-w-0">
														<span className="font-mono text-xs text-primary font-semibold truncate">
															{ticket.folio}
														</span>
														<span className="text-[11px] text-foreground-subtle flex items-center gap-1 shrink-0">
															<Clock className="h-3 w-3" />
															{formatTimeAgo(ticket.registro)}
														</span>
													</div>
													<CardTitle
														title={ticket.titulo}
														className="text-base font-semibold text-foreground leading-6 h-12 line-clamp-2 mt-2 group-hover:text-primary transition-colors"
													>
														{ticket.titulo}
													</CardTitle>
												</div>

												<div className="flex flex-col items-center gap-1.5 shrink-0">
													<TicketCardMetaIcon
														category="Fase"
														label={faseLabel}
														meta={faseDisplay}
													/>
													<TicketCardMetaIcon
														category="Prioridad"
														label={prioridadLabel}
														meta={prioridadDisplay}
													/>
													<TicketCardMetaIcon
														category="Solicitud"
														label={solicitudLabel}
														meta={solicitudDisplay}
													/>
												</div>
											</div>
										</CardHeader>
										<CardContent className="flex-1 flex flex-col text-xs">
											<p
												title={ticket.descripcion}
												className="text-foreground-muted leading-5 h-10 line-clamp-2 mb-3"
											>
												{ticket.descripcion}
											</p>

											<div className="border-t border-subtle pt-3 space-y-2">
												<div
													className="h-8 flex items-start gap-1.5 text-foreground-muted"
													title={`${ticket.sistemaNombre} (${ticket.areaNombre})`}
												>
													<Server className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
													<span className="line-clamp-2 leading-4">
														<span className="font-medium text-foreground">
															{ticket.sistemaNombre}
														</span>{" "}
														<span className="text-foreground-subtle">
															({ticket.areaNombre})
														</span>
													</span>
												</div>
												<div className="h-5 flex items-center gap-1.5 text-foreground-muted min-w-0">
													<User className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
													<span
														className="truncate"
														title={`Solicitante: ${ticket.usuarioNombre || "Usuario institucional"}`}
													>
														Solicitante:{" "}
														<span className="text-foreground">
															{ticket.usuarioNombre || "Usuario institucional"}
														</span>
													</span>
												</div>
											</div>

											<div className="border-t border-subtle pt-3 mt-3 flex items-center justify-between gap-2 text-[11px] leading-4 text-foreground-subtle">
												<span className="whitespace-nowrap">
													{ticket.atenciones?.length || 0} ciclo(s)
												</span>
												<span className="inline-flex items-center gap-1 whitespace-nowrap text-primary group-hover:translate-x-0.5 transition-transform font-medium">
													Detalle operativo
													<ExternalLink className="h-3 w-3 shrink-0" />
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				))}
		</div>
	);
}
