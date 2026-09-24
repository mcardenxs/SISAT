import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { catalogoApi } from "@/core/api/catalogoApi";
import { uploadApi } from "@/core/api/uploadApi";
import { useTicketMutations } from "../hooks/useTicketMutations";
import { toast } from "sonner";
import { UploadCloud, Paperclip } from "lucide-react";

interface UploadEvidenciaModalProps {
	isOpen: boolean;
	onClose: () => void;
	ticketId: number;
	atencionId?: number;
}

export function UploadEvidenciaModal({
	isOpen,
	onClose,
	ticketId,
	atencionId,
}: UploadEvidenciaModalProps) {
	const [claseId, setClaseId] = useState<number | "">("");
	const [nombre, setNombre] = useState("");
	const [ruta, setRuta] = useState("");
	const [formato, setFormato] = useState("png");
	const [tamano, setTamano] = useState<number>(1024);
	const [descripcion, setDescripcion] = useState("");
	const [isUploading, setIsUploading] = useState(false);

	const { createEvidenciaMutation } = useTicketMutations(ticketId);

	const { data: catalogos } = useQuery({
		queryKey: ["catalogos"],
		queryFn: catalogoApi.getAll,
		enabled: isOpen,
	});

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		try {
			const stored = await uploadApi.upload(file);
			setNombre(stored.nombreOriginal);
			setRuta(stored.ruta);
			setFormato(stored.formato);
			setTamano(stored.tamano);
			toast.success("Archivo subido con éxito al servidor");
		} catch {
			toast.error("Error al subir el archivo al servidor");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!claseId || !nombre.trim() || !ruta.trim()) return;

		await createEvidenciaMutation.mutateAsync({
			id: ticketId,
			data: {
				claseId: Number(claseId),
				nombre: nombre.trim(),
				ruta: ruta.trim(),
				formato: formato.toLowerCase().trim(),
				tamano,
				descripcion: descripcion.trim() || undefined,
				atencionId: atencionId || undefined,
			},
		});

		onClose();
		setNombre("");
		setRuta("");
		setDescripcion("");
		setClaseId("");
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Adjuntar Evidencia Técnica">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="evidencia-file-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Seleccionar Archivo (Captura, Log, Documento)
					</label>
					<div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/50">
						<input
							type="file"
							id="evidencia-file-input"
							onChange={handleFileSelect}
							disabled={isUploading}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
						<UploadCloud className="h-8 w-8 mx-auto text-indigo-400 mb-1.5" />
						<p className="text-xs text-slate-300 font-medium">
							{isUploading
								? "Cargando archivo..."
								: ruta
									? `Archivo cargado: ${nombre}`
									: "Haz click o arrastra un archivo aquí"}
						</p>
						<p className="text-[11px] text-slate-500 mt-1">
							JPG, PNG, WEBP o PDF hasta 15MB
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="evidencia-clase-select"
							className="block text-xs font-medium text-slate-300 mb-1.5"
						>
							Clase de Evidencia
						</label>
						<select
							id="evidencia-clase-select"
							value={claseId}
							onChange={(e) => setClaseId(Number(e.target.value))}
							required
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value="">Selecciona clase...</option>
							{catalogos?.clase.map((c) => (
								<option key={c.id} value={c.id}>
									{c.nombre} ({c.codigo})
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="evidencia-nombre-input"
							className="block text-xs font-medium text-slate-300 mb-1.5"
						>
							Nombre del Archivo
						</label>
						<Input
							id="evidencia-nombre-input"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							required
							placeholder="ej. screenshot_error_500.png"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="evidencia-ruta-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Ruta o URL del recurso
					</label>
					<Input
						id="evidencia-ruta-input"
						value={ruta}
						onChange={(e) => setRuta(e.target.value)}
						required
						placeholder="/uploads/archivo.png o URL"
					/>
				</div>

				<div>
					<label
						htmlFor="evidencia-desc-textarea"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Descripción u Observaciones (opcional)
					</label>
					<textarea
						id="evidencia-desc-textarea"
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						rows={2}
						placeholder="Contexto sobre lo que demuestra este archivo..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={createEvidenciaMutation.isPending || isUploading}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							createEvidenciaMutation.isPending ||
							isUploading ||
							!claseId ||
							!nombre.trim() ||
							!ruta.trim()
						}
						className="gap-2"
					>
						<Paperclip className="h-4 w-4" />
						{createEvidenciaMutation.isPending
							? "Guardando..."
							: "Guardar Evidencia"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
