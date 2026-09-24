import { useState, useEffect } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useAreaMutations } from "../hooks/useAreaMutations";
import type { Area } from "../api/areaApi";
import { Edit3 } from "lucide-react";

interface EditAreaModalProps {
	isOpen: boolean;
	onClose: () => void;
	area: Area;
}

export function EditAreaModal({ isOpen, onClose, area }: EditAreaModalProps) {
	const [nombre, setNombre] = useState(area.nombre);
	const [descripcion, setDescripcion] = useState(area.descripcion || "");
	const [estadoId, setEstadoId] = useState<number>(area.estadoId);

	useEffect(() => {
		if (area) {
			setNombre(area.nombre);
			setDescripcion(area.descripcion || "");
			setEstadoId(area.estadoId);
		}
	}, [area]);

	const { updateAreaMutation } = useAreaMutations();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!nombre.trim()) return;

		await updateAreaMutation.mutateAsync({
			id: area.id,
			data: {
				nombre: nombre.trim(),
				descripcion: descripcion.trim() || undefined,
				estadoId,
			},
		});

		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Editar Área Institucional">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="edit-area-nombre-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Nombre del Área *
					</label>
					<Input
						id="edit-area-nombre-input"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="edit-area-estado-select"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Estado
					</label>
					<select
						id="edit-area-estado-select"
						value={estadoId}
						onChange={(e) => setEstadoId(Number(e.target.value))}
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value={1}>Activo</option>
						<option value={2}>Inactivo</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="edit-area-descripcion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Descripción
					</label>
					<textarea
						id="edit-area-descripcion-textarea"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						rows={3}
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={updateAreaMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={updateAreaMutation.isPending || !nombre.trim()}
						className="gap-2"
					>
						<Edit3 className="h-4 w-4" />
						{updateAreaMutation.isPending ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
