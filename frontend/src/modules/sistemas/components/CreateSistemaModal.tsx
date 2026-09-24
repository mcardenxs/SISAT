import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/modules/organizacion/api/areaApi";
import { useSistemaMutations } from "../hooks/useSistemaMutations";
import { Monitor } from "lucide-react";

interface CreateSistemaModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateSistemaModal({
	isOpen,
	onClose,
}: CreateSistemaModalProps) {
	const [clave, setClave] = useState("");
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [areaId, setAreaId] = useState<number | "">("");
	const [url, setUrl] = useState("");
	const [observacion, setObservacion] = useState("");

	const { createSistemaMutation } = useSistemaMutations();

	const { data: areas, isLoading: isLoadingAreas } = useQuery({
		queryKey: ["areas"],
		queryFn: areaApi.getAll,
		enabled: isOpen,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!clave.trim() || !nombre.trim() || !descripcion.trim() || !areaId)
			return;

		await createSistemaMutation.mutateAsync({
			clave: clave.toUpperCase().trim(),
			nombre: nombre.trim(),
			descripcion: descripcion.trim(),
			areaId: Number(areaId),
			url: url.trim() || undefined,
			observacion: observacion.trim() || undefined,
		});

		onClose();
		setClave("");
		setNombre("");
		setDescripcion("");
		setAreaId("");
		setUrl("");
		setObservacion("");
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Registrar Nuevo Sistema">
			<form onSubmit={handleSubmit} className="space-y-3.5">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div>
						<label
							htmlFor="sistema-clave-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Clave Única *
						</label>
						<Input
							id="sistema-clave-input"
							value={clave}
							onChange={(e) => setClave(e.target.value)}
							required
							placeholder="ej. SIS-FIN"
							className="font-mono uppercase"
						/>
					</div>

					<div className="sm:col-span-2">
						<label
							htmlFor="sistema-nombre-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Nombre Oficial *
						</label>
						<Input
							id="sistema-nombre-input"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							required
							placeholder="ej. Sistema Institucional de Finanzas"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="sistema-area-select"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Área Responsable / Dueña *
					</label>
					<select
						id="sistema-area-select"
						value={areaId}
						onChange={(e) => setAreaId(Number(e.target.value))}
						required
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="">
							{isLoadingAreas ? "Cargando áreas..." : "Selecciona un área..."}
						</option>
						{areas?.map((a) => (
							<option key={a.id} value={a.id}>
								{a.nombre}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="sistema-url-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						URL de Acceso (opcional)
					</label>
					<Input
						id="sistema-url-input"
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://sistema.institucion.gob.mx"
					/>
				</div>

				<div>
					<label
						htmlFor="sistema-descripcion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Descripción Operativa *
					</label>
					<textarea
						id="sistema-descripcion-textarea"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						rows={2}
						required
						placeholder="Propósito, módulos principales y usuarios objetivo..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div>
					<label
						htmlFor="sistema-observacion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Observaciones Técnicas (opcional)
					</label>
					<textarea
						id="sistema-observacion-textarea"
						value={observacion}
						onChange={(e) => setObservacion(e.target.value)}
						rows={2}
						placeholder="Infraestructura, base de datos, repositorios..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={createSistemaMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							createSistemaMutation.isPending ||
							!clave.trim() ||
							!nombre.trim() ||
							!descripcion.trim() ||
							!areaId
						}
						className="gap-2"
					>
						<Monitor className="h-4 w-4" />
						{createSistemaMutation.isPending
							? "Registrando..."
							: "Guardar Sistema"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
