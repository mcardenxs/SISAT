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
import { PageHeader } from "@/core/components/ui/PageHeader";
import { EmptyState } from "@/core/components/ui/EmptyState";
import { Alert } from "@/core/components/ui/Alert";
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
				return "info" as const;
			case "CARGADA":
				return "success" as const;
			default:
				return "neutral" as const;
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
			{/* Encabezado según la guía ANDROMEDA */}
			<PageHeader
				title="Actas de Entrega-Recepción"
				description="Agrupación semanal de atenciones técnicas (periodo de 7 días naturales) para validación y firma."
				actions={
					<Can resource="actas" action="create">
						<Button
							onClick={() => setIsCreateOpen(true)}
							className="gap-2"
							size="sm"
						>
							<Plus className="h-4 w-4" />
							Generar Acta Semanal
						</Button>
					</Can>
				}
			/>

			<CreateActaModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Filtros */}
			<div className="rounded-surface border border-subtle bg-surface p-4 space-y-3 shadow-surface">
				<div className="flex items-center justify-between border-b border-subtle pb-2.5">
					<span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
						<Filter className="h-3.5 w-3.5 text-primary" />
						Filtros de Actas
					</span>
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleResetFilters}
							className="h-6 text-xs text-foreground-muted hover:text-foreground"
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
						className="w-full rounded-control border border-border-strong bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-surface"
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
						className="w-full rounded-control border border-border-strong bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-surface"
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
						className="w-full rounded-control border border-border-strong bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-surface"
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
				<div className="p-12 text-center text-foreground-muted text-sm">
					Cargando actas de entrega-recepción...
				</div>
			)}

			{error && (
				<Alert variant="danger" title="Error de carga">
					Error al cargar actas de entrega-recepción.
				</Alert>
			)}

			{!isLoading && !error && actas && actas.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{actas.map((acta) => (
						<Link
							key={acta.id}
							to="/actas/$actaId"
							params={{ actaId: String(acta.id) }}
							className="group block"
						>
							<Card className="h-full hover:border-strong transition-colors">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<div>
											<span className="font-mono text-xs text-primary font-semibold bg-primary-light px-2 py-0.5 rounded-control border border-primary-border">
												{acta.folio}
											</span>
											<CardTitle className="text-base font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
												{acta.sistemaNombre}
											</CardTitle>
										</div>
										<Badge variant={getSituacionVariant(acta.situacionCodigo)}>
											{acta.situacionNombre || acta.situacionCodigo}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3 text-xs">
									<div className="flex items-center gap-1.5 text-foreground-muted">
										<Building className="h-3.5 w-3.5 text-foreground-subtle" />
										<span>
											Área:{" "}
											<span className="text-foreground">{acta.areaNombre}</span>
										</span>
									</div>

									<div className="flex items-center gap-1.5 text-foreground-muted">
										<User className="h-3.5 w-3.5 text-foreground-subtle" />
										<span>
											Firmante:{" "}
											<span className="text-foreground">
												{acta.firmanteNombre}
											</span>
										</span>
									</div>

									<div className="border-t border-subtle pt-3 flex items-center justify-between text-[11px] text-foreground-muted">
										<div className="flex items-center gap-1">
											<Calendar className="h-3 w-3 text-primary" />
											<span>
												{acta.inicio} al {acta.fin}
											</span>
										</div>
										<div className="flex items-center gap-1 text-success font-medium">
											<CheckCircle2 className="h-3 w-3" />
											<span>{acta.inclusiones?.length || 0} ticket(s)</span>
										</div>
									</div>

									<div className="pt-1 flex items-center justify-end text-[11px] text-primary group-hover:translate-x-0.5 transition-transform font-medium">
										Ver acta y firmas <ArrowRight className="h-3 w-3 ml-1" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}

			{!isLoading && !error && actas?.length === 0 && (
				<EmptyState
					icon={<FileText className="h-8 w-8" />}
					title="No hay actas registradas"
					description="Genera una nueva acta semanal agrupando atenciones concluidas."
				/>
			)}
		</div>
	);
}
