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
			<div className="p-12 text-center text-slate-400">
				Cargando sistemas institucionales...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl">
				Error al cargar sistemas institucionales.
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
							<Monitor className="h-5 w-5" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Sistemas Institucionales
						</h1>
					</div>
					<p className="text-sm text-slate-400 mt-1">
						Catálogo de software, vinculación de responsables y equipo técnico
						de desarrollo.
					</p>
				</div>

				<Can resource="sistemas" action="create">
					<Button
						onClick={() => setIsCreateOpen(true)}
						className="gap-2 self-start sm:self-auto"
					>
						<Plus className="h-4 w-4" />
						Registrar Nuevo Sistema
					</Button>
				</Can>
			</div>

			{/* Modal Crear Sistema */}
			<CreateSistemaModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			{/* Grilla Informativa de Sistemas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{sistemas?.map((sistema) => (
					<Link
						key={sistema.id}
						to="/sistemas/$sistemaId"
						params={{ sistemaId: String(sistema.id) }}
						className="group block"
					>
						<Card className="h-full border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-200">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between gap-2">
									<div>
										<span className="font-mono text-xs text-indigo-400 font-semibold bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20">
											{sistema.clave}
										</span>
										<CardTitle className="text-lg font-semibold text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
											{sistema.nombre}
										</CardTitle>
									</div>
									<Badge
										variant={sistema.estadoId === 1 ? "success" : "default"}
									>
										{sistema.estadoNombre ||
											(sistema.estadoId === 1 ? "Activo" : "Inactivo")}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-xs">
								<p className="text-slate-300 line-clamp-2">
									{sistema.descripcion}
								</p>

								<div className="border-t border-slate-800 pt-3 space-y-1.5">
									<div className="flex items-center justify-between text-slate-400">
										<span>Área responsable:</span>
										<span className="font-medium text-slate-200">
											{sistema.areaNombre || `Área #${sistema.areaId}`}
										</span>
									</div>

									{sistema.url && (
										<div className="flex items-center justify-between text-slate-400">
											<span>Acceso Web:</span>
											<span className="text-indigo-400 flex items-center gap-1">
												Disponible <ExternalLink className="h-3 w-3" />
											</span>
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
											{sistema.responsables?.filter((r) => !r.fin).length || 0}{" "}
											responsable(s)
										</span>
									</div>
									<div
										className="flex items-center gap-1.5"
										title="Desarrolladores asignados"
									>
										<Users className="h-3.5 w-3.5 text-indigo-400" />
										<span>
											{sistema.desarrolladores?.filter((d) => !d.fin).length ||
												0}{" "}
											dev(s)
										</span>
									</div>
									<span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
										Detalle <ArrowRight className="h-3 w-3" />
									</span>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}

				{sistemas?.length === 0 && (
					<div className="col-span-full p-12 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
						<Monitor className="h-8 w-8 mx-auto text-slate-600 mb-2" />
						No hay sistemas institucionales registrados.
					</div>
				)}
			</div>
		</div>
	);
}
