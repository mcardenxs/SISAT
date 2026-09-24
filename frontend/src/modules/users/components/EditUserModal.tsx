import { useState, useEffect } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/modules/organizacion/api/areaApi";
import { catalogoApi } from "@/core/api/catalogoApi";
import { useUserMutations } from "../hooks/useUserMutations";
import type { User } from "@/core/auth/types";
import { Edit3 } from "lucide-react";

interface EditUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: User;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
	const [name, setName] = useState(user.name);
	const [apellido, setApellido] = useState(user.apellido || "");
	const [email, setEmail] = useState(user.email);
	const [password, setPassword] = useState("");
	const [areaId, setAreaId] = useState<number | "">(user.areaId || "");
	const [puesto, setPuesto] = useState(user.puesto || "");
	const [role, setRole] = useState(user.role || "CONSULTA");
	const [isActive, setIsActive] = useState(user.isActive);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setApellido(user.apellido || "");
			setEmail(user.email);
			setPassword("");
			setAreaId(user.areaId || "");
			setPuesto(user.puesto || "");
			setRole(user.role || "CONSULTA");
			setIsActive(user.isActive);
		}
	}, [user]);

	const { updateUserMutation } = useUserMutations();

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateUserMutation.mutateAsync({
			id: user.id,
			data: {
				name: name.trim() || undefined,
				apellido: apellido.trim() || undefined,
				email: email.trim().toLowerCase() || undefined,
				password: password.trim() ? password : undefined,
				areaId: areaId ? Number(areaId) : undefined,
				puesto: puesto.trim() || undefined,
				role: role || undefined,
				roles: role ? [role] : undefined,
				isActive,
			},
		});

		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
			<form onSubmit={handleSubmit} className="space-y-3.5">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="edit-user-name-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Nombre
						</label>
						<Input
							id="edit-user-name-input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="edit-user-apellido-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Apellido
						</label>
						<Input
							id="edit-user-apellido-input"
							value={apellido}
							onChange={(e) => setApellido(e.target.value)}
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="edit-user-email-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Correo Electrónico
					</label>
					<Input
						id="edit-user-email-input"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="edit-user-password-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Actualizar Contraseña (dejar en blanco para conservar actual)
					</label>
					<Input
						id="edit-user-password-input"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Solo si deseas cambiar la contraseña..."
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="edit-user-area-select"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Área
						</label>
						<select
							id="edit-user-area-select"
							value={areaId}
							onChange={(e) => setAreaId(Number(e.target.value))}
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<option value="">Sin área específica</option>
							{areas?.map((a) => (
								<option key={a.id} value={a.id}>
									{a.nombre}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="edit-user-role-select"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Rol Asignado
						</label>
						<select
							id="edit-user-role-select"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							{catalogos?.rol ? (
								catalogos.rol.map((r) => (
									<option key={r.id} value={r.codigo}>
										{r.nombre}
									</option>
								))
							) : (
								<>
									<option value="ADMINISTRADOR">ADMINISTRADOR</option>
									<option value="RESPONSABLE_DE_SISTEMA">
										RESPONSABLE_DE_SISTEMA
									</option>
									<option value="DESARROLLADOR">DESARROLLADOR</option>
									<option value="JEFE_DE_AREA">JEFE_DE_AREA</option>
									<option value="CONSULTA">CONSULTA</option>
								</>
							)}
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
					<div>
						<label
							htmlFor="edit-user-puesto-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Puesto
						</label>
						<Input
							id="edit-user-puesto-input"
							value={puesto}
							onChange={(e) => setPuesto(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2 pt-4">
						<input
							type="checkbox"
							id="editUserActive"
							checked={isActive}
							onChange={(e) => setIsActive(e.target.checked)}
							className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="editUserActive" className="text-xs text-slate-300">
							Usuario Activo en el Sistema
						</label>
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={updateUserMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={updateUserMutation.isPending}
						className="gap-2"
					>
						<Edit3 className="h-4 w-4" />
						{updateUserMutation.isPending ? "Guardando..." : "Guardar Cambios"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
