import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/core/components/ui/Input";
import { Button } from "@/core/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { catalogoApi } from "@/core/api/catalogoApi";
import { sistemaApi } from "@/modules/sistemas/api/sistemaApi";

interface TicketFiltersProps {
	sistemaId?: number;
	faseId?: number;
	prioridadId?: number;
	solicitudId?: number;
	searchTerm: string;
	onSistemaChange: (id?: number) => void;
	onFaseChange: (id?: number) => void;
	onPrioridadChange: (id?: number) => void;
	onSolicitudChange: (id?: number) => void;
	onSearchChange: (search: string) => void;
	onReset: () => void;
}

export function TicketFilters({
	sistemaId,
	faseId,
	prioridadId,
	solicitudId,
	searchTerm,
	onSistemaChange,
	onFaseChange,
	onPrioridadChange,
	onSolicitudChange,
	onSearchChange,
	onReset,
}: TicketFiltersProps) {
	const { data: catalogos } = useQuery({
		queryKey: ["catalogos"],
		queryFn: catalogoApi.getAll,
	});

	const { data: sistemas } = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
	});

	const hasActiveFilters =
		Boolean(sistemaId) ||
		Boolean(faseId) ||
		Boolean(prioridadId) ||
		Boolean(solicitudId) ||
		searchTerm.trim().length > 0;

	return (
		<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
			<div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
				<div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
					<Filter className="h-4 w-4 text-indigo-400" />
					Filtros de Búsqueda
				</div>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onReset}
						className="h-7 text-xs text-slate-400 hover:text-white"
					>
						<RotateCcw className="h-3 w-3 mr-1" />
						Limpiar Filtros
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
				{/* Buscador de Folio / Título */}
				<div className="relative">
					<Input
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Buscar por folio o título..."
						className="pl-8 text-xs"
					/>
					<Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
				</div>

				{/* Selector de Sistema */}
				<select
					value={sistemaId || ""}
					onChange={(e) =>
						onSistemaChange(e.target.value ? Number(e.target.value) : undefined)
					}
					aria-label="Filtrar por sistema institucional"
					className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<option value="">Todos los Sistemas</option>
					{sistemas?.map((s) => (
						<option key={s.id} value={s.id}>
							{s.nombre} ({s.clave})
						</option>
					))}
				</select>

				{/* Selector de Fase */}
				<select
					value={faseId || ""}
					onChange={(e) =>
						onFaseChange(e.target.value ? Number(e.target.value) : undefined)
					}
					aria-label="Filtrar por fase del ticket"
					className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<option value="">Todas las Fases</option>
					{catalogos?.fase.map((f) => (
						<option key={f.id} value={f.id}>
							{f.nombre}
						</option>
					))}
				</select>

				{/* Selector de Prioridad */}
				<select
					value={prioridadId || ""}
					onChange={(e) =>
						onPrioridadChange(
							e.target.value ? Number(e.target.value) : undefined,
						)
					}
					aria-label="Filtrar por prioridad"
					className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<option value="">Todas las Prioridades</option>
					{catalogos?.prioridad.map((p) => (
						<option key={p.id} value={p.id}>
							{p.nombre}
						</option>
					))}
				</select>

				{/* Selector de Tipo de Solicitud */}
				<select
					value={solicitudId || ""}
					onChange={(e) =>
						onSolicitudChange(
							e.target.value ? Number(e.target.value) : undefined,
						)
					}
					aria-label="Filtrar por tipo de solicitud"
					className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				>
					<option value="">Tipos de Solicitud</option>
					{catalogos?.solicitud.map((sol) => (
						<option key={sol.id} value={sol.id}>
							{sol.nombre}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
