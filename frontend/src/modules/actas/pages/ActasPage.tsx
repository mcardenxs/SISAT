import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { actaApi } from "../api/actaApi";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/core/components/ui/Card";
import { Badge } from "@/core/components/ui/Badge";
import { Button } from "@/core/components/ui/Button";
import {
	FileText,
	Calendar,
	CheckCircle2,
	User,
	Building,
	Plus,
} from "lucide-react";
import { CreateActaModal } from "../components/CreateActaModal";

export function ActasPage() {
	const {
		data: actas,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["actas"],
		queryFn: () => actaApi.getAll(),
	});

	const getSituacionVariant = (codigo?: string) => {
		switch (codigo) {
			case "GENERADA":
				return "warning";
			case "EN_FIRMA":
				return "info";
			case "CARGADA":
				return "success";
			default:
				return "default";
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 text-center text-slate-400">
				Cargando actas de entrega-recepción...
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-rose-400">
				Error al cargar actas.
			</div>
		);
	}

	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
						Actas de Entrega-Recepción
					</h1>
					<p className="text-sm text-slate-400 mt-1">
						Agrupación semanal de soporte técnico para validación y firma por
						jefaturas de área.
					</p>
				</div>
				<Button
					onClick={() => setIsCreateOpen(true)}
					className="gap-2 self-start sm:self-auto"
				>
					<Plus className="h-4 w-4" />
					Generar Acta
				</Button>
			</div>

			<CreateActaModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{actas?.map((acta) => (
					<Card
						key={acta.id}
						className="border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-2">
								<div>
									<span className="font-mono text-xs text-indigo-400 font-semibold">
										{acta.folio}
									</span>
									<CardTitle className="text-base font-semibold text-white mt-0.5">
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
									<span className="text-slate-300">{acta.firmanteNombre}</span>
								</span>
							</div>

							<div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
								<div className="flex items-center gap-1">
									<Calendar className="h-3 w-3 text-indigo-400" />
									<span>
										{acta.inicio} al {acta.fin}
									</span>
								</div>
								<div className="flex items-center gap-1 text-emerald-400">
									<CheckCircle2 className="h-3 w-3" />
									<span>{acta.inclusiones?.length || 0} ticket(s)</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}

				{actas?.length === 0 && (
					<div className="col-span-full p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400">
						<FileText className="h-8 w-8 mx-auto text-slate-600 mb-2" />
						No hay actas semanales registradas.
					</div>
				)}
			</div>
		</div>
	);
}
