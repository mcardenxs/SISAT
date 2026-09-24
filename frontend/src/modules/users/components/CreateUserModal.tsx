import { useState } from "react";
import { Modal } from "@/core/components/ui/Modal";
import { Button } from "@/core/components/ui/Button";
import { Input } from "@/core/components/ui/Input";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/modules/organizacion/api/areaApi";
import { catalogoApi } from "@/core/api/catalogoApi";
import { useUserMutations } from "../hooks/useUserMutations";
import { UserPlus } from "lucide-react";

interface CreateUserModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
	const [name, setName] = useState("");
	const [apellido, setApellido] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [areaId, setAreaId] = useState<number | "">("");
	const [puesto, setPuesto] = useState("");
	const [role, setRole] = useState("CONSULTA");

	const { createUserMutation } = useUserMutations();

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
		if (!email.trim() || !password) return;

		await createUserMutation.mutateAsync({
			name: name.trim() || undefined,
			apellido: apellido.trim() || undefined,
			email: email.trim().toLowerCase(),
			password,
			areaId: areaId ? Number(areaId) : undefined,
			puesto: puesto.trim() || undefined,
			role: role || undefined,
			roles: role ? [role] : undefined,
		});

		onClose();
		setName("");
		setApellido("");
		setEmail("");
		setPassword("");
		setAreaId("");
		setPuesto("");
		setRole("CONSULTA");
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Usuario">
			<form onSubmit={handleSubmit} className="space-y-3.5">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="create-user-name-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Nombre
						</label>
						<Input
							id="create-user-name-input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							placeholder="ej. Carlos"
						/>
					</div>
					<div>
						<label
							htmlFor="create-user-apellido-input"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Apellido
						</label>
						<Input
							id="create-user-apellido-input"
							value={apellido}
							onChange={(e) => setApellido(e.target.value)}
							placeholder="ej. Gómez"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="create-user-email-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Correo Electrónico *
					</label>
					<Input
						id="create-user-email-input"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						placeholder="usuario@institucion.gob.mx"
					/>
				</div>

				<div>
					<label
						htmlFor="create-user-password-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Contraseña Temporal * (mínimo 12 caracteres, mayúscula, minúscula,
						número y símbolo)
					</label>
					<Input
						id="create-user-password-input"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={12}
						placeholder="ej. SISAT_admin2026!"
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label
							htmlFor="create-user-area-select"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Área de Adscripción
						</label>
						<select
							id="create-user-area-select"
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
							htmlFor="create-user-role-select"
							className="block text-xs font-medium text-slate-300 mb-1"
						>
							Rol Asignado *
						</label>
						<select
							id="create-user-role-select"
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

				<div>
					<label
						htmlFor="create-user-puesto-input"
						className="block text-xs font-medium text-slate-300 mb-1"
					>
						Puesto / Cargo Institucional
					</label>
					<Input
						id="create-user-puesto-input"
						value={puesto}
						onChange={(e) => setPuesto(e.target.value)}
						placeholder="ej. Analista de Sistemas Senior"
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						disabled={createUserMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							createUserMutation.isPending || !email.trim() || !password
						}
						className="gap-2"
					>
						<UserPlus className="h-4 w-4" />
						{createUserMutation.isPending ? "Guardando..." : "Crear Usuario"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
