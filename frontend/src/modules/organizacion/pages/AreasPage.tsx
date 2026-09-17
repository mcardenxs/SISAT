import { useQuery } from "@tanstack/react-query";
import { areaApi } from "../api/areaApi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/core/components/ui/Card";
import { Badge } from "@/core/components/ui/Badge";
import { Building2 } from "lucide-react";

export function AreasPage() {
	const {
		data: areas,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["areas"],
		queryFn: areaApi.getAll,
	});

	if (isLoading) {
		return (
			<div className="p-8 text-center text-slate-400">
				Cargando áreas institucionales...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-rose-400">
				Error al cargar áreas institucionales.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
						Áreas Institucionales
					</h1>
					<p className="text-sm text-slate-400 mt-1">
						Departamentos y áreas organizacionales registradas en el SISAT.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{areas?.map((area) => (
					<Card
						key={area.id}
						className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-center gap-2">
									<div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
										<Building2 className="h-4 w-4" />
									</div>
									<CardTitle className="text-base font-semibold text-white">
										{area.nombre}
									</CardTitle>
								</div>
								<Badge variant={area.estadoId === 1 ? "success" : "default"}>
									{area.estadoNombre ||
										(area.estadoId === 1 ? "Activo" : "Inactivo")}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-2 text-xs text-slate-300">
							<p className="text-slate-400 line-clamp-2">
								{area.descripcion || "Sin descripción registrada."}
							</p>
							<div className="pt-2 text-[11px] text-slate-500">
								Última actualización:{" "}
								{new Date(area.actualizacion).toLocaleDateString()}
							</div>
						</CardContent>
					</Card>
				))}

				{areas?.length === 0 && (
					<div className="col-span-full p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
						<Building2 className="h-8 w-8 mx-auto text-slate-600 mb-2" />
						No hay áreas institucionales registradas.
					</div>
				)}
			</div>
		</div>
	);
}
