import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "../api/areaApi";
import type { Area } from "../api/areaApi";
import { sistemaApi } from "@/modules/sistemas/api/sistemaApi";
import { usersApi } from "@/modules/users/api/usersApi";
import { useAreaMutations } from "../hooks/useAreaMutations";
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
import { Building2, Plus, Monitor, Users, Edit3, Power } from "lucide-react";
import { CreateAreaModal } from "../components/CreateAreaModal";
import { EditAreaModal } from "../components/EditAreaModal";

export function AreasPage() {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [selectedArea, setSelectedArea] = useState<Area | null>(null);

	const {
		data: areas,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["areas"],
		queryFn: areaApi.getAll,
	});

	const { data: sistemas } = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
	});

	const { data: usersData } = useQuery({
		queryKey: ["allUsersForAreas"],
		queryFn: () => usersApi.getUsers({ limit: 100 }),
	});

	const { updateAreaMutation } = useAreaMutations();

	const handleToggleStatus = async (area: Area) => {
		const newEstado = area.estadoId === 1 ? 2 : 1;
		await updateAreaMutation.mutateAsync({
			id: area.id,
			data: { estadoId: newEstado },
		});
	};

	if (isLoading) {
		return (
			<div className="p-12 text-center text-foreground-muted text-sm">
				Cargando áreas institucionales...
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="danger" title="Error de carga">
				Error al cargar áreas institucionales.
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Encabezado según la guía ANDROMEDA */}
			<PageHeader
				title="Áreas Organizacionales"
				description="Departamentos, jefaturas y áreas institucionales vinculadas en SISAT."
				actions={
					<Can resource="areas" action="create">
						<Button
							onClick={() => setIsCreateOpen(true)}
							className="gap-2"
							size="sm"
						>
							<Plus className="h-4 w-4" />
							Nueva Área Institucional
						</Button>
					</Can>
				}
			/>

			{/* Modal Alta de Área */}
			<CreateAreaModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Modal Edición de Área */}
			{selectedArea && (
				<EditAreaModal
					isOpen={Boolean(selectedArea)}
					onClose={() => setSelectedArea(null)}
					area={selectedArea}
				/>
			)}

			{/* Grilla de Tarjetas de Área */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{areas?.map((area) => {
					const countSistemas =
						sistemas?.filter((s) => s.areaId === area.id).length || 0;
					const countUsers =
						usersData?.data.filter((u) => u.areaId === area.id).length || 0;

					return (
						<Card
							key={area.id}
							className="hover:border-strong transition-colors flex flex-col justify-between"
						>
							<div>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2.5">
											<div className="p-2 rounded-control bg-primary-light text-primary">
												<Building2 className="h-4 w-4" />
											</div>
											<CardTitle className="text-base font-semibold text-foreground">
												{area.nombre}
											</CardTitle>
										</div>
										<Badge
											variant={area.estadoId === 1 ? "success" : "neutral"}
										>
											{area.estadoNombre ||
												(area.estadoId === 1 ? "Activo" : "Inactivo")}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-4 text-xs text-foreground-muted">
									<p className="line-clamp-2">
										{area.descripcion || "Sin descripción registrada."}
									</p>

									{/* Contadores */}
									<div className="grid grid-cols-2 gap-2 pt-2 border-t border-subtle">
										<div className="flex items-center gap-2 bg-surface-subtle p-2.5 rounded-control border border-subtle">
											<Monitor className="h-4 w-4 text-primary" />
											<div>
												<span className="text-[10px] text-foreground-subtle uppercase block font-semibold">
													Sistemas
												</span>
												<span className="font-semibold text-foreground">
													{countSistemas} adscrito(s)
												</span>
											</div>
										</div>

										<div className="flex items-center gap-2 bg-surface-subtle p-2.5 rounded-control border border-subtle">
											<Users className="h-4 w-4 text-success" />
											<div>
												<span className="text-[10px] text-foreground-subtle uppercase block font-semibold">
													Personal
												</span>
												<span className="font-semibold text-foreground">
													{countUsers} usuario(s)
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</div>

							{/* Acciones de la Tarjeta */}
							<div className="px-6 py-3 border-t border-subtle bg-surface-subtle/40 flex items-center justify-between">
								<span className="text-[10px] text-foreground-subtle">
									Actualizado:{" "}
									{new Date(area.actualizacion).toLocaleDateString()}
								</span>

								<Can resource="areas" action="update">
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedArea(area)}
											className="h-7 px-2 text-primary hover:bg-surface-muted text-xs"
											title="Editar área"
										>
											<Edit3 className="h-3.5 w-3.5 mr-1" />
											Editar
										</Button>

										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleToggleStatus(area)}
											disabled={updateAreaMutation.isPending}
											className={`h-7 px-2 text-xs ${
												area.estadoId === 1
													? "text-foreground-muted hover:text-danger hover:bg-danger-subtle"
													: "text-success hover:bg-success-subtle"
											}`}
											title={area.estadoId === 1 ? "Desactivar" : "Activar"}
										>
											<Power className="h-3.5 w-3.5 mr-1" />
											{area.estadoId === 1 ? "Baja" : "Activar"}
										</Button>
									</div>
								</Can>
							</div>
						</Card>
					);
				})}

				{areas?.length === 0 && (
					<div className="col-span-full">
						<EmptyState
							icon={<Building2 className="h-8 w-8" />}
							title="No hay áreas institucionales registradas"
							description="Crea la primera área institucional para organizar sistemas y personal."
						/>
					</div>
				)}
			</div>
		</div>
	);
}
