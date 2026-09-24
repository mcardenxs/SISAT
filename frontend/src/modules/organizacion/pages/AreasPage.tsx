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
			<div className="p-12 text-center text-slate-400">
				Cargando áreas institucionales...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl">
				Error al cargar áreas institucionales.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
							<Building2 className="h-5 w-5" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Áreas Organizacionales
						</h1>
					</div>
					<p className="text-sm text-slate-400 mt-1">
						Departamentos, jefaturas y áreas institucionales vinculadas en
						SISAT.
					</p>
				</div>

				<Can resource="areas" action="create">
					<Button
						onClick={() => setIsCreateOpen(true)}
						className="gap-2 self-start sm:self-auto"
					>
						<Plus className="h-4 w-4" />
						Nueva Área Institucional
					</Button>
				</Can>
			</div>

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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{areas?.map((area) => {
					const countSistemas =
						sistemas?.filter((s) => s.areaId === area.id).length || 0;
					const countUsers =
						usersData?.data.filter((u) => u.areaId === area.id).length || 0;

					return (
						<Card
							key={area.id}
							className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors flex flex-col justify-between"
						>
							<div>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2.5">
											<div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
												<Building2 className="h-4 w-4" />
											</div>
											<CardTitle className="text-base font-semibold text-white">
												{area.nombre}
											</CardTitle>
										</div>
										<Badge
											variant={area.estadoId === 1 ? "success" : "default"}
										>
											{area.estadoNombre ||
												(area.estadoId === 1 ? "Activo" : "Inactivo")}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-4 text-xs text-slate-300">
									<p className="text-slate-400 line-clamp-2">
										{area.descripcion || "Sin descripción registrada."}
									</p>

									{/* Contadores requeridos */}
									<div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
										<div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
											<Monitor className="h-4 w-4 text-indigo-400" />
											<div>
												<span className="text-[10px] text-slate-500 uppercase block font-semibold">
													Sistemas
												</span>
												<span className="font-bold text-slate-200">
													{countSistemas} adscrito(s)
												</span>
											</div>
										</div>

										<div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
											<Users className="h-4 w-4 text-emerald-400" />
											<div>
												<span className="text-[10px] text-slate-500 uppercase block font-semibold">
													Personal
												</span>
												<span className="font-bold text-slate-200">
													{countUsers} usuario(s)
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</div>

							{/* Acciones de la Tarjeta */}
							<div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between">
								<span className="text-[10px] text-slate-500">
									Actualizado:{" "}
									{new Date(area.actualizacion).toLocaleDateString()}
								</span>

								<Can resource="areas" action="update">
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedArea(area)}
											className="h-7 px-2 text-indigo-400 hover:bg-indigo-950/20 text-xs"
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
													? "text-slate-400 hover:text-rose-400 hover:bg-rose-950/20"
													: "text-emerald-400 hover:bg-emerald-950/20"
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
					<div className="col-span-full p-12 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
						<Building2 className="h-8 w-8 mx-auto text-slate-600 mb-2" />
						No hay áreas institucionales registradas.
					</div>
				)}
			</div>
		</div>
	);
}
