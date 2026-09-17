import { useQuery } from "@tanstack/react-query";
import { sistemaApi } from "../api/sistemaApi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/core/components/ui/Card";
import { Badge } from "@/core/components/ui/Badge";
import { Monitor, Users, ExternalLink, Shield } from "lucide-react";

export function SistemasPage() {
	const {
		data: sistemas,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
	});

	if (isLoading) {
		return (
			<div className="p-8 text-center text-slate-400">
				Cargando sistemas institucionales...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-rose-400">
				Error al cargar sistemas institucionales.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
						Sistemas Institucionales
					</h1>
					<p className="text-sm text-slate-400 mt-1">
						Catálogo de sistemas registrados, responsables asignados y equipos
						de desarrollo.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{sistemas?.map((sistema) => (
					<Card
						key={sistema.id}
						className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div>
									<span className="font-mono text-xs text-indigo-400 font-semibold">
										{sistema.clave}
									</span>
									<CardTitle className="text-lg font-semibold text-white mt-0.5">
										{sistema.nombre}
									</CardTitle>
								</div>
								<Badge variant={sistema.estadoId === 1 ? "success" : "default"}>
									{sistema.estadoNombre ||
										(sistema.estadoId === 1 ? "Activo" : "Inactivo")}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4 text-xs">
							<p className="text-slate-300 line-clamp-2">
								{sistema.descripcion}
							</p>

							<div className="border-t border-slate-800 pt-3 space-y-2">
								<div className="flex items-center justify-between text-slate-400">
									<span>Área responsable:</span>
									<span className="font-medium text-slate-200">
										{sistema.areaNombre || `Área #${sistema.areaId}`}
									</span>
								</div>

								{sistema.url && (
									<div className="flex items-center justify-between text-slate-400">
										<span>Acceso Web:</span>
										<a
											href={sistema.url}
											target="_blank"
											rel="noreferrer"
											className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
										>
											Abrir <ExternalLink className="h-3 w-3" />
										</a>
									</div>
								)}
							</div>

							<div className="border-t border-slate-800 pt-3 flex items-center justify-between text-slate-400">
								<div
									className="flex items-center gap-1.5"
									title="Responsables activos"
								>
									<Shield className="h-3.5 w-3.5 text-amber-400" />
									<span>
										{sistema.responsables?.length || 0} responsable(s)
									</span>
								</div>
								<div
									className="flex items-center gap-1.5"
									title="Desarrolladores asignados"
								>
									<Users className="h-3.5 w-3.5 text-indigo-400" />
									<span>{sistema.desarrolladores?.length || 0} dev(s)</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}

				{sistemas?.length === 0 && (
					<div className="col-span-full p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
						<Monitor className="h-8 w-8 mx-auto text-slate-600 mb-2" />
						No hay sistemas institucionales registrados.
					</div>
				)}
			</div>
		</div>
	);
}
