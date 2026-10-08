import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSistemasQuery } from "../hooks/useSistemasQuery";
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
	Monitor,
	Users,
	ExternalLink,
	Shield,
	Plus,
	ArrowRight,
} from "lucide-react";
import { CreateSistemaModal } from "../components/CreateSistemaModal";

export function SistemasPage() {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const { data: sistemas, isLoading, error } = useSistemasQuery();

	if (isLoading) {
		return (
			<div className="p-12 text-center text-foreground-muted text-sm">
				Cargando sistemas institucionales...
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="danger" title="Error de carga">
				Error al cargar sistemas institucionales.
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Encabezado según la guía ANDROMEDA */}
			<PageHeader
				title="Sistemas Institucionales"
				description="Catálogo de software, vinculación de responsables y equipo técnico de desarrollo."
				actions={
					<Can resource="sistemas" action="create">
						<Button
							onClick={() => setIsCreateOpen(true)}
							className="gap-2"
							size="sm"
						>
							<Plus className="h-4 w-4" />
							Registrar Nuevo Sistema
						</Button>
					</Can>
				}
			/>

			{/* Modal Crear Sistema */}
			<CreateSistemaModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Grilla Informativa de Sistemas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{sistemas?.map((sistema) => (
					<Link
						key={sistema.id}
						to="/sistemas/$sistemaId"
						params={{ sistemaId: String(sistema.id) }}
						className="group block"
					>
						<Card className="h-full hover:border-strong transition-colors">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between gap-2">
									<div>
										<span className="font-mono text-xs text-primary font-semibold bg-primary-light px-2 py-0.5 rounded-control border border-primary-border">
											{sistema.clave}
										</span>
										<CardTitle className="text-base font-semibold text-foreground mt-1.5 group-hover:text-primary transition-colors">
											{sistema.nombre}
										</CardTitle>
									</div>
									<Badge
										variant={sistema.estadoId === 1 ? "success" : "neutral"}
									>
										{sistema.estadoNombre ||
											(sistema.estadoId === 1 ? "Activo" : "Inactivo")}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-xs">
								<p className="text-foreground-muted line-clamp-2">
									{sistema.descripcion}
								</p>

								<div className="border-t border-subtle pt-3 space-y-1.5">
									<div className="flex items-center justify-between text-foreground-muted">
										<span>Área responsable:</span>
										<span className="font-medium text-foreground">
											{sistema.areaNombre || `Área #${sistema.areaId}`}
										</span>
									</div>

									{sistema.url && (
										<div className="flex items-center justify-between text-foreground-muted">
											<span>Acceso Web:</span>
											<span className="text-primary flex items-center gap-1 font-medium">
												Disponible <ExternalLink className="h-3 w-3" />
											</span>
										</div>
									)}
								</div>

								<div className="border-t border-subtle pt-3 flex items-center justify-between text-foreground-muted">
									<div
										className="flex items-center gap-1.5"
										title="Responsables activos"
									>
										<Shield className="h-3.5 w-3.5 text-warning" />
										<span>
											{sistema.responsables?.filter((r) => !r.fin).length || 0}{" "}
											responsable(s)
										</span>
									</div>
									<div
										className="flex items-center gap-1.5"
										title="Desarrolladores asignados"
									>
										<Users className="h-3.5 w-3.5 text-primary" />
										<span>
											{sistema.desarrolladores?.filter((d) => !d.fin).length ||
												0}{" "}
											dev(s)
										</span>
									</div>
									<span className="text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium">
										Detalle <ArrowRight className="h-3 w-3" />
									</span>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}

				{sistemas?.length === 0 && (
					<div className="col-span-full">
						<EmptyState
							icon={<Monitor className="h-8 w-8" />}
							title="No hay sistemas institucionales registrados"
							description="Comienza registrando un sistema institucional en el catálogo."
						/>
					</div>
				)}
			</div>
		</div>
	);
}
