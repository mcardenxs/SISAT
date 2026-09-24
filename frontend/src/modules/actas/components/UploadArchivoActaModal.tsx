import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { catalogoApi } from "@/core/api/catalogoApi";
import { uploadApi } from "@/core/api/uploadApi";
import { useActaMutations } from "../hooks/useActaMutations";
import { toast } from "sonner";
import { UploadCloud, FileText } from "lucide-react";

interface UploadArchivoActaModalProps {
	isOpen: boolean;
	onClose: () => void;
	actaId: number;
}

export function UploadArchivoActaModal({
	isOpen,
	onClose,
	actaId,
}: UploadArchivoActaModalProps) {
	const [claseId, setClaseId] = useState<number | "">("");
	const [nombre, setNombre] = useState("");
	const [ruta, setRuta] = useState("");
	const [formato, setFormato] = useState<
		"pdf" | "jpg" | "jpeg" | "png" | "webp"
	>("pdf");
	const [tamano, setTamano] = useState<number>(1024);
	const [observacion, setObservacion] = useState("");
	const [isUploading, setIsUploading] = useState(false);

	const { uploadArchivoMutation } = useActaMutations(actaId);

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
			const fmt = stored.formato.toLowerCase();
			if (["pdf", "jpg", "jpeg", "png", "webp"].includes(fmt)) {
				setFormato(fmt as "pdf" | "jpg" | "jpeg" | "png" | "webp");
			} else {
				setFormato("pdf");
			}
			setTamano(stored.tamano);
			toast.success("Archivo cargado al servidor");
		} catch {
			toast.error("Error al subir el archivo");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!claseId || !nombre.trim() || !ruta.trim()) return;

		await uploadArchivoMutation.mutateAsync({
			id: actaId,
			data: {
				claseId: Number(claseId),
				nombre: nombre.trim(),
				ruta: ruta.trim(),
				formato,
				tamano,
				observacion: observacion.trim() || undefined,
			},
		});

		onClose();
		setNombre("");
		setRuta("");
		setObservacion("");
		setClaseId("");
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Subir Documento o Acta Firmada"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="acta-file-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Seleccionar Documento Oficial (PDF / Imagen escaneada)
					</label>
					<div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/50">
						<input
							id="acta-file-input"
							type="file"
							accept=".pdf,.png,.jpg,.jpeg,.webp"
							onChange={handleFileSelect}
							disabled={isUploading}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
						<UploadCloud className="h-8 w-8 mx-auto text-indigo-400 mb-1.5" />
						<p className="text-xs text-slate-300 font-medium">
							{isUploading
								? "Cargando archivo al servidor..."
								: ruta
									? `Archivo cargado: ${nombre}`
									: "Haz click o arrastra el PDF firmado aquí"}
						</p>
						<p className="text-[11px] text-slate-500 mt-1">
							PDF o imágenes escaneadas hasta 15MB
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="acta-clase-select"
							className="block text-xs font-medium text-slate-300 mb-1.5"
						>
							Tipo / Clase de Documento *
						</label>
						<select
							id="acta-clase-select"
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
							htmlFor="acta-doc-nombre-input"
							className="block text-xs font-medium text-slate-300 mb-1.5"
						>
							Nombre del Archivo
						</label>
						<Input
							id="acta-doc-nombre-input"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							required
							placeholder="ej. Acta_Entrega_Semana_12.pdf"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="acta-doc-ruta-input"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Ruta del Archivo
					</label>
					<Input
						id="acta-doc-ruta-input"
						value={ruta}
						onChange={(e) => setRuta(e.target.value)}
						required
						placeholder="/uploads/archivo.pdf"
					/>
				</div>

				<div>
					<label
						htmlFor="acta-doc-observacion-textarea"
						className="block text-xs font-medium text-slate-300 mb-1.5"
					>
						Observaciones (opcional)
					</label>
					<textarea
						id="acta-doc-observacion-textarea"
						value={observacion}
						onChange={(e) => setObservacion(e.target.value)}
						rows={2}
						placeholder="Notas sobre sellos, firmas autógrafas o anexos técnicos..."
						className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={uploadArchivoMutation.isPending || isUploading}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							uploadArchivoMutation.isPending ||
							isUploading ||
							!claseId ||
							!nombre.trim() ||
							!ruta.trim()
						}
						className="gap-2"
					>
						<FileText className="h-4 w-4" />
						{uploadArchivoMutation.isPending
							? "Guardando..."
							: "Vincular al Acta"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
