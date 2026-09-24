import { useState, useEffect } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/modules/organizacion/api/areaApi";
import { useSistemaMutations } from "../hooks/useSistemaMutations";
import type { Sistema } from "../api/sistemaApi";
import { Edit3 } from "lucide-react";

interface EditSistemaModalProps {
	isOpen: boolean;
	onClose: () => void;
	sistema: Sistema;
}

export function EditSistemaModal({
	isOpen,
	onClose,
	sistema,
}: EditSistemaModalProps) {
	const [clave, setClave] = useState(sistema.clave);
	const [nombre, setNombre] = useState(sistema.nombre);
	const [descripcion, setDescripcion] = useState(sistema.descripcion);
	const [areaId, setAreaId] = useState<number>(sistema.areaId);
	const [url, setUrl] = useState(sistema.url || "");
	const [observacion, setObservacion] = useState(sistema.observacion || "");
	const [estadoId, setEstadoId] = useState<number>(sistema.estadoId);

	useEffect(() => {
		if (sistema) {
			setClave(sistema.clave);
			setNombre(sistema.nombre);
			setDescripcion(sistema.descripcion);
			setAreaId(sistema.areaId);
			setUrl(sistema.url || "");
			setObservacion(sistema.observacion || "");
			setEstadoId(sistema.estadoId);
		}
	}, [sistema]);

	const { updateSistemaMutation } = useSistemaMutations(sistema.id);

	const { data: areas } = useQuery({
		queryKey: ["areas"],
		queryFn: areaApi.getAll,
		enabled: isOpen,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateSistemaMutation.mutateAsync({
			id: sistema.id,
			data: {
				clave: clave.toUpperCase().trim(),
				nombre: nombre.trim(),
				descripcion: descripcion.trim(),
				areaId,
				url: url.trim() || null,
				observacion: observacion.trim() || null,
				estadoId,
			},
		});
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Editar Datos del Sistema">
			<form onSubmit={handleSubmit} className="space-y-3.5">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div>
						<label
							htmlFor="edit-sistema-clave-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Clave
						</label>
						<Input
							id="edit-sistema-clave-input"
							value={clave}
							onChange={(e) => setClave(e.target.value)}
							required
							className="font-mono uppercase"
						/>
					</div>

					<div className="sm:col-span-2">
						<label
							htmlFor="edit-sistema-nombre-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Nombre Oficial
						</label>
						<Input
							id="edit-sistema-nombre-input"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="edit-sistema-area-select"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Área Dueña
						</label>
						<select
							id="edit-sistema-area-select"
							value={areaId}
							onChange={(e) => setAreaId(Number(e.target.value))}
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							{areas?.map((a) => (
								<option key={a.id} value={a.id}>
									{a.nombre}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="edit-sistema-estado-select"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Estado Operativo
						</label>
						<select
							id="edit-sistema-estado-select"
							value={estadoId}
							onChange={(e) => setEstadoId(Number(e.target.value))}
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value={1}>Activo</option>
							<option value={2}>Inactivo / En Mantenimiento</option>
						</select>
					</div>
				</div>

				<div>
					<label
						htmlFor="edit-sistema-url-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						URL de Acceso
					</label>
					<Input
						id="edit-sistema-url-input"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://..."
					/>
				</div>

				<div>
					<label
						htmlFor="edit-sistema-descripcion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Descripción
					</label>
					<textarea
						id="edit-sistema-descripcion-textarea"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						rows={2}
						required
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div>
					<label
						htmlFor="edit-sistema-observacion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Observaciones
					</label>
					<textarea
						id="edit-sistema-observacion-textarea"
						value={observacion}
						onChange={(e) => setObservacion(e.target.value)}
						rows={2}
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={updateSistemaMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={updateSistemaMutation.isPending}
						className="gap-2"
					>
						<Edit3 className="h-4 w-4" />
						{updateSistemaMutation.isPending
							? "Guardando..."
							: "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
