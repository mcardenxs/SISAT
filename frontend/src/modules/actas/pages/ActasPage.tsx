import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useActasQuery } from "../hooks/useActasQuery";
import { useQuery } from "@tanstack/react-query";
import { catalogoApi } from "@/core/api/catalogoApi";
import { sistemaApi } from "@/modules/sistemas/api/sistemaApi";
import { areaApi } from "@/modules/organizacion/api/areaApi";
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
	FileText,
	Calendar,
	CheckCircle2,
	User,
	Building,
	Plus,
	ArrowRight,
	Filter,
	RotateCcw,
} from "lucide-react";
import { CreateActaModal } from "../components/CreateActaModal";

export function ActasPage() {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [sistemaId, setSistemaId] = useState<number | undefined>();
	const [areaId, setAreaId] = useState<number | undefined>();
	const [situacionId, setSituacionId] = useState<number | undefined>();

	const {
		data: actas,
		isLoading,
		error,
	} = useActasQuery({
		sistemaId,
		areaId,
		situacionId,
	});

	const { data: catalogos } = useQuery({
		queryKey: ["catalogos"],
		queryFn: catalogoApi.getAll,
	});

	const { data: sistemas } = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
	});

	const { data: areas } = useQuery({
		queryKey: ["areas"],
		queryFn: areaApi.getAll,
	});

	const getSituacionVariant = (codigo?: string) => {
		switch (codigo) {
			case "GENERADA":
				return "warning" as const;
			case "EN_FIRMA":
				return "purple" as const;
			case "CARGADA":
				return "success" as const;
			default:
				return "default" as const;
		}
	};

	const hasActiveFilters = Boolean(sistemaId || areaId || situacionId);

	const handleResetFilters = () => {
		setSistemaId(undefined);
		setAreaId(undefined);
		setSituacionId(undefined);
	};

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
							<FileText className="h-5 w-5" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Actas de Entrega-Recepción
						</h1>
					</div>
					<p className="text-sm text-slate-400 mt-1">
						Agrupación semanal de atenciones técnicas (periodo de 7 días
						naturales) para validación y firma.
					</p>
				</div>

				<Can resource="actas" action="create">
					<Button
						onClick={() => setIsCreateOpen(true)}
						className="gap-2 self-start sm:self-auto"
					>
						<Plus className="h-4 w-4" />
						Generar Acta Semanal
					</Button>
				</Can>
			</div>

			<CreateActaModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Filtros */}
			<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
				<div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
					<span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
						<Filter className="h-3.5 w-3.5 text-indigo-400" />
						Filtros de Actas
					</span>
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleResetFilters}
							className="h-6 text-xs text-slate-400 hover:text-white"
						>
							<RotateCcw className="h-3 w-3 mr-1" />
							Limpiar
						</Button>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<select
						value={sistemaId || ""}
						onChange={(e) =>
							setSistemaId(e.target.value ? Number(e.target.value) : undefined)
						}
						aria-label="Filtrar actas por sistema"
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">Todos los Sistemas</option>
						{sistemas?.map((s) => (
							<option key={s.id} value={s.id}>
								{s.nombre} ({s.clave})
							</option>
						))}
					</select>

					<select
						value={areaId || ""}
						onChange={(e) =>
							setAreaId(e.target.value ? Number(e.target.value) : undefined)
						}
						aria-label="Filtrar actas por área"
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">Todas las Áreas</option>
						{areas?.map((a) => (
							<option key={a.id} value={a.id}>
								{a.nombre}
							</option>
						))}
					</select>

					<select
						value={situacionId || ""}
						onChange={(e) =>
							setSituacionId(
								e.target.value ? Number(e.target.value) : undefined,
							)
						}
						aria-label="Filtrar actas por situación o estado de firma"
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">Todas las Situaciones</option>
						{catalogos?.situacion.map((sit) => (
							<option key={sit.id} value={sit.id}>
								{sit.nombre}
							</option>
						))}
					</select>
				</div>
			</div>

			{isLoading && (
				<div className="p-12 text-center text-slate-400">
					Cargando actas de entrega-recepción...
				</div>
			)}

			{error && (
				<div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl">
					Error al cargar actas.
				</div>
			)}

			{!isLoading && !error && actas && actas.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{actas.map((acta) => (
						<Link
							key={acta.id}
							to="/actas/$actaId"
							params={{ actaId: String(acta.id) }}
							className="group block"
						>
							<Card className="h-full border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-200">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<div>
											<span className="font-mono text-xs text-indigo-400 font-semibold bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
												{acta.folio}
											</span>
											<CardTitle className="text-base font-semibold text-white mt-1 group-hover:text-indigo-300 transition-colors">
												{acta.sistemaNombre}
											</CardTitle>
										</div>
										<Badge variant={getSituacionVariant(acta.situacionCodigo)}>
											{acta.situacionNombre || acta.situacionCodigo}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3 text-xs">
									<div className="flex items-center gap-1.5 text-slate-400">
										<Building className="h-3.5 w-3.5 text-slate-500" />
										<span>
											Área:{" "}
											<span className="text-slate-300">{acta.areaNombre}</span>
										</span>
									</div>

									<div className="flex items-center gap-1.5 text-slate-400">
										<User className="h-3.5 w-3.5 text-slate-500" />
										<span>
											Firmante:{" "}
											<span className="text-slate-300">
												{acta.firmanteNombre}
											</span>
										</span>
									</div>

									<div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
										<div className="flex items-center gap-1">
											<Calendar className="h-3 w-3 text-indigo-400" />
											<span>
												{acta.inicio} al {acta.fin}
											</span>
										</div>
										<div className="flex items-center gap-1 text-emerald-400 font-medium">
											<CheckCircle2 className="h-3 w-3" />
											<span>{acta.inclusiones?.length || 0} ticket(s)</span>
										</div>
									</div>

									<div className="pt-1 flex items-center justify-end text-[11px] text-indigo-400 group-hover:translate-x-0.5 transition-transform">
										Ver acta y firmas <ArrowRight className="h-3 w-3 ml-1" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}

			{!isLoading && !error && actas?.length === 0 && (
				<div className="p-12 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
					<FileText className="h-8 w-8 mx-auto text-slate-600 mb-2" />
					<p className="font-semibold text-slate-300">
						No hay actas registradas
					</p>
					<p className="text-xs text-slate-500 mt-1">
						Genera una nueva acta semanal agrupando atenciones concluidas.
					</p>
				</div>
			)}
		</div>
	);
}
