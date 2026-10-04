import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/core/auth/store";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { ticketApi, type CreateTicketInput } from "../api/ticketApi";
import { sistemaApi } from "@/modules/sistemas/api/sistemaApi";
import { areaApi } from "@/modules/organizacion/api/areaApi";
import { catalogoApi } from "@/core/api/catalogoApi";
import { toast } from "sonner";

interface CreateTicketModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);

	const [formData, setFormData] = useState<CreateTicketInput>({
		sistemaId: 0,
		areaId: 0,
		prioridadId: 0,
		solicitudId: 0,
		titulo: "",
		descripcion: "",
	});

	const { data: sistemas } = useQuery({
		queryKey: ["sistemas"],
		queryFn: sistemaApi.getAll,
		enabled: isOpen,
	});

	// Filtrar para mostrar únicamente los sistemas donde el usuario actual es Responsable Activo
	const userSistemas = useMemo(() => {
		if (!sistemas || !user?.id) return [];
		return sistemas.filter((s) =>
			s.responsables?.some(
				(r) =>
					r.usuarioId === user.id &&
					!r.fin &&
					(r.estadoId === 1 || r.estadoNombre === "Activo"),
			),
		);
	}, [sistemas, user?.id]);

	// Auto-seleccionar si el usuario solo tiene un sistema asignado
	useEffect(() => {
		if (isOpen && userSistemas.length === 1 && formData.sistemaId === 0) {
			const unicoSistema = userSistemas[0];
			setFormData((prev) => ({
				...prev,
				sistemaId: unicoSistema.id,
				areaId: unicoSistema.areaId || prev.areaId,
			}));
		}
	}, [isOpen, userSistemas, formData.sistemaId]);

	const { data: areas } = useQuery({
		queryKey: ["areas"],
		queryFn: areaApi.getAll,
		enabled: isOpen,
	});

	const { data: catalogos } = useQuery({
		queryKey: ["catalogos"],
		queryFn: catalogoApi.getAll,
		enabled: isOpen,
	});

	const mutation = useMutation({
		mutationFn: ticketApi.create,
		onSuccess: (newTicket) => {
			toast.success(`Ticket ${newTicket.folio} creado exitosamente`);
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
			onClose();
			setFormData({
				sistemaId: 0,
				areaId: 0,
				prioridadId: 0,
				solicitudId: 0,
				titulo: "",
				descripcion: "",
			});
		},
		onError: (err: Error & { response?: { data?: { error?: string } } }) => {
			const msg =
				err.response?.data?.error || err.message || "Error al crear ticket";
			toast.error(msg);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.sistemaId ||
			!formData.areaId ||
			!formData.prioridadId ||
			!formData.solicitudId
		) {
			toast.error("Por favor complete todos los selectores");
			return;
		}
		mutation.mutate(formData);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Crear Nuevo Ticket de Soporte"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				{userSistemas.length === 0 && (
					<div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs leading-relaxed">
						⚠️ No tienes sistemas institucionales asignados como Responsable
						vigente. Según las normas de SISAT, solo los responsables asignados
						pueden registrar tickets.
					</div>
				)}

				<div>
					<label
						htmlFor="ticket-sistema-select"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
					>
						Sistema Institucional (Donde eres Responsable)
					</label>
					<select
						id="ticket-sistema-select"
						value={formData.sistemaId}
						onChange={(e) => {
							const sisId = Number(e.target.value);
							const sis = userSistemas.find((s) => s.id === sisId);
							setFormData((prev) => ({
								...prev,
								sistemaId: sisId,
								areaId: sis?.areaId || prev.areaId,
							}));
						}}
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						required
						disabled={userSistemas.length === 0}
					>
						<option value={0}>
							{userSistemas.length === 0
								? "Sin sistemas asignados"
								: "Seleccione un sistema..."}
						</option>
						{userSistemas.map((s) => (
							<option key={s.id} value={s.id}>
								{s.clave} - {s.nombre}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="ticket-area-select"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
					>
						Área Solicitante
					</label>
					<select
						id="ticket-area-select"
						value={formData.areaId}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								areaId: Number(e.target.value),
							}))
						}
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						required
					>
						<option value={0}>Seleccione un área...</option>
						{areas?.map((a) => (
							<option key={a.id} value={a.id}>
								{a.nombre}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="ticket-prioridad-select"
							className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
						>
							Prioridad
						</label>
						<select
							id="ticket-prioridad-select"
							value={formData.prioridadId}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									prioridadId: Number(e.target.value),
								}))
							}
							className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							required
						>
							<option value={0}>Prioridad...</option>
							{catalogos?.prioridad.map((p) => (
								<option key={p.id} value={p.id}>
									{p.nombre}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="ticket-solicitud-select"
							className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
						>
							Tipo de Solicitud
						</label>
						<select
							id="ticket-solicitud-select"
							value={formData.solicitudId}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									solicitudId: Number(e.target.value),
								}))
							}
							className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							required
						>
							<option value={0}>Solicitud...</option>
							{catalogos?.solicitud.map((s) => (
								<option key={s.id} value={s.id}>
									{s.nombre}
								</option>
							))}
						</select>
					</div>
				</div>

				<Input
					label="Título del Ticket"
					placeholder="Breve resumen del problema"
					value={formData.titulo}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, titulo: e.target.value }))
					}
					required
				/>

				<div className="space-y-1.5">
					<label
						htmlFor="ticket-descripcion-textarea"
						className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
					>
						Descripción Detallada
					</label>
					<textarea
						id="ticket-descripcion-textarea"
						rows={3}
						value={formData.descripcion}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, descripcion: e.target.value }))
						}
						placeholder="Describa el comportamiento observado, pasos para reproducir o solicitud..."
						className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						required
					/>
				</div>

				<div className="flex items-center justify-end gap-2 pt-2">
					<Button variant="ghost" onClick={onClose}>
						Cancelar
					</Button>
					<Button
						type="submit"
						isLoading={mutation.isPending}
						disabled={userSistemas.length === 0}
					>
						Registrar Ticket
					</Button>
				</div>
			</form>
		</Modal>
	);
}
