import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useAreaMutations } from "../hooks/useAreaMutations";
import { Building2 } from "lucide-react";

interface CreateAreaModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateAreaModal({ isOpen, onClose }: CreateAreaModalProps) {
	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");

	const { createAreaMutation } = useAreaMutations();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!nombre.trim()) return;

		await createAreaMutation.mutateAsync({
			nombre: nombre.trim(),
			descripcion: descripcion.trim() || undefined,
			estadoId: 1,
		});

		onClose();
		setNombre("");
		setDescripcion("");
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Nueva Área Institucional">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="area-nombre-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Nombre del Área / Departamento *
					</label>
					<Input
						id="area-nombre-input"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						required
						placeholder="ej. Dirección de Finanzas y Presupuesto"
					/>
				</div>

				<div>
					<label
						htmlFor="area-descripcion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Descripción u Objetivo Operativo
					</label>
					<textarea
						id="area-descripcion-textarea"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						rows={3}
						placeholder="Funciones clave del área dentro de la institución..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={createAreaMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={createAreaMutation.isPending || !nombre.trim()}
						className="gap-2"
					>
						<Building2 className="h-4 w-4" />
						{createAreaMutation.isPending ? "Guardando..." : "Crear Área"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
